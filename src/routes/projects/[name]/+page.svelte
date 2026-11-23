<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowLeft, ArrowUpRight, Github, Star } from 'lucide-svelte';
	import ProjectBanner from '#lib/components/ProjectBanner.svelte';
	import ProjectFallback from '#lib/components/ProjectFallback.svelte';
	import ProjectGlyph from '#lib/components/ProjectGlyph.svelte';
	import ProjectLanguages from '#lib/components/ProjectLanguages.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const result = $derived(data.result);
</script>

<svelte:head>
	{#if result.state === 'available'}
		<title>{result.project.name} · Randware Projects</title>
		<meta
			name="description"
			content={result.project.description ?? `Source code and README for ${result.project.name}.`}
		/>
	{:else}
		<title>Project unavailable · Randware</title>
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

{#snippet backToProjects()}
	<a class="text-link" href={resolve('/projects')}>
		<ArrowLeft size={17} strokeWidth={1.7} aria-hidden="true" /> All projects
	</a>
{/snippet}

<div class="shell detail">
	{#if result.state === 'available'}
		{@const { project, readme, languages } = result}
		<header class="project-summary paper-panel">
			<div class="detail-banner">
				<ProjectBanner name={project.name} artworkTimestamp={data.artworkTimestamp} />
				{@render backToProjects()}
				<div class="project-identity">
					<ProjectGlyph name={project.name} />
					<h1>{project.name}</h1>
				</div>
			</div>
			<div class="summary-body">
				{#if project.description}<p>{project.description}</p>{/if}
				<div class="detail-links">
					<a class="button pressable" href={project.url}>
						<Github size={18} strokeWidth={1.7} aria-hidden="true" /> View on GitHub
						<ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
					</a>
					<span class="stars" title="{project.stars} GitHub stars">
						<Star size={17} strokeWidth={1.7} aria-hidden="true" />
						<span class="sr-only">GitHub stars:</span>
						{project.stars}
					</span>
				</div>
			</div>
		</header>

		<div class="detail-body">
			<div class="language-panel">
				<ProjectLanguages {languages} url={project.url} />
			</div>
			<div class="readme-panel">
				{#if readme}
					<section class="readme paper-panel" aria-labelledby="readme-title">
						<h2 id="readme-title">README</h2>
						<div class="markdown">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html readme}
						</div>
					</section>
				{:else}
					<ProjectFallback message="The README couldn’t be loaded here." url={project.url} />
				{/if}
			</div>
		</div>
	{:else}
		{@render backToProjects()}
		<header class="page-heading"><h1>Project unavailable</h1></header>
		<ProjectFallback message={result.message} url={result.url} />
	{/if}
</div>

<style>
	.detail {
		padding-block: clamp(1.25rem, 3vw, 2.25rem) clamp(3rem, 7vw, 6rem);
	}

	.project-summary {
		--summary-gutter: clamp(1rem, 3.2vw, 2.25rem);

		margin-bottom: clamp(1.25rem, 4vw, 3rem);
	}

	.detail-banner {
		position: relative;
		isolation: isolate;
		display: grid;
		gap: clamp(0.75rem, 2.5vw, 1.75rem);
		padding: clamp(0.375rem, 1vw, 0.875rem) var(--summary-gutter) var(--summary-gutter);
		border-bottom: 1px solid var(--line);
		border-radius: calc(var(--paper-radius) - 2px) calc(var(--paper-radius) - 2px) 0 0;
	}

	.detail-banner::after {
		position: absolute;
		z-index: -1;
		inset: 0;
		border-radius: inherit;
		background: linear-gradient(
			to right,
			color-mix(in srgb, var(--card) 94%, transparent),
			color-mix(in srgb, var(--card) 86%, transparent) 30%,
			color-mix(in srgb, var(--card) 62%, transparent) 66%,
			transparent
		);
		pointer-events: none;
		content: '';
	}

	.project-identity {
		--glyph-size: clamp(2.75rem, 7vw, 4.75rem);

		display: flex;
		max-inline-size: 66%;
		align-items: center;
		gap: clamp(0.875rem, 2.5vw, 1.75rem);
	}

	.project-identity h1 {
		min-width: 0;
		font-size: clamp(2.125rem, 6.5vw, 4.75rem);
		overflow-wrap: anywhere;
	}

	.summary-body {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem 1.5rem;
		padding: clamp(1rem, 2.5vw, 1.625rem) var(--summary-gutter);
	}

	.summary-body p {
		max-width: 57ch;
		flex: 1 1 24rem;
		color: var(--muted);
		font-size: clamp(1rem, 1.6vw, 1.125rem);
		overflow-wrap: anywhere;
	}

	.page-heading {
		padding-top: clamp(1.125rem, 3vw, 2.25rem);
	}

	.detail-links {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.625rem 1rem;
		color: var(--muted);
		font-size: 0.9375rem;
	}

	@media (max-width: 44rem) {
		.detail-banner::after {
			background: linear-gradient(
				to right,
				color-mix(in srgb, var(--card) 91%, transparent),
				color-mix(in srgb, var(--card) 62%, transparent)
			);
		}

		.project-identity {
			max-inline-size: 100%;
		}
	}

	.stars {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}

	.detail-body {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(14rem, 19rem);
		grid-template-areas: 'readme languages';
		align-items: start;
		gap: clamp(1rem, 3vw, 2rem);
	}

	.language-panel {
		grid-area: languages;
	}

	.readme-panel {
		grid-area: readme;
		min-width: 0;
	}

	@media (max-width: 50rem) {
		.detail-body {
			grid-template-columns: minmax(0, 1fr);
			grid-template-areas: 'languages' 'readme';
		}
	}

	.readme {
		padding: clamp(1.125rem, 4vw, 2.75rem);
	}

	.readme h2 {
		margin-bottom: 1.125rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--line);
		font-size: clamp(1.5rem, 4vw, 2.125rem);
	}

	.markdown {
		overflow-wrap: anywhere;
	}

	.markdown :global(:is(h3, h4, h5, h6)) {
		margin: 1.5em 0 0.6em;
		font-family: var(--serif);
		letter-spacing: -0.035em;
		line-height: 1.3;
	}

	.markdown :global(h3) {
		font-size: 1.5rem;
	}

	.markdown :global(h4) {
		font-size: 1.25rem;
	}

	.markdown :global(:is(p, pre, ul, ol, dl, table, blockquote)) {
		margin-block: 0.75rem;
	}

	.markdown :global(a) {
		color: var(--accent);
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.markdown :global(img) {
		display: inline-block;
		max-width: 100%;
		height: auto;
		vertical-align: middle;
	}

	.markdown :global(:is(ul, ol)) {
		padding-inline-start: 1.5rem;
	}

	.markdown :global(ul) {
		list-style: disc;
	}

	.markdown :global(ol) {
		list-style: decimal;
	}

	.markdown :global(:is(pre, code)) {
		background: var(--wash);
		font-size: 0.9em;
	}

	.markdown :global(pre) {
		overflow-x: auto;
		padding: 1rem;
		border: 1px solid var(--line);
		border-radius: var(--paper-radius);
	}

	.markdown :global(code) {
		padding: 0.12em 0.3em;
		border-radius: 0.25rem;
	}

	.markdown :global(pre code) {
		padding: 0;
		font-size: inherit;
	}

	.markdown :global(blockquote) {
		padding-inline: 1rem;
		border-inline-start: 2px solid var(--accent);
		color: var(--muted);
	}

	.markdown :global(:is(td, th)) {
		padding: 0.35rem 0.5rem;
		border: 1px solid var(--line);
		text-align: start;
	}

	.markdown :global(summary) {
		cursor: pointer;
	}
</style>
