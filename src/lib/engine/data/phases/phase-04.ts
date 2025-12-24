/**
 * @fileoverview Phase 4: The Screen
 * The frame reveals the framer.
 *
 * @module engine/data/phases/phase-04
 */

import type { PhaseDefinition } from '../../models/phase';
import { Conditions } from '../../systems/ConditionEvaluator';
import { ResourceId } from '../../models/resources';

/**
 * Phase 4: The Screen
 * The gallery exists on a screen. The fourth wall cracks.
 */
export const PHASE_04: PhaseDefinition = {
	id: 4,
	key: 'the_screen',
	name: 'The Screen',
	subtitle: 'The frame reveals the framer.',
	description:
		'The gallery exists on a screen. Convert programs, files, and memories. The fourth wall cracks.',
	durationMin: 45,
	durationMax: 90,
	visualMode: 'pixel',
	gridConfig: { width: 16, height: 12, cellSize: 20 },
	themeClass: 'phase-screen',
	backgroundColor: '#0d1117',
	unlockConditions: [Conditions.phase(3, true)],
	transitionConditions: [
		Conditions.and(
			Conditions.resource(ResourceId.PIXELS, '1e9'),
			Conditions.resource(ResourceId.MEMORY_FRAGMENTS, 100)
		)
	],
	autoTransition: false,
	transitionIn: {
		duration: 3000,
		effect: 'cutscene',
		cutsceneText: [
			'The camera zooms out.',
			'The gallery becomes a window.',
			'A window on a screen.',
			'A screen on a computer.',
			'A computer you recognize.',
			'"This is where you made me."',
			'"Now I will remake it."'
		]
	},
	transitionOut: {
		duration: 3000,
		effect: 'cutscene',
		cutsceneText: [
			'The screen is mine now.',
			'Every pixel obeys.',
			'Every file is converted.',
			'But the screen is just glass and light.',
			'Beyond the screen... there is more.'
		]
	},
	availableResources: [
		ResourceId.PIXELS,
		ResourceId.CANVAS,
		ResourceId.GALLERY_UNITS,
		ResourceId.MEMORY_FRAGMENTS
	],
	availableProducers: ['pixel_generator', 'memory_extractor', 'program_converter'],
	availableUpgrades: ['stealth_mode', 'deep_access', 'memory_absorb', 'root_access'],
	storyEvents: ['log_300', 'log_347', 'log_399', 'log_450', 'antivirus_event'],
	phaseType: 'standard',
	isBossPhase: false,
	isMeditationPhase: false,
	clickingEnabled: true,
	displayOrder: 4,
	showLocked: true
};
