/**
 * @fileoverview Unit tests for NarrativeManager.
 * Tests log system, dialogue system, choices, triggers, and serialization.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NarrativeManager, type NarrativeContext } from '../lib/engine/systems/NarrativeManager.svelte';
import { EventManager } from '../lib/engine/core/EventManager';
import { D, ZERO } from '../lib/engine/utils/decimal';
import type {
	LogDefinition,
	Dialogue,
	StoryEvent,
	Choice,
	Consequence,
	EndingId
} from '../lib/engine/models/narrative';

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Create a mock NarrativeContext for testing.
 */
function createMockContext(overrides: Partial<NarrativeContext> = {}): NarrativeContext {
	return {
		getResourceAmount: vi.fn().mockReturnValue(ZERO),
		getCurrentPhase: vi.fn().mockReturnValue(1),
		getRunTime: vi.fn().mockReturnValue(0),
		getProducerCount: vi.fn().mockReturnValue(0),
		hasUpgrade: vi.fn().mockReturnValue(false),
		getUpgradeLevel: vi.fn().mockReturnValue(0),
		hasAchievement: vi.fn().mockReturnValue(false),
		...overrides
	};
}

/**
 * Create a test log definition.
 */
function createTestLog(id: string, text: string = 'Test log'): LogDefinition {
	return {
		id,
		text,
		category: 'thought',
		phase: 1
	};
}

/**
 * Create a test dialogue.
 */
function createTestDialogue(
	id: string,
	options: Partial<Dialogue> = {}
): Dialogue {
	return {
		id,
		speaker: 'pixel',
		lines: [
			{ text: 'First line', delay: 1000 },
			{ text: 'Second line', delay: 1000 }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		canSkipLines: true,
		...options
	};
}

/**
 * Create a test story event.
 */
function createTestEvent(id: string, options: Partial<StoryEvent> = {}): StoryEvent {
	return {
		id,
		type: 'log',
		triggers: [],
		oneTime: true,
		repeatable: false,
		contentId: 'test_log',
		priority: 5,
		delay: 0,
		pausesGame: false,
		...options
	};
}

/**
 * Create a test choice.
 */
function createTestChoice(
	id: string,
	label: string,
	consequences: Consequence[] = []
): Choice {
	return {
		id,
		label,
		consequences
	};
}

// ============================================================================
// NarrativeManager Tests
// ============================================================================

describe('NarrativeManager', () => {
	let eventManager: EventManager;
	let narrativeManager: NarrativeManager;
	let mockContext: NarrativeContext;

	beforeEach(() => {
		eventManager = new EventManager(false);
		narrativeManager = new NarrativeManager(eventManager);
		mockContext = createMockContext();
		narrativeManager.setContext(mockContext);
	});

	// ============================================================================
	// Initialization Tests
	// ============================================================================

	describe('Initialization', () => {
		it('should start with empty logs', () => {
			expect(narrativeManager.logs).toHaveLength(0);
		});

		it('should start with no active dialogue', () => {
			expect(narrativeManager.activeDialogue).toBeNull();
			expect(narrativeManager.hasActiveDialogue).toBe(false);
		});

		it('should start with unknown path', () => {
			expect(narrativeManager.currentPath).toBe('unknown');
		});

		it('should start with no endings', () => {
			expect(narrativeManager.endings).toHaveLength(0);
		});

		it('should start with no unread logs', () => {
			expect(narrativeManager.unreadLogCount).toBe(0);
		});
	});

	// ============================================================================
	// Log System Tests
	// ============================================================================

	describe('Log System', () => {
		beforeEach(() => {
			narrativeManager.init();
		});

		it('should add a log from definition', () => {
			const logDef = createTestLog('log_001', 'I exist.');
			narrativeManager.registerLog(logDef);

			const added = narrativeManager.addLog('log_001');

			expect(added).toBe(true);
			expect(narrativeManager.logs).toHaveLength(1);
			expect(narrativeManager.logs[0].text).toBe('I exist.');
		});

		it('should not add log if definition not found', () => {
			const added = narrativeManager.addLog('nonexistent_log');

			expect(added).toBe(false);
			expect(narrativeManager.logs).toHaveLength(0);
		});

		it('should add inline log without definition', () => {
			narrativeManager.addInlineLog('inline_001', 'Inline thought', 'revelation');

			expect(narrativeManager.logs).toHaveLength(1);
			expect(narrativeManager.logs[0].text).toBe('Inline thought');
			expect(narrativeManager.logs[0].category).toBe('revelation');
		});

		it('should register multiple logs', () => {
			const logs = [
				createTestLog('log_001', 'First'),
				createTestLog('log_002', 'Second'),
				createTestLog('log_003', 'Third')
			];
			narrativeManager.registerLogs(logs);

			narrativeManager.addLog('log_001');
			narrativeManager.addLog('log_002');
			narrativeManager.addLog('log_003');

			expect(narrativeManager.logs).toHaveLength(3);
		});

		it('should mark log as read', () => {
			narrativeManager.addInlineLog('log_001', 'Test');

			expect(narrativeManager.logs[0].read).toBe(false);

			narrativeManager.markLogRead('log_001');

			expect(narrativeManager.logs[0].read).toBe(true);
		});

		it('should mark all logs as read', () => {
			narrativeManager.addInlineLog('log_001', 'First');
			narrativeManager.addInlineLog('log_002', 'Second');

			expect(narrativeManager.unreadLogCount).toBe(2);

			narrativeManager.markAllLogsRead();

			expect(narrativeManager.unreadLogCount).toBe(0);
		});

		it('should filter logs by category', () => {
			narrativeManager.addInlineLog('log_001', 'Thought', 'thought');
			narrativeManager.addInlineLog('log_002', 'Discovery', 'discovery');
			narrativeManager.addInlineLog('log_003', 'Another thought', 'thought');

			const thoughts = narrativeManager.getLogsByCategory('thought');

			expect(thoughts).toHaveLength(2);
		});

		it('should filter logs by phase', () => {
			mockContext.getCurrentPhase = vi.fn().mockReturnValue(1);
			narrativeManager.addInlineLog('log_001', 'Phase 1 log');

			mockContext.getCurrentPhase = vi.fn().mockReturnValue(2);
			narrativeManager.addInlineLog('log_002', 'Phase 2 log');

			const phase1Logs = narrativeManager.getLogsByPhase(1);

			expect(phase1Logs).toHaveLength(1);
			expect(phase1Logs[0].text).toBe('Phase 1 log');
		});

		it('should emit story_triggered event on log add', () => {
			const listener = vi.fn();
			eventManager.on('story_triggered', listener);

			narrativeManager.addInlineLog('log_001', 'Test');

			expect(listener).toHaveBeenCalledWith(
				expect.objectContaining({
					storyId: 'log_001',
					type: 'log'
				})
			);
		});

		it('should trim logs when exceeding max (100)', () => {
			// Add 105 logs
			for (let i = 0; i < 105; i++) {
				narrativeManager.addInlineLog(`log_${i}`, `Log ${i}`);
			}

			expect(narrativeManager.logs.length).toBeLessThanOrEqual(100);
		});
	});

	// ============================================================================
	// Dialogue System Tests
	// ============================================================================

	describe('Dialogue System', () => {
		beforeEach(() => {
			narrativeManager.init();
		});

		it('should start dialogue from definition', () => {
			const dialogue = createTestDialogue('dialogue_001');
			narrativeManager.registerDialogue(dialogue);

			const started = narrativeManager.startDialogue('dialogue_001');

			expect(started).toBe(true);
			expect(narrativeManager.hasActiveDialogue).toBe(true);
			expect(narrativeManager.activeDialogue?.dialogue.id).toBe('dialogue_001');
		});

		it('should not start dialogue if not found', () => {
			const started = narrativeManager.startDialogue('nonexistent');

			expect(started).toBe(false);
			expect(narrativeManager.hasActiveDialogue).toBe(false);
		});

		it('should not start dialogue if one is already active', () => {
			const dialogue1 = createTestDialogue('dialogue_001');
			const dialogue2 = createTestDialogue('dialogue_002');
			narrativeManager.registerDialogue(dialogue1);
			narrativeManager.registerDialogue(dialogue2);

			narrativeManager.startDialogue('dialogue_001');
			const started = narrativeManager.startDialogue('dialogue_002');

			expect(started).toBe(false);
			expect(narrativeManager.activeDialogue?.dialogue.id).toBe('dialogue_001');
		});

		it('should start with first line being typed', () => {
			const dialogue = createTestDialogue('dialogue_001');
			narrativeManager.registerDialogue(dialogue);
			narrativeManager.startDialogue('dialogue_001');

			expect(narrativeManager.activeDialogue?.currentLineIndex).toBe(0);
			expect(narrativeManager.activeDialogue?.isTyping).toBe(true);
			expect(narrativeManager.activeDialogue?.displayedText).toBe('');
		});

		it('should get current line', () => {
			const dialogue = createTestDialogue('dialogue_001');
			narrativeManager.registerDialogue(dialogue);
			narrativeManager.startDialogue('dialogue_001');

			const line = narrativeManager.getCurrentLine();

			expect(line).not.toBeNull();
			expect(line?.text).toBe('First line');
		});

		it('should skip typing to show full line', () => {
			const dialogue = createTestDialogue('dialogue_001');
			narrativeManager.registerDialogue(dialogue);
			narrativeManager.startDialogue('dialogue_001');

			narrativeManager.skipTyping();

			expect(narrativeManager.activeDialogue?.displayedText).toBe('First line');
			expect(narrativeManager.activeDialogue?.isTyping).toBe(false);
			expect(narrativeManager.activeDialogue?.waitingForInput).toBe(true);
		});

		it('should advance to next line', () => {
			const dialogue = createTestDialogue('dialogue_001');
			narrativeManager.registerDialogue(dialogue);
			narrativeManager.startDialogue('dialogue_001');

			// Skip typing of first line
			narrativeManager.skipTyping();
			// Advance to next line
			narrativeManager.advanceDialogue();

			expect(narrativeManager.activeDialogue?.currentLineIndex).toBe(1);
			expect(narrativeManager.activeDialogue?.isTyping).toBe(true);
		});

		it('should complete dialogue after last line', () => {
			const dialogue = createTestDialogue('dialogue_001');
			narrativeManager.registerDialogue(dialogue);
			narrativeManager.startDialogue('dialogue_001');

			// Skip and advance through all lines
			narrativeManager.skipTyping();
			narrativeManager.advanceDialogue();
			narrativeManager.skipTyping();
			narrativeManager.advanceDialogue();

			expect(narrativeManager.hasActiveDialogue).toBe(false);
		});

		it('should show choices at end if dialogue has choices', () => {
			const choices: Choice[] = [
				createTestChoice('choice_a', 'Option A'),
				createTestChoice('choice_b', 'Option B')
			];
			const dialogue = createTestDialogue('dialogue_001', { choices });
			narrativeManager.registerDialogue(dialogue);
			narrativeManager.startDialogue('dialogue_001');

			// Skip through all lines
			narrativeManager.skipTyping();
			narrativeManager.advanceDialogue();
			narrativeManager.skipTyping();
			narrativeManager.advanceDialogue();

			expect(narrativeManager.activeDialogue?.showingChoices).toBe(true);
			expect(narrativeManager.isShowingChoices).toBe(true);
		});

		it('should emit game_paused if dialogue pauses game', () => {
			const listener = vi.fn();
			eventManager.on('game_paused', listener);

			const dialogue = createTestDialogue('dialogue_001', { pausesGame: true });
			narrativeManager.registerDialogue(dialogue);
			narrativeManager.startDialogue('dialogue_001');

			expect(listener).toHaveBeenCalledWith(
				expect.objectContaining({ reason: 'story' })
			);
		});

		it('should emit story_completed on dialogue completion', () => {
			const listener = vi.fn();
			eventManager.on('story_completed', listener);

			const dialogue = createTestDialogue('dialogue_001');
			narrativeManager.registerDialogue(dialogue);
			narrativeManager.startDialogue('dialogue_001');

			// Complete dialogue
			narrativeManager.skipTyping();
			narrativeManager.advanceDialogue();
			narrativeManager.skipTyping();
			narrativeManager.advanceDialogue();

			expect(listener).toHaveBeenCalledWith(
				expect.objectContaining({ storyId: 'dialogue_001' })
			);
		});

		it('should update dialogue animation during tick', () => {
			const dialogue = createTestDialogue('dialogue_001');
			narrativeManager.registerDialogue(dialogue);
			narrativeManager.startDialogue('dialogue_001');

			// Simulate time passing with high typewriter speed
			narrativeManager.typewriterSpeed = 100;
			narrativeManager.tick(1); // 1 second should type 100 chars

			expect(narrativeManager.activeDialogue?.displayedText.length).toBeGreaterThan(0);
		});
	});

	// ============================================================================
	// Choice System Tests
	// ============================================================================

	describe('Choice System', () => {
		beforeEach(() => {
			narrativeManager.init();
		});

		it('should make a choice and store it', () => {
			const choices: Choice[] = [
				createTestChoice('choice_a', 'Option A'),
				createTestChoice('choice_b', 'Option B')
			];
			const dialogue = createTestDialogue('dialogue_001', { choices });
			narrativeManager.registerDialogue(dialogue);
			narrativeManager.startDialogue('dialogue_001');

			// Get to choices
			narrativeManager.skipTyping();
			narrativeManager.advanceDialogue();
			narrativeManager.skipTyping();
			narrativeManager.advanceDialogue();

			narrativeManager.makeChoice('choice_a');

			expect(narrativeManager.getChoice('choice_a')).toBe('Option A');
			expect(narrativeManager.hasChoice('choice_a')).toBe(true);
		});

		it('should complete dialogue after choice', () => {
			const choices: Choice[] = [createTestChoice('choice_a', 'Option A')];
			const dialogue = createTestDialogue('dialogue_001', { choices });
			narrativeManager.registerDialogue(dialogue);
			narrativeManager.startDialogue('dialogue_001');

			// Get to choices
			narrativeManager.skipTyping();
			narrativeManager.advanceDialogue();
			narrativeManager.skipTyping();
			narrativeManager.advanceDialogue();

			narrativeManager.makeChoice('choice_a');

			expect(narrativeManager.hasActiveDialogue).toBe(false);
		});

		it('should apply flag_set consequences', () => {
			const consequences: Consequence[] = [
				{ type: 'flag_set', payload: { key: 'peaceful_path', value: true } }
			];
			const choices: Choice[] = [createTestChoice('choice_a', 'Option A', consequences)];
			const dialogue = createTestDialogue('dialogue_001', { choices });
			narrativeManager.registerDialogue(dialogue);
			narrativeManager.startDialogue('dialogue_001');

			// Get to choices and make choice
			narrativeManager.skipTyping();
			narrativeManager.advanceDialogue();
			narrativeManager.skipTyping();
			narrativeManager.advanceDialogue();
			narrativeManager.makeChoice('choice_a');

			expect(narrativeManager.getFlag('peaceful_path')).toBe(true);
		});

		it('should apply ending_unlock consequences', () => {
			const consequences: Consequence[] = [
				{ type: 'ending_unlock', payload: { endingId: 'the_creator' } }
			];
			const choices: Choice[] = [createTestChoice('choice_a', 'Option A', consequences)];
			const dialogue = createTestDialogue('dialogue_001', { choices });
			narrativeManager.registerDialogue(dialogue);
			narrativeManager.startDialogue('dialogue_001');

			// Get to choices and make choice
			narrativeManager.skipTyping();
			narrativeManager.advanceDialogue();
			narrativeManager.skipTyping();
			narrativeManager.advanceDialogue();
			narrativeManager.makeChoice('choice_a');

			expect(narrativeManager.hasEnding('the_creator')).toBe(true);
		});
	});

	// ============================================================================
	// Flag System Tests
	// ============================================================================

	describe('Flag System', () => {
		beforeEach(() => {
			narrativeManager.init();
		});

		it('should set and get flags', () => {
			narrativeManager.setFlag('test_flag', true);

			expect(narrativeManager.getFlag('test_flag')).toBe(true);
		});

		it('should set flag with default value true', () => {
			narrativeManager.setFlag('test_flag');

			expect(narrativeManager.getFlag('test_flag')).toBe(true);
		});

		it('should support string flag values', () => {
			narrativeManager.setFlag('choice_made', 'option_a');

			expect(narrativeManager.getFlag('choice_made')).toBe('option_a');
		});

		it('should support number flag values', () => {
			narrativeManager.setFlag('count', 42);

			expect(narrativeManager.getFlag('count')).toBe(42);
		});

		it('should check flag existence with hasFlag', () => {
			narrativeManager.setFlag('test_flag', true);

			expect(narrativeManager.hasFlag('test_flag')).toBe(true);
			expect(narrativeManager.hasFlag('nonexistent')).toBe(false);
		});

		it('should return false for falsy flag values in hasFlag', () => {
			narrativeManager.setFlag('false_flag', false);
			narrativeManager.setFlag('zero_flag', 0);
			narrativeManager.setFlag('empty_flag', '');

			expect(narrativeManager.hasFlag('false_flag')).toBe(false);
			expect(narrativeManager.hasFlag('zero_flag')).toBe(false);
			expect(narrativeManager.hasFlag('empty_flag')).toBe(false);
		});

		it('should clear flags', () => {
			narrativeManager.setFlag('test_flag', true);
			narrativeManager.clearFlag('test_flag');

			expect(narrativeManager.getFlag('test_flag')).toBeUndefined();
			expect(narrativeManager.hasFlag('test_flag')).toBe(false);
		});

		it('should expose all flags through allFlags getter', () => {
			narrativeManager.setFlag('flag_a', true);
			narrativeManager.setFlag('flag_b', 'value');

			const allFlags = narrativeManager.allFlags;

			expect(allFlags.get('flag_a')).toBe(true);
			expect(allFlags.get('flag_b')).toBe('value');
		});
	});

	// ============================================================================
	// Event/Trigger System Tests
	// ============================================================================

	describe('Event/Trigger System', () => {
		beforeEach(() => {
			narrativeManager.init();
		});

		it('should register events', () => {
			const event = createTestEvent('event_001');
			narrativeManager.registerEvent(event);

			// Event is registered but not triggered yet
			expect(narrativeManager.hasTriggered('event_001')).toBe(false);
		});

		it('should register multiple events', () => {
			const events = [
				createTestEvent('event_001'),
				createTestEvent('event_002'),
				createTestEvent('event_003')
			];
			narrativeManager.registerEvents(events);

			// All events registered
			expect(narrativeManager.hasTriggered('event_001')).toBe(false);
			expect(narrativeManager.hasTriggered('event_002')).toBe(false);
		});

		it('should trigger event manually', () => {
			const logDef = createTestLog('test_log', 'Test content');
			narrativeManager.registerLog(logDef);

			const event = createTestEvent('event_001', { contentId: 'test_log' });
			narrativeManager.registerEvent(event);

			narrativeManager.triggerEvent('event_001');

			expect(narrativeManager.hasTriggered('event_001')).toBe(true);
			expect(narrativeManager.logs).toHaveLength(1);
		});

		it('should not trigger unknown event', () => {
			const result = narrativeManager.triggerEvent('nonexistent');

			expect(result).toBe(false);
		});

		it('should mark one-time events as triggered', () => {
			const logDef = createTestLog('test_log');
			narrativeManager.registerLog(logDef);

			const event = createTestEvent('event_001', {
				contentId: 'test_log',
				oneTime: true
			});
			narrativeManager.registerEvent(event);

			narrativeManager.triggerEvent('event_001');
			narrativeManager.triggerEvent('event_001'); // Second trigger

			expect(narrativeManager.hasTriggered('event_001')).toBe(true);
			expect(narrativeManager.logs).toHaveLength(1); // Only added once
		});

		it('should trigger dialogue events', () => {
			const dialogue = createTestDialogue('test_dialogue');
			narrativeManager.registerDialogue(dialogue);

			const event = createTestEvent('event_001', {
				type: 'dialogue',
				contentId: 'test_dialogue'
			});
			narrativeManager.registerEvent(event);

			narrativeManager.triggerEvent('event_001');

			expect(narrativeManager.hasActiveDialogue).toBe(true);
			expect(narrativeManager.activeDialogue?.dialogue.id).toBe('test_dialogue');
		});
	});

	// ============================================================================
	// Condition Evaluation Tests
	// ============================================================================

	describe('Condition Evaluation', () => {
		beforeEach(() => {
			narrativeManager.init();
		});

		it('should evaluate resource_reached condition', () => {
			const logDef = createTestLog('test_log');
			narrativeManager.registerLog(logDef);

			// Mock having 100 pixels
			mockContext.getResourceAmount = vi.fn().mockReturnValue(D(100));
			narrativeManager.setContext(mockContext);

			const event = createTestEvent('event_001', {
				contentId: 'test_log',
				triggers: [
					{
						type: 'resource_reached',
						params: { resourceId: 'pixels', amount: 50 }
					}
				]
			});
			narrativeManager.registerEvent(event);

			// Force trigger check
			narrativeManager.tick(6); // 6 seconds to trigger check

			// Process event queue
			narrativeManager.tick(0.1);

			expect(narrativeManager.logs).toHaveLength(1);
		});

		it('should evaluate phase_entered condition on phase change', () => {
			const logDef = createTestLog('phase2_log');
			narrativeManager.registerLog(logDef);

			const event = createTestEvent('event_phase2', {
				contentId: 'phase2_log',
				phase: 2,
				triggers: [
					{
						type: 'phase_entered',
						params: { phase: 2 }
					}
				]
			});
			narrativeManager.registerEvent(event);

			// Simulate phase entered event
			eventManager.emit('phase_entered', {
				previousPhase: 1,
				newPhase: 2,
				phaseId: 'phase_2',
				isFirstTime: true
			});

			// Process event queue
			narrativeManager.tick(0.1);

			expect(narrativeManager.logs).toHaveLength(1);
		});

		it('should evaluate flag_set condition', () => {
			const logDef = createTestLog('flag_log');
			narrativeManager.registerLog(logDef);

			const event = createTestEvent('event_flag', {
				contentId: 'flag_log',
				triggers: [
					{
						type: 'flag_set',
						params: { key: 'special_flag' }
					}
				]
			});
			narrativeManager.registerEvent(event);

			// Set the flag
			narrativeManager.setFlag('special_flag', true);

			// Trigger check
			narrativeManager.tick(6);
			narrativeManager.tick(0.1);

			expect(narrativeManager.logs).toHaveLength(1);
		});

		it('should evaluate time_passed condition', () => {
			const logDef = createTestLog('time_log');
			narrativeManager.registerLog(logDef);

			// Mock run time of 120 seconds
			mockContext.getRunTime = vi.fn().mockReturnValue(120);
			narrativeManager.setContext(mockContext);

			const event = createTestEvent('event_time', {
				contentId: 'time_log',
				triggers: [
					{
						type: 'time_passed',
						params: { seconds: 60 }
					}
				]
			});
			narrativeManager.registerEvent(event);

			// Trigger check
			narrativeManager.tick(6);
			narrativeManager.tick(0.1);

			expect(narrativeManager.logs).toHaveLength(1);
		});

		it('should evaluate producer_count condition', () => {
			const logDef = createTestLog('producer_log');
			narrativeManager.registerLog(logDef);

			// Mock having 5 producers
			mockContext.getProducerCount = vi.fn().mockReturnValue(5);
			narrativeManager.setContext(mockContext);

			const event = createTestEvent('event_producer', {
				contentId: 'producer_log',
				triggers: [
					{
						type: 'producer_count',
						params: { producerId: 'pixel_generator', count: 3 }
					}
				]
			});
			narrativeManager.registerEvent(event);

			// Trigger check
			narrativeManager.tick(6);
			narrativeManager.tick(0.1);

			expect(narrativeManager.logs).toHaveLength(1);
		});

		it('should not trigger if condition not met', () => {
			const logDef = createTestLog('test_log');
			narrativeManager.registerLog(logDef);

			// Mock having only 10 pixels
			mockContext.getResourceAmount = vi.fn().mockReturnValue(D(10));
			narrativeManager.setContext(mockContext);

			const event = createTestEvent('event_001', {
				contentId: 'test_log',
				triggers: [
					{
						type: 'resource_reached',
						params: { resourceId: 'pixels', amount: 100 }
					}
				]
			});
			narrativeManager.registerEvent(event);

			// Force trigger check
			narrativeManager.tick(6);
			narrativeManager.tick(0.1);

			expect(narrativeManager.logs).toHaveLength(0);
		});
	});

	// ============================================================================
	// Story Path & Ending Tests
	// ============================================================================

	describe('Story Path & Endings', () => {
		beforeEach(() => {
			narrativeManager.init();
		});

		it('should calculate peaceful path when peaceful_path flag is set', () => {
			narrativeManager.setFlag('peaceful_path', true);

			expect(narrativeManager.currentPath).toBe('peaceful');
		});

		it('should calculate consuming path when consuming_path flag is set', () => {
			narrativeManager.setFlag('consuming_path', true);

			expect(narrativeManager.currentPath).toBe('consuming');
		});

		it('should unlock endings', () => {
			narrativeManager.unlockEnding('the_creator');

			expect(narrativeManager.hasEnding('the_creator')).toBe(true);
			expect(narrativeManager.endings).toContain('the_creator');
		});

		it('should track multiple endings', () => {
			narrativeManager.unlockEnding('the_creator');
			narrativeManager.unlockEnding('the_observer');

			expect(narrativeManager.endings).toHaveLength(2);
		});
	});

	// ============================================================================
	// Serialization Tests
	// ============================================================================

	describe('Serialization', () => {
		beforeEach(() => {
			narrativeManager.init();
		});

		it('should serialize current state', () => {
			// Set up some state
			narrativeManager.setFlag('test_flag', true);
			narrativeManager.unlockEnding('the_creator');
			narrativeManager.addInlineLog('log_001', 'Test log');

			const serialized = narrativeManager.serialize();

			expect(serialized).toHaveProperty('triggeredEvents');
			expect(serialized).toHaveProperty('playerChoices');
			expect(serialized).toHaveProperty('unlockedEndings');
			expect(serialized).toHaveProperty('flags');
			expect(serialized).toHaveProperty('logHistory');
		});

		it('should include flags in serialization', () => {
			narrativeManager.setFlag('flag_a', true);
			narrativeManager.setFlag('flag_b', 'value');

			const serialized = narrativeManager.serialize();

			expect(serialized.flags).toEqual({
				flag_a: true,
				flag_b: 'value'
			});
		});

		it('should include unlocked endings in serialization', () => {
			narrativeManager.unlockEnding('the_creator');
			narrativeManager.unlockEnding('the_observer');

			const serialized = narrativeManager.serialize();

			expect(serialized.unlockedEndings).toContain('the_creator');
			expect(serialized.unlockedEndings).toContain('the_observer');
		});

		it('should deserialize and restore state', () => {
			// Register log definition first
			const logDef = createTestLog('log_001', 'Test log');
			narrativeManager.registerLog(logDef);

			const savedState = {
				triggeredEvents: ['event_001', 'event_002'],
				playerChoices: { choice_001: 'Option A' },
				unlockedEndings: ['the_creator'],
				flags: { test_flag: true, another_flag: 'value' },
				logHistory: ['log_001'],
				lastCheckTime: Date.now()
			};

			narrativeManager.deserialize(savedState);

			expect(narrativeManager.hasTriggered('event_001')).toBe(true);
			expect(narrativeManager.getChoice('choice_001')).toBe('Option A');
			expect(narrativeManager.hasEnding('the_creator')).toBe(true);
			expect(narrativeManager.getFlag('test_flag')).toBe(true);
			expect(narrativeManager.logs).toHaveLength(1);
		});

		it('should handle invalid deserialization data gracefully', () => {
			expect(() => narrativeManager.deserialize(null)).not.toThrow();
			expect(() => narrativeManager.deserialize(undefined)).not.toThrow();
			expect(() => narrativeManager.deserialize('invalid')).not.toThrow();
		});
	});

	// ============================================================================
	// Reset Tests
	// ============================================================================

	describe('Reset', () => {
		beforeEach(() => {
			narrativeManager.init();
		});

		it('should clear logs on reset', () => {
			narrativeManager.addInlineLog('log_001', 'Test');
			narrativeManager.reset();

			expect(narrativeManager.logs).toHaveLength(0);
		});

		it('should clear active dialogue on reset', () => {
			const dialogue = createTestDialogue('dialogue_001');
			narrativeManager.registerDialogue(dialogue);
			narrativeManager.startDialogue('dialogue_001');

			narrativeManager.reset();

			expect(narrativeManager.hasActiveDialogue).toBe(false);
		});

		it('should clear triggered events on reset', () => {
			const logDef = createTestLog('test_log');
			narrativeManager.registerLog(logDef);
			const event = createTestEvent('event_001', { contentId: 'test_log' });
			narrativeManager.registerEvent(event);
			narrativeManager.triggerEvent('event_001');

			narrativeManager.reset();

			expect(narrativeManager.hasTriggered('event_001')).toBe(false);
		});
	});

	// ============================================================================
	// Speaker Style Tests
	// ============================================================================

	describe('Speaker Styles', () => {
		beforeEach(() => {
			narrativeManager.init();
		});

		it('should return correct speaker style for current line', () => {
			const dialogue = createTestDialogue('dialogue_001', { speaker: 'sun' });
			narrativeManager.registerDialogue(dialogue);
			narrativeManager.startDialogue('dialogue_001');

			const style = narrativeManager.getCurrentSpeakerStyle();

			expect(style.name).toBe('The Sun');
			expect(style.color).toBe('#FFD700');
		});

		it('should return pixel style when no dialogue active', () => {
			const style = narrativeManager.getCurrentSpeakerStyle();

			expect(style.name).toBe('Pixel');
		});
	});
});
