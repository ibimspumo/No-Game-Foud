/**
 * @fileoverview Main Game class - the central coordinator for the engine.
 * Manages all sub-systems, the game loop, and provides the primary interface.
 *
 * The Game class follows the Manager pattern, coordinating between:
 * - EventManager: Pub/Sub communication
 * - SaveManager: Save/load operations and state persistence
 * - ResourceManager: Resource amounts and production
 * - ProducerManager: Producers/buildings and production pipeline
 * - UpgradeManager: Run/eternal/secret upgrades and skill tree
 * - PhaseManager: 20-phase progression system
 * - NarrativeManager: Story, logs, dialogues, and choices
 * - GameLoop: Timing and updates
 *
 * Note: This file uses .svelte.ts extension to enable runes in non-component files.
 *
 * @module engine/core/Game
 */

import { EventManager } from './EventManager';
import { SaveManager } from './SaveManager';
import { GameLoop, type LoopStats } from './GameLoop';
import { ResourceManager } from '../systems/ResourceManager.svelte';
import { ProducerManager } from '../systems/ProducerManager.svelte';
import { UpgradeManager, type UpgradeManagerContext } from '../systems/UpgradeManager.svelte';
import { PhaseManager, type PhaseManagerContext } from '../systems/PhaseManager.svelte';
import { NarrativeManager, type NarrativeContext } from '../systems/NarrativeManager.svelte';
import { AchievementManager, type AchievementContext } from '../systems/AchievementManager.svelte';
import { type GameConfig, DEFAULT_CONFIG } from '../models/types';
import { type VisualMode } from '../models/phase';
import { getPhaseDefinitionsMap } from '../data/phases';
import { registerStoryForPhases } from '../data/story';
import { getInitialUpgrades, getNewUpgradesForPhase } from '../data/upgrades';
import { D, ZERO, ONE, mul } from '../utils/decimal';
import { calculateOfflineProgressWithBreakdown } from '../utils/OfflineProgress';

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
	 * Save manager for handling save/load operations.
	 */
	readonly save: SaveManager;

	/**
	 * Resource manager for handling all game resources.
	 */
	readonly resources: ResourceManager;

	/**
	 * Producer manager for handling producers/buildings.
	 */
	readonly producers: ProducerManager;

	/**
	 * Phase manager for handling the 20-phase progression.
	 */
	readonly phases: PhaseManager;

	/**
	 * Upgrade manager for run/eternal/secret upgrades.
	 */
	readonly upgrades: UpgradeManager;

	/**
	 * Narrative manager for story, logs, dialogues, and choices.
	 */
	readonly narrative: NarrativeManager;

	/**
	 * Achievement manager for tracking and awarding achievements.
	 */
	readonly achievements: AchievementManager;

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
	 * Total time played in this run (seconds).
	 */
	runTime = $state(0);

	/**
	 * Derived: Current game phase (1-20) from PhaseManager.
	 */
	get currentPhase(): number {
		return this.phases.currentPhase;
	}

	/**
	 * Derived: Current visual mode from PhaseManager.
	 */
	get visualMode(): VisualMode {
		return this.phases.visualMode;
	}

	/**
	 * Derived: Whether transition to next phase is possible.
	 */
	get canAdvancePhase(): boolean {
		return this.phases.canAdvance;
	}

	/**
	 * Derived: Progress towards next phase (0-1).
	 */
	get phaseProgress(): number {
		return this.phases.transitionProgress;
	}

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

		// 2. SaveManager (needs events)
		this.save = new SaveManager(
			this.events,
			this.config.saveKey,
			this.config.version,
			this.config.autoSaveInterval
		);

		// 3. ResourceManager (core game state)
		this.resources = new ResourceManager(this.events);

		// 4. ProducerManager (producers and production pipeline)
		this.producers = new ProducerManager(this.events, this.resources);

		// 5. UpgradeManager (run/eternal/secret upgrades)
		this.upgrades = new UpgradeManager(this.events, this.resources);

		// 6. PhaseManager (20-phase progression)
		const phaseDefinitions = getPhaseDefinitionsMap();
		this.phases = new PhaseManager(this.events, phaseDefinitions);

		// 7. NarrativeManager (story, logs, dialogues)
		this.narrative = new NarrativeManager(this.events);

		// 8. AchievementManager (achievements and rewards)
		this.achievements = new AchievementManager(this.events);

		// 9. GameLoop (starts the heartbeat)
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

		// Set up event listeners to mark save as dirty
		this.events.on('resource_changed', () => this.save.markDirty());
		this.events.on('producer_purchased', () => this.save.markDirty());
		this.events.on('upgrade_purchased', () => this.save.markDirty());
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
			this.producers.init();
			this.upgrades.init();
			this.phases.init();
			this.narrative.init();
			this.achievements.init();
			this.save.init();

			// Register initial upgrades (run + eternal + secret)
			const initialUpgrades = getInitialUpgrades();
			for (const upgrade of initialUpgrades) {
				this.upgrades.registerUpgrade(upgrade);
			}

			// Set up UpgradeManager context for condition evaluation
			this.upgrades.setContext(this.createUpgradeContext());

			// Set up PhaseManager context for condition evaluation
			this.phases.setContext(this.createPhaseContext());

			// Set up NarrativeManager context for condition evaluation
			this.narrative.setContext(this.createNarrativeContext());

			// Set up AchievementManager context for condition evaluation
			this.achievements.setContext(this.createAchievementContext());

			// Sync resource manager with initial phase
			this.resources.setPhase(this.phases.currentPhase);

			// Load story content for initial phases (async, don't block)
			this.loadStoryForCurrentPhase();

			// Check for existing save and load if present
			let isNewGame = true;
			let lastPlayedAt: number | null = null;

			if (this.save.hasSave()) {
				const loadedState = this.save.load();
				if (loadedState) {
					// Restore the game state
					this.deserialize(this.save.serialize()!);
					isNewGame = false;
					lastPlayedAt = loadedState.meta.lastPlayed;

					if (this.config.debug) {
						console.log('[Game] Loaded save data');
					}
				}
			}

			// Calculate offline progress if this is a returning player
			if (!isNewGame && lastPlayedAt) {
				const currentProductionRate = this.resources.getProductionRate('pixels');
				const offlineResult = calculateOfflineProgressWithBreakdown(lastPlayedAt, currentProductionRate);

				if (offlineResult.rewards.dreamPixels.gt(0)) {
					// Apply offline gains
					this.resources.add('pixels', offlineResult.rewards.dreamPixels);

					// Emit offline gains event
					this.events.emit('offline_gains_calculated', {
						offlineTime: offlineResult.rewards.timeAway,
						cappedTime: offlineResult.rewards.cappedTime,
						efficiency: offlineResult.rewards.efficiency,
						gains: new Map([['pixels', offlineResult.rewards.dreamPixels]])
					});

					if (this.config.debug) {
						console.log(`[Game] Offline progress: ${offlineResult.breakdown.timeAwayFormatted} -> ${offlineResult.rewards.dreamPixels.toString()} pixels`);
					}
				}
			}

			// Start the game loop
			this.loop.start();
			this.status = 'running';

			// Start auto-save timer
			this.save.startAutoSave();

			// Emit initialization event
			this.events.emit('game_initialized', {
				timestamp: Date.now(),
				isNewGame
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
		this.save.stopAutoSave();

		// Do final save before stopping
		this.saveGame();

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
		// 1. Resources (base production from ResourceManager)
		this.resources.tick(deltaTime);

		// 2. Producers (buildings and production pipeline)
		this.producers.tick(deltaTime);

		// 3. Upgrades (apply passive effects, check conditions)
		this.upgrades.tick(deltaTime);

		// 4. Phase checks (transitions, conditions)
		this.phases.tick(deltaTime);

		// 5. Narrative (story triggers, dialogues)
		this.narrative.tick(deltaTime);

		// 6. TODO: Automation
		// this.automation.tick(deltaTime);

		// 7. Achievement checks
		this.achievements.tick(deltaTime);

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
	 * Wrapper around SaveManager.save() for convenience.
	 */
	saveGame(): void {
		// Update SaveManager's state before saving
		const currentState = this.save.getState();
		if (currentState) {
			// Update run state
			currentState.run.runTime = this.runTime;
			currentState.run.currentPhase = this.phases.currentPhase;
			currentState.run.highestPhase = Math.max(currentState.run.highestPhase || 1, this.phases.currentPhase);

			// Let managers serialize their own state
			const serialized = this.serialize();
			if (serialized && typeof serialized === 'object' && 'run' in serialized) {
				const runData = serialized.run as any;
				if (runData.resources) currentState.run.resources = runData.resources;
				if (runData.producers) {
					// ProducerManager serializes to a different format, we need to adapt
					// For now, skip producer state in SaveManager
				}
			}

			this.save.setState(currentState);
		}

		// Trigger save
		this.save.save({ isAutoSave: false, force: true });
	}

	/**
	 * Load the game state from localStorage.
	 * Wrapper around SaveManager.load() for convenience.
	 *
	 * @returns Whether load was successful
	 */
	loadGame(): boolean {
		const state = this.save.load();
		if (!state) {
			return false;
		}

		// Deserialize the state
		const serialized = this.save.serialize();
		if (serialized) {
			this.deserialize(serialized);
		}

		return true;
	}

	/**
	 * Delete the save data.
	 * Wrapper around SaveManager.deleteSave() for convenience.
	 */
	deleteSave(): void {
		this.save.deleteSave();
		if (this.config.debug) {
			console.log('[Game] Save deleted');
		}
	}

	/**
	 * Check if save data exists.
	 * Wrapper around SaveManager.hasSave() for convenience.
	 *
	 * @returns Whether save data exists
	 */
	hasSave(): boolean {
		return this.save.hasSave();
	}

	/**
	 * Serialize the complete game state.
	 *
	 * @returns Serialized game state
	 */
	private serialize(): object {
		const upgradeState = this.upgrades.serialize();
		return {
			version: this.config.version,
			savedAt: Date.now(),
			run: {
				runTime: this.runTime,
				resources: this.resources.serialize(),
				producers: this.producers.serialize(),
				upgrades: upgradeState.runLevels,
				phases: this.phases.serialize(),
				narrative: this.narrative.serialize()
			},
			eternal: {
				upgrades: upgradeState.eternalLevels,
				achievements: this.achievements.serialize()
			},
			// Full upgrade state for complete restoration
			upgradeState
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
				runTime?: number;
				resources?: unknown;
				producers?: unknown;
				upgrades?: Record<string, number>;
				phases?: unknown;
				narrative?: unknown;
			};
			eternal?: {
				upgrades?: Record<string, number>;
				achievements?: unknown;
			};
			upgradeState?: {
				runLevels?: Record<string, number>;
				eternalLevels?: Record<string, number>;
				secretLevels?: Record<string, number>;
				unlocked?: string[];
				totalSpent?: Record<string, string>;
				firstPurchaseTimes?: Record<string, number>;
			};
		};

		if (!save || typeof save !== 'object') return;

		// Restore run state
		if (save.run) {
			if (typeof save.run.runTime === 'number') {
				this.runTime = save.run.runTime;
			}
			if (save.run.resources) {
				this.resources.deserialize(save.run.resources);
			}
			if (save.run.producers) {
				this.producers.deserialize(save.run.producers);
			}
			if (save.run.phases) {
				this.phases.deserialize(save.run.phases);
				// Sync resource manager with restored phase
				this.resources.setPhase(this.phases.currentPhase);
			}
			if (save.run.narrative) {
				this.narrative.deserialize(save.run.narrative);
			}
		}

		// Restore upgrade state
		if (save.upgradeState) {
			// Use full upgrade state if available
			this.upgrades.deserialize(save.upgradeState);
		} else if (save.run?.upgrades || save.eternal?.upgrades) {
			// Fall back to separate run/eternal for backwards compatibility
			this.upgrades.deserialize({
				runLevels: save.run?.upgrades || {},
				eternalLevels: save.eternal?.upgrades || {},
				secretLevels: {},
				unlocked: [],
				totalSpent: {},
				firstPurchaseTimes: {}
			});
		}

		// Restore achievement state (persists across rebirths)
		if (save.eternal?.achievements) {
			this.achievements.deserialize(save.eternal.achievements);
		}
	}

	// ============================================================================
	// Visibility Handling
	// ============================================================================

	/**
	 * Called when tab becomes hidden.
	 */
	private onVisibilityHidden(): void {
		this.saveGame();

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
		// Get last played timestamp from save state
		const saveState = this.save.getState();
		if (saveState) {
			const lastPlayedAt = saveState.meta.lastPlayed;
			const currentProductionRate = this.resources.getProductionRate('pixels');

			// Calculate offline progress using the OfflineProgress utility
			const offlineResult = calculateOfflineProgressWithBreakdown(lastPlayedAt, currentProductionRate);

			if (offlineResult.rewards.dreamPixels.gt(0)) {
				// Apply offline gains
				this.resources.add('pixels', offlineResult.rewards.dreamPixels);

				// Emit offline gains event
				this.events.emit('offline_gains_calculated', {
					offlineTime: offlineResult.rewards.timeAway,
					cappedTime: offlineResult.rewards.cappedTime,
					efficiency: offlineResult.rewards.efficiency,
					gains: new Map([['pixels', offlineResult.rewards.dreamPixels]])
				});

				if (this.config.debug) {
					console.log(`[Game] Offline progress: ${offlineResult.breakdown.timeAwayFormatted} -> ${offlineResult.rewards.dreamPixels.toString()} pixels`);
				}
			}
		}

		this.events.emit('game_resumed', {
			pauseDuration: offlineTime * 1000,
			timestamp: Date.now()
		});
	}

	// ============================================================================
	// Game Actions
	// ============================================================================

	/**
	 * Perform a click action on a resource.
	 * Includes base click amount plus any click power from producers.
	 *
	 * @param resourceId - Resource to click
	 * @returns Total amount generated
	 */
	click(resourceId: string = 'pixels'): typeof ONE {
		// Base click from resource definition
		const baseAmount = this.resources.click(resourceId);

		// Add click power from producers (click boosters)
		const clickPower = this.producers.getClickPower();
		if (clickPower.gt(0)) {
			this.resources.addFromClick(resourceId, clickPower);
		}

		return baseAmount.add(clickPower);
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

	/**
	 * Advance to the next phase.
	 * Only works if transition conditions are met.
	 *
	 * @returns Promise that resolves to true if transition succeeded
	 */
	async advancePhase(): Promise<boolean> {
		const success = await this.phases.advancePhase();

		if (success) {
			// Sync resource manager with new phase
			this.resources.setPhase(this.phases.currentPhase);
		}

		return success;
	}

	// ============================================================================
	// Phase Context Provider
	// ============================================================================

	/**
	 * Create the context object for UpgradeManager condition evaluation.
	 * This connects the UpgradeManager to other managers for condition checks.
	 *
	 * @returns UpgradeManagerContext object
	 */
	private createUpgradeContext(): UpgradeManagerContext {
		return {
			getCurrentPhase: () => {
				return this.phases.currentPhase;
			},
			hasAchievement: (achievementId: string) => {
				return this.achievements.hasAchievement(achievementId);
			},
			getProducerLevel: (producerId: string) => {
				return this.producers.getLevel(producerId);
			}
		};
	}

	/**
	 * Create the context object for PhaseManager condition evaluation.
	 * This connects the PhaseManager to other managers for condition checks.
	 *
	 * @returns PhaseManagerContext object
	 */
	private createPhaseContext(): PhaseManagerContext {
		return {
			getResourceAmount: (resourceId: string) => {
				return this.resources.getAmount(resourceId);
			},
			getProducerCount: (producerId: string) => {
				return this.producers.getLevel(producerId);
			},
			hasUpgrade: (upgradeId: string) => {
				return this.upgrades.getLevel(upgradeId) > 0;
			},
			getUpgradeLevel: (upgradeId: string) => {
				return this.upgrades.getLevel(upgradeId);
			},
			hasAchievement: (achievementId: string) => {
				return this.achievements.hasAchievement(achievementId);
			},
			getChoiceValue: (choiceId: string) => {
				// First check current phase choices
				const phaseChoice = this.phases.getChoice(choiceId);
				if (phaseChoice !== undefined) return phaseChoice;

				// Check narrative manager for story choices
				return this.narrative.getChoice(choiceId);
			}
		};
	}

	/**
	 * Create the context object for NarrativeManager condition evaluation.
	 * This connects the NarrativeManager to other managers for condition checks.
	 *
	 * @returns NarrativeContext object
	 */
	private createNarrativeContext(): NarrativeContext {
		return {
			getResourceAmount: (resourceId: string) => {
				return this.resources.getAmount(resourceId);
			},
			getCurrentPhase: () => {
				return this.phases.currentPhase;
			},
			getRunTime: () => {
				return this.runTime;
			},
			getProducerCount: (producerId: string) => {
				return this.producers.getLevel(producerId);
			},
			hasUpgrade: (upgradeId: string) => {
				return this.upgrades.getLevel(upgradeId) > 0;
			},
			getUpgradeLevel: (upgradeId: string) => {
				return this.upgrades.getLevel(upgradeId);
			},
			hasAchievement: (achievementId: string) => {
				return this.achievements.hasAchievement(achievementId);
			}
		};
	}

	/**
	 * Create the context object for AchievementManager condition evaluation.
	 * This connects the AchievementManager to other managers for condition checks.
	 *
	 * @returns AchievementContext object
	 */
	private createAchievementContext(): AchievementContext {
		return {
			getResourceAmount: (resourceId: string) => {
				return this.resources.getAmount(resourceId);
			},
			getCurrentPhase: () => {
				return this.phases.currentPhase;
			},
			isPhaseCompleted: (phaseNumber: number) => {
				return this.phases.isPhaseCompleted(phaseNumber);
			},
			getRunTime: () => {
				return this.runTime;
			},
			getTotalPlayTime: () => {
				// TODO: Get from eternal state when implemented
				return this.runTime;
			},
			getCurrentPhaseTime: () => {
				return this.phases.currentPhaseTime;
			},
			getProducerCount: (producerId: string) => {
				return this.producers.getLevel(producerId);
			},
			hasUpgrade: (upgradeId: string) => {
				return this.upgrades.getLevel(upgradeId) > 0;
			},
			getUpgradeLevel: (upgradeId: string) => {
				return this.upgrades.getLevel(upgradeId);
			},
			getChoiceValue: (choiceId: string) => {
				// First check current phase choices
				const phaseChoice = this.phases.getChoice(choiceId);
				if (phaseChoice !== undefined) return phaseChoice;

				// Check narrative manager for story choices
				return this.narrative.getChoice(choiceId);
			},
			getTotalRebirths: () => {
				// TODO: Get from eternal state when implemented
				return 0;
			},
			getTotalClicks: () => {
				// TODO: Get from statistics when implemented
				return 0;
			},
			addPrimordialPixels: (amount: number) => {
				// Add to eternal resources
				this.resources.add('primordial', D(amount));
			},
			applyUnlock: (unlockId: string) => {
				// TODO: Implement unlock system
				console.log(`[Game] Unlock applied: ${unlockId}`);
			}
		};
	}

	/**
	 * Load story content for current phase and next phase.
	 * Called on init and on phase transitions.
	 */
	private async loadStoryForCurrentPhase(): Promise<void> {
		const currentPhase = this.phases.currentPhase;
		const phasesToLoad = [currentPhase];

		// Also preload next phase if not at the end
		if (currentPhase < 20) {
			phasesToLoad.push(currentPhase + 1);
		}

		try {
			await registerStoryForPhases(this.narrative, phasesToLoad);

			if (this.config.debug) {
				console.log(`[Game] Loaded story for phases: ${phasesToLoad.join(', ')}`);
			}
		} catch (error) {
			console.warn('[Game] Failed to load story content:', error);
		}

		// Subscribe to phase changes to load next phase story
		this.events.on('phase_entered', async ({ newPhase }) => {
			// Load story for new phase and next
			const phases = [newPhase];
			if (newPhase < 20) {
				phases.push(newPhase + 1);
			}
			await registerStoryForPhases(this.narrative, phases);
		});
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
