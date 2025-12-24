<script lang="ts">
	/**
	 * @fileoverview TextReveal component for character-by-character text animation.
	 * Creates a typewriter effect commonly used in story dialogues.
	 *
	 * @module components/core/TextReveal
	 */

	interface Props {
		/** The text to reveal */
		text: string;
		/** Speed in characters per second */
		speed?: number;
		/** Delay before starting (ms) */
		delay?: number;
		/** Whether to start immediately */
		autoStart?: boolean;
		/** Whether the reveal is complete */
		complete?: boolean;
		/** Callback when reveal completes */
		onComplete?: () => void;
		/** Whether clicking should complete the reveal */
		clickToComplete?: boolean;
		/** Additional CSS classes */
		class?: string;
	}

	let {
		text,
		speed = 30,
		delay = 0,
		autoStart = true,
		complete = $bindable(false),
		onComplete,
		clickToComplete = true,
		class: className = ''
	}: Props = $props();

	/** Current number of visible characters */
	let visibleChars = $state(0);

	/** Whether the animation is running */
	let isRunning = $state(false);

	/** Animation interval handle */
	let intervalId: ReturnType<typeof setInterval> | null = null;

	/** Calculate interval time based on speed */
	const intervalTime = $derived(1000 / speed);

	/** The visible portion of the text */
	const visibleText = $derived(text.slice(0, visibleChars));

	/** The hidden portion of the text */
	const hiddenText = $derived(text.slice(visibleChars));

	/** Whether the reveal is complete */
	const isComplete = $derived(visibleChars >= text.length);

	/**
	 * Start the reveal animation.
	 */
	function start(): void {
		if (isRunning) return;
		isRunning = true;

		intervalId = setInterval(() => {
			if (visibleChars >= text.length) {
				stop();
				complete = true;
				onComplete?.();
				return;
			}

			// Handle pauses at punctuation
			const nextChar = text[visibleChars];
			visibleChars++;

			// Add extra delay for punctuation
			if (['.', '!', '?'].includes(nextChar) && visibleChars < text.length) {
				clearInterval(intervalId!);
				setTimeout(() => {
					if (isRunning) {
						intervalId = setInterval(() => {
							if (visibleChars >= text.length) {
								stop();
								complete = true;
								onComplete?.();
								return;
							}
							visibleChars++;
						}, intervalTime);
					}
				}, intervalTime * 5);
			} else if ([',', ';', ':'].includes(nextChar) && visibleChars < text.length) {
				clearInterval(intervalId!);
				setTimeout(() => {
					if (isRunning) {
						intervalId = setInterval(() => {
							if (visibleChars >= text.length) {
								stop();
								complete = true;
								onComplete?.();
								return;
							}
							visibleChars++;
						}, intervalTime);
					}
				}, intervalTime * 2);
			}
		}, intervalTime);
	}

	/**
	 * Stop the reveal animation.
	 */
	function stop(): void {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
		isRunning = false;
	}

	/**
	 * Complete the reveal immediately.
	 */
	function completeImmediately(): void {
		stop();
		visibleChars = text.length;
		complete = true;
		onComplete?.();
	}

	/**
	 * Reset the reveal to the beginning.
	 */
	function reset(): void {
		stop();
		visibleChars = 0;
		complete = false;
	}

	/**
	 * Handle click on the text.
	 */
	function handleClick(): void {
		if (clickToComplete && !isComplete) {
			completeImmediately();
		}
	}

	/**
	 * Handle keyboard interaction.
	 */
	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		}
	}

	// Start automatically if autoStart is true
	$effect(() => {
		if (autoStart && !isRunning && !isComplete) {
			setTimeout(() => start(), delay);
		}
	});

	// Reset when text changes
	$effect(() => {
		const _ = text;
		reset();
		if (autoStart) {
			setTimeout(() => start(), delay);
		}
	});

	// Cleanup on unmount
	$effect(() => {
		return () => stop();
	});
</script>

<div
	class="text-reveal {className}"
	class:complete={isComplete}
	class:running={isRunning}
	onclick={handleClick}
	onkeydown={handleKeydown}
	role="button"
	tabindex="0"
	aria-label={clickToComplete && !isComplete ? 'Click to reveal all text' : undefined}
>
	<span class="text-visible">{visibleText}</span>
	<span class="text-hidden" aria-hidden="true">{hiddenText}</span>
	{#if !isComplete}
		<span class="cursor">_</span>
	{/if}
</div>

<style>
	.text-reveal {
		position: relative;
		cursor: default;
		line-height: var(--line-height-relaxed);
	}

	.text-reveal:not(.complete) {
		cursor: pointer;
	}

	.text-visible {
		color: var(--color-text-primary);
	}

	.text-hidden {
		visibility: hidden;
		position: absolute;
	}

	.cursor {
		display: inline-block;
		color: var(--color-text-primary);
		animation: blink 1s step-start infinite;
	}

	.complete .cursor {
		display: none;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	/* Focus styles */
	.text-reveal:focus-visible {
		outline: none;
		background-color: var(--color-accent-dim);
		border-radius: var(--radius-sm);
	}
</style>
