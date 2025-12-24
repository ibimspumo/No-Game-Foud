<script lang="ts">
	/**
	 * @fileoverview Phase 1: The Pixel - Initial click-based gameplay.
	 * The most minimal phase with just a single pixel to click.
	 *
	 * @module components/phases/Phase01Pixel
	 */

	import { getGameContext, formatNumber, ResourceId } from '$lib/engine';
	import { Pulse } from '../effects';
	import Counter from '../core/Counter.svelte';

	interface Props {
		/** Additional CSS classes */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const game = getGameContext();

	// Reactive game state
	let pixels = $derived(game.resources.getAmount(ResourceId.PIXELS));
	let pixelRate = $derived(game.resources.getProductionRate(ResourceId.PIXELS));

	// Animation state
	let isClicking = $state(false);
	let clickCount = $state(0);

	/**
	 * Handle pixel click.
	 */
	function handleClick(): void {
		game.click(ResourceId.PIXELS);
		clickCount++;

		// Trigger click animation
		isClicking = true;
		setTimeout(() => {
			isClicking = false;
		}, 100);
	}

	/**
	 * Handle keyboard interaction.
	 */
	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		}
	}

	/** Pixel size grows slightly with more pixels */
	const pixelScale = $derived(() => {
		const count = Number(pixels);
		if (count < 10) return 1;
		if (count < 50) return 1.1;
		if (count < 100) return 1.2;
		return 1.3;
	});

	/** Pixel color changes at milestones */
	const pixelColor = $derived(() => {
		const count = Number(pixels);
		if (count < 10) return '#ffffff';
		if (count < 50) return '#e0e0e0';
		if (count < 100) return '#c0c0c0';
		return '#ffffff';
	});
</script>

<div class="phase-pixel {className}">
	<div class="phase-content">
		<!-- The Pixel -->
		<div class="pixel-container">
			<Pulse active={Number(pixelRate) > 0} intensity={3}>
				<button
					class="the-pixel"
					class:clicking={isClicking}
					style="
						--pixel-scale: {pixelScale()};
						--pixel-color: {pixelColor()};
					"
					onclick={handleClick}
					onkeydown={handleKeydown}
					aria-label="Click the pixel to generate pixels"
				>
					<span class="pixel-icon">■</span>
				</button>
			</Pulse>
		</div>

		<!-- Counter -->
		<div class="pixel-counter">
			<Counter value={pixels} size="xl" />
			{#if Number(pixelRate) > 0}
				<span class="pixel-rate">+{formatNumber(pixelRate)}/s</span>
			{/if}
		</div>

		<!-- Minimal instruction (fades after first click) -->
		{#if clickCount === 0}
			<p class="instruction fade-in">Click.</p>
		{:else if clickCount < 5}
			<p class="instruction fade-in">Again.</p>
		{:else if clickCount < 20}
			<p class="instruction fade-in">Keep going.</p>
		{/if}
	</div>
</div>

<style>
	.phase-pixel {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100%;
		padding: var(--spacing-8);
	}

	.phase-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-8);
	}

	.pixel-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.the-pixel {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: var(--spacing-8);
		transition:
			transform var(--duration-fast) var(--easing-out),
			filter var(--duration-fast);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.the-pixel:hover {
		transform: scale(calc(var(--pixel-scale) * 1.05));
	}

	.the-pixel:active,
	.the-pixel.clicking {
		transform: scale(calc(var(--pixel-scale) * 0.95));
	}

	.pixel-icon {
		font-size: calc(4rem * var(--pixel-scale));
		color: var(--pixel-color);
		display: block;
		text-shadow:
			0 0 10px rgba(255, 255, 255, 0.5),
			0 0 20px rgba(255, 255, 255, 0.3);
		transition:
			font-size var(--duration-slow),
			color var(--duration-slow),
			text-shadow var(--duration-slow);
	}

	.the-pixel:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 4px;
		border-radius: var(--radius-sm);
	}

	.pixel-counter {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-1);
	}

	.pixel-rate {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.instruction {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-dim);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wider);
		animation: fade-in-up 1s var(--easing-out);
	}

	.fade-in {
		animation: fade-in-up 0.5s var(--easing-out);
	}

	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Responsive */
	@media (max-width: 640px) {
		.pixel-icon {
			font-size: calc(3rem * var(--pixel-scale));
		}
	}
</style>
