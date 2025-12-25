/**
 * @fileoverview Data validation utilities for game definitions.
 * Provides runtime validation for all game data to catch errors early.
 *
 * This module includes:
 * - Type guards for validating definition structures
 * - Content integrity validators for cross-references
 * - ID uniqueness validators
 * - Comprehensive validation results with errors and warnings
 *
 * Validation can be run at build time or runtime to ensure data consistency.
 *
 * @module engine/data/validators
 */

import type {
	PhaseDefinition,
	Condition,
	GridConfig,
	TransitionConfig
} from '../models/phase';
import type { UpgradeDefinition, UpgradeEffect, UpgradeUnlockCondition } from '../models/upgrades';
import type { AchievementDefinition, AchievementReward } from '../models/achievements';
import type { ResourceDefinition } from '../models/resources';
import type {
	Dialogue,
	DialogueLine,
	Choice,
	Consequence,
	StoryCondition,
	LogDefinition,
	StoryEvent
} from '../models/narrative';

import { PHASE_DEFINITIONS } from './phases';
import {
	getAllCachedLogs,
	getAllCachedDialogues,
	getAllCachedEvents
} from './story';
import { ALL_UPGRADES, UPGRADE_MAP } from './upgrades';
import { ALL_ACHIEVEMENTS, ACHIEVEMENT_DEFINITIONS } from './achievements';
import { RESOURCE_DEFINITIONS } from '../models/resources';

// ============================================================================
// Validation Result Types
// ============================================================================

/**
 * Details of a validation error.
 */
export interface ValidationError {
	/** JSON path to the problematic field (e.g., "phases.1.unlockConditions.0") */
	path: string;

	/** Human-readable error message */
	message: string;

	/** The invalid value (optional, for debugging) */
	value?: unknown;

	/** Severity level */
	severity?: 'error' | 'critical';
}

/**
 * Details of a validation warning.
 * Warnings indicate potential issues but don't prevent the game from running.
 */
export interface ValidationWarning {
	/** JSON path to the field */
	path: string;

	/** Human-readable warning message */
	message: string;

	/** The value that triggered the warning */
	value?: unknown;
}

/**
 * Result of a validation operation.
 */
export interface ValidationResult {
	/** Whether the validation passed (no errors) */
	valid: boolean;

	/** List of errors found */
	errors: ValidationError[];

	/** List of warnings (non-critical issues) */
	warnings: ValidationWarning[];

	/** Timestamp when validation was performed */
	timestamp?: number;

	/** Summary statistics */
	stats?: {
		totalChecks: number;
		passedChecks: number;
		failedChecks: number;
		warningCount: number;
	};
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for PhaseDefinition.
 * Validates that an unknown object conforms to the PhaseDefinition interface.
 *
 * @param data - Unknown data to validate
 * @returns True if data is a valid PhaseDefinition
 */
export function isValidPhaseDefinition(data: unknown): data is PhaseDefinition {
	if (!data || typeof data !== 'object') return false;

	const phase = data as Partial<PhaseDefinition>;

	return (
		typeof phase.id === 'number' &&
		phase.id >= 1 &&
		phase.id <= 20 &&
		typeof phase.key === 'string' &&
		phase.key.length > 0 &&
		typeof phase.name === 'string' &&
		phase.name.length > 0 &&
		typeof phase.subtitle === 'string' &&
		typeof phase.description === 'string' &&
		typeof phase.durationMin === 'number' &&
		phase.durationMin > 0 &&
		typeof phase.durationMax === 'number' &&
		phase.durationMax >= phase.durationMin &&
		(phase.visualMode === 'pixel' || phase.visualMode === 'abstract') &&
		Array.isArray(phase.unlockConditions) &&
		Array.isArray(phase.transitionConditions) &&
		typeof phase.autoTransition === 'boolean' &&
		isValidTransitionConfig(phase.transitionIn) &&
		isValidTransitionConfig(phase.transitionOut) &&
		Array.isArray(phase.availableResources) &&
		Array.isArray(phase.availableProducers) &&
		Array.isArray(phase.availableUpgrades) &&
		Array.isArray(phase.storyEvents) &&
		['standard', 'boss', 'meditation', 'meta'].includes(phase.phaseType || '') &&
		typeof phase.isBossPhase === 'boolean' &&
		typeof phase.isMeditationPhase === 'boolean' &&
		typeof phase.clickingEnabled === 'boolean' &&
		typeof phase.displayOrder === 'number' &&
		typeof phase.showLocked === 'boolean'
	);
}

/**
 * Type guard for GridConfig.
 *
 * @param data - Unknown data to validate
 * @returns True if data is a valid GridConfig
 */
function isValidGridConfig(data: unknown): data is GridConfig {
	if (!data || typeof data !== 'object') return false;

	const grid = data as Partial<GridConfig>;

	return (
		typeof grid.width === 'number' &&
		grid.width > 0 &&
		typeof grid.height === 'number' &&
		grid.height > 0 &&
		(grid.cellSize === undefined || typeof grid.cellSize === 'number')
	);
}

/**
 * Type guard for TransitionConfig.
 *
 * @param data - Unknown data to validate
 * @returns True if data is a valid TransitionConfig
 */
function isValidTransitionConfig(data: unknown): data is TransitionConfig {
	if (!data || typeof data !== 'object') return false;

	const config = data as Partial<TransitionConfig>;

	return (
		typeof config.duration === 'number' &&
		config.duration >= 0 &&
		['fade', 'zoom', 'dissolve', 'cutscene', 'none'].includes(config.effect || '') &&
		(config.cutsceneText === undefined || Array.isArray(config.cutsceneText)) &&
		(config.requireClick === undefined || typeof config.requireClick === 'boolean')
	);
}

/**
 * Type guard for UpgradeDefinition.
 * Validates that an unknown object conforms to the UpgradeDefinition interface.
 *
 * @param data - Unknown data to validate
 * @returns True if data is a valid UpgradeDefinition
 */
export function isValidUpgradeDefinition(data: unknown): data is UpgradeDefinition {
	if (!data || typeof data !== 'object') return false;

	const upgrade = data as Partial<UpgradeDefinition>;

	return (
		typeof upgrade.id === 'string' &&
		upgrade.id.length > 0 &&
		typeof upgrade.name === 'string' &&
		upgrade.name.length > 0 &&
		typeof upgrade.description === 'string' &&
		(typeof upgrade.baseCost === 'number' ||
			typeof upgrade.baseCost === 'string' ||
			typeof upgrade.baseCost === 'function') &&
		['pixels', 'primordial', 'knowledge', 'memory'].includes(upgrade.currency || '') &&
		Array.isArray(upgrade.effects) &&
		upgrade.effects.every(isValidUpgradeEffect) &&
		typeof upgrade.minPhase === 'number' &&
		upgrade.minPhase >= 1 &&
		upgrade.minPhase <= 20 &&
		['run', 'eternal', 'secret'].includes(upgrade.category || '') &&
		typeof upgrade.displayOrder === 'number'
	);
}

/**
 * Type guard for UpgradeEffect.
 *
 * @param data - Unknown data to validate
 * @returns True if data is a valid UpgradeEffect
 */
function isValidUpgradeEffect(data: unknown): data is UpgradeEffect {
	if (!data || typeof data !== 'object') return false;

	const effect = data as Partial<UpgradeEffect>;

	const validTypes = [
		'multiplier',
		'additive',
		'unlock',
		'passive',
		'click',
		'cost_reduction',
		'starting_bonus',
		'speed'
	];

	return (
		typeof effect.type === 'string' &&
		validTypes.includes(effect.type) &&
		typeof effect.target === 'string' &&
		typeof effect.description === 'string'
	);
}

/**
 * Type guard for AchievementDefinition.
 * Validates that an unknown object conforms to the AchievementDefinition interface.
 *
 * @param data - Unknown data to validate
 * @returns True if data is a valid AchievementDefinition
 */
export function isValidAchievementDefinition(data: unknown): data is AchievementDefinition {
	if (!data || typeof data !== 'object') return false;

	const achievement = data as Partial<AchievementDefinition>;

	return (
		typeof achievement.id === 'string' &&
		achievement.id.length > 0 &&
		['standard', 'secret', 'ending'].includes(achievement.type || '') &&
		['common', 'uncommon', 'rare', 'epic', 'legendary', 'secret'].includes(
			achievement.tier || ''
		) &&
		typeof achievement.name === 'string' &&
		achievement.name.length > 0 &&
		typeof achievement.description === 'string' &&
		isValidCondition(achievement.condition) &&
		isValidAchievementReward(achievement.reward) &&
		typeof achievement.hidden === 'boolean'
	);
}

/**
 * Type guard for AchievementReward.
 *
 * @param data - Unknown data to validate
 * @returns True if data is a valid AchievementReward
 */
function isValidAchievementReward(data: unknown): data is AchievementReward {
	if (!data || typeof data !== 'object') return false;

	const reward = data as Partial<AchievementReward>;

	// At least one reward type must be present
	const hasReward =
		(reward.pp !== undefined && typeof reward.pp === 'number') ||
		(reward.unlock !== undefined && typeof reward.unlock === 'string') ||
		(reward.cosmetic !== undefined && typeof reward.cosmetic === 'string') ||
		(reward.title !== undefined && typeof reward.title === 'string') ||
		(reward.badge !== undefined && typeof reward.badge === 'string');

	return hasReward;
}

/**
 * Type guard for ResourceDefinition.
 * Validates that an unknown object conforms to the ResourceDefinition interface.
 *
 * @param data - Unknown data to validate
 * @returns True if data is a valid ResourceDefinition
 */
export function isValidResourceDefinition(data: unknown): data is ResourceDefinition {
	if (!data || typeof data !== 'object') return false;

	const resource = data as Partial<ResourceDefinition>;

	return (
		typeof resource.id === 'string' &&
		resource.id.length > 0 &&
		typeof resource.name === 'string' &&
		resource.name.length > 0 &&
		typeof resource.description === 'string' &&
		['run', 'phase', 'eternal'].includes(resource.category || '') &&
		typeof resource.icon === 'string' &&
		typeof resource.color === 'string' &&
		typeof resource.hidden === 'boolean' &&
		typeof resource.minPhase === 'number' &&
		resource.minPhase >= 0 &&
		typeof resource.canProduce === 'boolean' &&
		typeof resource.canClick === 'boolean' &&
		typeof resource.baseClickAmount === 'number' &&
		typeof resource.displayOrder === 'number'
	);
}

/**
 * Type guard for Dialogue.
 * Validates that an unknown object conforms to the Dialogue interface.
 *
 * @param data - Unknown data to validate
 * @returns True if data is a valid Dialogue
 */
export function isValidDialogueDefinition(data: unknown): data is Dialogue {
	if (!data || typeof data !== 'object') return false;

	const dialogue = data as Partial<Dialogue>;

	const validSpeakers = [
		'pixel',
		'sun',
		'andromeda',
		'void',
		'old_woman',
		'city_ai',
		'president',
		'narrator',
		'unknown'
	];

	return (
		typeof dialogue.id === 'string' &&
		dialogue.id.length > 0 &&
		typeof dialogue.speaker === 'string' &&
		validSpeakers.includes(dialogue.speaker) &&
		Array.isArray(dialogue.lines) &&
		dialogue.lines.length > 0 &&
		dialogue.lines.every(isValidDialogueLine) &&
		(dialogue.choices === undefined || Array.isArray(dialogue.choices)) &&
		typeof dialogue.pausesGame === 'boolean' &&
		typeof dialogue.isEmotionalMoment === 'boolean' &&
		typeof dialogue.canSkipLines === 'boolean'
	);
}

/**
 * Type guard for DialogueLine.
 *
 * @param data - Unknown data to validate
 * @returns True if data is a valid DialogueLine
 */
function isValidDialogueLine(data: unknown): data is DialogueLine {
	if (!data || typeof data !== 'object') return false;

	const line = data as Partial<DialogueLine>;

	return (
		typeof line.text === 'string' &&
		line.text.length > 0 &&
		typeof line.delay === 'number' &&
		line.delay >= 0
	);
}

/**
 * Type guard for Condition.
 * Validates that an unknown object conforms to a Condition type.
 *
 * @param data - Unknown data to validate
 * @returns True if data is a valid Condition
 */
export function isValidCondition(data: unknown): data is Condition {
	if (!data || typeof data !== 'object') return false;

	const condition = data as Partial<Condition>;

	const validTypes = [
		'resource',
		'time',
		'choice',
		'phase',
		'producer',
		'upgrade',
		'achievement',
		'and',
		'or',
		'not',
		'always',
		'never'
	];

	if (!condition.type || !validTypes.includes(condition.type)) {
		return false;
	}

	// Type-specific validation
	switch (condition.type) {
		case 'resource':
			return (
				typeof (condition as any).resourceId === 'string' &&
				((condition as any).amount !== undefined)
			);
		case 'time':
			return typeof (condition as any).minSeconds === 'number';
		case 'choice':
			return (
				typeof (condition as any).choiceId === 'string' &&
				(condition as any).value !== undefined
			);
		case 'phase':
			return typeof (condition as any).phase === 'number';
		case 'producer':
			return (
				typeof (condition as any).producerId === 'string' &&
				typeof (condition as any).amount === 'number'
			);
		case 'upgrade':
			return typeof (condition as any).upgradeId === 'string';
		case 'achievement':
			return typeof (condition as any).achievementId === 'string';
		case 'and':
		case 'or':
			return (
				Array.isArray((condition as any).conditions) &&
				(condition as any).conditions.every(isValidCondition)
			);
		case 'not':
			return isValidCondition((condition as any).condition);
		case 'always':
		case 'never':
			return true;
		default:
			return false;
	}
}

/**
 * Type guard for EndingDefinition.
 * Since Ending type uses EndingId, we validate the basic structure.
 *
 * @param data - Unknown data to validate
 * @returns True if data is a valid ending definition
 */
export function isValidEndingDefinition(data: unknown): data is {
	id: string;
	name: string;
	description: string;
	requirements: StoryCondition[];
	path: string;
} {
	if (!data || typeof data !== 'object') return false;

	const ending = data as any;

	return (
		typeof ending.id === 'string' &&
		ending.id.length > 0 &&
		typeof ending.name === 'string' &&
		ending.name.length > 0 &&
		typeof ending.description === 'string' &&
		Array.isArray(ending.requirements) &&
		typeof ending.path === 'string'
	);
}

/**
 * Type guard for SecretDefinition.
 * Validates secret upgrade or achievement definitions.
 *
 * @param data - Unknown data to validate
 * @returns True if data is a valid secret definition
 */
export function isValidSecretDefinition(data: unknown): data is {
	id: string;
	hidden: boolean;
	unlockConditions?: unknown[];
} {
	if (!data || typeof data !== 'object') return false;

	const secret = data as any;

	return (
		typeof secret.id === 'string' &&
		secret.id.length > 0 &&
		typeof secret.hidden === 'boolean' &&
		secret.hidden === true
	);
}

// ============================================================================
// ID Uniqueness Validators
// ============================================================================

/**
 * Check for duplicate IDs in a collection.
 *
 * @param items - Array of items with id properties
 * @param name - Descriptive name for the collection (for error messages)
 * @returns Array of validation errors for duplicate IDs
 */
export function checkUniqueIds(
	items: { id: string | number }[],
	name: string
): ValidationError[] {
	const errors: ValidationError[] = [];
	const seen = new Map<string | number, number>();

	items.forEach((item, index) => {
		const id = item.id;
		if (seen.has(id)) {
			errors.push({
				path: `${name}[${index}].id`,
				message: `Duplicate ID "${id}" found in ${name}. First occurrence at index ${seen.get(id)}`,
				value: id,
				severity: 'critical'
			});
		} else {
			seen.set(id, index);
		}
	});

	return errors;
}

// ============================================================================
// Content Integrity Validators
// ============================================================================

/**
 * Validate all phase references and internal consistency.
 *
 * @returns Validation result with errors and warnings
 */
export function validatePhaseReferences(): ValidationResult {
	const errors: ValidationError[] = [];
	const warnings: ValidationWarning[] = [];

	// Check for duplicate phase IDs
	errors.push(...checkUniqueIds(Object.values(PHASE_DEFINITIONS), 'phases'));

	// Validate each phase
	Object.values(PHASE_DEFINITIONS).forEach((phase: PhaseDefinition) => {
		const phaseId = phase.id;
		const basePath = `phases.${phaseId}`;

		// Validate phase definition structure
		if (!isValidPhaseDefinition(phase)) {
			errors.push({
				path: basePath,
				message: `Phase ${phaseId} has invalid structure`,
				severity: 'critical'
			});
			return; // Skip further validation for this phase
		}

		// Validate resource references
		phase.availableResources.forEach((resourceId, idx) => {
			if (!RESOURCE_DEFINITIONS[resourceId]) {
				errors.push({
					path: `${basePath}.availableResources[${idx}]`,
					message: `Unknown resource ID: "${resourceId}"`,
					value: resourceId
				});
			}
		});

		// Validate upgrade references
		phase.availableUpgrades.forEach((upgradeId, idx) => {
			if (!UPGRADE_MAP.has(upgradeId)) {
				errors.push({
					path: `${basePath}.availableUpgrades[${idx}]`,
					message: `Unknown upgrade ID: "${upgradeId}"`,
					value: upgradeId
				});
			}
		});

		// Validate visual mode matches phase range
		if (phase.id <= 10 && phase.visualMode !== 'pixel') {
			warnings.push({
				path: `${basePath}.visualMode`,
				message: `Phase ${phase.id} should use 'pixel' mode (phases 1-10)`,
				value: phase.visualMode
			});
		} else if (phase.id > 10 && phase.visualMode !== 'abstract') {
			warnings.push({
				path: `${basePath}.visualMode`,
				message: `Phase ${phase.id} should use 'abstract' mode (phases 11-20)`,
				value: phase.visualMode
			});
		}

		// Validate grid config for pixel mode
		if (phase.visualMode === 'pixel' && !phase.gridConfig) {
			warnings.push({
				path: `${basePath}.gridConfig`,
				message: `Pixel mode phase ${phase.id} is missing grid configuration`
			});
		}

		// Validate unlock conditions
		phase.unlockConditions.forEach((condition, idx) => {
			if (!isValidCondition(condition)) {
				errors.push({
					path: `${basePath}.unlockConditions[${idx}]`,
					message: `Invalid unlock condition`,
					value: condition
				});
			}
		});

		// Validate transition conditions
		phase.transitionConditions.forEach((condition, idx) => {
			if (!isValidCondition(condition)) {
				errors.push({
					path: `${basePath}.transitionConditions[${idx}]`,
					message: `Invalid transition condition`,
					value: condition
				});
			}
		});
	});

	return {
		valid: errors.length === 0,
		errors,
		warnings,
		timestamp: Date.now()
	};
}

/**
 * Validate upgrade references and dependencies.
 *
 * @returns Validation result with errors and warnings
 */
export function validateUpgradeReferences(): ValidationResult {
	const errors: ValidationError[] = [];
	const warnings: ValidationWarning[] = [];

	// Check for duplicate upgrade IDs
	errors.push(...checkUniqueIds(ALL_UPGRADES, 'upgrades'));

	// Validate each upgrade
	ALL_UPGRADES.forEach((upgrade: UpgradeDefinition) => {
		const upgradeId = upgrade.id;
		const basePath = `upgrades.${upgradeId}`;

		// Validate upgrade definition structure
		if (!isValidUpgradeDefinition(upgrade)) {
			errors.push({
				path: basePath,
				message: `Upgrade "${upgradeId}" has invalid structure`,
				severity: 'critical'
			});
			return;
		}

		// Validate dependencies (requires field)
		upgrade.requires?.forEach((requiredId, idx) => {
			if (!UPGRADE_MAP.has(requiredId)) {
				errors.push({
					path: `${basePath}.requires[${idx}]`,
					message: `Unknown required upgrade ID: "${requiredId}"`,
					value: requiredId
				});
			}
		});

		// Validate unlock conditions
		upgrade.unlockConditions?.forEach((condition, idx) => {
			const condPath = `${basePath}.unlockConditions[${idx}]`;

			if (condition.type === 'upgrade' && condition.id) {
				if (!UPGRADE_MAP.has(condition.id)) {
					errors.push({
						path: `${condPath}.id`,
						message: `Unknown upgrade ID in condition: "${condition.id}"`,
						value: condition.id
					});
				}
			}

			if (condition.type === 'achievement' && condition.id) {
				if (!ACHIEVEMENT_DEFINITIONS.has(condition.id)) {
					errors.push({
						path: `${condPath}.id`,
						message: `Unknown achievement ID in condition: "${condition.id}"`,
						value: condition.id
					});
				}
			}
		});

		// Validate path for eternal upgrades
		if (upgrade.category === 'eternal') {
			if (!upgrade.path || !['consumer', 'creator', 'observer'].includes(upgrade.path)) {
				warnings.push({
					path: `${basePath}.path`,
					message: `Eternal upgrade "${upgrade.id}" should have a valid path`,
					value: upgrade.path
				});
			}
		}

		// Warn about circular dependencies
		if (upgrade.requires) {
			const checkCircular = (id: string, visited = new Set<string>()): boolean => {
				if (visited.has(id)) return true;
				visited.add(id);

				const dep = UPGRADE_MAP.get(id);
				if (dep?.requires) {
					return dep.requires.some((reqId) => checkCircular(reqId, new Set(visited)));
				}
				return false;
			};

			if (checkCircular(upgrade.id)) {
				errors.push({
					path: `${basePath}.requires`,
					message: `Circular dependency detected for upgrade "${upgrade.id}"`,
					severity: 'critical'
				});
			}
		}
	});

	return {
		valid: errors.length === 0,
		errors,
		warnings,
		timestamp: Date.now()
	};
}

/**
 * Validate achievement conditions and references.
 *
 * @returns Validation result with errors and warnings
 */
export function validateAchievementConditions(): ValidationResult {
	const errors: ValidationError[] = [];
	const warnings: ValidationWarning[] = [];

	// Check for duplicate achievement IDs
	errors.push(...checkUniqueIds(ALL_ACHIEVEMENTS, 'achievements'));

	// Validate each achievement
	ALL_ACHIEVEMENTS.forEach((achievement: AchievementDefinition) => {
		const achievementId = achievement.id;
		const basePath = `achievements.${achievementId}`;

		// Validate achievement definition structure
		if (!isValidAchievementDefinition(achievement)) {
			errors.push({
				path: basePath,
				message: `Achievement "${achievementId}" has invalid structure`,
				severity: 'critical'
			});
			return;
		}

		// Validate condition references
		const validateConditionRefs = (condition: Condition, condPath: string) => {
			if (condition.type === 'resource') {
				const resourceId = (condition as any).resourceId;
				if (!RESOURCE_DEFINITIONS[resourceId]) {
					errors.push({
						path: `${condPath}.resourceId`,
						message: `Unknown resource ID: "${resourceId}"`,
						value: resourceId
					});
				}
			} else if (condition.type === 'upgrade') {
				const upgradeId = (condition as any).upgradeId;
				if (!UPGRADE_MAP.has(upgradeId)) {
					errors.push({
						path: `${condPath}.upgradeId`,
						message: `Unknown upgrade ID: "${upgradeId}"`,
						value: upgradeId
					});
				}
			} else if (condition.type === 'achievement') {
				const achievementId = (condition as any).achievementId;
				if (!ACHIEVEMENT_DEFINITIONS.has(achievementId)) {
					errors.push({
						path: `${condPath}.achievementId`,
						message: `Unknown achievement ID: "${achievementId}"`,
						value: achievementId
					});
				}
			} else if (condition.type === 'and' || condition.type === 'or') {
				(condition as any).conditions?.forEach((subCond: Condition, idx: number) => {
					validateConditionRefs(subCond, `${condPath}.conditions[${idx}]`);
				});
			} else if (condition.type === 'not') {
				validateConditionRefs((condition as any).condition, `${condPath}.condition`);
			}
		};

		validateConditionRefs(achievement.condition, `${basePath}.condition`);

		// Validate prerequisite
		if (achievement.prerequisite && !ACHIEVEMENT_DEFINITIONS.has(achievement.prerequisite)) {
			errors.push({
				path: `${basePath}.prerequisite`,
				message: `Unknown prerequisite achievement ID: "${achievement.prerequisite}"`,
				value: achievement.prerequisite
			});
		}

		// Warn about circular prerequisites
		if (achievement.prerequisite) {
			const checkCircular = (id: string, visited = new Set<string>()): boolean => {
				if (visited.has(id)) return true;
				visited.add(id);

				const prereq = ACHIEVEMENT_DEFINITIONS.get(id);
				if (prereq?.prerequisite) {
					return checkCircular(prereq.prerequisite, new Set(visited));
				}
				return false;
			};

			if (checkCircular(achievement.id)) {
				errors.push({
					path: `${basePath}.prerequisite`,
					message: `Circular prerequisite chain detected for achievement "${achievement.id}"`,
					severity: 'critical'
				});
			}
		}
	});

	return {
		valid: errors.length === 0,
		errors,
		warnings,
		timestamp: Date.now()
	};
}

/**
 * Type guard for LogDefinition.
 *
 * @param data - Data to validate
 * @returns True if valid LogDefinition
 */
function isValidLogDefinition(data: unknown): data is LogDefinition {
	if (!data || typeof data !== 'object') return false;
	const log = data as Partial<LogDefinition>;

	return (
		typeof log.id === 'string' &&
		log.id.length > 0 &&
		typeof log.text === 'string' &&
		log.text.length > 0 &&
		typeof log.category === 'string' &&
		['thought', 'discovery', 'warning', 'revelation', 'memory'].includes(log.category)
	);
}

/**
 * Type guard for StoryEvent.
 *
 * @param data - Data to validate
 * @returns True if valid StoryEvent
 */
function isValidStoryEvent(data: unknown): data is StoryEvent {
	if (!data || typeof data !== 'object') return false;
	const event = data as Partial<StoryEvent>;

	return (
		typeof event.id === 'string' &&
		event.id.length > 0 &&
		typeof event.type === 'string' &&
		['log', 'dialogue', 'choice', 'revelation', 'cutscene'].includes(event.type) &&
		Array.isArray(event.triggers) &&
		typeof event.oneTime === 'boolean' &&
		typeof event.priority === 'number'
	);
}

/**
 * Validate a StoryCondition and its references.
 *
 * @param condition - Story condition to validate
 * @param path - Path for error reporting
 * @param errors - Error array to push to
 * @param warnings - Warning array to push to
 */
function validateStoryCondition(
	condition: StoryCondition,
	path: string,
	errors: ValidationError[],
	warnings: ValidationWarning[]
): void {
	if (!condition || typeof condition !== 'object') {
		errors.push({
			path,
			message: 'Invalid condition structure'
		});
		return;
	}

	switch (condition.type) {
		case 'resource_reached': {
			const params = condition.params as { resourceId?: string };
			if (params?.resourceId && !RESOURCE_DEFINITIONS[params.resourceId]) {
				warnings.push({
					path: `${path}.params.resourceId`,
					message: `Unknown resource ID: "${params.resourceId}"`,
					value: params.resourceId
				});
			}
			break;
		}
		case 'upgrade_purchased': {
			const params = condition.params as { upgradeId?: string };
			if (params?.upgradeId && !UPGRADE_MAP.has(params.upgradeId)) {
				warnings.push({
					path: `${path}.params.upgradeId`,
					message: `Unknown upgrade ID: "${params.upgradeId}"`,
					value: params.upgradeId
				});
			}
			break;
		}
		case 'achievement_unlocked': {
			const params = condition.params as { achievementId?: string };
			if (params?.achievementId && !ACHIEVEMENT_DEFINITIONS.has(params.achievementId)) {
				warnings.push({
					path: `${path}.params.achievementId`,
					message: `Unknown achievement ID: "${params.achievementId}"`,
					value: params.achievementId
				});
			}
			break;
		}
		case 'phase_entered': {
			const params = condition.params as { phase?: number };
			if (typeof params?.phase === 'number' && (params.phase < 1 || params.phase > 20)) {
				errors.push({
					path: `${path}.params.phase`,
					message: `Invalid phase number: ${params.phase} (must be 1-20)`,
					value: params.phase
				});
			}
			break;
		}
	}
}

/**
 * Validate story event references.
 * Validates logs, dialogues, and story events from cached data.
 *
 * @returns Validation result with errors and warnings
 */
export function validateStoryReferences(): ValidationResult {
	const errors: ValidationError[] = [];
	const warnings: ValidationWarning[] = [];

	// Get all cached story data
	const logs = getAllCachedLogs();
	const dialogues = getAllCachedDialogues();
	const events = getAllCachedEvents();

	// Check if any story data is loaded
	if (logs.length === 0 && dialogues.length === 0 && events.length === 0) {
		warnings.push({
			path: 'story',
			message: 'No story data cached - load story phases before validation for comprehensive checks'
		});
		return {
			valid: true,
			errors,
			warnings,
			timestamp: Date.now()
		};
	}

	// Track IDs for uniqueness checks
	const logIds = new Set<string>();
	const dialogueIds = new Set<string>();
	const eventIds = new Set<string>();

	// Validate logs
	logs.forEach((log: LogDefinition, index: number) => {
		const basePath = `story.logs[${index}]`;

		// Validate structure
		if (!isValidLogDefinition(log)) {
			errors.push({
				path: basePath,
				message: `Invalid log definition structure`,
				value: (log as { id?: string }).id
			});
		}

		// Check uniqueness
		if (logIds.has(log.id)) {
			errors.push({
				path: `${basePath}.id`,
				message: `Duplicate log ID: "${log.id}"`,
				value: log.id
			});
		}
		logIds.add(log.id);

		// Validate phase reference
		if (log.phase !== undefined && (log.phase < 1 || log.phase > 20)) {
			errors.push({
				path: `${basePath}.phase`,
				message: `Invalid phase number: ${log.phase}`,
				value: log.phase
			});
		}
	});

	// Validate dialogues
	dialogues.forEach((dialogue: Dialogue, index: number) => {
		const basePath = `story.dialogues[${index}]`;

		// Check uniqueness
		if (dialogueIds.has(dialogue.id)) {
			errors.push({
				path: `${basePath}.id`,
				message: `Duplicate dialogue ID: "${dialogue.id}"`,
				value: dialogue.id
			});
		}
		dialogueIds.add(dialogue.id);

		// Validate speaker
		const validSpeakers = [
			'pixel',
			'sun',
			'andromeda',
			'void',
			'old_woman',
			'city_ai',
			'president',
			'narrator',
			'unknown'
		];
		if (!validSpeakers.includes(dialogue.speaker)) {
			warnings.push({
				path: `${basePath}.speaker`,
				message: `Unknown speaker: "${dialogue.speaker}"`,
				value: dialogue.speaker
			});
		}

		// Validate lines exist
		if (!Array.isArray(dialogue.lines) || dialogue.lines.length === 0) {
			errors.push({
				path: `${basePath}.lines`,
				message: `Dialogue "${dialogue.id}" has no lines`
			});
		}

		// Validate choices if present
		if (dialogue.choices) {
			dialogue.choices.forEach((choice, choiceIdx) => {
				const choicePath = `${basePath}.choices[${choiceIdx}]`;

				if (!choice.id || typeof choice.id !== 'string') {
					errors.push({
						path: `${choicePath}.id`,
						message: `Choice missing valid ID`
					});
				}

				if (!choice.label || typeof choice.label !== 'string') {
					errors.push({
						path: `${choicePath}.label`,
						message: `Choice "${choice.id}" missing label`
					});
				}

				// Validate consequences
				if (choice.consequences) {
					choice.consequences.forEach((consequence, consIdx) => {
						const consPath = `${choicePath}.consequences[${consIdx}]`;
						validateConsequence(consequence, consPath, errors, warnings);
					});
				}
			});
		}
	});

	// Validate story events
	events.forEach((event: StoryEvent, index: number) => {
		const basePath = `story.events[${index}]`;

		// Validate structure
		if (!isValidStoryEvent(event)) {
			errors.push({
				path: basePath,
				message: `Invalid story event structure`,
				value: (event as { id?: string }).id
			});
		}

		// Check uniqueness
		if (eventIds.has(event.id)) {
			errors.push({
				path: `${basePath}.id`,
				message: `Duplicate event ID: "${event.id}"`,
				value: event.id
			});
		}
		eventIds.add(event.id);

		// Validate content reference
		if (event.type === 'log' && event.contentId) {
			if (!logIds.has(event.contentId)) {
				warnings.push({
					path: `${basePath}.contentId`,
					message: `Event references unknown log: "${event.contentId}"`,
					value: event.contentId
				});
			}
		} else if (event.type === 'dialogue' && event.contentId) {
			if (!dialogueIds.has(event.contentId)) {
				warnings.push({
					path: `${basePath}.contentId`,
					message: `Event references unknown dialogue: "${event.contentId}"`,
					value: event.contentId
				});
			}
		}

		// Validate triggers
		if (event.triggers) {
			event.triggers.forEach((trigger, triggerIdx) => {
				validateStoryCondition(
					trigger,
					`${basePath}.triggers[${triggerIdx}]`,
					errors,
					warnings
				);
			});
		}

		// Validate phase reference
		if (event.phase !== undefined && (event.phase < 1 || event.phase > 20)) {
			errors.push({
				path: `${basePath}.phase`,
				message: `Invalid phase number: ${event.phase}`,
				value: event.phase
			});
		}

		// Check for contradictory flags
		if (event.oneTime === true && event.repeatable === true) {
			warnings.push({
				path: basePath,
				message: `Event "${event.id}" has both oneTime and repeatable set to true`,
				value: { oneTime: event.oneTime, repeatable: event.repeatable }
			});
		}
	});

	return {
		valid: errors.length === 0,
		errors,
		warnings,
		timestamp: Date.now(),
		stats: {
			totalChecks: logs.length + dialogues.length + events.length,
			passedChecks:
				logs.length +
				dialogues.length +
				events.length -
				errors.length,
			failedChecks: errors.length,
			warningCount: warnings.length
		}
	};
}

/**
 * Validate a consequence definition.
 *
 * @param consequence - Consequence to validate
 * @param path - Path for error reporting
 * @param errors - Error array to push to
 * @param warnings - Warning array to push to
 */
function validateConsequence(
	consequence: Consequence,
	path: string,
	errors: ValidationError[],
	warnings: ValidationWarning[]
): void {
	if (!consequence || typeof consequence !== 'object') {
		errors.push({
			path,
			message: 'Invalid consequence structure'
		});
		return;
	}

	const validTypes = [
		'resource_add',
		'resource_multiply',
		'flag_set',
		'ending_unlock',
		'phase_skip',
		'achievement_unlock',
		'multiplier_add',
		'log_add',
		'dialogue_trigger',
		'upgrade_unlock',
		'producer_unlock'
	];

	if (!validTypes.includes(consequence.type)) {
		warnings.push({
			path: `${path}.type`,
			message: `Unknown consequence type: "${consequence.type}"`,
			value: consequence.type
		});
	}

	// Validate specific consequence types
	const payload = consequence.payload as unknown as Record<string, unknown>;
	switch (consequence.type) {
		case 'resource_add':
		case 'resource_multiply': {
			const resourceId = payload?.resourceId as string;
			if (resourceId && !RESOURCE_DEFINITIONS[resourceId]) {
				warnings.push({
					path: `${path}.payload.resourceId`,
					message: `Unknown resource ID: "${resourceId}"`,
					value: resourceId
				});
			}
			break;
		}
		case 'upgrade_unlock': {
			const upgradeId = payload?.upgradeId as string;
			if (upgradeId && !UPGRADE_MAP.has(upgradeId)) {
				warnings.push({
					path: `${path}.payload.upgradeId`,
					message: `Unknown upgrade ID: "${upgradeId}"`,
					value: upgradeId
				});
			}
			break;
		}
		case 'achievement_unlock': {
			const achievementId = payload?.achievementId as string;
			if (achievementId && !ACHIEVEMENT_DEFINITIONS.has(achievementId)) {
				warnings.push({
					path: `${path}.payload.achievementId`,
					message: `Unknown achievement ID: "${achievementId}"`,
					value: achievementId
				});
			}
			break;
		}
	}
}

/**
 * Validate all game data.
 * Runs all validation checks and aggregates results.
 *
 * @returns Comprehensive validation result
 */
export function validateAllData(): ValidationResult {
	const results = [
		validatePhaseReferences(),
		validateUpgradeReferences(),
		validateAchievementConditions(),
		validateStoryReferences()
	];

	const aggregated: ValidationResult = {
		valid: results.every((r) => r.valid),
		errors: results.flatMap((r) => r.errors),
		warnings: results.flatMap((r) => r.warnings),
		timestamp: Date.now(),
		stats: {
			totalChecks: results.length,
			passedChecks: results.filter((r) => r.valid).length,
			failedChecks: results.filter((r) => !r.valid).length,
			warningCount: results.reduce((sum, r) => sum + r.warnings.length, 0)
		}
	};

	return aggregated;
}

/**
 * Main validation function for game data.
 * This is the primary entry point for validation.
 * Can be called at build time or during development.
 *
 * @param options - Validation options
 * @returns Validation result with detailed errors and warnings
 *
 * @example
 * ```typescript
 * const result = validateGameData({ verbose: true });
 * if (!result.valid) {
 *   console.error('Validation failed:', result.errors);
 * }
 * ```
 */
export function validateGameData(options?: {
	/** Whether to include warnings in output */
	includeWarnings?: boolean;
	/** Whether to log results to console */
	verbose?: boolean;
}): ValidationResult {
	const result = validateAllData();

	if (options?.verbose) {
		console.group('Game Data Validation Results');
		console.log(`Status: ${result.valid ? '✓ PASSED' : '✗ FAILED'}`);
		console.log(`Timestamp: ${new Date(result.timestamp || 0).toISOString()}`);

		if (result.stats) {
			console.group('Statistics');
			console.log(`Total Checks: ${result.stats.totalChecks}`);
			console.log(`Passed: ${result.stats.passedChecks}`);
			console.log(`Failed: ${result.stats.failedChecks}`);
			console.log(`Warnings: ${result.stats.warningCount}`);
			console.groupEnd();
		}

		if (result.errors.length > 0) {
			console.group(`Errors (${result.errors.length})`);
			result.errors.forEach((error) => {
				console.error(`[${error.severity || 'error'}] ${error.path}: ${error.message}`);
				if (error.value !== undefined) {
					console.log('  Value:', error.value);
				}
			});
			console.groupEnd();
		}

		if (options.includeWarnings && result.warnings.length > 0) {
			console.group(`Warnings (${result.warnings.length})`);
			result.warnings.forEach((warning) => {
				console.warn(`${warning.path}: ${warning.message}`);
				if (warning.value !== undefined) {
					console.log('  Value:', warning.value);
				}
			});
			console.groupEnd();
		}

		console.groupEnd();
	}

	return result;
}
