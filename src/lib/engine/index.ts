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

// ============================================================================
// Systems (Managers)
// ============================================================================
export { ResourceManager } from './systems/ResourceManager.svelte';

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
	UpgradePurchasedEvent,
	AchievementUnlockedEvent,
	StoryTriggeredEvent,
	RebirthStartedEvent,
	RebirthCompletedEvent,
	OfflineGainsCalculatedEvent
} from './models/events';

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
