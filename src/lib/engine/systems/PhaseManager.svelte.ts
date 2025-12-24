/**
 * @fileoverview Phase Manager for the game engine.
 * Manages the 20-phase progression system and visual mode switching.
 *
 * The game progresses through 20 phases:
 * - PIXEL MODE (1-10): Grid-based, visual, active clicking
 * - ABSTRACT MODE (11-20): Text-centered, minimalist, passive idle
 *
 * Uses Svelte 5 Runes ($state, $derived) for reactive state management.
 *
 * @module engine/systems/PhaseManager
 */

import type { EventManager } from '../core/EventManager';
import type { Manager } from '../models/types';
import type { Decimal } from '../utils/decimal';
import { D, ZERO } from '../utils/decimal';
import {
	type PhaseDefinition,
	type PhaseProgress,
	type VisualMode,
	type TransitionState,
	type Condition,
	createDefaultPhaseProgress,
	createDefaultPhaseManagerState,
	ABSTRACT_MODE_START_PHASE,
	TOTAL_PHASES,
	PhaseId
} from '../models/phase';
import {
	ConditionEvaluator,
	type EvaluationContext
} from './ConditionEvaluator';

// ============================================================================
// Types
// ============================================================================

/**
 * Context provider interface for condition evaluation.
 * The Game class will provide this to connect PhaseManager to other systems.
 */
export interface PhaseManagerContext {
	/** Get resource amount by ID */
	getResourceAmount: (resourceId: string) => Decimal;
	/** Get producer count by ID */
	getProducerCount: (producerId: string) => number;
	/** Check if upgrade is purchased */
	hasUpgrade: (upgradeId: string) => boolean;
	/** Get upgrade level */
	getUpgradeLevel: (upgradeId: string) => number;
	/** Check if achievement is unlocked */
	hasAchievement: (achievementId: string) => boolean;
	/** Get story choice value */
	getChoiceValue: (choiceId: string) => string | boolean | undefined;
}

/**
 * Serialized phase manager state for save/load.
 */
interface SerializedPhaseState {
	currentPhase: number;
	phaseStartTime: number;
	currentPhaseTime: number;
	unlockedPhases: number[];
	phaseProgress: Record<
		number,
		{
			entered: boolean;
			completed: boolean;
			timeSpent: number;
			bestTime: number | null;
			timesEntered: number;
			triggeredEvents: string[];
			choices: Record<string, string>;
			firstEntered: number | null;
			lastEntered: number | null;
			completedAt: number | null;
		}
	>;
}

/**
 * Callback for transition events.
 */
export type TransitionCallback = (state: TransitionState) => void;

// ============================================================================
// Phase Manager Class
// ============================================================================

/**
 * Phase Manager class.
 *
 * Manages the 20-phase progression system, including:
 * - Phase unlock conditions
 * - Phase transitions with animations
 * - Visual mode switching (pixel -> abstract at phase 11)
 * - Phase progress tracking
 *
 * @example
 * ```typescript
 * const phases = new PhaseManager(eventManager, phaseDefinitions);
 * phases.setContext(gameContext);
 * phases.init();
 *
 * // Check if ready for next phase
 * if (phases.canAdvance) {
 *   phases.advancePhase();
 * }
 * ```
 */
export class PhaseManager implements Manager {
	// ========================================================================
	// Dependencies
	// ========================================================================

	private events: EventManager;
	private definitions: Map<number, PhaseDefinition>;
	private context: PhaseManagerContext | null = null;
	private evaluator: ConditionEvaluator | null = null;

	// ========================================================================
	// State (Svelte 5 Runes)
	// ========================================================================

	/**
	 * Current phase number (1-20).
	 */
	currentPhase = $state(1);

	/**
	 * Timestamp when current phase was entered.
	 */
	phaseStartTime = $state(Date.now());

	/**
	 * Time spent in current phase (seconds).
	 */
	currentPhaseTime = $state(0);

	/**
	 * Set of unlocked phase IDs.
	 */
	private unlockedPhasesSet = $state<Set<number>>(new Set([1]));

	/**
	 * Progress tracking for each phase.
	 */
	private phaseProgress = $state<Map<number, PhaseProgress>>(new Map());

	/**
	 * Whether a transition is currently in progress.
	 */
	isTransitioning = $state(false);

	/**
	 * Current transition state (if transitioning).
	 */
	transitionState = $state<TransitionState | null>(null);

	/**
	 * Transition callbacks.
	 */
	private transitionCallbacks: TransitionCallback[] = [];

	// ========================================================================
	// Derived State (as getters to avoid initialization order issues)
	// ========================================================================

	/**
	 * Current phase definition.
	 */
	get currentDefinition(): PhaseDefinition | undefined {
		return this.definitions.get(this.currentPhase);
	}

	/**
	 * Current visual mode.
	 */
	get visualMode(): VisualMode {
		return this.currentPhase >= ABSTRACT_MODE_START_PHASE ? 'abstract' : 'pixel';
	}

	/**
	 * Whether transition to next phase is ready.
	 */
	get canAdvance(): boolean {
		return this.checkTransitionReady();
	}

	/**
	 * Progress towards next phase transition (0-1).
	 */
	get transitionProgress(): number {
		return this.calculateTransitionProgress();
	}

	/**
	 * Array of unlocked phase IDs.
	 */
	get unlockedPhases(): number[] {
		return [...this.unlockedPhasesSet];
	}

	/**
	 * Whether current phase is a boss phase.
	 */
	get isBossPhase(): boolean {
		return this.currentDefinition?.isBossPhase ?? false;
	}

	/**
	 * Whether current phase is a meditation phase.
	 */
	get isMeditationPhase(): boolean {
		return this.currentDefinition?.isMeditationPhase ?? false;
	}

	/**
	 * Whether clicking is enabled in current phase.
	 */
	get clickingEnabled(): boolean {
		return this.currentDefinition?.clickingEnabled ?? true;
	}

	/**
	 * Next phase number (or null if at max).
	 */
	get nextPhase(): number | null {
		return this.currentPhase < TOTAL_PHASES ? this.currentPhase + 1 : null;
	}

	/**
	 * Next phase definition (or null if at max).
	 */
	get nextDefinition(): PhaseDefinition | undefined {
		return this.nextPhase ? this.definitions.get(this.nextPhase) : undefined;
	}

	// ========================================================================
	// Constructor
	// ========================================================================

	/**
	 * Creates a new PhaseManager.
	 *
	 * @param events - Event manager for publishing events
	 * @param definitions - Map of phase definitions
	 */
	constructor(events: EventManager, definitions: Map<number, PhaseDefinition>) {
		this.events = events;
		this.definitions = definitions;
	}

	// ========================================================================
	// Lifecycle Methods
	// ========================================================================

	/**
	 * Initialize the phase manager.
	 * Sets up initial state and phase progress tracking.
	 */
	init(): void {
		// Initialize progress for all phases
		for (let i = 1; i <= TOTAL_PHASES; i++) {
			if (!this.phaseProgress.has(i)) {
				this.phaseProgress.set(i, createDefaultPhaseProgress(i));
			}
		}

		// Mark phase 1 as entered
		const phase1Progress = this.phaseProgress.get(1);
		if (phase1Progress && !phase1Progress.entered) {
			phase1Progress.entered = true;
			phase1Progress.firstEntered = Date.now();
			phase1Progress.lastEntered = Date.now();
			phase1Progress.timesEntered = 1;
		}

		// Emit initialization
		this.events.emit('phase_entered', {
			previousPhase: 0,
			newPhase: 1,
			phaseId: 'the_pixel',
			isFirstTime: true
		});
	}

	/**
	 * Update phase manager on each tick.
	 * Updates current phase time and checks for transitions.
	 *
	 * @param deltaTime - Time since last tick in seconds
	 */
	tick(deltaTime: number): void {
		// Update current phase time
		this.currentPhaseTime += deltaTime;

		// Update phase progress time
		const progress = this.phaseProgress.get(this.currentPhase);
		if (progress) {
			progress.timeSpent += deltaTime;
		}

		// Don't check transitions while already transitioning
		if (this.isTransitioning) return;

		// Check if transition conditions are met
		// Note: Transition is not automatic - player must trigger it
		// unless autoTransition is enabled for the phase
		const def = this.currentDefinition;
		if (def?.autoTransition && this.canAdvance) {
			this.advancePhase();
		}
	}

	/**
	 * Reset for a new run (rebirth).
	 * Resets to phase 1 but preserves some progress data.
	 */
	reset(): void {
		this.currentPhase = 1;
		this.phaseStartTime = Date.now();
		this.currentPhaseTime = 0;
		this.unlockedPhasesSet = new Set([1]);
		this.isTransitioning = false;
		this.transitionState = null;

		// Reset phase progress (but keep best times)
		for (let i = 1; i <= TOTAL_PHASES; i++) {
			const existing = this.phaseProgress.get(i);
			const bestTime = existing?.bestTime ?? null;

			this.phaseProgress.set(i, {
				...createDefaultPhaseProgress(i),
				bestTime // Preserve best time
			});
		}

		// Mark phase 1 as entered
		const phase1Progress = this.phaseProgress.get(1);
		if (phase1Progress) {
			phase1Progress.entered = true;
			phase1Progress.firstEntered = Date.now();
			phase1Progress.lastEntered = Date.now();
			phase1Progress.timesEntered = 1;
		}
	}

	/**
	 * Serialize state for saving.
	 *
	 * @returns Serialized phase state
	 */
	serialize(): SerializedPhaseState {
		const phaseProgressSerialized: SerializedPhaseState['phaseProgress'] = {};

		for (const [id, progress] of this.phaseProgress) {
			phaseProgressSerialized[id] = {
				entered: progress.entered,
				completed: progress.completed,
				timeSpent: progress.timeSpent,
				bestTime: progress.bestTime,
				timesEntered: progress.timesEntered,
				triggeredEvents: [...progress.triggeredEvents],
				choices: { ...progress.choices },
				firstEntered: progress.firstEntered,
				lastEntered: progress.lastEntered,
				completedAt: progress.completedAt
			};
		}

		return {
			currentPhase: this.currentPhase,
			phaseStartTime: this.phaseStartTime,
			currentPhaseTime: this.currentPhaseTime,
			unlockedPhases: [...this.unlockedPhasesSet],
			phaseProgress: phaseProgressSerialized
		};
	}

	/**
	 * Deserialize and restore state from save.
	 *
	 * @param data - Previously serialized state
	 */
	deserialize(data: unknown): void {
		const saved = data as SerializedPhaseState;
		if (!saved || typeof saved !== 'object') return;

		if (typeof saved.currentPhase === 'number') {
			this.currentPhase = saved.currentPhase;
		}

		if (typeof saved.phaseStartTime === 'number') {
			this.phaseStartTime = saved.phaseStartTime;
		}

		if (typeof saved.currentPhaseTime === 'number') {
			this.currentPhaseTime = saved.currentPhaseTime;
		}

		if (Array.isArray(saved.unlockedPhases)) {
			this.unlockedPhasesSet = new Set(saved.unlockedPhases);
		}

		if (saved.phaseProgress && typeof saved.phaseProgress === 'object') {
			for (const [idStr, progress] of Object.entries(saved.phaseProgress)) {
				const id = parseInt(idStr, 10);
				if (isNaN(id)) continue;

				const p = progress as SerializedPhaseState['phaseProgress'][number];
				this.phaseProgress.set(id, {
					phaseId: id,
					entered: p.entered ?? false,
					completed: p.completed ?? false,
					timeSpent: p.timeSpent ?? 0,
					bestTime: p.bestTime ?? null,
					timesEntered: p.timesEntered ?? 0,
					triggeredEvents: new Set(p.triggeredEvents ?? []),
					choices: p.choices ?? {},
					firstEntered: p.firstEntered ?? null,
					lastEntered: p.lastEntered ?? null,
					completedAt: p.completedAt ?? null
				});
			}
		}
	}

	// ========================================================================
	// Context Management
	// ========================================================================

	/**
	 * Set the context provider for condition evaluation.
	 * Must be called before conditions can be evaluated.
	 *
	 * @param context - Context provider
	 */
	setContext(context: PhaseManagerContext): void {
		this.context = context;

		// Create evaluation context wrapper
		const evalContext: EvaluationContext = {
			getResourceAmount: (id) => context.getResourceAmount(id),
			getCurrentPhaseTime: () => this.currentPhaseTime,
			getChoiceValue: (id) => context.getChoiceValue(id),
			getCurrentPhase: () => this.currentPhase,
			isPhaseCompleted: (phase) => this.isPhaseCompleted(phase),
			getProducerCount: (id) => context.getProducerCount(id),
			hasUpgrade: (id) => context.hasUpgrade(id),
			getUpgradeLevel: (id) => context.getUpgradeLevel(id),
			hasAchievement: (id) => context.hasAchievement(id)
		};

		this.evaluator = new ConditionEvaluator(evalContext);
	}

	// ========================================================================
	// Phase Operations
	// ========================================================================

	/**
	 * Check if transition to next phase is ready.
	 *
	 * @returns Whether transition is ready
	 */
	private checkTransitionReady(): boolean {
		if (!this.evaluator) return false;
		if (this.isTransitioning) return false;
		if (this.currentPhase >= TOTAL_PHASES) return false;

		const def = this.currentDefinition;
		if (!def) return false;

		// Evaluate transition conditions
		return this.evaluator.evaluateAll(def.transitionConditions);
	}

	/**
	 * Calculate progress towards next phase transition (0-1).
	 *
	 * @returns Progress value between 0 and 1
	 */
	private calculateTransitionProgress(): number {
		if (!this.evaluator) return 0;
		if (this.currentPhase >= TOTAL_PHASES) return 1;

		const def = this.currentDefinition;
		if (!def) return 0;

		return this.evaluator.evaluateProgress(def.transitionConditions);
	}

	/**
	 * Check if a phase is unlocked.
	 *
	 * @param phase - Phase number
	 * @returns Whether the phase is unlocked
	 */
	isPhaseUnlocked(phase: number): boolean {
		return this.unlockedPhasesSet.has(phase);
	}

	/**
	 * Check if a phase has been completed.
	 *
	 * @param phase - Phase number
	 * @returns Whether the phase is completed
	 */
	isPhaseCompleted(phase: number): boolean {
		return this.phaseProgress.get(phase)?.completed ?? false;
	}

	/**
	 * Get progress for a specific phase.
	 *
	 * @param phase - Phase number
	 * @returns Phase progress or undefined
	 */
	getPhaseProgress(phase: number): PhaseProgress | undefined {
		return this.phaseProgress.get(phase);
	}

	/**
	 * Get definition for a specific phase.
	 *
	 * @param phase - Phase number
	 * @returns Phase definition or undefined
	 */
	getPhaseDefinition(phase: number): PhaseDefinition | undefined {
		return this.definitions.get(phase);
	}

	/**
	 * Unlock a phase (make it accessible).
	 *
	 * @param phase - Phase number to unlock
	 */
	unlockPhase(phase: number): void {
		if (phase < 1 || phase > TOTAL_PHASES) return;
		if (this.unlockedPhasesSet.has(phase)) return;

		this.unlockedPhasesSet.add(phase);

		const def = this.definitions.get(phase);
		this.events.emit('phase_unlocked', {
			phaseNumber: phase,
			phaseId: def?.key ?? `phase_${phase}`,
			phaseName: def?.name ?? `Phase ${phase}`
		});
	}

	/**
	 * Advance to the next phase.
	 * Handles transition animation and state updates.
	 *
	 * @returns Promise that resolves when transition is complete
	 */
	async advancePhase(): Promise<boolean> {
		if (!this.canAdvance) return false;
		if (this.isTransitioning) return false;
		if (this.currentPhase >= TOTAL_PHASES) return false;

		const fromPhase = this.currentPhase;
		const toPhase = this.currentPhase + 1;

		// Start transition
		this.isTransitioning = true;

		const fromDef = this.definitions.get(fromPhase);
		const toDef = this.definitions.get(toPhase);

		// Create transition state
		const transitionDuration = (fromDef?.transitionOut.duration ?? 1000) +
			(toDef?.transitionIn.duration ?? 1000);

		this.transitionState = {
			fromPhase,
			toPhase,
			progress: 0,
			startTime: Date.now(),
			endTime: Date.now() + transitionDuration,
			stage: 'fadeOut'
		};

		// Notify callbacks
		this.notifyTransitionCallbacks();

		// Mark current phase as completed
		const fromProgress = this.phaseProgress.get(fromPhase);
		if (fromProgress) {
			fromProgress.completed = true;
			fromProgress.completedAt = Date.now();

			// Update best time if this is faster
			if (fromProgress.bestTime === null || fromProgress.timeSpent < fromProgress.bestTime) {
				fromProgress.bestTime = fromProgress.timeSpent;
			}
		}

		// Unlock next phase
		this.unlockPhase(toPhase);

		// Simulate transition animation (in real implementation, UI handles this)
		await this.simulateTransition(transitionDuration);

		// Complete transition
		this.currentPhase = toPhase;
		this.phaseStartTime = Date.now();
		this.currentPhaseTime = 0;

		// Update next phase progress
		const toProgress = this.phaseProgress.get(toPhase);
		const isFirstTime = toProgress ? !toProgress.entered : true;

		if (toProgress) {
			toProgress.entered = true;
			toProgress.timesEntered++;
			toProgress.lastEntered = Date.now();
			if (!toProgress.firstEntered) {
				toProgress.firstEntered = Date.now();
			}
		}

		// Clear transition state
		this.isTransitioning = false;
		this.transitionState = null;

		// Emit phase entered event
		this.events.emit('phase_entered', {
			previousPhase: fromPhase,
			newPhase: toPhase,
			phaseId: toDef?.key ?? `phase_${toPhase}`,
			isFirstTime
		});

		return true;
	}

	/**
	 * Simulate transition animation.
	 * In real implementation, the UI handles animation timing.
	 *
	 * @param duration - Total transition duration in ms
	 */
	private async simulateTransition(duration: number): Promise<void> {
		const startTime = Date.now();
		const stages: TransitionState['stage'][] = ['fadeOut', 'cutscene', 'loading', 'fadeIn', 'complete'];
		const stageDuration = duration / 4;

		for (let i = 0; i < 4; i++) {
			await new Promise((resolve) => setTimeout(resolve, stageDuration));

			if (this.transitionState) {
				this.transitionState.stage = stages[i + 1];
				this.transitionState.progress = (i + 1) / 4;
				this.notifyTransitionCallbacks();
			}
		}
	}

	/**
	 * Register a callback for transition events.
	 *
	 * @param callback - Callback function
	 * @returns Unsubscribe function
	 */
	onTransition(callback: TransitionCallback): () => void {
		this.transitionCallbacks.push(callback);
		return () => {
			const index = this.transitionCallbacks.indexOf(callback);
			if (index > -1) {
				this.transitionCallbacks.splice(index, 1);
			}
		};
	}

	/**
	 * Notify all transition callbacks.
	 */
	private notifyTransitionCallbacks(): void {
		if (!this.transitionState) return;

		for (const callback of this.transitionCallbacks) {
			try {
				callback(this.transitionState);
			} catch (error) {
				console.error('[PhaseManager] Transition callback error:', error);
			}
		}
	}

	// ========================================================================
	// Story Integration
	// ========================================================================

	/**
	 * Record a story choice for the current phase.
	 *
	 * @param eventId - Story event ID
	 * @param choiceId - Choice made
	 */
	recordChoice(eventId: string, choiceId: string): void {
		const progress = this.phaseProgress.get(this.currentPhase);
		if (progress) {
			progress.choices[eventId] = choiceId;
			progress.triggeredEvents.add(eventId);
		}
	}

	/**
	 * Check if a story event has been triggered in current phase.
	 *
	 * @param eventId - Story event ID
	 * @returns Whether the event has been triggered
	 */
	hasTriggeredEvent(eventId: string): boolean {
		const progress = this.phaseProgress.get(this.currentPhase);
		return progress?.triggeredEvents.has(eventId) ?? false;
	}

	/**
	 * Get choice made for a story event in current phase.
	 *
	 * @param eventId - Story event ID
	 * @returns Choice ID or undefined
	 */
	getChoice(eventId: string): string | undefined {
		const progress = this.phaseProgress.get(this.currentPhase);
		return progress?.choices[eventId];
	}

	// ========================================================================
	// Debug & Utilities
	// ========================================================================

	/**
	 * Force advance to a specific phase (debug only).
	 *
	 * @param phase - Target phase number
	 */
	debugSetPhase(phase: number): void {
		if (phase < 1 || phase > TOTAL_PHASES) return;

		// Unlock all phases up to target
		for (let i = 1; i <= phase; i++) {
			this.unlockPhase(i);
		}

		// Complete all phases before target
		for (let i = 1; i < phase; i++) {
			const progress = this.phaseProgress.get(i);
			if (progress) {
				progress.entered = true;
				progress.completed = true;
			}
		}

		// Set current phase
		this.currentPhase = phase;
		this.phaseStartTime = Date.now();
		this.currentPhaseTime = 0;

		// Mark as entered
		const progress = this.phaseProgress.get(phase);
		if (progress) {
			progress.entered = true;
			progress.timesEntered++;
			progress.lastEntered = Date.now();
			if (!progress.firstEntered) {
				progress.firstEntered = Date.now();
			}
		}
	}

	/**
	 * Get debug information about current state.
	 *
	 * @returns Debug info object
	 */
	getDebugInfo(): object {
		return {
			currentPhase: this.currentPhase,
			visualMode: this.visualMode,
			currentPhaseTime: this.currentPhaseTime,
			canAdvance: this.canAdvance,
			transitionProgress: this.transitionProgress,
			isTransitioning: this.isTransitioning,
			unlockedPhases: [...this.unlockedPhasesSet],
			phaseProgress: Object.fromEntries(
				[...this.phaseProgress].map(([id, p]) => [
					id,
					{
						entered: p.entered,
						completed: p.completed,
						timeSpent: p.timeSpent,
						bestTime: p.bestTime
					}
				])
			)
		};
	}
}
