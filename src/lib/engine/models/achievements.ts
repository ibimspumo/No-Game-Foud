/**
 * @fileoverview Achievement type definitions for the game engine.
 * Defines achievement types, conditions, rewards, and state management.
 *
 * Achievements provide meta-progression goals and rewards across runs.
 * They are organized into three types:
 * - Standard: Visible achievements with clear goals
 * - Secret: Hidden achievements that reward exploration
 * - Ending: Special achievements for completing story paths
 *
 * @module engine/models/achievements
 */

import type { Condition } from './phase';

// ============================================================================
// Achievement Categories & Tiers
// ============================================================================

/**
 * Type of achievement determines its visibility and presentation.
 */
export type AchievementType = 'standard' | 'secret' | 'ending';

/**
 * Tier represents the rarity and value of an achievement.
 * Matches the event tier system for consistency.
 */
export type AchievementTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'secret';

// ============================================================================
// Achievement Rewards
// ============================================================================

/**
 * Rewards granted when an achievement is unlocked.
 * Achievements can grant multiple types of rewards simultaneously.
 */
export interface AchievementReward {
	/** Primordial Pixels (premium/prestige currency) */
	pp?: number;

	/** Feature unlock identifier (e.g., 'autobuyer', 'skilltree_node_5') */
	unlock?: string;

	/** Cosmetic unlock identifier (e.g., 'theme_dark', 'border_gold') */
	cosmetic?: string;

	/** Title unlock identifier (e.g., 'pixel_master', 'void_walker') */
	title?: string;

	/** Badge unlock identifier (e.g., 'badge_speedrun', 'badge_collector') */
	badge?: string;
}

// ============================================================================
// Achievement Definition
// ============================================================================

/**
 * Complete definition of an achievement.
 * This is the blueprint for each achievement in the game.
 */
export interface AchievementDefinition {
	/** Unique achievement identifier */
	id: string;

	/** Achievement type (standard, secret, or ending) */
	type: AchievementType;

	/** Achievement tier/rarity */
	tier: AchievementTier;

	/** Display name shown to player */
	name: string;

	/** Description of the achievement */
	description: string;

	/** Flavor text (optional lore or humorous comment) */
	flavorText?: string;

	/** Icon identifier for display */
	icon?: string;

	// ========== Unlock Condition ==========

	/** Condition that must be met to unlock this achievement */
	condition: Condition;

	/** Rewards granted upon unlock */
	reward: AchievementReward;

	// ========== Visibility ==========

	/** Whether the achievement is hidden until unlocked (for secrets) */
	hidden: boolean;

	/** Optional hint shown for secret achievements */
	hint?: string;

	// ========== Progress Tracking ==========

	/**
	 * Whether to show a progress bar for this achievement.
	 * Only applies to achievements with trackable conditions (resource, producer, etc.)
	 */
	trackProgress?: boolean;

	/**
	 * Function to generate progress text.
	 * @param current - Current progress value
	 * @param target - Target/goal value
	 * @returns Formatted progress string (e.g., "1,000 / 1,000,000 pixels")
	 */
	progressText?: (current: number, target: number) => string;

	// ========== Achievement Chains ==========

	/** Achievement ID that must be unlocked before this one becomes available */
	prerequisite?: string;

	/** Achievement IDs that are unlocked when this achievement is completed */
	unlocks?: string[];
}

// ============================================================================
// Achievement State
// ============================================================================

/**
 * Runtime state of an achievement.
 * Tracks unlock status, progress, and notifications.
 */
export interface AchievementState {
	/** Whether the achievement has been unlocked */
	unlocked: boolean;

	/** Timestamp when unlocked (null if not yet unlocked) */
	unlockedAt: number | null;

	/** Progress towards unlock (0-1 for progress bar display) */
	progress: number;

	/** Whether the unlock notification has been shown to the player */
	notified: boolean;
}

// ============================================================================
// Serialization
// ============================================================================

/**
 * Serializable format for saving achievement state.
 * Optimized for save file size by storing only essential data.
 */
export interface SerializedAchievements {
	/** Array of unlocked achievement IDs */
	unlocked: string[];

	/** Map of achievement ID to unlock timestamp */
	unlockedAt: Record<string, number>;

	/** Map of achievement ID to progress value (0-1) */
	progress: Record<string, number>;
}

// ============================================================================
// Achievement ID Constants
// ============================================================================

/**
 * Enum of all achievement IDs for type-safe references.
 * Organized by category for easier navigation.
 */
export const AchievementId = {
	// ========== Phase Achievements ==========
	/** First click on the pixel */
	FIRST_CLICK: 'first_click',

	/** Discover the canvas in Phase 2 */
	CANVAS_FOUND: 'canvas_found',

	/** Enter the gallery in Phase 3 */
	GALLERY_ENTERED: 'gallery_entered',

	/** Reach Phase 5 */
	ROOM_ENTERED: 'room_entered',

	/** Reach Phase 10 */
	MOON_REACHED: 'moon_reached',

	/** Transition to Abstract Mode (Phase 11) */
	ABSTRACT_MODE: 'abstract_mode',

	/** Reach Phase 15 */
	UNIVERSE_OBSERVED: 'universe_observed',

	/** Reach Phase 18 */
	VOID_GAZED: 'void_gazed',

	/** Complete Phase 19 */
	CODE_REVEALED: 'code_revealed',

	/** Reach the final phase */
	PLAYER_BECOMES: 'player_becomes',

	// ========== Resource Achievements ==========
	/** Accumulate 1,000 pixels */
	THOUSAND_PIXELS: 'thousand_pixels',

	/** Accumulate 1 million pixels */
	MILLION_PIXELS: 'million_pixels',

	/** Accumulate 1 billion pixels */
	BILLION_PIXELS: 'billion_pixels',

	/** Accumulate 1 trillion pixels */
	TRILLION_PIXELS: 'trillion_pixels',

	/** Reach 1e15 pixels */
	QUADRILLION_PIXELS: 'quadrillion_pixels',

	/** Earn first Primordial Pixel */
	FIRST_PRIMORDIAL: 'first_primordial',

	/** Accumulate 100 Primordial Pixels */
	PRIMORDIAL_HOARDER: 'primordial_hoarder',

	// ========== Production Achievements ==========
	/** Reach 100 pixels/second */
	PRODUCER_NOVICE: 'producer_novice',

	/** Reach 10,000 pixels/second */
	PRODUCER_ADEPT: 'producer_adept',

	/** Reach 1 million pixels/second */
	PRODUCER_MASTER: 'producer_master',

	/** Own 100 producers total */
	COLLECTOR: 'collector',

	/** Own 1,000 producers total */
	HOARDER: 'hoarder',

	// ========== Speed Achievements ==========
	/** Complete Phase 1 in under 30 seconds */
	SPEED_DEMON_1: 'speed_demon_1',

	/** Complete first 5 phases in under 5 minutes */
	SPEED_DEMON_5: 'speed_demon_5',

	/** Complete first 10 phases in under 30 minutes */
	SPEED_DEMON_10: 'speed_demon_10',

	/** Reach Phase 20 in under 2 hours */
	SPEEDRUNNER: 'speedrunner',

	// ========== Challenge Achievements ==========
	/** Complete Phase 5 without purchasing any upgrades */
	PURIST: 'purist',

	/** Complete Phase 10 with less than 1,000 total clicks */
	EFFICIENT: 'efficient',

	/** Unlock all upgrades in a single run */
	COMPLETIONIST: 'completionist',

	/** Unlock all three skill tree paths */
	ENLIGHTENED: 'enlightened',

	// ========== Story Achievements ==========
	/** Make your first story choice */
	FIRST_CHOICE: 'first_choice',

	/** Complete a dialogue */
	CONVERSATIONALIST: 'conversationalist',

	/** Read all logs in a phase */
	ARCHIVIST: 'archivist',

	/** Unlock all logs */
	CHRONICLER: 'chronicler',

	// ========== Secret Achievements ==========
	/** Click the pixel exactly 42 times without producing */
	THE_ANSWER: 'the_answer',

	/** Wait in Phase 1 for 5 minutes without clicking */
	ZEN_MASTER: 'zen_master',

	/** Attempt to click during a meditation phase */
	RESTLESS: 'restless',

	/** Click 1,000 times in a single second */
	CLICKER_FRENZY: 'clicker_frenzy',

	/** Discover the hidden void message */
	VOID_LISTENER: 'void_listener',

	/** Name yourself "Developer" */
	META_AWARENESS: 'meta_awareness',

	/** Refresh the page during a transition */
	IMPATIENT: 'impatient',

	/** Reach negative pixels (somehow) */
	DEBT_COLLECTOR: 'debt_collector',

	/** Have exactly 0 pixels with 1M+ production */
	BALANCED: 'balanced',

	/** Complete a rebirth in under 1 minute */
	REBIRTH_SPEEDRUN: 'rebirth_speedrun',

	// ========== Ending Achievements ==========
	/** Achieve the Consumption ending */
	CONSUMPTION_ENDING: 'consumption_ending',

	/** Achieve the Creation ending */
	CREATION_ENDING: 'creation_ending',

	/** Achieve the Observation ending */
	OBSERVATION_ENDING: 'observation_ending',

	/** Achieve the Transcendence ending */
	TRANSCENDENCE_ENDING: 'transcendence_ending',

	/** Unlock all endings */
	ALL_ENDINGS: 'all_endings'
} as const;

/**
 * Type for achievement ID values.
 */
export type AchievementIdType = (typeof AchievementId)[keyof typeof AchievementId];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if an achievement is unlocked.
 *
 * @param state - Achievement state
 * @returns Whether the achievement is unlocked
 */
export function isAchievementUnlocked(state: AchievementState): boolean {
	return state.unlocked;
}

/**
 * Get the CSS color string for an achievement tier.
 * Used for styling achievement cards, borders, and notifications.
 *
 * @param tier - Achievement tier
 * @returns CSS color string
 */
export function getAchievementTierColor(tier: AchievementTier): string {
	switch (tier) {
		case 'common':
			return '#9CA3AF'; // Gray-400
		case 'uncommon':
			return '#34D399'; // Green-400
		case 'rare':
			return '#60A5FA'; // Blue-400
		case 'epic':
			return '#A78BFA'; // Purple-400
		case 'legendary':
			return '#F59E0B'; // Amber-500
		case 'secret':
			return '#EC4899'; // Pink-500
		default: {
			// Exhaustive check
			const _exhaustiveCheck: never = tier;
			return '#6B7280'; // Gray-500 fallback
		}
	}
}

/**
 * Format progress as a human-readable string.
 * Handles large numbers with K/M/B/T suffixes.
 *
 * @param current - Current progress value
 * @param target - Target/goal value
 * @returns Formatted progress string (e.g., "500K / 1M")
 */
export function formatProgress(current: number, target: number): string {
	const formatNumber = (num: number): string => {
		if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
		if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
		if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
		if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
		return num.toFixed(0);
	};

	return `${formatNumber(current)} / ${formatNumber(target)}`;
}

/**
 * Calculate progress percentage (0-1) from current and target values.
 *
 * @param current - Current progress value
 * @param target - Target/goal value
 * @returns Progress as a decimal (0-1), clamped to max 1
 */
export function calculateProgress(current: number, target: number): number {
	if (target <= 0) return 0;
	return Math.min(1, current / target);
}

/**
 * Get the display name for an achievement tier.
 * Used in UI tooltips and achievement details.
 *
 * @param tier - Achievement tier
 * @returns Human-readable tier name
 */
export function getTierDisplayName(tier: AchievementTier): string {
	switch (tier) {
		case 'common':
			return 'Common';
		case 'uncommon':
			return 'Uncommon';
		case 'rare':
			return 'Rare';
		case 'epic':
			return 'Epic';
		case 'legendary':
			return 'Legendary';
		case 'secret':
			return 'Secret';
		default: {
			// Exhaustive check
			const _exhaustiveCheck: never = tier;
			return 'Unknown';
		}
	}
}

/**
 * Check if an achievement should be visible to the player.
 * Hidden achievements are only visible after being unlocked or if a hint exists.
 *
 * @param definition - Achievement definition
 * @param state - Achievement state
 * @returns Whether the achievement should be shown in the UI
 */
export function isAchievementVisible(
	definition: AchievementDefinition,
	state: AchievementState
): boolean {
	// Always show if unlocked
	if (state.unlocked) return true;

	// Show if not hidden
	if (!definition.hidden) return true;

	// Show hidden achievements with hints if they have progress
	if (definition.hidden && definition.hint && state.progress > 0) return true;

	// Otherwise hide
	return false;
}

/**
 * Get the description to display for an achievement.
 * For hidden achievements, shows hint if available, otherwise shows "???"
 *
 * @param definition - Achievement definition
 * @param state - Achievement state
 * @returns Description text to display
 */
export function getAchievementDescription(
	definition: AchievementDefinition,
	state: AchievementState
): string {
	// Show full description if unlocked
	if (state.unlocked) return definition.description;

	// Show full description if not hidden
	if (!definition.hidden) return definition.description;

	// Show hint for hidden achievements if available
	if (definition.hint) return definition.hint;

	// Default mystery text for hidden achievements
	return '???';
}

/**
 * Create a default achievement state.
 * Used when initializing new achievements.
 *
 * @returns Default achievement state
 */
export function createDefaultAchievementState(): AchievementState {
	return {
		unlocked: false,
		unlockedAt: null,
		progress: 0,
		notified: false
	};
}
