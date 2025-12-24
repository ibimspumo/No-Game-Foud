/**
 * @fileoverview Tests for UpgradeManager class.
 * Tests upgrade registration, purchases, effects, and serialization.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpgradeManager } from '$lib/engine/systems/UpgradeManager.svelte';
import { EventManager } from '$lib/engine/core/EventManager';
import { ResourceManager } from '$lib/engine/systems/ResourceManager.svelte';
import { D, ZERO, ONE } from '$lib/engine/utils/decimal';
import type { UpgradeDefinition } from '$lib/engine/models/upgrades';
import { RUN_UPGRADES } from '$lib/engine/data/upgrades/run-upgrades';
import { ETERNAL_UPGRADES } from '$lib/engine/data/upgrades/eternal-upgrades';
import { UpgradeId } from '$lib/engine/models/upgrades';

// ============================================================================
// Test Fixtures
// ============================================================================

/**
 * Create a simple test upgrade.
 */
function createTestUpgrade(overrides: Partial<UpgradeDefinition> = {}): UpgradeDefinition {
	return {
		id: 'test_upgrade',
		name: 'Test Upgrade',
		description: 'A test upgrade',
		baseCost: 100,
		currency: 'pixels',
		effects: [
			{
				type: 'multiplier',
				target: 'production',
				description: '+50% production',
				value: 1.5
			}
		],
		minPhase: 1,
		category: 'run',
		displayOrder: 1,
		isOneTime: true,
		...overrides
	};
}

/**
 * Create a repeatable test upgrade.
 */
function createRepeatableUpgrade(overrides: Partial<UpgradeDefinition> = {}): UpgradeDefinition {
	return {
		id: 'repeatable_upgrade',
		name: 'Repeatable Upgrade',
		description: 'A repeatable upgrade',
		baseCost: 50,
		currency: 'pixels',
		costMultiplier: 1.5,
		maxLevel: 10,
		effects: [
			{
				type: 'multiplier',
				target: 'production',
				description: '+10% production per level',
				value: 1.1,
				scalesWithLevel: true,
				scalingType: 'linear'
			}
		],
		minPhase: 1,
		category: 'run',
		displayOrder: 2,
		...overrides
	};
}

// ============================================================================
// Test Suite
// ============================================================================

describe('UpgradeManager', () => {
	let events: EventManager;
	let resources: ResourceManager;
	let upgrades: UpgradeManager;

	beforeEach(() => {
		events = new EventManager();
		resources = new ResourceManager(events);
		resources.init();
		upgrades = new UpgradeManager(events, resources);
		upgrades.init();
	});

	// ============================================================================
	// Registration Tests
	// ============================================================================
	describe('registerUpgrade', () => {
		it('should register a single upgrade', () => {
			const testUpgrade = createTestUpgrade();
			upgrades.registerUpgrade(testUpgrade);

			expect(upgrades.getDefinition('test_upgrade')).toBeDefined();
			expect(upgrades.getDefinition('test_upgrade')?.name).toBe('Test Upgrade');
		});

		it('should register multiple upgrades', () => {
			const upgrade1 = createTestUpgrade({ id: 'upgrade_1' });
			const upgrade2 = createTestUpgrade({ id: 'upgrade_2' });

			upgrades.registerUpgrades([upgrade1, upgrade2]);

			expect(upgrades.getDefinition('upgrade_1')).toBeDefined();
			expect(upgrades.getDefinition('upgrade_2')).toBeDefined();
		});

		it('should initialize upgrade state correctly', () => {
			const testUpgrade = createTestUpgrade();
			upgrades.registerUpgrade(testUpgrade);

			expect(upgrades.getLevel('test_upgrade')).toBe(0);
			expect(upgrades.isUnlocked('test_upgrade')).toBe(true);
			expect(upgrades.isOwned('test_upgrade')).toBe(false);
		});

		it('should respect hidden flag', () => {
			const hiddenUpgrade = createTestUpgrade({ id: 'hidden', hidden: true });
			upgrades.registerUpgrade(hiddenUpgrade);

			expect(upgrades.isUnlocked('hidden')).toBe(false);
		});

		it('should respect minPhase', () => {
			const futureUpgrade = createTestUpgrade({ id: 'future', minPhase: 5 });
			upgrades.registerUpgrade(futureUpgrade);

			expect(upgrades.isUnlocked('future')).toBe(false);
		});
	});

	// ============================================================================
	// Cost Calculation Tests
	// ============================================================================
	describe('calculateCost', () => {
		it('should return base cost for one-time upgrades', () => {
			const testUpgrade = createTestUpgrade({ baseCost: 100 });
			upgrades.registerUpgrade(testUpgrade);

			const cost = upgrades.getNextCost('test_upgrade');
			expect(cost.eq(100)).toBe(true);
		});

		it('should apply cost multiplier for repeatable upgrades', () => {
			const repeatableUpgrade = createRepeatableUpgrade();
			upgrades.registerUpgrade(repeatableUpgrade);

			// Buy first level
			resources.add('pixels', D(1000));
			upgrades.purchase('repeatable_upgrade');

			// Second level should be 50 * 1.5 = 75
			const cost = upgrades.getNextCost('repeatable_upgrade');
			expect(cost.eq(75)).toBe(true);
		});

		it('should calculate bulk cost correctly', () => {
			const repeatableUpgrade = createRepeatableUpgrade({ baseCost: 100, costMultiplier: 2 });
			upgrades.registerUpgrade(repeatableUpgrade);

			// Cost for 3 levels: 100 + 200 + 400 = 700
			// Access internal method through purchase attempt
			resources.add('pixels', D(10000));

			const maxBefore = upgrades.getMaxAffordable('repeatable_upgrade');
			expect(maxBefore).toBeGreaterThan(1);
		});
	});

	// ============================================================================
	// Purchase Tests
	// ============================================================================
	describe('canAfford', () => {
		it('should return false with no resources', () => {
			const testUpgrade = createTestUpgrade();
			upgrades.registerUpgrade(testUpgrade);

			expect(upgrades.canAfford('test_upgrade')).toBe(false);
		});

		it('should return true with sufficient resources', () => {
			const testUpgrade = createTestUpgrade({ baseCost: 100 });
			upgrades.registerUpgrade(testUpgrade);
			resources.add('pixels', D(100));

			expect(upgrades.canAfford('test_upgrade')).toBe(true);
		});

		it('should return false for locked upgrades', () => {
			const lockedUpgrade = createTestUpgrade({ id: 'locked', minPhase: 5 });
			upgrades.registerUpgrade(lockedUpgrade);
			resources.add('pixels', D(10000));

			expect(upgrades.canAfford('locked')).toBe(false);
		});

		it('should return false for already purchased one-time upgrades', () => {
			const testUpgrade = createTestUpgrade();
			upgrades.registerUpgrade(testUpgrade);
			resources.add('pixels', D(1000));

			upgrades.purchase('test_upgrade');

			expect(upgrades.canAfford('test_upgrade')).toBe(false);
		});

		it('should return false when max level reached', () => {
			const repeatableUpgrade = createRepeatableUpgrade({ maxLevel: 2 });
			upgrades.registerUpgrade(repeatableUpgrade);
			resources.add('pixels', D(10000));

			upgrades.purchase('repeatable_upgrade');
			upgrades.purchase('repeatable_upgrade');

			expect(upgrades.canAfford('repeatable_upgrade')).toBe(false);
		});
	});

	describe('purchase', () => {
		it('should fail with insufficient resources', () => {
			const testUpgrade = createTestUpgrade();
			upgrades.registerUpgrade(testUpgrade);

			const result = upgrades.purchase('test_upgrade');

			expect(result.success).toBe(false);
			expect(result.amountPurchased).toBe(0);
			expect(upgrades.getLevel('test_upgrade')).toBe(0);
		});

		it('should succeed and increase level', () => {
			const testUpgrade = createTestUpgrade({ baseCost: 100 });
			upgrades.registerUpgrade(testUpgrade);
			resources.add('pixels', D(100));

			const result = upgrades.purchase('test_upgrade');

			expect(result.success).toBe(true);
			expect(result.amountPurchased).toBe(1);
			expect(upgrades.getLevel('test_upgrade')).toBe(1);
		});

		it('should deduct cost from resources', () => {
			const testUpgrade = createTestUpgrade({ baseCost: 100 });
			upgrades.registerUpgrade(testUpgrade);
			resources.add('pixels', D(150));

			upgrades.purchase('test_upgrade');

			const remaining = resources.getAmount('pixels');
			expect(remaining.eq(50)).toBe(true);
		});

		it('should track first purchase time', () => {
			const testUpgrade = createTestUpgrade();
			upgrades.registerUpgrade(testUpgrade);
			resources.add('pixels', D(1000));

			const timeBefore = Date.now();
			upgrades.purchase('test_upgrade');
			const timeAfter = Date.now();

			const serialized = upgrades.serialize();
			const purchaseTime = serialized.firstPurchaseTimes['test_upgrade'];

			expect(purchaseTime).toBeGreaterThanOrEqual(timeBefore);
			expect(purchaseTime).toBeLessThanOrEqual(timeAfter);
		});

		it('should emit upgrade_purchased event', () => {
			const callback = vi.fn();
			events.on('upgrade_purchased', callback);

			const testUpgrade = createTestUpgrade({ baseCost: 100 });
			upgrades.registerUpgrade(testUpgrade);
			resources.add('pixels', D(100));

			upgrades.purchase('test_upgrade');

			expect(callback).toHaveBeenCalled();
			expect(callback).toHaveBeenCalledWith(
				expect.objectContaining({
					upgradeId: 'test_upgrade',
					level: 1
				})
			);
		});

		it('should allow buying multiple levels at once', () => {
			const repeatableUpgrade = createRepeatableUpgrade({ baseCost: 10, costMultiplier: 1.1 });
			upgrades.registerUpgrade(repeatableUpgrade);
			resources.add('pixels', D(10000));

			const result = upgrades.purchase('repeatable_upgrade', { amount: 5 });

			expect(result.success).toBe(true);
			expect(result.amountPurchased).toBe(5);
			expect(upgrades.getLevel('repeatable_upgrade')).toBe(5);
		});
	});

	describe('purchaseMax', () => {
		it('should buy maximum affordable amount', () => {
			const repeatableUpgrade = createRepeatableUpgrade({ baseCost: 100, costMultiplier: 2 });
			upgrades.registerUpgrade(repeatableUpgrade);
			resources.add('pixels', D(700)); // Enough for 3: 100 + 200 + 400 = 700

			const result = upgrades.purchaseMax('repeatable_upgrade');

			expect(result.success).toBe(true);
			expect(result.amountPurchased).toBe(3);
			expect(upgrades.getLevel('repeatable_upgrade')).toBe(3);
		});

		it('should return 0 with no resources', () => {
			const repeatableUpgrade = createRepeatableUpgrade();
			upgrades.registerUpgrade(repeatableUpgrade);

			const result = upgrades.purchaseMax('repeatable_upgrade');

			expect(result.success).toBe(false);
			expect(result.amountPurchased).toBe(0);
		});
	});

	describe('getMaxAffordable', () => {
		it('should return 0 with no resources', () => {
			const repeatableUpgrade = createRepeatableUpgrade();
			upgrades.registerUpgrade(repeatableUpgrade);

			expect(upgrades.getMaxAffordable('repeatable_upgrade')).toBe(0);
		});

		it('should return correct amount for exact budget', () => {
			const repeatableUpgrade = createRepeatableUpgrade({ baseCost: 100, costMultiplier: 2 });
			upgrades.registerUpgrade(repeatableUpgrade);
			resources.add('pixels', D(300)); // 100 + 200 = 300, exactly 2

			expect(upgrades.getMaxAffordable('repeatable_upgrade')).toBe(2);
		});

		it('should cap at max level', () => {
			const repeatableUpgrade = createRepeatableUpgrade({ maxLevel: 3 });
			upgrades.registerUpgrade(repeatableUpgrade);
			resources.add('pixels', D(1000000));

			expect(upgrades.getMaxAffordable('repeatable_upgrade')).toBe(3);
		});
	});

	// ============================================================================
	// State Access Tests
	// ============================================================================
	describe('getLevel', () => {
		it('should return 0 for non-owned upgrades', () => {
			const testUpgrade = createTestUpgrade();
			upgrades.registerUpgrade(testUpgrade);

			expect(upgrades.getLevel('test_upgrade')).toBe(0);
		});

		it('should return correct level after purchase', () => {
			const repeatableUpgrade = createRepeatableUpgrade();
			upgrades.registerUpgrade(repeatableUpgrade);
			resources.add('pixels', D(10000));

			upgrades.purchase('repeatable_upgrade', { amount: 3 });

			expect(upgrades.getLevel('repeatable_upgrade')).toBe(3);
		});

		it('should return 0 for unknown upgrade', () => {
			expect(upgrades.getLevel('nonexistent')).toBe(0);
		});
	});

	describe('isOwned', () => {
		it('should return false for non-purchased upgrades', () => {
			const testUpgrade = createTestUpgrade();
			upgrades.registerUpgrade(testUpgrade);

			expect(upgrades.isOwned('test_upgrade')).toBe(false);
		});

		it('should return true after purchase', () => {
			const testUpgrade = createTestUpgrade();
			upgrades.registerUpgrade(testUpgrade);
			resources.add('pixels', D(1000));

			upgrades.purchase('test_upgrade');

			expect(upgrades.isOwned('test_upgrade')).toBe(true);
		});
	});

	describe('isUnlocked', () => {
		it('should return true for visible upgrades', () => {
			const testUpgrade = createTestUpgrade();
			upgrades.registerUpgrade(testUpgrade);

			expect(upgrades.isUnlocked('test_upgrade')).toBe(true);
		});

		it('should return false for hidden upgrades', () => {
			const hiddenUpgrade = createTestUpgrade({ id: 'hidden', hidden: true });
			upgrades.registerUpgrade(hiddenUpgrade);

			expect(upgrades.isUnlocked('hidden')).toBe(false);
		});

		it('should return false for future phase upgrades', () => {
			const futureUpgrade = createTestUpgrade({ id: 'future', minPhase: 10 });
			upgrades.registerUpgrade(futureUpgrade);

			expect(upgrades.isUnlocked('future')).toBe(false);
		});
	});

	describe('getByCategory', () => {
		it('should return upgrades by category', () => {
			const runUpgrade = createTestUpgrade({ id: 'run_1', category: 'run' });
			const eternalUpgrade = createTestUpgrade({ id: 'eternal_1', category: 'eternal' });

			upgrades.registerUpgrades([runUpgrade, eternalUpgrade]);

			const runUpgrades = upgrades.getByCategory('run');
			const eternalUpgrades = upgrades.getByCategory('eternal');

			expect(runUpgrades).toContain('run_1');
			expect(runUpgrades).not.toContain('eternal_1');
			expect(eternalUpgrades).toContain('eternal_1');
		});
	});

	describe('getVisibleUpgrades', () => {
		it('should return only unlocked upgrades', () => {
			const visible = createTestUpgrade({ id: 'visible' });
			const hidden = createTestUpgrade({ id: 'hidden', hidden: true });

			upgrades.registerUpgrades([visible, hidden]);

			const visibleUpgrades = upgrades.getVisibleUpgrades();

			expect(visibleUpgrades).toContain('visible');
			expect(visibleUpgrades).not.toContain('hidden');
		});
	});

	// ============================================================================
	// Phase Management Tests
	// ============================================================================
	describe('setPhase', () => {
		it('should unlock upgrades for new phase', () => {
			const phase2Upgrade = createTestUpgrade({ id: 'phase_2', minPhase: 2 });
			upgrades.registerUpgrade(phase2Upgrade);

			expect(upgrades.isUnlocked('phase_2')).toBe(false);

			upgrades.setPhase(2);

			expect(upgrades.isUnlocked('phase_2')).toBe(true);
		});

		it('should not unlock upgrades with unmet requirements', () => {
			const requiresOther = createTestUpgrade({
				id: 'requires_other',
				minPhase: 1,
				requires: ['other_upgrade']
			});
			upgrades.registerUpgrade(requiresOther);

			// Should stay locked even though phase requirement is met
			// because 'other_upgrade' is not owned
			expect(upgrades.isUnlocked('requires_other')).toBe(false);
		});
	});

	describe('unlock', () => {
		it('should manually unlock an upgrade', () => {
			const hiddenUpgrade = createTestUpgrade({ id: 'hidden', hidden: true });
			upgrades.registerUpgrade(hiddenUpgrade);

			expect(upgrades.isUnlocked('hidden')).toBe(false);

			upgrades.unlock('hidden');

			expect(upgrades.isUnlocked('hidden')).toBe(true);
		});

		it('should emit upgrade_unlocked event', () => {
			const callback = vi.fn();
			events.on('upgrade_unlocked', callback);

			const hiddenUpgrade = createTestUpgrade({ id: 'hidden', hidden: true });
			upgrades.registerUpgrade(hiddenUpgrade);

			upgrades.unlock('hidden');

			expect(callback).toHaveBeenCalled();
		});

		it('should not double-unlock', () => {
			const callback = vi.fn();
			events.on('upgrade_unlocked', callback);

			const hiddenUpgrade = createTestUpgrade({ id: 'hidden', hidden: true });
			upgrades.registerUpgrade(hiddenUpgrade);

			upgrades.unlock('hidden');
			upgrades.unlock('hidden');

			expect(callback).toHaveBeenCalledTimes(1);
		});
	});

	// ============================================================================
	// Effect System Tests
	// ============================================================================
	describe('getMultiplier', () => {
		it('should return 1 with no upgrades', () => {
			const mult = upgrades.getMultiplier('production');
			expect(mult.eq(ONE)).toBe(true);
		});

		it('should return correct multiplier from single upgrade', () => {
			const testUpgrade = createTestUpgrade({
				effects: [
					{
						type: 'multiplier',
						target: 'production',
						description: '+50% production',
						value: 1.5
					}
				]
			});
			upgrades.registerUpgrade(testUpgrade);
			resources.add('pixels', D(1000));
			upgrades.purchase('test_upgrade');

			const mult = upgrades.getMultiplier('production');
			expect(mult.eq(1.5)).toBe(true);
		});

		it('should combine multipliers multiplicatively', () => {
			const upgrade1 = createTestUpgrade({
				id: 'mult1',
				effects: [
					{
						type: 'multiplier',
						target: 'production',
						description: '2x production',
						value: 2
					}
				]
			});
			const upgrade2 = createTestUpgrade({
				id: 'mult2',
				effects: [
					{
						type: 'multiplier',
						target: 'production',
						description: '3x production',
						value: 3
					}
				]
			});

			upgrades.registerUpgrades([upgrade1, upgrade2]);
			resources.add('pixels', D(10000));
			upgrades.purchase('mult1');
			upgrades.purchase('mult2');

			const mult = upgrades.getMultiplier('production');
			expect(mult.eq(6)).toBe(true); // 2 * 3 = 6
		});

		it('should respect target filter', () => {
			const pixelUpgrade = createTestUpgrade({
				effects: [
					{
						type: 'multiplier',
						target: 'pixels',
						description: '2x pixels',
						value: 2
					}
				]
			});
			upgrades.registerUpgrade(pixelUpgrade);
			resources.add('pixels', D(1000));
			upgrades.purchase('test_upgrade');

			expect(upgrades.getMultiplier('pixels').eq(2)).toBe(true);
			expect(upgrades.getMultiplier('production').eq(ONE)).toBe(true);
		});
	});

	describe('getAdditiveBonus', () => {
		it('should return 0 with no upgrades', () => {
			const bonus = upgrades.getAdditiveBonus('production');
			expect(bonus.eq(ZERO)).toBe(true);
		});

		it('should combine additive bonuses', () => {
			const upgrade1 = createTestUpgrade({
				id: 'add1',
				effects: [
					{
						type: 'additive',
						target: 'production',
						description: '+10 production',
						value: 10
					}
				]
			});
			const upgrade2 = createTestUpgrade({
				id: 'add2',
				effects: [
					{
						type: 'additive',
						target: 'production',
						description: '+20 production',
						value: 20
					}
				]
			});

			upgrades.registerUpgrades([upgrade1, upgrade2]);
			resources.add('pixels', D(10000));
			upgrades.purchase('add1');
			upgrades.purchase('add2');

			const bonus = upgrades.getAdditiveBonus('production');
			expect(bonus.eq(30)).toBe(true); // 10 + 20 = 30
		});
	});

	describe('isFeatureUnlocked', () => {
		it('should return false when no unlock upgrade owned', () => {
			expect(upgrades.isFeatureUnlocked('auto_click')).toBe(false);
		});

		it('should return true when unlock upgrade is owned', () => {
			const unlockUpgrade = createTestUpgrade({
				effects: [
					{
						type: 'unlock',
						target: 'all',
						description: 'Unlocks auto-click',
						unlockId: 'auto_click',
						unlockType: 'feature'
					}
				]
			});
			upgrades.registerUpgrade(unlockUpgrade);
			resources.add('pixels', D(1000));
			upgrades.purchase('test_upgrade');

			expect(upgrades.isFeatureUnlocked('auto_click')).toBe(true);
		});
	});

	// ============================================================================
	// Serialization Tests
	// ============================================================================
	describe('serialize', () => {
		it('should include purchased run upgrade levels', () => {
			const runUpgrade = createRepeatableUpgrade({ category: 'run' });
			upgrades.registerUpgrade(runUpgrade);
			resources.add('pixels', D(10000));
			upgrades.purchase('repeatable_upgrade', { amount: 3 });

			const serialized = upgrades.serialize();

			expect(serialized.runLevels['repeatable_upgrade']).toBe(3);
		});

		it('should include purchased eternal upgrade levels', () => {
			const eternalUpgrade = createTestUpgrade({
				id: 'eternal_test',
				category: 'eternal',
				currency: 'primordial'
			});
			upgrades.registerUpgrade(eternalUpgrade);
			resources.add('primordial_pixels', D(1000));
			upgrades.purchase('eternal_test');

			const serialized = upgrades.serialize();

			expect(serialized.eternalLevels['eternal_test']).toBe(1);
		});

		it('should include unlocked upgrade IDs', () => {
			const testUpgrade = createTestUpgrade();
			upgrades.registerUpgrade(testUpgrade);

			const serialized = upgrades.serialize();

			expect(serialized.unlocked).toContain('test_upgrade');
		});
	});

	describe('deserialize', () => {
		it('should restore upgrade levels', () => {
			const testUpgrade = createRepeatableUpgrade();
			upgrades.registerUpgrade(testUpgrade);

			const savedData = {
				runLevels: { repeatable_upgrade: 5 },
				eternalLevels: {},
				secretLevels: {},
				unlocked: ['repeatable_upgrade'],
				totalSpent: {},
				firstPurchaseTimes: {}
			};

			upgrades.deserialize(savedData);

			expect(upgrades.getLevel('repeatable_upgrade')).toBe(5);
		});

		it('should restore unlocked state', () => {
			const hiddenUpgrade = createTestUpgrade({ id: 'hidden', hidden: true });
			upgrades.registerUpgrade(hiddenUpgrade);

			const savedData = {
				runLevels: {},
				eternalLevels: {},
				secretLevels: {},
				unlocked: ['hidden'],
				totalSpent: {},
				firstPurchaseTimes: {}
			};

			upgrades.deserialize(savedData);

			expect(upgrades.isUnlocked('hidden')).toBe(true);
		});

		it('should recalculate costs after restore', () => {
			const repeatableUpgrade = createRepeatableUpgrade({
				baseCost: 100,
				costMultiplier: 2
			});
			upgrades.registerUpgrade(repeatableUpgrade);

			const savedData = {
				runLevels: { repeatable_upgrade: 3 },
				eternalLevels: {},
				secretLevels: {},
				unlocked: ['repeatable_upgrade'],
				totalSpent: {},
				firstPurchaseTimes: {}
			};

			upgrades.deserialize(savedData);

			// Cost at level 3 should be 100 * 2^3 = 800
			// Use toBeCloseTo for floating point comparison
			const cost = upgrades.getNextCost('repeatable_upgrade');
			expect(cost.toNumber()).toBeCloseTo(800, 5);
		});

		it('should handle null/undefined data gracefully', () => {
			expect(() => upgrades.deserialize(null)).not.toThrow();
			expect(() => upgrades.deserialize(undefined)).not.toThrow();
			expect(() => upgrades.deserialize({})).not.toThrow();
		});
	});

	// ============================================================================
	// Reset Tests
	// ============================================================================
	describe('reset', () => {
		it('should reset run upgrades to level 0', () => {
			const runUpgrade = createRepeatableUpgrade({ category: 'run' });
			upgrades.registerUpgrade(runUpgrade);
			resources.add('pixels', D(10000));
			upgrades.purchase('repeatable_upgrade', { amount: 5 });

			upgrades.reset();

			expect(upgrades.getLevel('repeatable_upgrade')).toBe(0);
		});

		it('should preserve eternal upgrade levels', () => {
			const eternalUpgrade = createTestUpgrade({
				id: 'eternal_test',
				category: 'eternal',
				currency: 'primordial'
			});
			upgrades.registerUpgrade(eternalUpgrade);
			resources.add('primordial_pixels', D(1000));
			upgrades.purchase('eternal_test');

			upgrades.reset();

			expect(upgrades.getLevel('eternal_test')).toBe(1);
		});

		it('should preserve secret upgrade levels', () => {
			const secretUpgrade = createTestUpgrade({
				id: 'secret_test',
				category: 'secret',
				currency: 'primordial'
			});
			upgrades.registerUpgrade(secretUpgrade);
			upgrades.unlock('secret_test'); // Manually unlock since it's secret
			resources.add('primordial_pixels', D(1000));
			upgrades.purchase('secret_test');

			upgrades.reset();

			expect(upgrades.getLevel('secret_test')).toBe(1);
		});

		it('should reset phase to 1', () => {
			upgrades.setPhase(5);
			upgrades.reset();

			// Verify by checking if phase 2+ upgrades are locked
			const phase2Upgrade = createTestUpgrade({ id: 'phase2', minPhase: 2 });
			upgrades.registerUpgrade(phase2Upgrade);

			expect(upgrades.isUnlocked('phase2')).toBe(false);
		});
	});

	// ============================================================================
	// Derived State Tests
	// ============================================================================
	describe('derived state', () => {
		it('should track owned run upgrades', () => {
			const runUpgrade = createTestUpgrade({ id: 'run_test', category: 'run' });
			upgrades.registerUpgrade(runUpgrade);
			resources.add('pixels', D(1000));
			upgrades.purchase('run_test');

			expect(upgrades.ownedRunUpgrades).toContain('run_test');
		});

		it('should track owned eternal upgrades', () => {
			const eternalUpgrade = createTestUpgrade({
				id: 'eternal_test',
				category: 'eternal',
				currency: 'primordial'
			});
			upgrades.registerUpgrade(eternalUpgrade);
			resources.add('primordial_pixels', D(1000));
			upgrades.purchase('eternal_test');

			expect(upgrades.ownedEternalUpgrades).toContain('eternal_test');
		});

		it('should track unlocked upgrades', () => {
			const testUpgrade = createTestUpgrade();
			upgrades.registerUpgrade(testUpgrade);

			expect(upgrades.unlockedUpgrades).toContain('test_upgrade');
		});

		it('should track purchasable upgrades', () => {
			const testUpgrade = createTestUpgrade({ baseCost: 100 });
			upgrades.registerUpgrade(testUpgrade);

			// Not purchasable without resources
			upgrades.tick(0.1);
			expect(upgrades.purchasableUpgrades).not.toContain('test_upgrade');

			// Purchasable with resources
			resources.add('pixels', D(100));
			upgrades.tick(0.1);
			expect(upgrades.purchasableUpgrades).toContain('test_upgrade');
		});
	});

	// ============================================================================
	// Integration with Real Upgrade Data
	// ============================================================================
	describe('integration with real upgrade data', () => {
		it('should register all phase 1 run upgrades', () => {
			const phase1Upgrades = RUN_UPGRADES.filter((u) => u.minPhase === 1);
			upgrades.registerUpgrades(phase1Upgrades);

			for (const upgrade of phase1Upgrades) {
				expect(upgrades.getDefinition(upgrade.id)).toBeDefined();
			}
		});

		it('should register all eternal upgrades', () => {
			upgrades.registerUpgrades(ETERNAL_UPGRADES);

			for (const upgrade of ETERNAL_UPGRADES) {
				expect(upgrades.getDefinition(upgrade.id)).toBeDefined();
			}
		});

		it('should handle upgrade dependencies correctly', () => {
			// Register all upgrades
			upgrades.registerUpgrades([...RUN_UPGRADES, ...ETERNAL_UPGRADES]);

			// quick_start has no requirements, should be purchasable
			resources.add('primordial_pixels', D(1000));
			expect(upgrades.canAfford(UpgradeId.QUICK_START)).toBe(true);

			// early_automation requires quick_start
			// Without owning quick_start, it should remain locked
			expect(upgrades.isUnlocked('early_automation')).toBe(false);

			// After buying quick_start, early_automation should unlock
			upgrades.purchase(UpgradeId.QUICK_START);
			upgrades.tick(0.1); // Trigger unlock check

			expect(upgrades.isUnlocked('early_automation')).toBe(true);
		});
	});
});
