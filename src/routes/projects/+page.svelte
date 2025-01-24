<script lang="ts">
	import type { Project } from '$lib/store/projects';

	export let data;
	const { projects }: { projects: Project[] } = data;
</script>

{#each projects as project}
	<div>
		<h2>{project.name}</h2>
		<p>{project.about}</p>
		<p>Stars: {project.stars}</p>
	</div>
{/each}
