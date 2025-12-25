/**
 * @fileoverview Narrative Manager - the heart of the story system.
 * Manages logs, dialogues, choices, and story events.
 *
 * The narrative system transforms mechanical idle gameplay into an
 * existential journey. Every milestone is accompanied by philosophical
 * reflection, and player choices shape the story path.
 *
 * Key responsibilities:
 * - Logs: Inner thoughts of the pixel at milestones
 * - Dialogues: Conversations with NPCs (Sun, Andromeda, etc.)
 * - Choices: Player agency with branching consequences
 * - Triggers: Event timing based on conditions
 * - Endings: Path tracking and ending unlocks
 *
 * @module engine/systems/NarrativeManager
 */

import type { EventManager } from '../core/EventManager';
import type { Manager } from '../models/types';
import type { Decimal } from '../utils/decimal';
import {
	type LogEntry,
	type LogDefinition,
	type Dialogue,
	type DialogueLine,
	type Choice,
	type Consequence,
	type StoryEvent,
	type StoryCondition,
	type ActiveDialogueState,
	type SerializedNarrativeState,
	type SpeakerId,
	type StoryPath,
	type EndingId,
	type LogCategory,
	SPEAKER_STYLES
} from '../models/narrative';
import { D, ZERO } from '../utils/decimal';
import {
	type EndingDefinition,
	getEndingDefinition as getEndingDef,
	getUnlockedEndings,
	calculateEndingStats,
	ALL_ENDINGS
} from '../data/endings';

// ============================================================================
// Configuration Constants
// ============================================================================

/** Interval between narrative checks in milliseconds */
const NARRATIVE_CHECK_INTERVAL = 5000; // 5 seconds

/** Maximum number of logs to keep in active history */
const MAX_ACTIVE_LOGS = 100;

/** Default typewriter speed (characters per second) */
const DEFAULT_TYPEWRITER_SPEED = 30;

/** Default delay between dialogue lines in milliseconds */
const DEFAULT_LINE_DELAY = 1500;

// ============================================================================
// Context Interface
// ============================================================================

/**
 * Context interface for evaluating story conditions.
 * Allows NarrativeManager to query game state without direct coupling.
 */
export interface NarrativeContext {
	/** Get current amount of a resource */
	getResourceAmount: (resourceId: string) => Decimal;

	/** Get current phase number */
	getCurrentPhase: () => number;

	/** Get total run time in seconds */
	getRunTime: () => number;

	/** Get count of a producer */
	getProducerCount: (producerId: string) => number;

	/** Check if an upgrade is purchased */
	hasUpgrade: (upgradeId: string) => boolean;

	/** Get upgrade level */
	getUpgradeLevel: (upgradeId: string) => number;

	/** Check if an achievement is unlocked */
	hasAchievement: (achievementId: string) => boolean;
}

// ============================================================================
// NarrativeManager Class
// ============================================================================

/**
 * Narrative Manager - manages all story elements.
 *
 * Uses Svelte 5 runes for reactive state management:
 * - $state for mutable state (logs, active dialogue, flags)
 * - $derived for computed values (unread count, current path)
 *
 * @implements Manager
 */
export class NarrativeManager implements Manager {
	// ============================================================================
	// Dependencies
	// ============================================================================

	private readonly events: EventManager;
	private context: NarrativeContext | null = null;

	// ============================================================================
	// Reactive State (Svelte 5 Runes)
	// ============================================================================

	/**
	 * Log history - all triggered logs in chronological order.
	 */
	logs = $state<LogEntry[]>([]);

	/**
	 * Currently active dialogue (null if none).
	 */
	activeDialogue = $state<ActiveDialogueState | null>(null);

	/**
	 * Set of triggered one-time event IDs.
	 */
	private triggeredEvents = $state<Set<string>>(new Set());

	/**
	 * Player choices made (choiceId -> selectedOption).
	 */
	private playerChoices = $state<Map<string, string>>(new Map());

	/**
	 * Unlocked ending IDs.
	 */
	private unlockedEndings = $state<Set<EndingId>>(new Set());

	/**
	 * Story flags (key -> value).
	 */
	private flags = $state<Map<string, boolean | string | number>>(new Map());

	/**
	 * Queue of pending story events to process.
	 */
	private eventQueue = $state<StoryEvent[]>([]);

	/**
	 * Whether dialogue is paused (waiting for player input).
	 */
	dialoguePaused = $state(false);

	/**
	 * Time accumulator for narrative checks (milliseconds).
	 */
	private checkAccumulator = 0;

	/**
	 * Registered story events that can be triggered.
	 */
	private registeredEvents: Map<string, StoryEvent> = new Map();

	/**
	 * Registered log definitions.
	 */
	private logDefinitions: Map<string, LogDefinition> = new Map();

	/**
	 * Registered dialogue definitions.
	 */
	private dialogueDefinitions: Map<string, Dialogue> = new Map();

	/**
	 * Typewriter speed (characters per second).
	 */
	typewriterSpeed = $state(DEFAULT_TYPEWRITER_SPEED);

	/**
	 * Set of flag keys that should persist across rebirths (eternal flags).
	 * Flags like "ending_X_seen", "secret_X_found" should be eternal.
	 */
	private eternalFlagKeys = new Set<string>([
		// Ending-related flags
		'ending_transcendence_seen',
		'ending_consumption_seen',
		'ending_harmony_seen',
		'ending_void_seen',
		// Secret-related flags
		'secret_konami_found',
		'secret_night_owl',
		'secret_forty_two',
		'secret_dev_mode',
		'secret_hidden_message',
		'secret_speed_demon',
		'secret_zen_master',
		'secret_pixel_artist',
		'secret_memory_keeper',
		'secret_choice_explorer',
		'secret_collector',
		'secret_watcher',
		'secret_patient_one',
		'secret_true_singularity',
		'secret_glitch_hunter',
		// Meta flags
		'all_logs_viewed',
		'explored_all_branches'
	]);

	// ============================================================================
	// Derived State
	// ============================================================================

	/**
	 * Number of unread logs.
	 */
	get unreadLogCount(): number {
		return this.logs.filter((log) => !log.read).length;
	}

	/**
	 * Whether there's an active dialogue.
	 */
	get hasActiveDialogue(): boolean {
		return this.activeDialogue !== null;
	}

	/**
	 * Whether currently showing choices.
	 */
	get isShowingChoices(): boolean {
		return this.activeDialogue?.showingChoices ?? false;
	}

	/**
	 * Current story path based on choices made.
	 */
	get currentPath(): StoryPath {
		return this.calculateStoryPath();
	}

	/**
	 * All unlocked endings.
	 */
	get endings(): EndingId[] {
		return Array.from(this.unlockedEndings);
	}

	/**
	 * Get all flags as a readonly map.
	 */
	get allFlags(): ReadonlyMap<string, boolean | string | number> {
		return this.flags;
	}

	// ============================================================================
	// Constructor
	// ============================================================================

	/**
	 * Creates a new NarrativeManager.
	 *
	 * @param events - Event manager for publishing narrative events
	 */
	constructor(events: EventManager) {
		this.events = events;
	}

	// ============================================================================
	// Manager Interface Implementation
	// ============================================================================

	/**
	 * Initialize the narrative manager.
	 * Sets up event listeners and default state.
	 */
	init(): void {
		// Subscribe to phase changes for automatic story triggers
		this.events.on('phase_entered', (data) => {
			this.onPhaseEntered(data.newPhase, data.isFirstTime);
		});

		// Subscribe to resource milestones
		this.events.on('resource_changed', (data) => {
			// Milestone checks are handled in tick() to avoid too many checks
		});
	}

	/**
	 * Update narrative state each tick.
	 * Checks triggers every 5 seconds, updates dialogue animation.
	 *
	 * @param deltaTime - Time since last tick in seconds
	 */
	tick(deltaTime: number): void {
		// Update dialogue animation if active
		if (this.activeDialogue && this.activeDialogue.isTyping) {
			this.updateDialogueAnimation(deltaTime);
		}

		// Process event queue
		this.processEventQueue();

		// Check triggers periodically (every 5 seconds)
		this.checkAccumulator += deltaTime * 1000;
		if (this.checkAccumulator >= NARRATIVE_CHECK_INTERVAL) {
			this.checkAccumulator = 0;
			this.checkTriggers();
		}
	}

	/**
	 * Reset narrative state for a new run (rebirth).
	 * Clears run-specific state but preserves eternal flags.
	 */
	reset(): void {
		// Clear run state
		this.logs = [];
		this.activeDialogue = null;
		this.triggeredEvents = new Set();
		this.eventQueue = [];
		this.dialoguePaused = false;
		this.checkAccumulator = 0;

		// Preserve eternal flags, clear run-specific ones
		const preservedFlags = new Map<string, boolean | string | number>();
		for (const [key, value] of this.flags) {
			if (this.isEternalFlag(key)) {
				preservedFlags.set(key, value);
			}
		}
		this.flags = preservedFlags;

		// Clear run-specific choices but keep ones that affect eternal state
		// (Most choices are run-specific in this game design)
		this.playerChoices = new Map();
	}

	/**
	 * Check if a flag key is eternal (persists across rebirths).
	 *
	 * @param key - Flag key to check
	 * @returns Whether the flag is eternal
	 */
	isEternalFlag(key: string): boolean {
		// Check direct membership
		if (this.eternalFlagKeys.has(key)) {
			return true;
		}
		// Also check patterns: flags starting with "ending_", "secret_", "meta_" are eternal
		return (
			key.startsWith('ending_') ||
			key.startsWith('secret_') ||
			key.startsWith('meta_') ||
			key.startsWith('eternal_')
		);
	}

	/**
	 * Mark a flag key as eternal (will persist across rebirths).
	 *
	 * @param key - Flag key to mark as eternal
	 */
	markFlagAsEternal(key: string): void {
		this.eternalFlagKeys.add(key);
	}

	/**
	 * Serialize narrative state for saving.
	 */
	serialize(): SerializedNarrativeState {
		return {
			triggeredEvents: Array.from(this.triggeredEvents),
			playerChoices: Object.fromEntries(this.playerChoices),
			unlockedEndings: Array.from(this.unlockedEndings),
			flags: Object.fromEntries(this.flags),
			logHistory: this.logs.map((log) => log.id),
			lastCheckTime: Date.now()
		};
	}

	/**
	 * Deserialize and restore narrative state.
	 */
	deserialize(data: unknown): void {
		const state = data as Partial<SerializedNarrativeState>;
		if (!state || typeof state !== 'object') return;

		if (Array.isArray(state.triggeredEvents)) {
			this.triggeredEvents = new Set(state.triggeredEvents);
		}

		if (state.playerChoices && typeof state.playerChoices === 'object') {
			this.playerChoices = new Map(Object.entries(state.playerChoices));
		}

		if (Array.isArray(state.unlockedEndings)) {
			this.unlockedEndings = new Set(state.unlockedEndings as EndingId[]);
		}

		if (state.flags && typeof state.flags === 'object') {
			this.flags = new Map(Object.entries(state.flags));
		}

		// Restore log history by looking up definitions
		if (Array.isArray(state.logHistory)) {
			this.logs = state.logHistory
				.map((id) => {
					const def = this.logDefinitions.get(id);
					if (def) {
						return this.createLogEntry(def);
					}
					return null;
				})
				.filter((log): log is LogEntry => log !== null);
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
	setContext(context: NarrativeContext): void {
		this.context = context;
	}

	// ============================================================================
	// Registration Methods
	// ============================================================================

	/**
	 * Register a story event that can be triggered.
	 *
	 * @param event - Story event to register
	 */
	registerEvent(event: StoryEvent): void {
		this.registeredEvents.set(event.id, event);
	}

	/**
	 * Register multiple story events.
	 *
	 * @param events - Array of story events to register
	 */
	registerEvents(events: StoryEvent[]): void {
		for (const event of events) {
			this.registerEvent(event);
		}
	}

	/**
	 * Register a log definition.
	 *
	 * @param log - Log definition to register
	 */
	registerLog(log: LogDefinition): void {
		this.logDefinitions.set(log.id, log);
	}

	/**
	 * Register multiple log definitions.
	 *
	 * @param logs - Array of log definitions to register
	 */
	registerLogs(logs: LogDefinition[]): void {
		for (const log of logs) {
			this.registerLog(log);
		}
	}

	/**
	 * Register a dialogue definition.
	 *
	 * @param dialogue - Dialogue to register
	 */
	registerDialogue(dialogue: Dialogue): void {
		this.dialogueDefinitions.set(dialogue.id, dialogue);
	}

	/**
	 * Register multiple dialogue definitions.
	 *
	 * @param dialogues - Array of dialogues to register
	 */
	registerDialogues(dialogues: Dialogue[]): void {
		for (const dialogue of dialogues) {
			this.registerDialogue(dialogue);
		}
	}

	// ============================================================================
	// Log System
	// ============================================================================

	/**
	 * Add a log entry by ID (looks up definition).
	 *
	 * @param logId - ID of the log definition
	 * @returns Whether the log was added
	 */
	addLog(logId: string): boolean {
		const definition = this.logDefinitions.get(logId);
		if (!definition) {
			console.warn(`[NarrativeManager] Log definition not found: ${logId}`);
			return false;
		}

		return this.addLogFromDefinition(definition);
	}

	/**
	 * Add a log entry from a definition.
	 *
	 * @param definition - Log definition
	 * @returns Whether the log was added
	 */
	addLogFromDefinition(definition: LogDefinition): boolean {
		const entry = this.createLogEntry(definition);
		this.logs = [...this.logs, entry];

		// Trim old logs if exceeding max
		if (this.logs.length > MAX_ACTIVE_LOGS) {
			this.logs = this.logs.slice(-MAX_ACTIVE_LOGS);
		}

		// Emit event
		this.events.emit('story_triggered', {
			storyId: definition.id,
			type: 'log',
			pausesGame: false
		});

		return true;
	}

	/**
	 * Add a log entry with inline content (no definition needed).
	 *
	 * @param id - Unique identifier
	 * @param text - Log text
	 * @param category - Log category
	 * @param icon - Optional icon
	 */
	addInlineLog(id: string, text: string, category: LogCategory = 'thought', icon?: string): void {
		const entry: LogEntry = {
			id,
			text,
			phase: this.context?.getCurrentPhase() ?? 1,
			timestamp: Date.now(),
			category,
			icon,
			read: false
		};

		this.logs = [...this.logs, entry];

		// Trim old logs if exceeding max
		if (this.logs.length > MAX_ACTIVE_LOGS) {
			this.logs = this.logs.slice(-MAX_ACTIVE_LOGS);
		}

		// Emit event
		this.events.emit('story_triggered', {
			storyId: id,
			type: 'log',
			pausesGame: false
		});
	}

	/**
	 * Mark a log as read.
	 *
	 * @param logId - ID of the log to mark
	 */
	markLogRead(logId: string): void {
		this.logs = this.logs.map((log) => (log.id === logId ? { ...log, read: true } : log));
	}

	/**
	 * Mark all logs as read.
	 */
	markAllLogsRead(): void {
		this.logs = this.logs.map((log) => ({ ...log, read: true }));
	}

	/**
	 * Get logs filtered by category.
	 *
	 * @param category - Category to filter by
	 */
	getLogsByCategory(category: LogCategory): LogEntry[] {
		return this.logs.filter((log) => log.category === category);
	}

	/**
	 * Get logs filtered by phase.
	 *
	 * @param phase - Phase number to filter by
	 */
	getLogsByPhase(phase: number): LogEntry[] {
		return this.logs.filter((log) => log.phase === phase);
	}

	/**
	 * Create a log entry from a definition.
	 */
	private createLogEntry(definition: LogDefinition): LogEntry {
		return {
			id: definition.id,
			text: definition.text,
			phase: definition.phase ?? this.context?.getCurrentPhase() ?? 1,
			timestamp: Date.now(),
			category: definition.category,
			icon: definition.icon,
			read: false
		};
	}

	// ============================================================================
	// Dialogue System
	// ============================================================================

	/**
	 * Start a dialogue by ID.
	 *
	 * @param dialogueId - ID of the dialogue to start
	 * @returns Whether the dialogue was started
	 */
	startDialogue(dialogueId: string): boolean {
		const dialogue = this.dialogueDefinitions.get(dialogueId);
		if (!dialogue) {
			console.warn(`[NarrativeManager] Dialogue not found: ${dialogueId}`);
			return false;
		}

		return this.startDialogueFromDefinition(dialogue);
	}

	/**
	 * Start a dialogue from a definition.
	 *
	 * @param dialogue - Dialogue to start
	 * @returns Whether the dialogue was started
	 */
	startDialogueFromDefinition(dialogue: Dialogue): boolean {
		if (this.activeDialogue) {
			// Queue if another dialogue is active
			console.warn('[NarrativeManager] Dialogue already active, queueing');
			return false;
		}

		this.activeDialogue = {
			dialogue,
			currentLineIndex: 0,
			isTyping: true,
			currentCharIndex: 0,
			displayedText: '',
			waitingForInput: false,
			showingChoices: false,
			startedAt: Date.now()
		};

		// Emit story triggered event
		this.events.emit('story_triggered', {
			storyId: dialogue.id,
			type: dialogue.choices ? 'choice' : 'dialogue',
			pausesGame: dialogue.pausesGame
		});

		// Pause game if needed
		if (dialogue.pausesGame) {
			this.events.emit('game_paused', {
				reason: 'story',
				timestamp: Date.now()
			});
		}

		return true;
	}

	/**
	 * Skip to the end of current line (finish typing).
	 */
	skipTyping(): void {
		if (!this.activeDialogue || !this.activeDialogue.isTyping) return;

		const currentLine = this.getCurrentLine();
		if (currentLine) {
			this.activeDialogue.displayedText = currentLine.text;
			this.activeDialogue.currentCharIndex = currentLine.text.length;
			this.activeDialogue.isTyping = false;
			this.activeDialogue.waitingForInput = true;
		}
	}

	/**
	 * Advance to the next line or finish dialogue.
	 */
	advanceDialogue(): void {
		if (!this.activeDialogue) return;

		// If still typing, skip to end first
		if (this.activeDialogue.isTyping) {
			this.skipTyping();
			return;
		}

		const dialogue = this.activeDialogue.dialogue;
		const nextIndex = this.activeDialogue.currentLineIndex + 1;

		if (nextIndex < dialogue.lines.length) {
			// Move to next line
			this.activeDialogue.currentLineIndex = nextIndex;
			this.activeDialogue.currentCharIndex = 0;
			this.activeDialogue.displayedText = '';
			this.activeDialogue.isTyping = true;
			this.activeDialogue.waitingForInput = false;
		} else {
			// End of lines - show choices or complete
			if (dialogue.choices && dialogue.choices.length > 0) {
				this.activeDialogue.showingChoices = true;
				this.activeDialogue.waitingForInput = false;
			} else {
				this.completeDialogue();
			}
		}
	}

	/**
	 * Make a choice in the active dialogue.
	 *
	 * @param choiceId - ID of the choice selected
	 */
	makeChoice(choiceId: string): void {
		if (!this.activeDialogue || !this.activeDialogue.showingChoices) return;

		const dialogue = this.activeDialogue.dialogue;
		const choice = dialogue.choices?.find((c) => c.id === choiceId);

		if (!choice) {
			console.warn(`[NarrativeManager] Choice not found: ${choiceId}`);
			return;
		}

		// Store the choice
		this.playerChoices.set(choiceId, choice.label);

		// Apply consequences
		this.applyConsequences(choice.consequences);

		// Complete the dialogue
		this.completeDialogue(choiceId);
	}

	/**
	 * Complete the active dialogue.
	 *
	 * @param choiceMade - ID of choice made (if any)
	 */
	private completeDialogue(choiceMade?: string): void {
		if (!this.activeDialogue) return;

		const dialogue = this.activeDialogue.dialogue;

		// Emit completion event
		this.events.emit('story_completed', {
			storyId: dialogue.id,
			choiceMade
		});

		// Handle completion callback
		if (dialogue.onCompleteEvent) {
			this.triggerEvent(dialogue.onCompleteEvent);
		}

		// Resume game if it was paused
		if (dialogue.pausesGame) {
			this.events.emit('game_resumed', {
				pauseDuration: Date.now() - this.activeDialogue.startedAt,
				timestamp: Date.now()
			});
		}

		// Clear active dialogue
		this.activeDialogue = null;
	}

	/**
	 * Get the current dialogue line.
	 */
	getCurrentLine(): DialogueLine | null {
		if (!this.activeDialogue) return null;
		return this.activeDialogue.dialogue.lines[this.activeDialogue.currentLineIndex] ?? null;
	}

	/**
	 * Get speaker style for current line.
	 */
	getCurrentSpeakerStyle() {
		const line = this.getCurrentLine();
		if (!line || !this.activeDialogue) return SPEAKER_STYLES.pixel;

		const speakerId = line.speaker ?? this.activeDialogue.dialogue.speaker;
		return SPEAKER_STYLES[speakerId] ?? SPEAKER_STYLES.unknown;
	}

	/**
	 * Update dialogue animation (typewriter effect).
	 */
	private updateDialogueAnimation(deltaTime: number): void {
		if (!this.activeDialogue || !this.activeDialogue.isTyping) return;

		const line = this.getCurrentLine();
		if (!line) return;

		const charsToAdd = Math.floor(deltaTime * this.typewriterSpeed);
		const newCharIndex = Math.min(
			this.activeDialogue.currentCharIndex + Math.max(1, charsToAdd),
			line.text.length
		);

		this.activeDialogue.currentCharIndex = newCharIndex;
		this.activeDialogue.displayedText = line.text.substring(0, newCharIndex);

		// Check if finished typing this line
		if (newCharIndex >= line.text.length) {
			this.activeDialogue.isTyping = false;
			this.activeDialogue.waitingForInput = true;
		}
	}

	// ============================================================================
	// Choice & Consequence System
	// ============================================================================

	/**
	 * Get a player choice value.
	 *
	 * @param choiceId - ID of the choice
	 * @returns The selected option or undefined
	 */
	getChoice(choiceId: string): string | undefined {
		return this.playerChoices.get(choiceId);
	}

	/**
	 * Check if a choice has been made.
	 *
	 * @param choiceId - ID of the choice
	 */
	hasChoice(choiceId: string): boolean {
		return this.playerChoices.has(choiceId);
	}

	/**
	 * Get the total number of unique choices made.
	 *
	 * @returns Number of unique choices made
	 */
	getChoiceCount(): number {
		return this.playerChoices.size;
	}

	/**
	 * Apply consequences from a choice.
	 */
	private applyConsequences(consequences: Consequence[]): void {
		for (const consequence of consequences) {
			this.applyConsequence(consequence);
		}
	}

	/**
	 * Apply a single consequence.
	 */
	private applyConsequence(consequence: Consequence): void {
		switch (consequence.type) {
			case 'flag_set': {
				const payload = consequence.payload as { key: string; value?: boolean | string | number };
				this.flags.set(payload.key, payload.value ?? true);
				break;
			}
			case 'flag_unset': {
				const payload = consequence.payload as { key: string };
				this.flags.delete(payload.key);
				break;
			}
			case 'ending_unlock': {
				const payload = consequence.payload as { endingId: string };
				this.unlockedEndings.add(payload.endingId as EndingId);
				break;
			}
			case 'log_add': {
				const payload = consequence.payload as { logId: string };
				this.addLog(payload.logId);
				break;
			}
			case 'dialogue_trigger': {
				const payload = consequence.payload as { dialogueId: string };
				// Queue for next tick to avoid recursion
				setTimeout(() => this.startDialogue(payload.dialogueId), 0);
				break;
			}
			// Other consequence types are handled by other managers through events
			case 'resource_add':
			case 'resource_multiply':
			case 'achievement_unlock':
			case 'multiplier_add':
			case 'phase_skip': {
				// Emit event for other managers to handle
				this.events.emit('consequence_requested', {
					sourceId: 'narrative_consequence',
					type: consequence.type as
						| 'resource_add'
						| 'resource_multiply'
						| 'achievement_unlock'
						| 'multiplier_add'
						| 'phase_skip'
						| 'upgrade_unlock'
						| 'producer_unlock',
					payload: consequence.payload as Record<string, unknown>
				});
				break;
			}
			case 'upgrade_unlock':
			case 'producer_unlock': {
				// Emit unlock event for other managers
				this.events.emit('consequence_requested', {
					sourceId: 'narrative_consequence',
					type: consequence.type as 'upgrade_unlock' | 'producer_unlock',
					payload: consequence.payload as Record<string, unknown>
				});
				break;
			}
		}
	}

	// ============================================================================
	// Flag System
	// ============================================================================

	/**
	 * Set a story flag.
	 *
	 * @param key - Flag key
	 * @param value - Flag value
	 */
	setFlag(key: string, value: boolean | string | number = true): void {
		this.flags.set(key, value);
	}

	/**
	 * Get a story flag.
	 *
	 * @param key - Flag key
	 * @returns Flag value or undefined
	 */
	getFlag(key: string): boolean | string | number | undefined {
		return this.flags.get(key);
	}

	/**
	 * Check if a flag is set (truthy).
	 *
	 * @param key - Flag key
	 */
	hasFlag(key: string): boolean {
		const value = this.flags.get(key);
		return value !== undefined && value !== false && value !== 0 && value !== '';
	}

	/**
	 * Clear a story flag.
	 *
	 * @param key - Flag key
	 */
	clearFlag(key: string): void {
		this.flags.delete(key);
	}

	// ============================================================================
	// Trigger System
	// ============================================================================

	/**
	 * Trigger a story event by ID.
	 *
	 * @param eventId - ID of the event to trigger
	 * @returns Whether the event was triggered
	 */
	triggerEvent(eventId: string): boolean {
		const event = this.registeredEvents.get(eventId);
		if (!event) {
			console.warn(`[NarrativeManager] Event not found: ${eventId}`);
			return false;
		}

		// Skip if already triggered and one-time
		if (event.oneTime && this.triggeredEvents.has(eventId)) {
			return false;
		}

		return this.processEvent(event);
	}

	/**
	 * Check all registered triggers and process matching events.
	 */
	private checkTriggers(): void {
		if (!this.context) return;

		for (const [eventId, event] of this.registeredEvents) {
			// Skip if already triggered and one-time
			if (event.oneTime && this.triggeredEvents.has(eventId)) {
				continue;
			}

			// Check all conditions
			if (this.evaluateConditions(event.triggers)) {
				this.queueEvent(event);
			}
		}
	}

	/**
	 * Queue an event for processing.
	 */
	private queueEvent(event: StoryEvent): void {
		// Check if already in queue
		if (this.eventQueue.find((e) => e.id === event.id)) {
			return;
		}

		// Add to queue sorted by priority
		this.eventQueue = [...this.eventQueue, event].sort((a, b) => b.priority - a.priority);
	}

	/**
	 * Process queued events.
	 */
	private processEventQueue(): void {
		if (this.eventQueue.length === 0) return;

		// Don't process if dialogue is active
		if (this.activeDialogue) return;

		// Process first event in queue
		const event = this.eventQueue[0];
		if (this.processEvent(event)) {
			this.eventQueue = this.eventQueue.slice(1);
		}
	}

	/**
	 * Process a story event.
	 */
	private processEvent(event: StoryEvent): boolean {
		// Mark as triggered for one-time events
		if (event.oneTime) {
			this.triggeredEvents.add(event.id);
		}

		// Apply delay if specified
		if (event.delay > 0) {
			setTimeout(() => this.executeEvent(event), event.delay);
			return true;
		}

		return this.executeEvent(event);
	}

	/**
	 * Execute a story event.
	 */
	private executeEvent(event: StoryEvent): boolean {
		switch (event.type) {
			case 'log':
				return this.addLog(event.contentId);

			case 'dialogue':
			case 'choice':
				return this.startDialogue(event.contentId);

			case 'revelation':
			case 'cutscene': {
				// Emit special event for UI to handle revelations/cutscenes differently
				// These are visually distinct from regular dialogues - they may include
				// special animations, full-screen overlays, or other visual effects
				this.events.emit('revelation_triggered', {
					contentId: event.contentId,
					type: event.type,
					pausesGame: true,
					title: event.title
				});
				// Also start the dialogue content for the revelation
				return this.startDialogue(event.contentId);
			}

			default:
				console.warn(`[NarrativeManager] Unknown event type: ${event.type}`);
				return false;
		}
	}

	/**
	 * Check if an event has been triggered.
	 *
	 * @param eventId - Event ID to check
	 */
	hasTriggered(eventId: string): boolean {
		return this.triggeredEvents.has(eventId);
	}

	// ============================================================================
	// Condition Evaluation
	// ============================================================================

	/**
	 * Evaluate a list of conditions (all must pass).
	 */
	private evaluateConditions(conditions: StoryCondition[]): boolean {
		if (!this.context) return false;
		return conditions.every((condition) => this.evaluateCondition(condition));
	}

	/**
	 * Evaluate a single condition.
	 */
	private evaluateCondition(condition: StoryCondition): boolean {
		if (!this.context) return false;

		switch (condition.type) {
			case 'resource_reached': {
				const params = condition.params as {
					resourceId: string;
					amount: number | string;
					comparison?: string;
				};
				const current = this.context.getResourceAmount(params.resourceId);
				const target = D(params.amount);
				const cmp = params.comparison ?? 'gte';
				return this.compare(current, target, cmp);
			}

			case 'phase_entered':
			case 'phase_completed': {
				const params = condition.params as { phase: number; completed?: boolean };
				const currentPhase = this.context.getCurrentPhase();
				if (condition.type === 'phase_completed') {
					return currentPhase > params.phase;
				}
				return currentPhase >= params.phase;
			}

			case 'time_passed': {
				const params = condition.params as { seconds: number; comparison?: string };
				const runTime = this.context.getRunTime();
				const cmp = params.comparison ?? 'gte';
				return this.compareNumbers(runTime, params.seconds, cmp);
			}

			case 'producer_count': {
				const params = condition.params as {
					producerId: string;
					count: number;
					comparison?: string;
				};
				const current = this.context.getProducerCount(params.producerId);
				const cmp = params.comparison ?? 'gte';
				return this.compareNumbers(current, params.count, cmp);
			}

			case 'upgrade_purchased': {
				const params = condition.params as { upgradeId: string; level?: number };
				if (params.level !== undefined) {
					return this.context.getUpgradeLevel(params.upgradeId) >= params.level;
				}
				return this.context.hasUpgrade(params.upgradeId);
			}

			case 'achievement_unlocked': {
				const params = condition.params as { achievementId: string };
				return this.context.hasAchievement(params.achievementId);
			}

			case 'flag_set': {
				const params = condition.params as { key: string; value?: boolean | string | number };
				if (params.value !== undefined) {
					return this.flags.get(params.key) === params.value;
				}
				return this.hasFlag(params.key);
			}

			case 'choice_made': {
				const params = condition.params as { choiceId: string; selectedOption?: string };
				if (params.selectedOption) {
					return this.playerChoices.get(params.choiceId) === params.selectedOption;
				}
				return this.playerChoices.has(params.choiceId);
			}

			case 'manual':
				return false; // Manual events are triggered explicitly

			case 'condition': {
				// Custom condition - would need to be registered
				console.warn('[NarrativeManager] Custom conditions not yet implemented');
				return false;
			}

			default:
				return false;
		}
	}

	/**
	 * Compare two Decimal values.
	 */
	private compare(a: Decimal, b: Decimal, comparison: string): boolean {
		switch (comparison) {
			case 'gte':
				return a.gte(b);
			case 'lte':
				return a.lte(b);
			case 'gt':
				return a.gt(b);
			case 'lt':
				return a.lt(b);
			case 'eq':
				return a.eq(b);
			default:
				return a.gte(b);
		}
	}

	/**
	 * Compare two numbers.
	 */
	private compareNumbers(a: number, b: number, comparison: string): boolean {
		switch (comparison) {
			case 'gte':
				return a >= b;
			case 'lte':
				return a <= b;
			case 'gt':
				return a > b;
			case 'lt':
				return a < b;
			case 'eq':
				return a === b;
			default:
				return a >= b;
		}
	}

	// ============================================================================
	// Story Path & Endings
	// ============================================================================

	/**
	 * Calculate current story path based on choices.
	 */
	private calculateStoryPath(): StoryPath {
		let peacefulScore = 0;
		let consumingScore = 0;

		// Count choices that indicate path
		for (const [choiceId, option] of this.playerChoices) {
			// Check flags for path indicators
			if (this.flags.has('peaceful_path')) peacefulScore++;
			if (this.flags.has('consuming_path')) consumingScore++;
			if (this.flags.has('coexist')) peacefulScore++;
			if (this.flags.has('consumed_earth')) consumingScore++;
		}

		// Also check explicit path flags
		if (this.flags.get('peaceful_path') === true) peacefulScore += 5;
		if (this.flags.get('consuming_path') === true) consumingScore += 5;

		if (peacefulScore > consumingScore + 2) return 'peaceful';
		if (consumingScore > peacefulScore + 2) return 'consuming';
		if (peacefulScore > 0 || consumingScore > 0) return 'neutral';
		return 'unknown';
	}

	/**
	 * Unlock an ending.
	 *
	 * @param endingId - Ending to unlock
	 */
	unlockEnding(endingId: EndingId): void {
		if (this.unlockedEndings.has(endingId)) return;

		this.unlockedEndings.add(endingId);

		// Get ending details and emit event
		const endingDef = getEndingDef(endingId);
		this.events.emit('ending_unlocked', {
			endingId,
			endingName: endingDef?.name ?? endingId,
			endingType: endingDef?.type ?? 'standard',
			path: endingDef?.path ?? 'unknown',
			ppBonus: endingDef?.unlocks.ppBonus ?? 0,
			timestamp: Date.now()
		});

		// Set eternal flag for this ending
		this.setFlag(`ending_${endingId}_seen`, true);
	}

	/**
	 * Check if an ending is unlocked.
	 *
	 * @param endingId - Ending to check
	 */
	hasEnding(endingId: EndingId): boolean {
		return this.unlockedEndings.has(endingId);
	}

	/**
	 * Get the full definition for an ending.
	 *
	 * @param endingId - Ending ID to look up
	 * @returns Ending definition or undefined if not found
	 */
	getEndingDefinition(endingId: EndingId): EndingDefinition | undefined {
		return getEndingDef(endingId);
	}

	/**
	 * Get all ending definitions with their unlock status.
	 *
	 * @returns Array of endings with unlock status
	 */
	getAllEndingsWithStatus(): Array<{ ending: EndingDefinition; unlocked: boolean }> {
		return ALL_ENDINGS.map((ending) => ({
			ending,
			unlocked: this.unlockedEndings.has(ending.id as EndingId)
		}));
	}

	/**
	 * Get statistics about ending completion.
	 *
	 * @returns Ending completion statistics
	 */
	getEndingStats(): {
		totalUnlocked: number;
		totalPossible: number;
		standardUnlocked: number;
		trueEndingSeen: boolean;
		completionPercentage: number;
	} {
		// Convert unlocked endings to achievement IDs for the helper function
		const achievementIds = new Set<string>();
		for (const endingId of this.unlockedEndings) {
			const def = getEndingDef(endingId);
			if (def?.unlocks.achievement) {
				achievementIds.add(def.unlocks.achievement);
			}
		}

		const stats = calculateEndingStats(achievementIds);
		return {
			totalUnlocked: this.unlockedEndings.size,
			totalPossible: ALL_ENDINGS.length,
			standardUnlocked: stats.standardUnlocked,
			trueEndingSeen: stats.trueEndingSeen,
			completionPercentage: (this.unlockedEndings.size / ALL_ENDINGS.length) * 100
		};
	}

	/**
	 * Get details for all unlocked endings.
	 *
	 * @returns Array of unlocked ending definitions
	 */
	getUnlockedEndingDetails(): EndingDefinition[] {
		const details: EndingDefinition[] = [];
		for (const endingId of this.unlockedEndings) {
			const def = getEndingDef(endingId);
			if (def) {
				details.push(def);
			}
		}
		return details;
	}

	// ============================================================================
	// Event Handlers
	// ============================================================================

	/**
	 * Handle phase entered event.
	 */
	private onPhaseEntered(phase: number, isFirstTime: boolean): void {
		if (!isFirstTime) return;

		// Trigger phase-specific events
		for (const [eventId, event] of this.registeredEvents) {
			if (event.phase === phase) {
				// Check if trigger includes phase_entered
				const hasPhaseTrigger = event.triggers.some(
					(t) =>
						t.type === 'phase_entered' && (t.params as { phase: number }).phase === phase
				);

				if (hasPhaseTrigger && !this.triggeredEvents.has(eventId)) {
					this.queueEvent(event);
				}
			}
		}
	}
}
