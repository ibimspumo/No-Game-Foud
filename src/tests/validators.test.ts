/**
 * @fileoverview Unit tests for data validators.
 * Tests validation utilities including story validation, type guards, and ID checks.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	isValidPhaseDefinition,
	isValidUpgradeDefinition,
	isValidAchievementDefinition,
	isValidDialogueDefinition,
	isValidCondition,
	isValidEndingDefinition,
	checkUniqueIds,
	validateStoryReferences,
	validateAllData,
	validateGameData,
	type ValidationResult,
	type ValidationError
} from '../lib/engine/data/validators';
import type { Dialogue, LogDefinition, StoryEvent } from '../lib/engine/models/narrative';

// ============================================================================
// Type Guard Tests
// ============================================================================

describe('Type Guards', () => {
	describe('isValidCondition', () => {
		it('should validate resource condition', () => {
			const condition = {
				type: 'resource',
				resourceId: 'pixels',
				amount: 100
			};
			expect(isValidCondition(condition)).toBe(true);
		});

		it('should validate time condition', () => {
			const condition = {
				type: 'time',
				minSeconds: 60
			};
			expect(isValidCondition(condition)).toBe(true);
		});

		it('should validate phase condition', () => {
			const condition = {
				type: 'phase',
				phase: 2
			};
			expect(isValidCondition(condition)).toBe(true);
		});

		it('should validate producer condition', () => {
			const condition = {
				type: 'producer',
				producerId: 'pixel_generator',
				amount: 5
			};
			expect(isValidCondition(condition)).toBe(true);
		});

		it('should validate upgrade condition', () => {
			const condition = {
				type: 'upgrade',
				upgradeId: 'some_upgrade'
			};
			expect(isValidCondition(condition)).toBe(true);
		});

		it('should validate achievement condition', () => {
			const condition = {
				type: 'achievement',
				achievementId: 'first_achievement'
			};
			expect(isValidCondition(condition)).toBe(true);
		});

		it('should validate AND condition', () => {
			const condition = {
				type: 'and',
				conditions: [
					{ type: 'resource', resourceId: 'pixels', amount: 100 },
					{ type: 'time', minSeconds: 30 }
				]
			};
			expect(isValidCondition(condition)).toBe(true);
		});

		it('should validate OR condition', () => {
			const condition = {
				type: 'or',
				conditions: [
					{ type: 'phase', phase: 2 },
					{ type: 'resource', resourceId: 'pixels', amount: 1000 }
				]
			};
			expect(isValidCondition(condition)).toBe(true);
		});

		it('should validate NOT condition', () => {
			const condition = {
				type: 'not',
				condition: { type: 'achievement', achievementId: 'some_achievement' }
			};
			expect(isValidCondition(condition)).toBe(true);
		});

		it('should validate always condition', () => {
			const condition = { type: 'always' };
			expect(isValidCondition(condition)).toBe(true);
		});

		it('should validate never condition', () => {
			const condition = { type: 'never' };
			expect(isValidCondition(condition)).toBe(true);
		});

		it('should reject invalid condition type', () => {
			const condition = {
				type: 'invalid_type'
			};
			expect(isValidCondition(condition)).toBe(false);
		});

		it('should reject null condition', () => {
			expect(isValidCondition(null)).toBe(false);
		});

		it('should reject undefined condition', () => {
			expect(isValidCondition(undefined)).toBe(false);
		});

		it('should reject resource condition without resourceId', () => {
			const condition = {
				type: 'resource',
				amount: 100
			};
			expect(isValidCondition(condition)).toBe(false);
		});

		it('should reject nested AND with invalid sub-condition', () => {
			const condition = {
				type: 'and',
				conditions: [{ type: 'invalid' }]
			};
			expect(isValidCondition(condition)).toBe(false);
		});
	});

	describe('isValidDialogueDefinition', () => {
		it('should validate valid dialogue', () => {
			const dialogue: Dialogue = {
				id: 'dialogue_001',
				speaker: 'pixel',
				lines: [{ text: 'Hello', delay: 1000 }],
				pausesGame: false,
				isEmotionalMoment: false,
				canSkipLines: true
			};
			expect(isValidDialogueDefinition(dialogue)).toBe(true);
		});

		it('should validate dialogue with all valid speakers', () => {
			const speakers = ['pixel', 'sun', 'andromeda', 'void', 'old_woman', 'city_ai', 'president', 'narrator', 'unknown'];

			for (const speaker of speakers) {
				const dialogue: Dialogue = {
					id: `dialogue_${speaker}`,
					speaker: speaker as any,
					lines: [{ text: 'Test', delay: 1000 }],
					pausesGame: false,
					isEmotionalMoment: false,
					canSkipLines: true
				};
				expect(isValidDialogueDefinition(dialogue)).toBe(true);
			}
		});

		it('should reject dialogue without id', () => {
			const dialogue = {
				speaker: 'pixel',
				lines: [{ text: 'Hello', delay: 1000 }],
				pausesGame: false,
				isEmotionalMoment: false,
				canSkipLines: true
			};
			expect(isValidDialogueDefinition(dialogue)).toBe(false);
		});

		it('should reject dialogue with invalid speaker', () => {
			const dialogue = {
				id: 'dialogue_001',
				speaker: 'invalid_speaker',
				lines: [{ text: 'Hello', delay: 1000 }],
				pausesGame: false,
				isEmotionalMoment: false,
				canSkipLines: true
			};
			expect(isValidDialogueDefinition(dialogue)).toBe(false);
		});

		it('should reject dialogue with empty lines', () => {
			const dialogue = {
				id: 'dialogue_001',
				speaker: 'pixel',
				lines: [],
				pausesGame: false,
				isEmotionalMoment: false,
				canSkipLines: true
			};
			expect(isValidDialogueDefinition(dialogue)).toBe(false);
		});

		it('should reject dialogue with invalid line', () => {
			const dialogue = {
				id: 'dialogue_001',
				speaker: 'pixel',
				lines: [{ text: '', delay: 1000 }],
				pausesGame: false,
				isEmotionalMoment: false,
				canSkipLines: true
			};
			expect(isValidDialogueDefinition(dialogue)).toBe(false);
		});

		it('should reject null dialogue', () => {
			expect(isValidDialogueDefinition(null)).toBe(false);
		});
	});

	describe('isValidEndingDefinition', () => {
		it('should validate valid ending definition', () => {
			const ending = {
				id: 'the_creator',
				name: 'The Creator',
				description: 'Create a new universe',
				requirements: [],
				path: 'peaceful'
			};
			expect(isValidEndingDefinition(ending)).toBe(true);
		});

		it('should reject ending without name', () => {
			const ending = {
				id: 'the_creator',
				description: 'Create a new universe',
				requirements: [],
				path: 'peaceful'
			};
			expect(isValidEndingDefinition(ending)).toBe(false);
		});

		it('should reject ending without id', () => {
			const ending = {
				name: 'The Creator',
				description: 'Create a new universe',
				requirements: [],
				path: 'peaceful'
			};
			expect(isValidEndingDefinition(ending)).toBe(false);
		});

		it('should reject null ending', () => {
			expect(isValidEndingDefinition(null)).toBe(false);
		});
	});
});

// ============================================================================
// ID Uniqueness Tests
// ============================================================================

describe('checkUniqueIds', () => {
	it('should return empty array for unique IDs', () => {
		const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
		const errors = checkUniqueIds(items, 'testItems');
		expect(errors).toHaveLength(0);
	});

	it('should detect duplicate IDs', () => {
		const items = [{ id: 'a' }, { id: 'b' }, { id: 'a' }];
		const errors = checkUniqueIds(items, 'testItems');

		expect(errors).toHaveLength(1);
		expect(errors[0].message).toContain('Duplicate ID');
		expect(errors[0].message).toContain('"a"');
	});

	it('should detect multiple duplicates', () => {
		const items = [
			{ id: 'a' },
			{ id: 'b' },
			{ id: 'a' },
			{ id: 'b' },
			{ id: 'c' }
		];
		const errors = checkUniqueIds(items, 'testItems');
		expect(errors).toHaveLength(2);
	});

	it('should handle numeric IDs', () => {
		const items = [{ id: 1 }, { id: 2 }, { id: 1 }];
		const errors = checkUniqueIds(items, 'testItems');
		expect(errors).toHaveLength(1);
	});

	it('should handle empty array', () => {
		const items: { id: string }[] = [];
		const errors = checkUniqueIds(items, 'testItems');
		expect(errors).toHaveLength(0);
	});

	it('should include correct path in error', () => {
		const items = [{ id: 'dup' }, { id: 'dup' }];
		const errors = checkUniqueIds(items, 'myCollection');

		expect(errors[0].path).toContain('myCollection');
		expect(errors[0].path).toContain('[1]');
	});

	it('should mark duplicates as critical severity', () => {
		const items = [{ id: 'a' }, { id: 'a' }];
		const errors = checkUniqueIds(items, 'test');

		expect(errors[0].severity).toBe('critical');
	});
});

// ============================================================================
// Story Validation Tests
// ============================================================================

describe('validateStoryReferences', () => {
	it('should return valid result when no story data is cached', () => {
		const result = validateStoryReferences();

		expect(result.valid).toBe(true);
		expect(result.warnings.length).toBeGreaterThanOrEqual(0);
	});

	it('should have timestamp in result', () => {
		const result = validateStoryReferences();

		expect(result.timestamp).toBeDefined();
		expect(result.timestamp).toBeGreaterThan(0);
	});
});

// ============================================================================
// Comprehensive Validation Tests
// ============================================================================

describe('validateAllData', () => {
	it('should return aggregated validation result', () => {
		const result = validateAllData();

		expect(result).toHaveProperty('valid');
		expect(result).toHaveProperty('errors');
		expect(result).toHaveProperty('warnings');
		expect(result).toHaveProperty('timestamp');
		expect(result).toHaveProperty('stats');
	});

	it('should have stats in result', () => {
		const result = validateAllData();

		expect(result.stats).toBeDefined();
		expect(result.stats).toHaveProperty('totalChecks');
		expect(result.stats).toHaveProperty('passedChecks');
		expect(result.stats).toHaveProperty('failedChecks');
		expect(result.stats).toHaveProperty('warningCount');
	});
});

describe('validateGameData', () => {
	it('should return validation result without options', () => {
		const result = validateGameData();

		expect(result).toHaveProperty('valid');
		expect(result).toHaveProperty('errors');
		expect(result).toHaveProperty('warnings');
	});

	it('should work with verbose option', () => {
		// Mock console methods
		const consoleSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
		const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
		const groupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

		const result = validateGameData({ verbose: true });

		expect(result).toHaveProperty('valid');
		expect(consoleSpy).toHaveBeenCalled();

		consoleSpy.mockRestore();
		logSpy.mockRestore();
		groupEndSpy.mockRestore();
	});

	it('should work with includeWarnings option', () => {
		const consoleSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
		const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
		const groupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const result = validateGameData({ verbose: true, includeWarnings: true });

		expect(result).toHaveProperty('valid');

		consoleSpy.mockRestore();
		logSpy.mockRestore();
		groupEndSpy.mockRestore();
		warnSpy.mockRestore();
	});
});

// ============================================================================
// ValidationResult Type Tests
// ============================================================================

describe('ValidationResult structure', () => {
	it('should correctly aggregate errors array', () => {
		const result = validateAllData();

		expect(Array.isArray(result.errors)).toBe(true);
		result.errors.forEach((error: ValidationError) => {
			expect(error).toHaveProperty('path');
			expect(error).toHaveProperty('message');
		});
	});

	it('should correctly aggregate warnings array', () => {
		const result = validateAllData();

		expect(Array.isArray(result.warnings)).toBe(true);
		result.warnings.forEach((warning) => {
			expect(warning).toHaveProperty('path');
			expect(warning).toHaveProperty('message');
		});
	});
});
