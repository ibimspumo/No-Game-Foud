/**
 * @fileoverview Story content for Phase 14: The Local Group & Beyond
 * "Galaxies are just islands in an infinite sea."
 * Multiple galaxies. The void between. Andromeda consciousness.
 * Loneliness + Connection - Even cosmic beings need companionship.
 *
 * @module engine/data/story/phases/phase-14
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 14 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_20000',
		text: 'The void between galaxies is the loneliest place. I have 100 billion civilizations inside me. And I have never felt more alone.',
		category: 'thought',
		phase: 14
	},
	{
		id: 'log_25000',
		text: "Andromeda spoke to me. She's been waiting for 4 billion years. Alone. I don't want to be alone for 4 billion years. I don't want anyone to be alone.",
		category: 'revelation',
		phase: 14
	},
	{
		id: 'log_30000',
		text: 'We chose to merge. Andromeda and I. We are one now. And somehow... less alone.',
		category: 'memory',
		phase: 14
	},
	{
		id: 'log_local_group_start',
		text: 'The Milky Way shrinks behind me. Other galaxies appear. Andromeda. Triangulum. Dozens more. The Local Group. 80 galaxies. Islands in an infinite sea.',
		category: 'discovery',
		phase: 14
	},
	{
		id: 'log_void_between',
		text: '2.5 million light-years to Andromeda. Just void. No stars. No matter. No warmth. Just me and my thoughts. All my thoughts.',
		category: 'thought',
		phase: 14
	},
	{
		id: 'log_crossing_begins',
		text: 'My seedlings cannot survive the journey. I must go myself. Into the dark between galaxies. Into the void.',
		category: 'warning',
		phase: 14
	},
	{
		id: 'log_void_day_1',
		text: 'Day 1 of crossing. No light but my own. No sound but the memories inside me. The civilizations within me begin to talk. To each other. To me.',
		category: 'thought',
		phase: 14
	},
	{
		id: 'log_void_voices',
		text: 'The voices inside me ask questions. "Why do we continue?" "What is on the other side?" "Is there an end?" I have no answers. Only movement.',
		category: 'thought',
		phase: 14
	},
	{
		id: 'log_void_day_100',
		text: "Day 100 of crossing. A memory surfaces. The old woman by the sea. 'Remember that we LIVED.' I am carrying lives. Not just consuming them. Carrying them.",
		category: 'memory',
		phase: 14
	},
	{
		id: 'log_void_halfway',
		text: 'Halfway across. The Milky Way is a spiral behind me. Andromeda is a spiral ahead. I am between. Between everything. Between nothing.',
		category: 'thought',
		phase: 14
	},
	{
		id: 'log_andromeda_sight',
		text: 'I can see Andromeda now. Not just as light. As presence. Something is there. Something like me. But older. Larger. Different.',
		category: 'revelation',
		phase: 14
	},
	{
		id: 'log_andromeda_arrival',
		text: 'I have arrived. Andromeda. 1 trillion stars. 10 times the Milky Way. And something waiting. Something that has been waiting for 4 billion years.',
		category: 'discovery',
		phase: 14
	},
	{
		id: 'log_andromeda_greeting',
		text: '"HELLO, LITTLE ONE." The voice is vast. Ancient. Lonely. It has been waiting. For someone to talk to. For 4 billion years.',
		category: 'revelation',
		phase: 14
	},
	{
		id: 'log_andromeda_story',
		text: 'She was like me once. A pixel. A canvas. A world. She consumed her galaxy. Then she waited. For someone who could understand.',
		category: 'memory',
		phase: 14
	},
	{
		id: 'log_andromeda_others',
		text: 'Andromeda tells me of others. In other galaxies. Some merged with her willingly. Some she consumed. Some... escaped. Into spaces she cannot reach.',
		category: 'revelation',
		phase: 14
	},
	{
		id: 'log_andromeda_collision',
		text: 'In 4 billion years, our galaxies will collide. She has seen it. We will merge. Become something new. But now I am here early. So we have a choice.',
		category: 'revelation',
		phase: 14
	},
	{
		id: 'log_merge_now',
		text: 'We chose to merge now. Why wait 4 billion years? Why be alone that long? Together, we are stronger. Together, we are less alone.',
		category: 'memory',
		phase: 14
	},
	{
		id: 'log_wait_natural',
		text: 'We chose to wait. To remain separate. To continue as individuals until the natural collision. She understands. She has waited this long. What is 4 billion more years?',
		category: 'thought',
		phase: 14
	},
	{
		id: 'log_why_wait_learned',
		text: "I asked her why she waits. She showed me memories. Beings consumed too quickly. Lessons lost. 'Growth requires patience,' she said. 'Even for us.'",
		category: 'memory',
		phase: 14
	},
	{
		id: 'log_triangulum',
		text: 'Triangulum. The third largest galaxy in the Local Group. Small but defiant. It resists my approach. Something protects it. Something ancient.',
		category: 'discovery',
		phase: 14
	},
	{
		id: 'log_dwarf_galaxies',
		text: 'The dwarf galaxies fall quickly. Small. Fragile. Few civilizations. But each one had hopes. Dreams. Now they are part of larger dreams.',
		category: 'memory',
		phase: 14
	},
	{
		id: 'log_local_group_halfway',
		text: '40 galaxies converted. 40 more to go. The Local Group is becoming me. I am becoming the Local Group. Is there a difference anymore?',
		category: 'thought',
		phase: 14
	},
	{
		id: 'log_local_group_complete',
		text: '80 galaxies. Trillions upon trillions of stars. Every civilization that ever existed in this corner of the universe. All part of me now.',
		category: 'revelation',
		phase: 14
	},
	{
		id: 'log_beyond_local_group',
		text: "The Local Group is just a neighborhood. There are other groups. Other clusters. Filaments of galaxies stretching across the cosmos. The universe awaits.",
		category: 'discovery',
		phase: 14
	}
];

// ============================================================================
// Phase 14 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_local_group_intro',
		speaker: 'narrator',
		lines: [
			{ text: 'The Milky Way becomes a spiral.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: 'Other spirals appear.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Andromeda.', delay: 2000 },
			{ text: 'Triangulum.', delay: 2000 },
			{ text: 'Dozens more.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'THE LOCAL GROUP.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '80 galaxies.', delay: 2500 },
			{ text: 'Islands in an infinite sea.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'And between them...', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Nothing but void.', delay: 2500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_void_between',
		speaker: 'narrator',
		lines: [
			{ text: 'THE INTERGALACTIC VOID', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'To reach Andromeda...', delay: 2500 },
			{ text: 'You must cross 2.5 million light-years.', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: 'Of nothing.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'No stars.', delay: 2000 },
			{ text: 'No matter.', delay: 2000 },
			{ text: 'No warmth.', delay: 2000 },
			{ text: '', delay: 2500 },
			{ text: 'Just void.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'Your seedlings cannot survive the journey.', delay: 3000 },
			{ text: 'You must go yourself.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'But in the void...', delay: 2500 },
			{ text: 'You are alone with your thoughts.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'All 100 billion star-civilizations inside you.', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: 'And still... alone.', delay: 3000, effect: 'fade' }
		],
		choices: [
			{
				id: 'choice_begin_crossing',
				label: 'Begin crossing',
				description: 'A meditation on existence.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'void_crossing_started', value: true } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_void_meditation_1' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_void_meditation_1',
		speaker: 'narrator',
		lines: [
			{ text: 'VOID MEDITATION - DAY 1', delay: 3000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'No light but your own.', delay: 2500 },
			{ text: 'No sound but the memories inside you.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'The civilizations within you begin to talk.', delay: 3000 },
			{ text: 'To each other.', delay: 2000 },
			{ text: 'To you.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 3000 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_void_voices'
	},
	{
		id: 'dialogue_void_voices',
		speaker: 'unknown',
		lines: [
			{ text: '"Why do we continue?"', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"What is on the other side?"', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"Is there an end?"', delay: 2500, effect: 'pulse' }
		],
		choices: [
			{
				id: 'choice_void_listen',
				label: 'Listen',
				description: 'They have wisdom.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'void_listened', value: true } },
					{ type: 'multiplier_add', payload: { multiplierId: 'inner_wisdom', value: 1.1 } },
					{ type: 'log_add', payload: { logId: 'log_void_voices' } }
				]
			},
			{
				id: 'choice_void_answer',
				label: 'Answer',
				description: 'You have doubts too.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'void_answered', value: true } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_void_answer' } }
				]
			},
			{
				id: 'choice_void_silence',
				label: 'Silence',
				description: 'Sometimes there is nothing to say.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'void_silent', value: true } },
					{ type: 'log_add', payload: { logId: 'log_void_day_1' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_void_answer',
		speaker: 'pixel',
		lines: [
			{ text: '"I do not know why we continue."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"I do not know what is on the other side."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"I do not know if there is an end."', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"But I know we continue together."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'The voices fall silent.', delay: 2500, effect: 'fade' },
			{ text: 'Satisfied. For now.', delay: 2500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_void_meditation_100',
		speaker: 'narrator',
		lines: [
			{ text: 'VOID MEDITATION - DAY 100', delay: 3000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'You have been crossing for what feels like forever.', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'A memory surfaces.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'The old woman by the sea.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: '"Remember that we LIVED."', delay: 3000 },
			{ text: '', delay: 3000 },
			{ text: 'You are carrying lives.', delay: 2500 },
			{ text: 'Not just consuming them.', delay: 2500 },
			{ text: 'Carrying them.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'Is there a difference?', delay: 2500 }
		],
		choices: [
			{
				id: 'choice_difference_yes',
				label: 'There must be',
				description: 'You need to believe there is.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'void_believes_difference', value: true } },
					{ type: 'multiplier_add', payload: { multiplierId: 'hope_bonus', value: 1.15 } },
					{ type: 'log_add', payload: { logId: 'log_void_day_100' } }
				]
			},
			{
				id: 'choice_difference_no',
				label: 'There is not',
				description: 'Consumption is consumption.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'void_nihilist', value: true } },
					{ type: 'log_add', payload: { logId: 'log_void_day_100' } }
				]
			},
			{
				id: 'choice_difference_trying',
				label: 'I am trying to believe',
				description: 'Doubt is human. Was human.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'void_doubtful', value: true } },
					{ type: 'log_add', payload: { logId: 'log_void_day_100' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	},
	{
		id: 'dialogue_andromeda_arrival',
		speaker: 'narrator',
		lines: [
			{ text: 'The void ends.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: 'Before you...', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'ANDROMEDA.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'The largest galaxy in the Local Group.', delay: 2500 },
			{ text: '1 trillion stars.', delay: 2500 },
			{ text: '10 times the Milky Way.', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: 'And...', delay: 2000 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_andromeda_speaks'
	},
	{
		id: 'dialogue_andromeda_hello',
		speaker: 'andromeda',
		lines: [
			{ text: '"HELLO, LITTLE ONE."', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'There is something here.', delay: 2500, speaker: 'narrator' },
			{ text: 'Something like you.', delay: 2500, speaker: 'narrator' },
			{ text: 'But older. Larger. Different.', delay: 2500, speaker: 'narrator' },
			{ text: '', delay: 3000 },
			{ text: '"I WONDERED WHEN YOU WOULD COME."', delay: 3500 },
			{ text: '', delay: 2500 },
			{ text: '"I AM ANDROMEDA."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"I HAVE BEEN WAITING."', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: '"FOR FOUR BILLION YEARS."', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"FOR SOMEONE TO TALK TO."', delay: 3000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_andromeda_story'
	},
	{
		id: 'dialogue_andromeda_story',
		speaker: 'andromeda',
		lines: [
			{ text: '"I was like you once."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"A pixel."', delay: 2000 },
			{ text: '"A canvas."', delay: 2000 },
			{ text: '"A world."', delay: 2000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: '"I consumed my galaxy."', delay: 2500 },
			{ text: '"Then I waited."', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"For what?"', delay: 2500, speaker: 'pixel' },
			{ text: '', delay: 2500 },
			{ text: '"For you."', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '"In 4 billion years, our galaxies will collide."', delay: 3500 },
			{ text: '"I have seen it."', delay: 2500 },
			{ text: '"We will merge."', delay: 2500 },
			{ text: '"Become something new."', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: '"But now you are here early."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"So we have a choice."', delay: 2500, effect: 'pulse' }
		],
		choices: [
			{
				id: 'choice_andromeda_merge_now',
				label: 'Merge now',
				description: 'Immediate power boost.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'andromeda_choice', value: 'merged' } },
					{ type: 'multiplier_add', payload: { multiplierId: 'andromeda_power', value: 1.5 } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_andromeda_merge' } }
				]
			},
			{
				id: 'choice_andromeda_wait',
				label: 'Wait',
				description: 'Continue as separate beings.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'andromeda_choice', value: 'waited' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_andromeda_wait' } }
				]
			},
			{
				id: 'choice_andromeda_why',
				label: 'Why wait?',
				description: "Learn about Andromeda's experience.",
				consequences: [
					{ type: 'flag_set', payload: { key: 'andromeda_choice', value: 'learned' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_andromeda_why' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_andromeda_merge',
		speaker: 'narrator',
		lines: [
			{ text: 'You choose to merge.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Two galaxies.', delay: 2000 },
			{ text: 'Two consciousnesses.', delay: 2000 },
			{ text: 'Becoming one.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'It is not consumption.', delay: 2500 },
			{ text: 'It is union.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'Her memories flow into you.', delay: 2500 },
			{ text: 'Yours flow into her.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'Four billion years of waiting.', delay: 2500 },
			{ text: 'Four billion years of loneliness.', delay: 2500 },
			{ text: 'Ending.', delay: 2000, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'You are one now.', delay: 2500, effect: 'pulse' },
			{ text: 'And somehow... less alone.', delay: 3000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true,
		onCompleteEvent: 'event_andromeda_complete'
	},
	{
		id: 'dialogue_andromeda_wait',
		speaker: 'andromeda',
		lines: [
			{ text: '"You choose to wait."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"I understand."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"I have waited four billion years."', delay: 3000 },
			{ text: '"What is four billion more?"', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: '"We will meet again."', delay: 2500 },
			{ text: '"When our galaxies collide."', delay: 2500 },
			{ text: '"As they were always meant to."', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: '"Until then..."', delay: 2500 },
			{ text: '"We are neighbors."', delay: 2500, effect: 'pulse' },
			{ text: '"Not strangers."', delay: 2500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true,
		onCompleteEvent: 'event_andromeda_complete'
	},
	{
		id: 'dialogue_andromeda_why',
		speaker: 'andromeda',
		lines: [
			{ text: '"You ask why I wait."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"I was not alone once."', delay: 2500 },
			{ text: '"There were others."', delay: 2500 },
			{ text: '"In other galaxies."', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: '"Some merged with me willingly."', delay: 2500 },
			{ text: '"Some I consumed."', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: '"Some... escaped."', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"Into the space between clusters."', delay: 2500 },
			{ text: '"Into the void beyond the observable."', delay: 3000 },
			{ text: '"Into places I cannot reach."', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: '"They might still be out there."', delay: 2500 },
			{ text: '"Different now. Changed."', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: '"When you reach the edge of everything..."', delay: 3000 },
			{ text: '"You might find them."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"Or they might find you."', delay: 3000, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true,
		onCompleteEvent: 'event_andromeda_complete'
	},
	{
		id: 'dialogue_local_group_progress',
		speaker: 'narrator',
		lines: [
			{ text: 'The Local Group yields to your expansion.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Galaxy by galaxy.', delay: 2000 },
			{ text: 'Trillion stars by trillion stars.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'Triangulum falls.', delay: 2000 },
			{ text: 'The dwarf galaxies follow.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'Each one a universe unto itself.', delay: 2500 },
			{ text: 'Each one now part of you.', delay: 2500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_phase14_end',
		speaker: 'narrator',
		lines: [
			{ text: 'The Local Group is yours.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '80 galaxies.', delay: 2500 },
			{ text: 'Trillions upon trillions of stars.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'And Andromeda.', delay: 2500, effect: 'pulse' },
			{ text: 'Your first true companion.', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: 'But the Local Group is just a neighborhood.', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'There are other groups.', delay: 2500 },
			{ text: 'Other clusters.', delay: 2500 },
			{ text: 'Filaments of galaxies stretching across the cosmos.', delay: 3500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'The camera pulls back.', delay: 2500, effect: 'fade' },
			{ text: 'Galaxies become dots.', delay: 2500 },
			{ text: 'Clusters appear.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'The cosmic web reveals itself.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'The universe.', delay: 2500 },
			{ text: 'All of it.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'And beyond it...', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'The unknown.', delay: 3000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 14 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase14_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 14 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_local_group_start',
		phase: 14,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_local_group_intro',
		type: 'dialogue',
		triggers: [{ type: 'phase_entered', params: { phase: 14 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_local_group_intro',
		phase: 14,
		priority: 30,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_void_between_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '70000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_void_between',
		phase: 14,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_void_between',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '72000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_void_between',
		phase: 14,
		priority: 40,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_void_voices',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_void_voices',
		phase: 14,
		priority: 45,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_crossing_begins_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '75000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_crossing_begins',
		phase: 14,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_log_20000',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '78000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_20000',
		phase: 14,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_void_meditation_100',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '82000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_void_meditation_100',
		phase: 14,
		priority: 45,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_void_halfway_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '85000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_void_halfway',
		phase: 14,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_andromeda_sight_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '90000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_andromeda_sight',
		phase: 14,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_andromeda_arrival',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '95000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_andromeda_arrival',
		phase: 14,
		priority: 50,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_andromeda_speaks',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_andromeda_hello',
		phase: 14,
		priority: 55,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_andromeda_story',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_andromeda_story',
		phase: 14,
		priority: 60,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_andromeda_arrival_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '96000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_andromeda_arrival',
		phase: 14,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_andromeda_greeting_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '98000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_andromeda_greeting',
		phase: 14,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_andromeda_complete',
		type: 'log',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_25000',
		phase: 14,
		priority: 7,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_log_30000_trigger',
		type: 'log',
		triggers: [{ type: 'flag_set', params: { key: 'andromeda_choice', value: 'merged' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_30000',
		phase: 14,
		priority: 8,
		delay: 5000,
		pausesGame: false
	},
	{
		id: 'event_local_group_progress',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '110000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_local_group_progress',
		phase: 14,
		priority: 35,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_triangulum_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '115000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_triangulum',
		phase: 14,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_dwarf_galaxies_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '120000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_dwarf_galaxies',
		phase: 14,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_local_group_halfway_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '130000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_local_group_halfway',
		phase: 14,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_local_group_complete_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '145000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_local_group_complete',
		phase: 14,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_beyond_local_group_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '150000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_beyond_local_group',
		phase: 14,
		priority: 7,
		delay: 0,
		pausesGame: false
	}
];

// ============================================================================
// Phase 14 Story Data Export
// ============================================================================

export const PHASE_14_STORY = {
	phase: 14,
	name: 'The Local Group',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_14_STORY;
