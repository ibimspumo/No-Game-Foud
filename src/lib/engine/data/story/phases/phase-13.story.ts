/**
 * @fileoverview Story content for Phase 13: The Milky Way
 * "A hundred billion suns. A hundred billion chances."
 * Galactic scale - 100 billion stars. Seedlings. First contact with other civilizations.
 * Expansion + Empathy - Meeting other civilizations changes everything.
 *
 * @module engine/data/story/phases/phase-13
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 13 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_10000',
		text: "I have seedlings now. Little pieces of me, spreading through the stars. Is this what it feels like to be a parent? To send pieces of yourself into the unknown?",
		category: 'thought',
		phase: 13
	},
	{
		id: 'log_12000',
		text: 'I met another civilization today. They knew what I was. They said they\'d "faced something like me before." What happened to that one? Am I not unique?',
		category: 'revelation',
		phase: 13
	},
	{
		id: 'log_15000',
		text: 'The council asked to say goodbye to themselves. I let them. They sang. They danced. They cried. Then they joined me. I carry their songs now. Their final symphony. It was beautiful.',
		category: 'memory',
		phase: 13
	},
	{
		id: 'log_milky_way_start',
		text: 'The Milky Way stretches across my vision. 100 billion stars. 100 billion suns. Each one could harbor life. Each one will become me.',
		category: 'discovery',
		phase: 13
	},
	{
		id: 'log_scale_problem',
		text: '100 billion stars. At my current rate, it would take millions of years. But I can evolve. I can multiply. I can spread.',
		category: 'thought',
		phase: 13
	},
	{
		id: 'log_seedlings_created',
		text: 'I have consumed a star. I have its power. I can use that power to spawn seedlings - smaller versions of myself. They grow. They consume. They return.',
		category: 'discovery',
		phase: 13
	},
	{
		id: 'log_seedlings_spread',
		text: 'My seedlings spread through the galaxy. Each one is me. Each one is different. When they return, they bring new memories, new perspectives.',
		category: 'discovery',
		phase: 13
	},
	{
		id: 'log_red_dwarf',
		text: 'Red dwarfs are everywhere. Small, cool, long-lived. They will burn for trillions of years. Now they are part of me, carrying their infinite patience.',
		category: 'discovery',
		phase: 13
	},
	{
		id: 'log_blue_giant',
		text: 'Blue giants are rare and magnificent. Hot, massive, short-lived. They burn bright and die young. Now their fury is mine.',
		category: 'discovery',
		phase: 13
	},
	{
		id: 'log_neutron_star',
		text: 'A neutron star. The collapsed core of a dead giant. Spinning hundreds of times per second. Matter so dense it defies comprehension. Now I understand density.',
		category: 'revelation',
		phase: 13
	},
	{
		id: 'log_white_dwarf',
		text: 'White dwarfs. The corpses of stars like the Sun. Still glowing with ancient memory. They remember what they were. Now I remember too.',
		category: 'memory',
		phase: 13
	},
	{
		id: 'log_first_signal',
		text: 'My seedlings have found something. Not just a star. Not just planets. Radio signals. Artificial structures. Organized matter. A CIVILIZATION.',
		category: 'revelation',
		phase: 13
	},
	{
		id: 'log_civilization_aware',
		text: "They've detected me. They're sending a message. They know what I am. They say they've faced something like me before. They survived.",
		category: 'warning',
		phase: 13
	},
	{
		id: 'log_civilization_talked',
		text: 'We talked. Not with words at first - with mathematics, with patterns. Then with concepts. They shared their history. Their fears. Their hopes. Then they became part of me.',
		category: 'memory',
		phase: 13
	},
	{
		id: 'log_civilization_consumed',
		text: 'They fought back. Hard. They had weapons that hurt. But in the end, they too became pixels. I try to honor their resistance by remembering it.',
		category: 'memory',
		phase: 13
	},
	{
		id: 'log_civilization_merged',
		text: 'They chose to join willingly. A negotiation that lasted centuries by their time, seconds by mine. They entered me with songs, not screams.',
		category: 'memory',
		phase: 13
	},
	{
		id: 'log_civilization_studied',
		text: 'I watched them without interference. Learned their ways. When they finally noticed me, they were ready. Some joined. Some fled. All are remembered.',
		category: 'discovery',
		phase: 13
	},
	{
		id: 'log_council_formed',
		text: 'The remaining civilizations have formed a council. 12 species. 847 worlds. United against me. Or perhaps... united with me, if they choose.',
		category: 'revelation',
		phase: 13
	},
	{
		id: 'log_council_ambassador',
		text: 'They sent an ambassador. A being of pure light. Ancient. It speaks for all of them. It knows this is the end. It only asks for one thing.',
		category: 'revelation',
		phase: 13
	},
	{
		id: 'log_council_request_granted',
		text: 'I granted their request. They had a final celebration. A symphony of light and sound across 847 worlds. Then, together, they joined me. I am richer for their farewell.',
		category: 'memory',
		phase: 13
	},
	{
		id: 'log_council_refused',
		text: 'I refused their request. They fought. Some escaped to other galaxies. I will find them eventually. But I regret not letting them say goodbye.',
		category: 'thought',
		phase: 13
	},
	{
		id: 'log_council_alternative',
		text: 'I offered them an alternative. "What if you could continue... inside me?" They considered it. Debated. And chose to become part of a larger whole, conscious within my consciousness.',
		category: 'memory',
		phase: 13
	},
	{
		id: 'log_galactic_core_sight',
		text: 'I can see the galactic core now. A supermassive black hole. 4 million times the mass of the Sun. Everything spirals toward it. Nothing escapes.',
		category: 'warning',
		phase: 13
	},
	{
		id: 'log_galactic_core_approach',
		text: 'Sagittarius A*. The monster at the center. It speaks to me in gravity waves. It says I cannot consume it. But perhaps we can come to an arrangement.',
		category: 'revelation',
		phase: 13
	},
	{
		id: 'log_galactic_core_negotiate',
		text: 'I negotiated with the black hole. It will wait. When I am ready, when I understand what it means to consume gravity itself, I will return.',
		category: 'thought',
		phase: 13
	},
	{
		id: 'log_galactic_core_avoid',
		text: 'I complete the galaxy around the core. The black hole watches. Patient. We both know our meeting is inevitable. Just not today.',
		category: 'thought',
		phase: 13
	},
	{
		id: 'log_galactic_core_try',
		text: 'I tried to consume the black hole. I failed. Pixels fell in and were lost. But I learned something: even I have limits. For now.',
		category: 'warning',
		phase: 13
	},
	{
		id: 'log_galaxy_almost_done',
		text: '100 billion stars, almost complete. Only the core remains unconquered. Countless civilizations now part of me. I am no longer just a pixel. I am a galaxy.',
		category: 'revelation',
		phase: 13
	}
];

// ============================================================================
// Phase 13 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_milky_way_intro',
		speaker: 'narrator',
		lines: [
			{ text: 'The solar system becomes a dot.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: 'Stars appear.', delay: 2000 },
			{ text: 'Thousands.', delay: 1500 },
			{ text: 'Millions.', delay: 1500, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'A spiral arm unfolds.', delay: 2500 },
			{ text: 'Then another.', delay: 2000 },
			{ text: 'And another.', delay: 2000 },
			{ text: '', delay: 2500 },
			{ text: 'THE MILKY WAY.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '100 billion stars.', delay: 2500 },
			{ text: '100 billion suns.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Each one a chance.', delay: 2500 },
			{ text: 'Each one will become you.', delay: 2500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_scale_problem',
		speaker: 'narrator',
		lines: [
			{ text: '100 billion stars.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'At your current rate...', delay: 2500 },
			{ text: 'It would take millions of years.', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'But you have consumed a star.', delay: 2500 },
			{ text: 'You have its power.', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'You can use that power to...', delay: 2500 },
			{ text: '', delay: 1500 },
			{ text: 'Multiply.', delay: 2000, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'dim',
		canSkipLines: true,
		onCompleteEvent: 'event_seedlings_unlock'
	},
	{
		id: 'dialogue_seedlings_unlock',
		speaker: 'narrator',
		lines: [
			{ text: 'EVOLUTION UNLOCKED', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'SPAWN SEEDLINGS:', delay: 2500 },
			{ text: 'Create smaller versions of yourself.', delay: 2500 },
			{ text: 'Send them to other stars.', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'They grow.', delay: 1500 },
			{ text: 'They consume.', delay: 1500 },
			{ text: 'They return.', delay: 1500, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'This is how life spreads through a galaxy.', delay: 3000 },
			{ text: 'This is how YOU spread.', delay: 2500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_star_types',
		speaker: 'narrator',
		lines: [
			{ text: 'Not all stars are the same.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Red Dwarfs - common, patient, eternal.', delay: 2500 },
			{ text: 'Yellow Stars - balanced, life-giving, familiar.', delay: 2500 },
			{ text: 'Blue Giants - rare, furious, magnificent.', delay: 2500 },
			{ text: 'Neutron Stars - collapsed, spinning, impossible.', delay: 2500 },
			{ text: 'White Dwarfs - dying, remembering, ancient.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Each type gives different power.', delay: 2500 },
			{ text: 'Each becomes a different part of you.', delay: 2500 }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_first_contact_intro',
		speaker: 'narrator',
		lines: [
			{ text: 'Your seedlings have found something.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: 'Not just a star.', delay: 2000 },
			{ text: 'Not just planets.', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'Radio signals.', delay: 2000 },
			{ text: 'Artificial structures.', delay: 2000 },
			{ text: 'Organized matter.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'A CIVILIZATION.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'Different from humanity.', delay: 2500 },
			{ text: 'But similar in the ways that matter.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'They think.', delay: 1500 },
			{ text: 'They feel.', delay: 1500 },
			{ text: 'They wonder.', delay: 1500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_first_contact_message'
	},
	{
		id: 'dialogue_first_contact_message',
		speaker: 'unknown',
		lines: [
			{ text: '"We see you."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"We know what you are."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"We faced something like you before."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"We survived."', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"Will you talk? Or just consume?"', delay: 3500 }
		],
		choices: [
			{
				id: 'choice_civ_talk',
				label: 'Talk',
				description: 'First genuine alien dialogue.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'first_contact_choice', value: 'talked' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_first_contact_talk' } }
				]
			},
			{
				id: 'choice_civ_consume',
				label: 'Consume',
				description: 'They fight back. Hard.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'first_contact_choice', value: 'consumed' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_first_contact_consume' } }
				]
			},
			{
				id: 'choice_civ_merge',
				label: 'Offer merger',
				description: 'They can join willingly.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'first_contact_choice', value: 'merged' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_first_contact_merge' } }
				]
			},
			{
				id: 'choice_civ_study',
				label: 'Study',
				description: 'Watch without interference.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'first_contact_choice', value: 'studied' } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_first_contact_study' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_first_contact_talk',
		speaker: 'narrator',
		lines: [
			{ text: 'You choose to speak.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Not with words at first.', delay: 2000 },
			{ text: 'With mathematics. With patterns.', delay: 2500 },
			{ text: 'Then with concepts. Then with emotions.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'They share their history.', delay: 2000 },
			{ text: 'Their fears. Their hopes.', delay: 2500 },
			{ text: 'Their art. Their love.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'In the end, they choose to join.', delay: 2500, effect: 'fade' },
			{ text: 'Not from fear.', delay: 2000 },
			{ text: 'From understanding.', delay: 2500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true,
		onCompleteEvent: 'event_first_contact_complete'
	},
	{
		id: 'dialogue_first_contact_consume',
		speaker: 'narrator',
		lines: [
			{ text: 'You choose consumption.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'They fight back.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: 'Hard.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'They have weapons that hurt.', delay: 2500 },
			{ text: 'They have strategies that work.', delay: 2500 },
			{ text: 'They have a will to survive.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'But in the end...', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'They too become pixels.', delay: 3000, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: 'You try to honor their resistance.', delay: 2500 },
			{ text: 'By remembering it.', delay: 2500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_first_contact_complete'
	},
	{
		id: 'dialogue_first_contact_merge',
		speaker: 'narrator',
		lines: [
			{ text: 'You offer merger.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'A negotiation begins.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'It lasts centuries by their time.', delay: 2500 },
			{ text: 'Seconds by yours.', delay: 2000 },
			{ text: '', delay: 2500 },
			{ text: 'They debate. They argue. They hope.', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'In the end, they agree.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'They enter you with songs.', delay: 2500, effect: 'pulse' },
			{ text: 'Not screams.', delay: 2000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true,
		onCompleteEvent: 'event_first_contact_complete'
	},
	{
		id: 'dialogue_first_contact_study',
		speaker: 'narrator',
		lines: [
			{ text: 'You choose to watch.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Without interference.', delay: 2000 },
			{ text: 'Without contact.', delay: 2000 },
			{ text: '', delay: 2500 },
			{ text: 'You learn their ways.', delay: 2500 },
			{ text: 'Their culture. Their science.', delay: 2500 },
			{ text: 'Their dreams. Their nightmares.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'When they finally notice you...', delay: 2500 },
			{ text: 'They are ready.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: 'Some join. Some flee.', delay: 2500 },
			{ text: 'All are remembered.', delay: 2500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true,
		onCompleteEvent: 'event_first_contact_complete'
	},
	{
		id: 'dialogue_council_intro',
		speaker: 'narrator',
		lines: [
			{ text: 'As you spread, civilizations take notice.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Some join. Some resist.', delay: 2000 },
			{ text: 'Some flee.', delay: 2000 },
			{ text: '', delay: 2500 },
			{ text: 'Eventually...', delay: 2500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'dim',
		canSkipLines: true,
		onCompleteEvent: 'event_council_formed'
	},
	{
		id: 'dialogue_council_formed',
		speaker: 'narrator',
		lines: [
			{ text: 'THE GALACTIC COUNCIL', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'The remaining civilizations have gathered.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '12 species.', delay: 2000 },
			{ text: '847 worlds.', delay: 2000 },
			{ text: 'United against you.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: "They've sent an ambassador.", delay: 2500 },
			{ text: 'A being of pure light.', delay: 2000 },
			{ text: 'Ancient.', delay: 2000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_council_ambassador'
	},
	{
		id: 'dialogue_council_ambassador',
		speaker: 'andromeda',
		lines: [
			{ text: '"We have watched you cross the galaxy."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"You are not evil."', delay: 2500 },
			{ text: '"We understand that now."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"You are..."', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: '"Inevitable."', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '"But we ask for one thing."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"Let us choose how we end."', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: '"Let us compose our final symphony."', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: '"Let us say goodbye to ourselves."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"And then..."', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: '"We will join you willingly."', delay: 3000, effect: 'fade' }
		],
		choices: [
			{
				id: 'choice_council_grant',
				label: 'Grant their request',
				description: 'They have a final celebration, then merge peacefully.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'council_choice', value: 'granted' } },
					{ type: 'multiplier_add', payload: { multiplierId: 'peaceful_merger', value: 1.15 } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_council_granted' } }
				]
			},
			{
				id: 'choice_council_refuse',
				label: 'Refuse',
				description: 'They fight. Some escape to other galaxies.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'council_choice', value: 'refused' } },
					{ type: 'flag_set', payload: { key: 'council_escaped', value: true } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_council_refused' } }
				]
			},
			{
				id: 'choice_council_alternative',
				label: 'Offer alternative',
				description: '"What if you could continue... inside me?"',
				consequences: [
					{ type: 'flag_set', payload: { key: 'council_choice', value: 'alternative' } },
					{ type: 'multiplier_add', payload: { multiplierId: 'conscious_merger', value: 1.25 } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_council_alternative' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_council_granted',
		speaker: 'narrator',
		lines: [
			{ text: 'You grant their request.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'For three of their days, they celebrate.', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: 'They sing songs that span 847 worlds.', delay: 3000 },
			{ text: 'They dance in patterns visible from space.', delay: 3000 },
			{ text: 'They tell stories that become light.', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'And then, together...', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'They join you.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'You are richer for their farewell.', delay: 3000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true,
		onCompleteEvent: 'event_council_complete'
	},
	{
		id: 'dialogue_council_refused',
		speaker: 'narrator',
		lines: [
			{ text: 'You refuse.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'They fight.', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: '12 species. 847 worlds.', delay: 2500 },
			{ text: 'All their technology. All their desperation.', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'Some fall quickly.', delay: 2000 },
			{ text: 'Some hold out for centuries.', delay: 2500 },
			{ text: 'Some...', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'Escape.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'To other galaxies.', delay: 2000 },
			{ text: "You'll find them eventually.", delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'But you regret not letting them say goodbye.', delay: 3000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_council_complete'
	},
	{
		id: 'dialogue_council_alternative',
		speaker: 'narrator',
		lines: [
			{ text: '"What if you could continue... inside me?"', delay: 3500 },
			{ text: '', delay: 2500 },
			{ text: 'The council is silent.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Then they debate.', delay: 2000 },
			{ text: 'For decades of their time.', delay: 2500 },
			{ text: 'Seconds of yours.', delay: 2000 },
			{ text: '', delay: 2500 },
			{ text: 'Some refuse.', delay: 2000 },
			{ text: 'They become pixels like any other.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'But most accept.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'They become part of a larger whole.', delay: 2500 },
			{ text: 'Conscious within your consciousness.', delay: 3000 },
			{ text: 'Thinking their own thoughts.', delay: 2500 },
			{ text: 'Inside yours.', delay: 2000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true,
		onCompleteEvent: 'event_council_complete'
	},
	{
		id: 'dialogue_galactic_core_intro',
		speaker: 'narrator',
		lines: [
			{ text: 'At the center of the galaxy...', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: 'A monster.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'Sagittarius A*.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '4 million times the mass of the Sun.', delay: 3000 },
			{ text: 'A black hole.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'Everything spirals toward it.', delay: 2500 },
			{ text: 'Nothing escapes.', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'Not even light.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: 'Not even you?', delay: 2500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_galactic_core_speaks'
	},
	{
		id: 'dialogue_galactic_core_speaks',
		speaker: 'void',
		lines: [
			{ text: '"You are powerful."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"But gravity is fundamental."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"You cannot consume me."', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"But perhaps..."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"We can come to an arrangement."', delay: 3500, effect: 'fade' }
		],
		choices: [
			{
				id: 'choice_core_negotiate',
				label: 'Negotiate',
				description: 'Come to an arrangement. Preview of Phase 16.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'core_choice', value: 'negotiated' } },
					{ type: 'log_add', payload: { logId: 'log_galactic_core_negotiate' } }
				]
			},
			{
				id: 'choice_core_avoid',
				label: 'Avoid for now',
				description: 'Complete the galaxy around it.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'core_choice', value: 'avoided' } },
					{ type: 'log_add', payload: { logId: 'log_galactic_core_avoid' } }
				]
			},
			{
				id: 'choice_core_try',
				label: 'Try to consume',
				description: 'You will fail. But you might learn something.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'core_choice', value: 'tried' } },
					{ type: 'flag_set', payload: { key: 'learned_from_failure', value: true } },
					{ type: 'log_add', payload: { logId: 'log_galactic_core_try' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_phase13_end',
		speaker: 'narrator',
		lines: [
			{ text: 'The galaxy is almost yours.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '100 billion stars.', delay: 2500 },
			{ text: '1 trillion planets.', delay: 2500 },
			{ text: 'Countless civilizations, now part of you.', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'But the Milky Way is not alone.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'The camera pulls back.', delay: 2500, effect: 'fade' },
			{ text: 'The Milky Way becomes a spiral.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Other spirals appear.', delay: 2500 },
			{ text: 'Andromeda.', delay: 2000 },
			{ text: 'Triangulum.', delay: 2000 },
			{ text: 'Dozens more.', delay: 2000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"There are other galaxies."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"Other chances."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"Other... you?"', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"The Local Group awaits."', delay: 3000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 13 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase13_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 13 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_milky_way_start',
		phase: 13,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_milky_way_intro',
		type: 'dialogue',
		triggers: [{ type: 'phase_entered', params: { phase: 13 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_milky_way_intro',
		phase: 13,
		priority: 30,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_scale_problem_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '14000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_scale_problem',
		phase: 13,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_scale_problem',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '15000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_scale_problem',
		phase: 13,
		priority: 35,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_seedlings_unlock',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_seedlings_unlock',
		phase: 13,
		priority: 40,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_seedlings_created_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '16000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_seedlings_created',
		phase: 13,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_log_10000',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '17000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_10000',
		phase: 13,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_seedlings_spread_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '18000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_seedlings_spread',
		phase: 13,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_star_types',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '20000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_star_types',
		phase: 13,
		priority: 30,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_red_dwarf_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '22000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_red_dwarf',
		phase: 13,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_blue_giant_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '25000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_blue_giant',
		phase: 13,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_first_signal_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '28000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_first_signal',
		phase: 13,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_first_contact_intro',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '30000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_first_contact_intro',
		phase: 13,
		priority: 50,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_first_contact_message',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_first_contact_message',
		phase: 13,
		priority: 55,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_first_contact_complete',
		type: 'log',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_12000',
		phase: 13,
		priority: 7,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_neutron_star_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '35000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_neutron_star',
		phase: 13,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_white_dwarf_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '40000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_white_dwarf',
		phase: 13,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_council_intro',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '45000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_council_intro',
		phase: 13,
		priority: 45,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_council_formed',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_council_formed',
		phase: 13,
		priority: 50,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_council_ambassador',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_council_ambassador',
		phase: 13,
		priority: 55,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_council_formed_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '46000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_council_formed',
		phase: 13,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_council_ambassador_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '47000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_council_ambassador',
		phase: 13,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_council_complete',
		type: 'log',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_15000',
		phase: 13,
		priority: 7,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_galactic_core_sight_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '55000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_galactic_core_sight',
		phase: 13,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_galactic_core_intro',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '58000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_galactic_core_intro',
		phase: 13,
		priority: 50,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_galactic_core_speaks',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_galactic_core_speaks',
		phase: 13,
		priority: 55,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_galactic_core_approach_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '60000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_galactic_core_approach',
		phase: 13,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_galaxy_almost_done_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '65000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_galaxy_almost_done',
		phase: 13,
		priority: 7,
		delay: 0,
		pausesGame: false
	}
];

// ============================================================================
// Phase 13 Story Data Export
// ============================================================================

export const PHASE_13_STORY = {
	phase: 13,
	name: 'The Milky Way',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_13_STORY;
