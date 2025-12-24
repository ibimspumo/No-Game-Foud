/**
 * @fileoverview Offline progression calculation system
 * Calculates "Dream Pixels" earned while the player is away from the game.
 * Implements a capped offline progression system to reward returning players.
 *
 * @module engine/utils/OfflineProgress
 */

import { type Decimal, D, ZERO, mul, min } from './decimal';

/**
 * Configuration for offline progression calculations.
 */
export interface OfflineProgressConfig {
	/**
	 * Maximum hours that count towards offline rewards.
	 * @default 8
	 */
	cappedHours: number;

	/**
	 * Efficiency multiplier for offline production (0.1 = 10% of normal rate).
	 * @default 0.1
	 */
	efficiency: number;

	/**
	 * Minimum time away in seconds to qualify for offline rewards.
	 * Prevents exploitation through rapid reconnects.
	 * @default 60
	 */
	minimumTime: number;
}

/**
 * Represents the rewards earned during offline time.
 */
export interface OfflineReward {
	/**
	 * Amount of Dream Pixels earned while offline.
	 */
	dreamPixels: Decimal;

	/**
	 * Total time away in seconds.
	 */
	timeAway: number;

	/**
	 * Time that counted towards rewards (capped) in seconds.
	 */
	cappedTime: number;

	/**
	 * Efficiency rate applied to the calculation.
	 */
	efficiency: number;

	/**
	 * Type of bonus applied, if any.
	 */
	bonusType: 'Full Rest Bonus' | null;
}

/**
 * Detailed breakdown of the offline progression calculation.
 */
export interface OfflineCalculationResult {
	/**
	 * The calculated rewards.
	 */
	rewards: OfflineReward;

	/**
	 * Human-readable breakdown of the calculation.
	 */
	breakdown: {
		/**
		 * Time away formatted as hours and minutes.
		 */
		timeAwayFormatted: string;

		/**
		 * Capped time formatted as hours and minutes.
		 */
		cappedTimeFormatted: string;

		/**
		 * Current production rate per second.
		 */
		productionRate: Decimal;

		/**
		 * Production rate per hour.
		 */
		productionRatePerHour: Decimal;

		/**
		 * Offline production rate per hour (after efficiency).
		 */
		offlineRatePerHour: Decimal;

		/**
		 * Whether the time cap was reached.
		 */
		wasTimeCapped: boolean;
	};
}

/**
 * Default configuration for offline progression.
 * - Cap at 8 hours (encourages regular play sessions)
 * - 10% efficiency (balances offline vs active play)
 * - 60 second minimum (prevents exploit)
 */
export const DEFAULT_OFFLINE_CONFIG: OfflineProgressConfig = {
	cappedHours: 8,
	efficiency: 0.1,
	minimumTime: 60
};

/**
 * Formats seconds into a human-readable hours and minutes string.
 *
 * @param seconds - Time in seconds
 * @returns Formatted string like "2h 30m" or "45m"
 */
function formatTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);

	if (hours > 0 && minutes > 0) {
		return `${hours}h ${minutes}m`;
	} else if (hours > 0) {
		return `${hours}h`;
	} else if (minutes > 0) {
		return `${minutes}m`;
	} else {
		return `${seconds}s`;
	}
}

/**
 * Calculates offline progression rewards (Dream Pixels).
 *
 * Formula:
 * - Base rate: currentProductionRate * efficiency (default 10%)
 * - Time multiplier: hours away (capped at configurable maximum)
 * - Result: baseRate * timeMultiplier
 *
 * @param lastPlayedAt - Unix timestamp (milliseconds) when player last played
 * @param currentProductionRate - Current pixel production rate per second
 * @param config - Optional configuration (uses defaults if not provided)
 * @returns Offline reward details
 *
 * @example
 * const lastPlayed = Date.now() - (3 * 60 * 60 * 1000); // 3 hours ago
 * const rate = D(100); // 100 pixels/sec
 * const reward = calculateOfflineProgress(lastPlayed, rate);
 * // reward.dreamPixels will be approximately 100 * 0.1 * 3 * 3600 = 108,000
 */
export function calculateOfflineProgress(
	lastPlayedAt: number,
	currentProductionRate: Decimal,
	config: OfflineProgressConfig = DEFAULT_OFFLINE_CONFIG
): OfflineReward {
	const now = Date.now();
	const timeAwayMs = now - lastPlayedAt;
	const timeAway = Math.floor(timeAwayMs / 1000); // Convert to seconds

	// Check minimum time requirement
	if (timeAway < config.minimumTime) {
		return {
			dreamPixels: ZERO,
			timeAway,
			cappedTime: 0,
			efficiency: config.efficiency,
			bonusType: null
		};
	}

	// Calculate hours and apply cap
	const hoursAway = timeAway / 3600;
	const cappedHours = Math.min(hoursAway, config.cappedHours);
	const cappedTime = Math.floor(cappedHours * 3600);

	// Calculate Dream Pixels
	// Formula: productionRate * efficiency * timeInSeconds
	const efficiencyMultiplier = D(config.efficiency);
	const offlineRate = mul(currentProductionRate, efficiencyMultiplier);
	const dreamPixels = mul(offlineRate, cappedTime);

	// Determine bonus type
	const bonusType = cappedHours >= config.cappedHours ? 'Full Rest Bonus' : null;

	return {
		dreamPixels,
		timeAway,
		cappedTime,
		efficiency: config.efficiency,
		bonusType
	};
}

/**
 * Calculates offline progression with detailed breakdown information.
 * Useful for displaying to the player what they earned and why.
 *
 * @param lastPlayedAt - Unix timestamp (milliseconds) when player last played
 * @param currentProductionRate - Current pixel production rate per second
 * @param config - Optional configuration (uses defaults if not provided)
 * @returns Detailed calculation result with breakdown
 *
 * @example
 * const result = calculateOfflineProgressWithBreakdown(
 *   Date.now() - (5 * 60 * 60 * 1000),
 *   D(50)
 * );
 * console.log(result.breakdown.timeAwayFormatted); // "5h"
 * console.log(result.breakdown.wasTimeCapped); // false
 */
export function calculateOfflineProgressWithBreakdown(
	lastPlayedAt: number,
	currentProductionRate: Decimal,
	config: OfflineProgressConfig = DEFAULT_OFFLINE_CONFIG
): OfflineCalculationResult {
	const rewards = calculateOfflineProgress(lastPlayedAt, currentProductionRate, config);

	// Calculate additional breakdown details
	const productionRatePerHour = mul(currentProductionRate, 3600);
	const offlineRatePerHour = mul(productionRatePerHour, config.efficiency);
	const wasTimeCapped = rewards.timeAway > config.cappedHours * 3600;

	return {
		rewards,
		breakdown: {
			timeAwayFormatted: formatTime(rewards.timeAway),
			cappedTimeFormatted: formatTime(rewards.cappedTime),
			productionRate: D(currentProductionRate),
			productionRatePerHour,
			offlineRatePerHour,
			wasTimeCapped
		}
	};
}
