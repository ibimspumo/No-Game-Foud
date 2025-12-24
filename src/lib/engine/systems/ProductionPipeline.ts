/**
 * @fileoverview Production Pipeline for calculating final production rates.
 * Handles multiplier stacking, bonus application, and production calculation.
 *
 * The pipeline follows this order:
 * 1. Base Production (from producers)
 * 2. × Building Multipliers (multiplicative stacking)
 * 3. × Upgrade Multipliers (additive bonuses converted to multiplier)
 * 4. × Phase Bonuses (multiplicative)
 * 5. × Eternal Multipliers (primordial pixels, etc.)
 * = Final Production Rate
 *
 * @module engine/systems/ProductionPipeline
 */

import { Decimal, D, ZERO, ONE, type DecimalSource } from '../utils/decimal';

/**
 * Source type for a multiplier, used for tracking and debugging.
 */
export type MultiplierSource =
	| 'producer'      // From producers/buildings
	| 'upgrade'       // From purchased upgrades
	| 'achievement'   // From achievements
	| 'phase'         // Phase-specific bonuses
	| 'eternal'       // Eternal/meta multipliers
	| 'temporary'     // Temporary buffs
	| 'other';        // Other sources

/**
 * How the multiplier stacks with others.
 */
export type MultiplierStackingType = 'multiplicative' | 'additive';

/**
 * Individual multiplier entry.
 */
export interface Multiplier {
	/** Unique identifier for this multiplier */
	id: string;

	/** Display name */
	name: string;

	/** Description of where this multiplier comes from */
	description: string;

	/** The multiplier value */
	value: Decimal;

	/** Source type for categorization */
	source: MultiplierSource;

	/** How this multiplier stacks */
	stackingType: MultiplierStackingType;

	/** Which resource this affects (empty = all) */
	resourceId: string;

	/** Priority for ordering (higher = applied later) */
	priority: number;

	/** Whether this multiplier is currently active */
	active: boolean;

	/** Optional condition function for dynamic multipliers */
	condition?: () => boolean;
}

/**
 * Input for creating a multiplier.
 */
export interface MultiplierInput {
	id: string;
	name: string;
	description?: string;
	value: DecimalSource;
	source: MultiplierSource;
	stackingType: MultiplierStackingType;
	resourceId?: string;
	priority?: number;
	active?: boolean;
	condition?: () => boolean;
}

/**
 * Breakdown of production calculation for display/debugging.
 */
export interface ProductionBreakdown {
	/** Base production rate */
	base: Decimal;

	/** Total multiplicative factor */
	multiplicativeFactor: Decimal;

	/** Total additive bonus (as percentage, e.g., 0.5 = +50%) */
	additiveBonus: Decimal;

	/** Final calculated rate */
	final: Decimal;

	/** All active multipliers contributing to this rate */
	activeMultipliers: Multiplier[];
}

/**
 * Production Pipeline class.
 *
 * Manages multipliers and calculates final production rates for resources.
 * Supports both additive and multiplicative stacking, with source tracking.
 *
 * @example
 * ```typescript
 * const pipeline = new ProductionPipeline();
 *
 * // Add a multiplicative multiplier
 * pipeline.addMultiplier({
 *   id: 'pixel-gen-1',
 *   name: 'Pixel Generator',
 *   value: 2,
 *   source: 'producer',
 *   stackingType: 'multiplicative',
 *   resourceId: 'pixels'
 * });
 *
 * // Add an additive bonus
 * pipeline.addMultiplier({
 *   id: 'production-boost',
 *   name: 'Production Boost',
 *   value: 0.5, // +50%
 *   source: 'upgrade',
 *   stackingType: 'additive',
 *   resourceId: 'pixels'
 * });
 *
 * // Calculate final rate
 * const baseRate = D(10);
 * const finalRate = pipeline.calculate('pixels', baseRate);
 * ```
 */
export class ProductionPipeline {
	/**
	 * Map of multiplier ID to multiplier data.
	 */
	private multipliers: Map<string, Multiplier> = new Map();

	/**
	 * Cached calculations per resource (invalidated on changes).
	 */
	private cache: Map<string, {
		multiplicative: Decimal;
		additive: Decimal;
		timestamp: number;
	}> = new Map();

	/**
	 * Whether the cache is dirty and needs recalculation.
	 */
	private cacheDirty: boolean = true;

	/**
	 * Add or update a multiplier.
	 *
	 * @param input - Multiplier configuration
	 */
	addMultiplier(input: MultiplierInput): void {
		const multiplier: Multiplier = {
			id: input.id,
			name: input.name,
			description: input.description ?? '',
			value: D(input.value),
			source: input.source,
			stackingType: input.stackingType,
			resourceId: input.resourceId ?? '',
			priority: input.priority ?? 0,
			active: input.active ?? true,
			condition: input.condition
		};

		this.multipliers.set(input.id, multiplier);
		this.invalidateCache();
	}

	/**
	 * Remove a multiplier by ID.
	 *
	 * @param id - Multiplier ID to remove
	 * @returns Whether a multiplier was removed
	 */
	removeMultiplier(id: string): boolean {
		const removed = this.multipliers.delete(id);
		if (removed) {
			this.invalidateCache();
		}
		return removed;
	}

	/**
	 * Update a multiplier's value.
	 *
	 * @param id - Multiplier ID
	 * @param value - New value
	 * @returns Whether the multiplier was found and updated
	 */
	updateMultiplierValue(id: string, value: DecimalSource): boolean {
		const multiplier = this.multipliers.get(id);
		if (!multiplier) return false;

		multiplier.value = D(value);
		this.invalidateCache();
		return true;
	}

	/**
	 * Set whether a multiplier is active.
	 *
	 * @param id - Multiplier ID
	 * @param active - Whether the multiplier is active
	 * @returns Whether the multiplier was found and updated
	 */
	setMultiplierActive(id: string, active: boolean): boolean {
		const multiplier = this.multipliers.get(id);
		if (!multiplier) return false;

		multiplier.active = active;
		this.invalidateCache();
		return true;
	}

	/**
	 * Get a multiplier by ID.
	 *
	 * @param id - Multiplier ID
	 * @returns Multiplier or undefined
	 */
	getMultiplier(id: string): Multiplier | undefined {
		return this.multipliers.get(id);
	}

	/**
	 * Check if a multiplier exists.
	 *
	 * @param id - Multiplier ID
	 * @returns Whether the multiplier exists
	 */
	hasMultiplier(id: string): boolean {
		return this.multipliers.has(id);
	}

	/**
	 * Get all multipliers for a specific resource.
	 *
	 * @param resourceId - Resource ID (empty string = global multipliers only)
	 * @returns Array of applicable multipliers
	 */
	getMultipliersForResource(resourceId: string): Multiplier[] {
		const result: Multiplier[] = [];

		for (const mult of this.multipliers.values()) {
			// Include if: active AND (global OR matches resource)
			if (mult.active && (mult.resourceId === '' || mult.resourceId === resourceId)) {
				// Check condition if present
				if (!mult.condition || mult.condition()) {
					result.push(mult);
				}
			}
		}

		// Sort by priority (lower first, so higher priority applies later = more impact)
		return result.sort((a, b) => a.priority - b.priority);
	}

	/**
	 * Get all multipliers by source type.
	 *
	 * @param source - Source type to filter by
	 * @returns Array of multipliers from that source
	 */
	getMultipliersBySource(source: MultiplierSource): Multiplier[] {
		const result: Multiplier[] = [];

		for (const mult of this.multipliers.values()) {
			if (mult.source === source && mult.active) {
				result.push(mult);
			}
		}

		return result;
	}

	/**
	 * Calculate the final production rate for a resource.
	 *
	 * @param resourceId - Resource ID
	 * @param baseRate - Base production rate
	 * @returns Final production rate after all multipliers
	 */
	calculate(resourceId: string, baseRate: DecimalSource): Decimal {
		const base = D(baseRate);
		if (base.lte(0)) return ZERO;

		const multipliers = this.getMultipliersForResource(resourceId);

		// Separate into multiplicative and additive
		let multiplicativeFactor = ONE;
		let additiveBonus = ZERO;

		for (const mult of multipliers) {
			if (mult.stackingType === 'multiplicative') {
				multiplicativeFactor = multiplicativeFactor.mul(mult.value);
			} else {
				additiveBonus = additiveBonus.add(mult.value);
			}
		}

		// Apply: base × multiplicative × (1 + additive)
		const additiveFactor = ONE.add(additiveBonus);
		return base.mul(multiplicativeFactor).mul(additiveFactor);
	}

	/**
	 * Get a detailed breakdown of production calculation.
	 *
	 * @param resourceId - Resource ID
	 * @param baseRate - Base production rate
	 * @returns Production breakdown with all factors
	 */
	getBreakdown(resourceId: string, baseRate: DecimalSource): ProductionBreakdown {
		const base = D(baseRate);
		const multipliers = this.getMultipliersForResource(resourceId);

		let multiplicativeFactor = ONE;
		let additiveBonus = ZERO;

		for (const mult of multipliers) {
			if (mult.stackingType === 'multiplicative') {
				multiplicativeFactor = multiplicativeFactor.mul(mult.value);
			} else {
				additiveBonus = additiveBonus.add(mult.value);
			}
		}

		const additiveFactor = ONE.add(additiveBonus);
		const final = base.mul(multiplicativeFactor).mul(additiveFactor);

		return {
			base,
			multiplicativeFactor,
			additiveBonus,
			final,
			activeMultipliers: multipliers
		};
	}

	/**
	 * Get the total multiplicative factor for a resource.
	 *
	 * @param resourceId - Resource ID
	 * @returns Total multiplicative factor
	 */
	getTotalMultiplicative(resourceId: string): Decimal {
		const multipliers = this.getMultipliersForResource(resourceId);
		let factor = ONE;

		for (const mult of multipliers) {
			if (mult.stackingType === 'multiplicative') {
				factor = factor.mul(mult.value);
			}
		}

		return factor;
	}

	/**
	 * Get the total additive bonus for a resource.
	 *
	 * @param resourceId - Resource ID
	 * @returns Total additive bonus (as decimal, e.g., 0.5 = +50%)
	 */
	getTotalAdditive(resourceId: string): Decimal {
		const multipliers = this.getMultipliersForResource(resourceId);
		let bonus = ZERO;

		for (const mult of multipliers) {
			if (mult.stackingType === 'additive') {
				bonus = bonus.add(mult.value);
			}
		}

		return bonus;
	}

	/**
	 * Get the combined multiplier (multiplicative × (1 + additive)).
	 *
	 * @param resourceId - Resource ID
	 * @returns Combined multiplier
	 */
	getCombinedMultiplier(resourceId: string): Decimal {
		const multiplicative = this.getTotalMultiplicative(resourceId);
		const additive = this.getTotalAdditive(resourceId);
		return multiplicative.mul(ONE.add(additive));
	}

	/**
	 * Clear all multipliers.
	 */
	clear(): void {
		this.multipliers.clear();
		this.invalidateCache();
	}

	/**
	 * Clear multipliers by source type.
	 *
	 * @param source - Source type to clear
	 * @returns Number of multipliers removed
	 */
	clearBySource(source: MultiplierSource): number {
		let removed = 0;
		for (const [id, mult] of this.multipliers) {
			if (mult.source === source) {
				this.multipliers.delete(id);
				removed++;
			}
		}

		if (removed > 0) {
			this.invalidateCache();
		}

		return removed;
	}

	/**
	 * Get count of active multipliers.
	 *
	 * @returns Number of active multipliers
	 */
	getActiveCount(): number {
		let count = 0;
		for (const mult of this.multipliers.values()) {
			if (mult.active) count++;
		}
		return count;
	}

	/**
	 * Get all multiplier IDs.
	 *
	 * @returns Array of multiplier IDs
	 */
	getAllIds(): string[] {
		return Array.from(this.multipliers.keys());
	}

	/**
	 * Serialize the pipeline state for saving.
	 *
	 * @returns Serialized state
	 */
	serialize(): object {
		const multipliers: Record<string, {
			value: string;
			active: boolean;
		}> = {};

		for (const [id, mult] of this.multipliers) {
			// Only serialize multipliers that might change
			// (producers, upgrades - not phase or achievement which are derived)
			if (mult.source === 'producer' || mult.source === 'upgrade') {
				multipliers[id] = {
					value: mult.value.toString(),
					active: mult.active
				};
			}
		}

		return { multipliers };
	}

	/**
	 * Restore multiplier values from save data.
	 * Note: Multiplier definitions must be re-added first.
	 *
	 * @param data - Previously serialized state
	 */
	deserialize(data: unknown): void {
		const saved = data as {
			multipliers?: Record<string, { value: string; active: boolean }>;
		};

		if (!saved?.multipliers) return;

		for (const [id, savedMult] of Object.entries(saved.multipliers)) {
			const mult = this.multipliers.get(id);
			if (mult) {
				mult.value = D(savedMult.value);
				mult.active = savedMult.active;
			}
		}

		this.invalidateCache();
	}

	/**
	 * Invalidate the calculation cache.
	 */
	private invalidateCache(): void {
		this.cacheDirty = true;
		this.cache.clear();
	}
}
