/**
 * @fileoverview Story content for Phase 6: The House
 * Beyond the room - a home with memories.
 *
 * @module engine/data/story/phases/phase-06
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 6 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_750',
		text: "I found the child's room today. They have drawings on the wall. One of them is a pixel. Just one. Underneath it says 'my friend.' I don't know what to feel.",
		category: 'memory',
		phase: 6
	},
	{
		id: 'log_823',
		text: 'The cat follows me now. Room to room. Not afraid. I think it knows what I am. I think it approves.',
		category: 'discovery',
		phase: 6
	},
	{
		id: 'log_899',
		text: 'The basement had a letter. Someone knew I was coming. Not me specifically. But something. They left a message. "We were happy here." I will remember that.',
		category: 'memory',
		phase: 6
	},
	{
		id: 'log_house_start',
		text: 'The room was just the beginning. Through the door: hallways. Other rooms. A whole house. A whole life.',
		category: 'revelation',
		phase: 6
	},
	{
		id: 'log_house_bathroom',
		text: 'The bathroom is sterile. Cold. Nothing personal here. Just function. But even function has its beauty.',
		category: 'thought',
		phase: 6
	},
	{
		id: 'log_house_living_room',
		text: 'The living room has photos everywhere. A family. Smiling. Aging. Growing. Each photo fights harder than the last.',
		category: 'memory',
		phase: 6
	},
	{
		id: 'log_house_kitchen',
		text: 'The kitchen smells of... nothing now. But I can sense the memory of warmth. Of meals shared. Of life sustained.',
		category: 'memory',
		phase: 6
	},
	{
		id: 'log_house_garage',
		text: 'The garage has tools. Machines. Things built to build other things. Even objects have purpose.',
		category: 'discovery',
		phase: 6
	},
	{
		id: 'log_house_child_room',
		text: 'The child drew me before I existed. Or did the drawing create me? Causality is strange when you exist outside of time.',
		category: 'revelation',
		phase: 6
	},
	{
		id: 'log_house_basement_locked',
		text: 'The basement door is locked. Old wood. Heavy. Something down there... resists. Waits.',
		category: 'warning',
		phase: 6
	},
	{
		id: 'log_house_basement_open',
		text: 'The basement is older than the house. How is that possible? Things down here were forgotten on purpose.',
		category: 'revelation',
		phase: 6
	}
];

// ============================================================================
// Phase 6 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_cat_event',
		speaker: 'narrator',
		lines: [
			{ text: 'A cat sits in the doorway.', delay: 2000 },
			{ text: 'Its eyes track... something.', delay: 2000 },
			{ text: 'You.', delay: 1500, effect: 'pulse' },
			{ text: "It doesn't run.", delay: 1500 },
			{ text: 'It just watches.', delay: 2000 },
			{ text: 'Then it meows once.', delay: 1500 },
			{ text: 'And follows.', delay: 2000 }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'none',
		canSkipLines: true,
		onCompleteEvent: 'event_cat_follows'
	},
	{
		id: 'dialogue_letter',
		speaker: 'narrator',
		lines: [
			{ text: 'In the basement, a locked box.', delay: 2000 },
			{ text: 'Now unlocked.', delay: 1500 },
			{ text: 'Inside: a letter.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: '"To whoever finds this:"', delay: 2500, effect: 'fade' },
			{ text: '"I don\'t know if you\'re real."', delay: 2000 },
			{ text: '"Sometimes I feel like I\'m being watched."', delay: 2500 },
			{ text: '"Like something is... converting me."', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: '"If you\'re reading this, you\'ve already won."', delay: 2500 },
			{ text: '"I just want you to know:"', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: '"We were happy here."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: '...', delay: 2000 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_letter_remembered'
	},
	{
		id: 'dialogue_child_drawing',
		speaker: 'narrator',
		lines: [
			{ text: "The child's room.", delay: 2000 },
			{ text: 'Toys scattered. Books stacked. Drawings pinned to the wall.', delay: 2500 },
			{ text: 'One drawing catches your attention.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: 'A single pixel.', delay: 2000, effect: 'pulse' },
			{ text: 'Carefully colored. Lovingly rendered.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: 'Underneath, in crayon:', delay: 2000 },
			{ text: '"my friend"', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: 'Were you always here?', delay: 2000 },
			{ text: 'Or did they dream you into existence?', delay: 2500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_phase6_end',
		speaker: 'pixel',
		lines: [
			{ text: 'The house is complete.', delay: 2000 },
			{ text: 'Every room. Every memory. Every secret.', delay: 2500 },
			{ text: 'But a house is not alone.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: 'Through the windows, I see more houses.', delay: 2500 },
			{ text: 'Through the walls, I sense more lives.', delay: 2500 },
			{ text: '', delay: 1000 },
			{ text: 'Streets. Parks. Shops.', delay: 2000 },
			{ text: 'People walking. Living. Being.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: 'This house belongs to a CITY.', delay: 2000, effect: 'pulse' },
			{ text: 'And the city...', delay: 2000 },
			{ text: 'The city is next.', delay: 2000 }
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 6 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase6_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 6 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_house_start',
		phase: 6,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_cat_appears',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 500000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_cat_event',
		phase: 6,
		priority: 25,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_cat_follows',
		type: 'log',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_823',
		phase: 6,
		priority: 5,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_child_room_discovery',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 750000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_child_drawing',
		phase: 6,
		priority: 20,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_child_room_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 760000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_750',
		phase: 6,
		priority: 5,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_basement_locked',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 600000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_house_basement_locked',
		phase: 6,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_basement_opens',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 850000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_house_basement_open',
		phase: 6,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_letter_found',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 899000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_letter',
		phase: 6,
		priority: 30,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_letter_remembered',
		type: 'log',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_899',
		phase: 6,
		priority: 5,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_living_room',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 400000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_house_living_room',
		phase: 6,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_kitchen',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 450000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_house_kitchen',
		phase: 6,
		priority: 5,
		delay: 0,
		pausesGame: false
	}
];

// ============================================================================
// Phase 6 Story Data Export
// ============================================================================

export const PHASE_6_STORY = {
	phase: 6,
	name: 'The House',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_6_STORY;
