<script lang="ts">
	/**
	 * @fileoverview Main game page.
	 * Integrates all UI components into a cohesive game interface.
	 *
	 * @module routes/+page
	 */

	import { getGameContext } from '$lib/engine';
	import { Header, Sidebar, AchievementNotification, PhaseView } from '$lib/components';

	const game = getGameContext();

	// Mobile sidebar state
	let sidebarOpen = $state(false);

	// Debug info
	let runTime = $derived(game.runTime);
	let tickCount = $derived(game.tickCount);
	let status = $derived(game.status);
	let showDebug = $state(false);

	/**
	 * Toggle sidebar visibility (mobile).
	 */
	function toggleSidebar(): void {
		sidebarOpen = !sidebarOpen;
	}

	/**
	 * Close sidebar (mobile).
	 */
	function closeSidebar(): void {
		sidebarOpen = false;
	}

	/**
	 * Toggle debug panel.
	 */
	function toggleDebug(): void {
		showDebug = !showDebug;
	}

	/**
	 * Handle keyboard shortcuts.
	 */
	function handleKeydown(event: KeyboardEvent): void {
		// Escape closes sidebar
		if (event.key === 'Escape' && sidebarOpen) {
			closeSidebar();
		}
		// Ctrl+D toggles debug
		if (event.ctrlKey && event.key === 'd') {
			event.preventDefault();
			toggleDebug();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="game-layout">
	<!-- Header -->
	<Header />

	<!-- Main content area -->
	<div class="game-main">
		<!-- Sidebar (collapsible on mobile) -->
		<Sidebar open={sidebarOpen} onClose={closeSidebar} />

		<!-- Mobile sidebar toggle -->
		<button
			class="sidebar-toggle"
			class:open={sidebarOpen}
			onclick={toggleSidebar}
			aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={sidebarOpen}
		>
			<span class="toggle-icon">{sidebarOpen ? '✕' : '☰'}</span>
		</button>

		<!-- Phase view (main game area) -->
		<main class="game-content">
			<PhaseView />
		</main>
	</div>

	<!-- Achievement notifications -->
	<AchievementNotification />

	<!-- Debug panel (Ctrl+D to toggle) -->
	{#if showDebug}
		<div class="debug-panel">
			<button class="debug-close" onclick={toggleDebug} aria-label="Close debug panel">✕</button>
			<h3>Debug Info</h3>
			<div class="debug-info">
				<span>Status: {status}</span>
				<span>Run Time: {runTime.toFixed(1)}s</span>
				<span>Ticks: {tickCount}</span>
				<span>Phase: {game.phases.currentPhase}</span>
				<span>Mode: {game.phases.visualMode}</span>
			</div>
		</div>
	{/if}
</div>

<style>
	.game-layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: var(--color-bg);
		color: var(--color-text);
	}

	.game-main {
		display: flex;
		flex: 1;
		position: relative;
		overflow: hidden;
	}

	.game-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: auto;
	}

	/* Mobile sidebar toggle button */
	.sidebar-toggle {
		display: none;
		position: fixed;
		bottom: var(--spacing-4);
		right: var(--spacing-4);
		width: 48px;
		height: 48px;
		border-radius: var(--radius-full);
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		color: var(--color-text);
		cursor: pointer;
		z-index: 60;
		transition:
			background-color var(--duration-fast),
			transform var(--duration-fast);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.sidebar-toggle:hover {
		background-color: var(--color-surface-hover);
		transform: scale(1.05);
	}

	.sidebar-toggle:active {
		transform: scale(0.95);
	}

	.toggle-icon {
		font-size: var(--font-size-lg);
	}

	/* Debug panel */
	.debug-panel {
		position: fixed;
		bottom: var(--spacing-4);
		left: var(--spacing-4);
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--spacing-4);
		z-index: 100;
		font-size: var(--font-size-xs);
		min-width: 200px;
	}

	.debug-panel h3 {
		margin: 0 0 var(--spacing-2);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.debug-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
		color: var(--color-text-dim);
	}

	.debug-close {
		position: absolute;
		top: var(--spacing-2);
		right: var(--spacing-2);
		background: transparent;
		border: none;
		color: var(--color-text-dim);
		cursor: pointer;
		font-size: var(--font-size-sm);
		padding: var(--spacing-1);
		line-height: 1;
	}

	.debug-close:hover {
		color: var(--color-text);
	}

	/* Mobile styles */
	@media (max-width: 768px) {
		.sidebar-toggle {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.debug-panel {
			bottom: 70px; /* Above the toggle button */
		}
	}
</style>
