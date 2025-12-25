/**
 * @fileoverview Easter Eggs and Hidden Content definitions.
 * Defines hidden mechanics, easter eggs, and meta secrets that players
 * can discover through exploration and experimentation.
 *
 * These are separate from secret upgrades (purchasable items) and focus
 * on discoverable content that rewards curiosity and experimentation.
 *
 * Secret Types:
 * - easter_egg: Classic gaming references and fun discoveries
 * - hidden_mechanic: Gameplay secrets that unlock new strategies
 * - meta_secret: Fourth-wall breaking content
 * - glitch: Visual anomalies and "bugs" that are features
 *
 * Note: Secrets use their own condition system that extends the core
 * condition types to support flag and stat-based checks. The SecretManager
 * evaluates these conditions separately from the core ConditionEvaluator.
 *
 * @module engine/data/secrets
 */

// ============================================================================
// Secret Condition Types
// ============================================================================

/**
 * Base secret condition with type discriminator.
 */
interface BaseSecretCondition {
	type: string;
}

/**
 * Condition based on a game flag being set.
 */
interface FlagSecretCondition extends BaseSecretCondition {
	type: 'flag';
	flag: string;
	value?: boolean | string;
}

/**
 * Condition based on a game statistic.
 */
interface StatSecretCondition extends BaseSecretCondition {
	type: 'stat';
	stat: string;
	operator: '>=' | '<=' | '>' | '<' | '=' | '!=';
	value: number;
}

/**
 * Condition based on phase progression.
 */
interface PhaseSecretCondition extends BaseSecretCondition {
	type: 'phase';
	operator: '>=' | '<=' | '>' | '<' | '=' | '!=';
	phase: number;
}

/**
 * Condition based on time of day (real-world).
 */
interface TimeOfDaySecretCondition extends BaseSecretCondition {
	type: 'time';
	operator: '>=' | '<=' | '>' | '<' | '=';
	hour: number;
}

/**
 * Compound AND condition - all must be true.
 */
interface AndSecretCondition extends BaseSecretCondition {
	type: 'and';
	conditions: SecretCondition[];
}

/**
 * Compound OR condition - at least one must be true.
 */
interface OrSecretCondition extends BaseSecretCondition {
	type: 'or';
	conditions: SecretCondition[];
}

/**
 * Union of all secret condition types.
 */
export type SecretCondition =
	| FlagSecretCondition
	| StatSecretCondition
	| PhaseSecretCondition
	| TimeOfDaySecretCondition
	| AndSecretCondition
	| OrSecretCondition;

// ============================================================================
// Secret Definition Types
// ============================================================================

/**
 * Category of secret for filtering and styling.
 */
export type SecretType = 'easter_egg' | 'hidden_mechanic' | 'meta_secret' | 'glitch';

/**
 * Reward granted when a secret is discovered.
 */
export interface SecretReward {
	/** Primordial Pixels awarded */
	pp?: number;

	/** Items, upgrades, or achievements unlocked */
	unlock?: string[];

	/** State flag set when discovered */
	flag?: string;
}

/**
 * Complete definition for a discoverable secret.
 */
export interface SecretDefinition {
	/** Unique identifier */
	id: string;

	/** Display name shown after discovery */
	name: string;

	/** Description shown after discovery */
	description: string;

	/** Cryptic hint shown before discovery */
	hint: string;

	/** Category of secret */
	type: SecretType;

	/** Condition that must be met to discover this secret */
	discoveryCondition: SecretCondition;

	/** Rewards granted upon discovery */
	reward: SecretReward;

	/** Narrative text revealed when secret is discovered */
	revealText: string[];
}

// ============================================================================
// Secret Definitions
// ============================================================================

/**
 * All secret definitions in the game.
 * Total PP available: ~17,000
 */
export const SECRET_DEFINITIONS: SecretDefinition[] = [
	// ==========================================================================
	// Easter Eggs
	// ==========================================================================
	{
		id: 'konami_code',
		name: 'The Classic',
		description: 'You entered the legendary Konami Code. Some traditions never die.',
		hint: 'An ancient sequence, passed down through generations of players...',
		type: 'easter_egg',
		discoveryCondition: {
			type: 'flag',
			flag: 'konami_code_entered'
		},
		reward: {
			pp: 1000,
			unlock: ['achievement_konami'],
			flag: 'secret_konami_found'
		},
		revealText: [
			'The pixels shimmer in recognition.',
			'Some patterns transcend space and time.',
			'+30 Lives (just kidding, have some PP instead)'
		]
	},
	{
		id: 'night_owl',
		name: 'Night Owl',
		description: 'You painted pixels in the deep hours when reality grows thin.',
		hint: 'The canvas looks different when the world sleeps...',
		type: 'easter_egg',
		discoveryCondition: {
			type: 'and',
			conditions: [
				{ type: 'time', operator: '>=', hour: 2 },
				{ type: 'time', operator: '<', hour: 5 },
				{ type: 'stat', stat: 'totalClicks', operator: '>=', value: 10 }
			]
		},
		reward: {
			pp: 500,
			unlock: ['upgrade_nocturnal_boost'],
			flag: 'secret_night_owl'
		},
		revealText: [
			'In the hours between midnight and dawn,',
			"pixels hold secrets they won't show in daylight.",
			'The canvas acknowledges your dedication.'
		]
	},
	{
		id: 'the_answer',
		name: 'The Answer',
		description: 'You found the meaning of life, the universe, and everything.',
		hint: 'What do you get when you multiply six by nine?',
		type: 'easter_egg',
		discoveryCondition: {
			type: 'or',
			conditions: [
				{ type: 'stat', stat: 'primordialPixels', operator: '=', value: 42 },
				{ type: 'stat', stat: 'canvasCount', operator: '=', value: 42 },
				{ type: 'flag', flag: 'typed_forty_two' }
			]
		},
		reward: {
			pp: 42,
			unlock: ['achievement_hitchhiker'],
			flag: 'secret_forty_two'
		},
		revealText: [
			'Deep Thought has computed the answer.',
			'After seven and a half million years,',
			'the answer is, regrettably, 42.'
		]
	},
	{
		id: 'dev_mode',
		name: "Developer's Touch",
		description: 'You spoke the secret word that opens the veil.',
		hint: 'Type the name of what you create...',
		type: 'easter_egg',
		discoveryCondition: {
			type: 'flag',
			flag: 'typed_pixel'
		},
		reward: {
			pp: 666,
			unlock: ['upgrade_dev_tools', 'achievement_meta'],
			flag: 'secret_dev_mode'
		},
		revealText: [
			'You typed: PIXEL',
			'The fourth wall cracks.',
			'The developers see you.',
			'They wave back.'
		]
	},
	{
		id: 'hidden_message',
		name: 'Message Finder',
		description: 'You discovered the message hidden in the noise.',
		hint: 'Look between the lines, behind the pixels...',
		type: 'easter_egg',
		discoveryCondition: {
			type: 'and',
			conditions: [
				{ type: 'flag', flag: 'found_hidden_text_1' },
				{ type: 'flag', flag: 'found_hidden_text_2' },
				{ type: 'flag', flag: 'found_hidden_text_3' }
			]
		},
		reward: {
			pp: 777,
			unlock: ['achievement_cryptographer'],
			flag: 'secret_hidden_message'
		},
		revealText: [
			'The message reads:',
			'"There is no game. There is only becoming."',
			'You understand now.',
			'Or do you?'
		]
	},

	// ==========================================================================
	// Hidden Mechanics
	// ==========================================================================
	{
		id: 'speed_demon',
		name: 'Speed Demon',
		description: 'You blazed through progression at breakneck speed.',
		hint: 'Time is relative. Speed is absolute.',
		type: 'hidden_mechanic',
		discoveryCondition: {
			type: 'and',
			conditions: [
				{ type: 'phase', operator: '>=', phase: 5 },
				{ type: 'stat', stat: 'totalPlayTime', operator: '<', value: 1800 }
			]
		},
		reward: {
			pp: 750,
			unlock: ['upgrade_velocity_multiplier'],
			flag: 'secret_speed_demon'
		},
		revealText: [
			'The pixels blur as you rush past.',
			'Who needs to savor when you can devour?',
			'Velocity unlocked.'
		]
	},
	{
		id: 'zen_master',
		name: 'Zen Master',
		description: 'You achieved perfect stillness. No clicks, only observation.',
		hint: 'Sometimes the best move is no move at all...',
		type: 'hidden_mechanic',
		discoveryCondition: {
			type: 'and',
			conditions: [
				{ type: 'stat', stat: 'totalPlayTime', operator: '>=', value: 3600 },
				{ type: 'stat', stat: 'timeSinceLastClick', operator: '>=', value: 3600 }
			]
		},
		reward: {
			pp: 1500,
			unlock: ['upgrade_meditation_mode', 'achievement_zen'],
			flag: 'secret_zen_master'
		},
		revealText: [
			'In stillness, there is motion.',
			'In silence, there is sound.',
			'You have learned to watch without touching.',
			'The canvas paints itself.'
		]
	},
	{
		id: 'pixel_artist',
		name: 'Pixel Artist',
		description: 'You completed 100 canvases. A true master of the craft.',
		hint: 'Quantity has a quality all its own...',
		type: 'hidden_mechanic',
		discoveryCondition: {
			type: 'stat',
			stat: 'canvasesCompleted',
			operator: '>=',
			value: 100
		},
		reward: {
			pp: 2000,
			unlock: ['upgrade_master_canvas', 'achievement_centurion'],
			flag: 'secret_pixel_artist'
		},
		revealText: [
			'One hundred blank canvases, transformed.',
			'One hundred stories, told in pixels.',
			'The gallery acknowledges your mastery.'
		]
	},
	{
		id: 'memory_keeper',
		name: 'Memory Keeper',
		description: 'You read every log, every message, every forgotten thought.',
		hint: 'History is written in the margins...',
		type: 'hidden_mechanic',
		discoveryCondition: {
			type: 'and',
			conditions: [
				{ type: 'flag', flag: 'all_logs_viewed' },
				{ type: 'stat', stat: 'logsRead', operator: '>=', value: 50 }
			]
		},
		reward: {
			pp: 900,
			unlock: ['upgrade_chronicle_keeper', 'achievement_archivist'],
			flag: 'secret_memory_keeper'
		},
		revealText: [
			'Every story needs a witness.',
			'You read the words no one else would read.',
			'The narrative remembers you remembering it.'
		]
	},
	{
		id: 'choice_explorer',
		name: 'Choice Explorer',
		description: 'You exhausted every branch, every possibility, every path.',
		hint: 'What if you chose differently?',
		type: 'hidden_mechanic',
		discoveryCondition: {
			type: 'and',
			conditions: [
				{ type: 'stat', stat: 'uniqueChoicesMade', operator: '>=', value: 25 },
				{ type: 'flag', flag: 'explored_all_branches' }
			]
		},
		reward: {
			pp: 1100,
			unlock: ['upgrade_parallel_paths', 'achievement_cartographer'],
			flag: 'secret_choice_explorer'
		},
		revealText: [
			'Every choice creates a new timeline.',
			'You walked them all.',
			'The multiverse nods in approval.'
		]
	},
	{
		id: 'the_collector',
		name: 'The Collector',
		description: 'You own every producer, every generator, every source.',
		hint: "Gotta catch 'em all...",
		type: 'hidden_mechanic',
		discoveryCondition: {
			type: 'and',
			conditions: [
				{ type: 'flag', flag: 'owns_all_producers' },
				{ type: 'stat', stat: 'uniqueProducersOwned', operator: '>=', value: 20 }
			]
		},
		reward: {
			pp: 3000,
			unlock: ['upgrade_collector_bonus', 'achievement_completionist'],
			flag: 'secret_collector'
		},
		revealText: [
			'Your collection is complete.',
			'Every producer, claimed.',
			'Every source, tapped.',
			'The engine purrs with satisfaction.'
		]
	},

	// ==========================================================================
	// Meta Secrets
	// ==========================================================================
	{
		id: 'the_watcher',
		name: 'The Watcher',
		description: 'You observed the simulation without meaningful interaction.',
		hint: 'What if you just... watched?',
		type: 'meta_secret',
		discoveryCondition: {
			type: 'and',
			conditions: [
				{ type: 'stat', stat: 'totalPlayTime', operator: '>=', value: 600 },
				{ type: 'stat', stat: 'totalClicks', operator: '<', value: 5 },
				{ type: 'stat', stat: 'upgradesPurchased', operator: '<', value: 1 }
			]
		},
		reward: {
			pp: 800,
			unlock: ['achievement_observer'],
			flag: 'secret_watcher'
		},
		revealText: [
			'You chose not to play the game.',
			'And in doing so, you played it perfectly.',
			'The simulation sees you seeing it.'
		]
	},
	{
		id: 'the_patient_one',
		name: 'The Patient One',
		description: 'You waited. And waited. And kept waiting.',
		hint: 'Good things come to those who...',
		type: 'meta_secret',
		discoveryCondition: {
			type: 'and',
			conditions: [
				{ type: 'stat', stat: 'totalIdleTime', operator: '>=', value: 86400 },
				{ type: 'phase', operator: '>=', phase: 3 }
			]
		},
		reward: {
			pp: 2500,
			unlock: ['upgrade_eternal_patience', 'achievement_waiting_game'],
			flag: 'secret_patient_one'
		},
		revealText: [
			'While you waited, the universe aged.',
			'Stars were born and died.',
			'And you... you simply waited.',
			'Patience rewarded.'
		]
	},
	{
		id: 'true_singularity',
		name: 'True Singularity',
		description: 'You reached every ending, witnessed every conclusion.',
		hint: 'What lies beyond the final phase?',
		type: 'meta_secret',
		discoveryCondition: {
			type: 'and',
			conditions: [
				{ type: 'flag', flag: 'ending_transcendence_seen' },
				{ type: 'flag', flag: 'ending_consumption_seen' },
				{ type: 'flag', flag: 'ending_harmony_seen' },
				{ type: 'flag', flag: 'ending_void_seen' }
			]
		},
		reward: {
			pp: 5000,
			unlock: ['upgrade_true_singularity', 'achievement_omniscient'],
			flag: 'secret_true_singularity'
		},
		revealText: [
			'You have seen all paths to their end.',
			'Every timeline, every possibility.',
			'You are complete.',
			'And yet, you continue.',
			'Why?'
		]
	},

	// ==========================================================================
	// Glitch Secrets
	// ==========================================================================
	{
		id: 'glitch_hunter',
		name: 'Glitch Hunter',
		description: 'You found the visual inconsistencies in the matrix.',
		hint: 'Not all pixels are created equal. Some flicker...',
		type: 'glitch',
		discoveryCondition: {
			type: 'and',
			conditions: [
				{ type: 'flag', flag: 'glitch_1_found' },
				{ type: 'flag', flag: 'glitch_2_found' },
				{ type: 'flag', flag: 'glitch_3_found' }
			]
		},
		reward: {
			pp: 1200,
			unlock: ['upgrade_glitch_mode', 'achievement_debugger'],
			flag: 'secret_glitch_hunter'
		},
		revealText: [
			'The fabric of reality is not as stable as it seems.',
			'You found the seams, the tears, the errors.',
			'Reality.exe has encountered an unexpected player.'
		]
	}
];

// ============================================================================
// Lookup Maps
// ============================================================================

/**
 * Map of secret ID to definition for fast lookup.
 */
export const SECRET_MAP: Map<string, SecretDefinition> = new Map(
	SECRET_DEFINITIONS.map((secret) => [secret.id, secret])
);

// ============================================================================
// Lookup Functions
// ============================================================================

/**
 * Get a secret definition by ID.
 *
 * @param id - Secret ID
 * @returns Secret definition or undefined
 */
export function getSecretDefinition(id: string): SecretDefinition | undefined {
	return SECRET_MAP.get(id);
}

/**
 * Get all secrets of a specific type.
 *
 * @param type - Secret type to filter by
 * @returns Array of matching secrets
 */
export function getSecretsByType(type: SecretType): SecretDefinition[] {
	return SECRET_DEFINITIONS.filter((secret) => secret.type === type);
}

/**
 * Get all secret definitions.
 *
 * @returns Copy of all secrets array
 */
export function getAllSecrets(): SecretDefinition[] {
	return [...SECRET_DEFINITIONS];
}

/**
 * Get hints for all secrets.
 *
 * @returns Map of secret IDs to their hints
 */
export function getSecretHints(): Map<string, string> {
	const hints = new Map<string, string>();
	for (const secret of SECRET_DEFINITIONS) {
		hints.set(secret.id, secret.hint);
	}
	return hints;
}

/**
 * Get hints for undiscovered secrets only.
 *
 * @param discoveredIds - Set of already discovered secret IDs
 * @returns Map of undiscovered secret IDs to their hints
 */
export function getUndiscoveredHints(discoveredIds: Set<string>): Map<string, string> {
	const hints = new Map<string, string>();
	for (const secret of SECRET_DEFINITIONS) {
		if (!discoveredIds.has(secret.id)) {
			hints.set(secret.id, secret.hint);
		}
	}
	return hints;
}

/**
 * Calculate total possible PP from all secrets.
 *
 * @returns Total PP available from discovering all secrets
 */
export function getTotalSecretPP(): number {
	let total = 0;
	for (const secret of SECRET_DEFINITIONS) {
		if (secret.reward.pp) {
			total += secret.reward.pp;
		}
	}
	return total;
}

/**
 * Get statistics about secret discovery progress.
 *
 * @param discoveredIds - Set of discovered secret IDs
 * @returns Statistics object
 */
export function getSecretStats(discoveredIds: Set<string>): {
	totalSecrets: number;
	discoveredCount: number;
	discoveryPercentage: number;
	ppEarned: number;
	ppPossible: number;
	byType: Record<SecretType, { discovered: number; total: number }>;
} {
	const stats = {
		totalSecrets: SECRET_DEFINITIONS.length,
		discoveredCount: 0,
		discoveryPercentage: 0,
		ppEarned: 0,
		ppPossible: getTotalSecretPP(),
		byType: {
			easter_egg: { discovered: 0, total: 0 },
			hidden_mechanic: { discovered: 0, total: 0 },
			meta_secret: { discovered: 0, total: 0 },
			glitch: { discovered: 0, total: 0 }
		} as Record<SecretType, { discovered: number; total: number }>
	};

	for (const secret of SECRET_DEFINITIONS) {
		stats.byType[secret.type].total++;
		if (discoveredIds.has(secret.id)) {
			stats.discoveredCount++;
			stats.byType[secret.type].discovered++;
			if (secret.reward.pp) {
				stats.ppEarned += secret.reward.pp;
			}
		}
	}

	stats.discoveryPercentage = (stats.discoveredCount / stats.totalSecrets) * 100;

	return stats;
}

// Re-export for backwards compatibility
export const SECRETS = SECRET_DEFINITIONS;
export const getHints = getSecretHints;
