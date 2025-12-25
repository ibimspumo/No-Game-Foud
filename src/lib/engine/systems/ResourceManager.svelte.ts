/**
 * @fileoverview Resource Manager for the game engine.
 * Manages all game resources including amounts, production rates, and unlocks.
 *
 * Uses Svelte 5 Runes ($state, $derived) for reactive state management,
 * allowing UI components to automatically update when resources change.
 *
 * Note: This file uses .svelte.ts extension to enable runes in a non-component file.
 *
 * @module engine/systems/ResourceManager
 */

import {
	Decimal,
	D,
	ZERO,
	serialize,
	deserialize,
	type DecimalSource
} from '../utils/decimal';
import type { EventManager } from '../core/EventManager';
import type { Manager } from '../models/types';
import {
	RESOURCE_DEFINITIONS,
	type ResourceDefinition,
	type ResourceCategory,
	ResourceId
} from '../models/resources';

/**
 * Internal resource state tracked by the manager.
 */
interface InternalResourceState {
	/** Current amount */
	amount: Decimal;
	/** Production rate per second */
	productionRate: Decimal;
	/** Whether unlocked/visible */
	unlocked: boolean;
	/** Total ever generated */
	totalGenerated: Decimal;
	/** Total ever spent */
	totalSpent: Decimal;
}

/**
 * Serializable format for saving/loading.
 */
interface SerializedResources {
	amounts: Record<string, string>;
	productionRates: Record<string, string>;
	unlocked: string[];
	totalGenerated: Record<string, string>;
	totalSpent: Record<string, string>;
}

/**
 * Resource Manager class.
 *
 * Manages all game resources with reactive state using Svelte 5 runes.
 * Handles production, spending, unlocking, and serialization.
 *
 * @example
 * ```typescript
 * const resources = new ResourceManager(eventManager);
 * resources.init();
 *
 * // Add resources
 * resources.add('pixels', 100);
 *
 * // Check affordability
 * if (resources.canAfford('pixels', 50)) {
 *   resources.spend('pixels', 50);
 * }
 *
 * // Get current amount (reactive)
 * const pixels = resources.getAmount('pixels');
 * ```
 */
export class ResourceManager implements Manager {
	/**
	 * Event manager for publishing resource events.
	 */
	private events: EventManager;

	/**
	 * Internal state for all resources.
	 * Using $state for Svelte 5 reactivity.
	 */
	private state = $state<Record<string, InternalResourceState>>({});

	/**
	 * Current game phase (for unlock checks).
	 */
	private currentPhase = $state(1);

	/**
	 * Derived: All unlocked resource IDs.
	 */
	unlockedResources = $derived(
		Object.entries(this.state)
			.filter(([_, s]) => s.unlocked)
			.map(([id]) => id)
	);

	/**
	 * Derived: Total production rate (all resources combined).
	 */
	totalProductionRate = $derived(
		Object.values(this.state)
			.reduce((sum, s) => sum.add(s.productionRate), ZERO)
	);

	/**
	 * Creates a new ResourceManager.
	 *
	 * @param events - Event manager for publishing events
	 */
	constructor(events: EventManager) {
		this.events = events;
	}

	/**
	 * Initialize the resource manager.
	 * Sets up initial state for all defined resources.
	 */
	init(): void {
		// Initialize state for all defined resources
		for (const def of Object.values(RESOURCE_DEFINITIONS)) {
			this.state[def.id] = {
				amount: ZERO,
				productionRate: ZERO,
				unlocked: !def.hidden, // Start unlocked if not hidden
				totalGenerated: ZERO,
				totalSpent: ZERO,
			};
		}

		// Ensure pixels are always unlocked
		if (this.state[ResourceId.PIXELS]) {
			this.state[ResourceId.PIXELS].unlocked = true;
		}
	}

	/**
	 * Update resources on each tick.
	 * Applies production rates to generate resources.
	 *
	 * @param deltaTime - Time since last tick in seconds
	 */
	tick(deltaTime: number): void {
		// Apply production for all resources
		for (const [id, resourceState] of Object.entries(this.state)) {
			if (resourceState.unlocked && resourceState.productionRate.gt(0)) {
				const produced = resourceState.productionRate.mul(deltaTime);
				this.addInternal(id, produced, 'production');
			}
		}
	}

	/**
	 * Reset for a new run (rebirth).
	 * Clears run resources but preserves eternal resources.
	 */
	reset(): void {
		for (const [id, def] of Object.entries(RESOURCE_DEFINITIONS)) {
			if (def.category !== 'eternal') {
				// Reset run and phase resources
				this.state[id] = {
					amount: ZERO,
					productionRate: ZERO,
					unlocked: !def.hidden,
					totalGenerated: ZERO,
					totalSpent: ZERO,
				};
			}
		}

		// Re-unlock pixels
		if (this.state[ResourceId.PIXELS]) {
			this.state[ResourceId.PIXELS].unlocked = true;
		}

		this.currentPhase = 1;
	}

	/**
	 * Serialize state for saving.
	 *
	 * @returns Serialized resource state
	 */
	serialize(): SerializedResources {
		const amounts: Record<string, string> = {};
		const productionRates: Record<string, string> = {};
		const unlocked: string[] = [];
		const totalGenerated: Record<string, string> = {};
		const totalSpent: Record<string, string> = {};

		for (const [id, resourceState] of Object.entries(this.state)) {
			amounts[id] = serialize(resourceState.amount);
			productionRates[id] = serialize(resourceState.productionRate);
			if (resourceState.unlocked) {
				unlocked.push(id);
			}
			totalGenerated[id] = serialize(resourceState.totalGenerated);
			totalSpent[id] = serialize(resourceState.totalSpent);
		}

		return { amounts, productionRates, unlocked, totalGenerated, totalSpent };
	}

	/**
	 * Deserialize and restore state from save.
	 *
	 * @param data - Previously serialized state
	 */
	deserialize(data: unknown): void {
		const saved = data as SerializedResources;
		if (!saved || typeof saved !== 'object') return;

		// Restore amounts
		if (saved.amounts) {
			for (const [id, value] of Object.entries(saved.amounts)) {
				if (this.state[id]) {
					this.state[id].amount = deserialize(value);
				}
			}
		}

		// Restore production rates
		if (saved.productionRates) {
			for (const [id, value] of Object.entries(saved.productionRates)) {
				if (this.state[id]) {
					this.state[id].productionRate = deserialize(value);
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
		if (saved.totalGenerated) {
			for (const [id, value] of Object.entries(saved.totalGenerated)) {
				if (this.state[id]) {
					this.state[id].totalGenerated = deserialize(value);
				}
			}
		}

		if (saved.totalSpent) {
			for (const [id, value] of Object.entries(saved.totalSpent)) {
				if (this.state[id]) {
					this.state[id].totalSpent = deserialize(value);
				}
			}
		}
	}

	// ============================================================================
	// Resource Operations
	// ============================================================================

	/**
	 * Get the current amount of a resource.
	 *
	 * @param id - Resource ID
	 * @returns Current amount (ZERO if not found)
	 */
	getAmount(id: string): Decimal {
		return this.state[id]?.amount ?? ZERO;
	}

	/**
	 * Get the production rate of a resource.
	 *
	 * @param id - Resource ID
	 * @returns Production rate per second (ZERO if not found)
	 */
	getProductionRate(id: string): Decimal {
		return this.state[id]?.productionRate ?? ZERO;
	}

	/**
	 * Check if a resource is unlocked.
	 *
	 * @param id - Resource ID
	 * @returns Whether the resource is unlocked
	 */
	isUnlocked(id: string): boolean {
		return this.state[id]?.unlocked ?? false;
	}

	/**
	 * Get total ever generated for a resource.
	 *
	 * @param id - Resource ID
	 * @returns Total ever generated
	 */
	getTotalGenerated(id: string): Decimal {
		return this.state[id]?.totalGenerated ?? ZERO;
	}

	/**
	 * Get total ever spent for a resource.
	 *
	 * @param id - Resource ID
	 * @returns Total ever spent
	 */
	getTotalSpent(id: string): Decimal {
		return this.state[id]?.totalSpent ?? ZERO;
	}

	/**
	 * Add resources (internal helper with source tracking).
	 *
	 * @param id - Resource ID
	 * @param amount - Amount to add
	 * @param source - Source of the addition
	 */
	private addInternal(
		id: string,
		amount: DecimalSource,
		source: 'production' | 'click' | 'purchase' | 'upgrade' | 'rebirth' | 'offline' | 'other'
	): void {
		const resourceState = this.state[id];
		if (!resourceState) return;

		const amountDecimal = D(amount);
		if (amountDecimal.lte(0)) return;

		const previousAmount = resourceState.amount;
		resourceState.amount = resourceState.amount.add(amountDecimal);
		resourceState.totalGenerated = resourceState.totalGenerated.add(amountDecimal);

		// Emit event
		this.events.emit('resource_changed', {
			resourceId: id,
			previousAmount,
			newAmount: resourceState.amount,
			delta: amountDecimal,
			source
		});
	}

	/**
	 * Add resources to a resource pool.
	 *
	 * @param id - Resource ID
	 * @param amount - Amount to add
	 */
	add(id: string, amount: DecimalSource): void {
		this.addInternal(id, amount, 'other');
	}

	/**
	 * Add resources from a click action.
	 *
	 * @param id - Resource ID
	 * @param amount - Amount to add
	 */
	addFromClick(id: string, amount: DecimalSource): void {
		this.addInternal(id, amount, 'click');
	}

	/**
	 * Perform a click action for a resource.
	 * This is a low-level method that only applies the base click amount.
	 * For click actions with bonuses and multipliers, use Game.click() instead.
	 *
	 * @param id - Resource ID
	 * @param multiplier - Optional multiplier to apply to base click amount
	 * @returns Amount generated (or ZERO if not clickable)
	 */
	click(id: string, multiplier: DecimalSource = 1): Decimal {
		const def = RESOURCE_DEFINITIONS[id];
		if (!def?.canClick) return ZERO;

		const resourceState = this.state[id];
		if (!resourceState?.unlocked) return ZERO;

		const baseAmount = D(def.baseClickAmount);
		const amount = baseAmount.mul(multiplier);
		this.addFromClick(id, amount);
		return amount;
	}

	/**
	 * Check if the player can afford a cost.
	 *
	 * @param id - Resource ID
	 * @param cost - Amount required
	 * @returns Whether the player can afford it
	 */
	canAfford(id: string, cost: DecimalSource): boolean {
		const amount = this.getAmount(id);
		return amount.gte(cost);
	}

	/**
	 * Check if the player can afford multiple costs.
	 *
	 * @param costs - Map of resource ID to cost
	 * @returns Whether all costs can be afforded
	 */
	canAffordMultiple(costs: Map<string, Decimal>): boolean {
		for (const [id, cost] of costs) {
			if (!this.canAfford(id, cost)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Spend resources (subtract from amount).
	 *
	 * @param id - Resource ID
	 * @param cost - Amount to spend
	 * @returns Whether the spend was successful
	 */
	spend(id: string, cost: DecimalSource): boolean {
		const resourceState = this.state[id];
		if (!resourceState) return false;

		const costDecimal = D(cost);
		if (!this.canAfford(id, costDecimal)) return false;

		const previousAmount = resourceState.amount;
		resourceState.amount = resourceState.amount.sub(costDecimal);
		resourceState.totalSpent = resourceState.totalSpent.add(costDecimal);

		this.events.emit('resource_changed', {
			resourceId: id,
			previousAmount,
			newAmount: resourceState.amount,
			delta: costDecimal.neg(),
			source: 'purchase'
		});

		return true;
	}

	/**
	 * Spend multiple resources at once.
	 * Either all succeed or none do (atomic).
	 *
	 * @param costs - Map of resource ID to cost
	 * @returns Whether all spends were successful
	 */
	spendMultiple(costs: Map<string, Decimal>): boolean {
		// First check if all can be afforded
		if (!this.canAffordMultiple(costs)) {
			return false;
		}

		// Then spend all
		for (const [id, cost] of costs) {
			this.spend(id, cost);
		}

		return true;
	}

	/**
	 * Set the production rate for a resource.
	 *
	 * @param id - Resource ID
	 * @param rate - New production rate per second
	 */
	setProductionRate(id: string, rate: DecimalSource): void {
		const resourceState = this.state[id];
		if (!resourceState) return;

		const rateDecimal = D(rate);
		const previousRate = resourceState.productionRate;
		resourceState.productionRate = rateDecimal;

		this.events.emit('production_changed', {
			resourceId: id,
			previousRate,
			newRate: rateDecimal,
			source: 'other'
		});
	}

	/**
	 * Add to the production rate for a resource.
	 *
	 * @param id - Resource ID
	 * @param amount - Amount to add to production rate
	 */
	addProductionRate(id: string, amount: DecimalSource): void {
		const resourceState = this.state[id];
		if (!resourceState) return;

		const previousRate = resourceState.productionRate;
		resourceState.productionRate = resourceState.productionRate.add(amount);

		this.events.emit('production_changed', {
			resourceId: id,
			previousRate,
			newRate: resourceState.productionRate,
			source: 'other'
		});
	}

	/**
	 * Unlock a resource (make it visible).
	 *
	 * @param id - Resource ID
	 */
	unlock(id: string): void {
		const resourceState = this.state[id];
		if (!resourceState || resourceState.unlocked) return;

		resourceState.unlocked = true;

		const def = RESOURCE_DEFINITIONS[id];
		this.events.emit('resource_unlocked', {
			resourceId: id,
			name: def?.name ?? id,
			timestamp: Date.now()
		});
	}

	/**
	 * Set the current phase (for unlock checks).
	 *
	 * @param phase - Current phase number
	 */
	setPhase(phase: number): void {
		this.currentPhase = phase;

		// Auto-unlock resources for this phase
		for (const def of Object.values(RESOURCE_DEFINITIONS)) {
			if (def.minPhase <= phase && !def.hidden) {
				this.unlock(def.id);
			}
		}
	}

	/**
	 * Get resource definition.
	 *
	 * @param id - Resource ID
	 * @returns Resource definition or undefined
	 */
	getDefinition(id: string): ResourceDefinition | undefined {
		return RESOURCE_DEFINITIONS[id];
	}

	/**
	 * Get all resource definitions for a category.
	 *
	 * @param category - Resource category
	 * @returns Array of resource definitions
	 */
	getByCategory(category: ResourceCategory): ResourceDefinition[] {
		return Object.values(RESOURCE_DEFINITIONS)
			.filter(r => r.category === category);
	}

	/**
	 * Get all visible resources (unlocked and for current phase).
	 *
	 * @returns Array of visible resource IDs
	 */
	getVisibleResources(): string[] {
		return Object.entries(this.state)
			.filter(([id, s]) => {
				const def = RESOURCE_DEFINITIONS[id];
				return s.unlocked && def && def.minPhase <= this.currentPhase;
			})
			.map(([id]) => id)
			.sort((a, b) => {
				const defA = RESOURCE_DEFINITIONS[a];
				const defB = RESOURCE_DEFINITIONS[b];
				return (defA?.displayOrder ?? 0) - (defB?.displayOrder ?? 0);
			});
	}
}
