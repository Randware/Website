<script lang="ts">
	import { type Icon } from 'lucide-svelte';

	interface Link {
		name: string;
		url: string;
		icon?: typeof Icon;
	}

	export let heading: string;
	export let links: Link[];
</script>

<div class="flex flex-col items-center">
	<div class="text-lg font-bold">{heading}</div>
	{#each links as link}
		<a
			href={link.url}
			aria-label="Check out {link.name}"
			target="_blank"
			class="flex w-full items-center gap-2"
		>
			{#if link.icon}
				{@const Icon = link.icon}
				<Icon size={16} />
			{/if}

			<div class="mx-auto text-lg underline">{link.name}</div>
		</a>
	{/each}
</div>
