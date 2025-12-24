<script lang="ts">
	/**
	 * @fileoverview Dialogue component for story conversations.
	 * Displays narrative text with typewriter effect and optional choices.
	 *
	 * @module components/ui/Dialogue
	 */

	import Modal from '../core/Modal.svelte';
	import TextReveal from '../core/TextReveal.svelte';
	import Button from '../core/Button.svelte';
	import type { Dialogue as DialogueType, Choice, DialogueLine } from '$lib/engine/models/narrative';

	interface Props {
		/** The dialogue to display */
		dialogue: DialogueType | null;
		/** Whether the dialogue is open */
		open?: boolean;
		/** Callback when dialogue is dismissed */
		onClose?: () => void;
		/** Callback when a choice is made */
		onChoice?: (choiceId: string) => void;
		/** Whether to allow skipping text reveal */
		allowSkip?: boolean;
		/** Text reveal speed (chars per second) */
		textSpeed?: number;
		/** Additional CSS classes */
		class?: string;
	}

	let {
		dialogue,
		open = $bindable(false),
		onClose,
		onChoice,
		allowSkip = true,
		textSpeed = 40,
		class: className = ''
	}: Props = $props();

	/** Track text reveal completion */
	let textComplete = $state(false);

	/** Current line index (for multi-line dialogues) */
	let currentLineIndex = $state(0);

	/** All lines from the dialogue */
	const lines = $derived(dialogue?.lines?.map((l: DialogueLine) => l.text) ?? []);

	/** Current line text */
	const currentLine = $derived(lines[currentLineIndex] ?? '');

	/** Whether there are more lines */
	const hasMoreLines = $derived(currentLineIndex < lines.length - 1);

	/** Whether we're on the last line */
	const isLastLine = $derived(currentLineIndex === lines.length - 1);

	/** Available choices (only shown on last line when text complete) */
	const choices = $derived(dialogue?.choices ?? []);

	/** Speaker name */
	const speaker = $derived(dialogue?.speaker ?? '');

	/**
	 * Handle text reveal completion.
	 */
	function handleTextComplete(): void {
		textComplete = true;
	}

	/**
	 * Advance to next line or close.
	 */
	function advance(): void {
		if (hasMoreLines) {
			currentLineIndex++;
			textComplete = false;
		} else if (choices.length === 0) {
			close();
		}
	}

	/**
	 * Handle choice selection.
	 */
	function handleChoice(choiceId: string): void {
		onChoice?.(choiceId);
		close();
	}

	/**
	 * Close the dialogue.
	 */
	function close(): void {
		open = false;
		currentLineIndex = 0;
		textComplete = false;
		onClose?.();
	}

	/**
	 * Handle click on dialogue content.
	 */
	function handleContentClick(): void {
		if (allowSkip && !textComplete) {
			// Skip to complete text
			textComplete = true;
		} else if (textComplete && !isLastLine) {
			advance();
		} else if (textComplete && isLastLine && choices.length === 0) {
			close();
		}
	}

	// Reset state when dialogue changes
	$effect(() => {
		if (dialogue) {
			currentLineIndex = 0;
			textComplete = false;
		}
	});
</script>

<Modal
	bind:open
	onClose={close}
	closeOnBackdropClick={false}
	closeOnEscape={true}
	showCloseButton={false}
	size="md"
	class="dialogue-modal {className}"
>
	<div
		class="dialogue-container"
		onclick={handleContentClick}
		onkeydown={(e) => e.key === ' ' && handleContentClick()}
		role="button"
		tabindex="0"
	>
		{#if speaker}
			<div class="dialogue-speaker">{speaker}</div>
		{/if}

		<div class="dialogue-text">
			{#key currentLine}
				<TextReveal
					text={currentLine}
					speed={textSpeed}
					autoStart={true}
					bind:complete={textComplete}
					clickToComplete={allowSkip}
				/>
			{/key}
		</div>

		{#if textComplete}
			{#if hasMoreLines}
				<div class="dialogue-continue">
					<span class="continue-indicator">▼</span>
					<span class="continue-text">Click to continue</span>
				</div>
			{:else if choices.length > 0}
				<div class="dialogue-choices">
					{#each choices as choice}
						<Button
							variant="secondary"
							fullWidth
							disabled={choice.available === false}
							onclick={() => handleChoice(choice.id)}
						>
							{choice.label}
						</Button>
					{/each}
				</div>
			{:else}
				<div class="dialogue-continue">
					<span class="continue-indicator">×</span>
					<span class="continue-text">Click to close</span>
				</div>
			{/if}
		{/if}
	</div>

	{#if lines.length > 1}
		<div class="dialogue-progress">
			{currentLineIndex + 1} / {lines.length}
		</div>
	{/if}
</Modal>

<style>
	:global(.dialogue-modal) {
		--modal-bg: var(--color-bg-primary);
	}

	.dialogue-container {
		cursor: pointer;
		min-height: 120px;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
	}

	.dialogue-speaker {
		font-size: var(--font-size-sm);
		color: var(--color-accent);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wider);
		margin-bottom: var(--spacing-1);
	}

	.dialogue-text {
		font-size: var(--font-size-md);
		line-height: var(--line-height-relaxed);
		color: var(--color-text-primary);
		min-height: 3em;
	}

	.dialogue-continue {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-2);
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
		animation: pulse 2s var(--easing-in-out) infinite;
	}

	.continue-indicator {
		font-size: var(--font-size-xs);
	}

	.continue-text {
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
	}

	.dialogue-choices {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
		margin-top: var(--spacing-4);
	}

	.dialogue-progress {
		position: absolute;
		bottom: var(--spacing-2);
		right: var(--spacing-4);
		font-size: var(--font-size-xs);
		color: var(--color-text-dim);
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

	/* Focus styles */
	.dialogue-container:focus-visible {
		outline: none;
	}
</style>
