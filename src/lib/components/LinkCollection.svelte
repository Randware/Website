<script lang="ts">
	//  TODO: Create LinkCollection, UserLinkCollection (with profile picture), (maybe) FooterLinkCollection

	import { type Icon } from 'lucide-svelte';

	interface Link {
		name: string;
		url: string;
		icon?: typeof Icon;
	}

	export let heading: string | undefined = undefined;
	export let links: Link[];
</script>

<div class="flex flex-col items-center gap-2">
	{#if heading}
		<div class="text-2xl font-semibold">
			{heading}
		</div>
	{/if}

	<div class="flex flex-col items-center gap-1">
		{#each links as link}
			<a href={link.url} target="_blank" class="flex w-full items-center gap-4">
				{#if link.icon}
					{@const Icon = link.icon}
					<Icon size={24} />
				{/if}

				<div class="mx-auto text-xl underline">{link.name}</div>
			</a>
		{/each}
	</div>
</div>
