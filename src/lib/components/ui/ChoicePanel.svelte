<script lang="ts">
	/**
	 * @fileoverview ChoicePanel component for narrative decision points.
	 * Displays a set of choices with descriptions and consequences.
	 *
	 * @module components/ui/ChoicePanel
	 */

	import Modal from '../core/Modal.svelte';
	import Button from '../core/Button.svelte';
	import type { Choice } from '$lib/engine/models/narrative';

	interface Props {
		/** The choices to display */
		choices: Choice[];
		/** Panel title/prompt */
		title?: string;
		/** Panel description */
		description?: string;
		/** Whether the panel is open */
		open?: boolean;
		/** Callback when a choice is made */
		onChoice?: (choiceId: string) => void;
		/** Callback when panel is closed without choice */
		onClose?: () => void;
		/** Whether closing without choice is allowed */
		allowClose?: boolean;
		/** Additional CSS classes */
		class?: string;
	}

	let {
		choices,
		title = 'Make a Choice',
		description = '',
		open = $bindable(false),
		onChoice,
		onClose,
		allowClose = false,
		class: className = ''
	}: Props = $props();

	/** Currently hovered choice for showing details */
	let hoveredChoice = $state<string | null>(null);

	/**
	 * Handle choice selection.
	 */
	function handleChoice(choiceId: string): void {
		onChoice?.(choiceId);
		open = false;
	}

	/**
	 * Handle panel close.
	 */
	function handleClose(): void {
		if (allowClose) {
			onClose?.();
			open = false;
		}
	}

	/**
	 * Get the variant for a choice button based on its aesthetic impact.
	 */
	function getChoiceVariant(choice: Choice): 'primary' | 'secondary' | 'danger' | 'ghost' {
		if (choice.aestheticImpact === 'positive') return 'primary';
		if (choice.aestheticImpact === 'negative') return 'danger';
		return 'secondary';
	}
</script>

<Modal
	bind:open
	onClose={handleClose}
	{title}
	closeOnBackdropClick={allowClose}
	closeOnEscape={allowClose}
	showCloseButton={allowClose}
	size="md"
	class="choice-panel {className}"
>
	{#if description}
		<p class="choice-description">{description}</p>
	{/if}

	<div class="choice-list">
		{#each choices as choice}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="choice-item"
				class:disabled={choice.available === false}
				class:hovered={hoveredChoice === choice.id}
				onmouseenter={() => (hoveredChoice = choice.id)}
				onmouseleave={() => (hoveredChoice = null)}
				role="group"
			>
				<button
					class="choice-button {getChoiceVariant(choice)}"
					disabled={choice.available === false}
					onclick={() => handleChoice(choice.id)}
				>
					<span class="choice-text">{choice.label}</span>
					{#if choice.description}
						<span class="choice-hint">{choice.description}</span>
					{/if}
				</button>

				{#if choice.consequences.length > 0 && hoveredChoice === choice.id}
					<div class="choice-consequence">
						<span class="consequence-label">Effects:</span>
						<span class="consequence-text">{choice.consequences.length} consequence(s)</span>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	{#if choices.some((c) => c.available === false)}
		<p class="locked-hint">
			Some choices are locked. Progress further to unlock them.
		</p>
	{/if}
</Modal>

<style>
	.choice-description {
		margin: 0 0 var(--spacing-4);
		font-size: var(--font-size-base);
		color: var(--color-text-secondary);
		line-height: var(--line-height-relaxed);
	}

	.choice-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
	}

	.choice-item {
		position: relative;
	}

	.choice-item.disabled {
		opacity: 0.5;
	}

	.choice-button {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-1);
		padding: var(--spacing-4);
		background-color: var(--color-bg-tertiary);
		border: var(--border-width) solid var(--color-border-color);
		border-radius: var(--radius-md);
		cursor: pointer;
		font-family: var(--font-family-mono);
		text-align: left;
		transition:
			background-color var(--duration-fast),
			border-color var(--duration-fast),
			transform var(--duration-fast);
	}

	.choice-button:not(:disabled):hover {
		background-color: var(--color-bg-elevated);
		border-color: var(--color-border-hover);
	}

	.choice-button:not(:disabled):active {
		transform: scale(0.99);
	}

	.choice-button:disabled {
		cursor: not-allowed;
	}

	/* Variants */
	.choice-button.primary {
		border-color: var(--color-success);
	}

	.choice-button.primary:not(:disabled):hover {
		border-color: var(--color-success);
		background-color: rgba(52, 211, 153, 0.1);
	}

	.choice-button.danger {
		border-color: var(--color-error);
	}

	.choice-button.danger:not(:disabled):hover {
		border-color: var(--color-error);
		background-color: rgba(239, 68, 68, 0.1);
	}

	.choice-text {
		font-size: var(--font-size-base);
		color: var(--color-text-primary);
	}

	.choice-hint {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		font-style: italic;
	}

	.choice-consequence {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: var(--spacing-1);
		padding: var(--spacing-2);
		background-color: var(--color-bg-surface);
		border: var(--border-width) solid var(--color-border-color);
		border-radius: var(--radius-sm);
		z-index: 1;
		animation: fade-in var(--duration-fast) var(--easing-out);
	}

	.consequence-label {
		font-size: var(--font-size-xs);
		color: var(--color-text-dim);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
	}

	.consequence-text {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		display: block;
		margin-top: var(--spacing-1);
	}

	.locked-hint {
		margin: var(--spacing-4) 0 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-dim);
		font-style: italic;
		text-align: center;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Focus styles */
	.choice-button:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}
</style>
