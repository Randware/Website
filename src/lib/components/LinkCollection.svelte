<script lang="ts">
	import {
		ArrowUpRight,
		Codepen,
		Container,
		Github,
		Gitlab,
		Link,
		Linkedin,
		Twitch,
		Youtube
	} from 'lucide-svelte';
	import type { ContactLink } from '#lib/contact.js';

	let {
		links,
		label,
		footer = false
	}: { links: ContactLink[]; label: string; footer?: boolean } = $props();
	const glyphs = {
		codepen: Codepen,
		container: Container,
		github: Github,
		gitlab: Gitlab,
		link: Link,
		linkedin: Linkedin,
		twitch: Twitch,
		youtube: Youtube
	};
</script>

<ul
	class={footer
		? 'flex flex-wrap justify-between gap-x-4 [@media(max-width:44rem)]:grid [@media(max-width:44rem)]:grid-cols-2'
		: 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,6.5rem),1fr))] gap-x-3'}
	aria-label={label}
>
	{#each links as { name, url, icon } (url)}
		<li class="flex min-w-0">
			<a
				class="inline-flex min-h-11 min-w-0 items-center gap-2 text-sm font-medium leading-snug underline-offset-[0.2em] hover:underline"
				href={url}
				target="_blank"
				rel="noopener"
				title={name.length > 18 ? name : undefined}
			>
				{#if typeof icon === 'object'}
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="shrink-0"
						aria-hidden="true"
					>
						<path d={icon.path} />
					</svg>
				{:else}
					{@const Glyph = glyphs[icon]}
					<Glyph size={16} strokeWidth={1.7} class="shrink-0" aria-hidden="true" />
				{/if}
				<span class="line-clamp-2 min-w-0 wrap-anywhere">{name}</span>
				{#if footer}
					<ArrowUpRight
						class="shrink-0 opacity-75 [@media(max-width:24rem)]:hidden"
						size={12}
						strokeWidth={1.75}
						aria-hidden="true"
					/>
				{/if}
			</a>
		</li>
	{/each}
</ul>
