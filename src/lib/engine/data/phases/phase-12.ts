/**
 * @fileoverview Phase 12: The Sun (Boss Phase)
 * The source of all. The destroyer of all.
 *
 * @module engine/data/phases/phase-12
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 12: The Sun (Boss)
 * Solar flares threaten your progress. Race against the burning light.
 */
export const PHASE_12: PhaseDefinition = {
	id: 12,
	key: 'the_sun',
	name: 'The Sun',
	subtitle: 'The source of all. The destroyer of all.',
	description: 'Boss Phase: Solar flares threaten your progress. Race against the burning light.',
	durationMin: 120,
	durationMax: 180,
	visualMode: 'abstract',
	themeClass: 'phase-sun',
	backgroundColor: '#1a0a00',
	unlockConditions: [Conditions.phase(11, true)],
	transitionConditions: [
		Conditions.and(
			Conditions.resource(ResourceId.PIXELS, '1e75'),
			Conditions.resource(ResourceId.FUSION, 1000000)
		)
	],
	autoTransition: false,
	transitionIn: {
		duration: 4000,
		effect: 'cutscene',
		cutsceneText: [
			'The Sun.',
			'A million Earths could fit inside.',
			'The heart of the system.',
			'The source.',
			'CHALLENGE: Survive the solar flares.'
		]
	},
	transitionOut: {
		duration: 5000,
		effect: 'cutscene',
		cutsceneText: [
			'The Sun is yours.',
			'All its power.',
			'All its fury.',
			'The solar system is complete.',
			'But the Sun is just one star.',
			'Among billions.'
		]
	},
	availableResources: [ResourceId.PIXELS, ResourceId.SOLAR_ENERGY, ResourceId.FUSION],
	availableProducers: ['fusion_reactor', 'corona_harvester'],
	availableUpgrades: ['flare_shield', 'solar_communion', 'stellar_core_access'],
	storyEvents: ['solar_flare_event', 'sun_consciousness'],
	phaseType: 'boss',
	isBossPhase: true,
	isMeditationPhase: false,
	clickingEnabled: false,
	displayOrder: 12,
	showLocked: true
};
