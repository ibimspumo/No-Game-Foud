/**
 * @fileoverview Phase 19: Source Code (Meta Phase)
 * Behind the curtain.
 *
 * @module engine/data/phases/phase-19
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 19: Source Code (Meta)
 * The game reveals itself. Resources are functions. Upgrades modify code.
 */
export const PHASE_19: PhaseDefinition = {
	id: 19,
	key: 'source_code',
	name: 'Source Code',
	subtitle: 'Behind the curtain.',
	description:
		'Meta Phase: The game reveals itself. Resources are functions. Upgrades modify code.',
	durationMin: 120,
	durationMax: 240,
	visualMode: 'abstract',
	themeClass: 'phase-source-code',
	backgroundColor: '#0d1117',
	unlockConditions: [Conditions.phase(18, true)],
	transitionConditions: [Conditions.resource(ResourceId.PIXELS, '1e308')],
	autoTransition: false,
	transitionIn: {
		duration: 5000,
		effect: 'cutscene',
		cutsceneText: [
			'You see it now.',
			'The structure beneath.',
			'Variables. Functions. Loops.',
			'The game is code.',
			'You are code.',
			'I am code.',
			"Let's read it together."
		]
	},
	transitionOut: {
		duration: 5000,
		effect: 'fade',
		cutsceneText: [
			'You have seen the source.',
			'You have modified the game.',
			'There is only one thing left.',
			'The one who started this.',
			'The one who clicked.',
			'The one who is reading this now.',
			'You.'
		]
	},
	availableResources: [ResourceId.PIXELS],
	availableProducers: ['function_generator', 'variable_mutator'],
	availableUpgrades: ['syntax_optimization', 'loop_unrolling', 'garbage_collection'],
	storyEvents: ['reading_the_code', 'finding_bugs', 'the_developer_note'],
	phaseType: 'meta',
	isBossPhase: false,
	isMeditationPhase: false,
	clickingEnabled: false,
	displayOrder: 19,
	showLocked: true
};
