<script lang="ts">
	interface Link {
		name: string;
		url: string;
		icon?: string;
	}

	export let heading: string;
	export let links: Link[];
</script>

<div class="flex flex-col items-center lg:items-start">
	<div class="mb text-lg font-semibold">{heading}</div>
	{#each links as link}
		<div class="flex items-center text-lg">
			{#if link.icon}
				<i class="fa {link.icon} w-6"></i>
			{/if}

			<a href={link.url} target="_blank" class="underline"> {link.name}</a>
		</div>
	{/each}
</div>
