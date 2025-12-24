/**
 * @fileoverview Decimal utility wrapper for break_eternity.js
 * Provides type-safe BigNumber operations optimized for idle/incremental games.
 * Supports numbers up to 10^(10^308) - far beyond JavaScript's native Number limits.
 *
 * @module engine/utils/decimal
 */

import Decimal from 'break_eternity.js';

// Re-export Decimal class for direct usage when needed
export { Decimal };

/**
 * Represents a big number value that can be used to create a Decimal.
 * Accepts number, string, or existing Decimal instance.
 */
export type DecimalSource = number | string | Decimal;

/**
 * Creates a new Decimal instance from various input types.
 * This is the primary factory function for creating big numbers.
 *
 * @param value - The value to convert to Decimal
 * @returns A new Decimal instance
 *
 * @example
 * const small = D(100);
 * const large = D("1e308");
 * const fromDecimal = D(existingDecimal);
 */
export function D(value: DecimalSource): Decimal {
	if (value instanceof Decimal) {
		return value;
	}
	return new Decimal(value);
}

// ============================================================================
// Common Constants
// ============================================================================

/** Zero constant - use instead of D(0) for performance */
export const ZERO = new Decimal(0);

/** One constant - use instead of D(1) for performance */
export const ONE = new Decimal(1);

/** Two constant - commonly used multiplier */
export const TWO = new Decimal(2);

/** Ten constant - base for many calculations */
export const TEN = new Decimal(10);

/** One hundred constant */
export const HUNDRED = new Decimal(100);

/** One thousand constant */
export const THOUSAND = new Decimal(1000);

/** One million constant (1e6) */
export const MILLION = new Decimal(1e6);

/** One billion constant (1e9) */
export const BILLION = new Decimal(1e9);

/** One trillion constant (1e12) */
export const TRILLION = new Decimal(1e12);

/** Infinity constant */
export const INFINITY = new Decimal(Infinity);

/** Negative infinity constant */
export const NEG_INFINITY = new Decimal(-Infinity);

// ============================================================================
// Arithmetic Helpers
// ============================================================================

/**
 * Safely adds two Decimal values.
 *
 * @param a - First operand
 * @param b - Second operand
 * @returns Sum of a and b
 */
export function add(a: DecimalSource, b: DecimalSource): Decimal {
	return D(a).add(b);
}

/**
 * Safely subtracts b from a.
 *
 * @param a - Value to subtract from
 * @param b - Value to subtract
 * @returns Difference (a - b)
 */
export function sub(a: DecimalSource, b: DecimalSource): Decimal {
	return D(a).sub(b);
}

/**
 * Safely multiplies two Decimal values.
 *
 * @param a - First operand
 * @param b - Second operand
 * @returns Product of a and b
 */
export function mul(a: DecimalSource, b: DecimalSource): Decimal {
	return D(a).mul(b);
}

/**
 * Safely divides a by b.
 * Returns ZERO if b is zero to prevent errors.
 *
 * @param a - Dividend
 * @param b - Divisor
 * @returns Quotient (a / b) or ZERO if b is 0
 */
export function div(a: DecimalSource, b: DecimalSource): Decimal {
	const divisor = D(b);
	if (divisor.eq(0)) {
		return ZERO;
	}
	return D(a).div(divisor);
}

/**
 * Raises a to the power of b.
 *
 * @param a - Base
 * @param b - Exponent
 * @returns a^b
 */
export function pow(a: DecimalSource, b: DecimalSource): Decimal {
	return D(a).pow(b);
}

/**
 * Calculates the square root of a value.
 *
 * @param a - Value to get square root of
 * @returns Square root of a
 */
export function sqrt(a: DecimalSource): Decimal {
	return D(a).sqrt();
}

/**
 * Calculates the natural logarithm of a value.
 *
 * @param a - Value to get ln of
 * @returns ln(a)
 */
export function ln(a: DecimalSource): Decimal {
	return D(a).ln();
}

/**
 * Calculates the base-10 logarithm of a value.
 *
 * @param a - Value to get log10 of
 * @returns log10(a)
 */
export function log10(a: DecimalSource): Decimal {
	return D(a).log10();
}

/**
 * Calculates the logarithm of a value with custom base.
 *
 * @param a - Value to get log of
 * @param base - Logarithm base
 * @returns log_base(a)
 */
export function log(a: DecimalSource, base: DecimalSource): Decimal {
	return D(a).log(D(base));
}

// ============================================================================
// Comparison Helpers
// ============================================================================

/**
 * Checks if a is greater than b.
 *
 * @param a - First value
 * @param b - Second value
 * @returns true if a > b
 */
export function gt(a: DecimalSource, b: DecimalSource): boolean {
	return D(a).gt(b);
}

/**
 * Checks if a is greater than or equal to b.
 *
 * @param a - First value
 * @param b - Second value
 * @returns true if a >= b
 */
export function gte(a: DecimalSource, b: DecimalSource): boolean {
	return D(a).gte(b);
}

/**
 * Checks if a is less than b.
 *
 * @param a - First value
 * @param b - Second value
 * @returns true if a < b
 */
export function lt(a: DecimalSource, b: DecimalSource): boolean {
	return D(a).lt(b);
}

/**
 * Checks if a is less than or equal to b.
 *
 * @param a - First value
 * @param b - Second value
 * @returns true if a <= b
 */
export function lte(a: DecimalSource, b: DecimalSource): boolean {
	return D(a).lte(b);
}

/**
 * Checks if two values are equal.
 *
 * @param a - First value
 * @param b - Second value
 * @returns true if a == b
 */
export function eq(a: DecimalSource, b: DecimalSource): boolean {
	return D(a).eq(b);
}

/**
 * Checks if two values are not equal.
 *
 * @param a - First value
 * @param b - Second value
 * @returns true if a != b
 */
export function neq(a: DecimalSource, b: DecimalSource): boolean {
	return D(a).neq(b);
}

/**
 * Compares two values.
 *
 * @param a - First value
 * @param b - Second value
 * @returns -1 if a < b, 0 if a == b, 1 if a > b
 */
export function cmp(a: DecimalSource, b: DecimalSource): -1 | 0 | 1 {
	return D(a).cmp(b) as -1 | 0 | 1;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Returns the maximum of two values.
 *
 * @param a - First value
 * @param b - Second value
 * @returns The larger of a and b
 */
export function max(a: DecimalSource, b: DecimalSource): Decimal {
	return Decimal.max(a, b);
}

/**
 * Returns the minimum of two values.
 *
 * @param a - First value
 * @param b - Second value
 * @returns The smaller of a and b
 */
export function min(a: DecimalSource, b: DecimalSource): Decimal {
	return Decimal.min(a, b);
}

/**
 * Clamps a value between min and max bounds.
 *
 * @param value - Value to clamp
 * @param minVal - Minimum bound
 * @param maxVal - Maximum bound
 * @returns Clamped value
 */
export function clamp(
	value: DecimalSource,
	minVal: DecimalSource,
	maxVal: DecimalSource
): Decimal {
	return max(minVal, min(value, maxVal));
}

/**
 * Returns the absolute value.
 *
 * @param a - Value
 * @returns |a|
 */
export function abs(a: DecimalSource): Decimal {
	return D(a).abs();
}

/**
 * Returns the floor of a value.
 *
 * @param a - Value
 * @returns floor(a)
 */
export function floor(a: DecimalSource): Decimal {
	return D(a).floor();
}

/**
 * Returns the ceiling of a value.
 *
 * @param a - Value
 * @returns ceil(a)
 */
export function ceil(a: DecimalSource): Decimal {
	return D(a).ceil();
}

/**
 * Rounds a value to the nearest integer.
 *
 * @param a - Value
 * @returns round(a)
 */
export function round(a: DecimalSource): Decimal {
	return D(a).round();
}

/**
 * Checks if a value is finite (not Infinity or NaN).
 *
 * @param a - Value to check
 * @returns true if value is finite
 */
export function isFinite(a: DecimalSource): boolean {
	return D(a).isFinite();
}

/**
 * Checks if a value is NaN.
 *
 * @param a - Value to check
 * @returns true if value is NaN
 */
export function isNaN(a: DecimalSource): boolean {
	const d = D(a);
	return Number.isNaN(d.mag) || Number.isNaN(d.layer) || Number.isNaN(d.sign);
}

/**
 * Checks if a value is positive.
 *
 * @param a - Value to check
 * @returns true if value > 0
 */
export function isPositive(a: DecimalSource): boolean {
	return D(a).gt(0);
}

/**
 * Checks if a value is negative.
 *
 * @param a - Value to check
 * @returns true if value < 0
 */
export function isNegative(a: DecimalSource): boolean {
	return D(a).lt(0);
}

/**
 * Checks if a value is zero.
 *
 * @param a - Value to check
 * @returns true if value == 0
 */
export function isZero(a: DecimalSource): boolean {
	return D(a).eq(0);
}

// ============================================================================
// Idle Game Specific Helpers
// ============================================================================

/**
 * Calculates production over a time period.
 * Commonly used for calculating resources gained.
 *
 * @param rate - Production rate per second
 * @param deltaTime - Time elapsed in seconds
 * @returns Total production (rate * deltaTime)
 */
export function calculateProduction(rate: DecimalSource, deltaTime: number): Decimal {
	return D(rate).mul(deltaTime);
}

/**
 * Calculates exponential cost for upgrades/buildings.
 * Formula: baseCost * multiplier^owned
 *
 * @param baseCost - Initial cost
 * @param multiplier - Cost scaling factor
 * @param owned - Number currently owned
 * @returns Cost for next purchase
 */
export function calculateExponentialCost(
	baseCost: DecimalSource,
	multiplier: DecimalSource,
	owned: number
): Decimal {
	return D(baseCost).mul(D(multiplier).pow(owned));
}

/**
 * Calculates the sum of a geometric series (useful for bulk buy costs).
 * Formula: baseCost * (multiplier^count - 1) / (multiplier - 1)
 *
 * @param baseCost - Initial cost
 * @param multiplier - Cost scaling factor
 * @param startOwned - Current amount owned
 * @param count - Number to purchase
 * @returns Total cost for purchasing count items
 */
export function calculateBulkCost(
	baseCost: DecimalSource,
	multiplier: DecimalSource,
	startOwned: number,
	count: number
): Decimal {
	const base = D(baseCost);
	const mult = D(multiplier);

	if (mult.eq(1)) {
		return base.mul(count);
	}

	const firstCost = base.mul(mult.pow(startOwned));
	return firstCost.mul(mult.pow(count).sub(1)).div(mult.sub(1));
}

/**
 * Calculates how many items can be bought with given resources.
 *
 * @param available - Resources available
 * @param baseCost - Initial cost
 * @param multiplier - Cost scaling factor
 * @param currentOwned - Current amount owned
 * @returns Maximum purchasable amount
 */
export function calculateMaxAffordable(
	available: DecimalSource,
	baseCost: DecimalSource,
	multiplier: DecimalSource,
	currentOwned: number
): number {
	const avail = D(available);
	const base = D(baseCost);
	const mult = D(multiplier);

	if (avail.lte(0) || base.lte(0)) {
		return 0;
	}

	// For linear costs (multiplier = 1)
	if (mult.eq(1)) {
		return avail.div(base).floor().toNumber();
	}

	// For exponential costs, solve: available = baseCost * mult^owned * (mult^n - 1) / (mult - 1)
	// n = log_mult(available * (mult - 1) / (baseCost * mult^owned) + 1)
	const currentCost = base.mul(mult.pow(currentOwned));
	const n = avail.mul(mult.sub(1)).div(currentCost).add(1).log(mult).floor();

	return Math.max(0, n.toNumber());
}

/**
 * Applies a multiplier boost to a value, commonly used for upgrades.
 *
 * @param base - Base value
 * @param multiplier - Multiplier to apply
 * @returns Boosted value
 */
export function applyMultiplier(base: DecimalSource, multiplier: DecimalSource): Decimal {
	return D(base).mul(multiplier);
}

/**
 * Applies an additive bonus as a percentage.
 *
 * @param base - Base value
 * @param bonusPercent - Bonus as percentage (e.g., 50 for +50%)
 * @returns Boosted value
 */
export function applyPercentBonus(base: DecimalSource, bonusPercent: DecimalSource): Decimal {
	return D(base).mul(D(bonusPercent).div(100).add(1));
}

// ============================================================================
// Serialization Helpers
// ============================================================================

/**
 * Converts a Decimal to a string for serialization.
 * Use this when saving to localStorage or sending over network.
 *
 * @param value - Decimal to serialize
 * @returns String representation
 */
export function serialize(value: Decimal): string {
	return value.toString();
}

/**
 * Deserializes a string back to a Decimal.
 * Returns ZERO for invalid input.
 *
 * @param value - String to deserialize
 * @returns Decimal value or ZERO if invalid
 */
export function deserialize(value: string | undefined | null): Decimal {
	if (value === undefined || value === null || value === '') {
		return ZERO;
	}
	try {
		return new Decimal(value);
	} catch {
		return ZERO;
	}
}
