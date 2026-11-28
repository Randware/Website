<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { ArrowLeft, ArrowUpRight, Star } from 'lucide-svelte';
	import PaperBanner from '#lib/components/PaperBanner.svelte';
	import ProjectFallback from '#lib/components/ProjectFallback.svelte';
	import ProjectGlyph from '#lib/components/ProjectGlyph.svelte';
	import ProjectLanguages from '#lib/components/ProjectLanguages.svelte';
	import { isExternalLink } from '#lib/external-link.js';
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

<div class="shell pb-[clamp(3rem,7vw,6rem)] pt-[clamp(1.25rem,3vw,2.25rem)]">
	{#if result.state === 'available'}
		{@const { project, readme, languages } = result}
		<header
			class="paper-panel mb-[clamp(1.25rem,4vw,3rem)] [--summary-gutter:clamp(1rem,3.2vw,2.25rem)]"
		>
			<div
				class="detail-banner relative isolate grid gap-[clamp(0.75rem,2.5vw,1.75rem)] rounded-t-paper-inner border-b border-line px-(--summary-gutter) pb-(--summary-gutter) pt-[clamp(0.375rem,1vw,0.875rem)]"
			>
				<PaperBanner name={project.name} visitSeed={data.artworkTimestamp} />
				{@render backToProjects()}
				<div
					class="flex items-center gap-[clamp(0.875rem,2.5vw,1.75rem)] [--glyph-size:clamp(2.75rem,7vw,4.75rem)] max-inline-[66%] [@media(max-width:44rem)]:max-inline-full"
				>
					<ProjectGlyph name={project.name} />
					<h1 class="min-w-0 text-[clamp(2.125rem,6.5vw,4.75rem)] wrap-anywhere">
						{project.name}
					</h1>
				</div>
			</div>
			<div
				class="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-(--summary-gutter) py-[clamp(1rem,2.5vw,1.625rem)]"
			>
				{#if project.description}
					<p
						class="max-w-[57ch] flex-[1_1_24rem] text-[clamp(1rem,1.6vw,1.125rem)] text-muted wrap-anywhere"
					>
						{project.description}
					</p>
				{/if}
				<div class="flex flex-wrap items-center gap-x-4 gap-y-2.5 text-[0.9375rem] text-muted">
					{#if project.website}
						{@const external = isExternalLink(project.website, page.url.origin)}
						<a
							class="text-link"
							href={project.website}
							target={external ? '_blank' : undefined}
							rel={external ? 'noopener' : undefined}
						>
							Website <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
						</a>
					{/if}
					<div class="flex flex-wrap items-center gap-x-4 gap-y-2.5">
						<a class="text-link" href={project.url} target="_blank" rel="noopener">
							Source <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
						</a>
						<span
							class="inline-flex items-center gap-[0.35rem]"
							title="{project.stars} GitHub stars"
						>
							<Star size={17} strokeWidth={1.7} aria-hidden="true" />
							<span class="sr-only">GitHub stars:</span>
							{project.stars}
						</span>
					</div>
				</div>
			</div>
		</header>

		<div
			class={[
				'grid grid-cols-[minmax(0,1fr)_minmax(14rem,19rem)] items-start gap-[clamp(1rem,3vw,2rem)]',
				"[grid-template-areas:'readme_languages'] [@media(max-width:50rem)]:grid-cols-1",
				"[@media(max-width:50rem)]:[grid-template-areas:'languages'_'readme']"
			]}
		>
			<div class="[grid-area:languages]">
				<ProjectLanguages {languages} url={project.url} />
			</div>
			<div class="min-w-0 [grid-area:readme]">
				{#if readme}
					<section
						class="paper-panel p-[clamp(1.125rem,4vw,2.75rem)]"
						aria-labelledby="readme-title"
					>
						<h2
							class="mb-[1.125rem] border-b border-line pb-4 text-[clamp(1.5rem,4vw,2.125rem)]"
							id="readme-title"
						>
							README
						</h2>
						<div class="markdown wrap-anywhere">
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
		<header class="page-heading pt-[clamp(1.125rem,3vw,2.25rem)]">
			<h1>Project unavailable</h1>
		</header>
		<ProjectFallback message={result.message} url={result.url} />
	{/if}
</div>

<style lang="postcss">
	@reference '../../../app.css';

	.detail-banner::after {
		@apply pointer-events-none absolute inset-0 -z-1 rounded-[inherit] content-[''];
		background: linear-gradient(
			to right,
			color-mix(in srgb, var(--card) 94%, transparent),
			color-mix(in srgb, var(--card) 86%, transparent) 30%,
			color-mix(in srgb, var(--card) 62%, transparent) 66%,
			transparent
		);
	}

	@media (max-width: 44rem) {
		.detail-banner::after {
			background: linear-gradient(
				to right,
				color-mix(in srgb, var(--card) 91%, transparent),
				color-mix(in srgb, var(--card) 62%, transparent)
			);
		}
	}

	/* The README is rendered from sanitized GitHub HTML. */
	.markdown :global(:is(h3, h4, h5, h6)) {
		@apply mb-[0.6em] mt-[1.5em] font-serif leading-[1.3] tracking-[-0.035em];
	}

	.markdown :global(h3) {
		@apply text-[1.5rem];
	}

	.markdown :global(h4) {
		@apply text-[1.25rem];
	}

	.markdown :global(:is(p, pre, ul, ol, dl, table, blockquote)) {
		@apply my-3;
	}

	.markdown :global(a) {
		@apply text-accent underline underline-offset-[0.2em];
	}

	.markdown :global(img) {
		@apply inline-block h-auto max-w-full align-middle;
	}

	.markdown :global(:is(ul, ol)) {
		@apply ps-6;
	}

	.markdown :global(ul) {
		@apply list-disc;
	}

	.markdown :global(ol) {
		@apply list-decimal;
	}

	.markdown :global(:is(pre, code)) {
		@apply bg-wash text-[0.9em];
	}

	.markdown :global(pre) {
		@apply overflow-x-auto rounded-paper border border-line p-4;
	}

	.markdown :global(code) {
		@apply rounded-sm px-[0.3em] py-[0.12em];
	}

	.markdown :global(pre code) {
		@apply p-0 text-[length:inherit];
	}

	.markdown :global(blockquote) {
		@apply border-s-2 border-accent px-4 text-muted;
	}

	.markdown :global(:is(td, th)) {
		@apply border border-line px-2 py-[0.35rem] text-start;
	}

	.markdown :global(summary) {
		@apply cursor-pointer;
	}
</style>
