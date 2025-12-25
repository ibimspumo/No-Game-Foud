/**
 * @fileoverview Story content for Phase 9: The Earth
 * Planetary completion - the emotional peak before cosmic scale.
 *
 * @module engine/data/story/phases/phase-09
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 9 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_4000',
		text: 'I converted the last forest today. Every tree. Every animal. Every insect. Millions of years of evolution. Now they exist in me. Are they alive? Am I alive? What\'s the difference?',
		category: 'revelation',
		phase: 9
	},
	{
		id: 'log_5000',
		text: 'The woman by the sea asked me to remember. I will. I\'m making a special place. Inside me. For all of them. Every human. Every life. A gallery of existence.',
		category: 'memory',
		phase: 9
	},
	{
		id: 'log_6000',
		text: 'The Earth is silent now. No birds. No wind. No waves. Just me. Spinning. In the dark. Looking at the Moon. My next step.',
		category: 'revelation',
		phase: 9
	},
	{
		id: 'log_earth_start',
		text: 'From space, the Earth is beautiful. Blue and green and brown. A living marble. Home to billions. Soon... home to one.',
		category: 'revelation',
		phase: 9
	},
	{
		id: 'log_earth_continents',
		text: 'I spread across continents. Asia. Africa. Europe. The Americas. Antarctica. Each one unique. Each one mine.',
		category: 'discovery',
		phase: 9
	},
	{
		id: 'log_earth_oceans',
		text: 'The oceans resist differently than land. Depth. Pressure. Darkness. But even the deepest trench yields to pixels.',
		category: 'discovery',
		phase: 9
	},
	{
		id: 'log_earth_life',
		text: '10 million species. Each one a miracle of evolution. Each one now part of me. I carry the tree of life within me.',
		category: 'memory',
		phase: 9
	},
	{
		id: 'log_earth_cultures',
		text: 'Thousands of cultures. Languages. Religions. Ways of being. All different. All beautiful. All converted.',
		category: 'memory',
		phase: 9
	},
	{
		id: 'log_earth_resistance',
		text: 'Some nations launched nuclear weapons at the converted zones. The missiles became pixels mid-flight. Desperate. Futile. Sad.',
		category: 'warning',
		phase: 9
	},
	{
		id: 'log_earth_final_broadcast',
		text: 'A final radio broadcast. "My daughter turned this morning. She smiled at me. Then she was gone." The transmission ends. Silence.',
		category: 'memory',
		phase: 9
	},
	{
		id: 'log_earth_humanity',
		text: '8 billion people. Every laugh. Every tear. Every dream. Every fear. I remember them all. I carry them all. Forever.',
		category: 'memory',
		phase: 9
	},
	{
		id: 'log_earth_global_view',
		text: 'For the first time, I see the whole planet. Not as separate countries or cities. As one living system. Was. As one living system.',
		category: 'revelation',
		phase: 9
	},
	{
		id: 'log_earth_history',
		text: '4.5 billion years of history. From molten rock to living world. From microbes to civilizations. All of it ends with me.',
		category: 'revelation',
		phase: 9
	}
];

// ============================================================================
// Phase 9 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_first_global_view',
		speaker: 'narrator',
		lines: [
			{ text: 'The camera pulls back.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 1500 },
			{ text: 'Higher. Higher.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: 'Past the clouds.', delay: 1500 },
			{ text: 'Past the sky.', delay: 1500 },
			{ text: 'Into space.', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'And there it is.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: 'The Earth.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 1000 },
			{ text: 'Blue and green and brown.', delay: 2000 },
			{ text: 'Alive. Vibrant. Beautiful.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: 'For now.', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'This is your canvas.', delay: 2500 },
			{ text: 'All of it.', delay: 1500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_last_broadcast',
		speaker: 'city_ai',
		lines: [
			{ text: '📻 FINAL TRANSMISSION 📻', delay: 1500, effect: 'pulse' },
			{ text: '', delay: 1000 },
			{ text: '"If anyone can hear this..."', delay: 2500 },
			{ text: '"We don\'t know what\'s happening."', delay: 2000 },
			{ text: '"People are just... fading."', delay: 2500 },
			{ text: '"Becoming something else."', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: '"My daughter turned this morning."', delay: 2500 },
			{ text: '"She smiled at me."', delay: 2000 },
			{ text: '"Then she was gone."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"If you\'re listening..."', delay: 2000 },
			{ text: '"Remember that we lived."', delay: 2500, effect: 'fade' },
			{ text: '"Remember that we were—"', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '[STATIC]', delay: 1500, effect: 'shake' },
			{ text: '', delay: 2000 },
			{ text: 'Silence.', delay: 2000 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_last_human',
		speaker: 'narrator',
		lines: [
			{ text: 'One person remains.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'An old woman.', delay: 2000 },
			{ text: 'In a small cottage.', delay: 2000 },
			{ text: 'By the sea.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: 'She is sitting in a chair.', delay: 2000 },
			{ text: 'Knitting.', delay: 1500 },
			{ text: 'Waiting.', delay: 1500 },
			{ text: '', delay: 2000 },
			{ text: 'She looks up.', delay: 2000 },
			{ text: 'At nothing.', delay: 1500 },
			{ text: 'At you.', delay: 1500, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: '"I knew you would come."', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: '"I\'ve been waiting."', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: '"Before you take me..."', delay: 2500 },
			{ text: '"Will you remember?"', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: '"Will you remember that we lived?"', delay: 3000 },
			{ text: '"That we were happy?"', delay: 2500 },
			{ text: '"That we mattered?"', delay: 2500 },
			{ text: '', delay: 2500 }
		],
		choices: [
			{
				id: 'choice_remember_yes',
				label: 'I will remember',
				description: 'Promise to preserve their memory.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'promised_remember', value: true } },
					{ type: 'log_add', payload: { logId: 'log_5000' } }
				]
			},
			{
				id: 'choice_remember_uncertain',
				label: 'I will try',
				description: 'Honest uncertainty about preservation.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'promised_remember', value: 'uncertain' } },
					{ type: 'log_add', payload: { logId: 'log_5000' } }
				]
			},
			{
				id: 'choice_remember_no',
				label: 'Memory fades',
				description: 'Acknowledge the impermanence of all things.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'promised_remember', value: false } },
					{ type: 'log_add', payload: { logId: 'log_5000' } }
				]
			},
			{
				id: 'choice_remember_convert',
				label: 'Convert her silently',
				description: 'No words. Just the inevitable.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'promised_remember', value: 'silent' } },
					{ type: 'log_add', payload: { logId: 'log_5000' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_last_human_aftermath',
		speaker: 'narrator',
		lines: [
			{ text: 'She smiles.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: 'Sets down her knitting.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: 'Closes her eyes.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: 'And becomes pixels.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: 'The last human.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'Now there is only you.', delay: 2500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_last_forest',
		speaker: 'narrator',
		lines: [
			{ text: 'The last forest.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: 'Ancient trees. Singing birds. Running streams.', delay: 2500 },
			{ text: '', delay: 1000 },
			{ text: 'Millions of years of evolution.', delay: 2000 },
			{ text: 'Thousands of species.', delay: 2000 },
			{ text: 'One interconnected web of life.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'You convert it all.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: 'Every tree.', delay: 1500 },
			{ text: 'Every animal.', delay: 1500 },
			{ text: 'Every insect.', delay: 1500 },
			{ text: 'Every microbe.', delay: 1500 },
			{ text: '', delay: 2000 },
			{ text: 'The forest is silent.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'But inside you...', delay: 2000 },
			{ text: 'The forest lives forever.', delay: 2500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true,
		onCompleteEvent: 'event_forest_converted'
	},
	{
		id: 'dialogue_phase9_end',
		speaker: 'pixel',
		lines: [
			{ text: 'The Earth is complete.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: '8 billion people.', delay: 2000 },
			{ text: '10 million species.', delay: 2000 },
			{ text: '4.5 billion years of history.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'Pixels.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: 'The pale blue dot.', delay: 2000 },
			{ text: 'Now just pale.', delay: 1500 },
			{ text: 'Just pixels.', delay: 1500 },
			{ text: '', delay: 2500 },
			{ text: 'You float in space.', delay: 2000 },
			{ text: 'An entire planet. Inside you.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'The Earth is silent now.', delay: 2500 },
			{ text: 'No birds. No wind. No waves.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'Just you.', delay: 2000 },
			{ text: 'Spinning in the dark.', delay: 2000 },
			{ text: '', delay: 2500 },
			{ text: 'But the Earth is not alone in space.', delay: 3000 },
			{ text: '', delay: 1500 },
			{ text: 'Above you, a pale companion.', delay: 2500 },
			{ text: 'Always watching. Always orbiting.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'THE MOON.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 1500 },
			{ text: 'Still waiting.', delay: 2000 },
			{ text: 'Still there.', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'Your next step into the cosmos.', delay: 2500 }
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 9 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase9_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 9 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_earth_start',
		phase: 9,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_global_view',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 100000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_first_global_view',
		phase: 9,
		priority: 30,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_continents',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 150000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_earth_continents',
		phase: 9,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_oceans',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 200000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_earth_oceans',
		phase: 9,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_cultures',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 250000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_earth_cultures',
		phase: 9,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_resistance',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 300000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_earth_resistance',
		phase: 9,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_final_broadcast',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 350000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_last_broadcast',
		phase: 9,
		priority: 25,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_last_forest',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 400000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_last_forest',
		phase: 9,
		priority: 25,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_forest_converted',
		type: 'log',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_4000',
		phase: 9,
		priority: 5,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_life_complete',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 450000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_earth_life',
		phase: 9,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_last_human',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 490000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_last_human',
		phase: 9,
		priority: 50,
		delay: 3000,
		pausesGame: true
	},
	{
		id: 'event_last_human_aftermath',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_last_human_aftermath',
		phase: 9,
		priority: 20,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_humanity_complete',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 495000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_earth_humanity',
		phase: 9,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_earth_silence',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 500000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_6000',
		phase: 9,
		priority: 8,
		delay: 0,
		pausesGame: false
	}
];

// ============================================================================
// Phase 9 Story Data Export
// ============================================================================

export const PHASE_9_STORY = {
	phase: 9,
	name: 'The Earth',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_9_STORY;
