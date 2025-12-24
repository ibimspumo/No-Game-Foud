/**
 * @fileoverview Number formatting utilities for display.
 * Provides human-readable formatting for big numbers with multiple notation styles.
 *
 * @module engine/utils/format
 */

import { Decimal, type DecimalSource, D } from './decimal';

/**
 * Available notation styles for number formatting.
 */
export type NotationStyle = 'scientific' | 'engineering' | 'mixed' | 'letters';

/**
 * Letter suffixes for "letters" notation style.
 * Follows standard naming: K, M, B, T, Qa, Qi, Sx, Sp, Oc, No, Dc...
 */
const LETTER_SUFFIXES = [
	'', // 10^0
	'K', // 10^3 Thousand
	'M', // 10^6 Million
	'B', // 10^9 Billion
	'T', // 10^12 Trillion
	'Qa', // 10^15 Quadrillion
	'Qi', // 10^18 Quintillion
	'Sx', // 10^21 Sextillion
	'Sp', // 10^24 Septillion
	'Oc', // 10^27 Octillion
	'No', // 10^30 Nonillion
	'Dc', // 10^33 Decillion
	'UDc', // 10^36 Undecillion
	'DDc', // 10^39 Duodecillion
	'TDc', // 10^42 Tredecillion
	'QaDc', // 10^45 Quattuordecillion
	'QiDc', // 10^48 Quindecillion
	'SxDc', // 10^51 Sexdecillion
	'SpDc', // 10^54 Septendecillion
	'OcDc', // 10^57 Octodecillion
	'NoDc', // 10^60 Novemdecillion
	'Vg', // 10^63 Vigintillion
];

/**
 * Configuration options for number formatting.
 */
export interface FormatOptions {
	/**
	 * Notation style to use.
	 * - 'scientific': Always use e notation (1.23e6)
	 * - 'engineering': Use e notation with exponents divisible by 3 (1.23e6)
	 * - 'mixed': Use letters for small numbers, scientific for large
	 * - 'letters': Use letter suffixes (1.23M)
	 * @default 'mixed'
	 */
	notation?: NotationStyle;

	/**
	 * Number of decimal places to show.
	 * @default 2
	 */
	precision?: number;

	/**
	 * Threshold above which to switch to scientific notation (for 'mixed' mode).
	 * @default 1e33
	 */
	scientificThreshold?: number;

	/**
	 * Whether to show + sign for positive numbers.
	 * @default false
	 */
	showPositiveSign?: boolean;

	/**
	 * Whether to use commas for grouping (for small numbers).
	 * @default true
	 */
	useCommas?: boolean;
}

/**
 * Default formatting options.
 */
const DEFAULT_FORMAT_OPTIONS: Required<FormatOptions> = {
	notation: 'mixed',
	precision: 2,
	scientificThreshold: 1e33,
	showPositiveSign: false,
	useCommas: true
};

/**
 * Format a number for display.
 *
 * @param value - The number to format
 * @param options - Formatting options
 * @returns Formatted string
 *
 * @example
 * ```typescript
 * formatNumber(1234.567);        // "1,234.57"
 * formatNumber(1234567);         // "1.23M"
 * formatNumber(1e20);            // "100.00Qi"
 * formatNumber(1e50);            // "1.00e50"
 * formatNumber(1e20, { notation: 'scientific' }); // "1.00e20"
 * ```
 */
export function formatNumber(
	value: DecimalSource,
	options: FormatOptions = {}
): string {
	const opts = { ...DEFAULT_FORMAT_OPTIONS, ...options };
	const decimal = D(value);

	// Handle special cases
	if (Number.isNaN(decimal.mag)) {
		return 'NaN';
	}
	if (!decimal.isFinite()) {
		return decimal.gt(0) ? 'Infinity' : '-Infinity';
	}
	if (decimal.eq(0)) {
		return '0';
	}

	// Handle negative numbers
	const isNegative = decimal.lt(0);
	const absValue = decimal.abs();

	let result: string;

	switch (opts.notation) {
		case 'scientific':
			result = formatScientific(absValue, opts.precision);
			break;
		case 'engineering':
			result = formatEngineering(absValue, opts.precision);
			break;
		case 'letters':
			result = formatLetters(absValue, opts.precision);
			break;
		case 'mixed':
		default:
			result = formatMixed(absValue, opts.precision, opts.scientificThreshold, opts.useCommas);
			break;
	}

	// Apply sign
	if (isNegative) {
		result = '-' + result;
	} else if (opts.showPositiveSign && decimal.gt(0)) {
		result = '+' + result;
	}

	return result;
}

/**
 * Format using scientific notation.
 *
 * @param value - Positive Decimal value
 * @param precision - Decimal places
 * @returns Formatted string like "1.23e45"
 */
function formatScientific(value: Decimal, precision: number): string {
	if (value.lt(1e-6)) {
		// Very small numbers
		return value.toExponential(precision);
	}
	if (value.lt(1000)) {
		// Small numbers - no exponent needed
		return value.toFixed(precision);
	}
	return value.toExponential(precision);
}

/**
 * Format using engineering notation (exponents divisible by 3).
 *
 * @param value - Positive Decimal value
 * @param precision - Decimal places
 * @returns Formatted string like "123.45e6"
 */
function formatEngineering(value: Decimal, precision: number): string {
	if (value.lt(1000)) {
		return value.toFixed(precision);
	}

	const exponent = Math.floor(value.log10().toNumber());
	const engExponent = Math.floor(exponent / 3) * 3;
	const mantissa = value.div(Decimal.pow(10, engExponent));

	return `${mantissa.toFixed(precision)}e${engExponent}`;
}

/**
 * Format using letter suffixes.
 *
 * @param value - Positive Decimal value
 * @param precision - Decimal places
 * @returns Formatted string like "1.23M"
 */
function formatLetters(value: Decimal, precision: number): string {
	if (value.lt(1000)) {
		return value.toFixed(precision);
	}

	const exponent = Math.floor(value.log10().toNumber());
	const suffixIndex = Math.floor(exponent / 3);

	if (suffixIndex >= LETTER_SUFFIXES.length) {
		// Fall back to scientific for very large numbers
		return value.toExponential(precision);
	}

	const suffix = LETTER_SUFFIXES[suffixIndex];
	const divisor = Decimal.pow(10, suffixIndex * 3);
	const mantissa = value.div(divisor);

	return `${mantissa.toFixed(precision)}${suffix}`;
}

/**
 * Format using mixed notation (letters for small, scientific for large).
 *
 * @param value - Positive Decimal value
 * @param precision - Decimal places
 * @param threshold - When to switch to scientific
 * @param useCommas - Whether to use comma grouping
 * @returns Formatted string
 */
function formatMixed(
	value: Decimal,
	precision: number,
	threshold: number,
	useCommas: boolean
): string {
	if (value.lt(1000)) {
		const formatted = value.toFixed(precision);
		if (useCommas && value.gte(1000)) {
			return addCommas(formatted);
		}
		return formatted;
	}

	if (value.lt(threshold)) {
		return formatLetters(value, precision);
	}

	return value.toExponential(precision);
}

/**
 * Add comma separators to a number string.
 *
 * @param numStr - Number string to add commas to
 * @returns String with comma separators
 */
function addCommas(numStr: string): string {
	const parts = numStr.split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
}

/**
 * Format a number as a percentage.
 *
 * @param value - The value to format (0.5 = 50%)
 * @param precision - Decimal places
 * @returns Formatted percentage string
 *
 * @example
 * ```typescript
 * formatPercent(0.5);     // "50.00%"
 * formatPercent(1.5);     // "150.00%"
 * formatPercent(0.123, 1); // "12.3%"
 * ```
 */
export function formatPercent(value: DecimalSource, precision: number = 2): string {
	const decimal = D(value);
	const percent = decimal.mul(100);
	return `${percent.toFixed(precision)}%`;
}

/**
 * Format a number as a multiplier.
 *
 * @param value - The multiplier value
 * @param precision - Decimal places
 * @returns Formatted multiplier string
 *
 * @example
 * ```typescript
 * formatMultiplier(2);     // "x2.00"
 * formatMultiplier(1.5);   // "x1.50"
 * formatMultiplier(0.5);   // "x0.50"
 * ```
 */
export function formatMultiplier(value: DecimalSource, precision: number = 2): string {
	const decimal = D(value);
	if (decimal.gte(1000)) {
		return `x${formatNumber(decimal, { notation: 'mixed', precision })}`;
	}
	return `x${decimal.toFixed(precision)}`;
}

/**
 * Format a duration in seconds to human-readable format.
 *
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 *
 * @example
 * ```typescript
 * formatDuration(45);      // "45s"
 * formatDuration(125);     // "2m 5s"
 * formatDuration(3725);    // "1h 2m 5s"
 * formatDuration(90061);   // "1d 1h 1m 1s"
 * ```
 */
export function formatDuration(seconds: number): string {
	if (seconds < 0) {
		return '0s';
	}

	const days = Math.floor(seconds / 86400);
	const hours = Math.floor((seconds % 86400) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	const parts: string[] = [];

	if (days > 0) {
		parts.push(`${days}d`);
	}
	if (hours > 0) {
		parts.push(`${hours}h`);
	}
	if (minutes > 0) {
		parts.push(`${minutes}m`);
	}
	if (secs > 0 || parts.length === 0) {
		parts.push(`${secs}s`);
	}

	return parts.join(' ');
}

/**
 * Format a duration in a compact format (for display in tight spaces).
 *
 * @param seconds - Duration in seconds
 * @returns Compact formatted duration
 *
 * @example
 * ```typescript
 * formatDurationCompact(45);      // "0:45"
 * formatDurationCompact(125);     // "2:05"
 * formatDurationCompact(3725);    // "1:02:05"
 * ```
 */
export function formatDurationCompact(seconds: number): string {
	if (seconds < 0) {
		return '0:00';
	}

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}
	return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format a rate (per second) in a human-readable way.
 *
 * @param rate - Rate per second
 * @param unit - Unit name (default: 's' for seconds)
 * @param options - Format options
 * @returns Formatted rate string
 *
 * @example
 * ```typescript
 * formatRate(1.5);           // "1.50/s"
 * formatRate(1e6);           // "1.00M/s"
 * formatRate(0.5, 'min');    // "0.50/min"
 * ```
 */
export function formatRate(
	rate: DecimalSource,
	unit: string = 's',
	options: FormatOptions = {}
): string {
	const formatted = formatNumber(rate, options);
	return `${formatted}/${unit}`;
}

/**
 * Format a cost/price display.
 *
 * @param cost - The cost amount
 * @param resourceName - Name of the resource
 * @param options - Format options
 * @returns Formatted cost string
 *
 * @example
 * ```typescript
 * formatCost(100, 'pixels');      // "100 pixels"
 * formatCost(1e6, 'pixels');      // "1.00M pixels"
 * ```
 */
export function formatCost(
	cost: DecimalSource,
	resourceName: string,
	options: FormatOptions = {}
): string {
	const formatted = formatNumber(cost, options);
	return `${formatted} ${resourceName}`;
}

/**
 * Get a formatted ordinal number (1st, 2nd, 3rd, etc.).
 *
 * @param n - The number
 * @returns Ordinal string
 *
 * @example
 * ```typescript
 * formatOrdinal(1);  // "1st"
 * formatOrdinal(2);  // "2nd"
 * formatOrdinal(3);  // "3rd"
 * formatOrdinal(11); // "11th"
 * formatOrdinal(21); // "21st"
 * ```
 */
export function formatOrdinal(n: number): string {
	const suffixes = ['th', 'st', 'nd', 'rd'];
	const remainder = n % 100;

	if (remainder >= 11 && remainder <= 13) {
		return `${n}th`;
	}

	const suffix = suffixes[n % 10] || suffixes[0];
	return `${n}${suffix}`;
}

/**
 * Parse a formatted number string back to a Decimal.
 * Handles common formats including suffixes and scientific notation.
 *
 * @param str - The formatted string
 * @returns Parsed Decimal or null if invalid
 *
 * @example
 * ```typescript
 * parseFormattedNumber("1.5M");    // Decimal(1500000)
 * parseFormattedNumber("1.23e6"); // Decimal(1230000)
 * parseFormattedNumber("1,234");  // Decimal(1234)
 * ```
 */
export function parseFormattedNumber(str: string): Decimal | null {
	if (!str || typeof str !== 'string') {
		return null;
	}

	// Remove commas and whitespace
	let cleaned = str.replace(/,/g, '').trim();

	// Check for letter suffixes
	for (let i = LETTER_SUFFIXES.length - 1; i > 0; i--) {
		const suffix = LETTER_SUFFIXES[i];
		if (cleaned.endsWith(suffix)) {
			const numPart = cleaned.slice(0, -suffix.length);
			const num = parseFloat(numPart);
			if (!isNaN(num)) {
				return D(num).mul(Decimal.pow(10, i * 3));
			}
			return null;
		}
	}

	// Try parsing as regular number or scientific notation
	try {
		const decimal = new Decimal(cleaned);
		if (Number.isNaN(decimal.mag)) {
			return null;
		}
		return decimal;
	} catch {
		return null;
	}
}
