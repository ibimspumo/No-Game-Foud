/**
 * @fileoverview Condition evaluation system for the game engine.
 * Evaluates various condition types against current game state.
 *
 * The ConditionEvaluator is a stateless utility that checks whether
 * conditions are met. It's used by PhaseManager, UpgradeManager, and
 * other systems that need conditional logic.
 *
 * @module engine/systems/ConditionEvaluator
 */

import type {
	Condition,
	ResourceCondition,
	TimeCondition,
	ChoiceCondition,
	PhaseCondition,
	ProducerCondition,
	UpgradeCondition,
	AchievementCondition,
	AndCondition,
	OrCondition,
	NotCondition
} from '../models/phase';
import { D, type Decimal } from '../utils/decimal';

// ============================================================================
// Evaluation Context Interface
// ============================================================================

/**
 * Context required to evaluate conditions.
 * This is provided by the Game instance or managers.
 */
export interface EvaluationContext {
	/** Get current amount of a resource */
	getResourceAmount: (resourceId: string) => Decimal;

	/** Get time spent in current phase (seconds) */
	getCurrentPhaseTime: () => number;

	/** Get a story/choice value */
	getChoiceValue: (choiceId: string) => string | boolean | undefined;

	/** Get current phase number */
	getCurrentPhase: () => number;

	/** Check if a phase has been completed */
	isPhaseCompleted: (phaseNumber: number) => boolean;

	/** Get producer owned count */
	getProducerCount: (producerId: string) => number;

	/** Check if an upgrade is purchased */
	hasUpgrade: (upgradeId: string) => boolean;

	/** Get upgrade level */
	getUpgradeLevel: (upgradeId: string) => number;

	/** Check if an achievement is unlocked */
	hasAchievement: (achievementId: string) => boolean;
}

// ============================================================================
// Evaluation Result
// ============================================================================

/**
 * Result of condition evaluation with details.
 */
export interface EvaluationResult {
	/** Whether the condition is met */
	met: boolean;

	/** Progress towards meeting the condition (0-1, null if not applicable) */
	progress: number | null;

	/** Human-readable description of current state */
	description: string;

	/** Child results for composite conditions */
	children?: EvaluationResult[];
}

// ============================================================================
// Condition Evaluator Class
// ============================================================================

/**
 * Evaluates conditions against game state.
 * This is a stateless class - all state comes from the provided context.
 */
export class ConditionEvaluator {
	private context: EvaluationContext;

	/**
	 * Create a new condition evaluator.
	 *
	 * @param context - Evaluation context providing game state access
	 */
	constructor(context: EvaluationContext) {
		this.context = context;
	}

	/**
	 * Update the evaluation context.
	 * Useful when context needs to be refreshed.
	 *
	 * @param context - New evaluation context
	 */
	setContext(context: EvaluationContext): void {
		this.context = context;
	}

	/**
	 * Evaluate a condition and return whether it's met.
	 *
	 * @param condition - Condition to evaluate
	 * @returns Whether the condition is met
	 */
	evaluate(condition: Condition): boolean {
		return this.evaluateWithDetails(condition).met;
	}

	/**
	 * Evaluate a condition with detailed results.
	 *
	 * @param condition - Condition to evaluate
	 * @returns Detailed evaluation result
	 */
	evaluateWithDetails(condition: Condition): EvaluationResult {
		switch (condition.type) {
			case 'resource':
				return this.evaluateResource(condition);
			case 'time':
				return this.evaluateTime(condition);
			case 'choice':
				return this.evaluateChoice(condition);
			case 'phase':
				return this.evaluatePhase(condition);
			case 'producer':
				return this.evaluateProducer(condition);
			case 'upgrade':
				return this.evaluateUpgrade(condition);
			case 'achievement':
				return this.evaluateAchievement(condition);
			case 'and':
				return this.evaluateAnd(condition);
			case 'or':
				return this.evaluateOr(condition);
			case 'not':
				return this.evaluateNot(condition);
			case 'always':
				return { met: true, progress: 1, description: 'Always true' };
			case 'never':
				return { met: false, progress: 0, description: 'Never true' };
			default:
				// Type guard for exhaustiveness
				const _exhaustive: never = condition;
				console.warn(`[ConditionEvaluator] Unknown condition type: ${(_exhaustive as Condition).type}`);
				return { met: false, progress: 0, description: 'Unknown condition' };
		}
	}

	/**
	 * Evaluate multiple conditions and return overall progress (0-1).
	 * Useful for progress bars towards phase transitions.
	 *
	 * @param conditions - Array of conditions
	 * @returns Average progress towards meeting all conditions
	 */
	evaluateProgress(conditions: Condition[]): number {
		if (conditions.length === 0) return 1;

		let totalProgress = 0;
		for (const condition of conditions) {
			const result = this.evaluateWithDetails(condition);
			totalProgress += result.progress ?? (result.met ? 1 : 0);
		}

		return totalProgress / conditions.length;
	}

	/**
	 * Check if all conditions in an array are met.
	 *
	 * @param conditions - Array of conditions
	 * @returns Whether all conditions are met
	 */
	evaluateAll(conditions: Condition[]): boolean {
		return conditions.every((c) => this.evaluate(c));
	}

	/**
	 * Check if any condition in an array is met.
	 *
	 * @param conditions - Array of conditions
	 * @returns Whether at least one condition is met
	 */
	evaluateAny(conditions: Condition[]): boolean {
		return conditions.some((c) => this.evaluate(c));
	}

	// ========================================================================
	// Individual Condition Evaluators
	// ========================================================================

	/**
	 * Evaluate a resource condition.
	 */
	private evaluateResource(condition: ResourceCondition): EvaluationResult {
		const current = this.context.getResourceAmount(condition.resourceId);
		const required = D(condition.amount);
		const operator = condition.operator ?? 'gte';

		let met = false;
		switch (operator) {
			case 'eq':
				met = current.eq(required);
				break;
			case 'gt':
				met = current.gt(required);
				break;
			case 'gte':
				met = current.gte(required);
				break;
			case 'lt':
				met = current.lt(required);
				break;
			case 'lte':
				met = current.lte(required);
				break;
		}

		// Calculate progress (only meaningful for gte/gt)
		let progress: number | null = null;
		if (operator === 'gte' || operator === 'gt') {
			if (required.lte(0)) {
				progress = 1;
			} else {
				progress = Math.min(1, current.div(required).toNumber());
			}
		}

		const opSymbol = { eq: '=', gt: '>', gte: '≥', lt: '<', lte: '≤' }[operator];
		const description = `${condition.resourceId}: ${current.toString()} ${opSymbol} ${required.toString()}`;

		return { met, progress, description };
	}

	/**
	 * Evaluate a time condition.
	 */
	private evaluateTime(condition: TimeCondition): EvaluationResult {
		const current = this.context.getCurrentPhaseTime();
		const required = condition.minSeconds;
		const met = current >= required;
		const progress = Math.min(1, current / required);

		const formatTime = (s: number) => {
			const mins = Math.floor(s / 60);
			const secs = Math.floor(s % 60);
			return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
		};

		const description = `Time: ${formatTime(current)} / ${formatTime(required)}`;

		return { met, progress, description };
	}

	/**
	 * Evaluate a choice condition.
	 */
	private evaluateChoice(condition: ChoiceCondition): EvaluationResult {
		const value = this.context.getChoiceValue(condition.choiceId);
		const met = value === condition.value;
		const progress = met ? 1 : 0;

		const description = `Choice '${condition.choiceId}': ${value ?? 'not made'} = ${condition.value}`;

		return { met, progress, description };
	}

	/**
	 * Evaluate a phase condition.
	 */
	private evaluatePhase(condition: PhaseCondition): EvaluationResult {
		const current = this.context.getCurrentPhase();
		let met: boolean;

		if (condition.completed) {
			met = this.context.isPhaseCompleted(condition.phase);
		} else {
			met = current >= condition.phase;
		}

		const progress = condition.completed
			? met
				? 1
				: 0
			: Math.min(1, current / condition.phase);

		const suffix = condition.completed ? ' (completed)' : '';
		const description = `Phase: ${current} >= ${condition.phase}${suffix}`;

		return { met, progress, description };
	}

	/**
	 * Evaluate a producer condition.
	 */
	private evaluateProducer(condition: ProducerCondition): EvaluationResult {
		const count = this.context.getProducerCount(condition.producerId);
		const required = condition.amount;
		const met = count >= required;
		const progress = required > 0 ? Math.min(1, count / required) : 1;

		const description = `Producer '${condition.producerId}': ${count} / ${required}`;

		return { met, progress, description };
	}

	/**
	 * Evaluate an upgrade condition.
	 */
	private evaluateUpgrade(condition: UpgradeCondition): EvaluationResult {
		const requiredLevel = condition.level ?? 1;

		if (requiredLevel === 1) {
			// Simple ownership check
			const has = this.context.hasUpgrade(condition.upgradeId);
			const description = `Upgrade '${condition.upgradeId}': ${has ? 'owned' : 'not owned'}`;
			return { met: has, progress: has ? 1 : 0, description };
		}

		// Level check
		const level = this.context.getUpgradeLevel(condition.upgradeId);
		const met = level >= requiredLevel;
		const progress = requiredLevel > 0 ? Math.min(1, level / requiredLevel) : 1;

		const description = `Upgrade '${condition.upgradeId}': level ${level} / ${requiredLevel}`;

		return { met, progress, description };
	}

	/**
	 * Evaluate an achievement condition.
	 */
	private evaluateAchievement(condition: AchievementCondition): EvaluationResult {
		const has = this.context.hasAchievement(condition.achievementId);
		const description = `Achievement '${condition.achievementId}': ${has ? 'unlocked' : 'locked'}`;

		return { met: has, progress: has ? 1 : 0, description };
	}

	/**
	 * Evaluate an AND composite condition.
	 */
	private evaluateAnd(condition: AndCondition): EvaluationResult {
		const children = condition.conditions.map((c) => this.evaluateWithDetails(c));
		const met = children.every((r) => r.met);

		// Average progress of all children
		let totalProgress = 0;
		let progressCount = 0;
		for (const child of children) {
			if (child.progress !== null) {
				totalProgress += child.progress;
				progressCount++;
			} else {
				totalProgress += child.met ? 1 : 0;
				progressCount++;
			}
		}
		const progress = progressCount > 0 ? totalProgress / progressCount : 1;

		const metCount = children.filter((r) => r.met).length;
		const description = `AND: ${metCount}/${children.length} conditions met`;

		return { met, progress, description, children };
	}

	/**
	 * Evaluate an OR composite condition.
	 */
	private evaluateOr(condition: OrCondition): EvaluationResult {
		const children = condition.conditions.map((c) => this.evaluateWithDetails(c));
		const met = children.some((r) => r.met);

		// Max progress of all children
		let maxProgress = 0;
		for (const child of children) {
			const childProgress = child.progress ?? (child.met ? 1 : 0);
			maxProgress = Math.max(maxProgress, childProgress);
		}

		const metCount = children.filter((r) => r.met).length;
		const description = `OR: ${metCount}/${children.length} conditions met`;

		return { met, progress: maxProgress, description, children };
	}

	/**
	 * Evaluate a NOT condition.
	 */
	private evaluateNot(condition: NotCondition): EvaluationResult {
		const inner = this.evaluateWithDetails(condition.condition);
		const met = !inner.met;
		const progress = met ? 1 : 0;

		const description = `NOT: (${inner.description})`;

		return { met, progress, description, children: [inner] };
	}
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a condition evaluator with a given context.
 *
 * @param context - Evaluation context
 * @returns New ConditionEvaluator instance
 */
export function createConditionEvaluator(context: EvaluationContext): ConditionEvaluator {
	return new ConditionEvaluator(context);
}

// ============================================================================
// Condition Builder Helpers
// ============================================================================

/**
 * Helper functions to create conditions with less boilerplate.
 * These are type-safe builders for condition objects.
 */
export const Conditions = {
	/**
	 * Create a resource condition.
	 */
	resource(resourceId: string, amount: number | string, operator: ResourceCondition['operator'] = 'gte'): ResourceCondition {
		return { type: 'resource', resourceId, amount, operator };
	},

	/**
	 * Create a time condition (in seconds).
	 */
	time(minSeconds: number): TimeCondition {
		return { type: 'time', minSeconds };
	},

	/**
	 * Create a time condition (in minutes).
	 */
	timeMinutes(minutes: number): TimeCondition {
		return { type: 'time', minSeconds: minutes * 60 };
	},

	/**
	 * Create a choice condition.
	 */
	choice(choiceId: string, value: string | boolean): ChoiceCondition {
		return { type: 'choice', choiceId, value };
	},

	/**
	 * Create a phase condition.
	 */
	phase(phaseNumber: number, completed = false): PhaseCondition {
		return { type: 'phase', phase: phaseNumber, completed };
	},

	/**
	 * Create a producer condition.
	 */
	producer(producerId: string, amount: number): ProducerCondition {
		return { type: 'producer', producerId, amount };
	},

	/**
	 * Create an upgrade condition.
	 */
	upgrade(upgradeId: string, level = 1): UpgradeCondition {
		return { type: 'upgrade', upgradeId, level };
	},

	/**
	 * Create an achievement condition.
	 */
	achievement(achievementId: string): AchievementCondition {
		return { type: 'achievement', achievementId };
	},

	/**
	 * Create an AND composite condition.
	 */
	and(...conditions: Condition[]): AndCondition {
		return { type: 'and', conditions };
	},

	/**
	 * Create an OR composite condition.
	 */
	or(...conditions: Condition[]): OrCondition {
		return { type: 'or', conditions };
	},

	/**
	 * Create a NOT condition.
	 */
	not(condition: Condition): NotCondition {
		return { type: 'not', condition };
	},

	/**
	 * Create an always true condition.
	 */
	always(): { type: 'always' } {
		return { type: 'always' };
	},

	/**
	 * Create a never true condition.
	 */
	never(): { type: 'never' } {
		return { type: 'never' };
	}
} as const;
