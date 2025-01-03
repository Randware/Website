<script lang="ts">
	export let heading: string;
	export let paragraphs: string[];
	export let image: string;
	export let imageAlt: string;
	export let imageRight: boolean;
</script>

<div class="flex flex-col items-center gap-12 lg:flex-row">
	<div class="flex-1 text-center lg:text-left {imageRight ? 'lg:order-1' : 'lg:order-2'} order-2">
		<h2 class="font-fancy mb-8 text-4xl font-bold">{heading}</h2>
		<div class="space-y-4 text-lg">
			{#each paragraphs as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>
	</div>

	<div class="flex flex-1 justify-center {imageRight ? 'lg:order-2' : 'lg:order-1'} order-1">
		<img class="w-56 drop-shadow-xl md:w-64" src={image} alt={imageAlt} />
	</div>
</div>
