/**
 * @fileoverview Event type definitions for the game engine.
 * Provides type-safe event definitions for the Pub/Sub system.
 *
 * Events are the primary communication mechanism between engine managers,
 * enabling loose coupling and testability.
 *
 * @module engine/models/events
 */

import type { Decimal } from '../utils/decimal';

// ============================================================================
// Core Game Events
// ============================================================================

/**
 * Emitted when the game engine has fully initialized and is ready to start.
 */
export interface GameInitializedEvent {
	/** Timestamp when initialization completed */
	timestamp: number;
	/** Whether this is a fresh start or loaded from save */
	isNewGame: boolean;
}

/**
 * Emitted when the game is paused.
 */
export interface GamePausedEvent {
	/** Reason for pausing */
	reason: 'user' | 'visibility' | 'modal' | 'story';
	/** Timestamp when paused */
	timestamp: number;
}

/**
 * Emitted when the game is resumed from pause.
 */
export interface GameResumedEvent {
	/** Duration of pause in milliseconds */
	pauseDuration: number;
	/** Timestamp when resumed */
	timestamp: number;
}

/**
 * Emitted on every game tick (for debugging/stats).
 */
export interface TickEvent {
	/** Time since last tick in seconds */
	deltaTime: number;
	/** Total time since game start in seconds */
	totalTime: number;
	/** Current tick number */
	tickCount: number;
}

/**
 * Emitted when the game is saved.
 */
export interface GameSavedEvent {
	/** Timestamp of save */
	timestamp: number;
	/** Size of save data in bytes */
	saveSize: number;
	/** Whether this was an auto-save */
	isAutoSave: boolean;
}

// ============================================================================
// Resource Events
// ============================================================================

/**
 * Emitted when any resource amount changes.
 */
export interface ResourceChangedEvent {
	/** Resource identifier */
	resourceId: string;
	/** Previous amount */
	previousAmount: Decimal;
	/** New amount */
	newAmount: Decimal;
	/** Change amount (can be negative) */
	delta: Decimal;
	/** Source of the change */
	source: 'production' | 'purchase' | 'upgrade' | 'rebirth' | 'click' | 'offline' | 'other';
}

/**
 * Emitted when a new resource is unlocked and becomes available.
 */
export interface ResourceUnlockedEvent {
	/** Resource identifier */
	resourceId: string;
	/** Display name of the resource */
	name: string;
	/** Timestamp of unlock */
	timestamp: number;
}

/**
 * Emitted when a production rate changes.
 */
export interface ProductionChangedEvent {
	/** Resource identifier */
	resourceId: string;
	/** Previous rate per second */
	previousRate: Decimal;
	/** New rate per second */
	newRate: Decimal;
	/** Source of the change */
	source: 'upgrade' | 'building' | 'multiplier' | 'phase' | 'other';
}

// ============================================================================
// Phase Events
// ============================================================================

/**
 * Emitted when a new phase becomes available (unlocked but not entered).
 */
export interface PhaseUnlockedEvent {
	/** Phase number (1-20) */
	phaseNumber: number;
	/** Phase identifier */
	phaseId: string;
	/** Phase display name */
	phaseName: string;
}

/**
 * Emitted when the player enters a new phase.
 */
export interface PhaseEnteredEvent {
	/** Previous phase number */
	previousPhase: number;
	/** New phase number */
	newPhase: number;
	/** Phase identifier */
	phaseId: string;
	/** First time entering this phase? */
	isFirstTime: boolean;
}

/**
 * Emitted when phase requirements are checked (for UI updates).
 */
export interface PhaseRequirementsCheckedEvent {
	/** Phase number being checked */
	phaseNumber: number;
	/** Whether requirements are met */
	requirementsMet: boolean;
	/** Progress towards requirements (0-1) */
	progress: number;
}

// ============================================================================
// Upgrade Events
// ============================================================================

/**
 * Emitted when an upgrade is purchased.
 */
export interface UpgradePurchasedEvent {
	/** Upgrade identifier */
	upgradeId: string;
	/** Cost paid */
	cost: Map<string, Decimal>;
	/** Current level after purchase (for repeatable upgrades) */
	level: number;
}

/**
 * Emitted when a new upgrade becomes available.
 */
export interface UpgradeUnlockedEvent {
	/** Upgrade identifier */
	upgradeId: string;
	/** Upgrade display name */
	name: string;
	/** Upgrade category */
	category: string;
}

// ============================================================================
// Producer Events
// ============================================================================

/**
 * Emitted when a producer is purchased.
 */
export interface ProducerPurchasedEvent {
	/** Producer identifier */
	producerId: string;
	/** Amount purchased */
	amount: number;
	/** New level after purchase */
	newLevel: number;
	/** Cost paid */
	cost: Decimal;
	/** Resource used for cost */
	costResource: string;
}

/**
 * Emitted when a producer is unlocked.
 */
export interface ProducerUnlockedEvent {
	/** Producer identifier */
	producerId: string;
	/** Producer display name */
	name: string;
	/** Producer category */
	category: string;
}

/**
 * Emitted when a multiplier is added or changed.
 */
export interface MultiplierChangedEvent {
	/** Multiplier identifier */
	multiplierId: string;
	/** Display name */
	name: string;
	/** Previous value (null if new) */
	previousValue: Decimal | null;
	/** New value */
	newValue: Decimal;
	/** Affected resource (empty = global) */
	resourceId: string;
	/** Source of the multiplier */
	source: 'producer' | 'upgrade' | 'achievement' | 'phase' | 'eternal' | 'temporary' | 'other';
}

// ============================================================================
// Automation Events
// ============================================================================

/**
 * Emitted when an automation (autobuyer) triggers.
 */
export interface AutomationTriggeredEvent {
	/** Automation identifier */
	automationId: string;
	/** Target of automation (upgrade/building id) */
	targetId: string;
	/** Action performed */
	action: 'buy' | 'upgrade' | 'activate';
	/** Whether action was successful */
	success: boolean;
}

// ============================================================================
// Achievement Events
// ============================================================================

/**
 * Emitted when an achievement is unlocked.
 */
export interface AchievementUnlockedEvent {
	/** Achievement identifier */
	achievementId: string;
	/** Achievement display name */
	name: string;
	/** Achievement description */
	description: string;
	/** Achievement rarity/tier */
	tier: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'secret';
}

// ============================================================================
// Story/Narrative Events
// ============================================================================

/**
 * Emitted when a story moment is triggered.
 */
export interface StoryTriggeredEvent {
	/** Story event identifier */
	storyId: string;
	/** Type of story content */
	type: 'log' | 'dialogue' | 'choice' | 'revelation' | 'cutscene';
	/** Whether this interrupts gameplay */
	pausesGame: boolean;
}

/**
 * Emitted when a story dialogue is completed.
 */
export interface StoryCompletedEvent {
	/** Story event identifier */
	storyId: string;
	/** Choice made (if applicable) */
	choiceMade?: string;
}

/**
 * Emitted when a log is added to the narrative.
 */
export interface LogAddedEvent {
	/** Log identifier */
	logId: string;
	/** Log text content */
	text: string;
	/** Log category */
	category: 'thought' | 'discovery' | 'warning' | 'revelation' | 'memory';
	/** Phase when logged */
	phase: number;
}

/**
 * Emitted when a dialogue starts.
 */
export interface DialogueStartedEvent {
	/** Dialogue identifier */
	dialogueId: string;
	/** Speaker identifier */
	speaker: string;
	/** Number of lines in the dialogue */
	lineCount: number;
	/** Whether the dialogue has choices */
	hasChoices: boolean;
}

/**
 * Emitted when a dialogue line advances.
 */
export interface DialogueAdvancedEvent {
	/** Dialogue identifier */
	dialogueId: string;
	/** Current line index */
	lineIndex: number;
	/** Total lines */
	totalLines: number;
}

/**
 * Emitted when a player makes a story choice.
 */
export interface ChoiceMadeEvent {
	/** Choice identifier */
	choiceId: string;
	/** Selected option label */
	selectedOption: string;
	/** Story path affected */
	pathAffected: 'peaceful' | 'consuming' | 'neutral' | 'none';
}

/**
 * Emitted when a story flag is set.
 */
export interface FlagSetEvent {
	/** Flag key */
	key: string;
	/** Flag value */
	value: boolean | string | number;
	/** Source of the flag */
	source: 'choice' | 'event' | 'achievement' | 'manual';
}

/**
 * Emitted when an ending is unlocked.
 */
export interface EndingUnlockedEvent {
	/** Ending identifier */
	endingId: string;
	/** Ending display name */
	name: string;
	/** Story path that led to this ending */
	path: 'peaceful' | 'consuming' | 'neutral';
}

// ============================================================================
// Rebirth/Prestige Events
// ============================================================================

/**
 * Emitted when a rebirth is initiated.
 */
export interface RebirthStartedEvent {
	/** Current rebirth count (before this rebirth) */
	rebirthCount: number;
	/** Resources that will be gained */
	expectedGains: Map<string, Decimal>;
}

/**
 * Emitted when a rebirth is completed.
 */
export interface RebirthCompletedEvent {
	/** New rebirth count */
	rebirthCount: number;
	/** Time spent in the run (seconds) */
	runTime: number;
	/** Resources gained */
	gains: Map<string, Decimal>;
}

// ============================================================================
// Offline Progression Events
// ============================================================================

/**
 * Emitted when offline progress has been calculated and applied.
 */
export interface OfflineGainsCalculatedEvent {
	/** Time offline in seconds */
	offlineTime: number;
	/** Capped time used for calculation */
	cappedTime: number;
	/** Efficiency multiplier applied */
	efficiency: number;
	/** Resources gained */
	gains: Map<string, Decimal>;
}

// ============================================================================
// Event Map (for type-safe subscriptions)
// ============================================================================

/**
 * Complete map of all event types for type-safe event handling.
 * Use this with EventManager for compile-time type checking.
 */
export interface GameEventMap {
	// Core
	game_initialized: GameInitializedEvent;
	game_paused: GamePausedEvent;
	game_resumed: GameResumedEvent;
	game_saved: GameSavedEvent;
	tick: TickEvent;

	// Resources
	resource_changed: ResourceChangedEvent;
	resource_unlocked: ResourceUnlockedEvent;
	production_changed: ProductionChangedEvent;

	// Phases
	phase_unlocked: PhaseUnlockedEvent;
	phase_entered: PhaseEnteredEvent;
	phase_requirements_checked: PhaseRequirementsCheckedEvent;

	// Upgrades
	upgrade_purchased: UpgradePurchasedEvent;
	upgrade_unlocked: UpgradeUnlockedEvent;

	// Producers
	producer_purchased: ProducerPurchasedEvent;
	producer_unlocked: ProducerUnlockedEvent;
	multiplier_changed: MultiplierChangedEvent;

	// Automation
	automation_triggered: AutomationTriggeredEvent;

	// Achievements
	achievement_unlocked: AchievementUnlockedEvent;

	// Story/Narrative
	story_triggered: StoryTriggeredEvent;
	story_completed: StoryCompletedEvent;
	log_added: LogAddedEvent;
	dialogue_started: DialogueStartedEvent;
	dialogue_advanced: DialogueAdvancedEvent;
	choice_made: ChoiceMadeEvent;
	flag_set: FlagSetEvent;
	ending_unlocked: EndingUnlockedEvent;

	// Rebirth
	rebirth_started: RebirthStartedEvent;
	rebirth_completed: RebirthCompletedEvent;

	// Offline
	offline_gains_calculated: OfflineGainsCalculatedEvent;
}

/**
 * Union type of all event names.
 */
export type GameEventName = keyof GameEventMap;

/**
 * Helper type to get event data type from event name.
 */
export type GameEventData<T extends GameEventName> = GameEventMap[T];
