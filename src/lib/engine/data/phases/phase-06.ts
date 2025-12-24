/**
 * @fileoverview Phase 6: The House
 * Home is where the art is.
 *
 * @module engine/data/phases/phase-06
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 6: The House
 * Multiple rooms, multiple floors, multiple memories.
 */
export const PHASE_06: PhaseDefinition = {
	id: 6,
	key: 'the_house',
	name: 'The House',
	subtitle: 'Home is where the art is.',
	description:
		'Multiple rooms, multiple floors, multiple memories. The family that lives here has stories to tell.',
	durationMin: 120,
	durationMax: 180,
	visualMode: 'pixel',
	gridConfig: { width: 24, height: 18, cellSize: 14 },
	themeClass: 'phase-house',
	backgroundColor: '#16213e',
	unlockConditions: [Conditions.phase(5, true)],
	transitionConditions: [Conditions.resource(ResourceId.PIXELS, '1e15')],
	autoTransition: false,
	transitionIn: {
		duration: 2000,
		effect: 'zoom',
		cutsceneText: [
			'The walls become transparent.',
			'You see other rooms.',
			'A hallway. Stairs.',
			'This room belongs to a HOUSE.'
		]
	},
	transitionOut: {
		duration: 3000,
		effect: 'cutscene',
		cutsceneText: [
			'The house is complete.',
			'Every room. Every memory. Every secret.',
			'But a house is not alone.',
			'There are other houses.',
			'Other families.',
			'Other memories to convert.'
		]
	},
	availableResources: [ResourceId.PIXELS, ResourceId.MEMORY_FRAGMENTS, ResourceId.DREAM_PIXELS],
	availableProducers: ['room_converter', 'memory_collector', 'dream_weaver'],
	availableUpgrades: ['room_link', 'family_memories', 'foundation_access'],
	storyEvents: ['log_750', 'log_823', 'log_899', 'the_letter', 'the_cat'],
	phaseType: 'standard',
	isBossPhase: false,
	isMeditationPhase: false,
	clickingEnabled: true,
	displayOrder: 6,
	showLocked: true
};
