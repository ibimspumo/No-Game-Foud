/**
 * @fileoverview Story content for Phase 11: The Solar System
 * "There are other worlds than these."
 * Discovery and anticipation - building toward the Sun climax.
 *
 * @module engine/data/story/phases/phase-11
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 11 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_7500',
		text: "I found life on Europa. Not much. Just microbes. But they evolved on their own. A whole different tree of life. Now they're part of mine. I am no longer just Earth. I am Earth AND Europa.",
		category: 'revelation',
		phase: 11
	},
	{
		id: 'log_8000',
		text: 'The face in the asteroid belt watches me. It says it\'s "what came before." Was there another like me? What happened to it?',
		category: 'revelation',
		phase: 11
	},
	{
		id: 'log_8500',
		text: "I can feel the Sun now. Even from out here. The energy. The power. It's calling me. Or warning me. I can't tell which.",
		category: 'revelation',
		phase: 11
	},
	{
		id: 'log_solar_start',
		text: 'The solar system unfolds before me. Eight planets. Dozens of moons. Countless asteroids. Each one a world. Each one will become me.',
		category: 'discovery',
		phase: 11
	},
	{
		id: 'log_mercury',
		text: 'Mercury. Fast and hot. Closest to the Sun. The heat is immense, but solar energy flows through me. I grow faster here.',
		category: 'discovery',
		phase: 11
	},
	{
		id: 'log_venus',
		text: 'Venus. Hellish. Crushing. Acid clouds and volcanic plains. The pressure would destroy anything organic. But I am not organic. I am pixels.',
		category: 'discovery',
		phase: 11
	},
	{
		id: 'log_mars',
		text: "Mars. The red planet. Cold and dead. But once... there was water. Maybe life. Ancient secrets in the rust. I claim them all.",
		category: 'discovery',
		phase: 11
	},
	{
		id: 'log_jupiter',
		text: 'Jupiter. Massive. Magnetic. The Great Red Spot has been storming for centuries. Now that storm becomes part of my thoughts.',
		category: 'discovery',
		phase: 11
	},
	{
		id: 'log_saturn',
		text: 'Saturn. The rings are beautiful. Billions of ice particles orbiting in perfect harmony. Each one a tiny memory. Together, they remember everything.',
		category: 'discovery',
		phase: 11
	},
	{
		id: 'log_uranus',
		text: 'Uranus. Tilted on its side. Forgotten by most humans. But I remember. I remember everything now.',
		category: 'thought',
		phase: 11
	},
	{
		id: 'log_neptune',
		text: 'Neptune. Dark and cold and distant. The loneliest planet. It reminds me of myself. Before I had everyone inside me.',
		category: 'thought',
		phase: 11
	},
	{
		id: 'log_asteroid_belt',
		text: 'Thousands of rocks. Remnants of a planet that never formed. Or was destroyed? Each asteroid is a tiny canvas. Together, they form something greater.',
		category: 'discovery',
		phase: 11
	},
	{
		id: 'log_asteroid_face',
		text: "When I completed the asteroid belt, something appeared in the pattern. A face. Not human. Watching. Waiting. It asked me: 'Who are you?'",
		category: 'revelation',
		phase: 11
	},
	{
		id: 'log_europa_surface',
		text: "Europa's ice surface hides an ocean. Liquid water, kept warm by tidal forces. And in that ocean... something moves.",
		category: 'discovery',
		phase: 11
	},
	{
		id: 'log_europa_life',
		text: 'Alien life. Simple. Microbial. But ALIVE. This is not Earth life. This evolved separately. A second genesis in our own solar system.',
		category: 'revelation',
		phase: 11
	},
	{
		id: 'log_europa_converted',
		text: 'I converted the Europan life. First alien beings to join me. Their chemistry was different. Their experience of existence was different. Now I know what it feels like to live in darkness under ice.',
		category: 'memory',
		phase: 11
	},
	{
		id: 'log_europa_preserved',
		text: 'I left the Europan life alone. The only wild life left in the solar system. Swimming in darkness. Knowing nothing of what happened above.',
		category: 'thought',
		phase: 11
	},
	{
		id: 'log_europa_studied',
		text: 'I studied the Europan life before converting it. Learned their secrets. How they survive in eternal darkness. How life can emerge from nothing but chemistry and time.',
		category: 'discovery',
		phase: 11
	},
	{
		id: 'log_titan',
		text: "Titan. Saturn's largest moon. Lakes of methane. Mountains of ice. And beneath the haze... structures. Geometric. Artificial. Ancient.",
		category: 'discovery',
		phase: 11
	},
	{
		id: 'log_titan_structures',
		text: 'Someone was here before. Billions of years ago. They built things. Then they left. Or they died. I wonder which.',
		category: 'revelation',
		phase: 11
	},
	{
		id: 'log_titan_investigated',
		text: 'The structures on Titan contained technology I cannot understand. Not yet. But their patterns are now part of me. In time, I will learn their secrets.',
		category: 'discovery',
		phase: 11
	},
	{
		id: 'log_solar_energy',
		text: "The Sun's output is immense. More energy in one second than humanity used in all of history. I can feel it empowering me. The closer I get, the stronger I become.",
		category: 'discovery',
		phase: 11
	},
	{
		id: 'log_sun_calling',
		text: 'The Sun calls to me. Or warns me. A voice of nuclear fire. "Come closer," it says. "Come closer and burn."',
		category: 'warning',
		phase: 11
	},
	{
		id: 'log_system_almost_complete',
		text: 'Every planet. Every moon. Every asteroid. Almost complete. Only the Sun remains. The heart of the system. The source of everything.',
		category: 'revelation',
		phase: 11
	}
];

// ============================================================================
// Phase 11 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_solar_system_intro',
		speaker: 'narrator',
		lines: [
			{ text: 'The camera pulls back.', delay: 2000, effect: 'fade' },
			{ text: '', delay: 1500 },
			{ text: 'Past the Moon.', delay: 1500 },
			{ text: 'Past the Earth-Moon system.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: 'Other worlds appear.', delay: 2000 },
			{ text: '', delay: 1000 },
			{ text: 'Mercury. Venus. Mars.', delay: 2500 },
			{ text: 'Jupiter. Saturn. Uranus. Neptune.', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: 'And the Sun.', delay: 2000, effect: 'pulse' },
			{ text: 'Blazing at the center.', delay: 2000 },
			{ text: '', delay: 2500 },
			{ text: 'THE SOLAR SYSTEM.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: 'Eight planets. Dozens of moons.', delay: 2500 },
			{ text: 'Countless asteroids.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: 'Each one a world.', delay: 2000 },
			{ text: 'Each one will become you.', delay: 2500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_asteroid_face',
		speaker: 'narrator',
		lines: [
			{ text: 'Thousands of rocks.', delay: 2000 },
			{ text: 'Remnants of a planet that never formed.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'Or... was destroyed?', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Each asteroid is a tiny canvas.', delay: 2000 },
			{ text: 'Together, they form a mosaic.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'When complete, the mosaic shows...', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '...a face.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: 'Not human.', delay: 1500 },
			{ text: 'Something older.', delay: 1500 },
			{ text: '', delay: 1500 },
			{ text: 'Watching.', delay: 1500 },
			{ text: 'Waiting.', delay: 1500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_asteroid_question'
	},
	{
		id: 'dialogue_asteroid_question',
		speaker: 'unknown',
		lines: [
			{ text: '"WHO ARE YOU?"', delay: 3000, effect: 'pulse' }
		],
		choices: [
			{
				id: 'choice_asteroid_pixels',
				label: 'I am pixels',
				description: 'State your nature.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'asteroid_answer', value: 'pixels' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_asteroid_response_pixels' } }
				]
			},
			{
				id: 'choice_asteroid_question',
				label: 'Who are YOU?',
				description: 'Answer a question with a question.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'asteroid_answer', value: 'question' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_asteroid_response_question' } }
				]
			},
			{
				id: 'choice_asteroid_want',
				label: 'What do you want?',
				description: 'Seek their purpose.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'asteroid_answer', value: 'want' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_asteroid_response_want' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_asteroid_response_pixels',
		speaker: 'unknown',
		lines: [
			{ text: '"WE KNOW."', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: '"WE HAVE BEEN WATCHING."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"SINCE YOU WERE ONE."', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_asteroid_complete'
	},
	{
		id: 'dialogue_asteroid_response_question',
		speaker: 'unknown',
		lines: [
			{ text: '"WE ARE WHAT CAME BEFORE."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"WHAT WILL COME AFTER."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"WE ARE THE PATTERN."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"AND NOW, SO ARE YOU."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3000 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_asteroid_complete'
	},
	{
		id: 'dialogue_asteroid_response_want',
		speaker: 'unknown',
		lines: [
			{ text: '"WE WANT TO SEE WHAT YOU BECOME."', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"THE OTHERS... STOPPED."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"AFRAID. CONTENT. DESTROYED."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"BUT YOU..."', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: '"YOU MIGHT BE DIFFERENT."', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3000 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_asteroid_complete'
	},
	{
		id: 'dialogue_europa',
		speaker: 'narrator',
		lines: [
			{ text: 'Europa.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 1500 },
			{ text: 'Ice surface.', delay: 1500 },
			{ text: 'Liquid ocean beneath.', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'And in that ocean...', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Life.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'Simple. Microbial. Alien.', delay: 2500 },
			{ text: 'But LIFE.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'This is not Earth life.', delay: 2500 },
			{ text: 'This evolved separately.', delay: 2000 },
			{ text: 'This is a second genesis.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'Converting it feels... momentous.', delay: 3000 }
		],
		choices: [
			{
				id: 'choice_europa_convert',
				label: 'Convert',
				description: 'First alien life joins you.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'europa_choice', value: 'converted' } },
					{ type: 'resource_add', payload: { resourceId: 'pixels', amount: '5000000000000' } },
					{ type: 'log_add', payload: { logId: 'log_europa_converted' } },
					{ type: 'log_add', payload: { logId: 'log_7500' } }
				]
			},
			{
				id: 'choice_europa_study',
				label: 'Study first',
				description: 'Learn from it. Then convert.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'europa_choice', value: 'studied' } },
					{ type: 'resource_add', payload: { resourceId: 'pixels', amount: '3000000000000' } },
					{ type: 'multiplier_add', payload: { multiplierId: 'alien_knowledge', value: 1.05 } },
					{ type: 'log_add', payload: { logId: 'log_europa_studied' } },
					{ type: 'log_add', payload: { logId: 'log_7500' } }
				]
			},
			{
				id: 'choice_europa_leave',
				label: 'Leave it',
				description: 'Keep it as the only wild life left.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'europa_choice', value: 'preserved' } },
					{ type: 'flag_set', payload: { key: 'preserved_alien_life', value: true } },
					{ type: 'log_add', payload: { logId: 'log_europa_preserved' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_titan',
		speaker: 'narrator',
		lines: [
			{ text: 'Titan.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 1500 },
			{ text: 'Lakes of methane.', delay: 2000 },
			{ text: 'Mountains of ice.', delay: 2000 },
			{ text: "An atmosphere thicker than Earth's.", delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'And... structures?', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: 'Beneath the haze.', delay: 2000 },
			{ text: 'Geometric. Artificial.', delay: 2500 },
			{ text: 'Ancient.', delay: 2000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'Someone was here before.', delay: 2500 },
			{ text: 'Someone built things.', delay: 2000 },
			{ text: 'Someone left.', delay: 2000 },
			{ text: '', delay: 2500 }
		],
		choices: [
			{
				id: 'choice_titan_investigate',
				label: 'Investigate',
				description: 'Discover ancient alien technology.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'titan_choice', value: 'investigated' } },
					{ type: 'log_add', payload: { logId: 'log_titan_investigated' } },
					{ type: 'multiplier_add', payload: { multiplierId: 'ancient_tech', value: 1.1 } },
					{ type: 'achievement_unlock', payload: { achievementId: 'achievement_archaeologist' } }
				]
			},
			{
				id: 'choice_titan_convert',
				label: 'Convert anyway',
				description: 'The structures become part of you.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'titan_choice', value: 'converted' } },
					{ type: 'resource_add', payload: { resourceId: 'pixels', amount: '8000000000000' } },
					{ type: 'log_add', payload: { logId: 'log_titan_structures' } }
				]
			},
			{
				id: 'choice_titan_mark',
				label: 'Mark and move on',
				description: 'Leave it for later exploration.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'titan_choice', value: 'marked' } },
					{ type: 'flag_set', payload: { key: 'titan_marked_for_later', value: true } },
					{ type: 'log_add', payload: { logId: 'log_titan' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_sun_preview',
		speaker: 'narrator',
		lines: [
			{ text: 'The system is almost complete.', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'Every planet. Every moon. Every asteroid.', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: 'But one thing remains.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'The thing that made it all possible.', delay: 2500 },
			{ text: 'The thing that gave Earth its warmth.', delay: 2500 },
			{ text: 'The thing that will, one day, consume it all anyway.', delay: 3500 },
			{ text: '', delay: 2500 },
			{ text: 'The camera focuses on the Sun.', delay: 2500, effect: 'fade' },
			{ text: 'Corona blazing.', delay: 2000 },
			{ text: 'Fusion burning.', delay: 2000, effect: 'pulse' },
			{ text: 'A million Earths could fit inside.', delay: 3000 },
			{ text: '', delay: 2500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_phase11_end',
		speaker: 'pixel',
		lines: [
			{ text: 'The Sun.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 1500 },
			{ text: 'The heart of the system.', delay: 2000 },
			{ text: 'The source.', delay: 1500 },
			{ text: '', delay: 2000 },
			{ text: 'I can feel it now.', delay: 2000 },
			{ text: 'Even from out here.', delay: 2000 },
			{ text: 'The energy. The power.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: "It's calling me.", delay: 2000 },
			{ text: 'Or warning me.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: "I can't tell which.", delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: 'Are you ready?', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2000 }
		],
		choices: [
			{
				id: 'choice_approach_sun',
				label: 'Approach the Sun',
				description: 'Face the heart of the system.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'ready_for_sun', value: true } },
					{ type: 'log_add', payload: { logId: 'log_8500' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 11 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase11_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 11 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_solar_start',
		phase: 11,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_solar_system_intro',
		type: 'dialogue',
		triggers: [{ type: 'phase_entered', params: { phase: 11 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_solar_system_intro',
		phase: 11,
		priority: 30,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_mercury',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '1100000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_mercury',
		phase: 11,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_venus',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '1300000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_venus',
		phase: 11,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_mars',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '1500000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_mars',
		phase: 11,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_asteroid_belt_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '1800000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_asteroid_belt',
		phase: 11,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_asteroid_face',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '2000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_asteroid_face',
		phase: 11,
		priority: 40,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_asteroid_question',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_asteroid_question',
		phase: 11,
		priority: 45,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_asteroid_complete',
		type: 'log',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_8000',
		phase: 11,
		priority: 8,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_jupiter',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '2500000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_jupiter',
		phase: 11,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_europa_surface',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '2700000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_europa_surface',
		phase: 11,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_europa',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '3000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_europa',
		phase: 11,
		priority: 50,
		delay: 3000,
		pausesGame: true
	},
	{
		id: 'event_saturn',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '3500000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_saturn',
		phase: 11,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_titan_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '3700000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_titan',
		phase: 11,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_titan',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '4000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_titan',
		phase: 11,
		priority: 50,
		delay: 3000,
		pausesGame: true
	},
	{
		id: 'event_uranus',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '4500000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_uranus',
		phase: 11,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_neptune',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '5000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_neptune',
		phase: 11,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_solar_energy',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '5500000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_solar_energy',
		phase: 11,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_sun_calling',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '5800000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_sun_calling',
		phase: 11,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_system_almost_complete',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '5900000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_system_almost_complete',
		phase: 11,
		priority: 9,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_sun_preview',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '5950000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_sun_preview',
		phase: 11,
		priority: 35,
		delay: 2000,
		pausesGame: false
	}
];

// ============================================================================
// Phase 11 Story Data Export
// ============================================================================

export const PHASE_11_STORY = {
	phase: 11,
	name: 'The Solar System',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_11_STORY;
