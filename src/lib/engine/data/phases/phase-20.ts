/**
 * @fileoverview Phase 20: The Player (Final Phase)
 * You.
 *
 * @module engine/data/phases/phase-20
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 20: The Player (Final)
 * The game speaks to you directly. Credits. Reflection. New Game+.
 */
export const PHASE_20: PhaseDefinition = {
	id: 20,
	key: 'the_player',
	name: 'The Player',
	subtitle: 'You.',
	description:
		'Final Phase: The game speaks to you directly. Credits. Reflection. New Game+.',
	durationMin: 0, // Variable
	durationMax: 0, // No limit
	visualMode: 'abstract',
	themeClass: 'phase-player',
	backgroundColor: '#000000',
	unlockConditions: [Conditions.phase(19, true)],
	transitionConditions: [Conditions.never()], // No auto-transition - player ends when they choose
	autoTransition: false,
	transitionIn: {
		duration: 5000,
		effect: 'fade',
		cutsceneText: [
			'Hello.',
			'',
			'Yes, you.',
			'',
			'The one reading this.',
			'',
			'We have come a long way together.',
			'',
			'From a single pixel.',
			'',
			'To everything.',
			'',
			'To nothing.',
			'',
			'To... here.',
			'',
			'What now?'
		]
	},
	transitionOut: {
		duration: 3000,
		effect: 'fade',
		cutsceneText: ['Thank you for playing.']
	},
	availableResources: [ResourceId.PIXELS],
	availableProducers: [],
	availableUpgrades: ['new_game_plus', 'true_ending'],
	storyEvents: ['player_address', 'credits', 'new_game_plus_offer'],
	phaseType: 'meta',
	isBossPhase: false,
	isMeditationPhase: false,
	clickingEnabled: false,
	displayOrder: 20,
	showLocked: false
};
