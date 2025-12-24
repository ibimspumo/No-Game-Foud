/**
 * @fileoverview Phase 15: Observable Universe
 * The edge of sight. The limit of knowledge.
 *
 * @module engine/data/phases/phase-15
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 15: Observable Universe
 * Everything that light has had time to reach us from. The cosmic horizon.
 */
export const PHASE_15: PhaseDefinition = {
	id: 15,
	key: 'observable_universe',
	name: 'Observable Universe',
	subtitle: 'The edge of sight. The limit of knowledge.',
	description:
		'Everything that light has had time to reach us from. The cosmic horizon.',
	durationMin: 360,
	durationMax: 600,
	visualMode: 'abstract',
	themeClass: 'phase-universe',
	backgroundColor: '#000000',
	unlockConditions: [Conditions.phase(14, true)],
	transitionConditions: [Conditions.resource(ResourceId.PIXELS, '1e200')],
	autoTransition: false,
	transitionIn: {
		duration: 5000,
		effect: 'zoom',
		cutsceneText: [
			'Galaxy clusters become points.',
			'Superclusters. Filaments.',
			'The cosmic web.',
			'The Observable Universe.',
			'Everything we can ever see.',
			'46 billion light-years in every direction.'
		]
	},
	transitionOut: {
		duration: 5000,
		effect: 'fade',
		cutsceneText: [
			'The Observable Universe is yours.',
			'2 trillion galaxies.',
			'1 septillion stars.',
			'All matter. All energy. All light.',
			'Pixels.',
			'But matter is not all there is.',
			'There are also... holes.'
		]
	},
	availableResources: [ResourceId.PIXELS, ResourceId.DARK_MATTER],
	availableProducers: ['universe_converter', 'cosmic_web_harvester'],
	availableUpgrades: ['universal_consciousness', 'cosmic_inflation', 'horizon_breach'],
	storyEvents: ['cosmic_microwave_background', 'heat_death_vision', 'edge_of_observable'],
	phaseType: 'standard',
	isBossPhase: false,
	isMeditationPhase: false,
	clickingEnabled: false,
	displayOrder: 15,
	showLocked: true
};
