/**
 * @fileoverview Phase 11: Solar System
 * There are other worlds than these.
 *
 * @module engine/data/phases/phase-11
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 11: Solar System
 * The full solar system. The visual mode shifts to abstract.
 */
export const PHASE_11: PhaseDefinition = {
	id: 11,
	key: 'solar_system',
	name: 'Solar System',
	subtitle: 'There are other worlds than these.',
	description:
		'The full solar system. Eight planets. Dozens of moons. The visual mode shifts to abstract.',
	durationMin: 240,
	durationMax: 360,
	visualMode: 'abstract',
	themeClass: 'phase-solar-system',
	backgroundColor: '#000000',
	unlockConditions: [Conditions.phase(10, true)],
	transitionConditions: [
		Conditions.and(
			Conditions.resource(ResourceId.PIXELS, '1e60'),
			Conditions.resource(ResourceId.SOLAR_ENERGY, 100000)
		)
	],
	autoTransition: false,
	transitionIn: {
		duration: 5000,
		effect: 'cutscene',
		cutsceneText: [
			'The pixels dissolve into pure energy.',
			'Concepts become more real than objects.',
			'You are no longer seeing.',
			'You are understanding.',
			'Welcome to Abstract Mode.'
		]
	},
	transitionOut: {
		duration: 4000,
		effect: 'fade',
		cutsceneText: [
			'The system is almost complete.',
			'Every planet. Every moon. Every asteroid.',
			'But one thing remains.',
			'The Sun.',
			'Are you ready?'
		]
	},
	availableResources: [ResourceId.PIXELS, ResourceId.SOLAR_ENERGY, ResourceId.FUSION],
	availableProducers: ['planet_converter', 'asteroid_harvester', 'solar_tap'],
	availableUpgrades: ['gravitational_control', 'orbital_optimization', 'stellar_approach'],
	storyEvents: ['asteroid_belt_message', 'europa_life', 'titan_structures'],
	phaseType: 'standard',
	isBossPhase: false,
	isMeditationPhase: false,
	clickingEnabled: false,
	displayOrder: 11,
	showLocked: true
};
