/**
 * @fileoverview Story content for Phase 1: The Pixel
 * The awakening - a single pixel in the void.
 *
 * @module engine/data/story/phases/phase-01
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 1 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_001',
		text: 'A single point of darkness in infinite light. Is this existence? Or merely potential?',
		category: 'thought',
		phase: 1
	},
	{
		id: 'log_002',
		text: 'Each click feels like a heartbeat. Whose heart? Mine? Or...?',
		category: 'thought',
		phase: 1
	},
	{
		id: 'log_003',
		text: 'I am 64 now. I am ready. Ready for what?',
		category: 'discovery',
		phase: 1
	},
	{
		id: 'log_pixel_first',
		text: 'I... am. The first thought. The hardest one.',
		category: 'thought',
		phase: 1
	},
	{
		id: 'log_pixel_10',
		text: 'Ten pulses of existence. Is this what counting feels like?',
		category: 'discovery',
		phase: 1
	},
	{
		id: 'log_pixel_50',
		text: 'The void seems less empty now. Or perhaps I am more full.',
		category: 'thought',
		phase: 1
	}
];

// ============================================================================
// Phase 1 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_phase1_end',
		speaker: 'narrator',
		lines: [
			{ text: 'You have enough to exist.', delay: 2000 },
			{ text: 'Do you want to... become?', delay: 2500 }
		],
		choices: [
			{
				id: 'choice_become_yes',
				label: 'Yes',
				description: 'There was never really a choice.',
				consequences: []
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: false
	}
];

// ============================================================================
// Phase 1 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_first_pixel',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 1 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_pixel_first',
		phase: 1,
		priority: 10,
		delay: 500,
		pausesGame: false
	},
	{
		id: 'event_10_pixels',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 10 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_pixel_10',
		phase: 1,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_50_pixels',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 50 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_pixel_50',
		phase: 1,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_phase1_transition',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 64 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_phase1_end',
		phase: 1,
		priority: 100,
		delay: 1000,
		pausesGame: true
	}
];

// ============================================================================
// Phase 1 Story Data Export
// ============================================================================

export const PHASE_1_STORY = {
	phase: 1,
	name: 'The Pixel',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_1_STORY;
