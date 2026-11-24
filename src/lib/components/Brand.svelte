<script lang="ts">
	import { resolve } from '$app/paths';
	import RandwareLogo from '#lib/assets/icons/RandwareLogo.svelte';

	let { size = 44, showName = true }: { size?: number; showName?: boolean } = $props();
</script>

<a
	class={[
		'inline-flex min-h-11 w-fit items-center gap-[var(--brand-gap,0.625rem)] whitespace-nowrap [&_svg]:shrink-0',
		'font-serif text-[length:var(--brand-size,1.1875rem)] font-bold tracking-[-0.04em] text-[color:var(--brand-color,var(--ink))]'
	]}
	href={resolve('/')}
	aria-label="Randware home"
>
	<RandwareLogo {size} />
	{#if showName}<span>Randware</span>{/if}
</a>
