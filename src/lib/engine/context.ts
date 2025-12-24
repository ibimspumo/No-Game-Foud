/**
 * @fileoverview Svelte context utilities for the game engine.
 * Provides type-safe context helpers for accessing the Game instance.
 *
 * The Game instance is created once in the root layout and made available
 * to all components through Svelte's context API.
 *
 * @module engine/context
 */

import { getContext, setContext } from 'svelte';
import type { Game } from './core/Game.svelte';

/**
 * Symbol key for the game context.
 * Using a Symbol ensures no naming collisions.
 */
export const GAME_CONTEXT_KEY = Symbol('pixel_singularity_game');

/**
 * Set the game instance in the Svelte context.
 * Should be called once in the root layout.
 *
 * @param game - The game instance to set
 *
 * @example
 * ```svelte
 * <script>
 *   import { Game } from '$lib/engine/core/Game.svelte';
 *   import { setGameContext } from '$lib/engine/context';
 *
 *   const game = new Game();
 *   setGameContext(game);
 *   game.init();
 * </script>
 * ```
 */
export function setGameContext(game: Game): void {
	setContext(GAME_CONTEXT_KEY, game);
}

/**
 * Get the game instance from the Svelte context.
 * Must be called from within a component's setup phase.
 *
 * @returns The game instance
 * @throws Error if called outside of a component or if context not set
 *
 * @example
 * ```svelte
 * <script>
 *   import { getGameContext } from '$lib/engine/context';
 *
 *   const game = getGameContext();
 *
 *   // Access reactive state
 *   const pixels = $derived(game.resources.getAmount('pixels'));
 *
 *   function handleClick() {
 *     game.resources.click('pixels');
 *   }
 * </script>
 *
 * <button onclick={handleClick}>
 *   Pixels: {pixels.toString()}
 * </button>
 * ```
 */
export function getGameContext(): Game {
	const game = getContext<Game | undefined>(GAME_CONTEXT_KEY);

	if (!game) {
		throw new Error(
			'Game context not found. Make sure setGameContext() is called in a parent component.'
		);
	}

	return game;
}

/**
 * Check if the game context is available.
 * Useful for conditional rendering or optional features.
 *
 * @returns Whether the game context exists
 */
export function hasGameContext(): boolean {
	try {
		const game = getContext<Game | undefined>(GAME_CONTEXT_KEY);
		return game !== undefined;
	} catch {
		return false;
	}
}

/**
 * Get the game instance or null if not available.
 * Useful when game context is optional.
 *
 * @returns The game instance or null
 */
export function tryGetGameContext(): Game | null {
	try {
		const game = getContext<Game | undefined>(GAME_CONTEXT_KEY);
		return game ?? null;
	} catch {
		return null;
	}
}
