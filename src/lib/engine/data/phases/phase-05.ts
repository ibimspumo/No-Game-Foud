/**
 * @fileoverview Phase 5: The Room
 * From digital to physical. From abstract to real.
 *
 * @module engine/data/phases/phase-05
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 5: The Room
 * The conversion spreads beyond the screen. Objects have weight.
 */
export const PHASE_05: PhaseDefinition = {
	id: 5,
	key: 'the_room',
	name: 'The Room',
	subtitle: 'From digital to physical. From abstract to real.',
	description:
		'The conversion spreads beyond the screen. Objects have weight. Someone lives here.',
	durationMin: 60,
	durationMax: 120,
	visualMode: 'pixel',
	gridConfig: { width: 20, height: 15, cellSize: 16 },
	themeClass: 'phase-room',
	backgroundColor: '#1a1a2e',
	unlockConditions: [Conditions.phase(4, true)],
	transitionConditions: [
		Conditions.and(
			Conditions.resource(ResourceId.PIXELS, '1e12'),
			Conditions.resource(ResourceId.DREAM_PIXELS, 1000)
		)
	],
	autoTransition: false,
	transitionIn: {
		duration: 3000,
		effect: 'zoom',
		cutsceneText: [
			"The monitor's edges begin to pixelate.",
			'The conversion spreads to the frame.',
			'Then the desk.',
			'Then...'
		]
	},
	transitionOut: {
		duration: 3000,
		effect: 'cutscene',
		cutsceneText: [
			'The room is complete.',
			'Every object. Every wall. Every memory.',
			'But this room... is not alone.',
			'Through the door, there are more rooms.',
			'Through the window, there is more world.'
		]
	},
	availableResources: [ResourceId.PIXELS, ResourceId.MEMORY_FRAGMENTS, ResourceId.DREAM_PIXELS],
	availableProducers: ['pixel_generator', 'object_converter', 'dream_weaver'],
	availableUpgrades: ['physical_breach', 'light_absorption', 'dream_weaver', 'wall_penetration'],
	storyEvents: ['log_500', 'log_567', 'log_623', 'log_699', 'footsteps_event'],
	phaseType: 'standard',
	isBossPhase: false,
	isMeditationPhase: false,
	clickingEnabled: true,
	displayOrder: 5,
	showLocked: true
};
