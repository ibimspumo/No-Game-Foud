<script lang="ts">
	/**
	 * @fileoverview PhaseView component - handles dynamic phase rendering.
	 * Switches between phase components with transitions based on current phase.
	 *
	 * @module components/phases/PhaseView
	 */

	import { fly, fade } from 'svelte/transition';
	import { getGameContext } from '$lib/engine';
	import Phase01Pixel from './Phase01Pixel.svelte';
	import Phase02Canvas from './Phase02Canvas.svelte';
	import { Starfield, Glitch } from '../effects';

	interface Props {
		/** Additional CSS classes */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const game = getGameContext();

	// Current phase
	let currentPhase = $derived(game.phases.currentPhase);
	let visualMode = $derived(game.phases.visualMode);

	// Transition state
	let isTransitioning = $derived(game.phases.isTransitioning);

	/**
	 * Map phase numbers to components.
	 * Later phases will be added as they're implemented.
	 */
	const phaseComponents: Record<number, typeof Phase01Pixel> = {
		1: Phase01Pixel,
		2: Phase02Canvas
		// 3: Phase03Gallery, etc.
	};

	/** Get the component for the current phase */
	const CurrentPhaseComponent = $derived(phaseComponents[currentPhase] ?? Phase01Pixel);

	/** Whether to show starfield background (later phases) */
	const showStarfield = $derived(currentPhase >= 9);

	/** Whether to show glitch effects (meta phases) */
	const showGlitch = $derived(currentPhase >= 4 && currentPhase <= 5);
</script>

<div
	class="phase-view {className}"
	class:pixel-mode={visualMode === 'pixel'}
	class:abstract-mode={visualMode === 'abstract'}
	class:transitioning={isTransitioning}
>
	<!-- Background effects -->
	{#if showStarfield}
		<Starfield count={150} layers={4} speed={0.3} animated={true} />
	{/if}

	<!-- Phase content with transitions -->
	{#key currentPhase}
		<div
			class="phase-content-wrapper"
			in:fly={{ y: 20, duration: 400, delay: 100 }}
			out:fade={{ duration: 200 }}
		>
			{#if showGlitch}
				<Glitch active={true} intensity={3} frequency={5000}>
					<CurrentPhaseComponent />
				</Glitch>
			{:else}
				<CurrentPhaseComponent />
			{/if}
		</div>
	{/key}

	<!-- Transition overlay -->
	{#if isTransitioning}
		<div class="transition-overlay" transition:fade={{ duration: 300 }}>
			<div class="transition-content">
				<span class="transition-text">Transitioning...</span>
			</div>
		</div>
	{/if}
</div>

<style>
	.phase-view {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.phase-content-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 1;
	}

	/* Visual mode styling - placeholder for future theming */
	.pixel-mode {
		/* Pixel mode styles will be added */
		color: inherit;
	}

	.abstract-mode {
		/* Abstract mode - darker, more minimal */
		background-color: #050505;
	}

	/* Transition overlay */
	.transition-overlay {
		position: absolute;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	.transition-content {
		text-align: center;
	}

	.transition-text {
		font-size: var(--font-size-lg);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wider);
		animation: pulse 2s var(--easing-in-out) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
	}
</style>
