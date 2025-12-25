<script lang="ts">
	/**
	 * @fileoverview Achievement list component for the sidebar.
	 * Displays achievements organized by type/tier with expandable categories.
	 *
	 * @module components/ui/AchievementList
	 */

	import { getGameContext } from '$lib/engine';
	import {
		getAchievementTierColor,
		getTierDisplayName,
		isAchievementVisible,
		getAchievementDescription
	} from '$lib/engine/models/achievements';
	import type {
		AchievementDefinition,
		AchievementState,
		AchievementTier,
		AchievementType
	} from '$lib/engine/models/achievements';

	const game = getGameContext();

	// Category state
	let expandedCategories = $state<Set<string>>(new Set(['standard']));

	// Get all achievements grouped by type
	let achievementsByType = $derived.by(() => {
		const allAchievements = game.achievements.getAllAchievements();
		const grouped = new Map<AchievementType, Array<[AchievementDefinition, AchievementState]>>();

		for (const [def, state] of allAchievements) {
			if (!isAchievementVisible(def, state)) continue;

			if (!grouped.has(def.type)) {
				grouped.set(def.type, []);
			}
			grouped.get(def.type)!.push([def, state]);
		}

		// Sort within each group by tier and name
		for (const [type, achievements] of grouped.entries()) {
			achievements.sort((a, b) => {
				const tierOrder: Record<AchievementTier, number> = {
					common: 1,
					uncommon: 2,
					rare: 3,
					epic: 4,
					legendary: 5,
					secret: 6
				};

				const tierCompare = tierOrder[a[0].tier] - tierOrder[b[0].tier];
				if (tierCompare !== 0) return tierCompare;

				return a[0].name.localeCompare(b[0].name);
			});
		}

		return grouped;
	});

	/**
	 * Toggle category expansion
	 */
	function toggleCategory(category: string): void {
		if (expandedCategories.has(category)) {
			expandedCategories.delete(category);
		} else {
			expandedCategories.add(category);
		}
		// Force reactivity
		expandedCategories = new Set(expandedCategories);
	}

	/**
	 * Get display name for achievement type
	 */
	function getTypeDisplayName(type: AchievementType): string {
		switch (type) {
			case 'standard':
				return 'Achievements';
			case 'secret':
				return 'Secrets';
			case 'ending':
				return 'Endings';
			default:
				return type;
		}
	}

	/**
	 * Get icon for achievement type
	 */
	function getTypeIcon(type: AchievementType): string {
		switch (type) {
			case 'standard':
				return '🏆';
			case 'secret':
				return '🔒';
			case 'ending':
				return '⭐';
			default:
				return '❓';
		}
	}

	/**
	 * Format progress percentage
	 */
	function formatProgress(progress: number): string {
		return `${Math.floor(progress * 100)}%`;
	}

	/**
	 * Get reward display text
	 */
	function getRewardText(def: AchievementDefinition): string {
		const rewards: string[] = [];

		if (def.reward.pp) {
			rewards.push(`+${def.reward.pp} PP`);
		}
		if (def.reward.unlock) {
			rewards.push(`Unlock: ${def.reward.unlock}`);
		}
		if (def.reward.cosmetic) {
			rewards.push(`Cosmetic`);
		}
		if (def.reward.title) {
			rewards.push(`Title`);
		}
		if (def.reward.badge) {
			rewards.push(`Badge`);
		}

		return rewards.length > 0 ? rewards.join(', ') : 'No reward';
	}
</script>

<div class="achievement-list">
	{#each Array.from(achievementsByType.entries()) as [type, achievements]}
		{@const isExpanded = expandedCategories.has(type)}
		{@const unlockedCount = achievements.filter(([, state]) => state.unlocked).length}

		<div class="category-section">
			<button
				class="category-header"
				class:expanded={isExpanded}
				onclick={() => toggleCategory(type)}
			>
				<span class="category-icon">{getTypeIcon(type)}</span>
				<span class="category-name">{getTypeDisplayName(type)}</span>
				<span class="category-count">{unlockedCount}/{achievements.length}</span>
				<span class="expand-indicator">{isExpanded ? '▼' : '▶'}</span>
			</button>

			{#if isExpanded}
				<div class="category-content">
					{#each achievements as [def, state] (def.id)}
						{@const tierColor = getAchievementTierColor(def.tier)}
						{@const isNewUnlock = game.achievements.isNewUnlock(def.id)}

						<div
							class="achievement-card"
							class:unlocked={state.unlocked}
							class:new-unlock={isNewUnlock}
							class:hidden={def.hidden && !state.unlocked}
							style="--tier-color: {tierColor}"
						>
							<div class="achievement-header">
								<div class="achievement-title-row">
									{#if def.icon}
										<span class="achievement-icon">{def.icon}</span>
									{/if}
									<div class="achievement-title-info">
										<span class="achievement-name">
											{state.unlocked || !def.hidden ? def.name : '???'}
										</span>
										<span class="achievement-tier" style="color: {tierColor}">
											{getTierDisplayName(def.tier)}
										</span>
									</div>
								</div>
								{#if state.unlocked}
									<span class="unlock-badge">✓</span>
								{/if}
							</div>

							<p class="achievement-desc">
								{getAchievementDescription(def, state)}
							</p>

							{#if state.unlocked && def.flavorText}
								<p class="achievement-flavor">{def.flavorText}</p>
							{/if}

							{#if !state.unlocked && state.progress > 0 && state.progress < 1}
								<div class="progress-section">
									<div class="progress-bar-container">
										<div class="progress-bar-fill" style="width: {state.progress * 100}%"></div>
									</div>
									<span class="progress-text">{formatProgress(state.progress)}</span>
								</div>
							{/if}

							<div class="achievement-footer">
								{#if state.unlocked}
									<span class="reward-text unlocked-reward">
										{getRewardText(def)}
									</span>
									{#if state.unlockedAt}
										<span class="unlock-date">
											{new Date(state.unlockedAt).toLocaleDateString()}
										</span>
									{/if}
								{:else}
									<span class="reward-text locked-reward">
										Reward: {getRewardText(def)}
									</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/each}

	{#if achievementsByType.size === 0}
		<p class="placeholder-text">
			No achievements visible yet. Complete actions to unlock them!
		</p>
	{/if}
</div>

<style>
	.achievement-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-3);
	}

	/* Category Section */
	.category-section {
		display: flex;
		flex-direction: column;
	}

	.category-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		padding: var(--spacing-2);
		background-color: var(--color-bg-tertiary);
		border: 1px solid var(--color-border-color);
		border-radius: var(--radius-sm);
		color: var(--color-text-primary);
		font-family: var(--font-family-mono);
		font-size: var(--font-size-sm);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
		cursor: pointer;
		transition: background-color var(--duration-fast);
		width: 100%;
	}

	.category-header:hover {
		background-color: var(--color-bg-elevated);
	}

	.category-header.expanded {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.category-icon {
		font-size: var(--font-size-md);
	}

	.category-name {
		flex: 1;
	}

	.category-count {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
	}

	.expand-indicator {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
	}

	.category-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
		padding: var(--spacing-2);
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border-color);
		border-top: none;
		border-bottom-left-radius: var(--radius-sm);
		border-bottom-right-radius: var(--radius-sm);
	}

	/* Achievement Card */
	.achievement-card {
		background-color: var(--color-bg-tertiary);
		border: 1px solid var(--color-border-color);
		border-left: 3px solid var(--tier-color, var(--color-border-color));
		border-radius: var(--radius-sm);
		padding: var(--spacing-3);
		transition: all var(--duration-fast);
	}

	.achievement-card.unlocked {
		background-color: rgba(74, 158, 255, 0.05);
	}

	.achievement-card.new-unlock {
		animation: pulse 2s ease-in-out infinite;
	}

	.achievement-card.hidden {
		opacity: 0.6;
	}

	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 var(--tier-color);
		}
		50% {
			box-shadow: 0 0 8px 2px var(--tier-color);
		}
	}

	.achievement-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--spacing-2);
	}

	.achievement-title-row {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-2);
		flex: 1;
	}

	.achievement-icon {
		font-size: var(--font-size-lg);
		line-height: 1;
	}

	.achievement-title-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
	}

	.achievement-name {
		font-size: var(--font-size-sm);
		color: var(--color-text-primary);
		font-weight: 500;
	}

	.achievement-tier {
		font-size: var(--font-size-xs);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
		font-weight: 500;
	}

	.unlock-badge {
		font-size: var(--font-size-lg);
		color: var(--color-success, #4ade80);
		line-height: 1;
	}

	.achievement-desc {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		margin: 0 0 var(--spacing-2);
		line-height: 1.4;
	}

	.achievement-flavor {
		font-size: var(--font-size-xs);
		color: var(--color-text-dim);
		font-style: italic;
		margin: 0 0 var(--spacing-2);
		line-height: 1.4;
		padding: var(--spacing-2);
		background-color: rgba(0, 0, 0, 0.2);
		border-left: 2px solid var(--tier-color, var(--color-border-color));
		border-radius: var(--radius-sm);
	}

	/* Progress Bar */
	.progress-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-1);
		margin-bottom: var(--spacing-2);
	}

	.progress-bar-container {
		height: 6px;
		background-color: var(--color-bg-secondary);
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-bar-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-accent, #4a9eff), var(--tier-color));
		border-radius: 3px;
		transition: width var(--duration-normal);
	}

	.progress-text {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	/* Footer */
	.achievement-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-2);
	}

	.reward-text {
		font-size: var(--font-size-xs);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
	}

	.unlocked-reward {
		color: var(--color-success, #4ade80);
	}

	.locked-reward {
		color: var(--color-text-dim);
	}

	.unlock-date {
		font-size: var(--font-size-xs);
		color: var(--color-text-dim);
		font-variant-numeric: tabular-nums;
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
