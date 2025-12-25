/**
 * @fileoverview Narrative system type definitions.
 * Contains interfaces for logs, dialogues, choices, and story events.
 *
 * The narrative system is a core feature that transforms mechanical
 * idle gameplay into an existential journey. Every milestone is
 * accompanied by philosophical reflection.
 *
 * @module engine/models/narrative
 */

import type { Decimal } from '../utils/decimal';

// ============================================================================
// Log System Types
// ============================================================================

/**
 * Category of log entries for filtering and styling.
 */
export type LogCategory = 'thought' | 'discovery' | 'warning' | 'revelation' | 'memory';

/**
 * A log entry - the inner thoughts of the pixel.
 * Short, philosophical, sometimes witty observations.
 */
export interface LogEntry {
	/** Unique identifier for this log */
	id: string;

	/** The log text content */
	text: string;

	/** Phase when this log was triggered */
	phase: number;

	/** Timestamp when log was added */
	timestamp: number;

	/** Category for filtering and styling */
	category: LogCategory;

	/** Optional icon or emoji for display */
	icon?: string;

	/** Whether this log has been read by the player */
	read: boolean;
}

/**
 * Definition for a log that can be triggered.
 */
export interface LogDefinition {
	/** Unique identifier */
	id: string;

	/** Log text content */
	text: string;

	/** Category for styling */
	category: LogCategory;

	/** Optional icon */
	icon?: string;

	/** Phase this log belongs to (for filtering) */
	phase?: number;
}

// ============================================================================
// Dialogue System Types
// ============================================================================

/**
 * Speaker identifiers for dialogue styling.
 */
export type SpeakerId =
	| 'pixel'
	| 'sun'
	| 'andromeda'
	| 'void'
	| 'old_woman'
	| 'city_ai'
	| 'president'
	| 'narrator'
	| 'unknown';

/**
 * Visual styling for a speaker.
 */
export interface SpeakerStyle {
	/** Display name */
	name: string;

	/** Primary text color */
	color: string;

	/** Optional gradient end color */
	gradientEnd?: string;

	/** Font style */
	fontStyle: 'normal' | 'italic';

	/** Font weight */
	fontWeight: 'normal' | 'bold';

	/** Optional glow effect color */
	glowColor?: string;

	/** Portrait/avatar identifier */
	portrait?: string;
}

/**
 * A single line of dialogue.
 */
export interface DialogueLine {
	/** The text content */
	text: string;

	/** Delay after this line in milliseconds */
	delay: number;

	/** Optional speaker override (defaults to dialogue speaker) */
	speaker?: SpeakerId;

	/** Optional effect on this line (shake, pulse, etc.) */
	effect?: 'shake' | 'pulse' | 'glitch' | 'fade';
}

/**
 * A complete dialogue sequence.
 */
export interface Dialogue {
	/** Unique identifier */
	id: string;

	/** Primary speaker */
	speaker: SpeakerId;

	/** Sequence of lines */
	lines: DialogueLine[];

	/** Optional choices at the end */
	choices?: Choice[];

	/** Whether this dialogue pauses the game */
	pausesGame: boolean;

	/** Whether this is a fullscreen "emotional moment" */
	isEmotionalMoment: boolean;

	/** Optional callback ID to fire on completion */
	onCompleteEvent?: string;

	/** Background effect during dialogue */
	backgroundEffect?: 'dim' | 'blur' | 'darken' | 'none';

	/** Whether player can skip lines (not dialogues) */
	canSkipLines: boolean;
}

/**
 * Definition for a dialogue that can be triggered.
 */
export interface DialogueDefinition extends Omit<Dialogue, 'id'> {
	/** Unique identifier */
	id: string;

	/** Optional condition to check before showing */
	conditions?: StoryCondition[];

	/** Phase this dialogue belongs to */
	phase?: number;
}

// ============================================================================
// Choice System Types
// ============================================================================

/**
 * Types of consequences that choices can have.
 */
export type ConsequenceType =
	| 'resource_add'
	| 'resource_multiply'
	| 'flag_set'
	| 'flag_unset'
	| 'ending_unlock'
	| 'phase_skip'
	| 'achievement_unlock'
	| 'multiplier_add'
	| 'log_add'
	| 'dialogue_trigger'
	| 'upgrade_unlock'
	| 'producer_unlock';

/**
 * A consequence of making a choice.
 */
export interface Consequence {
	/** Type of consequence */
	type: ConsequenceType;

	/** Payload data for the consequence */
	payload: ConsequencePayload;
}

/**
 * Payload types for different consequences.
 */
export type ConsequencePayload =
	| ResourceConsequencePayload
	| FlagConsequencePayload
	| EndingConsequencePayload
	| PhaseSkipConsequencePayload
	| AchievementConsequencePayload
	| MultiplierConsequencePayload
	| LogConsequencePayload
	| DialogueConsequencePayload;

export interface ResourceConsequencePayload {
	resourceId: string;
	amount: number | string; // Can be number or Decimal string
}

export interface FlagConsequencePayload {
	key: string;
	value?: boolean | string | number;
}

export interface EndingConsequencePayload {
	endingId: string;
}

export interface PhaseSkipConsequencePayload {
	skipToPhase: number;
}

export interface AchievementConsequencePayload {
	achievementId: string;
}

export interface MultiplierConsequencePayload {
	multiplierId: string;
	resourceId?: string;
	value: number;
	duration?: number; // Milliseconds, undefined = permanent
}

export interface LogConsequencePayload {
	logId: string;
}

export interface DialogueConsequencePayload {
	dialogueId: string;
}

/**
 * A player choice within a dialogue or story event.
 */
export interface Choice {
	/** Unique identifier for this choice */
	id: string;

	/** Display label (button text) */
	label: string;

	/** Optional description/flavor text */
	description?: string;

	/** Consequences of choosing this option */
	consequences: Consequence[];

	/** Optional visual effect when selected */
	aestheticImpact?: string;

	/** Optional condition to show this choice */
	condition?: StoryCondition;

	/** Whether this choice is currently available */
	available?: boolean;

	/** Reason why unavailable (if applicable) */
	unavailableReason?: string;
}

// ============================================================================
// Story Event Types
// ============================================================================

/**
 * Types of story events.
 */
export type StoryEventType = 'log' | 'dialogue' | 'choice' | 'revelation' | 'cutscene';

/**
 * Types of trigger conditions for story events.
 */
export type StoryTriggerType =
	| 'resource_reached'
	| 'phase_entered'
	| 'phase_completed'
	| 'time_passed'
	| 'producer_count'
	| 'upgrade_purchased'
	| 'achievement_unlocked'
	| 'flag_set'
	| 'choice_made'
	| 'condition'
	| 'manual';

/**
 * A condition for triggering or displaying story content.
 */
export interface StoryCondition {
	/** Type of condition */
	type: StoryTriggerType;

	/** Condition-specific parameters */
	params: StoryConditionParams;
}

/**
 * Parameters for different condition types.
 */
export type StoryConditionParams =
	| ResourceConditionParams
	| PhaseConditionParams
	| TimeConditionParams
	| ProducerConditionParams
	| UpgradeConditionParams
	| AchievementConditionParams
	| FlagConditionParams
	| ChoiceConditionParams
	| CustomConditionParams
	| ManualConditionParams;

export interface ResourceConditionParams {
	resourceId: string;
	amount: number | string;
	comparison?: 'gte' | 'lte' | 'eq' | 'gt' | 'lt';
}

export interface PhaseConditionParams {
	phase: number;
	completed?: boolean;
}

export interface TimeConditionParams {
	seconds: number;
	comparison?: 'gte' | 'lte' | 'eq';
}

export interface ProducerConditionParams {
	producerId: string;
	count: number;
	comparison?: 'gte' | 'lte' | 'eq';
}

export interface UpgradeConditionParams {
	upgradeId: string;
	level?: number;
}

export interface AchievementConditionParams {
	achievementId: string;
}

export interface FlagConditionParams {
	key: string;
	value?: boolean | string | number;
}

export interface ChoiceConditionParams {
	choiceId: string;
	selectedOption?: string;
}

export interface CustomConditionParams {
	/** Custom condition function identifier */
	conditionId: string;
}

export interface ManualConditionParams {
	/** Optional note for documentation */
	note?: string;
}

/**
 * A story event that can be triggered.
 */
export interface StoryEvent {
	/** Unique identifier */
	id: string;

	/** Type of story event */
	type: StoryEventType;

	/** Trigger conditions (all must be met) */
	triggers: StoryCondition[];

	/** Whether this event can only trigger once */
	oneTime: boolean;

	/** Whether this is a repeatable event (e.g., milestone logs) */
	repeatable: boolean;

	/** Content to display - either log ID or dialogue ID */
	contentId: string;

	/** Phase this event belongs to */
	phase?: number;

	/** Priority for ordering when multiple events trigger */
	priority: number;

	/** Delay before showing after trigger (milliseconds) */
	delay: number;

	/** Whether this event pauses the game */
	pausesGame: boolean;

	/** Optional title for revelations/cutscenes */
	title?: string;
}

/**
 * Full story event definition including content.
 */
export interface StoryEventDefinition extends StoryEvent {
	/** Inline log content (alternative to contentId) */
	logContent?: LogDefinition;

	/** Inline dialogue content (alternative to contentId) */
	dialogueContent?: DialogueDefinition;
}

// ============================================================================
// Story Path Types
// ============================================================================

/**
 * Story paths that can be tracked.
 */
export type StoryPath = 'peaceful' | 'consuming' | 'neutral' | 'unknown';

/**
 * Ending identifiers.
 */
export type EndingId =
	| 'the_creator'
	| 'the_destroyer'
	| 'the_observer'
	| 'the_merged'
	| 'the_lonely'
	| 'the_returner'
	| 'the_transcendent'
	| 'the_nothing';

/**
 * An ending that can be unlocked.
 */
export interface Ending {
	/** Unique identifier */
	id: EndingId;

	/** Display name */
	name: string;

	/** Description of the ending */
	description: string;

	/** Requirements to unlock this ending */
	requirements: StoryCondition[];

	/** Story path this ending belongs to */
	path: StoryPath;

	/** Whether this ending has been seen */
	seen: boolean;
}

// ============================================================================
// Narrative State Types
// ============================================================================

/**
 * Current state of an active dialogue.
 */
export interface ActiveDialogueState {
	/** The dialogue being displayed */
	dialogue: Dialogue;

	/** Current line index */
	currentLineIndex: number;

	/** Whether currently typing (typewriter effect) */
	isTyping: boolean;

	/** Current character index in current line */
	currentCharIndex: number;

	/** Accumulated text shown so far */
	displayedText: string;

	/** Whether waiting for player input */
	waitingForInput: boolean;

	/** Whether showing choices */
	showingChoices: boolean;

	/** Start timestamp */
	startedAt: number;
}

/**
 * Serialized narrative state for saving.
 */
export interface SerializedNarrativeState {
	/** IDs of triggered one-time events */
	triggeredEvents: string[];

	/** Player choices made (choiceId -> selectedOption) */
	playerChoices: Record<string, string>;

	/** Unlocked ending IDs */
	unlockedEndings: string[];

	/** Set flags (key -> value) */
	flags: Record<string, boolean | string | number>;

	/** Log entry IDs (for history) */
	logHistory: string[];

	/** Timestamp of last narrative check */
	lastCheckTime: number;
}

// ============================================================================
// Speaker Styles Configuration
// ============================================================================

/**
 * Predefined speaker styles.
 */
export const SPEAKER_STYLES: Record<SpeakerId, SpeakerStyle> = {
	pixel: {
		name: 'Pixel',
		color: '#FFFFFF',
		fontStyle: 'normal',
		fontWeight: 'normal'
	},
	sun: {
		name: 'The Sun',
		color: '#FFD700',
		gradientEnd: '#FF6B00',
		fontStyle: 'normal',
		fontWeight: 'bold',
		glowColor: '#FF6B00'
	},
	andromeda: {
		name: 'Andromeda',
		color: '#9B59B6',
		gradientEnd: '#E91E63',
		fontStyle: 'italic',
		fontWeight: 'normal',
		glowColor: '#9B59B6'
	},
	void: {
		name: 'The Void',
		color: '#000000',
		fontStyle: 'normal',
		fontWeight: 'bold',
		glowColor: '#FFFFFF'
	},
	old_woman: {
		name: 'The Last Human',
		color: '#E0E0E0',
		fontStyle: 'italic',
		fontWeight: 'normal'
	},
	city_ai: {
		name: 'City AI v2.1',
		color: '#00BCD4',
		fontStyle: 'normal',
		fontWeight: 'normal',
		glowColor: '#00BCD4'
	},
	president: {
		name: 'The President',
		color: '#3F51B5',
		fontStyle: 'normal',
		fontWeight: 'bold'
	},
	narrator: {
		name: '',
		color: '#9E9E9E',
		fontStyle: 'italic',
		fontWeight: 'normal'
	},
	unknown: {
		name: '???',
		color: '#757575',
		fontStyle: 'normal',
		fontWeight: 'normal'
	}
};
