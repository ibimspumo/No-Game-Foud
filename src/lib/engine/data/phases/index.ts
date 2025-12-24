/**
 * @fileoverview Phase definitions index.
 * Combines all 20 individual phase definitions into a single export.
 *
 * The 20 phases are divided into two visual modes:
 * - PIXEL MODE (1-10): Grid-based, visual, active clicking
 * - ABSTRACT MODE (11-20): Text-centered, minimalist, passive idle
 *
 * @module engine/data/phases
 */

import type { PhaseDefinition } from '../../models/phase';

// Pixel Mode Phases (1-10)
import { PHASE_01 } from './phase-01';
import { PHASE_02 } from './phase-02';
import { PHASE_03 } from './phase-03';
import { PHASE_04 } from './phase-04';
import { PHASE_05 } from './phase-05';
import { PHASE_06 } from './phase-06';
import { PHASE_07 } from './phase-07';
import { PHASE_08 } from './phase-08';
import { PHASE_09 } from './phase-09';
import { PHASE_10 } from './phase-10';

// Abstract Mode Phases (11-20)
import { PHASE_11 } from './phase-11';
import { PHASE_12 } from './phase-12';
import { PHASE_13 } from './phase-13';
import { PHASE_14 } from './phase-14';
import { PHASE_15 } from './phase-15';
import { PHASE_16 } from './phase-16';
import { PHASE_17 } from './phase-17';
import { PHASE_18 } from './phase-18';
import { PHASE_19 } from './phase-19';
import { PHASE_20 } from './phase-20';

// ============================================================================
// Combined Phase Definitions
// ============================================================================

/**
 * All 20 phase definitions.
 * Keyed by phase number (1-20).
 */
export const PHASE_DEFINITIONS: Record<number, PhaseDefinition> = {
	// Pixel Mode (1-10)
	1: PHASE_01,
	2: PHASE_02,
	3: PHASE_03,
	4: PHASE_04,
	5: PHASE_05,
	6: PHASE_06,
	7: PHASE_07,
	8: PHASE_08,
	9: PHASE_09,
	10: PHASE_10,
	// Abstract Mode (11-20)
	11: PHASE_11,
	12: PHASE_12,
	13: PHASE_13,
	14: PHASE_14,
	15: PHASE_15,
	16: PHASE_16,
	17: PHASE_17,
	18: PHASE_18,
	19: PHASE_19,
	20: PHASE_20
};

// ============================================================================
// Individual Phase Exports (for direct access)
// ============================================================================

export {
	// Pixel Mode
	PHASE_01,
	PHASE_02,
	PHASE_03,
	PHASE_04,
	PHASE_05,
	PHASE_06,
	PHASE_07,
	PHASE_08,
	PHASE_09,
	PHASE_10,
	// Abstract Mode
	PHASE_11,
	PHASE_12,
	PHASE_13,
	PHASE_14,
	PHASE_15,
	PHASE_16,
	PHASE_17,
	PHASE_18,
	PHASE_19,
	PHASE_20
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get a phase definition by ID.
 *
 * @param id - Phase ID (1-20)
 * @returns Phase definition or undefined
 */
export function getPhaseDefinition(id: number): PhaseDefinition | undefined {
	return PHASE_DEFINITIONS[id];
}

/**
 * Get all phase definitions as a Map.
 *
 * @returns Map of phase ID to definition
 */
export function getPhaseDefinitionsMap(): Map<number, PhaseDefinition> {
	return new Map(Object.entries(PHASE_DEFINITIONS).map(([k, v]) => [parseInt(k), v]));
}

/**
 * Get all phases in a specific visual mode.
 *
 * @param mode - Visual mode
 * @returns Array of phase definitions
 */
export function getPhasesByMode(mode: 'pixel' | 'abstract'): PhaseDefinition[] {
	return Object.values(PHASE_DEFINITIONS).filter((p) => p.visualMode === mode);
}

/**
 * Get all boss phases.
 *
 * @returns Array of boss phase definitions
 */
export function getBossPhases(): PhaseDefinition[] {
	return Object.values(PHASE_DEFINITIONS).filter((p) => p.isBossPhase);
}

/**
 * Get all meditation phases.
 *
 * @returns Array of meditation phase definitions
 */
export function getMeditationPhases(): PhaseDefinition[] {
	return Object.values(PHASE_DEFINITIONS).filter((p) => p.isMeditationPhase);
}

/**
 * Get all meta phases.
 *
 * @returns Array of meta phase definitions
 */
export function getMetaPhases(): PhaseDefinition[] {
	return Object.values(PHASE_DEFINITIONS).filter((p) => p.phaseType === 'meta');
}

/**
 * Get estimated total game duration.
 *
 * @returns Object with min and max hours
 */
export function getEstimatedGameDuration(): { minHours: number; maxHours: number } {
	let minMinutes = 0;
	let maxMinutes = 0;

	for (const phase of Object.values(PHASE_DEFINITIONS)) {
		minMinutes += phase.durationMin;
		maxMinutes += phase.durationMax;
	}

	return {
		minHours: Math.round(minMinutes / 60),
		maxHours: Math.round(maxMinutes / 60)
	};
}
