<script lang="ts">
	/**
	 * @fileoverview Producer list component for the sidebar.
	 * Displays all available producers with purchase options.
	 *
	 * @module components/ui/ProducerList
	 */

	import { getGameContext, formatNumber, D } from '$lib/engine';
	import type { ProducerDefinition } from '$lib/engine/models/producers';

	const game = getGameContext();

	// Reactive state
	let visibleProducers = $derived(game.producers.getVisibleProducers());

	/**
	 * Get all data needed to display a producer
	 */
	function getProducerData(id: string) {
		const def = game.producers.getDefinition(id);
		if (!def) return null;

		const level = game.producers.getLevel(id);
		const cost = game.producers.getNextCost(id);
		const production = game.producers.getProduction(id);
		const canAfford = game.producers.canAfford(id);
		const isMaxed = def.maxLevel > 0 && level >= def.maxLevel;
		const isUnlocked = game.producers.isUnlocked(id);

		return { def, level, cost, production, canAfford, isMaxed, isUnlocked };
	}

	/**
	 * Buy a producer
	 */
	function buyProducer(id: string): void {
		game.producers.buy(id);
	}

	/**
	 * Buy max affordable amount of a producer
	 */
	function buyMaxProducer(id: string): void {
		game.producers.buyMax(id);
	}

	/**
	 * Get flavor text for a producer at its current level
	 */
	function getFlavorText(def: ProducerDefinition, level: number): string | null {
		if (!def.flavorTexts) return null;

		// Find the highest flavor text milestone that has been reached
		const milestones = Object.keys(def.flavorTexts)
			.map(k => parseInt(k))
			.filter(m => level >= m)
			.sort((a, b) => b - a);

		if (milestones.length === 0) return null;
		return def.flavorTexts[milestones[0]] || null;
	}
</script>

<div class="producer-list">
	{#each visibleProducers as producerId (producerId)}
		{@const data = getProducerData(producerId)}
		{#if data && data.isUnlocked}
			<div class="producer-card" class:affordable={data.canAfford} class:maxed={data.isMaxed}>
				<div class="producer-header">
					<span class="producer-icon">{data.def.icon}</span>
					<div class="producer-info">
						<span class="producer-name">{data.def.name}</span>
						<span class="producer-level">Level {data.level}</span>
					</div>
				</div>

				<p class="producer-desc">{data.def.description}</p>

				{#if data.level > 0}
					<div class="producer-stats">
						<div class="stat-row">
							<span class="stat-label">Production:</span>
							<span class="stat-value">{formatNumber(data.production)}/s</span>
						</div>
					</div>
				{/if}

				{#if data.level > 0}
					{@const flavorText = getFlavorText(data.def, data.level)}
					{#if flavorText}
						<p class="producer-flavor">{flavorText}</p>
					{/if}
				{/if}

				{#if !data.isMaxed}
					<div class="producer-footer">
						<div class="cost-info">
							<span class="cost-label">Cost:</span>
							<span class="cost-value" class:can-afford={data.canAfford}>
								{formatNumber(D(data.cost))}
							</span>
						</div>
						<div class="button-group">
							<button
								class="buy-btn buy-one"
								disabled={!data.canAfford}
								onclick={() => buyProducer(producerId)}
								title="Buy 1"
							>
								Buy
							</button>
							<button
								class="buy-btn buy-max"
								disabled={!data.canAfford}
								onclick={() => buyMaxProducer(producerId)}
								title="Buy maximum affordable"
							>
								Max
							</button>
						</div>
					</div>
				{:else}
					<div class="producer-footer maxed-footer">
						<span class="producer-maxed">MAX LEVEL</span>
					</div>
				{/if}
			</div>
		{/if}
	{/each}

	{#if visibleProducers.length === 0}
		<p class="placeholder-text">
			No producers available yet. Progress further to unlock them.
		</p>
	{/if}
</div>

<style>
	.producer-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
	}

	.producer-card {
		background-color: var(--color-bg-tertiary);
		border: 1px solid var(--color-border-color);
		border-radius: var(--radius-sm);
		padding: var(--spacing-3);
		transition: border-color var(--duration-fast), background-color var(--duration-fast);
	}

	.producer-card.affordable {
		border-color: var(--color-accent, #4a9eff);
	}

	.producer-card.maxed {
		opacity: 0.7;
		border-color: var(--color-success, #4ade80);
	}

	.producer-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		margin-bottom: var(--spacing-2);
	}

	.producer-icon {
		font-size: var(--font-size-xl);
		line-height: 1;
	}

	.producer-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
	}

	.producer-name {
		font-size: var(--font-size-sm);
		color: var(--color-text-primary);
		font-weight: 500;
	}

	.producer-level {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
	}

	.producer-desc {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		margin: 0 0 var(--spacing-2);
		line-height: 1.4;
	}

	.producer-stats {
		margin-bottom: var(--spacing-2);
	}

	.stat-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-1);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-sm);
	}

	.stat-label {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
	}

	.stat-value {
		font-size: var(--font-size-xs);
		color: var(--color-accent, #4a9eff);
		font-variant-numeric: tabular-nums;
		font-weight: 500;
	}

	.producer-flavor {
		font-size: var(--font-size-xs);
		color: var(--color-text-dim);
		font-style: italic;
		margin: 0 0 var(--spacing-2);
		line-height: 1.4;
		padding: var(--spacing-2);
		background-color: rgba(0, 0, 0, 0.2);
		border-left: 2px solid var(--color-border-color);
		border-radius: var(--radius-sm);
	}

	.producer-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-2);
	}

	.cost-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.cost-label {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
	}

	.cost-value {
		font-size: var(--font-size-sm);
		color: var(--color-text-dim);
		font-variant-numeric: tabular-nums;
	}

	.cost-value.can-afford {
		color: var(--color-accent, #4a9eff);
		font-weight: 500;
	}

	.button-group {
		display: flex;
		gap: var(--spacing-1);
	}

	.buy-btn {
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border-color);
		color: var(--color-text-secondary);
		padding: var(--spacing-1) var(--spacing-2);
		font-size: var(--font-size-xs);
		font-family: var(--font-family-mono);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: all var(--duration-fast);
		min-width: 48px;
	}

	.buy-btn:hover:not(:disabled) {
		background-color: var(--color-accent, #4a9eff);
		border-color: var(--color-accent, #4a9eff);
		color: var(--color-bg-primary);
	}

	.buy-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.buy-btn.buy-one {
		flex: 1;
	}

	.buy-btn.buy-max {
		flex: 0 0 auto;
	}

	.maxed-footer {
		justify-content: center;
	}

	.producer-maxed {
		font-size: var(--font-size-xs);
		color: var(--color-success, #4ade80);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wider);
		font-weight: 500;
	}

	.placeholder-text {
		margin: 0;
		padding: var(--spacing-4);
		font-size: var(--font-size-sm);
		color: var(--color-text-dim);
		font-style: italic;
		text-align: center;
	}
</style>
