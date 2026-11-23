<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight, CodeXml, Github, ShieldCheck, Zap } from 'lucide-svelte';
	import HeroArtwork from '#lib/components/HeroArtwork.svelte';
	import ProjectFallback from '#lib/components/ProjectFallback.svelte';
	import ProjectItem from '#lib/components/ProjectItem.svelte';
	import { githubProfile, githubRepositories } from '#lib/projects.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const description =
		'We’re a group of friends who like making open-source software. Take a look at what we’ve built.';
</script>

<svelte:head>
	<title>Randware · Open-source software</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="Randware · Open-source software" />
	<meta property="og:description" content={description} />
</svelte:head>

<section class="shell hero" aria-labelledby="home-title">
	<div class="hero-paper paper-panel">
		<div class="paper-print hero-print" aria-hidden="true">
			<HeroArtwork />
		</div>
		<h1 id="home-title">Random software you might enjoy</h1>
		<p class="intro">We ❤️ software</p>
		<div class="hero-links">
			<a class="button pressable" href={resolve('/projects')} data-sveltekit-preload-data="tap">
				Browse projects <ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" />
			</a>
			<a class="text-link" href={githubProfile}>
				<Github size={18} strokeWidth={1.7} aria-hidden="true" /> GitHub
			</a>
		</div>
	</div>
</section>

<section class="values" aria-labelledby="home-values">
	<div class="shell">
		<div class="section-top">
			<h2 class="section-heading" id="home-values">What we care about</h2>
			<a class="text-link" href={resolve('/about')}>
				About us <ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" />
			</a>
		</div>
		<section class="value paper-panel" aria-labelledby="value-open-source">
			<div class="value-copy">
				<h3 id="value-open-source">
					<span class="value-icon" aria-hidden="true"><CodeXml size={21} strokeWidth={1.7} /></span>
					Open source
				</h3>
				<p>
					We like making software people can use, change, and share, even in their own commercial
					projects. If you have an idea or a fix, we’d love your help.
				</p>
			</div>
			<div class="paper-print value-print" data-motif="circles" aria-hidden="true"></div>
		</section>
		<section class="value paper-panel" aria-labelledby="value-security">
			<div class="value-copy">
				<h3 id="value-security">
					<span class="value-icon" aria-hidden="true">
						<ShieldCheck size={21} strokeWidth={1.7} />
					</span>
					Security
				</h3>
				<p>
					Good software should take security seriously. If you’ve found a vulnerability or have a
					concern, please <a class="prose-link" href={resolve('/contact')}>
						get in touch privately
					</a> so we can look into it.
				</p>
			</div>
			<div class="paper-print value-print" data-motif="frames" aria-hidden="true"></div>
		</section>
		<section class="value paper-panel" aria-labelledby="value-performance">
			<div class="value-copy">
				<h3 id="value-performance">
					<span class="value-icon" aria-hidden="true"><Zap size={21} strokeWidth={1.7} /></span>
					Performance
				</h3>
				<p>
					Slow software gets in the way. We think about speed from the first build and keep looking
					for places to make things faster.
				</p>
			</div>
			<div class="paper-print value-print" data-motif="tracks" aria-hidden="true"></div>
		</section>
	</div>
</section>

<section class="shell projects" aria-labelledby="home-projects">
	<div class="section-top">
		<h2 class="section-heading" id="home-projects">Selected projects</h2>
		{#if data.featuredProjects?.length}
			<a class="text-link" href={resolve('/projects')} data-sveltekit-preload-data="tap">
				All projects <ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" />
			</a>
		{/if}
	</div>
	{#if data.featuredProjects?.length}
		<ul class="project-grid">
			{#each data.featuredProjects as project (project.name)}
				<li><ProjectItem {project} artworkTimestamp={data.artworkTimestamp} /></li>
			{/each}
		</ul>
	{:else}
		<ProjectFallback
			message={data.featuredProjects
				? 'There are no public projects listed.'
				: 'The selected projects couldn’t be loaded from GitHub.'}
			url={githubRepositories}
		/>
	{/if}
</section>

<style>
	.hero {
		padding-block: clamp(1.25rem, 3.3vw, 3rem);
		text-align: center;
	}

	.hero-paper,
	.value {
		position: relative;
		isolation: isolate;
	}

	.hero-paper {
		padding: clamp(2.375rem, 6.75vw, 5.5rem) clamp(0.875rem, 3vw, 2rem);
	}

	h1 {
		max-width: 21ch;
		margin-inline: auto;
		font-size: clamp(2.5rem, 5.7vw, 5.25rem);
		letter-spacing: -0.055em;
		line-height: 1.1;
		text-wrap: balance;
	}

	.intro {
		max-width: 32rem;
		margin: 1.25rem auto 0;
		color: var(--muted);
		font-size: clamp(1.0625rem, 1.65vw, 1.25rem);
		line-height: 1.55;
		text-wrap: balance;
	}

	.hero-links {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.5rem 1.5rem;
		margin-top: 1.75rem;
	}

	.hero-print {
		mask-image: radial-gradient(ellipse 51% 76% at center, transparent 43%, #000 100%);
	}

	.projects {
		padding-block: clamp(2.25rem, 5vw, 4.25rem) clamp(3.5rem, 7vw, 6rem);
	}

	.section-top {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		column-gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.values {
		padding-block: clamp(2.75rem, 6vw, 5.25rem);
		border-block: 2px solid var(--line);
		background: var(--wash);
	}

	.value + .value {
		margin-top: clamp(0.875rem, 1.75vw, 1.375rem);
	}

	.value-copy {
		max-inline-size: min(68%, 42rem);
		padding: clamp(1.125rem, 3vw, 2.375rem);
	}

	.value-icon {
		display: grid;
		width: 2.5rem;
		height: 2.5rem;
		flex-shrink: 0;
		place-items: center;
		border: 1px solid var(--line-strong);
		border-radius: calc(var(--paper-radius) - 2px);
		background: var(--tint);
	}

	.value h3 {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: clamp(1.375rem, 3vw, 2.25rem);
		letter-spacing: -0.02em;
	}

	.value p {
		max-inline-size: 50ch;
		margin-top: 0.75rem;
		color: var(--muted);
		font-size: clamp(1rem, 1.6vw, 1.125rem);
	}

	.paper-print {
		--print-grid: color-mix(in srgb, var(--ink) 10%, transparent);
		--print-ink: color-mix(in srgb, var(--ink) 24%, transparent);

		position: absolute;
		z-index: -1;
		inset: 0;
		overflow: hidden;
		border-radius: calc(var(--paper-radius) - 2px);
		background-color: var(--wash);
		background-image:
			linear-gradient(var(--print-grid) 1px, transparent 1px),
			linear-gradient(90deg, var(--print-grid) 1px, transparent 1px);
		background-size: 12px 12px;
		pointer-events: none;
	}

	.value-print {
		--print-center: 50%;

		mask-image: linear-gradient(
			105deg,
			transparent 6%,
			rgb(0 0 0 / 16%) 33%,
			rgb(0 0 0 / 52%) 58%,
			#000 86%
		);
	}

	.value-print::before,
	.value-print::after {
		position: absolute;
		inset-block-start: var(--print-center);
		width: clamp(8rem, 29%, 21rem);
		aspect-ratio: 1;
		border: 1px solid var(--print-ink);
		content: '';
	}

	.value-print::before {
		inset-inline-start: 43%;
		translate: 0 -58%;
	}

	.value-print::after {
		inset-inline-start: 66%;
		translate: 0 -43%;
	}

	.value-print[data-motif='circles']::before,
	.value-print[data-motif='circles']::after {
		border-radius: 50%;
		background: repeating-radial-gradient(circle, var(--print-ink) 0 1px, transparent 1px 8px);
	}

	.value-print[data-motif='frames']::before,
	.value-print[data-motif='frames']::after {
		aspect-ratio: 1.25;
		border-radius: 0.5rem;
		box-shadow:
			inset 0 0 0 6px var(--wash),
			inset 0 0 0 7px var(--print-ink),
			inset 0 0 0 15px var(--wash),
			inset 0 0 0 16px var(--print-ink);
	}

	.value-print[data-motif='frames']::before {
		rotate: -15deg;
	}

	.value-print[data-motif='frames']::after {
		rotate: 12deg;
	}

	.value-print[data-motif='tracks']::before,
	.value-print[data-motif='tracks']::after {
		width: clamp(10rem, 38%, 27rem);
		aspect-ratio: 3.2;
		border-radius: 100vmax;
		background: repeating-linear-gradient(var(--print-ink) 0 1px, transparent 1px 6px);
		rotate: -20deg;
	}

	.value-print[data-motif='tracks']::after {
		inset-block-start: calc(var(--print-center) + 1.25rem);
		inset-inline-start: 61%;
	}

	@media (width < 40rem) {
		.value-copy {
			max-inline-size: none;
		}

		.value-print {
			--print-center: 2.5rem;

			mask-image: radial-gradient(
				ellipse 85% 7.5rem at 100% 0%,
				rgb(0 0 0 / 58%),
				rgb(0 0 0 / 26%) 53%,
				transparent 100%
			);
		}
	}

	@media (max-width: 38rem) {
		.hero-links {
			margin-top: 1.25rem;
			column-gap: 1rem;
		}

		.section-top {
			margin-bottom: 0.875rem;
		}
	}
</style>
