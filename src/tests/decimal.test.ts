/**
 * @fileoverview Unit tests for Decimal utilities.
 */

import { describe, it, expect } from 'vitest';
import {
	D,
	ZERO,
	ONE,
	add,
	sub,
	mul,
	div,
	pow,
	gt,
	gte,
	lt,
	lte,
	eq,
	max,
	min,
	clamp,
	floor,
	ceil,
	round,
	calculateExponentialCost,
	calculateBulkCost,
	calculateMaxAffordable,
	applyMultiplier,
	applyPercentBonus,
	serialize,
	deserialize
} from '$lib/engine/utils/decimal';

describe('Decimal Basic Operations', () => {
	it('should create a Decimal from number', () => {
		const d = D(100);
		expect(d.toNumber()).toBe(100);
	});

	it('should create a Decimal from string', () => {
		const d = D('1e10');
		expect(d.eq(1e10)).toBe(true);
	});

	it('should add two numbers', () => {
		expect(add(100, 50).toNumber()).toBe(150);
		expect(add(D(100), D(50)).toNumber()).toBe(150);
	});

	it('should subtract two numbers', () => {
		expect(sub(100, 50).toNumber()).toBe(50);
		expect(sub(50, 100).toNumber()).toBe(-50);
	});

	it('should multiply two numbers', () => {
		expect(mul(10, 5).toNumber()).toBe(50);
		expect(mul(D(10), 5).toNumber()).toBe(50);
	});

	it('should divide two numbers', () => {
		expect(div(100, 5).toNumber()).toBe(20);
		expect(div(100, 0).eq(ZERO)).toBe(true); // Division by zero returns ZERO
	});

	it('should calculate powers', () => {
		expect(pow(2, 10).toNumber()).toBeCloseTo(1024, 10);
		expect(pow(10, 3).toNumber()).toBeCloseTo(1000, 10);
	});
});

describe('Decimal Comparisons', () => {
	it('should compare with gt/gte', () => {
		expect(gt(100, 50)).toBe(true);
		expect(gt(50, 100)).toBe(false);
		expect(gte(100, 100)).toBe(true);
		expect(gte(99, 100)).toBe(false);
	});

	it('should compare with lt/lte', () => {
		expect(lt(50, 100)).toBe(true);
		expect(lt(100, 50)).toBe(false);
		expect(lte(100, 100)).toBe(true);
		expect(lte(101, 100)).toBe(false);
	});

	it('should check equality', () => {
		expect(eq(100, 100)).toBe(true);
		expect(eq(100, 101)).toBe(false);
		expect(eq(D(100), D(100))).toBe(true);
	});

	it('should find max/min', () => {
		expect(max(100, 50).toNumber()).toBe(100);
		expect(min(100, 50).toNumber()).toBe(50);
	});

	it('should clamp values', () => {
		expect(clamp(50, 0, 100).toNumber()).toBe(50);
		expect(clamp(-10, 0, 100).toNumber()).toBe(0);
		expect(clamp(150, 0, 100).toNumber()).toBe(100);
	});
});

describe('Decimal Rounding', () => {
	it('should floor values', () => {
		expect(floor(5.7).toNumber()).toBe(5);
		expect(floor(5.2).toNumber()).toBe(5);
		expect(floor(-5.2).toNumber()).toBe(-6);
	});

	it('should ceil values', () => {
		expect(ceil(5.2).toNumber()).toBe(6);
		expect(ceil(5.7).toNumber()).toBe(6);
		expect(ceil(-5.7).toNumber()).toBe(-5);
	});

	it('should round values', () => {
		expect(round(5.4).toNumber()).toBe(5);
		expect(round(5.5).toNumber()).toBe(6);
		expect(round(5.6).toNumber()).toBe(6);
	});
});

describe('Idle Game Helpers', () => {
	it('should calculate exponential cost', () => {
		// baseCost * multiplier^owned
		const cost = calculateExponentialCost(100, 1.5, 3);
		expect(cost.toNumber()).toBeCloseTo(100 * Math.pow(1.5, 3), 5);
	});

	it('should calculate bulk cost', () => {
		// Sum of geometric series
		const cost = calculateBulkCost(10, 1.5, 0, 5);
		// 10 + 15 + 22.5 + 33.75 + 50.625 = 131.875
		expect(cost.toNumber()).toBeCloseTo(131.875, 2);
	});

	it('should calculate max affordable', () => {
		// With 1000 resources, baseCost 10, multiplier 1.5
		const maxBuy = calculateMaxAffordable(1000, 10, 1.5, 0);
		expect(maxBuy).toBeGreaterThan(0);
		expect(maxBuy).toBeLessThan(20);
	});

	it('should apply multipliers', () => {
		expect(applyMultiplier(100, 2).toNumber()).toBe(200);
		expect(applyMultiplier(100, 0.5).toNumber()).toBe(50);
	});

	it('should apply percent bonus', () => {
		// +50% bonus
		expect(applyPercentBonus(100, 50).toNumber()).toBe(150);
		// +100% bonus
		expect(applyPercentBonus(100, 100).toNumber()).toBe(200);
	});
});

describe('Serialization', () => {
	it('should serialize to string', () => {
		const d = D(12345.67);
		const serialized = serialize(d);
		expect(typeof serialized).toBe('string');
	});

	it('should deserialize back to Decimal', () => {
		const original = D(12345.67);
		const serialized = serialize(original);
		const deserialized = deserialize(serialized);
		expect(deserialized.eq(original)).toBe(true);
	});

	it('should handle null/undefined in deserialization', () => {
		expect(deserialize(null).eq(ZERO)).toBe(true);
		expect(deserialize(undefined).eq(ZERO)).toBe(true);
		expect(deserialize('').eq(ZERO)).toBe(true);
	});

	it('should handle large numbers', () => {
		const large = D('1e100');
		const serialized = serialize(large);
		const deserialized = deserialize(serialized);
		expect(deserialized.eq(large)).toBe(true);
	});
});

describe('Constants', () => {
	it('should have correct constant values', () => {
		expect(ZERO.toNumber()).toBe(0);
		expect(ONE.toNumber()).toBe(1);
	});
});
