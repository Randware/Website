<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import Footer from '#lib/components/footer/Footer.svelte';
	import Navbar from '#lib/components/navbar/Navbar.svelte';
	import bodyFont from '@fontsource/rubik/files/rubik-latin-400-normal.woff2?url';
	import headingFont from '@fontsource/merriweather/files/merriweather-latin-700-normal.woff2?url';
	import '../app.css';

	let { children } = $props();
	let intro = $state(true);
	let pressed:
		{ element: HTMLElement; pointerId: number; startX: number; startY: number } | undefined;

	beforeNavigate(() => {
		intro = false;
	});

	function finishIntro(event: AnimationEvent) {
		if (event.target === event.currentTarget) intro = false;
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
		.site[data-intro] {
			/* The root layout persists during navigation, so this only runs on
			   the first document load. Content is never held for hydration/fonts. */
			animation: page-fade-in 420ms ease-out;
		}
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
