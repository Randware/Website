<script lang="ts">
	import { ArrowUpRight, Github } from 'lucide-svelte';
	import ProjectFallback from '#lib/components/ProjectFallback.svelte';
	import ProjectItem from '#lib/components/ProjectItem.svelte';
	import { githubRepositories } from '#lib/projects.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Projects · Randware</title>
	<meta
		name="description"
		content="Browse Randware’s public software projects, source code, and READMEs."
	/>
</svelte:head>

<div class="shell pb-[clamp(3rem,7vw,6rem)]">
	<header
		class="flex items-end justify-between gap-x-4 [@media(max-width:45rem)]:flex-col [@media(max-width:45rem)]:items-start"
	>
		<div class="page-heading [@media(max-width:45rem)]:pb-2">
			<h1>Projects</h1>
			<p>Explore what we’ve made and take a look at the source code.</p>
		</div>

		{#if data.projects}
			<a
				class="text-link mb-[3.4rem] shrink-0 [@media(max-width:45rem)]:mb-6"
				href={githubRepositories}
			>
				<Github size={18} strokeWidth={1.7} aria-hidden="true" /> Randware on GitHub
				<ArrowUpRight size={15} strokeWidth={1.7} aria-hidden="true" />
			</a>
		{/if}
	</header>

	{#if !data.projects}
		<ProjectFallback
			message="The project list couldn’t be loaded from GitHub."
			url={githubRepositories}
		/>
	{:else if data.projects.length > 0}
		<ul class="project-grid" aria-label="Randware repositories">
			{#each data.projects as project (project.name)}
				<li>
					<ProjectItem
						{project}
						artworkTimestamp={data.artworkTimestamp}
						heading="h2"
						showExternalLinks
					/>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="mb-4 text-[0.9375rem] text-muted">
			There are currently no public repositories in the list.
		</p>
	{/if}
</div>
