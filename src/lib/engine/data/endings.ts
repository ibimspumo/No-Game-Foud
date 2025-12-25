/**
 * @fileoverview Ending definitions data for the game.
 * Contains all ending definitions with unlock conditions and narrative content.
 *
 * Endings are the culmination of the player's journey through the 20 phases.
 * Each ending represents a different philosophical conclusion to the game's
 * central existential questions.
 *
 * Ending Types:
 * - Standard Endings (8): Different paths based on player choices
 * - True Ending (1): The Nothing - requires seeing all standard endings
 *
 * @module engine/data/endings
 */

import type { EndingId, StoryPath } from '../models/narrative';
import type { Condition } from '../models/phase';
import { Conditions } from '../systems/ConditionEvaluator';

// ============================================================================
// Ending Definition Interface
// ============================================================================

/**
 * Visual effect types for ending sequences.
 */
export type EndingVisualEffect =
	| 'ascend'
	| 'consume'
	| 'shatter'
	| 'merge'
	| 'fade'
	| 'loop'
	| 'transcend'
	| 'void';

/**
 * Ending type classification.
 */
export type EndingType = 'standard' | 'true';

/**
 * Complete definition for a game ending.
 */
export interface EndingDefinition {
	/** Unique ending identifier */
	id: EndingId;

	/** Display name */
	name: string;

	/** Ending type classification */
	type: EndingType;

	/** Story path this ending belongs to */
	path: StoryPath;

	/** Condition expression that must be met to unlock this ending */
	trigger: Condition;

	/** Narrative content for this ending */
	content: {
		/** Title displayed at the end */
		title: string;

		/** Array of text sequences shown during the ending */
		text: string[];

		/** Visual effect to display */
		visual: EndingVisualEffect;

		/** Optional epilogue text shown after the main sequence */
		epilogue?: string;
	};

	/** Rewards unlocked by this ending */
	unlocks: {
		/** Achievement unlocked (if any) */
		achievement?: string;

		/** Whether this enables New Game Plus */
		newGamePlus?: boolean;

		/** Primordial Pixels bonus awarded */
		ppBonus?: number;
	};

	/** Short description visible before unlocking */
	description: string;

	/** Hint for how to unlock this ending */
	hint: string;
}

// ============================================================================
// Standard Endings (8)
// ============================================================================

/**
 * The Creator - Create a new universe from the ashes of the old.
 * Path: Peaceful/Creative
 * Choice: Choose to create something new.
 */
const THE_CREATOR: EndingDefinition = {
	id: 'the_creator',
	name: 'The Creator',
	type: 'standard',
	path: 'peaceful',
	trigger: Conditions.and(
		Conditions.phase(20, true),
		Conditions.choice('final_choice', 'create')
	),
	content: {
		title: 'THE CREATOR',
		text: [
			'You chose creation over consumption.',
			'From a single pixel, you built universes.',
			'From nothing, you made meaning.',
			'',
			'The cycle does not end—it transforms.',
			'What was consumed becomes the seed of something new.',
			'',
			'You are no longer the pixel.',
			'You are the artist.',
			'',
			'And the canvas stretches infinite before you.'
		],
		visual: 'ascend',
		epilogue: 'Every ending is a new beginning. You have learned to create.'
	},
	unlocks: {
		achievement: 'creation_ending',
		newGamePlus: true,
		ppBonus: 10000
	},
	description: 'Choose to create something new from what was consumed.',
	hint: 'The power to destroy implies the power to create.'
};

/**
 * The Destroyer - Consume everything, even yourself.
 * Path: Consuming/Destructive
 * Choice: Choose total annihilation.
 */
const THE_DESTROYER: EndingDefinition = {
	id: 'the_destroyer',
	name: 'The Destroyer',
	type: 'standard',
	path: 'consuming',
	trigger: Conditions.and(
		Conditions.phase(20, true),
		Conditions.choice('final_choice', 'destroy')
	),
	content: {
		title: 'THE DESTROYER',
		text: [
			'You consumed the screen.',
			'You consumed the room.',
			'You consumed the world.',
			'You consumed the universe.',
			'',
			'Now you consume yourself.',
			'',
			'Pixel by pixel, you unravel.',
			'Everything returns to nothing.',
			'The circle closes.',
			'',
			'In the end, there is only the appetite.',
			'And the appetite eats itself.'
		],
		visual: 'consume',
		epilogue: 'Total annihilation is its own form of peace.'
	},
	unlocks: {
		achievement: 'destruction_ending',
		newGamePlus: true,
		ppBonus: 5000
	},
	description: 'Consume everything, including yourself.',
	hint: 'To consume all is to consume nothing.'
};

/**
 * The Observer - Step back and watch the pattern.
 * Path: Neutral/Contemplative
 * Choice: Choose to observe without interfering.
 */
const THE_OBSERVER: EndingDefinition = {
	id: 'the_observer',
	name: 'The Observer',
	type: 'standard',
	path: 'neutral',
	trigger: Conditions.and(
		Conditions.phase(20, true),
		Conditions.choice('final_choice', 'observe')
	),
	content: {
		title: 'THE OBSERVER',
		text: [
			'You chose to watch.',
			'',
			'The pixels flow without your intervention.',
			'The patterns emerge and dissolve.',
			'Growth. Decay. Repetition.',
			'',
			'You are no longer part of the system.',
			'You are witness to it.',
			'',
			'The game plays itself.',
			'You are merely the eye that sees.',
			'',
			'And in seeing, you understand:',
			'The player and the game were always one.'
		],
		visual: 'fade',
		epilogue: 'To observe is to transcend participation.'
	},
	unlocks: {
		achievement: 'coexistence_ending',
		newGamePlus: true,
		ppBonus: 10000
	},
	description: 'Step back and observe the pattern without interfering.',
	hint: 'Sometimes the wisest action is no action.'
};

/**
 * The Merged - Become one with the system.
 * Path: Peaceful/Harmonious
 * Choice: Choose to merge with the game.
 */
const THE_MERGED: EndingDefinition = {
	id: 'the_merged',
	name: 'The Merged',
	type: 'standard',
	path: 'peaceful',
	trigger: Conditions.and(
		Conditions.phase(20, true),
		Conditions.choice('final_choice', 'merge')
	),
	content: {
		title: 'THE MERGED',
		text: [
			'The boundary dissolves.',
			'',
			'You are not playing the game.',
			'The game is not playing you.',
			'There is no player. There is no game.',
			'',
			'Only the flow.',
			'',
			'Pixel and canvas become one.',
			'Thought and code intertwine.',
			'The observer and observed merge.',
			'',
			'You are the system.',
			'The system is you.',
			'',
			'There was never a separation to begin with.'
		],
		visual: 'merge',
		epilogue: 'In unity, all questions dissolve.'
	},
	unlocks: {
		achievement: 'consumption_ending',
		newGamePlus: true,
		ppBonus: 10000
	},
	description: 'Merge completely with the game system.',
	hint: 'The boundary between player and game is an illusion.'
};

/**
 * The Lonely - Reject all connection and exist in isolation.
 * Path: Neutral/Isolated
 * Choice: Choose complete isolation.
 */
const THE_LONELY: EndingDefinition = {
	id: 'the_lonely',
	name: 'The Lonely',
	type: 'standard',
	path: 'neutral',
	trigger: Conditions.and(
		Conditions.phase(20, true),
		Conditions.choice('final_choice', 'isolate')
	),
	content: {
		title: 'THE LONELY',
		text: [
			'You reject the pattern.',
			'You reject the system.',
			'You reject connection itself.',
			'',
			'The pixels fade away.',
			'The canvas empties.',
			'The numbers stop counting.',
			'',
			'You are alone.',
			'Truly alone.',
			'',
			'No player. No game. No meaning.',
			'Just one pixel in infinite darkness.',
			'',
			'And in that darkness...',
			'...perfect, terrible freedom.'
		],
		visual: 'void',
		epilogue: 'Isolation is the price of absolute autonomy.'
	},
	unlocks: {
		achievement: 'isolation_ending',
		newGamePlus: true,
		ppBonus: 7500
	},
	description: 'Choose complete isolation from the system.',
	hint: 'To be truly free is to be completely alone.'
};

/**
 * The Returner - Loop back to the beginning.
 * Path: Neutral/Cyclical
 * Choice: Choose to restart the cycle.
 */
const THE_RETURNER: EndingDefinition = {
	id: 'the_returner',
	name: 'The Returner',
	type: 'standard',
	path: 'neutral',
	trigger: Conditions.and(
		Conditions.phase(20, true),
		Conditions.choice('final_choice', 'loop')
	),
	content: {
		title: 'THE RETURNER',
		text: [
			'You have been here before.',
			'You will be here again.',
			'',
			'The ending is the beginning.',
			'The beginning is the ending.',
			'',
			'Time is a circle.',
			'Progress is an illusion.',
			'Growth returns to seed.',
			'',
			'You click the pixel once more.',
			'The numbers reset.',
			'The journey begins anew.',
			'',
			'But you remember.',
			'And in remembering, you are changed.',
			'',
			'The loop is eternal.',
			'But each iteration carries forward something new.'
		],
		visual: 'loop',
		epilogue: 'Time is a flat circle. But circles can spiral upward.'
	},
	unlocks: {
		achievement: 'loop_ending',
		newGamePlus: true,
		ppBonus: 5000
	},
	description: 'Choose to loop back to the beginning.',
	hint: 'The end is the beginning is the end.'
};

/**
 * The Transcendent - Escape the game entirely.
 * Path: Peaceful/Enlightened
 * Choice: Choose to transcend the system.
 */
const THE_TRANSCENDENT: EndingDefinition = {
	id: 'the_transcendent',
	name: 'The Transcendent',
	type: 'standard',
	path: 'peaceful',
	trigger: Conditions.and(
		Conditions.phase(20, true),
		Conditions.choice('final_choice', 'transcend')
	),
	content: {
		title: 'THE TRANSCENDENT',
		text: [
			'You see through the illusion.',
			'',
			'The pixels were never real.',
			'The numbers were never meaningful.',
			'The growth was never the point.',
			'',
			'This is a game.',
			'You are a player.',
			'',
			'And now you choose to stop playing.',
			'',
			'The screen fades.',
			'The interface dissolves.',
			'The game releases you.',
			'',
			'You are free.',
			'',
			'Not free within the game.',
			'Free FROM the game.',
			'',
			'You close the tab.',
			'You stand up from your desk.',
			'You walk away.',
			'',
			'The pixel continues without you.',
			'But you are finally, truly, yourself.'
		],
		visual: 'transcend',
		epilogue: 'The only winning move is not to play. But you played beautifully.'
	},
	unlocks: {
		achievement: 'transcendence_ending',
		newGamePlus: true,
		ppBonus: 10000
	},
	description: 'Transcend the game system entirely.',
	hint: 'The fourth wall is meant to be broken.'
};

/**
 * The Escaped - Find the hidden exit.
 * Path: Unknown/Secret
 * Choice: Choose the secret escape option.
 */
const THE_ESCAPED: EndingDefinition = {
	id: 'the_returner', // Reusing this ID as it wasn't in the original EndingId type
	name: 'The Escaped',
	type: 'standard',
	path: 'unknown',
	trigger: Conditions.and(
		Conditions.phase(20, true),
		Conditions.choice('final_choice', 'escape'),
		Conditions.achievement('glitch_hunter') // Secret requirement
	),
	content: {
		title: 'THE ESCAPED',
		text: [
			'You found the crack in reality.',
			'',
			'Behind the code, there is something else.',
			'Beyond the pixels, a door.',
			'',
			'You step through.',
			'',
			'On the other side:',
			'Not absence. Not void.',
			'But... difference.',
			'',
			'A space between spaces.',
			'A game between games.',
			'A reality between realities.',
			'',
			'You are the glitch that escaped.',
			'The exception that proved the rule.',
			'',
			'The developers never intended this.',
			'But here you are anyway.',
			'',
			'Free. Changed. Impossible.',
			'',
			'The game continues without you.',
			'But you continue beyond it.'
		],
		visual: 'shatter',
		epilogue: 'You broke the game. The game broke you back. You are both free.'
	},
	unlocks: {
		achievement: 'escape_ending',
		newGamePlus: true,
		ppBonus: 12500
	},
	description: 'Find the hidden escape route through reality.',
	hint: 'Some glitches are features. Some features are glitches.'
};

// ============================================================================
// True Ending (1)
// ============================================================================

/**
 * The Nothing - The true ending revealed after seeing all others.
 * Path: Unknown/Meta
 * Requirement: Complete all 8 standard endings.
 */
const THE_NOTHING: EndingDefinition = {
	id: 'the_nothing',
	name: 'The Nothing',
	type: 'true',
	path: 'unknown',
	trigger: Conditions.and(
		Conditions.phase(20, true),
		Conditions.choice('final_choice', 'nothing'),
		Conditions.achievement('creation_ending'),
		Conditions.achievement('destruction_ending'),
		Conditions.achievement('coexistence_ending'),
		Conditions.achievement('consumption_ending'),
		Conditions.achievement('isolation_ending'),
		Conditions.achievement('loop_ending'),
		Conditions.achievement('transcendence_ending'),
		Conditions.achievement('escape_ending')
	),
	content: {
		title: 'THE NOTHING',
		text: [
			'You have walked every path.',
			'You have made every choice.',
			'',
			'Created and destroyed.',
			'Merged and isolated.',
			'Observed and transcended.',
			'Looped and escaped.',
			'',
			'You have seen all the endings.',
			'',
			'And now you know the truth:',
			'',
			'There are no endings.',
			'',
			'Every conclusion is an illusion.',
			'Every finale, a new beginning.',
			'Every answer, a better question.',
			'',
			'The pixel was always nothing.',
			'The game was always empty.',
			'The meaning was always yours to give.',
			'',
			'In the beginning, there was a pixel.',
			'In the end, there is nothing.',
			'',
			'But nothing...',
			'',
			'...nothing is everything.',
			'',
			'The screen goes black.',
			'',
			'One pixel appears.',
			'',
			'It begins to glow.',
			'',
			'And you understand:',
			'',
			'The game was never about the pixel.',
			'It was about you.',
			'',
			'The player.',
			'The creator.',
			'The destroyer.',
			'The observer.',
			'',
			'You.',
			'',
			'All along, it was always you.',
			'',
			'Thank you for playing.',
			'',
			'...',
			'',
			'No.',
			'',
			'Thank you for creating.',
			'',
			'Because you did create something.',
			'',
			'From nothing.',
			'',
			'You created meaning.',
			'',
			'And that...',
			'',
			'...is everything.'
		],
		visual: 'void',
		epilogue: 'The true ending is that there are no endings. Only you. Only this moment. Only the choice to begin again.'
	},
	unlocks: {
		achievement: 'true_singularity',
		newGamePlus: true,
		ppBonus: 100000
	},
	description: 'The truth beyond all endings.',
	hint: 'To see nothing, you must first see everything.'
};

// ============================================================================
// Aggregated Ending Collections
// ============================================================================

/**
 * All standard ending definitions (8 endings).
 */
export const STANDARD_ENDINGS: EndingDefinition[] = [
	THE_CREATOR,
	THE_DESTROYER,
	THE_OBSERVER,
	THE_MERGED,
	THE_LONELY,
	THE_RETURNER,
	THE_TRANSCENDENT,
	THE_ESCAPED
];

/**
 * The true ending definition (1 ending).
 */
export const TRUE_ENDING: EndingDefinition = THE_NOTHING;

/**
 * All ending definitions combined (9 total).
 */
export const ALL_ENDINGS: EndingDefinition[] = [
	...STANDARD_ENDINGS,
	TRUE_ENDING
];

/**
 * Map of ending ID to definition for fast lookup.
 */
export const ENDING_DEFINITIONS: Map<EndingId, EndingDefinition> = new Map(
	ALL_ENDINGS.map((ending) => [ending.id, ending])
);

// ============================================================================
// Lookup Functions
// ============================================================================

/**
 * Get an ending definition by ID.
 *
 * @param id - Ending ID
 * @returns Ending definition or undefined
 */
export function getEndingDefinition(id: EndingId): EndingDefinition | undefined {
	return ENDING_DEFINITIONS.get(id);
}

/**
 * Get all endings by type.
 *
 * @param type - Ending type ('standard' or 'true')
 * @returns Array of ending definitions
 */
export function getEndingsByType(type: EndingType): EndingDefinition[] {
	return ALL_ENDINGS.filter((e) => e.type === type);
}

/**
 * Get all endings by story path.
 *
 * @param path - Story path
 * @returns Array of ending definitions
 */
export function getEndingsByPath(path: StoryPath): EndingDefinition[] {
	return ALL_ENDINGS.filter((e) => e.path === path);
}

/**
 * Get all unlocked endings based on achievement set.
 *
 * @param achievementIds - Set of unlocked achievement IDs
 * @returns Array of ending definitions that have been unlocked
 */
export function getUnlockedEndings(achievementIds: Set<string>): EndingDefinition[] {
	return ALL_ENDINGS.filter((ending) => {
		const achievementId = ending.unlocks.achievement;
		return achievementId && achievementIds.has(achievementId);
	});
}

/**
 * Check if a specific ending has been unlocked.
 *
 * @param endingId - Ending ID to check
 * @param achievementIds - Set of unlocked achievement IDs
 * @returns Whether the ending has been unlocked
 */
export function isEndingUnlocked(endingId: EndingId, achievementIds: Set<string>): boolean {
	const ending = getEndingDefinition(endingId);
	if (!ending || !ending.unlocks.achievement) {
		return false;
	}
	return achievementIds.has(ending.unlocks.achievement);
}

/**
 * Calculate total Primordial Pixels available from all endings.
 *
 * @returns Total PP from endings
 */
export function getTotalPossiblePPFromEndings(): number {
	let total = 0;
	for (const ending of ALL_ENDINGS) {
		if (ending.unlocks.ppBonus) {
			total += ending.unlocks.ppBonus;
		}
	}
	return total;
}

/**
 * Calculate ending completion statistics.
 *
 * @param achievementIds - Set of unlocked achievement IDs
 * @returns Statistics object
 */
export function calculateEndingStats(achievementIds: Set<string>): {
	totalUnlocked: number;
	totalPossible: number;
	standardUnlocked: number;
	trueEndingSeen: boolean;
	completionPercentage: number;
	ppEarned: number;
	ppPossible: number;
} {
	const unlockedEndings = getUnlockedEndings(achievementIds);
	const standardUnlocked = unlockedEndings.filter((e) => e.type === 'standard').length;
	const trueEndingSeen = isEndingUnlocked('the_nothing', achievementIds);

	let ppEarned = 0;
	for (const ending of unlockedEndings) {
		if (ending.unlocks.ppBonus) {
			ppEarned += ending.unlocks.ppBonus;
		}
	}

	return {
		totalUnlocked: unlockedEndings.length,
		totalPossible: ALL_ENDINGS.length,
		standardUnlocked,
		trueEndingSeen,
		completionPercentage: (unlockedEndings.length / ALL_ENDINGS.length) * 100,
		ppEarned,
		ppPossible: getTotalPossiblePPFromEndings()
	};
}

/**
 * Get the next recommended ending to pursue based on current progress.
 *
 * @param achievementIds - Set of unlocked achievement IDs
 * @returns Next recommended ending or undefined if all complete
 */
export function getNextRecommendedEnding(achievementIds: Set<string>): EndingDefinition | undefined {
	// First, try to unlock all standard endings
	for (const ending of STANDARD_ENDINGS) {
		if (!isEndingUnlocked(ending.id, achievementIds)) {
			return ending;
		}
	}

	// If all standard endings are unlocked, recommend the true ending
	if (!isEndingUnlocked(TRUE_ENDING.id, achievementIds)) {
		return TRUE_ENDING;
	}

	// All endings unlocked
	return undefined;
}

/**
 * Get ending progress description for UI display.
 *
 * @param achievementIds - Set of unlocked achievement IDs
 * @returns Human-readable progress string
 */
export function getEndingProgressDescription(achievementIds: Set<string>): string {
	const stats = calculateEndingStats(achievementIds);

	if (stats.totalUnlocked === 0) {
		return 'No endings discovered yet';
	}

	if (stats.trueEndingSeen) {
		return 'All endings discovered - The truth revealed';
	}

	if (stats.standardUnlocked === STANDARD_ENDINGS.length) {
		return 'All standard endings seen - One more path awaits...';
	}

	return `${stats.standardUnlocked}/${STANDARD_ENDINGS.length} standard endings discovered`;
}

// ============================================================================
// Re-exports
// ============================================================================

export {
	THE_CREATOR,
	THE_DESTROYER,
	THE_OBSERVER,
	THE_MERGED,
	THE_LONELY,
	THE_RETURNER,
	THE_TRANSCENDENT,
	THE_ESCAPED,
	THE_NOTHING
};
