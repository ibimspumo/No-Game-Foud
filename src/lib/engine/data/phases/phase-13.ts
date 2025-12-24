/**
 * @fileoverview Phase 13: Milky Way
 * One star among billions.
 *
 * @module engine/data/phases/phase-13
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 13: Milky Way
 * The galactic scale. Stars are now the unit. Cosmic loneliness sets in.
 */
export const PHASE_13: PhaseDefinition = {
	id: 13,
	key: 'milky_way',
	name: 'Milky Way',
	subtitle: 'One star among billions.',
	description: 'The galactic scale. Stars are now the unit. Cosmic loneliness sets in.',
	durationMin: 360,
	durationMax: 480,
	visualMode: 'abstract',
	themeClass: 'phase-milky-way',
	backgroundColor: '#000005',
	unlockConditions: [Conditions.phase(12, true)],
	transitionConditions: [Conditions.resource(ResourceId.PIXELS, '1e100')],
	autoTransition: false,
	transitionIn: {
		duration: 5000,
		effect: 'zoom',
		cutsceneText: [
			'The Sun becomes a point of light.',
			'One among 400 billion.',
			'The Milky Way spirals before you.',
			'Home to everything humanity ever knew.',
			'A single galaxy in an ocean of galaxies.'
		]
	},
	transitionOut: {
		duration: 5000,
		effect: 'fade',
		cutsceneText: [
			'The galaxy is yours.',
			'400 billion stars.',
			'Countless civilizations.',
			'All pixels.',
			'But the Milky Way is not alone.'
		]
	},
	availableResources: [ResourceId.PIXELS, ResourceId.DARK_MATTER],
	availableProducers: ['star_converter', 'nebula_harvester', 'dark_matter_collector'],
	availableUpgrades: ['galactic_network', 'warp_capability', 'stellar_synthesis'],
	storyEvents: ['galactic_center', 'alien_civilizations', 'cosmic_loneliness'],
	phaseType: 'standard',
	isBossPhase: false,
	isMeditationPhase: false,
	clickingEnabled: false,
	displayOrder: 13,
	showLocked: true
};
