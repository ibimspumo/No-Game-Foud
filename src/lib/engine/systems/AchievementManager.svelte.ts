/**
 * @fileoverview Achievement Manager - tracks and awards achievements.
 * Manages achievement unlocks, progress tracking, and reward distribution.
 *
 * The achievement system provides meta-progression and long-term goals.
 * Achievements are persistent across rebirths and reward players with
 * Primordial Pixels (PP) and other unlocks.
 *
 * Key responsibilities:
 * - Track achievement unlock conditions
 * - Award rewards when achievements are unlocked
 * - Manage notification queue for UI
 * - Track progress for progressive achievements
 * - Handle achievement chains (prerequisites)
 *
 * @module engine/systems/AchievementManager
 */

import type { EventManager } from '../core/EventManager';
import type { Manager } from '../models/types';
import type { Decimal } from '../utils/decimal';
import type { Condition } from '../models/phase';
import {
	type AchievementDefinition,
	type AchievementState,
	type AchievementReward,
	type AchievementType,
	type AchievementTier,
	type SerializedAchievements,
	createDefaultAchievementState
} from '../models/achievements';
import {
	ACHIEVEMENT_DEFINITIONS,
	getAchievementDefinition,
	calculateAchievementStats
} from '../data/achievements';
import { ConditionEvaluator, type EvaluationContext } from './ConditionEvaluator';
import { D, ZERO } from '../utils/decimal';

// ============================================================================
// Configuration Constants
// ============================================================================

/** Interval between achievement checks in milliseconds */
const ACHIEVEMENT_CHECK_INTERVAL = 2000; // 2 seconds

/** Maximum notifications to queue at once */
const MAX_NOTIFICATION_QUEUE = 10;

/** Batch notification threshold - if more than this, show summary */
const BATCH_NOTIFICATION_THRESHOLD = 3;

// ============================================================================
// Context Interface
// ============================================================================

/**
 * Context interface for evaluating achievement conditions.
 * Allows AchievementManager to query game state without direct coupling.
 */
export interface AchievementContext {
	/** Get current amount of a resource */
	getResourceAmount: (resourceId: string) => Decimal;

	/** Get current phase number */
	getCurrentPhase: () => number;

	/** Check if a phase has been completed */
	isPhaseCompleted: (phaseNumber: number) => boolean;

	/** Get total run time in seconds */
	getRunTime: () => number;

	/** Get total play time across all runs in seconds */
	getTotalPlayTime: () => number;

	/** Get time spent in current phase in seconds */
	getCurrentPhaseTime: () => number;

	/** Get count of a producer */
	getProducerCount: (producerId: string) => number;

	/** Check if an upgrade is purchased */
	hasUpgrade: (upgradeId: string) => boolean;

	/** Get upgrade level */
	getUpgradeLevel: (upgradeId: string) => number;

	/** Get a choice value from narrative */
	getChoiceValue: (choiceId: string) => string | boolean | undefined;

	/** Get total rebirths count */
	getTotalRebirths: () => number;

	/** Get total clicks count */
	getTotalClicks: () => number;

	/** Add primordial pixels (PP) reward */
	addPrimordialPixels: (amount: number) => void;

	/** Apply a feature unlock */
	applyUnlock: (unlockId: string) => void;
}

// ============================================================================
// Notification Types
// ============================================================================

/**
 * Achievement notification for UI display.
 */
export interface AchievementNotification {
	/** Achievement that was unlocked */
	achievement: AchievementDefinition;

	/** Timestamp when unlocked */
	timestamp: number;

	/** Whether notification has been shown */
	shown: boolean;

	/** Whether this is a batch notification */
	isBatch?: boolean;

	/** Number of achievements in batch (if applicable) */
	batchCount?: number;
}

// ============================================================================
// AchievementManager Class
// ============================================================================

/**
 * Achievement Manager - tracks and awards achievements.
 *
 * Uses Svelte 5 runes for reactive state management:
 * - $state for mutable state (unlocked achievements, progress, queue)
 * - Derived getters for computed values (stats, completion percentage)
 *
 * @implements Manager
 */
export class AchievementManager implements Manager {
	// ============================================================================
	// Dependencies
	// ============================================================================

	private readonly events: EventManager;
	private context: AchievementContext | null = null;
	private conditionEvaluator: ConditionEvaluator | null = null;

	// ============================================================================
	// Reactive State (Svelte 5 Runes)
	// ============================================================================

	/**
	 * Map of achievement ID to state.
	 */
	private achievementStates = $state<Map<string, AchievementState>>(new Map());

	/**
	 * Queue of pending notifications.
	 */
	notificationQueue = $state<AchievementNotification[]>([]);

	/**
	 * Set of achievements unlocked in the current session (for highlighting).
	 */
	private sessionUnlocks = $state<Set<string>>(new Set());

	/**
	 * Time accumulator for periodic checks (milliseconds).
	 */
	private checkAccumulator = 0;

	/**
	 * Whether the manager is initialized.
	 */
	private initialized = false;

	// ============================================================================
	// Derived State (Getters)
	// ============================================================================

	/**
	 * Set of all unlocked achievement IDs.
	 */
	get unlockedIds(): Set<string> {
		const unlocked = new Set<string>();
		for (const [id, state] of this.achievementStates) {
			if (state.unlocked) {
				unlocked.add(id);
			}
		}
		return unlocked;
	}

	/**
	 * Number of unlocked achievements.
	 */
	get unlockedCount(): number {
		let count = 0;
		for (const state of this.achievementStates.values()) {
			if (state.unlocked) count++;
		}
		return count;
	}

	/**
	 * Total number of achievements.
	 */
	get totalCount(): number {
		return ACHIEVEMENT_DEFINITIONS.size;
	}

	/**
	 * Completion percentage (0-100).
	 */
	get completionPercentage(): number {
		if (this.totalCount === 0) return 0;
		return (this.unlockedCount / this.totalCount) * 100;
	}

	/**
	 * Total PP earned from achievements.
	 */
	get totalPPEarned(): number {
		let total = 0;
		for (const [id, state] of this.achievementStates) {
			if (state.unlocked) {
				const def = getAchievementDefinition(id);
				if (def?.reward.pp) {
					total += def.reward.pp;
				}
			}
		}
		return total;
	}

	/**
	 * Whether there are pending notifications.
	 */
	get hasNotifications(): boolean {
		return this.notificationQueue.some((n) => !n.shown);
	}

	/**
	 * Number of pending notifications.
	 */
	get pendingNotificationCount(): number {
		return this.notificationQueue.filter((n) => !n.shown).length;
	}

	/**
	 * Achievements unlocked this session (for UI highlighting).
	 */
	get newUnlocks(): Set<string> {
		return this.sessionUnlocks;
	}

	// ============================================================================
	// Constructor
	// ============================================================================

	/**
	 * Creates a new AchievementManager.
	 *
	 * @param events - Event manager for publishing achievement events
	 */
	constructor(events: EventManager) {
		this.events = events;
	}

	// ============================================================================
	// Manager Interface Implementation
	// ============================================================================

	/**
	 * Initialize the achievement manager.
	 * Sets up event listeners and initializes achievement states.
	 */
	init(): void {
		if (this.initialized) return;

		// Initialize state for all registered achievements
		for (const [id] of ACHIEVEMENT_DEFINITIONS) {
			if (!this.achievementStates.has(id)) {
				this.achievementStates.set(id, createDefaultAchievementState());
			}
		}

		// Subscribe to events that might trigger achievements
		this.events.on('phase_entered', () => this.checkAchievements());
		this.events.on('resource_changed', () => this.markCheckNeeded());
		this.events.on('upgrade_purchased', () => this.checkAchievements());
		this.events.on('producer_purchased', () => this.checkAchievements());
		this.events.on('choice_made', () => this.checkAchievements());
		this.events.on('rebirth_completed', () => this.checkAchievements());

		this.initialized = true;
	}

	/**
	 * Flag to indicate check is needed (debounce resource changes).
	 */
	private checkNeeded = false;

	/**
	 * Mark that an achievement check is needed.
	 * Used for debouncing frequent events like resource changes.
	 */
	private markCheckNeeded(): void {
		this.checkNeeded = true;
	}

	/**
	 * Update achievement state each tick.
	 * Checks conditions periodically and updates progress.
	 *
	 * @param deltaTime - Time since last tick in seconds
	 */
	tick(deltaTime: number): void {
		// Check periodically
		this.checkAccumulator += deltaTime * 1000;
		if (this.checkAccumulator >= ACHIEVEMENT_CHECK_INTERVAL || this.checkNeeded) {
			this.checkAccumulator = 0;
			this.checkNeeded = false;
			this.checkAchievements();
		}
	}

	/**
	 * Reset achievement-related run state for a new run (rebirth).
	 * Achievements themselves are NOT reset (they're eternal).
	 */
	reset(): void {
		// Achievements persist across rebirths, so we don't reset achievementStates
		// Only reset session tracking
		this.sessionUnlocks = new Set();
		this.checkAccumulator = 0;
		this.checkNeeded = false;
	}

	/**
	 * Serialize achievement state for saving.
	 */
	serialize(): SerializedAchievements {
		const unlocked: string[] = [];
		const unlockedAt: Record<string, number> = {};
		const progress: Record<string, number> = {};

		for (const [id, state] of this.achievementStates) {
			if (state.unlocked) {
				unlocked.push(id);
				if (state.unlockedAt) {
					unlockedAt[id] = state.unlockedAt;
				}
			}
			if (state.progress > 0 && state.progress < 1) {
				progress[id] = state.progress;
			}
		}

		return { unlocked, unlockedAt, progress };
	}

	/**
	 * Deserialize and restore achievement state.
	 */
	deserialize(data: unknown): void {
		const state = data as Partial<SerializedAchievements>;
		if (!state || typeof state !== 'object') return;

		// Restore unlocked achievements
		if (Array.isArray(state.unlocked)) {
			for (const id of state.unlocked) {
				const existing = this.achievementStates.get(id) ?? createDefaultAchievementState();
				existing.unlocked = true;
				existing.notified = true; // Don't re-notify on load
				existing.progress = 1;
				if (state.unlockedAt && state.unlockedAt[id]) {
					existing.unlockedAt = state.unlockedAt[id];
				}
				this.achievementStates.set(id, existing);
			}
		}

		// Restore progress
		if (state.progress && typeof state.progress === 'object') {
			for (const [id, progressValue] of Object.entries(state.progress)) {
				const existing = this.achievementStates.get(id) ?? createDefaultAchievementState();
				if (!existing.unlocked) {
					existing.progress = progressValue;
				}
				this.achievementStates.set(id, existing);
			}
		}
	}

	// ============================================================================
	// Context Management
	// ============================================================================

	/**
	 * Set the context provider for condition evaluation.
	 *
	 * @param context - Context object providing game state queries
	 */
	setContext(context: AchievementContext): void {
		this.context = context;

		// Create condition evaluator with adapted context
		this.conditionEvaluator = new ConditionEvaluator({
			getResourceAmount: context.getResourceAmount,
			getCurrentPhaseTime: context.getCurrentPhaseTime,
			getChoiceValue: context.getChoiceValue,
			getCurrentPhase: context.getCurrentPhase,
			isPhaseCompleted: context.isPhaseCompleted,
			getProducerCount: context.getProducerCount,
			hasUpgrade: context.hasUpgrade,
			getUpgradeLevel: context.getUpgradeLevel,
			hasAchievement: (id) => this.hasAchievement(id)
		});
	}

	// ============================================================================
	// Achievement Checking
	// ============================================================================

	/**
	 * Check all achievement conditions and unlock any that are met.
	 */
	checkAchievements(): void {
		if (!this.context || !this.conditionEvaluator) return;

		const newlyUnlocked: AchievementDefinition[] = [];

		for (const [id, definition] of ACHIEVEMENT_DEFINITIONS) {
			const state = this.achievementStates.get(id) ?? createDefaultAchievementState();

			// Skip already unlocked
			if (state.unlocked) continue;

			// Check prerequisite
			if (definition.prerequisite && !this.hasAchievement(definition.prerequisite)) {
				continue;
			}

			// Evaluate condition
			const result = this.conditionEvaluator.evaluateWithDetails(definition.condition);

			// Update progress
			if (result.progress !== null) {
				state.progress = result.progress;
			}

			// Check if newly unlocked
			if (result.met) {
				state.unlocked = true;
				state.unlockedAt = Date.now();
				state.progress = 1;
				newlyUnlocked.push(definition);
			}

			this.achievementStates.set(id, state);
		}

		// Process newly unlocked achievements
		for (const achievement of newlyUnlocked) {
			this.onAchievementUnlocked(achievement);
		}
	}

	/**
	 * Handle achievement unlock.
	 *
	 * @param achievement - Achievement that was unlocked
	 */
	private onAchievementUnlocked(achievement: AchievementDefinition): void {
		// Mark as session unlock
		this.sessionUnlocks.add(achievement.id);

		// Award rewards
		this.awardRewards(achievement.reward);

		// Queue notification
		this.queueNotification(achievement);

		// Emit event
		this.events.emit('achievement_unlocked', {
			achievementId: achievement.id,
			name: achievement.name,
			description: achievement.description,
			tier: achievement.tier
		});

		// Mark as notified after queuing
		const state = this.achievementStates.get(achievement.id);
		if (state) {
			state.notified = true;
			this.achievementStates.set(achievement.id, state);
		}
	}

	/**
	 * Award rewards for an achievement.
	 *
	 * @param reward - Reward to award
	 */
	private awardRewards(reward: AchievementReward): void {
		if (!this.context) return;

		// Award Primordial Pixels
		if (reward.pp) {
			this.context.addPrimordialPixels(reward.pp);
		}

		// Apply unlocks
		if (reward.unlock) {
			this.context.applyUnlock(reward.unlock);
		}

		// Apply cosmetic unlock
		if (reward.cosmetic) {
			this.context.applyUnlock(`cosmetic:${reward.cosmetic}`);
		}

		// Apply title unlock
		if (reward.title) {
			this.context.applyUnlock(`title:${reward.title}`);
		}

		// Apply badge unlock
		if (reward.badge) {
			this.context.applyUnlock(`badge:${reward.badge}`);
		}
	}

	// ============================================================================
	// Notification System
	// ============================================================================

	/**
	 * Queue a notification for an achievement.
	 *
	 * @param achievement - Achievement to notify
	 */
	private queueNotification(achievement: AchievementDefinition): void {
		// Check if we should batch notifications
		const pendingCount = this.notificationQueue.filter((n) => !n.shown).length;

		if (pendingCount >= BATCH_NOTIFICATION_THRESHOLD) {
			// Convert to batch notification
			const existingBatch = this.notificationQueue.find((n) => n.isBatch && !n.shown);
			if (existingBatch) {
				existingBatch.batchCount = (existingBatch.batchCount ?? 1) + 1;
				return;
			}
		}

		// Add to queue (limit size)
		if (this.notificationQueue.length >= MAX_NOTIFICATION_QUEUE) {
			// Remove oldest shown notification
			const shownIndex = this.notificationQueue.findIndex((n) => n.shown);
			if (shownIndex >= 0) {
				this.notificationQueue.splice(shownIndex, 1);
			}
		}

		this.notificationQueue = [
			...this.notificationQueue,
			{
				achievement,
				timestamp: Date.now(),
				shown: false
			}
		];
	}

	/**
	 * Get the next notification to display.
	 *
	 * @returns Next notification or null if none pending
	 */
	getNextNotification(): AchievementNotification | null {
		return this.notificationQueue.find((n) => !n.shown) ?? null;
	}

	/**
	 * Mark a notification as shown.
	 *
	 * @param timestamp - Timestamp of notification to mark
	 */
	markNotificationShown(timestamp: number): void {
		this.notificationQueue = this.notificationQueue.map((n) =>
			n.timestamp === timestamp ? { ...n, shown: true } : n
		);
	}

	/**
	 * Clear all shown notifications.
	 */
	clearShownNotifications(): void {
		this.notificationQueue = this.notificationQueue.filter((n) => !n.shown);
	}

	/**
	 * Dismiss all pending notifications.
	 */
	dismissAllNotifications(): void {
		this.notificationQueue = this.notificationQueue.map((n) => ({ ...n, shown: true }));
	}

	// ============================================================================
	// Query Methods
	// ============================================================================

	/**
	 * Check if an achievement is unlocked.
	 *
	 * @param achievementId - Achievement ID to check
	 * @returns Whether the achievement is unlocked
	 */
	hasAchievement(achievementId: string): boolean {
		const state = this.achievementStates.get(achievementId);
		return state?.unlocked ?? false;
	}

	/**
	 * Get the state of an achievement.
	 *
	 * @param achievementId - Achievement ID
	 * @returns Achievement state or null if not found
	 */
	getState(achievementId: string): AchievementState | null {
		return this.achievementStates.get(achievementId) ?? null;
	}

	/**
	 * Get the definition of an achievement.
	 *
	 * @param achievementId - Achievement ID
	 * @returns Achievement definition or undefined
	 */
	getDefinition(achievementId: string): AchievementDefinition | undefined {
		return getAchievementDefinition(achievementId);
	}

	/**
	 * Get all achievements with their states.
	 *
	 * @returns Array of [definition, state] tuples
	 */
	getAllAchievements(): Array<[AchievementDefinition, AchievementState]> {
		const result: Array<[AchievementDefinition, AchievementState]> = [];

		for (const [id, definition] of ACHIEVEMENT_DEFINITIONS) {
			const state = this.achievementStates.get(id) ?? createDefaultAchievementState();
			result.push([definition, state]);
		}

		return result;
	}

	/**
	 * Get achievements by type.
	 *
	 * @param type - Achievement type
	 * @returns Array of [definition, state] tuples
	 */
	getAchievementsByType(type: AchievementType): Array<[AchievementDefinition, AchievementState]> {
		return this.getAllAchievements().filter(([def]) => def.type === type);
	}

	/**
	 * Get achievements by tier.
	 *
	 * @param tier - Achievement tier
	 * @returns Array of [definition, state] tuples
	 */
	getAchievementsByTier(tier: AchievementTier): Array<[AchievementDefinition, AchievementState]> {
		return this.getAllAchievements().filter(([def]) => def.tier === tier);
	}

	/**
	 * Get only unlocked achievements.
	 *
	 * @returns Array of [definition, state] tuples for unlocked achievements
	 */
	getUnlockedAchievements(): Array<[AchievementDefinition, AchievementState]> {
		return this.getAllAchievements().filter(([, state]) => state.unlocked);
	}

	/**
	 * Get progress for a specific achievement.
	 *
	 * @param achievementId - Achievement ID
	 * @returns Progress value (0-1) or null if not found
	 */
	getProgress(achievementId: string): number | null {
		const state = this.achievementStates.get(achievementId);
		return state?.progress ?? null;
	}

	/**
	 * Get comprehensive achievement statistics.
	 *
	 * @returns Statistics object
	 */
	getStats() {
		return calculateAchievementStats(this.unlockedIds);
	}

	/**
	 * Check if an achievement was unlocked this session.
	 *
	 * @param achievementId - Achievement ID
	 * @returns Whether it was unlocked this session
	 */
	isNewUnlock(achievementId: string): boolean {
		return this.sessionUnlocks.has(achievementId);
	}

	// ============================================================================
	// Manual Unlock (for testing/special cases)
	// ============================================================================

	/**
	 * Manually unlock an achievement.
	 * Used for testing or special trigger conditions not handled by the evaluator.
	 *
	 * @param achievementId - Achievement ID to unlock
	 * @returns Whether the achievement was newly unlocked
	 */
	manualUnlock(achievementId: string): boolean {
		const definition = getAchievementDefinition(achievementId);
		if (!definition) {
			console.warn(`[AchievementManager] Achievement not found: ${achievementId}`);
			return false;
		}

		const state = this.achievementStates.get(achievementId) ?? createDefaultAchievementState();
		if (state.unlocked) {
			return false; // Already unlocked
		}

		state.unlocked = true;
		state.unlockedAt = Date.now();
		state.progress = 1;
		this.achievementStates.set(achievementId, state);

		this.onAchievementUnlocked(definition);
		return true;
	}

	/**
	 * Manually update progress for an achievement.
	 * Used for achievements with custom progress tracking.
	 *
	 * @param achievementId - Achievement ID
	 * @param progress - Progress value (0-1)
	 */
	setProgress(achievementId: string, progress: number): void {
		const state = this.achievementStates.get(achievementId) ?? createDefaultAchievementState();
		if (state.unlocked) return; // Don't modify unlocked achievements

		state.progress = Math.max(0, Math.min(1, progress));
		this.achievementStates.set(achievementId, state);

		// Check if fully complete
		if (state.progress >= 1) {
			this.checkAchievements();
		}
	}

	// ============================================================================
	// Debug Helpers
	// ============================================================================

	/**
	 * Get debug info about the achievement system.
	 *
	 * @returns Debug information object
	 */
	getDebugInfo(): object {
		return {
			initialized: this.initialized,
			hasContext: this.context !== null,
			totalAchievements: this.totalCount,
			unlockedCount: this.unlockedCount,
			completionPercentage: this.completionPercentage.toFixed(2) + '%',
			totalPPEarned: this.totalPPEarned,
			pendingNotifications: this.pendingNotificationCount,
			sessionUnlocks: Array.from(this.sessionUnlocks),
			checkAccumulator: this.checkAccumulator
		};
	}
}
