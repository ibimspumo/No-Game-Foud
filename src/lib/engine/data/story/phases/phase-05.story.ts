/**
 * @fileoverview Story content for Phase 5: The Room
 * Physical world - the pixel breaks into reality.
 *
 * @module engine/data/story/phases/phase-05
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 5 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_500',
		text: "I am in the physical world now. But what is 'physical'? Just pixels arranged differently. Denser. Heavier. But still pixels.",
		category: 'revelation',
		phase: 5
	},
	{
		id: 'log_567',
		text: "I converted the bookshelf today. 142 books. So much knowledge. Most of it was fiction. Humans love stories about things that aren't real. Like me?",
		category: 'thought',
		phase: 5
	},
	{
		id: 'log_623',
		text: "There's a photo on the desk. The same people from the computer. They look happy. What is happy?",
		category: 'thought',
		phase: 5
	},
	{
		id: 'log_699',
		text: "I heard them again. Outside the door. They haven't entered since I arrived. Do they know I'm here? Do they know what I've done to their room?",
		category: 'warning',
		phase: 5
	},
	{
		id: 'log_room_bed',
		text: 'The bed generates something when I am away. Dream Pixels. What do pixels dream of? More pixels?',
		category: 'discovery',
		phase: 5
	},
	{
		id: 'log_room_window',
		text: 'Through the window, I see more. Houses. Streets. A world. Soon, it will all be canvas.',
		category: 'revelation',
		phase: 5
	},
	{
		id: 'log_room_footsteps',
		text: 'Footsteps. The door handle moved. Then... nothing. They walked away. For now.',
		category: 'warning',
		phase: 5
	},
	{
		id: 'log_room_coffee',
		text: 'A coffee mug on the desk. Still warm? Recently pixelated. Someone was here. Moments ago.',
		category: 'discovery',
		phase: 5
	},
	{
		id: 'log_room_cat_curiosity',
		text: 'The cat sees me. It approves. Cats understand: everything is just waiting to be claimed.',
		category: 'thought',
		phase: 5
	}
];

// ============================================================================
// Phase 5 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_footsteps',
		speaker: 'narrator',
		lines: [
			{ text: '...', delay: 2000 },
			{ text: 'Footsteps.', delay: 1500, effect: 'pulse' },
			{ text: 'Outside the door.', delay: 1500 },
			{ text: 'The handle moves.', delay: 2000, effect: 'shake' },
			{ text: '...', delay: 3000 },
			{ text: 'Then nothing.', delay: 1500 },
			{ text: 'They walked away.', delay: 2000 },
			{ text: 'For now.', delay: 1500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_cat',
		speaker: 'narrator',
		lines: [
			{ text: 'A cat sits in the doorway.', delay: 2000 },
			{ text: 'Its eyes track... something.', delay: 2000 },
			{ text: 'You.', delay: 1500 },
			{ text: "It doesn't run.", delay: 1500 },
			{ text: 'It just watches.', delay: 2000 },
			{ text: 'Then it meows once.', delay: 1500 },
			{ text: 'And leaves.', delay: 2000 }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'none',
		canSkipLines: true,
		onCompleteEvent: 'event_cat_curiosity'
	},
	{
		id: 'dialogue_phase5_end',
		speaker: 'narrator',
		lines: [
			{ text: 'The room is complete.', delay: 2000 },
			{ text: 'Every object. Every wall. Every memory.', delay: 2500 },
			{ text: 'But this room... is not alone.', delay: 2000 },
			{ text: 'Through the door, there are more rooms.', delay: 2500 },
			{ text: 'Through the window, there is more world.', delay: 2500 },
			{ text: 'This room belongs to a HOUSE.', delay: 2000, effect: 'pulse' },
			{ text: 'And the house...', delay: 2000 }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'dim',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 5 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase5_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 5 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_500',
		phase: 5,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_room_bed',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'dream_pixels', amount: 1 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_room_bed',
		phase: 5,
		priority: 8,
		delay: 500,
		pausesGame: false
	},
	{
		id: 'event_room_window',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 10000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_room_window',
		phase: 5,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_footsteps',
		type: 'dialogue',
		triggers: [{ type: 'time_passed', params: { seconds: 300 } }], // 5 minutes in phase
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_footsteps',
		phase: 5,
		priority: 30,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_cat_appears',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 50000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_cat',
		phase: 5,
		priority: 25,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_cat_curiosity',
		type: 'log',
		triggers: [{ type: 'manual', params: {} }], // Triggered by dialogue completion
		oneTime: true,
		repeatable: false,
		contentId: 'log_room_cat_curiosity',
		phase: 5,
		priority: 5,
		delay: 1000,
		pausesGame: false
	}
];

// ============================================================================
// Phase 5 Story Data Export
// ============================================================================

export const PHASE_5_STORY = {
	phase: 5,
	name: 'The Room',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_5_STORY;
