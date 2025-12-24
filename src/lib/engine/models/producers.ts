/**
 * @fileoverview Producer/Building definitions and types.
 * Producers are the primary source of resource generation in the game.
 *
 * Each producer:
 * - Costs resources to purchase
 * - Produces resources over time
 * - Has exponentially scaling costs
 * - Can be upgraded for better production
 *
 * @module engine/models/producers
 */

import type { Decimal } from '../utils/decimal';
import type { ResourceIdType } from './resources';

/**
 * Category of a producer for UI grouping.
 */
export type ProducerCategory =
	| 'basic'       // Basic generators (Phase 1-2)
	| 'color'       // Color extractors (Phase 2)
	| 'canvas'      // Canvas-related (Phase 2-3)
	| 'memory'      // Memory processors (Phase 4)
	| 'dream'       // Dream generators (Phase 5)
	| 'abstract'    // Abstract phase (Phase 7+)
	| 'cosmic'      // Space/cosmic (Phase 9+)
	| 'eternal';    // Meta/eternal producers

/**
 * Definition of a producer (static configuration).
 */
export interface ProducerDefinition {
	/** Unique identifier */
	id: string;

	/** Display name */
	name: string;

	/** Description text */
	description: string;

	/** Category for grouping */
	category: ProducerCategory;

	/** Icon or emoji */
	icon: string;

	/** Resource required to purchase (main cost resource) */
	costResource: string;

	/** Base cost for first purchase */
	baseCost: number;

	/** Cost multiplier per level (exponential scaling) */
	costMultiplier: number;

	/** Resource this producer generates */
	producesResource: string;

	/** Base production per second per level */
	baseProduction: number;

	/** Minimum phase to unlock */
	minPhase: number;

	/** Whether hidden until unlocked */
	hidden: boolean;

	/** Maximum level (0 = unlimited) */
	maxLevel: number;

	/** Display order in UI */
	displayOrder: number;

	/** Unlock condition (besides phase) */
	unlockCondition?: {
		type: 'resource' | 'producer' | 'phase' | 'achievement';
		id: string;
		amount?: number;
	};

	/** Flavor text shown at certain levels */
	flavorTexts?: Record<number, string>;
}

/**
 * Runtime state of a producer.
 */
export interface ProducerState {
	/** Current level/amount owned */
	level: number;

	/** Whether unlocked */
	unlocked: boolean;

	/** Current production per second */
	currentProduction: Decimal;

	/** Cost for next level */
	nextCost: Decimal;

	/** Total resources produced by this producer */
	totalProduced: Decimal;

	/** Time of first purchase (for statistics) */
	firstPurchaseTime: number | null;
}

/**
 * Producer IDs as a const object for type safety.
 */
export const ProducerId = {
	// ============================================================================
	// Phase 1: Basic Generators
	// ============================================================================
	/** Manual pixel generation booster */
	CLICK_BOOSTER: 'click_booster',
	/** Basic pixel generator */
	PIXEL_GENERATOR: 'pixel_generator',
	/** Advanced pixel multiplier */
	PIXEL_MULTIPLIER: 'pixel_multiplier',

	// ============================================================================
	// Phase 2: Color & Canvas
	// ============================================================================
	/** Extracts red color */
	RED_EXTRACTOR: 'red_extractor',
	/** Extracts green color */
	GREEN_EXTRACTOR: 'green_extractor',
	/** Extracts blue color */
	BLUE_EXTRACTOR: 'blue_extractor',
	/** Fills canvases automatically */
	CANVAS_FILLER: 'canvas_filler',
	/** Compresses canvases */
	CANVAS_COMPRESSOR: 'canvas_compressor',

	// ============================================================================
	// Phase 3: Gallery
	// ============================================================================
	/** Processes gallery units */
	GALLERY_PROCESSOR: 'gallery_processor',
	/** Synchronizes galleries */
	GALLERY_SYNCER: 'gallery_syncer',

	// ============================================================================
	// Phase 4: Memory
	// ============================================================================
	/** Extracts memory fragments */
	MEMORY_EXTRACTOR: 'memory_extractor',
	/** Processes memories */
	MEMORY_PROCESSOR: 'memory_processor',

	// ============================================================================
	// Phase 5: Dreams
	// ============================================================================
	/** Generates dream pixels while offline */
	DREAM_WEAVER: 'dream_weaver',
	/** Converts dreams to pixels */
	DREAM_CONVERTER: 'dream_converter',
} as const;

/**
 * Type for valid producer IDs.
 */
export type ProducerIdType = typeof ProducerId[keyof typeof ProducerId];

/**
 * All producer definitions.
 * This is the source of truth for producer metadata.
 */
export const PRODUCER_DEFINITIONS: Record<string, ProducerDefinition> = {
	// ============================================================================
	// Phase 1: Basic Generators
	// ============================================================================
	[ProducerId.CLICK_BOOSTER]: {
		id: ProducerId.CLICK_BOOSTER,
		name: 'Click Amplifier',
		description: 'Increases the power of each click. Every level adds +1 pixel per click.',
		category: 'basic',
		icon: '👆',
		costResource: 'pixels',
		baseCost: 10,
		costMultiplier: 1.15,
		producesResource: 'pixels', // Actually boosts clicks, handled specially
		baseProduction: 0, // Not a producer, but a click enhancer
		minPhase: 1,
		hidden: false,
		maxLevel: 0,
		displayOrder: 1,
		flavorTexts: {
			1: '"Your clicks echo through the void."',
			10: '"The void listens more intently now."',
			50: '"Each click is a universe born."',
			100: '"Click. Create. Repeat."'
		}
	},

	[ProducerId.PIXEL_GENERATOR]: {
		id: ProducerId.PIXEL_GENERATOR,
		name: 'Pixel Generator',
		description: 'A simple machine that creates pixels from nothing. Or from everything?',
		category: 'basic',
		icon: '⬛',
		costResource: 'pixels',
		baseCost: 15,
		costMultiplier: 1.15,
		producesResource: 'pixels',
		baseProduction: 0.1,
		minPhase: 1,
		hidden: false,
		maxLevel: 0,
		displayOrder: 2,
		flavorTexts: {
			1: '"It hums with potential."',
			10: '"A chorus of creation."',
			50: '"The factory line of existence."',
			100: '"Pixels pour forth like rain."'
		}
	},

	[ProducerId.PIXEL_MULTIPLIER]: {
		id: ProducerId.PIXEL_MULTIPLIER,
		name: 'Pixel Multiplier',
		description: 'Amplifies existing pixel generation. Each level multiplies all pixel production by 1.1x.',
		category: 'basic',
		icon: '✖️',
		costResource: 'pixels',
		baseCost: 100,
		costMultiplier: 1.5,
		producesResource: 'pixels', // Actually a multiplier
		baseProduction: 0, // Not direct production
		minPhase: 1,
		hidden: true,
		maxLevel: 0,
		displayOrder: 3,
		unlockCondition: {
			type: 'producer',
			id: ProducerId.PIXEL_GENERATOR,
			amount: 5
		},
		flavorTexts: {
			1: '"Multiplication is just addition with ambition."',
			5: '"The numbers grow exponentially."',
			10: '"Power compounds upon power."'
		}
	},

	// ============================================================================
	// Phase 2: Color Extractors
	// ============================================================================
	[ProducerId.RED_EXTRACTOR]: {
		id: ProducerId.RED_EXTRACTOR,
		name: 'Red Extractor',
		description: 'Extracts the essence of red from raw pixels. Red is the color of beginnings.',
		category: 'color',
		icon: '🔴',
		costResource: 'pixels',
		baseCost: 100,
		costMultiplier: 1.2,
		producesResource: 'red',
		baseProduction: 0.05,
		minPhase: 2,
		hidden: true,
		maxLevel: 0,
		displayOrder: 10,
		flavorTexts: {
			1: '"The first color bleeds through."',
			10: '"Passion crystallizes."',
			25: '"Red runs deep."'
		}
	},

	[ProducerId.GREEN_EXTRACTOR]: {
		id: ProducerId.GREEN_EXTRACTOR,
		name: 'Green Extractor',
		description: 'Extracts the essence of green from raw pixels. Green is the color of growth.',
		category: 'color',
		icon: '🟢',
		costResource: 'pixels',
		baseCost: 100,
		costMultiplier: 1.2,
		producesResource: 'green',
		baseProduction: 0.05,
		minPhase: 2,
		hidden: true,
		maxLevel: 0,
		displayOrder: 11,
		flavorTexts: {
			1: '"Life begins to stir."',
			10: '"Growth accelerates."',
			25: '"The garden expands."'
		}
	},

	[ProducerId.BLUE_EXTRACTOR]: {
		id: ProducerId.BLUE_EXTRACTOR,
		name: 'Blue Extractor',
		description: 'Extracts the essence of blue from raw pixels. Blue is the color of depth.',
		category: 'color',
		icon: '🔵',
		costResource: 'pixels',
		baseCost: 100,
		costMultiplier: 1.2,
		producesResource: 'blue',
		baseProduction: 0.05,
		minPhase: 2,
		hidden: true,
		maxLevel: 0,
		displayOrder: 12,
		flavorTexts: {
			1: '"The depths call."',
			10: '"Calm waters run deep."',
			25: '"An ocean of possibility."'
		}
	},

	[ProducerId.CANVAS_FILLER]: {
		id: ProducerId.CANVAS_FILLER,
		name: 'Canvas Filler',
		description: 'Automatically fills canvases with pixels. Each level produces 0.01 canvases per second.',
		category: 'canvas',
		icon: '🖼️',
		costResource: 'pixels',
		baseCost: 500,
		costMultiplier: 1.25,
		producesResource: 'canvas',
		baseProduction: 0.01,
		minPhase: 2,
		hidden: true,
		maxLevel: 0,
		displayOrder: 20,
		unlockCondition: {
			type: 'resource',
			id: 'pixels',
			amount: 500
		},
		flavorTexts: {
			1: '"The brush moves on its own."',
			10: '"Art becomes automated."',
			25: '"A factory of expression."'
		}
	},

	[ProducerId.CANVAS_COMPRESSOR]: {
		id: ProducerId.CANVAS_COMPRESSOR,
		name: 'Canvas Compressor',
		description: 'Compresses 64 canvases into gallery units. Produces gallery units from canvases.',
		category: 'canvas',
		icon: '📦',
		costResource: 'canvas',
		baseCost: 10,
		costMultiplier: 1.3,
		producesResource: 'gallery_units',
		baseProduction: 0.001,
		minPhase: 3,
		hidden: true,
		maxLevel: 0,
		displayOrder: 21,
		unlockCondition: {
			type: 'resource',
			id: 'canvas',
			amount: 10
		}
	},

	// ============================================================================
	// Phase 3: Gallery
	// ============================================================================
	[ProducerId.GALLERY_PROCESSOR]: {
		id: ProducerId.GALLERY_PROCESSOR,
		name: 'Gallery Processor',
		description: 'Processes gallery units to extract pure pixel essence.',
		category: 'canvas',
		icon: '🏛️',
		costResource: 'gallery_units',
		baseCost: 5,
		costMultiplier: 1.35,
		producesResource: 'pixels',
		baseProduction: 10,
		minPhase: 3,
		hidden: true,
		maxLevel: 0,
		displayOrder: 22,
		unlockCondition: {
			type: 'resource',
			id: 'gallery_units',
			amount: 5
		}
	},

	[ProducerId.GALLERY_SYNCER]: {
		id: ProducerId.GALLERY_SYNCER,
		name: 'Gallery Syncer',
		description: 'Synchronizes galleries for bonus production. Multiplies all gallery production.',
		category: 'canvas',
		icon: '🔗',
		costResource: 'gallery_units',
		baseCost: 20,
		costMultiplier: 1.5,
		producesResource: 'pixels', // Actually a multiplier
		baseProduction: 0,
		minPhase: 3,
		hidden: true,
		maxLevel: 10,
		displayOrder: 23,
		unlockCondition: {
			type: 'producer',
			id: ProducerId.GALLERY_PROCESSOR,
			amount: 5
		}
	},

	// ============================================================================
	// Phase 4: Memory
	// ============================================================================
	[ProducerId.MEMORY_EXTRACTOR]: {
		id: ProducerId.MEMORY_EXTRACTOR,
		name: 'Memory Extractor',
		description: 'Extracts fragments of memory from the digital realm.',
		category: 'memory',
		icon: '💭',
		costResource: 'pixels',
		baseCost: 10000,
		costMultiplier: 1.25,
		producesResource: 'memory_fragments',
		baseProduction: 0.1,
		minPhase: 4,
		hidden: true,
		maxLevel: 0,
		displayOrder: 30,
	},

	[ProducerId.MEMORY_PROCESSOR]: {
		id: ProducerId.MEMORY_PROCESSOR,
		name: 'Memory Processor',
		description: 'Processes memory fragments into pure understanding.',
		category: 'memory',
		icon: '🧠',
		costResource: 'memory_fragments',
		baseCost: 100,
		costMultiplier: 1.3,
		producesResource: 'pixels',
		baseProduction: 100,
		minPhase: 4,
		hidden: true,
		maxLevel: 0,
		displayOrder: 31,
	},

	// ============================================================================
	// Phase 5: Dreams
	// ============================================================================
	[ProducerId.DREAM_WEAVER]: {
		id: ProducerId.DREAM_WEAVER,
		name: 'Dream Weaver',
		description: 'Weaves pixels from the fabric of dreams. Produces while you\'re away.',
		category: 'dream',
		icon: '🌙',
		costResource: 'pixels',
		baseCost: 100000,
		costMultiplier: 1.4,
		producesResource: 'dream_pixels',
		baseProduction: 1,
		minPhase: 5,
		hidden: true,
		maxLevel: 0,
		displayOrder: 40,
	},

	[ProducerId.DREAM_CONVERTER]: {
		id: ProducerId.DREAM_CONVERTER,
		name: 'Dream Converter',
		description: 'Converts dream pixels into real pixels at a favorable rate.',
		category: 'dream',
		icon: '✨',
		costResource: 'dream_pixels',
		baseCost: 100,
		costMultiplier: 1.35,
		producesResource: 'pixels',
		baseProduction: 1000,
		minPhase: 5,
		hidden: true,
		maxLevel: 0,
		displayOrder: 41,
	},
};

/**
 * Get a producer definition by ID.
 *
 * @param id - Producer ID
 * @returns Producer definition or undefined
 */
export function getProducerDefinition(id: string): ProducerDefinition | undefined {
	return PRODUCER_DEFINITIONS[id];
}

/**
 * Get all producer definitions for a category.
 *
 * @param category - Producer category
 * @returns Array of producer definitions
 */
export function getProducersByCategory(category: ProducerCategory): ProducerDefinition[] {
	return Object.values(PRODUCER_DEFINITIONS)
		.filter(p => p.category === category)
		.sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Get all producer definitions for a minimum phase.
 *
 * @param phase - Minimum phase number
 * @returns Array of producer definitions available at that phase
 */
export function getProducersForPhase(phase: number): ProducerDefinition[] {
	return Object.values(PRODUCER_DEFINITIONS)
		.filter(p => p.minPhase <= phase)
		.sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Check if a producer should be visible at a given phase.
 *
 * @param producerId - Producer ID
 * @param phase - Current phase
 * @returns Whether the producer should be visible
 */
export function isProducerVisibleAtPhase(producerId: string, phase: number): boolean {
	const def = PRODUCER_DEFINITIONS[producerId];
	if (!def) return false;
	return def.minPhase <= phase;
}
