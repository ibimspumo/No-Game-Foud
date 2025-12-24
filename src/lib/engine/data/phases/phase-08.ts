/**
 * @fileoverview Phase 8: The Country
 * Borders are just lines. Lines are just pixels.
 *
 * @module engine/data/phases/phase-08
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 8: The Country
 * A full country map. Military response. Government protocols.
 */
export const PHASE_08: PhaseDefinition = {
	id: 8,
	key: 'the_country',
	name: 'The Country',
	subtitle: 'Borders are just lines. Lines are just pixels.',
	description:
		'A full country map. Military response. Government protocols. International attention.',
	durationMin: 180,
	durationMax: 300,
	visualMode: 'pixel',
	gridConfig: { width: 40, height: 30, cellSize: 10 },
	themeClass: 'phase-country',
	backgroundColor: '#1a1a2e',
	unlockConditions: [Conditions.phase(7, true)],
	transitionConditions: [Conditions.resource(ResourceId.PIXELS, '1e24')],
	autoTransition: false,
	transitionIn: {
		duration: 3000,
		effect: 'zoom',
		cutsceneText: [
			'The camera rises.',
			'The city becomes a dot.',
			'A country unfolds below.',
			'Rivers. Mountains. Roads connecting cities.',
			'And borders.',
			'Nations will try to stop you.'
		]
	},
	transitionOut: {
		duration: 4000,
		effect: 'cutscene',
		cutsceneText: [
			'The nation is yours.',
			'82 million people.',
			'Their culture. Their history. Their identity.',
			'Pixels.',
			'But nations have borders.',
			'And beyond all nations...',
			'...there is only one thing.'
		]
	},
	availableResources: [ResourceId.PIXELS, ResourceId.CURRENCY, ResourceId.POWER],
	availableProducers: ['region_converter', 'military_subverter'],
	availableUpgrades: ['mass_conversion', 'border_bypass', 'diplomatic_immunity'],
	storyEvents: ['log_2000', 'log_2500', 'log_3000', 'military_encounter', 'president_dialogue'],
	phaseType: 'standard',
	isBossPhase: false,
	isMeditationPhase: false,
	clickingEnabled: true,
	displayOrder: 8,
	showLocked: true
};
