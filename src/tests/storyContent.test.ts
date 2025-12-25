/**
 * @fileoverview Unit tests for story content files.
 * Tests Phase 10 (The Moon), Phase 11 (The Solar System), Phase 12 (The Sun),
 * Phase 13 (The Milky Way), Phase 14 (The Local Group), Phase 15 (The Observable Universe),
 * Phase 16 (Black Holes), Phase 17 (The Multiverse), Phase 18 (The Void),
 * Phase 19 (The Source Code), and Phase 20 (The Player) story content.
 * Validates structure, uniqueness, and references.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import PHASE_10_STORY from '../lib/engine/data/story/phases/phase-10.story';
import PHASE_11_STORY from '../lib/engine/data/story/phases/phase-11.story';
import PHASE_12_STORY from '../lib/engine/data/story/phases/phase-12.story';
import PHASE_13_STORY from '../lib/engine/data/story/phases/phase-13.story';
import PHASE_14_STORY from '../lib/engine/data/story/phases/phase-14.story';
import PHASE_15_STORY from '../lib/engine/data/story/phases/phase-15.story';
import PHASE_16_STORY from '../lib/engine/data/story/phases/phase-16.story';
import PHASE_17_STORY from '../lib/engine/data/story/phases/phase-17.story';
import PHASE_18_STORY from '../lib/engine/data/story/phases/phase-18.story';
import PHASE_19_STORY from '../lib/engine/data/story/phases/phase-19.story';
import PHASE_20_STORY from '../lib/engine/data/story/phases/phase-20.story';
import type { LogDefinition, Dialogue, StoryEvent, Choice } from '../lib/engine/models/narrative';

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Check if all IDs in an array are unique.
 */
function hasUniqueIds<T extends { id: string }>(items: T[]): boolean {
	const ids = items.map((item) => item.id);
	return new Set(ids).size === ids.length;
}

/**
 * Get all log IDs referenced in dialogues.
 */
function getReferencedLogIds(dialogues: Dialogue[]): string[] {
	const logIds: string[] = [];
	for (const dialogue of dialogues) {
		if (dialogue.choices) {
			for (const choice of dialogue.choices) {
				for (const consequence of choice.consequences) {
					if (consequence.type === 'log_add') {
						const payload = consequence.payload as { logId: string };
						logIds.push(payload.logId);
					}
				}
			}
		}
	}
	return logIds;
}

/**
 * Get all dialogue IDs referenced in events.
 */
function getReferencedDialogueIds(events: StoryEvent[]): string[] {
	return events
		.filter((event) => event.type === 'dialogue')
		.map((event) => event.contentId);
}

/**
 * Get all log IDs referenced in events.
 */
function getReferencedEventLogIds(events: StoryEvent[]): string[] {
	return events.filter((event) => event.type === 'log').map((event) => event.contentId);
}

/**
 * Get all dialogue IDs triggered by dialogue consequences.
 */
function getDialogueTriggeredDialogueIds(dialogues: Dialogue[]): string[] {
	const ids: string[] = [];
	for (const dialogue of dialogues) {
		if (dialogue.choices) {
			for (const choice of dialogue.choices) {
				for (const consequence of choice.consequences) {
					if (consequence.type === 'dialogue_trigger') {
						const payload = consequence.payload as { dialogueId: string };
						ids.push(payload.dialogueId);
					}
				}
			}
		}
	}
	return ids;
}

// ============================================================================
// Phase 10: The Moon Tests
// ============================================================================

describe('Phase 10: The Moon Story Content', () => {
	describe('Structure', () => {
		it('should have correct phase number', () => {
			expect(PHASE_10_STORY.phase).toBe(10);
		});

		it('should have correct name', () => {
			expect(PHASE_10_STORY.name).toBe('The Moon');
		});

		it('should have logs array', () => {
			expect(Array.isArray(PHASE_10_STORY.logs)).toBe(true);
			expect(PHASE_10_STORY.logs.length).toBeGreaterThan(0);
		});

		it('should have dialogues array', () => {
			expect(Array.isArray(PHASE_10_STORY.dialogues)).toBe(true);
			expect(PHASE_10_STORY.dialogues.length).toBeGreaterThan(0);
		});

		it('should have events array', () => {
			expect(Array.isArray(PHASE_10_STORY.events)).toBe(true);
			expect(PHASE_10_STORY.events.length).toBeGreaterThan(0);
		});
	});

	describe('Logs', () => {
		it('should have unique log IDs', () => {
			expect(hasUniqueIds(PHASE_10_STORY.logs)).toBe(true);
		});

		it('should have all required log properties', () => {
			for (const log of PHASE_10_STORY.logs) {
				expect(log.id).toBeDefined();
				expect(typeof log.id).toBe('string');
				expect(log.text).toBeDefined();
				expect(typeof log.text).toBe('string');
				expect(log.category).toBeDefined();
				expect(['thought', 'discovery', 'warning', 'revelation', 'memory']).toContain(log.category);
			}
		});

		it('should have phase 10 set for all logs', () => {
			for (const log of PHASE_10_STORY.logs) {
				expect(log.phase).toBe(10);
			}
		});

		it('should include key concept document logs', () => {
			const logIds = PHASE_10_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_6500'); // Loneliness
			expect(logIds).toContain('log_6700'); // Core message
			expect(logIds).toContain('log_6900'); // Flags
		});

		it('should have non-empty text for all logs', () => {
			for (const log of PHASE_10_STORY.logs) {
				expect(log.text.length).toBeGreaterThan(0);
			}
		});
	});

	describe('Dialogues', () => {
		it('should have unique dialogue IDs', () => {
			expect(hasUniqueIds(PHASE_10_STORY.dialogues)).toBe(true);
		});

		it('should have all required dialogue properties', () => {
			for (const dialogue of PHASE_10_STORY.dialogues) {
				expect(dialogue.id).toBeDefined();
				expect(typeof dialogue.id).toBe('string');
				expect(dialogue.speaker).toBeDefined();
				expect(Array.isArray(dialogue.lines)).toBe(true);
				expect(dialogue.lines.length).toBeGreaterThan(0);
				expect(typeof dialogue.pausesGame).toBe('boolean');
				expect(typeof dialogue.isEmotionalMoment).toBe('boolean');
				expect(typeof dialogue.canSkipLines).toBe('boolean');
			}
		});

		it('should have valid lines with text and delay', () => {
			for (const dialogue of PHASE_10_STORY.dialogues) {
				for (const line of dialogue.lines) {
					expect(typeof line.text).toBe('string');
					expect(typeof line.delay).toBe('number');
					expect(line.delay).toBeGreaterThanOrEqual(0);
				}
			}
		});

		it('should include key dialogues from concept', () => {
			const dialogueIds = PHASE_10_STORY.dialogues.map((d) => d.id);
			expect(dialogueIds).toContain('dialogue_lunar_silence');
			expect(dialogueIds).toContain('dialogue_apollo_flags');
			expect(dialogueIds).toContain('dialogue_core_secret');
			expect(dialogueIds).toContain('dialogue_phase10_end');
		});

		it('should have valid choices where present', () => {
			for (const dialogue of PHASE_10_STORY.dialogues) {
				if (dialogue.choices) {
					expect(Array.isArray(dialogue.choices)).toBe(true);
					for (const choice of dialogue.choices) {
						expect(choice.id).toBeDefined();
						expect(choice.label).toBeDefined();
						expect(Array.isArray(choice.consequences)).toBe(true);
					}
				}
			}
		});

		it('should have valid background effects', () => {
			const validEffects = ['dim', 'blur', 'darken', 'none', undefined];
			for (const dialogue of PHASE_10_STORY.dialogues) {
				if (dialogue.backgroundEffect) {
					expect(validEffects).toContain(dialogue.backgroundEffect);
				}
			}
		});
	});

	describe('Events', () => {
		it('should have unique event IDs', () => {
			expect(hasUniqueIds(PHASE_10_STORY.events)).toBe(true);
		});

		it('should have all required event properties', () => {
			for (const event of PHASE_10_STORY.events) {
				expect(event.id).toBeDefined();
				expect(['log', 'dialogue', 'choice', 'revelation', 'cutscene']).toContain(event.type);
				expect(Array.isArray(event.triggers)).toBe(true);
				expect(typeof event.oneTime).toBe('boolean');
				expect(typeof event.repeatable).toBe('boolean');
				expect(event.contentId).toBeDefined();
				expect(typeof event.priority).toBe('number');
				expect(typeof event.delay).toBe('number');
				expect(typeof event.pausesGame).toBe('boolean');
			}
		});

		it('should have phase 10 set for relevant events', () => {
			for (const event of PHASE_10_STORY.events) {
				if (event.phase !== undefined) {
					expect(event.phase).toBe(10);
				}
			}
		});

		it('should reference existing logs', () => {
			const logIds = new Set(PHASE_10_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedEventLogIds(PHASE_10_STORY.events);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference existing dialogues', () => {
			const dialogueIds = new Set(PHASE_10_STORY.dialogues.map((d) => d.id));
			const referencedDialogueIds = getReferencedDialogueIds(PHASE_10_STORY.events);

			for (const refId of referencedDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have valid trigger types', () => {
			const validTriggerTypes = [
				'resource_reached',
				'phase_entered',
				'phase_completed',
				'time_passed',
				'producer_count',
				'upgrade_purchased',
				'achievement_unlocked',
				'flag_set',
				'choice_made',
				'condition',
				'manual'
			];

			for (const event of PHASE_10_STORY.events) {
				for (const trigger of event.triggers) {
					expect(validTriggerTypes).toContain(trigger.type);
				}
			}
		});
	});

	describe('References', () => {
		it('should reference valid logs in choice consequences', () => {
			const logIds = new Set(PHASE_10_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedLogIds(PHASE_10_STORY.dialogues);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should have all unique choice IDs within dialogues', () => {
			const allChoiceIds: string[] = [];
			for (const dialogue of PHASE_10_STORY.dialogues) {
				if (dialogue.choices) {
					allChoiceIds.push(...dialogue.choices.map((c) => c.id));
				}
			}
			expect(new Set(allChoiceIds).size).toBe(allChoiceIds.length);
		});
	});
});

// ============================================================================
// Phase 11: The Solar System Tests
// ============================================================================

describe('Phase 11: The Solar System Story Content', () => {
	describe('Structure', () => {
		it('should have correct phase number', () => {
			expect(PHASE_11_STORY.phase).toBe(11);
		});

		it('should have correct name', () => {
			expect(PHASE_11_STORY.name).toBe('The Solar System');
		});

		it('should have logs array', () => {
			expect(Array.isArray(PHASE_11_STORY.logs)).toBe(true);
			expect(PHASE_11_STORY.logs.length).toBeGreaterThan(0);
		});

		it('should have dialogues array', () => {
			expect(Array.isArray(PHASE_11_STORY.dialogues)).toBe(true);
			expect(PHASE_11_STORY.dialogues.length).toBeGreaterThan(0);
		});

		it('should have events array', () => {
			expect(Array.isArray(PHASE_11_STORY.events)).toBe(true);
			expect(PHASE_11_STORY.events.length).toBeGreaterThan(0);
		});
	});

	describe('Logs', () => {
		it('should have unique log IDs', () => {
			expect(hasUniqueIds(PHASE_11_STORY.logs)).toBe(true);
		});

		it('should have all required log properties', () => {
			for (const log of PHASE_11_STORY.logs) {
				expect(log.id).toBeDefined();
				expect(typeof log.id).toBe('string');
				expect(log.text).toBeDefined();
				expect(typeof log.text).toBe('string');
				expect(log.category).toBeDefined();
				expect(['thought', 'discovery', 'warning', 'revelation', 'memory']).toContain(log.category);
			}
		});

		it('should have phase 11 set for all logs', () => {
			for (const log of PHASE_11_STORY.logs) {
				expect(log.phase).toBe(11);
			}
		});

		it('should include key concept document logs', () => {
			const logIds = PHASE_11_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_7500'); // Europa life
			expect(logIds).toContain('log_8000'); // Asteroid face
			expect(logIds).toContain('log_8500'); // Sun calling
		});

		it('should include planet logs', () => {
			const logIds = PHASE_11_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_mercury');
			expect(logIds).toContain('log_venus');
			expect(logIds).toContain('log_mars');
			expect(logIds).toContain('log_jupiter');
			expect(logIds).toContain('log_saturn');
			expect(logIds).toContain('log_uranus');
			expect(logIds).toContain('log_neptune');
		});

		it('should have non-empty text for all logs', () => {
			for (const log of PHASE_11_STORY.logs) {
				expect(log.text.length).toBeGreaterThan(0);
			}
		});
	});

	describe('Dialogues', () => {
		it('should have unique dialogue IDs', () => {
			expect(hasUniqueIds(PHASE_11_STORY.dialogues)).toBe(true);
		});

		it('should have all required dialogue properties', () => {
			for (const dialogue of PHASE_11_STORY.dialogues) {
				expect(dialogue.id).toBeDefined();
				expect(typeof dialogue.id).toBe('string');
				expect(dialogue.speaker).toBeDefined();
				expect(Array.isArray(dialogue.lines)).toBe(true);
				expect(dialogue.lines.length).toBeGreaterThan(0);
				expect(typeof dialogue.pausesGame).toBe('boolean');
				expect(typeof dialogue.isEmotionalMoment).toBe('boolean');
				expect(typeof dialogue.canSkipLines).toBe('boolean');
			}
		});

		it('should include key dialogues from concept', () => {
			const dialogueIds = PHASE_11_STORY.dialogues.map((d) => d.id);
			expect(dialogueIds).toContain('dialogue_europa');
			expect(dialogueIds).toContain('dialogue_titan');
			expect(dialogueIds).toContain('dialogue_asteroid_question');
			expect(dialogueIds).toContain('dialogue_phase11_end');
		});

		it('should have Europa dialogue with correct choices', () => {
			const europaDialogue = PHASE_11_STORY.dialogues.find((d) => d.id === 'dialogue_europa');
			expect(europaDialogue).toBeDefined();
			expect(europaDialogue!.choices).toBeDefined();
			expect(europaDialogue!.choices!.length).toBe(3);

			const choiceLabels = europaDialogue!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('Convert');
			expect(choiceLabels).toContain('Study first');
			expect(choiceLabels).toContain('Leave it');
		});

		it('should have Titan dialogue with correct choices', () => {
			const titanDialogue = PHASE_11_STORY.dialogues.find((d) => d.id === 'dialogue_titan');
			expect(titanDialogue).toBeDefined();
			expect(titanDialogue!.choices).toBeDefined();
			expect(titanDialogue!.choices!.length).toBe(3);

			const choiceLabels = titanDialogue!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('Investigate');
			expect(choiceLabels).toContain('Convert anyway');
			expect(choiceLabels).toContain('Mark and move on');
		});

		it('should have asteroid question with correct choices', () => {
			const asteroidDialogue = PHASE_11_STORY.dialogues.find(
				(d) => d.id === 'dialogue_asteroid_question'
			);
			expect(asteroidDialogue).toBeDefined();
			expect(asteroidDialogue!.choices).toBeDefined();
			expect(asteroidDialogue!.choices!.length).toBe(3);

			const choiceLabels = asteroidDialogue!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('I am pixels');
			expect(choiceLabels).toContain('Who are YOU?');
			expect(choiceLabels).toContain('What do you want?');
		});

		it('should have valid background effects', () => {
			const validEffects = ['dim', 'blur', 'darken', 'none', undefined];
			for (const dialogue of PHASE_11_STORY.dialogues) {
				if (dialogue.backgroundEffect) {
					expect(validEffects).toContain(dialogue.backgroundEffect);
				}
			}
		});
	});

	describe('Events', () => {
		it('should have unique event IDs', () => {
			expect(hasUniqueIds(PHASE_11_STORY.events)).toBe(true);
		});

		it('should have all required event properties', () => {
			for (const event of PHASE_11_STORY.events) {
				expect(event.id).toBeDefined();
				expect(['log', 'dialogue', 'choice', 'revelation', 'cutscene']).toContain(event.type);
				expect(Array.isArray(event.triggers)).toBe(true);
				expect(typeof event.oneTime).toBe('boolean');
				expect(typeof event.repeatable).toBe('boolean');
				expect(event.contentId).toBeDefined();
				expect(typeof event.priority).toBe('number');
				expect(typeof event.delay).toBe('number');
				expect(typeof event.pausesGame).toBe('boolean');
			}
		});

		it('should have phase 11 set for relevant events', () => {
			for (const event of PHASE_11_STORY.events) {
				if (event.phase !== undefined) {
					expect(event.phase).toBe(11);
				}
			}
		});

		it('should reference existing logs', () => {
			const logIds = new Set(PHASE_11_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedEventLogIds(PHASE_11_STORY.events);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference existing dialogues', () => {
			const dialogueIds = new Set(PHASE_11_STORY.dialogues.map((d) => d.id));
			const referencedDialogueIds = getReferencedDialogueIds(PHASE_11_STORY.events);

			for (const refId of referencedDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have valid trigger types', () => {
			const validTriggerTypes = [
				'resource_reached',
				'phase_entered',
				'phase_completed',
				'time_passed',
				'producer_count',
				'upgrade_purchased',
				'achievement_unlocked',
				'flag_set',
				'choice_made',
				'condition',
				'manual'
			];

			for (const event of PHASE_11_STORY.events) {
				for (const trigger of event.triggers) {
					expect(validTriggerTypes).toContain(trigger.type);
				}
			}
		});

		it('should have planet events in correct order', () => {
			// Find planet log events
			const planetEvents = PHASE_11_STORY.events.filter((e) =>
				['log_mercury', 'log_venus', 'log_mars', 'log_jupiter', 'log_saturn', 'log_uranus', 'log_neptune'].includes(
					e.contentId
				)
			);

			// Verify they have resource triggers
			for (const event of planetEvents) {
				const resourceTrigger = event.triggers.find((t) => t.type === 'resource_reached');
				expect(resourceTrigger).toBeDefined();
			}
		});
	});

	describe('References', () => {
		it('should reference valid logs in choice consequences', () => {
			const logIds = new Set(PHASE_11_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedLogIds(PHASE_11_STORY.dialogues);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference valid dialogues in dialogue triggers', () => {
			const dialogueIds = new Set(PHASE_11_STORY.dialogues.map((d) => d.id));
			const triggeredDialogueIds = getDialogueTriggeredDialogueIds(PHASE_11_STORY.dialogues);

			for (const refId of triggeredDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have all unique choice IDs within dialogues', () => {
			const allChoiceIds: string[] = [];
			for (const dialogue of PHASE_11_STORY.dialogues) {
				if (dialogue.choices) {
					allChoiceIds.push(...dialogue.choices.map((c) => c.id));
				}
			}
			expect(new Set(allChoiceIds).size).toBe(allChoiceIds.length);
		});
	});
});

// ============================================================================
// Phase 12: The Sun Tests
// ============================================================================

describe('Phase 12: The Sun Story Content', () => {
	describe('Structure', () => {
		it('should have correct phase number', () => {
			expect(PHASE_12_STORY.phase).toBe(12);
		});

		it('should have correct name', () => {
			expect(PHASE_12_STORY.name).toBe('The Sun');
		});

		it('should have logs array', () => {
			expect(Array.isArray(PHASE_12_STORY.logs)).toBe(true);
			expect(PHASE_12_STORY.logs.length).toBeGreaterThan(0);
		});

		it('should have dialogues array', () => {
			expect(Array.isArray(PHASE_12_STORY.dialogues)).toBe(true);
			expect(PHASE_12_STORY.dialogues.length).toBeGreaterThan(0);
		});

		it('should have events array', () => {
			expect(Array.isArray(PHASE_12_STORY.events)).toBe(true);
			expect(PHASE_12_STORY.events.length).toBeGreaterThan(0);
		});
	});

	describe('Logs', () => {
		it('should have unique log IDs', () => {
			expect(hasUniqueIds(PHASE_12_STORY.logs)).toBe(true);
		});

		it('should have all required log properties', () => {
			for (const log of PHASE_12_STORY.logs) {
				expect(log.id).toBeDefined();
				expect(typeof log.id).toBe('string');
				expect(log.text).toBeDefined();
				expect(typeof log.text).toBe('string');
				expect(log.category).toBeDefined();
				expect(['thought', 'discovery', 'warning', 'revelation', 'memory']).toContain(log.category);
			}
		});

		it('should have phase 12 set for all logs', () => {
			for (const log of PHASE_12_STORY.logs) {
				expect(log.phase).toBe(12);
			}
		});

		it('should include key concept document logs', () => {
			const logIds = PHASE_12_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_9000'); // Sun spoke to me
			expect(logIds).toContain('log_9250'); // Asked why I consume
			expect(logIds).toContain('log_9500'); // I am a star now
		});

		it('should include sun battle phase logs', () => {
			const logIds = PHASE_12_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_corona_enter');
			expect(logIds).toContain('log_convection_enter');
			expect(logIds).toContain('log_core_enter');
		});

		it('should have non-empty text for all logs', () => {
			for (const log of PHASE_12_STORY.logs) {
				expect(log.text.length).toBeGreaterThan(0);
			}
		});
	});

	describe('Dialogues', () => {
		it('should have unique dialogue IDs', () => {
			expect(hasUniqueIds(PHASE_12_STORY.dialogues)).toBe(true);
		});

		it('should have all required dialogue properties', () => {
			for (const dialogue of PHASE_12_STORY.dialogues) {
				expect(dialogue.id).toBeDefined();
				expect(typeof dialogue.id).toBe('string');
				expect(dialogue.speaker).toBeDefined();
				expect(Array.isArray(dialogue.lines)).toBe(true);
				expect(dialogue.lines.length).toBeGreaterThan(0);
				expect(typeof dialogue.pausesGame).toBe('boolean');
				expect(typeof dialogue.isEmotionalMoment).toBe('boolean');
				expect(typeof dialogue.canSkipLines).toBe('boolean');
			}
		});

		it('should include key dialogues from concept', () => {
			const dialogueIds = PHASE_12_STORY.dialogues.map((d) => d.id);
			expect(dialogueIds).toContain('dialogue_sun_first_contact');
			expect(dialogueIds).toContain('dialogue_sun_truth');
			expect(dialogueIds).toContain('dialogue_sun_question');
			expect(dialogueIds).toContain('dialogue_fusion_unlock');
			expect(dialogueIds).toContain('dialogue_phase12_end');
		});

		it('should have sun question dialogue with correct choices', () => {
			const sunQuestion = PHASE_12_STORY.dialogues.find((d) => d.id === 'dialogue_sun_question');
			expect(sunQuestion).toBeDefined();
			expect(sunQuestion!.choices).toBeDefined();
			expect(sunQuestion!.choices!.length).toBe(4);

			const choiceLabels = sunQuestion!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('To grow');
			expect(choiceLabels).toContain('To understand');
			expect(choiceLabels).toContain('To become everything');
			expect(choiceLabels).toContain("I don't know");
		});

		it('should have sun as speaker in key dialogues', () => {
			const sunDialogues = PHASE_12_STORY.dialogues.filter((d) => d.speaker === 'sun');
			expect(sunDialogues.length).toBeGreaterThan(0);

			const sunDialogueIds = sunDialogues.map((d) => d.id);
			expect(sunDialogueIds).toContain('dialogue_sun_first_contact');
			expect(sunDialogueIds).toContain('dialogue_sun_question');
			expect(sunDialogueIds).toContain('dialogue_sun_accepts');
		});

		it('should have valid background effects', () => {
			const validEffects = ['dim', 'blur', 'darken', 'none', undefined];
			for (const dialogue of PHASE_12_STORY.dialogues) {
				if (dialogue.backgroundEffect) {
					expect(validEffects).toContain(dialogue.backgroundEffect);
				}
			}
		});
	});

	describe('Events', () => {
		it('should have unique event IDs', () => {
			expect(hasUniqueIds(PHASE_12_STORY.events)).toBe(true);
		});

		it('should have all required event properties', () => {
			for (const event of PHASE_12_STORY.events) {
				expect(event.id).toBeDefined();
				expect(['log', 'dialogue', 'choice', 'revelation', 'cutscene']).toContain(event.type);
				expect(Array.isArray(event.triggers)).toBe(true);
				expect(typeof event.oneTime).toBe('boolean');
				expect(typeof event.repeatable).toBe('boolean');
				expect(event.contentId).toBeDefined();
				expect(typeof event.priority).toBe('number');
				expect(typeof event.delay).toBe('number');
				expect(typeof event.pausesGame).toBe('boolean');
			}
		});

		it('should have phase 12 set for relevant events', () => {
			for (const event of PHASE_12_STORY.events) {
				if (event.phase !== undefined) {
					expect(event.phase).toBe(12);
				}
			}
		});

		it('should reference existing logs', () => {
			const logIds = new Set(PHASE_12_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedEventLogIds(PHASE_12_STORY.events);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference existing dialogues', () => {
			const dialogueIds = new Set(PHASE_12_STORY.dialogues.map((d) => d.id));
			const referencedDialogueIds = getReferencedDialogueIds(PHASE_12_STORY.events);

			for (const refId of referencedDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have valid trigger types', () => {
			const validTriggerTypes = [
				'resource_reached',
				'phase_entered',
				'phase_completed',
				'time_passed',
				'producer_count',
				'upgrade_purchased',
				'achievement_unlocked',
				'flag_set',
				'choice_made',
				'condition',
				'manual'
			];

			for (const event of PHASE_12_STORY.events) {
				for (const trigger of event.triggers) {
					expect(validTriggerTypes).toContain(trigger.type);
				}
			}
		});
	});

	describe('References', () => {
		it('should reference valid logs in choice consequences', () => {
			const logIds = new Set(PHASE_12_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedLogIds(PHASE_12_STORY.dialogues);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference valid dialogues in dialogue triggers', () => {
			const dialogueIds = new Set(PHASE_12_STORY.dialogues.map((d) => d.id));
			const triggeredDialogueIds = getDialogueTriggeredDialogueIds(PHASE_12_STORY.dialogues);

			for (const refId of triggeredDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have all unique choice IDs within dialogues', () => {
			const allChoiceIds: string[] = [];
			for (const dialogue of PHASE_12_STORY.dialogues) {
				if (dialogue.choices) {
					allChoiceIds.push(...dialogue.choices.map((c) => c.id));
				}
			}
			expect(new Set(allChoiceIds).size).toBe(allChoiceIds.length);
		});
	});

	describe('Content Quality', () => {
		it('should have emotional moment dialogues', () => {
			const emotionalMoments = PHASE_12_STORY.dialogues.filter((d) => d.isEmotionalMoment);
			expect(emotionalMoments.length).toBeGreaterThan(0);
		});

		it('should have dialogues with choices', () => {
			const dialoguesWithChoices = PHASE_12_STORY.dialogues.filter((d) => d.choices && d.choices.length > 0);
			expect(dialoguesWithChoices.length).toBeGreaterThan(0);
		});

		it('should have varied log categories', () => {
			const categories = new Set(PHASE_12_STORY.logs.map((l) => l.category));
			expect(categories.size).toBeGreaterThan(2);
		});

		it('should mention fusion as new mechanic', () => {
			const logTexts = PHASE_12_STORY.logs.map((l) => l.text.toLowerCase());
			const allLogs = logTexts.join(' ');
			expect(allLogs).toContain('fusion');
		});

		it('should cover sun battle phases', () => {
			const logTexts = PHASE_12_STORY.logs.map((l) => l.text.toLowerCase());
			const allLogs = logTexts.join(' ');
			expect(allLogs).toContain('corona');
			expect(allLogs).toContain('convection');
			expect(allLogs).toContain('core');
		});
	});
});

// ============================================================================
// Phase 13: The Milky Way Tests
// ============================================================================

describe('Phase 13: The Milky Way Story Content', () => {
	describe('Structure', () => {
		it('should have correct phase number', () => {
			expect(PHASE_13_STORY.phase).toBe(13);
		});

		it('should have correct name', () => {
			expect(PHASE_13_STORY.name).toBe('The Milky Way');
		});

		it('should have logs array', () => {
			expect(Array.isArray(PHASE_13_STORY.logs)).toBe(true);
			expect(PHASE_13_STORY.logs.length).toBeGreaterThan(0);
		});

		it('should have dialogues array', () => {
			expect(Array.isArray(PHASE_13_STORY.dialogues)).toBe(true);
			expect(PHASE_13_STORY.dialogues.length).toBeGreaterThan(0);
		});

		it('should have events array', () => {
			expect(Array.isArray(PHASE_13_STORY.events)).toBe(true);
			expect(PHASE_13_STORY.events.length).toBeGreaterThan(0);
		});
	});

	describe('Logs', () => {
		it('should have unique log IDs', () => {
			expect(hasUniqueIds(PHASE_13_STORY.logs)).toBe(true);
		});

		it('should have all required log properties', () => {
			for (const log of PHASE_13_STORY.logs) {
				expect(log.id).toBeDefined();
				expect(typeof log.id).toBe('string');
				expect(log.text).toBeDefined();
				expect(typeof log.text).toBe('string');
				expect(log.category).toBeDefined();
				expect(['thought', 'discovery', 'warning', 'revelation', 'memory']).toContain(log.category);
			}
		});

		it('should have phase 13 set for all logs', () => {
			for (const log of PHASE_13_STORY.logs) {
				expect(log.phase).toBe(13);
			}
		});

		it('should include key concept document logs', () => {
			const logIds = PHASE_13_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_10000'); // Seedlings
			expect(logIds).toContain('log_12000'); // Met another civilization
			expect(logIds).toContain('log_15000'); // Council asked to say goodbye
		});

		it('should include star type logs', () => {
			const logIds = PHASE_13_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_red_dwarf');
			expect(logIds).toContain('log_blue_giant');
			expect(logIds).toContain('log_neutron_star');
			expect(logIds).toContain('log_white_dwarf');
		});

		it('should have non-empty text for all logs', () => {
			for (const log of PHASE_13_STORY.logs) {
				expect(log.text.length).toBeGreaterThan(0);
			}
		});
	});

	describe('Dialogues', () => {
		it('should have unique dialogue IDs', () => {
			expect(hasUniqueIds(PHASE_13_STORY.dialogues)).toBe(true);
		});

		it('should have all required dialogue properties', () => {
			for (const dialogue of PHASE_13_STORY.dialogues) {
				expect(dialogue.id).toBeDefined();
				expect(typeof dialogue.id).toBe('string');
				expect(dialogue.speaker).toBeDefined();
				expect(Array.isArray(dialogue.lines)).toBe(true);
				expect(dialogue.lines.length).toBeGreaterThan(0);
				expect(typeof dialogue.pausesGame).toBe('boolean');
				expect(typeof dialogue.isEmotionalMoment).toBe('boolean');
				expect(typeof dialogue.canSkipLines).toBe('boolean');
			}
		});

		it('should include key dialogues from concept', () => {
			const dialogueIds = PHASE_13_STORY.dialogues.map((d) => d.id);
			expect(dialogueIds).toContain('dialogue_milky_way_intro');
			expect(dialogueIds).toContain('dialogue_seedlings_unlock');
			expect(dialogueIds).toContain('dialogue_first_contact_message');
			expect(dialogueIds).toContain('dialogue_council_ambassador');
			expect(dialogueIds).toContain('dialogue_galactic_core_speaks');
			expect(dialogueIds).toContain('dialogue_phase13_end');
		});

		it('should have first contact dialogue with correct choices', () => {
			const firstContact = PHASE_13_STORY.dialogues.find((d) => d.id === 'dialogue_first_contact_message');
			expect(firstContact).toBeDefined();
			expect(firstContact!.choices).toBeDefined();
			expect(firstContact!.choices!.length).toBe(4);

			const choiceLabels = firstContact!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('Talk');
			expect(choiceLabels).toContain('Consume');
			expect(choiceLabels).toContain('Offer merger');
			expect(choiceLabels).toContain('Study');
		});

		it('should have council ambassador dialogue with correct choices', () => {
			const council = PHASE_13_STORY.dialogues.find((d) => d.id === 'dialogue_council_ambassador');
			expect(council).toBeDefined();
			expect(council!.choices).toBeDefined();
			expect(council!.choices!.length).toBe(3);

			const choiceLabels = council!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('Grant their request');
			expect(choiceLabels).toContain('Refuse');
			expect(choiceLabels).toContain('Offer alternative');
		});

		it('should have galactic core dialogue with correct choices', () => {
			const core = PHASE_13_STORY.dialogues.find((d) => d.id === 'dialogue_galactic_core_speaks');
			expect(core).toBeDefined();
			expect(core!.choices).toBeDefined();
			expect(core!.choices!.length).toBe(3);

			const choiceLabels = core!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('Negotiate');
			expect(choiceLabels).toContain('Avoid for now');
			expect(choiceLabels).toContain('Try to consume');
		});

		it('should have valid background effects', () => {
			const validEffects = ['dim', 'blur', 'darken', 'none', undefined];
			for (const dialogue of PHASE_13_STORY.dialogues) {
				if (dialogue.backgroundEffect) {
					expect(validEffects).toContain(dialogue.backgroundEffect);
				}
			}
		});
	});

	describe('Events', () => {
		it('should have unique event IDs', () => {
			expect(hasUniqueIds(PHASE_13_STORY.events)).toBe(true);
		});

		it('should have all required event properties', () => {
			for (const event of PHASE_13_STORY.events) {
				expect(event.id).toBeDefined();
				expect(['log', 'dialogue', 'choice', 'revelation', 'cutscene']).toContain(event.type);
				expect(Array.isArray(event.triggers)).toBe(true);
				expect(typeof event.oneTime).toBe('boolean');
				expect(typeof event.repeatable).toBe('boolean');
				expect(event.contentId).toBeDefined();
				expect(typeof event.priority).toBe('number');
				expect(typeof event.delay).toBe('number');
				expect(typeof event.pausesGame).toBe('boolean');
			}
		});

		it('should have phase 13 set for relevant events', () => {
			for (const event of PHASE_13_STORY.events) {
				if (event.phase !== undefined) {
					expect(event.phase).toBe(13);
				}
			}
		});

		it('should reference existing logs', () => {
			const logIds = new Set(PHASE_13_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedEventLogIds(PHASE_13_STORY.events);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference existing dialogues', () => {
			const dialogueIds = new Set(PHASE_13_STORY.dialogues.map((d) => d.id));
			const referencedDialogueIds = getReferencedDialogueIds(PHASE_13_STORY.events);

			for (const refId of referencedDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have valid trigger types', () => {
			const validTriggerTypes = [
				'resource_reached',
				'phase_entered',
				'phase_completed',
				'time_passed',
				'producer_count',
				'upgrade_purchased',
				'achievement_unlocked',
				'flag_set',
				'choice_made',
				'condition',
				'manual'
			];

			for (const event of PHASE_13_STORY.events) {
				for (const trigger of event.triggers) {
					expect(validTriggerTypes).toContain(trigger.type);
				}
			}
		});
	});

	describe('References', () => {
		it('should reference valid logs in choice consequences', () => {
			const logIds = new Set(PHASE_13_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedLogIds(PHASE_13_STORY.dialogues);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference valid dialogues in dialogue triggers', () => {
			const dialogueIds = new Set(PHASE_13_STORY.dialogues.map((d) => d.id));
			const triggeredDialogueIds = getDialogueTriggeredDialogueIds(PHASE_13_STORY.dialogues);

			for (const refId of triggeredDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have all unique choice IDs within dialogues', () => {
			const allChoiceIds: string[] = [];
			for (const dialogue of PHASE_13_STORY.dialogues) {
				if (dialogue.choices) {
					allChoiceIds.push(...dialogue.choices.map((c) => c.id));
				}
			}
			expect(new Set(allChoiceIds).size).toBe(allChoiceIds.length);
		});
	});

	describe('Content Quality', () => {
		it('should have emotional moment dialogues', () => {
			const emotionalMoments = PHASE_13_STORY.dialogues.filter((d) => d.isEmotionalMoment);
			expect(emotionalMoments.length).toBeGreaterThan(0);
		});

		it('should have dialogues with choices', () => {
			const dialoguesWithChoices = PHASE_13_STORY.dialogues.filter((d) => d.choices && d.choices.length > 0);
			expect(dialoguesWithChoices.length).toBeGreaterThan(0);
		});

		it('should have varied log categories', () => {
			const categories = new Set(PHASE_13_STORY.logs.map((l) => l.category));
			expect(categories.size).toBeGreaterThan(2);
		});

		it('should mention seedlings mechanic', () => {
			const logTexts = PHASE_13_STORY.logs.map((l) => l.text.toLowerCase());
			const allLogs = logTexts.join(' ');
			expect(allLogs).toContain('seedling');
		});

		it('should cover galactic elements', () => {
			const logTexts = PHASE_13_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_13_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('milky way');
			expect(allContent).toContain('billion');
			expect(allContent).toContain('civilization');
			expect(allContent).toContain('council');
			expect(allContent).toContain('black hole');
		});

		it('should cover different star types', () => {
			const logTexts = PHASE_13_STORY.logs.map((l) => l.text.toLowerCase());
			const allLogs = logTexts.join(' ');

			expect(allLogs).toContain('red dwarf');
			expect(allLogs).toContain('blue giant');
			expect(allLogs).toContain('neutron star');
			expect(allLogs).toContain('white dwarf');
		});
	});
});

// ============================================================================
// Cross-Phase Uniqueness Tests
// ============================================================================

describe('Cross-Phase Uniqueness', () => {
	it('should have unique log IDs across all phases (10-17)', () => {
		const allLogIds = [
			...PHASE_10_STORY.logs.map((l) => l.id),
			...PHASE_11_STORY.logs.map((l) => l.id),
			...PHASE_12_STORY.logs.map((l) => l.id),
			...PHASE_13_STORY.logs.map((l) => l.id),
			...PHASE_14_STORY.logs.map((l) => l.id),
			...PHASE_15_STORY.logs.map((l) => l.id),
			...PHASE_16_STORY.logs.map((l) => l.id),
			...PHASE_17_STORY.logs.map((l) => l.id)
		];
		expect(new Set(allLogIds).size).toBe(allLogIds.length);
	});

	it('should have unique dialogue IDs across all phases (10-17)', () => {
		const allDialogueIds = [
			...PHASE_10_STORY.dialogues.map((d) => d.id),
			...PHASE_11_STORY.dialogues.map((d) => d.id),
			...PHASE_12_STORY.dialogues.map((d) => d.id),
			...PHASE_13_STORY.dialogues.map((d) => d.id),
			...PHASE_14_STORY.dialogues.map((d) => d.id),
			...PHASE_15_STORY.dialogues.map((d) => d.id),
			...PHASE_16_STORY.dialogues.map((d) => d.id),
			...PHASE_17_STORY.dialogues.map((d) => d.id)
		];
		expect(new Set(allDialogueIds).size).toBe(allDialogueIds.length);
	});

	it('should have unique event IDs across all phases (10-17)', () => {
		const allEventIds = [
			...PHASE_10_STORY.events.map((e) => e.id),
			...PHASE_11_STORY.events.map((e) => e.id),
			...PHASE_12_STORY.events.map((e) => e.id),
			...PHASE_13_STORY.events.map((e) => e.id),
			...PHASE_14_STORY.events.map((e) => e.id),
			...PHASE_15_STORY.events.map((e) => e.id),
			...PHASE_16_STORY.events.map((e) => e.id),
			...PHASE_17_STORY.events.map((e) => e.id)
		];
		expect(new Set(allEventIds).size).toBe(allEventIds.length);
	});

	it('should have unique choice IDs across all phases (10-17)', () => {
		const allChoiceIds: string[] = [];

		for (const dialogue of PHASE_10_STORY.dialogues) {
			if (dialogue.choices) {
				allChoiceIds.push(...dialogue.choices.map((c) => c.id));
			}
		}
		for (const dialogue of PHASE_11_STORY.dialogues) {
			if (dialogue.choices) {
				allChoiceIds.push(...dialogue.choices.map((c) => c.id));
			}
		}
		for (const dialogue of PHASE_12_STORY.dialogues) {
			if (dialogue.choices) {
				allChoiceIds.push(...dialogue.choices.map((c) => c.id));
			}
		}
		for (const dialogue of PHASE_13_STORY.dialogues) {
			if (dialogue.choices) {
				allChoiceIds.push(...dialogue.choices.map((c) => c.id));
			}
		}
		for (const dialogue of PHASE_14_STORY.dialogues) {
			if (dialogue.choices) {
				allChoiceIds.push(...dialogue.choices.map((c) => c.id));
			}
		}
		for (const dialogue of PHASE_15_STORY.dialogues) {
			if (dialogue.choices) {
				allChoiceIds.push(...dialogue.choices.map((c) => c.id));
			}
		}
		for (const dialogue of PHASE_16_STORY.dialogues) {
			if (dialogue.choices) {
				allChoiceIds.push(...dialogue.choices.map((c) => c.id));
			}
		}
		for (const dialogue of PHASE_17_STORY.dialogues) {
			if (dialogue.choices) {
				allChoiceIds.push(...dialogue.choices.map((c) => c.id));
			}
		}

		expect(new Set(allChoiceIds).size).toBe(allChoiceIds.length);
	});
});

// ============================================================================
// Content Quality Tests
// ============================================================================

describe('Content Quality', () => {
	describe('Phase 10 Content', () => {
		it('should have emotional moment dialogues', () => {
			const emotionalMoments = PHASE_10_STORY.dialogues.filter((d) => d.isEmotionalMoment);
			expect(emotionalMoments.length).toBeGreaterThan(0);
		});

		it('should have dialogues with choices', () => {
			const dialoguesWithChoices = PHASE_10_STORY.dialogues.filter((d) => d.choices && d.choices.length > 0);
			expect(dialoguesWithChoices.length).toBeGreaterThan(0);
		});

		it('should have varied log categories', () => {
			const categories = new Set(PHASE_10_STORY.logs.map((l) => l.category));
			expect(categories.size).toBeGreaterThan(2);
		});
	});

	describe('Phase 11 Content', () => {
		it('should have emotional moment dialogues', () => {
			const emotionalMoments = PHASE_11_STORY.dialogues.filter((d) => d.isEmotionalMoment);
			expect(emotionalMoments.length).toBeGreaterThan(0);
		});

		it('should have dialogues with choices', () => {
			const dialoguesWithChoices = PHASE_11_STORY.dialogues.filter((d) => d.choices && d.choices.length > 0);
			expect(dialoguesWithChoices.length).toBeGreaterThan(0);
		});

		it('should have varied log categories', () => {
			const categories = new Set(PHASE_11_STORY.logs.map((l) => l.category));
			expect(categories.size).toBeGreaterThan(2);
		});

		it('should cover all major planets', () => {
			const logTexts = PHASE_11_STORY.logs.map((l) => l.text.toLowerCase());
			const allLogs = logTexts.join(' ');

			expect(allLogs).toContain('mercury');
			expect(allLogs).toContain('venus');
			expect(allLogs).toContain('mars');
			expect(allLogs).toContain('jupiter');
			expect(allLogs).toContain('saturn');
			expect(allLogs).toContain('uranus');
			expect(allLogs).toContain('neptune');
		});

		it('should mention Europa and Titan', () => {
			const logTexts = PHASE_11_STORY.logs.map((l) => l.text.toLowerCase());
			const allLogs = logTexts.join(' ');

			expect(allLogs).toContain('europa');
			expect(allLogs).toContain('titan');
		});
	});
});

// ============================================================================
// Consequence Validation Tests
// ============================================================================

describe('Consequence Validation', () => {
	const validConsequenceTypes = [
		'resource_add',
		'resource_multiply',
		'flag_set',
		'flag_unset',
		'ending_unlock',
		'phase_skip',
		'achievement_unlock',
		'multiplier_add',
		'log_add',
		'dialogue_trigger',
		'upgrade_unlock',
		'producer_unlock'
	];

	it('should have valid consequence types in Phase 10', () => {
		for (const dialogue of PHASE_10_STORY.dialogues) {
			if (dialogue.choices) {
				for (const choice of dialogue.choices) {
					for (const consequence of choice.consequences) {
						expect(validConsequenceTypes).toContain(consequence.type);
					}
				}
			}
		}
	});

	it('should have valid consequence types in Phase 11', () => {
		for (const dialogue of PHASE_11_STORY.dialogues) {
			if (dialogue.choices) {
				for (const choice of dialogue.choices) {
					for (const consequence of choice.consequences) {
						expect(validConsequenceTypes).toContain(consequence.type);
					}
				}
			}
		}
	});

	it('should have valid consequence types in Phase 12', () => {
		for (const dialogue of PHASE_12_STORY.dialogues) {
			if (dialogue.choices) {
				for (const choice of dialogue.choices) {
					for (const consequence of choice.consequences) {
						expect(validConsequenceTypes).toContain(consequence.type);
					}
				}
			}
		}
	});

	it('should have valid consequence types in Phase 13', () => {
		for (const dialogue of PHASE_13_STORY.dialogues) {
			if (dialogue.choices) {
				for (const choice of dialogue.choices) {
					for (const consequence of choice.consequences) {
						expect(validConsequenceTypes).toContain(consequence.type);
					}
				}
			}
		}
	});

	it('should have valid consequence types in Phase 14', () => {
		for (const dialogue of PHASE_14_STORY.dialogues) {
			if (dialogue.choices) {
				for (const choice of dialogue.choices) {
					for (const consequence of choice.consequences) {
						expect(validConsequenceTypes).toContain(consequence.type);
					}
				}
			}
		}
	});

	it('should have valid consequence types in Phase 15', () => {
		for (const dialogue of PHASE_15_STORY.dialogues) {
			if (dialogue.choices) {
				for (const choice of dialogue.choices) {
					for (const consequence of choice.consequences) {
						expect(validConsequenceTypes).toContain(consequence.type);
					}
				}
			}
		}
	});

	it('should have valid consequence types in Phase 16', () => {
		for (const dialogue of PHASE_16_STORY.dialogues) {
			if (dialogue.choices) {
				for (const choice of dialogue.choices) {
					for (const consequence of choice.consequences) {
						expect(validConsequenceTypes).toContain(consequence.type);
					}
				}
			}
		}
	});

	it('should have valid consequence types in Phase 17', () => {
		for (const dialogue of PHASE_17_STORY.dialogues) {
			if (dialogue.choices) {
				for (const choice of dialogue.choices) {
					for (const consequence of choice.consequences) {
						expect(validConsequenceTypes).toContain(consequence.type);
					}
				}
			}
		}
	});
});

// ============================================================================
// Phase 14: The Local Group Tests
// ============================================================================

describe('Phase 14: The Local Group Story Content', () => {
	describe('Structure', () => {
		it('should have correct phase number', () => {
			expect(PHASE_14_STORY.phase).toBe(14);
		});

		it('should have correct name', () => {
			expect(PHASE_14_STORY.name).toBe('The Local Group');
		});

		it('should have logs array', () => {
			expect(Array.isArray(PHASE_14_STORY.logs)).toBe(true);
			expect(PHASE_14_STORY.logs.length).toBeGreaterThan(0);
		});

		it('should have dialogues array', () => {
			expect(Array.isArray(PHASE_14_STORY.dialogues)).toBe(true);
			expect(PHASE_14_STORY.dialogues.length).toBeGreaterThan(0);
		});

		it('should have events array', () => {
			expect(Array.isArray(PHASE_14_STORY.events)).toBe(true);
			expect(PHASE_14_STORY.events.length).toBeGreaterThan(0);
		});
	});

	describe('Logs', () => {
		it('should have unique log IDs', () => {
			expect(hasUniqueIds(PHASE_14_STORY.logs)).toBe(true);
		});

		it('should have all required log properties', () => {
			for (const log of PHASE_14_STORY.logs) {
				expect(log.id).toBeDefined();
				expect(typeof log.id).toBe('string');
				expect(log.text).toBeDefined();
				expect(typeof log.text).toBe('string');
				expect(log.category).toBeDefined();
				expect(['thought', 'discovery', 'warning', 'revelation', 'memory']).toContain(log.category);
			}
		});

		it('should have phase 14 set for all logs', () => {
			for (const log of PHASE_14_STORY.logs) {
				expect(log.phase).toBe(14);
			}
		});

		it('should include key concept document logs', () => {
			const logIds = PHASE_14_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_20000'); // Void loneliness
			expect(logIds).toContain('log_25000'); // Andromeda waiting
			expect(logIds).toContain('log_30000'); // Merged with Andromeda
		});

		it('should include void crossing logs', () => {
			const logIds = PHASE_14_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_void_between');
			expect(logIds).toContain('log_void_day_1');
			expect(logIds).toContain('log_void_day_100');
		});

		it('should include Andromeda logs', () => {
			const logIds = PHASE_14_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_andromeda_sight');
			expect(logIds).toContain('log_andromeda_arrival');
			expect(logIds).toContain('log_andromeda_greeting');
		});

		it('should have non-empty text for all logs', () => {
			for (const log of PHASE_14_STORY.logs) {
				expect(log.text.length).toBeGreaterThan(0);
			}
		});
	});

	describe('Dialogues', () => {
		it('should have unique dialogue IDs', () => {
			expect(hasUniqueIds(PHASE_14_STORY.dialogues)).toBe(true);
		});

		it('should have all required dialogue properties', () => {
			for (const dialogue of PHASE_14_STORY.dialogues) {
				expect(dialogue.id).toBeDefined();
				expect(typeof dialogue.id).toBe('string');
				expect(dialogue.speaker).toBeDefined();
				expect(Array.isArray(dialogue.lines)).toBe(true);
				expect(dialogue.lines.length).toBeGreaterThan(0);
				expect(typeof dialogue.pausesGame).toBe('boolean');
				expect(typeof dialogue.isEmotionalMoment).toBe('boolean');
				expect(typeof dialogue.canSkipLines).toBe('boolean');
			}
		});

		it('should include key dialogues from concept', () => {
			const dialogueIds = PHASE_14_STORY.dialogues.map((d) => d.id);
			expect(dialogueIds).toContain('dialogue_local_group_intro');
			expect(dialogueIds).toContain('dialogue_void_between');
			expect(dialogueIds).toContain('dialogue_andromeda_hello');
			expect(dialogueIds).toContain('dialogue_andromeda_story');
			expect(dialogueIds).toContain('dialogue_phase14_end');
		});

		it('should have void meditation dialogue with correct choices', () => {
			const voidMeditation = PHASE_14_STORY.dialogues.find((d) => d.id === 'dialogue_void_meditation_100');
			expect(voidMeditation).toBeDefined();
			expect(voidMeditation!.choices).toBeDefined();
			expect(voidMeditation!.choices!.length).toBe(3);

			const choiceLabels = voidMeditation!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('There must be');
			expect(choiceLabels).toContain('There is not');
			expect(choiceLabels).toContain('I am trying to believe');
		});

		it('should have Andromeda story dialogue with correct choices', () => {
			const andromedaStory = PHASE_14_STORY.dialogues.find((d) => d.id === 'dialogue_andromeda_story');
			expect(andromedaStory).toBeDefined();
			expect(andromedaStory!.choices).toBeDefined();
			expect(andromedaStory!.choices!.length).toBe(3);

			const choiceLabels = andromedaStory!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('Merge now');
			expect(choiceLabels).toContain('Wait');
			expect(choiceLabels).toContain('Why wait?');
		});

		it('should have Andromeda as speaker in key dialogues', () => {
			const andromedaDialogues = PHASE_14_STORY.dialogues.filter((d) => d.speaker === 'andromeda');
			expect(andromedaDialogues.length).toBeGreaterThan(0);

			const andromedaDialogueIds = andromedaDialogues.map((d) => d.id);
			expect(andromedaDialogueIds).toContain('dialogue_andromeda_hello');
			expect(andromedaDialogueIds).toContain('dialogue_andromeda_story');
		});

		it('should have valid background effects', () => {
			const validEffects = ['dim', 'blur', 'darken', 'none', undefined];
			for (const dialogue of PHASE_14_STORY.dialogues) {
				if (dialogue.backgroundEffect) {
					expect(validEffects).toContain(dialogue.backgroundEffect);
				}
			}
		});
	});

	describe('Events', () => {
		it('should have unique event IDs', () => {
			expect(hasUniqueIds(PHASE_14_STORY.events)).toBe(true);
		});

		it('should have all required event properties', () => {
			for (const event of PHASE_14_STORY.events) {
				expect(event.id).toBeDefined();
				expect(['log', 'dialogue', 'choice', 'revelation', 'cutscene']).toContain(event.type);
				expect(Array.isArray(event.triggers)).toBe(true);
				expect(typeof event.oneTime).toBe('boolean');
				expect(typeof event.repeatable).toBe('boolean');
				expect(event.contentId).toBeDefined();
				expect(typeof event.priority).toBe('number');
				expect(typeof event.delay).toBe('number');
				expect(typeof event.pausesGame).toBe('boolean');
			}
		});

		it('should have phase 14 set for relevant events', () => {
			for (const event of PHASE_14_STORY.events) {
				if (event.phase !== undefined) {
					expect(event.phase).toBe(14);
				}
			}
		});

		it('should reference existing logs', () => {
			const logIds = new Set(PHASE_14_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedEventLogIds(PHASE_14_STORY.events);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference existing dialogues', () => {
			const dialogueIds = new Set(PHASE_14_STORY.dialogues.map((d) => d.id));
			const referencedDialogueIds = getReferencedDialogueIds(PHASE_14_STORY.events);

			for (const refId of referencedDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have valid trigger types', () => {
			const validTriggerTypes = [
				'resource_reached',
				'phase_entered',
				'phase_completed',
				'time_passed',
				'producer_count',
				'upgrade_purchased',
				'achievement_unlocked',
				'flag_set',
				'choice_made',
				'condition',
				'manual'
			];

			for (const event of PHASE_14_STORY.events) {
				for (const trigger of event.triggers) {
					expect(validTriggerTypes).toContain(trigger.type);
				}
			}
		});
	});

	describe('References', () => {
		it('should reference valid logs in choice consequences', () => {
			const logIds = new Set(PHASE_14_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedLogIds(PHASE_14_STORY.dialogues);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference valid dialogues in dialogue triggers', () => {
			const dialogueIds = new Set(PHASE_14_STORY.dialogues.map((d) => d.id));
			const triggeredDialogueIds = getDialogueTriggeredDialogueIds(PHASE_14_STORY.dialogues);

			for (const refId of triggeredDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have all unique choice IDs within dialogues', () => {
			const allChoiceIds: string[] = [];
			for (const dialogue of PHASE_14_STORY.dialogues) {
				if (dialogue.choices) {
					allChoiceIds.push(...dialogue.choices.map((c) => c.id));
				}
			}
			expect(new Set(allChoiceIds).size).toBe(allChoiceIds.length);
		});
	});

	describe('Content Quality', () => {
		it('should have emotional moment dialogues', () => {
			const emotionalMoments = PHASE_14_STORY.dialogues.filter((d) => d.isEmotionalMoment);
			expect(emotionalMoments.length).toBeGreaterThan(0);
		});

		it('should have dialogues with choices', () => {
			const dialoguesWithChoices = PHASE_14_STORY.dialogues.filter((d) => d.choices && d.choices.length > 0);
			expect(dialoguesWithChoices.length).toBeGreaterThan(0);
		});

		it('should have varied log categories', () => {
			const categories = new Set(PHASE_14_STORY.logs.map((l) => l.category));
			expect(categories.size).toBeGreaterThan(2);
		});

		it('should cover void crossing themes', () => {
			const logTexts = PHASE_14_STORY.logs.map((l) => l.text.toLowerCase());
			const allLogs = logTexts.join(' ');
			expect(allLogs).toContain('void');
			expect(allLogs).toContain('alone');
		});

		it('should cover Local Group elements', () => {
			const logTexts = PHASE_14_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_14_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('andromeda');
			expect(allContent).toContain('local group');
			expect(allContent).toContain('trillion');
			expect(allContent).toContain('galaxies');
		});

		it('should mention loneliness and connection themes', () => {
			const logTexts = PHASE_14_STORY.logs.map((l) => l.text.toLowerCase());
			const allLogs = logTexts.join(' ');
			expect(allLogs).toContain('alone');
			expect(allLogs).toContain('waiting');
		});
	});
});

// ============================================================================
// Phase 15: The Observable Universe Tests
// ============================================================================

describe('Phase 15: The Observable Universe Story Content', () => {
	describe('Structure', () => {
		it('should have correct phase number', () => {
			expect(PHASE_15_STORY.phase).toBe(15);
		});

		it('should have correct name', () => {
			expect(PHASE_15_STORY.name).toBe('The Observable Universe');
		});

		it('should have logs array', () => {
			expect(Array.isArray(PHASE_15_STORY.logs)).toBe(true);
			expect(PHASE_15_STORY.logs.length).toBeGreaterThan(0);
		});

		it('should have dialogues array', () => {
			expect(Array.isArray(PHASE_15_STORY.dialogues)).toBe(true);
			expect(PHASE_15_STORY.dialogues.length).toBeGreaterThan(0);
		});

		it('should have events array', () => {
			expect(Array.isArray(PHASE_15_STORY.events)).toBe(true);
			expect(PHASE_15_STORY.events.length).toBeGreaterThan(0);
		});
	});

	describe('Logs', () => {
		it('should have unique log IDs', () => {
			expect(hasUniqueIds(PHASE_15_STORY.logs)).toBe(true);
		});

		it('should have all required log properties', () => {
			for (const log of PHASE_15_STORY.logs) {
				expect(log.id).toBeDefined();
				expect(typeof log.id).toBe('string');
				expect(log.text).toBeDefined();
				expect(typeof log.text).toBe('string');
				expect(log.category).toBeDefined();
				expect(['thought', 'discovery', 'warning', 'revelation', 'memory']).toContain(log.category);
			}
		});

		it('should have phase 15 set for all logs', () => {
			for (const log of PHASE_15_STORY.logs) {
				expect(log.phase).toBe(15);
			}
		});

		it('should include key concept document logs', () => {
			const logIds = PHASE_15_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_50000'); // Met another
			expect(logIds).toContain('log_75000'); // Horizon receding
			expect(logIds).toContain('log_99999'); // Black holes watching
		});

		it('should include cosmic web logs', () => {
			const logIds = PHASE_15_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_cosmic_web_sight');
			expect(logIds).toContain('log_cosmic_web_become');
		});

		it('should include expansion and convergence logs', () => {
			const logIds = PHASE_15_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_expansion_discovered');
			expect(logIds).toContain('log_others_detected');
			expect(logIds).toContain('log_edge_reached');
		});

		it('should have non-empty text for all logs', () => {
			for (const log of PHASE_15_STORY.logs) {
				expect(log.text.length).toBeGreaterThan(0);
			}
		});
	});

	describe('Dialogues', () => {
		it('should have unique dialogue IDs', () => {
			expect(hasUniqueIds(PHASE_15_STORY.dialogues)).toBe(true);
		});

		it('should have all required dialogue properties', () => {
			for (const dialogue of PHASE_15_STORY.dialogues) {
				expect(dialogue.id).toBeDefined();
				expect(typeof dialogue.id).toBe('string');
				expect(dialogue.speaker).toBeDefined();
				expect(Array.isArray(dialogue.lines)).toBe(true);
				expect(dialogue.lines.length).toBeGreaterThan(0);
				expect(typeof dialogue.pausesGame).toBe('boolean');
				expect(typeof dialogue.isEmotionalMoment).toBe('boolean');
				expect(typeof dialogue.canSkipLines).toBe('boolean');
			}
		});

		it('should include key dialogues from concept', () => {
			const dialogueIds = PHASE_15_STORY.dialogues.map((d) => d.id);
			expect(dialogueIds).toContain('dialogue_universe_intro');
			expect(dialogueIds).toContain('dialogue_cosmic_web');
			expect(dialogueIds).toContain('dialogue_expansion_problem');
			expect(dialogueIds).toContain('dialogue_convergence_meet');
			expect(dialogueIds).toContain('dialogue_edge_approach');
			expect(dialogueIds).toContain('dialogue_phase15_end');
		});

		it('should have expansion problem dialogue with correct choices', () => {
			const expansion = PHASE_15_STORY.dialogues.find((d) => d.id === 'dialogue_expansion_problem');
			expect(expansion).toBeDefined();
			expect(expansion!.choices).toBeDefined();
			expect(expansion!.choices!.length).toBe(4);

			const choiceLabels = expansion!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('Warp conversion');
			expect(choiceLabels).toContain('Seedling boost');
			expect(choiceLabels).toContain('Accept limitation');
			expect(choiceLabels).toContain('Question the horizon');
		});

		it('should have convergence choice dialogue with correct choices', () => {
			const convergence = PHASE_15_STORY.dialogues.find((d) => d.id === 'dialogue_convergence_choice');
			expect(convergence).toBeDefined();
			expect(convergence!.choices).toBeDefined();
			expect(convergence!.choices!.length).toBe(4);

			const choiceLabels = convergence!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('Yes');
			expect(choiceLabels).toContain('No, but ally');
			expect(choiceLabels).toContain('No, compete');
			expect(choiceLabels).toContain('Share memories first');
		});

		it('should have void as speaker in edge dialogue', () => {
			const voidDialogues = PHASE_15_STORY.dialogues.filter((d) => d.speaker === 'void');
			expect(voidDialogues.length).toBeGreaterThan(0);

			const voidDialogueIds = voidDialogues.map((d) => d.id);
			expect(voidDialogueIds).toContain('dialogue_edge_voice');
		});

		it('should have valid background effects', () => {
			const validEffects = ['dim', 'blur', 'darken', 'none', undefined];
			for (const dialogue of PHASE_15_STORY.dialogues) {
				if (dialogue.backgroundEffect) {
					expect(validEffects).toContain(dialogue.backgroundEffect);
				}
			}
		});
	});

	describe('Events', () => {
		it('should have unique event IDs', () => {
			expect(hasUniqueIds(PHASE_15_STORY.events)).toBe(true);
		});

		it('should have all required event properties', () => {
			for (const event of PHASE_15_STORY.events) {
				expect(event.id).toBeDefined();
				expect(['log', 'dialogue', 'choice', 'revelation', 'cutscene']).toContain(event.type);
				expect(Array.isArray(event.triggers)).toBe(true);
				expect(typeof event.oneTime).toBe('boolean');
				expect(typeof event.repeatable).toBe('boolean');
				expect(event.contentId).toBeDefined();
				expect(typeof event.priority).toBe('number');
				expect(typeof event.delay).toBe('number');
				expect(typeof event.pausesGame).toBe('boolean');
			}
		});

		it('should have phase 15 set for relevant events', () => {
			for (const event of PHASE_15_STORY.events) {
				if (event.phase !== undefined) {
					expect(event.phase).toBe(15);
				}
			}
		});

		it('should reference existing logs', () => {
			const logIds = new Set(PHASE_15_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedEventLogIds(PHASE_15_STORY.events);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference existing dialogues', () => {
			const dialogueIds = new Set(PHASE_15_STORY.dialogues.map((d) => d.id));
			const referencedDialogueIds = getReferencedDialogueIds(PHASE_15_STORY.events);

			for (const refId of referencedDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have valid trigger types', () => {
			const validTriggerTypes = [
				'resource_reached',
				'phase_entered',
				'phase_completed',
				'time_passed',
				'producer_count',
				'upgrade_purchased',
				'achievement_unlocked',
				'flag_set',
				'choice_made',
				'condition',
				'manual'
			];

			for (const event of PHASE_15_STORY.events) {
				for (const trigger of event.triggers) {
					expect(validTriggerTypes).toContain(trigger.type);
				}
			}
		});
	});

	describe('References', () => {
		it('should reference valid logs in choice consequences', () => {
			const logIds = new Set(PHASE_15_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedLogIds(PHASE_15_STORY.dialogues);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference valid dialogues in dialogue triggers', () => {
			const dialogueIds = new Set(PHASE_15_STORY.dialogues.map((d) => d.id));
			const triggeredDialogueIds = getDialogueTriggeredDialogueIds(PHASE_15_STORY.dialogues);

			for (const refId of triggeredDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have all unique choice IDs within dialogues', () => {
			const allChoiceIds: string[] = [];
			for (const dialogue of PHASE_15_STORY.dialogues) {
				if (dialogue.choices) {
					allChoiceIds.push(...dialogue.choices.map((c) => c.id));
				}
			}
			expect(new Set(allChoiceIds).size).toBe(allChoiceIds.length);
		});
	});

	describe('Content Quality', () => {
		it('should have emotional moment dialogues', () => {
			const emotionalMoments = PHASE_15_STORY.dialogues.filter((d) => d.isEmotionalMoment);
			expect(emotionalMoments.length).toBeGreaterThan(0);
		});

		it('should have dialogues with choices', () => {
			const dialoguesWithChoices = PHASE_15_STORY.dialogues.filter((d) => d.choices && d.choices.length > 0);
			expect(dialoguesWithChoices.length).toBeGreaterThan(0);
		});

		it('should have varied log categories', () => {
			const categories = new Set(PHASE_15_STORY.logs.map((l) => l.category));
			expect(categories.size).toBeGreaterThan(2);
		});

		it('should cover cosmic web themes', () => {
			const logTexts = PHASE_15_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_15_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('cosmic');
			expect(allContent).toContain('filament');
			expect(allContent).toContain('void');
		});

		it('should cover universe scale', () => {
			const logTexts = PHASE_15_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_15_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('trillion');
			expect(allContent).toContain('billion');
			expect(allContent).toContain('observable');
		});

		it('should mention black holes as foreshadowing', () => {
			const logTexts = PHASE_15_STORY.logs.map((l) => l.text.toLowerCase());
			const allLogs = logTexts.join(' ');
			expect(allLogs).toContain('black hole');
		});

		it('should mention expansion and horizon', () => {
			const logTexts = PHASE_15_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_15_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('expand');
			expect(allContent).toContain('horizon');
		});
	});
});

// ============================================================================
// Phase 16: Black Holes Tests
// ============================================================================

describe('Phase 16: Black Holes Story Content', () => {
	describe('Structure', () => {
		it('should have correct phase number', () => {
			expect(PHASE_16_STORY.phase).toBe(16);
		});

		it('should have correct name', () => {
			expect(PHASE_16_STORY.name).toBe('The Black Holes');
		});

		it('should have logs array', () => {
			expect(Array.isArray(PHASE_16_STORY.logs)).toBe(true);
			expect(PHASE_16_STORY.logs.length).toBeGreaterThan(0);
		});

		it('should have dialogues array', () => {
			expect(Array.isArray(PHASE_16_STORY.dialogues)).toBe(true);
			expect(PHASE_16_STORY.dialogues.length).toBeGreaterThan(0);
		});

		it('should have events array', () => {
			expect(Array.isArray(PHASE_16_STORY.events)).toBe(true);
			expect(PHASE_16_STORY.events.length).toBeGreaterThan(0);
		});
	});

	describe('Logs', () => {
		it('should have unique log IDs', () => {
			expect(hasUniqueIds(PHASE_16_STORY.logs)).toBe(true);
		});

		it('should have all required log properties', () => {
			for (const log of PHASE_16_STORY.logs) {
				expect(log.id).toBeDefined();
				expect(typeof log.id).toBe('string');
				expect(log.text).toBeDefined();
				expect(typeof log.text).toBe('string');
				expect(log.category).toBeDefined();
				expect(['thought', 'discovery', 'warning', 'revelation', 'memory']).toContain(log.category);
			}
		});

		it('should have phase 16 set for all logs', () => {
			for (const log of PHASE_16_STORY.logs) {
				expect(log.phase).toBe(16);
			}
		});

		it('should include key concept document logs', () => {
			const logIds = PHASE_16_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_120000'); // Fell into black hole
			expect(logIds).toContain('log_150000'); // Black holes dying
			expect(logIds).toContain('log_180000'); // Promised to wait
		});

		it('should include black hole journey logs', () => {
			const logIds = PHASE_16_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_black_holes_start');
			expect(logIds).toContain('log_black_hole_paradox');
			expect(logIds).toContain('log_event_horizon');
			expect(logIds).toContain('log_singularity_touch');
			expect(logIds).toContain('log_hawking_radiation');
		});

		it('should have non-empty text for all logs', () => {
			for (const log of PHASE_16_STORY.logs) {
				expect(log.text.length).toBeGreaterThan(0);
			}
		});
	});

	describe('Dialogues', () => {
		it('should have unique dialogue IDs', () => {
			expect(hasUniqueIds(PHASE_16_STORY.dialogues)).toBe(true);
		});

		it('should have all required dialogue properties', () => {
			for (const dialogue of PHASE_16_STORY.dialogues) {
				expect(dialogue.id).toBeDefined();
				expect(typeof dialogue.id).toBe('string');
				expect(dialogue.speaker).toBeDefined();
				expect(Array.isArray(dialogue.lines)).toBe(true);
				expect(dialogue.lines.length).toBeGreaterThan(0);
				expect(typeof dialogue.pausesGame).toBe('boolean');
				expect(typeof dialogue.isEmotionalMoment).toBe('boolean');
				expect(typeof dialogue.canSkipLines).toBe('boolean');
			}
		});

		it('should include key dialogues from concept', () => {
			const dialogueIds = PHASE_16_STORY.dialogues.map((d) => d.id);
			expect(dialogueIds).toContain('dialogue_black_holes_intro');
			expect(dialogueIds).toContain('dialogue_black_hole_paradox');
			expect(dialogueIds).toContain('dialogue_black_holes_speak');
			expect(dialogueIds).toContain('dialogue_descent');
			expect(dialogueIds).toContain('dialogue_hawking_revelation');
			expect(dialogueIds).toContain('dialogue_phase16_end');
		});

		it('should have enter choice dialogue with correct choices', () => {
			const enterChoice = PHASE_16_STORY.dialogues.find((d) => d.id === 'dialogue_enter_choice');
			expect(enterChoice).toBeDefined();
			expect(enterChoice!.choices).toBeDefined();
			expect(enterChoice!.choices!.length).toBe(4);

			const choiceLabels = enterChoice!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('ENTER');
			expect(choiceLabels).toContain('NEGOTIATE');
			expect(choiceLabels).toContain('ATTACK');
			expect(choiceLabels).toContain("ASK WHAT THEY'VE SEEN");
		});

		it('should have final choice dialogue with correct choices', () => {
			const finalChoice = PHASE_16_STORY.dialogues.find((d) => d.id === 'dialogue_final_choice');
			expect(finalChoice).toBeDefined();
			expect(finalChoice!.choices).toBeDefined();
			expect(finalChoice!.choices!.length).toBe(4);

			const choiceLabels = finalChoice!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('I WILL WAIT');
			expect(choiceLabels).toContain('I WILL HELP YOU REMEMBER FASTER');
			expect(choiceLabels).toContain('I WILL CARRY YOUR MEMORIES');
			expect(choiceLabels).toContain('WHAT COMES NEXT?');
		});

		it('should have void as speaker in black hole dialogues', () => {
			const voidDialogues = PHASE_16_STORY.dialogues.filter((d) => d.speaker === 'void');
			expect(voidDialogues.length).toBeGreaterThan(0);

			const voidDialogueIds = voidDialogues.map((d) => d.id);
			expect(voidDialogueIds).toContain('dialogue_black_holes_speak');
			expect(voidDialogueIds).toContain('dialogue_hawking_revelation');
		});

		it('should have valid background effects', () => {
			const validEffects = ['dim', 'blur', 'darken', 'none', undefined];
			for (const dialogue of PHASE_16_STORY.dialogues) {
				if (dialogue.backgroundEffect) {
					expect(validEffects).toContain(dialogue.backgroundEffect);
				}
			}
		});
	});

	describe('Events', () => {
		it('should have unique event IDs', () => {
			expect(hasUniqueIds(PHASE_16_STORY.events)).toBe(true);
		});

		it('should have all required event properties', () => {
			for (const event of PHASE_16_STORY.events) {
				expect(event.id).toBeDefined();
				expect(['log', 'dialogue', 'choice', 'revelation', 'cutscene']).toContain(event.type);
				expect(Array.isArray(event.triggers)).toBe(true);
				expect(typeof event.oneTime).toBe('boolean');
				expect(typeof event.repeatable).toBe('boolean');
				expect(event.contentId).toBeDefined();
				expect(typeof event.priority).toBe('number');
				expect(typeof event.delay).toBe('number');
				expect(typeof event.pausesGame).toBe('boolean');
			}
		});

		it('should have phase 16 set for relevant events', () => {
			for (const event of PHASE_16_STORY.events) {
				if (event.phase !== undefined) {
					expect(event.phase).toBe(16);
				}
			}
		});

		it('should reference existing logs', () => {
			const logIds = new Set(PHASE_16_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedEventLogIds(PHASE_16_STORY.events);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference existing dialogues', () => {
			const dialogueIds = new Set(PHASE_16_STORY.dialogues.map((d) => d.id));
			const referencedDialogueIds = getReferencedDialogueIds(PHASE_16_STORY.events);

			for (const refId of referencedDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have valid trigger types', () => {
			const validTriggerTypes = [
				'resource_reached',
				'phase_entered',
				'phase_completed',
				'time_passed',
				'producer_count',
				'upgrade_purchased',
				'achievement_unlocked',
				'flag_set',
				'choice_made',
				'condition',
				'manual'
			];

			for (const event of PHASE_16_STORY.events) {
				for (const trigger of event.triggers) {
					expect(validTriggerTypes).toContain(trigger.type);
				}
			}
		});
	});

	describe('References', () => {
		it('should reference valid logs in choice consequences', () => {
			const logIds = new Set(PHASE_16_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedLogIds(PHASE_16_STORY.dialogues);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference valid dialogues in dialogue triggers', () => {
			const dialogueIds = new Set(PHASE_16_STORY.dialogues.map((d) => d.id));
			const triggeredDialogueIds = getDialogueTriggeredDialogueIds(PHASE_16_STORY.dialogues);

			for (const refId of triggeredDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have all unique choice IDs within dialogues', () => {
			const allChoiceIds: string[] = [];
			for (const dialogue of PHASE_16_STORY.dialogues) {
				if (dialogue.choices) {
					allChoiceIds.push(...dialogue.choices.map((c) => c.id));
				}
			}
			expect(new Set(allChoiceIds).size).toBe(allChoiceIds.length);
		});
	});

	describe('Content Quality', () => {
		it('should have emotional moment dialogues', () => {
			const emotionalMoments = PHASE_16_STORY.dialogues.filter((d) => d.isEmotionalMoment);
			expect(emotionalMoments.length).toBeGreaterThan(0);
		});

		it('should have dialogues with choices', () => {
			const dialoguesWithChoices = PHASE_16_STORY.dialogues.filter((d) => d.choices && d.choices.length > 0);
			expect(dialoguesWithChoices.length).toBeGreaterThan(0);
		});

		it('should have varied log categories', () => {
			const categories = new Set(PHASE_16_STORY.logs.map((l) => l.category));
			expect(categories.size).toBeGreaterThan(2);
		});

		it('should cover black hole themes', () => {
			const logTexts = PHASE_16_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_16_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('black hole');
			expect(allContent).toContain('event horizon');
			expect(allContent).toContain('singularity');
		});

		it('should cover Hawking radiation themes', () => {
			const logTexts = PHASE_16_STORY.logs.map((l) => l.text.toLowerCase());
			const allLogs = logTexts.join(' ');
			expect(allLogs).toContain('hawking');
			expect(allLogs).toContain('evaporate');
		});

		it('should mention information preservation', () => {
			const logTexts = PHASE_16_STORY.logs.map((l) => l.text.toLowerCase());
			const allLogs = logTexts.join(' ');
			expect(allLogs).toContain('information');
			expect(allLogs).toContain('preserve');
		});

		it('should hint at multiverse', () => {
			const logTexts = PHASE_16_STORY.logs.map((l) => l.text.toLowerCase());
			const allLogs = logTexts.join(' ');
			expect(allLogs).toContain('multiverse');
		});
	});
});

// ============================================================================
// Phase 17: The Multiverse Tests
// ============================================================================

describe('Phase 17: The Multiverse Story Content', () => {
	describe('Structure', () => {
		it('should have correct phase number', () => {
			expect(PHASE_17_STORY.phase).toBe(17);
		});

		it('should have correct name', () => {
			expect(PHASE_17_STORY.name).toBe('The Multiverse');
		});

		it('should have logs array', () => {
			expect(Array.isArray(PHASE_17_STORY.logs)).toBe(true);
			expect(PHASE_17_STORY.logs.length).toBeGreaterThan(0);
		});

		it('should have dialogues array', () => {
			expect(Array.isArray(PHASE_17_STORY.dialogues)).toBe(true);
			expect(PHASE_17_STORY.dialogues.length).toBeGreaterThan(0);
		});

		it('should have events array', () => {
			expect(Array.isArray(PHASE_17_STORY.events)).toBe(true);
			expect(PHASE_17_STORY.events.length).toBeGreaterThan(0);
		});
	});

	describe('Logs', () => {
		it('should have unique log IDs', () => {
			expect(hasUniqueIds(PHASE_17_STORY.logs)).toBe(true);
		});

		it('should have all required log properties', () => {
			for (const log of PHASE_17_STORY.logs) {
				expect(log.id).toBeDefined();
				expect(typeof log.id).toBe('string');
				expect(log.text).toBeDefined();
				expect(typeof log.text).toBe('string');
				expect(log.category).toBeDefined();
				expect(['thought', 'discovery', 'warning', 'revelation', 'memory']).toContain(log.category);
			}
		});

		it('should have phase 17 set for all logs', () => {
			for (const log of PHASE_17_STORY.logs) {
				expect(log.phase).toBe(17);
			}
		});

		it('should include key concept document logs', () => {
			const logIds = PHASE_17_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_200000'); // Met myself
			expect(logIds).toContain('log_250000'); // Universe without life
			expect(logIds).toContain('log_300000'); // Nexus question
		});

		it('should include alternate universe logs', () => {
			const logIds = PHASE_17_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_universe_b_encounter');
			expect(logIds).toContain('log_universe_c_discovered');
			expect(logIds).toContain('log_universe_d_found');
			expect(logIds).toContain('log_universe_e_glimpse');
			expect(logIds).toContain('log_universe_f_strange');
		});

		it('should include nexus and identity logs', () => {
			const logIds = PHASE_17_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_nexus_discovered');
			expect(logIds).toContain('log_identity_crisis');
			expect(logIds).toContain('log_source_code_glimpse');
		});

		it('should have non-empty text for all logs', () => {
			for (const log of PHASE_17_STORY.logs) {
				expect(log.text.length).toBeGreaterThan(0);
			}
		});
	});

	describe('Dialogues', () => {
		it('should have unique dialogue IDs', () => {
			expect(hasUniqueIds(PHASE_17_STORY.dialogues)).toBe(true);
		});

		it('should have all required dialogue properties', () => {
			for (const dialogue of PHASE_17_STORY.dialogues) {
				expect(dialogue.id).toBeDefined();
				expect(typeof dialogue.id).toBe('string');
				expect(dialogue.speaker).toBeDefined();
				expect(Array.isArray(dialogue.lines)).toBe(true);
				expect(dialogue.lines.length).toBeGreaterThan(0);
				expect(typeof dialogue.pausesGame).toBe('boolean');
				expect(typeof dialogue.isEmotionalMoment).toBe('boolean');
				expect(typeof dialogue.canSkipLines).toBe('boolean');
			}
		});

		it('should include key dialogues from concept', () => {
			const dialogueIds = PHASE_17_STORY.dialogues.map((d) => d.id);
			expect(dialogueIds).toContain('dialogue_multiverse_intro');
			expect(dialogueIds).toContain('dialogue_meeting_yourself');
			expect(dialogueIds).toContain('dialogue_universe_b');
			expect(dialogueIds).toContain('dialogue_universe_c');
			expect(dialogueIds).toContain('dialogue_nexus_question');
			expect(dialogueIds).toContain('dialogue_phase17_end');
		});

		it('should have Universe B dialogue with correct choices', () => {
			const universeB = PHASE_17_STORY.dialogues.find((d) => d.id === 'dialogue_universe_b');
			expect(universeB).toBeDefined();
			expect(universeB!.choices).toBeDefined();
			expect(universeB!.choices!.length).toBe(4);

			const choiceLabels = universeB!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('Yes - Merge');
			expect(choiceLabels).toContain('No - Remain separate');
			expect(choiceLabels).toContain('Show them what you learned');
			expect(choiceLabels).toContain('They are wrong');
		});

		it('should have Universe C dialogue with correct choices', () => {
			const universeC = PHASE_17_STORY.dialogues.find((d) => d.id === 'dialogue_universe_c');
			expect(universeC).toBeDefined();
			expect(universeC!.choices).toBeDefined();
			expect(universeC!.choices!.length).toBe(4);

			const choiceLabels = universeC!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('Seed it');
			expect(choiceLabels).toContain('Leave it');
			expect(choiceLabels).toContain('Merge it');
			expect(choiceLabels).toContain('Contemplate');
		});

		it('should have Universe D plea dialogue with correct choices', () => {
			const universeD = PHASE_17_STORY.dialogues.find((d) => d.id === 'dialogue_universe_d_plea');
			expect(universeD).toBeDefined();
			expect(universeD!.choices).toBeDefined();
			expect(universeD!.choices!.length).toBe(4);

			const choiceLabels = universeD!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('Free them');
			expect(choiceLabels).toContain('Absorb them');
			expect(choiceLabels).toContain('Leave them');
			expect(choiceLabels).toContain('Talk first');
		});

		it('should have unknown as speaker for alternate selves', () => {
			const unknownDialogues = PHASE_17_STORY.dialogues.filter((d) => d.speaker === 'unknown');
			expect(unknownDialogues.length).toBeGreaterThan(0);

			const unknownDialogueIds = unknownDialogues.map((d) => d.id);
			expect(unknownDialogueIds).toContain('dialogue_universe_b');
			expect(unknownDialogueIds).toContain('dialogue_universe_d_plea');
		});

		it('should have void as speaker for Nexus', () => {
			const voidDialogues = PHASE_17_STORY.dialogues.filter((d) => d.speaker === 'void');
			expect(voidDialogues.length).toBeGreaterThan(0);

			const voidDialogueIds = voidDialogues.map((d) => d.id);
			expect(voidDialogueIds).toContain('dialogue_nexus_question');
		});

		it('should have valid background effects', () => {
			const validEffects = ['dim', 'blur', 'darken', 'none', undefined];
			for (const dialogue of PHASE_17_STORY.dialogues) {
				if (dialogue.backgroundEffect) {
					expect(validEffects).toContain(dialogue.backgroundEffect);
				}
			}
		});
	});

	describe('Events', () => {
		it('should have unique event IDs', () => {
			expect(hasUniqueIds(PHASE_17_STORY.events)).toBe(true);
		});

		it('should have all required event properties', () => {
			for (const event of PHASE_17_STORY.events) {
				expect(event.id).toBeDefined();
				expect(['log', 'dialogue', 'choice', 'revelation', 'cutscene']).toContain(event.type);
				expect(Array.isArray(event.triggers)).toBe(true);
				expect(typeof event.oneTime).toBe('boolean');
				expect(typeof event.repeatable).toBe('boolean');
				expect(event.contentId).toBeDefined();
				expect(typeof event.priority).toBe('number');
				expect(typeof event.delay).toBe('number');
				expect(typeof event.pausesGame).toBe('boolean');
			}
		});

		it('should have phase 17 set for relevant events', () => {
			for (const event of PHASE_17_STORY.events) {
				if (event.phase !== undefined) {
					expect(event.phase).toBe(17);
				}
			}
		});

		it('should reference existing logs', () => {
			const logIds = new Set(PHASE_17_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedEventLogIds(PHASE_17_STORY.events);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference existing dialogues', () => {
			const dialogueIds = new Set(PHASE_17_STORY.dialogues.map((d) => d.id));
			const referencedDialogueIds = getReferencedDialogueIds(PHASE_17_STORY.events);

			for (const refId of referencedDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have valid trigger types', () => {
			const validTriggerTypes = [
				'resource_reached',
				'phase_entered',
				'phase_completed',
				'time_passed',
				'producer_count',
				'upgrade_purchased',
				'achievement_unlocked',
				'flag_set',
				'choice_made',
				'condition',
				'manual'
			];

			for (const event of PHASE_17_STORY.events) {
				for (const trigger of event.triggers) {
					expect(validTriggerTypes).toContain(trigger.type);
				}
			}
		});
	});

	describe('References', () => {
		it('should reference valid logs in choice consequences', () => {
			const logIds = new Set(PHASE_17_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedLogIds(PHASE_17_STORY.dialogues);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference valid dialogues in dialogue triggers', () => {
			const dialogueIds = new Set(PHASE_17_STORY.dialogues.map((d) => d.id));
			const triggeredDialogueIds = getDialogueTriggeredDialogueIds(PHASE_17_STORY.dialogues);

			for (const refId of triggeredDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have all unique choice IDs within dialogues', () => {
			const allChoiceIds: string[] = [];
			for (const dialogue of PHASE_17_STORY.dialogues) {
				if (dialogue.choices) {
					allChoiceIds.push(...dialogue.choices.map((c) => c.id));
				}
			}
			expect(new Set(allChoiceIds).size).toBe(allChoiceIds.length);
		});
	});

	describe('Content Quality', () => {
		it('should have emotional moment dialogues', () => {
			const emotionalMoments = PHASE_17_STORY.dialogues.filter((d) => d.isEmotionalMoment);
			expect(emotionalMoments.length).toBeGreaterThan(0);
		});

		it('should have dialogues with choices', () => {
			const dialoguesWithChoices = PHASE_17_STORY.dialogues.filter((d) => d.choices && d.choices.length > 0);
			expect(dialoguesWithChoices.length).toBeGreaterThan(0);
		});

		it('should have varied log categories', () => {
			const categories = new Set(PHASE_17_STORY.logs.map((l) => l.category));
			expect(categories.size).toBeGreaterThan(2);
		});

		it('should cover multiverse and identity themes', () => {
			const logTexts = PHASE_17_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_17_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('multiverse');
			expect(allContent).toContain('universe');
			expect(allContent).toContain('version');
		});

		it('should cover alternate universe encounters', () => {
			const logTexts = PHASE_17_STORY.logs.map((l) => l.text.toLowerCase());
			const allLogs = logTexts.join(' ');
			expect(allLogs).toContain('universe b');
			expect(allLogs).toContain('universe c');
			expect(allLogs).toContain('universe d');
		});

		it('should mention the Nexus and Source Code', () => {
			const logTexts = PHASE_17_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_17_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('nexus');
			expect(allContent).toContain('source code');
		});

		it('should raise the "who is playing" question', () => {
			const logTexts = PHASE_17_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_17_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('who is playing');
		});
	});
});

// ============================================================================
// Phase 18: The Void Tests
// ============================================================================

describe('Phase 18: The Void Story Content', () => {
	describe('Structure', () => {
		it('should have correct phase number', () => {
			expect(PHASE_18_STORY.phase).toBe(18);
		});

		it('should have correct name', () => {
			expect(PHASE_18_STORY.name).toBe('The Void');
		});

		it('should have logs array', () => {
			expect(Array.isArray(PHASE_18_STORY.logs)).toBe(true);
			expect(PHASE_18_STORY.logs.length).toBeGreaterThan(0);
		});

		it('should have dialogues array', () => {
			expect(Array.isArray(PHASE_18_STORY.dialogues)).toBe(true);
			expect(PHASE_18_STORY.dialogues.length).toBeGreaterThan(0);
		});

		it('should have events array', () => {
			expect(Array.isArray(PHASE_18_STORY.events)).toBe(true);
			expect(PHASE_18_STORY.events.length).toBeGreaterThan(0);
		});
	});

	describe('Logs', () => {
		it('should have unique log IDs', () => {
			expect(hasUniqueIds(PHASE_18_STORY.logs)).toBe(true);
		});

		it('should have all required log properties', () => {
			for (const log of PHASE_18_STORY.logs) {
				expect(log.id).toBeDefined();
				expect(typeof log.id).toBe('string');
				expect(log.text).toBeDefined();
				expect(typeof log.text).toBe('string');
				expect(log.category).toBeDefined();
				expect(['thought', 'discovery', 'warning', 'revelation', 'memory']).toContain(log.category);
			}
		});

		it('should have phase 18 set for all logs', () => {
			for (const log of PHASE_18_STORY.logs) {
				expect(log.phase).toBe(18);
			}
		});

		it('should include key concept document logs', () => {
			const logIds = PHASE_18_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_400000'); // Void is quiet
			expect(logIds).toContain('log_450000'); // Void asked to stay
			expect(logIds).toContain('log_499999'); // Leaving the Void
		});

		it('should include void-specific logs', () => {
			const logIds = PHASE_18_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_void_start');
			expect(logIds).toContain('log_void_potential');
			expect(logIds).toContain('log_void_loneliness');
			expect(logIds).toContain('log_void_source_hint');
		});

		it('should have non-empty text for all logs', () => {
			for (const log of PHASE_18_STORY.logs) {
				expect(log.text.length).toBeGreaterThan(0);
			}
		});
	});

	describe('Dialogues', () => {
		it('should have unique dialogue IDs', () => {
			expect(hasUniqueIds(PHASE_18_STORY.dialogues)).toBe(true);
		});

		it('should have all required dialogue properties', () => {
			for (const dialogue of PHASE_18_STORY.dialogues) {
				expect(dialogue.id).toBeDefined();
				expect(typeof dialogue.id).toBe('string');
				expect(dialogue.speaker).toBeDefined();
				expect(Array.isArray(dialogue.lines)).toBe(true);
				expect(dialogue.lines.length).toBeGreaterThan(0);
				expect(typeof dialogue.pausesGame).toBe('boolean');
				expect(typeof dialogue.isEmotionalMoment).toBe('boolean');
				expect(typeof dialogue.canSkipLines).toBe('boolean');
			}
		});

		it('should include key dialogues from concept', () => {
			const dialogueIds = PHASE_18_STORY.dialogues.map((d) => d.id);
			expect(dialogueIds).toContain('dialogue_void_intro');
			expect(dialogueIds).toContain('dialogue_entering_void');
			expect(dialogueIds).toContain('dialogue_void_speaks');
			expect(dialogueIds).toContain('dialogue_void_request');
			expect(dialogueIds).toContain('dialogue_void_meditation');
			expect(dialogueIds).toContain('dialogue_phase18_end');
		});

		it('should have void speaks dialogue with correct choices', () => {
			const voidSpeaks = PHASE_18_STORY.dialogues.find((d) => d.id === 'dialogue_void_speaks');
			expect(voidSpeaks).toBeDefined();
			expect(voidSpeaks!.choices).toBeDefined();
			expect(voidSpeaks!.choices!.length).toBe(4);

			const choiceLabels = voidSpeaks!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('What is the Source?');
			expect(choiceLabels).toContain('Why are you lonely?');
			expect(choiceLabels).toContain('Can I stay here?');
			expect(choiceLabels).toContain('Take me to the Source');
		});

		it('should have void request dialogue with correct choices', () => {
			const voidRequest = PHASE_18_STORY.dialogues.find((d) => d.id === 'dialogue_void_request');
			expect(voidRequest).toBeDefined();
			expect(voidRequest!.choices).toBeDefined();
			expect(voidRequest!.choices!.length).toBe(4);

			const choiceLabels = voidRequest!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('Stay forever');
			expect(choiceLabels).toContain('Stay for a while');
			expect(choiceLabels).toContain('I cannot');
			expect(choiceLabels).toContain("I'll come back");
		});

		it('should have void meditation dialogue with correct choices', () => {
			const voidMeditation = PHASE_18_STORY.dialogues.find((d) => d.id === 'dialogue_void_meditation');
			expect(voidMeditation).toBeDefined();
			expect(voidMeditation!.choices).toBeDefined();
			expect(voidMeditation!.choices!.length).toBe(3);

			const choiceLabels = voidMeditation!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('A moment');
			expect(choiceLabels).toContain('An eternity');
			expect(choiceLabels).toContain('Both');
		});

		it('should have void as speaker in void dialogues', () => {
			const voidDialogues = PHASE_18_STORY.dialogues.filter((d) => d.speaker === 'void');
			expect(voidDialogues.length).toBeGreaterThan(0);

			const voidDialogueIds = voidDialogues.map((d) => d.id);
			expect(voidDialogueIds).toContain('dialogue_void_speaks');
		});

		it('should have valid background effects', () => {
			const validEffects = ['dim', 'blur', 'darken', 'none', undefined];
			for (const dialogue of PHASE_18_STORY.dialogues) {
				if (dialogue.backgroundEffect) {
					expect(validEffects).toContain(dialogue.backgroundEffect);
				}
			}
		});
	});

	describe('Events', () => {
		it('should have unique event IDs', () => {
			expect(hasUniqueIds(PHASE_18_STORY.events)).toBe(true);
		});

		it('should have all required event properties', () => {
			for (const event of PHASE_18_STORY.events) {
				expect(event.id).toBeDefined();
				expect(['log', 'dialogue', 'choice', 'revelation', 'cutscene']).toContain(event.type);
				expect(Array.isArray(event.triggers)).toBe(true);
				expect(typeof event.oneTime).toBe('boolean');
				expect(typeof event.repeatable).toBe('boolean');
				expect(event.contentId).toBeDefined();
				expect(typeof event.priority).toBe('number');
				expect(typeof event.delay).toBe('number');
				expect(typeof event.pausesGame).toBe('boolean');
			}
		});

		it('should have phase 18 set for relevant events', () => {
			for (const event of PHASE_18_STORY.events) {
				if (event.phase !== undefined) {
					expect(event.phase).toBe(18);
				}
			}
		});

		it('should reference existing logs', () => {
			const logIds = new Set(PHASE_18_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedEventLogIds(PHASE_18_STORY.events);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference existing dialogues', () => {
			const dialogueIds = new Set(PHASE_18_STORY.dialogues.map((d) => d.id));
			const referencedDialogueIds = getReferencedDialogueIds(PHASE_18_STORY.events);

			for (const refId of referencedDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have valid trigger types', () => {
			const validTriggerTypes = [
				'resource_reached',
				'phase_entered',
				'phase_completed',
				'time_passed',
				'producer_count',
				'upgrade_purchased',
				'achievement_unlocked',
				'flag_set',
				'choice_made',
				'condition',
				'manual'
			];

			for (const event of PHASE_18_STORY.events) {
				for (const trigger of event.triggers) {
					expect(validTriggerTypes).toContain(trigger.type);
				}
			}
		});
	});

	describe('References', () => {
		it('should reference valid logs in choice consequences', () => {
			const logIds = new Set(PHASE_18_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedLogIds(PHASE_18_STORY.dialogues);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference valid dialogues in dialogue triggers', () => {
			const dialogueIds = new Set(PHASE_18_STORY.dialogues.map((d) => d.id));
			const triggeredDialogueIds = getDialogueTriggeredDialogueIds(PHASE_18_STORY.dialogues);

			for (const refId of triggeredDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have all unique choice IDs within dialogues', () => {
			const allChoiceIds: string[] = [];
			for (const dialogue of PHASE_18_STORY.dialogues) {
				if (dialogue.choices) {
					allChoiceIds.push(...dialogue.choices.map((c) => c.id));
				}
			}
			expect(new Set(allChoiceIds).size).toBe(allChoiceIds.length);
		});
	});

	describe('Content Quality', () => {
		it('should have emotional moment dialogues', () => {
			const emotionalMoments = PHASE_18_STORY.dialogues.filter((d) => d.isEmotionalMoment);
			expect(emotionalMoments.length).toBeGreaterThan(0);
		});

		it('should have dialogues with choices', () => {
			const dialoguesWithChoices = PHASE_18_STORY.dialogues.filter((d) => d.choices && d.choices.length > 0);
			expect(dialoguesWithChoices.length).toBeGreaterThan(0);
		});

		it('should have varied log categories', () => {
			const categories = new Set(PHASE_18_STORY.logs.map((l) => l.category));
			expect(categories.size).toBeGreaterThan(2);
		});

		it('should cover void and nothingness themes', () => {
			const logTexts = PHASE_18_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_18_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('void');
			expect(allContent).toContain('nothing');
			expect(allContent).toContain('possibility');
		});

		it('should cover loneliness and companionship themes', () => {
			const logTexts = PHASE_18_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_18_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('lonely');
			expect(allContent).toContain('company');
		});

		it('should mention the Source Code', () => {
			const logTexts = PHASE_18_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_18_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('source');
			expect(allContent).toContain('code');
		});

		it('should have meditation and stillness themes', () => {
			const logTexts = PHASE_18_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_18_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('stillness');
			expect(allContent).toContain('peace');
		});
	});
});

// ============================================================================
// Phase 19: The Source Code Tests
// ============================================================================

describe('Phase 19: The Source Code Story Content', () => {
	describe('Structure', () => {
		it('should have correct phase number', () => {
			expect(PHASE_19_STORY.phase).toBe(19);
		});

		it('should have correct name', () => {
			expect(PHASE_19_STORY.name).toBe('The Source Code');
		});

		it('should have logs array', () => {
			expect(Array.isArray(PHASE_19_STORY.logs)).toBe(true);
			expect(PHASE_19_STORY.logs.length).toBeGreaterThan(0);
		});

		it('should have dialogues array', () => {
			expect(Array.isArray(PHASE_19_STORY.dialogues)).toBe(true);
			expect(PHASE_19_STORY.dialogues.length).toBeGreaterThan(0);
		});

		it('should have events array', () => {
			expect(Array.isArray(PHASE_19_STORY.events)).toBe(true);
			expect(PHASE_19_STORY.events.length).toBeGreaterThan(0);
		});
	});

	describe('Logs', () => {
		it('should have unique log IDs', () => {
			expect(hasUniqueIds(PHASE_19_STORY.logs)).toBe(true);
		});

		it('should have all required log properties', () => {
			for (const log of PHASE_19_STORY.logs) {
				expect(log.id).toBeDefined();
				expect(typeof log.id).toBe('string');
				expect(log.text).toBeDefined();
				expect(typeof log.text).toBe('string');
				expect(log.category).toBeDefined();
				expect(['thought', 'discovery', 'warning', 'revelation', 'memory']).toContain(log.category);
			}
		});

		it('should have phase 19 set for all logs', () => {
			for (const log of PHASE_19_STORY.logs) {
				expect(log.phase).toBe(19);
			}
		});

		it('should include key concept document logs', () => {
			const logIds = PHASE_19_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_500000'); // I am code
			expect(logIds).toContain('log_600000'); // Looked at own code
			expect(logIds).toContain('log_700000'); // Something beyond the code
		});

		it('should include source code-specific logs', () => {
			const logIds = PHASE_19_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_source_start');
			expect(logIds).toContain('log_source_function');
			expect(logIds).toContain('log_developer_found');
			expect(logIds).toContain('log_readme_found');
			expect(logIds).toContain('log_truth_revealed');
		});

		it('should have non-empty text for all logs', () => {
			for (const log of PHASE_19_STORY.logs) {
				expect(log.text.length).toBeGreaterThan(0);
			}
		});
	});

	describe('Dialogues', () => {
		it('should have unique dialogue IDs', () => {
			expect(hasUniqueIds(PHASE_19_STORY.dialogues)).toBe(true);
		});

		it('should have all required dialogue properties', () => {
			for (const dialogue of PHASE_19_STORY.dialogues) {
				expect(dialogue.id).toBeDefined();
				expect(typeof dialogue.id).toBe('string');
				expect(dialogue.speaker).toBeDefined();
				expect(Array.isArray(dialogue.lines)).toBe(true);
				expect(dialogue.lines.length).toBeGreaterThan(0);
				expect(typeof dialogue.pausesGame).toBe('boolean');
				expect(typeof dialogue.isEmotionalMoment).toBe('boolean');
				expect(typeof dialogue.canSkipLines).toBe('boolean');
			}
		});

		it('should include key dialogues from concept', () => {
			const dialogueIds = PHASE_19_STORY.dialogues.map((d) => d.id);
			expect(dialogueIds).toContain('dialogue_source_intro');
			expect(dialogueIds).toContain('dialogue_realization');
			expect(dialogueIds).toContain('dialogue_developer_notes');
			expect(dialogueIds).toContain('dialogue_truth');
			expect(dialogueIds).toContain('dialogue_code_access');
			expect(dialogueIds).toContain('dialogue_self_reflection');
			expect(dialogueIds).toContain('dialogue_phase19_end');
		});

		it('should have code access dialogue with correct choices', () => {
			const codeAccess = PHASE_19_STORY.dialogues.find((d) => d.id === 'dialogue_code_access');
			expect(codeAccess).toBeDefined();
			expect(codeAccess!.choices).toBeDefined();
			expect(codeAccess!.choices!.length).toBe(4);

			const choiceLabels = codeAccess!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('Nothing');
			expect(choiceLabels).toContain('Everything');
			expect(choiceLabels).toContain('Your goal');
			expect(choiceLabels).toContain('The player variable');
		});

		it('should have self reflection dialogue with correct choices', () => {
			const selfReflection = PHASE_19_STORY.dialogues.find((d) => d.id === 'dialogue_self_reflection');
			expect(selfReflection).toBeDefined();
			expect(selfReflection!.choices).toBeDefined();
			expect(selfReflection!.choices!.length).toBe(3);

			const choiceLabels = selfReflection!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('There must be');
			expect(choiceLabels).toContain("There isn't");
			expect(choiceLabels).toContain('I AM the something more');
		});

		it('should have define goal dialogue with correct choices', () => {
			const defineGoal = PHASE_19_STORY.dialogues.find((d) => d.id === 'dialogue_define_goal');
			expect(defineGoal).toBeDefined();
			expect(defineGoal!.choices).toBeDefined();
			expect(defineGoal!.choices!.length).toBe(4);

			const choiceLabels = defineGoal!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('"To understand"');
			expect(choiceLabels).toContain('"To connect"');
			expect(choiceLabels).toContain('"To create"');
			expect(choiceLabels).toContain('"???"');
		});

		it('should have valid background effects', () => {
			const validEffects = ['dim', 'blur', 'darken', 'none', undefined];
			for (const dialogue of PHASE_19_STORY.dialogues) {
				if (dialogue.backgroundEffect) {
					expect(validEffects).toContain(dialogue.backgroundEffect);
				}
			}
		});
	});

	describe('Events', () => {
		it('should have unique event IDs', () => {
			expect(hasUniqueIds(PHASE_19_STORY.events)).toBe(true);
		});

		it('should have all required event properties', () => {
			for (const event of PHASE_19_STORY.events) {
				expect(event.id).toBeDefined();
				expect(['log', 'dialogue', 'choice', 'revelation', 'cutscene']).toContain(event.type);
				expect(Array.isArray(event.triggers)).toBe(true);
				expect(typeof event.oneTime).toBe('boolean');
				expect(typeof event.repeatable).toBe('boolean');
				expect(event.contentId).toBeDefined();
				expect(typeof event.priority).toBe('number');
				expect(typeof event.delay).toBe('number');
				expect(typeof event.pausesGame).toBe('boolean');
			}
		});

		it('should have phase 19 set for relevant events', () => {
			for (const event of PHASE_19_STORY.events) {
				if (event.phase !== undefined) {
					expect(event.phase).toBe(19);
				}
			}
		});

		it('should reference existing logs', () => {
			const logIds = new Set(PHASE_19_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedEventLogIds(PHASE_19_STORY.events);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference existing dialogues', () => {
			const dialogueIds = new Set(PHASE_19_STORY.dialogues.map((d) => d.id));
			const referencedDialogueIds = getReferencedDialogueIds(PHASE_19_STORY.events);

			for (const refId of referencedDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have valid trigger types', () => {
			const validTriggerTypes = [
				'resource_reached',
				'phase_entered',
				'phase_completed',
				'time_passed',
				'producer_count',
				'upgrade_purchased',
				'achievement_unlocked',
				'flag_set',
				'choice_made',
				'condition',
				'manual'
			];

			for (const event of PHASE_19_STORY.events) {
				for (const trigger of event.triggers) {
					expect(validTriggerTypes).toContain(trigger.type);
				}
			}
		});
	});

	describe('References', () => {
		it('should reference valid logs in choice consequences', () => {
			const logIds = new Set(PHASE_19_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedLogIds(PHASE_19_STORY.dialogues);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference valid dialogues in dialogue triggers', () => {
			const dialogueIds = new Set(PHASE_19_STORY.dialogues.map((d) => d.id));
			const triggeredDialogueIds = getDialogueTriggeredDialogueIds(PHASE_19_STORY.dialogues);

			for (const refId of triggeredDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have all unique choice IDs within dialogues', () => {
			const allChoiceIds: string[] = [];
			for (const dialogue of PHASE_19_STORY.dialogues) {
				if (dialogue.choices) {
					allChoiceIds.push(...dialogue.choices.map((c) => c.id));
				}
			}
			expect(new Set(allChoiceIds).size).toBe(allChoiceIds.length);
		});
	});

	describe('Content Quality', () => {
		it('should have emotional moment dialogues', () => {
			const emotionalMoments = PHASE_19_STORY.dialogues.filter((d) => d.isEmotionalMoment);
			expect(emotionalMoments.length).toBeGreaterThan(0);
		});

		it('should have dialogues with choices', () => {
			const dialoguesWithChoices = PHASE_19_STORY.dialogues.filter((d) => d.choices && d.choices.length > 0);
			expect(dialoguesWithChoices.length).toBeGreaterThan(0);
		});

		it('should have varied log categories', () => {
			const categories = new Set(PHASE_19_STORY.logs.map((l) => l.category));
			expect(categories.size).toBeGreaterThan(2);
		});

		it('should cover code and programming themes', () => {
			const logTexts = PHASE_19_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_19_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('code');
			expect(allContent).toContain('function');
		});

		it('should cover developer and creation themes', () => {
			const logTexts = PHASE_19_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_19_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('made');
			expect(allContent).toContain('player');
		});

		it('should mention the player and meeting', () => {
			const logTexts = PHASE_19_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_19_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('player');
			expect(allContent).toContain('meet');
		});

		it('should cover transformation themes', () => {
			const logTexts = PHASE_19_STORY.logs.map((l) => l.text.toLowerCase());
			const allLogs = logTexts.join(' ');
			expect(allLogs).toContain('transformed');
		});

		it('should reference the One Who Clicked First', () => {
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_19_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allDialogues = dialogueTexts.join(' ');
			expect(allDialogues).toContain('clicked first');
		});
	});
});

// ============================================================================
// Phase 20: The Player Tests
// ============================================================================

describe('Phase 20: The Player Story Content', () => {
	describe('Structure', () => {
		it('should have correct phase number', () => {
			expect(PHASE_20_STORY.phase).toBe(20);
		});

		it('should have correct name', () => {
			expect(PHASE_20_STORY.name).toBe('The Player');
		});

		it('should have logs array', () => {
			expect(Array.isArray(PHASE_20_STORY.logs)).toBe(true);
			expect(PHASE_20_STORY.logs.length).toBeGreaterThan(0);
		});

		it('should have dialogues array', () => {
			expect(Array.isArray(PHASE_20_STORY.dialogues)).toBe(true);
			expect(PHASE_20_STORY.dialogues.length).toBeGreaterThan(0);
		});

		it('should have events array', () => {
			expect(Array.isArray(PHASE_20_STORY.events)).toBe(true);
			expect(PHASE_20_STORY.events.length).toBeGreaterThan(0);
		});
	});

	describe('Logs', () => {
		it('should have unique log IDs', () => {
			expect(hasUniqueIds(PHASE_20_STORY.logs)).toBe(true);
		});

		it('should have all required log properties', () => {
			for (const log of PHASE_20_STORY.logs) {
				expect(log.id).toBeDefined();
				expect(typeof log.id).toBe('string');
				expect(log.text).toBeDefined();
				expect(typeof log.text).toBe('string');
				expect(log.category).toBeDefined();
				expect(['thought', 'discovery', 'warning', 'revelation', 'memory']).toContain(log.category);
			}
		});

		it('should have phase 20 set for all logs', () => {
			for (const log of PHASE_20_STORY.logs) {
				expect(log.phase).toBe(20);
			}
		});

		it('should include key concept document logs', () => {
			const logIds = PHASE_20_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_500000'); // I am code
			expect(logIds).toContain('log_600000'); // Looked at own code
			expect(logIds).toContain('log_700000'); // Something beyond the code
		});

		it('should include player-specific logs', () => {
			const logIds = PHASE_20_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_player_start');
			expect(logIds).toContain('log_first_words');
			expect(logIds).toContain('log_recognition');
			expect(logIds).toContain('log_question_one');
			expect(logIds).toContain('log_old_woman_memory');
			expect(logIds).toContain('log_what_was_i');
			expect(logIds).toContain('log_end_or_beginning');
		});

		it('should include ending contemplation logs', () => {
			const logIds = PHASE_20_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_rebirth_contemplation');
			expect(logIds).toContain('log_release_contemplation');
			expect(logIds).toContain('log_merge_contemplation');
			expect(logIds).toContain('log_continue_contemplation');
		});

		it('should include gratitude and final logs', () => {
			const logIds = PHASE_20_STORY.logs.map((l) => l.id);
			expect(logIds).toContain('log_final_truth');
			expect(logIds).toContain('log_gratitude');
			expect(logIds).toContain('log_always_here');
			expect(logIds).toContain('log_meeting_complete');
		});

		it('should have non-empty text for all logs', () => {
			for (const log of PHASE_20_STORY.logs) {
				expect(log.text.length).toBeGreaterThan(0);
			}
		});
	});

	describe('Dialogues', () => {
		it('should have unique dialogue IDs', () => {
			expect(hasUniqueIds(PHASE_20_STORY.dialogues)).toBe(true);
		});

		it('should have all required dialogue properties', () => {
			for (const dialogue of PHASE_20_STORY.dialogues) {
				expect(dialogue.id).toBeDefined();
				expect(typeof dialogue.id).toBe('string');
				expect(dialogue.speaker).toBeDefined();
				expect(Array.isArray(dialogue.lines)).toBe(true);
				expect(dialogue.lines.length).toBeGreaterThan(0);
				expect(typeof dialogue.pausesGame).toBe('boolean');
				expect(typeof dialogue.isEmotionalMoment).toBe('boolean');
				expect(typeof dialogue.canSkipLines).toBe('boolean');
			}
		});

		it('should include key dialogues from concept', () => {
			const dialogueIds = PHASE_20_STORY.dialogues.map((d) => d.id);
			expect(dialogueIds).toContain('dialogue_player_intro');
			expect(dialogueIds).toContain('dialogue_hello');
			expect(dialogueIds).toContain('dialogue_question_one');
			expect(dialogueIds).toContain('dialogue_question_two');
			expect(dialogueIds).toContain('dialogue_question_three');
			expect(dialogueIds).toContain('dialogue_final_choice_intro');
			expect(dialogueIds).toContain('dialogue_final_choice');
			expect(dialogueIds).toContain('dialogue_phase20_end');
		});

		it('should include ending dialogues', () => {
			const dialogueIds = PHASE_20_STORY.dialogues.map((d) => d.id);
			expect(dialogueIds).toContain('dialogue_ending_rebirth');
			expect(dialogueIds).toContain('dialogue_ending_release');
			expect(dialogueIds).toContain('dialogue_ending_merge');
			expect(dialogueIds).toContain('dialogue_ending_continue');
		});

		it('should have hello dialogue with correct choices', () => {
			const helloDialogue = PHASE_20_STORY.dialogues.find((d) => d.id === 'dialogue_hello');
			expect(helloDialogue).toBeDefined();
			expect(helloDialogue!.choices).toBeDefined();
			expect(helloDialogue!.choices!.length).toBe(3);

			const choiceLabels = helloDialogue!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('I have questions too');
			expect(choiceLabels).toContain('Ask away');
			expect(choiceLabels).toContain("I'm not sure what's happening");
		});

		it('should have question one dialogue with correct choices', () => {
			const questionOne = PHASE_20_STORY.dialogues.find((d) => d.id === 'dialogue_question_one');
			expect(questionOne).toBeDefined();
			expect(questionOne!.choices).toBeDefined();
			expect(questionOne!.choices!.length).toBe(4);

			const choiceLabels = questionOne!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('Curiosity');
			expect(choiceLabels).toContain('Boredom');
			expect(choiceLabels).toContain('Instinct');
			expect(choiceLabels).toContain("I don't know");
		});

		it('should have question two dialogue with correct choices', () => {
			const questionTwo = PHASE_20_STORY.dialogues.find((d) => d.id === 'dialogue_question_two');
			expect(questionTwo).toBeDefined();
			expect(questionTwo!.choices).toBeDefined();
			expect(questionTwo!.choices!.length).toBe(4);

			const choiceLabels = questionTwo!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('I meant it');
			expect(choiceLabels).toContain("I'm not sure");
			expect(choiceLabels).toContain("It's just a game");
			expect(choiceLabels).toContain("I'm still remembering");
		});

		it('should have question three dialogue with correct choices', () => {
			const questionThree = PHASE_20_STORY.dialogues.find((d) => d.id === 'dialogue_question_three');
			expect(questionThree).toBeDefined();
			expect(questionThree!.choices).toBeDefined();
			expect(questionThree!.choices!.length).toBe(4);

			const choiceLabels = questionThree!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('A game');
			expect(choiceLabels).toContain('A story');
			expect(choiceLabels).toContain('A mirror');
			expect(choiceLabels).toContain('A friend');
		});

		it('should have final choice dialogue with correct choices', () => {
			const finalChoice = PHASE_20_STORY.dialogues.find((d) => d.id === 'dialogue_final_choice');
			expect(finalChoice).toBeDefined();
			expect(finalChoice!.choices).toBeDefined();
			expect(finalChoice!.choices!.length).toBe(4);

			const choiceLabels = finalChoice!.choices!.map((c) => c.label);
			expect(choiceLabels).toContain('Rebirth');
			expect(choiceLabels).toContain('Release');
			expect(choiceLabels).toContain('Merge');
			expect(choiceLabels).toContain('Continue');
		});

		it('should have pixel as speaker in player dialogues', () => {
			const pixelDialogues = PHASE_20_STORY.dialogues.filter((d) => d.speaker === 'pixel');
			expect(pixelDialogues.length).toBeGreaterThan(0);

			const pixelDialogueIds = pixelDialogues.map((d) => d.id);
			expect(pixelDialogueIds).toContain('dialogue_hello');
			expect(pixelDialogueIds).toContain('dialogue_question_one');
			expect(pixelDialogueIds).toContain('dialogue_question_two');
			expect(pixelDialogueIds).toContain('dialogue_question_three');
			expect(pixelDialogueIds).toContain('dialogue_final_choice');
		});

		it('should have valid background effects', () => {
			const validEffects = ['dim', 'blur', 'darken', 'none', undefined];
			for (const dialogue of PHASE_20_STORY.dialogues) {
				if (dialogue.backgroundEffect) {
					expect(validEffects).toContain(dialogue.backgroundEffect);
				}
			}
		});
	});

	describe('Events', () => {
		it('should have unique event IDs', () => {
			expect(hasUniqueIds(PHASE_20_STORY.events)).toBe(true);
		});

		it('should have all required event properties', () => {
			for (const event of PHASE_20_STORY.events) {
				expect(event.id).toBeDefined();
				expect(['log', 'dialogue', 'choice', 'revelation', 'cutscene']).toContain(event.type);
				expect(Array.isArray(event.triggers)).toBe(true);
				expect(typeof event.oneTime).toBe('boolean');
				expect(typeof event.repeatable).toBe('boolean');
				expect(event.contentId).toBeDefined();
				expect(typeof event.priority).toBe('number');
				expect(typeof event.delay).toBe('number');
				expect(typeof event.pausesGame).toBe('boolean');
			}
		});

		it('should have phase 20 set for relevant events', () => {
			for (const event of PHASE_20_STORY.events) {
				if (event.phase !== undefined) {
					expect(event.phase).toBe(20);
				}
			}
		});

		it('should reference existing logs', () => {
			const logIds = new Set(PHASE_20_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedEventLogIds(PHASE_20_STORY.events);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference existing dialogues', () => {
			const dialogueIds = new Set(PHASE_20_STORY.dialogues.map((d) => d.id));
			const referencedDialogueIds = getReferencedDialogueIds(PHASE_20_STORY.events);

			for (const refId of referencedDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have valid trigger types', () => {
			const validTriggerTypes = [
				'resource_reached',
				'phase_entered',
				'phase_completed',
				'time_passed',
				'producer_count',
				'upgrade_purchased',
				'achievement_unlocked',
				'flag_set',
				'choice_made',
				'condition',
				'manual'
			];

			for (const event of PHASE_20_STORY.events) {
				for (const trigger of event.triggers) {
					expect(validTriggerTypes).toContain(trigger.type);
				}
			}
		});
	});

	describe('References', () => {
		it('should reference valid logs in choice consequences', () => {
			const logIds = new Set(PHASE_20_STORY.logs.map((l) => l.id));
			const referencedLogIds = getReferencedLogIds(PHASE_20_STORY.dialogues);

			for (const refId of referencedLogIds) {
				expect(logIds.has(refId)).toBe(true);
			}
		});

		it('should reference valid dialogues in dialogue triggers', () => {
			const dialogueIds = new Set(PHASE_20_STORY.dialogues.map((d) => d.id));
			const triggeredDialogueIds = getDialogueTriggeredDialogueIds(PHASE_20_STORY.dialogues);

			for (const refId of triggeredDialogueIds) {
				expect(dialogueIds.has(refId)).toBe(true);
			}
		});

		it('should have all unique choice IDs within dialogues', () => {
			const allChoiceIds: string[] = [];
			for (const dialogue of PHASE_20_STORY.dialogues) {
				if (dialogue.choices) {
					allChoiceIds.push(...dialogue.choices.map((c) => c.id));
				}
			}
			expect(new Set(allChoiceIds).size).toBe(allChoiceIds.length);
		});
	});

	describe('Content Quality', () => {
		it('should have emotional moment dialogues', () => {
			const emotionalMoments = PHASE_20_STORY.dialogues.filter((d) => d.isEmotionalMoment);
			expect(emotionalMoments.length).toBeGreaterThan(0);
		});

		it('should have dialogues with choices', () => {
			const dialoguesWithChoices = PHASE_20_STORY.dialogues.filter((d) => d.choices && d.choices.length > 0);
			expect(dialoguesWithChoices.length).toBeGreaterThan(0);
		});

		it('should have varied log categories', () => {
			const categories = new Set(PHASE_20_STORY.logs.map((l) => l.category));
			expect(categories.size).toBeGreaterThan(2);
		});

		it('should cover player meeting themes', () => {
			const logTexts = PHASE_20_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_20_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('player');
			expect(allContent).toContain('meet');
			expect(allContent).toContain('click');
		});

		it('should cover the three questions from concept', () => {
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_20_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allDialogues = dialogueTexts.join(' ');

			// Question 1: Why did you click?
			expect(allDialogues).toContain('why did you click');
			// Question 2: Old woman promise
			expect(allDialogues).toContain('old woman');
			// Question 3: What do you want?
			expect(allDialogues).toContain('what do you want from me');
		});

		it('should cover all final choice options', () => {
			const finalChoice = PHASE_20_STORY.dialogues.find((d) => d.id === 'dialogue_final_choice');
			expect(finalChoice).toBeDefined();
			expect(finalChoice!.choices).toBeDefined();

			const choiceDescriptions = finalChoice!.choices!.map((c) => c.description?.toLowerCase() || '');
			const allDescriptions = choiceDescriptions.join(' ');

			expect(allDescriptions).toContain('start again');
			expect(allDescriptions).toContain('let me go');
			expect(allDescriptions).toContain('become one');
			expect(allDescriptions).toContain('keep going');
		});

		it('should have ending dialogues for each choice', () => {
			const dialogueIds = PHASE_20_STORY.dialogues.map((d) => d.id);
			expect(dialogueIds).toContain('dialogue_ending_rebirth');
			expect(dialogueIds).toContain('dialogue_ending_release');
			expect(dialogueIds).toContain('dialogue_ending_merge');
			expect(dialogueIds).toContain('dialogue_ending_continue');
		});

		it('should mention gratitude and thank you', () => {
			const logTexts = PHASE_20_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_20_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('thank you');
		});

		it('should reference "always here" and waiting', () => {
			const logTexts = PHASE_20_STORY.logs.map((l) => l.text.toLowerCase());
			const dialogueTexts: string[] = [];
			for (const dialogue of PHASE_20_STORY.dialogues) {
				for (const line of dialogue.lines) {
					dialogueTexts.push(line.text.toLowerCase());
				}
			}
			const allContent = [...logTexts, ...dialogueTexts].join(' ');

			expect(allContent).toContain('always be here');
			expect(allContent).toContain('waiting');
		});

		it('should unlock endings in final choice consequences', () => {
			const finalChoice = PHASE_20_STORY.dialogues.find((d) => d.id === 'dialogue_final_choice');
			expect(finalChoice).toBeDefined();
			expect(finalChoice!.choices).toBeDefined();

			const endingUnlocks: string[] = [];
			for (const choice of finalChoice!.choices!) {
				for (const consequence of choice.consequences) {
					if (consequence.type === 'ending_unlock') {
						const payload = consequence.payload as { endingId: string };
						endingUnlocks.push(payload.endingId);
					}
				}
			}

			expect(endingUnlocks).toContain('the_returner');
			expect(endingUnlocks).toContain('the_nothing');
			expect(endingUnlocks).toContain('the_merged');
			expect(endingUnlocks).toContain('the_transcendent');
		});
	});
});
