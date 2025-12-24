<script lang="ts">
	/**
	 * @fileoverview Button component with multiple variants and states.
	 * Provides consistent button styling across the application.
	 *
	 * @module components/core/Button
	 */

	import type { Snippet } from 'svelte';

	interface Props {
		/** Button variant */
		variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
		/** Button size */
		size?: 'sm' | 'md' | 'lg';
		/** Whether the button is disabled */
		disabled?: boolean;
		/** Whether the button is in loading state */
		loading?: boolean;
		/** Whether to take full width */
		fullWidth?: boolean;
		/** Button type attribute */
		type?: 'button' | 'submit' | 'reset';
		/** Click handler */
		onclick?: (event: MouseEvent) => void;
		/** Additional CSS classes */
		class?: string;
		/** Button content */
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		fullWidth = false,
		type = 'button',
		onclick,
		class: className = '',
		children
	}: Props = $props();

	/** Variant classes */
	const variantClasses: Record<string, string> = {
		primary: 'btn-primary',
		secondary: 'btn-secondary',
		ghost: 'btn-ghost',
		danger: 'btn-danger'
	};

	/** Size classes */
	const sizeClasses: Record<string, string> = {
		sm: 'btn-sm',
		md: 'btn-md',
		lg: 'btn-lg'
	};
</script>

<button
	{type}
	class="btn {variantClasses[variant]} {sizeClasses[size]} {className}"
	class:full-width={fullWidth}
	class:loading
	disabled={disabled || loading}
	{onclick}
>
	{#if loading}
		<span class="spinner"></span>
	{/if}
	<span class="btn-content" class:hidden={loading}>
		{@render children()}
	</span>
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-2);
		border: var(--border-width) solid transparent;
		border-radius: var(--radius-sm);
		font-family: var(--font-family-mono);
		font-weight: normal;
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
		cursor: pointer;
		transition:
			background-color var(--duration-fast),
			border-color var(--duration-fast),
			color var(--duration-fast),
			transform var(--duration-fast);
		position: relative;
		white-space: nowrap;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn:not(:disabled):active {
		transform: scale(0.98);
	}

	/* Size variants */
	.btn-sm {
		padding: var(--spacing-1) var(--spacing-3);
		font-size: var(--font-size-xs);
		min-height: var(--touch-target);
	}

	.btn-md {
		padding: var(--spacing-2) var(--spacing-4);
		font-size: var(--font-size-sm);
		min-height: var(--touch-target);
	}

	.btn-lg {
		padding: var(--spacing-3) var(--spacing-6);
		font-size: var(--font-size-base);
		min-height: calc(var(--touch-target) + 8px);
	}

	/* Variant styles */
	.btn-primary {
		background-color: var(--color-accent);
		color: var(--color-bg-primary);
		border-color: var(--color-accent);
	}

	.btn-primary:not(:disabled):hover {
		background-color: var(--color-accent-hover);
	}

	.btn-secondary {
		background-color: transparent;
		color: var(--color-text-primary);
		border-color: var(--color-border-color);
	}

	.btn-secondary:not(:disabled):hover {
		background-color: var(--color-bg-elevated);
		border-color: var(--color-border-hover);
	}

	.btn-ghost {
		background-color: transparent;
		color: var(--color-text-secondary);
		border-color: transparent;
	}

	.btn-ghost:not(:disabled):hover {
		background-color: var(--color-bg-elevated);
		color: var(--color-text-primary);
	}

	.btn-danger {
		background-color: var(--color-error);
		color: var(--color-text-primary);
		border-color: var(--color-error);
	}

	.btn-danger:not(:disabled):hover {
		background-color: #dc2626;
	}

	/* Full width */
	.full-width {
		width: 100%;
	}

	/* Loading state */
	.loading {
		pointer-events: none;
	}

	.btn-content {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
	}

	.btn-content.hidden {
		visibility: hidden;
	}

	.spinner {
		position: absolute;
		width: 16px;
		height: 16px;
		border: 2px solid currentColor;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Focus styles */
	.btn:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}
</style>
