<script lang="ts">
	/**
	 * @fileoverview Header component displaying game status and resources.
	 * Shows phase info, primary resources, and quick actions.
	 *
	 * @module components/ui/Header
	 */

	import { getGameContext, formatNumber, ResourceId } from '$lib/engine';
	import Counter from '../core/Counter.svelte';
	import ProgressBar from '../core/ProgressBar.svelte';

	interface Props {
		/** Whether to show the phase progress bar */
		showProgress?: boolean;
		/** Whether header is compact (mobile) */
		compact?: boolean;
		/** Additional CSS classes */
		class?: string;
	}

	let { showProgress = true, compact = false, class: className = '' }: Props = $props();

	const game = getGameContext();

	// Reactive values from game engine
	let currentPhase = $derived(game.phases.currentPhase);
	let phaseName = $derived(game.phases.currentDefinition?.name ?? 'Unknown');
	let phaseSubtitle = $derived(game.phases.currentDefinition?.subtitle ?? '');
	let phaseProgress = $derived(game.phases.transitionProgress);
	let canAdvance = $derived(game.phases.canAdvance);

	// Primary resources
	let pixels = $derived(game.resources.getAmount(ResourceId.PIXELS));
	let pixelRate = $derived(game.resources.getProductionRate(ResourceId.PIXELS));

	// Game status
	let isPaused = $derived(game.isPaused);
	let isRunning = $derived(game.isRunning);
</script>

<header class="game-header {className}" class:compact>
	<div class="header-left">
		<div class="phase-info">
			<span class="phase-number">Phase {currentPhase}</span>
			<span class="phase-name">{phaseName}</span>
		</div>
		{#if !compact && phaseSubtitle}
			<p class="phase-subtitle">{phaseSubtitle}</p>
		{/if}
	</div>

	<div class="header-center">
		<div class="resource-display">
			<Counter value={pixels} label="Pixels" size={compact ? 'md' : 'lg'} />
			{#if !compact}
				<span class="resource-rate">+{formatNumber(pixelRate)}/s</span>
			{/if}
		</div>
	</div>

	<div class="header-right">
		{#if showProgress && !canAdvance}
			<div class="progress-wrapper">
				<ProgressBar
					value={phaseProgress}
					max={1}
					size="sm"
					showPercentage
					animated
					pulseNearComplete
				/>
			</div>
		{/if}

		{#if canAdvance}
			<button class="advance-btn" onclick={() => game.advancePhase()}>
				Next Phase
			</button>
		{/if}

		<div class="status-indicator" class:paused={isPaused} class:running={isRunning}>
			{#if isPaused}
				<span class="status-icon">⏸</span>
			{:else if isRunning}
				<span class="status-icon pulse">●</span>
			{/if}
		</div>
	</div>
</header>

<style>
	.game-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-4);
		background-color: var(--color-bg-secondary);
		border-bottom: var(--border-width) solid var(--color-border-color);
		min-height: var(--header-height);
		gap: var(--spacing-4);
	}

	.compact {
		padding: var(--spacing-2) var(--spacing-3);
		min-height: 48px;
	}

	.header-left {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
		min-width: 0;
	}

	.phase-info {
		display: flex;
		align-items: baseline;
		gap: var(--spacing-2);
	}

	.phase-number {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
	}

	.phase-name {
		font-size: var(--font-size-md);
		color: var(--color-text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.phase-subtitle {
		font-size: var(--font-size-xs);
		color: var(--color-text-dim);
		font-style: italic;
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.header-center {
		display: flex;
		align-items: center;
		gap: var(--spacing-4);
		flex: 1;
		justify-content: center;
	}

	.resource-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-1);
	}

	.resource-rate {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: var(--spacing-3);
		min-width: 0;
	}

	.progress-wrapper {
		width: 120px;
	}

	.compact .progress-wrapper {
		width: 80px;
	}

	.advance-btn {
		background-color: var(--color-accent);
		color: var(--color-bg-primary);
		border: none;
		border-radius: var(--radius-sm);
		padding: var(--spacing-2) var(--spacing-4);
		font-family: var(--font-family-mono);
		font-size: var(--font-size-sm);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
		cursor: pointer;
		transition:
			background-color var(--duration-fast),
			transform var(--duration-fast);
		animation: glow 2s var(--easing-in-out) infinite;
	}

	.advance-btn:hover {
		background-color: var(--color-accent-hover);
	}

	.advance-btn:active {
		transform: scale(0.98);
	}

	.status-indicator {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.status-icon {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.status-icon.pulse {
		color: var(--color-success);
		animation: pulse 2s var(--easing-in-out) infinite;
	}

	.paused .status-icon {
		color: var(--color-warning);
	}

	@keyframes glow {
		0%,
		100% {
			box-shadow: 0 0 4px rgba(255, 255, 255, 0.2);
		}
		50% {
			box-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
		}
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
		.game-header {
			flex-wrap: wrap;
		}

		.header-center {
			order: 3;
			flex-basis: 100%;
			justify-content: center;
			margin-top: var(--spacing-2);
		}

		.progress-wrapper {
			width: 100px;
		}
	}
</style>
