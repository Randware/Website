<script lang="ts">
	import Footer from '#lib/components/footer/Footer.svelte';
	import Navbar from '#lib/components/navbar/Navbar.svelte';
	import '../app.css';

	let { children } = $props();
	let pressed: { element: HTMLElement; pointerId: number } | undefined;

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

<div class="site" id="page-top">
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
