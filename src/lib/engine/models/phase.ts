/**
 * @fileoverview Phase and condition type definitions for the game engine.
 * Contains interfaces for the 20-phase progression system.
 *
 * The game progresses through 20 phases, divided into two visual modes:
 * - PIXEL MODE (Phases 1-10): Grid-based, visual, active clicking
 * - ABSTRACT MODE (Phases 11-20): Text-centered, minimalist, passive idle
 *
 * @module engine/models/phase
 */

// ============================================================================
// Visual Mode Types
// ============================================================================

/**
 * Visual mode determines the UI rendering style.
 * - 'pixel': Grid-based, visual representation (Phases 1-10)
 * - 'abstract': Text-centered, minimalist (Phases 11-20)
 */
export type VisualMode = 'pixel' | 'abstract';

/**
 * Phase type for special handling.
 * - 'standard': Normal progression
 * - 'boss': Challenge phase with special mechanics
 * - 'meditation': Minimal interaction, passive only
 * - 'meta': Game-breaking, fourth-wall mechanics
 */
export type PhaseType = 'standard' | 'boss' | 'meditation' | 'meta';

// ============================================================================
// Condition Types
// ============================================================================

/**
 * Base condition interface that all condition types extend.
 */
interface BaseCondition {
	/** Type discriminator for condition handling */
	type: string;
}

/**
 * Resource condition - requires a certain amount of a resource.
 */
export interface ResourceCondition extends BaseCondition {
	type: 'resource';
	/** Resource identifier to check */
	resourceId: string;
	/** Minimum amount required */
	amount: number | string;
	/** Comparison operator (default: 'gte') */
	operator?: 'eq' | 'gt' | 'gte' | 'lt' | 'lte';
}

/**
 * Time condition - requires minimum time spent in current phase.
 */
export interface TimeCondition extends BaseCondition {
	type: 'time';
	/** Minimum seconds in current phase */
	minSeconds: number;
}

/**
 * Choice condition - requires a specific story choice to have been made.
 */
export interface ChoiceCondition extends BaseCondition {
	type: 'choice';
	/** Story/choice event identifier */
	choiceId: string;
	/** Expected value (choice option selected) */
	value: string | boolean;
}

/**
 * Phase condition - requires reaching a specific phase.
 */
export interface PhaseCondition extends BaseCondition {
	type: 'phase';
	/** Required phase number */
	phase: number;
	/** Whether phase must be completed (not just reached) */
	completed?: boolean;
}

/**
 * Producer condition - requires owning a certain number of producers.
 */
export interface ProducerCondition extends BaseCondition {
	type: 'producer';
	/** Producer identifier */
	producerId: string;
	/** Minimum owned count */
	amount: number;
}

/**
 * Upgrade condition - requires a specific upgrade to be purchased.
 */
export interface UpgradeCondition extends BaseCondition {
	type: 'upgrade';
	/** Upgrade identifier */
	upgradeId: string;
	/** Required level (default: 1 = purchased) */
	level?: number;
}

/**
 * Achievement condition - requires unlocking a specific achievement.
 */
export interface AchievementCondition extends BaseCondition {
	type: 'achievement';
	/** Achievement identifier */
	achievementId: string;
}

/**
 * Composite AND condition - all sub-conditions must be true.
 */
export interface AndCondition extends BaseCondition {
	type: 'and';
	/** All conditions that must be met */
	conditions: Condition[];
}

/**
 * Composite OR condition - at least one sub-condition must be true.
 */
export interface OrCondition extends BaseCondition {
	type: 'or';
	/** At least one condition must be met */
	conditions: Condition[];
}

/**
 * NOT condition - inverts the result of a sub-condition.
 */
export interface NotCondition extends BaseCondition {
	type: 'not';
	/** Condition to invert */
	condition: Condition;
}

/**
 * Always true condition - for phases with no unlock requirements.
 */
export interface AlwaysCondition extends BaseCondition {
	type: 'always';
}

/**
 * Never true condition - for locked/unreachable content.
 */
export interface NeverCondition extends BaseCondition {
	type: 'never';
}

/**
 * Union type of all possible conditions.
 */
export type Condition =
	| ResourceCondition
	| TimeCondition
	| ChoiceCondition
	| PhaseCondition
	| ProducerCondition
	| UpgradeCondition
	| AchievementCondition
	| AndCondition
	| OrCondition
	| NotCondition
	| AlwaysCondition
	| NeverCondition;

// ============================================================================
// Phase Definition
// ============================================================================

/**
 * Grid configuration for pixel mode phases.
 */
export interface GridConfig {
	/** Grid width in cells */
	width: number;
	/** Grid height in cells */
	height: number;
	/** Cell size in pixels (for rendering) */
	cellSize?: number;
}

/**
 * Transition configuration for phase changes.
 */
export interface TransitionConfig {
	/** Duration of transition animation in milliseconds */
	duration: number;
	/** Type of transition effect */
	effect: 'fade' | 'zoom' | 'dissolve' | 'cutscene' | 'none';
	/** Optional cutscene text lines */
	cutsceneText?: string[];
	/** Whether player must click to advance cutscene */
	requireClick?: boolean;
}

/**
 * Complete phase definition.
 * This is the blueprint for each of the 20 game phases.
 */
export interface PhaseDefinition {
	/** Unique phase identifier (1-20) */
	id: number;

	/** Internal string key for the phase */
	key: string;

	/** Display name shown to player */
	name: string;

	/** Subtitle/tagline for the phase */
	subtitle: string;

	/** Detailed description */
	description: string;

	// ========== Timing ==========

	/** Expected minimum duration in minutes */
	durationMin: number;

	/** Expected maximum duration in minutes */
	durationMax: number;

	// ========== Visual ==========

	/** Visual mode (pixel or abstract) */
	visualMode: VisualMode;

	/** Grid configuration (only for pixel mode) */
	gridConfig?: GridConfig;

	/** CSS theme class to apply */
	themeClass?: string;

	/** Background color or gradient */
	backgroundColor?: string;

	// ========== Unlock ==========

	/** Conditions required to unlock this phase */
	unlockConditions: Condition[];

	/** Conditions required to transition to next phase */
	transitionConditions: Condition[];

	/** Whether transition is automatic when conditions are met */
	autoTransition: boolean;

	// ========== Transition ==========

	/** Transition in animation config */
	transitionIn: TransitionConfig;

	/** Transition out animation config */
	transitionOut: TransitionConfig;

	// ========== Content References ==========

	/** Resource IDs available in this phase */
	availableResources: string[];

	/** Producer IDs available in this phase */
	availableProducers: string[];

	/** Upgrade IDs available in this phase */
	availableUpgrades: string[];

	/** Story event IDs triggered in this phase */
	storyEvents: string[];

	// ========== Phase Type ==========

	/** Type of phase for special handling */
	phaseType: PhaseType;

	/** Whether this is a boss phase */
	isBossPhase: boolean;

	/** Whether this is a meditation phase */
	isMeditationPhase: boolean;

	/** Whether clicking is enabled in this phase */
	clickingEnabled: boolean;

	// ========== Display Order ==========

	/** Display order (usually same as id) */
	displayOrder: number;

	/** Whether to show in phase list before unlocked */
	showLocked: boolean;
}

// ============================================================================
// Phase Progress & State
// ============================================================================

/**
 * Progress tracking for a single phase.
 */
export interface PhaseProgress {
	/** Phase ID */
	phaseId: number;

	/** Whether phase has been entered at least once */
	entered: boolean;

	/** Whether phase has been completed (transitioned to next) */
	completed: boolean;

	/** Total time spent in this phase (seconds) */
	timeSpent: number;

	/** Best completion time (seconds, null if never completed) */
	bestTime: number | null;

	/** Number of times this phase was entered */
	timesEntered: number;

	/** Story events triggered in this phase */
	triggeredEvents: Set<string>;

	/** Choices made in this phase (eventId -> choiceId) */
	choices: Record<string, string>;

	/** First entered timestamp */
	firstEntered: number | null;

	/** Last entered timestamp */
	lastEntered: number | null;

	/** Timestamp when completed */
	completedAt: number | null;
}

/**
 * Complete phase manager state for serialization.
 */
export interface PhaseManagerState {
	/** Current phase ID (1-20) */
	currentPhase: number;

	/** Timestamp when current phase was entered */
	phaseStartTime: number;

	/** Time spent in current phase (seconds) */
	currentPhaseTime: number;

	/** Set of unlocked phase IDs */
	unlockedPhases: number[];

	/** Progress for each phase */
	phaseProgress: Record<number, PhaseProgress>;

	/** Whether transition is currently in progress */
	isTransitioning: boolean;

	/** Whether transition is ready (conditions met) */
	transitionReady: boolean;

	/** Current visual mode */
	visualMode: VisualMode;
}

// ============================================================================
// Transition Events
// ============================================================================

/**
 * State during a phase transition.
 */
export interface TransitionState {
	/** Phase transitioning from */
	fromPhase: number;

	/** Phase transitioning to */
	toPhase: number;

	/** Current progress (0-1) */
	progress: number;

	/** Transition start timestamp */
	startTime: number;

	/** Expected end timestamp */
	endTime: number;

	/** Current stage of transition */
	stage: 'fadeOut' | 'cutscene' | 'loading' | 'fadeIn' | 'complete';

	/** Current cutscene line index (if applicable) */
	cutsceneIndex?: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create a default phase progress object.
 *
 * @param phaseId - Phase ID
 * @returns Default phase progress
 */
export function createDefaultPhaseProgress(phaseId: number): PhaseProgress {
	return {
		phaseId,
		entered: false,
		completed: false,
		timeSpent: 0,
		bestTime: null,
		timesEntered: 0,
		triggeredEvents: new Set(),
		choices: {},
		firstEntered: null,
		lastEntered: null,
		completedAt: null
	};
}

/**
 * Create a default phase manager state.
 *
 * @returns Default phase manager state
 */
export function createDefaultPhaseManagerState(): PhaseManagerState {
	return {
		currentPhase: 1,
		phaseStartTime: Date.now(),
		currentPhaseTime: 0,
		unlockedPhases: [1],
		phaseProgress: {
			1: createDefaultPhaseProgress(1)
		},
		isTransitioning: false,
		transitionReady: false,
		visualMode: 'pixel'
	};
}

// ============================================================================
// Phase ID Constants
// ============================================================================

/**
 * Phase IDs as constants for type safety.
 */
export const PhaseId = {
	THE_PIXEL: 1,
	THE_CANVAS: 2,
	THE_GALLERY: 3,
	THE_SCREEN: 4,
	THE_ROOM: 5,
	THE_HOUSE: 6,
	THE_CITY: 7,
	THE_COUNTRY: 8,
	THE_EARTH: 9,
	THE_MOON: 10,
	SOLAR_SYSTEM: 11,
	THE_SUN: 12,
	MILKY_WAY: 13,
	LOCAL_GROUP: 14,
	OBSERVABLE_UNIVERSE: 15,
	BLACK_HOLES: 16,
	MULTIVERSE: 17,
	THE_VOID: 18,
	SOURCE_CODE: 19,
	THE_PLAYER: 20
} as const;

/**
 * Type for valid phase IDs.
 */
export type PhaseIdType = (typeof PhaseId)[keyof typeof PhaseId];

/**
 * Phase where visual mode switches from pixel to abstract.
 */
export const ABSTRACT_MODE_START_PHASE = 11;

/**
 * Total number of phases in the game.
 */
export const TOTAL_PHASES = 20;
