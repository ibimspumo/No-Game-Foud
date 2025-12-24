/**
 * @fileoverview Main entry point for upgrade data.
 * Aggregates and exports all upgrade definitions.
 *
 * @module engine/data/upgrades
 */

import type { UpgradeDefinition, UpgradeCategory, SkillTreePath } from '../../models/upgrades';
import { RUN_UPGRADES, getRunUpgradesForPhase, getRunUpgradesUpToPhase } from './run-upgrades';
import {
	ETERNAL_UPGRADES,
	getEternalUpgradesByPath,
	getPathCapstone,
	canAscend
} from './eternal-upgrades';
import { SECRET_UPGRADES, getSecretUpgrades, isSecretUnlockable } from './secret-upgrades';

// ============================================================================
// Aggregated Upgrade Collections
// ============================================================================

/**
 * All upgrade definitions combined.
 */
export const ALL_UPGRADES: UpgradeDefinition[] = [
	...RUN_UPGRADES,
	...ETERNAL_UPGRADES,
	...SECRET_UPGRADES
];

/**
 * Map of upgrade ID to definition for fast lookup.
 */
export const UPGRADE_MAP: Map<string, UpgradeDefinition> = new Map(
	ALL_UPGRADES.map((u) => [u.id, u])
);

// ============================================================================
// Lookup Functions
// ============================================================================

/**
 * Get an upgrade definition by ID.
 *
 * @param id - Upgrade ID
 * @returns Upgrade definition or undefined
 */
export function getUpgradeDefinition(id: string): UpgradeDefinition | undefined {
	return UPGRADE_MAP.get(id);
}

/**
 * Get all upgrades by category.
 *
 * @param category - Upgrade category
 * @returns Array of upgrade definitions
 */
export function getUpgradesByCategory(category: UpgradeCategory): UpgradeDefinition[] {
	switch (category) {
		case 'run':
			return RUN_UPGRADES;
		case 'eternal':
			return ETERNAL_UPGRADES;
		case 'secret':
			return SECRET_UPGRADES;
		default:
			return [];
	}
}

/**
 * Get all upgrades visible at a specific phase.
 *
 * @param phase - Current phase number
 * @param includeEternal - Whether to include eternal upgrades
 * @param includeSecret - Whether to include secret upgrades
 * @returns Array of upgrade definitions
 */
export function getUpgradesForPhase(
	phase: number,
	includeEternal: boolean = true,
	includeSecret: boolean = false
): UpgradeDefinition[] {
	const upgrades: UpgradeDefinition[] = [];

	// Add run upgrades up to current phase
	upgrades.push(...getRunUpgradesUpToPhase(phase));

	// Add eternal upgrades if requested
	if (includeEternal) {
		upgrades.push(...ETERNAL_UPGRADES.filter((u) => u.minPhase <= phase));
	}

	// Add secret upgrades if requested (only revealed ones)
	if (includeSecret) {
		upgrades.push(...SECRET_UPGRADES.filter((u) => u.minPhase <= phase && !u.hidden));
	}

	return upgrades.sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Get the initial upgrades to register at game start.
 *
 * @returns Array of upgrade definitions for phase 1
 */
export function getInitialUpgrades(): UpgradeDefinition[] {
	return [
		...getRunUpgradesForPhase(1),
		...ETERNAL_UPGRADES, // All eternal upgrades are visible from start
		...SECRET_UPGRADES // Register but hidden
	];
}

/**
 * Get upgrades that should be unlocked for a new phase.
 *
 * @param phase - Phase number to check
 * @returns Array of upgrade definitions that unlock at this phase
 */
export function getNewUpgradesForPhase(phase: number): UpgradeDefinition[] {
	return ALL_UPGRADES.filter((u) => u.minPhase === phase && !u.hidden).sort(
		(a, b) => a.displayOrder - b.displayOrder
	);
}

// ============================================================================
// Skill Tree Helpers
// ============================================================================

/**
 * Get the skill tree structure for display.
 *
 * @returns Skill tree organized by path and tier
 */
export function getSkillTreeStructure(): Map<
	SkillTreePath,
	{ tier: number; upgrades: UpgradeDefinition[] }[]
> {
	const tree = new Map<SkillTreePath, { tier: number; upgrades: UpgradeDefinition[] }[]>();

	for (const path of ['consumer', 'creator', 'observer'] as SkillTreePath[]) {
		const pathUpgrades = getEternalUpgradesByPath(path);
		const tiers: { tier: number; upgrades: UpgradeDefinition[] }[] = [];

		// Group by tier (based on displayOrder: 1000s = tier 1, 1010-1019 = tier 1.5, 1020+ = tier 2, etc.)
		const tier1 = pathUpgrades.filter(
			(u) => u.displayOrder % 1000 < 10
		);
		const tier15 = pathUpgrades.filter(
			(u) => u.displayOrder % 1000 >= 10 && u.displayOrder % 1000 < 20
		);
		const tier2 = pathUpgrades.filter(
			(u) => u.displayOrder % 1000 >= 20 && u.displayOrder % 1000 < 30
		);
		const tier3 = pathUpgrades.filter(
			(u) => u.displayOrder % 1000 >= 30
		);

		if (tier1.length > 0) tiers.push({ tier: 1, upgrades: tier1 });
		if (tier15.length > 0) tiers.push({ tier: 1.5, upgrades: tier15 });
		if (tier2.length > 0) tiers.push({ tier: 2, upgrades: tier2 });
		if (tier3.length > 0) tiers.push({ tier: 3, upgrades: tier3 });

		tree.set(path, tiers);
	}

	return tree;
}

/**
 * Calculate the total primordial cost to complete a path.
 *
 * @param path - Skill tree path
 * @returns Total cost in primordial pixels
 */
export function calculatePathTotalCost(path: SkillTreePath): number {
	const pathUpgrades = getEternalUpgradesByPath(path);
	let total = 0;

	for (const upgrade of pathUpgrades) {
		if (typeof upgrade.baseCost === 'number') {
			if (upgrade.isOneTime || upgrade.maxLevel === undefined) {
				total += upgrade.baseCost;
			} else {
				// Sum of geometric series for repeatable upgrades
				const maxLevel = upgrade.maxLevel || 1;
				const multiplier = Number(upgrade.costMultiplier || 1.15);
				const baseCost = upgrade.baseCost;

				for (let i = 0; i < maxLevel; i++) {
					total += baseCost * Math.pow(multiplier, i);
				}
			}
		}
	}

	return Math.floor(total);
}

// ============================================================================
// Re-exports
// ============================================================================

export {
	RUN_UPGRADES,
	ETERNAL_UPGRADES,
	SECRET_UPGRADES,
	getRunUpgradesForPhase,
	getRunUpgradesUpToPhase,
	getEternalUpgradesByPath,
	getPathCapstone,
	canAscend,
	getSecretUpgrades,
	isSecretUnlockable
};

// Export from phase-specific files
export * from './run-upgrades';
export * from './eternal-upgrades';
export * from './secret-upgrades';
