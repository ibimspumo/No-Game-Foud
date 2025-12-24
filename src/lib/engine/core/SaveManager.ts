/**
 * @fileoverview Save Manager for the game engine.
 * Implements a two-layer save architecture with run state and eternal state.
 *
 * Features:
 * - Two-layer architecture (Run State + Eternal State)
 * - Auto-save with configurable interval
 * - Manual save/load from localStorage
 * - Dirty state tracking (only save when changes occurred)
 * - Save throttling (max 1x per second)
 * - Event integration for save lifecycle
 * - Import/Export functionality with Base64 encoding
 * - Save data migration and sanitization
 * - Hard reset with 24-hour emergency backup
 * - Emergency recovery system
 *
 * @module engine/core/SaveManager
 */

import type { EventManager } from './EventManager';
import type {
	Manager,
	GameState,
	SerializedGameState,
	SerializedRunState,
	SerializedEternalState,
	SerializedStatistics,
	RunState,
	EternalState,
	GameStatistics,
	PlayerPreferences,
	SaveMeta
} from '../models/types';
import { D, type Decimal } from '../utils/decimal';
import { MigrationRegistry, sanitizeSaveData } from './SaveMigration';

/**
 * Serialized save data structure.
 * This is what gets stored in localStorage.
 */
export interface SerializedSaveData {
	/** Serialized game state */
	state: SerializedGameState;
	/** Save format version for migrations */
	formatVersion: number;
	/** Last time this save was modified */
	lastModified: number;
}

/**
 * Options for saving.
 */
export interface SaveOptions {
	/** Whether this is an auto-save */
	isAutoSave?: boolean;
	/** Whether to force save even if no changes */
	force?: boolean;
	/** Whether to skip throttling */
	skipThrottle?: boolean;
}

/**
 * Default player preferences.
 */
const DEFAULT_PREFERENCES: PlayerPreferences = {
	notation: 'mixed',
	animationSpeed: 1.0,
	showOfflineProgress: true,
	autoSaveInterval: 30,
	pauseOnStory: false,
	confirmRebirth: true,
	volume: {
		master: 0.7,
		music: 0.5,
		sfx: 0.6
	}
};

/**
 * Default game statistics.
 */
const DEFAULT_STATISTICS: GameStatistics = {
	totalPixelsGenerated: D(0),
	totalClicks: 0,
	fastestPhaseTimes: {},
	fastestRunTime: null,
	totalUpgradesPurchased: 0,
	totalStoryEventsTriggered: 0,
	firstPlayDate: Date.now(),
	lastPlayDate: Date.now()
};

/**
 * Save Manager implementing two-layer save architecture.
 *
 * Manages all save/load operations with dirty tracking, throttling,
 * and automatic saving to prevent data loss.
 *
 * @example
 * ```typescript
 * const saveManager = new SaveManager(events, config);
 * saveManager.init();
 *
 * // Save manually
 * saveManager.save({ isAutoSave: false });
 *
 * // Load save
 * const hasExisting = saveManager.hasSave();
 * if (hasExisting) {
 *   const state = saveManager.load();
 * }
 * ```
 */
export class SaveManager implements Manager {
	/**
	 * Reference to the event manager for emitting save events.
	 */
	private readonly events: EventManager;

	/**
	 * localStorage key for the main save.
	 */
	private readonly saveKey: string;

	/**
	 * localStorage key for the backup save.
	 */
	private readonly backupKey: string;

	/**
	 * localStorage key for emergency backup (24-hour recovery after hard reset).
	 */
	private readonly emergencyBackupKey: string;

	/**
	 * localStorage key for emergency backup timestamp.
	 */
	private readonly emergencyBackupTimestampKey: string;

	/**
	 * Current game version for save migrations.
	 */
	private readonly gameVersion: string;

	/**
	 * Migration registry for handling save format upgrades.
	 */
	private readonly migrationRegistry: MigrationRegistry;

	/**
	 * Current game state (in-memory).
	 */
	private state: GameState | null = null;

	/**
	 * Whether the state has been modified since last save.
	 */
	private isDirty: boolean = false;

	/**
	 * Timestamp of the last save operation (for throttling).
	 */
	private lastSaveTime: number = 0;

	/**
	 * Minimum interval between saves in milliseconds (1 second).
	 */
	private readonly saveThrottleMs: number = 1000;

	/**
	 * Auto-save timer ID.
	 */
	private autoSaveTimerId: ReturnType<typeof setInterval> | null = null;

	/**
	 * Auto-save interval in milliseconds.
	 */
	private autoSaveInterval: number;

	/**
	 * Whether auto-save is enabled.
	 */
	private autoSaveEnabled: boolean = true;

	/**
	 * Creates a new SaveManager instance.
	 *
	 * @param events - Event manager for emitting save events
	 * @param saveKey - localStorage key for the main save
	 * @param gameVersion - Current game version
	 * @param autoSaveInterval - Auto-save interval in milliseconds
	 */
	constructor(
		events: EventManager,
		saveKey: string = 'pixel_singularity_save',
		gameVersion: string = '0.1.0',
		autoSaveInterval: number = 30000
	) {
		this.events = events;
		this.saveKey = saveKey;
		this.backupKey = `${saveKey}_backup`;
		this.emergencyBackupKey = 'pixelsingularity_emergency_backup';
		this.emergencyBackupTimestampKey = 'pixelsingularity_emergency_backup_timestamp';
		this.gameVersion = gameVersion;
		this.autoSaveInterval = autoSaveInterval;
		this.migrationRegistry = new MigrationRegistry(1); // Current format version is 1
	}

	// ============================================================================
	// Manager Interface Implementation
	// ============================================================================

	/**
	 * Initialize the save manager.
	 * Sets up the initial game state and starts auto-save.
	 */
	init(): void {
		// Clean up any expired emergency backups
		this.cleanExpiredEmergencyBackup();

		// Initialize with a fresh game state
		this.state = this.createFreshState();

		// Start auto-save timer
		this.startAutoSave();
	}

	/**
	 * Update the save manager.
	 * Handles auto-save logic.
	 *
	 * @param deltaTime - Time since last tick in seconds
	 */
	tick(deltaTime: number): void {
		// SaveManager doesn't need per-tick updates
		// Auto-save is handled by setInterval
	}

	/**
	 * Reset the run state for rebirth.
	 * Clears transient state but preserves eternal state.
	 */
	reset(): void {
		if (!this.state) return;

		// Reset run state to defaults
		this.state.run = this.createDefaultRunState();

		// Update meta
		this.state.meta.lastPlayed = Date.now();

		// Mark as dirty
		this.markDirty();
	}

	/**
	 * Serialize the save manager's state.
	 * Returns the current game state in serializable format.
	 *
	 * @returns Serialized game state
	 */
	serialize(): SerializedGameState | null {
		if (!this.state) return null;

		return this.serializeGameState(this.state);
	}

	/**
	 * Deserialize and restore the save manager's state.
	 *
	 * @param data - Previously serialized state
	 */
	deserialize(data: unknown): void {
		if (!data || typeof data !== 'object') {
			console.warn('[SaveManager] Invalid deserialize data');
			return;
		}

		const serialized = data as SerializedGameState;
		this.state = this.deserializeGameState(serialized);

		// Clear dirty flag after loading
		this.isDirty = false;
	}

	// ============================================================================
	// Save Operations
	// ============================================================================

	/**
	 * Save the current game state to localStorage.
	 *
	 * @param options - Save options
	 * @returns Whether save was successful
	 */
	save(options: SaveOptions = {}): boolean {
		const { isAutoSave = false, force = false, skipThrottle = false } = options;

		// Check if we should skip this save
		if (!this.shouldSave(force, skipThrottle)) {
			return false;
		}

		// Emit save_started event
		this.events.emit('game_saved', {
			timestamp: Date.now(),
			saveSize: 0, // Will be updated after save
			isAutoSave
		});

		try {
			if (!this.state) {
				throw new Error('No state to save');
			}

			// Update save metadata
			this.state.meta.lastSaved = Date.now();
			this.state.meta.lastPlayed = Date.now();

			// Serialize the state
			const serialized = this.serializeGameState(this.state);

			// Create save data wrapper
			const saveData: SerializedSaveData = {
				state: serialized,
				formatVersion: 1,
				lastModified: Date.now()
			};

			// Convert to JSON
			const saveString = JSON.stringify(saveData);
			const saveSize = saveString.length;

			// Create backup of previous save
			const existingSave = localStorage.getItem(this.saveKey);
			if (existingSave) {
				localStorage.setItem(this.backupKey, existingSave);
			}

			// Save to localStorage
			localStorage.setItem(this.saveKey, saveString);

			// Update tracking
			this.lastSaveTime = Date.now();
			this.isDirty = false;

			// Emit save_completed event
			this.events.emit('game_saved', {
				timestamp: Date.now(),
				saveSize,
				isAutoSave
			});

			return true;
		} catch (error) {
			console.error('[SaveManager] Save failed:', error);

			// Emit save_failed event (not in GameEventMap, but could be added)
			// For now, just log the error

			return false;
		}
	}

	/**
	 * Load game state from localStorage.
	 *
	 * @returns Loaded game state or null if no save exists
	 */
	load(): GameState | null {
		try {
			const saveString = localStorage.getItem(this.saveKey);
			if (!saveString) {
				return null;
			}

			// Parse save data
			const saveData = JSON.parse(saveString) as SerializedSaveData;

			// Sanitize data in case of corruption
			const sanitized = sanitizeSaveData(saveData.state);

			// Apply migrations if formatVersion is older than current
			const migrated = this.migrationRegistry.migrate(sanitized);

			// Deserialize the game state
			const state = this.deserializeGameState(migrated);

			// Update state reference
			this.state = state;

			// Clear dirty flag
			this.isDirty = false;

			// Update last played time
			state.meta.lastPlayed = Date.now();

			return state;
		} catch (error) {
			console.error('[SaveManager] Load failed:', error);

			// Try to load backup
			return this.loadBackup();
		}
	}

	/**
	 * Load the backup save.
	 *
	 * @returns Backup game state or null if no backup exists
	 */
	loadBackup(): GameState | null {
		try {
			const backupString = localStorage.getItem(this.backupKey);
			if (!backupString) {
				return null;
			}

			const saveData = JSON.parse(backupString) as SerializedSaveData;
			const state = this.deserializeGameState(saveData.state);

			this.state = state;
			this.isDirty = false;

			console.warn('[SaveManager] Loaded from backup');

			return state;
		} catch (error) {
			console.error('[SaveManager] Backup load failed:', error);
			return null;
		}
	}

	/**
	 * Check if a save exists in localStorage.
	 *
	 * @returns Whether a save exists
	 */
	hasSave(): boolean {
		return localStorage.getItem(this.saveKey) !== null;
	}

	/**
	 * Delete the save from localStorage.
	 */
	deleteSave(): void {
		localStorage.removeItem(this.saveKey);
		localStorage.removeItem(this.backupKey);

		// Reset to fresh state
		this.state = this.createFreshState();
		this.isDirty = false;
	}

	// ============================================================================
	// Import/Export
	// ============================================================================

	/**
	 * Export the current save as a Base64-encoded string.
	 * This can be used for backups or transferring saves between devices.
	 *
	 * @returns Base64-encoded save string, or null if no save exists
	 *
	 * @example
	 * ```typescript
	 * const saveString = saveManager.exportSave();
	 * if (saveString) {
	 *   // Copy to clipboard or download as file
	 *   navigator.clipboard.writeText(saveString);
	 * }
	 * ```
	 */
	exportSave(): string | null {
		try {
			if (!this.state) {
				console.warn('[SaveManager] No state to export');
				return null;
			}

			// Update save metadata
			this.state.meta.lastSaved = Date.now();
			this.state.meta.lastPlayed = Date.now();

			// Serialize the state
			const serialized = this.serializeGameState(this.state);

			// Create save data wrapper
			const saveData: SerializedSaveData = {
				state: serialized,
				formatVersion: 1,
				lastModified: Date.now()
			};

			// Convert to JSON and encode to Base64
			const json = JSON.stringify(saveData);
			const base64 = btoa(json);

			// Emit export event
			this.events.emit('game_saved', {
				timestamp: Date.now(),
				saveSize: base64.length,
				isAutoSave: false
			});

			console.log('[SaveManager] Save exported successfully');
			return base64;
		} catch (error) {
			console.error('[SaveManager] Export failed:', error);
			return null;
		}
	}

	/**
	 * Import a save from a Base64-encoded string.
	 * Validates and migrates the save data before loading.
	 *
	 * @param saveString - Base64-encoded save string
	 * @returns Whether import was successful
	 *
	 * @example
	 * ```typescript
	 * const success = saveManager.importSave(userProvidedString);
	 * if (success) {
	 *   console.log('Save imported successfully');
	 * } else {
	 *   console.error('Import failed - invalid save data');
	 * }
	 * ```
	 */
	importSave(saveString: string): boolean {
		try {
			// Decode from Base64
			const json = atob(saveString);

			// Parse JSON
			const saveData = JSON.parse(json) as SerializedSaveData;

			// Validate basic structure
			if (!saveData.state || !saveData.state.meta || !saveData.state.run || !saveData.state.eternal) {
				throw new Error('Invalid save data structure');
			}

			// Sanitize data in case of corruption
			const sanitized = sanitizeSaveData(saveData.state);

			// Apply migrations if needed
			const migrated = this.migrationRegistry.migrate(sanitized);

			// Deserialize the game state
			const state = this.deserializeGameState(migrated);

			// Backup current save before importing
			const currentSave = localStorage.getItem(this.saveKey);
			if (currentSave) {
				localStorage.setItem(this.backupKey, currentSave);
			}

			// Update save data with migrated state
			const newSaveData: SerializedSaveData = {
				state: migrated,
				formatVersion: 1,
				lastModified: Date.now()
			};

			// Save to localStorage
			localStorage.setItem(this.saveKey, JSON.stringify(newSaveData));

			// Update state reference
			this.state = state;
			this.isDirty = false;

			// Update last played time
			state.meta.lastPlayed = Date.now();

			// Emit import event
			this.events.emit('game_saved', {
				timestamp: Date.now(),
				saveSize: saveString.length,
				isAutoSave: false
			});

			console.log('[SaveManager] Save imported successfully');
			return true;
		} catch (error) {
			console.error('[SaveManager] Import failed:', error);
			return false;
		}
	}

	// ============================================================================
	// Hard Reset & Emergency Recovery
	// ============================================================================

	/**
	 * Perform a hard reset, deleting all save data (run state + eternal state).
	 * Creates a 24-hour emergency backup for accidental resets.
	 *
	 * WARNING: This deletes ALL progress, including eternal state!
	 *
	 * @example
	 * ```typescript
	 * // Usually called after user confirmation
	 * if (confirm('Delete ALL data? This cannot be undone (except within 24h)!')) {
	 *   saveManager.hardReset();
	 * }
	 * ```
	 */
	hardReset(): void {
		try {
			// Clean up any expired emergency backup first
			this.cleanExpiredEmergencyBackup();

			// Create emergency backup (24-hour recovery window)
			const currentSave = localStorage.getItem(this.saveKey);
			if (currentSave) {
				localStorage.setItem(this.emergencyBackupKey, currentSave);
				localStorage.setItem(this.emergencyBackupTimestampKey, Date.now().toString());
				console.log('[SaveManager] Emergency backup created (24-hour recovery window)');
			}

			// Delete all save data
			localStorage.removeItem(this.saveKey);
			localStorage.removeItem(this.backupKey);

			// Reset to fresh state
			this.state = this.createFreshState();
			this.isDirty = false;

			console.log('[SaveManager] Hard reset completed');
		} catch (error) {
			console.error('[SaveManager] Hard reset failed:', error);
		}
	}

	/**
	 * Recover from emergency backup (created during hard reset).
	 * Only works within 24 hours of the hard reset.
	 *
	 * @returns Whether recovery was successful
	 *
	 * @example
	 * ```typescript
	 * if (saveManager.hasEmergencyBackup()) {
	 *   const success = saveManager.recoverFromEmergencyBackup();
	 *   if (success) {
	 *     console.log('Save recovered!');
	 *   }
	 * }
	 * ```
	 */
	recoverFromEmergencyBackup(): boolean {
		try {
			// Check if emergency backup exists
			const backupString = localStorage.getItem(this.emergencyBackupKey);
			const timestampString = localStorage.getItem(this.emergencyBackupTimestampKey);

			if (!backupString || !timestampString) {
				console.warn('[SaveManager] No emergency backup found');
				return false;
			}

			// Check if backup is still valid (within 24 hours)
			const backupTime = parseInt(timestampString, 10);
			const now = Date.now();
			const hoursSinceBackup = (now - backupTime) / (1000 * 60 * 60);

			if (hoursSinceBackup > 24) {
				console.warn('[SaveManager] Emergency backup expired (older than 24 hours)');
				// Clean up expired backup
				localStorage.removeItem(this.emergencyBackupKey);
				localStorage.removeItem(this.emergencyBackupTimestampKey);
				return false;
			}

			// Restore the backup
			localStorage.setItem(this.saveKey, backupString);

			// Load the recovered save
			const recoveredState = this.load();

			if (recoveredState) {
				// Clean up emergency backup after successful recovery
				localStorage.removeItem(this.emergencyBackupKey);
				localStorage.removeItem(this.emergencyBackupTimestampKey);

				console.log('[SaveManager] Successfully recovered from emergency backup');
				return true;
			}

			return false;
		} catch (error) {
			console.error('[SaveManager] Emergency recovery failed:', error);
			return false;
		}
	}

	/**
	 * Check if an emergency backup exists and is still valid.
	 *
	 * @returns Whether a valid emergency backup exists
	 *
	 * @example
	 * ```typescript
	 * if (saveManager.hasEmergencyBackup()) {
	 *   // Show "Recover Last Reset" option in UI
	 * }
	 * ```
	 */
	hasEmergencyBackup(): boolean {
		const backupString = localStorage.getItem(this.emergencyBackupKey);
		const timestampString = localStorage.getItem(this.emergencyBackupTimestampKey);

		if (!backupString || !timestampString) {
			return false;
		}

		// Check if backup is still valid (within 24 hours)
		const backupTime = parseInt(timestampString, 10);
		const now = Date.now();
		const hoursSinceBackup = (now - backupTime) / (1000 * 60 * 60);

		return hoursSinceBackup <= 24;
	}

	/**
	 * Clean up expired emergency backups (older than 24 hours).
	 * Called automatically during initialization and hard reset.
	 */
	cleanExpiredEmergencyBackup(): void {
		const timestampString = localStorage.getItem(this.emergencyBackupTimestampKey);

		if (timestampString) {
			const backupTime = parseInt(timestampString, 10);
			const now = Date.now();
			const hoursSinceBackup = (now - backupTime) / (1000 * 60 * 60);

			if (hoursSinceBackup > 24) {
				localStorage.removeItem(this.emergencyBackupKey);
				localStorage.removeItem(this.emergencyBackupTimestampKey);
				console.log('[SaveManager] Cleaned up expired emergency backup');
			}
		}
	}

	// ============================================================================
	// State Management
	// ============================================================================

	/**
	 * Get the current game state.
	 *
	 * @returns Current game state or null if not initialized
	 */
	getState(): GameState | null {
		return this.state;
	}

	/**
	 * Update the game state.
	 * Should be called by other managers when state changes.
	 *
	 * @param state - New game state
	 */
	setState(state: GameState): void {
		this.state = state;
		this.markDirty();
	}

	/**
	 * Mark the state as modified.
	 * This ensures the next auto-save will write to disk.
	 */
	markDirty(): void {
		this.isDirty = true;
	}

	/**
	 * Check if the state has been modified since last save.
	 *
	 * @returns Whether state is dirty
	 */
	isDirtyState(): boolean {
		return this.isDirty;
	}

	// ============================================================================
	// Auto-Save
	// ============================================================================

	/**
	 * Start the auto-save timer.
	 */
	startAutoSave(): void {
		if (this.autoSaveTimerId) {
			clearInterval(this.autoSaveTimerId);
		}

		if (this.autoSaveEnabled && this.autoSaveInterval > 0) {
			this.autoSaveTimerId = setInterval(() => {
				this.save({ isAutoSave: true });
			}, this.autoSaveInterval);
		}
	}

	/**
	 * Stop the auto-save timer.
	 */
	stopAutoSave(): void {
		if (this.autoSaveTimerId) {
			clearInterval(this.autoSaveTimerId);
			this.autoSaveTimerId = null;
		}
	}

	/**
	 * Enable or disable auto-save.
	 *
	 * @param enabled - Whether to enable auto-save
	 */
	setAutoSaveEnabled(enabled: boolean): void {
		this.autoSaveEnabled = enabled;

		if (enabled) {
			this.startAutoSave();
		} else {
			this.stopAutoSave();
		}
	}

	/**
	 * Set the auto-save interval.
	 *
	 * @param intervalMs - Interval in milliseconds (0 to disable)
	 */
	setAutoSaveInterval(intervalMs: number): void {
		this.autoSaveInterval = Math.max(0, intervalMs);

		// Restart auto-save with new interval
		if (this.autoSaveEnabled) {
			this.startAutoSave();
		}
	}

	// ============================================================================
	// Private Helpers
	// ============================================================================

	/**
	 * Determine if a save should be performed.
	 *
	 * @param force - Force save even if not dirty
	 * @param skipThrottle - Skip throttle check
	 * @returns Whether save should proceed
	 */
	private shouldSave(force: boolean, skipThrottle: boolean): boolean {
		// If forced, always save
		if (force) return true;

		// If not dirty, skip save
		if (!this.isDirty) return false;

		// Check throttle
		if (!skipThrottle) {
			const timeSinceLastSave = Date.now() - this.lastSaveTime;
			if (timeSinceLastSave < this.saveThrottleMs) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Create a fresh game state for a new game.
	 *
	 * @returns Fresh game state
	 */
	private createFreshState(): GameState {
		const now = Date.now();
		const saveId = this.generateSaveId();

		return {
			run: this.createDefaultRunState(),
			eternal: this.createDefaultEternalState(),
			meta: {
				version: 1,
				lastSaved: now,
				lastPlayed: now,
				gameVersion: this.gameVersion,
				saveId
			}
		};
	}

	/**
	 * Create default run state.
	 *
	 * @returns Default run state
	 */
	private createDefaultRunState(): RunState {
		return {
			resources: {},
			productionRates: {},
			purchasedUpgrades: new Set(),
			upgradeLevels: {},
			currentPhase: 1,
			highestPhase: 1,
			runTime: 0,
			triggeredStoryEvents: new Set(),
			storyChoices: {},
			unlockedResources: new Set(),
			unlockedUpgrades: new Set()
		};
	}

	/**
	 * Create default eternal state.
	 *
	 * @returns Default eternal state
	 */
	private createDefaultEternalState(): EternalState {
		return {
			totalRebirths: 0,
			totalPlayTime: 0,
			eternalResources: {},
			eternalUpgrades: new Set(),
			achievements: new Set(),
			permanentStoryFlags: new Set(),
			permanentChoices: {},
			statistics: { ...DEFAULT_STATISTICS },
			highestPhaseEver: 1,
			discoveredSecrets: new Set(),
			preferences: { ...DEFAULT_PREFERENCES }
		};
	}

	/**
	 * Generate a unique save ID.
	 *
	 * @returns Unique save identifier
	 */
	private generateSaveId(): string {
		return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
	}

	/**
	 * Serialize a game state to storage format.
	 *
	 * @param state - Game state to serialize
	 * @returns Serialized game state
	 */
	private serializeGameState(state: GameState): SerializedGameState {
		return {
			run: this.serializeRunState(state.run),
			eternal: this.serializeEternalState(state.eternal),
			meta: state.meta
		};
	}

	/**
	 * Serialize run state.
	 *
	 * @param run - Run state to serialize
	 * @returns Serialized run state
	 */
	private serializeRunState(run: RunState): SerializedRunState {
		// Convert Decimal values to strings
		const resources: Record<string, string> = {};
		for (const [key, value] of Object.entries(run.resources)) {
			resources[key] = value.toString();
		}

		const productionRates: Record<string, string> = {};
		for (const [key, value] of Object.entries(run.productionRates)) {
			productionRates[key] = value.toString();
		}

		return {
			resources,
			productionRates,
			purchasedUpgrades: Array.from(run.purchasedUpgrades),
			upgradeLevels: run.upgradeLevels,
			currentPhase: run.currentPhase,
			highestPhase: run.highestPhase,
			runTime: run.runTime,
			triggeredStoryEvents: Array.from(run.triggeredStoryEvents),
			storyChoices: run.storyChoices,
			unlockedResources: Array.from(run.unlockedResources),
			unlockedUpgrades: Array.from(run.unlockedUpgrades)
		};
	}

	/**
	 * Serialize eternal state.
	 *
	 * @param eternal - Eternal state to serialize
	 * @returns Serialized eternal state
	 */
	private serializeEternalState(eternal: EternalState): SerializedEternalState {
		// Convert Decimal values to strings
		const eternalResources: Record<string, string> = {};
		for (const [key, value] of Object.entries(eternal.eternalResources)) {
			eternalResources[key] = value.toString();
		}

		return {
			totalRebirths: eternal.totalRebirths,
			totalPlayTime: eternal.totalPlayTime,
			eternalResources,
			eternalUpgrades: Array.from(eternal.eternalUpgrades),
			achievements: Array.from(eternal.achievements),
			permanentStoryFlags: Array.from(eternal.permanentStoryFlags),
			permanentChoices: eternal.permanentChoices,
			statistics: this.serializeStatistics(eternal.statistics),
			highestPhaseEver: eternal.highestPhaseEver,
			discoveredSecrets: Array.from(eternal.discoveredSecrets),
			preferences: eternal.preferences
		};
	}

	/**
	 * Serialize statistics.
	 *
	 * @param stats - Statistics to serialize
	 * @returns Serialized statistics
	 */
	private serializeStatistics(stats: GameStatistics): SerializedStatistics {
		return {
			totalPixelsGenerated: stats.totalPixelsGenerated.toString(),
			totalClicks: stats.totalClicks,
			fastestPhaseTimes: stats.fastestPhaseTimes,
			fastestRunTime: stats.fastestRunTime,
			totalUpgradesPurchased: stats.totalUpgradesPurchased,
			totalStoryEventsTriggered: stats.totalStoryEventsTriggered,
			firstPlayDate: stats.firstPlayDate,
			lastPlayDate: stats.lastPlayDate
		};
	}

	/**
	 * Deserialize a game state from storage format.
	 *
	 * @param serialized - Serialized game state
	 * @returns Game state
	 */
	private deserializeGameState(serialized: SerializedGameState): GameState {
		return {
			run: this.deserializeRunState(serialized.run),
			eternal: this.deserializeEternalState(serialized.eternal),
			meta: serialized.meta
		};
	}

	/**
	 * Deserialize run state.
	 *
	 * @param serialized - Serialized run state
	 * @returns Run state
	 */
	private deserializeRunState(serialized: SerializedRunState): RunState {
		// Convert strings back to Decimal
		const resources: Record<string, Decimal> = {};
		for (const [key, value] of Object.entries(serialized.resources)) {
			resources[key] = D(value);
		}

		const productionRates: Record<string, Decimal> = {};
		for (const [key, value] of Object.entries(serialized.productionRates)) {
			productionRates[key] = D(value);
		}

		return {
			resources,
			productionRates,
			purchasedUpgrades: new Set(serialized.purchasedUpgrades),
			upgradeLevels: serialized.upgradeLevels,
			currentPhase: serialized.currentPhase,
			highestPhase: serialized.highestPhase,
			runTime: serialized.runTime,
			triggeredStoryEvents: new Set(serialized.triggeredStoryEvents),
			storyChoices: serialized.storyChoices,
			unlockedResources: new Set(serialized.unlockedResources),
			unlockedUpgrades: new Set(serialized.unlockedUpgrades)
		};
	}

	/**
	 * Deserialize eternal state.
	 *
	 * @param serialized - Serialized eternal state
	 * @returns Eternal state
	 */
	private deserializeEternalState(serialized: SerializedEternalState): EternalState {
		// Convert strings back to Decimal
		const eternalResources: Record<string, Decimal> = {};
		for (const [key, value] of Object.entries(serialized.eternalResources)) {
			eternalResources[key] = D(value);
		}

		return {
			totalRebirths: serialized.totalRebirths,
			totalPlayTime: serialized.totalPlayTime,
			eternalResources,
			eternalUpgrades: new Set(serialized.eternalUpgrades),
			achievements: new Set(serialized.achievements),
			permanentStoryFlags: new Set(serialized.permanentStoryFlags),
			permanentChoices: serialized.permanentChoices,
			statistics: this.deserializeStatistics(serialized.statistics),
			highestPhaseEver: serialized.highestPhaseEver,
			discoveredSecrets: new Set(serialized.discoveredSecrets),
			preferences: serialized.preferences
		};
	}

	/**
	 * Deserialize statistics.
	 *
	 * @param serialized - Serialized statistics
	 * @returns Statistics
	 */
	private deserializeStatistics(serialized: SerializedStatistics): GameStatistics {
		return {
			totalPixelsGenerated: D(serialized.totalPixelsGenerated),
			totalClicks: serialized.totalClicks,
			fastestPhaseTimes: serialized.fastestPhaseTimes,
			fastestRunTime: serialized.fastestRunTime,
			totalUpgradesPurchased: serialized.totalUpgradesPurchased,
			totalStoryEventsTriggered: serialized.totalStoryEventsTriggered,
			firstPlayDate: serialized.firstPlayDate,
			lastPlayDate: serialized.lastPlayDate
		};
	}
}
