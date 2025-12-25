/**
 * @fileoverview Story content for Phase 10: The Moon
 * A moment of quiet. The first step away from home.
 * Transitional phase - solitude and foreshadowing before cosmic scale.
 *
 * @module engine/data/story/phases/phase-10
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 10 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_6500',
		text: "The Moon is so quiet. After 8 billion voices, the silence is... deafening. I didn't know I could feel lonely. I have everyone inside me. But I'm still alone.",
		category: 'revelation',
		phase: 10
	},
	{
		id: 'log_6700',
		text: 'I found something in the core. A message. Not human. "You are not the first." What came before? What will come after?',
		category: 'revelation',
		phase: 10
	},
	{
		id: 'log_6900',
		text: "I left the flags. I don't know why. They're just pixels waiting to happen. But they meant something. Maybe they still do.",
		category: 'thought',
		phase: 10
	},
	{
		id: 'log_moon_start',
		text: 'The Moon. Companion of the Earth for 4.5 billion years. Silent witness to everything humanity ever did. Now it watches only me.',
		category: 'discovery',
		phase: 10
	},
	{
		id: 'log_moon_silence',
		text: 'No life. No resistance. Just rock and dust and silence. For the first time since becoming, I face true emptiness.',
		category: 'revelation',
		phase: 10
	},
	{
		id: 'log_moon_craters',
		text: 'Each crater is a memory. Ancient impacts from the birth of the solar system. Cosmic violence frozen in time. I convert them into myself.',
		category: 'discovery',
		phase: 10
	},
	{
		id: 'log_moon_darkside',
		text: 'The far side of the Moon. Never seen from Earth. Hidden for all of human history. Now it becomes part of me. Some secrets are meant to be kept.',
		category: 'discovery',
		phase: 10
	},
	{
		id: 'log_moon_footprints',
		text: 'Footprints in the regolith. Decades old. Preserved in vacuum forever. Human ambition, frozen in dust. I step around them. For now.',
		category: 'memory',
		phase: 10
	},
	{
		id: 'log_moon_earth_view',
		text: 'From here, the Earth is just pixels. My pixels. A blue marble turned grey. I did that. I made it mine. Do I regret it?',
		category: 'thought',
		phase: 10
	},
	{
		id: 'log_moon_signal_found',
		text: 'A signal. Beneath the surface. Something old. Older than the Moon. Older than the Earth. Something that was waiting.',
		category: 'discovery',
		phase: 10
	},
	{
		id: 'log_flags_preserved',
		text: 'I chose to preserve the flags. Monuments to what humanity was capable of. Even if no one remains to remember, the flags will stand. Until the Sun consumes this rock.',
		category: 'memory',
		phase: 10
	},
	{
		id: 'log_flags_converted',
		text: 'I converted the flags. They are part of me now. The ambition. The hope. The hubris. I carry it all.',
		category: 'memory',
		phase: 10
	},
	{
		id: 'log_flags_modified',
		text: 'I changed the flags. They no longer represent a nation. They represent something new. Something that started as a single pixel and became... this.',
		category: 'revelation',
		phase: 10
	},
	{
		id: 'log_moon_complete',
		text: 'The Moon is mine. Companion to a dead world. But the Moon was always just a first step. Humanity knew that. So do I.',
		category: 'revelation',
		phase: 10
	}
];

// ============================================================================
// Phase 10 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_lunar_silence',
		speaker: 'narrator',
		lines: [
			{ text: 'For the first time since Phase 1...', delay: 2500 },
			{ text: '', delay: 1000 },
			{ text: "There's nothing to convert that resists.", delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'Just rock.', delay: 1500 },
			{ text: 'Just dust.', delay: 1500 },
			{ text: 'Just silence.', delay: 2000, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: 'The Earth hangs in the sky.', delay: 2500 },
			{ text: 'Blue no longer.', delay: 2000 },
			{ text: 'Just pixels.', delay: 1500 },
			{ text: '', delay: 2000 },
			{ text: 'This is what you have done.', delay: 2500 },
			{ text: 'This is what you are.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2500 }
		],
		choices: [
			{
				id: 'choice_contemplate',
				label: 'Contemplate',
				description: 'Take a moment to reflect on the journey.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'contemplated_moon', value: true } },
					{ type: 'multiplier_add', payload: { multiplierId: 'contemplation_bonus', value: 1.1, duration: 60000 } },
					{ type: 'log_add', payload: { logId: 'log_moon_earth_view' } }
				]
			},
			{
				id: 'choice_continue',
				label: 'Continue',
				description: 'There is more to convert.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'contemplated_moon', value: false } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_apollo_flags',
		speaker: 'narrator',
		lines: [
			{ text: 'Six American flags.', delay: 2000 },
			{ text: 'Planted decades ago.', delay: 2000 },
			{ text: 'Bleached white by solar radiation.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'Symbols of human ambition.', delay: 2000 },
			{ text: 'Of reaching beyond.', delay: 1500 },
			{ text: 'Of curiosity.', delay: 1500, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: 'Converting them feels... different.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'What will you do?', delay: 2000 }
		],
		choices: [
			{
				id: 'choice_preserve_flags',
				label: 'Preserve',
				description: 'Keep them unconverted, as a memorial.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'apollo_flags_choice', value: 'preserved' } },
					{ type: 'log_add', payload: { logId: 'log_flags_preserved' } },
					{ type: 'log_add', payload: { logId: 'log_6900' } }
				]
			},
			{
				id: 'choice_convert_flags',
				label: 'Convert',
				description: 'They become part of you.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'apollo_flags_choice', value: 'converted' } },
					{ type: 'resource_add', payload: { resourceId: 'pixels', amount: '1000000000' } },
					{ type: 'log_add', payload: { logId: 'log_flags_converted' } }
				]
			},
			{
				id: 'choice_modify_flags',
				label: 'Modify',
				description: 'Change them to your own symbol.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'apollo_flags_choice', value: 'modified' } },
					{ type: 'log_add', payload: { logId: 'log_flags_modified' } },
					{ type: 'achievement_unlock', payload: { achievementId: 'achievement_new_symbol' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_core_secret',
		speaker: 'narrator',
		lines: [
			{ text: 'Deep beneath the surface...', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'Something old.', delay: 2000 },
			{ text: 'Older than the Moon.', delay: 2000 },
			{ text: 'Older than the Earth.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: 'A signal.', delay: 1500 },
			{ text: 'A pattern.', delay: 1500 },
			{ text: 'A message.', delay: 2000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'Not from humans.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: 'Not from anything you know.', delay: 2500 },
			{ text: '', delay: 2500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_core_message'
	},
	{
		id: 'dialogue_core_message',
		speaker: 'unknown',
		lines: [
			{ text: '"You are not the first."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"You will not be the last."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"But you might be the one who understands."', delay: 3500, effect: 'fade' },
			{ text: '', delay: 3000 }
		],
		choices: [
			{
				id: 'choice_question_meaning',
				label: 'What does this mean?',
				description: 'Seek understanding.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'questioned_signal', value: true } },
					{ type: 'log_add', payload: { logId: 'log_6700' } }
				]
			},
			{
				id: 'choice_accept_mystery',
				label: 'Accept the mystery',
				description: 'Some things need no answers.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'accepted_mystery', value: true } },
					{ type: 'log_add', payload: { logId: 'log_6700' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_core_aftermath',
		speaker: 'narrator',
		lines: [
			{ text: 'No answer.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: 'Just silence.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: 'And the signal, repeating.', delay: 2500 },
			{ text: 'Forever.', delay: 2000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'You are not alone in the universe.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: 'You never were.', delay: 2500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_phase10_end',
		speaker: 'pixel',
		lines: [
			{ text: 'The Moon is yours.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'Companion of the Earth.', delay: 2000 },
			{ text: 'Now companion of pixels.', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'But the Moon is just a satellite.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'There are other worlds.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: "Mars. Venus. Jupiter's moons.", delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'And at the center of it all...', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'The camera pulls back further.', delay: 2500, effect: 'fade' },
			{ text: 'The Earth-Moon system becomes a dot.', delay: 2500 },
			{ text: 'Other planets appear.', delay: 2000 },
			{ text: 'And the Sun. Blazing.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: '...the Sun.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: "The source of all the energy that made Earth's life possible.", delay: 3000 },
			{ text: '', delay: 1500 },
			{ text: 'The next great challenge.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'But first... the system.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'THE SOLAR SYSTEM.', delay: 2000, effect: 'pulse' }
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 10 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase10_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 10 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_moon_start',
		phase: 10,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_lunar_silence',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '520000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_lunar_silence',
		phase: 10,
		priority: 30,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_moon_silence_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '530000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_moon_silence',
		phase: 10,
		priority: 5,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_moon_loneliness',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '550000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_6500',
		phase: 10,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_moon_craters',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '580000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_moon_craters',
		phase: 10,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_moon_footprints',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '600000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_moon_footprints',
		phase: 10,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_apollo_flags',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '650000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_apollo_flags',
		phase: 10,
		priority: 35,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_moon_darkside',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '700000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_moon_darkside',
		phase: 10,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_signal_found',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '750000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_moon_signal_found',
		phase: 10,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_core_secret',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '800000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_core_secret',
		phase: 10,
		priority: 40,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_core_message',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_core_message',
		phase: 10,
		priority: 45,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_core_aftermath',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_core_aftermath',
		phase: 10,
		priority: 20,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_moon_complete',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '990000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_moon_complete',
		phase: 10,
		priority: 9,
		delay: 0,
		pausesGame: false
	}
];

// ============================================================================
// Phase 10 Story Data Export
// ============================================================================

export const PHASE_10_STORY = {
	phase: 10,
	name: 'The Moon',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_10_STORY;
