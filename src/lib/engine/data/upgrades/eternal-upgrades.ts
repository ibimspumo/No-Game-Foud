/**
 * @fileoverview Eternal upgrade definitions (Skill Tree).
 * Eternal upgrades persist across rebirths and provide permanent bonuses.
 *
 * Three paths:
 * - Consumer: Speed and efficiency focused
 * - Creator: Synergies and cooperation focused
 * - Observer: Knowledge and secrets focused
 *
 * @module engine/data/upgrades/eternal-upgrades
 */

import type { UpgradeDefinition } from '../../models/upgrades';
import { D } from '../../utils/decimal';

// ============================================================================
// Consumer Path
// Speed and efficiency - reaching goals faster
// ============================================================================

/**
 * Consumer path eternal upgrades.
 */
export const CONSUMER_PATH_UPGRADES: UpgradeDefinition[] = [
	// Tier 1
	{
		id: 'quick_start',
		name: 'Quick Start',
		description: 'Start each run with 100 pixels.',
		flavor: 'Every journey begins with a head start.',
		baseCost: 10,
		currency: 'primordial',
		effects: [
			{
				type: 'starting_bonus',
				target: 'all',
				description: 'Start with 100 pixels',
				resourceId: 'pixels',
				amount: 100
			}
		],
		minPhase: 1,
		category: 'eternal',
		path: 'consumer',
		displayOrder: 1000,
		maxLevel: 5,
		costMultiplier: 2.0,
		icon: 'quick',
		colorClass: 'upgrade-eternal-consumer'
	},
	{
		id: 'early_automation',
		name: 'Early Automation',
		description: 'Start with Auto-Clicker I unlocked.',
		flavor: 'Why wait for what you can have now?',
		baseCost: 25,
		currency: 'primordial',
		effects: [
			{
				type: 'unlock',
				target: 'all',
				description: 'Start with auto-clicker',
				unlockId: 'auto_clicker_1_start',
				unlockType: 'feature'
			}
		],
		minPhase: 1,
		requires: ['quick_start'],
		category: 'eternal',
		path: 'consumer',
		displayOrder: 1010,
		isOneTime: true,
		icon: 'auto',
		colorClass: 'upgrade-eternal-consumer'
	},

	// Tier 2
	{
		id: 'phase_skip',
		name: 'Phase Accelerator',
		description: 'Phase transition requirements reduced by 10%.',
		flavor: 'Time waits for no pixel.',
		baseCost: 50,
		currency: 'primordial',
		effects: [
			{
				type: 'cost_reduction',
				target: 'phase_transition',
				description: '-10% phase requirements',
				reduction: 0.1
			}
		],
		minPhase: 1,
		requires: ['early_automation'],
		category: 'eternal',
		path: 'consumer',
		displayOrder: 1020,
		maxLevel: 5,
		costMultiplier: 2.5,
		icon: 'skip',
		colorClass: 'upgrade-eternal-consumer'
	},
	{
		id: 'offline_boost',
		name: 'Restful Dreams',
		description: 'Offline efficiency increased by 5%.',
		flavor: 'Even in sleep, the pixels grow.',
		baseCost: 40,
		currency: 'primordial',
		effects: [
			{
				type: 'multiplier',
				target: 'offline',
				description: '+5% offline efficiency',
				value: 1.05,
				scalesWithLevel: true,
				scalingType: 'linear'
			}
		],
		minPhase: 1,
		requires: ['early_automation'],
		category: 'eternal',
		path: 'consumer',
		displayOrder: 1025,
		maxLevel: 10,
		costMultiplier: 1.5,
		icon: 'offline',
		colorClass: 'upgrade-eternal-consumer'
	},

	// Tier 3 (Capstone)
	{
		id: 'endless_hunger',
		name: 'Endless Hunger',
		description: 'All pixel production doubled.',
		flavor: 'Consume. Grow. Consume again.',
		baseCost: 200,
		currency: 'primordial',
		effects: [
			{
				type: 'multiplier',
				target: 'pixels',
				description: '2x pixel production',
				value: 2.0,
				scalesWithLevel: false
			}
		],
		minPhase: 1,
		requires: ['phase_skip', 'offline_boost'],
		category: 'eternal',
		path: 'consumer',
		displayOrder: 1030,
		isOneTime: true,
		icon: 'hunger',
		colorClass: 'upgrade-eternal-consumer-capstone'
	}
];

// ============================================================================
// Creator Path
// Synergies and cooperation - building together
// ============================================================================

/**
 * Creator path eternal upgrades.
 */
export const CREATOR_PATH_UPGRADES: UpgradeDefinition[] = [
	// Tier 1
	{
		id: 'seed_of_life',
		name: 'Seed of Life',
		description: 'Created pixels spread 10% faster to adjacent canvases.',
		flavor: 'Life finds a way.',
		baseCost: 10,
		currency: 'primordial',
		effects: [
			{
				type: 'multiplier',
				target: 'spread_speed',
				description: '+10% spread speed',
				value: 1.1,
				scalesWithLevel: true,
				scalingType: 'linear'
			}
		],
		minPhase: 1,
		category: 'eternal',
		path: 'creator',
		displayOrder: 2000,
		maxLevel: 5,
		costMultiplier: 2.0,
		icon: 'seed',
		colorClass: 'upgrade-eternal-creator'
	},
	{
		id: 'color_memory',
		name: 'Color Memory',
		description: 'Start with your first discovered color.',
		flavor: 'Some things are worth remembering.',
		baseCost: 25,
		currency: 'primordial',
		effects: [
			{
				type: 'passive',
				target: 'all',
				description: 'Keep first color across rebirths',
				bonusId: 'color_memory',
				value: 1
			}
		],
		minPhase: 1,
		requires: ['seed_of_life'],
		category: 'eternal',
		path: 'creator',
		displayOrder: 2010,
		isOneTime: true,
		icon: 'memory',
		colorClass: 'upgrade-eternal-creator'
	},

	// Tier 2
	{
		id: 'cooperation',
		name: 'Cooperation',
		description: 'Multi-canvas bonuses increased by 15%.',
		flavor: 'Together, we are stronger.',
		baseCost: 50,
		currency: 'primordial',
		effects: [
			{
				type: 'multiplier',
				target: 'multi_canvas',
				description: '+15% multi-canvas bonus',
				value: 1.15,
				scalesWithLevel: true,
				scalingType: 'linear'
			}
		],
		minPhase: 1,
		requires: ['color_memory'],
		category: 'eternal',
		path: 'creator',
		displayOrder: 2020,
		maxLevel: 5,
		costMultiplier: 2.5,
		icon: 'coop',
		colorClass: 'upgrade-eternal-creator'
	},
	{
		id: 'pattern_mastery',
		name: 'Pattern Mastery',
		description: 'Pattern detection improved - bonus triggers 20% earlier.',
		flavor: 'See the pattern before it forms.',
		baseCost: 40,
		currency: 'primordial',
		effects: [
			{
				type: 'multiplier',
				target: 'pattern_threshold',
				description: '-20% pattern requirement',
				value: 0.8,
				scalesWithLevel: false
			}
		],
		minPhase: 1,
		requires: ['color_memory'],
		category: 'eternal',
		path: 'creator',
		displayOrder: 2025,
		maxLevel: 3,
		costMultiplier: 3.0,
		icon: 'pattern',
		colorClass: 'upgrade-eternal-creator'
	},

	// Tier 3 (Capstone)
	{
		id: 'symbiosis',
		name: 'Symbiosis',
		description: 'Gallery synergy effect tripled.',
		flavor: 'We are one. We are many.',
		baseCost: 200,
		currency: 'primordial',
		effects: [
			{
				type: 'multiplier',
				target: 'canvas_synergy',
				description: '3x gallery synergy',
				value: 3.0,
				scalesWithLevel: false
			}
		],
		minPhase: 1,
		requires: ['cooperation', 'pattern_mastery'],
		category: 'eternal',
		path: 'creator',
		displayOrder: 2030,
		isOneTime: true,
		icon: 'symbiosis',
		colorClass: 'upgrade-eternal-creator-capstone'
	}
];

// ============================================================================
// Observer Path
// Knowledge and secrets - understanding the deeper truth
// ============================================================================

/**
 * Observer path eternal upgrades.
 */
export const OBSERVER_PATH_UPGRADES: UpgradeDefinition[] = [
	// Tier 1
	{
		id: 'deep_memory',
		name: 'Deep Memory',
		description: 'Retain progress information across rebirths.',
		flavor: 'Knowledge persists beyond cycles.',
		baseCost: 10,
		currency: 'primordial',
		effects: [
			{
				type: 'unlock',
				target: 'all',
				description: 'Show best times and stats',
				unlockId: 'persistent_stats',
				unlockType: 'feature'
			}
		],
		minPhase: 1,
		category: 'eternal',
		path: 'observer',
		displayOrder: 3000,
		isOneTime: true,
		icon: 'memory',
		colorClass: 'upgrade-eternal-observer'
	},
	{
		id: 'keen_eye',
		name: 'Keen Eye',
		description: 'See upgrade costs and effects more clearly.',
		flavor: 'Nothing escapes your notice.',
		baseCost: 15,
		currency: 'primordial',
		effects: [
			{
				type: 'unlock',
				target: 'all',
				description: 'Show detailed upgrade info',
				unlockId: 'detailed_tooltips',
				unlockType: 'feature'
			}
		],
		minPhase: 1,
		requires: ['deep_memory'],
		category: 'eternal',
		path: 'observer',
		displayOrder: 3010,
		isOneTime: true,
		icon: 'eye',
		colorClass: 'upgrade-eternal-observer'
	},

	// Tier 2
	{
		id: 'hidden_sight',
		name: 'Hidden Sight',
		description: 'Reveal hidden mechanics and secret upgrades.',
		flavor: 'What is hidden becomes clear.',
		baseCost: 50,
		currency: 'primordial',
		effects: [
			{
				type: 'unlock',
				target: 'all',
				description: 'See hidden content',
				unlockId: 'reveal_secrets',
				unlockType: 'mechanic'
			}
		],
		minPhase: 1,
		requires: ['keen_eye'],
		category: 'eternal',
		path: 'observer',
		displayOrder: 3020,
		isOneTime: true,
		icon: 'hidden',
		colorClass: 'upgrade-eternal-observer'
	},
	{
		id: 'wisdom_keeper',
		name: 'Wisdom Keeper',
		description: 'Story logs provide small production bonuses.',
		flavor: 'Every thought has value.',
		baseCost: 40,
		currency: 'primordial',
		effects: [
			{
				type: 'multiplier',
				target: 'production',
				description: '+1% per story log',
				value: 1.01,
				scalesWithLevel: true,
				scalingType: 'exponential',
				scalingFactor: 1.01
			}
		],
		minPhase: 1,
		requires: ['keen_eye'],
		category: 'eternal',
		path: 'observer',
		displayOrder: 3025,
		maxLevel: 50,
		costMultiplier: 1.2,
		icon: 'wisdom',
		colorClass: 'upgrade-eternal-observer'
	},

	// Tier 3 (Capstone)
	{
		id: 'true_seeing',
		name: 'True Seeing',
		description: 'Unlock the final truth. See what lies beyond.',
		flavor: '...',
		baseCost: 200,
		currency: 'primordial',
		effects: [
			{
				type: 'unlock',
				target: 'all',
				description: 'Unlock true ending path',
				unlockId: 'true_ending_path',
				unlockType: 'mechanic'
			}
		],
		minPhase: 1,
		requires: ['hidden_sight', 'wisdom_keeper'],
		category: 'eternal',
		path: 'observer',
		displayOrder: 3030,
		isOneTime: true,
		icon: 'truth',
		colorClass: 'upgrade-eternal-observer-capstone'
	}
];

// ============================================================================
// All Eternal Upgrades
// ============================================================================

/**
 * All eternal upgrade definitions.
 */
export const ETERNAL_UPGRADES: UpgradeDefinition[] = [
	...CONSUMER_PATH_UPGRADES,
	...CREATOR_PATH_UPGRADES,
	...OBSERVER_PATH_UPGRADES
];

/**
 * Get eternal upgrades for a specific path.
 *
 * @param path - Skill tree path
 * @returns Array of upgrade definitions for that path
 */
export function getEternalUpgradesByPath(
	path: 'consumer' | 'creator' | 'observer'
): UpgradeDefinition[] {
	switch (path) {
		case 'consumer':
			return CONSUMER_PATH_UPGRADES;
		case 'creator':
			return CREATOR_PATH_UPGRADES;
		case 'observer':
			return OBSERVER_PATH_UPGRADES;
		default:
			return [];
	}
}

/**
 * Get the capstone upgrade for a path.
 *
 * @param path - Skill tree path
 * @returns Capstone upgrade definition or undefined
 */
export function getPathCapstone(
	path: 'consumer' | 'creator' | 'observer'
): UpgradeDefinition | undefined {
	switch (path) {
		case 'consumer':
			return ETERNAL_UPGRADES.find((u) => u.id === 'endless_hunger');
		case 'creator':
			return ETERNAL_UPGRADES.find((u) => u.id === 'symbiosis');
		case 'observer':
			return ETERNAL_UPGRADES.find((u) => u.id === 'true_seeing');
		default:
			return undefined;
	}
}

/**
 * Check if all path capstones are owned.
 *
 * @param ownedIds - Set of owned upgrade IDs
 * @returns Whether ascension is available
 */
export function canAscend(ownedIds: Set<string>): boolean {
	return (
		ownedIds.has('endless_hunger') && ownedIds.has('symbiosis') && ownedIds.has('true_seeing')
	);
}
