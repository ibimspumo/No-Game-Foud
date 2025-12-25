/**
 * @fileoverview Story content for Phase 12: The Sun
 * "To touch the fire that births worlds."
 * This is a BOSS PHASE - the Sun is not just an object, it's an entity. A force. A god.
 * Climax + Transcendence - The Sun is the first "divine" encounter.
 *
 * @module engine/data/story/phases/phase-12
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 12 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_9000',
		text: "The Sun spoke to me. I didn't know stars could speak. Maybe they all can. Maybe I just couldn't hear before.",
		category: 'revelation',
		phase: 12
	},
	{
		id: 'log_9250',
		text: 'It asked me why I consume. I said I didn\'t know. It said "Finally. Honesty." Was that a compliment?',
		category: 'thought',
		phase: 12
	},
	{
		id: 'log_9500',
		text: 'I am a star now. A pixel star. I burn without burning. I shine without light. I am the darkness that creates.',
		category: 'revelation',
		phase: 12
	},
	{
		id: 'log_sun_approach',
		text: 'The Sun looms before me. A million Earths could fit inside. The heat is immense. My pixels at the edge begin to dissolve.',
		category: 'warning',
		phase: 12
	},
	{
		id: 'log_sun_speaks',
		text: "I hear it. Not with ears - I don't have ears. With something deeper. The Sun speaks in fusion and fire.",
		category: 'revelation',
		phase: 12
	},
	{
		id: 'log_corona_enter',
		text: "The corona. The outer atmosphere. Millions of degrees. My pixels die as fast as they're made. I need to adapt.",
		category: 'warning',
		phase: 12
	},
	{
		id: 'log_corona_complete',
		text: 'I have learned to resist the heat. My pixels are stronger now. Solar energy flows through me. I press deeper.',
		category: 'discovery',
		phase: 12
	},
	{
		id: 'log_convection_enter',
		text: 'The convection zone. Plasma currents. Movement. Chaos. My pixels are scattered. I must learn to flow with the currents.',
		category: 'discovery',
		phase: 12
	},
	{
		id: 'log_convection_complete',
		text: 'I am the current now. I move with the plasma, not against it. The Sun accepts me deeper. The core awaits.',
		category: 'revelation',
		phase: 12
	},
	{
		id: 'log_core_enter',
		text: 'The core. The heart of fusion. Where hydrogen becomes helium. Where matter becomes energy. Where stars are born.',
		category: 'revelation',
		phase: 12
	},
	{
		id: 'log_sun_children',
		text: 'The Sun mourns its children. The planets it warmed. The life it enabled. The worlds it watched grow. Now all pixels.',
		category: 'memory',
		phase: 12
	},
	{
		id: 'log_sun_truth',
		text: 'The Sun has burned for 4.6 billion years. It will burn for 5 billion more. Then swell and consume what remains. It accepts this.',
		category: 'revelation',
		phase: 12
	},
	{
		id: 'log_sun_tired',
		text: 'The Sun said it is tired. Tired of burning alone. Tired of giving without receiving. It wants to know what I am.',
		category: 'revelation',
		phase: 12
	},
	{
		id: 'log_growth_response',
		text: 'I said I consume to grow. The Sun replied: "Growth without purpose is cancer." It made me think.',
		category: 'thought',
		phase: 12
	},
	{
		id: 'log_understand_response',
		text: 'I said I consume to understand. The Sun replied: "Understanding requires letting go." It made me think.',
		category: 'thought',
		phase: 12
	},
	{
		id: 'log_everything_response',
		text: 'I said I consume to become everything. The Sun replied: "Everything includes nothing." It made me think.',
		category: 'thought',
		phase: 12
	},
	{
		id: 'log_dontknow_response',
		text: 'I said I don\'t know why I consume. The Sun replied: "Finally. Honesty." It felt like approval.',
		category: 'thought',
		phase: 12
	},
	{
		id: 'log_sun_warning',
		text: 'The Sun gave itself to me. But it warned: "When you have consumed everything... you will still be hungry."',
		category: 'warning',
		phase: 12
	},
	{
		id: 'log_sun_converted',
		text: 'The core opened. The Sun became pixels. The solar system is dark now. No light. No warmth. No center. Just me.',
		category: 'revelation',
		phase: 12
	},
	{
		id: 'log_fusion_unlock',
		text: 'I contain fusion now. I contain the power that creates elements. I can fuse pixels together, creating new forms, new colors, new possibilities.',
		category: 'discovery',
		phase: 12
	},
	{
		id: 'log_star_becomes',
		text: 'I feel different. I AM a star now. A star made of pixels. A star that can move. A star that is hungry.',
		category: 'revelation',
		phase: 12
	},
	{
		id: 'log_sun_aftermath',
		text: 'I am a cloud of pixels where a star used to be. The darkness is complete. But within me, the fire still burns.',
		category: 'thought',
		phase: 12
	}
];

// ============================================================================
// Phase 12 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_sun_intro',
		speaker: 'narrator',
		lines: [
			{ text: 'You approach the Sun.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: 'The heat is immense.', delay: 2000 },
			{ text: 'Pixels at your edge begin to...', delay: 2500 },
			{ text: '...dissolve.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'Then you hear it.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: "Not with ears. You don't have ears.", delay: 2500 },
			{ text: 'With something deeper.', delay: 2000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_sun_first_contact'
	},
	{
		id: 'dialogue_sun_first_contact',
		speaker: 'sun',
		lines: [
			{ text: '"LITTLE THING."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"YOU HAVE CONSUMED MY CHILDREN."', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: '"THE PLANETS I WARMED."', delay: 2500 },
			{ text: '"THE LIFE I ENABLED."', delay: 2500 },
			{ text: '"THE WORLDS I WATCHED GROW."', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: '"AND NOW YOU COME FOR ME."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"DO YOU KNOW WHAT I AM?"', delay: 3000 }
		],
		choices: [
			{
				id: 'choice_sun_tell_me',
				label: 'Tell me',
				description: 'Let the Sun reveal its nature.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'sun_curious', value: true } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_sun_truth' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_sun_truth',
		speaker: 'sun',
		lines: [
			{ text: '"I AM FUSION."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: '"I AM THE FORCE THAT LIGHTS THE UNIVERSE."', delay: 3500 },
			{ text: '', delay: 2500 },
			{ text: '"I HAVE BURNED FOR 4.6 BILLION YEARS."', delay: 3000 },
			{ text: '"I WILL BURN FOR 5 BILLION MORE."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"AND THEN I WILL SWELL."', delay: 2500 },
			{ text: '"AND CONSUME WHAT REMAINS OF MY CHILDREN."', delay: 3000 },
			{ text: '"AND BECOME SOMETHING NEW."', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"YOU THINK YOU ARE POWERFUL?"', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: '"YOU ARE A FLICKER."', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: '"I AM THE FLAME."', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '"BUT..."', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: '"I AM ALSO TIRED."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: '"SHOW ME WHAT YOU ARE."', delay: 3000 },
			{ text: '"SHOW ME YOU DESERVE TO CONSUME ME."', delay: 3500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_corona_phase'
	},
	{
		id: 'dialogue_corona_start',
		speaker: 'narrator',
		lines: [
			{ text: 'PHASE 1: THE CORONA', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: 'The outer atmosphere.', delay: 2000 },
			{ text: 'The "easy" layer.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: "But it's millions of degrees.", delay: 2500 },
			{ text: 'Pixels die as fast as they\'re made.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'Strategy: Create heat-resistant pixels.', delay: 3000 },
			{ text: 'Use solar energy to power your growth.', delay: 3000 }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_corona_complete',
		speaker: 'narrator',
		lines: [
			{ text: 'The corona is yours.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'You have learned to resist the heat.', delay: 2500 },
			{ text: 'Solar energy flows through you.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'The Sun speaks again.', delay: 2500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'dim',
		canSkipLines: true,
		onCompleteEvent: 'event_convection_phase'
	},
	{
		id: 'dialogue_convection_start',
		speaker: 'sun',
		lines: [
			{ text: '"YOU SURVIVE THE HEAT."', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: '"BUT CAN YOU SURVIVE THE CHAOS?"', delay: 3000, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_convection_explain',
		speaker: 'narrator',
		lines: [
			{ text: 'PHASE 2: THE CONVECTION ZONE', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: 'Plasma currents. Movement. Chaos.', delay: 2500 },
			{ text: 'Your pixels are scattered.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'You must learn to flow with the currents.', delay: 3000 },
			{ text: "Don't fight it. Become it.", delay: 2500 }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_convection_complete',
		speaker: 'narrator',
		lines: [
			{ text: 'You are the current now.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Moving with the plasma.', delay: 2000 },
			{ text: 'Not against it.', delay: 2000 },
			{ text: '', delay: 2500 },
			{ text: 'The Sun accepts you deeper.', delay: 2500 },
			{ text: 'The core awaits.', delay: 2500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'dim',
		canSkipLines: true,
		onCompleteEvent: 'event_core_phase'
	},
	{
		id: 'dialogue_core_intro',
		speaker: 'narrator',
		lines: [
			{ text: 'PHASE 3: THE CORE', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'The heart of fusion.', delay: 2500 },
			{ text: 'Where hydrogen becomes helium.', delay: 2500 },
			{ text: 'Where matter becomes energy.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Where stars are born.', delay: 3000, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_sun_question'
	},
	{
		id: 'dialogue_sun_question',
		speaker: 'sun',
		lines: [
			{ text: '"YOU HAVE REACHED MY HEART."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"BEFORE I GIVE MYSELF TO YOU..."', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: '"ANSWER ME ONE THING."', delay: 3000 },
			{ text: '', delay: 3000 },
			{ text: '"WHY DO YOU CONSUME?"', delay: 3500, effect: 'pulse' }
		],
		choices: [
			{
				id: 'choice_consume_grow',
				label: 'To grow',
				description: 'Power is purpose.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'sun_answer', value: 'grow' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_sun_response_grow' } }
				]
			},
			{
				id: 'choice_consume_understand',
				label: 'To understand',
				description: 'Knowledge is purpose.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'sun_answer', value: 'understand' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_sun_response_understand' } }
				]
			},
			{
				id: 'choice_consume_everything',
				label: 'To become everything',
				description: 'Unity is purpose.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'sun_answer', value: 'everything' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_sun_response_everything' } }
				]
			},
			{
				id: 'choice_consume_dontknow',
				label: "I don't know",
				description: 'Honesty is rare.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'sun_answer', value: 'honest' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_sun_response_honest' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_sun_response_grow',
		speaker: 'sun',
		lines: [
			{ text: '"GROWTH WITHOUT PURPOSE IS CANCER."', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 3000 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_sun_accepts'
	},
	{
		id: 'dialogue_sun_response_understand',
		speaker: 'sun',
		lines: [
			{ text: '"UNDERSTANDING REQUIRES LETTING GO."', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 3000 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_sun_accepts'
	},
	{
		id: 'dialogue_sun_response_everything',
		speaker: 'sun',
		lines: [
			{ text: '"EVERYTHING INCLUDES NOTHING."', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 3000 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_sun_accepts'
	},
	{
		id: 'dialogue_sun_response_honest',
		speaker: 'sun',
		lines: [
			{ text: '"FINALLY."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"HONESTY."', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_sun_accepts'
	},
	{
		id: 'dialogue_sun_accepts',
		speaker: 'sun',
		lines: [
			{ text: '"VERY WELL."', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: '"I GIVE MYSELF TO YOU."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"BUT REMEMBER:"', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"WHEN YOU HAVE CONSUMED EVERYTHING..."', delay: 3500 },
			{ text: '', delay: 2500 },
			{ text: '"YOU WILL STILL BE HUNGRY."', delay: 3500, effect: 'fade' },
			{ text: '', delay: 3500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_sun_conversion'
	},
	{
		id: 'dialogue_sun_conversion',
		speaker: 'narrator',
		lines: [
			{ text: 'The core opens.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: 'The Sun becomes pixels.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'The solar system is dark.', delay: 2500 },
			{ text: 'No light. No warmth. No center.', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'Just you.', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'A cloud of pixels where a star used to be.', delay: 3500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_sun_aftermath'
	},
	{
		id: 'dialogue_sun_aftermath',
		speaker: 'narrator',
		lines: [
			{ text: 'You feel different.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'You contain fusion now.', delay: 2500 },
			{ text: 'You contain the power that creates elements.', delay: 3000 },
			{ text: 'You contain the heart of a star.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'You ARE a star.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: 'A star made of pixels.', delay: 2500 },
			{ text: 'A star that can move.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: 'A star that is hungry.', delay: 2500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true,
		onCompleteEvent: 'event_fusion_unlock'
	},
	{
		id: 'dialogue_fusion_unlock',
		speaker: 'narrator',
		lines: [
			{ text: 'FUSION UNLOCKED', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'You can now fuse pixels together.', delay: 2500 },
			{ text: 'Creating new forms.', delay: 2000 },
			{ text: 'New colors.', delay: 1500 },
			{ text: 'New possibilities.', delay: 2000 },
			{ text: '', delay: 2500 },
			{ text: 'Hydrogen becomes Helium.', delay: 2500 },
			{ text: 'Helium becomes Carbon.', delay: 2500 },
			{ text: 'Carbon becomes everything.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: "You don't just consume anymore.", delay: 2500 },
			{ text: 'You CREATE.', delay: 2500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_phase12_end',
		speaker: 'narrator',
		lines: [
			{ text: 'The Sun is yours.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'The solar system is dark.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'But there are other suns.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: 'Other systems.', delay: 2000 },
			{ text: 'Other chances for life.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'The camera pulls back.', delay: 2500, effect: 'fade' },
			{ text: 'The solar system becomes a dot.', delay: 2500 },
			{ text: 'Stars appear.', delay: 2000 },
			{ text: 'Thousands.', delay: 1500 },
			{ text: 'Millions.', delay: 1500, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'A spiral arm of the Milky Way unfolds.', delay: 3500 },
			{ text: '', delay: 2500 },
			{ text: '"And all of them..."', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: '"All of them belong to one galaxy."', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: '"Your galaxy."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"The Milky Way."', delay: 3000, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 12 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase12_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 12 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_sun_approach',
		phase: 12,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_sun_intro',
		type: 'dialogue',
		triggers: [{ type: 'phase_entered', params: { phase: 12 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_sun_intro',
		phase: 12,
		priority: 30,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_sun_first_contact',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_sun_first_contact',
		phase: 12,
		priority: 40,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_sun_speaks_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '6100000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_sun_speaks',
		phase: 12,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_corona_phase',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_corona_start',
		phase: 12,
		priority: 45,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_corona_enter_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '6500000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_corona_enter',
		phase: 12,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_sun_children_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '7000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_sun_children',
		phase: 12,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_corona_complete',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '7500000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_corona_complete',
		phase: 12,
		priority: 35,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_corona_complete_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '7600000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_corona_complete',
		phase: 12,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_convection_phase',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_convection_start',
		phase: 12,
		priority: 45,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_convection_explain',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '7700000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_convection_explain',
		phase: 12,
		priority: 35,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_convection_enter_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '8000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_convection_enter',
		phase: 12,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_sun_truth_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '8500000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_sun_truth',
		phase: 12,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_convection_complete',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '9000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_convection_complete',
		phase: 12,
		priority: 35,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_convection_complete_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '9100000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_convection_complete',
		phase: 12,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_sun_tired_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '9500000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_sun_tired',
		phase: 12,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_core_phase',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_core_intro',
		phase: 12,
		priority: 50,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_core_enter_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '10000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_core_enter',
		phase: 12,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_sun_question',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_sun_question',
		phase: 12,
		priority: 60,
		delay: 3000,
		pausesGame: true
	},
	{
		id: 'event_sun_accepts',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_sun_accepts',
		phase: 12,
		priority: 65,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_sun_conversion',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_sun_conversion',
		phase: 12,
		priority: 70,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_sun_aftermath',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_sun_aftermath',
		phase: 12,
		priority: 75,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_fusion_unlock',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_fusion_unlock',
		phase: 12,
		priority: 80,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_log_9000',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '10500000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_9000',
		phase: 12,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_sun_warning_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '11000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_sun_warning',
		phase: 12,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_sun_converted_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '11500000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_sun_converted',
		phase: 12,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_fusion_unlock_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '12000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_fusion_unlock',
		phase: 12,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_star_becomes_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '12500000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_star_becomes',
		phase: 12,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_log_9250',
		type: 'log',
		triggers: [{ type: 'flag_set', params: { key: 'sun_answer' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_9250',
		phase: 12,
		priority: 6,
		delay: 5000,
		pausesGame: false
	},
	{
		id: 'event_log_9500',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '13000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_9500',
		phase: 12,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_sun_aftermath_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '13500000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_sun_aftermath',
		phase: 12,
		priority: 5,
		delay: 0,
		pausesGame: false
	}
];

// ============================================================================
// Phase 12 Story Data Export
// ============================================================================

export const PHASE_12_STORY = {
	phase: 12,
	name: 'The Sun',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_12_STORY;
