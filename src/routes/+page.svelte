<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowDown, ArrowRight, CodeXml, Github, ShieldCheck, Zap } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import PaperArtwork from '#lib/components/PaperArtwork.svelte';
	import ProjectFallback from '#lib/components/ProjectFallback.svelte';
	import ProjectItem from '#lib/components/ProjectItem.svelte';
	import { githubProfile, githubRepositories } from '#lib/projects.js';
	import { easedScrollProgress } from '#lib/scroll.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let hero: HTMLElement;
	let heroContent: HTMLDivElement;
	let heroTrack: HTMLDivElement;
	let valuesHeading: HTMLHeadingElement;
	let stopCueScroll: (() => void) | undefined;

	const description =
		'We’re a group of friends who like making open-source software. Take a look at what we’ve built.';

	onMount(() => {
		const motion = matchMedia('(prefers-reduced-motion: reduce)');
		const listeners = new AbortController();
		const root = document.documentElement;
		const introExpired = root.dataset.pageIntro === 'static';
		let distance = 0;
		let frame = 0;
		let previousProgress = -1;

		function draw() {
			frame = 0;
			const progress = distance ? easedScrollProgress(scrollY, distance) : 1;
			if (progress === previousProgress) return;

			if (distance) root.style.setProperty('--hero-scroll-progress', String(progress));
			else root.style.removeProperty('--hero-scroll-progress');
			hero.toggleAttribute('data-scroll-cue', distance > 0 && progress < 0.4);
			previousProgress = progress;
		}

		function measure() {
			const top = hero.getBoundingClientRect().top + scrollY;
			const room = root.clientHeight - top;
			hero.toggleAttribute(
				'data-scroll-hero',
				!introExpired && !motion.matches && room > heroContent.offsetHeight + 88
			);
			hero.style.setProperty('--hero-top', `${top}px`);
			distance = heroTrack.offsetHeight;
			previousProgress = -1;
			cancelAnimationFrame(frame);
			draw();
		}

		function onScroll() {
			if (distance && !frame) frame = requestAnimationFrame(draw);
		}

		const observer = new ResizeObserver(measure);
		observer.observe(heroContent);
		window.addEventListener('scroll', onScroll, { passive: true, signal: listeners.signal });
		window.addEventListener('resize', measure, { signal: listeners.signal });
		motion.addEventListener('change', measure, { signal: listeners.signal });
		measure();

		return () => {
			listeners.abort();
			observer.disconnect();
			cancelAnimationFrame(frame);
			stopCueScroll?.();
			root.style.removeProperty('--hero-scroll-progress');
		};
	});

	function scrollToValues() {
		stopCueScroll?.();
		valuesHeading.focus({ preventScroll: true });

		const motion = matchMedia('(prefers-reduced-motion: reduce)');
		if (motion.matches) {
			valuesHeading.scrollIntoView({ behavior: 'instant', block: 'start' });
			return;
		}

		const root = document.documentElement;
		const start = scrollY;
		const padding = Number.parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
		const target = start + valuesHeading.getBoundingClientRect().top - padding;
		const destination = Math.max(0, Math.min(target, root.scrollHeight - root.clientHeight));
		const travel = destination - start;
		const started = performance.now();
		const listeners = new AbortController();
		let frame = 0;

		function stop() {
			cancelAnimationFrame(frame);
			listeners.abort();
			stopCueScroll = undefined;
		}

		function advance(time: number) {
			const seconds = Math.max(0, time - started) / 1000;
			const remaining = travel * Math.exp(-6 * seconds);
			const atRest = Math.abs(remaining) <= 1.5;
			window.scrollTo({ top: atRest ? destination : destination - remaining, behavior: 'instant' });
			if (!atRest) frame = requestAnimationFrame(advance);
			else stop();
		}

		const { signal } = listeners;
		for (const event of ['wheel', 'pointerdown', 'keydown', 'resize']) {
			window.addEventListener(event, stop, { passive: true, signal });
		}
		motion.addEventListener('change', stop, { signal });
		stopCueScroll = stop;
		frame = requestAnimationFrame(advance);
	}
</script>

<svelte:head>
	<title>Randware · Open-source software</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="Randware · Open-source software" />
	<meta property="og:description" content={description} />
</svelte:head>

<section class="hero" aria-labelledby="home-title" bind:this={hero}>
	<div class="hero-stage">
		<div class="hero-frame paper-panel" aria-hidden="true">
			<div class="paper-print hero-print">
				<PaperArtwork seed={data.headlineArtworkSeed} />
			</div>
		</div>
		<div class="shell hero-content" bind:this={heroContent}>
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
		<button
			class="header-control pressable scroll-cue"
			type="button"
			aria-label="Scroll to what we care about"
			onclick={scrollToValues}
		>
			<ArrowDown size={21} strokeWidth={1.8} aria-hidden="true" />
		</button>
	</div>
	<div class="hero-track" bind:this={heroTrack} aria-hidden="true"></div>
</section>

<section class="values" aria-labelledby="home-values">
	<div class="shell">
		<div class="section-top">
			<h2 class="section-heading" id="home-values" bind:this={valuesHeading} tabindex="-1">
				What we care about
			</h2>
			<a class="text-link" href={resolve('/about')}>
				About us <ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" />
			</a>
		</div>
		<div class="value-stack">
			<div class="paper-print values-print" aria-hidden="true">
				<PaperArtwork layout="panels" seed={data.valuesArtworkSeed} />
			</div>
			<section class="value paper-panel" aria-labelledby="value-open-source">
				<div class="value-copy">
					<h3 id="value-open-source">
						<span class="value-icon" aria-hidden="true">
							<CodeXml size={21} strokeWidth={1.7} />
						</span>
						Open source
					</h3>
					<p>
						We like making software people can use, change, and share, even in their own commercial
						projects. If you have an idea or a fix, we’d love your help.
					</p>
				</div>
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
			</section>
			<section class="value paper-panel" aria-labelledby="value-performance">
				<div class="value-copy">
					<h3 id="value-performance">
						<span class="value-icon" aria-hidden="true"><Zap size={21} strokeWidth={1.7} /></span>
						Performance
					</h3>
					<p>
						Slow software gets in the way. We think about speed from the first build and keep
						looking for places to make things faster.
					</p>
				</div>
			</section>
		</div>
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
		--hero-gap: clamp(1.25rem, 3.3vw, 3rem);
		--hero-inset: max(var(--gutter), calc((100% - 74rem) / 2));
		--hero-expanded: calc(1 - var(--hero-scroll-progress, 1));

		text-align: center;
	}

	.hero-stage,
	.value-stack {
		position: relative;
		isolation: isolate;
	}

	.hero-stage {
		z-index: 1;
		padding-block: var(--hero-gap);
	}

	.hero-content {
		padding: calc(2px + clamp(2.375rem, 6.75vw, 5.5rem)) calc(2px + clamp(0.875rem, 3vw, 2rem));
	}

	.hero-frame {
		position: absolute;
		z-index: -1;
		inset: var(--hero-gap) var(--hero-inset);
		isolation: isolate;
		pointer-events: none;
	}

	.hero:global([data-scroll-hero]) .hero-stage {
		--hero-bottom: calc(
			var(--hero-gap) + (100% - 100svh + var(--hero-top) - var(--hero-gap)) * var(--hero-expanded)
		);

		position: sticky;
		inset-block-start: var(--hero-top);
	}

	.hero:global([data-scroll-hero]) .hero-frame {
		--hero-radius: calc(var(--paper-radius) * (1 - var(--hero-expanded)));

		inset-block-start: calc(
			var(--hero-gap) - (var(--hero-gap) + var(--hero-top)) * var(--hero-expanded)
		);
		inset-block-end: var(--hero-bottom);
		inset-inline: calc(var(--hero-inset) * (1 - var(--hero-expanded)));
		border-color: color-mix(
			in srgb,
			var(--line-strong) calc(100% * var(--hero-scroll-progress)),
			transparent
		);
		border-radius: var(--hero-radius);
		box-shadow: 0.2rem 0.25rem 0
			color-mix(in srgb, var(--paper-edge) calc(100% * var(--hero-scroll-progress)), transparent);
	}

	.hero:global([data-scroll-hero]) .hero-content {
		transform: translateY(
			calc((50svh - var(--hero-top) - var(--hero-gap) - 50%) * var(--hero-expanded))
		);
	}

	.hero:global([data-scroll-hero]) .hero-track {
		height: var(--frame-scroll-distance);
	}

	.scroll-cue {
		position: absolute;
		inset-block-end: calc(var(--hero-bottom) + clamp(1.25rem, 4svh, 2rem));
		inset-inline-start: calc(50% - var(--header-control-size) / 2);
		display: none;
		opacity: clamp(0, calc((var(--hero-expanded) - 0.6) * 5), 1);
	}

	.hero:global([data-scroll-cue]) .scroll-cue {
		display: grid;
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

	.paper-print.hero-print {
		inset: calc(-2px * var(--hero-expanded));
		border-radius: max(0px, calc(var(--hero-radius, var(--paper-radius)) - 2px));
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

	.value-stack {
		display: grid;
		gap: clamp(0.875rem, 1.75vw, 1.375rem);
	}

	.value {
		background: linear-gradient(
			100deg,
			var(--card) 30%,
			color-mix(in srgb, var(--card) 58%, transparent) 56%,
			transparent 87%
		);
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

	.values-print {
		mask-image: linear-gradient(to right, transparent 30%, rgb(0 0 0 / 36%) 49%, #000 80%);
	}

	@media (width < 40rem) {
		.value-copy {
			max-inline-size: none;
		}

		.value {
			background: linear-gradient(
				to right,
				var(--card) 26%,
				color-mix(in srgb, var(--card) 73%, transparent) 70%,
				color-mix(in srgb, var(--card) 38%, transparent)
			);
		}

		.values-print {
			mask-image: linear-gradient(to right, transparent 38%, rgb(0 0 0 / 72%) 100%);
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
