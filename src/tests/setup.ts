/**
 * @fileoverview Vitest setup file.
 * Configures the testing environment before tests run.
 */

// Mock localStorage for Node environment
if (typeof localStorage === 'undefined') {
	const store: Record<string, string> = {};

	global.localStorage = {
		getItem: (key: string) => store[key] ?? null,
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			Object.keys(store).forEach(key => delete store[key]);
		},
		key: (index: number) => Object.keys(store)[index] ?? null,
		get length() {
			return Object.keys(store).length;
		}
	};
}

// Mock performance.now for Node
if (typeof performance === 'undefined') {
	global.performance = {
		now: () => Date.now()
	} as Performance;
}

// Mock requestAnimationFrame
if (typeof requestAnimationFrame === 'undefined') {
	global.requestAnimationFrame = (callback: FrameRequestCallback) => {
		return setTimeout(() => callback(performance.now()), 16) as unknown as number;
	};
}

if (typeof cancelAnimationFrame === 'undefined') {
	global.cancelAnimationFrame = (id: number) => {
		clearTimeout(id);
	};
}

// Mock document.hidden
if (typeof document !== 'undefined' && typeof document.hidden === 'undefined') {
	Object.defineProperty(document, 'hidden', {
		value: false,
		writable: true
	});
}
