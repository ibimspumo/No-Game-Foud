<script lang="ts">
	/**
	 * @fileoverview Modal component for dialogs and overlays.
	 * Provides accessible modal functionality with focus trap and animations.
	 *
	 * @module components/core/Modal
	 */

	import { fly, fade } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Whether the modal is open */
		open: boolean;
		/** Callback when modal should close */
		onClose?: () => void;
		/** Modal title */
		title?: string;
		/** Whether clicking backdrop closes modal */
		closeOnBackdropClick?: boolean;
		/** Whether pressing Escape closes modal */
		closeOnEscape?: boolean;
		/** Whether to show close button */
		showCloseButton?: boolean;
		/** Size variant */
		size?: 'sm' | 'md' | 'lg' | 'full';
		/** Additional CSS classes */
		class?: string;
		/** Modal content */
		children: Snippet;
		/** Optional footer content */
		footer?: Snippet;
	}

	let {
		open = $bindable(false),
		onClose,
		title = '',
		closeOnBackdropClick = true,
		closeOnEscape = true,
		showCloseButton = true,
		size = 'md',
		class: className = '',
		children,
		footer
	}: Props = $props();

	/** Reference to the modal element for focus management */
	let modalElement: HTMLDivElement | null = $state(null);

	/** Previous active element (for restoring focus) */
	let previousActiveElement: HTMLElement | null = null;

	/**
	 * Close the modal.
	 */
	function close(): void {
		open = false;
		onClose?.();
	}

	/**
	 * Handle backdrop click.
	 */
	function handleBackdropClick(event: MouseEvent): void {
		if (closeOnBackdropClick && event.target === event.currentTarget) {
			close();
		}
	}

	/**
	 * Handle keyboard events.
	 */
	function handleKeydown(event: KeyboardEvent): void {
		if (closeOnEscape && event.key === 'Escape') {
			event.preventDefault();
			close();
		}

		// Focus trap
		if (event.key === 'Tab' && modalElement) {
			const focusableElements = modalElement.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			const firstElement = focusableElements[0] as HTMLElement;
			const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

			if (event.shiftKey && document.activeElement === firstElement) {
				event.preventDefault();
				lastElement?.focus();
			} else if (!event.shiftKey && document.activeElement === lastElement) {
				event.preventDefault();
				firstElement?.focus();
			}
		}
	}

	/**
	 * Focus the first focusable element in the modal.
	 */
	function focusFirstElement(): void {
		if (modalElement) {
			const focusableElements = modalElement.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			const firstElement = focusableElements[0] as HTMLElement;
			firstElement?.focus();
		}
	}

	// Store previous focus and focus modal on open
	$effect(() => {
		if (open) {
			previousActiveElement = document.activeElement as HTMLElement;
			// Use setTimeout to ensure modal is rendered
			setTimeout(() => focusFirstElement(), 50);
		} else if (previousActiveElement) {
			previousActiveElement.focus();
			previousActiveElement = null;
		}
	});

	// Prevent body scroll when modal is open
	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	});

	/** Size classes */
	const sizeClasses: Record<string, string> = {
		sm: 'modal-sm',
		md: 'modal-md',
		lg: 'modal-lg',
		full: 'modal-full'
	};
</script>

{#if open}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="modal-backdrop"
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? 'modal-title' : undefined}
		tabindex="-1"
		transition:fade={{ duration: 200 }}
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
	>
		<div
			bind:this={modalElement}
			class="modal {sizeClasses[size]} {className}"
			transition:fly={{ y: 20, duration: 200 }}
		>
			{#if title || showCloseButton}
				<div class="modal-header">
					{#if title}
						<h2 id="modal-title" class="modal-title">{title}</h2>
					{/if}
					{#if showCloseButton}
						<button
							class="modal-close"
							onclick={close}
							aria-label="Close modal"
							type="button"
						>
							×
						</button>
					{/if}
				</div>
			{/if}

			<div class="modal-content">
				{@render children()}
			</div>

			{#if footer}
				<div class="modal-footer">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: var(--z-modal-backdrop);
		padding: var(--spacing-4);
	}

	.modal {
		background-color: var(--color-bg-surface);
		border: var(--border-width) solid var(--color-border-color);
		border-radius: var(--radius-md);
		display: flex;
		flex-direction: column;
		max-height: 90vh;
		overflow: hidden;
		z-index: var(--z-modal);
	}

	/* Size variants */
	.modal-sm {
		width: 100%;
		max-width: 320px;
	}

	.modal-md {
		width: 100%;
		max-width: 480px;
	}

	.modal-lg {
		width: 100%;
		max-width: 640px;
	}

	.modal-full {
		width: 100%;
		max-width: 90vw;
		max-height: 90vh;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-4);
		border-bottom: var(--border-width) solid var(--color-border-color);
	}

	.modal-title {
		margin: 0;
		font-size: var(--font-size-md);
		font-weight: normal;
		color: var(--color-text-primary);
		letter-spacing: var(--letter-spacing-wide);
		text-transform: uppercase;
	}

	.modal-close {
		background: transparent;
		border: none;
		color: var(--color-text-muted);
		font-size: var(--font-size-xl);
		cursor: pointer;
		padding: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color var(--duration-fast);
	}

	.modal-close:hover {
		color: var(--color-text-primary);
	}

	.modal-content {
		padding: var(--spacing-4);
		overflow-y: auto;
		flex: 1;
	}

	.modal-footer {
		padding: var(--spacing-4);
		border-top: var(--border-width) solid var(--color-border-color);
		display: flex;
		justify-content: flex-end;
		gap: var(--spacing-2);
	}
</style>
