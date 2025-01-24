<script lang="ts">
	import ProjectItem from '$lib/components/ProjectItem.svelte';
	import type { Project } from '$lib/store/projects';

	export let data;
	const { projects }: { projects: Project[] } = data;
</script>

<div class="space-y-32">
	<div class="flex flex-col items-center gap-12 md:flex-row">
		<div class="flex-1 text-center">
			<h2 class="font-fancy mb-4 text-4xl font-bold">Everything we've done so far.</h2>
			<div class="mb-6 text-xl">Check out all of our published projects.</div>
		</div>
	</div>

	<div class="grid grid-cols-1 place-items-center gap-12 lg:grid-cols-2 2xl:grid-cols-3">
		{#each projects as project}
			<div class="w-full">
				<ProjectItem
					name={project.name}
					about={project.about}
					stars={project.stars}
					url={project.url}
				/>
			</div>
		{/each}
	</div>
</div>
