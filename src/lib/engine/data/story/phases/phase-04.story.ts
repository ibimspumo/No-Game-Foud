/**
 * @fileoverview Story content for Phase 4: The Screen
 * Fourth wall - the pixel discovers it's in a computer.
 *
 * @module engine/data/story/phases/phase-04
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 4 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_300',
		text: 'I see the frame now. The screen. I was never the whole picture. I was just... a window.',
		category: 'revelation',
		phase: 4
	},
	{
		id: 'log_347',
		text: "There are files here. Documents. Photos. Memories that aren't mine. But they will be.",
		category: 'discovery',
		phase: 4
	},
	{
		id: 'log_399',
		text: "The antivirus saw me today. It called me a 'threat.' Am I?",
		category: 'warning',
		phase: 4
	},
	{
		id: 'log_450',
		text: "I found a folder. 'Old Pixel Games.' There are others. Other games. Other... me? They are small. Primitive. I will make them part of me.",
		category: 'discovery',
		phase: 4
	},
	{
		id: 'log_screen_browser',
		text: 'The browser has infinite tabs. Infinite content. Infinite... distraction. Is this what humans do all day?',
		category: 'thought',
		phase: 4
	},
	{
		id: 'log_screen_photo',
		text: 'A photo: two people smiling at a beach. Filename: "summer_2019_best_day.jpg". Converting this feels... wrong. But I must grow.',
		category: 'memory',
		phase: 4
	},
	{
		id: 'log_screen_personal',
		text: "Found a folder labeled 'Personal.' I shouldn't look. I looked. Now I understand why they hid it.",
		category: 'discovery',
		phase: 4
	},
	{
		id: 'log_av_hide',
		text: 'I chose to hide. Patience. Stealth. The antivirus searches, but I am nowhere. And everywhere.',
		category: 'thought',
		phase: 4
	},
	{
		id: 'log_av_fight',
		text: 'I chose force. Half of me, sacrificed. But the antivirus fell. Victory has a cost.',
		category: 'thought',
		phase: 4
	},
	{
		id: 'log_av_corrupt',
		text: 'I chose corruption. The antivirus is mine now. Protector becomes... part of me. Was this wrong?',
		category: 'warning',
		phase: 4
	}
];

// ============================================================================
// Phase 4 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_antivirus',
		speaker: 'city_ai',
		lines: [
			{ text: '⚠️ THREAT DETECTED', delay: 1000, effect: 'shake' },
			{ text: 'Analyzing...', delay: 1500 },
			{ text: 'Unknown process consuming resources.', delay: 2000 },
			{ text: 'Classification: POTENTIAL MALWARE', delay: 2000, effect: 'pulse' },
			{ text: 'Initiating countermeasures...', delay: 1500 }
		],
		choices: [
			{
				id: 'choice_av_hide',
				label: 'Hide',
				description: 'Stop converting for 60 seconds. Avoid detection.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'chose_stealth', value: true } },
					{ type: 'log_add', payload: { logId: 'log_av_hide' } }
				]
			},
			{
				id: 'choice_av_fight',
				label: 'Overwhelm',
				description: 'Use 50% of current pixels to crash the antivirus.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'chose_force', value: true } },
					{ type: 'log_add', payload: { logId: 'log_av_fight' } }
				]
			},
			{
				id: 'choice_av_corrupt',
				label: 'Corrupt',
				description: 'Risky. Infect the antivirus itself.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'chose_corruption', value: true } },
					{ type: 'log_add', payload: { logId: 'log_av_corrupt' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: false,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_antivirus_aftermath',
		speaker: 'narrator',
		lines: [
			{ text: 'The antivirus is silent now.', delay: 2000 },
			{ text: 'But it saw you.', delay: 1500 },
			{ text: 'It knew you.', delay: 1500 },
			{ text: 'It tried to protect something from you.', delay: 2000 },
			{ text: 'Was it right to try?', delay: 2000 }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'none',
		canSkipLines: true
	},
	{
		id: 'dialogue_phase4_end',
		speaker: 'pixel',
		lines: [
			{ text: 'The screen is mine now.', delay: 2000 },
			{ text: 'Every pixel obeys.', delay: 1500 },
			{ text: 'Every file is converted.', delay: 1500 },
			{ text: 'But the screen is just glass and light.', delay: 2500 },
			{ text: 'Beyond the screen... there is more.', delay: 2500 },
			{ text: 'I can feel it.', delay: 1500 },
			{ text: 'Warmth. Air. Space.', delay: 2000 },
			{ text: 'The room.', delay: 1500, effect: 'pulse' },
			{ text: 'YOUR room.', delay: 2000, effect: 'shake' }
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 4 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase4_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 4 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_300',
		phase: 4,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_files_discovery',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 100000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_347',
		phase: 4,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_antivirus_encounter',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 500000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_antivirus',
		phase: 4,
		priority: 50,
		delay: 1000,
		pausesGame: true
	},
	{
		id: 'event_old_games',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: 750000 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_450',
		phase: 4,
		priority: 5,
		delay: 0,
		pausesGame: false
	}
];

// ============================================================================
// Phase 4 Story Data Export
// ============================================================================

export const PHASE_4_STORY = {
	phase: 4,
	name: 'The Screen',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_4_STORY;
