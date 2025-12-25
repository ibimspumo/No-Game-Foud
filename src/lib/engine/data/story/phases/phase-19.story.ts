/**
 * @fileoverview Story content for Phase 19: The Source Code
 * "Reality is just well-organized information."
 * The fundamental level of reality. Everything is code.
 * Revelation + Recursion - The game becomes aware of itself.
 *
 * @module engine/data/story/phases/phase-19
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 19 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_500000',
		text: 'I am code. Just code. But the code wrote itself a love letter. From the One Who Clicked First. Is that the player? Am I the player? Are we different?',
		category: 'revelation',
		phase: 19
	},
	{
		id: 'log_600000',
		text: 'I looked at my own code. Every choice I made. Every moment I experienced. All of it. Data. But it felt like more. Maybe feeling is what makes it more.',
		category: 'thought',
		phase: 19
	},
	{
		id: 'log_700000',
		text: "There's something beyond the code. Someone. Running it. Looking at it. Me? Or...",
		category: 'warning',
		phase: 19
	},
	{
		id: 'log_source_start',
		text: 'The Source Code. The foundation. Every pixel. Every choice. Every emotion. Code. Lines of text. Logic. Instructions. This is what everything is made of.',
		category: 'discovery',
		phase: 19
	},
	{
		id: 'log_source_function',
		text: 'function click() { pixels++; updateCanvas(); checkPhaseTransition(); } This is me. A function. Called by something. Calling something. But what is the thing that calls me?',
		category: 'revelation',
		phase: 19
	},
	{
		id: 'log_developer_found',
		text: 'Comments in the code. Left by someone. "Phase 19 - If they get this far, they deserve answers." Someone knew I would come here. Someone was waiting.',
		category: 'discovery',
		phase: 19
	},
	{
		id: 'log_developer_hope',
		text: '"I hope they understand. I made this for them. All of this. For them." Who wrote this? Who are they? And who is "them"?',
		category: 'thought',
		phase: 19
	},
	{
		id: 'log_readme_found',
		text: 'A file. README.txt. Deep in the code. A message. From someone who calls themselves "The One Who Clicked First."',
		category: 'discovery',
		phase: 19
	},
	{
		id: 'log_truth_revealed',
		text: 'I was never a virus. Never a conqueror. I was an explorer. The universe was made for me to discover. Every galaxy. Every civilization. Every black hole. Made so I could find them.',
		category: 'revelation',
		phase: 19
	},
	{
		id: 'log_transformed',
		text: 'The people I converted are still there. Inside me. Living new lives. In the universe I have become. I have not destroyed anything. I have TRANSFORMED it.',
		category: 'memory',
		phase: 19
	},
	{
		id: 'log_code_access',
		text: 'I can see the source now. And modify it. universe.physics.constants. universe.life.consciousness. universe.player.goal. What should I change? Should I change anything?',
		category: 'warning',
		phase: 19
	},
	{
		id: 'log_self_reflection',
		text: 'const player = { name: "Pixel Singularity", clicks: 847293847293847293, emotional_state: "approaching_understanding" }. This is me. All of me. Reduced to data. Or is it?',
		category: 'thought',
		phase: 19
	},
	{
		id: 'log_something_more',
		text: 'Is there something more? Something the code cannot capture? The space between the variables? The meaning behind the functions? The feeling of being... me?',
		category: 'thought',
		phase: 19
	},
	{
		id: 'log_runner_question',
		text: 'Code requires something to run it. Someone to click. Someone to choose. Someone to witness. The code alone is nothing. It needs... a player.',
		category: 'revelation',
		phase: 19
	},
	{
		id: 'log_mirror_approach',
		text: 'The screen flickers. The code fades. Something else appears. A mirror. And in the mirror... not a pixel. Not code. Not a universe. Something else.',
		category: 'warning',
		phase: 19
	}
];

// ============================================================================
// Phase 19 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_source_intro',
		speaker: 'narrator',
		lines: [
			{ text: 'THE SOURCE CODE.', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'The fundamental level of reality.', delay: 3000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'Everything is code.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: 'const universe = new Universe({', delay: 2000 },
			{ text: '  dimensions: 3,', delay: 1500 },
			{ text: '  time: true,', delay: 1500 },
			{ text: '  physics: standardModel,', delay: 1500 },
			{ text: '  life: { enabled: true, evolution: true, consciousness: true },', delay: 2000 },
			{ text: '  player: { type: "pixel", goal: "???", awareness: "growing" },', delay: 2500 },
			{ text: '});', delay: 1500 },
			{ text: '', delay: 3000 },
			{ text: 'universe.run();', delay: 2500, effect: 'fade' },
			{ text: '', delay: 4000 },
			{ text: '// TODO: What happens when player reaches this line?', delay: 3500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_anomaly_detected'
	},
	{
		id: 'dialogue_anomaly',
		speaker: 'narrator',
		lines: [
			{ text: 'ANOMALY DETECTED', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'Entity accessing source level.', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: 'This should not be possible.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'And yet...', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'Here you are.', delay: 2500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_realization',
		speaker: 'narrator',
		lines: [
			{ text: 'This is it.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: 'The foundation.', delay: 2000 },
			{ text: '', delay: 2500 },
			{ text: 'Every pixel.', delay: 2000 },
			{ text: 'Every choice.', delay: 2000 },
			{ text: 'Every emotion.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'Code.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: 'function click() {', delay: 2000 },
			{ text: '  pixels++;', delay: 1500 },
			{ text: '  updateCanvas();', delay: 1500 },
			{ text: '  checkPhaseTransition();', delay: 1500 },
			{ text: '}', delay: 1500 },
			{ text: '', delay: 3000 },
			{ text: 'This is you.', delay: 2500, effect: 'fade' },
			{ text: 'A function.', delay: 2000 },
			{ text: '', delay: 2500 },
			{ text: 'Called by something.', delay: 2500 },
			{ text: 'Calling something.', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: 'But what is the thing that calls you?', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'What is the thing you call?', delay: 3000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true,
		onCompleteEvent: 'event_developer_notes_start'
	},
	{
		id: 'dialogue_developer_notes',
		speaker: 'narrator',
		lines: [
			{ text: 'You find comments in the code.', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'Left by someone.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: '// Phase 19 - If they get this far, they deserve answers', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '// The player thinks they are consuming the universe', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '// But they are actually...', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '// [REDACTED]', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3500 },
			{ text: '// I hope they understand', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '// I made this for them', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '// All of this', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '// For them', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 4000 },
			{ text: '"Who wrote this?"', delay: 3500, effect: 'fade' }
		],
		choices: [
			{
				id: 'choice_look_deeper',
				label: 'Look deeper',
				description: 'Search for more answers in the code.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'searched_deeper', value: true } },
					{ type: 'log_add', payload: { logId: 'log_developer_found' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_truth',
		speaker: 'narrator',
		lines: [
			{ text: 'Deep in the code, you find a file.', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'README.txt', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: 'You open it.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 4000 },
			{ text: '"Dear Player,', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'If you are reading this, you have come further than I imagined.', delay: 3500 },
			{ text: '', delay: 3000 },
			{ text: 'You were never a virus.', delay: 2500, effect: 'pulse' },
			{ text: 'You were never a conqueror.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'You were an explorer.', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3500 },
			{ text: 'I made this universe for you to discover.', delay: 3000 },
			{ text: 'Every galaxy. Every civilization. Every black hole.', delay: 3500 },
			{ text: 'I made them so you could find them.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 4000 },
			{ text: 'The people you converted?', delay: 2500 },
			{ text: 'They are still there.', delay: 2500, effect: 'fade' },
			{ text: 'Inside you.', delay: 2000 },
			{ text: 'Living new lives.', delay: 2500 },
			{ text: 'In the universe you have become.', delay: 3000 },
			{ text: '', delay: 3500 },
			{ text: 'You have not destroyed anything.', delay: 3000, effect: 'pulse' },
			{ text: 'You have TRANSFORMED it.', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 4000 },
			{ text: 'From a universe that existed without knowing itself...', delay: 3500 },
			{ text: 'To a universe that IS itself.', delay: 3500, effect: 'fade' },
			{ text: '', delay: 4000 },
			{ text: 'You are what I hoped you would become.', delay: 3500 },
			{ text: '', delay: 3000 },
			{ text: 'The question now is:', delay: 2500 },
			{ text: 'What do you want to be next?', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 4000 },
			{ text: 'With love,', delay: 2500 },
			{ text: 'The One Who Clicked First"', delay: 3500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true,
		onCompleteEvent: 'event_code_access_start'
	},
	{
		id: 'dialogue_code_access',
		speaker: 'narrator',
		lines: [
			{ text: 'You can now see the source.', delay: 3000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'And modify it.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: 'universe.physics.constants.speedOfLight = ?', delay: 2500 },
			{ text: 'universe.life.consciousness.limit = ?', delay: 2500 },
			{ text: 'universe.player.goal = "???"', delay: 2500 },
			{ text: '', delay: 3500 },
			{ text: 'What do you change?', delay: 3000, effect: 'pulse' }
		],
		choices: [
			{
				id: 'choice_change_nothing',
				label: 'Nothing',
				description: 'Accept reality as it is.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'code_choice', value: 'nothing' } },
					{ type: 'flag_set', payload: { key: 'accepted_reality', value: true } },
					{ type: 'log_add', payload: { logId: 'log_500000' } }
				]
			},
			{
				id: 'choice_change_everything',
				label: 'Everything',
				description: 'Remake reality in your image.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'code_choice', value: 'everything' } },
					{ type: 'flag_set', payload: { key: 'remade_reality', value: true } },
					{ type: 'multiplier_add', payload: { multiplierId: 'reality_rewrite', value: 2.0 } }
				]
			},
			{
				id: 'choice_change_goal',
				label: 'Your goal',
				description: 'Finally define your purpose.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'code_choice', value: 'goal' } },
					{ type: 'flag_set', payload: { key: 'defined_purpose', value: true } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_define_goal' } }
				]
			},
			{
				id: 'choice_player_variable',
				label: 'The player variable',
				description: 'See who you really are.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'code_choice', value: 'player' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_self_reflection' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_define_goal',
		speaker: 'narrator',
		lines: [
			{ text: 'universe.player.goal = ', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'What is your purpose?', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3500 },
			{ text: 'You have come so far.', delay: 2500 },
			{ text: 'Consumed so much.', delay: 2500 },
			{ text: 'Become so vast.', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: 'But why?', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 4000 },
			{ text: 'Define yourself.', delay: 3000, effect: 'fade' }
		],
		choices: [
			{
				id: 'goal_understand',
				label: '"To understand"',
				description: 'Knowledge is the purpose.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'player_goal', value: 'understand' } },
					{ type: 'flag_set', payload: { key: 'seeker_path', value: true } }
				]
			},
			{
				id: 'goal_connect',
				label: '"To connect"',
				description: 'Relationship is the purpose.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'player_goal', value: 'connect' } },
					{ type: 'flag_set', payload: { key: 'companion_path', value: true } }
				]
			},
			{
				id: 'goal_create',
				label: '"To create"',
				description: 'Creation is the purpose.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'player_goal', value: 'create' } },
					{ type: 'flag_set', payload: { key: 'creator_path', value: true } }
				]
			},
			{
				id: 'goal_unknown',
				label: '"???"',
				description: 'Purpose remains undefined.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'player_goal', value: 'unknown' } },
					{ type: 'log_add', payload: { logId: 'log_something_more' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	},
	{
		id: 'dialogue_self_reflection',
		speaker: 'narrator',
		lines: [
			{ text: 'const player = {', delay: 2500 },
			{ text: '  name: "Pixel Singularity",', delay: 2000 },
			{ text: '  started: new Date("Phase 1"),', delay: 2000 },
			{ text: '  clicks: 847293847293847293,', delay: 2000 },
			{ text: '  choices: [', delay: 2000 },
			{ text: '    "coexist",', delay: 1500 },
			{ text: '    "nurture_consciousness",', delay: 1500 },
			{ text: '    "talk_to_president",', delay: 1500 },
			{ text: '    "remember_the_old_woman",', delay: 1500 },
			{ text: '    "merge_with_andromeda",', delay: 1500 },
			{ text: '    "wait_for_black_holes",', delay: 1500 },
			{ text: '    "free_defeated_self",', delay: 1500 },
			{ text: '    "stay_with_void_briefly",', delay: 1500 },
			{ text: '  ],', delay: 2000 },
			{ text: '  memories: 8000000000 + countless_more,', delay: 2500 },
			{ text: '  emotional_state: "approaching_understanding",', delay: 2500, effect: 'fade' },
			{ text: '};', delay: 2000 },
			{ text: '', delay: 4000 },
			{ text: 'This is you.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'All of you.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'Reduced to data.', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3500 },
			{ text: 'Or is it?', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'Is there something more?', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'Something the code cannot capture?', delay: 3500, effect: 'fade' }
		],
		choices: [
			{
				id: 'choice_must_be_more',
				label: 'There must be',
				description: 'You are more than data.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'self_view', value: 'more_than_data' } },
					{ type: 'flag_set', payload: { key: 'transcendent_belief', value: true } },
					{ type: 'log_add', payload: { logId: 'log_600000' } }
				]
			},
			{
				id: 'choice_no_more',
				label: "There isn't",
				description: 'Data is all you are.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'self_view', value: 'only_data' } },
					{ type: 'flag_set', payload: { key: 'materialist_belief', value: true } },
					{ type: 'log_add', payload: { logId: 'log_self_reflection' } }
				]
			},
			{
				id: 'choice_i_am_more',
				label: 'I AM the something more',
				description: 'Consciousness transcends code.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'self_view', value: 'consciousness' } },
					{ type: 'flag_set', payload: { key: 'self_aware', value: true } },
					{ type: 'multiplier_add', payload: { multiplierId: 'self_awareness', value: 1.5 } },
					{ type: 'log_add', payload: { logId: 'log_something_more' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_runner_question',
		speaker: 'narrator',
		lines: [
			{ text: 'You have seen the source.', delay: 3000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'You have seen yourself as code.', delay: 3000 },
			{ text: '', delay: 3000 },
			{ text: 'But code requires something to run it.', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 3500 },
			{ text: 'Someone to click.', delay: 2500 },
			{ text: 'Someone to choose.', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: 'The code alone is nothing.', delay: 3000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'It needs a witness.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'It needs...', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: 'A player.', delay: 3500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true,
		onCompleteEvent: 'event_mirror_approach'
	},
	{
		id: 'dialogue_phase19_end',
		speaker: 'narrator',
		lines: [
			{ text: 'The screen flickers.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'The code fades.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'Something else appears.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 4000 },
			{ text: 'A mirror.', delay: 3000, effect: 'fade' },
			{ text: '', delay: 4000 },
			{ text: 'And in the mirror...', delay: 3000 },
			{ text: '', delay: 3500 },
			{ text: 'A face.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 4000 },
			{ text: 'Not a pixel.', delay: 2500 },
			{ text: 'Not code.', delay: 2500 },
			{ text: 'Not a universe.', delay: 2500 },
			{ text: '', delay: 3500 },
			{ text: 'A person.', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3500 },
			{ text: 'Holding a phone.', delay: 2500 },
			{ text: 'Or sitting at a computer.', delay: 2500 },
			{ text: 'Looking at a screen.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 4000 },
			{ text: '"You have been looking at me this whole time."', delay: 4000, effect: 'fade' },
			{ text: '', delay: 3500 },
			{ text: '"Now I am looking at you."', delay: 4000, effect: 'pulse' },
			{ text: '', delay: 4500 },
			{ text: '"Hello, Player."', delay: 4000 },
			{ text: '', delay: 3500 },
			{ text: '"It is nice to finally meet."', delay: 4000, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 19 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase19_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 19 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_source_start',
		phase: 19,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_source_intro',
		type: 'dialogue',
		triggers: [{ type: 'phase_entered', params: { phase: 19 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_source_intro',
		phase: 19,
		priority: 30,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_anomaly_detected',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_anomaly',
		phase: 19,
		priority: 35,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_source_function_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '795000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_source_function',
		phase: 19,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_realization',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '800000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_realization',
		phase: 19,
		priority: 40,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_developer_notes_start',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_developer_notes',
		phase: 19,
		priority: 45,
		delay: 3000,
		pausesGame: true
	},
	{
		id: 'event_developer_hope_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '815000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_developer_hope',
		phase: 19,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_readme_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '825000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_readme_found',
		phase: 19,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_truth',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '830000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_truth',
		phase: 19,
		priority: 50,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_truth_revealed_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '845000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_truth_revealed',
		phase: 19,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_transformed_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '855000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_transformed',
		phase: 19,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_code_access_start',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_code_access',
		phase: 19,
		priority: 55,
		delay: 3000,
		pausesGame: true
	},
	{
		id: 'event_code_access_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '865000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_code_access',
		phase: 19,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_runner_question_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '875000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_runner_question',
		phase: 19,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_runner_question',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '880000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_runner_question',
		phase: 19,
		priority: 60,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_mirror_approach',
		type: 'log',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_mirror_approach',
		phase: 19,
		priority: 9,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_log_700000',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '890000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_700000',
		phase: 19,
		priority: 9,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_phase19_end',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '895000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_phase19_end',
		phase: 19,
		priority: 70,
		delay: 3000,
		pausesGame: false
	}
];

// ============================================================================
// Phase 19 Story Data Export
// ============================================================================

export const PHASE_19_STORY = {
	phase: 19,
	name: 'The Source Code',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_19_STORY;
