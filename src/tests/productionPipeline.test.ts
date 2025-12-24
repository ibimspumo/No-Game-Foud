/**
 * @fileoverview Tests for the Production Pipeline system.
 * Tests multiplier stacking, calculation, and management.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ProductionPipeline } from '../lib/engine/systems/ProductionPipeline';
import { D, ZERO, ONE } from '../lib/engine/utils/decimal';

describe('ProductionPipeline', () => {
	let pipeline: ProductionPipeline;

	beforeEach(() => {
		pipeline = new ProductionPipeline();
	});

	describe('addMultiplier', () => {
		it('should add a multiplicative multiplier', () => {
			pipeline.addMultiplier({
				id: 'test-mult',
				name: 'Test Multiplier',
				value: 2,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			expect(pipeline.hasMultiplier('test-mult')).toBe(true);
			const mult = pipeline.getMultiplier('test-mult');
			expect(mult?.value.eq(2)).toBe(true);
		});

		it('should add an additive multiplier', () => {
			pipeline.addMultiplier({
				id: 'test-add',
				name: 'Test Additive',
				value: 0.5, // +50%
				source: 'upgrade',
				stackingType: 'additive',
				resourceId: 'pixels'
			});

			expect(pipeline.hasMultiplier('test-add')).toBe(true);
			const mult = pipeline.getMultiplier('test-add');
			expect(mult?.value.eq(0.5)).toBe(true);
		});

		it('should update an existing multiplier', () => {
			pipeline.addMultiplier({
				id: 'test',
				name: 'Test',
				value: 2,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			pipeline.addMultiplier({
				id: 'test',
				name: 'Test Updated',
				value: 3,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			const mult = pipeline.getMultiplier('test');
			expect(mult?.value.eq(3)).toBe(true);
			expect(mult?.name).toBe('Test Updated');
		});
	});

	describe('removeMultiplier', () => {
		it('should remove an existing multiplier', () => {
			pipeline.addMultiplier({
				id: 'to-remove',
				name: 'To Remove',
				value: 2,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			expect(pipeline.hasMultiplier('to-remove')).toBe(true);
			const removed = pipeline.removeMultiplier('to-remove');
			expect(removed).toBe(true);
			expect(pipeline.hasMultiplier('to-remove')).toBe(false);
		});

		it('should return false for non-existent multiplier', () => {
			const removed = pipeline.removeMultiplier('non-existent');
			expect(removed).toBe(false);
		});
	});

	describe('updateMultiplierValue', () => {
		it('should update multiplier value', () => {
			pipeline.addMultiplier({
				id: 'test',
				name: 'Test',
				value: 2,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			const updated = pipeline.updateMultiplierValue('test', 5);
			expect(updated).toBe(true);
			expect(pipeline.getMultiplier('test')?.value.eq(5)).toBe(true);
		});

		it('should return false for non-existent multiplier', () => {
			const updated = pipeline.updateMultiplierValue('non-existent', 5);
			expect(updated).toBe(false);
		});
	});

	describe('setMultiplierActive', () => {
		it('should deactivate a multiplier', () => {
			pipeline.addMultiplier({
				id: 'test',
				name: 'Test',
				value: 2,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			pipeline.setMultiplierActive('test', false);
			expect(pipeline.getMultiplier('test')?.active).toBe(false);
		});

		it('should not include inactive multipliers in calculations', () => {
			pipeline.addMultiplier({
				id: 'test',
				name: 'Test',
				value: 2,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			const resultActive = pipeline.calculate('pixels', 10);
			expect(resultActive.eq(20)).toBe(true);

			pipeline.setMultiplierActive('test', false);
			const resultInactive = pipeline.calculate('pixels', 10);
			expect(resultInactive.eq(10)).toBe(true);
		});
	});

	describe('calculate', () => {
		it('should return base rate with no multipliers', () => {
			const result = pipeline.calculate('pixels', 10);
			expect(result.eq(10)).toBe(true);
		});

		it('should apply single multiplicative multiplier', () => {
			pipeline.addMultiplier({
				id: 'mult',
				name: 'Mult',
				value: 2,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			const result = pipeline.calculate('pixels', 10);
			expect(result.eq(20)).toBe(true);
		});

		it('should apply single additive multiplier', () => {
			pipeline.addMultiplier({
				id: 'add',
				name: 'Add',
				value: 0.5, // +50%
				source: 'upgrade',
				stackingType: 'additive',
				resourceId: 'pixels'
			});

			const result = pipeline.calculate('pixels', 10);
			expect(result.eq(15)).toBe(true); // 10 * (1 + 0.5) = 15
		});

		it('should stack multiplicative multipliers correctly', () => {
			pipeline.addMultiplier({
				id: 'mult1',
				name: 'Mult 1',
				value: 2,
				source: 'producer',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			pipeline.addMultiplier({
				id: 'mult2',
				name: 'Mult 2',
				value: 3,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			const result = pipeline.calculate('pixels', 10);
			expect(result.eq(60)).toBe(true); // 10 * 2 * 3 = 60
		});

		it('should stack additive multipliers correctly', () => {
			pipeline.addMultiplier({
				id: 'add1',
				name: 'Add 1',
				value: 0.5, // +50%
				source: 'upgrade',
				stackingType: 'additive',
				resourceId: 'pixels'
			});

			pipeline.addMultiplier({
				id: 'add2',
				name: 'Add 2',
				value: 0.3, // +30%
				source: 'upgrade',
				stackingType: 'additive',
				resourceId: 'pixels'
			});

			const result = pipeline.calculate('pixels', 10);
			expect(result.eq(18)).toBe(true); // 10 * (1 + 0.5 + 0.3) = 18
		});

		it('should apply multiplicative before additive', () => {
			pipeline.addMultiplier({
				id: 'mult',
				name: 'Mult',
				value: 2,
				source: 'producer',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			pipeline.addMultiplier({
				id: 'add',
				name: 'Add',
				value: 0.5, // +50%
				source: 'upgrade',
				stackingType: 'additive',
				resourceId: 'pixels'
			});

			const result = pipeline.calculate('pixels', 10);
			// Formula: base * multiplicative * (1 + additive)
			// 10 * 2 * (1 + 0.5) = 10 * 2 * 1.5 = 30
			expect(result.eq(30)).toBe(true);
		});

		it('should return zero for zero base rate', () => {
			pipeline.addMultiplier({
				id: 'mult',
				name: 'Mult',
				value: 2,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			const result = pipeline.calculate('pixels', 0);
			expect(result.eq(0)).toBe(true);
		});

		it('should return zero for negative base rate', () => {
			const result = pipeline.calculate('pixels', -10);
			expect(result.eq(0)).toBe(true);
		});

		it('should only apply multipliers for matching resource', () => {
			pipeline.addMultiplier({
				id: 'pixel-mult',
				name: 'Pixel Mult',
				value: 2,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			pipeline.addMultiplier({
				id: 'color-mult',
				name: 'Color Mult',
				value: 3,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'red'
			});

			const pixelResult = pipeline.calculate('pixels', 10);
			expect(pixelResult.eq(20)).toBe(true); // Only pixel-mult applies

			const redResult = pipeline.calculate('red', 10);
			expect(redResult.eq(30)).toBe(true); // Only color-mult applies
		});

		it('should apply global multipliers to all resources', () => {
			pipeline.addMultiplier({
				id: 'global',
				name: 'Global',
				value: 2,
				source: 'eternal',
				stackingType: 'multiplicative',
				resourceId: '' // Global
			});

			const pixelResult = pipeline.calculate('pixels', 10);
			expect(pixelResult.eq(20)).toBe(true);

			const redResult = pipeline.calculate('red', 10);
			expect(redResult.eq(20)).toBe(true);
		});
	});

	describe('getBreakdown', () => {
		it('should return complete breakdown', () => {
			pipeline.addMultiplier({
				id: 'mult',
				name: 'Mult',
				value: 2,
				source: 'producer',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			pipeline.addMultiplier({
				id: 'add',
				name: 'Add',
				value: 0.5,
				source: 'upgrade',
				stackingType: 'additive',
				resourceId: 'pixels'
			});

			const breakdown = pipeline.getBreakdown('pixels', 10);

			expect(breakdown.base.eq(10)).toBe(true);
			expect(breakdown.multiplicativeFactor.eq(2)).toBe(true);
			expect(breakdown.additiveBonus.eq(0.5)).toBe(true);
			expect(breakdown.final.eq(30)).toBe(true);
			expect(breakdown.activeMultipliers.length).toBe(2);
		});
	});

	describe('getTotalMultiplicative', () => {
		it('should return combined multiplicative factor', () => {
			pipeline.addMultiplier({
				id: 'mult1',
				name: 'Mult 1',
				value: 2,
				source: 'producer',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			pipeline.addMultiplier({
				id: 'mult2',
				name: 'Mult 2',
				value: 3,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			const total = pipeline.getTotalMultiplicative('pixels');
			expect(total.eq(6)).toBe(true);
		});

		it('should return ONE with no multipliers', () => {
			const total = pipeline.getTotalMultiplicative('pixels');
			expect(total.eq(1)).toBe(true);
		});
	});

	describe('getTotalAdditive', () => {
		it('should return combined additive bonus', () => {
			pipeline.addMultiplier({
				id: 'add1',
				name: 'Add 1',
				value: 0.5,
				source: 'upgrade',
				stackingType: 'additive',
				resourceId: 'pixels'
			});

			pipeline.addMultiplier({
				id: 'add2',
				name: 'Add 2',
				value: 0.3,
				source: 'upgrade',
				stackingType: 'additive',
				resourceId: 'pixels'
			});

			const total = pipeline.getTotalAdditive('pixels');
			expect(total.eq(0.8)).toBe(true);
		});

		it('should return ZERO with no additive multipliers', () => {
			const total = pipeline.getTotalAdditive('pixels');
			expect(total.eq(0)).toBe(true);
		});
	});

	describe('getCombinedMultiplier', () => {
		it('should return combined factor', () => {
			pipeline.addMultiplier({
				id: 'mult',
				name: 'Mult',
				value: 2,
				source: 'producer',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			pipeline.addMultiplier({
				id: 'add',
				name: 'Add',
				value: 0.5,
				source: 'upgrade',
				stackingType: 'additive',
				resourceId: 'pixels'
			});

			const combined = pipeline.getCombinedMultiplier('pixels');
			// 2 * (1 + 0.5) = 3
			expect(combined.eq(3)).toBe(true);
		});
	});

	describe('getMultipliersBySource', () => {
		it('should filter by source type', () => {
			pipeline.addMultiplier({
				id: 'producer1',
				name: 'Producer 1',
				value: 2,
				source: 'producer',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			pipeline.addMultiplier({
				id: 'upgrade1',
				name: 'Upgrade 1',
				value: 1.5,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			pipeline.addMultiplier({
				id: 'producer2',
				name: 'Producer 2',
				value: 3,
				source: 'producer',
				stackingType: 'multiplicative',
				resourceId: 'red'
			});

			const producers = pipeline.getMultipliersBySource('producer');
			expect(producers.length).toBe(2);

			const upgrades = pipeline.getMultipliersBySource('upgrade');
			expect(upgrades.length).toBe(1);
		});
	});

	describe('clear', () => {
		it('should remove all multipliers', () => {
			pipeline.addMultiplier({
				id: 'mult1',
				name: 'Mult 1',
				value: 2,
				source: 'producer',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			pipeline.addMultiplier({
				id: 'mult2',
				name: 'Mult 2',
				value: 3,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			pipeline.clear();

			expect(pipeline.getActiveCount()).toBe(0);
			expect(pipeline.calculate('pixels', 10).eq(10)).toBe(true);
		});
	});

	describe('clearBySource', () => {
		it('should remove multipliers by source', () => {
			pipeline.addMultiplier({
				id: 'producer1',
				name: 'Producer 1',
				value: 2,
				source: 'producer',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			pipeline.addMultiplier({
				id: 'upgrade1',
				name: 'Upgrade 1',
				value: 3,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			const removed = pipeline.clearBySource('producer');
			expect(removed).toBe(1);
			expect(pipeline.hasMultiplier('producer1')).toBe(false);
			expect(pipeline.hasMultiplier('upgrade1')).toBe(true);
		});
	});

	describe('serialization', () => {
		it('should serialize and deserialize state', () => {
			pipeline.addMultiplier({
				id: 'producer1',
				name: 'Producer 1',
				value: 2,
				source: 'producer',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			pipeline.addMultiplier({
				id: 'upgrade1',
				name: 'Upgrade 1',
				value: 3,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			const serialized = pipeline.serialize();

			// Create new pipeline and restore
			const newPipeline = new ProductionPipeline();

			// Re-add definitions first (normally done by manager)
			newPipeline.addMultiplier({
				id: 'producer1',
				name: 'Producer 1',
				value: 1, // Will be overwritten
				source: 'producer',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			newPipeline.addMultiplier({
				id: 'upgrade1',
				name: 'Upgrade 1',
				value: 1, // Will be overwritten
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels'
			});

			newPipeline.deserialize(serialized);

			expect(newPipeline.getMultiplier('producer1')?.value.eq(2)).toBe(true);
			expect(newPipeline.getMultiplier('upgrade1')?.value.eq(3)).toBe(true);
		});
	});

	describe('conditional multipliers', () => {
		it('should only include multiplier when condition is true', () => {
			let conditionMet = false;

			pipeline.addMultiplier({
				id: 'conditional',
				name: 'Conditional',
				value: 2,
				source: 'upgrade',
				stackingType: 'multiplicative',
				resourceId: 'pixels',
				condition: () => conditionMet
			});

			// Condition false
			let result = pipeline.calculate('pixels', 10);
			expect(result.eq(10)).toBe(true);

			// Condition true
			conditionMet = true;
			result = pipeline.calculate('pixels', 10);
			expect(result.eq(20)).toBe(true);
		});
	});
});
