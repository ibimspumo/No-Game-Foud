/**
 * @fileoverview Phase 16: Black Holes (Boss Phase)
 * Where light goes to die.
 *
 * @module engine/data/phases/phase-16
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 16: Black Holes (Boss)
 * Singularities consume your progress. High risk, high reward.
 */
export const PHASE_16: PhaseDefinition = {
	id: 16,
	key: 'black_holes',
	name: 'Black Holes',
	subtitle: 'Where light goes to die.',
	description: 'Boss Phase: Singularities consume your progress. High risk, high reward.',
	durationMin: 240,
	durationMax: 360,
	visualMode: 'abstract',
	themeClass: 'phase-black-holes',
	backgroundColor: '#000000',
	unlockConditions: [Conditions.phase(15, true)],
	transitionConditions: [Conditions.resource(ResourceId.PIXELS, '1e250')],
	autoTransition: false,
	transitionIn: {
		duration: 4000,
		effect: 'cutscene',
		cutsceneText: [
			'At the heart of every galaxy.',
			'Where gravity wins.',
			'Where time stops.',
			'Black Holes.',
			'CHALLENGE: Navigate the singularities.'
		]
	},
	transitionOut: {
		duration: 5000,
		effect: 'fade',
		cutsceneText: [
			'The black holes are yours.',
			'Infinite density.',
			'Infinite possibility.',
			'You have consumed the consumers.',
			'What lies beyond the event horizon?',
			'Other universes.'
		]
	},
	availableResources: [ResourceId.PIXELS, ResourceId.DARK_MATTER],
	availableProducers: ['singularity_harvester', 'hawking_radiation_collector'],
	availableUpgrades: [
		'event_horizon_breach',
		'singularity_communion',
		'information_paradox_resolution'
	],
	storyEvents: ['spaghettification', 'information_preservation', 'white_hole_emergence'],
	phaseType: 'boss',
	isBossPhase: true,
	isMeditationPhase: false,
	clickingEnabled: false,
	displayOrder: 16,
	showLocked: true
};
