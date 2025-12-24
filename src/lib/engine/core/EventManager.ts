/**
 * @fileoverview Event Manager for the game engine.
 * Implements a type-safe Pub/Sub pattern for inter-manager communication.
 *
 * All communication between managers should go through events, ensuring
 * loose coupling and testability. UI components can also subscribe to
 * events for reactive updates.
 *
 * @module engine/core/EventManager
 */

import type {
	GameEventMap,
	GameEventName,
	GameEventData
} from '../models/events';
import type { Unsubscribe } from '../models/types';

/**
 * Callback function type for event listeners.
 * @template T - The event data type
 */
type EventCallback<T> = (data: T) => void;

/**
 * Internal structure for storing listener information.
 */
interface ListenerEntry<T> {
	/** The callback function */
	callback: EventCallback<T>;
	/** Whether this is a one-time listener */
	once: boolean;
	/** Priority for ordering (higher = called first) */
	priority: number;
}

/**
 * Options for subscribing to events.
 */
export interface SubscribeOptions {
	/**
	 * If true, the listener will be removed after being called once.
	 * @default false
	 */
	once?: boolean;

	/**
	 * Priority for listener ordering. Higher priority listeners are called first.
	 * @default 0
	 */
	priority?: number;
}

/**
 * Event Manager implementing the Pub/Sub pattern.
 *
 * Provides type-safe event subscription and publishing, ensuring that
 * event data matches the expected type for each event name.
 *
 * @example
 * ```typescript
 * const events = new EventManager();
 *
 * // Subscribe to an event
 * const unsubscribe = events.on('resource_changed', (data) => {
 *   console.log(`${data.resourceId} changed by ${data.delta}`);
 * });
 *
 * // Publish an event
 * events.emit('resource_changed', {
 *   resourceId: 'pixels',
 *   previousAmount: D(100),
 *   newAmount: D(150),
 *   delta: D(50),
 *   source: 'production'
 * });
 *
 * // Cleanup
 * unsubscribe();
 * ```
 */
export class EventManager {
	/**
	 * Map of event names to their listeners.
	 * Using Map for better performance with frequent operations.
	 */
	private listeners: Map<string, Set<ListenerEntry<unknown>>> = new Map();

	/**
	 * Whether debug logging is enabled.
	 */
	private debug: boolean = false;

	/**
	 * Count of events emitted (for debugging/stats).
	 */
	private eventCount: number = 0;

	/**
	 * Creates a new EventManager instance.
	 *
	 * @param debug - Enable debug logging for all events
	 */
	constructor(debug: boolean = false) {
		this.debug = debug;
	}

	/**
	 * Subscribe to an event.
	 *
	 * @template T - Event name type (keyof GameEventMap)
	 * @param event - The event name to subscribe to
	 * @param callback - Function to call when event is emitted
	 * @param options - Optional configuration for the subscription
	 * @returns Unsubscribe function to remove the listener
	 *
	 * @example
	 * ```typescript
	 * // Basic subscription
	 * const unsub = events.on('phase_entered', (data) => {
	 *   console.log(`Entered phase ${data.newPhase}`);
	 * });
	 *
	 * // One-time subscription
	 * events.on('game_initialized', () => {
	 *   console.log('Game started!');
	 * }, { once: true });
	 *
	 * // High priority listener
	 * events.on('rebirth_started', () => {
	 *   // This runs before normal priority listeners
	 * }, { priority: 10 });
	 * ```
	 */
	on<T extends GameEventName>(
		event: T,
		callback: EventCallback<GameEventData<T>>,
		options: SubscribeOptions = {}
	): Unsubscribe {
		const { once = false, priority = 0 } = options;

		// Get or create the listener set for this event
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set());
		}

		const entry: ListenerEntry<GameEventData<T>> = {
			callback,
			once,
			priority
		};

		const listenerSet = this.listeners.get(event)!;
		listenerSet.add(entry as ListenerEntry<unknown>);

		// Return unsubscribe function
		return () => {
			listenerSet.delete(entry as ListenerEntry<unknown>);
			// Clean up empty sets
			if (listenerSet.size === 0) {
				this.listeners.delete(event);
			}
		};
	}

	/**
	 * Subscribe to an event for a single emission only.
	 * Convenience method equivalent to `on(event, callback, { once: true })`.
	 *
	 * @template T - Event name type
	 * @param event - The event name to subscribe to
	 * @param callback - Function to call when event is emitted
	 * @returns Unsubscribe function
	 */
	once<T extends GameEventName>(
		event: T,
		callback: EventCallback<GameEventData<T>>
	): Unsubscribe {
		return this.on(event, callback, { once: true });
	}

	/**
	 * Emit an event to all subscribers.
	 *
	 * Listeners are called synchronously in priority order (highest first).
	 * One-time listeners are automatically removed after being called.
	 *
	 * @template T - Event name type
	 * @param event - The event name to emit
	 * @param data - The event data to pass to listeners
	 *
	 * @example
	 * ```typescript
	 * events.emit('upgrade_purchased', {
	 *   upgradeId: 'pixel-generator-1',
	 *   cost: new Map([['pixels', D(100)]]),
	 *   level: 1
	 * });
	 * ```
	 */
	emit<T extends GameEventName>(event: T, data: GameEventData<T>): void {
		this.eventCount++;

		if (this.debug) {
			console.log(`[Event] ${event}:`, data);
		}

		const listenerSet = this.listeners.get(event);
		if (!listenerSet || listenerSet.size === 0) {
			return;
		}

		// Sort listeners by priority (highest first)
		const sortedListeners = Array.from(listenerSet).sort(
			(a, b) => b.priority - a.priority
		);

		// Track one-time listeners to remove after iteration
		const toRemove: ListenerEntry<unknown>[] = [];

		for (const entry of sortedListeners) {
			try {
				(entry.callback as EventCallback<GameEventData<T>>)(data);
			} catch (error) {
				console.error(`[EventManager] Error in listener for "${event}":`, error);
			}

			if (entry.once) {
				toRemove.push(entry);
			}
		}

		// Remove one-time listeners
		for (const entry of toRemove) {
			listenerSet.delete(entry);
		}

		// Clean up empty sets
		if (listenerSet.size === 0) {
			this.listeners.delete(event);
		}
	}

	/**
	 * Remove all listeners for a specific event.
	 *
	 * @param event - The event name to clear listeners for
	 */
	off<T extends GameEventName>(event: T): void {
		this.listeners.delete(event);
	}

	/**
	 * Remove all listeners for all events.
	 * Use with caution - typically only needed during cleanup/reset.
	 */
	clear(): void {
		this.listeners.clear();
	}

	/**
	 * Get the number of listeners for a specific event.
	 *
	 * @param event - The event name to check
	 * @returns Number of active listeners
	 */
	listenerCount<T extends GameEventName>(event: T): number {
		return this.listeners.get(event)?.size ?? 0;
	}

	/**
	 * Get total number of events emitted since creation.
	 * Useful for debugging and performance monitoring.
	 *
	 * @returns Total event count
	 */
	getEventCount(): number {
		return this.eventCount;
	}

	/**
	 * Get all registered event names.
	 * Useful for debugging.
	 *
	 * @returns Array of event names with active listeners
	 */
	getRegisteredEvents(): string[] {
		return Array.from(this.listeners.keys());
	}

	/**
	 * Enable or disable debug logging.
	 *
	 * @param enabled - Whether to enable debug logging
	 */
	setDebug(enabled: boolean): void {
		this.debug = enabled;
	}

	/**
	 * Check if debug mode is enabled.
	 *
	 * @returns Whether debug logging is enabled
	 */
	isDebugEnabled(): boolean {
		return this.debug;
	}

	/**
	 * Wait for an event to be emitted.
	 * Returns a Promise that resolves when the event is emitted.
	 *
	 * @template T - Event name type
	 * @param event - The event to wait for
	 * @param timeout - Optional timeout in milliseconds (0 = no timeout)
	 * @returns Promise that resolves with the event data
	 * @throws Error if timeout is reached
	 *
	 * @example
	 * ```typescript
	 * // Wait for game to initialize
	 * const initData = await events.waitFor('game_initialized');
	 * console.log('Game initialized:', initData.isNewGame);
	 *
	 * // Wait with timeout
	 * try {
	 *   const data = await events.waitFor('phase_entered', 5000);
	 * } catch (e) {
	 *   console.log('Timeout waiting for phase change');
	 * }
	 * ```
	 */
	waitFor<T extends GameEventName>(
		event: T,
		timeout: number = 0
	): Promise<GameEventData<T>> {
		return new Promise((resolve, reject) => {
			let timeoutId: ReturnType<typeof setTimeout> | undefined;

			const unsubscribe = this.once(event, (data) => {
				if (timeoutId) {
					clearTimeout(timeoutId);
				}
				resolve(data);
			});

			if (timeout > 0) {
				timeoutId = setTimeout(() => {
					unsubscribe();
					reject(new Error(`Timeout waiting for event: ${event}`));
				}, timeout);
			}
		});
	}
}
