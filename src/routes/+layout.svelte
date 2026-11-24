<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import Footer from '#lib/components/footer/Footer.svelte';
	import Navbar from '#lib/components/navbar/Navbar.svelte';
	import { syncViewportBleed } from '#lib/viewport.js';
	import { onMount, tick } from 'svelte';
	import bodyFont from '@fontsource/rubik/files/rubik-latin-400-normal.woff2?url';
	import headingFont from '@fontsource/merriweather/files/merriweather-latin-700-normal.woff2?url';
	import mediumFont from '@fontsource/rubik/files/rubik-latin-500-normal.woff2?url';
	import boldFont from '@fontsource/rubik/files/rubik-latin-600-normal.woff2?url';
	import '../app.css';

	let { children } = $props();
	let intro = $state(true);
	let introFrame = 0;
	let pressed:
		{ element: HTMLElement; pointerId: number; startX: number; startY: number } | undefined;

	beforeNavigate(() => {
		intro = false;
		cancelAnimationFrame(introFrame);
		delete document.documentElement.dataset.pageIntro;
	});

	onMount(() => {
		const root = document.documentElement;
		root.dataset.appMounted = '';
		let disposed = false;
		let width = root.clientWidth;
		syncViewportBleed();
		function onResize() {
			if (root.clientWidth === width) return;
			width = root.clientWidth;
			syncViewportBleed();
		}
		window.addEventListener('resize', onResize, { passive: true });

		void (async () => {
			await Promise.allSettled([
				document.fonts.load('400 1em Rubik'),
				document.fonts.load('500 1em Rubik'),
				document.fonts.load('600 1em Rubik'),
				document.fonts.load('700 1em Merriweather')
			]);
			await document.fonts.ready;
			await tick();
			if (disposed || !intro) return;
			const images = [...document.querySelectorAll<HTMLImageElement>('.site img')].filter(
				(image) => {
					const r = image.getBoundingClientRect();
					return r.bottom > 0 && r.top < innerHeight;
				}
			);
			await Promise.allSettled(
				images.map((image) => {
					image.loading = 'eager';
					return image.decode();
				})
			);
			if (disposed || !intro) return;
			// Font layout and the hero's ResizeObserver measurements get a frame
			// each before the first visible frame. Route changes never replay this.
			introFrame = requestAnimationFrame(() => {
				introFrame = requestAnimationFrame(() => {
					if (disposed || !intro) return;
					if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
						intro = false;
						delete root.dataset.pageIntro;
					} else root.dataset.pageIntro = 'ready';
				});
			});
		})();

		return () => {
			disposed = true;
			cancelAnimationFrame(introFrame);
			window.removeEventListener('resize', onResize);
			delete root.dataset.pageIntro;
			delete root.dataset.appMounted;
		};
	});

	function finishIntro(event: AnimationEvent) {
		if (event.target === event.currentTarget) {
			intro = false;
			delete document.documentElement.dataset.pageIntro;
		}
	}

	function startTouchPress(event: PointerEvent) {
		if (!event.isPrimary || event.pointerType !== 'touch' || event.button !== 0) return;
		if (!(event.target instanceof Element)) return;

		const element = event.target.closest<HTMLElement>('.pressable:not(:disabled)');
		if (!element) return;

		clearTouchPress();
		pressed = {
			element,
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY
		};
		element.dataset.pressed = '';
	}

	function finishTouchPress(event: PointerEvent) {
		if (pressed?.pointerId === event.pointerId) clearTouchPress();
	}

	function moveTouchPress(event: PointerEvent) {
		if (pressed?.pointerId !== event.pointerId) return;
		if (Math.hypot(event.clientX - pressed.startX, event.clientY - pressed.startY) > 8) {
			clearTouchPress();
		}
	}

	function clearTouchPress() {
		if (!pressed) return;
		delete pressed.element.dataset.pressed;
		pressed = undefined;
	}
</script>

<svelte:head>
	<link rel="preload" href={bodyFont} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={headingFont} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={mediumFont} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={boldFont} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<svelte:window
	onpointerdown={startTouchPress}
	onpointermove={moveTouchPress}
	onpointerup={finishTouchPress}
	onpointercancel={finishTouchPress}
	onblur={clearTouchPress}
	onscroll={clearTouchPress}
/>

<div class="site" id="page-top" data-intro={intro ? '' : undefined} onanimationend={finishIntro}>
	<a class="skip-link" href="#main-content">Skip to content</a>
	<Navbar />

	<main id="main-content" tabindex="-1">
		{@render children()}
	</main>

	<Footer />
</div>

<style>
	.site {
		display: flex;
		min-height: 100vh;
		min-height: 100svh;
		flex-direction: column;
	}

	@media (prefers-reduced-motion: no-preference) {
		:global(:root[data-page-intro='ready']) .site[data-intro] {
			animation: page-fade-in 420ms ease-out;
		}
	}

	:global(:root[data-page-intro='pending']) .site[data-intro] {
		opacity: 0;
		pointer-events: none;
	}

	@keyframes page-fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	main {
		flex: 1;
	}

	main:focus {
		outline: none;
	}

	.skip-link {
		position: fixed;
		z-index: 20;
		top: 0.75rem;
		left: var(--gutter);
		padding: 0.5rem 1rem;
		border-radius: var(--paper-radius);
		background: var(--accent);
		color: var(--on-accent);
		transform: translateY(calc(-100% - 1rem));
	}

	.skip-link:focus {
		transform: none;
	}
</style>
