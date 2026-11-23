<script lang="ts">
	import { projectSeed } from '#lib/projects.js';

	let { name, artworkTimestamp }: { name: string; artworkTimestamp: number } = $props();
	const seed = $derived(projectSeed(name, artworkTimestamp));
	const plates = $derived(
		Array.from({ length: 3 }, (_, index) => {
			const bits = seed >>> (index * 8);
			const x = 36 + index * 20 + ((bits >>> 2) % 15) - 7;
			const y = 30 + ((bits >>> 7) % 43);
			return {
				shape: bits % 4,
				x,
				y,
				size: 23 + ((bits >>> 12) % 16),
				angle: ((bits >>> 16) % 61) - 30,
				spreadX: (x - 56) * 0.88,
				spreadY: (y - 50) * 0.48 + (y < 50 ? -5 : 5)
			};
		})
	);
</script>

<div
	class="project-print"
	data-stock={seed % 3}
	style:--print-step="{6 + ((seed >>> 24) % 5)}px"
	aria-hidden="true"
>
	{#each plates as plate, index (index)}
		<span
			class="plate"
			data-shape={plate.shape}
			style:--x="{plate.x}%"
			style:--y="{plate.y}%"
			style:--size="{plate.size}%"
			style:--angle="{plate.angle}deg"
			style:--spread-x="{plate.spreadX}px"
			style:--spread-y="{plate.spreadY}px"
		></span>
	{/each}
</div>

<style>
	.project-print {
		--print-light: color-mix(in srgb, var(--ink) 9%, transparent);
		--print-mid: color-mix(in srgb, var(--ink) 19%, transparent);
		--print-dark: color-mix(in srgb, var(--ink) 33%, transparent);

		position: absolute;
		z-index: -1;
		inset: 0;
		overflow: hidden;
		border-radius: inherit;
		background-color: var(--wash);
		background-image: radial-gradient(circle, var(--print-mid) 0.6px, transparent 0.9px);
		background-size: var(--print-step) var(--print-step);
		pointer-events: none;
	}

	.project-print[data-stock='1'] {
		background-image: linear-gradient(var(--print-light) 1px, transparent 1px);
	}

	.project-print[data-stock='2'] {
		background-image:
			linear-gradient(var(--print-light) 1px, transparent 1px),
			linear-gradient(90deg, var(--print-light) 1px, transparent 1px);
	}

	.plate {
		--spread: var(--project-plate-spread, 0);

		position: absolute;
		top: var(--y);
		left: var(--x);
		width: var(--size);
		aspect-ratio: 1;
		border: 1px solid var(--print-dark);
		border-radius: 50%;
		background: repeating-linear-gradient(45deg, var(--print-mid) 0 1px, transparent 1px 5px);
		transform: translate(
				calc(-50% + var(--spread-x) * var(--spread)),
				calc(-50% + var(--spread-y) * var(--spread))
			)
			rotate(var(--angle)) scale(calc(1 + 0.16 * var(--spread)));
	}

	.plate[data-shape='1'] {
		border-radius: 0.75rem;
		background: var(--print-light);
		box-shadow: inset 0 0 0 4px var(--print-mid);
	}

	.plate[data-shape='2'] {
		background: repeating-radial-gradient(circle, var(--print-dark) 0 1px, transparent 1px 7px);
	}

	.plate[data-shape='3'] {
		border-radius: 50% 0;
		background: repeating-linear-gradient(90deg, var(--print-mid) 0 1px, transparent 1px 6px);
	}

	@media (prefers-reduced-motion: no-preference) {
		.plate {
			transition: transform 440ms cubic-bezier(0.19, 0.75, 0.24, 1);
		}
	}
</style>
