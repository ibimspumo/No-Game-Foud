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
import { SecretManager, type SecretContext } from '../systems/SecretManager.svelte';
import { type GameConfig, DEFAULT_CONFIG } from '../models/types';
import { type VisualMode } from '../models/phase';
import { getPhaseDefinitionsMap } from '../data/phases';
import { registerStoryForPhases } from '../data/story';
import { getInitialUpgrades, getNewUpgradesForPhase } from '../data/upgrades';
import { D, ZERO, ONE, mul, type Decimal } from '../utils/decimal';
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
	 * Secret manager for tracking and awarding secret discoveries.
	 */
	readonly secrets: SecretManager;

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
	 * Eternal state - persists across rebirths.
	 */
	private eternalState = $state({
		totalPlayTime: 0,
		totalRebirths: 0,
		statistics: {
			totalClicks: 0
		}
	});

	/**
	 * Pause tracking state.
	 */
	private pauseStartTime = $state<number | null>(null);

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

	/**
	 * Accumulated time for auto-clicker (in seconds).
	 * When this reaches 1.0 / autoClickRate, an auto-click is performed.
	 */
	private autoClickAccumulator = 0;

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

		// 9. SecretManager (secret discoveries)
		this.secrets = new SecretManager(this.events);

		// 10. GameLoop (starts the heartbeat)
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
			this.secrets.init();
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

			// Set up ProducerManager achievement checker
			this.producers.setAchievementChecker((achievementId: string) =>
				this.achievements.hasAchievement(achievementId)
			);

			// Set up SecretManager context for condition evaluation
			this.secrets.setContext(this.createSecretContext());

			// Sync resource manager with initial phase
			this.resources.setPhase(this.phases.currentPhase);

			// Load story content for initial phases (async, don't block)
			this.loadStoryForCurrentPhase();

			// Check for existing save and load if present
			let isNewGame = true;
			let lastPlayedAt: number | null = null;

			if (this.hasSave()) {
				const loaded = this.loadGame();
				if (loaded) {
					isNewGame = false;
					// Get last played time from localStorage if available
					try {
						const saveData = JSON.parse(localStorage.getItem('pixelsingularity_save') || '{}');
						lastPlayedAt = saveData.lastModified || null;
					} catch {
						lastPlayedAt = null;
					}

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

		this.pauseStartTime = Date.now();
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

		const pauseDuration = this.pauseStartTime ? Date.now() - this.pauseStartTime : 0;
		this.pauseStartTime = null;

		this.loop.resume();
		this.status = 'running';

		this.events.emit('game_resumed', {
			pauseDuration,
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
		this.eternalState.totalPlayTime += deltaTime;

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

		// 6. Auto-clicker (from upgrades)
		this.processAutoClicks(deltaTime);

		// 7. Achievement checks
		this.achievements.tick(deltaTime);

		// 8. Secret checks
		this.secrets.tick(deltaTime);

		// Emit tick event (for debugging/stats)
		if (this.config.debug && this.tickCount % 60 === 0) {
			this.events.emit('tick', {
				deltaTime,
				totalTime: this.runTime,
				tickCount: this.tickCount
			});
		}
	}

	/**
	 * Process auto-clicks based on upgrade effects.
	 * Auto-clicker upgrades add to the auto_click_rate.
	 *
	 * @param deltaTime - Time since last tick in seconds
	 */
	private processAutoClicks(deltaTime: number): void {
		// Check if auto-click feature is unlocked
		if (!this.upgrades.isFeatureUnlocked('auto_click')) {
			return;
		}

		// Get auto-click rate from passive upgrade effects
		const autoClickRate = this.getAutoClickRate();
		if (autoClickRate <= 0) {
			return;
		}

		// Accumulate time
		this.autoClickAccumulator += deltaTime;

		// Calculate how many clicks should happen
		const clickInterval = 1.0 / autoClickRate; // seconds per click
		while (this.autoClickAccumulator >= clickInterval) {
			this.autoClickAccumulator -= clickInterval;
			// Perform an auto-click (with all bonuses applied)
			this.click('pixels');
		}
	}

	/**
	 * Get the current auto-click rate (clicks per second).
	 *
	 * @returns Auto-click rate
	 */
	getAutoClickRate(): number {
		// Get passive effects with bonusId 'auto_click_rate'
		const effects = this.upgrades.getActiveEffects('passive');
		let rate = 0;

		for (const { effect, level } of effects) {
			if (effect.type === 'passive' && effect.bonusId === 'auto_click_rate') {
				rate += Number(effect.value) * level;
			}
		}

		return rate;
	}

	// ============================================================================
	// Save/Load
	// ============================================================================

	/**
	 * Save the game state to localStorage.
	 * Wrapper around SaveManager.save() for convenience.
	 */
	saveGame(): void {
		try {
			// Serialize the complete game state from all managers
			const serialized = this.serialize();

			// Wrap with metadata for save format
			const saveData = {
				state: serialized,
				formatVersion: 1,
				lastModified: Date.now()
			};

			// Save directly to localStorage
			const saveKey = 'pixelsingularity_save';
			const saveString = JSON.stringify(saveData);

			// Create backup of previous save
			const existingSave = localStorage.getItem(saveKey);
			if (existingSave) {
				localStorage.setItem(`${saveKey}_backup`, existingSave);
			}

			localStorage.setItem(saveKey, saveString);

			if (this.config.debug) {
				console.log('[Game] Save successful, size:', saveString.length);
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
	loadGame(): boolean {
		try {
			const saveKey = 'pixelsingularity_save';
			const saveString = localStorage.getItem(saveKey);

			if (!saveString) {
				return false;
			}

			const saveData = JSON.parse(saveString);

			if (saveData?.state) {
				this.deserialize(saveData.state);

				if (this.config.debug) {
					console.log('[Game] Load successful');
				}
				return true;
			}

			return false;
		} catch (error) {
			console.error('[Game] Load failed:', error);
			return false;
		}
	}

	/**
	 * Delete the save data.
	 */
	deleteSave(): void {
		const saveKey = 'pixelsingularity_save';
		localStorage.removeItem(saveKey);
		localStorage.removeItem(`${saveKey}_backup`);

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
		return localStorage.getItem('pixelsingularity_save') !== null;
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
				achievements: this.achievements.serialize(),
				secrets: this.secrets.serialize(),
				totalPlayTime: this.eternalState.totalPlayTime,
				totalRebirths: this.eternalState.totalRebirths,
				statistics: {
					totalClicks: this.eternalState.statistics.totalClicks
				}
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
				secrets?: unknown;
				totalPlayTime?: number;
				totalRebirths?: number;
				statistics?: {
					totalClicks?: number;
				};
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

		// Restore eternal state
		if (save.eternal) {
			if (typeof save.eternal.totalPlayTime === 'number') {
				this.eternalState.totalPlayTime = save.eternal.totalPlayTime;
			}
			if (typeof save.eternal.totalRebirths === 'number') {
				this.eternalState.totalRebirths = save.eternal.totalRebirths;
			}
			if (save.eternal.statistics) {
				if (typeof save.eternal.statistics.totalClicks === 'number') {
					this.eternalState.statistics.totalClicks = save.eternal.statistics.totalClicks;
				}
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

		// Restore secret state (persists across rebirths)
		if (save.eternal?.secrets) {
			this.secrets.deserialize(save.eternal.secrets);
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
	 * Applies bonuses in correct order: (base + additive) * multiplicative.
	 *
	 * @param resourceId - Resource to click
	 * @returns Total amount generated
	 */
	click(resourceId: string = 'pixels'): Decimal {
		// Track total clicks in eternal state
		this.eternalState.statistics.totalClicks++;

		// Base click amount (usually 1)
		const baseAmount = ONE;

		// Get upgrade click bonuses (additive and multiplicative separately)
		const { additive, multiplicative } = this.upgrades.getClickBonusComponents();

		// Add click power from producers (click boosters)
		const producerClickPower = this.producers.getClickPower();

		// Calculate total: (base + additive + producer) * multiplicative
		// This ensures additive bonuses benefit from multiplicative bonuses
		let totalBeforeMultiplier = baseAmount.add(additive).add(producerClickPower);

		// Apply multiplicative bonuses last
		const clickAmount = mul(totalBeforeMultiplier, multiplicative);

		// Add the full click amount to resources
		this.resources.add(resourceId, clickAmount);

		return clickAmount;
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
				return this.eternalState.totalPlayTime;
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
				return this.eternalState.totalRebirths;
			},
			getTotalClicks: () => {
				return this.eternalState.statistics.totalClicks;
			},
			addPrimordialPixels: (amount: number) => {
				// Add to eternal resources
				this.resources.add('primordial', D(amount));
			},
			applyUnlock: (unlockId: string) => {
				// Apply various unlocks based on ID
				if (unlockId.startsWith('resource_')) {
					// Unlock a resource
					const resourceId = unlockId.replace('resource_', '');
					this.resources.unlock(resourceId);
					if (this.config.debug) {
						console.log(`[Game] Resource unlocked: ${resourceId}`);
					}
				} else if (unlockId.startsWith('upgrade_')) {
					// Unlock an upgrade
					const upgradeId = unlockId.replace('upgrade_', '');
					this.upgrades.unlock(upgradeId);
					if (this.config.debug) {
						console.log(`[Game] Upgrade unlocked: ${upgradeId}`);
					}
				} else if (unlockId.startsWith('producer_')) {
					// Unlock a producer
					const producerId = unlockId.replace('producer_', '');
					this.producers.unlock(producerId);
					if (this.config.debug) {
						console.log(`[Game] Producer unlocked: ${producerId}`);
					}
				} else {
					// Generic unlock - log for debugging
					// Features are typically unlocked via upgrade effects, not directly
					// Custom unlock types can be handled here in the future
					if (this.config.debug) {
						console.log(`[Game] Generic unlock applied: ${unlockId}`);
					}
				}
			}
		};
	}

	/**
	 * Create context for SecretManager condition evaluation.
	 *
	 * @returns Secret context object
	 */
	private createSecretContext(): SecretContext {
		return {
			getResourceAmount: (resourceId: string) => {
				return this.resources.getAmount(resourceId);
			},
			getCurrentPhase: () => {
				return this.phases.currentPhase;
			},
			getTotalPlayTime: () => {
				return this.eternalState.totalPlayTime;
			},
			getTotalIdleTime: () => {
				// Estimate idle time based on total play time minus active time
				// For now, return a portion of total play time
				return Math.floor(this.eternalState.totalPlayTime * 0.3);
			},
			getTimeSinceLastClick: () => {
				// Return time since last click (tracked via click method)
				// For now, return 0 as a placeholder - could be enhanced later
				return 0;
			},
			getTotalClicks: () => {
				return this.eternalState.statistics.totalClicks;
			},
			getCanvasesCompleted: () => {
				// Get from phase progress - Phase 2 is canvas, Phase 3 is gallery
				// Each canvas completion contributes to this count
				if (this.phases.currentPhase < 2) return 0;
				if (this.phases.currentPhase === 2) {
					// In canvas phase, check progress
					return Math.floor(this.phases.transitionProgress);
				}
				// After canvas phase, at least 1 canvas completed
				return Math.max(1, this.phases.currentPhase - 1);
			},
			getCanvasCount: () => {
				// Total canvas slots available based on phase
				if (this.phases.currentPhase < 3) return 1;
				return 64; // Full gallery = 64 canvases
			},
			getUpgradesPurchased: () => {
				// Count total upgrades purchased
				return this.upgrades.getTotalPurchased();
			},
			getLogsRead: () => {
				// Get count of read logs from narrative manager
				return this.narrative.logs.filter((log) => log.read).length;
			},
			getUniqueChoicesMade: () => {
				// Get count of unique choices made
				return this.narrative.getChoiceCount();
			},
			getUniqueProducersOwned: () => {
				// Count producers with level > 0
				return this.producers.unlockedProducers.filter(
					(id) => this.producers.getLevel(id) > 0
				).length;
			},
			addPrimordialPixels: (amount: number) => {
				this.resources.add('primordial', D(amount));
			},
			applyUnlock: (unlockId: string) => {
				// Reuse the same logic as AchievementContext
				if (unlockId.startsWith('resource_')) {
					const resourceId = unlockId.replace('resource_', '');
					this.resources.unlock(resourceId);
				} else if (unlockId.startsWith('upgrade_')) {
					const upgradeId = unlockId.replace('upgrade_', '');
					this.upgrades.unlock(upgradeId);
				} else if (unlockId.startsWith('producer_')) {
					const producerId = unlockId.replace('producer_', '');
					this.producers.unlock(producerId);
				}
			},
			setFlag: (flag: string, value: boolean | string) => {
				// Set flag in narrative manager for persistence
				this.narrative.setFlag(flag, value);
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
