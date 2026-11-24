<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight, ArrowUpRight, Star } from 'lucide-svelte';
	import type { Project } from '#lib/projects.js';
	import ProjectBanner from './ProjectBanner.svelte';
	import ProjectGlyph from './ProjectGlyph.svelte';

	let {
		project,
		artworkTimestamp,
		heading = 'h3',
		showSource = false
	}: {
		project: Project;
		artworkTimestamp: number;
		heading?: 'h2' | 'h3';
		showSource?: boolean;
	} = $props();
</script>

<article class="project paper-panel pressable">
	<div class="project-cover">
		<ProjectBanner name={project.name} {artworkTimestamp} />
		<ProjectGlyph name={project.name} />
		<span class="project-arrow" aria-hidden="true">
			<ArrowRight size={21} strokeWidth={1.8} />
		</span>
	</div>

	<div class="project-copy">
		<svelte:element this={heading} class="project-name">
			<a
				class="project-link"
				href={resolve('/projects/[name]', { name: project.name.toLowerCase() })}
				data-sveltekit-preload-data="tap"
			>
				{project.name}
			</a>
		</svelte:element>
		{#if project.description}<p>{project.description}</p>{/if}
	</div>

	<div class="project-meta">
		<div class="project-facts">
			{#if project.language}<span>{project.language}</span>{/if}
			<span class="stars" title="{project.stars} GitHub stars">
				<Star size={15} strokeWidth={1.7} aria-hidden="true" />
				<span class="sr-only">GitHub stars:</span>
				{project.stars}
			</span>
		</div>
		{#if showSource}
			<a class="source" href={project.url} aria-label="{project.name} source on GitHub">
				Source <ArrowUpRight size={15} strokeWidth={1.7} aria-hidden="true" />
			</a>
		{/if}
	</div>
</article>

<style>
	.project {
		--project-gutter: clamp(1rem, 2vw, 1.5rem);

		position: relative;
		display: flex;
		height: 100%;
		flex-direction: column;
	}

	.project:hover,
	.project:focus-within {
		border-color: var(--accent);
	}

	.project-cover {
		--glyph-size: 3.75rem;

		position: relative;
		isolation: isolate;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.875rem var(--project-gutter);
		border-bottom: 1px solid var(--line);
		border-radius: calc(var(--paper-radius) - 2px) calc(var(--paper-radius) - 2px) 0 0;
	}

	.project-arrow {
		display: grid;
		width: 2.125rem;
		height: 2.125rem;
		flex-shrink: 0;
		place-items: center;
		border: 1px solid var(--line-strong);
		border-radius: calc(var(--paper-radius) - 2px);
		background: var(--card);
		color: var(--ink);
	}

	.project-copy {
		flex: 1;
		padding: 1rem var(--project-gutter) 1.125rem;
		overflow-wrap: anywhere;
	}

	.project-name {
		font-size: clamp(1.375rem, 2.45vw, 1.75rem);
	}

	.project-copy p {
		margin-top: 0.5rem;
		color: var(--muted);
		line-height: 1.5;
	}

	.project-link::after {
		position: absolute;
		z-index: 1;
		inset: 0;
		border-radius: var(--paper-radius);
		content: '';
	}

	.project-link:focus-visible {
		outline: none;
	}

	.project-link:focus-visible::after {
		outline: 2px solid var(--focus);
		outline-offset: 3px;
	}

	.project-meta,
	.project-facts {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0 0.875rem;
		min-width: 0;
	}

	.project-meta {
		min-height: 3.25rem;
		justify-content: space-between;
		padding: 0.125rem var(--project-gutter);
		border-top: 1px dashed var(--line);
		color: var(--muted);
		font-size: 0.875rem;
		overflow-wrap: anywhere;
	}

	.stars,
	.source {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}

	.source {
		position: relative;
		z-index: 2;
		min-height: 2.75rem;
		color: var(--ink);
		font-weight: 500;
		text-underline-offset: 0.2em;
	}

	.source:hover {
		text-decoration: underline;
	}

	.project:has(.project-link:focus-visible) .project-arrow {
		border-color: var(--ink);
		background: var(--ink);
		color: var(--paper);
	}

	@media (hover: hover) {
		.project:has(.project-link:hover) .project-arrow {
			border-color: var(--ink);
			background: var(--ink);
			color: var(--paper);
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.project:has(.project-link:focus-visible),
		.project:is(:active, :global([data-pressed])) {
			--project-plate-spread: 1;
		}

		.project:has(.project-link:focus-visible) .project-arrow,
		.project:is(:active, :global([data-pressed])) .project-arrow {
			transform: translateX(3px);
		}

		.project-arrow {
			transition:
				transform 140ms ease,
				background-color 140ms ease,
				border-color 140ms ease,
				color 140ms ease;
		}

		@media (hover: hover) {
			.project:hover {
				--project-plate-spread: 1;
			}

			.project:hover .project-arrow {
				transform: translateX(3px);
			}
		}
	}
</style>
