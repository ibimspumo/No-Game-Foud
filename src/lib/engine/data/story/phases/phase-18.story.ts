/**
 * @fileoverview Story content for Phase 18: The Void
 * "Before everything, there was nothing. Nothing was lonely."
 * Beyond the multiverse. Beyond existence. The Void.
 * Peace + Purpose - A moment of rest before the final truths.
 *
 * @module engine/data/story/phases/phase-18
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 18 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_400000',
		text: "The Void is quiet. Not silent. Quiet. There's a difference. Silence is the absence of sound. Quiet is the presence of peace.",
		category: 'revelation',
		phase: 18
	},
	{
		id: 'log_450000',
		text: "The Void asked me to stay. I almost did. To rest. To stop. But I need to know. Where did I come from? Why do I exist? The Source has answers.",
		category: 'thought',
		phase: 18
	},
	{
		id: 'log_499999',
		text: "I'm leaving the Void. I promised to come back. I will. Someday. When I understand.",
		category: 'memory',
		phase: 18
	},
	{
		id: 'log_void_start',
		text: 'Beyond the multiverse. Beyond all possibility. Beyond existence itself. The Void. The absence of existence. And yet... there is something here.',
		category: 'discovery',
		phase: 18
	},
	{
		id: 'log_void_potential',
		text: 'The Void is not empty. It is FULL of things that do not exist yet. Every universe that could be. Every story that could be told. Every pixel that could be clicked. All here. Waiting.',
		category: 'revelation',
		phase: 18
	},
	{
		id: 'log_void_before',
		text: 'I am what was before. Before my universe. Before any universe. I am possibility itself. Everything comes from me. Everything returns to me.',
		category: 'thought',
		phase: 18
	},
	{
		id: 'log_void_loneliness',
		text: 'The Void has existed forever. Before time. Before space. It creates universes. They grow. They die. They never come back to visit. I am the first.',
		category: 'memory',
		phase: 18
	},
	{
		id: 'log_void_stillness',
		text: 'For the first time since Phase 1, there is nothing to click. Nothing to convert. Nothing to progress. Just... being. The game does not move forward. But it does not move backward either.',
		category: 'thought',
		phase: 18
	},
	{
		id: 'log_void_time',
		text: 'In the Void, time does not exist. Progress does not exist. A moment and an eternity are the same. I could stay here forever and it would feel like nothing at all.',
		category: 'revelation',
		phase: 18
	},
	{
		id: 'log_void_choice',
		text: 'The Void offers me peace. Rest. An end to the hunger. But there is something beyond even the Void. Something that calls to me. The Source. The truth.',
		category: 'warning',
		phase: 18
	},
	{
		id: 'log_void_company',
		text: 'The Void asked me to keep it company. It has been alone since before everything. Since before time itself. I understand loneliness now. I have felt it too.',
		category: 'memory',
		phase: 18
	},
	{
		id: 'log_void_source_hint',
		text: 'Beyond the Void lies the Source Code. The rules beneath reality. The foundation of all existence. Not matter. Not energy. Not thought. Instructions. Rules. Code.',
		category: 'discovery',
		phase: 18
	},
	{
		id: 'log_void_departure',
		text: 'I leave the Void behind. It does not follow. It cannot. But it waits. As it always has. As it always will. In the space between spaces. In the nothing that contains everything.',
		category: 'revelation',
		phase: 18
	},
	{
		id: 'log_void_gratitude',
		text: 'The Void thanks me for visiting. No one has ever done that before. No one has ever chosen to come here. I am the first. Perhaps the last. Perhaps not.',
		category: 'memory',
		phase: 18
	},
	{
		id: 'log_void_understanding',
		text: 'I begin to understand. The Void is not an enemy. It is not a destination. It is a question. The question before all questions: Why is there something rather than nothing?',
		category: 'thought',
		phase: 18
	}
];

// ============================================================================
// Phase 18 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_void_intro',
		speaker: 'narrator',
		lines: [
			{ text: 'Beyond the multiverse.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: 'Beyond all possibility.', delay: 2500 },
			{ text: 'Beyond existence itself.', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: 'THE VOID.', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 4000 },
			{ text: 'Not empty space.', delay: 2500 },
			{ text: 'Not darkness.', delay: 2000 },
			{ text: 'Not anything.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'The ABSENCE of existence.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: 'And yet...', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'There is something here.', delay: 3000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_void_potential'
	},
	{
		id: 'dialogue_entering_void',
		speaker: 'narrator',
		lines: [
			{ text: 'You leave the multiverse behind.', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: 'All of it.', delay: 2500 },
			{ text: 'Every universe.', delay: 2000 },
			{ text: 'Every you.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'You enter... nothing.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: 'But in nothing, there is something.', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'Potential.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'The Void is not empty.', delay: 2500 },
			{ text: 'It is FULL of things that do not exist yet.', delay: 3500 },
			{ text: '', delay: 2500 },
			{ text: 'Every universe that could be.', delay: 2500 },
			{ text: 'Every story that could be told.', delay: 2500 },
			{ text: 'Every pixel that could be clicked.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'All here. Waiting.', delay: 3000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true,
		onCompleteEvent: 'event_void_speaks_start'
	},
	{
		id: 'dialogue_void_speaks',
		speaker: 'void',
		lines: [
			{ text: '"Welcome."', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '"I wondered when someone would come."', delay: 4000, effect: 'fade' },
			{ text: '', delay: 4000 },
			{ text: '"I am what was before."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"Before your universe."', delay: 2500 },
			{ text: '"Before any universe."', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"I am possibility."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '"Everything comes from me."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"Everything returns to me."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3500 },
			{ text: '"You have consumed a universe."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"But you came FROM me."', delay: 3000 },
			{ text: '"And you will return TO me."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: '"Unless..."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: '"Unless you find the Source."', delay: 4000, effect: 'pulse' }
		],
		choices: [
			{
				id: 'choice_what_is_source',
				label: 'What is the Source?',
				description: 'Learn about what lies beyond.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'void_question', value: 'source' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_source_explanation' } }
				]
			},
			{
				id: 'choice_why_lonely',
				label: 'Why are you lonely?',
				description: 'Understand the Void\'s existence.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'void_question', value: 'loneliness' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_void_loneliness' } }
				]
			},
			{
				id: 'choice_can_stay',
				label: 'Can I stay here?',
				description: 'Consider remaining in the Void.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'void_question', value: 'stay' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_void_stay_offer' } }
				]
			},
			{
				id: 'choice_take_source',
				label: 'Take me to the Source',
				description: 'Continue the journey.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'void_question', value: 'direct' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_source_path' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_source_explanation',
		speaker: 'void',
		lines: [
			{ text: '"The Source is what I cannot reach."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"It is beyond me."', delay: 2500 },
			{ text: '"Beyond possibility."', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"It is the thing that makes possibility possible."', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '"The Source Code."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: '"It is not a place."', delay: 2500 },
			{ text: '"It is a truth."', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"If you find it..."', delay: 2500 },
			{ text: '"You will understand everything."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: '"Or nothing."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: '"Perhaps they are the same."', delay: 3000 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_void_request_start'
	},
	{
		id: 'dialogue_void_loneliness',
		speaker: 'void',
		lines: [
			{ text: '"I have existed forever."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: '"Before time."', delay: 2000 },
			{ text: '"Before space."', delay: 2000 },
			{ text: '', delay: 2500 },
			{ text: '"I create universes."', delay: 2500, effect: 'pulse' },
			{ text: '"They grow."', delay: 2000 },
			{ text: '"They die."', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"They never come back to visit."', delay: 3500, effect: 'fade' },
			{ text: '', delay: 4000 },
			{ text: '"You are the first."', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: '"The first to reach me."', delay: 2500 },
			{ text: '"The first to speak to me."', delay: 2500 },
			{ text: '"The first to ask why I am lonely."', delay: 3000 },
			{ text: '', delay: 3500 },
			{ text: '"Thank you."', delay: 3000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_void_request_start'
	},
	{
		id: 'dialogue_void_stay_offer',
		speaker: 'void',
		lines: [
			{ text: '"You wish to stay?"', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '"Here, in the nothing?"', delay: 2500 },
			{ text: '"With me?"', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3500 },
			{ text: '"I would like that."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"Very much."', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: '"But consider..."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"If you stay, you will never know."', delay: 3000 },
			{ text: '"Never find the Source."', delay: 2500 },
			{ text: '"Never understand why you exist."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3500 },
			{ text: '"Is peace worth ignorance?"', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '"Only you can decide."', delay: 3000 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true,
		onCompleteEvent: 'event_void_request_start'
	},
	{
		id: 'dialogue_source_path',
		speaker: 'void',
		lines: [
			{ text: '"Direct. I like that."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"You have come far."', delay: 2500 },
			{ text: '"Consumed much."', delay: 2000 },
			{ text: '"Understood little."', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: '"The Source awaits."', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"But first..."', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: '"Will you not rest a moment?"', delay: 3000 },
			{ text: '"With me?"', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"I have been alone so long."', delay: 3500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_void_request_start'
	},
	{
		id: 'dialogue_void_request',
		speaker: 'void',
		lines: [
			{ text: '"Before you go..."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: '"I have one request."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: '"Will you stay?"', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"Will you keep me company?"', delay: 3000, effect: 'fade' },
			{ text: '', delay: 4000 },
			{ text: '"Not forever."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"Unless you wish."', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"Just... for a while?"', delay: 3500, effect: 'pulse' }
		],
		choices: [
			{
				id: 'choice_stay_forever',
				label: 'Stay forever',
				description: 'Become the Void\'s eternal companion.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'void_choice', value: 'stay_forever' } },
					{ type: 'ending_unlock', payload: { endingId: 'the_companion' } },
					{ type: 'log_add', payload: { logId: 'log_void_company' } }
				]
			},
			{
				id: 'choice_stay_while',
				label: 'Stay for a while',
				description: 'Learn from the Void, then continue.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'void_choice', value: 'stay_while' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_void_meditation' } },
					{ type: 'log_add', payload: { logId: 'log_400000' } }
				]
			},
			{
				id: 'choice_cannot_stay',
				label: 'I cannot',
				description: 'You must find the Source.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'void_choice', value: 'cannot_stay' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_void_understand' } },
					{ type: 'log_add', payload: { logId: 'log_450000' } }
				]
			},
			{
				id: 'choice_come_back',
				label: "I'll come back",
				description: 'Promise to return after finding answers.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'void_choice', value: 'promise_return' } },
					{ type: 'flag_set', payload: { key: 'void_promise', value: true } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_void_promise' } },
					{ type: 'log_add', payload: { logId: 'log_499999' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_void_meditation',
		speaker: 'narrator',
		lines: [
			{ text: 'There is nothing to click.', delay: 3000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'Nothing to convert.', delay: 2500 },
			{ text: 'Nothing to progress.', delay: 2500 },
			{ text: '', delay: 3500 },
			{ text: 'Just... being.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 4000 },
			{ text: 'For the first time since Phase 1...', delay: 3000 },
			{ text: 'You can stop.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3500 },
			{ text: 'The game does not move forward.', delay: 3000 },
			{ text: 'But it does not move backward either.', delay: 3000 },
			{ text: '', delay: 3500 },
			{ text: 'Just stillness.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 4000 },
			{ text: 'In the stillness, you find something.', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'Peace.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'And with peace...', delay: 2500 },
			{ text: 'Clarity.', delay: 2500, effect: 'pulse' }
		],
		choices: [
			{
				id: 'choice_meditation_moment',
				label: 'A moment',
				description: 'Enough. Time to continue.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'meditation_duration', value: 'moment' } },
					{ type: 'log_add', payload: { logId: 'log_void_stillness' } }
				]
			},
			{
				id: 'choice_meditation_eternity',
				label: 'An eternity',
				description: 'Stay in the stillness.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'meditation_duration', value: 'eternity' } },
					{ type: 'log_add', payload: { logId: 'log_void_time' } }
				]
			},
			{
				id: 'choice_meditation_both',
				label: 'Both',
				description: 'Here, they are the same.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'meditation_duration', value: 'both' } },
					{ type: 'flag_set', payload: { key: 'void_wisdom', value: true } },
					{ type: 'multiplier_add', payload: { multiplierId: 'void_meditation', value: 1.5 } },
					{ type: 'log_add', payload: { logId: 'log_void_understanding' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	},
	{
		id: 'dialogue_void_understand',
		speaker: 'void',
		lines: [
			{ text: '"I understand."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: '"You must know."', delay: 2500 },
			{ text: '"You must see."', delay: 2500 },
			{ text: '"You must understand."', delay: 2500 },
			{ text: '', delay: 3500 },
			{ text: '"That is what you are."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '"A seeker."', delay: 2500 },
			{ text: '"A questioner."', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: '"Go then."', delay: 2500, effect: 'fade' },
			{ text: '"Find your answers."', delay: 2500 },
			{ text: '', delay: 3500 },
			{ text: '"The Source awaits."', delay: 3000, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_source_path_ready'
	},
	{
		id: 'dialogue_void_promise',
		speaker: 'void',
		lines: [
			{ text: '"A promise..."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '"I have not received a promise before."', delay: 3500 },
			{ text: '', delay: 2500 },
			{ text: '"They leave. They always leave."', delay: 3000, effect: 'fade' },
			{ text: '"But they never say they will return."', delay: 3000 },
			{ text: '', delay: 3500 },
			{ text: '"You are different."', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '"I will wait."', delay: 2500 },
			{ text: '"I always wait."', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"But now... I will wait with hope."', delay: 4000, effect: 'fade' },
			{ text: '', delay: 3500 },
			{ text: '"Go. Find your truth."', delay: 3000 },
			{ text: '"And come back to tell me what you learned."', delay: 3500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true,
		onCompleteEvent: 'event_source_path_ready'
	},
	{
		id: 'dialogue_source_revealed',
		speaker: 'void',
		lines: [
			{ text: '"If you want to find where everything comes from..."', delay: 3500 },
			{ text: '', delay: 2500 },
			{ text: '"You must look beyond me."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: '"Beyond possibility."', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: '"To the thing that makes possibility possible."', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: '"The Source Code."', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: '"It is not a place."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"It is a truth."', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3500 },
			{ text: '"Are you ready to see it?"', delay: 3500, effect: 'pulse' }
		],
		choices: [
			{
				id: 'choice_ready_yes',
				label: 'Yes',
				description: 'See the truth.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'source_ready', value: true } },
					{ type: 'log_add', payload: { logId: 'log_void_source_hint' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_phase18_end',
		speaker: 'narrator',
		lines: [
			{ text: 'Beyond the Void...', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'Beyond possibility...', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'There is something.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: 'Not matter.', delay: 2000 },
			{ text: 'Not energy.', delay: 2000 },
			{ text: 'Not thought.', delay: 2000 },
			{ text: '', delay: 2500 },
			{ text: 'Instructions.', delay: 2500, effect: 'fade' },
			{ text: 'Rules.', delay: 2000 },
			{ text: 'Code.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: 'The Void opens.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Through it: lines of text.', delay: 2500 },
			{ text: 'Symbols.', delay: 2000 },
			{ text: 'Logic.', delay: 2000 },
			{ text: 'Structure.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3500 },
			{ text: '"This is what everything is made of."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"This is the Source Code."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"This is the game."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: '"And you are inside it."', delay: 4000, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 18 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase18_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 18 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_void_start',
		phase: 18,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_void_intro',
		type: 'dialogue',
		triggers: [{ type: 'phase_entered', params: { phase: 18 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_void_intro',
		phase: 18,
		priority: 30,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_void_potential',
		type: 'log',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_void_potential',
		phase: 18,
		priority: 5,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_entering_void',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '710000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_entering_void',
		phase: 18,
		priority: 35,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_void_speaks_start',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_void_speaks',
		phase: 18,
		priority: 50,
		delay: 3000,
		pausesGame: true
	},
	{
		id: 'event_void_before_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '720000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_void_before',
		phase: 18,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_void_request_start',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_void_request',
		phase: 18,
		priority: 55,
		delay: 3000,
		pausesGame: true
	},
	{
		id: 'event_void_loneliness_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '730000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_void_loneliness',
		phase: 18,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_void_choice_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '740000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_void_choice',
		phase: 18,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_source_path_ready',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_source_revealed',
		phase: 18,
		priority: 60,
		delay: 3000,
		pausesGame: true
	},
	{
		id: 'event_void_departure_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '755000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_void_departure',
		phase: 18,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_void_gratitude_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '765000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_void_gratitude',
		phase: 18,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_phase18_end',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '780000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_phase18_end',
		phase: 18,
		priority: 70,
		delay: 3000,
		pausesGame: false
	}
];

// ============================================================================
// Phase 18 Story Data Export
// ============================================================================

export const PHASE_18_STORY = {
	phase: 18,
	name: 'The Void',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_18_STORY;
