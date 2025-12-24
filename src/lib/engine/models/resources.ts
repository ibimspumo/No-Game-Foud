/**
 * @fileoverview Resource definitions and types.
 * Contains all resource definitions used throughout the game.
 *
 * Resources are divided into three categories:
 * - Run Resources: Reset on rebirth (pixels, colors, etc.)
 * - Phase Resources: Specific to certain phases
 * - Eternal Resources: Persist across rebirths
 *
 * @module engine/models/resources
 */

import type { Decimal } from '../utils/decimal';

/**
 * Category of a resource for lifecycle management.
 */
export type ResourceCategory = 'run' | 'phase' | 'eternal';

/**
 * Definition of a game resource.
 */
export interface ResourceDefinition {
	/** Unique identifier for the resource */
	id: string;

	/** Display name */
	name: string;

	/** Short description */
	description: string;

	/** Resource category for lifecycle */
	category: ResourceCategory;

	/** Icon identifier or emoji */
	icon: string;

	/** Color for UI display (CSS color) */
	color: string;

	/** Whether this resource is hidden until unlocked */
	hidden: boolean;

	/** Minimum phase required to show this resource (0 = always) */
	minPhase: number;

	/** Whether this resource can be produced automatically */
	canProduce: boolean;

	/** Whether this resource can be clicked/manually generated */
	canClick: boolean;

	/** Base click amount (before multipliers) */
	baseClickAmount: number;

	/** Order for display in UI */
	displayOrder: number;
}

/**
 * Runtime state of a resource.
 */
export interface ResourceState {
	/** Current amount */
	amount: Decimal;

	/** Current production rate per second */
	productionRate: Decimal;

	/** Whether the resource is unlocked/visible */
	unlocked: boolean;

	/** Total ever generated (for statistics) */
	totalGenerated: Decimal;

	/** Total ever spent */
	totalSpent: Decimal;
}

/**
 * Resource IDs as a const object for type safety.
 */
export const ResourceId = {
	// Core resources (Phase 1+)
	PIXELS: 'pixels',

	// Color resources (Phase 2+)
	RED: 'red',
	GREEN: 'green',
	BLUE: 'blue',
	CYAN: 'cyan',
	MAGENTA: 'magenta',
	YELLOW: 'yellow',

	// Canvas resources (Phase 2-3)
	CANVAS: 'canvas',
	GALLERY_UNITS: 'gallery_units',

	// Memory resources (Phase 4+)
	MEMORY_FRAGMENTS: 'memory_fragments',

	// Dream resources (Phase 5+)
	DREAM_PIXELS: 'dream_pixels',

	// Knowledge resources (Phase 7+)
	CURRENCY: 'currency',
	KNOWLEDGE: 'knowledge',
	POWER: 'power',
	HARMONY: 'harmony',

	// Life resources (Phase 9+)
	LIFE_PIXELS: 'life_pixels',

	// Stellar resources (Phase 11+)
	SOLAR_ENERGY: 'solar_energy',
	FUSION: 'fusion',

	// Dark resources (Phase 12+)
	DARK_MATTER: 'dark_matter',

	// Eternal resources (persist across rebirths)
	PRIMORDIAL_PIXELS: 'primordial_pixels',
	SINGULARITY_POINTS: 'singularity_points',
} as const;

/**
 * Type for valid resource IDs.
 */
export type ResourceIdType = typeof ResourceId[keyof typeof ResourceId];

/**
 * All resource definitions.
 * This is the source of truth for resource metadata.
 */
export const RESOURCE_DEFINITIONS: Record<string, ResourceDefinition> = {
	// ============================================================================
	// Core Resources (Phase 1+)
	// ============================================================================
	[ResourceId.PIXELS]: {
		id: ResourceId.PIXELS,
		name: 'Pixels',
		description: 'The fundamental unit of existence. Everything begins with a pixel.',
		category: 'run',
		icon: '■',
		color: '#ffffff',
		hidden: false,
		minPhase: 1,
		canProduce: true,
		canClick: true,
		baseClickAmount: 1,
		displayOrder: 1,
	},

	// ============================================================================
	// Color Resources (Phase 2+)
	// ============================================================================
	[ResourceId.RED]: {
		id: ResourceId.RED,
		name: 'Red',
		description: 'The color of passion, anger, and beginnings.',
		category: 'run',
		icon: '●',
		color: '#ff4444',
		hidden: true,
		minPhase: 2,
		canProduce: true,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 10,
	},
	[ResourceId.GREEN]: {
		id: ResourceId.GREEN,
		name: 'Green',
		description: 'The color of growth, envy, and life.',
		category: 'run',
		icon: '●',
		color: '#44ff44',
		hidden: true,
		minPhase: 2,
		canProduce: true,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 11,
	},
	[ResourceId.BLUE]: {
		id: ResourceId.BLUE,
		name: 'Blue',
		description: 'The color of calm, sadness, and depth.',
		category: 'run',
		icon: '●',
		color: '#4444ff',
		hidden: true,
		minPhase: 2,
		canProduce: true,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 12,
	},
	[ResourceId.CYAN]: {
		id: ResourceId.CYAN,
		name: 'Cyan',
		description: 'The merging of calm and growth.',
		category: 'run',
		icon: '◆',
		color: '#44ffff',
		hidden: true,
		minPhase: 2,
		canProduce: true,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 13,
	},
	[ResourceId.MAGENTA]: {
		id: ResourceId.MAGENTA,
		name: 'Magenta',
		description: 'The merging of passion and depth.',
		category: 'run',
		icon: '◆',
		color: '#ff44ff',
		hidden: true,
		minPhase: 2,
		canProduce: true,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 14,
	},
	[ResourceId.YELLOW]: {
		id: ResourceId.YELLOW,
		name: 'Yellow',
		description: 'The merging of passion and growth.',
		category: 'run',
		icon: '◆',
		color: '#ffff44',
		hidden: true,
		minPhase: 2,
		canProduce: true,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 15,
	},

	// ============================================================================
	// Canvas Resources (Phase 2-3)
	// ============================================================================
	[ResourceId.CANVAS]: {
		id: ResourceId.CANVAS,
		name: 'Canvas',
		description: '8x8 grids of pure expression.',
		category: 'run',
		icon: '⬜',
		color: '#aaaaaa',
		hidden: true,
		minPhase: 2,
		canProduce: true,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 20,
	},
	[ResourceId.GALLERY_UNITS]: {
		id: ResourceId.GALLERY_UNITS,
		name: 'Gallery Units',
		description: 'Compressed collections of 64 canvases.',
		category: 'run',
		icon: '🖼',
		color: '#dddddd',
		hidden: true,
		minPhase: 3,
		canProduce: true,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 21,
	},

	// ============================================================================
	// Memory Resources (Phase 4+)
	// ============================================================================
	[ResourceId.MEMORY_FRAGMENTS]: {
		id: ResourceId.MEMORY_FRAGMENTS,
		name: 'Memory Fragments',
		description: 'Echoes of processes past. Whispers of data.',
		category: 'run',
		icon: '💭',
		color: '#aaddff',
		hidden: true,
		minPhase: 4,
		canProduce: true,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 30,
	},

	// ============================================================================
	// Dream Resources (Phase 5+)
	// ============================================================================
	[ResourceId.DREAM_PIXELS]: {
		id: ResourceId.DREAM_PIXELS,
		name: 'Dream Pixels',
		description: 'Pixels generated in the space between sessions.',
		category: 'run',
		icon: '✨',
		color: '#ffddff',
		hidden: true,
		minPhase: 5,
		canProduce: false, // Generated offline
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 31,
	},

	// ============================================================================
	// Abstract Resources (Phase 7+)
	// ============================================================================
	[ResourceId.CURRENCY]: {
		id: ResourceId.CURRENCY,
		name: 'Currency',
		description: 'Abstract value, exchangeable for upgrades.',
		category: 'phase',
		icon: '◈',
		color: '#ffdd44',
		hidden: true,
		minPhase: 7,
		canProduce: true,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 40,
	},
	[ResourceId.KNOWLEDGE]: {
		id: ResourceId.KNOWLEDGE,
		name: 'Knowledge',
		description: 'The accumulation of understanding.',
		category: 'phase',
		icon: '📚',
		color: '#44ddff',
		hidden: true,
		minPhase: 7,
		canProduce: true,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 41,
	},
	[ResourceId.POWER]: {
		id: ResourceId.POWER,
		name: 'Power',
		description: 'Raw force to amplify production.',
		category: 'phase',
		icon: '⚡',
		color: '#ff8844',
		hidden: true,
		minPhase: 7,
		canProduce: true,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 42,
	},
	[ResourceId.HARMONY]: {
		id: ResourceId.HARMONY,
		name: 'Harmony',
		description: 'Balance between all forces.',
		category: 'phase',
		icon: '☯',
		color: '#88ff88',
		hidden: true,
		minPhase: 7,
		canProduce: true,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 43,
	},

	// ============================================================================
	// Life Resources (Phase 9+)
	// ============================================================================
	[ResourceId.LIFE_PIXELS]: {
		id: ResourceId.LIFE_PIXELS,
		name: 'Life Pixels',
		description: 'Pixels imbued with the essence of living things.',
		category: 'phase',
		icon: '🌱',
		color: '#88ff44',
		hidden: true,
		minPhase: 9,
		canProduce: true,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 50,
	},

	// ============================================================================
	// Stellar Resources (Phase 11-12)
	// ============================================================================
	[ResourceId.SOLAR_ENERGY]: {
		id: ResourceId.SOLAR_ENERGY,
		name: 'Solar Energy',
		description: 'The raw power of stars.',
		category: 'phase',
		icon: '☀',
		color: '#ffff88',
		hidden: true,
		minPhase: 11,
		canProduce: true,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 60,
	},
	[ResourceId.FUSION]: {
		id: ResourceId.FUSION,
		name: 'Fusion',
		description: 'The process that powers the cosmos.',
		category: 'phase',
		icon: '💫',
		color: '#ffaa44',
		hidden: true,
		minPhase: 11,
		canProduce: true,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 61,
	},
	[ResourceId.DARK_MATTER]: {
		id: ResourceId.DARK_MATTER,
		name: 'Dark Matter',
		description: 'The invisible scaffolding of the universe.',
		category: 'phase',
		icon: '🌑',
		color: '#442266',
		hidden: true,
		minPhase: 12,
		canProduce: true,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 62,
	},

	// ============================================================================
	// Eternal Resources (Persist across rebirths)
	// ============================================================================
	[ResourceId.PRIMORDIAL_PIXELS]: {
		id: ResourceId.PRIMORDIAL_PIXELS,
		name: 'Primordial Pixels',
		description: 'The essence of existence itself. Survives even rebirth.',
		category: 'eternal',
		icon: '◉',
		color: '#ff88ff',
		hidden: true,
		minPhase: 1, // Shown after first rebirth
		canProduce: false, // Only gained on rebirth
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 100,
	},
	[ResourceId.SINGULARITY_POINTS]: {
		id: ResourceId.SINGULARITY_POINTS,
		name: 'Singularity Points',
		description: 'Meta-currency for transcendent upgrades.',
		category: 'eternal',
		icon: '✦',
		color: '#ffffff',
		hidden: true,
		minPhase: 1,
		canProduce: false,
		canClick: false,
		baseClickAmount: 0,
		displayOrder: 101,
	},
};

/**
 * Get a resource definition by ID.
 *
 * @param id - Resource ID
 * @returns Resource definition or undefined
 */
export function getResourceDefinition(id: string): ResourceDefinition | undefined {
	return RESOURCE_DEFINITIONS[id];
}

/**
 * Get all resource definitions for a category.
 *
 * @param category - Resource category
 * @returns Array of resource definitions
 */
export function getResourcesByCategory(category: ResourceCategory): ResourceDefinition[] {
	return Object.values(RESOURCE_DEFINITIONS)
		.filter(r => r.category === category)
		.sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Get all resource definitions for a minimum phase.
 *
 * @param phase - Minimum phase number
 * @returns Array of resource definitions available at that phase
 */
export function getResourcesForPhase(phase: number): ResourceDefinition[] {
	return Object.values(RESOURCE_DEFINITIONS)
		.filter(r => r.minPhase <= phase)
		.sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Check if a resource should be visible at a given phase.
 *
 * @param resourceId - Resource ID
 * @param phase - Current phase
 * @returns Whether the resource should be visible
 */
export function isResourceVisibleAtPhase(resourceId: string, phase: number): boolean {
	const def = RESOURCE_DEFINITIONS[resourceId];
	if (!def) return false;
	return def.minPhase <= phase;
}
