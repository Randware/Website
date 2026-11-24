<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowDown, ArrowRight, Github } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import PaperArtwork from '#lib/components/PaperArtwork.svelte';
	import ProjectFallback from '#lib/components/ProjectFallback.svelte';
	import ProjectItem from '#lib/components/ProjectItem.svelte';
	import { githubProfile, githubRepositories } from '#lib/projects.js';
	import { easedScrollProgress, heroScrollProgress, visibleViewportHeight } from '#lib/scroll.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let hero: HTMLElement;
	let heroContent: HTMLDivElement;
	let heroStage: HTMLDivElement;
	let heroFrame: HTMLDivElement;
	let heroPrint: HTMLDivElement;
	let heroOutline: HTMLDivElement;
	let scrollCue: HTMLButtonElement;
	let valuesHeading: HTMLHeadingElement;
	let valueStack: HTMLDivElement;

	const description =
		'We’re a group of friends who like making open-source software. Take a look at what we’ve built.';

	onMount(() => {
		const motion = matchMedia('(prefers-reduced-motion: reduce)');
		const listeners = new AbortController();
		const root = document.documentElement;
		const nativeScroll =
			CSS.supports('animation-timeline: scroll(root block)') &&
			CSS.supports('animation-range: 0px 1px');
		let distance = 0;
		let extra = 0;
		let paintExtra = 0;
		let bleed = 0;
		let gap = 0;
		let inset = 0;
		let radius = 0;
		let frame = 0;
		let measureFrame = 0;
		let measuredWidth = 0;
		let previousProgress = -1;

		function draw() {
			frame = 0;
			const progress = distance ? easedScrollProgress(scrollY, distance) : 1;
			if (progress === previousProgress) return;

			// Update only the moving surfaces in the fallback. An inherited scroll
			// variable forces WebKit to resolve every gradient inside the artwork.
			if (!nativeScroll && distance) {
				// A tenth of linear scroll is 0.19 after the shared quadratic easing.
				const contraction = (paintExtra - bleed) * progress + bleed * Math.min(1, progress / 0.19);
				heroStage.style.transform = `translateY(${Math.min(distance, Math.max(0, scrollY))}px)`;
				heroFrame.style.clipPath = `inset(${gap * progress}px ${inset * progress}px ${contraction + gap * progress}px round ${radius * progress}px)`;
				heroPrint.style.transform = `translateY(${-contraction * 0.5}px)`;
				heroContent.style.transform = `translateY(${extra * (1 - progress) * 0.5}px)`;
				// The outline fades in during the last quarter of the scroll, once
				// the clipping edge is close to the outline's final position.
				heroOutline.style.opacity = String(Math.max(0, (progress - 0.9375) * 16));
				scrollCue.style.transform = `translateY(${extra * (1 - progress)}px)`;
			}
			scrollCue.style.opacity = String(Math.min(1, Math.max(0, (0.4 - progress) * 5)));
			heroScrollProgress.set(distance ? progress : undefined);
			hero.toggleAttribute('data-scroll-cue', distance > 0 && progress < 0.4);
			hero.toggleAttribute('data-hero-active', distance > 0 && progress < 1);
			hero.toggleAttribute('data-hero-contracting', progress > 0 && progress < 1);
			previousProgress = progress;
		}

		function measure() {
			measureFrame = 0;
			hero.setAttribute('data-hero-ready', '');
			const top = hero.getBoundingClientRect().top + scrollY;
			const viewportHeight = visibleViewportHeight(root.clientHeight, window.visualViewport);
			const stageHeight = heroStage.getBoundingClientRect().height;
			extra = viewportHeight - top - stageHeight;
			const enabled = !motion.matches && viewportHeight - top > heroContent.offsetHeight + 88;
			measuredWidth = root.clientWidth;
			distance = enabled ? Math.min(320, Math.max(160, viewportHeight * 0.34)) : 0;
			hero.style.setProperty('--hero-top', `${top}px`);
			hero.style.setProperty('--hero-extra', `${extra}px`);
			hero.style.setProperty('--hero-stage-height', `${stageHeight}px`);
			hero.style.setProperty('--hero-scroll-distance', `${distance}px`);
			hero.toggleAttribute('data-scroll-hero', enabled);
			hero.toggleAttribute('data-native-scroll', enabled && nativeScroll);

			if (!nativeScroll) {
				for (const element of [
					heroStage,
					heroFrame,
					heroPrint,
					heroContent,
					heroOutline,
					scrollCue
				]) {
					element.removeAttribute('style');
				}
				paintExtra = heroFrame.getBoundingClientRect().height - stageHeight;
				bleed = Number.parseFloat(getComputedStyle(heroFrame).paddingBottom);
				const outlineStyle = getComputedStyle(heroOutline);
				gap = Number.parseFloat(getComputedStyle(heroStage).paddingTop);
				inset = Number.parseFloat(outlineStyle.left);
				radius = Number.parseFloat(outlineStyle.borderTopLeftRadius);
			}
			previousProgress = -1;
			cancelAnimationFrame(frame);
			draw();
		}

		function onScroll() {
			if (!distance || (previousProgress === 1 && scrollY >= distance)) return;
			if (scrollY <= 0 && previousProgress > 0) {
				scheduleMeasure();
				return;
			}
			if (!frame) frame = requestAnimationFrame(draw);
		}

		function scheduleMeasure() {
			if (!measureFrame) measureFrame = requestAnimationFrame(measure);
		}

		function onResize() {
			// Mobile toolbars resize the visual viewport during a swipe. Freeze the
			// opening's geometry mid-scroll; refresh it at the top or on rotation.
			if (root.clientWidth === measuredWidth && measuredWidth < 768 && scrollY > 4) return;
			scheduleMeasure();
		}

		const observer = new ResizeObserver(scheduleMeasure);
		observer.observe(heroContent);
		window.addEventListener('scroll', onScroll, { passive: true, signal: listeners.signal });
		window.addEventListener('resize', onResize, { signal: listeners.signal });
		window.visualViewport?.addEventListener('resize', onResize, { signal: listeners.signal });
		motion.addEventListener('change', scheduleMeasure, { signal: listeners.signal });
		measure();

		return () => {
			listeners.abort();
			observer.disconnect();
			cancelAnimationFrame(frame);
			cancelAnimationFrame(measureFrame);
			heroScrollProgress.set(undefined);
		};
	});

	onMount(() => {
		const panels = [...valueStack.querySelectorAll<HTMLElement>('.value')];
		let frame = 0;

		function clipArtwork() {
			frame = 0;
			const stack = valueStack.getBoundingClientRect();
			const path = panels
				.map((panel) => {
					const bounds = panel.getBoundingClientRect();
					const style = getComputedStyle(panel);
					const border = Number.parseFloat(style.borderTopWidth);
					const radius = Math.max(0, Number.parseFloat(style.borderTopLeftRadius) - border);
					const left = bounds.left - stack.left + border;
					const right = bounds.right - stack.left - border;
					const top = bounds.top - stack.top + border;
					const bottom = bounds.bottom - stack.top - border;
					const corner = `A ${radius} ${radius} 0 0 1`;

					return (
						`M ${left + radius} ${top} H ${right - radius} ${corner} ${right} ${top + radius} ` +
						`V ${bottom - radius} ${corner} ${right - radius} ${bottom} ` +
						`H ${left + radius} ${corner} ${left} ${bottom - radius} ` +
						`V ${top + radius} ${corner} ${left + radius} ${top} Z`
					);
				})
				.join(' ');

			valueStack.style.setProperty('--values-clip', `path("${path}")`);
		}

		const observer = new ResizeObserver(() => {
			if (!frame) frame = requestAnimationFrame(clipArtwork);
		});
		observer.observe(valueStack);
		for (const panel of panels) observer.observe(panel);
		clipArtwork();
		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	});

	function scrollToValues() {
		valuesHeading.focus({ preventScroll: true });
		valuesHeading.scrollIntoView({
			behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
			block: 'start'
		});
	}
</script>

<svelte:head>
	<title>Randware · Open-source software</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="Randware · Open-source software" />
	<meta property="og:description" content={description} />
</svelte:head>

<section class="hero text-center" aria-labelledby="home-title" bind:this={hero}>
	<div class="hero-stage relative isolate z-1 py-(--hero-gap)" bind:this={heroStage}>
		<div
			class="hero-frame pointer-events-none absolute -z-1 isolate overflow-hidden rounded-paper bg-card [inset:var(--hero-gap)_var(--hero-inset)]"
			aria-hidden="true"
			bind:this={heroFrame}
		>
			<div
				class="paper-print hero-print pointer-events-none absolute inset-0 -z-1 overflow-hidden bg-wash [contain:layout_paint]"
				bind:this={heroPrint}
			>
				<PaperArtwork seed={data.headlineArtworkSeed} />
			</div>
		</div>
		<div
			class="hero-outline pointer-events-none absolute z-0 rounded-paper border-2 border-line-strong shadow-paper [inset:var(--hero-gap)_var(--hero-inset)]"
			aria-hidden="true"
			bind:this={heroOutline}
		></div>
		<div
			class="shell hero-content relative z-1 px-[calc(2px+clamp(0.875rem,3vw,2rem))] py-[calc(2px+clamp(2.375rem,6.75vw,5.5rem))]"
			bind:this={heroContent}
		>
			<h1
				class="mx-auto max-w-[21ch] text-balance text-[clamp(2.5rem,5.7vw,5.25rem)] leading-[1.1] tracking-[-0.055em]"
				id="home-title"
			>
				Random software you might enjoy
			</h1>
			<p
				class="mx-auto mt-5 max-w-lg text-balance text-[clamp(1.0625rem,1.65vw,1.25rem)] leading-[1.55] text-muted"
			>
				We ❤️ software
			</p>
			<div
				class="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 [@media(max-width:38rem)]:mt-5 [@media(max-width:38rem)]:gap-x-4"
			>
				<a class="button pressable" href={resolve('/projects')} data-sveltekit-preload-data="tap">
					Browse projects <ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" />
				</a>
				<a class="text-link" href={githubProfile}>
					<Github size={18} strokeWidth={1.7} aria-hidden="true" /> GitHub
				</a>
			</div>
		</div>
		<button
			class="header-control pressable scroll-cue absolute hidden inset-be-[calc(var(--hero-gap)+0.75rem+env(safe-area-inset-bottom,0px))] inset-s-[calc(50%-var(--header-control-size)/2)]"
			type="button"
			aria-label="Scroll to what we care about"
			onclick={scrollToValues}
			bind:this={scrollCue}
		>
			<ArrowDown size={21} strokeWidth={1.8} aria-hidden="true" />
		</button>
	</div>
	<div class="hero-track" aria-hidden="true"></div>
</section>

<section
	class="border-y-2 border-line bg-wash py-[clamp(2.75rem,6vw,5.25rem)]"
	aria-labelledby="home-values"
>
	<div class="shell">
		<div
			class="mb-6 flex flex-wrap items-center justify-between gap-x-4 [@media(max-width:38rem)]:mb-3.5"
		>
			<h2 class="section-heading" id="home-values" bind:this={valuesHeading} tabindex="-1">
				What we care about
			</h2>
			<a class="text-link" href={resolve('/about')}>
				About us <ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" />
			</a>
		</div>
		<div class="relative isolate grid gap-[clamp(0.875rem,1.75vw,1.375rem)]" bind:this={valueStack}>
			<div
				class="paper-print values-print pointer-events-none absolute inset-0 -z-1 overflow-hidden rounded-paper-inner bg-wash [contain:layout_paint]"
				aria-hidden="true"
			>
				<PaperArtwork layout="panels" seed={data.valuesArtworkSeed} />
			</div>
			<section class="value paper-panel" aria-labelledby="value-open-source">
				<div class="value-copy">
					<h3 id="value-open-source">Open source</h3>
					<p>
						We like making software people can use, change, and share, even in their own commercial
						projects. If you have an idea or a fix, we’d love your help.
					</p>
				</div>
			</section>
			<section class="value paper-panel" aria-labelledby="value-security">
				<div class="value-copy">
					<h3 id="value-security">Security</h3>
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
					<h3 id="value-performance">Performance</h3>
					<p>
						Slow software gets in the way. We think about speed from the first build and keep
						looking for places to make things faster.
					</p>
				</div>
			</section>
		</div>
	</div>
</section>

<section
	class="shell pb-[clamp(3.5rem,7vw,6rem)] pt-[clamp(2.25rem,5vw,4.25rem)]"
	aria-labelledby="home-projects"
>
	<div
		class="mb-6 flex flex-wrap items-center justify-between gap-x-4 [@media(max-width:38rem)]:mb-3.5"
	>
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

<style lang="postcss">
	@reference '../app.css';

	.hero {
		--hero-gap: clamp(1.25rem, 3.3vw, 3rem);
		--hero-inset: max(var(--gutter), calc((100% - 74rem) / 2));
		--hero-art-height: calc(100vh - var(--hero-top, var(--site-header-height)));
		--hero-art-height: calc(
			100lvh + var(--viewport-bleed) - var(--hero-top, var(--site-header-height))
		);
		--hero-paint-extra: calc(var(--hero-art-height) - var(--hero-stage-height));
		--hero-screen-extra: calc(var(--hero-paint-extra) - var(--viewport-bleed));
	}

	@media (prefers-reduced-motion: no-preference) {
		/* Render the fullscreen opening before hydration as well. Measurement
		   replaces this with the scrollable stage without hiding the page. */
		.hero:not(:global([data-hero-ready])) .hero-stage {
			display: grid;
			min-height: calc(100vh - var(--site-header-height));
			min-height: calc(100svh - var(--site-header-height));
			min-height: calc(100dvh - var(--site-header-height));
			place-items: center;
		}

		.hero:not(:global([data-hero-ready])) .hero-frame,
		.hero:not(:global([data-hero-ready])) .hero-outline {
			inset: 0;
			border-radius: 0;
		}

		.hero:not(:global([data-hero-ready])) .hero-outline {
			border-color: transparent;
			box-shadow: none;
		}

		.hero:not(:global([data-hero-ready])) .hero-frame {
			height: var(--hero-art-height);
		}
	}

	.hero:global([data-scroll-hero]) .hero-frame {
		inset: 0 0 auto;
		height: var(--hero-art-height);
		border-radius: 0;
		padding-block-end: var(--viewport-bleed);
	}

	.hero:global([data-scroll-hero]) .hero-track {
		height: var(--hero-scroll-distance);
	}

	.hero:global([data-scroll-hero]) .hero-outline {
		opacity: 0;
	}

	.hero:global([data-hero-active]) :is(.hero-stage, .hero-print, .hero-content) {
		will-change: transform;
	}

	.hero:global([data-hero-active]) .hero-frame {
		will-change: clip-path;
	}

	/* A normal-flow surface can paint underneath Safari's translucent toolbar.
	   Translate it with scroll instead of pinning/clipping it to the visual viewport.
	   Native timelines also let WebKit compose motion without waiting for JavaScript. */
	.hero:global([data-native-scroll])
		:is(.hero-stage, .hero-frame, .hero-print, .hero-content, .hero-outline, .scroll-cue) {
		animation-duration: 1s;
		animation-timing-function: cubic-bezier(0.333333, 0.666667, 0.666667, 1);
		animation-fill-mode: both;
		animation-timeline: scroll(root block);
		animation-range: 0px var(--hero-scroll-distance);
	}

	.hero:global([data-native-scroll]) .hero-stage {
		animation-name: hold-hero;
		animation-timing-function: linear;
	}

	.hero:global([data-native-scroll]) .hero-frame {
		animation-name: contract-hero;
		animation-timing-function: cubic-bezier(0.333333, 0.350877, 0.666667, 0.684211);
	}

	.hero:global([data-native-scroll]) .hero-print {
		animation-name: center-print;
		animation-timing-function: cubic-bezier(0.333333, 0.350877, 0.666667, 0.684211);
	}

	.hero:global([data-native-scroll]) .hero-content {
		animation-name: center-copy;
	}

	.hero:global([data-native-scroll]) .hero-outline {
		animation-name: outline-hero;
		animation-timing-function: cubic-bezier(0.333333, 0.350877, 0.666667, 0.684211);
	}

	.hero:global([data-native-scroll]) .scroll-cue {
		animation-name: center-cue;
	}

	@keyframes hold-hero {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(var(--hero-scroll-distance));
		}
	}

	@keyframes contract-hero {
		from {
			clip-path: inset(0 0 0 round 0);
		}
		10% {
			/* Withdraw the toolbar overscan first, then follow the original
			   quadratic contraction so the next section never sits under it. */
			clip-path: inset(
				calc(var(--hero-gap) * 0.19) calc(var(--hero-inset) * 0.19)
					calc(var(--viewport-bleed) + (var(--hero-screen-extra) + var(--hero-gap)) * 0.19) round
					calc(var(--paper-radius) * 0.19)
			);
			animation-timing-function: cubic-bezier(0.333333, 0.666667, 0.666667, 1);
		}
		to {
			clip-path: inset(
				var(--hero-gap) var(--hero-inset) calc(var(--hero-paint-extra) + var(--hero-gap)) round
					var(--paper-radius)
			);
		}
	}

	@keyframes center-print {
		from {
			transform: translateY(0);
		}
		10% {
			transform: translateY(calc((var(--viewport-bleed) + var(--hero-screen-extra) * 0.19) * -0.5));
			animation-timing-function: cubic-bezier(0.333333, 0.666667, 0.666667, 1);
		}
		to {
			transform: translateY(calc(var(--hero-paint-extra) * -0.5));
		}
	}

	@keyframes center-copy {
		from {
			transform: translateY(calc(var(--hero-extra) * 0.5));
		}
		to {
			transform: translateY(0);
		}
	}

	@keyframes outline-hero {
		from,
		75% {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes center-cue {
		from {
			transform: translateY(var(--hero-extra));
		}
		to {
			transform: translateY(0);
		}
	}

	.hero:global([data-scroll-cue]) .scroll-cue {
		display: grid;
	}

	.paper-print.hero-print {
		mask-image: radial-gradient(ellipse 51% 76% at center, transparent 43%, #000 100%);
	}

	.hero:global([data-scroll-hero]) .hero-print {
		inset: 0 0 auto;
		height: var(--hero-art-height);
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
		@apply max-inline-[min(68%,42rem)] p-[clamp(1.125rem,3vw,2.375rem)] max-sm:max-inline-none;
	}

	.value h3 {
		@apply text-[clamp(1.375rem,3vw,2.25rem)] tracking-[-0.02em];
	}

	.value p {
		@apply mt-3 text-[clamp(1rem,1.6vw,1.125rem)] text-muted max-inline-[50ch];
	}

	.paper-print {
		--print-grid: color-mix(in srgb, var(--ink) 10%, transparent);
		--print-ink: color-mix(in srgb, var(--ink) 24%, transparent);

		background-image:
			linear-gradient(var(--print-grid) 1px, transparent 1px),
			linear-gradient(90deg, var(--print-grid) 1px, transparent 1px);
		background-size: 12px 12px;
	}

	.values-print {
		clip-path: var(--values-clip, inset(50%));
		mask-image: linear-gradient(to right, transparent 30%, rgb(0 0 0 / 36%) 49%, #000 80%);
	}

	@media (width < 40rem) {
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
</style>
