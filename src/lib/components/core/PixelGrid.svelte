<script lang="ts">
	/**
	 * @fileoverview PixelGrid component for displaying an interactive pixel canvas.
	 * Core visual element for Phases 1-10 (Pixel Mode).
	 *
	 * @module components/core/PixelGrid
	 */

	interface Pixel {
		x: number;
		y: number;
		color?: string;
		active?: boolean;
		intensity?: number;
	}

	interface Props {
		/** Grid width in cells */
		width?: number;
		/** Grid height in cells */
		height?: number;
		/** Array of active pixels */
		pixels?: Pixel[];
		/** Pixel fill percentage (0-1) for automatic fill */
		fillPercentage?: number;
		/** Whether the grid is interactive */
		interactive?: boolean;
		/** Callback when a cell is clicked */
		onCellClick?: (x: number, y: number) => void;
		/** Cell size in pixels (CSS) */
		cellSize?: number;
		/** Gap between cells in pixels */
		gap?: number;
		/** Whether to show grid lines */
		showGridLines?: boolean;
		/** Default color for filled pixels */
		defaultColor?: string;
		/** Whether to animate fills */
		animated?: boolean;
		/** Additional CSS classes */
		class?: string;
	}

	let {
		width = 8,
		height = 8,
		pixels = [],
		fillPercentage = 0,
		interactive = true,
		onCellClick,
		cellSize = 32,
		gap = 1,
		showGridLines = true,
		defaultColor = '#ffffff',
		animated = true,
		class: className = ''
	}: Props = $props();

	/** Create a map for quick pixel lookup */
	const pixelMap = $derived(() => {
		const map = new Map<string, Pixel>();
		for (const pixel of pixels) {
			map.set(`${pixel.x},${pixel.y}`, pixel);
		}
		return map;
	});

	/** Calculate auto-filled cells based on fillPercentage */
	const autoFilledCells = $derived(() => {
		if (fillPercentage <= 0) return new Set<string>();

		const totalCells = width * height;
		const filledCount = Math.floor(totalCells * fillPercentage);
		const filled = new Set<string>();

		// Fill from top-left to bottom-right
		let count = 0;
		for (let y = 0; y < height && count < filledCount; y++) {
			for (let x = 0; x < width && count < filledCount; x++) {
				filled.add(`${x},${y}`);
				count++;
			}
		}

		return filled;
	});

	/**
	 * Check if a cell is active (filled).
	 */
	function isCellActive(x: number, y: number): boolean {
		const key = `${x},${y}`;
		if (pixelMap().has(key)) {
			return pixelMap().get(key)?.active !== false;
		}
		return autoFilledCells().has(key);
	}

	/**
	 * Get the color for a cell.
	 */
	function getCellColor(x: number, y: number): string {
		const key = `${x},${y}`;
		const pixel = pixelMap().get(key);
		if (pixel?.color) {
			return pixel.color;
		}
		return defaultColor;
	}

	/**
	 * Get the intensity for a cell (opacity multiplier).
	 */
	function getCellIntensity(x: number, y: number): number {
		const key = `${x},${y}`;
		const pixel = pixelMap().get(key);
		return pixel?.intensity ?? 1;
	}

	/**
	 * Handle cell click.
	 */
	function handleCellClick(x: number, y: number): void {
		if (interactive && onCellClick) {
			onCellClick(x, y);
		}
	}

	/**
	 * Handle keyboard navigation.
	 */
	function handleKeydown(event: KeyboardEvent, x: number, y: number): void {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleCellClick(x, y);
		}
	}

	/** Generate grid cells */
	const cells = $derived(() => {
		const result: Array<{ x: number; y: number; key: string }> = [];
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				result.push({ x, y, key: `${x},${y}` });
			}
		}
		return result;
	});
</script>

<div
	class="pixel-grid {className}"
	class:interactive
	class:animated
	class:show-grid-lines={showGridLines}
	style="
		--grid-width: {width};
		--grid-height: {height};
		--cell-size: {cellSize}px;
		--gap: {gap}px;
	"
	role="grid"
	aria-label="Pixel grid"
>
	{#each cells() as { x, y, key } (key)}
		{@const active = isCellActive(x, y)}
		{@const color = getCellColor(x, y)}
		{@const intensity = getCellIntensity(x, y)}
		<div
			class="pixel-cell"
			class:active
			style="--cell-color: {color}; --cell-intensity: {intensity}"
			role="gridcell"
			tabindex={interactive ? 0 : -1}
			aria-label="Cell {x}, {y}{active ? ' (filled)' : ''}"
			onclick={() => handleCellClick(x, y)}
			onkeydown={(e) => handleKeydown(e, x, y)}
		>
			{#if active}
				<div class="pixel-fill"></div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.pixel-grid {
		display: grid;
		grid-template-columns: repeat(var(--grid-width), var(--cell-size));
		grid-template-rows: repeat(var(--grid-height), var(--cell-size));
		gap: var(--gap);
		background-color: var(--color-bg-secondary);
		padding: var(--gap);
		border-radius: var(--radius-md);
	}

	.pixel-cell {
		position: relative;
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.show-grid-lines .pixel-cell {
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.interactive .pixel-cell {
		cursor: pointer;
		transition: background-color var(--duration-fast);
	}

	.interactive .pixel-cell:hover {
		background-color: var(--color-bg-elevated);
	}

	.interactive .pixel-cell:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: -2px;
	}

	.pixel-fill {
		position: absolute;
		inset: 0;
		background-color: var(--cell-color);
		opacity: var(--cell-intensity);
	}

	.animated .pixel-fill {
		animation: pixel-appear var(--duration-fast) var(--easing-out);
	}

	.pixel-cell.active {
		box-shadow: 0 0 4px rgba(255, 255, 255, 0.2);
	}

	@keyframes pixel-appear {
		from {
			opacity: 0;
			transform: scale(0.5);
		}
		to {
			opacity: var(--cell-intensity);
			transform: scale(1);
		}
	}

	/* Responsive sizing */
	@media (max-width: 640px) {
		.pixel-grid {
			--cell-size: max(calc(var(--cell-size) * 0.75), 20px);
		}
	}
</style>
