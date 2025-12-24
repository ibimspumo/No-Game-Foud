<script lang="ts">
	import { getGameContext, formatNumber, ResourceId } from '$lib/engine';

	const game = getGameContext();

	// Reactive values from the game engine
	let pixels = $derived(game.resources.getAmount(ResourceId.PIXELS));
	let pixelRate = $derived(game.resources.getProductionRate(ResourceId.PIXELS));
	let runTime = $derived(game.runTime);
	let tickCount = $derived(game.tickCount);
	let status = $derived(game.status);

	/**
	 * Handle pixel click
	 */
	function handleClick() {
		game.click(ResourceId.PIXELS);
	}

	/**
	 * Add some production rate (for testing)
	 */
	function addProduction() {
		const currentRate = game.resources.getProductionRate(ResourceId.PIXELS);
		game.resources.setProductionRate(ResourceId.PIXELS, currentRate.add(1));
	}

	/**
	 * Toggle pause
	 */
	function togglePause() {
		if (game.isPaused) {
			game.resume();
		} else {
			game.pause();
		}
	}
</script>

<main>
	<header>
		<h1>NO GAME FOUND</h1>
		<p class="subtitle">Phase 1: The Pixel</p>
	</header>

	<section class="game-area">
		<div class="pixel-display">
			<button class="pixel" onclick={handleClick} aria-label="Click to generate pixels">
				<span class="pixel-icon">■</span>
			</button>
		</div>

		<div class="stats">
			<div class="stat">
				<span class="label">Pixels</span>
				<span class="value">{formatNumber(pixels)}</span>
			</div>
			<div class="stat">
				<span class="label">Rate</span>
				<span class="value">{formatNumber(pixelRate)}/s</span>
			</div>
		</div>
	</section>

	<section class="controls">
		<button onclick={addProduction}>+1 Pixel/s</button>
		<button onclick={togglePause}>
			{game.isPaused ? 'Resume' : 'Pause'}
		</button>
	</section>

	<footer class="debug">
		<span>Status: {status}</span>
		<span>Run Time: {runTime.toFixed(1)}s</span>
		<span>Ticks: {tickCount}</span>
	</footer>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem;
		gap: 2rem;
	}

	header {
		text-align: center;
	}

	h1 {
		font-size: 2rem;
		letter-spacing: 0.5rem;
		margin-bottom: 0.5rem;
		color: #888;
	}

	.subtitle {
		color: #666;
		font-size: 0.875rem;
	}

	.game-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}

	.pixel-display {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pixel {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 2rem;
		transition: transform 0.1s ease;
	}

	.pixel:hover {
		transform: scale(1.1);
	}

	.pixel:active {
		transform: scale(0.95);
	}

	.pixel-icon {
		font-size: 4rem;
		color: #fff;
		display: block;
		text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
	}

	.stats {
		display: flex;
		gap: 2rem;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.label {
		font-size: 0.75rem;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 0.1rem;
	}

	.value {
		font-size: 1.5rem;
		color: #fff;
	}

	.controls {
		display: flex;
		gap: 1rem;
	}

	.controls button {
		background: #222;
		color: #fff;
		border: 1px solid #444;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-family: inherit;
		font-size: 0.875rem;
		transition: background-color 0.2s ease;
	}

	.controls button:hover {
		background: #333;
	}

	.debug {
		position: fixed;
		bottom: 1rem;
		left: 1rem;
		font-size: 0.75rem;
		color: #444;
		display: flex;
		gap: 1rem;
	}
</style>
