<script lang="ts">
	import { Star } from 'lucide-svelte';

	export let name: string;
	export let about: string;
	export let stars: number;
	export let url: string;
</script>

<div class="flex flex-col rounded-3xl">
	<div class="rounded-t-3xl bg-foreground px-12 py-4 text-center text-background">
		<div class="font-fancy text-xl font-bold">{name}</div>
	</div>
	<div
		class="flex flex-col gap-8 rounded-b-3xl border-2 border-foreground p-8 align-middle text-lg"
	>
		<div class="text-lg">{about}</div>
		<div class="flex">
			<a
				class="rounded-xl bg-foreground px-4 py-2 text-lg text-background hover:bg-foreground/80 hover:transition-colors"
				href={url}
				target="_blank">Source</a
			>
			<div class="ms-auto flex items-center gap-2">
				<Star size={24} />
				<div class="text-xl">{stars}</div>
			</div>
		</div>
	</div>
</div>
