/**
 * @fileoverview Unit tests for EventManager.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventManager } from '$lib/engine/core/EventManager';
import { D } from '$lib/engine/utils/decimal';

describe('EventManager', () => {
	let events: EventManager;

	beforeEach(() => {
		events = new EventManager();
	});

	describe('Basic Subscription', () => {
		it('should subscribe to events', () => {
			const callback = vi.fn();
			events.on('game_initialized', callback);
			expect(events.listenerCount('game_initialized')).toBe(1);
		});

		it('should emit events to subscribers', () => {
			const callback = vi.fn();
			events.on('game_initialized', callback);

			events.emit('game_initialized', {
				timestamp: Date.now(),
				isNewGame: true
			});

			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenCalledWith(
				expect.objectContaining({ isNewGame: true })
			);
		});

		it('should unsubscribe correctly', () => {
			const callback = vi.fn();
			const unsubscribe = events.on('game_initialized', callback);

			unsubscribe();

			events.emit('game_initialized', {
				timestamp: Date.now(),
				isNewGame: true
			});

			expect(callback).not.toHaveBeenCalled();
			expect(events.listenerCount('game_initialized')).toBe(0);
		});
	});

	describe('One-time Subscriptions', () => {
		it('should only fire once with once()', () => {
			const callback = vi.fn();
			events.once('game_initialized', callback);

			events.emit('game_initialized', { timestamp: Date.now(), isNewGame: true });
			events.emit('game_initialized', { timestamp: Date.now(), isNewGame: false });

			expect(callback).toHaveBeenCalledTimes(1);
		});

		it('should only fire once with { once: true }', () => {
			const callback = vi.fn();
			events.on('game_initialized', callback, { once: true });

			events.emit('game_initialized', { timestamp: Date.now(), isNewGame: true });
			events.emit('game_initialized', { timestamp: Date.now(), isNewGame: false });

			expect(callback).toHaveBeenCalledTimes(1);
		});
	});

	describe('Priority Handling', () => {
		it('should call high priority listeners first', () => {
			const order: number[] = [];

			events.on('game_initialized', () => order.push(1), { priority: 1 });
			events.on('game_initialized', () => order.push(10), { priority: 10 });
			events.on('game_initialized', () => order.push(5), { priority: 5 });

			events.emit('game_initialized', { timestamp: Date.now(), isNewGame: true });

			expect(order).toEqual([10, 5, 1]);
		});
	});

	describe('Multiple Subscribers', () => {
		it('should notify all subscribers', () => {
			const callback1 = vi.fn();
			const callback2 = vi.fn();
			const callback3 = vi.fn();

			events.on('game_initialized', callback1);
			events.on('game_initialized', callback2);
			events.on('game_initialized', callback3);

			events.emit('game_initialized', { timestamp: Date.now(), isNewGame: true });

			expect(callback1).toHaveBeenCalledTimes(1);
			expect(callback2).toHaveBeenCalledTimes(1);
			expect(callback3).toHaveBeenCalledTimes(1);
		});
	});

	describe('Resource Events', () => {
		it('should handle resource_changed events correctly', () => {
			const callback = vi.fn();
			events.on('resource_changed', callback);

			events.emit('resource_changed', {
				resourceId: 'pixels',
				previousAmount: D(100),
				newAmount: D(150),
				delta: D(50),
				source: 'production'
			});

			expect(callback).toHaveBeenCalledWith(
				expect.objectContaining({
					resourceId: 'pixels',
					source: 'production'
				})
			);
		});
	});

	describe('Cleanup', () => {
		it('should clear specific event listeners', () => {
			events.on('game_initialized', vi.fn());
			events.on('game_initialized', vi.fn());
			events.on('game_paused', vi.fn());

			events.off('game_initialized');

			expect(events.listenerCount('game_initialized')).toBe(0);
			expect(events.listenerCount('game_paused')).toBe(1);
		});

		it('should clear all listeners', () => {
			events.on('game_initialized', vi.fn());
			events.on('game_paused', vi.fn());
			events.on('game_resumed', vi.fn());

			events.clear();

			expect(events.getRegisteredEvents()).toHaveLength(0);
		});
	});

	describe('Error Handling', () => {
		it('should not crash when listener throws', () => {
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

			events.on('game_initialized', () => {
				throw new Error('Test error');
			});
			events.on('game_initialized', vi.fn());

			expect(() => {
				events.emit('game_initialized', { timestamp: Date.now(), isNewGame: true });
			}).not.toThrow();

			consoleSpy.mockRestore();
		});
	});

	describe('Event Count', () => {
		it('should track event count', () => {
			expect(events.getEventCount()).toBe(0);

			events.emit('game_initialized', { timestamp: Date.now(), isNewGame: true });
			events.emit('game_initialized', { timestamp: Date.now(), isNewGame: true });
			events.emit('game_paused', { reason: 'user', timestamp: Date.now() });

			expect(events.getEventCount()).toBe(3);
		});
	});

	describe('Debug Mode', () => {
		it('should toggle debug mode', () => {
			expect(events.isDebugEnabled()).toBe(false);

			events.setDebug(true);
			expect(events.isDebugEnabled()).toBe(true);

			events.setDebug(false);
			expect(events.isDebugEnabled()).toBe(false);
		});
	});

	describe('waitFor', () => {
		it('should wait for an event', async () => {
			setTimeout(() => {
				events.emit('game_initialized', {
					timestamp: Date.now(),
					isNewGame: true
				});
			}, 10);

			const result = await events.waitFor('game_initialized');
			expect(result.isNewGame).toBe(true);
		});

		it('should timeout when event is not emitted', async () => {
			await expect(
				events.waitFor('game_initialized', 50)
			).rejects.toThrow('Timeout');
		});
	});
});
