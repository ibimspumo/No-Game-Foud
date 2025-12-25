/**
 * @fileoverview Centralized balancing constants for the game engine.
 * Contains all numerical values used for game balance and tuning.
 *
 * All constants are organized by system and exported as a frozen object
 * to prevent accidental modification. Individual constants are also
 * exported for convenience.
 *
 * @module engine/data/constants
 */

// ============================================================================
// Resource Generation Constants
// ============================================================================

/**
 * Resource generation configuration.
 * Controls base rates, scaling, and drop chances.
 */
const RESOURCES = {
	/**
	 * Base pixel generation rate per click/producer.
	 * @default 1
	 */
	BASE_PIXEL_RATE: 1,

	/**
	 * Exponent for pixel generation scaling.
	 * Higher values mean faster exponential growth.
	 * @default 1.15
	 */
	PIXEL_SCALE_EXPONENT: 1.15,

	/**
	 * Chance for color resource drops per pixel generated.
	 * Value between 0-1, where 0.01 = 1% chance.
	 * @default 0.01
	 */
	COLOR_DROP_CHANCE: 0.01
} as const;

// ============================================================================
// Upgrade Cost Constants
// ============================================================================

/**
 * Upgrade cost configuration.
 * Controls base costs and scaling for different upgrade types.
 */
const UPGRADES = {
	/**
	 * Base cost for the first level of an upgrade.
	 * Actual costs scale exponentially from this base.
	 * @default 10
	 */
	UPGRADE_COST_BASE: 10,

	/**
	 * Exponent for upgrade cost scaling.
	 * Higher values mean costs grow faster.
	 * Formula: cost = base * (level ^ exponent)
	 * @default 1.5
	 */
	UPGRADE_COST_EXPONENT: 1.5,

	/**
	 * Multiplier applied to eternal upgrade costs.
	 * Eternal upgrades are permanent and thus more expensive.
	 * @default 100
	 */
	ETERNAL_UPGRADE_COST_MULTIPLIER: 100
} as const;

// ============================================================================
// Prestige/Rebirth Constants
// ============================================================================

/**
 * Prestige and rebirth configuration.
 * Controls when rebirths are available and their rewards.
 */
const PRESTIGE = {
	/**
	 * Base requirement for triggering a prestige/rebirth.
	 * Usually a pixel count threshold.
	 * @default 1000000
	 */
	PRESTIGE_REQUIREMENT_BASE: 1000000,

	/**
	 * Ratio of progress converted to prestige rewards.
	 * Value between 0-1, where 0.1 = 10% conversion.
	 * @default 0.1
	 */
	PRESTIGE_REWARD_RATIO: 0.1,

	/**
	 * Minimum phase that must be reached before rebirth is allowed.
	 * Prevents premature rebirths.
	 * @default 5
	 */
	MIN_REBIRTH_PHASE: 5
} as const;

// ============================================================================
// Phase Timing Constants
// ============================================================================

/**
 * Phase timing configuration.
 * Controls phase durations and transitions.
 */
const PHASES = {
	/**
	 * Global multiplier for all phase durations.
	 * Allows easy adjustment of game pacing.
	 * @default 1.0
	 */
	PHASE_DURATION_MULTIPLIER: 1.0,

	/**
	 * Duration of phase transition animations in milliseconds.
	 * @default 2000
	 */
	TRANSITION_ANIMATION_DURATION: 2000
} as const;

// ============================================================================
// Achievement Constants
// ============================================================================

/**
 * Achievement reward configuration.
 * Controls primordial pixel (PP) rewards for different achievement types.
 */
const ACHIEVEMENTS = {
	/**
	 * Primordial pixels awarded for standard achievements.
	 * @default 10
	 */
	STANDARD_ACHIEVEMENT_PP: 10,

	/**
	 * Primordial pixels awarded for secret achievements.
	 * Secrets are harder to find and thus more valuable.
	 * @default 50
	 */
	SECRET_ACHIEVEMENT_PP: 50,

	/**
	 * Primordial pixels awarded for ending achievements.
	 * Major rewards for completing game endings.
	 * @default 10000
	 */
	ENDING_ACHIEVEMENT_PP: 10000
} as const;

// ============================================================================
// Game Loop Constants
// ============================================================================

/**
 * Game loop and timing configuration.
 * Controls update rates and intervals.
 */
const GAME_LOOP = {
	/**
	 * Target frames per second for the render loop.
	 * @default 60
	 */
	TARGET_FPS: 60,

	/**
	 * Number of game logic ticks per second.
	 * Lower than FPS for performance.
	 * @default 20
	 */
	TICKS_PER_SECOND: 20,

	/**
	 * Interval between automatic saves in milliseconds.
	 * @default 10000
	 */
	AUTO_SAVE_INTERVAL: 10000
} as const;

// ============================================================================
// Offline Progress Constants
// ============================================================================

/**
 * Offline progress calculation configuration.
 * Controls how progress accumulates while away.
 */
const OFFLINE = {
	/**
	 * Maximum offline time to calculate in milliseconds.
	 * Prevents excessive computation for very long absences.
	 * 24 hours = 86400000 ms
	 * @default 86400000
	 */
	MAX_OFFLINE_TIME: 86400000,

	/**
	 * Efficiency multiplier for offline progress.
	 * Value between 0-1, where 0.5 = 50% of online rate.
	 * Prevents exploiting offline time.
	 * @default 0.5
	 */
	OFFLINE_EFFICIENCY: 0.5
} as const;

// ============================================================================
// UI Constants
// ============================================================================

/**
 * UI and presentation configuration.
 * Controls display timing and animations.
 */
const UI = {
	/**
	 * Default typing speed for dialogue text in milliseconds per character.
	 * Lower values = faster typing.
	 * @default 30
	 */
	TYPING_SPEED_DEFAULT: 30,

	/**
	 * Delay between dialogue lines in milliseconds.
	 * @default 1000
	 */
	DIALOGUE_LINE_DELAY: 1000
} as const;

// ============================================================================
// Main Export
// ============================================================================

/**
 * Centralized balancing constants for the entire game.
 * All values are frozen to prevent accidental modification.
 *
 * @example
 * ```typescript
 * import { BALANCING } from './constants';
 *
 * const cost = BALANCING.upgrades.UPGRADE_COST_BASE;
 * const efficiency = BALANCING.offline.OFFLINE_EFFICIENCY;
 * ```
 */
export const BALANCING = {
	/** Resource generation configuration */
	resources: RESOURCES,

	/** Upgrade cost configuration */
	upgrades: UPGRADES,

	/** Prestige/rebirth configuration */
	prestige: PRESTIGE,

	/** Phase timing configuration */
	phases: PHASES,

	/** Achievement reward configuration */
	achievements: ACHIEVEMENTS,

	/** Game loop timing configuration */
	gameLoop: GAME_LOOP,

	/** Offline progress configuration */
	offline: OFFLINE,

	/** UI and presentation configuration */
	ui: UI
} as const;

// Freeze the entire object hierarchy for immutability
Object.freeze(BALANCING);
Object.freeze(BALANCING.resources);
Object.freeze(BALANCING.upgrades);
Object.freeze(BALANCING.prestige);
Object.freeze(BALANCING.phases);
Object.freeze(BALANCING.achievements);
Object.freeze(BALANCING.gameLoop);
Object.freeze(BALANCING.offline);
Object.freeze(BALANCING.ui);

// ============================================================================
// Individual Exports for Convenience
// ============================================================================

/**
 * Resource generation constants (individual exports).
 */
export const {
	BASE_PIXEL_RATE,
	PIXEL_SCALE_EXPONENT,
	COLOR_DROP_CHANCE
} = BALANCING.resources;

/**
 * Upgrade cost constants (individual exports).
 */
export const {
	UPGRADE_COST_BASE,
	UPGRADE_COST_EXPONENT,
	ETERNAL_UPGRADE_COST_MULTIPLIER
} = BALANCING.upgrades;

/**
 * Prestige constants (individual exports).
 */
export const {
	PRESTIGE_REQUIREMENT_BASE,
	PRESTIGE_REWARD_RATIO,
	MIN_REBIRTH_PHASE
} = BALANCING.prestige;

/**
 * Phase timing constants (individual exports).
 */
export const {
	PHASE_DURATION_MULTIPLIER,
	TRANSITION_ANIMATION_DURATION
} = BALANCING.phases;

/**
 * Achievement constants (individual exports).
 */
export const {
	STANDARD_ACHIEVEMENT_PP,
	SECRET_ACHIEVEMENT_PP,
	ENDING_ACHIEVEMENT_PP
} = BALANCING.achievements;

/**
 * Game loop constants (individual exports).
 */
export const {
	TARGET_FPS,
	TICKS_PER_SECOND,
	AUTO_SAVE_INTERVAL
} = BALANCING.gameLoop;

/**
 * Offline progress constants (individual exports).
 */
export const {
	MAX_OFFLINE_TIME,
	OFFLINE_EFFICIENCY
} = BALANCING.offline;

/**
 * UI constants (individual exports).
 */
export const {
	TYPING_SPEED_DEFAULT,
	DIALOGUE_LINE_DELAY
} = BALANCING.ui;
