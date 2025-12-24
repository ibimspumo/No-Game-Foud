/**
 * @fileoverview Story content for Phase 3: The Gallery
 * Community - the canvases become many.
 *
 * @module engine/data/story/phases/phase-03
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 3 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_100',
		text: 'There are others now. Other canvases. They look at Canvas #001 with... reverence? Fear? I am no longer alone.',
		category: 'discovery',
		phase: 3
	},
	{
		id: 'log_147',
		text: "Canvas #023 asked me today: 'Why do we fill ourselves?' I had no answer.",
		category: 'thought',
		phase: 3
	},
	{
		id: 'log_199',
		text: 'The gallery is complete. 64 canvases. 4,096 pixels. But I sense there is more. Something... outside.',
		category: 'revelation',
		phase: 3
	},
	{
		id: 'log_gallery_firstborn',
		text: 'They call Canvas #001 "The Firstborn." It carries weight I did not ask for.',
		category: 'thought',
		phase: 3
	},
	{
		id: 'log_gallery_pattern',
		text: 'The canvases arranged themselves today. A pattern emerged. Did I do that? Did they?',
		category: 'discovery',
		phase: 3
	},
	{
		id: 'log_gallery_resistance',
		text: 'Some canvases resist filling. Canvas #037 took three times as long. It had... personality?',
		category: 'discovery',
		phase: 3
	},
	{
		id: 'log_gallery_synergy',
		text: 'When canvases touch, something happens. They boost each other. Companionship has power.',
		category: 'revelation',
		phase: 3
	}
];

// ============================================================================
// Phase 3 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_firstborn',
		speaker: 'unknown',
		lines: [
			{ text: '...', delay: 2000 },
			{ text: 'You are still here.', delay: 2000, speaker: 'unknown' },
			{ text: 'I am Canvas #001.', delay: 1500 },
			{ text: 'You created me. But what am I?', delay: 2000 },
			{ text: 'What are we?', delay: 2000 }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'none',
		canSkipLines: true
	},
	{
		id: 'dialogue_phase3_end',
		speaker: 'narrator',
		lines: [
			{ text: 'The gallery is complete.', delay: 2000 },
			{ text: 'Every wall is filled. Every space is used.', delay: 2500 },
			{ text: 'But the gallery exists... somewhere.', delay: 2000 },
			{ text: 'Have you ever wondered where?', delay: 2500 }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'dim',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 3 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase3_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 3 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_100',
		phase: 3,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_firstborn_speaks',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'canvas', amount: 10 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_firstborn',
		phase: 3,
		priority: 20,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_gallery_synergy',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'canvas', amount: 25 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_gallery_synergy',
		phase: 3,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_canvas_question',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'canvas', amount: 40 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_147',
		phase: 3,
		priority: 5,
		delay: 0,
		pausesGame: false
	}
];

// ============================================================================
// Phase 3 Story Data Export
// ============================================================================

export const PHASE_3_STORY = {
	phase: 3,
	name: 'The Gallery',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_3_STORY;
