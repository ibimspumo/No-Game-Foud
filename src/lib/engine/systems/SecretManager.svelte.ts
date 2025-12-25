/**
 * @fileoverview Secret Manager - tracks and awards secret discoveries.
 * Manages secret discovery conditions, rewards, and notifications.
 *
 * The secret system provides hidden content that rewards exploration,
 * experimentation, and curiosity. Secrets include easter eggs, hidden
 * mechanics, meta secrets, and glitches.
 *
 * Key responsibilities:
 * - Track discovered secrets
 * - Evaluate discovery conditions (flags, stats, time, phase)
 * - Award rewards when secrets are discovered
 * - Manage notification queue for UI
 * - Track custom stats and flags for secret conditions
 *
 * @example
 * ```typescript
 * const secretManager = new SecretManager(events);
 * secretManager.init();
 * secretManager.setContext(context);
 *
 * // Set a flag to trigger a secret (e.g., Konami code)
 * secretManager.setFlag('konami_code_entered', true);
 *
 * // Increment a stat
 * secretManager.incrementStat('glitches_found', 1);
 *
 * // Check if a secret is discovered
 * if (secretManager.isDiscovered('konami_code')) {
 *   console.log('Konami code secret found!');
 * }
 *
 * // Get hints for undiscovered secrets
 * const hints = secretManager.getUndiscoveredHints();
 * ```
 *
 * @module engine/systems/SecretManager
 */

import type { EventManager } from '../core/EventManager';
import type { Manager } from '../models/types';
import type { Decimal } from '../utils/decimal';
import {
	type SecretDefinition,
	type SecretCondition,
	type SecretReward,
	type SecretType,
	SECRET_DEFINITIONS,
	getSecretDefinition,
	getUndiscoveredHints
} from '../data/secrets';

// ============================================================================
// Configuration Constants
// ============================================================================

/** Interval between secret checks in milliseconds */
const SECRET_CHECK_INTERVAL = 3000; // 3 seconds (less frequent than achievements)

/** Maximum notifications to queue at once */
const MAX_NOTIFICATION_QUEUE = 10;

// ============================================================================
// Serialization Types
// ============================================================================

/**
 * Serialized secret manager state.
 */
export interface SerializedSecrets {
	/** List of discovered secret IDs */
	discovered: string[];

	/** Timestamp when each secret was discovered */
	discoveredAt: Record<string, number>;

	/** Custom flags set for secret conditions */
	flags: Record<string, boolean | string>;

	/** Custom stats tracked for secret conditions */
	stats: Record<string, number>;
}

// ============================================================================
// Context Interface
// ============================================================================

/**
 * Context interface for evaluating secret conditions.
 * Allows SecretManager to query game state without direct coupling.
 */
export interface SecretContext {
	/** Get current amount of a resource */
	getResourceAmount: (resourceId: string) => Decimal;

	/** Get current phase number */
	getCurrentPhase: () => number;

	/** Get total play time across all runs in seconds */
	getTotalPlayTime: () => number;

	/** Get total idle time in seconds */
	getTotalIdleTime: () => number;

	/** Get time since last click in seconds */
	getTimeSinceLastClick: () => number;

	/** Get total clicks count */
	getTotalClicks: () => number;

	/** Get total canvases completed */
	getCanvasesCompleted: () => number;

	/** Get canvas count */
	getCanvasCount: () => number;

	/** Get total upgrades purchased */
	getUpgradesPurchased: () => number;

	/** Get logs read count */
	getLogsRead: () => number;

	/** Get unique choices made count */
	getUniqueChoicesMade: () => number;

	/** Get unique producers owned count */
	getUniqueProducersOwned: () => number;

	/** Add primordial pixels (PP) reward */
	addPrimordialPixels: (amount: number) => void;

	/** Apply a feature unlock */
	applyUnlock: (unlockId: string) => void;

	/** Set a permanent flag */
	setFlag: (flag: string, value: boolean | string) => void;
}

// ============================================================================
// Notification Types
// ============================================================================

/**
 * Secret notification for UI display.
 */
export interface SecretNotification {
	/** Secret that was discovered */
	secret: SecretDefinition;

	/** Timestamp when discovered */
	timestamp: number;

	/** Whether notification has been shown */
	shown: boolean;

	/** Rewards granted */
	rewards: SecretReward;
}

// ============================================================================
// SecretManager Class
// ============================================================================

/**
 * Secret Manager - tracks and awards secret discoveries.
 *
 * Uses Svelte 5 runes for reactive state management:
 * - $state for mutable state (discovered secrets, flags, stats, queue)
 * - Derived getters for computed values (hints, stats)
 *
 * @implements Manager
 */
export class SecretManager implements Manager {
	// ============================================================================
	// Dependencies
	// ============================================================================

	private readonly events: EventManager;
	private context: SecretContext | null = null;

	// ============================================================================
	// Reactive State (Svelte 5 Runes)
	// ============================================================================

	/**
	 * Set of discovered secret IDs.
	 */
	private discoveredSecrets = $state<Set<string>>(new Set());

	/**
	 * Timestamp when each secret was discovered.
	 */
	private discoveredAt = $state<Map<string, number>>(new Map());

	/**
	 * Custom flags for secret conditions.
	 */
	private flags = $state<Map<string, boolean | string>>(new Map());

	/**
	 * Custom stats for secret conditions.
	 */
	private stats = $state<Map<string, number>>(new Map());

	/**
	 * Queue of pending notifications.
	 */
	notificationQueue = $state<SecretNotification[]>([]);

	/**
	 * Set of secrets discovered in the current session (for highlighting).
	 */
	private sessionDiscoveries = $state<Set<string>>(new Set());

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
	 * Number of discovered secrets.
	 */
	get discoveredCount(): number {
		return this.discoveredSecrets.size;
	}

	/**
	 * Total number of secrets.
	 */
	get totalCount(): number {
		return SECRET_DEFINITIONS.length;
	}

	/**
	 * Discovery percentage (0-100).
	 */
	get discoveryPercentage(): number {
		if (this.totalCount === 0) return 0;
		return (this.discoveredCount / this.totalCount) * 100;
	}

	/**
	 * Total PP earned from secrets.
	 */
	get totalPPEarned(): number {
		let total = 0;
		for (const id of this.discoveredSecrets) {
			const def = getSecretDefinition(id);
			if (def?.reward.pp) {
				total += def.reward.pp;
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
	 * Secrets discovered this session (for UI highlighting).
	 */
	get newDiscoveries(): Set<string> {
		return this.sessionDiscoveries;
	}

	// ============================================================================
	// Constructor
	// ============================================================================

	/**
	 * Creates a new SecretManager.
	 *
	 * @param events - Event manager for publishing secret events
	 */
	constructor(events: EventManager) {
		this.events = events;
	}

	// ============================================================================
	// Manager Interface Implementation
	// ============================================================================

	/**
	 * Initialize the secret manager.
	 * Sets up event listeners and initializes state.
	 */
	init(): void {
		if (this.initialized) return;

		// Subscribe to events that might trigger secrets
		this.events.on('phase_entered', () => this.checkSecrets());
		this.events.on('resource_changed', () => this.markCheckNeeded());
		this.events.on('upgrade_purchased', () => this.markCheckNeeded());
		this.events.on('choice_made', () => this.checkSecrets());
		this.events.on('log_added', () => this.markCheckNeeded());

		this.initialized = true;
	}

	/**
	 * Flag to indicate check is needed (debounce frequent events).
	 */
	private checkNeeded = false;

	/**
	 * Mark that a secret check is needed.
	 * Used for debouncing frequent events like resource changes.
	 */
	private markCheckNeeded(): void {
		this.checkNeeded = true;
	}

	/**
	 * Update secret state each tick.
	 * Checks conditions periodically.
	 *
	 * @param deltaTime - Time since last tick in seconds
	 */
	tick(deltaTime: number): void {
		// Check periodically
		this.checkAccumulator += deltaTime * 1000;
		if (this.checkAccumulator >= SECRET_CHECK_INTERVAL || this.checkNeeded) {
			this.checkAccumulator = 0;
			this.checkNeeded = false;
			this.checkSecrets();
		}
	}

	/**
	 * Reset secret-related run state for a new run (rebirth).
	 * Secrets themselves are NOT reset (they're eternal).
	 */
	reset(): void {
		// Secrets persist across rebirths, so we don't reset discoveredSecrets
		// Only reset session tracking
		this.sessionDiscoveries = new Set();
		this.checkAccumulator = 0;
		this.checkNeeded = false;
	}

	/**
	 * Serialize secret state for saving.
	 */
	serialize(): SerializedSecrets {
		const discovered: string[] = Array.from(this.discoveredSecrets);
		const discoveredAt: Record<string, number> = {};
		for (const [id, timestamp] of this.discoveredAt) {
			discoveredAt[id] = timestamp;
		}

		const flags: Record<string, boolean | string> = {};
		for (const [key, value] of this.flags) {
			flags[key] = value;
		}

		const stats: Record<string, number> = {};
		for (const [key, value] of this.stats) {
			stats[key] = value;
		}

		return { discovered, discoveredAt, flags, stats };
	}

	/**
	 * Deserialize and restore secret state.
	 */
	deserialize(data: unknown): void {
		const state = data as Partial<SerializedSecrets>;
		if (!state || typeof state !== 'object') return;

		// Restore discovered secrets
		if (Array.isArray(state.discovered)) {
			this.discoveredSecrets = new Set(state.discovered);
		}

		// Restore timestamps
		if (state.discoveredAt && typeof state.discoveredAt === 'object') {
			this.discoveredAt = new Map(Object.entries(state.discoveredAt));
		}

		// Restore flags
		if (state.flags && typeof state.flags === 'object') {
			this.flags = new Map(Object.entries(state.flags));
		}

		// Restore stats
		if (state.stats && typeof state.stats === 'object') {
			this.stats = new Map(Object.entries(state.stats));
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
	setContext(context: SecretContext): void {
		this.context = context;
	}

	// ============================================================================
	// Secret Checking
	// ============================================================================

	/**
	 * Check all secret conditions and discover any that are met.
	 */
	checkSecrets(): void {
		if (!this.context) return;

		const newlyDiscovered: SecretDefinition[] = [];

		for (const secret of SECRET_DEFINITIONS) {
			// Skip already discovered
			if (this.discoveredSecrets.has(secret.id)) continue;

			// Evaluate condition
			if (this.evaluateCondition(secret.discoveryCondition)) {
				newlyDiscovered.push(secret);
			}
		}

		// Process newly discovered secrets
		for (const secret of newlyDiscovered) {
			this.onSecretDiscovered(secret);
		}
	}

	/**
	 * Evaluate a secret condition.
	 *
	 * @param condition - Condition to evaluate
	 * @returns Whether the condition is met
	 */
	private evaluateCondition(condition: SecretCondition): boolean {
		if (!this.context) return false;

		switch (condition.type) {
			case 'flag':
				return this.evaluateFlagCondition(condition);

			case 'stat':
				return this.evaluateStatCondition(condition);

			case 'phase':
				return this.evaluatePhaseCondition(condition);

			case 'time':
				return this.evaluateTimeCondition(condition);

			case 'and':
				return condition.conditions.every((c) => this.evaluateCondition(c));

			case 'or':
				return condition.conditions.some((c) => this.evaluateCondition(c));

			default:
				console.warn(`[SecretManager] Unknown condition type: ${(condition as any).type}`);
				return false;
		}
	}

	/**
	 * Evaluate a flag condition.
	 */
	private evaluateFlagCondition(condition: { flag: string; value?: boolean | string }): boolean {
		const flagValue = this.flags.get(condition.flag);
		if (flagValue === undefined) return false;

		if (condition.value !== undefined) {
			return flagValue === condition.value;
		}
		return Boolean(flagValue);
	}

	/**
	 * Evaluate a stat condition.
	 */
	private evaluateStatCondition(condition: {
		stat: string;
		operator: '>=' | '<=' | '>' | '<' | '=' | '!=';
		value: number;
	}): boolean {
		if (!this.context) return false;

		// Get stat value - try context methods first, then custom stats
		let statValue: number | null = null;

		switch (condition.stat) {
			case 'totalClicks':
				statValue = this.context.getTotalClicks();
				break;
			case 'totalPlayTime':
				statValue = this.context.getTotalPlayTime();
				break;
			case 'totalIdleTime':
				statValue = this.context.getTotalIdleTime();
				break;
			case 'timeSinceLastClick':
				statValue = this.context.getTimeSinceLastClick();
				break;
			case 'canvasesCompleted':
				statValue = this.context.getCanvasesCompleted();
				break;
			case 'canvasCount':
				statValue = this.context.getCanvasCount();
				break;
			case 'upgradesPurchased':
				statValue = this.context.getUpgradesPurchased();
				break;
			case 'logsRead':
				statValue = this.context.getLogsRead();
				break;
			case 'uniqueChoicesMade':
				statValue = this.context.getUniqueChoicesMade();
				break;
			case 'uniqueProducersOwned':
				statValue = this.context.getUniqueProducersOwned();
				break;
			case 'primordialPixels':
				statValue = Number(this.context.getResourceAmount('primordial_pixels'));
				break;
			default:
				// Try custom stats
				statValue = this.stats.get(condition.stat) ?? null;
		}

		if (statValue === null) return false;

		// Apply operator
		switch (condition.operator) {
			case '>=':
				return statValue >= condition.value;
			case '<=':
				return statValue <= condition.value;
			case '>':
				return statValue > condition.value;
			case '<':
				return statValue < condition.value;
			case '=':
				return statValue === condition.value;
			case '!=':
				return statValue !== condition.value;
			default:
				return false;
		}
	}

	/**
	 * Evaluate a phase condition.
	 */
	private evaluatePhaseCondition(condition: {
		operator: '>=' | '<=' | '>' | '<' | '=' | '!=';
		phase: number;
	}): boolean {
		if (!this.context) return false;

		const currentPhase = this.context.getCurrentPhase();

		switch (condition.operator) {
			case '>=':
				return currentPhase >= condition.phase;
			case '<=':
				return currentPhase <= condition.phase;
			case '>':
				return currentPhase > condition.phase;
			case '<':
				return currentPhase < condition.phase;
			case '=':
				return currentPhase === condition.phase;
			case '!=':
				return currentPhase !== condition.phase;
			default:
				return false;
		}
	}

	/**
	 * Evaluate a time-of-day condition (real-world time).
	 */
	private evaluateTimeCondition(condition: {
		operator: '>=' | '<=' | '>' | '<' | '=';
		hour: number;
	}): boolean {
		const now = new Date();
		const currentHour = now.getHours();

		switch (condition.operator) {
			case '>=':
				return currentHour >= condition.hour;
			case '<=':
				return currentHour <= condition.hour;
			case '>':
				return currentHour > condition.hour;
			case '<':
				return currentHour < condition.hour;
			case '=':
				return currentHour === condition.hour;
			default:
				return false;
		}
	}

	/**
	 * Handle secret discovery.
	 *
	 * @param secret - Secret that was discovered
	 */
	private onSecretDiscovered(secret: SecretDefinition): void {
		// Mark as discovered
		this.discoveredSecrets.add(secret.id);
		this.discoveredAt.set(secret.id, Date.now());
		this.sessionDiscoveries.add(secret.id);

		// Award rewards
		this.awardRewards(secret.reward);

		// Queue notification
		this.queueNotification(secret);

		// Emit event
		this.events.emit('secret_discovered' as any, {
			secretId: secret.id,
			name: secret.name,
			description: secret.description,
			type: secret.type,
			rewards: secret.reward,
			revealText: secret.revealText
		});
	}

	/**
	 * Award rewards for a secret.
	 *
	 * @param reward - Reward to award
	 */
	private awardRewards(reward: SecretReward): void {
		if (!this.context) return;

		// Award Primordial Pixels
		if (reward.pp) {
			this.context.addPrimordialPixels(reward.pp);
		}

		// Apply unlocks
		if (reward.unlock) {
			for (const unlockId of reward.unlock) {
				this.context.applyUnlock(unlockId);
			}
		}

		// Set flag
		if (reward.flag) {
			this.setFlag(reward.flag, true);
		}
	}

	// ============================================================================
	// Notification System
	// ============================================================================

	/**
	 * Queue a notification for a secret.
	 *
	 * @param secret - Secret to notify
	 */
	private queueNotification(secret: SecretDefinition): void {
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
				secret,
				timestamp: Date.now(),
				shown: false,
				rewards: secret.reward
			}
		];
	}

	/**
	 * Get the next notification to display.
	 *
	 * @returns Next notification or null if none pending
	 */
	getNextNotification(): SecretNotification | null {
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
	 * Check if a secret is discovered.
	 *
	 * @param secretId - Secret ID to check
	 * @returns Whether the secret is discovered
	 */
	isDiscovered(secretId: string): boolean {
		return this.discoveredSecrets.has(secretId);
	}

	/**
	 * Get all discovered secrets.
	 *
	 * @returns Array of discovered secret definitions
	 */
	getDiscoveredSecrets(): SecretDefinition[] {
		const discovered: SecretDefinition[] = [];
		for (const id of this.discoveredSecrets) {
			const def = getSecretDefinition(id);
			if (def) discovered.push(def);
		}
		return discovered;
	}

	/**
	 * Get discovered secrets by type.
	 *
	 * @param type - Secret type
	 * @returns Array of discovered secrets of that type
	 */
	getDiscoveredByType(type: SecretType): SecretDefinition[] {
		return this.getDiscoveredSecrets().filter((s) => s.type === type);
	}

	/**
	 * Get hints for undiscovered secrets.
	 *
	 * @returns Map of secret IDs to their hints
	 */
	getUndiscoveredHints(): Map<string, string> {
		return getUndiscoveredHints(this.discoveredSecrets);
	}

	/**
	 * Get timestamp when a secret was discovered.
	 *
	 * @param secretId - Secret ID
	 * @returns Timestamp or null if not discovered
	 */
	getDiscoveryTime(secretId: string): number | null {
		return this.discoveredAt.get(secretId) ?? null;
	}

	/**
	 * Check if a secret was discovered this session.
	 *
	 * @param secretId - Secret ID
	 * @returns Whether it was discovered this session
	 */
	isNewDiscovery(secretId: string): boolean {
		return this.sessionDiscoveries.has(secretId);
	}

	// ============================================================================
	// Flag Management
	// ============================================================================

	/**
	 * Set a flag for secret conditions.
	 *
	 * @param flag - Flag name
	 * @param value - Flag value (boolean or string)
	 */
	setFlag(flag: string, value: boolean | string = true): void {
		this.flags.set(flag, value);

		// Immediately check secrets when a flag is set
		// (flags are often trigger events)
		this.checkSecrets();
	}

	/**
	 * Get a flag value.
	 *
	 * @param flag - Flag name
	 * @returns Flag value or undefined
	 */
	getFlag(flag: string): boolean | string | undefined {
		return this.flags.get(flag);
	}

	/**
	 * Check if a flag is set.
	 *
	 * @param flag - Flag name
	 * @returns Whether the flag is set
	 */
	hasFlag(flag: string): boolean {
		return this.flags.has(flag) && Boolean(this.flags.get(flag));
	}

	// ============================================================================
	// Stat Management
	// ============================================================================

	/**
	 * Set a stat value.
	 *
	 * @param stat - Stat name
	 * @param value - Stat value
	 */
	setStat(stat: string, value: number): void {
		this.stats.set(stat, value);
		this.markCheckNeeded();
	}

	/**
	 * Increment a stat value.
	 *
	 * @param stat - Stat name
	 * @param delta - Amount to increment (default: 1)
	 */
	incrementStat(stat: string, delta: number = 1): void {
		const current = this.stats.get(stat) ?? 0;
		this.stats.set(stat, current + delta);
		this.markCheckNeeded();
	}

	/**
	 * Get a stat value.
	 *
	 * @param stat - Stat name
	 * @returns Stat value or 0 if not set
	 */
	getStat(stat: string): number {
		return this.stats.get(stat) ?? 0;
	}

	// ============================================================================
	// Manual Discovery (for testing/special cases)
	// ============================================================================

	/**
	 * Manually discover a secret.
	 * Used for testing or special trigger conditions not handled by the evaluator.
	 *
	 * @param secretId - Secret ID to discover
	 * @returns Whether the secret was newly discovered
	 */
	discoverSecret(secretId: string): boolean {
		const definition = getSecretDefinition(secretId);
		if (!definition) {
			console.warn(`[SecretManager] Secret not found: ${secretId}`);
			return false;
		}

		if (this.discoveredSecrets.has(secretId)) {
			return false; // Already discovered
		}

		this.onSecretDiscovered(definition);
		return true;
	}

	// ============================================================================
	// Debug Helpers
	// ============================================================================

	/**
	 * Get debug info about the secret system.
	 *
	 * @returns Debug information object
	 */
	getDebugInfo(): object {
		return {
			initialized: this.initialized,
			hasContext: this.context !== null,
			totalSecrets: this.totalCount,
			discoveredCount: this.discoveredCount,
			discoveryPercentage: this.discoveryPercentage.toFixed(2) + '%',
			totalPPEarned: this.totalPPEarned,
			pendingNotifications: this.pendingNotificationCount,
			sessionDiscoveries: Array.from(this.sessionDiscoveries),
			flagsSet: Array.from(this.flags.keys()),
			statsTracked: Array.from(this.stats.keys()),
			checkAccumulator: this.checkAccumulator
		};
	}
}
