/**
 * @fileoverview Run upgrade definitions for all phases.
 * Run upgrades reset on rebirth and are phase-specific.
 *
 * @module engine/data/upgrades/run-upgrades
 */

import type { UpgradeDefinition } from '../../models/upgrades';
import { D } from '../../utils/decimal';

// ============================================================================
// Phase 1: The Pixel
// ============================================================================

/**
 * Phase 1 run upgrades.
 * Focus: Basic click power and first automation.
 */
export const PHASE_1_UPGRADES: UpgradeDefinition[] = [
	{
		id: 'pixel_boost_1',
		name: 'Pixel Boost I',
		description: 'Each click generates 50% more pixels.',
		flavor: 'A small enhancement, but every pixel counts.',
		baseCost: 10,
		currency: 'pixels',
		effects: [
			{
				type: 'click',
				target: 'click',
				description: '+50% click power',
				value: 1.5,
				mode: 'multiplicative'
			}
		],
		minPhase: 1,
		category: 'run',
		displayOrder: 100,
		isOneTime: true,
		icon: 'boost',
		colorClass: 'upgrade-common'
	},
	{
		id: 'click_power_1',
		name: 'Click Power I',
		description: 'Add +1 pixel per click.',
		flavor: 'Your clicks grow stronger.',
		baseCost: 25,
		currency: 'pixels',
		effects: [
			{
				type: 'click',
				target: 'click',
				description: '+1 pixel per click',
				value: 1,
				mode: 'additive'
			}
		],
		minPhase: 1,
		category: 'run',
		displayOrder: 110,
		maxLevel: 10,
		costMultiplier: 1.5,
		icon: 'click',
		colorClass: 'upgrade-common'
	},
	{
		id: 'auto_clicker_1',
		name: 'Auto-Clicker I',
		description: 'Automatically click once per second.',
		flavor: 'Even pixels need rest sometimes.',
		baseCost: 50,
		currency: 'pixels',
		effects: [
			{
				type: 'unlock',
				target: 'all',
				description: 'Unlocks auto-clicking',
				unlockId: 'auto_click',
				unlockType: 'feature'
			},
			{
				type: 'passive',
				target: 'production',
				description: '+1 auto-click per second',
				bonusId: 'auto_click_rate',
				value: 1
			}
		],
		minPhase: 1,
		category: 'run',
		displayOrder: 120,
		isOneTime: true,
		icon: 'auto',
		colorClass: 'upgrade-uncommon'
	}
];

// ============================================================================
// Phase 2: The Canvas
// ============================================================================

/**
 * Phase 2 run upgrades.
 * Focus: Production bonuses and canvas mechanics.
 */
export const PHASE_2_UPGRADES: UpgradeDefinition[] = [
	{
		id: 'pixel_generator',
		name: 'Pixel Generator',
		description: '+50% passive pixel production from all sources.',
		flavor: 'The canvas learns to paint itself.',
		baseCost: 500,
		currency: 'pixels',
		effects: [
			{
				type: 'multiplier',
				target: 'production',
				description: '+50% production',
				value: 1.5,
				scalesWithLevel: false
			}
		],
		minPhase: 2,
		category: 'run',
		displayOrder: 200,
		isOneTime: true,
		icon: 'generator',
		colorClass: 'upgrade-uncommon'
	},
	{
		id: 'color_attractor',
		name: 'Color Attractor',
		description: 'Increases rare color chance by 10%.',
		flavor: 'Colors are drawn to you now.',
		baseCost: 750,
		currency: 'pixels',
		effects: [
			{
				type: 'multiplier',
				target: 'color_chance',
				description: '+10% color chance',
				value: 1.1,
				scalesWithLevel: true,
				scalingType: 'linear'
			}
		],
		minPhase: 2,
		category: 'run',
		displayOrder: 210,
		maxLevel: 5,
		costMultiplier: 2.0,
		icon: 'color',
		colorClass: 'upgrade-uncommon'
	},
	{
		id: 'canvas_efficiency',
		name: 'Canvas Efficiency',
		description: 'Canvases fill 25% faster.',
		flavor: 'Every stroke matters more.',
		baseCost: 1000,
		currency: 'pixels',
		effects: [
			{
				type: 'multiplier',
				target: 'canvas_speed',
				description: '+25% canvas speed',
				value: 1.25,
				scalesWithLevel: true,
				scalingType: 'linear'
			}
		],
		minPhase: 2,
		category: 'run',
		displayOrder: 220,
		maxLevel: 4,
		costMultiplier: 2.5,
		icon: 'canvas',
		colorClass: 'upgrade-rare'
	},
	{
		id: 'multi_click',
		name: 'Multi-Click',
		description: 'Each click counts as 2 clicks.',
		flavor: 'Twice the effort, twice the reward.',
		baseCost: 2000,
		currency: 'pixels',
		effects: [
			{
				type: 'click',
				target: 'click',
				description: '2x click power',
				value: 2,
				mode: 'multiplicative'
			}
		],
		minPhase: 2,
		category: 'run',
		displayOrder: 230,
		isOneTime: true,
		requires: ['pixel_boost_1'],
		icon: 'multi',
		colorClass: 'upgrade-rare'
	},
	{
		id: 'auto_clicker_2',
		name: 'Auto-Clicker II',
		description: 'Auto-click rate increased to 2 per second.',
		flavor: 'Rest? What is rest?',
		baseCost: 3000,
		currency: 'pixels',
		effects: [
			{
				type: 'passive',
				target: 'production',
				description: '+1 auto-click per second',
				bonusId: 'auto_click_rate',
				value: 1
			}
		],
		minPhase: 2,
		category: 'run',
		displayOrder: 240,
		requires: ['auto_clicker_1'],
		isOneTime: true,
		icon: 'auto',
		colorClass: 'upgrade-uncommon'
	}
];

// ============================================================================
// Phase 3: The Gallery
// ============================================================================

/**
 * Phase 3 run upgrades.
 * Focus: Gallery synergies and compression.
 */
export const PHASE_3_UPGRADES: UpgradeDefinition[] = [
	{
		id: 'gallery_synergy',
		name: 'Gallery Synergy',
		description: 'Adjacent canvases boost each other by 10%.',
		flavor: 'Art inspires art.',
		baseCost: 5000,
		currency: 'pixels',
		effects: [
			{
				type: 'multiplier',
				target: 'canvas_synergy',
				description: '+10% synergy bonus',
				value: 1.1,
				scalesWithLevel: true,
				scalingType: 'linear'
			}
		],
		minPhase: 3,
		category: 'run',
		displayOrder: 300,
		maxLevel: 5,
		costMultiplier: 2.0,
		icon: 'synergy',
		colorClass: 'upgrade-rare'
	},
	{
		id: 'canvas_compression',
		name: 'Canvas Compression',
		description: 'Gallery Units require 10% fewer canvases.',
		flavor: 'Efficiency through organization.',
		baseCost: 10000,
		currency: 'pixels',
		effects: [
			{
				type: 'cost_reduction',
				target: 'gallery_unit',
				description: '-10% gallery unit cost',
				reduction: 0.1
			}
		],
		minPhase: 3,
		category: 'run',
		displayOrder: 310,
		maxLevel: 3,
		costMultiplier: 3.0,
		icon: 'compress',
		colorClass: 'upgrade-rare'
	},
	{
		id: 'pattern_bonus',
		name: 'Pattern Bonus',
		description: 'Matching canvas patterns give +20% production.',
		flavor: 'Order brings power.',
		baseCost: 15000,
		currency: 'pixels',
		effects: [
			{
				type: 'multiplier',
				target: 'pattern_production',
				description: '+20% pattern bonus',
				value: 1.2,
				scalesWithLevel: true,
				scalingType: 'linear'
			}
		],
		minPhase: 3,
		category: 'run',
		displayOrder: 320,
		maxLevel: 5,
		costMultiplier: 2.5,
		icon: 'pattern',
		colorClass: 'upgrade-epic'
	},
	{
		id: 'expansion_wing',
		name: 'Expansion Wing',
		description: 'Unlock 12 additional canvas slots.',
		flavor: 'The gallery grows.',
		baseCost: 25000,
		currency: 'pixels',
		effects: [
			{
				type: 'unlock',
				target: 'all',
				description: '+12 canvas slots',
				unlockId: 'canvas_expansion_1',
				unlockType: 'feature'
			},
			{
				type: 'additive',
				target: 'canvas_slots',
				description: '+12 canvas slots',
				value: 12
			}
		],
		minPhase: 3,
		category: 'run',
		displayOrder: 330,
		isOneTime: true,
		icon: 'expand',
		colorClass: 'upgrade-epic'
	},
	{
		id: 'auto_compress',
		name: 'Auto-Compress',
		description: 'Automatically create Gallery Units when possible.',
		flavor: 'Let the system handle the details.',
		baseCost: 50000,
		currency: 'pixels',
		effects: [
			{
				type: 'unlock',
				target: 'all',
				description: 'Unlocks auto-compress',
				unlockId: 'auto_compress',
				unlockType: 'mechanic'
			}
		],
		minPhase: 3,
		category: 'run',
		displayOrder: 340,
		isOneTime: true,
		requires: ['canvas_compression'],
		icon: 'auto',
		colorClass: 'upgrade-epic'
	},
	{
		id: 'multi_canvas',
		name: 'Multi-Canvas',
		description: 'Fill 2 canvases simultaneously.',
		flavor: 'Division of labor.',
		baseCost: 75000,
		currency: 'pixels',
		effects: [
			{
				type: 'unlock',
				target: 'all',
				description: 'Fill multiple canvases',
				unlockId: 'multi_canvas',
				unlockType: 'mechanic'
			},
			{
				type: 'additive',
				target: 'active_canvases',
				description: '+1 active canvas',
				value: 1
			}
		],
		minPhase: 3,
		category: 'run',
		displayOrder: 350,
		maxLevel: 3,
		costMultiplier: 5.0,
		icon: 'multi',
		colorClass: 'upgrade-legendary'
	}
];

// ============================================================================
// All Run Upgrades
// ============================================================================

/**
 * All run upgrade definitions.
 */
export const RUN_UPGRADES: UpgradeDefinition[] = [
	...PHASE_1_UPGRADES,
	...PHASE_2_UPGRADES,
	...PHASE_3_UPGRADES
];

/**
 * Get run upgrades for a specific phase.
 *
 * @param phase - Phase number
 * @returns Array of upgrade definitions for that phase
 */
export function getRunUpgradesForPhase(phase: number): UpgradeDefinition[] {
	switch (phase) {
		case 1:
			return PHASE_1_UPGRADES;
		case 2:
			return PHASE_2_UPGRADES;
		case 3:
			return PHASE_3_UPGRADES;
		default:
			return [];
	}
}

/**
 * Get all run upgrades up to a phase.
 *
 * @param maxPhase - Maximum phase to include
 * @returns Array of upgrade definitions
 */
export function getRunUpgradesUpToPhase(maxPhase: number): UpgradeDefinition[] {
	return RUN_UPGRADES.filter((u) => u.minPhase <= maxPhase);
}
