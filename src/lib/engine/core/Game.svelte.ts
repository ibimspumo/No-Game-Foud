/**
 * @fileoverview Main Game class - the central coordinator for the engine.
 * Manages all sub-systems, the game loop, and provides the primary interface.
 *
 * The Game class follows the Manager pattern, coordinating between:
 * - EventManager: Pub/Sub communication
 * - ResourceManager: Resource amounts and production
 * - GameLoop: Timing and updates
 *
 * Note: This file uses .svelte.ts extension to enable runes in non-component files.
 *
 * @module engine/core/Game
 */

import { EventManager } from './EventManager';
import { GameLoop, type LoopStats } from './GameLoop';
import { ResourceManager } from '../systems/ResourceManager.svelte';
import { type GameConfig, DEFAULT_CONFIG } from '../models/types';
import { D, ZERO } from '../utils/decimal';

/**
 * Game state enum for tracking overall game status.
 */
export type GameStatus = 'uninitialized' | 'initializing' | 'running' | 'paused' | 'error';

/**
 * Main Game class - the heart of the engine.
 *
 * Coordinates all game systems and provides the primary interface for
 * both the engine internals and UI components.
 *
 * @example
 * ```typescript
 * // In +layout.svelte
 * const game = new Game();
 * setGameContext(game);
 *
 * $effect(() => {
 *   game.init();
 *   return () => game.stop();
 * });
 * ```
 */
export class Game {
	// ============================================================================
	// Sub-Systems
	// ============================================================================

	/**
	 * Event manager for pub/sub communication between systems.
	 */
	readonly events: EventManager;

	/**
	 * Resource manager for handling all game resources.
	 */
	readonly resources: ResourceManager;

	/**
	 * Game loop for timing and updates.
	 */
	private readonly loop: GameLoop;

	// ============================================================================
	// Configuration
	// ============================================================================

	/**
	 * Game configuration.
	 */
	private readonly config: GameConfig;

	// ============================================================================
	// State (using Svelte 5 runes)
	// ============================================================================

	/**
	 * Current game status.
	 */
	status = $state<GameStatus>('uninitialized');

	/**
	 * Current game phase (1-20).
	 */
	currentPhase = $state(1);

	/**
	 * Total time played in this run (seconds).
	 */
	runTime = $state(0);

	/**
	 * Total ticks since game start.
	 */
	tickCount = $state(0);

	/**
	 * Whether the game is in debug mode.
	 */
	debugMode = $state(false);

	/**
	 * Last error message (if any).
	 */
	lastError = $state<string | null>(null);

	/**
	 * Auto-save timer ID.
	 */
	private autoSaveTimerId: ReturnType<typeof setInterval> | null = null;

	// ============================================================================
	// Constructor
	// ============================================================================

	/**
	 * Creates a new Game instance.
	 *
	 * @param config - Optional configuration overrides
	 */
	constructor(config: Partial<GameConfig> = {}) {
		this.config = { ...DEFAULT_CONFIG, ...config };

		// Initialize sub-systems in order
		// 1. EventManager first (others depend on it)
		this.events = new EventManager(this.config.debug);

		// 2. ResourceManager (core game state)
		this.resources = new ResourceManager(this.events);

		// 3. GameLoop (starts the heartbeat)
		this.loop = new GameLoop(
			(dt) => this.tick(dt),
			this.config
		);

		// Set up visibility callbacks
		this.loop.setVisibilityCallbacks(
			() => this.onVisibilityHidden(),
			(offlineTime) => this.onVisibilityVisible(offlineTime)
		);

		this.debugMode = this.config.debug;
	}

	// ============================================================================
	// Lifecycle Methods
	// ============================================================================

	/**
	 * Initialize the game.
	 * Loads save data, calculates offline progress, and starts the loop.
	 *
	 * @returns Promise that resolves when initialization is complete
	 */
	async init(): Promise<void> {
		if (this.status !== 'uninitialized') {
			console.warn('[Game] Already initialized');
			return;
		}

		this.status = 'initializing';

		try {
			// Initialize all managers
			this.resources.init();

			// TODO: Load save data
			// const saveData = this.loadSave();
			// if (saveData) {
			//   this.deserialize(saveData);
			//   this.calculateOfflineProgress();
			// }

			// Start the game loop
			this.loop.start();
			this.status = 'running';

			// Start auto-save timer
			this.startAutoSave();

			// Emit initialization event
			this.events.emit('game_initialized', {
				timestamp: Date.now(),
				isNewGame: true // TODO: Set based on save data
			});

			if (this.config.debug) {
				console.log('[Game] Initialized successfully');
			}
		} catch (error) {
			this.status = 'error';
			this.lastError = error instanceof Error ? error.message : 'Unknown error';
			console.error('[Game] Initialization failed:', error);
			throw error;
		}
	}

	/**
	 * Stop the game completely.
	 * Saves state and cleans up resources.
	 */
	stop(): void {
		// Stop auto-save
		this.stopAutoSave();

		// Save before stopping
		this.save();

		// Stop the loop
		this.loop.stop();
		this.status = 'uninitialized';

		// Clear events
		this.events.clear();

		if (this.config.debug) {
			console.log('[Game] Stopped');
		}
	}

	/**
	 * Pause the game.
	 */
	pause(reason: 'user' | 'modal' | 'story' = 'user'): void {
		if (this.status !== 'running') return;

		this.loop.pause();
		this.status = 'paused';

		this.events.emit('game_paused', {
			reason,
			timestamp: Date.now()
		});
	}

	/**
	 * Resume the game from pause.
	 */
	resume(): void {
		if (this.status !== 'paused') return;

		this.loop.resume();
		this.status = 'running';

		this.events.emit('game_resumed', {
			pauseDuration: 0, // TODO: Track pause duration
			timestamp: Date.now()
		});
	}

	// ============================================================================
	// Main Tick
	// ============================================================================

	/**
	 * Main game tick - called by the GameLoop.
	 * Updates all systems in the correct order.
	 *
	 * @param deltaTime - Time since last tick in seconds
	 */
	private tick(deltaTime: number): void {
		this.tickCount++;
		this.runTime += deltaTime;

		// Update systems in order
		// 1. Resources (production)
		this.resources.tick(deltaTime);

		// 2. TODO: Phase checks
		// this.phases.tick(deltaTime);

		// 3. TODO: Automation
		// this.automation.tick(deltaTime);

		// 4. TODO: Story triggers
		// this.story.tick(deltaTime);

		// 5. TODO: Achievement checks
		// this.achievements.tick(deltaTime);

		// Emit tick event (for debugging/stats)
		if (this.config.debug && this.tickCount % 60 === 0) {
			this.events.emit('tick', {
				deltaTime,
				totalTime: this.runTime,
				tickCount: this.tickCount
			});
		}
	}

	// ============================================================================
	// Save/Load
	// ============================================================================

	/**
	 * Save the game state to localStorage.
	 */
	save(): void {
		try {
			const saveData = this.serialize();
			const saveString = JSON.stringify(saveData);
			localStorage.setItem(this.config.saveKey, saveString);

			this.events.emit('game_saved', {
				timestamp: Date.now(),
				saveSize: saveString.length,
				isAutoSave: false
			});

			if (this.config.debug) {
				console.log(`[Game] Saved (${saveString.length} bytes)`);
			}
		} catch (error) {
			console.error('[Game] Save failed:', error);
		}
	}

	/**
	 * Load the game state from localStorage.
	 *
	 * @returns Whether load was successful
	 */
	load(): boolean {
		try {
			const saveString = localStorage.getItem(this.config.saveKey);
			if (!saveString) {
				return false;
			}

			const saveData = JSON.parse(saveString);
			this.deserialize(saveData);

			if (this.config.debug) {
				console.log('[Game] Loaded save data');
			}

			return true;
		} catch (error) {
			console.error('[Game] Load failed:', error);
			return false;
		}
	}

	/**
	 * Delete the save data.
	 */
	deleteSave(): void {
		localStorage.removeItem(this.config.saveKey);
		if (this.config.debug) {
			console.log('[Game] Save deleted');
		}
	}

	/**
	 * Check if save data exists.
	 *
	 * @returns Whether save data exists
	 */
	hasSave(): boolean {
		return localStorage.getItem(this.config.saveKey) !== null;
	}

	/**
	 * Serialize the complete game state.
	 *
	 * @returns Serialized game state
	 */
	private serialize(): object {
		return {
			version: this.config.version,
			savedAt: Date.now(),
			run: {
				currentPhase: this.currentPhase,
				runTime: this.runTime,
				resources: this.resources.serialize()
			},
			eternal: {
				// TODO: Add eternal state
			}
		};
	}

	/**
	 * Deserialize and restore game state.
	 *
	 * @param data - Serialized game state
	 */
	private deserialize(data: unknown): void {
		const save = data as {
			version?: string;
			savedAt?: number;
			run?: {
				currentPhase?: number;
				runTime?: number;
				resources?: unknown;
			};
			eternal?: unknown;
		};

		if (!save || typeof save !== 'object') return;

		// Restore run state
		if (save.run) {
			if (typeof save.run.currentPhase === 'number') {
				this.currentPhase = save.run.currentPhase;
			}
			if (typeof save.run.runTime === 'number') {
				this.runTime = save.run.runTime;
			}
			if (save.run.resources) {
				this.resources.deserialize(save.run.resources);
			}
		}

		// TODO: Restore eternal state
	}

	/**
	 * Start the auto-save timer.
	 */
	private startAutoSave(): void {
		if (this.autoSaveTimerId) {
			clearInterval(this.autoSaveTimerId);
		}

		this.autoSaveTimerId = setInterval(() => {
			this.save();
		}, this.config.autoSaveInterval);
	}

	/**
	 * Stop the auto-save timer.
	 */
	private stopAutoSave(): void {
		if (this.autoSaveTimerId) {
			clearInterval(this.autoSaveTimerId);
			this.autoSaveTimerId = null;
		}
	}

	// ============================================================================
	// Visibility Handling
	// ============================================================================

	/**
	 * Called when tab becomes hidden.
	 */
	private onVisibilityHidden(): void {
		this.save();

		this.events.emit('game_paused', {
			reason: 'visibility',
			timestamp: Date.now()
		});
	}

	/**
	 * Called when tab becomes visible.
	 *
	 * @param offlineTime - Time spent hidden in seconds
	 */
	private onVisibilityVisible(offlineTime: number): void {
		// Calculate offline progress
		this.calculateOfflineProgress(offlineTime);

		this.events.emit('game_resumed', {
			pauseDuration: offlineTime * 1000,
			timestamp: Date.now()
		});
	}

	/**
	 * Calculate and apply offline progress.
	 *
	 * @param offlineSeconds - Time offline in seconds
	 */
	private calculateOfflineProgress(offlineSeconds: number): void {
		// Cap offline time
		const cappedTime = Math.min(offlineSeconds, this.config.maxOfflineTime);

		// Apply efficiency
		const effectiveTime = cappedTime * this.config.offlineEfficiency;

		// Calculate gains for each resource
		const gains = new Map<string, typeof ZERO>();

		for (const resourceId of this.resources.unlockedResources) {
			const rate = this.resources.getProductionRate(resourceId);
			if (rate.gt(0)) {
				const gain = rate.mul(effectiveTime);
				this.resources.add(resourceId, gain);
				gains.set(resourceId, gain);
			}
		}

		// Emit offline gains event
		this.events.emit('offline_gains_calculated', {
			offlineTime: offlineSeconds,
			cappedTime,
			efficiency: this.config.offlineEfficiency,
			gains
		});

		if (this.config.debug) {
			console.log(`[Game] Offline progress: ${offlineSeconds.toFixed(1)}s -> ${effectiveTime.toFixed(1)}s effective`);
		}
	}

	// ============================================================================
	// Game Actions
	// ============================================================================

	/**
	 * Perform a click action on a resource.
	 *
	 * @param resourceId - Resource to click
	 */
	click(resourceId: string = 'pixels'): void {
		this.resources.click(resourceId);
	}

	/**
	 * Hard reset - delete save and reload.
	 */
	hardReset(): void {
		this.deleteSave();
		// In browser, reload the page
		if (typeof window !== 'undefined') {
			window.location.reload();
		}
	}

	// ============================================================================
	// Getters
	// ============================================================================

	/**
	 * Check if the game is running.
	 */
	get isRunning(): boolean {
		return this.status === 'running';
	}

	/**
	 * Check if the game is paused.
	 */
	get isPaused(): boolean {
		return this.status === 'paused';
	}

	/**
	 * Get loop statistics for debugging.
	 */
	getLoopStats(): LoopStats {
		return this.loop.getStats();
	}

	/**
	 * Get the game configuration.
	 */
	getConfig(): GameConfig {
		return { ...this.config };
	}

	/**
	 * Enable/disable debug mode.
	 */
	setDebug(enabled: boolean): void {
		this.debugMode = enabled;
		this.events.setDebug(enabled);
	}
}
