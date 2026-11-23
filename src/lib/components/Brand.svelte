<script lang="ts">
	import { resolve } from '$app/paths';
	import RandwareLogo from '#lib/assets/icons/RandwareLogo.svelte';

	let { size = 44, showName = true }: { size?: number; showName?: boolean } = $props();
</script>

<a class="brand" href={resolve('/')} aria-label="Randware home">
	<RandwareLogo {size} />
	{#if showName}<span>Randware</span>{/if}
</a>

<style>
	.brand {
		display: inline-flex;
		min-height: 2.75rem;
		width: fit-content;
		align-items: center;
		gap: var(--brand-gap, 0.625rem);
		color: var(--brand-color, var(--ink));
		font-family: var(--serif);
		font-size: var(--brand-size, 1.1875rem);
		font-weight: 700;
		letter-spacing: -0.04em;
		white-space: nowrap;
	}

	.brand :global(svg) {
		flex-shrink: 0;
	}
</style>
