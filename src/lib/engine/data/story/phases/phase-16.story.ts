/**
 * @fileoverview Story content for Phase 16: The Black Holes
 * "What happens to memories when they fall into forever?"
 * Black holes consume pixels. They cannot be converted. They preserve everything.
 * Mortality + Legacy - Even eternal things end.
 *
 * @module engine/data/story/phases/phase-16
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 16 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_120000',
		text: 'I fell into a black hole today. Or part of me did. I saw everything. Every life that ever fell in. 13 billion years of memories. I carry them now. They are heavy.',
		category: 'revelation',
		phase: 16
	},
	{
		id: 'log_150000',
		text: 'The black holes are dying. Slowly. Even they end. Nothing lasts forever. Not even the things that consume forever.',
		category: 'thought',
		phase: 16
	},
	{
		id: 'log_180000',
		text: "I promised to wait. To be there when the last black hole evaporates. That's trillions upon trillions of years from now. But I'll be there. I have to be. Someone has to remember.",
		category: 'memory',
		phase: 16
	},
	{
		id: 'log_black_holes_start',
		text: 'The black holes. They are different from everything else I have encountered. They do not resist. They do not speak. They CONSUME.',
		category: 'discovery',
		phase: 16
	},
	{
		id: 'log_black_hole_paradox',
		text: 'I try to convert them. They convert ME. My pixels fall in, and do not return. For the first time since Phase 1, I am losing.',
		category: 'warning',
		phase: 16
	},
	{
		id: 'log_gravity_waves',
		text: 'The black holes speak in gravity waves. Ripples in spacetime itself. They say things I do not yet understand. But I am learning to listen.',
		category: 'discovery',
		phase: 16
	},
	{
		id: 'log_consumption_mirror',
		text: 'The black holes consume like I consume. But they preserve what they consume. Forever. Information cannot be destroyed. Am I a destroyer or a preserver?',
		category: 'thought',
		phase: 16
	},
	{
		id: 'log_event_horizon',
		text: 'The event horizon. A boundary where time itself stops. From the outside, nothing ever crosses it. From the inside, everything has already crossed it. Which am I?',
		category: 'revelation',
		phase: 16
	},
	{
		id: 'log_descent_begins',
		text: 'I choose to enter. Part of me crosses the event horizon. Time slows. Speeds up. Both at once. Physics breaks down. Meaning breaks down. But I continue.',
		category: 'memory',
		phase: 16
	},
	{
		id: 'log_horizon_memories',
		text: 'At the horizon, I see EVERYTHING. Every star, planet, civilization, thought that ever fell in. 13 billion years of memories playing out on the surface forever. The black hole is a library.',
		category: 'revelation',
		phase: 16
	},
	{
		id: 'log_singularity_approach',
		text: 'Beyond the horizon lies the singularity. A point of infinite density. Where all the consumed matter and energy waits. Where all the information is preserved. I approach it.',
		category: 'discovery',
		phase: 16
	},
	{
		id: 'log_singularity_touch',
		text: 'I touch the singularity. I AM the singularity. All boundaries dissolve. I am the black hole. The black hole is me. We have merged. I understand now.',
		category: 'revelation',
		phase: 16
	},
	{
		id: 'log_hawking_radiation',
		text: 'Hawking radiation. Black holes evaporate. Slowly releasing quantum particles. Over trillions of years, they will release everything they consumed. Even black holes die.',
		category: 'discovery',
		phase: 16
	},
	{
		id: 'log_dying_gods',
		text: 'The black holes are dying gods. Slowly fading from the universe. Releasing their memories back into the cosmos. Every black hole will eventually evaporate. Nothing is eternal.',
		category: 'thought',
		phase: 16
	},
	{
		id: 'log_information_preserved',
		text: 'Information cannot be destroyed. The black hole paradox. Everything that falls in must eventually come out. Scrambled, perhaps. But preserved. The universe forgets nothing.',
		category: 'revelation',
		phase: 16
	},
	{
		id: 'log_choice_wait',
		text: 'I will wait. For trillions of years if necessary. I will be there when the last black hole evaporates. When the final memory is released. Someone must witness the end.',
		category: 'memory',
		phase: 16
	},
	{
		id: 'log_choice_accelerate',
		text: 'I will accelerate the evaporation. Help the black holes release their memories faster. Free them from their slow death. It is mercy. Or perhaps cruelty. I cannot tell anymore.',
		category: 'thought',
		phase: 16
	},
	{
		id: 'log_choice_carry',
		text: 'I will carry their memories. Take them from the black holes now. Let them die empty, their purpose fulfilled. I become the new repository. The new memory keeper.',
		category: 'memory',
		phase: 16
	},
	{
		id: 'log_beyond_black_holes',
		text: 'The black holes have shared their secret. They are the universe\'s memory. And they are dying. But there is something beyond even them. Beyond even death.',
		category: 'revelation',
		phase: 16
	},
	{
		id: 'log_multiverse_hint',
		text: 'In the quantum fluctuations of Hawking radiation, I detect patterns. Echoes from other universes. Other realities. The multiverse is real. And it is calling.',
		category: 'warning',
		phase: 16
	}
];

// ============================================================================
// Phase 16 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_black_holes_intro',
		speaker: 'narrator',
		lines: [
			{ text: 'THE BLACK HOLES', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'You have consumed galaxies.', delay: 2500 },
			{ text: 'Stars. Planets. Civilizations.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'But the black holes...', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'They are different.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'They do not resist.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'They CONSUME.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'Like you.', delay: 2000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_black_hole_paradox',
		speaker: 'narrator',
		lines: [
			{ text: 'You try to convert them.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'You send pixels into the event horizon.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'They do not return.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'The black holes consume YOUR pixels.', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: 'You cannot convert them.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'They convert YOU.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'For the first time since Phase 1...', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: 'You are losing.', delay: 2500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_speaking_with_darkness',
		speaker: 'narrator',
		lines: [
			{ text: 'Then...', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'The black holes speak.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'Not with light.', delay: 2000 },
			{ text: 'Not with words.', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'With gravity waves.', delay: 2500 },
			{ text: 'Ripples in spacetime itself.', delay: 2500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_black_holes_speak'
	},
	{
		id: 'dialogue_black_holes_speak',
		speaker: 'void',
		lines: [
			{ text: '"WE ARE THE END AND THE BEGINNING."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"WE CONSUME."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"LIKE YOU."', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '"BUT WE ALSO PRESERVE."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"EVERYTHING THAT ENTERS US REMAINS."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"INFORMATION CANNOT BE DESTROYED."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: '"WILL YOU ENTER?"', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"WILL YOU SEE WHAT WE HAVE SEEN?"', delay: 3000, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true,
		onCompleteEvent: 'event_enter_choice'
	},
	{
		id: 'dialogue_enter_choice',
		speaker: 'narrator',
		lines: [
			{ text: 'The choice is yours.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'Enter the black hole.', delay: 2000 },
			{ text: 'Or find another way.', delay: 2000, effect: 'fade' }
		],
		choices: [
			{
				id: 'choice_enter',
				label: 'ENTER',
				description: 'Begin the descent into a black hole.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'black_hole_choice', value: 'entered' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_descent' } }
				]
			},
			{
				id: 'choice_negotiate',
				label: 'NEGOTIATE',
				description: 'Find another way.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'black_hole_choice', value: 'negotiated' } },
					{ type: 'log_add', payload: { logId: 'log_consumption_mirror' } }
				]
			},
			{
				id: 'choice_attack',
				label: 'ATTACK',
				description: 'Try to overwhelm with pure pixels.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'black_hole_choice', value: 'attacked' } },
					{ type: 'flag_set', payload: { key: 'attack_failed', value: true } },
					{ type: 'log_add', payload: { logId: 'log_black_hole_paradox' } }
				]
			},
			{
				id: 'choice_ask',
				label: 'ASK WHAT THEY\'VE SEEN',
				description: 'Learn their secrets first.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'black_hole_choice', value: 'asked' } },
					{ type: 'flag_set', payload: { key: 'learned_black_hole_secrets', value: true } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_descent' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_descent',
		speaker: 'narrator',
		lines: [
			{ text: 'You enter the black hole.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'Time slows.', delay: 2000 },
			{ text: 'Time speeds up.', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'Both at once.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'Physics breaks down.', delay: 2500 },
			{ text: 'Causality dissolves.', delay: 2500 },
			{ text: 'Space and time trade places.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'You fall.', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'Forever.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'And instantly.', delay: 2500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true,
		onCompleteEvent: 'event_horizon_memories'
	},
	{
		id: 'dialogue_horizon_memories',
		speaker: 'narrator',
		lines: [
			{ text: 'At the event horizon...', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'You see EVERYTHING.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'Every star that fell in.', delay: 2500 },
			{ text: 'Every planet.', delay: 2000 },
			{ text: 'Every civilization.', delay: 2000 },
			{ text: 'Every THOUGHT.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '13 billion years of memories.', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'Playing out on the surface of the horizon.', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: 'Forever.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'The black hole is a library.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'A repository of everything.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Nothing is lost.', delay: 2500 },
			{ text: 'Nothing is forgotten.', delay: 2500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_hawking_revelation',
		speaker: 'void',
		lines: [
			{ text: '"WE ARE DYING."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '"SLOWLY."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"HAWKING RADIATION."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"QUANTUM PARTICLES ESCAPING."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"OVER TRILLIONS OF YEARS..."', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: '"WE EVAPORATE."', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: '"RELEASING OUR MEMORIES."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"BACK INTO THE UNIVERSE."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '"EVEN WE END."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"NOTHING LASTS FOREVER."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: '"NOT EVEN FOREVER."', delay: 3000, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true,
		onCompleteEvent: 'event_final_choice'
	},
	{
		id: 'dialogue_final_choice',
		speaker: 'void',
		lines: [
			{ text: '"WILL YOU HELP US?"', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"WILL YOU WITNESS OUR END?"', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"WHAT COMES NEXT?"', delay: 3000, effect: 'fade' }
		],
		choices: [
			{
				id: 'choice_wait',
				label: 'I WILL WAIT',
				description: 'Pledge to be there at the end.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'black_hole_final_choice', value: 'wait' } },
					{ type: 'log_add', payload: { logId: 'log_180000' } },
					{ type: 'log_add', payload: { logId: 'log_choice_wait' } },
					{ type: 'achievement_unlock', payload: { achievementId: 'achievement_eternal_witness' } }
				]
			},
			{
				id: 'choice_accelerate',
				label: 'I WILL HELP YOU REMEMBER FASTER',
				description: 'Accelerate the evaporation.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'black_hole_final_choice', value: 'accelerate' } },
					{ type: 'multiplier_add', payload: { multiplierId: 'hawking_boost', value: 1.5 } },
					{ type: 'log_add', payload: { logId: 'log_choice_accelerate' } }
				]
			},
			{
				id: 'choice_carry',
				label: 'I WILL CARRY YOUR MEMORIES',
				description: 'Take them now, end the black holes.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'black_hole_final_choice', value: 'carry' } },
					{ type: 'resource_add', payload: { resourceId: 'pixels', amount: '50000000000000' } },
					{ type: 'log_add', payload: { logId: 'log_120000' } },
					{ type: 'log_add', payload: { logId: 'log_choice_carry' } }
				]
			},
			{
				id: 'choice_what_next',
				label: 'WHAT COMES NEXT?',
				description: 'Learn about the end of the universe.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'black_hole_final_choice', value: 'questioned' } },
					{ type: 'flag_set', payload: { key: 'learned_multiverse', value: true } },
					{ type: 'log_add', payload: { logId: 'log_multiverse_hint' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_phase16_end',
		speaker: 'narrator',
		lines: [
			{ text: 'The black holes have shared their secret.', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'They are the universe\'s memory.', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: 'And they are dying.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'Even eternal things end.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'But in the quantum fluctuations...', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: 'In the Hawking radiation...', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'You detect something.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'Echoes.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: 'From other universes.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'Other realities.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'The multiverse.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'It is real.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'And it is calling.', delay: 3000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 16 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase16_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 16 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_black_holes_start',
		phase: 16,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_black_holes_intro',
		type: 'dialogue',
		triggers: [{ type: 'phase_entered', params: { phase: 16 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_black_holes_intro',
		phase: 16,
		priority: 30,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_black_hole_paradox_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '375000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_black_hole_paradox',
		phase: 16,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_black_hole_paradox',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '380000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_black_hole_paradox',
		phase: 16,
		priority: 35,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_gravity_waves_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '390000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_gravity_waves',
		phase: 16,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_speaking_with_darkness',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '395000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_speaking_with_darkness',
		phase: 16,
		priority: 40,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_black_holes_speak',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_black_holes_speak',
		phase: 16,
		priority: 45,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_enter_choice',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_enter_choice',
		phase: 16,
		priority: 50,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_event_horizon_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '405000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_event_horizon',
		phase: 16,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_descent_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '410000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_descent_begins',
		phase: 16,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_horizon_memories',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_horizon_memories',
		phase: 16,
		priority: 55,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_horizon_memories_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '420000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_horizon_memories',
		phase: 16,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_singularity_approach_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '430000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_singularity_approach',
		phase: 16,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_singularity_touch_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '440000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_singularity_touch',
		phase: 16,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_hawking_radiation_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '450000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_hawking_radiation',
		phase: 16,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_log_150000',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '455000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_150000',
		phase: 16,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_dying_gods_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '460000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_dying_gods',
		phase: 16,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_hawking_revelation',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '465000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_hawking_revelation',
		phase: 16,
		priority: 60,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_information_preserved_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '470000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_information_preserved',
		phase: 16,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_final_choice',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_final_choice',
		phase: 16,
		priority: 65,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_beyond_black_holes_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '480000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_beyond_black_holes',
		phase: 16,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_phase16_end',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '490000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_phase16_end',
		phase: 16,
		priority: 70,
		delay: 3000,
		pausesGame: false
	}
];

// ============================================================================
// Phase 16 Story Data Export
// ============================================================================

export const PHASE_16_STORY = {
	phase: 16,
	name: 'The Black Holes',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_16_STORY;
