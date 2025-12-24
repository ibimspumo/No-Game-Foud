<script lang="ts">
	/**
	 * @fileoverview Sidebar component for upgrades, producers, and stats.
	 * Collapsible on mobile, persistent on desktop.
	 *
	 * @module components/ui/Sidebar
	 */

	import type { Snippet } from 'svelte';
	import { getGameContext, formatNumber, D } from '$lib/engine';
	import Button from '../core/Button.svelte';
	import type { UpgradeDefinition } from '$lib/engine/models/upgrades';

	interface Props {
		/** Whether the sidebar is open (mobile) */
		open?: boolean;
		/** Callback when sidebar should close */
		onClose?: () => void;
		/** Which tab is active */
		activeTab?: 'upgrades' | 'producers' | 'stats' | 'achievements';
		/** Additional CSS classes */
		class?: string;
		/** Custom content slot */
		children?: Snippet;
	}

	let {
		open = $bindable(true),
		onClose,
		activeTab = $bindable('upgrades'),
		class: className = '',
		children
	}: Props = $props();

	const game = getGameContext();

	// Game state
	let currentPhase = $derived(game.phases.currentPhase);
	let runTime = $derived(game.runTime);
	let tickCount = $derived(game.tickCount);

	// Stats
	let totalPixels = $derived(game.resources.getAmount('pixels'));
	let pixelRate = $derived(game.resources.getProductionRate('pixels'));
	let autoClickRate = $derived(game.getAutoClickRate());
	let clickBonuses = $derived(game.upgrades.getClickBonusComponents());

	// Upgrades - reactive list of visible upgrades
	let visibleUpgradeIds = $derived(game.upgrades.getVisibleUpgrades());
	let purchasableUpgradeIds = $derived(game.upgrades.purchasableUpgrades);

	/**
	 * Get upgrade data for display
	 */
	function getUpgradeData(id: string) {
		const def = game.upgrades.getDefinition(id);
		const level = game.upgrades.getLevel(id);
		const cost = game.upgrades.getNextCost(id);
		const canAfford = game.upgrades.canAfford(id);
		const isMaxed = def?.maxLevel ? level >= def.maxLevel : level >= 1;
		return { def, level, cost, canAfford, isMaxed };
	}

	/**
	 * Purchase an upgrade
	 */
	function buyUpgrade(id: string): void {
		const result = game.upgrades.purchase(id);
		if (result.success) {
			// Upgrade purchased successfully
		}
	}

	/** Tabs configuration */
	const tabs = [
		{ id: 'upgrades', label: 'Upgrades', icon: '↑' },
		{ id: 'producers', label: 'Producers', icon: '⚙' },
		{ id: 'stats', label: 'Stats', icon: '📊' },
		{ id: 'achievements', label: 'Trophies', icon: '🏆' }
	] as const;

	/**
	 * Format time as mm:ss or hh:mm:ss
	 */
	function formatTime(seconds: number): string {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = Math.floor(seconds % 60);

		if (h > 0) {
			return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
		}
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	/**
	 * Handle tab change
	 */
	function setTab(tabId: typeof activeTab): void {
		activeTab = tabId;
	}

	/**
	 * Close sidebar
	 */
	function closeSidebar(): void {
		open = false;
		onClose?.();
	}
</script>

<aside class="sidebar {className}" class:open>
	<div class="sidebar-header">
		<h2 class="sidebar-title">Tools</h2>
		<button class="close-btn" onclick={closeSidebar} aria-label="Close sidebar">×</button>
	</div>

	<nav class="sidebar-tabs">
		{#each tabs as tab}
			<button
				class="tab-btn"
				class:active={activeTab === tab.id}
				onclick={() => setTab(tab.id)}
				aria-pressed={activeTab === tab.id}
			>
				<span class="tab-icon">{tab.icon}</span>
				<span class="tab-label">{tab.label}</span>
			</button>
		{/each}
	</nav>

	<div class="sidebar-content">
		{#if activeTab === 'upgrades'}
			<div class="content-section">
				<h3 class="section-title">Available Upgrades</h3>
				{#if visibleUpgradeIds.length === 0}
					<p class="placeholder-text">
						No upgrades available yet. Keep clicking!
					</p>
				{:else}
					<div class="upgrade-list">
						{#each visibleUpgradeIds as upgradeId (upgradeId)}
							{@const data = getUpgradeData(upgradeId)}
							{#if data.def}
								<div class="upgrade-card" class:affordable={data.canAfford} class:maxed={data.isMaxed}>
									<div class="upgrade-header">
										<span class="upgrade-name">{data.def.name}</span>
										{#if data.def.maxLevel && data.def.maxLevel > 1}
											<span class="upgrade-level">{data.level}/{data.def.maxLevel}</span>
										{:else if data.level > 0}
											<span class="upgrade-owned">Owned</span>
										{/if}
									</div>
									<p class="upgrade-desc">{data.def.description}</p>
									{#if !data.isMaxed}
										<div class="upgrade-footer">
											<span class="upgrade-cost" class:can-afford={data.canAfford}>
												{formatNumber(D(data.cost))} pixels
											</span>
											<button
												class="upgrade-buy-btn"
												disabled={!data.canAfford}
												onclick={() => buyUpgrade(upgradeId)}
											>
												Buy
											</button>
										</div>
									{:else}
										<div class="upgrade-footer">
											<span class="upgrade-maxed">MAX</span>
										</div>
									{/if}
								</div>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		{:else if activeTab === 'producers'}
			<div class="content-section">
				<h3 class="section-title">Producers</h3>
				<p class="placeholder-text">
					Purchase producers to generate pixels automatically.
				</p>
				<!-- TODO: Producer list component -->
			</div>
		{:else if activeTab === 'stats'}
			<div class="content-section">
				<h3 class="section-title">Statistics</h3>
				<div class="stats-list">
					<div class="stat-item">
						<span class="stat-label">Phase</span>
						<span class="stat-value">{currentPhase}</span>
					</div>
					<div class="stat-item">
						<span class="stat-label">Run Time</span>
						<span class="stat-value">{formatTime(runTime)}</span>
					</div>
					<div class="stat-item">
						<span class="stat-label">Total Pixels</span>
						<span class="stat-value">{formatNumber(totalPixels)}</span>
					</div>
					<div class="stat-item">
						<span class="stat-label">Pixels/sec</span>
						<span class="stat-value">{formatNumber(pixelRate)}</span>
					</div>
				</div>
			</div>
			<div class="content-section">
				<h3 class="section-title">Click Power</h3>
				<div class="stats-list">
					<div class="stat-item">
						<span class="stat-label">Base + Additive</span>
						<span class="stat-value">+{formatNumber(D(clickBonuses.additive).add(1))}</span>
					</div>
					<div class="stat-item">
						<span class="stat-label">Multiplier</span>
						<span class="stat-value">x{formatNumber(D(clickBonuses.multiplicative))}</span>
					</div>
					{#if autoClickRate > 0}
						<div class="stat-item highlight">
							<span class="stat-label">Auto-Click</span>
							<span class="stat-value">{autoClickRate}/sec</span>
						</div>
					{/if}
				</div>
			</div>
		{:else if activeTab === 'achievements'}
			<div class="content-section">
				<h3 class="section-title">Achievements</h3>
				<div class="achievement-summary">
					<span class="achievement-count">
						{game.achievements.unlockedCount} / {game.achievements.totalCount}
					</span>
					<span class="achievement-percentage">
						({game.achievements.completionPercentage.toFixed(1)}%)
					</span>
				</div>
				<p class="placeholder-text">
					Unlock achievements by reaching milestones.
				</p>
				<!-- TODO: Achievement list component -->
			</div>
		{/if}

		{#if children}
			{@render children()}
		{/if}
	</div>

	<div class="sidebar-footer">
		<Button variant="ghost" size="sm" onclick={() => game.saveGame()}>
			Save
		</Button>
		<Button variant="ghost" size="sm" onclick={() => game.isPaused ? game.resume() : game.pause()}>
			{game.isPaused ? 'Resume' : 'Pause'}
		</Button>
	</div>
</aside>

<!-- Backdrop for mobile -->
{#if open}
	<div class="sidebar-backdrop" onclick={closeSidebar} role="presentation"></div>
{/if}

<style>
	.sidebar {
		display: flex;
		flex-direction: column;
		width: var(--sidebar-width);
		height: 100%;
		background-color: var(--color-bg-secondary);
		border-left: var(--border-width) solid var(--color-border-color);
		position: relative;
		z-index: var(--z-fixed);
	}

	.sidebar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-4);
		border-bottom: var(--border-width) solid var(--color-border-color);
	}

	.sidebar-title {
		margin: 0;
		font-size: var(--font-size-sm);
		font-weight: normal;
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wider);
	}

	.close-btn {
		display: none;
		background: transparent;
		border: none;
		color: var(--color-text-muted);
		font-size: var(--font-size-xl);
		cursor: pointer;
		padding: 0;
		width: 32px;
		height: 32px;
	}

	.close-btn:hover {
		color: var(--color-text-primary);
	}

	.sidebar-tabs {
		display: flex;
		border-bottom: var(--border-width) solid var(--color-border-color);
	}

	.tab-btn {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-1);
		padding: var(--spacing-2);
		background: transparent;
		border: none;
		color: var(--color-text-muted);
		cursor: pointer;
		transition:
			color var(--duration-fast),
			background-color var(--duration-fast);
		font-family: var(--font-family-mono);
	}

	.tab-btn:hover {
		color: var(--color-text-secondary);
		background-color: var(--color-bg-tertiary);
	}

	.tab-btn.active {
		color: var(--color-text-primary);
		background-color: var(--color-bg-tertiary);
	}

	.tab-icon {
		font-size: var(--font-size-md);
	}

	.tab-label {
		font-size: var(--font-size-xs);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
	}

	.sidebar-content {
		flex: 1;
		overflow-y: auto;
		padding: var(--spacing-4);
	}

	.content-section {
		margin-bottom: var(--spacing-6);
	}

	.section-title {
		margin: 0 0 var(--spacing-3);
		font-size: var(--font-size-xs);
		font-weight: normal;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wider);
	}

	.placeholder-text {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-dim);
		font-style: italic;
	}

	.stats-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
	}

	.stat-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-2);
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-sm);
	}

	.stat-label {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
	}

	.stat-value {
		font-size: var(--font-size-sm);
		color: var(--color-text-primary);
		font-variant-numeric: tabular-nums;
	}

	.stat-item.highlight {
		background-color: rgba(74, 158, 255, 0.15);
		border: 1px solid var(--color-accent, #4a9eff);
	}

	.stat-item.highlight .stat-value {
		color: var(--color-accent, #4a9eff);
	}

	.achievement-summary {
		display: flex;
		align-items: baseline;
		gap: var(--spacing-2);
		margin-bottom: var(--spacing-2);
	}

	.achievement-count {
		font-size: var(--font-size-lg);
		color: var(--color-text-primary);
	}

	.achievement-percentage {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	/* Upgrade list styles */
	.upgrade-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
	}

	.upgrade-card {
		background-color: var(--color-bg-tertiary);
		border: 1px solid var(--color-border-color);
		border-radius: var(--radius-sm);
		padding: var(--spacing-3);
		transition: border-color var(--duration-fast), background-color var(--duration-fast);
	}

	.upgrade-card.affordable {
		border-color: var(--color-accent, #4a9eff);
	}

	.upgrade-card.maxed {
		opacity: 0.7;
		border-color: var(--color-success, #4ade80);
	}

	.upgrade-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-1);
	}

	.upgrade-name {
		font-size: var(--font-size-sm);
		color: var(--color-text-primary);
		font-weight: 500;
	}

	.upgrade-level {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		background-color: var(--color-bg-secondary);
		padding: 2px 6px;
		border-radius: var(--radius-sm);
	}

	.upgrade-owned {
		font-size: var(--font-size-xs);
		color: var(--color-success, #4ade80);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
	}

	.upgrade-desc {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		margin: 0 0 var(--spacing-2);
		line-height: 1.4;
	}

	.upgrade-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.upgrade-cost {
		font-size: var(--font-size-xs);
		color: var(--color-text-dim);
	}

	.upgrade-cost.can-afford {
		color: var(--color-accent, #4a9eff);
	}

	.upgrade-maxed {
		font-size: var(--font-size-xs);
		color: var(--color-success, #4ade80);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wider);
	}

	.upgrade-buy-btn {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border-color);
		color: var(--color-text-secondary);
		padding: var(--spacing-1) var(--spacing-3);
		font-size: var(--font-size-xs);
		font-family: var(--font-family-mono);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: all var(--duration-fast);
	}

	.upgrade-buy-btn:hover:not(:disabled) {
		background-color: var(--color-accent, #4a9eff);
		border-color: var(--color-accent, #4a9eff);
		color: var(--color-bg-primary);
	}

	.upgrade-buy-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.sidebar-footer {
		display: flex;
		gap: var(--spacing-2);
		padding: var(--spacing-3);
		border-top: var(--border-width) solid var(--color-border-color);
	}

	.sidebar-backdrop {
		display: none;
	}

	/* Mobile styles */
	@media (max-width: 1024px) {
		.sidebar {
			position: fixed;
			top: 0;
			right: 0;
			height: 100vh;
			transform: translateX(100%);
			transition: transform var(--duration-normal) var(--easing-out);
		}

		.sidebar.open {
			transform: translateX(0);
		}

		.close-btn {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.sidebar-backdrop {
			display: block;
			position: fixed;
			inset: 0;
			background-color: rgba(0, 0, 0, 0.6);
			z-index: calc(var(--z-fixed) - 1);
		}
	}
</style>
