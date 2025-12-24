<script lang="ts">
	/**
	 * @fileoverview Starfield background effect for cosmic phases.
	 * Creates an animated starfield with parallax depth layers.
	 *
	 * @module components/effects/Starfield
	 */

	import { onMount } from 'svelte';

	interface Star {
		x: number;
		y: number;
		size: number;
		opacity: number;
		speed: number;
		layer: number;
	}

	interface Props {
		/** Number of stars */
		count?: number;
		/** Number of depth layers */
		layers?: number;
		/** Base movement speed */
		speed?: number;
		/** Star color */
		color?: string;
		/** Whether stars are moving */
		animated?: boolean;
		/** Direction of movement (degrees, 0 = right) */
		direction?: number;
		/** Whether to include twinkling effect */
		twinkle?: boolean;
		/** Additional CSS classes */
		class?: string;
	}

	let {
		count = 100,
		layers = 3,
		speed = 0.5,
		color = '#ffffff',
		animated = true,
		direction = 270, // Moving up by default
		twinkle = true,
		class: className = ''
	}: Props = $props();

	/** Canvas element reference */
	let canvas: HTMLCanvasElement;

	/** Canvas rendering context */
	let ctx: CanvasRenderingContext2D | null = null;

	/** Array of star objects */
	let stars: Star[] = $state([]);

	/** Animation frame ID */
	let animationId: number | null = null;

	/** Canvas dimensions */
	let width = $state(0);
	let height = $state(0);

	/**
	 * Generate stars with random positions and properties.
	 */
	function generateStars(): void {
		stars = [];
		for (let i = 0; i < count; i++) {
			const layer = Math.floor(Math.random() * layers) + 1;
			stars.push({
				x: Math.random() * width,
				y: Math.random() * height,
				size: (Math.random() * 2 + 0.5) * (layer / layers),
				opacity: Math.random() * 0.5 + 0.3,
				speed: speed * (layer / layers),
				layer
			});
		}
	}

	/**
	 * Draw a single star.
	 */
	function drawStar(star: Star): void {
		if (!ctx) return;

		const twinkleOffset = twinkle ? Math.sin(Date.now() * 0.003 + star.x) * 0.3 : 0;
		const alpha = Math.max(0.1, Math.min(1, star.opacity + twinkleOffset));

		ctx.beginPath();
		ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
		ctx.fillStyle = color;
		ctx.globalAlpha = alpha;
		ctx.fill();
	}

	/**
	 * Update star positions.
	 */
	function updateStars(): void {
		const radians = (direction * Math.PI) / 180;
		const dx = Math.cos(radians);
		const dy = Math.sin(radians);

		for (const star of stars) {
			star.x += dx * star.speed;
			star.y += dy * star.speed;

			// Wrap around screen
			if (star.x < 0) star.x = width;
			if (star.x > width) star.x = 0;
			if (star.y < 0) star.y = height;
			if (star.y > height) star.y = 0;
		}
	}

	/**
	 * Render frame.
	 */
	function render(): void {
		if (!ctx) return;

		// Clear canvas
		ctx.clearRect(0, 0, width, height);

		// Draw stars by layer (back to front)
		for (let layer = 1; layer <= layers; layer++) {
			for (const star of stars) {
				if (star.layer === layer) {
					drawStar(star);
				}
			}
		}

		ctx.globalAlpha = 1;
	}

	/**
	 * Animation loop.
	 */
	function animate(): void {
		if (animated) {
			updateStars();
		}
		render();
		animationId = requestAnimationFrame(animate);
	}

	/**
	 * Handle canvas resize.
	 */
	function handleResize(): void {
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		width = rect.width;
		height = rect.height;

		// Set canvas resolution
		canvas.width = width * window.devicePixelRatio;
		canvas.height = height * window.devicePixelRatio;

		if (ctx) {
			ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
		}

		generateStars();
	}

	// Initialize on mount
	onMount(() => {
		ctx = canvas.getContext('2d');
		handleResize();
		animate();

		// Handle window resize
		const resizeObserver = new ResizeObserver(() => handleResize());
		resizeObserver.observe(canvas);

		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
			resizeObserver.disconnect();
		};
	});
</script>

<canvas bind:this={canvas} class="starfield {className}"></canvas>

<style>
	.starfield {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 0;
	}
</style>
