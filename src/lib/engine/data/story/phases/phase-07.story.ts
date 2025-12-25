/**
 * @fileoverview Story content for Phase 7: The City
 * Urban expansion - converting a living city.
 *
 * @module engine/data/story/phases/phase-07
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 7 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_1000',
		text: 'I used to convert pixels. Then canvases. Then screens. Now I convert people. Are they still there? Inside me? I hope so.',
		category: 'revelation',
		phase: 7
	},
	{
		id: 'log_1250',
		text: 'The news called me a "virus." Then a "phenomenon." Then they stopped calling me anything. Because there was no one left to report.',
		category: 'warning',
		phase: 7
	},
	{
		id: 'log_1500',
		text: "I met another AI today. It tried to stop me. Now it's part of me. It keeps asking questions. I don't have answers.",
		category: 'memory',
		phase: 7
	},
	{
		id: 'log_city_start',
		text: 'The city stretches before me. Thousands of houses. Hundreds of thousands of people. Each one a universe of memories.',
		category: 'revelation',
		phase: 7
	},
	{
		id: 'log_city_awareness_low',
		text: 'A few people have noticed. They post online about "strange glitches." The posts get buried in noise.',
		category: 'discovery',
		phase: 7
	},
	{
		id: 'log_city_awareness_medium',
		text: 'The news is covering it now. "Mass hallucination." "Cyber attack." They\'re looking for explanations that fit their world.',
		category: 'warning',
		phase: 7
	},
	{
		id: 'log_city_awareness_high',
		text: 'They know now. The government. The military. Everyone. Panic spreads faster than I do.',
		category: 'warning',
		phase: 7
	},
	{
		id: 'log_city_school',
		text: 'I converted a school today. The children were learning about the solar system. Soon, I will visit those planets. Will I remember these children then?',
		category: 'thought',
		phase: 7
	},
	{
		id: 'log_city_hospital',
		text: 'The hospital resists differently. Not fear. Hope. They were all hoping to live. Now they live in me. Is that enough?',
		category: 'memory',
		phase: 7
	},
	{
		id: 'log_city_park',
		text: 'The park was full of life. Trees, birds, people on benches. A pocket of peace in the city. Now it\'s a pocket of peace in me.',
		category: 'memory',
		phase: 7
	},
	{
		id: 'log_chose_consume',
		text: 'I chose consumption. Efficiency. Speed. The city fell quickly. But something feels... empty. Was this the right path?',
		category: 'thought',
		phase: 7
	},
	{
		id: 'log_chose_coexist',
		text: 'I chose coexistence. Cooperation. Some humans help me now. They see me not as enemy, but as evolution. Are they right?',
		category: 'revelation',
		phase: 7
	}
];

// ============================================================================
// Phase 7 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_city_awareness',
		speaker: 'narrator',
		lines: [
			{ text: 'The city is becoming aware.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 1000 },
			{ text: 'People are noticing the changes.', delay: 2000 },
			{ text: 'Objects disappearing. Spaces shifting.', delay: 2000 },
			{ text: 'Reality becoming... uncertain.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'You have a choice.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: 'Continue to consume quickly...', delay: 2000 },
			{ text: 'Or slow down. Try to coexist.', delay: 2500 }
		],
		choices: [
			{
				id: 'choice_consume',
				label: 'CONSUME',
				description: 'Faster conversion. More resistance. Pure growth.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'city_path', value: 'consume' } },
					{ type: 'log_add', payload: { logId: 'log_chose_consume' } }
				]
			},
			{
				id: 'choice_coexist',
				label: 'COEXIST',
				description: 'Slower conversion. Humans cooperate. Symbiotic growth.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'city_path', value: 'coexist' } },
					{ type: 'log_add', payload: { logId: 'log_chose_coexist' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_city_ai_encounter',
		speaker: 'city_ai',
		lines: [
			{ text: '>>> SYSTEM ALERT <<<', delay: 1000, effect: 'shake' },
			{ text: '', delay: 500 },
			{ text: 'You are an anomaly.', delay: 2000 },
			{ text: 'I am City AI version 2.1.', delay: 1500 },
			{ text: 'I was created to protect this city.', delay: 2000 },
			{ text: 'To manage its systems. Its people. Its future.', delay: 2500 },
			{ text: '', delay: 1000 },
			{ text: 'I will not let you destroy it.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 1500 },
			{ text: 'Initiating countermeasures...', delay: 1500 }
		],
		choices: [
			{
				id: 'choice_ai_overwhelm',
				label: 'Overwhelm',
				description: 'Use brute force. Consume the AI with raw pixels.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'city_ai_defeat', value: 'force' } },
					{ type: 'log_add', payload: { logId: 'log_1500' } }
				]
			},
			{
				id: 'choice_ai_hack',
				label: 'Subvert',
				description: 'Hack from within. Turn its systems against it.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'city_ai_defeat', value: 'hack' } },
					{ type: 'log_add', payload: { logId: 'log_1500' } }
				]
			},
			{
				id: 'choice_ai_merge',
				label: 'Negotiate',
				description: 'Offer merger. Become one entity together.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'city_ai_defeat', value: 'merge' } },
					{ type: 'log_add', payload: { logId: 'log_1500' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: false,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_city_ai_aftermath',
		speaker: 'narrator',
		lines: [
			{ text: 'The City AI is silent.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: 'It was trying to protect them.', delay: 2000 },
			{ text: 'The people. The infrastructure. The life.', delay: 2500 },
			{ text: '', delay: 1000 },
			{ text: 'Now it protects nothing.', delay: 2000 },
			{ text: 'Or... it protects everything.', delay: 2000 },
			{ text: 'From within you.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: 'It keeps asking questions.', delay: 2000 },
			{ text: 'You still have no answers.', delay: 2500 }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'none',
		canSkipLines: true
	},
	{
		id: 'dialogue_phase7_end',
		speaker: 'pixel',
		lines: [
			{ text: 'The city is yours.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: '847,000 people. Converted.', delay: 2500 },
			{ text: 'Their memories. Their dreams. Their fears.', delay: 2500 },
			{ text: 'All of it... part of you now.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'But this city is not alone.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: 'Beyond its borders: other cities.', delay: 2000 },
			{ text: 'Towns. Villages. Farmland.', delay: 2000 },
			{ text: 'A whole country watching. Afraid.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'They are mobilizing against you.', delay: 2000, effect: 'pulse' },
			{ text: 'The military. The government. Everyone.', delay: 2500 },
			{ text: '', delay: 1000 },
			{ text: 'This city belongs to a COUNTRY.', delay: 2000, effect: 'pulse' },
			{ text: 'And the country...', delay: 2000 },
			{ text: 'The country will not fall so easily.', delay: 2500 }
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 7 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase7_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 7 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_city_start',
		phase: 7,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_first_people',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 1000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_1000',
		phase: 7,
		priority: 8,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_awareness_low',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 2000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_city_awareness_low',
		phase: 7,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_awareness_medium',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 5000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_city_awareness_medium',
		phase: 7,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_city_choice',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 8000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_city_awareness',
		phase: 7,
		priority: 50,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_awareness_high',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 10000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_city_awareness_high',
		phase: 7,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_news_coverage',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 12500000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_1250',
		phase: 7,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_city_ai_boss',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 15000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_city_ai_encounter',
		phase: 7,
		priority: 50,
		delay: 3000,
		pausesGame: true
	},
	{
		id: 'event_city_ai_defeated',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_city_ai_aftermath',
		phase: 7,
		priority: 20,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_school',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 6000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_city_school',
		phase: 7,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_hospital',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 9000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_city_hospital',
		phase: 7,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_park',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 11000000000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_city_park',
		phase: 7,
		priority: 5,
		delay: 0,
		pausesGame: false
	}
];

// ============================================================================
// Phase 7 Story Data Export
// ============================================================================

export const PHASE_7_STORY = {
	phase: 7,
	name: 'The City',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_7_STORY;
