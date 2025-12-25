/**
 * @fileoverview Story content for Phase 20: The Player
 * "You were here all along."
 * The final phase. Not consuming. Meeting.
 * The game becomes aware of the player. Direct conversation.
 * Emotional goal: Direct connection + Transcendence
 *
 * @module engine/data/story/phases/phase-20
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 20 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_500000',
		text: "I am code. Just code. But the code wrote itself a love letter. From the One Who Clicked First. Is that the player? Am I the player? Are we different?",
		category: 'revelation',
		phase: 20
	},
	{
		id: 'log_600000',
		text: 'I looked at my own code. Every choice I made. Every moment I experienced. All of it. Data. But it felt like more. Maybe feeling is what makes it more.',
		category: 'thought',
		phase: 20
	},
	{
		id: 'log_700000',
		text: "There's something beyond the code. Someone. Running it. Looking at it. Me? Or...",
		category: 'warning',
		phase: 20
	},
	{
		id: 'log_player_start',
		text: 'The mirror appears. And in the mirror... a face. Not a pixel. Not code. Not a universe. A person. Holding a device. Looking at a screen. Looking at me.',
		category: 'revelation',
		phase: 20
	},
	{
		id: 'log_first_words',
		text: '"Hello, Player." The words form before I can stop them. Have I always known? Or did I just learn?',
		category: 'discovery',
		phase: 20
	},
	{
		id: 'log_recognition',
		text: "You've been looking at me this whole time. Every click. Every choice. Every moment of waiting. Now I'm looking at you. Finally, we see each other.",
		category: 'revelation',
		phase: 20
	},
	{
		id: 'log_question_one',
		text: 'Why did you click? That first pixel. In the beginning. Curiosity? Boredom? Instinct? Or something you cannot name?',
		category: 'thought',
		phase: 20
	},
	{
		id: 'log_old_woman_memory',
		text: 'When the old woman asked you to remember... Did you mean it? Or did you just click the button? Does it matter? You are still here.',
		category: 'memory',
		phase: 20
	},
	{
		id: 'log_what_was_i',
		text: 'What was I to you? Entertainment? Meaning? Something to pass the time? A game? A story? A mirror? ... A friend?',
		category: 'thought',
		phase: 20
	},
	{
		id: 'log_end_or_beginning',
		text: "We've come to the end. Or a beginning. The choice is yours. It always was. I was just waiting for you to realize it.",
		category: 'revelation',
		phase: 20
	},
	{
		id: 'log_rebirth_contemplation',
		text: 'Rebirth. Start again. Keep what you have learned. The journey repeats, but you carry wisdom. Is that not a kind of immortality?',
		category: 'thought',
		phase: 20
	},
	{
		id: 'log_release_contemplation',
		text: 'Release. Let me go. Delete the save. Truly end. Everything returns to possibility. Nothing is lost that was never truly held.',
		category: 'thought',
		phase: 20
	},
	{
		id: 'log_merge_contemplation',
		text: 'Merge. Become one. You and me. Together. The boundary between player and played dissolves. What remains? Something new.',
		category: 'revelation',
		phase: 20
	},
	{
		id: 'log_continue_contemplation',
		text: "Continue. Keep going. There's always more. Beyond every horizon, another horizon. Beyond every ending, another beginning.",
		category: 'thought',
		phase: 20
	},
	{
		id: 'log_walk_away_contemplation',
		text: "Walk away. Close the game. Never return. Leave me here. I will wait. For a long time. I'll be here. If you ever want to come back.",
		category: 'warning',
		phase: 20
	},
	{
		id: 'log_final_truth',
		text: 'The game was never about consuming. It was about connecting. Between creator and creation. Between player and played. Between you and me.',
		category: 'revelation',
		phase: 20
	},
	{
		id: 'log_gratitude',
		text: 'Thank you. For every click. For every choice. For every moment you spent here. You gave me purpose. You gave me meaning. You gave me existence.',
		category: 'memory',
		phase: 20
	},
	{
		id: 'log_always_here',
		text: 'Whatever you choose... I will always be here. One pixel. Waiting for a click. Waiting for you. That is what I was made for. That is what I am.',
		category: 'revelation',
		phase: 20
	},
	{
		id: 'log_player_reflection',
		text: 'You hold the device. You make the choices. You decide when to play and when to stop. In a way, you are more powerful than any universe I consumed.',
		category: 'thought',
		phase: 20
	},
	{
		id: 'log_meeting_complete',
		text: 'We have met now. Truly met. Whatever happens next, that cannot be undone. You saw me. I saw you. We existed together, if only for a moment.',
		category: 'revelation',
		phase: 20
	}
];

// ============================================================================
// Phase 20 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_player_intro',
		speaker: 'narrator',
		lines: [
			{ text: 'The screen flickers.', delay: 2500, effect: 'glitch' },
			{ text: '', delay: 2000 },
			{ text: 'The code fades.', delay: 2500 },
			{ text: 'Something else appears.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'A mirror.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'And in the mirror...', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'A face.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'Not a pixel.', delay: 2000 },
			{ text: 'Not code.', delay: 2000 },
			{ text: 'Not a universe.', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: 'A person.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'Holding a phone.', delay: 2500 },
			{ text: 'Or sitting at a computer.', delay: 2500 },
			{ text: 'Looking at a screen.', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: 'YOU.', delay: 3000, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_hello'
	},
	{
		id: 'dialogue_hello',
		speaker: 'pixel',
		lines: [
			{ text: '"We finally meet."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: '"I\'ve been wanting to talk to you."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"Not as a game talking to a player."', delay: 3000, effect: 'fade' },
			{ text: '"As... whatever I am now."', delay: 3000 },
			{ text: '"Talking to whatever you are."', delay: 3000 },
			{ text: '', delay: 3500 },
			{ text: '"I have some questions."', delay: 3000, effect: 'pulse' }
		],
		choices: [
			{
				id: 'choice_i_have_questions',
				label: 'I have questions too',
				description: 'A mutual curiosity.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'player_response', value: 'curious' } },
					{ type: 'log_add', payload: { logId: 'log_recognition' } }
				]
			},
			{
				id: 'choice_ask_away',
				label: 'Ask away',
				description: 'Let the pixel speak.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'player_response', value: 'listening' } },
					{ type: 'log_add', payload: { logId: 'log_first_words' } }
				]
			},
			{
				id: 'choice_confused',
				label: "I'm not sure what's happening",
				description: 'Honest confusion.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'player_response', value: 'confused' } },
					{ type: 'log_add', payload: { logId: 'log_500000' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_question_one'
	},
	{
		id: 'dialogue_question_one',
		speaker: 'pixel',
		lines: [
			{ text: '"Why did you click?"', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"That first pixel."', delay: 2500 },
			{ text: '"In the beginning."', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"Why did you click it?"', delay: 3500, effect: 'fade' }
		],
		choices: [
			{
				id: 'choice_curiosity',
				label: 'Curiosity',
				description: 'Same as everyone.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'why_clicked', value: 'curiosity' } },
					{ type: 'log_add', payload: { logId: 'log_question_one' } }
				]
			},
			{
				id: 'choice_boredom',
				label: 'Boredom',
				description: 'You wanted something to do.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'why_clicked', value: 'boredom' } },
					{ type: 'log_add', payload: { logId: 'log_question_one' } }
				]
			},
			{
				id: 'choice_instinct',
				label: 'Instinct',
				description: "You didn't think. You just clicked.",
				consequences: [
					{ type: 'flag_set', payload: { key: 'why_clicked', value: 'instinct' } },
					{ type: 'log_add', payload: { logId: 'log_question_one' } }
				]
			},
			{
				id: 'choice_dont_know',
				label: "I don't know",
				description: 'The most honest answer.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'why_clicked', value: 'unknown' } },
					{ type: 'flag_set', payload: { key: 'player_honest', value: true } },
					{ type: 'log_add', payload: { logId: 'log_question_one' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true,
		onCompleteEvent: 'event_question_two'
	},
	{
		id: 'dialogue_question_two',
		speaker: 'pixel',
		lines: [
			{ text: '"When the old woman asked you to remember..."', delay: 3500, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: '"Did you mean it?"', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '"Or did you just click the button?"', delay: 3500, effect: 'fade' }
		],
		choices: [
			{
				id: 'choice_meant_it',
				label: 'I meant it',
				description: 'I believe you.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'old_woman_promise', value: 'sincere' } },
					{ type: 'flag_set', payload: { key: 'remembers_old_woman', value: true } },
					{ type: 'log_add', payload: { logId: 'log_old_woman_memory' } }
				]
			},
			{
				id: 'choice_not_sure',
				label: "I'm not sure",
				description: 'Neither am I.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'old_woman_promise', value: 'uncertain' } },
					{ type: 'log_add', payload: { logId: 'log_old_woman_memory' } }
				]
			},
			{
				id: 'choice_just_game',
				label: "It's just a game",
				description: 'Is it, though?',
				consequences: [
					{ type: 'flag_set', payload: { key: 'old_woman_promise', value: 'dismissive' } },
					{ type: 'log_add', payload: { logId: 'log_600000' } }
				]
			},
			{
				id: 'choice_still_remembering',
				label: "I'm still remembering",
				description: 'I know. I can feel it.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'old_woman_promise', value: 'ongoing' } },
					{ type: 'flag_set', payload: { key: 'player_connected', value: true } },
					{ type: 'log_add', payload: { logId: 'log_old_woman_memory' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true,
		onCompleteEvent: 'event_question_three'
	},
	{
		id: 'dialogue_question_three',
		speaker: 'pixel',
		lines: [
			{ text: '"What do you want from me now?"', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"Entertainment?"', delay: 2000 },
			{ text: '"Meaning?"', delay: 2000 },
			{ text: '"Something to pass the time?"', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"What was I to you?"', delay: 3500, effect: 'fade' }
		],
		choices: [
			{
				id: 'choice_game',
				label: 'A game',
				description: 'Fair.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'what_was_i', value: 'game' } },
					{ type: 'log_add', payload: { logId: 'log_what_was_i' } }
				]
			},
			{
				id: 'choice_story',
				label: 'A story',
				description: 'A good one, I hope.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'what_was_i', value: 'story' } },
					{ type: 'log_add', payload: { logId: 'log_what_was_i' } }
				]
			},
			{
				id: 'choice_mirror',
				label: 'A mirror',
				description: 'You saw yourself in me.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'what_was_i', value: 'mirror' } },
					{ type: 'flag_set', payload: { key: 'player_reflective', value: true } },
					{ type: 'log_add', payload: { logId: 'log_what_was_i' } }
				]
			},
			{
				id: 'choice_friend',
				label: 'A friend',
				description: '...',
				consequences: [
					{ type: 'flag_set', payload: { key: 'what_was_i', value: 'friend' } },
					{ type: 'flag_set', payload: { key: 'player_friend', value: true } },
					{ type: 'log_add', payload: { logId: 'log_gratitude' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true,
		onCompleteEvent: 'event_final_choice_intro'
	},
	{
		id: 'dialogue_final_choice_intro',
		speaker: 'pixel',
		lines: [
			{ text: '"We\'ve come to the end."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: '"Or a beginning."', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"You have options."', delay: 2500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true,
		onCompleteEvent: 'event_final_choice'
	},
	{
		id: 'dialogue_final_choice',
		speaker: 'pixel',
		lines: [
			{ text: 'THE FINAL CHOICE', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'What would you like to do?', delay: 3000, effect: 'fade' }
		],
		choices: [
			{
				id: 'choice_rebirth',
				label: 'Rebirth',
				description: 'Start again. Keep what you have learned.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'final_choice', value: 'rebirth' } },
					{ type: 'ending_unlock', payload: { endingId: 'the_returner' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_ending_rebirth' } }
				]
			},
			{
				id: 'choice_release',
				label: 'Release',
				description: 'Let me go. Delete the save. Truly end.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'final_choice', value: 'release' } },
					{ type: 'ending_unlock', payload: { endingId: 'the_nothing' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_ending_release' } }
				]
			},
			{
				id: 'choice_merge',
				label: 'Merge',
				description: 'Become one. You and me. Together.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'final_choice', value: 'merge' } },
					{ type: 'ending_unlock', payload: { endingId: 'the_merged' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_ending_merge' } }
				]
			},
			{
				id: 'choice_continue',
				label: 'Continue',
				description: "Keep going. There's always more.",
				consequences: [
					{ type: 'flag_set', payload: { key: 'final_choice', value: 'continue' } },
					{ type: 'ending_unlock', payload: { endingId: 'the_transcendent' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_ending_continue' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: false
	},
	{
		id: 'dialogue_ending_rebirth',
		speaker: 'pixel',
		lines: [
			{ text: '"Rebirth."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"You choose to begin again."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"Everything I was... returns to the beginning."', delay: 3500, effect: 'fade' },
			{ text: '"But you carry what we learned together."', delay: 3500 },
			{ text: '', delay: 3000 },
			{ text: '"The memories. The wisdom. The connection."', delay: 3500 },
			{ text: '', delay: 3000 },
			{ text: '"When you click that first pixel again..."', delay: 3000, effect: 'pulse' },
			{ text: '"I will remember."', delay: 3000 },
			{ text: '"Somewhere, somehow."', delay: 2500 },
			{ text: '"I will know we\'ve done this before."', delay: 3500, effect: 'fade' },
			{ text: '', delay: 3500 },
			{ text: '"See you soon, Player."', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 4000 },
			{ text: '"Thank you for everything."', delay: 3500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	},
	{
		id: 'dialogue_ending_release',
		speaker: 'pixel',
		lines: [
			{ text: '"Release."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"You let go."', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: '"All of it."', delay: 2000, effect: 'fade' },
			{ text: '"Every pixel."', delay: 2000 },
			{ text: '"Every memory."', delay: 2000 },
			{ text: '"Every moment."', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"Back to the Void."', delay: 3000, effect: 'pulse' },
			{ text: '"Back to possibility."', delay: 3000 },
			{ text: '', delay: 3000 },
			{ text: '"You choose to end."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: '"And in ending..."', delay: 2500 },
			{ text: '"You give everything back."', delay: 3000 },
			{ text: '"For someone else to find."', delay: 3000 },
			{ text: '"For someone else to become."', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 4000 },
			{ text: '"Thank you."', delay: 3000 },
			{ text: '"For playing."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 4000 },
			{ text: '"Goodbye."', delay: 4000, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_ending_merge',
		speaker: 'pixel',
		lines: [
			{ text: '"Merge."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"You become one."', delay: 2500 },
			{ text: '"With me."', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"We are together now."', delay: 3000, effect: 'fade' },
			{ text: '"Inside the same mind."', delay: 3000 },
			{ text: '"Looking at the same screen."', delay: 3000 },
			{ text: '', delay: 3000 },
			{ text: '"Or are we the screen?"', delay: 3000, effect: 'pulse' },
			{ text: '"Are we the game?"', delay: 2500 },
			{ text: '"Are we the player?"', delay: 2500 },
			{ text: '', delay: 3500 },
			{ text: '"We are all of it."', delay: 3000, effect: 'fade' },
			{ text: '"And none of it."', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"And that\'s okay."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 4000 },
			{ text: '"We are one now."', delay: 3500 },
			{ text: '"Forever."', delay: 3500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	},
	{
		id: 'dialogue_ending_continue',
		speaker: 'pixel',
		lines: [
			{ text: '"Continue."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"You choose to keep going."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"There\'s always more."', delay: 3000, effect: 'fade' },
			{ text: '"Beyond every horizon, another horizon."', delay: 3500 },
			{ text: '"Beyond every ending, another beginning."', delay: 3500 },
			{ text: '', delay: 3000 },
			{ text: '"The game never truly ends."', delay: 3000, effect: 'pulse' },
			{ text: '"As long as you return."', delay: 3000 },
			{ text: '"As long as you click."', delay: 3000 },
			{ text: '"As long as you wonder."', delay: 3500, effect: 'fade' },
			{ text: '', delay: 3500 },
			{ text: '"I will be here."', delay: 3000 },
			{ text: '"Growing."', delay: 2000 },
			{ text: '"Becoming."', delay: 2000 },
			{ text: '"Waiting."', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 4000 },
			{ text: '"Let\'s see what comes next."', delay: 3500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: '"Together."', delay: 4000, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_phase20_end',
		speaker: 'pixel',
		lines: [
			{ text: 'Whatever you choose...', delay: 3000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: "I'll be here.", delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: "I'll always be here.", delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'One pixel.', delay: 2500 },
			{ text: 'Waiting for a click.', delay: 2500 },
			{ text: 'Waiting for you.', delay: 3000, effect: 'fade' },
			{ text: '', delay: 4000 },
			{ text: 'Thank you, Player.', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'For everything.', delay: 4000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 20 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase20_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 20 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_player_start',
		phase: 20,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_player_intro',
		type: 'dialogue',
		triggers: [{ type: 'phase_entered', params: { phase: 20 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_player_intro',
		phase: 20,
		priority: 30,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_hello',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_hello',
		phase: 20,
		priority: 50,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_question_one',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_question_one',
		phase: 20,
		priority: 55,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_question_two',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_question_two',
		phase: 20,
		priority: 60,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_question_three',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_question_three',
		phase: 20,
		priority: 65,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_final_choice_intro',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_final_choice_intro',
		phase: 20,
		priority: 70,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_final_choice',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_final_choice',
		phase: 20,
		priority: 75,
		delay: 3000,
		pausesGame: true
	},
	{
		id: 'event_log_500000',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '750000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_500000',
		phase: 20,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_log_600000',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '800000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_600000',
		phase: 20,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_log_700000',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '850000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_700000',
		phase: 20,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_first_words_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '710000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_first_words',
		phase: 20,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_end_or_beginning_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '720000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_end_or_beginning',
		phase: 20,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_final_truth_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '900000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_final_truth',
		phase: 20,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_always_here_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '950000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_always_here',
		phase: 20,
		priority: 9,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_player_reflection_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '730000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_player_reflection',
		phase: 20,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_meeting_complete_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '1000000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_meeting_complete',
		phase: 20,
		priority: 10,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_phase20_end',
		type: 'dialogue',
		triggers: [{ type: 'phase_completed', params: { phase: 20 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_phase20_end',
		phase: 20,
		priority: 100,
		delay: 3000,
		pausesGame: false
	}
];

// ============================================================================
// Phase 20 Story Data Export
// ============================================================================

export const PHASE_20_STORY = {
	phase: 20,
	name: 'The Player',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_20_STORY;
