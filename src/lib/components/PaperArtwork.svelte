<script lang="ts">
	import { onMount } from 'svelte';

	const patterns = ['contours', 'rays', 'hatch', 'pinholes', 'frames', 'rules'] as const;
	const shapes = ['arch', 'ellipse', 'leaf', 'capsule', 'sheet'] as const;

	type Layout = 'hero' | 'panels';
	type Placement = {
		x: number;
		y: number;
		width: number;
		minWidth: number;
		height?: number;
		angle?: number;
		driftOnTouch?: boolean;
	};

	let { seed, layout = 'hero' }: { seed: number; layout?: Layout } = $props();
	const artwork = $derived(composePrint(seed, layout));
	let element: HTMLDivElement;
	let running = $state(false);

	onMount(() => {
		if (layout !== 'hero') return;
		const motion = matchMedia('(prefers-reduced-motion: no-preference)');
		let inView = false;
		function sync() {
			running = inView && motion.matches && !document.hidden;
		}
		const observer = new IntersectionObserver(([entry]) => {
			inView = entry.isIntersecting;
			sync();
		});
		observer.observe(element.closest('.hero') ?? element);
		motion.addEventListener('change', sync);
		document.addEventListener('visibilitychange', sync);
		return () => {
			observer.disconnect();
			motion.removeEventListener('change', sync);
			document.removeEventListener('visibilitychange', sync);
		};
	});

	function composePrint(seed: number, layout: Layout) {
		let state = seed;

		function range(min: number, max: number) {
			state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
			return min + (state / 2 ** 32) * (max - min);
		}

		const leftHeight = range(0, 1) < 0.5 ? range(23, 39) : range(61, 77);
		const rightHeight = 100 - leftHeight + range(-8, 8);
		const alignment = range(-12, 12);
		const availablePatterns = [...patterns];
		const availableShapes = [...shapes, shapes[Math.floor(range(0, shapes.length))]];

		const heroSlots = [
			{ x: range(5, 17), y: leftHeight, width: range(30, 43), minWidth: 148 },
			{ x: range(83, 96), y: rightHeight, width: range(30, 43), minWidth: 148 },
			{ x: range(17, 30), y: rightHeight, width: range(18, 29), minWidth: 96 },
			{ x: range(70, 83), y: leftHeight, width: range(18, 29), minWidth: 96 },
			{ x: range(2, 12), y: range(34, 68), width: range(8, 14), minWidth: 48, driftOnTouch: true },
			{ x: range(88, 98), y: range(34, 68), width: range(8, 14), minWidth: 48, driftOnTouch: true }
		];
		const slots: Placement[] =
			layout === 'panels'
				? [
						// A long print carries the same linework through the whole stack.
						{
							x: range(78, 88),
							y: range(47, 53),
							width: range(30, 40),
							minWidth: 148,
							height: range(115, 137),
							angle: range(-10, 8)
						},
						{ x: range(72, 80), y: range(12, 25), width: range(24, 33), minWidth: 116 },
						{ x: range(89, 97), y: range(29, 38), width: range(17, 23), minWidth: 90 },
						{ x: range(73, 82), y: range(47, 57), width: range(22, 30), minWidth: 95 },
						{ x: range(90, 98), y: range(66, 77), width: range(20, 27), minWidth: 88 },
						{ x: range(68, 81), y: range(82, 95), width: range(22, 30), minWidth: 104 }
					]
				: heroSlots;

		return {
			band: {
				y: layout === 'panels' ? 50 : range(0, 1) < 0.5 ? range(9, 22) : range(78, 91),
				angle: layout === 'panels' ? range(-6, 7) : alignment + range(-5, 5),
				spacing: range(10, 17)
			},
			plates: slots.map((slot) => ({
				...slot,
				pattern: availablePatterns.splice(Math.floor(range(0, availablePatterns.length)), 1)[0],
				shape: availableShapes.splice(Math.floor(range(0, availableShapes.length)), 1)[0],
				angle: slot.angle ?? alignment + range(-32, 32),
				ratio: range(0.84, 1.45),
				spacing: range(5, 10),
				rayStep: range(3.5, 8),
				focusX: range(28, 72),
				focusY: range(28, 72),
				strength: range(0.72, 0.99),
				driftX: range(0, 1) < 0.5 ? range(-23, -12) : range(12, 23),
				driftY: range(-12, 12),
				turn: range(-2, 2),
				duration: range(15, 27),
				delay: range(-15, -1)
			}))
		};
	}
</script>

<div
	class="artwork absolute inset-0"
	data-layout={layout}
	data-seed={seed}
	data-running={running}
	bind:this={element}
	aria-hidden="true"
>
	<div
		class="band absolute left-1/2 top-(--y) h-[clamp(1.5rem,5vw,4rem)] w-[120%] border-y border-(--faint-print)"
		style:--y="{artwork.band.y}%"
		style:--angle="{artwork.band.angle}deg"
		style:--print-spacing="{artwork.band.spacing}px"
	></div>
	{#each artwork.plates as plate (plate.pattern)}
		<div
			class="plate absolute left-(--x) top-(--y) aspect-(--ratio) h-[var(--height,auto)] w-[clamp(var(--min-width),var(--width),31rem)] rounded-lg border border-(--print-ink) opacity-(--ink-strength)"
			data-pattern={plate.pattern}
			data-shape={plate.shape}
			data-touch-drift={plate.driftOnTouch ? '' : undefined}
			style:--x="{plate.x}%"
			style:--y="{plate.y}%"
			style:--width="{plate.width}%"
			style:--min-width="{plate.minWidth}px"
			style:--height={plate.height === undefined ? undefined : `${plate.height}%`}
			style:--ratio={plate.ratio}
			style:--angle="{plate.angle}deg"
			style:--print-spacing="{plate.spacing}px"
			style:--ray-step="{plate.rayStep}deg"
			style:--focus-x="{plate.focusX}%"
			style:--focus-y="{plate.focusY}%"
			style:--ink-strength={plate.strength}
			style:--drift-x="{plate.driftX}px"
			style:--drift-y="{plate.driftY}px"
			style:--turn="{plate.turn}deg"
			style:--duration="{plate.duration}s"
			style:--delay="{plate.delay}s"
		></div>
	{/each}
</div>

<style lang="postcss">
	@reference '../../app.css';

	.artwork {
		--faint-print: color-mix(in srgb, var(--print-ink) 56%, transparent);
	}

	.band,
	.plate {
		rotate: var(--angle);
		translate: -50% -50%;
	}

	.band {
		background:
			linear-gradient(
				transparent calc(50% - 0.5px),
				var(--faint-print) calc(50% - 0.5px) calc(50% + 0.5px),
				transparent calc(50% + 0.5px)
			),
			repeating-linear-gradient(
				90deg,
				var(--faint-print) 0 1px,
				transparent 1px var(--print-spacing)
			);
	}

	.artwork[data-layout='panels'] .band {
		@apply left-[86%] h-[115%] w-[clamp(2.25rem,7%,5.75rem)] border;
		background: repeating-linear-gradient(
			var(--faint-print) 0 1px,
			transparent 1px var(--print-spacing)
		);
	}

	.plate[data-shape='arch'] {
		border-radius: 50% 50% 0.375rem 0.375rem;
	}

	.plate[data-shape='ellipse'] {
		border-radius: 50%;
	}

	.plate[data-shape='leaf'] {
		border-radius: 53% 0;
	}

	.plate[data-shape='capsule'] {
		aspect-ratio: calc(var(--ratio) * 1.7);
		border-radius: 100vmax;
	}

	.plate[data-pattern='contours'] {
		background-image: repeating-radial-gradient(
			circle at var(--focus-x) var(--focus-y),
			var(--print-ink) 0 1px,
			transparent 1px var(--print-spacing)
		);
	}

	.plate[data-pattern='rays'] {
		background-image: repeating-conic-gradient(
			from 18deg at var(--focus-x) var(--focus-y),
			var(--print-ink) 0 0.55deg,
			transparent 0.55deg var(--ray-step)
		);
	}

	.plate[data-pattern='hatch'] {
		background-image:
			repeating-linear-gradient(
				45deg,
				var(--faint-print) 0 1px,
				transparent 1px var(--print-spacing)
			),
			repeating-linear-gradient(
				-45deg,
				var(--faint-print) 0 1px,
				transparent 1px var(--print-spacing)
			);
	}

	.plate[data-pattern='pinholes'] {
		background-image: radial-gradient(circle, var(--print-ink) 0.7px, transparent 1.05px);
		background-size: var(--print-spacing) var(--print-spacing);
	}

	.plate[data-pattern='frames']::before,
	.plate[data-pattern='frames']::after {
		@apply absolute inset-(--print-spacing) rounded-[inherit] border border-(--print-ink) content-[''];
	}

	.plate[data-pattern='frames']::after {
		inset: calc(2 * var(--print-spacing));
	}

	.plate[data-pattern='rules'] {
		background-image: repeating-linear-gradient(
			0deg,
			var(--print-ink) 0 1px,
			transparent 1px var(--print-spacing)
		);
	}

	@media (prefers-reduced-motion: no-preference) {
		.artwork[data-layout='hero'] .plate {
			animation: drift var(--duration) ease-in-out var(--delay) infinite;
			animation-play-state: paused;
		}

		.artwork[data-layout='hero'][data-running='true'] .plate {
			animation-play-state: running;
			will-change: transform;
		}

		@media (pointer: coarse) {
			/* Keep the large gradient surfaces still on touch devices. */
			.artwork[data-layout='hero'] .plate:not([data-touch-drift]) {
				animation: none;
				will-change: auto;
			}

			:global(.hero[data-hero-contracting]) .artwork[data-running='true'] .plate {
				animation-play-state: paused;
				will-change: auto;
			}
		}
	}

	@keyframes drift {
		0%,
		100% {
			transform: none;
		}

		34% {
			transform: translate(var(--drift-x), var(--drift-y)) rotate(var(--turn));
		}

		67% {
			transform: translate(calc(-0.7 * var(--drift-x)), calc(-0.55 * var(--drift-y)))
				rotate(calc(-1 * var(--turn)));
		}
	}
</style>
