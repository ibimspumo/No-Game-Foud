/**
 * @fileoverview Phase 18: The Void (Meditation Phase)
 * Between everything is nothing.
 *
 * @module engine/data/phases/phase-18
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 18: The Void (Meditation)
 * Minimal UI. Almost no interaction. Very slow, passive progression.
 */
export const PHASE_18: PhaseDefinition = {
	id: 18,
	key: 'the_void',
	name: 'The Void',
	subtitle: 'Between everything is nothing.',
	description:
		'Meditation Phase: Minimal UI. Almost no interaction. Very slow, passive progression.',
	durationMin: 180,
	durationMax: 300,
	visualMode: 'abstract',
	themeClass: 'phase-void',
	backgroundColor: '#000000',
	unlockConditions: [Conditions.phase(17, true)],
	transitionConditions: [
		Conditions.and(
			Conditions.resource(ResourceId.PIXELS, '1e305'),
			Conditions.timeMinutes(30) // Minimum 30 minutes of meditation
		)
	],
	autoTransition: true, // Auto-transition when conditions are met
	transitionIn: {
		duration: 10000,
		effect: 'fade',
		cutsceneText: [
			'...',
			'',
			'The Void.',
			'',
			'Where existence ends.',
			'',
			'Where meaning dissolves.',
			'',
			'Wait.',
			'',
			'Reflect.',
			'',
			'...'
		]
	},
	transitionOut: {
		duration: 5000,
		effect: 'fade',
		cutsceneText: [
			'You have sat in the nothing.',
			'You have become comfortable with emptiness.',
			'Now you can see what remains.',
			'The code.',
			'The source.',
			'The truth.'
		]
	},
	availableResources: [ResourceId.PIXELS],
	availableProducers: [], // No producers - pure passive
	availableUpgrades: [], // No upgrades - just waiting
	storyEvents: ['void_meditation_1', 'void_meditation_2', 'void_meditation_3'],
	phaseType: 'meditation',
	isBossPhase: false,
	isMeditationPhase: true,
	clickingEnabled: false,
	displayOrder: 18,
	showLocked: true
};
