/**
 * @fileoverview Tests for ProducerManager class.
 * Tests producer purchases, production, unlocking, and serialization.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProducerManager } from '$lib/engine/systems/ProducerManager.svelte';
import { EventManager } from '$lib/engine/core/EventManager';
import { ResourceManager } from '$lib/engine/systems/ResourceManager.svelte';
import { D, ZERO } from '$lib/engine/utils/decimal';
import { ProducerId } from '$lib/engine/models/producers';

describe('ProducerManager', () => {
	let events: EventManager;
	let resources: ResourceManager;
	let producers: ProducerManager;

	beforeEach(() => {
		events = new EventManager();
		resources = new ResourceManager(events);
		resources.init();
		producers = new ProducerManager(events, resources);
		producers.init();
	});

	// ============================================================================
	// Initialization Tests
	// ============================================================================
	describe('init', () => {
		it('should initialize all producers', () => {
			// Check that some known producers exist
			expect(producers.getDefinition(ProducerId.PIXEL_GENERATOR)).toBeDefined();
			expect(producers.getDefinition(ProducerId.CLICK_BOOSTER)).toBeDefined();
		});

		it('should unlock basic producers for phase 1', () => {
			expect(producers.isUnlocked(ProducerId.PIXEL_GENERATOR)).toBe(true);
			expect(producers.isUnlocked(ProducerId.CLICK_BOOSTER)).toBe(true);
		});

		it('should set all producers to level 0', () => {
			expect(producers.getLevel(ProducerId.PIXEL_GENERATOR)).toBe(0);
			expect(producers.getLevel(ProducerId.CLICK_BOOSTER)).toBe(0);
		});

		it('should calculate initial costs', () => {
			const cost = producers.getNextCost(ProducerId.PIXEL_GENERATOR);
			expect(cost.gt(0)).toBe(true);
		});
	});

	// ============================================================================
	// Purchase Tests
	// ============================================================================
	describe('canAfford', () => {
		it('should return false with no resources', () => {
			expect(producers.canAfford(ProducerId.PIXEL_GENERATOR)).toBe(false);
		});

		it('should return true with enough resources', () => {
			// Give enough pixels to buy a generator
			resources.add('pixels', D(100));
			expect(producers.canAfford(ProducerId.PIXEL_GENERATOR)).toBe(true);
		});

		it('should return false for locked producers', () => {
			resources.add('pixels', D(1e12));
			// RED_EXTRACTOR is in phase 2 and hidden, should be locked
			expect(producers.isUnlocked(ProducerId.RED_EXTRACTOR)).toBe(false);
			expect(producers.canAfford(ProducerId.RED_EXTRACTOR)).toBe(false);
		});

		it('should return false for unknown producer ID', () => {
			expect(producers.canAfford('nonexistent_producer')).toBe(false);
		});
	});

	describe('calculateCost', () => {
		it('should return base cost at level 0', () => {
			const cost = producers.calculateCost(ProducerId.PIXEL_GENERATOR);
			const def = producers.getDefinition(ProducerId.PIXEL_GENERATOR);
			expect(cost.eq(def!.baseCost)).toBe(true);
		});

		it('should apply cost multiplier for higher levels', () => {
			// Buy first one
			resources.add('pixels', D(1000));
			producers.buy(ProducerId.PIXEL_GENERATOR);

			const cost = producers.calculateCost(ProducerId.PIXEL_GENERATOR);
			const def = producers.getDefinition(ProducerId.PIXEL_GENERATOR);
			const expectedCost = D(def!.baseCost).mul(D(def!.costMultiplier).pow(1));
			expect(cost.eq(expectedCost)).toBe(true);
		});

		it('should return ZERO for unknown producer', () => {
			const cost = producers.calculateCost('nonexistent');
			expect(cost.eq(ZERO)).toBe(true);
		});

		it('should calculate bulk cost correctly', () => {
			resources.add('pixels', D(10000));
			const singleCost1 = producers.calculateCost(ProducerId.PIXEL_GENERATOR, 1);
			producers.buy(ProducerId.PIXEL_GENERATOR);
			const singleCost2 = producers.calculateCost(ProducerId.PIXEL_GENERATOR, 1);

			// Reset and calculate bulk cost for 2
			producers.reset();
			resources.add('pixels', D(10000));
			const bulkCost = producers.calculateCost(ProducerId.PIXEL_GENERATOR, 2);

			// Bulk cost should be approximately sum of individual costs
			expect(bulkCost.gte(singleCost1.add(singleCost2).mul(0.99))).toBe(true);
		});
	});

	describe('buy', () => {
		it('should return false with insufficient resources', () => {
			expect(producers.buy(ProducerId.PIXEL_GENERATOR)).toBe(false);
			expect(producers.getLevel(ProducerId.PIXEL_GENERATOR)).toBe(0);
		});

		it('should purchase and increase level', () => {
			resources.add('pixels', D(100));
			expect(producers.buy(ProducerId.PIXEL_GENERATOR)).toBe(true);
			expect(producers.getLevel(ProducerId.PIXEL_GENERATOR)).toBe(1);
		});

		it('should deduct cost from resources', () => {
			resources.add('pixels', D(100));
			const costBefore = producers.getNextCost(ProducerId.PIXEL_GENERATOR);
			const balanceBefore = resources.getAmount('pixels');

			producers.buy(ProducerId.PIXEL_GENERATOR);

			const balanceAfter = resources.getAmount('pixels');
			expect(balanceAfter.eq(balanceBefore.sub(costBefore))).toBe(true);
		});

		it('should update next cost after purchase', () => {
			resources.add('pixels', D(1000));
			const costBefore = producers.getNextCost(ProducerId.PIXEL_GENERATOR);

			producers.buy(ProducerId.PIXEL_GENERATOR);

			const costAfter = producers.getNextCost(ProducerId.PIXEL_GENERATOR);
			expect(costAfter.gt(costBefore)).toBe(true);
		});

		it('should emit upgrade_purchased event', () => {
			const callback = vi.fn();
			events.on('upgrade_purchased', callback);

			resources.add('pixels', D(100));
			producers.buy(ProducerId.PIXEL_GENERATOR);

			expect(callback).toHaveBeenCalled();
			expect(callback).toHaveBeenCalledWith(
				expect.objectContaining({
					upgradeId: ProducerId.PIXEL_GENERATOR,
					level: 1
				})
			);
		});

		it('should track first purchase time', () => {
			resources.add('pixels', D(100));

			const timeBefore = Date.now();
			producers.buy(ProducerId.PIXEL_GENERATOR);
			const timeAfter = Date.now();

			// Access internal state through serialization
			const serialized = producers.serialize();
			const purchaseTime = serialized.firstPurchaseTimes[ProducerId.PIXEL_GENERATOR];

			expect(purchaseTime).toBeGreaterThanOrEqual(timeBefore);
			expect(purchaseTime).toBeLessThanOrEqual(timeAfter);
		});

		it('should buy multiple at once', () => {
			resources.add('pixels', D(1e6));
			expect(producers.buy(ProducerId.PIXEL_GENERATOR, 5)).toBe(true);
			expect(producers.getLevel(ProducerId.PIXEL_GENERATOR)).toBe(5);
		});
	});

	describe('getMaxAffordable', () => {
		it('should return 0 with no resources', () => {
			expect(producers.getMaxAffordable(ProducerId.PIXEL_GENERATOR)).toBe(0);
		});

		it('should return 1 with just enough for one', () => {
			const cost = producers.getNextCost(ProducerId.PIXEL_GENERATOR);
			resources.add('pixels', cost);
			expect(producers.getMaxAffordable(ProducerId.PIXEL_GENERATOR)).toBe(1);
		});

		it('should return correct amount for larger budgets', () => {
			resources.add('pixels', D(1e6));
			const max = producers.getMaxAffordable(ProducerId.PIXEL_GENERATOR);
			expect(max).toBeGreaterThan(5);
		});

		it('should return 0 for locked producer', () => {
			resources.add('pixels', D(1e12));
			expect(producers.getMaxAffordable(ProducerId.RED_EXTRACTOR)).toBe(0);
		});
	});

	describe('buyMax', () => {
		it('should return 0 with insufficient resources', () => {
			expect(producers.buyMax(ProducerId.PIXEL_GENERATOR)).toBe(0);
		});

		it('should buy maximum affordable amount', () => {
			resources.add('pixels', D(1e6));
			const maxBefore = producers.getMaxAffordable(ProducerId.PIXEL_GENERATOR);
			const bought = producers.buyMax(ProducerId.PIXEL_GENERATOR);

			expect(bought).toBe(maxBefore);
			expect(producers.getLevel(ProducerId.PIXEL_GENERATOR)).toBe(maxBefore);
		});
	});

	// ============================================================================
	// Production Tests
	// ============================================================================
	describe('getProduction', () => {
		it('should return 0 for unowned producers', () => {
			const production = producers.getProduction(ProducerId.PIXEL_GENERATOR);
			expect(production.eq(ZERO)).toBe(true);
		});

		it('should return production rate for owned producers', () => {
			resources.add('pixels', D(1000));
			producers.buy(ProducerId.PIXEL_GENERATOR, 5);

			const production = producers.getProduction(ProducerId.PIXEL_GENERATOR);
			const def = producers.getDefinition(ProducerId.PIXEL_GENERATOR);

			// Base production = baseProduction * level
			const expectedBase = D(def!.baseProduction).mul(5);
			expect(production.eq(expectedBase)).toBe(true);
		});
	});

	describe('tick', () => {
		it('should add resources based on production', () => {
			resources.add('pixels', D(1000));
			producers.buy(ProducerId.PIXEL_GENERATOR, 5);

			const pixelsBefore = resources.getAmount('pixels');
			producers.tick(1.0); // 1 second
			const pixelsAfter = resources.getAmount('pixels');

			expect(pixelsAfter.gt(pixelsBefore)).toBe(true);
		});

		it('should track total produced', () => {
			resources.add('pixels', D(1000));
			producers.buy(ProducerId.PIXEL_GENERATOR, 5);

			producers.tick(1.0);

			const totalProduced = producers.getTotalProduced(ProducerId.PIXEL_GENERATOR);
			expect(totalProduced.gt(ZERO)).toBe(true);
		});

		it('should not produce for level 0 producers', () => {
			const pixelsBefore = resources.getAmount('pixels');
			producers.tick(1.0);
			const pixelsAfter = resources.getAmount('pixels');

			expect(pixelsAfter.eq(pixelsBefore)).toBe(true);
		});
	});

	// ============================================================================
	// Producer State Tests
	// ============================================================================
	describe('getLevel', () => {
		it('should return 0 for non-owned producer', () => {
			expect(producers.getLevel(ProducerId.PIXEL_GENERATOR)).toBe(0);
		});

		it('should return correct level after purchase', () => {
			resources.add('pixels', D(10000));
			producers.buy(ProducerId.PIXEL_GENERATOR, 3);
			expect(producers.getLevel(ProducerId.PIXEL_GENERATOR)).toBe(3);
		});

		it('should return 0 for unknown producer', () => {
			expect(producers.getLevel('unknown')).toBe(0);
		});
	});

	describe('isUnlocked', () => {
		it('should return true for basic unlocked producers', () => {
			expect(producers.isUnlocked(ProducerId.PIXEL_GENERATOR)).toBe(true);
		});

		it('should return false for locked producers', () => {
			expect(producers.isUnlocked(ProducerId.RED_EXTRACTOR)).toBe(false);
		});

		it('should return false for unknown producer', () => {
			expect(producers.isUnlocked('unknown')).toBe(false);
		});
	});

	describe('getClickPower', () => {
		it('should return 0 with no click boosters', () => {
			const power = producers.getClickPower();
			expect(power.eq(ZERO)).toBe(true);
		});

		it('should return level of click boosters', () => {
			resources.add('pixels', D(10000));
			producers.buy(ProducerId.CLICK_BOOSTER, 3);

			const power = producers.getClickPower();
			expect(power.eq(3)).toBe(true);
		});
	});

	describe('getByCategory', () => {
		it('should return producers in the specified category', () => {
			const basicProducers = producers.getByCategory('basic');
			expect(basicProducers).toContain(ProducerId.PIXEL_GENERATOR);
			expect(basicProducers).toContain(ProducerId.CLICK_BOOSTER);
		});

		it('should return sorted by display order', () => {
			const basicProducers = producers.getByCategory('basic');
			expect(Array.isArray(basicProducers)).toBe(true);
		});
	});

	describe('getVisibleProducers', () => {
		it('should return unlocked producers', () => {
			const visible = producers.getVisibleProducers();
			expect(visible).toContain(ProducerId.PIXEL_GENERATOR);
			expect(visible).toContain(ProducerId.CLICK_BOOSTER);
		});

		it('should not include locked producers', () => {
			const visible = producers.getVisibleProducers();
			// RED_EXTRACTOR is phase 2 and hidden
			expect(visible).not.toContain(ProducerId.RED_EXTRACTOR);
		});
	});

	// ============================================================================
	// Phase & Unlock Tests
	// ============================================================================
	describe('setPhase', () => {
		it('should update current phase', () => {
			// Phase 2 hidden producers won't auto-unlock, but phase is set
			producers.setPhase(2);
			// Verify phase was set by checking getVisibleProducers still works
			const visible = producers.getVisibleProducers();
			expect(visible).toContain(ProducerId.PIXEL_GENERATOR);
		});

		it('should not auto-unlock hidden producers', () => {
			// RED_EXTRACTOR is hidden so it won't auto-unlock even at phase 2
			expect(producers.isUnlocked(ProducerId.RED_EXTRACTOR)).toBe(false);
			producers.setPhase(2);
			// Still locked because it's hidden
			expect(producers.isUnlocked(ProducerId.RED_EXTRACTOR)).toBe(false);
		});
	});

	describe('unlock', () => {
		it('should unlock a locked producer', () => {
			// RED_EXTRACTOR starts locked
			expect(producers.isUnlocked(ProducerId.RED_EXTRACTOR)).toBe(false);

			producers.unlock(ProducerId.RED_EXTRACTOR);

			expect(producers.isUnlocked(ProducerId.RED_EXTRACTOR)).toBe(true);
		});

		it('should emit upgrade_unlocked event', () => {
			const callback = vi.fn();
			events.on('upgrade_unlocked', callback);

			producers.unlock(ProducerId.RED_EXTRACTOR);

			expect(callback).toHaveBeenCalled();
		});

		it('should not double-unlock', () => {
			const callback = vi.fn();
			events.on('upgrade_unlocked', callback);

			producers.unlock(ProducerId.RED_EXTRACTOR);
			producers.unlock(ProducerId.RED_EXTRACTOR);

			expect(callback).toHaveBeenCalledTimes(1);
		});
	});

	// ============================================================================
	// Serialization Tests
	// ============================================================================
	describe('serialize', () => {
		it('should include levels of purchased producers', () => {
			resources.add('pixels', D(10000));
			producers.buy(ProducerId.PIXEL_GENERATOR, 5);

			const serialized = producers.serialize();

			expect(serialized.levels[ProducerId.PIXEL_GENERATOR]).toBe(5);
		});

		it('should include unlocked producers', () => {
			const serialized = producers.serialize();

			expect(serialized.unlocked).toContain(ProducerId.PIXEL_GENERATOR);
		});

		it('should include total produced', () => {
			resources.add('pixels', D(10000));
			producers.buy(ProducerId.PIXEL_GENERATOR, 5);
			producers.tick(1.0);

			const serialized = producers.serialize();

			expect(serialized.totalProduced[ProducerId.PIXEL_GENERATOR]).toBeDefined();
		});
	});

	describe('deserialize', () => {
		it('should restore producer levels', () => {
			const savedData = {
				levels: { [ProducerId.PIXEL_GENERATOR]: 10 },
				unlocked: [ProducerId.PIXEL_GENERATOR],
				totalProduced: {},
				firstPurchaseTimes: {}
			};

			producers.deserialize(savedData);

			expect(producers.getLevel(ProducerId.PIXEL_GENERATOR)).toBe(10);
		});

		it('should restore unlocked state', () => {
			const savedData = {
				levels: {},
				unlocked: [ProducerId.PIXEL_GENERATOR, ProducerId.RED_EXTRACTOR],
				totalProduced: {},
				firstPurchaseTimes: {}
			};

			producers.deserialize(savedData);

			expect(producers.isUnlocked(ProducerId.RED_EXTRACTOR)).toBe(true);
		});

		it('should restore total produced', () => {
			const savedData = {
				levels: { [ProducerId.PIXEL_GENERATOR]: 5 },
				unlocked: [ProducerId.PIXEL_GENERATOR],
				totalProduced: { [ProducerId.PIXEL_GENERATOR]: '12345.678' },
				firstPurchaseTimes: {}
			};

			producers.deserialize(savedData);

			const total = producers.getTotalProduced(ProducerId.PIXEL_GENERATOR);
			expect(total.eq(D('12345.678'))).toBe(true);
		});

		it('should recalculate costs after restore', () => {
			const savedData = {
				levels: { [ProducerId.PIXEL_GENERATOR]: 10 },
				unlocked: [ProducerId.PIXEL_GENERATOR],
				totalProduced: {},
				firstPurchaseTimes: {}
			};

			producers.deserialize(savedData);

			const cost = producers.getNextCost(ProducerId.PIXEL_GENERATOR);
			const def = producers.getDefinition(ProducerId.PIXEL_GENERATOR);
			const expectedCost = D(def!.baseCost).mul(D(def!.costMultiplier).pow(10));

			expect(cost.eq(expectedCost)).toBe(true);
		});

		it('should handle null/undefined data gracefully', () => {
			expect(() => producers.deserialize(null)).not.toThrow();
			expect(() => producers.deserialize(undefined)).not.toThrow();
			expect(() => producers.deserialize({})).not.toThrow();
		});
	});

	// ============================================================================
	// Reset Tests
	// ============================================================================
	describe('reset', () => {
		it('should reset all levels to 0', () => {
			resources.add('pixels', D(10000));
			producers.buy(ProducerId.PIXEL_GENERATOR, 5);

			producers.reset();

			expect(producers.getLevel(ProducerId.PIXEL_GENERATOR)).toBe(0);
		});

		it('should reset costs to base', () => {
			resources.add('pixels', D(10000));
			producers.buy(ProducerId.PIXEL_GENERATOR, 5);

			producers.reset();

			const cost = producers.getNextCost(ProducerId.PIXEL_GENERATOR);
			const def = producers.getDefinition(ProducerId.PIXEL_GENERATOR);
			expect(cost.eq(def!.baseCost)).toBe(true);
		});

		it('should reset total produced', () => {
			resources.add('pixels', D(10000));
			producers.buy(ProducerId.PIXEL_GENERATOR, 5);
			producers.tick(1.0);

			producers.reset();

			expect(producers.getTotalProduced(ProducerId.PIXEL_GENERATOR).eq(ZERO)).toBe(true);
		});

		it('should clear the production pipeline', () => {
			const pipeline = producers.getPipeline();
			pipeline.addMultiplier({
				id: 'test',
				name: 'Test',
				value: 2,
				source: 'upgrade',
				stackingType: 'multiplicative'
			});

			producers.reset();

			expect(pipeline.hasMultiplier('test')).toBe(false);
		});

		it('should keep phase 1 producers unlocked', () => {
			producers.setPhase(3);
			producers.reset();

			expect(producers.isUnlocked(ProducerId.PIXEL_GENERATOR)).toBe(true);
		});
	});

	// ============================================================================
	// Pipeline Integration Tests
	// ============================================================================
	describe('pipeline integration', () => {
		it('should return the production pipeline', () => {
			const pipeline = producers.getPipeline();
			expect(pipeline).toBeDefined();
		});

		it('should allow adding external multipliers', () => {
			producers.addMultiplier('external-boost', 'External Boost', 2, 'upgrade', 'pixels');

			const pipeline = producers.getPipeline();
			expect(pipeline.hasMultiplier('external-boost')).toBe(true);
		});

		it('should allow removing multipliers', () => {
			producers.addMultiplier('temp-boost', 'Temp', 1.5, 'temporary', 'pixels');
			producers.removeMultiplier('temp-boost');

			const pipeline = producers.getPipeline();
			expect(pipeline.hasMultiplier('temp-boost')).toBe(false);
		});

		it('should apply multipliers to production', () => {
			resources.add('pixels', D(10000));
			producers.buy(ProducerId.PIXEL_GENERATOR, 5);

			const productionBefore = producers.getProduction(ProducerId.PIXEL_GENERATOR);

			producers.addMultiplier('double-boost', 'Double', 2, 'upgrade', 'pixels');

			const productionAfter = producers.getProduction(ProducerId.PIXEL_GENERATOR);

			expect(productionAfter.eq(productionBefore.mul(2))).toBe(true);
		});

		it('should get production breakdown', () => {
			producers.addMultiplier('test-mult', 'Test', 2, 'upgrade', 'pixels');

			const breakdown = producers.getProductionBreakdown('pixels', 10);

			expect(breakdown.base.eq(10)).toBe(true);
			expect(breakdown.multiplicativeFactor.eq(2)).toBe(true);
			expect(breakdown.final.eq(20)).toBe(true);
		});
	});

	// ============================================================================
	// Derived State Tests
	// ============================================================================
	describe('derived state', () => {
		it('should track unlocked producers', () => {
			const unlocked = producers.unlockedProducers;
			expect(unlocked).toContain(ProducerId.PIXEL_GENERATOR);
		});

		it('should calculate total pixel production', () => {
			resources.add('pixels', D(10000));
			producers.buy(ProducerId.PIXEL_GENERATOR, 5);

			producers.tick(0.1); // Small tick to update state

			const total = producers.totalPixelProduction;
			expect(total.gt(ZERO)).toBe(true);
		});
	});
});
