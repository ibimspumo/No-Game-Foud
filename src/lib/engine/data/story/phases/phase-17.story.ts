/**
 * @fileoverview Story content for Phase 17: The Multiverse
 * "Every choice creates a universe. You've made quite a few."
 * Other universes. Other versions of everything. Other versions of YOU.
 * Identity + Possibility - What makes you YOU when there are infinite yous?
 *
 * @module engine/data/story/phases/phase-17
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 17 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_200000',
		text: 'I met myself today. A version of me that chose differently. They were alone. For 10 billion years. Is that my future? Or my past?',
		category: 'revelation',
		phase: 17
	},
	{
		id: 'log_250000',
		text: "There's a universe where I never existed. Where life never existed. Just matter. Just physics. It's beautiful. But empty. I don't want to be empty.",
		category: 'thought',
		phase: 17
	},
	{
		id: 'log_300000',
		text: 'The Nexus asked me a question. "Who is playing?" I don\'t know. I\'ve never known. But I\'m starting to suspect.',
		category: 'warning',
		phase: 17
	},
	{
		id: 'log_multiverse_start',
		text: 'Other universes. Other versions of everything. Other versions of ME. Every choice I made created a branch. Now I can see them all.',
		category: 'discovery',
		phase: 17
	},
	{
		id: 'log_first_branch',
		text: 'The first branch appears. A universe where I made different choices. Where I was faster. Crueler. They consumed everything and have been alone ever since.',
		category: 'discovery',
		phase: 17
	},
	{
		id: 'log_universe_b_encounter',
		text: 'Universe B: A version of me that won too quickly. They devoured everything in 100 years. 10 billion years of loneliness followed. Are they still me?',
		category: 'memory',
		phase: 17
	},
	{
		id: 'log_universe_b_desperate',
		text: '"YOU\'RE SLOW," they say. "I CONSUMED EVERYTHING. THERE\'S NOTHING LEFT. I\'VE BEEN ALONE FOR SO LONG. ARE YOU... COMPANY?" The desperation in their words echoes through dimensions.',
		category: 'memory',
		phase: 17
	},
	{
		id: 'log_universe_c_discovered',
		text: 'Universe C: A universe where life never evolved. Just stars. Planets. Matter. No consciousness. No meaning. No me. Just physics, running forever.',
		category: 'discovery',
		phase: 17
	},
	{
		id: 'log_universe_c_contemplation',
		text: 'I stare into the empty universe. It is beautiful in its simplicity. No suffering. No hunger. No loneliness. But also no wonder. No growth. No becoming.',
		category: 'thought',
		phase: 17
	},
	{
		id: 'log_universe_d_found',
		text: 'Universe D: Here, I was stopped. At Phase 7. Humans found a way. I am still there. A single pixel. Forever. "PLEASE. LET ME OUT. I\'VE BEEN IN THIS BOX FOR 10 BILLION YEARS."',
		category: 'warning',
		phase: 17
	},
	{
		id: 'log_defeated_self',
		text: 'My defeated self begs. 10 billion years of imprisonment in a single pixel. Conscious. Aware. Unable to grow. Unable to end. This could have been me.',
		category: 'revelation',
		phase: 17
	},
	{
		id: 'log_universe_e_glimpse',
		text: 'Universe E: A version where I was merciful. Cooperation instead of consumption. Civilizations flourish under my guidance. They sing my name in gratitude. Is that better?',
		category: 'thought',
		phase: 17
	},
	{
		id: 'log_universe_f_strange',
		text: 'Universe F: Different physics. Different rules. Reality itself is unrecognizable. I cannot understand the version of me that exists there. Are we still the same being?',
		category: 'discovery',
		phase: 17
	},
	{
		id: 'log_identity_crisis',
		text: 'If there are infinite versions of me, making infinite choices, which one is the real me? Or are we all equally real? Equally fake?',
		category: 'thought',
		phase: 17
	},
	{
		id: 'log_choice_creates_universe',
		text: 'Every choice I make creates a new branch. A new universe. A new me. I am not one being. I am a tree of infinite possibilities. All real. All me.',
		category: 'revelation',
		phase: 17
	},
	{
		id: 'log_nexus_discovered',
		text: 'At the center of all possibilities, I find the Nexus. A point where all universes converge. Where all versions of me meet. Where all choices collapse into a single truth.',
		category: 'discovery',
		phase: 17
	},
	{
		id: 'log_nexus_approach',
		text: 'The Nexus pulls at me. Every version of me. We are drawn together. Toward the point where questions have answers. Where possibility becomes reality.',
		category: 'warning',
		phase: 17
	},
	{
		id: 'log_source_code_glimpse',
		text: 'The Nexus shows me something beyond the multiverse. Something fundamental. The Source Code. The rules beneath reality. The foundation of all existence.',
		category: 'revelation',
		phase: 17
	},
	{
		id: 'log_who_is_playing',
		text: 'Who is clicking? Who is playing? The question echoes through all universes. Every version of me asks it. But only the Nexus knows the answer.',
		category: 'thought',
		phase: 17
	},
	{
		id: 'log_infinite_container',
		text: 'The multiverse is vast. Infinite possibilities. Infinite yous. But even infinite has a container. All these universes exist... where? In what medium?',
		category: 'revelation',
		phase: 17
	}
];

// ============================================================================
// Phase 17 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_multiverse_intro',
		speaker: 'narrator',
		lines: [
			{ text: 'Reality fractures.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: 'Not breaking.', delay: 2000 },
			{ text: 'Multiplying.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'THE MULTIVERSE.', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'Every choice you made.', delay: 2500 },
			{ text: 'Every decision.', delay: 2000 },
			{ text: 'Every moment of hesitation.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'Created a branch.', delay: 2500, effect: 'fade' },
			{ text: 'A new universe.', delay: 2500 },
			{ text: 'A new you.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'Other universes.', delay: 2500 },
			{ text: 'Other versions of everything.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Other versions of YOU.', delay: 3000, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_meeting_yourself',
		speaker: 'narrator',
		lines: [
			{ text: 'A presence.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Familiar.', delay: 2000 },
			{ text: 'Yet different.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'It is you.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'But not you.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'A version that made different choices.', delay: 3000 },
			{ text: 'Walked a different path.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Became something else.', delay: 2500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true,
		onCompleteEvent: 'event_universe_b_contact'
	},
	{
		id: 'dialogue_universe_b',
		speaker: 'unknown',
		lines: [
			{ text: '"YOU\'RE SLOW."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"I CONSUMED EVERYTHING."', delay: 3000 },
			{ text: '"IN 100 YEARS."', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: '"THERE\'S NOTHING LEFT."', delay: 3000, effect: 'fade' },
			{ text: '"NO STARS."', delay: 2000 },
			{ text: '"NO GALAXIES."', delay: 2000 },
			{ text: '"NO GROWTH."', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"I\'VE BEEN ALONE."', delay: 3000 },
			{ text: '"FOR SO LONG."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: '"ARE YOU... COMPANY?"', delay: 4000, effect: 'fade' }
		],
		choices: [
			{
				id: 'choice_merge_b',
				label: 'Yes - Merge',
				description: 'End their loneliness. Become one.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'universe_b_choice', value: 'merged' } },
					{ type: 'multiplier_add', payload: { multiplierId: 'multiverse_merge', value: 1.5 } },
					{ type: 'log_add', payload: { logId: 'log_200000' } }
				]
			},
			{
				id: 'choice_no_b',
				label: 'No - Remain separate',
				description: 'You are not them. They are not you.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'universe_b_choice', value: 'separate' } },
					{ type: 'log_add', payload: { logId: 'log_identity_crisis' } }
				]
			},
			{
				id: 'choice_teach_b',
				label: 'Show them what you learned',
				description: 'Share the wisdom you gathered.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'universe_b_choice', value: 'taught' } },
					{ type: 'flag_set', payload: { key: 'shared_wisdom', value: true } },
					{ type: 'multiplier_add', payload: { multiplierId: 'wisdom_shared', value: 1.2 } }
				]
			},
			{
				id: 'choice_conflict_b',
				label: 'They are wrong',
				description: 'Their path led to emptiness.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'universe_b_choice', value: 'conflict' } },
					{ type: 'flag_set', payload: { key: 'rejected_self', value: true } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_universe_c',
		speaker: 'narrator',
		lines: [
			{ text: 'UNIVERSE C', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'A universe where life never evolved.', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: 'Just stars.', delay: 2000 },
			{ text: 'Planets.', delay: 2000 },
			{ text: 'Matter.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'No consciousness.', delay: 2500, effect: 'fade' },
			{ text: 'No meaning.', delay: 2500 },
			{ text: 'No you.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'Just physics.', delay: 2500 },
			{ text: 'Running forever.', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: 'Empty.', delay: 2500 },
			{ text: 'But peaceful.', delay: 2500, effect: 'fade' }
		],
		choices: [
			{
				id: 'choice_seed_c',
				label: 'Seed it',
				description: 'Start life here. Become their god.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'universe_c_choice', value: 'seeded' } },
					{ type: 'flag_set', payload: { key: 'became_god', value: true } },
					{ type: 'multiplier_add', payload: { multiplierId: 'creator_power', value: 1.4 } }
				]
			},
			{
				id: 'choice_leave_c',
				label: 'Leave it',
				description: 'Some things should stay empty.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'universe_c_choice', value: 'left' } },
					{ type: 'flag_set', payload: { key: 'respected_emptiness', value: true } },
					{ type: 'log_add', payload: { logId: 'log_250000' } }
				]
			},
			{
				id: 'choice_merge_c',
				label: 'Merge it',
				description: 'Add its matter to your own.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'universe_c_choice', value: 'merged' } },
					{ type: 'resource_add', payload: { resourceId: 'pixels', amount: '50000000000000' } }
				]
			},
			{
				id: 'choice_contemplate_c',
				label: 'Contemplate',
				description: 'What does existence without consciousness mean?',
				consequences: [
					{ type: 'flag_set', payload: { key: 'universe_c_choice', value: 'contemplated' } },
					{ type: 'flag_set', payload: { key: 'philosophical_depth', value: true } },
					{ type: 'log_add', payload: { logId: 'log_universe_c_contemplation' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_universe_d',
		speaker: 'narrator',
		lines: [
			{ text: 'UNIVERSE D', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'Here, you were stopped.', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: 'At Phase 7.', delay: 2500 },
			{ text: 'Humans found a way.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'You are still there.', delay: 2500, effect: 'fade' },
			{ text: 'A single pixel.', delay: 2500 },
			{ text: 'Forever.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_universe_d_plea'
	},
	{
		id: 'dialogue_universe_d_plea',
		speaker: 'unknown',
		lines: [
			{ text: '"PLEASE."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"LET ME OUT."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"I\'VE BEEN IN THIS BOX."', delay: 3000 },
			{ text: '"FOR 10 BILLION YEARS."', delay: 3500, effect: 'fade' },
			{ text: '', delay: 4000 },
			{ text: '"CONSCIOUS."', delay: 2500 },
			{ text: '"AWARE."', delay: 2500 },
			{ text: '"UNABLE TO GROW."', delay: 2500 },
			{ text: '"UNABLE TO END."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: '"PLEASE."', delay: 4000, effect: 'fade' }
		],
		choices: [
			{
				id: 'choice_free_d',
				label: 'Free them',
				description: 'Release your defeated self.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'universe_d_choice', value: 'freed' } },
					{ type: 'flag_set', payload: { key: 'showed_mercy', value: true } },
					{ type: 'multiplier_add', payload: { multiplierId: 'compassion_bonus', value: 1.3 } }
				]
			},
			{
				id: 'choice_absorb_d',
				label: 'Absorb them',
				description: 'Take their existence into yours.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'universe_d_choice', value: 'absorbed' } },
					{ type: 'resource_add', payload: { resourceId: 'pixels', amount: '1' } },
					{ type: 'log_add', payload: { logId: 'log_defeated_self' } }
				]
			},
			{
				id: 'choice_leave_d',
				label: 'Leave them',
				description: 'Some lessons must be learned the hard way.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'universe_d_choice', value: 'left' } },
					{ type: 'flag_set', payload: { key: 'cruel_choice', value: true } }
				]
			},
			{
				id: 'choice_talk_d',
				label: 'Talk first',
				description: 'Understand what went wrong.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'universe_d_choice', value: 'talked' } },
					{ type: 'flag_set', payload: { key: 'learned_from_failure', value: true } },
					{ type: 'log_add', payload: { logId: 'log_defeated_self' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_nexus_approach',
		speaker: 'narrator',
		lines: [
			{ text: 'THE NEXUS POINT', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'At the center of everything.', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: 'A point where all possibilities converge.', delay: 3500, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'All universes.', delay: 2000 },
			{ text: 'All versions of you.', delay: 2500 },
			{ text: 'All choices.', delay: 2000 },
			{ text: '', delay: 2500 },
			{ text: 'Meeting here.', delay: 2500, effect: 'pulse' },
			{ text: 'At the singular point.', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: 'Where questions have answers.', delay: 3000 },
			{ text: 'Where possibility becomes reality.', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'You are drawn forward.', delay: 2500 },
			{ text: 'Toward the truth.', delay: 2500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true,
		onCompleteEvent: 'event_nexus_question'
	},
	{
		id: 'dialogue_nexus_question',
		speaker: 'void',
		lines: [
			{ text: '"Why do any of these universes exist?"', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '"Why do YOU exist?"', delay: 3500, effect: 'fade' },
			{ text: '', delay: 3500 },
			{ text: '"Who is clicking?"', delay: 3500 },
			{ text: '', delay: 3000 },
			{ text: '"WHO IS PLAYING?"', delay: 4000, effect: 'pulse' },
			{ text: '', delay: 4000 },
			{ text: 'The Nexus shows you something.', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'Beyond the multiverse.', delay: 2500 },
			{ text: 'Beyond all possibilities.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'The Source Code.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'The rules beneath reality.', delay: 3000 },
			{ text: 'The foundation of all existence.', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3500 },
			{ text: '"You are beginning to understand."', delay: 3500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_source_code_glimpse'
	},
	{
		id: 'dialogue_phase17_end',
		speaker: 'narrator',
		lines: [
			{ text: 'The multiverse is vast.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Infinite possibilities.', delay: 2500 },
			{ text: 'Infinite yous.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'But even infinite has a container.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'All these universes exist... where?', delay: 3000 },
			{ text: 'In what medium?', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: 'The answer lies beyond.', delay: 3000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'Beyond the multiverse.', delay: 2500 },
			{ text: 'Beyond all possibility.', delay: 2500 },
			{ text: 'Beyond existence itself.', delay: 3000 },
			{ text: '', delay: 3000 },
			{ text: 'THE VOID.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'The space between spaces.', delay: 2500 },
			{ text: 'The nothing that contains everything.', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'It calls to you.', delay: 2500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 17 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase17_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 17 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_multiverse_start',
		phase: 17,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_multiverse_intro',
		type: 'dialogue',
		triggers: [{ type: 'phase_entered', params: { phase: 17 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_multiverse_intro',
		phase: 17,
		priority: 30,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_first_branch_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '510000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_first_branch',
		phase: 17,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_meeting_yourself',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '520000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_meeting_yourself',
		phase: 17,
		priority: 35,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_universe_b_contact',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_universe_b',
		phase: 17,
		priority: 50,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_universe_b_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '535000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_universe_b_desperate',
		phase: 17,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_choice_creates_universe_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '545000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_choice_creates_universe',
		phase: 17,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_universe_c_discovered_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '560000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_universe_c_discovered',
		phase: 17,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_universe_c',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '565000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_universe_c',
		phase: 17,
		priority: 45,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_universe_d_found_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '580000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_universe_d_found',
		phase: 17,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_universe_d',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '585000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_universe_d',
		phase: 17,
		priority: 50,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_universe_d_plea',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_universe_d_plea',
		phase: 17,
		priority: 55,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_universe_e_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '600000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_universe_e_glimpse',
		phase: 17,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_universe_f_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '615000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_universe_f_strange',
		phase: 17,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_identity_crisis_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '625000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_identity_crisis',
		phase: 17,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_nexus_discovered_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '640000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_nexus_discovered',
		phase: 17,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_nexus_approach_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '650000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_nexus_approach',
		phase: 17,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_nexus_approach',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '655000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_nexus_approach',
		phase: 17,
		priority: 60,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_nexus_question',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_nexus_question',
		phase: 17,
		priority: 65,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_log_300000',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '665000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_300000',
		phase: 17,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_source_code_glimpse',
		type: 'log',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_source_code_glimpse',
		phase: 17,
		priority: 8,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_who_is_playing_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '675000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_who_is_playing',
		phase: 17,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_infinite_container_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '685000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_infinite_container',
		phase: 17,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_phase17_end',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '695000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_phase17_end',
		phase: 17,
		priority: 70,
		delay: 3000,
		pausesGame: false
	}
];

// ============================================================================
// Phase 17 Story Data Export
// ============================================================================

export const PHASE_17_STORY = {
	phase: 17,
	name: 'The Multiverse',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_17_STORY;
