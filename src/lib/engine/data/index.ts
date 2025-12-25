/**
 * @fileoverview Central export point for all game data definitions.
 * Re-exports all data modules for convenient access.
 *
 * This module provides access to:
 * - Phase definitions (20 phases)
 * - Upgrade definitions (run, eternal, secret)
 * - Achievement definitions (44+ achievements)
 * - Ending definitions (9 endings)
 * - Secret definitions (15 easter eggs)
 * - Balancing constants
 * - Data validators
 * - Story content (lazy-loaded)
 *
 * @example
 * ```typescript
 * import {
 *   PHASE_DEFINITIONS,
 *   ALL_UPGRADES,
 *   BALANCING,
 *   validateGameData
 * } from '$lib/engine/data';
 * ```
 *
 * @module engine/data
 */

// ============================================================================
// Phase Definitions
// ============================================================================

export {
	PHASE_DEFINITIONS,
	getPhaseDefinition,
	getPhaseDefinitionsMap,
	getPhasesByMode,
	getBossPhases,
	getMeditationPhases,
	getMetaPhases,
	getEstimatedGameDuration
} from './phases';

// ============================================================================
// Upgrade Definitions
// ============================================================================

export {
	ALL_UPGRADES,
	RUN_UPGRADES,
	ETERNAL_UPGRADES,
	SECRET_UPGRADES,
	UPGRADE_MAP,
	getUpgradeDefinition,
	getUpgradesByCategory,
	getUpgradesForPhase,
	getInitialUpgrades,
	getNewUpgradesForPhase,
	getSkillTreeStructure,
	calculatePathTotalCost
} from './upgrades';

// ============================================================================
// Achievement Definitions
// ============================================================================

export {
	ALL_ACHIEVEMENTS,
	ACHIEVEMENT_DEFINITIONS,
	PHASE_ACHIEVEMENTS,
	RESOURCE_ACHIEVEMENTS,
	TIME_ACHIEVEMENTS,
	SECRET_ACHIEVEMENTS,
	ENDING_ACHIEVEMENTS,
	getAchievementDefinition,
	getAchievementsByType,
	getAchievementsByTier,
	getVisibleAchievements,
	getHiddenAchievements,
	getTotalPossiblePP,
	getAchievementsByCategory,
	getRootAchievements,
	getDependentAchievements,
	calculateAchievementStats
} from './achievements';

// ============================================================================
// Ending Definitions
// ============================================================================

export {
	ENDING_DEFINITIONS,
	ALL_ENDINGS,
	STANDARD_ENDINGS,
	TRUE_ENDING,
	getEndingDefinition,
	getEndingsByType,
	getEndingsByPath,
	getUnlockedEndings,
	isEndingUnlocked,
	getTotalPossiblePPFromEndings,
	calculateEndingStats,
	getNextRecommendedEnding,
	getEndingProgressDescription,
	type EndingDefinition,
	type EndingVisualEffect,
	type EndingType
} from './endings';

// ============================================================================
// Secret Definitions
// ============================================================================

export {
	SECRET_DEFINITIONS,
	SECRETS,
	SECRET_MAP,
	getSecretDefinition,
	getSecretsByType,
	getAllSecrets,
	getSecretHints,
	getHints,
	getUndiscoveredHints,
	getTotalSecretPP,
	getSecretStats,
	type SecretDefinition,
	type SecretType,
	type SecretReward,
	type SecretCondition
} from './secrets';

// ============================================================================
// Balancing Constants
// ============================================================================

export {
	BALANCING,
	BASE_PIXEL_RATE,
	PIXEL_SCALE_EXPONENT,
	COLOR_DROP_CHANCE,
	UPGRADE_COST_BASE,
	UPGRADE_COST_EXPONENT,
	ETERNAL_UPGRADE_COST_MULTIPLIER,
	PRESTIGE_REQUIREMENT_BASE,
	PRESTIGE_REWARD_RATIO,
	MIN_REBIRTH_PHASE,
	PHASE_DURATION_MULTIPLIER,
	TRANSITION_ANIMATION_DURATION,
	STANDARD_ACHIEVEMENT_PP,
	SECRET_ACHIEVEMENT_PP,
	ENDING_ACHIEVEMENT_PP,
	TARGET_FPS,
	TICKS_PER_SECOND,
	AUTO_SAVE_INTERVAL,
	MAX_OFFLINE_TIME,
	OFFLINE_EFFICIENCY,
	TYPING_SPEED_DEFAULT,
	DIALOGUE_LINE_DELAY
} from './constants';

// ============================================================================
// Data Validators
// ============================================================================

export {
	validateGameData,
	validateAllData,
	validatePhaseReferences,
	validateUpgradeReferences,
	validateAchievementConditions,
	validateStoryReferences,
	checkUniqueIds,
	isValidPhaseDefinition,
	isValidUpgradeDefinition,
	isValidAchievementDefinition,
	isValidResourceDefinition,
	isValidDialogueDefinition,
	isValidCondition,
	isValidEndingDefinition,
	isValidSecretDefinition,
	type ValidationResult,
	type ValidationError,
	type ValidationWarning
} from './validators';

// ============================================================================
// Story Content (Lazy Loaded)
// ============================================================================

export {
	loadPhaseStory,
	preloadPhaseStories,
	registerStoryForPhases,
	getCachedPhaseStory,
	isPhaseStoryCached,
	clearStoryCache,
	getAllCachedLogs,
	getAllCachedDialogues,
	getAllCachedEvents,
	type PhaseStoryData
} from './story';
