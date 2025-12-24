/**
 * @fileoverview Upgrade Manager for the game engine.
 * Manages all upgrades including run, eternal, and secret upgrades.
 *
 * Uses Svelte 5 Runes ($state, $derived) for reactive state management.
 *
 * The upgrade system has three categories:
 * - Run Upgrades: Reset on rebirth, phase-specific
 * - Eternal Upgrades: Permanent skill tree (Consumer/Creator/Observer paths)
 * - Secret Upgrades: Hidden upgrades with special unlock conditions
 *
 * @module engine/systems/UpgradeManager
 */

import {
	Decimal,
	D,
	ZERO,
	ONE,
	mul,
	pow,
	gte,
	sub,
	add,
	type DecimalSource
} from '../utils/decimal';
import type { EventManager } from '../core/EventManager';
import type { ResourceManager } from './ResourceManager.svelte';
import type { ProducerManager } from './ProducerManager.svelte';
import type { Manager } from '../models/types';
import {
	type UpgradeDefinition,
	type UpgradeEffect,
	type UpgradeCategory,
	type UpgradeCurrency,
	type InternalUpgradeState,
	type SerializedUpgrades,
	type SkillTreePath,
	isAtMaxLevel,
	isRepeatableUpgrade
} from '../models/upgrades';

/**
 * Context for evaluating upgrade conditions.
 * Provided by the Game class to connect to other managers.
 */
export interface UpgradeManagerContext {
	/** Get the current phase number */
	getCurrentPhase: () => number;
	/** Check if an achievement is unlocked */
	hasAchievement: (achievementId: string) => boolean;
	/** Get the level of a producer */
	getProducerLevel: (producerId: string) => number;
}

/**
 * Options for buying upgrades.
 */
export interface BuyOptions {
	/** Amount to buy (default: 1) */
	amount?: number;
	/** Buy maximum affordable (overrides amount) */
	buyMax?: boolean;
	/** Skip affordability check (for admin/debug) */
	skipCheck?: boolean;
}

/**
 * Result of a purchase attempt.
 */
export interface PurchaseResult {
	/** Whether the purchase was successful */
	success: boolean;
	/** Amount actually purchased */
	amountPurchased: number;
	/** Total cost paid */
	costPaid: Decimal;
	/** Error message if failed */
	error?: string;
}

/**
 * Upgrade Manager class.
 *
 * Manages all game upgrades including:
 * - Purchase logic with exponential costs
 * - Effect application to production pipeline
 * - Unlock conditions evaluation
 * - Skill tree (eternal upgrades) with paths
 *
 * @example
 * ```typescript
 * const upgrades = new UpgradeManager(events, resources);
 * upgrades.init();
 * upgrades.registerUpgrade(myUpgradeDefinition);
 *
 * if (upgrades.canAfford('pixel_boost_1')) {
 *   upgrades.purchase('pixel_boost_1');
 * }
 * ```
 */
export class UpgradeManager implements Manager {
	/**
	 * Event manager for publishing events.
	 */
	private events: EventManager;

	/**
	 * Resource manager for currency handling.
	 */
	private resources: ResourceManager;

	/**
	 * Producer manager reference (set via context).
	 */
	private producers: ProducerManager | null = null;

	/**
	 * Context for condition evaluation.
	 */
	private context: UpgradeManagerContext | null = null;

	/**
	 * All registered upgrade definitions.
	 */
	private definitions = new Map<string, UpgradeDefinition>();

	/**
	 * Internal state for all upgrades.
	 */
	private state = $state<Record<string, InternalUpgradeState>>({});

	/**
	 * Current game phase.
	 */
	private currentPhase = $state(1);

	/**
	 * Derived: All owned run upgrade IDs.
	 */
	ownedRunUpgrades = $derived(
		Object.entries(this.state)
			.filter(([_, s]) => s.level > 0 && s.definition.category === 'run')
			.map(([id]) => id)
	);

	/**
	 * Derived: All owned eternal upgrade IDs.
	 */
	ownedEternalUpgrades = $derived(
		Object.entries(this.state)
			.filter(([_, s]) => s.level > 0 && s.definition.category === 'eternal')
			.map(([id]) => id)
	);

	/**
	 * Derived: All owned secret upgrade IDs.
	 */
	ownedSecretUpgrades = $derived(
		Object.entries(this.state)
			.filter(([_, s]) => s.level > 0 && s.definition.category === 'secret')
			.map(([id]) => id)
	);

	/**
	 * Derived: All unlocked (visible) upgrade IDs.
	 */
	unlockedUpgrades = $derived(
		Object.entries(this.state)
			.filter(([_, s]) => s.unlocked)
			.map(([id]) => id)
	);

	/**
	 * Derived: All purchasable upgrade IDs.
	 */
	purchasableUpgrades = $derived(
		Object.entries(this.state)
			.filter(([_, s]) => s.unlocked && s.canAfford && !isAtMaxLevel(s.definition, s.level))
			.map(([id]) => id)
	);

	/**
	 * Derived: Total production multiplier from upgrades.
	 */
	totalProductionMultiplier = $derived(this.calculateTotalMultiplier('production'));

	/**
	 * Derived: Total click power bonus from upgrades.
	 */
	totalClickBonus = $derived(this.calculateTotalClickBonus());

	/**
	 * Creates a new UpgradeManager.
	 *
	 * @param events - Event manager
	 * @param resources - Resource manager
	 */
	constructor(events: EventManager, resources: ResourceManager) {
		this.events = events;
		this.resources = resources;
	}

	/**
	 * Set the context for condition evaluation.
	 *
	 * @param context - Upgrade manager context
	 */
	setContext(context: UpgradeManagerContext): void {
		this.context = context;
	}

	/**
	 * Set the producer manager reference.
	 *
	 * @param producers - Producer manager
	 */
	setProducerManager(producers: ProducerManager): void {
		this.producers = producers;
	}

	// ============================================================================
	// Manager Interface Implementation
	// ============================================================================

	/**
	 * Initialize the upgrade manager.
	 */
	init(): void {
		// State is initialized when upgrades are registered
		// This allows for lazy loading of upgrade definitions
	}

	/**
	 * Update upgrades on each tick.
	 *
	 * @param deltaTime - Time since last tick in seconds
	 */
	tick(deltaTime: number): void {
		// Update affordability for all unlocked upgrades
		this.updateAffordability();

		// Check unlock conditions for locked upgrades
		this.checkUnlockConditions();
	}

	/**
	 * Reset run upgrades for rebirth.
	 * Eternal and secret upgrades are preserved.
	 */
	reset(): void {
		// First pass: reset run upgrades to level 0
		for (const [id, upgradeState] of Object.entries(this.state)) {
			const def = upgradeState.definition;

			if (def.category === 'run') {
				// Reset run upgrades
				this.state[id] = {
					level: 0,
					unlocked: false, // Will be recalculated in second pass
					canAfford: false,
					nextCost: this.calculateCost(id, 0),
					firstPurchaseTime: null,
					totalSpent: ZERO,
					definition: def
				};
			}
		}

		this.currentPhase = 1;

		// Second pass: recalculate unlock status considering requirements
		for (const [id, upgradeState] of Object.entries(this.state)) {
			const def = upgradeState.definition;
			const phaseRequirementMet = def.minPhase <= 1;
			const requirementsMet = !def.requires || def.requires.every((reqId) => this.isOwned(reqId));
			this.state[id].unlocked = !def.hidden && phaseRequirementMet && requirementsMet;
		}

		// Apply eternal upgrade starting bonuses
		this.applyStartingBonuses();
	}

	/**
	 * Serialize state for saving.
	 */
	serialize(): SerializedUpgrades {
		const runLevels: Record<string, number> = {};
		const eternalLevels: Record<string, number> = {};
		const secretLevels: Record<string, number> = {};
		const unlocked: string[] = [];
		const totalSpent: Record<string, string> = {};
		const firstPurchaseTimes: Record<string, number> = {};

		for (const [id, upgradeState] of Object.entries(this.state)) {
			const def = upgradeState.definition;

			if (upgradeState.level > 0) {
				switch (def.category) {
					case 'run':
						runLevels[id] = upgradeState.level;
						break;
					case 'eternal':
						eternalLevels[id] = upgradeState.level;
						break;
					case 'secret':
						secretLevels[id] = upgradeState.level;
						break;
				}
			}

			if (upgradeState.unlocked) {
				unlocked.push(id);
			}

			if (D(upgradeState.totalSpent).gt(0)) {
				totalSpent[id] = D(upgradeState.totalSpent).toString();
			}

			if (upgradeState.firstPurchaseTime !== null) {
				firstPurchaseTimes[id] = upgradeState.firstPurchaseTime;
			}
		}

		return {
			runLevels,
			eternalLevels,
			secretLevels,
			unlocked,
			totalSpent,
			firstPurchaseTimes
		};
	}

	/**
	 * Deserialize and restore state from save.
	 *
	 * @param data - Previously serialized state
	 */
	deserialize(data: unknown): void {
		const saved = data as SerializedUpgrades;
		if (!saved || typeof saved !== 'object') return;

		// Restore levels
		const allLevels = {
			...(saved.runLevels || {}),
			...(saved.eternalLevels || {}),
			...(saved.secretLevels || {})
		};

		for (const [id, level] of Object.entries(allLevels)) {
			if (this.state[id]) {
				this.state[id].level = level;
				this.state[id].nextCost = this.calculateCost(id, level);
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
		if (saved.totalSpent) {
			for (const [id, value] of Object.entries(saved.totalSpent)) {
				if (this.state[id]) {
					this.state[id].totalSpent = D(value);
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

		// Reapply all active effects
		this.reapplyAllEffects();

		// Update affordability
		this.updateAffordability();
	}

	// ============================================================================
	// Registration
	// ============================================================================

	/**
	 * Register an upgrade definition.
	 *
	 * @param definition - Upgrade definition to register
	 */
	registerUpgrade(definition: UpgradeDefinition): void {
		this.definitions.set(definition.id, definition);

		// Check if unlock requirements are met
		const phaseRequirementMet = definition.minPhase <= this.currentPhase;
		const requirementsMet = !definition.requires || definition.requires.every((reqId) => this.isOwned(reqId));
		const unlocked = !definition.hidden && phaseRequirementMet && requirementsMet;

		// Initialize state for this upgrade
		this.state[definition.id] = {
			level: 0,
			unlocked,
			canAfford: false,
			nextCost: this.calculateCost(definition.id, 0),
			firstPurchaseTime: null,
			totalSpent: ZERO,
			definition
		};
	}

	/**
	 * Register multiple upgrade definitions.
	 *
	 * @param definitions - Array of upgrade definitions
	 */
	registerUpgrades(definitions: UpgradeDefinition[]): void {
		for (const def of definitions) {
			this.registerUpgrade(def);
		}
	}

	/**
	 * Get an upgrade definition.
	 *
	 * @param id - Upgrade ID
	 * @returns Upgrade definition or undefined
	 */
	getDefinition(id: string): UpgradeDefinition | undefined {
		return this.definitions.get(id);
	}

	// ============================================================================
	// Purchase Operations
	// ============================================================================

	/**
	 * Check if an upgrade can be afforded.
	 *
	 * @param id - Upgrade ID
	 * @param amount - Amount to buy (default: 1)
	 * @returns Whether the purchase is affordable
	 */
	canAfford(id: string, amount: number = 1): boolean {
		const upgradeState = this.state[id];
		if (!upgradeState || !upgradeState.unlocked) return false;

		const def = upgradeState.definition;

		// Check max level
		if (isAtMaxLevel(def, upgradeState.level)) return false;
		if (!isRepeatableUpgrade(def) && upgradeState.level > 0) return false;

		// Check if amount exceeds remaining levels
		const maxLevel = def.maxLevel ?? 1;
		if (maxLevel > 0 && upgradeState.level + amount > maxLevel) {
			return false;
		}

		// Calculate cost
		const cost = this.calculateCostForAmount(id, amount);

		// Check currency
		return this.hasCurrency(def.currency, cost);
	}

	/**
	 * Calculate the cost for a single purchase.
	 *
	 * @param id - Upgrade ID
	 * @param currentLevel - Current level
	 * @returns Cost for next level
	 */
	calculateCost(id: string, currentLevel: number): Decimal {
		const def = this.definitions.get(id);
		if (!def) return ZERO;

		// Handle cost function
		if (typeof def.baseCost === 'function') {
			return D(def.baseCost(currentLevel));
		}

		// Handle static cost
		const baseCost = D(def.baseCost);

		// No scaling for non-repeatable
		if (!isRepeatableUpgrade(def)) {
			return baseCost;
		}

		// Apply cost multiplier for repeatable upgrades
		const multiplier = D(def.costMultiplier ?? 1.15);
		return mul(baseCost, pow(multiplier, currentLevel));
	}

	/**
	 * Calculate cost for buying multiple levels.
	 *
	 * @param id - Upgrade ID
	 * @param amount - Number of levels to buy
	 * @returns Total cost
	 */
	calculateCostForAmount(id: string, amount: number): Decimal {
		const upgradeState = this.state[id];
		if (!upgradeState) return ZERO;

		let total = ZERO;
		const currentLevel = upgradeState.level;

		for (let i = 0; i < amount; i++) {
			total = add(total, this.calculateCost(id, currentLevel + i));
		}

		return total;
	}

	/**
	 * Get maximum affordable amount of an upgrade.
	 *
	 * @param id - Upgrade ID
	 * @returns Maximum purchasable amount
	 */
	getMaxAffordable(id: string): number {
		const upgradeState = this.state[id];
		if (!upgradeState || !upgradeState.unlocked) return 0;

		const def = upgradeState.definition;
		if (isAtMaxLevel(def, upgradeState.level)) return 0;

		const available = this.getCurrencyAmount(def.currency);

		// Binary search for max affordable
		let low = 0;
		let high = 1000; // Reasonable cap

		// Cap at max level if applicable
		const maxLevel = def.maxLevel ?? 1;
		if (maxLevel > 0) {
			high = Math.min(high, maxLevel - upgradeState.level);
		}

		while (low < high) {
			const mid = Math.ceil((low + high) / 2);
			const cost = this.calculateCostForAmount(id, mid);

			if (gte(available, cost)) {
				low = mid;
			} else {
				high = mid - 1;
			}
		}

		return Math.max(0, low);
	}

	/**
	 * Purchase an upgrade.
	 *
	 * @param id - Upgrade ID
	 * @param options - Purchase options
	 * @returns Purchase result
	 */
	purchase(id: string, options: BuyOptions = {}): PurchaseResult {
		const { amount = 1, buyMax = false, skipCheck = false } = options;

		const upgradeState = this.state[id];
		if (!upgradeState) {
			return { success: false, amountPurchased: 0, costPaid: ZERO, error: 'Unknown upgrade' };
		}

		const def = upgradeState.definition;

		// Determine amount to buy
		let toBuy = buyMax ? this.getMaxAffordable(id) : amount;

		if (toBuy <= 0) {
			return { success: false, amountPurchased: 0, costPaid: ZERO, error: 'Cannot afford' };
		}

		// Check if purchase is valid
		if (!skipCheck && !this.canAfford(id, toBuy)) {
			return { success: false, amountPurchased: 0, costPaid: ZERO, error: 'Cannot afford' };
		}

		// Calculate total cost
		const cost = this.calculateCostForAmount(id, toBuy);

		// Deduct currency
		if (!skipCheck && !this.spendCurrency(def.currency, cost)) {
			return {
				success: false,
				amountPurchased: 0,
				costPaid: ZERO,
				error: 'Failed to spend currency'
			};
		}

		// Update level
		const previousLevel = upgradeState.level;
		upgradeState.level += toBuy;

		// Track first purchase
		if (upgradeState.firstPurchaseTime === null) {
			upgradeState.firstPurchaseTime = Date.now();
		}

		// Track total spent
		upgradeState.totalSpent = add(upgradeState.totalSpent, cost);

		// Update next cost
		upgradeState.nextCost = this.calculateCost(id, upgradeState.level);

		// Apply effects
		this.applyEffects(id, previousLevel, upgradeState.level);

		// Update affordability
		upgradeState.canAfford = this.canAfford(id);

		// Emit event
		this.events.emit('upgrade_purchased', {
			upgradeId: id,
			cost: new Map([[def.currency, cost]]),
			level: upgradeState.level
		});

		return { success: true, amountPurchased: toBuy, costPaid: cost };
	}

	/**
	 * Purchase maximum affordable amount.
	 *
	 * @param id - Upgrade ID
	 * @returns Purchase result
	 */
	purchaseMax(id: string): PurchaseResult {
		return this.purchase(id, { buyMax: true });
	}

	// ============================================================================
	// State Access
	// ============================================================================

	/**
	 * Get the level of an upgrade.
	 *
	 * @param id - Upgrade ID
	 * @returns Current level (0 if not owned)
	 */
	getLevel(id: string): number {
		return this.state[id]?.level ?? 0;
	}

	/**
	 * Check if an upgrade is owned (level > 0).
	 *
	 * @param id - Upgrade ID
	 * @returns Whether the upgrade is owned
	 */
	isOwned(id: string): boolean {
		return this.getLevel(id) > 0;
	}

	/**
	 * Check if an upgrade is unlocked (visible).
	 *
	 * @param id - Upgrade ID
	 * @returns Whether the upgrade is unlocked
	 */
	isUnlocked(id: string): boolean {
		return this.state[id]?.unlocked ?? false;
	}

	/**
	 * Get the next cost for an upgrade.
	 *
	 * @param id - Upgrade ID
	 * @returns Next purchase cost
	 */
	getNextCost(id: string): Decimal {
		return D(this.state[id]?.nextCost ?? 0);
	}

	/**
	 * Get all upgrades by category.
	 *
	 * @param category - Upgrade category
	 * @returns Array of upgrade IDs
	 */
	getByCategory(category: UpgradeCategory): string[] {
		return Object.entries(this.state)
			.filter(([_, s]) => s.definition.category === category)
			.sort((a, b) => a[1].definition.displayOrder - b[1].definition.displayOrder)
			.map(([id]) => id);
	}

	/**
	 * Get all upgrades by skill tree path.
	 *
	 * @param path - Skill tree path
	 * @returns Array of upgrade IDs
	 */
	getByPath(path: SkillTreePath): string[] {
		return Object.entries(this.state)
			.filter(([_, s]) => s.definition.category === 'eternal' && s.definition.path === path)
			.sort((a, b) => a[1].definition.displayOrder - b[1].definition.displayOrder)
			.map(([id]) => id);
	}

	/**
	 * Get all visible upgrades for the current phase.
	 *
	 * @returns Array of visible upgrade IDs
	 */
	getVisibleUpgrades(): string[] {
		return Object.entries(this.state)
			.filter(([_, s]) => s.unlocked)
			.sort((a, b) => a[1].definition.displayOrder - b[1].definition.displayOrder)
			.map(([id]) => id);
	}

	/**
	 * Get total spent on an upgrade.
	 *
	 * @param id - Upgrade ID
	 * @returns Total currency spent
	 */
	getTotalSpent(id: string): Decimal {
		return D(this.state[id]?.totalSpent ?? 0);
	}

	// ============================================================================
	// Phase Management
	// ============================================================================

	/**
	 * Set the current phase and update unlock status.
	 *
	 * @param phase - Current phase number
	 */
	setPhase(phase: number): void {
		this.currentPhase = phase;

		// Auto-unlock upgrades for this phase
		for (const [id, upgradeState] of Object.entries(this.state)) {
			const def = upgradeState.definition;
			if (def.minPhase <= phase && !def.hidden && !upgradeState.unlocked) {
				if (this.checkUpgradeRequirements(id)) {
					this.unlock(id);
				}
			}
		}
	}

	/**
	 * Manually unlock an upgrade.
	 *
	 * @param id - Upgrade ID
	 */
	unlock(id: string): void {
		const upgradeState = this.state[id];
		if (!upgradeState || upgradeState.unlocked) return;

		upgradeState.unlocked = true;
		upgradeState.canAfford = this.canAfford(id);

		this.events.emit('upgrade_unlocked', {
			upgradeId: id,
			name: upgradeState.definition.name,
			category: upgradeState.definition.category
		});
	}

	// ============================================================================
	// Effect System
	// ============================================================================

	/**
	 * Get all active effects of a specific type.
	 *
	 * @param effectType - Type of effect
	 * @returns Array of active effects with their levels
	 */
	getActiveEffects(effectType: string): Array<{ effect: UpgradeEffect; level: number }> {
		const result: Array<{ effect: UpgradeEffect; level: number }> = [];

		for (const [_, upgradeState] of Object.entries(this.state)) {
			if (upgradeState.level <= 0) continue;

			for (const effect of upgradeState.definition.effects) {
				if (effect.type === effectType) {
					result.push({ effect, level: upgradeState.level });
				}
			}
		}

		return result;
	}

	/**
	 * Get the total multiplier for a target.
	 *
	 * @param target - Effect target
	 * @returns Combined multiplier
	 */
	getMultiplier(target: string): Decimal {
		let multiplier = ONE;

		const effects = this.getActiveEffects('multiplier');
		for (const { effect, level } of effects) {
			if (effect.type !== 'multiplier') continue;
			if (effect.target !== target && effect.target !== 'all') continue;

			let value = D(effect.value);
			if (effect.scalesWithLevel) {
				if (effect.scalingType === 'exponential') {
					value = pow(D(effect.scalingFactor ?? effect.value), level);
				} else {
					// Linear scaling
					value = add(ONE, mul(sub(value, ONE), level));
				}
			}

			multiplier = mul(multiplier, value);
		}

		return multiplier;
	}

	/**
	 * Get total additive bonus for a target.
	 *
	 * @param target - Effect target
	 * @returns Combined additive bonus
	 */
	getAdditiveBonus(target: string): Decimal {
		let bonus = ZERO;

		const effects = this.getActiveEffects('additive');
		for (const { effect, level } of effects) {
			if (effect.type !== 'additive') continue;
			if (effect.target !== target && effect.target !== 'all') continue;

			let value = D(effect.value);
			if (effect.scalesWithLevel) {
				value = mul(value, level);
			}

			bonus = add(bonus, value);
		}

		return bonus;
	}

	/**
	 * Check if a feature is unlocked by an upgrade.
	 *
	 * @param featureId - Feature identifier
	 * @returns Whether the feature is unlocked
	 */
	isFeatureUnlocked(featureId: string): boolean {
		const effects = this.getActiveEffects('unlock');
		return effects.some(({ effect }) => effect.type === 'unlock' && effect.unlockId === featureId);
	}

	// ============================================================================
	// Internal Helpers
	// ============================================================================

	/**
	 * Check if player has enough of a currency.
	 *
	 * @param currency - Currency type
	 * @param amount - Amount needed
	 * @returns Whether player has enough
	 */
	private hasCurrency(currency: UpgradeCurrency, amount: Decimal): boolean {
		const available = this.getCurrencyAmount(currency);
		return gte(available, amount);
	}

	/**
	 * Get the amount of a currency.
	 *
	 * @param currency - Currency type
	 * @returns Available amount
	 */
	private getCurrencyAmount(currency: UpgradeCurrency): Decimal {
		switch (currency) {
			case 'pixels':
				return this.resources.getAmount('pixels');
			case 'primordial':
				return this.resources.getAmount('primordial_pixels');
			case 'knowledge':
				return this.resources.getAmount('knowledge');
			case 'memory':
				return this.resources.getAmount('memory');
			default:
				return ZERO;
		}
	}

	/**
	 * Spend a currency.
	 *
	 * @param currency - Currency type
	 * @param amount - Amount to spend
	 * @returns Whether spend was successful
	 */
	private spendCurrency(currency: UpgradeCurrency, amount: Decimal): boolean {
		const resourceId = this.getCurrencyResourceId(currency);
		return this.resources.spend(resourceId, amount);
	}

	/**
	 * Get the resource ID for a currency.
	 *
	 * @param currency - Currency type
	 * @returns Resource ID
	 */
	private getCurrencyResourceId(currency: UpgradeCurrency): string {
		switch (currency) {
			case 'pixels':
				return 'pixels';
			case 'primordial':
				return 'primordial_pixels';
			case 'knowledge':
				return 'knowledge';
			case 'memory':
				return 'memory';
			default:
				return 'pixels';
		}
	}

	/**
	 * Update affordability for all unlocked upgrades.
	 */
	private updateAffordability(): void {
		for (const [id, upgradeState] of Object.entries(this.state)) {
			if (upgradeState.unlocked) {
				upgradeState.canAfford = this.canAfford(id);
			}
		}
	}

	/**
	 * Check unlock conditions for all locked upgrades.
	 */
	private checkUnlockConditions(): void {
		for (const [id, upgradeState] of Object.entries(this.state)) {
			if (upgradeState.unlocked) continue;

			const def = upgradeState.definition;
			if (def.hidden) continue;
			if (def.minPhase > this.currentPhase) continue;

			if (this.checkUpgradeRequirements(id)) {
				this.unlock(id);
			}
		}
	}

	/**
	 * Check if all requirements for an upgrade are met.
	 *
	 * @param id - Upgrade ID
	 * @returns Whether requirements are met
	 */
	private checkUpgradeRequirements(id: string): boolean {
		const def = this.definitions.get(id);
		if (!def) return false;

		// Check phase requirement
		if (def.minPhase > this.currentPhase) return false;

		// Check required upgrades
		if (def.requires) {
			for (const reqId of def.requires) {
				if (!this.isOwned(reqId)) return false;
			}
		}

		// Check unlock conditions
		if (def.unlockConditions) {
			for (const condition of def.unlockConditions) {
				if (!this.evaluateCondition(condition)) return false;
			}
		}

		return true;
	}

	/**
	 * Evaluate an unlock condition.
	 *
	 * @param condition - Condition to evaluate
	 * @returns Whether condition is met
	 */
	private evaluateCondition(condition: {
		type: string;
		id?: string;
		phase?: number;
		amount?: DecimalSource;
		level?: number;
	}): boolean {
		switch (condition.type) {
			case 'phase':
				return this.currentPhase >= (condition.phase ?? 1);

			case 'resource':
				if (!condition.id) return false;
				return gte(this.resources.getAmount(condition.id), D(condition.amount ?? 0));

			case 'upgrade':
				if (!condition.id) return false;
				return this.getLevel(condition.id) >= (condition.level ?? 1);

			case 'producer':
				if (!condition.id || !this.producers) return false;
				return this.producers.getLevel(condition.id) >= (condition.level ?? 1);

			case 'achievement':
				if (!condition.id || !this.context) return false;
				return this.context.hasAchievement(condition.id);

			default:
				return false;
		}
	}

	/**
	 * Apply effects for an upgrade level change.
	 *
	 * @param id - Upgrade ID
	 * @param previousLevel - Previous level
	 * @param newLevel - New level
	 */
	private applyEffects(id: string, previousLevel: number, newLevel: number): void {
		const def = this.definitions.get(id);
		if (!def) return;

		// Add multipliers to producer pipeline if available
		if (this.producers) {
			for (const effect of def.effects) {
				if (effect.type === 'multiplier') {
					let value = D(effect.value);
					if (effect.scalesWithLevel) {
						if (effect.scalingType === 'exponential') {
							value = pow(D(effect.scalingFactor ?? effect.value), newLevel);
						} else {
							value = add(ONE, mul(sub(value, ONE), newLevel));
						}
					}

					this.producers.addMultiplier(
						`upgrade_${id}`,
						def.name,
						value,
						'upgrade',
						effect.target === 'all' ? '' : effect.target,
						false
					);
				}
			}
		}

		// Handle unlock effects
		for (const effect of def.effects) {
			if (effect.type === 'unlock' && previousLevel === 0 && newLevel > 0) {
				// Trigger unlock
				this.events.emit('upgrade_unlocked', {
					upgradeId: effect.unlockId,
					name: effect.unlockId,
					category: effect.unlockType
				});
			}
		}
	}

	/**
	 * Reapply all effects from owned upgrades.
	 * Called after deserialization.
	 */
	private reapplyAllEffects(): void {
		for (const [id, upgradeState] of Object.entries(this.state)) {
			if (upgradeState.level > 0) {
				this.applyEffects(id, 0, upgradeState.level);
			}
		}
	}

	/**
	 * Apply starting bonuses from eternal upgrades.
	 */
	private applyStartingBonuses(): void {
		const effects = this.getActiveEffects('starting_bonus');

		for (const { effect, level } of effects) {
			if (effect.type !== 'starting_bonus') continue;

			let amount = D(effect.amount);
			// Could scale with level if needed
			amount = mul(amount, level);

			this.resources.add(effect.resourceId, amount);
		}
	}

	/**
	 * Calculate total multiplier for a target.
	 *
	 * @param target - Effect target
	 * @returns Combined multiplier
	 */
	private calculateTotalMultiplier(target: string): Decimal {
		return this.getMultiplier(target);
	}

	/**
	 * Calculate total click bonus.
	 * Returns { additive, multiplicative } so Game.click() can apply in correct order.
	 *
	 * @returns Object with additive and multiplicative bonuses
	 */
	private calculateTotalClickBonus(): Decimal {
		let additive = ZERO;
		let multiplicative = ONE;

		const effects = this.getActiveEffects('click');
		for (const { effect, level } of effects) {
			if (effect.type !== 'click') continue;

			let value = D(effect.value);

			// Scale with level for repeatable upgrades
			if (effect.mode === 'additive') {
				// Additive bonuses stack per level (e.g., +1 per level = +10 at level 10)
				additive = add(additive, mul(value, level));
			} else {
				// Multiplicative bonuses compound per level (e.g., 1.5^level)
				multiplicative = mul(multiplicative, pow(value, level));
			}
		}

		// Correct order: (base + additive) * multiplicative
		// Return the total multiplier to apply to base click (which is 1)
		// So: base(1) + additive, then * multiplicative
		return mul(add(ONE, additive), multiplicative);
	}

	/**
	 * Get click bonus components separately for proper application order.
	 *
	 * @returns Object with additive and multiplicative components
	 */
	getClickBonusComponents(): { additive: Decimal; multiplicative: Decimal } {
		let additive = ZERO;
		let multiplicative = ONE;

		const effects = this.getActiveEffects('click');
		for (const { effect, level } of effects) {
			if (effect.type !== 'click') continue;

			let value = D(effect.value);

			if (effect.mode === 'additive') {
				additive = add(additive, mul(value, level));
			} else {
				multiplicative = mul(multiplicative, pow(value, level));
			}
		}

		return { additive, multiplicative };
	}
}
