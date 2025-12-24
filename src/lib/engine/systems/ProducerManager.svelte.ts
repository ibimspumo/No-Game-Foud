/**
 * @fileoverview Producer Manager for the game engine.
 * Manages all producers (buildings), purchases, and production integration.
 *
 * Uses Svelte 5 Runes ($state, $derived) for reactive state management.
 *
 * @module engine/systems/ProducerManager
 */

import {
	Decimal,
	D,
	ZERO,
	ONE,
	calculateExponentialCost,
	calculateBulkCost,
	calculateMaxAffordable,
	type DecimalSource
} from '../utils/decimal';
import type { EventManager } from '../core/EventManager';
import type { ResourceManager } from './ResourceManager.svelte';
import { ProductionPipeline, type MultiplierSource } from './ProductionPipeline';
import type { Manager } from '../models/types';
import {
	PRODUCER_DEFINITIONS,
	type ProducerDefinition,
	type ProducerState,
	type ProducerCategory,
	ProducerId
} from '../models/producers';

/**
 * Internal producer state with reactive updates.
 */
interface InternalProducerState extends ProducerState {
	/** Definition reference */
	definition: ProducerDefinition;
}

/**
 * Serializable format for saving producer state.
 */
interface SerializedProducers {
	/** Producer levels */
	levels: Record<string, number>;
	/** Unlocked producers */
	unlocked: string[];
	/** Total produced per producer */
	totalProduced: Record<string, string>;
	/** First purchase times */
	firstPurchaseTimes: Record<string, number>;
}

/**
 * Producer Manager class.
 *
 * Manages all game producers including:
 * - Purchase logic with exponential costs
 * - Production rate calculations
 * - Integration with ProductionPipeline
 * - Unlock conditions
 *
 * @example
 * ```typescript
 * const producers = new ProducerManager(events, resources);
 * producers.init();
 *
 * // Buy a producer
 * if (producers.canAfford('pixel_generator')) {
 *   producers.buy('pixel_generator');
 * }
 *
 * // Get production info
 * const rate = producers.getProduction('pixel_generator');
 * ```
 */
export class ProducerManager implements Manager {
	/**
	 * Event manager for publishing events.
	 */
	private events: EventManager;

	/**
	 * Resource manager for cost/production.
	 */
	private resources: ResourceManager;

	/**
	 * Production pipeline for multipliers.
	 */
	private pipeline: ProductionPipeline;

	/**
	 * Internal state for all producers.
	 */
	private state = $state<Record<string, InternalProducerState>>({});

	/**
	 * Current game phase.
	 */
	private currentPhase = $state(1);

	/**
	 * Derived: All unlocked producer IDs.
	 */
	unlockedProducers = $derived(
		Object.entries(this.state)
			.filter(([_, s]) => s.unlocked)
			.map(([id]) => id)
	);

	/**
	 * Derived: Total production rate from all producers.
	 */
	totalPixelProduction = $derived(
		Object.values(this.state)
			.filter(s => s.unlocked && s.definition.producesResource === 'pixels')
			.reduce((sum, s) => sum.add(s.currentProduction), ZERO)
	);

	/**
	 * Creates a new ProducerManager.
	 *
	 * @param events - Event manager
	 * @param resources - Resource manager
	 */
	constructor(events: EventManager, resources: ResourceManager) {
		this.events = events;
		this.resources = resources;
		this.pipeline = new ProductionPipeline();
	}

	/**
	 * Initialize the producer manager.
	 */
	init(): void {
		// Initialize state for all defined producers
		for (const def of Object.values(PRODUCER_DEFINITIONS)) {
			this.state[def.id] = {
				level: 0,
				unlocked: !def.hidden && def.minPhase <= this.currentPhase,
				currentProduction: ZERO,
				nextCost: D(def.baseCost),
				totalProduced: ZERO,
				firstPurchaseTime: null,
				definition: def
			};
		}

		// Ensure basic producers are unlocked
		this.unlockBasicProducers();
	}

	/**
	 * Update producers on each tick.
	 *
	 * @param deltaTime - Time since last tick in seconds
	 */
	tick(deltaTime: number): void {
		// Update production for all producers
		for (const [id, producerState] of Object.entries(this.state)) {
			if (!producerState.unlocked || producerState.level === 0) continue;

			const def = producerState.definition;
			if (def.baseProduction <= 0) continue;

			// Calculate production with pipeline multipliers
			const baseProduction = D(def.baseProduction).mul(producerState.level);
			const production = this.pipeline.calculate(def.producesResource, baseProduction);
			producerState.currentProduction = production;

			// Add to resource
			const produced = production.mul(deltaTime);
			if (produced.gt(0)) {
				this.resources.add(def.producesResource, produced);
				producerState.totalProduced = producerState.totalProduced.add(produced);
			}
		}

		// Check unlock conditions
		this.checkUnlockConditions();
	}

	/**
	 * Reset for a new run (rebirth).
	 */
	reset(): void {
		for (const [id, def] of Object.entries(PRODUCER_DEFINITIONS)) {
			this.state[id] = {
				level: 0,
				unlocked: !def.hidden && def.minPhase <= 1,
				currentProduction: ZERO,
				nextCost: D(def.baseCost),
				totalProduced: ZERO,
				firstPurchaseTime: null,
				definition: def
			};
		}

		this.pipeline.clear();
		this.currentPhase = 1;
		this.unlockBasicProducers();
	}

	/**
	 * Serialize state for saving.
	 */
	serialize(): SerializedProducers {
		const levels: Record<string, number> = {};
		const unlocked: string[] = [];
		const totalProduced: Record<string, string> = {};
		const firstPurchaseTimes: Record<string, number> = {};

		for (const [id, producerState] of Object.entries(this.state)) {
			if (producerState.level > 0) {
				levels[id] = producerState.level;
			}
			if (producerState.unlocked) {
				unlocked.push(id);
			}
			if (producerState.totalProduced.gt(0)) {
				totalProduced[id] = producerState.totalProduced.toString();
			}
			if (producerState.firstPurchaseTime !== null) {
				firstPurchaseTimes[id] = producerState.firstPurchaseTime;
			}
		}

		return { levels, unlocked, totalProduced, firstPurchaseTimes };
	}

	/**
	 * Deserialize and restore state from save.
	 *
	 * @param data - Previously serialized state
	 */
	deserialize(data: unknown): void {
		const saved = data as SerializedProducers;
		if (!saved || typeof saved !== 'object') return;

		// Restore levels and recalculate costs
		if (saved.levels) {
			for (const [id, level] of Object.entries(saved.levels)) {
				if (this.state[id]) {
					this.state[id].level = level;
					this.recalculateCost(id);
					this.updateProducerMultiplier(id);
				}
			}
		}

		// Restore unlocked state
		if (saved.unlocked) {
			for (const id of saved.unlocked) {
				if (this.state[id]) {
					this.state[id].unlocked = true;
				}
			}
		}

		// Restore statistics
		if (saved.totalProduced) {
			for (const [id, value] of Object.entries(saved.totalProduced)) {
				if (this.state[id]) {
					this.state[id].totalProduced = D(value);
				}
			}
		}

		if (saved.firstPurchaseTimes) {
			for (const [id, time] of Object.entries(saved.firstPurchaseTimes)) {
				if (this.state[id]) {
					this.state[id].firstPurchaseTime = time;
				}
			}
		}

		// Recalculate all productions
		this.recalculateAllProductions();
	}

	// ============================================================================
	// Purchase Operations
	// ============================================================================

	/**
	 * Check if a producer can be purchased.
	 *
	 * @param id - Producer ID
	 * @param amount - Amount to buy (default 1)
	 * @returns Whether the purchase is possible
	 */
	canAfford(id: string, amount: number = 1): boolean {
		const producerState = this.state[id];
		if (!producerState || !producerState.unlocked) return false;

		const def = producerState.definition;
		if (def.maxLevel > 0 && producerState.level + amount > def.maxLevel) {
			return false;
		}

		const cost = this.calculateCost(id, amount);
		return this.resources.canAfford(def.costResource, cost);
	}

	/**
	 * Calculate the cost for buying a producer.
	 *
	 * @param id - Producer ID
	 * @param amount - Amount to buy (default 1)
	 * @returns Total cost
	 */
	calculateCost(id: string, amount: number = 1): Decimal {
		const producerState = this.state[id];
		if (!producerState) return ZERO;

		const def = producerState.definition;
		if (amount === 1) {
			return calculateExponentialCost(
				def.baseCost,
				def.costMultiplier,
				producerState.level
			);
		}

		return calculateBulkCost(
			def.baseCost,
			def.costMultiplier,
			producerState.level,
			amount
		);
	}

	/**
	 * Get the maximum amount of a producer that can be bought.
	 *
	 * @param id - Producer ID
	 * @returns Maximum purchasable amount
	 */
	getMaxAffordable(id: string): number {
		const producerState = this.state[id];
		if (!producerState || !producerState.unlocked) return 0;

		const def = producerState.definition;
		const available = this.resources.getAmount(def.costResource);

		let maxBuy = calculateMaxAffordable(
			available,
			def.baseCost,
			def.costMultiplier,
			producerState.level
		);

		// Cap at max level if applicable
		if (def.maxLevel > 0) {
			const remaining = def.maxLevel - producerState.level;
			maxBuy = Math.min(maxBuy, remaining);
		}

		return Math.max(0, maxBuy);
	}

	/**
	 * Buy a producer.
	 *
	 * @param id - Producer ID
	 * @param amount - Amount to buy (default 1)
	 * @returns Whether the purchase was successful
	 */
	buy(id: string, amount: number = 1): boolean {
		if (!this.canAfford(id, amount)) return false;

		const producerState = this.state[id];
		const def = producerState.definition;
		const cost = this.calculateCost(id, amount);

		// Spend resources
		if (!this.resources.spend(def.costResource, cost)) {
			return false;
		}

		// Update level
		const previousLevel = producerState.level;
		producerState.level += amount;

		// Track first purchase
		if (producerState.firstPurchaseTime === null) {
			producerState.firstPurchaseTime = Date.now();
		}

		// Recalculate next cost
		this.recalculateCost(id);

		// Update multiplier in pipeline
		this.updateProducerMultiplier(id);

		// Emit event
		this.events.emit('upgrade_purchased', {
			upgradeId: id,
			cost: new Map([[def.costResource, cost]]),
			level: producerState.level
		});

		return true;
	}

	/**
	 * Buy the maximum affordable amount of a producer.
	 *
	 * @param id - Producer ID
	 * @returns Amount bought (0 if none)
	 */
	buyMax(id: string): number {
		const maxAmount = this.getMaxAffordable(id);
		if (maxAmount <= 0) return 0;

		if (this.buy(id, maxAmount)) {
			return maxAmount;
		}

		return 0;
	}

	// ============================================================================
	// Producer State Access
	// ============================================================================

	/**
	 * Get the current level of a producer.
	 *
	 * @param id - Producer ID
	 * @returns Current level
	 */
	getLevel(id: string): number {
		return this.state[id]?.level ?? 0;
	}

	/**
	 * Get the current production rate of a producer.
	 *
	 * @param id - Producer ID
	 * @returns Current production per second
	 */
	getProduction(id: string): Decimal {
		const producerState = this.state[id];
		if (!producerState || producerState.level === 0) return ZERO;

		const def = producerState.definition;
		const baseProduction = D(def.baseProduction).mul(producerState.level);
		return this.pipeline.calculate(def.producesResource, baseProduction);
	}

	/**
	 * Get the next cost for a producer.
	 *
	 * @param id - Producer ID
	 * @returns Cost for next level
	 */
	getNextCost(id: string): Decimal {
		return this.state[id]?.nextCost ?? ZERO;
	}

	/**
	 * Check if a producer is unlocked.
	 *
	 * @param id - Producer ID
	 * @returns Whether the producer is unlocked
	 */
	isUnlocked(id: string): boolean {
		return this.state[id]?.unlocked ?? false;
	}

	/**
	 * Get total produced by a producer.
	 *
	 * @param id - Producer ID
	 * @returns Total produced
	 */
	getTotalProduced(id: string): Decimal {
		return this.state[id]?.totalProduced ?? ZERO;
	}

	/**
	 * Get producer definition.
	 *
	 * @param id - Producer ID
	 * @returns Producer definition or undefined
	 */
	getDefinition(id: string): ProducerDefinition | undefined {
		return this.state[id]?.definition;
	}

	/**
	 * Get all producers by category.
	 *
	 * @param category - Producer category
	 * @returns Array of producer IDs
	 */
	getByCategory(category: ProducerCategory): string[] {
		return Object.entries(this.state)
			.filter(([_, s]) => s.definition.category === category)
			.sort((a, b) => a[1].definition.displayOrder - b[1].definition.displayOrder)
			.map(([id]) => id);
	}

	/**
	 * Get all visible producers for the current phase.
	 *
	 * @returns Array of visible producer IDs
	 */
	getVisibleProducers(): string[] {
		return Object.entries(this.state)
			.filter(([_, s]) => s.unlocked && s.definition.minPhase <= this.currentPhase)
			.sort((a, b) => a[1].definition.displayOrder - b[1].definition.displayOrder)
			.map(([id]) => id);
	}

	/**
	 * Get the click power (from click boosters).
	 *
	 * @returns Additional clicks per click
	 */
	getClickPower(): Decimal {
		const boosterLevel = this.getLevel(ProducerId.CLICK_BOOSTER);
		return D(boosterLevel);
	}

	/**
	 * Get the production pipeline for direct access.
	 *
	 * @returns Production pipeline
	 */
	getPipeline(): ProductionPipeline {
		return this.pipeline;
	}

	// ============================================================================
	// Phase & Unlock Management
	// ============================================================================

	/**
	 * Set the current phase and unlock appropriate producers.
	 *
	 * @param phase - Current phase number
	 */
	setPhase(phase: number): void {
		this.currentPhase = phase;

		// Auto-unlock producers for this phase
		for (const [id, producerState] of Object.entries(this.state)) {
			const def = producerState.definition;
			if (def.minPhase <= phase && !def.hidden && !producerState.unlocked) {
				this.unlock(id);
			}
		}
	}

	/**
	 * Unlock a producer.
	 *
	 * @param id - Producer ID
	 */
	unlock(id: string): void {
		const producerState = this.state[id];
		if (!producerState || producerState.unlocked) return;

		producerState.unlocked = true;

		this.events.emit('upgrade_unlocked', {
			upgradeId: id,
			name: producerState.definition.name,
			category: producerState.definition.category
		});
	}

	// ============================================================================
	// Internal Helpers
	// ============================================================================

	/**
	 * Unlock basic producers that should be available from start.
	 */
	private unlockBasicProducers(): void {
		// Unlock Phase 1 visible producers
		for (const [id, producerState] of Object.entries(this.state)) {
			const def = producerState.definition;
			if (!def.hidden && def.minPhase === 1) {
				producerState.unlocked = true;
			}
		}
	}

	/**
	 * Recalculate the next cost for a producer.
	 *
	 * @param id - Producer ID
	 */
	private recalculateCost(id: string): void {
		const producerState = this.state[id];
		if (!producerState) return;

		producerState.nextCost = calculateExponentialCost(
			producerState.definition.baseCost,
			producerState.definition.costMultiplier,
			producerState.level
		);
	}

	/**
	 * Update the producer multiplier in the pipeline.
	 *
	 * @param id - Producer ID
	 */
	private updateProducerMultiplier(id: string): void {
		const producerState = this.state[id];
		if (!producerState) return;

		const def = producerState.definition;

		// Special handling for multiplier-type producers
		if (id === ProducerId.PIXEL_MULTIPLIER && producerState.level > 0) {
			// Each level = 1.1x multiplier
			const multiplierValue = D(1.1).pow(producerState.level);
			this.pipeline.addMultiplier({
				id: `producer_${id}`,
				name: def.name,
				description: `${producerState.level} levels`,
				value: multiplierValue,
				source: 'producer',
				stackingType: 'multiplicative',
				resourceId: 'pixels',
				priority: 10
			});
		}

		if (id === ProducerId.GALLERY_SYNCER && producerState.level > 0) {
			// Each level = 1.2x multiplier to gallery production
			const multiplierValue = D(1.2).pow(producerState.level);
			this.pipeline.addMultiplier({
				id: `producer_${id}`,
				name: def.name,
				description: `${producerState.level} levels`,
				value: multiplierValue,
				source: 'producer',
				stackingType: 'multiplicative',
				resourceId: 'pixels',
				priority: 15
			});
		}
	}

	/**
	 * Check and apply unlock conditions.
	 */
	private checkUnlockConditions(): void {
		for (const [id, producerState] of Object.entries(this.state)) {
			if (producerState.unlocked) continue;

			const def = producerState.definition;
			if (def.minPhase > this.currentPhase) continue;

			// Check unlock condition
			if (!def.unlockCondition) {
				// No condition but might be hidden
				if (!def.hidden) {
					this.unlock(id);
				}
				continue;
			}

			const condition = def.unlockCondition;
			let met = false;

			switch (condition.type) {
				case 'resource':
					met = this.resources.getAmount(condition.id).gte(condition.amount ?? 0);
					break;

				case 'producer':
					met = this.getLevel(condition.id) >= (condition.amount ?? 1);
					break;

				case 'phase':
					met = this.currentPhase >= (condition.amount ?? 1);
					break;

				case 'achievement':
					// TODO: Check achievement manager
					break;
			}

			if (met) {
				this.unlock(id);
			}
		}
	}

	/**
	 * Recalculate all production rates.
	 */
	private recalculateAllProductions(): void {
		for (const [id, producerState] of Object.entries(this.state)) {
			if (producerState.level > 0) {
				this.updateProducerMultiplier(id);
			}
		}
	}

	/**
	 * Add an external multiplier to the pipeline.
	 *
	 * @param id - Multiplier ID
	 * @param name - Display name
	 * @param value - Multiplier value
	 * @param source - Source type
	 * @param resourceId - Resource to affect (empty = all)
	 * @param isAdditive - Whether additive (default: multiplicative)
	 */
	addMultiplier(
		id: string,
		name: string,
		value: DecimalSource,
		source: MultiplierSource,
		resourceId: string = '',
		isAdditive: boolean = false
	): void {
		this.pipeline.addMultiplier({
			id,
			name,
			value,
			source,
			stackingType: isAdditive ? 'additive' : 'multiplicative',
			resourceId,
			priority: source === 'eternal' ? 100 : 50
		});
	}

	/**
	 * Remove a multiplier from the pipeline.
	 *
	 * @param id - Multiplier ID
	 */
	removeMultiplier(id: string): void {
		this.pipeline.removeMultiplier(id);
	}

	/**
	 * Get production breakdown for display.
	 *
	 * @param resourceId - Resource ID
	 * @param baseRate - Base rate
	 * @returns Production breakdown
	 */
	getProductionBreakdown(resourceId: string, baseRate: DecimalSource) {
		return this.pipeline.getBreakdown(resourceId, baseRate);
	}
}
