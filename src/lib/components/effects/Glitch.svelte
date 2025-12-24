<script lang="ts">
	/**
	 * @fileoverview Glitch effect component for visual distortion.
	 * Creates a glitchy, digital corruption effect for fourth-wall breaking moments.
	 *
	 * @module components/effects/Glitch
	 */

	import type { Snippet } from 'svelte';

	interface Props {
		/** Whether the glitch effect is active */
		active?: boolean;
		/** Glitch intensity (1-10) */
		intensity?: number;
		/** How often glitches occur (ms between bursts) */
		frequency?: number;
		/** Duration of each glitch burst (ms) */
		duration?: number;
		/** Whether to include color channel separation */
		chromatic?: boolean;
		/** Additional CSS classes */
		class?: string;
		/** Content to wrap */
		children: Snippet;
	}

	let {
		active = false,
		intensity = 5,
		frequency = 3000,
		duration = 200,
		chromatic = true,
		class: className = '',
		children
	}: Props = $props();

	/** Whether currently in a glitch burst */
	let glitching = $state(false);

	/** Glitch offset values */
	let offsetX = $state(0);
	let offsetY = $state(0);
	let skewX = $state(0);

	/**
	 * Trigger a glitch burst.
	 */
	function triggerGlitch(): void {
		if (!active) return;

		glitching = true;

		// Random glitch values based on intensity
		const maxOffset = intensity * 2;
		offsetX = (Math.random() - 0.5) * maxOffset;
		offsetY = (Math.random() - 0.5) * maxOffset;
		skewX = (Math.random() - 0.5) * intensity;

		// End glitch after duration
		setTimeout(() => {
			glitching = false;
			offsetX = 0;
			offsetY = 0;
			skewX = 0;
		}, duration);
	}

	// Set up glitch interval
	$effect(() => {
		if (!active) {
			glitching = false;
			return;
		}

		// Initial glitch after short delay
		const initialTimeout = setTimeout(() => triggerGlitch(), 500);

		// Periodic glitches
		const interval = setInterval(() => {
			// Add some randomness to timing
			const jitter = (Math.random() - 0.5) * frequency * 0.5;
			setTimeout(() => triggerGlitch(), Math.max(0, jitter));
		}, frequency);

		return () => {
			clearTimeout(initialTimeout);
			clearInterval(interval);
		};
	});
</script>

<div
	class="glitch-wrapper {className}"
	class:active
	class:glitching
	class:chromatic
	style="
		--offset-x: {offsetX}px;
		--offset-y: {offsetY}px;
		--skew-x: {skewX}deg;
		--intensity: {intensity};
	"
>
	<div class="glitch-content">
		{@render children()}
	</div>

	{#if chromatic && glitching}
		<div class="glitch-layer red" aria-hidden="true">
			{@render children()}
		</div>
		<div class="glitch-layer blue" aria-hidden="true">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.glitch-wrapper {
		position: relative;
		display: inline-block;
	}

	.glitch-content {
		position: relative;
		z-index: 1;
		transition: transform 0.05s step-end;
	}

	.glitching .glitch-content {
		transform: translate(var(--offset-x), var(--offset-y)) skewX(var(--skew-x));
	}

	.glitch-layer {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}

	.glitch-layer.red {
		transform: translate(calc(var(--offset-x) * -0.5), calc(var(--offset-y) * 0.5));
		mix-blend-mode: screen;
		opacity: 0.8;
		filter: hue-rotate(-60deg) saturate(2);
	}

	.glitch-layer.blue {
		transform: translate(calc(var(--offset-x) * 0.5), calc(var(--offset-y) * -0.5));
		mix-blend-mode: screen;
		opacity: 0.8;
		filter: hue-rotate(60deg) saturate(2);
	}

	/* Scanline effect during glitch */
	.glitching::before {
		content: '';
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 2px,
			rgba(0, 0, 0, 0.1) 2px,
			rgba(0, 0, 0, 0.1) 4px
		);
		pointer-events: none;
		z-index: 10;
		animation: scanline 0.1s step-end infinite;
	}

	@keyframes scanline {
		0% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(2px);
		}
	}
</style>
