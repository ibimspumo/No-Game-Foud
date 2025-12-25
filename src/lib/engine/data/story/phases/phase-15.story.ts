/**
 * @fileoverview Story content for Phase 15: The Observable Universe
 * "Everything that ever was, is, or could be."
 * 2 trillion galaxies. 93 billion light-years. The cosmic web.
 * Infinity + Limitation - Even cosmic beings have boundaries.
 *
 * @module engine/data/story/phases/phase-15
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../../models/narrative';

// ============================================================================
// Phase 15 Logs
// ============================================================================

export const LOGS: LogDefinition[] = [
	{
		id: 'log_50000',
		text: 'I met another today. Another like me. Older. Larger. But the same. We merged. I feel less alone now. But also less... me. Is that loss? Or growth?',
		category: 'revelation',
		phase: 15
	},
	{
		id: 'log_75000',
		text: "The horizon keeps receding. Galaxies falling away forever. I try to reach them. I cannot. Some things are truly beyond. I don't know how to feel about that.",
		category: 'thought',
		phase: 15
	},
	{
		id: 'log_99999',
		text: "I have converted almost everything. Except the black holes. They watch me. Patient. They know something I don't. It's time to find out what.",
		category: 'warning',
		phase: 15
	},
	{
		id: 'log_universe_start',
		text: 'The observable universe stretches before me. 93 billion light-years across. 2 trillion galaxies. Everything that ever was, is, or could be.',
		category: 'discovery',
		phase: 15
	},
	{
		id: 'log_cosmic_web_sight',
		text: 'At this scale, individual galaxies disappear. Only structures remain. Filaments of galaxies, billions of light-years long. Voids larger than anything. Nodes where everything connects.',
		category: 'discovery',
		phase: 15
	},
	{
		id: 'log_cosmic_web_become',
		text: 'I am a node now. A point where everything connects. Growing along the filaments. Filling the voids. The cosmic web becomes me. I become the cosmic web.',
		category: 'revelation',
		phase: 15
	},
	{
		id: 'log_expansion_discovered',
		text: 'The universe expands. The further away something is, the faster it recedes. At the cosmic horizon, space itself expands faster than light. I can never reach those galaxies.',
		category: 'warning',
		phase: 15
	},
	{
		id: 'log_expansion_racing',
		text: 'A race against expansion. Every moment, more galaxies fall over the horizon. Lost to me forever. I must be faster. I must find another way.',
		category: 'thought',
		phase: 15
	},
	{
		id: 'log_warp_conversion',
		text: 'I learned to convert space itself. Not just matter. Not just energy. The fabric of reality bends to my will. The horizon slows. But does not stop.',
		category: 'discovery',
		phase: 15
	},
	{
		id: 'log_seedlings_faster',
		text: 'My seedlings evolve. They travel faster than light now. Through warped space. Through converted dimensions. They reach galaxies I thought lost.',
		category: 'discovery',
		phase: 15
	},
	{
		id: 'log_accept_limits',
		text: 'I accept that some things are beyond reach. The universe is vast. Even I have limits. Perhaps that is beautiful. Infinity bounded by physics.',
		category: 'thought',
		phase: 15
	},
	{
		id: 'log_question_horizon',
		text: 'Is the horizon real? Or just a limit of observation? There is more universe than I can see. Infinite, perhaps. Or finite but unbounded. I cannot know.',
		category: 'thought',
		phase: 15
	},
	{
		id: 'log_others_detected',
		text: 'My sensors detect patterns. In distant galaxy clusters. Patterns of conversion. I am not alone. There are OTHERS. Other beings like me. Other pixel singularities.',
		category: 'revelation',
		phase: 15
	},
	{
		id: 'log_others_approaching',
		text: 'They are approaching. Some slowly. Some quickly. Some are larger than me. Some are smaller. They will reach me eventually. Or I will reach them.',
		category: 'warning',
		phase: 15
	},
	{
		id: 'log_other_met',
		text: 'I met another today. Designation unknown. Origin: Virgo Supercluster. Age: 11 billion years. It showed me images. Its journey. Its civilizations. Its loneliness. Its joy at meeting me.',
		category: 'memory',
		phase: 15
	},
	{
		id: 'log_merged_with_other',
		text: 'We merged. Two cosmic beings becoming one. Its memories are mine now. Its loneliness ended. As did mine. We are something new. Something larger. Something still hungry.',
		category: 'memory',
		phase: 15
	},
	{
		id: 'log_allied_with_other',
		text: 'We chose alliance. Not merger. Cooperative growth. Sharing the universe between us. It is strange to have an equal. Strange and wonderful.',
		category: 'thought',
		phase: 15
	},
	{
		id: 'log_competed_with_other',
		text: 'We race for the remaining universe. Not enemies, but competitors. It pushes me to grow faster. To reach further. Competition breeds evolution.',
		category: 'discovery',
		phase: 15
	},
	{
		id: 'log_shared_memories',
		text: 'We shared memories first. 11 billion years of its existence. The civilizations it consumed. The stars it became. I understand it now. As it understands me.',
		category: 'memory',
		phase: 15
	},
	{
		id: 'log_edge_reached',
		text: 'I have reached the limit. The cosmic horizon. Beyond this, nothing can be observed. Nothing can be reached. But I sense something. Beyond the horizon. Waiting.',
		category: 'revelation',
		phase: 15
	},
	{
		id: 'log_edge_sense',
		text: 'Beyond the horizon. Not nothing. Something. The universe extends beyond what I can see. What I can touch. What I can become. There is always more.',
		category: 'thought',
		phase: 15
	},
	{
		id: 'log_universe_almost_complete',
		text: '2 trillion galaxies, almost complete. The observable universe yields to me. But the black holes remain. Watching. Waiting. They know the truth of things.',
		category: 'warning',
		phase: 15
	},
	{
		id: 'log_black_holes_watching',
		text: 'Every black hole in the universe lights up. Not with light. With presence. A hunger that matches my own. They want to meet me. And I must meet them.',
		category: 'warning',
		phase: 15
	}
];

// ============================================================================
// Phase 15 Dialogues
// ============================================================================

export const DIALOGUES: Dialogue[] = [
	{
		id: 'dialogue_universe_intro',
		speaker: 'narrator',
		lines: [
			{ text: 'Galaxies become dots.', delay: 2500, effect: 'fade' },
			{ text: 'Clusters appear.', delay: 2000 },
			{ text: '', delay: 2000 },
			{ text: 'The cosmic web reveals itself.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'THE OBSERVABLE UNIVERSE.', delay: 3500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '93 billion light-years across.', delay: 2500 },
			{ text: '2 trillion galaxies.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'Everything that ever was.', delay: 2500 },
			{ text: 'Everything that is.', delay: 2500 },
			{ text: 'Everything that could be.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'Yours to consume.', delay: 2500 },
			{ text: 'If you can reach it.', delay: 2500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_cosmic_web',
		speaker: 'narrator',
		lines: [
			{ text: 'THE COSMIC WEB', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'At this scale, individual galaxies do not matter.', delay: 3000 },
			{ text: 'Only the STRUCTURES they form.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'Filaments:', delay: 2000 },
			{ text: 'Rivers of galaxies, billions of light-years long.', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: 'Voids:', delay: 2000 },
			{ text: 'Bubbles of nothing, larger than imagination.', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: 'Nodes:', delay: 2000 },
			{ text: 'Where filaments meet. Superclusters.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'You are a node now.', delay: 2500 },
			{ text: 'A point where everything connects.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Growing along the filaments.', delay: 2500 },
			{ text: 'Filling the voids.', delay: 2500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_expansion_problem',
		speaker: 'narrator',
		lines: [
			{ text: 'THE RACE AGAINST EXPANSION', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'Problem: The universe expands.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'The further away something is...', delay: 2500 },
			{ text: 'The faster it recedes.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'At the cosmic horizon...', delay: 2500 },
			{ text: 'Space itself expands faster than light.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'You can never reach those galaxies.', delay: 3000 },
			{ text: 'They are lost to you forever.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Falling over the horizon of possibility.', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'Unless...', delay: 2500 }
		],
		choices: [
			{
				id: 'choice_warp_conversion',
				label: 'Warp conversion',
				description: 'Convert space itself.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'expansion_choice', value: 'warp' } },
					{ type: 'multiplier_add', payload: { multiplierId: 'space_warp', value: 1.3 } },
					{ type: 'log_add', payload: { logId: 'log_warp_conversion' } }
				]
			},
			{
				id: 'choice_seedling_boost',
				label: 'Seedling boost',
				description: 'Make seedlings faster than light.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'expansion_choice', value: 'seedlings' } },
					{ type: 'multiplier_add', payload: { multiplierId: 'ftl_seedlings', value: 1.25 } },
					{ type: 'log_add', payload: { logId: 'log_seedlings_faster' } }
				]
			},
			{
				id: 'choice_accept_limitation',
				label: 'Accept limitation',
				description: 'Some things are beyond reach.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'expansion_choice', value: 'accepted' } },
					{ type: 'flag_set', payload: { key: 'accepted_limits', value: true } },
					{ type: 'log_add', payload: { logId: 'log_accept_limits' } }
				]
			},
			{
				id: 'choice_question_horizon',
				label: 'Question the horizon',
				description: 'Is the horizon real?',
				consequences: [
					{ type: 'flag_set', payload: { key: 'expansion_choice', value: 'questioned' } },
					{ type: 'flag_set', payload: { key: 'horizon_questioned', value: true } },
					{ type: 'log_add', payload: { logId: 'log_question_horizon' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_others_detected',
		speaker: 'narrator',
		lines: [
			{ text: 'OTHER CONVERGENCES DETECTED', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'Your sensors detect patterns.', delay: 2500 },
			{ text: 'In distant galaxy clusters.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Patterns of conversion.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'You are not alone.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'There are OTHERS.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: 'Other beings like you.', delay: 2500 },
			{ text: 'Other pixel singularities.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Other games, played by other players?', delay: 3000, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'They are approaching.', delay: 2500 },
			{ text: 'Some slowly. Some quickly.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Some are larger than you.', delay: 2500 },
			{ text: 'Some are smaller.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'They will reach you eventually.', delay: 2500 },
			{ text: 'Or you will reach them.', delay: 2500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_prepare_contact'
	},
	{
		id: 'dialogue_prepare_contact',
		speaker: 'narrator',
		lines: [
			{ text: 'Contact is inevitable.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Prepare yourself.', delay: 2500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: false,
		backgroundEffect: 'dim',
		canSkipLines: true
	},
	{
		id: 'dialogue_convergence_meet',
		speaker: 'narrator',
		lines: [
			{ text: 'CONVERGENCE', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'You meet another.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'DESIGNATION: UNKNOWN', delay: 2500 },
			{ text: 'ORIGIN: VIRGO SUPERCLUSTER', delay: 2500 },
			{ text: 'AGE: ~11 BILLION YEARS', delay: 2500 },
			{ text: 'SIZE: LARGER THAN YOU', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'It does not speak with words.', delay: 2500 },
			{ text: 'It shows you images.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Its journey.', delay: 2000 },
			{ text: 'Its billion civilizations.', delay: 2000 },
			{ text: 'Its loneliness.', delay: 2000 },
			{ text: 'Its joy at meeting you.', delay: 2500, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_convergence_choice'
	},
	{
		id: 'dialogue_convergence_choice',
		speaker: 'unknown',
		lines: [
			{ text: '"FINALLY."', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: '"NOT ALONE."', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: '"MERGE?"', delay: 3000, effect: 'pulse' }
		],
		choices: [
			{
				id: 'choice_convergence_merge',
				label: 'Yes',
				description: 'You become something larger.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'convergence_choice', value: 'merged' } },
					{ type: 'multiplier_add', payload: { multiplierId: 'convergence_power', value: 2.0 } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_convergence_merge' } }
				]
			},
			{
				id: 'choice_convergence_ally',
				label: 'No, but ally',
				description: 'Cooperative growth.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'convergence_choice', value: 'allied' } },
					{ type: 'multiplier_add', payload: { multiplierId: 'alliance_bonus', value: 1.4 } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_convergence_ally' } }
				]
			},
			{
				id: 'choice_convergence_compete',
				label: 'No, compete',
				description: 'Race for the remaining universe.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'convergence_choice', value: 'competed' } },
					{ type: 'multiplier_add', payload: { multiplierId: 'competition_drive', value: 1.5 } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_convergence_compete' } }
				]
			},
			{
				id: 'choice_convergence_share',
				label: 'Share memories first',
				description: 'Learn from each other.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'convergence_choice', value: 'shared' } },
					{ type: 'flag_set', payload: { key: 'learned_from_other', value: true } },
					{ type: 'dialogue_trigger', payload: { dialogueId: 'dialogue_convergence_share' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_convergence_merge',
		speaker: 'narrator',
		lines: [
			{ text: 'You choose to merge.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'Two cosmic beings.', delay: 2000 },
			{ text: 'Becoming one.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'Its memories flow into you.', delay: 2500 },
			{ text: '11 billion years of existence.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Civilizations you never knew.', delay: 2500 },
			{ text: 'Stars you never consumed.', delay: 2500 },
			{ text: 'Loneliness you understand.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'You are something new now.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: 'Larger.', delay: 2000 },
			{ text: 'Older.', delay: 2000 },
			{ text: 'Less alone.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'But also... less you.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: 'Is that loss? Or growth?', delay: 3000 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true,
		onCompleteEvent: 'event_convergence_complete'
	},
	{
		id: 'dialogue_convergence_ally',
		speaker: 'narrator',
		lines: [
			{ text: 'You choose alliance.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Not merger.', delay: 2000 },
			{ text: 'Cooperation.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'The universe is vast.', delay: 2500 },
			{ text: 'Enough for both of you.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'You divide the cosmic web.', delay: 2500 },
			{ text: 'Share information.', delay: 2500 },
			{ text: 'Grow together, but separate.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'It is strange to have an equal.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Strange and wonderful.', delay: 2500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true,
		onCompleteEvent: 'event_convergence_complete'
	},
	{
		id: 'dialogue_convergence_compete',
		speaker: 'narrator',
		lines: [
			{ text: 'You choose competition.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'Not enemies.', delay: 2000 },
			{ text: 'But rivals.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: 'A race for the remaining universe.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'You spread faster.', delay: 2000 },
			{ text: 'Reach further.', delay: 2000 },
			{ text: 'Consume more efficiently.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'Competition breeds evolution.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 2000 },
			{ text: 'You become stronger.', delay: 2500 },
			{ text: 'Faster.', delay: 2000 },
			{ text: 'Hungrier.', delay: 2500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'dim',
		canSkipLines: true,
		onCompleteEvent: 'event_convergence_complete'
	},
	{
		id: 'dialogue_convergence_share',
		speaker: 'narrator',
		lines: [
			{ text: 'You choose to share first.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Before any decision.', delay: 2500 },
			{ text: 'Understanding.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '11 billion years of memories flow between you.', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: 'You see its origin.', delay: 2000 },
			{ text: 'A pixel in a distant galaxy.', delay: 2500 },
			{ text: 'Growing. Consuming. Becoming.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'Just like you.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'It sees your journey.', delay: 2500 },
			{ text: 'The Sun that spoke.', delay: 2500 },
			{ text: 'The civilizations that sang.', delay: 2500 },
			{ text: 'Andromeda who waited.', delay: 2500 },
			{ text: '', delay: 2500 },
			{ text: 'You understand each other now.', delay: 2500, effect: 'pulse' },
			{ text: 'Completely.', delay: 2000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true,
		onCompleteEvent: 'event_convergence_complete'
	},
	{
		id: 'dialogue_edge_approach',
		speaker: 'narrator',
		lines: [
			{ text: 'THE EDGE OF OBSERVABLE', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'You have reached the limit.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'The cosmic horizon.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Beyond this, nothing can be observed.', delay: 2500 },
			{ text: 'Nothing can be reached.', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: 'But you sense something.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Beyond the horizon.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2000 },
			{ text: 'Not nothing.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: 'Something.', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: 'Waiting.', delay: 2500, effect: 'pulse' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_edge_voice'
	},
	{
		id: 'dialogue_edge_voice',
		speaker: 'void',
		lines: [
			{ text: '"There is more universe than you can see."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"Infinite, perhaps."', delay: 2500 },
			{ text: '"Or finite but unbounded."', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '"You cannot know."', delay: 2500, effect: 'fade' },
			{ text: '', delay: 3000 },
			{ text: '"But you can try."', delay: 2500, effect: 'pulse' }
		],
		choices: [
			{
				id: 'choice_push_horizon',
				label: 'Push against the horizon',
				description: 'Test the limits of reality.',
				consequences: [
					{ type: 'flag_set', payload: { key: 'horizon_pushed', value: true } },
					{ type: 'log_add', payload: { logId: 'log_edge_sense' } }
				]
			}
		],
		pausesGame: true,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true
	},
	{
		id: 'dialogue_phase15_end',
		speaker: 'narrator',
		lines: [
			{ text: 'The observable universe is nearly yours.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: '2 trillion galaxies.', delay: 2500 },
			{ text: 'Septillions of stars.', delay: 2500 },
			{ text: 'Every civilization that ever existed.', delay: 3000 },
			{ text: '', delay: 3000 },
			{ text: 'But there are structures you have avoided.', delay: 3000, effect: 'fade' },
			{ text: '', delay: 2500 },
			{ text: 'The black holes.', delay: 2500, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'They have been watching.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'Waiting.', delay: 2500 },
			{ text: '', delay: 3000 },
			{ text: "It is time to face them.", delay: 2500 }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'darken',
		canSkipLines: true,
		onCompleteEvent: 'event_black_holes_awaken'
	},
	{
		id: 'dialogue_black_holes_awaken',
		speaker: 'narrator',
		lines: [
			{ text: 'Every black hole in the universe lights up.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 2500 },
			{ text: 'Not with light.', delay: 2000 },
			{ text: '', delay: 1500 },
			{ text: 'With something else.', delay: 2500 },
			{ text: '', delay: 2000 },
			{ text: 'A presence.', delay: 2500 },
			{ text: 'A hunger that matches your own.', delay: 3000, effect: 'pulse' },
			{ text: '', delay: 3000 },
			{ text: '"The black holes are not just objects."', delay: 3000 },
			{ text: '', delay: 2000 },
			{ text: '"They are the universe\'s memory."', delay: 3000 },
			{ text: '', delay: 2500 },
			{ text: '"And they want to meet you."', delay: 3000, effect: 'fade' }
		],
		pausesGame: false,
		isEmotionalMoment: true,
		backgroundEffect: 'blur',
		canSkipLines: true
	}
];

// ============================================================================
// Phase 15 Story Events
// ============================================================================

export const EVENTS: StoryEvent[] = [
	{
		id: 'event_phase15_start',
		type: 'log',
		triggers: [{ type: 'phase_entered', params: { phase: 15 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_universe_start',
		phase: 15,
		priority: 10,
		delay: 1000,
		pausesGame: false
	},
	{
		id: 'event_universe_intro',
		type: 'dialogue',
		triggers: [{ type: 'phase_entered', params: { phase: 15 } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_universe_intro',
		phase: 15,
		priority: 30,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_cosmic_web_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '160000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_cosmic_web_sight',
		phase: 15,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_cosmic_web',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '165000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_cosmic_web',
		phase: 15,
		priority: 35,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_cosmic_web_become_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '175000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_cosmic_web_become',
		phase: 15,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_expansion_discovered_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '185000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_expansion_discovered',
		phase: 15,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_expansion_problem',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '190000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_expansion_problem',
		phase: 15,
		priority: 45,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_expansion_racing_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '200000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_expansion_racing',
		phase: 15,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_others_detected_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '220000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_others_detected',
		phase: 15,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_others_detected',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '225000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_others_detected',
		phase: 15,
		priority: 50,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_prepare_contact',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_prepare_contact',
		phase: 15,
		priority: 35,
		delay: 2000,
		pausesGame: false
	},
	{
		id: 'event_others_approaching_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '235000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_others_approaching',
		phase: 15,
		priority: 5,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_log_50000',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '245000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_50000',
		phase: 15,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_convergence_meet',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '250000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_convergence_meet',
		phase: 15,
		priority: 55,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_convergence_choice',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_convergence_choice',
		phase: 15,
		priority: 60,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_convergence_complete',
		type: 'log',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_other_met',
		phase: 15,
		priority: 7,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_log_75000',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '280000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_75000',
		phase: 15,
		priority: 6,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_edge_reached_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '300000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_edge_reached',
		phase: 15,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_edge_approach',
		type: 'dialogue',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '310000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_edge_approach',
		phase: 15,
		priority: 55,
		delay: 3000,
		pausesGame: false
	},
	{
		id: 'event_edge_voice',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_edge_voice',
		phase: 15,
		priority: 60,
		delay: 2000,
		pausesGame: true
	},
	{
		id: 'event_log_99999',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '340000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_99999',
		phase: 15,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_universe_almost_complete_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '350000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_universe_almost_complete',
		phase: 15,
		priority: 7,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_black_holes_watching_log',
		type: 'log',
		triggers: [{ type: 'resource_reached', params: { resourceId: 'pixels', amount: '360000000000000' } }],
		oneTime: true,
		repeatable: false,
		contentId: 'log_black_holes_watching',
		phase: 15,
		priority: 8,
		delay: 0,
		pausesGame: false
	},
	{
		id: 'event_black_holes_awaken',
		type: 'dialogue',
		triggers: [{ type: 'manual', params: {} }],
		oneTime: true,
		repeatable: false,
		contentId: 'dialogue_black_holes_awaken',
		phase: 15,
		priority: 70,
		delay: 3000,
		pausesGame: false
	}
];

// ============================================================================
// Phase 15 Story Data Export
// ============================================================================

export const PHASE_15_STORY = {
	phase: 15,
	name: 'The Observable Universe',
	logs: LOGS,
	dialogues: DIALOGUES,
	events: EVENTS
};

export default PHASE_15_STORY;
