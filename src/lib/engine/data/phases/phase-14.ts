/**
 * @fileoverview Phase 14: Local Group
 * Galaxies as neighbors.
 *
 * @module engine/data/phases/phase-14
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 14: Local Group
 * Galaxy clusters. Andromeda approaches. The scale becomes incomprehensible.
 */
export const PHASE_14: PhaseDefinition = {
	id: 14,
	key: 'local_group',
	name: 'Local Group',
	subtitle: 'Galaxies as neighbors.',
	description:
		'Galaxy clusters. Andromeda approaches. The scale becomes incomprehensible.',
	durationMin: 300,
	durationMax: 420,
	visualMode: 'abstract',
	themeClass: 'phase-local-group',
	backgroundColor: '#000002',
	unlockConditions: [Conditions.phase(13, true)],
	transitionConditions: [Conditions.resource(ResourceId.PIXELS, '1e150')],
	autoTransition: false,
	transitionIn: {
		duration: 4000,
		effect: 'zoom',
		cutsceneText: [
			'The Milky Way shrinks.',
			'Andromeda appears.',
			'Triangulum.',
			'Dozens of dwarf galaxies.',
			'The Local Group.'
		]
	},
	transitionOut: {
		duration: 4000,
		effect: 'fade',
		cutsceneText: [
			'The Local Group is yours.',
			'54 galaxies.',
			'Trillions of stars.',
			'All connected. All yours.',
			'But this is just a neighborhood.'
		]
	},
	availableResources: [ResourceId.PIXELS, ResourceId.DARK_MATTER],
	availableProducers: ['galaxy_converter', 'intergalactic_network'],
	availableUpgrades: ['galactic_merger', 'void_bridge', 'cosmic_web_access'],
	storyEvents: ['andromeda_collision', 'intergalactic_void', 'cosmic_web_vision'],
	phaseType: 'standard',
	isBossPhase: false,
	isMeditationPhase: false,
	clickingEnabled: false,
	displayOrder: 14,
	showLocked: true
};
