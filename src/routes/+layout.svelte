<script lang="ts">
	import Footer from '#lib/components/footer/Footer.svelte';
	import Navbar from '#lib/components/navbar/Navbar.svelte';
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();
	let site: HTMLDivElement;
	let pressed: { element: HTMLElement; pointerId: number } | undefined;

	onMount(() => {
		const root = document.documentElement;
		if (root.dataset.pageIntro === 'static') {
			const frame = requestAnimationFrame(() => delete root.dataset.pageIntro);
			return () => cancelAnimationFrame(frame);
		}
		if (root.dataset.pageIntro !== 'pending') return;
		root.dataset.pageIntro = 'preparing';
		const page = site;
		page.addEventListener('animationcancel', finishPageFade);

		let frame = 0;
		let disposed = false;
		void document.fonts.ready.then(() => {
			if (disposed) return;
			// Let the hero's resize and scroll measurements settle with the loaded fonts.
			frame = requestAnimationFrame(() => {
				frame = requestAnimationFrame(() => {
					if (matchMedia('(prefers-reduced-motion: reduce)').matches) delete root.dataset.pageIntro;
					else root.dataset.pageIntro = 'ready';
				});
			});
		});

		return () => {
			disposed = true;
			cancelAnimationFrame(frame);
			page.removeEventListener('animationcancel', finishPageFade);
			delete root.dataset.pageIntro;
		};
	});

	function finishPageFade(event: AnimationEvent) {
		if (event.target === event.currentTarget) delete document.documentElement.dataset.pageIntro;
	}

	function startTouchPress(event: PointerEvent) {
		if (!event.isPrimary || event.pointerType !== 'touch' || event.button !== 0) return;
		if (!(event.target instanceof Element)) return;

		const element = event.target.closest<HTMLElement>('.pressable:not(:disabled)');
		if (!element) return;

		clearTouchPress();
		pressed = { element, pointerId: event.pointerId };
		element.dataset.pressed = '';
	}

	function finishTouchPress(event: PointerEvent) {
		if (pressed?.pointerId === event.pointerId) clearTouchPress();
	}

	function clearTouchPress() {
		if (!pressed) return;
		delete pressed.element.dataset.pressed;
		pressed = undefined;
	}
</script>

<svelte:window
	onpointerdown={startTouchPress}
	onpointerup={finishTouchPress}
	onpointercancel={finishTouchPress}
	onblur={clearTouchPress}
/>

<div class="site" id="page-top" bind:this={site} onanimationend={finishPageFade}>
	<a class="skip-link" href="#main-content">Skip to content</a>
	<Navbar />

	<main id="main-content" tabindex="-1">
		{@render children()}
	</main>

	<Footer />
</div>
<div id="theme-ripple" aria-hidden="true"></div>

<style>
	.site {
		display: flex;
		min-height: 100vh;
		flex-direction: column;
	}

	@media (prefers-reduced-motion: no-preference) {
		:global(:root[data-page-intro='ready']) .site {
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

	#theme-ripple {
		position: fixed;
		z-index: 11;
		inset: 0;
		background: var(--ink);
		opacity: 0;
		pointer-events: none;
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
