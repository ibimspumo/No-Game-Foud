/**
 * @fileoverview Secret upgrade definitions.
 * Secret upgrades are hidden and require special conditions to unlock.
 * They provide unique bonuses and achievements.
 *
 * @module engine/data/upgrades/secret-upgrades
 */

import type { UpgradeDefinition } from '../../models/upgrades';
import { D } from '../../utils/decimal';

// ============================================================================
// Secret Upgrades
// ============================================================================

/**
 * All secret upgrade definitions.
 */
export const SECRET_UPGRADES: UpgradeDefinition[] = [
	{
		id: 'anomaly_hunter',
		name: 'Anomaly Hunter',
		description: 'Anomalies appear 50% more often and give 2x rewards.',
		flavor: 'You seek what others overlook.',
		baseCost: 100,
		currency: 'primordial',
		effects: [
			{
				type: 'multiplier',
				target: 'anomaly_rate',
				description: '+50% anomaly rate',
				value: 1.5,
				scalesWithLevel: false
			},
			{
				type: 'multiplier',
				target: 'anomaly_reward',
				description: '2x anomaly rewards',
				value: 2.0,
				scalesWithLevel: false
			}
		],
		minPhase: 1,
		category: 'secret',
		displayOrder: 9000,
		isOneTime: true,
		hidden: true,
		unlockConditions: [
			{
				type: 'secret',
				id: 'found_10_anomalies'
			}
		],
		icon: 'anomaly',
		colorClass: 'upgrade-secret'
	},
	{
		id: 'speed_demon',
		name: 'Speed Demon',
		description: 'All production +25% when game speed is above 2x.',
		flavor: 'Faster. Always faster.',
		baseCost: 150,
		currency: 'primordial',
		effects: [
			{
				type: 'multiplier',
				target: 'production',
				description: '+25% production at high speed',
				value: 1.25,
				scalesWithLevel: false
			}
		],
		minPhase: 1,
		category: 'secret',
		displayOrder: 9010,
		isOneTime: true,
		hidden: true,
		unlockConditions: [
			{
				type: 'achievement',
				id: 'speed_run_phase_5'
			}
		],
		icon: 'speed',
		colorClass: 'upgrade-secret'
	},
	{
		id: 'pacifist',
		name: 'Pacifist',
		description: 'Harmony resource generation +100%.',
		flavor: 'There is another way.',
		baseCost: 200,
		currency: 'primordial',
		effects: [
			{
				type: 'multiplier',
				target: 'harmony',
				description: '2x harmony production',
				value: 2.0,
				scalesWithLevel: false
			}
		],
		minPhase: 1,
		category: 'secret',
		displayOrder: 9020,
		isOneTime: true,
		hidden: true,
		unlockConditions: [
			{
				type: 'achievement',
				id: 'pacifist_run'
			}
		],
		icon: 'peace',
		colorClass: 'upgrade-secret'
	},
	{
		id: 'pixel_philosopher',
		name: 'Pixel Philosopher',
		description: 'Reading all Phase 1 logs grants +10% click power permanently.',
		flavor: 'Wisdom in simplicity.',
		baseCost: 50,
		currency: 'primordial',
		effects: [
			{
				type: 'click',
				target: 'click',
				description: '+10% click power',
				value: 1.1,
				mode: 'multiplicative'
			}
		],
		minPhase: 1,
		category: 'secret',
		displayOrder: 9030,
		isOneTime: true,
		hidden: true,
		unlockConditions: [
			{
				type: 'achievement',
				id: 'read_all_phase_1_logs'
			}
		],
		icon: 'book',
		colorClass: 'upgrade-secret'
	},
	{
		id: 'idle_master',
		name: 'Idle Master',
		description: 'Offline cap increased to 24 hours.',
		flavor: 'Patience is a virtue.',
		baseCost: 75,
		currency: 'primordial',
		effects: [
			{
				type: 'multiplier',
				target: 'offline_cap',
				description: '3x offline cap',
				value: 3.0,
				scalesWithLevel: false
			}
		],
		minPhase: 1,
		category: 'secret',
		displayOrder: 9040,
		isOneTime: true,
		hidden: true,
		unlockConditions: [
			{
				type: 'achievement',
				id: 'away_24_hours'
			}
		],
		icon: 'idle',
		colorClass: 'upgrade-secret'
	},
	{
		id: 'the_collector',
		name: 'The Collector',
		description: 'All resources have +5% chance to drop bonus amounts.',
		flavor: 'Every pixel has a story.',
		baseCost: 100,
		currency: 'primordial',
		effects: [
			{
				type: 'multiplier',
				target: 'drop_chance',
				description: '+5% bonus drop chance',
				value: 1.05,
				scalesWithLevel: false
			}
		],
		minPhase: 1,
		category: 'secret',
		displayOrder: 9050,
		isOneTime: true,
		hidden: true,
		unlockConditions: [
			{
				type: 'achievement',
				id: 'all_colors_discovered'
			}
		],
		icon: 'collect',
		colorClass: 'upgrade-secret'
	},
	{
		id: 'the_fourth_wall',
		name: 'The Fourth Wall',
		description: '???',
		flavor: 'You know, don\'t you?',
		baseCost: 500,
		currency: 'primordial',
		effects: [
			{
				type: 'unlock',
				target: 'all',
				description: 'Unlock ???',
				unlockId: 'meta_awareness',
				unlockType: 'mechanic'
			}
		],
		minPhase: 4,
		category: 'secret',
		displayOrder: 9999,
		isOneTime: true,
		hidden: true,
		unlockConditions: [
			{
				type: 'secret',
				id: 'discovered_player_room'
			}
		],
		icon: 'meta',
		colorClass: 'upgrade-secret-legendary'
	}
];

/**
 * Get all secret upgrades.
 *
 * @returns Array of secret upgrade definitions
 */
export function getSecretUpgrades(): UpgradeDefinition[] {
	return SECRET_UPGRADES;
}

/**
 * Get a secret upgrade by its unlock condition.
 *
 * @param conditionId - The condition ID that unlocks the upgrade
 * @returns The secret upgrade or undefined
 */
export function getSecretUpgradeByCondition(conditionId: string): UpgradeDefinition | undefined {
	return SECRET_UPGRADES.find((u) =>
		u.unlockConditions?.some((c) => c.id === conditionId)
	);
}

/**
 * Check if a secret upgrade's conditions are met.
 *
 * @param upgradeId - Secret upgrade ID
 * @param achievements - Set of unlocked achievement IDs
 * @param secrets - Set of discovered secret IDs
 * @returns Whether the upgrade is unlockable
 */
export function isSecretUnlockable(
	upgradeId: string,
	achievements: Set<string>,
	secrets: Set<string>
): boolean {
	const upgrade = SECRET_UPGRADES.find((u) => u.id === upgradeId);
	if (!upgrade || !upgrade.unlockConditions) return false;

	for (const condition of upgrade.unlockConditions) {
		switch (condition.type) {
			case 'achievement':
				if (!condition.id || !achievements.has(condition.id)) return false;
				break;
			case 'secret':
				if (!condition.id || !secrets.has(condition.id)) return false;
				break;
			default:
				return false;
		}
	}

	return true;
}
