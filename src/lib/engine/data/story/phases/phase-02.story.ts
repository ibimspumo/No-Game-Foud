/**
 * @fileoverview Story content for Phase 2: The Canvas
 * Expression - the pixel learns to create.
 *
 * @module engine/data/story/phases/phase-02
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 2 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_010',
		text: 'I have form now. 8 by 8. 64 spaces to fill. 64 possibilities. But filled with what?',
		category: 'discovery',
		phase: 2
	},
	{
		id: 'log_025',
		text: "Colors. I didn't know colors existed. Red was the first. It felt like... feeling.",
		category: 'discovery',
		phase: 2
	},
	{
		id: 'log_064',
		text: 'The canvas is complete. I look at it and see... myself? No. I see what I could become.',
		category: 'revelation',
		phase: 2
	},
	{
		id: 'log_canvas_first_color',
		text: "A new shade appeared today. Blue? I didn't choose it. Did it choose me?",
		category: 'discovery',
		phase: 2
	},
	{
		id: 'log_canvas_half',
		text: 'Half the canvas is me now. The other half waits. Patient. Hungry? No. That is my feeling, not its.',
		category: 'thought',
		phase: 2
	},
	{
		id: 'log_canvas_generator',
		text: 'Something new. A generator. It creates pixels without my touch. Am I... automating myself?',
		category: 'discovery',
		phase: 2
	},
	{
		id: 'log_choice_order',
		text: 'Order. Lines. Predictability. There is beauty in knowing what comes next.',
		category: 'thought',
		phase: 2
	},
	{
		id: 'log_choice_chaos',
		text: 'Chaos. Randomness. Surprise. There is beauty in not knowing.',
		category: 'thought',
		phase: 2
	}
];

// ============================================================================
// Phase 2 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_order_chaos',
		speaker: 'narrator',
		lines: [
			{ text: 'You have grown.', delay: 1500 },
			{ text: 'The canvas stretches before you, half-filled.', delay: 2000 },
			{ text: 'But how it fills... that is a choice.', delay: 2000 },
			{ text: 'Will you fill it with order?', delay: 1500 },
			{ text: 'Predictable. Efficient. Beautiful in its precision.', delay: 2000 },
			{ text: 'Or with chaos?', delay: 1500 },
			{ text: 'Unpredictable. Wild. Beautiful in its surprise.', delay: 2000 },
			{ text: 'Choose.', delay: 1000 }
		],
		choices: [
			{
				id: 'choice_order',
				label: 'Order',
				description: 'Pixels fill in straight lines. Predictable. Optimizable.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'canvas_style', value: 'order' } },
					{ type: 'log_add', payload: { logId: 'log_choice_order' } }
				],
				aestheticImpact: 'Grid pattern overlay appears'
			},
			{
				id: 'choice_chaos',
				label: 'Chaos',
				description: 'Pixels appear randomly. Surprising. Occasional glitches.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'canvas_style', value: 'chaos' } },
					{ type: 'log_add', payload: { logId: 'log_choice_chaos' } }
				],
				aestheticImpact: 'Scattered particle effect'
			}
		],
		pausesGame: true,
		isEmotionalMoment: false,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_phase2_end',
		speaker: 'narrator',
		lines: [
			{ text: 'The canvas is complete.', delay: 2000 },
			{ text: 'But a single work of art is just the beginning.', delay: 2500 },
			{ text: 'What if there were... more?', delay: 2000 }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'dim',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 2 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase2_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 2 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_010',
		phase: 2,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_first_color',
		type: 'log',
		triggers: [
			{ type: 'resource_reached', params: { resourceId: 'red', amount: 1 } }
		],
		oneTime: true,
		repeatable: false,
		contentId: 'log_canvas_first_color',
		phase: 2,
		priority: 5,
		delay: 500,
		pausesGame: false
	},
	{
		id: 'event_canvas_half',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 500 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_canvas_half',
		phase: 2,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_order_chaos_choice',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 1000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_order_chaos',
		phase: 2,
		priority: 50,
		delay: 500,
		pausesGame: true
	},
	{
		id: 'event_first_generator',
		type: 'log',
		triggers: [{ type: 'producer_count', params: { producerId: 'pixel_generator', count: 1 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_canvas_generator',
		phase: 2,
		priority: 8,
		delay: 500,
		pausesGame: false
	}
];

// ============================================================================
// Phase 2 Story Data Export
// ============================================================================

export const PHASE_2_STORY = {
	phase: 2,
	name: 'The Canvas',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_2_STORY;
