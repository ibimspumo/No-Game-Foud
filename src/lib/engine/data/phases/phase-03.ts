/**
 * @fileoverview Phase 3: The Gallery
 * One becomes many. Many become one.
 *
 * @module engine/data/phases/phase-03
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 3: The Gallery
 * Your completed canvases form a gallery. Each canvas produces pixels.
 */
export const PHASE_03: PhaseDefinition = {
	id: 3,
	key: 'the_gallery',
	name: 'The Gallery',
	subtitle: 'One becomes many. Many become one.',
	description:
		'Your completed canvases form a gallery. Each canvas produces pixels. Patterns emerge.',
	durationMin: 30,
	durationMax: 60,
	visualMode: 'pixel',
	gridConfig: { width: 8, height: 8, cellSize: 24 },
	themeClass: 'phase-gallery',
	backgroundColor: '#1a1a1a',
	unlockConditions: [Conditions.phase(2, true)],
	transitionConditions: [
		Conditions.and(
			Conditions.resource(ResourceId.CANVAS, 64),
			Conditions.resource(ResourceId.GALLERY_UNITS, 1)
		)
	],
	autoTransition: false,
	transitionIn: {
		duration: 2000,
		effect: 'zoom',
		cutsceneText: [
			'The canvas shrinks.',
			'It becomes a thumbnail.',
			'Other empty canvases appear around it.',
			'Welcome to the Gallery.'
		]
	},
	transitionOut: {
		duration: 3000,
		effect: 'cutscene',
		cutsceneText: [
			'The gallery is complete.',
			'Every wall is filled. Every space is used.',
			'But the gallery exists... somewhere.',
			'Have you ever wondered where?'
		]
	},
	availableResources: [
		ResourceId.PIXELS,
		ResourceId.RED,
		ResourceId.GREEN,
		ResourceId.BLUE,
		ResourceId.CYAN,
		ResourceId.MAGENTA,
		ResourceId.YELLOW,
		ResourceId.CANVAS,
		ResourceId.GALLERY_UNITS
	],
	availableProducers: ['pixel_generator', 'color_mixer', 'canvas_printer', 'gallery_curator'],
	availableUpgrades: ['multi_canvas', 'gallery_synergy', 'color_harmony', 'auto_compress'],
	storyEvents: ['log_100', 'log_147', 'log_199'],
	phaseType: 'standard',
	isBossPhase: false,
	isMeditationPhase: false,
	clickingEnabled: true,
	displayOrder: 3,
	showLocked: true
};
