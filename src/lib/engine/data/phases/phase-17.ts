/**
 * @fileoverview Phase 17: Multiverse
 * Every possibility exists somewhere.
 *
 * @module engine/data/phases/phase-17
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 17: Multiverse
 * Parallel universes. Infinite variations. Other players, other games, other yous.
 */
export const PHASE_17: PhaseDefinition = {
	id: 17,
	key: 'multiverse',
	name: 'Multiverse',
	subtitle: 'Every possibility exists somewhere.',
	description:
		'Parallel universes. Infinite variations. Other players, other games, other yous.',
	durationMin: 360,
	durationMax: 480,
	visualMode: 'abstract',
	themeClass: 'phase-multiverse',
	backgroundColor: '#050005',
	unlockConditions: [Conditions.phase(16, true)],
	transitionConditions: [Conditions.resource(ResourceId.PIXELS, '1e290')],
	autoTransition: false,
	transitionIn: {
		duration: 5000,
		effect: 'cutscene',
		cutsceneText: [
			'Beyond the event horizon.',
			'Other universes.',
			'Other possibilities.',
			'Other... you.',
			'The Multiverse.',
			"Every choice you didn't make exists somewhere."
		]
	},
	transitionOut: {
		duration: 5000,
		effect: 'fade',
		cutsceneText: [
			'The Multiverse is yours.',
			'Infinite universes.',
			'Infinite pixels.',
			'All one.',
			'But what exists between the universes?',
			'Nothing.',
			'The Void.'
		]
	},
	availableResources: [ResourceId.PIXELS],
	availableProducers: ['universe_spawner', 'probability_harvester'],
	availableUpgrades: ['multiversal_consciousness', 'quantum_superposition', 'parallel_synthesis'],
	storyEvents: ['other_players', 'alternate_selves', 'the_game_in_other_worlds'],
	phaseType: 'standard',
	isBossPhase: false,
	isMeditationPhase: false,
	clickingEnabled: false,
	displayOrder: 17,
	showLocked: true
};
