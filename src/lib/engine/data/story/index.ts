/**
 * @fileoverview Story data index with lazy loading.
 * Loads story content per phase on demand to reduce initial bundle size.
 *
 * Usage:
 * ```typescript
 * // Load all content for a phase
 * const phase2Story = await loadPhaseStory(2);
 *
 * // Or register all content for current + next phase
 * await registerStoryForPhases(narrativeManager, [1, 2]);
 * ```
 *
 * @module engine/data/story
 */

import type { LogDefinition, Dialogue, StoryEvent } from '../../models/narrative';
import type { NarrativeManager } from '../../systems/NarrativeManager.svelte';

// ============================================================================
// Types
// ============================================================================

/**
 * Story data for a single phase.
 */
export interface PhaseStoryData {
	phase: number;
	name: string;
	logs: LogDefinition[];
	dialogues: Dialogue[];
	events: StoryEvent[];
}

/**
 * Cache for loaded phase story data.
 */
const storyCache: Map<number, PhaseStoryData> = new Map();

// ============================================================================
// Lazy Loading Functions
// ============================================================================

/**
 * Load story data for a specific phase.
 * Uses dynamic imports for code splitting.
 *
 * @param phase - Phase number (1-20)
 * @returns Promise resolving to phase story data
 */
export async function loadPhaseStory(phase: number): Promise<PhaseStoryData | null> {
	// Check cache first
	if (storyCache.has(phase)) {
		return storyCache.get(phase)!;
	}

	try {
		// Dynamic import based on phase number
		const padded = String(phase).padStart(2, '0');
		const module = await import(`./phases/phase-${padded}.story.ts`);
		const data = module.default as PhaseStoryData;

		// Cache for future use
		storyCache.set(phase, data);

		return data;
	} catch (error) {
		console.warn(`[StoryLoader] No story data for phase ${phase}:`, error);
		return null;
	}
}

/**
 * Preload story data for multiple phases.
 * Useful for preloading current phase + next phase.
 *
 * @param phases - Array of phase numbers to preload
 * @returns Promise resolving when all phases are loaded
 */
export async function preloadPhaseStories(phases: number[]): Promise<void> {
	await Promise.all(phases.map((phase) => loadPhaseStory(phase)));
}

/**
 * Register story content for phases with a NarrativeManager.
 *
 * @param manager - NarrativeManager to register content with
 * @param phases - Phase numbers to load and register
 */
export async function registerStoryForPhases(
	manager: NarrativeManager,
	phases: number[]
): Promise<void> {
	for (const phase of phases) {
		const data = await loadPhaseStory(phase);
		if (data) {
			manager.registerLogs(data.logs);
			manager.registerDialogues(data.dialogues);
			manager.registerEvents(data.events);
		}
	}
}

/**
 * Get cached story data for a phase (synchronous, only if already loaded).
 *
 * @param phase - Phase number
 * @returns Cached story data or undefined
 */
export function getCachedPhaseStory(phase: number): PhaseStoryData | undefined {
	return storyCache.get(phase);
}

/**
 * Check if story data for a phase is cached.
 *
 * @param phase - Phase number
 */
export function isPhaseStoryCached(phase: number): boolean {
	return storyCache.has(phase);
}

/**
 * Clear the story cache (useful for testing or hard reset).
 */
export function clearStoryCache(): void {
	storyCache.clear();
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get all logs across all cached phases.
 */
export function getAllCachedLogs(): LogDefinition[] {
	const logs: LogDefinition[] = [];
	for (const data of storyCache.values()) {
		logs.push(...data.logs);
	}
	return logs;
}

/**
 * Get all dialogues across all cached phases.
 */
export function getAllCachedDialogues(): Dialogue[] {
	const dialogues: Dialogue[] = [];
	for (const data of storyCache.values()) {
		dialogues.push(...data.dialogues);
	}
	return dialogues;
}

/**
 * Get all events across all cached phases.
 */
export function getAllCachedEvents(): StoryEvent[] {
	const events: StoryEvent[] = [];
	for (const data of storyCache.values()) {
		events.push(...data.events);
	}
	return events;
}

// ============================================================================
// Re-exports for convenience
// ============================================================================

export type { LogDefinition, Dialogue, StoryEvent } from '../../models/narrative';
