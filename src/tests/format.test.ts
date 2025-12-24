/**
 * @fileoverview Unit tests for number formatting utilities.
 */

import { describe, it, expect } from 'vitest';
import {
	formatNumber,
	formatPercent,
	formatMultiplier,
	formatDuration,
	formatDurationCompact,
	formatRate,
	formatOrdinal,
	parseFormattedNumber
} from '$lib/engine/utils/format';
import { D } from '$lib/engine/utils/decimal';

describe('formatNumber', () => {
	describe('Small Numbers', () => {
		it('should format small integers', () => {
			expect(formatNumber(0)).toBe('0');
			expect(formatNumber(1)).toBe('1.00');
			expect(formatNumber(100)).toBe('100.00');
			expect(formatNumber(999)).toBe('999.00');
		});

		it('should format small decimals', () => {
			expect(formatNumber(1.5)).toBe('1.50');
			expect(formatNumber(99.99)).toBe('99.99');
		});
	});

	describe('Medium Numbers (Letters)', () => {
		it('should format thousands', () => {
			expect(formatNumber(1000)).toBe('1.00K');
			expect(formatNumber(1500)).toBe('1.50K');
			expect(formatNumber(999999)).toBe('1000.00K');
		});

		it('should format millions', () => {
			expect(formatNumber(1000000)).toBe('1.00M');
			expect(formatNumber(2500000)).toBe('2.50M');
		});

		it('should format billions', () => {
			expect(formatNumber(1e9)).toBe('1.00B');
			expect(formatNumber(1.5e9)).toBe('1.50B');
		});

		it('should format trillions', () => {
			expect(formatNumber(1e12)).toBe('1.00T');
		});
	});

	describe('Scientific Notation', () => {
		it('should switch to scientific for very large numbers', () => {
			const large = D('1e50');
			const result = formatNumber(large);
			expect(result).toMatch(/\de\d+/);
		});

		it('should respect notation option', () => {
			expect(formatNumber(1000000, { notation: 'scientific' })).toMatch(/\de\+?\d+/);
		});
	});

	describe('Edge Cases', () => {
		it('should handle zero', () => {
			expect(formatNumber(0)).toBe('0');
		});

		it('should handle negative numbers', () => {
			expect(formatNumber(-100)).toBe('-100.00');
			expect(formatNumber(-1000)).toBe('-1.00K');
		});
	});

	describe('Precision', () => {
		it('should respect precision option', () => {
			expect(formatNumber(1.234, { precision: 1 })).toBe('1.2');
			expect(formatNumber(1.234, { precision: 3 })).toBe('1.234');
		});
	});
});

describe('formatPercent', () => {
	it('should format percentages', () => {
		expect(formatPercent(0.5)).toBe('50.00%');
		expect(formatPercent(1)).toBe('100.00%');
		expect(formatPercent(1.5)).toBe('150.00%');
		expect(formatPercent(0.123)).toBe('12.30%');
	});

	it('should respect precision', () => {
		expect(formatPercent(0.5, 0)).toBe('50%');
		expect(formatPercent(0.123, 1)).toBe('12.3%');
	});
});

describe('formatMultiplier', () => {
	it('should format multipliers', () => {
		expect(formatMultiplier(2)).toBe('x2.00');
		expect(formatMultiplier(1.5)).toBe('x1.50');
		expect(formatMultiplier(0.5)).toBe('x0.50');
	});

	it('should format large multipliers', () => {
		const result = formatMultiplier(1000000);
		expect(result).toBe('x1.00M');
	});
});

describe('formatDuration', () => {
	it('should format seconds', () => {
		expect(formatDuration(0)).toBe('0s');
		expect(formatDuration(45)).toBe('45s');
	});

	it('should format minutes and seconds', () => {
		expect(formatDuration(60)).toBe('1m');
		expect(formatDuration(125)).toBe('2m 5s');
	});

	it('should format hours, minutes, seconds', () => {
		expect(formatDuration(3600)).toBe('1h');
		expect(formatDuration(3725)).toBe('1h 2m 5s');
	});

	it('should format days', () => {
		expect(formatDuration(86400)).toBe('1d');
		expect(formatDuration(90061)).toBe('1d 1h 1m 1s');
	});
});

describe('formatDurationCompact', () => {
	it('should format as M:SS', () => {
		expect(formatDurationCompact(45)).toBe('0:45');
		expect(formatDurationCompact(125)).toBe('2:05');
	});

	it('should format as H:MM:SS', () => {
		expect(formatDurationCompact(3725)).toBe('1:02:05');
	});
});

describe('formatRate', () => {
	it('should format rate per second', () => {
		expect(formatRate(1.5)).toBe('1.50/s');
		expect(formatRate(1000)).toBe('1.00K/s');
	});

	it('should support custom units', () => {
		expect(formatRate(0.5, 'min')).toBe('0.50/min');
	});
});

describe('formatOrdinal', () => {
	it('should format ordinals correctly', () => {
		expect(formatOrdinal(1)).toBe('1st');
		expect(formatOrdinal(2)).toBe('2nd');
		expect(formatOrdinal(3)).toBe('3rd');
		expect(formatOrdinal(4)).toBe('4th');
		expect(formatOrdinal(11)).toBe('11th');
		expect(formatOrdinal(12)).toBe('12th');
		expect(formatOrdinal(13)).toBe('13th');
		expect(formatOrdinal(21)).toBe('21st');
		expect(formatOrdinal(22)).toBe('22nd');
		expect(formatOrdinal(23)).toBe('23rd');
	});
});

describe('parseFormattedNumber', () => {
	it('should parse regular numbers', () => {
		expect(parseFormattedNumber('123')?.toNumber()).toBe(123);
		expect(parseFormattedNumber('123.45')?.toNumber()).toBe(123.45);
	});

	it('should parse numbers with commas', () => {
		expect(parseFormattedNumber('1,234')?.toNumber()).toBe(1234);
		expect(parseFormattedNumber('1,234,567')?.toNumber()).toBe(1234567);
	});

	it('should parse letter suffixes', () => {
		expect(parseFormattedNumber('1.5K')?.toNumber()).toBe(1500);
		expect(parseFormattedNumber('2M')?.toNumber()).toBe(2000000);
		expect(parseFormattedNumber('1.5B')?.toNumber()).toBe(1500000000);
	});

	it('should parse scientific notation', () => {
		expect(parseFormattedNumber('1e6')?.toNumber()).toBe(1000000);
		expect(parseFormattedNumber('1.5e10')?.toNumber()).toBe(15000000000);
	});

	it('should return null for empty input', () => {
		expect(parseFormattedNumber('')).toBeNull();
		// Note: break_eternity.js parses non-numeric strings as 0, so 'abc' returns Decimal(0)
		// This is the library's expected behavior
	});
});
