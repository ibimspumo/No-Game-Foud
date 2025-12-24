<script lang="ts">
	/**
	 * @fileoverview Pulse effect component for highlighting important elements.
	 * Creates a pulsing glow animation around its content.
	 *
	 * @module components/effects/Pulse
	 */

	import type { Snippet } from 'svelte';

	interface Props {
		/** Whether the pulse effect is active */
		active?: boolean;
		/** Pulse color */
		color?: string;
		/** Pulse intensity (1-10) */
		intensity?: number;
		/** Pulse speed in seconds */
		speed?: number;
		/** Additional CSS classes */
		class?: string;
		/** Content to wrap */
		children: Snippet;
	}

	let {
		active = true,
		color = 'rgba(255, 255, 255, 0.5)',
		intensity = 5,
		speed = 2,
		class: className = '',
		children
	}: Props = $props();

	/** Calculate shadow sizes based on intensity */
	const shadowMin = $derived(Math.max(2, intensity));
	const shadowMax = $derived(intensity * 3);
</script>

<div
	class="pulse-wrapper {className}"
	class:active
	style="
		--pulse-color: {color};
		--pulse-speed: {speed}s;
		--shadow-min: {shadowMin}px;
		--shadow-max: {shadowMax}px;
	"
>
	{@render children()}
</div>

<style>
	.pulse-wrapper {
		position: relative;
		display: inline-block;
	}

	.pulse-wrapper.active {
		animation: pulse-effect var(--pulse-speed) var(--easing-in-out) infinite;
	}

	@keyframes pulse-effect {
		0%,
		100% {
			box-shadow: 0 0 var(--shadow-min) var(--pulse-color);
		}
		50% {
			box-shadow: 0 0 var(--shadow-max) var(--pulse-color);
		}
	}
</style>
