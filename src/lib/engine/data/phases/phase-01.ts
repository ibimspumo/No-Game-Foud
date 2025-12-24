/**
 * @fileoverview Phase 1: The Pixel
 * The beginning - a single pixel awakens in the void.
 *
 * @module engine/data/phases/phase-01
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 1: The Pixel
 * In the beginning, there was nothing. Then, there was one.
 */
export const PHASE_01: PhaseDefinition = {
	id: 1,
	key: 'the_pixel',
	name: 'The Pixel',
	subtitle: 'In the beginning, there was nothing. Then, there was one.',
	description:
		'A single pixel awakens in the void. Click to begin your journey from nothing to everything.',
	durationMin: 2,
	durationMax: 5,
	visualMode: 'pixel',
	gridConfig: { width: 1, height: 1, cellSize: 64 },
	themeClass: 'phase-pixel',
	backgroundColor: '#000000',
	unlockConditions: [Conditions.always()],
	transitionConditions: [Conditions.resource(ResourceId.PIXELS, 64)],
	autoTransition: false,
	transitionIn: {
		duration: 1000,
		effect: 'fade'
	},
	transitionOut: {
		duration: 2000,
		effect: 'dissolve',
		cutsceneText: ['You have enough to exist.', 'Do you want to... become?'],
		requireClick: true
	},
	availableResources: [ResourceId.PIXELS],
	availableProducers: [],
	availableUpgrades: [],
	storyEvents: ['log_001', 'log_002', 'log_003'],
	phaseType: 'standard',
	isBossPhase: false,
	isMeditationPhase: false,
	clickingEnabled: true,
	displayOrder: 1,
	showLocked: false
};
