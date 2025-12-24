/**
 * @fileoverview Phase 10: The Moon
 * The first step away from home.
 *
 * @module engine/data/phases/phase-10
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 10: The Moon
 * A moment of quiet. The Moon is barren. Empty.
 */
export const PHASE_10: PhaseDefinition = {
	id: 10,
	key: 'the_moon',
	name: 'The Moon',
	subtitle: 'The first step away from home.',
	description:
		'A moment of quiet. The Moon is barren. Empty. A breath before the cosmic scale.',
	durationMin: 60,
	durationMax: 120,
	visualMode: 'pixel',
	gridConfig: { width: 32, height: 32, cellSize: 10 },
	themeClass: 'phase-moon',
	backgroundColor: '#050505',
	unlockConditions: [Conditions.phase(9, true)],
	transitionConditions: [Conditions.resource(ResourceId.PIXELS, '1e42')],
	autoTransition: false,
	transitionIn: {
		duration: 3000,
		effect: 'zoom',
		cutsceneText: [
			'The Earth shrinks.',
			'The Moon appears.',
			'Still watching. Still orbiting.',
			'Still... waiting.'
		]
	},
	transitionOut: {
		duration: 4000,
		effect: 'cutscene',
		cutsceneText: [
			'The Moon is yours.',
			'Companion of the Earth.',
			'Now companion of pixels.',
			'But the Moon is just a satellite.',
			'There are other worlds.',
			"Mars. Venus. Jupiter's moons.",
			'And at the center of it all...',
			'...the Sun.'
		]
	},
	availableResources: [ResourceId.PIXELS, ResourceId.SOLAR_ENERGY],
	availableProducers: ['lunar_converter', 'solar_collector'],
	availableUpgrades: ['lunar_network', 'space_adaptation'],
	storyEvents: ['log_6500', 'log_6700', 'log_6900', 'apollo_flags', 'moon_core_secret'],
	phaseType: 'standard',
	isBossPhase: false,
	isMeditationPhase: false,
	clickingEnabled: true,
	displayOrder: 10,
	showLocked: true
};
