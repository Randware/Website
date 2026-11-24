<script lang="ts">
	import { ArrowUpRight } from 'lucide-svelte';
	import type { SocialLink } from '#lib/links.js';

	let { links, label }: { links: SocialLink[]; label: string } = $props();
</script>

<ul class="divide-y divide-line" aria-label={label}>
	{#each links as { name, url, icon: Icon } (url)}
		<li>
			<a
				class="group grid min-h-[2.875rem] grid-cols-[1.25rem_1fr_auto] items-center gap-3 text-[0.9375rem] text-ink [&_svg]:text-accent"
				href={url}
			>
				<Icon size={19} strokeWidth={1.65} aria-hidden="true" />
				<span class="underline-offset-[0.2em] group-hover:text-accent group-hover:underline">
					{name}
				</span>
				<ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
			</a>
		</li>
	{/each}
</ul>
