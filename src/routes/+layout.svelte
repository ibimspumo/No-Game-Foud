<script lang="ts">
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { Game, setGameContext } from '$lib/engine';
	import '$lib/components/styles.css';

	let { children } = $props();

	// Create the game instance ONCE
	const game = new Game({
		debug: false // Set to true for event logging (very noisy!)
	});

	// Set the game context so all child components can access it
	setGameContext(game);

	// Use onMount instead of $effect to prevent re-running on state changes
	onMount(() => {
		game.init();

		// Cleanup when the component unmounts
		return () => {
			game.stop();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>No Game Found</title>
	<meta name="description" content="A philosophical idle game about pixels, existence, and everything." />
</svelte:head>

{@render children()}

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(html, body) {
		height: 100%;
		width: 100%;
		font-family: 'Courier New', Courier, monospace;
		background-color: #000;
		color: #fff;
	}

	:global(body) {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
</style>
