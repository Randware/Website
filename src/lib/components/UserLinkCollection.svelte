<script lang="ts">
	import { type Icon } from 'lucide-svelte';
	import LinkCollection from './LinkCollection.svelte';

	interface Link {
		name: string;
		url: string;
		icon?: typeof Icon;
	}

	export let username: string;
	export let picture: string;
	export let links: Link[];
</script>

<div class="flex flex-col items-center gap-4">
	<div class="flex items-center gap-2">
		{#if picture}
			<enhanced:img
				class="w-10 rounded-full border-2 border-foreground"
				src={picture}
				alt="{username} profile picture"
			/>
		{/if}
		<div class="text-2xl font-semibold">
			{username}
		</div>
	</div>

	<LinkCollection {links} />
</div>
