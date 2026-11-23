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

<div class="shell projects">
	<header class="project-header">
		<div class="page-heading">
			<h1>Projects</h1>
			<p>Explore what we’ve made and take a look at the source code.</p>
		</div>

		{#if data.projects}
			<a class="text-link" href={githubRepositories}>
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
					<ProjectItem {project} artworkTimestamp={data.artworkTimestamp} heading="h2" showSource />
				</li>
			{/each}
		</ul>
	{:else}
		<p class="project-note">There are currently no public repositories in the list.</p>
	{/if}
</div>

<style>
	.projects {
		padding-bottom: clamp(3rem, 7vw, 6rem);
	}

	.project-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		column-gap: 1rem;
	}

	.project-header .text-link {
		margin-bottom: 3.4rem;
		flex-shrink: 0;
	}

	.project-note {
		margin-bottom: 1rem;
		color: var(--muted);
		font-size: 0.9375rem;
	}

	@media (max-width: 45rem) {
		.project-header {
			align-items: flex-start;
			flex-direction: column;
		}

		.page-heading {
			padding-bottom: 0.5rem;
		}

		.project-header .text-link {
			margin-bottom: 1.5rem;
		}
	}
</style>
