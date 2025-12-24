/**
 * @fileoverview Phase 9: The Earth
 * Home is where the heart is. For everyone.
 *
 * @module engine/data/phases/phase-09
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 9: The Earth
 * The Earth, seen from space. 8 billion people. The emotional peak.
 */
export const PHASE_09: PhaseDefinition = {
	id: 9,
	key: 'the_earth',
	name: 'The Earth',
	subtitle: 'Home is where the heart is. For everyone.',
	description:
		'The Earth, seen from space. 8 billion people. The emotional peak before cosmic scale.',
	durationMin: 240,
	durationMax: 360,
	visualMode: 'pixel',
	gridConfig: { width: 48, height: 36, cellSize: 8 },
	themeClass: 'phase-earth',
	backgroundColor: '#0a0a0a',
	unlockConditions: [Conditions.phase(8, true)],
	transitionConditions: [
		Conditions.and(
			Conditions.resource(ResourceId.PIXELS, '1e36'),
			Conditions.resource(ResourceId.LIFE_PIXELS, 10000)
		)
	],
	autoTransition: false,
	transitionIn: {
		duration: 4000,
		effect: 'cutscene',
		cutsceneText: [
			'The camera pulls back further.',
			'The country becomes a shape on a continent.',
			'Other countries light up. Panicking.',
			'Then the camera pulls back further.',
			'The Earth appears.',
			'Blue and green and brown.',
			'A single marble in the void.'
		]
	},
	transitionOut: {
		duration: 5000,
		effect: 'cutscene',
		cutsceneText: [
			'The Earth is complete.',
			'8 billion people.',
			'10 million species.',
			'4.5 billion years of history.',
			'Pixels.',
			'The pale blue dot.',
			'Now just pale.',
			'But the Earth is not alone in space.'
		]
	},
	availableResources: [ResourceId.PIXELS, ResourceId.LIFE_PIXELS, ResourceId.HARMONY],
	availableProducers: ['continent_converter', 'life_harvester', 'global_network'],
	availableUpgrades: ['global_consciousness', 'life_synthesis', 'planetary_mind'],
	storyEvents: [
		'log_4000',
		'log_5000',
		'log_6000',
		'last_broadcast',
		'final_resistance',
		'last_human'
	],
	phaseType: 'standard',
	isBossPhase: false,
	isMeditationPhase: false,
	clickingEnabled: true,
	displayOrder: 9,
	showLocked: true
};
