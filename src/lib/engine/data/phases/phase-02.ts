/**
 * @fileoverview Phase 2: The Canvas
 * From point to plane. From existence to expression.
 *
 * @module engine/data/phases/phase-02
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 2: The Canvas
 * The pixel transforms into an 8x8 grid. Colors begin to emerge.
 */
export const PHASE_02: PhaseDefinition = {
	id: 2,
	key: 'the_canvas',
	name: 'The Canvas',
	subtitle: 'From point to plane. From existence to expression.',
	description:
		'The pixel transforms into an 8x8 grid. Colors begin to emerge. Automation becomes possible.',
	durationMin: 10,
	durationMax: 20,
	visualMode: 'pixel',
	gridConfig: { width: 8, height: 8, cellSize: 32 },
	themeClass: 'phase-canvas',
	backgroundColor: '#0a0a0a',
	unlockConditions: [Conditions.phase(1, true)],
	transitionConditions: [
		Conditions.resource(ResourceId.CANVAS, 1)
	],
	autoTransition: false,
	transitionIn: {
		duration: 2000,
		effect: 'zoom',
		cutsceneText: ['The pixel expands.', '8 by 8.', '64 possibilities.']
	},
	transitionOut: {
		duration: 2000,
		effect: 'dissolve',
		cutsceneText: [
			'The canvas is complete.',
			'But a single work of art is just the beginning.',
			'What if there were... more?'
		]
	},
	availableResources: [
		ResourceId.PIXELS,
		ResourceId.RED,
		ResourceId.GREEN,
		ResourceId.BLUE,
		ResourceId.CANVAS
	],
	availableProducers: ['pixel_generator', 'color_mixer'],
	availableUpgrades: ['auto_pixel', 'color_attractor'],
	storyEvents: ['log_010', 'log_025', 'log_064', 'choice_order_chaos'],
	phaseType: 'standard',
	isBossPhase: false,
	isMeditationPhase: false,
	clickingEnabled: true,
	displayOrder: 2,
	showLocked: true
};
