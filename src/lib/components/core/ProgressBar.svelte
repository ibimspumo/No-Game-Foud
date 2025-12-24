<script lang="ts">
	/**
	 * @fileoverview ProgressBar component for displaying progress towards goals.
	 * Supports different styles, sizes, and animated fills.
	 *
	 * @module components/core/ProgressBar
	 */

	import type { Snippet } from 'svelte';

	interface Props {
		/** Current progress value (0-1 or 0-100 based on percentage prop) */
		value: number;
		/** Maximum value (defaults to 1 for 0-1 range, 100 for percentage) */
		max?: number;
		/** Whether to show percentage text */
		showPercentage?: boolean;
		/** Whether to show the raw value/max text */
		showValue?: boolean;
		/** Custom label text */
		label?: string;
		/** Size variant */
		size?: 'sm' | 'md' | 'lg';
		/** Color variant */
		variant?: 'default' | 'success' | 'warning' | 'error' | 'accent';
		/** Whether to animate the progress bar */
		animated?: boolean;
		/** Whether to show a pulsing effect when near completion */
		pulseNearComplete?: boolean;
		/** Additional CSS classes */
		class?: string;
		/** Slot for custom content inside the bar */
		children?: Snippet;
	}

	let {
		value,
		max = 1,
		showPercentage = false,
		showValue = false,
		label = '',
		size = 'md',
		variant = 'default',
		animated = true,
		pulseNearComplete = false,
		class: className = '',
		children
	}: Props = $props();

	/** Calculated percentage (0-100) */
	const percentage = $derived(Math.min(100, Math.max(0, (value / max) * 100)));

	/** Whether the progress is near completion (>90%) */
	const isNearComplete = $derived(percentage >= 90 && percentage < 100);

	/** Whether the progress is complete */
	const isComplete = $derived(percentage >= 100);

	/** Size classes */
	const sizeClasses: Record<string, string> = {
		sm: 'progress-sm',
		md: 'progress-md',
		lg: 'progress-lg'
	};

	/** Variant classes */
	const variantClasses: Record<string, string> = {
		default: 'progress-default',
		success: 'progress-success',
		warning: 'progress-warning',
		error: 'progress-error',
		accent: 'progress-accent'
	};
</script>

<div
	class="progress-container {sizeClasses[size]} {variantClasses[variant]} {className}"
	class:animated
	class:pulse-near-complete={pulseNearComplete && isNearComplete}
	class:complete={isComplete}
	role="progressbar"
	aria-valuenow={value}
	aria-valuemin={0}
	aria-valuemax={max}
	aria-label={label || 'Progress'}
>
	{#if label}
		<div class="progress-label">{label}</div>
	{/if}

	<div class="progress-track">
		<div class="progress-fill" style="width: {percentage}%">
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>

	{#if showPercentage || showValue}
		<div class="progress-text">
			{#if showPercentage}
				<span class="progress-percentage">{percentage.toFixed(0)}%</span>
			{/if}
			{#if showValue}
				<span class="progress-value">{value.toFixed(0)} / {max.toFixed(0)}</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.progress-container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
		width: 100%;
	}

	.progress-label {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
	}

	.progress-track {
		width: 100%;
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-sm);
		overflow: hidden;
		position: relative;
	}

	.progress-fill {
		height: 100%;
		background-color: var(--color-accent);
		transition: width var(--duration-slow) var(--easing-out);
		border-radius: var(--radius-sm);
	}

	.progress-text {
		display: flex;
		justify-content: space-between;
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
	}

	/* Size variants */
	.progress-sm .progress-track {
		height: 4px;
	}

	.progress-md .progress-track {
		height: 8px;
	}

	.progress-lg .progress-track {
		height: 12px;
	}

	/* Color variants */
	.progress-default .progress-fill {
		background-color: var(--color-accent);
	}

	.progress-success .progress-fill {
		background-color: var(--color-success);
	}

	.progress-warning .progress-fill {
		background-color: var(--color-warning);
	}

	.progress-error .progress-fill {
		background-color: var(--color-error);
	}

	.progress-accent .progress-fill {
		background-color: var(--color-info);
	}

	/* Animation states */
	.animated .progress-fill {
		transition: width var(--duration-slow) var(--easing-out);
	}

	.pulse-near-complete .progress-fill {
		animation: pulse 1.5s var(--easing-in-out) infinite;
	}

	.complete .progress-fill {
		animation: none;
		box-shadow: var(--shadow-glow);
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}
</style>
