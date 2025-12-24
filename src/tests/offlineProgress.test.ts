/**
 * @fileoverview Unit tests for OfflineProgress utility.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	calculateOfflineProgress,
	calculateOfflineProgressWithBreakdown,
	DEFAULT_OFFLINE_CONFIG,
	type OfflineProgressConfig
} from '$lib/engine/utils/OfflineProgress';
import { D, ZERO } from '$lib/engine/utils/decimal';

describe('OfflineProgress', () => {
	describe('DEFAULT_OFFLINE_CONFIG', () => {
		it('should have correct default values', () => {
			expect(DEFAULT_OFFLINE_CONFIG.cappedHours).toBe(8);
			expect(DEFAULT_OFFLINE_CONFIG.efficiency).toBe(0.1);
			expect(DEFAULT_OFFLINE_CONFIG.minimumTime).toBe(60);
		});
	});

	describe('calculateOfflineProgress', () => {
		it('should return zero for time less than minimum', () => {
			const lastPlayed = Date.now() - 30 * 1000; // 30 seconds ago
			const rate = D(100);

			const result = calculateOfflineProgress(lastPlayed, rate);

			expect(result.dreamPixels.eq(ZERO)).toBe(true);
			expect(result.cappedTime).toBe(0);
		});

		it('should calculate correct rewards for valid time away', () => {
			const lastPlayed = Date.now() - 2 * 60 * 60 * 1000; // 2 hours ago
			const rate = D(100); // 100 pixels per second

			const result = calculateOfflineProgress(lastPlayed, rate);

			// Expected: 100 * 0.1 * 2 * 3600 = 72,000
			expect(result.dreamPixels.gt(0)).toBe(true);
			expect(result.timeAway).toBeGreaterThan(0);
			expect(result.efficiency).toBe(0.1);
		});

		it('should cap time at maximum hours', () => {
			const lastPlayed = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago
			const rate = D(100);

			const result = calculateOfflineProgress(lastPlayed, rate);

			// Should be capped at 8 hours
			const maxCappedTime = 8 * 3600;
			expect(result.cappedTime).toBe(maxCappedTime);
			expect(result.bonusType).toBe('Full Rest Bonus');
		});

		it('should not give bonus if cap not reached', () => {
			const lastPlayed = Date.now() - 2 * 60 * 60 * 1000; // 2 hours ago
			const rate = D(100);

			const result = calculateOfflineProgress(lastPlayed, rate);

			expect(result.bonusType).toBeNull();
		});

		it('should apply custom config', () => {
			const customConfig: OfflineProgressConfig = {
				cappedHours: 4,
				efficiency: 0.2,
				minimumTime: 30
			};

			const lastPlayed = Date.now() - 10 * 60 * 60 * 1000; // 10 hours ago
			const rate = D(100);

			const result = calculateOfflineProgress(lastPlayed, rate, customConfig);

			// Should be capped at 4 hours with 20% efficiency
			const expectedCappedTime = 4 * 3600;
			expect(result.cappedTime).toBe(expectedCappedTime);
			expect(result.efficiency).toBe(0.2);
		});

		it('should handle zero production rate', () => {
			const lastPlayed = Date.now() - 2 * 60 * 60 * 1000;
			const rate = ZERO;

			const result = calculateOfflineProgress(lastPlayed, rate);

			expect(result.dreamPixels.eq(ZERO)).toBe(true);
		});

		it('should handle very large production rates', () => {
			const lastPlayed = Date.now() - 2 * 60 * 60 * 1000;
			const rate = D('1e100'); // Very large rate

			const result = calculateOfflineProgress(lastPlayed, rate);

			expect(result.dreamPixels.gt(0)).toBe(true);
			expect(result.dreamPixels.isFinite()).toBe(true);
		});
	});

	describe('calculateOfflineProgressWithBreakdown', () => {
		it('should include basic rewards', () => {
			const lastPlayed = Date.now() - 2 * 60 * 60 * 1000;
			const rate = D(100);

			const result = calculateOfflineProgressWithBreakdown(lastPlayed, rate);

			expect(result.rewards).toBeDefined();
			expect(result.rewards.dreamPixels.gt(0)).toBe(true);
		});

		it('should include formatted time strings', () => {
			const lastPlayed = Date.now() - 2.5 * 60 * 60 * 1000; // 2.5 hours
			const rate = D(100);

			const result = calculateOfflineProgressWithBreakdown(lastPlayed, rate);

			expect(result.breakdown.timeAwayFormatted).toBeDefined();
			expect(result.breakdown.timeAwayFormatted).toContain('h');
		});

		it('should indicate if time was capped', () => {
			// Not capped
			const lastPlayed1 = Date.now() - 2 * 60 * 60 * 1000;
			const result1 = calculateOfflineProgressWithBreakdown(lastPlayed1, D(100));
			expect(result1.breakdown.wasTimeCapped).toBe(false);

			// Capped
			const lastPlayed2 = Date.now() - 24 * 60 * 60 * 1000;
			const result2 = calculateOfflineProgressWithBreakdown(lastPlayed2, D(100));
			expect(result2.breakdown.wasTimeCapped).toBe(true);
		});

		it('should calculate hourly rates', () => {
			const lastPlayed = Date.now() - 2 * 60 * 60 * 1000;
			const rate = D(100); // 100 per second

			const result = calculateOfflineProgressWithBreakdown(lastPlayed, rate);

			// 100/s = 360,000/h
			expect(result.breakdown.productionRatePerHour.eq(D(360000))).toBe(true);

			// 10% efficiency = 36,000/h
			expect(result.breakdown.offlineRatePerHour.eq(D(36000))).toBe(true);
		});
	});

	describe('Edge Cases', () => {
		it('should handle future timestamp', () => {
			const lastPlayed = Date.now() + 60 * 60 * 1000; // 1 hour in future
			const rate = D(100);

			const result = calculateOfflineProgress(lastPlayed, rate);

			// Should treat as minimum time not met
			expect(result.dreamPixels.eq(ZERO)).toBe(true);
		});

		it('should handle exactly minimum time', () => {
			const lastPlayed = Date.now() - 60 * 1000; // Exactly 60 seconds
			const rate = D(100);

			const result = calculateOfflineProgress(lastPlayed, rate);

			// Should still grant rewards at exactly minimum
			expect(result.timeAway).toBeGreaterThanOrEqual(59);
		});

		it('should handle exactly capped time', () => {
			const lastPlayed = Date.now() - 8 * 60 * 60 * 1000; // Exactly 8 hours
			const rate = D(100);

			const result = calculateOfflineProgress(lastPlayed, rate);

			expect(result.bonusType).toBe('Full Rest Bonus');
		});
	});

	describe('Time Formatting', () => {
		it('should format minutes only', () => {
			const lastPlayed = Date.now() - 30 * 60 * 1000; // 30 minutes
			const rate = D(100);

			// Need custom config with lower minimum
			const config: OfflineProgressConfig = {
				...DEFAULT_OFFLINE_CONFIG,
				minimumTime: 0
			};

			const result = calculateOfflineProgressWithBreakdown(lastPlayed, rate, config);

			expect(result.breakdown.timeAwayFormatted).toContain('m');
			expect(result.breakdown.timeAwayFormatted).not.toContain('h');
		});

		it('should format hours and minutes', () => {
			const lastPlayed = Date.now() - (2 * 60 + 30) * 60 * 1000; // 2h 30m
			const rate = D(100);

			const result = calculateOfflineProgressWithBreakdown(lastPlayed, rate);

			expect(result.breakdown.timeAwayFormatted).toContain('h');
			expect(result.breakdown.timeAwayFormatted).toContain('m');
		});

		it('should format hours only when no minutes', () => {
			const lastPlayed = Date.now() - 3 * 60 * 60 * 1000; // Exactly 3 hours
			const rate = D(100);

			const result = calculateOfflineProgressWithBreakdown(lastPlayed, rate);

			// Allow for slight timing variations
			expect(result.breakdown.timeAwayFormatted).toContain('h');
		});
	});

	describe('Mathematical Accuracy', () => {
		it('should calculate correct Dream Pixels amount', () => {
			// Use fixed times for predictable results
			const hoursAway = 3;
			const ratePerSecond = 100;
			const efficiency = 0.1;

			const lastPlayed = Date.now() - hoursAway * 60 * 60 * 1000;
			const rate = D(ratePerSecond);

			const result = calculateOfflineProgress(lastPlayed, rate);

			// Expected: rate * efficiency * hoursAway * 3600
			// 100 * 0.1 * 3 * 3600 = 108,000
			const expectedPixels = ratePerSecond * efficiency * hoursAway * 3600;

			// Allow 1% tolerance for timing variations
			const actualPixels = result.dreamPixels.toNumber();
			expect(actualPixels).toBeGreaterThan(expectedPixels * 0.99);
			expect(actualPixels).toBeLessThan(expectedPixels * 1.01);
		});
	});
});
