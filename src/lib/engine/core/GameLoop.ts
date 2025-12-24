/**
 * @fileoverview Game Loop manager for the engine.
 * Handles tick timing, delta time calculation, and visibility management.
 *
 * The GameLoop is responsible for:
 * - Consistent tick timing (default: 20 ticks/second)
 * - Delta time calculation for frame-independent updates
 * - Pause/resume functionality
 * - Tab visibility handling (pause when hidden, resume when visible)
 *
 * @module engine/core/GameLoop
 */

import type { GameConfig } from '../models/types';
import { DEFAULT_CONFIG } from '../models/types';

/**
 * Callback function called on each tick.
 * @param deltaTime - Time since last tick in seconds
 */
export type TickCallback = (deltaTime: number) => void;

/**
 * State of the game loop.
 */
export type LoopState = 'stopped' | 'running' | 'paused';

/**
 * Statistics about the game loop for debugging.
 */
export interface LoopStats {
	/** Current ticks per second */
	currentTps: number;
	/** Average tick time in milliseconds */
	averageTickTime: number;
	/** Total ticks since start */
	totalTicks: number;
	/** Total time running in seconds */
	totalTime: number;
	/** Whether loop is currently running */
	isRunning: boolean;
	/** Whether loop is paused */
	isPaused: boolean;
}

/**
 * Game Loop manager.
 *
 * Provides consistent timing for game updates using requestAnimationFrame
 * with fallback to setTimeout. Handles tab visibility to pause/resume
 * automatically and provides accurate delta time calculations.
 *
 * @example
 * ```typescript
 * const loop = new GameLoop((deltaTime) => {
 *   // Update game state
 *   game.tick(deltaTime);
 * });
 *
 * // Start the loop
 * loop.start();
 *
 * // Pause when needed
 * loop.pause();
 *
 * // Resume
 * loop.resume();
 *
 * // Stop completely
 * loop.stop();
 * ```
 */
export class GameLoop {
	/**
	 * Callback function called on each tick.
	 */
	private tickCallback: TickCallback;

	/**
	 * Configuration options.
	 */
	private config: GameConfig;

	/**
	 * Current loop state.
	 */
	private state: LoopState = 'stopped';

	/**
	 * Timestamp of the last tick.
	 */
	private lastTime: number = 0;

	/**
	 * ID of the current animation frame request.
	 */
	private animationFrameId: number | null = null;

	/**
	 * Total ticks since start.
	 */
	private tickCount: number = 0;

	/**
	 * Total time running in seconds.
	 */
	private totalTime: number = 0;

	/**
	 * Rolling average of tick times for stats.
	 */
	private tickTimes: number[] = [];

	/**
	 * Maximum samples for rolling average.
	 */
	private readonly MAX_TICK_SAMPLES = 60;

	/**
	 * Timestamp when the loop was paused.
	 */
	private pauseTime: number = 0;

	/**
	 * Bound loop function for use with requestAnimationFrame.
	 */
	private boundLoop: (currentTime: number) => void;

	/**
	 * Bound visibility change handler.
	 */
	private boundVisibilityHandler: () => void;

	/**
	 * Callback for when the game is paused due to visibility change.
	 */
	private onVisibilityPause?: () => void;

	/**
	 * Callback for when the game resumes after visibility change.
	 * @param offlineTime - Time spent hidden in seconds
	 */
	private onVisibilityResume?: (offlineTime: number) => void;

	/**
	 * Creates a new GameLoop instance.
	 *
	 * @param tickCallback - Function to call on each tick with delta time
	 * @param config - Optional configuration overrides
	 */
	constructor(
		tickCallback: TickCallback,
		config: Partial<GameConfig> = {}
	) {
		this.tickCallback = tickCallback;
		this.config = { ...DEFAULT_CONFIG, ...config };

		// Bind methods for event listeners
		this.boundLoop = this.loop.bind(this);
		this.boundVisibilityHandler = this.handleVisibilityChange.bind(this);
	}

	/**
	 * Start the game loop.
	 * Does nothing if already running.
	 */
	start(): void {
		if (this.state === 'running') {
			return;
		}

		this.state = 'running';
		this.lastTime = performance.now();
		this.scheduleNextTick();
		this.setupVisibilityHandler();

		if (this.config.debug) {
			console.log('[GameLoop] Started');
		}
	}

	/**
	 * Stop the game loop completely.
	 * Resets all statistics.
	 */
	stop(): void {
		this.state = 'stopped';
		this.cancelScheduledTick();
		this.removeVisibilityHandler();
		this.tickCount = 0;
		this.totalTime = 0;
		this.tickTimes = [];

		if (this.config.debug) {
			console.log('[GameLoop] Stopped');
		}
	}

	/**
	 * Pause the game loop.
	 * Maintains state for resumption.
	 */
	pause(): void {
		if (this.state !== 'running') {
			return;
		}

		this.state = 'paused';
		this.pauseTime = performance.now();
		this.cancelScheduledTick();

		if (this.config.debug) {
			console.log('[GameLoop] Paused');
		}
	}

	/**
	 * Resume the game loop from pause.
	 * Resets lastTime to prevent large delta time jumps.
	 */
	resume(): void {
		if (this.state !== 'paused') {
			return;
		}

		this.state = 'running';
		// Reset lastTime to prevent delta time spike
		this.lastTime = performance.now();
		this.scheduleNextTick();

		if (this.config.debug) {
			console.log('[GameLoop] Resumed');
		}
	}

	/**
	 * Check if the loop is currently running.
	 *
	 * @returns true if running (not paused or stopped)
	 */
	isRunning(): boolean {
		return this.state === 'running';
	}

	/**
	 * Check if the loop is currently paused.
	 *
	 * @returns true if paused
	 */
	isPaused(): boolean {
		return this.state === 'paused';
	}

	/**
	 * Get the current loop state.
	 *
	 * @returns Current state
	 */
	getState(): LoopState {
		return this.state;
	}

	/**
	 * Get loop statistics for debugging/monitoring.
	 *
	 * @returns Current loop statistics
	 */
	getStats(): LoopStats {
		const avgTickTime = this.tickTimes.length > 0
			? this.tickTimes.reduce((a, b) => a + b, 0) / this.tickTimes.length
			: 0;

		return {
			currentTps: avgTickTime > 0 ? 1000 / avgTickTime : 0,
			averageTickTime: avgTickTime,
			totalTicks: this.tickCount,
			totalTime: this.totalTime,
			isRunning: this.state === 'running',
			isPaused: this.state === 'paused'
		};
	}

	/**
	 * Get total time the loop has been running.
	 *
	 * @returns Total time in seconds
	 */
	getTotalTime(): number {
		return this.totalTime;
	}

	/**
	 * Get total tick count.
	 *
	 * @returns Number of ticks since start
	 */
	getTickCount(): number {
		return this.tickCount;
	}

	/**
	 * Set visibility change callbacks.
	 * Used to handle tab switching for auto-save and offline progress.
	 *
	 * @param onPause - Called when tab becomes hidden
	 * @param onResume - Called when tab becomes visible (with offline time)
	 */
	setVisibilityCallbacks(
		onPause?: () => void,
		onResume?: (offlineTime: number) => void
	): void {
		this.onVisibilityPause = onPause;
		this.onVisibilityResume = onResume;
	}

	/**
	 * Main loop function called by requestAnimationFrame.
	 *
	 * @param currentTime - Current timestamp from requestAnimationFrame
	 */
	private loop(currentTime: number): void {
		if (this.state !== 'running') {
			return;
		}

		// Calculate delta time in seconds
		const deltaMs = currentTime - this.lastTime;
		let deltaTime = deltaMs / 1000;

		// Record tick time for stats
		this.recordTickTime(deltaMs);

		// Cap delta time to prevent physics explosions on lag spikes
		deltaTime = Math.min(deltaTime, this.config.maxDeltaTime);

		// Update timing state
		this.lastTime = currentTime;
		this.tickCount++;
		this.totalTime += deltaTime;

		// Execute tick callback
		try {
			this.tickCallback(deltaTime);
		} catch (error) {
			console.error('[GameLoop] Error in tick callback:', error);
		}

		// Schedule next tick
		this.scheduleNextTick();
	}

	/**
	 * Schedule the next tick using requestAnimationFrame.
	 */
	private scheduleNextTick(): void {
		if (typeof requestAnimationFrame !== 'undefined') {
			this.animationFrameId = requestAnimationFrame(this.boundLoop);
		} else {
			// Fallback for non-browser environments (e.g., testing)
			const intervalMs = 1000 / this.config.tickRate;
			setTimeout(() => {
				this.loop(performance.now());
			}, intervalMs);
		}
	}

	/**
	 * Cancel any scheduled tick.
	 */
	private cancelScheduledTick(): void {
		if (this.animationFrameId !== null && typeof cancelAnimationFrame !== 'undefined') {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	/**
	 * Set up the visibility change event listener.
	 */
	private setupVisibilityHandler(): void {
		if (typeof document !== 'undefined') {
			document.addEventListener('visibilitychange', this.boundVisibilityHandler);
		}
	}

	/**
	 * Remove the visibility change event listener.
	 */
	private removeVisibilityHandler(): void {
		if (typeof document !== 'undefined') {
			document.removeEventListener('visibilitychange', this.boundVisibilityHandler);
		}
	}

	/**
	 * Handle visibility change events.
	 * Pauses when hidden, resumes when visible.
	 */
	private handleVisibilityChange(): void {
		if (typeof document === 'undefined') {
			return;
		}

		if (document.hidden) {
			// Tab is now hidden
			if (this.state === 'running') {
				this.pause();
				this.onVisibilityPause?.();

				if (this.config.debug) {
					console.log('[GameLoop] Paused due to visibility change');
				}
			}
		} else {
			// Tab is now visible
			if (this.state === 'paused') {
				const offlineTime = (performance.now() - this.pauseTime) / 1000;
				this.resume();
				this.onVisibilityResume?.(offlineTime);

				if (this.config.debug) {
					console.log(`[GameLoop] Resumed after ${offlineTime.toFixed(2)}s`);
				}
			}
		}
	}

	/**
	 * Record a tick time sample for statistics.
	 *
	 * @param timeMs - Tick time in milliseconds
	 */
	private recordTickTime(timeMs: number): void {
		this.tickTimes.push(timeMs);
		if (this.tickTimes.length > this.MAX_TICK_SAMPLES) {
			this.tickTimes.shift();
		}
	}

	/**
	 * Update the tick callback function.
	 *
	 * @param callback - New tick callback
	 */
	setTickCallback(callback: TickCallback): void {
		this.tickCallback = callback;
	}

	/**
	 * Update configuration.
	 *
	 * @param config - Partial configuration to merge
	 */
	updateConfig(config: Partial<GameConfig>): void {
		this.config = { ...this.config, ...config };
	}
}
