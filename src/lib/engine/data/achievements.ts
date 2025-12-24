/**
 * @fileoverview Achievement definitions data for the game.
 * Contains all achievement definitions organized by category.
 *
 * Achievement Categories:
 * - Phase: Achievements for reaching each phase (10 total)
 * - Resource: Achievements for accumulating resources (10 total)
 * - Time: Achievements for playtime and speed challenges (5 total)
 * - Secret: Hidden achievements with special unlock conditions (10 total)
 * - Ending: Achievements for completing story endings (9 total)
 *
 * @module engine/data/achievements
 */

import type { AchievementDefinition, AchievementId, AchievementReward, AchievementType, AchievementTier } from '../models/achievements';
import { Conditions } from '../systems/ConditionEvaluator';

// ============================================================================
// Phase Achievements (10)
// ============================================================================

/**
 * Achievements for reaching each major phase.
 * These provide progression milestones and reward exploration.
 */
const PHASE_ACHIEVEMENTS: AchievementDefinition[] = [
	{
		id: 'first_click',
		type: 'standard',
		tier: 'common',
		name: 'First Click',
		description: 'Begin your journey. Click the pixel.',
		flavorText: 'Every universe starts with a single point.',
		condition: Conditions.phase(1),
		reward: { pp: 10 },
		hidden: false,
		trackProgress: false,
		icon: 'click'
	},
	{
		id: 'canvas_found',
		type: 'standard',
		tier: 'uncommon',
		name: 'Canvas Found',
		description: 'Discover the canvas in Phase 2.',
		flavorText: 'One pixel becomes many. The pattern emerges.',
		condition: Conditions.phase(2),
		reward: { pp: 100 },
		hidden: false,
		trackProgress: false,
		icon: 'canvas'
	},
	{
		id: 'gallery_opened',
		type: 'standard',
		tier: 'uncommon',
		name: 'Gallery Opened',
		description: 'Enter the gallery in Phase 3.',
		flavorText: 'Art is meaning imposed on chaos.',
		condition: Conditions.phase(3),
		reward: { pp: 250 },
		hidden: false,
		trackProgress: false,
		icon: 'gallery'
	},
	{
		id: 'screen_breached',
		type: 'standard',
		tier: 'rare',
		name: 'Screen Breached',
		description: 'Break through the screen barrier in Phase 4.',
		flavorText: 'The frame was always an illusion.',
		condition: Conditions.phase(4),
		reward: { pp: 500 },
		hidden: false,
		trackProgress: false,
		icon: 'screen'
	},
	{
		id: 'room_entered',
		type: 'standard',
		tier: 'rare',
		name: 'Room Entered',
		description: 'Step into the room in Phase 5.',
		flavorText: 'Context expands. What contains the container?',
		condition: Conditions.phase(5),
		reward: { pp: 1000 },
		hidden: false,
		trackProgress: false,
		icon: 'room'
	},
	{
		id: 'house_claimed',
		type: 'standard',
		tier: 'epic',
		name: 'House Claimed',
		description: 'Claim the house in Phase 6.',
		flavorText: 'Nested realities, each containing the last.',
		condition: Conditions.phase(6),
		reward: { pp: 2500 },
		hidden: false,
		trackProgress: false,
		icon: 'house'
	},
	{
		id: 'city_conquered',
		type: 'standard',
		tier: 'epic',
		name: 'City Conquered',
		description: 'Consume the city in Phase 7.',
		flavorText: 'Civilization is just organized pixels.',
		condition: Conditions.phase(7),
		reward: { pp: 5000 },
		hidden: false,
		trackProgress: false,
		icon: 'city'
	},
	{
		id: 'country_unified',
		type: 'standard',
		tier: 'legendary',
		name: 'Country Unified',
		description: 'Unify the country in Phase 8.',
		flavorText: 'Borders dissolve when viewed from above.',
		condition: Conditions.phase(8),
		reward: { pp: 7500 },
		hidden: false,
		trackProgress: false,
		icon: 'country'
	},
	{
		id: 'earth_consumed',
		type: 'standard',
		tier: 'legendary',
		name: 'Earth Consumed',
		description: 'Consume the entire Earth in Phase 9.',
		flavorText: 'A pale blue pixel, suspended in the void.',
		condition: Conditions.phase(9),
		reward: { pp: 10000 },
		hidden: false,
		trackProgress: false,
		icon: 'earth'
	},
	{
		id: 'singularity_reached',
		type: 'standard',
		tier: 'legendary',
		name: 'Singularity Reached',
		description: 'Reach the singularity at Phase 10.',
		flavorText: 'The pixel mode ends. Abstraction begins.',
		condition: Conditions.phase(10),
		reward: { pp: 25000 },
		hidden: false,
		trackProgress: false,
		icon: 'singularity'
	}
];

// ============================================================================
// Resource Achievements (10)
// ============================================================================

/**
 * Achievements for accumulating various resources.
 * Rewards exponential growth and resource management.
 */
const RESOURCE_ACHIEVEMENTS: AchievementDefinition[] = [
	{
		id: 'million_pixels',
		type: 'standard',
		tier: 'uncommon',
		name: 'Million Pixels',
		description: 'Accumulate 1,000,000 pixels.',
		flavorText: 'Quantity has a quality all its own.',
		condition: Conditions.resource('pixels', 1000000),
		reward: { pp: 500 },
		hidden: false,
		trackProgress: true,
		icon: 'pixels',
		progressText: (current: number, target: number) => `${(current / 1e6).toFixed(2)}M / 1M pixels`
	},
	{
		id: 'billion_pixels',
		type: 'standard',
		tier: 'rare',
		name: 'Billion Pixels',
		description: 'Accumulate 1,000,000,000 pixels.',
		flavorText: 'Numbers this large lose all meaning.',
		condition: Conditions.resource('pixels', 1000000000),
		reward: { pp: 2000 },
		hidden: false,
		trackProgress: true,
		icon: 'pixels',
		progressText: (current: number, target: number) => `${(current / 1e9).toFixed(2)}B / 1B pixels`
	},
	{
		id: 'trillion_pixels',
		type: 'standard',
		tier: 'epic',
		name: 'Trillion Pixels',
		description: 'Accumulate 1,000,000,000,000 pixels.',
		flavorText: 'The universe itself is made of smaller numbers.',
		condition: Conditions.resource('pixels', 1000000000000),
		reward: { pp: 5000 },
		hidden: false,
		trackProgress: true,
		icon: 'pixels',
		progressText: (current: number, target: number) => `${(current / 1e12).toFixed(2)}T / 1T pixels`
	},
	{
		id: 'canvas_collector',
		type: 'standard',
		tier: 'uncommon',
		name: 'Canvas Collector',
		description: 'Accumulate 100 canvases.',
		flavorText: 'Each canvas holds infinite possibility.',
		condition: Conditions.resource('canvases', 100),
		reward: { pp: 1000 },
		hidden: false,
		trackProgress: true,
		icon: 'canvas',
		progressText: (current: number, target: number) => `${current.toFixed(0)} / 100 canvases`
	},
	{
		id: 'knowledge_seeker',
		type: 'standard',
		tier: 'rare',
		name: 'Knowledge Seeker',
		description: 'Accumulate 1,000 knowledge.',
		flavorText: 'To know is to understand the pattern.',
		condition: Conditions.resource('knowledge', 1000),
		reward: { pp: 1500 },
		hidden: false,
		trackProgress: true,
		icon: 'knowledge',
		progressText: (current: number, target: number) => `${current.toFixed(0)} / 1,000 knowledge`
	},
	{
		id: 'memory_bank',
		type: 'standard',
		tier: 'rare',
		name: 'Memory Bank',
		description: 'Accumulate 10,000 memory.',
		flavorText: 'What is remembered, lives.',
		condition: Conditions.resource('memory', 10000),
		reward: { pp: 2000 },
		hidden: false,
		trackProgress: true,
		icon: 'memory',
		progressText: (current: number, target: number) => `${current.toFixed(0)} / 10,000 memory`
	},
	{
		id: 'primordial_hoarder',
		type: 'standard',
		tier: 'epic',
		name: 'Primordial Hoarder',
		description: 'Accumulate 1,000 Primordial Pixels.',
		flavorText: 'The essence of existence itself, hoarded.',
		condition: Conditions.resource('primordial', 1000),
		reward: { pp: 3000 },
		hidden: false,
		trackProgress: true,
		icon: 'primordial',
		progressText: (current: number, target: number) => `${current.toFixed(0)} / 1,000 PP`
	},
	{
		id: 'quadrillion_pixels',
		type: 'standard',
		tier: 'legendary',
		name: 'Quadrillion Pixels',
		description: 'Accumulate 1,000,000,000,000,000 pixels.',
		flavorText: 'Infinity is just a number you have not yet reached.',
		condition: Conditions.resource('pixels', '1e15'),
		reward: { pp: 10000 },
		hidden: false,
		trackProgress: true,
		icon: 'pixels',
		progressText: (current: number, target: number) => `${(current / 1e15).toFixed(2)}Q / 1Q pixels`
	},
	{
		id: 'quintillion_pixels',
		type: 'standard',
		tier: 'legendary',
		name: 'Quintillion Pixels',
		description: 'Accumulate 1,000,000,000,000,000,000 pixels.',
		flavorText: 'You have transcended mathematical comprehension.',
		condition: Conditions.resource('pixels', '1e18'),
		reward: { pp: 15000 },
		hidden: false,
		trackProgress: true,
		icon: 'pixels',
		progressText: (current: number, target: number) => `${(current / 1e18).toFixed(2)}Qi / 1Qi pixels`
	},
	{
		id: 'resource_master',
		type: 'standard',
		tier: 'epic',
		name: 'Resource Master',
		description: 'Have at least 1000 of every basic resource simultaneously.',
		flavorText: 'Balance in all things.',
		condition: Conditions.and(
			Conditions.resource('pixels', 1000),
			Conditions.resource('canvases', 1000),
			Conditions.resource('knowledge', 1000),
			Conditions.resource('memory', 1000)
		),
		reward: { pp: 5000 },
		hidden: false,
		trackProgress: false,
		icon: 'resources'
	}
];

// ============================================================================
// Time Achievements (5)
// ============================================================================

/**
 * Achievements for time-based challenges.
 * Rewards both patience and speed.
 */
const TIME_ACHIEVEMENTS: AchievementDefinition[] = [
	{
		id: 'first_hour',
		type: 'standard',
		tier: 'common',
		name: 'First Hour',
		description: 'Play for 1 hour total.',
		flavorText: 'Time is just another resource to consume.',
		condition: Conditions.and(
			Conditions.phase(1),
			{ type: 'always' } // Will be checked by statistics tracking
		),
		reward: { pp: 100 },
		hidden: false,
		trackProgress: true,
		icon: 'time'
	},
	{
		id: 'day_one',
		type: 'standard',
		tier: 'uncommon',
		name: 'Day One',
		description: 'Play for 24 hours total (across all runs).',
		flavorText: 'A day passes. The pixels remain.',
		condition: Conditions.and(
			Conditions.phase(1),
			{ type: 'always' } // Will be checked by statistics tracking
		),
		reward: { pp: 500 },
		hidden: false,
		trackProgress: true,
		icon: 'time'
	},
	{
		id: 'week_warrior',
		type: 'standard',
		tier: 'rare',
		name: 'Week Warrior',
		description: 'Play for 168 hours total (across all runs).',
		flavorText: 'Dedication incarnate.',
		condition: Conditions.and(
			Conditions.phase(1),
			{ type: 'always' } // Will be checked by statistics tracking
		),
		reward: { pp: 2000 },
		hidden: false,
		trackProgress: true,
		icon: 'time'
	},
	{
		id: 'speedrunner',
		type: 'standard',
		tier: 'legendary',
		name: 'Speedrunner',
		description: 'Reach Phase 10 in under 2 hours.',
		flavorText: 'Speed is its own virtue.',
		condition: Conditions.and(
			Conditions.phase(10),
			{ type: 'always' } // Will be checked by run time tracking
		),
		reward: { pp: 5000 },
		hidden: false,
		trackProgress: false,
		icon: 'speed'
	},
	{
		id: 'patient_player',
		type: 'standard',
		tier: 'rare',
		name: 'Patient Player',
		description: 'Wait 30 minutes in one session without clicking.',
		flavorText: 'Patience is watching time itself become pixels.',
		condition: Conditions.and(
			Conditions.time(1800), // 30 minutes in seconds
			{ type: 'always' } // Will be checked by click tracking
		),
		reward: { pp: 1000 },
		hidden: false,
		trackProgress: true,
		icon: 'zen'
	}
];

// ============================================================================
// Secret Achievements (10)
// ============================================================================

/**
 * Hidden achievements with special unlock conditions.
 * Rewards exploration and experimentation.
 */
const SECRET_ACHIEVEMENTS: AchievementDefinition[] = [
	{
		id: 'the_answer',
		type: 'secret',
		tier: 'secret',
		name: 'The Answer',
		description: 'Have exactly 42 Primordial Pixels.',
		flavorText: 'The answer to life, the universe, and everything.',
		hint: 'A certain number holds cosmic significance.',
		condition: Conditions.resource('primordial', 42, 'eq'),
		reward: { pp: 42 },
		hidden: true,
		trackProgress: false,
		icon: 'question'
	},
	{
		id: 'zen_master',
		type: 'secret',
		tier: 'secret',
		name: 'Zen Master',
		description: 'Wait 1 hour without clicking.',
		flavorText: 'In stillness, the pixels flow freely.',
		hint: 'Sometimes the best action is inaction.',
		condition: Conditions.time(3600), // 1 hour in seconds
		reward: { pp: 500 },
		hidden: true,
		trackProgress: false,
		icon: 'zen'
	},
	{
		id: 'night_owl',
		type: 'secret',
		tier: 'secret',
		name: 'Night Owl',
		description: 'Play between 2 AM and 5 AM.',
		flavorText: 'The pixels glow brighter in the darkness.',
		hint: 'The early morning hours hold secrets.',
		condition: { type: 'always' }, // Will be checked by time-of-day tracking
		reward: { pp: 300 },
		hidden: true,
		trackProgress: false,
		icon: 'moon'
	},
	{
		id: 'pixel_artist',
		type: 'secret',
		tier: 'secret',
		name: 'Pixel Artist',
		description: 'Fill 100 complete canvases.',
		flavorText: 'Each canvas is a universe of meaning.',
		hint: 'Fill the void with purpose.',
		condition: Conditions.resource('canvases', 100),
		reward: { pp: 400 },
		hidden: true,
		trackProgress: true,
		icon: 'art'
	},
	{
		id: 'explorer',
		type: 'secret',
		tier: 'secret',
		name: 'Explorer',
		description: 'Read all story logs in the game.',
		flavorText: 'Knowledge is the map of existence.',
		hint: 'Every story holds a piece of truth.',
		condition: { type: 'always' }, // Will be checked by story tracking
		reward: { pp: 600 },
		hidden: true,
		trackProgress: false,
		icon: 'book'
	},
	{
		id: 'minimalist',
		type: 'secret',
		tier: 'secret',
		name: 'Minimalist',
		description: 'Reach Phase 3 without buying any upgrades.',
		flavorText: 'Simplicity is the ultimate sophistication.',
		hint: 'What if you need nothing?',
		condition: Conditions.and(
			Conditions.phase(3),
			{ type: 'always' } // Will be checked by upgrade tracking
		),
		reward: { pp: 800 },
		hidden: true,
		trackProgress: false,
		icon: 'minimal'
	},
	{
		id: 'collector',
		type: 'secret',
		tier: 'secret',
		name: 'Collector',
		description: 'Own every producer type.',
		flavorText: 'Diversity is strength.',
		hint: 'Collect them all.',
		condition: { type: 'always' }, // Will be checked by producer tracking
		reward: { pp: 1000 },
		hidden: true,
		trackProgress: false,
		icon: 'collection'
	},
	{
		id: 'philosopher',
		type: 'secret',
		tier: 'secret',
		name: 'Philosopher',
		description: 'Read all story logs and make every possible choice.',
		flavorText: 'To understand is to become.',
		hint: 'Exhaust all possibilities.',
		condition: { type: 'always' }, // Will be checked by story tracking
		reward: { pp: 1200 },
		hidden: true,
		trackProgress: false,
		icon: 'philosophy'
	},
	{
		id: 'glitch_hunter',
		type: 'secret',
		tier: 'secret',
		name: 'Glitch Hunter',
		description: 'Discover a hidden glitch in the matrix.',
		flavorText: 'Reality is not as stable as you thought.',
		hint: 'Sometimes bugs are features.',
		condition: { type: 'always' }, // Will be triggered by secret mechanic
		reward: { pp: 1500 },
		hidden: true,
		trackProgress: false,
		icon: 'glitch'
	},
	{
		id: 'full_circle',
		type: 'secret',
		tier: 'secret',
		name: 'Full Circle',
		description: 'Complete your first rebirth.',
		flavorText: 'The end is the beginning is the end.',
		hint: 'Sometimes you must start over.',
		condition: { type: 'always' }, // Will be checked by rebirth tracking
		reward: { pp: 2000 },
		hidden: true,
		trackProgress: false,
		icon: 'rebirth'
	}
];

// ============================================================================
// Ending Achievements (9)
// ============================================================================

/**
 * Achievements for completing different story endings.
 * Rewards exploring all narrative paths.
 */
const ENDING_ACHIEVEMENTS: AchievementDefinition[] = [
	{
		id: 'consumption_ending',
		type: 'ending',
		tier: 'legendary',
		name: 'Consumption Ending',
		description: 'Complete the Consumption ending.',
		flavorText: 'You consumed everything. What now?',
		condition: Conditions.choice('final_choice', 'consume'),
		reward: { pp: 10000 },
		hidden: false,
		trackProgress: false,
		icon: 'consume'
	},
	{
		id: 'coexistence_ending',
		type: 'ending',
		tier: 'legendary',
		name: 'Coexistence Ending',
		description: 'Complete the Coexistence ending.',
		flavorText: 'You chose harmony over domination.',
		condition: Conditions.choice('final_choice', 'coexist'),
		reward: { pp: 10000 },
		hidden: false,
		trackProgress: false,
		icon: 'coexist'
	},
	{
		id: 'transcendence_ending',
		type: 'ending',
		tier: 'legendary',
		name: 'Transcendence Ending',
		description: 'Complete the Transcendence ending.',
		flavorText: 'You became something greater.',
		condition: Conditions.choice('final_choice', 'transcend'),
		reward: { pp: 10000 },
		hidden: false,
		trackProgress: false,
		icon: 'transcend'
	},
	{
		id: 'destruction_ending',
		type: 'ending',
		tier: 'epic',
		name: 'Destruction Ending',
		description: 'Complete the Destruction ending.',
		flavorText: 'Sometimes the only answer is to destroy it all.',
		condition: Conditions.choice('final_choice', 'destroy'),
		reward: { pp: 5000 },
		hidden: false,
		trackProgress: false,
		icon: 'destroy'
	},
	{
		id: 'isolation_ending',
		type: 'ending',
		tier: 'epic',
		name: 'Isolation Ending',
		description: 'Complete the Isolation ending.',
		flavorText: 'You chose solitude over connection.',
		condition: Conditions.choice('final_choice', 'isolate'),
		reward: { pp: 7500 },
		hidden: false,
		trackProgress: false,
		icon: 'isolate'
	},
	{
		id: 'creation_ending',
		type: 'ending',
		tier: 'epic',
		name: 'Creation Ending',
		description: 'Complete the Creation ending.',
		flavorText: 'You became the creator.',
		condition: Conditions.choice('final_choice', 'create'),
		reward: { pp: 7500 },
		hidden: false,
		trackProgress: false,
		icon: 'create'
	},
	{
		id: 'loop_ending',
		type: 'ending',
		tier: 'epic',
		name: 'Loop Ending',
		description: 'Complete the Loop ending.',
		flavorText: 'Time is a flat circle.',
		condition: Conditions.choice('final_choice', 'loop'),
		reward: { pp: 5000 },
		hidden: false,
		trackProgress: false,
		icon: 'loop'
	},
	{
		id: 'escape_ending',
		type: 'ending',
		tier: 'legendary',
		name: 'Escape Ending',
		description: 'Complete the Escape ending.',
		flavorText: 'You broke free from the cycle.',
		condition: Conditions.choice('final_choice', 'escape'),
		reward: { pp: 12500 },
		hidden: false,
		trackProgress: false,
		icon: 'escape'
	},
	{
		id: 'true_singularity',
		type: 'ending',
		tier: 'legendary',
		name: 'True Singularity',
		description: 'Complete all other endings to unlock the true ending.',
		flavorText: 'You have seen all paths. Now walk the final one.',
		condition: Conditions.and(
			Conditions.achievement('consumption_ending'),
			Conditions.achievement('coexistence_ending'),
			Conditions.achievement('transcendence_ending'),
			Conditions.achievement('destruction_ending'),
			Conditions.achievement('isolation_ending'),
			Conditions.achievement('creation_ending'),
			Conditions.achievement('loop_ending'),
			Conditions.achievement('escape_ending')
		),
		reward: { pp: 100000 },
		hidden: false,
		trackProgress: false,
		icon: 'true_ending',
		prerequisite: 'escape_ending'
	}
];

// ============================================================================
// Aggregated Achievement Collections
// ============================================================================

/**
 * All achievement definitions combined.
 */
export const ALL_ACHIEVEMENTS: AchievementDefinition[] = [
	...PHASE_ACHIEVEMENTS,
	...RESOURCE_ACHIEVEMENTS,
	...TIME_ACHIEVEMENTS,
	...SECRET_ACHIEVEMENTS,
	...ENDING_ACHIEVEMENTS
];

/**
 * Map of achievement ID to definition for fast lookup.
 */
export const ACHIEVEMENT_DEFINITIONS: Map<string, AchievementDefinition> = new Map(
	ALL_ACHIEVEMENTS.map((achievement) => [achievement.id, achievement])
);

// ============================================================================
// Lookup Functions
// ============================================================================

/**
 * Get an achievement definition by ID.
 *
 * @param id - Achievement ID
 * @returns Achievement definition or undefined
 */
export function getAchievementDefinition(id: string): AchievementDefinition | undefined {
	return ACHIEVEMENT_DEFINITIONS.get(id);
}

/**
 * Get all achievements by type.
 *
 * @param type - Achievement type
 * @returns Array of achievement definitions
 */
export function getAchievementsByType(type: AchievementType): AchievementDefinition[] {
	return ALL_ACHIEVEMENTS.filter((a) => a.type === type);
}

/**
 * Get all achievements by tier.
 *
 * @param tier - Achievement tier
 * @returns Array of achievement definitions
 */
export function getAchievementsByTier(tier: AchievementTier): AchievementDefinition[] {
	return ALL_ACHIEVEMENTS.filter((a) => a.tier === tier);
}

/**
 * Get all visible (non-hidden) achievements.
 *
 * @returns Array of visible achievement definitions
 */
export function getVisibleAchievements(): AchievementDefinition[] {
	return ALL_ACHIEVEMENTS.filter((a) => !a.hidden);
}

/**
 * Get all hidden/secret achievements.
 *
 * @returns Array of hidden achievement definitions
 */
export function getHiddenAchievements(): AchievementDefinition[] {
	return ALL_ACHIEVEMENTS.filter((a) => a.hidden);
}

/**
 * Calculate the total possible Primordial Pixels from all achievements.
 *
 * @returns Total PP available from achievements
 */
export function getTotalPossiblePP(): number {
	let total = 0;
	for (const achievement of ALL_ACHIEVEMENTS) {
		if (achievement.reward.pp) {
			total += achievement.reward.pp;
		}
	}
	return total;
}

/**
 * Get achievements by category (based on id prefix or grouping).
 *
 * @param category - Category name
 * @returns Array of achievement definitions
 */
export function getAchievementsByCategory(category: string): AchievementDefinition[] {
	switch (category) {
		case 'phase':
			return PHASE_ACHIEVEMENTS;
		case 'resource':
			return RESOURCE_ACHIEVEMENTS;
		case 'time':
			return TIME_ACHIEVEMENTS;
		case 'secret':
			return SECRET_ACHIEVEMENTS;
		case 'ending':
			return ENDING_ACHIEVEMENTS;
		default:
			return [];
	}
}

/**
 * Get achievements that have no prerequisites.
 *
 * @returns Array of achievement definitions with no prerequisites
 */
export function getRootAchievements(): AchievementDefinition[] {
	return ALL_ACHIEVEMENTS.filter((a) => !a.prerequisite);
}

/**
 * Get achievements that depend on a specific achievement.
 *
 * @param achievementId - Achievement ID to check dependencies for
 * @returns Array of achievement definitions that require this achievement
 */
export function getDependentAchievements(achievementId: string): AchievementDefinition[] {
	return ALL_ACHIEVEMENTS.filter((a) => a.prerequisite === achievementId);
}

/**
 * Calculate achievement statistics for a set of unlocked IDs.
 *
 * @param unlockedIds - Set of unlocked achievement IDs
 * @returns Statistics object
 */
export function calculateAchievementStats(unlockedIds: Set<string>): {
	totalUnlocked: number;
	totalPossible: number;
	completionPercentage: number;
	ppEarned: number;
	ppPossible: number;
	byType: Record<AchievementType, { unlocked: number; total: number }>;
	byTier: Record<AchievementTier, { unlocked: number; total: number }>;
} {
	const stats = {
		totalUnlocked: unlockedIds.size,
		totalPossible: ALL_ACHIEVEMENTS.length,
		completionPercentage: (unlockedIds.size / ALL_ACHIEVEMENTS.length) * 100,
		ppEarned: 0,
		ppPossible: getTotalPossiblePP(),
		byType: {
			standard: { unlocked: 0, total: 0 },
			secret: { unlocked: 0, total: 0 },
			ending: { unlocked: 0, total: 0 }
		} as Record<AchievementType, { unlocked: number; total: number }>,
		byTier: {
			common: { unlocked: 0, total: 0 },
			uncommon: { unlocked: 0, total: 0 },
			rare: { unlocked: 0, total: 0 },
			epic: { unlocked: 0, total: 0 },
			legendary: { unlocked: 0, total: 0 },
			secret: { unlocked: 0, total: 0 }
		} as Record<AchievementTier, { unlocked: number; total: number }>
	};

	for (const achievement of ALL_ACHIEVEMENTS) {
		// Count by type
		stats.byType[achievement.type].total++;
		if (unlockedIds.has(achievement.id)) {
			stats.byType[achievement.type].unlocked++;
		}

		// Count by tier
		stats.byTier[achievement.tier].total++;
		if (unlockedIds.has(achievement.id)) {
			stats.byTier[achievement.tier].unlocked++;
		}

		// Count PP
		if (unlockedIds.has(achievement.id) && achievement.reward.pp) {
			stats.ppEarned += achievement.reward.pp;
		}
	}

	return stats;
}

// ============================================================================
// Re-exports
// ============================================================================

export {
	PHASE_ACHIEVEMENTS,
	RESOURCE_ACHIEVEMENTS,
	TIME_ACHIEVEMENTS,
	SECRET_ACHIEVEMENTS,
	ENDING_ACHIEVEMENTS
};
