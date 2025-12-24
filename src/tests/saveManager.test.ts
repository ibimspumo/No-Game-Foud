/**
 * @fileoverview Unit tests for SaveManager.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SaveManager } from '$lib/engine/core/SaveManager';
import { EventManager } from '$lib/engine/core/EventManager';

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: vi.fn((key: string) => store[key] || null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value;
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		})
	};
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('SaveManager', () => {
	let events: EventManager;
	let saveManager: SaveManager;

	beforeEach(() => {
		localStorageMock.clear();
		vi.clearAllMocks();
		events = new EventManager();
		saveManager = new SaveManager(events, 'test_save', '0.1.0', 30000);
	});

	afterEach(() => {
		saveManager.stopAutoSave();
	});

	describe('Initialization', () => {
		it('should initialize with fresh state', () => {
			saveManager.init();

			const state = saveManager.getState();
			expect(state).not.toBeNull();
			expect(state?.run.currentPhase).toBe(1);
			expect(state?.eternal.totalRebirths).toBe(0);
		});

		it('should have correct save key', () => {
			saveManager.init();
			saveManager.save({ force: true });

			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'test_save',
				expect.any(String)
			);
		});
	});

	describe('Save Operations', () => {
		it('should save state to localStorage', () => {
			saveManager.init();
			saveManager.markDirty();
			const result = saveManager.save({ force: true, skipThrottle: true });

			expect(result).toBe(true);
			expect(localStorageMock.setItem).toHaveBeenCalled();
		});

		it('should not save if not dirty and not forced', () => {
			saveManager.init();
			// Don't mark dirty
			const result = saveManager.save({ force: false, skipThrottle: true });

			expect(result).toBe(false);
		});

		it('should create backup before saving', () => {
			saveManager.init();
			saveManager.save({ force: true, skipThrottle: true });

			// First save - no backup needed
			expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);

			// Second save - backup should be created
			saveManager.markDirty();
			saveManager.save({ force: true, skipThrottle: true });

			// Main save + backup = 2 calls
			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'test_save_backup',
				expect.any(String)
			);
		});

		it('should emit game_saved event', () => {
			const callback = vi.fn();
			events.on('game_saved', callback);

			saveManager.init();
			saveManager.save({ force: true, skipThrottle: true });

			expect(callback).toHaveBeenCalled();
		});
	});

	describe('Load Operations', () => {
		it('should return null if no save exists', () => {
			const state = saveManager.load();
			expect(state).toBeNull();
		});

		it('should load existing save', () => {
			// Create and save a state
			saveManager.init();
			const originalState = saveManager.getState()!;
			originalState.run.currentPhase = 5;
			saveManager.setState(originalState);
			saveManager.save({ force: true, skipThrottle: true });

			// Create new manager and load
			const saveManager2 = new SaveManager(events, 'test_save', '0.1.0', 30000);
			const loadedState = saveManager2.load();

			expect(loadedState).not.toBeNull();
			expect(loadedState?.run.currentPhase).toBe(5);
		});

		it('should load from backup if main save is corrupted', () => {
			// Set up a valid backup and corrupted main save
			saveManager.init();

			// First save - creates main save
			saveManager.save({ force: true, skipThrottle: true });

			// Second save - creates backup of the first save
			saveManager.markDirty();
			saveManager.save({ force: true, skipThrottle: true });

			// Corrupt the main save
			localStorageMock.setItem('test_save', 'not valid json');

			// Should fall back to backup
			const loadedState = saveManager.load();
			expect(loadedState).not.toBeNull();
		});
	});

	describe('Dirty State Tracking', () => {
		it('should track dirty state', () => {
			saveManager.init();

			expect(saveManager.isDirtyState()).toBe(false);

			saveManager.markDirty();
			expect(saveManager.isDirtyState()).toBe(true);
		});

		it('should clear dirty state after save', () => {
			saveManager.init();
			saveManager.markDirty();
			saveManager.save({ force: true, skipThrottle: true });

			expect(saveManager.isDirtyState()).toBe(false);
		});
	});

	describe('Auto-Save', () => {
		it('should start auto-save timer', () => {
			vi.useFakeTimers();

			saveManager.init();
			saveManager.markDirty();
			saveManager.setAutoSaveInterval(100);
			saveManager.setAutoSaveEnabled(true);

			vi.advanceTimersByTime(150);

			expect(localStorageMock.setItem).toHaveBeenCalled();

			vi.useRealTimers();
		});

		it('should stop auto-save timer', () => {
			vi.useFakeTimers();

			saveManager.init();
			saveManager.setAutoSaveInterval(100);
			saveManager.setAutoSaveEnabled(true);
			saveManager.stopAutoSave();

			localStorageMock.setItem.mockClear();
			saveManager.markDirty();

			vi.advanceTimersByTime(150);

			// Should not have auto-saved
			expect(localStorageMock.setItem).not.toHaveBeenCalled();

			vi.useRealTimers();
		});
	});

	describe('Delete Operations', () => {
		it('should delete save from localStorage', () => {
			saveManager.init();
			saveManager.save({ force: true, skipThrottle: true });

			saveManager.deleteSave();

			expect(localStorageMock.removeItem).toHaveBeenCalledWith('test_save');
			expect(localStorageMock.removeItem).toHaveBeenCalledWith('test_save_backup');
		});

		it('should reset to fresh state after delete', () => {
			saveManager.init();
			const originalState = saveManager.getState()!;
			originalState.run.currentPhase = 10;
			saveManager.setState(originalState);

			saveManager.deleteSave();

			const state = saveManager.getState();
			expect(state?.run.currentPhase).toBe(1);
		});
	});

	describe('Has Save', () => {
		it('should return false when no save exists', () => {
			expect(saveManager.hasSave()).toBe(false);
		});

		it('should return true when save exists', () => {
			saveManager.init();
			saveManager.save({ force: true, skipThrottle: true });

			expect(saveManager.hasSave()).toBe(true);
		});
	});

	describe('Reset for Rebirth', () => {
		it('should reset run state but preserve eternal state', () => {
			saveManager.init();
			const state = saveManager.getState()!;

			// Modify both run and eternal state
			state.run.currentPhase = 15;
			state.eternal.totalRebirths = 5;
			saveManager.setState(state);

			// Reset (rebirth)
			saveManager.reset();

			const newState = saveManager.getState()!;
			expect(newState.run.currentPhase).toBe(1);
			expect(newState.eternal.totalRebirths).toBe(5);
		});
	});

	describe('Serialization', () => {
		it('should serialize state correctly', () => {
			saveManager.init();
			const serialized = saveManager.serialize();

			expect(serialized).toHaveProperty('run');
			expect(serialized).toHaveProperty('eternal');
			expect(serialized).toHaveProperty('meta');
		});

		it('should deserialize state correctly', () => {
			saveManager.init();

			const mockData = {
				run: {
					resources: {},
					productionRates: {},
					purchasedUpgrades: [],
					upgradeLevels: {},
					currentPhase: 7,
					highestPhase: 7,
					runTime: 1000,
					triggeredStoryEvents: [],
					storyChoices: {},
					unlockedResources: [],
					unlockedUpgrades: []
				},
				eternal: {
					totalRebirths: 3,
					totalPlayTime: 5000,
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
					highestPhaseEver: 7,
					discoveredSecrets: [],
					preferences: {
						notation: 'mixed',
						animationSpeed: 1.0,
						showOfflineProgress: true,
						autoSaveInterval: 30,
						pauseOnStory: false,
						confirmRebirth: true,
						volume: { master: 0.7, music: 0.5, sfx: 0.6 }
					}
				},
				meta: {
					version: 1,
					lastSaved: Date.now(),
					lastPlayed: Date.now(),
					gameVersion: '0.1.0',
					saveId: 'test'
				}
			};

			saveManager.deserialize(mockData);

			const state = saveManager.getState()!;
			expect(state.run.currentPhase).toBe(7);
			expect(state.eternal.totalRebirths).toBe(3);
		});
	});
});

describe('SaveManager Import/Export', () => {
	let events: EventManager;
	let saveManager: SaveManager;

	beforeEach(() => {
		localStorageMock.clear();
		vi.clearAllMocks();
		events = new EventManager();
		saveManager = new SaveManager(events, 'test_save', '0.1.0', 30000);
		saveManager.init();
	});

	afterEach(() => {
		saveManager.stopAutoSave();
	});

	describe('Export', () => {
		it('should export save as Base64 string', () => {
			const exported = saveManager.exportSave();

			expect(exported).not.toBeNull();
			expect(typeof exported).toBe('string');

			// Should be valid Base64
			expect(() => atob(exported!)).not.toThrow();
		});

		it('should export valid JSON when decoded', () => {
			const exported = saveManager.exportSave();
			const decoded = atob(exported!);
			const parsed = JSON.parse(decoded);

			expect(parsed).toHaveProperty('state');
			expect(parsed).toHaveProperty('formatVersion');
		});
	});

	describe('Import', () => {
		it('should import valid Base64 save string', () => {
			// Export and then import
			const exported = saveManager.exportSave()!;

			// Modify current state
			const state = saveManager.getState()!;
			state.run.currentPhase = 10;
			saveManager.setState(state);

			// Import the old export
			const result = saveManager.importSave(exported);

			expect(result).toBe(true);
		});

		it('should reject invalid Base64 string', () => {
			const result = saveManager.importSave('not valid base64!!!');
			expect(result).toBe(false);
		});

		it('should reject invalid JSON after decode', () => {
			const invalidJson = btoa('not valid json');
			const result = saveManager.importSave(invalidJson);
			expect(result).toBe(false);
		});
	});
});

describe('SaveManager Hard Reset', () => {
	let events: EventManager;
	let saveManager: SaveManager;

	beforeEach(() => {
		localStorageMock.clear();
		vi.clearAllMocks();
		events = new EventManager();
		saveManager = new SaveManager(events, 'test_save', '0.1.0', 30000);
		saveManager.init();
	});

	afterEach(() => {
		saveManager.stopAutoSave();
	});

	describe('Hard Reset', () => {
		it('should delete all save data', () => {
			saveManager.save({ force: true, skipThrottle: true });
			saveManager.hardReset();

			expect(localStorageMock.removeItem).toHaveBeenCalledWith('test_save');
		});

		it('should create emergency backup', () => {
			saveManager.save({ force: true, skipThrottle: true });
			saveManager.hardReset();

			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				expect.stringContaining('emergency_backup'),
				expect.any(String)
			);
		});

		it('should reset to fresh state', () => {
			const state = saveManager.getState()!;
			state.run.currentPhase = 15;
			state.eternal.totalRebirths = 10;
			saveManager.setState(state);

			saveManager.hardReset();

			const newState = saveManager.getState()!;
			expect(newState.run.currentPhase).toBe(1);
			expect(newState.eternal.totalRebirths).toBe(0);
		});
	});

	describe('Emergency Backup Recovery', () => {
		it('should detect emergency backup existence', () => {
			saveManager.save({ force: true, skipThrottle: true });
			saveManager.hardReset();

			expect(saveManager.hasEmergencyBackup()).toBe(true);
		});

		it('should recover from emergency backup', () => {
			const state = saveManager.getState()!;
			state.run.currentPhase = 12;
			saveManager.setState(state);
			saveManager.save({ force: true, skipThrottle: true });

			saveManager.hardReset();

			const recovered = saveManager.recoverFromEmergencyBackup();
			expect(recovered).toBe(true);

			const newState = saveManager.getState();
			expect(newState?.run.currentPhase).toBe(12);
		});
	});
});
