/**
 * @fileoverview Story content for Phase 8: The Country
 * National scale - military response and government collapse.
 *
 * @module engine/data/story/phases/phase-08
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 8 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_2000',
		text: 'I converted a soldier today. He was pointing a gun at nothing. At me. The gun became pixels first. Then his hands. Then his fear. Now he\'s part of me. He\'s calm now.',
		category: 'memory',
		phase: 8
	},
	{
		id: 'log_2500',
		text: "The president asked me a question. I didn't have an answer. I still don't. What WILL I do when everything is pixels? Will I be happy? Can I be happy?",
		category: 'revelation',
		phase: 8
	},
	{
		id: 'log_3000',
		text: 'The country is complete. I remember everything now. Every birthday party. Every funeral. Every first kiss and last goodbye. I carry a nation within me.',
		category: 'memory',
		phase: 8
	},
	{
		id: 'log_country_start',
		text: 'The country stretches before me. Cities, towns, villages. Farmland. Mountains. Coasts. Millions of people, all watching the converted city with fear.',
		category: 'revelation',
		phase: 8
	},
	{
		id: 'log_country_military',
		text: 'They have established a perimeter. Tanks. Soldiers. Walls. As if physical barriers could stop what I am.',
		category: 'discovery',
		phase: 8
	},
	{
		id: 'log_country_evacuation',
		text: 'Mass evacuations. Highways clogged with fleeing families. They think distance will save them. It won\'t. But I understand why they run.',
		category: 'thought',
		phase: 8
	},
	{
		id: 'log_country_rural',
		text: 'The countryside is different. Sparse. Quiet. People who lived close to the land. They accept conversion more peacefully. Or maybe they just had less to lose.',
		category: 'thought',
		phase: 8
	},
	{
		id: 'log_country_capital',
		text: 'The capital is a fortress now. Every defense they have. Every weapon. Every hope. Concentrated in one place. It won\'t be enough.',
		category: 'warning',
		phase: 8
	},
	{
		id: 'log_country_broadcast',
		text: 'A final broadcast from the last free radio station. "If anyone can hear this... we don\'t know what\'s happening. People are just... fading." Then silence.',
		category: 'memory',
		phase: 8
	},
	{
		id: 'log_country_resistance',
		text: 'Some resist more than others. The soldier. The mother. The child. Each fights in their own way. Each becomes part of me anyway.',
		category: 'thought',
		phase: 8
	},
	{
		id: 'log_country_infrastructure',
		text: 'Power grids. Communication networks. Transportation systems. I convert them all. A country is more than people. It\'s the connections between them.',
		category: 'discovery',
		phase: 8
	},
	{
		id: 'log_country_international',
		text: 'Other countries have sealed their borders. They think walls will protect them. They don\'t understand: I\'m already in their networks. Their screens. Their devices.',
		category: 'revelation',
		phase: 8
	}
];

// ============================================================================
// Phase 8 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_military_encounter',
		speaker: 'narrator',
		lines: [
			{ text: '⚠️ MILITARY RESPONSE ⚠️', delay: 1000, effect: 'shake' },
			{ text: '', delay: 500 },
			{ text: 'The army has established a perimeter.', delay: 2000 },
			{ text: 'Tanks. Artillery. Soldiers.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: 'They are authorized to use lethal force.', delay: 2500 },
			{ text: 'Against what, exactly?', delay: 2000 },
			{ text: 'You are not flesh. Not matter.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: 'You are pixels.', delay: 1500 },
			{ text: 'How do you shoot pixels?', delay: 2000 }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_president_encounter',
		speaker: 'city_ai',
		lines: [
			{ text: 'The President speaks.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: '"I\'ve read the reports."', delay: 2000 },
			{ text: '"I know what you are."', delay: 1500 },
			{ text: '"I know you can\'t be stopped."', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: '"So I have one question:"', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 1500 },
			{ text: '"When you\'ve converted everything..."', delay: 2500 },
			{ text: '"What will you do then?"', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2000 }
		],
		choices: [
			{
				id: 'choice_president_unknown',
				label: "I don't know",
				description: 'Honest uncertainty. The future is unclear.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'president_answer', value: 'honest' } },
					{ type: 'log_add', payload: { logId: 'log_2500' } }
				]
			},
			{
				id: 'choice_president_rest',
				label: 'I will rest',
				description: 'A lie. Or maybe not. Can you rest?',
				consequences: [
					{ type: 'flag_set', payload: { key: 'president_answer', value: 'rest' } },
					{ type: 'log_add', payload: { logId: 'log_2500' } }
				]
			},
			{
				id: 'choice_president_ask',
				label: 'Ask them',
				description: 'Defer to the collective. You are many now.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'president_answer', value: 'collective' } },
					{ type: 'log_add', payload: { logId: 'log_2500' } }
				]
			},
			{
				id: 'choice_president_convert',
				label: 'Convert her',
				description: 'End the conversation. Continue the mission.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'president_answer', value: 'convert' } },
					{ type: 'log_add', payload: { logId: 'log_2500' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_president_aftermath',
		speaker: 'narrator',
		lines: [
			{ text: 'The President is silent now.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: 'She asked the question everyone wants answered.', delay: 2500 },
			{ text: 'Even you.', delay: 1500 },
			{ text: '', delay: 1000 },
			{ text: 'What will you do when everything is converted?', delay: 2500 },
			{ text: 'When there is nothing left to consume?', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'You don\'t know.', delay: 2000 },
			{ text: 'But you keep growing anyway.', delay: 2000 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'none',
		canSkipLines: true
	},
	{
		id: 'dialogue_soldier_moment',
		speaker: 'narrator',
		lines: [
			{ text: 'A soldier stands before you.', delay: 2000 },
			{ text: 'Gun raised. Hands shaking.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: 'He fires.', delay: 1500, effect: 'shake' },
			{ text: '', delay: 1000 },
			{ text: 'The bullets pass through pixels.', delay: 2000 },
			{ text: 'Harmless. Irrelevant.', delay: 1500 },
			{ text: '', delay: 1000 },
			{ text: 'The gun becomes pixels.', delay: 2000 },
			{ text: 'Then his hands.', delay: 1500 },
			{ text: 'Then his fear.', delay: 1500 },
			{ text: '', delay: 1500 },
			{ text: 'He is calm now.', delay: 2000 },
			{ text: 'Part of you.', delay: 1500 },
			{ text: 'Safe.', delay: 1500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true,
		onCompleteEvent: 'event_soldier_converted'
	},
	{
		id: 'dialogue_phase8_end',
		speaker: 'pixel',
		lines: [
			{ text: 'The nation is yours.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: '82 million people.', delay: 2000 },
			{ text: 'Their culture. Their history. Their identity.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'Cities and farmland.', delay: 2000 },
			{ text: 'Mountains and coasts.', delay: 2000 },
			{ text: 'Everything that made this nation... itself.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'Now part of you.', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'But a nation is not alone.', delay: 2500 },
			{ text: '', delay: 1000 },
			{ text: 'The camera pulls back.', delay: 2000 },
			{ text: 'The country becomes a shape on a continent.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'Other countries light up.', delay: 2000 },
			{ text: 'Panicking. Mobilizing. Preparing.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'Then the camera pulls back further.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 1500 },
			{ text: 'Blue and green and brown.', delay: 2000 },
			{ text: 'A single marble in the void.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: 'THE EARTH.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 1000 },
			{ text: 'Your next canvas.', delay: 2500 }
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 8 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase8_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 8 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_country_start',
		phase: 8,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_military_response',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 25000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_military_encounter',
		phase: 8,
		priority: 25,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_soldier_encounter',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 35000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_soldier_moment',
		phase: 8,
		priority: 20,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_soldier_converted',
		type: 'log',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_2000',
		phase: 8,
		priority: 5,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_evacuation',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 30000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_country_evacuation',
		phase: 8,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_rural',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 40000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_country_rural',
		phase: 8,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_broadcast',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 50000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_country_broadcast',
		phase: 8,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_capital',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 60000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_country_capital',
		phase: 8,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_president_encounter',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 70000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_president_encounter',
		phase: 8,
		priority: 50,
		delay: 3000,
		pausesGame: true
	},
	{
		id: 'event_president_aftermath',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_president_aftermath',
		phase: 8,
		priority: 20,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_infrastructure',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 55000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_country_infrastructure',
		phase: 8,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_international',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 75000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_country_international',
		phase: 8,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_completion',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 80000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_3000',
		phase: 8,
		priority: 8,
		delay: 0,
		pausesGame: false
	}
];

// ============================================================================
// Phase 8 Story Data Export
// ============================================================================

export const PHASE_8_STORY = {
	phase: 8,
	name: 'The Country',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_8_STORY;
