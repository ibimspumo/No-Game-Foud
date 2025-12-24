<script lang="ts">
	/**
	 * @fileoverview Phase 2: The Canvas - First grid-based gameplay.
	 * The pixel becomes an 8x8 canvas that fills progressively.
	 *
	 * @module components/phases/Phase02Canvas
	 */

	import { getGameContext, formatNumber, ResourceId, D, ONE } from '$lib/engine';
	import PixelGrid from '../core/PixelGrid.svelte';
	import Counter from '../core/Counter.svelte';
	import ProgressBar from '../core/ProgressBar.svelte';

	interface Props {
		/** Additional CSS classes */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const game = getGameContext();

	// Reactive game state
	let pixels = $derived(game.resources.getAmount(ResourceId.PIXELS));
	let pixelRate = $derived(game.resources.getProductionRate(ResourceId.PIXELS));
	let canvasCount = $derived(game.resources.getAmount(ResourceId.CANVAS));

	// Canvas configuration
	const CANVAS_SIZE = 8;
	const PIXELS_PER_CELL = 10; // Pixels needed per cell
	const TOTAL_CELLS = CANVAS_SIZE * CANVAS_SIZE;
	const TOTAL_PIXELS_FOR_CANVAS = TOTAL_CELLS * PIXELS_PER_CELL;

	/** Track if we've already awarded the canvas */
	let canvasAwarded = $state(false);

	/** Calculate canvas fill percentage */
	const fillPercentage = $derived(() => {
		const count = Number(pixels);
		return Math.min(1, count / TOTAL_PIXELS_FOR_CANVAS);
	});

	/** Number of filled cells */
	const filledCells = $derived(() => {
		return Math.floor(fillPercentage() * TOTAL_CELLS);
	});

	/** Canvas is complete */
	const isComplete = $derived(fillPercentage() >= 1);

	// Award canvas resource when complete
	$effect(() => {
		if (isComplete && !canvasAwarded && D(canvasCount).lt(1)) {
			game.resources.add(ResourceId.CANVAS, ONE);
			canvasAwarded = true;
		}
	});

	/**
	 * Handle cell click - adds pixels.
	 */
	function handleCellClick(x: number, y: number): void {
		game.click(ResourceId.PIXELS);
	}
</script>

<div class="phase-canvas {className}">
	<div class="phase-content">
		<!-- Canvas Display -->
		<div class="canvas-container">
			<PixelGrid
				width={CANVAS_SIZE}
				height={CANVAS_SIZE}
				fillPercentage={fillPercentage()}
				interactive={true}
				onCellClick={handleCellClick}
				cellSize={40}
				gap={2}
				showGridLines={true}
			/>
		</div>

		<!-- Stats -->
		<div class="canvas-stats">
			<Counter value={pixels} label="Pixels" size="lg" />

			<div class="canvas-progress">
				<ProgressBar
					value={fillPercentage()}
					max={1}
					label="Canvas"
					showPercentage
					size="md"
					animated
					pulseNearComplete
				/>
			</div>

			{#if Number(pixelRate) > 0}
				<span class="pixel-rate">+{formatNumber(pixelRate)}/s</span>
			{/if}
		</div>

		<!-- Status text -->
		<div class="canvas-status">
			{#if isComplete}
				<p class="status-complete">Canvas complete. Something new awaits...</p>
			{:else}
				<p class="status-progress">
					{filledCells()} / {TOTAL_CELLS} cells
				</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.phase-canvas {
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
		gap: var(--spacing-6);
	}

	.canvas-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.canvas-stats {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-3);
		width: 100%;
		max-width: 300px;
	}

	.canvas-progress {
		width: 100%;
	}

	.pixel-rate {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.canvas-status {
		text-align: center;
	}

	.status-progress {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-dim);
	}

	.status-complete {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--color-success);
		animation: pulse 2s var(--easing-in-out) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	/* Responsive */
	@media (max-width: 640px) {
		.phase-content {
			gap: var(--spacing-4);
		}
	}
</style>
