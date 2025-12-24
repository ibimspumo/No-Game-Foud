<script lang="ts">
	/**
	 * @fileoverview Counter component for displaying animated number values.
	 * Supports large numbers, formatting, and smooth animations.
	 *
	 * @module components/core/Counter
	 */

	import { formatNumber, type FormatOptions } from '$lib/engine/utils/format';
	import type { Decimal } from '$lib/engine/utils/decimal';

	interface Props {
		/** The value to display (number or Decimal) */
		value: number | Decimal | string;
		/** Optional label shown above the value */
		label?: string;
		/** Optional suffix shown after the value */
		suffix?: string;
		/** Optional prefix shown before the value */
		prefix?: string;
		/** Size variant */
		size?: 'sm' | 'md' | 'lg' | 'xl';
		/** Whether to animate value changes */
		animated?: boolean;
		/** Number formatting options */
		formatOptions?: FormatOptions;
		/** Additional CSS classes */
		class?: string;
	}

	let {
		value,
		label = '',
		suffix = '',
		prefix = '',
		size = 'md',
		animated = true,
		formatOptions = {},
		class: className = ''
	}: Props = $props();

	/** Format the value for display */
	function formatValue(val: number | Decimal | string): string {
		if (typeof val === 'string') {
			return val;
		}
		return formatNumber(val, formatOptions);
	}

	/** Formatted display value */
	const displayValue = $derived(formatValue(value));

	/** Previous value for animation detection */
	let previousValue = $state('');

	/** Whether the value just changed (for animation trigger) */
	let justChanged = $state(false);

	/** Track value changes */
	$effect(() => {
		if (displayValue !== previousValue) {
			previousValue = displayValue;
			if (animated) {
				justChanged = true;
				// Reset animation state after animation completes
				setTimeout(() => {
					justChanged = false;
				}, 200);
			}
		}
	});

	/** Size classes */
	const sizeClasses: Record<string, string> = {
		sm: 'counter-sm',
		md: 'counter-md',
		lg: 'counter-lg',
		xl: 'counter-xl'
	};
</script>

<div class="counter {sizeClasses[size]} {className}" class:animated class:just-changed={justChanged}>
	{#if label}
		<span class="counter-label">{label}</span>
	{/if}
	<span class="counter-value">
		{#if prefix}
			<span class="counter-prefix">{prefix}</span>
		{/if}
		<span class="counter-number">{displayValue}</span>
		{#if suffix}
			<span class="counter-suffix">{suffix}</span>
		{/if}
	</span>
</div>

<style>
	.counter {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-1);
	}

	.counter-label {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
	}

	.counter-value {
		display: flex;
		align-items: baseline;
		gap: var(--spacing-1);
		color: var(--color-text-primary);
		font-weight: normal;
		transition: transform var(--duration-fast) var(--easing-out);
	}

	.counter-prefix,
	.counter-suffix {
		font-size: 0.75em;
		color: var(--color-text-secondary);
	}

	.counter-number {
		font-variant-numeric: tabular-nums;
	}

	/* Size variants */
	.counter-sm .counter-value {
		font-size: var(--font-size-base);
	}

	.counter-md .counter-value {
		font-size: var(--font-size-lg);
	}

	.counter-lg .counter-value {
		font-size: var(--font-size-xl);
	}

	.counter-xl .counter-value {
		font-size: var(--font-size-2xl);
	}

	/* Animation states */
	.animated.just-changed .counter-value {
		animation: counter-pop var(--duration-fast) var(--easing-out);
	}

	@keyframes counter-pop {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
