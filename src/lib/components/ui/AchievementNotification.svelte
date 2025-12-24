<script lang="ts">
	/**
	 * @fileoverview AchievementNotification component for displaying achievement unlocks.
	 * Shows toast notifications when achievements are unlocked.
	 *
	 * @module components/ui/AchievementNotification
	 */

	import { fly, fade } from 'svelte/transition';
	import { getGameContext } from '$lib/engine';
	import { getAchievementTierColor, getTierDisplayName } from '$lib/engine/models/achievements';
	import type { AchievementNotification as NotificationType } from '$lib/engine/systems/AchievementManager.svelte';

	interface Props {
		/** Maximum visible notifications */
		maxVisible?: number;
		/** Auto-dismiss time in milliseconds */
		autoDismissTime?: number;
		/** Position on screen */
		position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
		/** Additional CSS classes */
		class?: string;
	}

	let {
		maxVisible = 3,
		autoDismissTime = 5000,
		position = 'top-right',
		class: className = ''
	}: Props = $props();

	const game = getGameContext();

	/** Active notifications to display */
	let activeNotifications = $state<NotificationType[]>([]);

	/** Check for new notifications periodically */
	$effect(() => {
		const interval = setInterval(() => {
			const next = game.achievements.getNextNotification();
			if (next && !next.shown && activeNotifications.length < maxVisible) {
				// Mark as shown
				game.achievements.markNotificationShown(next.timestamp);

				// Add to active list
				activeNotifications = [...activeNotifications, next];

				// Schedule auto-dismiss
				setTimeout(() => {
					dismissNotification(next.timestamp);
				}, autoDismissTime);
			}
		}, 200);

		return () => clearInterval(interval);
	});

	/**
	 * Dismiss a notification.
	 */
	function dismissNotification(timestamp: number): void {
		activeNotifications = activeNotifications.filter((n) => n.timestamp !== timestamp);
	}

	/**
	 * Get position classes.
	 */
	function getPositionClasses(): string {
		switch (position) {
			case 'top-right':
				return 'position-top position-right';
			case 'top-left':
				return 'position-top position-left';
			case 'bottom-right':
				return 'position-bottom position-right';
			case 'bottom-left':
				return 'position-bottom position-left';
			default:
				return 'position-top position-right';
		}
	}
</script>

<div class="notification-container {getPositionClasses()} {className}">
	{#each activeNotifications as notification (notification.timestamp)}
		{@const achievement = notification.achievement}
		{@const tierColor = getAchievementTierColor(achievement.tier)}
		<div
			class="notification"
			class:batch={notification.isBatch}
			style="--tier-color: {tierColor}"
			in:fly={{ x: position.includes('right') ? 100 : -100, duration: 300 }}
			out:fade={{ duration: 200 }}
		>
			<button
				class="notification-close"
				onclick={() => dismissNotification(notification.timestamp)}
				aria-label="Dismiss"
			>
				×
			</button>

			<div class="notification-icon">
				{#if achievement.type === 'secret'}
					<span class="icon-secret">?</span>
				{:else if achievement.type === 'ending'}
					<span class="icon-ending">★</span>
				{:else}
					<span class="icon-standard">✓</span>
				{/if}
			</div>

			<div class="notification-content">
				<div class="notification-header">
					<span class="notification-label">Achievement Unlocked!</span>
					{#if notification.isBatch && notification.batchCount && notification.batchCount > 1}
						<span class="notification-batch">+{notification.batchCount - 1} more</span>
					{/if}
				</div>

				<h4 class="notification-title">{achievement.name}</h4>

				{#if achievement.description}
					<p class="notification-description">{achievement.description}</p>
				{/if}

				<div class="notification-meta">
					<span class="notification-tier">{getTierDisplayName(achievement.tier)}</span>
					{#if achievement.reward.pp}
						<span class="notification-reward">+{achievement.reward.pp} PP</span>
					{/if}
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.notification-container {
		position: fixed;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
		z-index: var(--z-notification);
		max-width: 320px;
		width: 100%;
		padding: var(--spacing-4);
		pointer-events: none;
	}

	/* Position variants */
	.position-top {
		top: 0;
	}

	.position-bottom {
		bottom: 0;
		flex-direction: column-reverse;
	}

	.position-right {
		right: 0;
	}

	.position-left {
		left: 0;
	}

	.notification {
		display: flex;
		gap: var(--spacing-3);
		padding: var(--spacing-4);
		background-color: var(--color-bg-surface);
		border: var(--border-width) solid var(--tier-color);
		border-radius: var(--radius-md);
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.5), 0 0 10px var(--tier-color);
		pointer-events: all;
		position: relative;
		animation: notification-glow 2s var(--easing-in-out) infinite;
	}

	.notification-close {
		position: absolute;
		top: var(--spacing-2);
		right: var(--spacing-2);
		background: transparent;
		border: none;
		color: var(--color-text-muted);
		font-size: var(--font-size-md);
		cursor: pointer;
		padding: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.5;
		transition: opacity var(--duration-fast);
	}

	.notification-close:hover {
		opacity: 1;
	}

	.notification-icon {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-bg-tertiary);
		border: var(--border-width) solid var(--tier-color);
		border-radius: var(--radius-sm);
		flex-shrink: 0;
	}

	.icon-secret,
	.icon-ending,
	.icon-standard {
		font-size: var(--font-size-lg);
		color: var(--tier-color);
	}

	.notification-content {
		flex: 1;
		min-width: 0;
	}

	.notification-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		margin-bottom: var(--spacing-1);
	}

	.notification-label {
		font-size: var(--font-size-xs);
		color: var(--tier-color);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
	}

	.notification-batch {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
	}

	.notification-title {
		margin: 0;
		font-size: var(--font-size-base);
		font-weight: normal;
		color: var(--color-text-primary);
	}

	.notification-description {
		margin: var(--spacing-1) 0 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.notification-meta {
		display: flex;
		align-items: center;
		gap: var(--spacing-3);
		margin-top: var(--spacing-2);
	}

	.notification-tier {
		font-size: var(--font-size-xs);
		color: var(--tier-color);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-wide);
	}

	.notification-reward {
		font-size: var(--font-size-sm);
		color: var(--color-success);
	}

	@keyframes notification-glow {
		0%,
		100% {
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.3), 0 0 5px var(--tier-color);
		}
		50% {
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.3), 0 0 15px var(--tier-color);
		}
	}

	/* Responsive */
	@media (max-width: 640px) {
		.notification-container {
			max-width: 100%;
			padding: var(--spacing-2);
		}

		.notification {
			padding: var(--spacing-3);
		}

		.notification-icon {
			width: 32px;
			height: 32px;
		}
	}
</style>
