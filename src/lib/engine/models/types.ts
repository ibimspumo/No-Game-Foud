/**
 * @fileoverview Core type definitions for the game engine.
 * Contains interfaces and types used across all engine systems.
 *
 * @module engine/models/types
 */

import type { Decimal } from '../utils/decimal';

// ============================================================================
// Game State Types
// ============================================================================

/**
 * Transient state that resets on rebirth.
 * Contains all progress within a single "run" of the game.
 */
export interface RunState {
	/** Current amounts of all resources */
	resources: Record<string, Decimal>;

	/** Production rates per second for each resource */
	productionRates: Record<string, Decimal>;

	/** Set of purchased upgrade IDs */
	purchasedUpgrades: Set<string>;

	/** Levels for repeatable upgrades */
	upgradeLevels: Record<string, number>;

	/** Current phase number (1-20) */
	currentPhase: number;

	/** Highest phase reached in this run */
	highestPhase: number;

	/** Total time in this run (seconds) */
	runTime: number;

	/** Set of triggered story event IDs in this run */
	triggeredStoryEvents: Set<string>;

	/** Choices made in this run (storyId -> choiceId) */
	storyChoices: Record<string, string>;

	/** Set of unlocked resource IDs */
	unlockedResources: Set<string>;

	/** Set of unlocked upgrade IDs */
	unlockedUpgrades: Set<string>;
}

/**
 * Persistent state that survives rebirth.
 * Contains meta-progression and permanent unlocks.
 */
export interface EternalState {
	/** Total number of rebirths completed */
	totalRebirths: number;

	/** Total time played across all runs (seconds) */
	totalPlayTime: number;

	/** Eternal/meta resources (primordial pixels, etc.) */
	eternalResources: Record<string, Decimal>;

	/** Set of purchased eternal upgrade IDs */
	eternalUpgrades: Set<string>;

	/** Set of unlocked achievement IDs */
	achievements: Set<string>;

	/** Set of permanently triggered story events */
	permanentStoryFlags: Set<string>;

	/** Global story choices that persist */
	permanentChoices: Record<string, string>;

	/** Statistics for achievements and display */
	statistics: GameStatistics;

	/** Highest phase ever reached */
	highestPhaseEver: number;

	/** Set of discovered secrets */
	discoveredSecrets: Set<string>;

	/** Player preferences that persist */
	preferences: PlayerPreferences;
}

/**
 * Complete game state combining run and eternal state.
 */
export interface GameState {
	/** Current run state (resets on rebirth) */
	run: RunState;

	/** Eternal state (persists across rebirths) */
	eternal: EternalState;

	/** Save metadata */
	meta: SaveMeta;
}

// ============================================================================
// Statistics & Preferences
// ============================================================================

/**
 * Game statistics tracked across all runs.
 */
export interface GameStatistics {
	/** Total pixels ever generated */
	totalPixelsGenerated: Decimal;

	/** Total clicks ever made */
	totalClicks: number;

	/** Fastest time to complete each phase (seconds) */
	fastestPhaseTimes: Record<number, number>;

	/** Fastest complete run time (seconds) */
	fastestRunTime: number | null;

	/** Total upgrades ever purchased */
	totalUpgradesPurchased: number;

	/** Total story events triggered */
	totalStoryEventsTriggered: number;

	/** Date of first game start */
	firstPlayDate: number;

	/** Date of last session */
	lastPlayDate: number;
}

/**
 * Player preferences that persist.
 */
export interface PlayerPreferences {
	/** Number notation style */
	notation: 'scientific' | 'engineering' | 'mixed' | 'letters';

	/** Animation speed multiplier (0.5 - 2.0) */
	animationSpeed: number;

	/** Whether to show offline progress popup */
	showOfflineProgress: boolean;

	/** Auto-save interval in seconds (0 = disabled) */
	autoSaveInterval: number;

	/** Whether to pause on story events */
	pauseOnStory: boolean;

	/** Whether to confirm before rebirth */
	confirmRebirth: boolean;

	/** Volume levels (0-1) */
	volume: {
		master: number;
		music: number;
		sfx: number;
	};
}

// ============================================================================
// Save System Types
// ============================================================================

/**
 * Metadata about the save file.
 */
export interface SaveMeta {
	/** Save file version for migrations */
	version: number;

	/** Timestamp of last save */
	lastSaved: number;

	/** Timestamp of last load/play */
	lastPlayed: number;

	/** Game version that created this save */
	gameVersion: string;

	/** Unique save identifier */
	saveId: string;
}

/**
 * Serialized format of the complete game state.
 * All Decimals are converted to strings for storage.
 */
export interface SerializedGameState {
	run: SerializedRunState;
	eternal: SerializedEternalState;
	meta: SaveMeta;
}

/**
 * Serialized run state (Decimals as strings).
 */
export interface SerializedRunState {
	resources: Record<string, string>;
	productionRates: Record<string, string>;
	purchasedUpgrades: string[];
	upgradeLevels: Record<string, number>;
	currentPhase: number;
	highestPhase: number;
	runTime: number;
	triggeredStoryEvents: string[];
	storyChoices: Record<string, string>;
	unlockedResources: string[];
	unlockedUpgrades: string[];
}

/**
 * Serialized eternal state (Decimals as strings).
 */
export interface SerializedEternalState {
	totalRebirths: number;
	totalPlayTime: number;
	eternalResources: Record<string, string>;
	eternalUpgrades: string[];
	achievements: string[];
	permanentStoryFlags: string[];
	permanentChoices: Record<string, string>;
	statistics: SerializedStatistics;
	highestPhaseEver: number;
	discoveredSecrets: string[];
	preferences: PlayerPreferences;
}

/**
 * Serialized statistics (Decimals as strings).
 */
export interface SerializedStatistics {
	totalPixelsGenerated: string;
	totalClicks: number;
	fastestPhaseTimes: Record<number, number>;
	fastestRunTime: number | null;
	totalUpgradesPurchased: number;
	totalStoryEventsTriggered: number;
	firstPlayDate: number;
	lastPlayDate: number;
}

// ============================================================================
// Manager Interface
// ============================================================================

/**
 * Base interface that all managers must implement.
 * Ensures consistent lifecycle management across the engine.
 */
export interface Manager {
	/**
	 * Initialize the manager. Called once during game startup.
	 * Should set up initial state and subscriptions.
	 */
	init(): void;

	/**
	 * Update the manager state. Called every game tick.
	 * @param deltaTime - Time since last tick in seconds
	 */
	tick(deltaTime: number): void;

	/**
	 * Reset the manager for a new run (rebirth).
	 * Should clear transient state but preserve eternal state.
	 */
	reset(): void;

	/**
	 * Serialize the manager's state for saving.
	 * @returns Serializable state object
	 */
	serialize(): unknown;

	/**
	 * Deserialize and restore the manager's state.
	 * @param data - Previously serialized state
	 */
	deserialize(data: unknown): void;
}

// ============================================================================
// Callback Types
// ============================================================================

/**
 * Generic callback function type.
 */
export type Callback<T = void> = (data: T) => void;

/**
 * Unsubscribe function returned by event subscriptions.
 */
export type Unsubscribe = () => void;

/**
 * Condition function that returns true when a condition is met.
 */
export type Condition = () => boolean;

/**
 * Effect function that performs some action.
 */
export type Effect = () => void;

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Game configuration constants.
 */
export interface GameConfig {
	/** Target ticks per second */
	tickRate: number;

	/** Maximum delta time cap (seconds) */
	maxDeltaTime: number;

	/** Auto-save interval (milliseconds) */
	autoSaveInterval: number;

	/** Maximum offline time for calculations (seconds) */
	maxOfflineTime: number;

	/** Offline efficiency multiplier (0-1) */
	offlineEfficiency: number;

	/** Whether debug mode is enabled */
	debug: boolean;

	/** Current game version */
	version: string;

	/** Save key for localStorage */
	saveKey: string;
}

/**
 * Default game configuration.
 */
export const DEFAULT_CONFIG: GameConfig = {
	tickRate: 20, // 20 ticks per second (50ms per tick)
	maxDeltaTime: 0.1, // 100ms max delta
	autoSaveInterval: 30000, // 30 seconds
	maxOfflineTime: 86400, // 24 hours
	offlineEfficiency: 0.5, // 50% efficiency
	debug: false,
	version: '0.1.0',
	saveKey: 'pixel_singularity_save'
};
