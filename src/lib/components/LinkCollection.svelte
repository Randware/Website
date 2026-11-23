<script lang="ts">
	import { ArrowUpRight } from 'lucide-svelte';
	import type { SocialLink } from '#lib/links.js';

	let { links, label }: { links: SocialLink[]; label: string } = $props();
</script>

<ul aria-label={label}>
	{#each links as { name, url, icon: Icon } (url)}
		<li>
			<a href={url}>
				<Icon size={19} strokeWidth={1.65} aria-hidden="true" />
				<span>{name}</span>
				<ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
			</a>
		</li>
	{/each}
</ul>

<style>
	li + li {
		border-top: 1px solid var(--line);
	}

	a {
		display: grid;
		min-height: 2.875rem;
		grid-template-columns: 1.25rem 1fr auto;
		align-items: center;
		gap: 0.75rem;
		color: var(--ink);
		font-size: 0.9375rem;
	}

	a :global(svg) {
		color: var(--accent);
	}

	a:hover span {
		color: var(--accent);
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
</style>
