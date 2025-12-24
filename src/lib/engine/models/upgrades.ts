/**
 * @fileoverview Upgrade type definitions for the game engine.
 * Defines upgrade categories, effects, and state management types.
 *
 * Upgrades are divided into three categories:
 * - Run Upgrades: Phase-specific upgrades that reset on rebirth
 * - Eternal Upgrades: Permanent upgrades in the skill tree
 * - Secret Upgrades: Hidden upgrades with special unlock conditions
 *
 * @module engine/models/upgrades
 */

import type { DecimalSource } from '../utils/decimal';

// ============================================================================
// Upgrade Categories & IDs
// ============================================================================

/**
 * Categories of upgrades in the game.
 */
export type UpgradeCategory = 'run' | 'eternal' | 'secret';

/**
 * Skill tree paths for eternal upgrades.
 */
export type SkillTreePath = 'consumer' | 'creator' | 'observer';

/**
 * Currency types used for upgrade purchases.
 */
export type UpgradeCurrency = 'pixels' | 'primordial' | 'knowledge' | 'memory';

/**
 * Type of upgrade effect.
 */
export type UpgradeEffectType =
	| 'multiplier' // Multiplies production values
	| 'additive' // Adds to production values
	| 'unlock' // Unlocks features/mechanics
	| 'passive' // Always active bonus
	| 'click' // Modifies click power
	| 'cost_reduction' // Reduces costs
	| 'starting_bonus' // Bonus at start of run
	| 'speed'; // Speed modifiers

/**
 * Target of an upgrade effect.
 */
export type UpgradeEffectTarget =
	| 'all' // Affects all resources
	| 'pixels' // Only affects pixels
	| 'production' // Affects production rates
	| 'click' // Affects click power
	| 'phase' // Affects phase progression
	| 'offline' // Affects offline gains
	| string; // Specific resource/producer ID

// ============================================================================
// Upgrade Effect System
// ============================================================================

/**
 * Base interface for all upgrade effects.
 */
export interface BaseUpgradeEffect {
	/** Type of effect */
	type: UpgradeEffectType;
	/** Target of the effect */
	target: UpgradeEffectTarget;
	/** Human-readable description */
	description: string;
}

/**
 * Multiplier effect - multiplies a value.
 */
export interface MultiplierEffect extends BaseUpgradeEffect {
	type: 'multiplier';
	/** Multiplier value (e.g., 1.5 for +50%) */
	value: DecimalSource;
	/** Whether the effect scales with level (for repeatable upgrades) */
	scalesWithLevel?: boolean;
	/** Scaling formula per level (default: linear) */
	scalingType?: 'linear' | 'exponential';
	/** Scaling factor (default: same as value) */
	scalingFactor?: DecimalSource;
}

/**
 * Additive effect - adds to a value.
 */
export interface AdditiveEffect extends BaseUpgradeEffect {
	type: 'additive';
	/** Amount to add */
	value: DecimalSource;
	/** Whether the effect scales with level */
	scalesWithLevel?: boolean;
}

/**
 * Unlock effect - unlocks a feature or mechanic.
 */
export interface UnlockEffect extends BaseUpgradeEffect {
	type: 'unlock';
	/** ID of the feature to unlock */
	unlockId: string;
	/** Type of thing being unlocked */
	unlockType: 'feature' | 'producer' | 'resource' | 'phase' | 'mechanic';
}

/**
 * Passive effect - always-on bonus.
 */
export interface PassiveEffect extends BaseUpgradeEffect {
	type: 'passive';
	/** Passive bonus ID */
	bonusId: string;
	/** Bonus value */
	value: DecimalSource;
}

/**
 * Click effect - modifies click power.
 */
export interface ClickEffect extends BaseUpgradeEffect {
	type: 'click';
	/** Click power modifier */
	value: DecimalSource;
	/** Whether additive or multiplicative */
	mode: 'additive' | 'multiplicative';
}

/**
 * Cost reduction effect.
 */
export interface CostReductionEffect extends BaseUpgradeEffect {
	type: 'cost_reduction';
	/** Target upgrade/producer category */
	target: string;
	/** Reduction percentage (0.1 = 10% cheaper) */
	reduction: DecimalSource;
}

/**
 * Starting bonus effect (for eternal upgrades).
 */
export interface StartingBonusEffect extends BaseUpgradeEffect {
	type: 'starting_bonus';
	/** Resource to grant at start */
	resourceId: string;
	/** Amount to grant */
	amount: DecimalSource;
}

/**
 * Speed effect - affects game speed or phase progression.
 */
export interface SpeedEffect extends BaseUpgradeEffect {
	type: 'speed';
	/** Speed multiplier */
	value: DecimalSource;
	/** What is affected */
	affects: 'production' | 'phase' | 'offline' | 'all';
}

/**
 * Union type of all possible upgrade effects.
 */
export type UpgradeEffect =
	| MultiplierEffect
	| AdditiveEffect
	| UnlockEffect
	| PassiveEffect
	| ClickEffect
	| CostReductionEffect
	| StartingBonusEffect
	| SpeedEffect;

// ============================================================================
// Upgrade Definition
// ============================================================================

/**
 * Cost function type for dynamic cost calculation.
 */
export type CostFunction = (level: number) => DecimalSource;

/**
 * Unlock condition for an upgrade.
 */
export interface UpgradeUnlockCondition {
	/** Type of condition */
	type: 'phase' | 'resource' | 'upgrade' | 'achievement' | 'producer' | 'secret';
	/** ID of the required item (for upgrade/achievement/producer) */
	id?: string;
	/** Required phase number (for phase condition) */
	phase?: number;
	/** Required amount (for resource condition) */
	amount?: DecimalSource;
	/** Required level (for upgrade/producer condition) */
	level?: number;
}

/**
 * Complete upgrade definition.
 */
export interface UpgradeDefinition {
	/** Unique upgrade identifier */
	id: string;

	/** Display name */
	name: string;

	/** Description explaining what the upgrade does */
	description: string;

	/** Flavor text (optional) */
	flavor?: string;

	// ========== Cost ==========
	/** Base cost (or cost function for dynamic costs) */
	baseCost: DecimalSource | CostFunction;

	/** Currency used for purchase */
	currency: UpgradeCurrency;

	/** Cost multiplier per level (for repeatable upgrades) */
	costMultiplier?: DecimalSource;

	// ========== Effect ==========
	/** Effects applied when upgrade is active */
	effects: UpgradeEffect[];

	// ========== Unlock & Visibility ==========
	/** Phase when this upgrade becomes visible */
	minPhase: number;

	/** Conditions that must be met to unlock */
	unlockConditions?: UpgradeUnlockCondition[];

	/** Upgrade IDs that must be owned first */
	requires?: string[];

	/** Whether the upgrade starts hidden */
	hidden?: boolean;

	// ========== Category & Grouping ==========
	/** Upgrade category */
	category: UpgradeCategory;

	/** Skill tree path (for eternal upgrades) */
	path?: SkillTreePath;

	/** Display order within category */
	displayOrder: number;

	/** Group ID for UI organization */
	group?: string;

	// ========== Repeatability ==========
	/** Maximum level (undefined = 1, 0 = infinite) */
	maxLevel?: number;

	/** Whether this is a one-time purchase */
	isOneTime?: boolean;

	// ========== Visual ==========
	/** Icon identifier */
	icon?: string;

	/** CSS color class */
	colorClass?: string;
}

// ============================================================================
// Upgrade State
// ============================================================================

/**
 * Runtime state of an upgrade.
 */
export interface UpgradeState {
	/** Current level (0 = not purchased) */
	level: number;

	/** Whether the upgrade is visible/unlocked */
	unlocked: boolean;

	/** Whether the upgrade is currently purchasable */
	canAfford: boolean;

	/** Next purchase cost */
	nextCost: DecimalSource;

	/** Time of first purchase (null if never purchased) */
	firstPurchaseTime: number | null;

	/** Total spent on this upgrade */
	totalSpent: DecimalSource;
}

/**
 * Internal upgrade state with definition reference.
 */
export interface InternalUpgradeState extends UpgradeState {
	/** Reference to the definition */
	definition: UpgradeDefinition;
}

// ============================================================================
// Serialization
// ============================================================================

/**
 * Serializable format for saving upgrade state.
 */
export interface SerializedUpgrades {
	/** Run upgrade levels */
	runLevels: Record<string, number>;

	/** Eternal upgrade levels */
	eternalLevels: Record<string, number>;

	/** Secret upgrade levels */
	secretLevels: Record<string, number>;

	/** Unlocked upgrade IDs */
	unlocked: string[];

	/** Total spent per upgrade */
	totalSpent: Record<string, string>;

	/** First purchase times */
	firstPurchaseTimes: Record<string, number>;
}

// ============================================================================
// Upgrade ID Constants
// ============================================================================

/**
 * Enum of all upgrade IDs for type-safe references.
 */
export const UpgradeId = {
	// ========== Phase 1 Run Upgrades ==========
	PIXEL_BOOST_1: 'pixel_boost_1',
	CLICK_POWER_1: 'click_power_1',
	AUTO_CLICKER_1: 'auto_clicker_1',

	// ========== Phase 2 Run Upgrades ==========
	PIXEL_GENERATOR: 'pixel_generator',
	COLOR_ATTRACTOR: 'color_attractor',
	CANVAS_EFFICIENCY: 'canvas_efficiency',
	MULTI_CLICK: 'multi_click',

	// ========== Phase 3 Run Upgrades ==========
	GALLERY_SYNERGY: 'gallery_synergy',
	CANVAS_COMPRESSION: 'canvas_compression',
	PATTERN_BONUS: 'pattern_bonus',
	EXPANSION_WING: 'expansion_wing',

	// ========== Eternal Upgrades - Consumer Path ==========
	QUICK_START: 'quick_start',
	PHASE_SKIP: 'phase_skip',
	ENDLESS_HUNGER: 'endless_hunger',

	// ========== Eternal Upgrades - Creator Path ==========
	SEED_OF_LIFE: 'seed_of_life',
	COOPERATION: 'cooperation',
	SYMBIOSIS: 'symbiosis',

	// ========== Eternal Upgrades - Observer Path ==========
	DEEP_MEMORY: 'deep_memory',
	HIDDEN_SIGHT: 'hidden_sight',
	TRUE_SEEING: 'true_seeing',

	// ========== Secret Upgrades ==========
	ANOMALY_HUNTER: 'anomaly_hunter',
	SPEED_DEMON: 'speed_demon',
	PACIFIST: 'pacifist'
} as const;

/**
 * Type for upgrade ID values.
 */
export type UpgradeIdType = (typeof UpgradeId)[keyof typeof UpgradeId];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if an upgrade is repeatable.
 *
 * @param def - Upgrade definition
 * @returns Whether the upgrade can be purchased multiple times
 */
export function isRepeatableUpgrade(def: UpgradeDefinition): boolean {
	if (def.isOneTime) return false;
	if (def.maxLevel === undefined) return false;
	return def.maxLevel === 0 || def.maxLevel > 1;
}

/**
 * Check if an upgrade is at max level.
 *
 * @param def - Upgrade definition
 * @param level - Current level
 * @returns Whether the upgrade is at max level
 */
export function isAtMaxLevel(def: UpgradeDefinition, level: number): boolean {
	if (def.isOneTime) return level >= 1;
	if (def.maxLevel === 0) return false; // Infinite
	if (def.maxLevel === undefined) return level >= 1;
	return level >= def.maxLevel;
}

/**
 * Get the display text for an upgrade effect.
 *
 * @param effect - Upgrade effect
 * @param level - Current level
 * @returns Human-readable effect description
 */
export function getEffectDisplayText(effect: UpgradeEffect, level: number = 1): string {
	switch (effect.type) {
		case 'multiplier': {
			const mult = effect.scalesWithLevel ? Number(effect.value) * level : Number(effect.value);
			const percent = (mult - 1) * 100;
			return `+${percent.toFixed(0)}% ${effect.target}`;
		}
		case 'additive': {
			const value = effect.scalesWithLevel ? Number(effect.value) * level : Number(effect.value);
			return `+${value} ${effect.target}`;
		}
		case 'unlock':
			return `Unlocks: ${effect.unlockId}`;
		case 'passive':
			return effect.description;
		case 'click':
			return `${effect.mode === 'additive' ? '+' : 'x'}${effect.value} click power`;
		case 'cost_reduction':
			return `-${Number(effect.reduction) * 100}% ${effect.target} costs`;
		case 'starting_bonus':
			return `Start with ${effect.amount} ${effect.resourceId}`;
		case 'speed':
			return `${Number(effect.value)}x ${effect.affects} speed`;
		default: {
			// Exhaustive check - this should never be reached
			const _exhaustiveCheck: never = effect;
			return `Unknown effect: ${(_exhaustiveCheck as { type: string }).type}`;
		}
	}
}
