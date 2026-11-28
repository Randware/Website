<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { ArrowRight, ArrowUpRight, Star } from 'lucide-svelte';
	import { isExternalLink } from '#lib/external-link.js';
	import type { Project } from '#lib/projects.js';
	import PaperBanner from './PaperBanner.svelte';
	import ProjectGlyph from './ProjectGlyph.svelte';

	let {
		project,
		artworkTimestamp,
		heading = 'h3',
		showExternalLinks = false
	}: {
		project: Project;
		artworkTimestamp: number;
		heading?: 'h2' | 'h3';
		showExternalLinks?: boolean;
	} = $props();
</script>

<article
	class="project paper-panel pressable relative flex h-full flex-col [--card-gutter:clamp(1rem,2vw,1.5rem)] hover:border-accent focus-within:border-accent"
>
	<div
		class="paper-card-banner flex items-start justify-between gap-4 py-3.5 [--glyph-size:3.75rem]"
	>
		<PaperBanner name={project.name} visitSeed={artworkTimestamp} animated />
		<ProjectGlyph name={project.name} />
		<span
			class="project-arrow grid size-[2.125rem] shrink-0 place-items-center rounded-paper-inner border border-line-strong bg-card text-ink"
			aria-hidden="true"
		>
			<ArrowRight size={21} strokeWidth={1.8} />
		</span>
	</div>

	<div class="flex-1 px-(--card-gutter) pb-[1.125rem] pt-4 wrap-anywhere">
		<svelte:element this={heading} class="text-[clamp(1.375rem,2.45vw,1.75rem)]">
			<a
				class={[
					"project-link after:absolute after:inset-0 after:z-1 after:rounded-paper after:content-['']",
					'focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-[3px] focus-visible:after:outline-focus'
				]}
				href={resolve('/projects/[name]', { name: project.name.toLowerCase() })}
				data-sveltekit-preload-data="tap"
			>
				{project.name}
			</a>
		</svelte:element>
		{#if project.description}<p class="mt-2 leading-[1.5] text-muted">{project.description}</p>{/if}
	</div>

	<div
		class="paper-card-footer flex min-h-[3.25rem] min-w-0 flex-wrap items-center gap-x-3.5 py-0.5 text-[0.875rem] text-muted wrap-anywhere"
	>
		<div class="flex min-w-0 flex-[1_1_4rem] flex-wrap items-center gap-x-3.5">
			{#if project.language}<span>{project.language}</span>{/if}
			<span class="inline-flex items-center gap-[0.35rem]" title="{project.stars} GitHub stars">
				<Star size={15} strokeWidth={1.7} aria-hidden="true" />
				<span class="sr-only">GitHub stars:</span>
				{project.stars}
			</span>
		</div>
		{#if showExternalLinks}
			<div class="ms-auto flex flex-wrap justify-end gap-x-3.5">
				{#if project.website}
					{@const external = isExternalLink(project.website, page.url.origin)}
					<a
						class="project-action"
						href={project.website}
						target={external ? '_blank' : undefined}
						rel={external ? 'noopener' : undefined}
						aria-label="{project.name} website"
					>
						Website <ArrowUpRight size={15} strokeWidth={1.7} aria-hidden="true" />
					</a>
				{/if}
				<a
					class="project-action"
					href={project.url}
					target="_blank"
					rel="noopener"
					aria-label="{project.name} source on GitHub"
				>
					Source <ArrowUpRight size={15} strokeWidth={1.7} aria-hidden="true" />
				</a>
			</div>
		{/if}
	</div>
</article>

<style lang="postcss">
	@reference '../../app.css';

	.project-action {
		@apply relative z-2 inline-flex min-h-11 items-center gap-[0.35rem] font-medium text-ink underline-offset-[0.2em] hover:underline;
	}

	.project:has(.project-link:focus-visible) .project-arrow {
		@apply border-ink bg-ink text-paper;
	}

	@media (hover: hover) {
		.project:has(.project-link:hover) .project-arrow {
			@apply border-ink bg-ink text-paper;
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
