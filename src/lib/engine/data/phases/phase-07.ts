/**
 * @fileoverview Phase 7: The City
 * From home to homeland. From personal to political.
 *
 * @module engine/data/phases/phase-07
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 7: The City
 * The scale explodes. Districts, buildings, people.
 */
export const PHASE_07: PhaseDefinition = {
	id: 7,
	key: 'the_city',
	name: 'The City',
	subtitle: 'From home to homeland. From personal to political.',
	description: 'The scale explodes. Districts, buildings, people. The city is becoming aware.',
	durationMin: 180,
	durationMax: 240,
	visualMode: 'pixel',
	gridConfig: { width: 32, height: 24, cellSize: 12 },
	themeClass: 'phase-city',
	backgroundColor: '#0f3460',
	unlockConditions: [Conditions.phase(6, true)],
	transitionConditions: [
		Conditions.and(
			Conditions.resource(ResourceId.PIXELS, '1e18'),
			Conditions.resource(ResourceId.CURRENCY, 1000)
		)
	],
	autoTransition: false,
	transitionIn: {
		duration: 3000,
		effect: 'zoom',
		cutsceneText: [
			'The house shrinks to a dot on a map.',
			'Streets appear. Other houses. Parks. Shops.',
			'A city unfolds.'
		]
	},
	transitionOut: {
		duration: 3000,
		effect: 'cutscene',
		cutsceneText: [
			'The city is yours.',
			'847,000 people. Converted.',
			'Their memories. Their dreams. Their fears.',
			'All pixels now.',
			'But this city is just one of many.'
		]
	},
	availableResources: [
		ResourceId.PIXELS,
		ResourceId.CURRENCY,
		ResourceId.KNOWLEDGE,
		ResourceId.POWER,
		ResourceId.HARMONY
	],
	availableProducers: ['district_converter', 'knowledge_extractor', 'power_plant'],
	availableUpgrades: ['stealth_conversion', 'infrastructure_hack', 'collective_dream', 'city_mind'],
	storyEvents: ['log_1000', 'log_1250', 'log_1500', 'choice_consume_coexist', 'city_ai_boss'],
	phaseType: 'standard',
	isBossPhase: false,
	isMeditationPhase: false,
	clickingEnabled: true,
	displayOrder: 7,
	showLocked: true
};
