/**
 * @fileoverview Unit tests for SaveMigration utilities.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	MigrationRegistry,
	sanitizeSaveData,
	DEFAULT_RUN_STATE,
	DEFAULT_ETERNAL_STATE
} from '$lib/engine/core/SaveMigration';
import type { SerializedGameState } from '$lib/engine/models/types';

describe('MigrationRegistry', () => {
	let registry: MigrationRegistry;

	beforeEach(() => {
		registry = new MigrationRegistry(3); // Current version 3
	});

	describe('Initialization', () => {
		it('should initialize with correct version', () => {
			expect(registry.getCurrentVersion()).toBe(3);
		});

		it('should have no registered migrations initially', () => {
			expect(registry.getRegisteredVersions()).toEqual([]);
		});
	});

	describe('Register Migrations', () => {
		it('should register a migration', () => {
			registry.registerMigration(2, (data) => data);

			expect(registry.getRegisteredVersions()).toContain(2);
		});

		it('should throw when registering duplicate version', () => {
			registry.registerMigration(2, (data) => data);

			expect(() => {
				registry.registerMigration(2, (data) => data);
			}).toThrow('already exists');
		});
	});

	describe('Migration Execution', () => {
		it('should return unchanged data if already at current version', () => {
			const data = createMockSaveData(3);
			const result = registry.migrate(data);

			expect(result).toEqual(data);
		});

		it('should apply single migration', () => {
			// Create registry with version 2 so we only need one migration
			const registry2 = new MigrationRegistry(2);
			registry2.registerMigration(2, (data) => {
				data.run.currentPhase = 99;
				return data;
			});

			const data = createMockSaveData(1);
			const result = registry2.migrate(data);

			expect(result.run.currentPhase).toBe(99);
		});

		it('should apply migrations sequentially', () => {
			const order: number[] = [];

			registry.registerMigration(2, (data) => {
				order.push(2);
				return data;
			});
			registry.registerMigration(3, (data) => {
				order.push(3);
				return data;
			});

			const data = createMockSaveData(1);
			registry.migrate(data);

			expect(order).toEqual([2, 3]);
		});

		it('should update version after each migration', () => {
			registry.registerMigration(2, (data) => data);
			registry.registerMigration(3, (data) => data);

			const data = createMockSaveData(1);
			const result = registry.migrate(data);

			expect(result.meta.version).toBe(3);
		});

		it('should throw if migration is missing', () => {
			registry.registerMigration(3, (data) => data);
			// Missing migration for version 2

			const data = createMockSaveData(1);

			expect(() => registry.migrate(data)).toThrow('Missing migration');
		});

		it('should not downgrade newer saves', () => {
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

			const data = createMockSaveData(5); // Newer than current
			const result = registry.migrate(data);

			expect(result.meta.version).toBe(5);
			expect(consoleSpy).toHaveBeenCalled();

			consoleSpy.mockRestore();
		});
	});

	describe('Can Migrate', () => {
		it('should return true if already at current version', () => {
			expect(registry.canMigrate(3)).toBe(true);
		});

		it('should return false if from newer version', () => {
			expect(registry.canMigrate(5)).toBe(false);
		});

		it('should return true if all migrations exist', () => {
			registry.registerMigration(2, (data) => data);
			registry.registerMigration(3, (data) => data);

			expect(registry.canMigrate(1)).toBe(true);
		});

		it('should return false if migration is missing', () => {
			registry.registerMigration(3, (data) => data);
			// Missing version 2

			expect(registry.canMigrate(1)).toBe(false);
		});
	});
});

describe('sanitizeSaveData', () => {
	it('should handle completely empty input', () => {
		const result = sanitizeSaveData({});

		expect(result).toHaveProperty('run');
		expect(result).toHaveProperty('eternal');
		expect(result).toHaveProperty('meta');
	});

	it('should set default phase values', () => {
		const result = sanitizeSaveData({});

		expect(result.run.currentPhase).toBe(1);
		expect(result.run.highestPhase).toBe(1);
		expect(result.eternal.highestPhaseEver).toBe(1);
	});

	it('should clamp phase values to valid range', () => {
		const result = sanitizeSaveData({
			run: {
				currentPhase: 50, // Invalid, too high
				highestPhase: -5 // Invalid, negative
			}
		} as any);

		expect(result.run.currentPhase).toBe(20); // Clamped to max
		expect(result.run.highestPhase).toBe(1); // Clamped to min
	});

	it('should sanitize string records', () => {
		const result = sanitizeSaveData({
			run: {
				resources: {
					valid: '100',
					number: 50,
					null: null,
					empty: ''
				}
			}
		} as any);

		expect(result.run.resources).toHaveProperty('valid');
		expect(result.run.resources['number']).toBe('50');
		expect(result.run.resources).not.toHaveProperty('null');
		expect(result.run.resources).not.toHaveProperty('empty');
	});

	it('should sanitize string arrays and remove duplicates', () => {
		const result = sanitizeSaveData({
			run: {
				purchasedUpgrades: ['a', 'b', 'a', null, '', 'c']
			}
		} as any);

		expect(result.run.purchasedUpgrades).toEqual(['a', 'b', 'c']);
	});

	it('should validate notation preference', () => {
		const validResult = sanitizeSaveData({
			eternal: {
				preferences: { notation: 'scientific' }
			}
		} as any);
		expect(validResult.eternal.preferences.notation).toBe('scientific');

		const invalidResult = sanitizeSaveData({
			eternal: {
				preferences: { notation: 'invalid' }
			}
		} as any);
		expect(invalidResult.eternal.preferences.notation).toBe('mixed');
	});

	it('should clamp volume values', () => {
		const result = sanitizeSaveData({
			eternal: {
				preferences: {
					volume: {
						master: 1.5, // Over max
						music: -0.5, // Under min
						sfx: 0.5 // Valid
					}
				}
			}
		} as any);

		expect(result.eternal.preferences.volume.master).toBe(1);
		expect(result.eternal.preferences.volume.music).toBe(0);
		expect(result.eternal.preferences.volume.sfx).toBe(0.5);
	});

	it('should ensure non-negative run time', () => {
		const result = sanitizeSaveData({
			run: { runTime: -100 }
		} as any);

		expect(result.run.runTime).toBe(0);
	});

	it('should generate save ID if missing', () => {
		const result = sanitizeSaveData({});

		expect(result.meta.saveId).toBeDefined();
		expect(result.meta.saveId.length).toBeGreaterThan(0);
	});
});

describe('DEFAULT_RUN_STATE', () => {
	it('should return fresh run state', () => {
		const state = DEFAULT_RUN_STATE();

		expect(state.currentPhase).toBe(1);
		expect(state.highestPhase).toBe(1);
		expect(state.runTime).toBe(0);
		expect(state.resources).toEqual({});
		expect(state.purchasedUpgrades).toEqual([]);
	});

	it('should return new object each call', () => {
		const state1 = DEFAULT_RUN_STATE();
		const state2 = DEFAULT_RUN_STATE();

		state1.currentPhase = 10;
		expect(state2.currentPhase).toBe(1);
	});
});

describe('DEFAULT_ETERNAL_STATE', () => {
	it('should return fresh eternal state', () => {
		const state = DEFAULT_ETERNAL_STATE();

		expect(state.totalRebirths).toBe(0);
		expect(state.totalPlayTime).toBe(0);
		expect(state.eternalResources).toEqual({});
		expect(state.achievements).toEqual([]);
	});

	it('should have default preferences', () => {
		const state = DEFAULT_ETERNAL_STATE();

		expect(state.preferences.notation).toBe('mixed');
		expect(state.preferences.animationSpeed).toBe(1.0);
		expect(state.preferences.confirmRebirth).toBe(true);
	});

	it('should have valid statistics', () => {
		const state = DEFAULT_ETERNAL_STATE();

		expect(state.statistics.totalClicks).toBe(0);
		expect(state.statistics.fastestRunTime).toBeNull();
		expect(state.statistics.firstPlayDate).toBeGreaterThan(0);
	});
});

// Helper function to create mock save data
function createMockSaveData(version: number): SerializedGameState {
	return {
		run: {
			resources: {},
			productionRates: {},
			purchasedUpgrades: [],
			upgradeLevels: {},
			currentPhase: 1,
			highestPhase: 1,
			runTime: 0,
			triggeredStoryEvents: [],
			storyChoices: {},
			unlockedResources: [],
			unlockedUpgrades: []
		},
		eternal: {
			totalRebirths: 0,
			totalPlayTime: 0,
			eternalResources: {},
			eternalUpgrades: [],
			achievements: [],
			permanentStoryFlags: [],
			permanentChoices: {},
			statistics: {
				totalPixelsGenerated: '0',
				totalClicks: 0,
				fastestPhaseTimes: {},
				fastestRunTime: null,
				totalUpgradesPurchased: 0,
				totalStoryEventsTriggered: 0,
				firstPlayDate: Date.now(),
				lastPlayDate: Date.now()
			},
			highestPhaseEver: 1,
			discoveredSecrets: [],
			preferences: {
				notation: 'mixed',
				animationSpeed: 1.0,
				showOfflineProgress: true,
				autoSaveInterval: 30,
				pauseOnStory: false,
				confirmRebirth: true,
				volume: { master: 1.0, music: 0.7, sfx: 0.8 }
			}
		},
		meta: {
			version,
			lastSaved: Date.now(),
			lastPlayed: Date.now(),
			gameVersion: '0.1.0',
			saveId: 'test-save-id'
		}
	};
}
