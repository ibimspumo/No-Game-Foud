/**
 * @fileoverview Tests for the PhaseManager system.
 * Tests phase progression, condition evaluation, and transitions.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PhaseManager, type PhaseManagerContext } from '../lib/engine/systems/PhaseManager.svelte';
import { ConditionEvaluator, Conditions, type EvaluationContext } from '../lib/engine/systems/ConditionEvaluator';
import { EventManager } from '../lib/engine/core/EventManager';
import { getPhaseDefinitionsMap, PHASE_DEFINITIONS } from '../lib/engine/data/phases';
import { D, ZERO } from '../lib/engine/utils/decimal';
import type { PhaseDefinition } from '../lib/engine/models/phase';

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Create a mock PhaseManagerContext for testing.
 */
function createMockContext(overrides: Partial<PhaseManagerContext> = {}): PhaseManagerContext {
	return {
		getResourceAmount: vi.fn().mockReturnValue(ZERO),
		getProducerCount: vi.fn().mockReturnValue(0),
		hasUpgrade: vi.fn().mockReturnValue(false),
		getUpgradeLevel: vi.fn().mockReturnValue(0),
		hasAchievement: vi.fn().mockReturnValue(false),
		getChoiceValue: vi.fn().mockReturnValue(undefined),
		...overrides
	};
}

/**
 * Create a mock EvaluationContext for condition evaluator tests.
 */
function createMockEvalContext(overrides: Partial<EvaluationContext> = {}): EvaluationContext {
	return {
		getResourceAmount: vi.fn().mockReturnValue(ZERO),
		getCurrentPhaseTime: vi.fn().mockReturnValue(0),
		getChoiceValue: vi.fn().mockReturnValue(undefined),
		getCurrentPhase: vi.fn().mockReturnValue(1),
		isPhaseCompleted: vi.fn().mockReturnValue(false),
		getProducerCount: vi.fn().mockReturnValue(0),
		hasUpgrade: vi.fn().mockReturnValue(false),
		getUpgradeLevel: vi.fn().mockReturnValue(0),
		hasAchievement: vi.fn().mockReturnValue(false),
		...overrides
	};
}

// ============================================================================
// Condition Evaluator Tests
// ============================================================================

describe('ConditionEvaluator', () => {
	describe('Resource Conditions', () => {
		it('should evaluate resource >= condition correctly', () => {
			const context = createMockEvalContext({
				getResourceAmount: vi.fn().mockReturnValue(D(100))
			});
			const evaluator = new ConditionEvaluator(context);

			// Should pass: 100 >= 50
			expect(evaluator.evaluate(Conditions.resource('pixels', 50))).toBe(true);

			// Should fail: 100 >= 150
			expect(evaluator.evaluate(Conditions.resource('pixels', 150))).toBe(false);

			// Should pass: 100 >= 100
			expect(evaluator.evaluate(Conditions.resource('pixels', 100))).toBe(true);
		});

		it('should evaluate resource with different operators', () => {
			const context = createMockEvalContext({
				getResourceAmount: vi.fn().mockReturnValue(D(100))
			});
			const evaluator = new ConditionEvaluator(context);

			// Greater than
			expect(evaluator.evaluate(Conditions.resource('pixels', 99, 'gt'))).toBe(true);
			expect(evaluator.evaluate(Conditions.resource('pixels', 100, 'gt'))).toBe(false);

			// Less than
			expect(evaluator.evaluate(Conditions.resource('pixels', 101, 'lt'))).toBe(true);
			expect(evaluator.evaluate(Conditions.resource('pixels', 100, 'lt'))).toBe(false);

			// Equal
			expect(evaluator.evaluate(Conditions.resource('pixels', 100, 'eq'))).toBe(true);
			expect(evaluator.evaluate(Conditions.resource('pixels', 99, 'eq'))).toBe(false);
		});

		it('should calculate resource progress correctly', () => {
			const context = createMockEvalContext({
				getResourceAmount: vi.fn().mockReturnValue(D(50))
			});
			const evaluator = new ConditionEvaluator(context);

			const result = evaluator.evaluateWithDetails(Conditions.resource('pixels', 100));
			expect(result.met).toBe(false);
			expect(result.progress).toBe(0.5);
		});

		it('should handle large numbers (scientific notation)', () => {
			const context = createMockEvalContext({
				getResourceAmount: vi.fn().mockReturnValue(D('1e50'))
			});
			const evaluator = new ConditionEvaluator(context);

			expect(evaluator.evaluate(Conditions.resource('pixels', '1e49'))).toBe(true);
			expect(evaluator.evaluate(Conditions.resource('pixels', '1e51'))).toBe(false);
		});
	});

	describe('Time Conditions', () => {
		it('should evaluate time condition correctly', () => {
			const context = createMockEvalContext({
				getCurrentPhaseTime: vi.fn().mockReturnValue(120)
			});
			const evaluator = new ConditionEvaluator(context);

			expect(evaluator.evaluate(Conditions.time(60))).toBe(true);
			expect(evaluator.evaluate(Conditions.time(180))).toBe(false);
		});

		it('should calculate time progress correctly', () => {
			const context = createMockEvalContext({
				getCurrentPhaseTime: vi.fn().mockReturnValue(30)
			});
			const evaluator = new ConditionEvaluator(context);

			const result = evaluator.evaluateWithDetails(Conditions.time(60));
			expect(result.met).toBe(false);
			expect(result.progress).toBe(0.5);
		});

		it('should support timeMinutes helper', () => {
			const context = createMockEvalContext({
				getCurrentPhaseTime: vi.fn().mockReturnValue(600) // 10 minutes
			});
			const evaluator = new ConditionEvaluator(context);

			expect(evaluator.evaluate(Conditions.timeMinutes(5))).toBe(true);
			expect(evaluator.evaluate(Conditions.timeMinutes(15))).toBe(false);
		});
	});

	describe('Composite Conditions', () => {
		it('should evaluate AND conditions correctly', () => {
			const context = createMockEvalContext({
				getResourceAmount: vi.fn().mockReturnValue(D(100)),
				getCurrentPhaseTime: vi.fn().mockReturnValue(120)
			});
			const evaluator = new ConditionEvaluator(context);

			// Both conditions met
			const andCondition = Conditions.and(
				Conditions.resource('pixels', 50),
				Conditions.time(60)
			);
			expect(evaluator.evaluate(andCondition)).toBe(true);

			// Only one condition met
			const andCondition2 = Conditions.and(
				Conditions.resource('pixels', 150),
				Conditions.time(60)
			);
			expect(evaluator.evaluate(andCondition2)).toBe(false);
		});

		it('should evaluate OR conditions correctly', () => {
			const context = createMockEvalContext({
				getResourceAmount: vi.fn().mockReturnValue(D(100)),
				getCurrentPhaseTime: vi.fn().mockReturnValue(30)
			});
			const evaluator = new ConditionEvaluator(context);

			// At least one condition met
			const orCondition = Conditions.or(
				Conditions.resource('pixels', 50),
				Conditions.time(60)
			);
			expect(evaluator.evaluate(orCondition)).toBe(true);

			// Neither condition met
			const orCondition2 = Conditions.or(
				Conditions.resource('pixels', 150),
				Conditions.time(60)
			);
			expect(evaluator.evaluate(orCondition2)).toBe(false);
		});

		it('should evaluate NOT conditions correctly', () => {
			const context = createMockEvalContext({
				getResourceAmount: vi.fn().mockReturnValue(D(100))
			});
			const evaluator = new ConditionEvaluator(context);

			// NOT (pixels >= 50) = false
			expect(evaluator.evaluate(Conditions.not(Conditions.resource('pixels', 50)))).toBe(false);

			// NOT (pixels >= 150) = true
			expect(evaluator.evaluate(Conditions.not(Conditions.resource('pixels', 150)))).toBe(true);
		});

		it('should handle nested composite conditions', () => {
			const context = createMockEvalContext({
				getResourceAmount: vi.fn().mockReturnValue(D(100)),
				getCurrentPhaseTime: vi.fn().mockReturnValue(120)
			});
			const evaluator = new ConditionEvaluator(context);

			// (pixels >= 50 AND time >= 60) OR (pixels >= 200)
			const nestedCondition = Conditions.or(
				Conditions.and(
					Conditions.resource('pixels', 50),
					Conditions.time(60)
				),
				Conditions.resource('pixels', 200)
			);
			expect(evaluator.evaluate(nestedCondition)).toBe(true);
		});
	});

	describe('Special Conditions', () => {
		it('should evaluate always condition as true', () => {
			const evaluator = new ConditionEvaluator(createMockEvalContext());
			expect(evaluator.evaluate(Conditions.always())).toBe(true);
		});

		it('should evaluate never condition as false', () => {
			const evaluator = new ConditionEvaluator(createMockEvalContext());
			expect(evaluator.evaluate(Conditions.never())).toBe(false);
		});

		it('should evaluate producer conditions', () => {
			const context = createMockEvalContext({
				getProducerCount: vi.fn().mockReturnValue(5)
			});
			const evaluator = new ConditionEvaluator(context);

			expect(evaluator.evaluate(Conditions.producer('pixel_generator', 3))).toBe(true);
			expect(evaluator.evaluate(Conditions.producer('pixel_generator', 10))).toBe(false);
		});

		it('should evaluate upgrade conditions', () => {
			const context = createMockEvalContext({
				hasUpgrade: vi.fn().mockReturnValue(true),
				getUpgradeLevel: vi.fn().mockReturnValue(3)
			});
			const evaluator = new ConditionEvaluator(context);

			expect(evaluator.evaluate(Conditions.upgrade('auto_pixel'))).toBe(true);
			expect(evaluator.evaluate(Conditions.upgrade('auto_pixel', 2))).toBe(true);
			expect(evaluator.evaluate(Conditions.upgrade('auto_pixel', 5))).toBe(false);
		});

		it('should evaluate achievement conditions', () => {
			const context = createMockEvalContext({
				hasAchievement: vi.fn().mockReturnValue(true)
			});
			const evaluator = new ConditionEvaluator(context);

			expect(evaluator.evaluate(Conditions.achievement('first_pixel'))).toBe(true);
		});

		it('should evaluate choice conditions', () => {
			const context = createMockEvalContext({
				getChoiceValue: vi.fn().mockReturnValue('order')
			});
			const evaluator = new ConditionEvaluator(context);

			expect(evaluator.evaluate(Conditions.choice('order_chaos', 'order'))).toBe(true);
			expect(evaluator.evaluate(Conditions.choice('order_chaos', 'chaos'))).toBe(false);
		});
	});

	describe('Progress Calculation', () => {
		it('should calculate overall progress for multiple conditions', () => {
			const context = createMockEvalContext({
				getResourceAmount: vi.fn().mockReturnValue(D(50)), // 50% progress
				getCurrentPhaseTime: vi.fn().mockReturnValue(30) // 50% progress to 60s
			});
			const evaluator = new ConditionEvaluator(context);

			const conditions = [
				Conditions.resource('pixels', 100),
				Conditions.time(60)
			];

			const progress = evaluator.evaluateProgress(conditions);
			expect(progress).toBe(0.5);
		});
	});
});

// ============================================================================
// Phase Data Tests
// ============================================================================

describe('Phase Definitions', () => {
	it('should have all 20 phases defined', () => {
		expect(Object.keys(PHASE_DEFINITIONS)).toHaveLength(20);
	});

	it('should have valid phase IDs from 1 to 20', () => {
		for (let i = 1; i <= 20; i++) {
			expect(PHASE_DEFINITIONS[i]).toBeDefined();
			expect(PHASE_DEFINITIONS[i].id).toBe(i);
		}
	});

	it('should have phases 1-10 in pixel mode', () => {
		for (let i = 1; i <= 10; i++) {
			expect(PHASE_DEFINITIONS[i].visualMode).toBe('pixel');
		}
	});

	it('should have phases 11-20 in abstract mode', () => {
		for (let i = 11; i <= 20; i++) {
			expect(PHASE_DEFINITIONS[i].visualMode).toBe('abstract');
		}
	});

	it('should have boss phases at 12 and 16', () => {
		expect(PHASE_DEFINITIONS[12].isBossPhase).toBe(true);
		expect(PHASE_DEFINITIONS[16].isBossPhase).toBe(true);
	});

	it('should have meditation phase at 18', () => {
		expect(PHASE_DEFINITIONS[18].isMeditationPhase).toBe(true);
	});

	it('should have valid transition conditions for each phase', () => {
		for (let i = 1; i <= 19; i++) {
			const phase = PHASE_DEFINITIONS[i];
			expect(phase.transitionConditions).toBeDefined();
			expect(Array.isArray(phase.transitionConditions)).toBe(true);
		}
	});
});

// ============================================================================
// PhaseManager Tests
// ============================================================================

describe('PhaseManager', () => {
	let eventManager: EventManager;
	let phaseManager: PhaseManager;
	let mockContext: PhaseManagerContext;

	beforeEach(() => {
		eventManager = new EventManager(false);
		const definitions = getPhaseDefinitionsMap();
		phaseManager = new PhaseManager(eventManager, definitions);
		mockContext = createMockContext();
	});

	describe('Initialization', () => {
		it('should start at phase 1', () => {
			expect(phaseManager.currentPhase).toBe(1);
		});

		it('should have phase 1 unlocked', () => {
			expect(phaseManager.isPhaseUnlocked(1)).toBe(true);
		});

		it('should be in pixel mode at start', () => {
			expect(phaseManager.visualMode).toBe('pixel');
		});

		it('should have clicking enabled at phase 1', () => {
			expect(phaseManager.clickingEnabled).toBe(true);
		});

		it('should not be a boss or meditation phase initially', () => {
			expect(phaseManager.isBossPhase).toBe(false);
			expect(phaseManager.isMeditationPhase).toBe(false);
		});
	});

	describe('Phase Progress', () => {
		beforeEach(() => {
			phaseManager.init();
		});

		it('should mark phase 1 as entered after init', () => {
			const progress = phaseManager.getPhaseProgress(1);
			expect(progress?.entered).toBe(true);
			expect(progress?.timesEntered).toBe(1);
		});

		it('should track time spent in phase', () => {
			phaseManager.setContext(mockContext);
			phaseManager.tick(1.0);

			expect(phaseManager.currentPhaseTime).toBeGreaterThan(0);
		});
	});

	describe('Phase Transitions', () => {
		beforeEach(() => {
			phaseManager.init();
		});

		it('should not allow advance when conditions are not met', async () => {
			phaseManager.setContext(mockContext);

			const success = await phaseManager.advancePhase();
			expect(success).toBe(false);
			expect(phaseManager.currentPhase).toBe(1);
		});

		it('should allow advance when conditions are met', async () => {
			// Mock context with enough resources for phase 1 -> 2 transition (64 pixels)
			const richContext = createMockContext({
				getResourceAmount: vi.fn().mockReturnValue(D(100))
			});
			phaseManager.setContext(richContext);

			// Tick to update canAdvance state
			phaseManager.tick(0.1);

			const success = await phaseManager.advancePhase();
			expect(success).toBe(true);
			expect(phaseManager.currentPhase).toBe(2);
		});

		it('should mark previous phase as completed after transition', async () => {
			const richContext = createMockContext({
				getResourceAmount: vi.fn().mockReturnValue(D(100))
			});
			phaseManager.setContext(richContext);

			// Tick to update canAdvance state
			phaseManager.tick(0.1);

			await phaseManager.advancePhase();

			const progress = phaseManager.getPhaseProgress(1);
			expect(progress?.completed).toBe(true);
		});

		it('should unlock next phase after transition', async () => {
			const richContext = createMockContext({
				getResourceAmount: vi.fn().mockReturnValue(D(100))
			});
			phaseManager.setContext(richContext);

			expect(phaseManager.isPhaseUnlocked(2)).toBe(false);

			// Tick to update canAdvance state
			phaseManager.tick(0.1);

			await phaseManager.advancePhase();

			expect(phaseManager.isPhaseUnlocked(2)).toBe(true);
		});

		it('should emit phase_entered event on transition', async () => {
			const richContext = createMockContext({
				getResourceAmount: vi.fn().mockReturnValue(D(100))
			});
			phaseManager.setContext(richContext);

			const listener = vi.fn();
			eventManager.on('phase_entered', listener);

			// Tick to update canAdvance state
			phaseManager.tick(0.1);

			await phaseManager.advancePhase();

			expect(listener).toHaveBeenCalledWith(expect.objectContaining({
				previousPhase: 1,
				newPhase: 2,
				isFirstTime: true
			}));
		});
	});

	describe('Visual Mode Switching', () => {
		beforeEach(() => {
			phaseManager.init();
		});

		it('should switch to abstract mode at phase 11', () => {
			phaseManager.debugSetPhase(11);
			expect(phaseManager.visualMode).toBe('abstract');
		});

		it('should stay in pixel mode at phase 10', () => {
			phaseManager.debugSetPhase(10);
			expect(phaseManager.visualMode).toBe('pixel');
		});
	});

	describe('Serialization', () => {
		beforeEach(() => {
			phaseManager.init();
		});

		it('should serialize current state', () => {
			const serialized = phaseManager.serialize();

			expect(serialized).toHaveProperty('currentPhase', 1);
			expect(serialized).toHaveProperty('unlockedPhases');
			expect(serialized).toHaveProperty('phaseProgress');
		});

		it('should deserialize and restore state', async () => {
			// Advance to phase 2
			const richContext = createMockContext({
				getResourceAmount: vi.fn().mockReturnValue(D(100))
			});
			phaseManager.setContext(richContext);

			// Tick to update canAdvance state
			phaseManager.tick(0.1);

			await phaseManager.advancePhase();

			const serialized = phaseManager.serialize();

			// Create new manager and deserialize
			const newManager = new PhaseManager(eventManager, getPhaseDefinitionsMap());
			newManager.deserialize(serialized);

			expect(newManager.currentPhase).toBe(2);
			expect(newManager.isPhaseUnlocked(2)).toBe(true);
			expect(newManager.isPhaseCompleted(1)).toBe(true);
		});
	});

	describe('Debug Functions', () => {
		beforeEach(() => {
			phaseManager.init();
		});

		it('should force set phase with debugSetPhase', () => {
			phaseManager.debugSetPhase(5);

			expect(phaseManager.currentPhase).toBe(5);
			expect(phaseManager.isPhaseUnlocked(5)).toBe(true);
		});

		it('should unlock all previous phases with debugSetPhase', () => {
			phaseManager.debugSetPhase(5);

			for (let i = 1; i <= 5; i++) {
				expect(phaseManager.isPhaseUnlocked(i)).toBe(true);
			}
		});

		it('should mark previous phases as completed with debugSetPhase', () => {
			phaseManager.debugSetPhase(5);

			for (let i = 1; i < 5; i++) {
				expect(phaseManager.isPhaseCompleted(i)).toBe(true);
			}
		});

		it('should return debug info', () => {
			const debugInfo = phaseManager.getDebugInfo();

			expect(debugInfo).toHaveProperty('currentPhase');
			expect(debugInfo).toHaveProperty('visualMode');
			expect(debugInfo).toHaveProperty('unlockedPhases');
		});
	});

	describe('Story Integration', () => {
		beforeEach(() => {
			phaseManager.init();
		});

		it('should record story choices', () => {
			phaseManager.recordChoice('order_chaos', 'order');

			expect(phaseManager.getChoice('order_chaos')).toBe('order');
		});

		it('should track triggered events', () => {
			phaseManager.recordChoice('some_event', 'some_choice');

			expect(phaseManager.hasTriggeredEvent('some_event')).toBe(true);
			expect(phaseManager.hasTriggeredEvent('other_event')).toBe(false);
		});
	});

	describe('Boss and Special Phases', () => {
		beforeEach(() => {
			phaseManager.init();
		});

		it('should identify boss phases correctly', () => {
			phaseManager.debugSetPhase(12);
			expect(phaseManager.isBossPhase).toBe(true);

			phaseManager.debugSetPhase(16);
			expect(phaseManager.isBossPhase).toBe(true);

			phaseManager.debugSetPhase(13);
			expect(phaseManager.isBossPhase).toBe(false);
		});

		it('should identify meditation phase correctly', () => {
			phaseManager.debugSetPhase(18);
			expect(phaseManager.isMeditationPhase).toBe(true);

			phaseManager.debugSetPhase(17);
			expect(phaseManager.isMeditationPhase).toBe(false);
		});

		it('should disable clicking in abstract mode phases', () => {
			phaseManager.debugSetPhase(11);
			expect(phaseManager.clickingEnabled).toBe(false);
		});
	});

	describe('Reset', () => {
		beforeEach(() => {
			phaseManager.init();
		});

		it('should reset to phase 1', async () => {
			const richContext = createMockContext({
				getResourceAmount: vi.fn().mockReturnValue(D(100))
			});
			phaseManager.setContext(richContext);
			await phaseManager.advancePhase();

			phaseManager.reset();

			expect(phaseManager.currentPhase).toBe(1);
		});

		it('should preserve best times on reset', async () => {
			const richContext = createMockContext({
				getResourceAmount: vi.fn().mockReturnValue(D(100))
			});
			phaseManager.setContext(richContext);

			// Simulate some time passing
			phaseManager.tick(60);
			await phaseManager.advancePhase();

			const bestTime = phaseManager.getPhaseProgress(1)?.bestTime;

			phaseManager.reset();

			const newProgress = phaseManager.getPhaseProgress(1);
			expect(newProgress?.bestTime).toBe(bestTime);
		});
	});
});
