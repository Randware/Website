<script lang="ts">
	import type { SocialLink } from '#lib/links.js';
	import LinkCollection from './LinkCollection.svelte';

	let { name, avatar, links }: { name: string; avatar: string; links: SocialLink[] } = $props();
</script>

<article class="paper-panel h-full min-w-0 p-[clamp(1.125rem,2.5vw,1.5rem)]">
	<div class="mb-3.5 flex flex-wrap items-center gap-x-4 gap-y-3">
		<img
			class="size-18 rounded-paper border border-line object-cover"
			src={avatar}
			alt=""
			width="72"
			height="72"
		/>
		<h3 class="text-[1.625rem]">{name}</h3>
	</div>

	<LinkCollection {links} label="{name} profiles" />
</article>
