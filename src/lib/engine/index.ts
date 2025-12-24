/**
 * @fileoverview Main entry point for the Pixel Singularity game engine.
 * Re-exports all public APIs from the engine modules.
 *
 * @module engine
 */

// ============================================================================
// Core Systems
// ============================================================================
export { Game, type GameStatus } from './core/Game.svelte';
export { EventManager, type SubscribeOptions } from './core/EventManager';
export { GameLoop, type LoopState, type LoopStats, type TickCallback } from './core/GameLoop';
export {
	SaveManager,
	type SerializedSaveData,
	type SaveOptions
} from './core/SaveManager';
export {
	MigrationRegistry,
	type MigrationFunction,
	sanitizeSaveData,
	DEFAULT_RUN_STATE,
	DEFAULT_ETERNAL_STATE
} from './core/SaveMigration';

// ============================================================================
// Systems (Managers)
// ============================================================================
export { ResourceManager } from './systems/ResourceManager.svelte';
export { ProducerManager } from './systems/ProducerManager.svelte';
export {
	PhaseManager,
	type PhaseManagerContext,
	type TransitionCallback
} from './systems/PhaseManager.svelte';
export {
	ConditionEvaluator,
	Conditions,
	createConditionEvaluator,
	type EvaluationContext,
	type EvaluationResult
} from './systems/ConditionEvaluator';
export {
	ProductionPipeline,
	type Multiplier,
	type MultiplierInput,
	type MultiplierSource,
	type MultiplierStackingType,
	type ProductionBreakdown
} from './systems/ProductionPipeline';
export { NarrativeManager, type NarrativeContext } from './systems/NarrativeManager.svelte';

// ============================================================================
// Models & Types
// ============================================================================
export type {
	RunState,
	EternalState,
	GameState,
	GameStatistics,
	PlayerPreferences,
	SaveMeta,
	SerializedGameState,
	Manager,
	Callback,
	Unsubscribe,
	Condition,
	Effect,
	GameConfig
} from './models/types';
export { DEFAULT_CONFIG } from './models/types';

export type {
	GameEventMap,
	GameEventName,
	GameEventData,
	GameInitializedEvent,
	GamePausedEvent,
	GameResumedEvent,
	TickEvent,
	GameSavedEvent,
	ResourceChangedEvent,
	ResourceUnlockedEvent,
	ProductionChangedEvent,
	PhaseUnlockedEvent,
	PhaseEnteredEvent,
	PhaseRequirementsCheckedEvent,
	UpgradePurchasedEvent,
	UpgradeUnlockedEvent,
	AchievementUnlockedEvent,
	StoryTriggeredEvent,
	StoryCompletedEvent,
	LogAddedEvent,
	DialogueStartedEvent,
	DialogueAdvancedEvent,
	ChoiceMadeEvent,
	FlagSetEvent,
	EndingUnlockedEvent,
	RebirthStartedEvent,
	RebirthCompletedEvent,
	OfflineGainsCalculatedEvent,
	ProducerPurchasedEvent,
	ProducerUnlockedEvent,
	MultiplierChangedEvent,
	AutomationTriggeredEvent
} from './models/events';

// Narrative Models
export type {
	LogEntry,
	LogDefinition,
	LogCategory,
	Dialogue,
	DialogueLine,
	DialogueDefinition,
	Choice,
	Consequence,
	ConsequenceType,
	ConsequencePayload,
	StoryEvent,
	StoryEventType,
	StoryCondition,
	StoryTriggerType,
	ActiveDialogueState,
	SerializedNarrativeState,
	SpeakerId,
	SpeakerStyle,
	StoryPath,
	EndingId,
	Ending
} from './models/narrative';
export { SPEAKER_STYLES } from './models/narrative';

export type {
	ResourceDefinition,
	ResourceState,
	ResourceCategory,
	ResourceIdType
} from './models/resources';
export {
	ResourceId,
	RESOURCE_DEFINITIONS,
	getResourceDefinition,
	getResourcesByCategory,
	getResourcesForPhase,
	isResourceVisibleAtPhase
} from './models/resources';

export type {
	ProducerDefinition,
	ProducerState,
	ProducerCategory,
	ProducerIdType
} from './models/producers';
export {
	ProducerId,
	PRODUCER_DEFINITIONS,
	getProducerDefinition,
	getProducersByCategory,
	getProducersForPhase,
	isProducerVisibleAtPhase
} from './models/producers';

export type {
	PhaseDefinition,
	PhaseProgress,
	PhaseManagerState,
	TransitionState,
	TransitionConfig,
	GridConfig,
	Condition as PhaseCondition,
	ResourceCondition,
	TimeCondition,
	ChoiceCondition,
	PhaseCondition as PhaseNumberCondition,
	ProducerCondition,
	UpgradeCondition,
	AchievementCondition,
	AndCondition,
	OrCondition,
	NotCondition,
	VisualMode,
	PhaseType,
	PhaseIdType
} from './models/phase';
export {
	PhaseId,
	ABSTRACT_MODE_START_PHASE,
	TOTAL_PHASES,
	createDefaultPhaseProgress,
	createDefaultPhaseManagerState
} from './models/phase';

// ============================================================================
// Data Definitions
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
} from './data/phases';

// Story Data
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
} from './data/story';

// ============================================================================
// Utilities
// ============================================================================
export {
	Decimal,
	D,
	ZERO,
	ONE,
	TWO,
	TEN,
	HUNDRED,
	THOUSAND,
	MILLION,
	BILLION,
	TRILLION,
	INFINITY,
	NEG_INFINITY,
	add,
	sub,
	mul,
	div,
	pow,
	sqrt,
	ln,
	log10,
	log,
	gt,
	gte,
	lt,
	lte,
	eq,
	neq,
	cmp,
	max,
	min,
	clamp,
	abs,
	floor,
	ceil,
	round,
	isFinite,
	isNaN,
	isPositive,
	isNegative,
	isZero,
	calculateProduction,
	calculateExponentialCost,
	calculateBulkCost,
	calculateMaxAffordable,
	applyMultiplier,
	applyPercentBonus,
	serialize,
	deserialize,
	type DecimalSource
} from './utils/decimal';

export {
	formatNumber,
	formatPercent,
	formatMultiplier,
	formatDuration,
	formatDurationCompact,
	formatRate,
	formatCost,
	formatOrdinal,
	parseFormattedNumber,
	type NotationStyle,
	type FormatOptions
} from './utils/format';

export {
	type OfflineProgressConfig,
	type OfflineReward,
	type OfflineCalculationResult,
	DEFAULT_OFFLINE_CONFIG,
	calculateOfflineProgress,
	calculateOfflineProgressWithBreakdown
} from './utils/OfflineProgress';

// ============================================================================
// Context Helpers
// ============================================================================
export {
	GAME_CONTEXT_KEY,
	setGameContext,
	getGameContext,
	hasGameContext,
	tryGetGameContext
} from './context';
