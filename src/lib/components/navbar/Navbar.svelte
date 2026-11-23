<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Brand from '#lib/components/Brand.svelte';
	import ThemeSwitcher from '#lib/components/ThemeSwitcher.svelte';
	import { easedScrollProgress, heroScrollProgress, visibleViewportHeight } from '#lib/scroll.js';
	import { ArrowRight, Menu, X } from 'lucide-svelte';
	import { onMount } from 'svelte';

	const links = [
		{ label: 'Projects', route: '/projects' },
		{ label: 'About', route: '/about' },
		{ label: 'Contact', route: '/contact' }
	] as const;

	let scrollProgress = $state(0);
	let menuOpen = $state(false);
	let enhanced = $state(false);
	let headerBar: HTMLDivElement;
	let menuButton: HTMLElement;

	function closeMenu() {
		menuOpen = false;
	}

	function closeOnOutsidePress(event: PointerEvent) {
		if (menuOpen && event.target instanceof Node && !headerBar.contains(event.target)) closeMenu();
	}

	function closeOnEscape(event: KeyboardEvent) {
		if (event.key !== 'Escape' || !menuOpen) return;

		event.preventDefault();
		closeMenu();
		menuButton.focus({ preventScroll: true });
	}

	afterNavigate(closeMenu);

	onMount(() => {
		enhanced = true;
		const root = document.documentElement;
		const desktop = matchMedia('(min-width: 48rem)');
		const motion = matchMedia('(prefers-reduced-motion: reduce)');
		const listeners = new AbortController();
		const { signal } = listeners;
		let heroProgress: number | undefined;
		let distance = 0;
		let frame = 0;

		function draw() {
			frame = 0;
			if (heroProgress !== undefined) scrollProgress = heroProgress;
			else if (motion.matches) {
				if (scrollY >= 20) scrollProgress = 1;
				else if (scrollY <= 4) scrollProgress = 0;
			} else scrollProgress = easedScrollProgress(scrollY, distance);
		}

		function measure() {
			if (heroProgress === undefined) {
				const height = visibleViewportHeight(root.clientHeight, window.visualViewport);
				distance = Math.min(
					Math.max(0, root.scrollHeight - root.clientHeight),
					Math.min(320, Math.max(160, height * 0.34))
				);
			}
			cancelAnimationFrame(frame);
			draw();
		}

		function onScroll() {
			// The landing page publishes in the same frame as the artwork. Other
			// pages use the original easing, and stop scheduling once fully floated.
			if (heroProgress !== undefined || (scrollProgress === 1 && scrollY >= distance)) return;
			if (!frame) frame = requestAnimationFrame(draw);
		}

		const unsubscribe = heroScrollProgress.subscribe((progress) => {
			heroProgress = progress;
			measure();
		});
		const observer = new ResizeObserver(measure);
		observer.observe(document.body);
		window.addEventListener('scroll', onScroll, { passive: true, signal });
		window.addEventListener('resize', measure, { signal });
		desktop.addEventListener('change', closeMenu, { signal });
		motion.addEventListener('change', measure, { signal });

		return () => {
			listeners.abort();
			unsubscribe();
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	});
</script>

<svelte:window onpointerdown={closeOnOutsidePress} onkeydown={closeOnEscape} />

{#snippet navigationLinks(mobile: boolean)}
	{#each links as { label, route } (route)}
		{@const current = page.route.id === route}
		{@const inSection = page.route.id?.startsWith(`${route}/`)}
		<a
			class="nav-link"
			class:pressable={mobile}
			href={resolve(route)}
			aria-current={current ? 'page' : inSection ? 'location' : undefined}
			onclick={closeMenu}
		>
			<span>{label}</span>
			{#if mobile}
				<span class="tab-arrow" aria-hidden="true"><ArrowRight size={18} strokeWidth={1.8} /></span>
			{/if}
		</a>
	{/each}
{/snippet}

<header
	data-floating={scrollProgress > 0}
	data-menu-open={menuOpen}
	style:--page-scroll-progress={scrollProgress}
>
	<div class="header-bar" bind:this={headerBar}>
		<div class="header-inner">
			<Brand size={56} showName={false} />

			<nav class="desktop-links" aria-label="Main navigation" data-sveltekit-preload-data="tap">
				{@render navigationLinks(false)}
			</nav>

			<div class="theme-control">
				<ThemeSwitcher />
			</div>
		</div>

		<details class="mobile-menu" bind:open={menuOpen}>
			<summary
				class="header-control menu-control pressable"
				aria-label="Navigation menu"
				aria-controls="mobile-navigation"
				bind:this={menuButton}
			>
				<span class="menu-icon" aria-hidden="true"><Menu size={22} strokeWidth={2.1} /></span>
				<span class="close-icon" aria-hidden="true"><X size={22} strokeWidth={2.1} /></span>
			</summary>

			<div class="menu-reveal" inert={enhanced && !menuOpen}>
				<div class="menu-clip">
					<nav
						id="mobile-navigation"
						class="mobile-links"
						aria-label="Main navigation"
						data-sveltekit-preload-data="tap"
					>
						{@render navigationLinks(true)}
					</nav>
				</div>
			</div>
		</details>
	</div>
</header>

<style>
	header {
		--header-motion: 180ms cubic-bezier(0.2, 0.7, 0.3, 1);
		--header-detach: var(--page-scroll-progress, 0);
		--header-menu-shadow: 0;
		--header-safe-top: env(safe-area-inset-top, 0px);

		position: sticky;
		z-index: 10;
		inset-block-start: 0;
		min-block-size: var(--site-header-height);
		pointer-events: none;
	}

	header[data-menu-open='true'] {
		--header-menu-shadow: calc(1 - var(--header-detach));
	}

	header::before {
		position: absolute;
		inset: 0 0 auto;
		height: calc(100% + 2.5rem);
		background: linear-gradient(
			to bottom,
			color-mix(in srgb, var(--paper) 94%, transparent),
			color-mix(in srgb, var(--paper) 65%, transparent) 53%,
			transparent
		);
		opacity: var(--header-detach);
		content: '';
	}

	.header-bar {
		position: absolute;
		z-index: 0;
		inset: 0 0 auto;
		padding: calc(2px + var(--header-safe-top)) var(--gutter) 2px;
		transform: translateY(calc(var(--floating-offset, 0.875rem) * var(--header-detach)));
		-webkit-user-select: none;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	.header-bar::before {
		--floating-opacity: calc(var(--header-detach) * 100%);
		--menu-shadow-opacity: calc(var(--header-menu-shadow) * 100%);

		position: absolute;
		z-index: -1;
		inset: var(--header-safe-top) calc(var(--frame-inset) * var(--header-detach)) 0;
		border: 2px solid color-mix(in srgb, var(--line-strong) var(--floating-opacity), transparent);
		border-bottom-color: var(--line-strong);
		border-radius: calc(var(--paper-radius) * var(--header-detach));
		background-color: var(--card);
		box-shadow:
			0.25rem 0.3125rem 0 color-mix(in srgb, var(--line) var(--floating-opacity), transparent),
			0 -0.5rem 1.5rem rgb(0 0 0 / calc(0.2 * var(--header-detach))),
			0 0.4rem 1.2rem
				rgb(0 0 0 / calc(0.1 * var(--header-detach) + 0.12 * var(--header-menu-shadow))),
			0 0.25rem 0 color-mix(in srgb, var(--paper-edge) var(--menu-shadow-opacity), transparent);
		pointer-events: auto;
		content: '';
	}

	@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
		.header-bar::before {
			background-color: color-mix(
				in srgb,
				var(--card) calc(100% - 14% * var(--header-detach)),
				transparent
			);
			-webkit-backdrop-filter: blur(calc(16px * var(--header-detach)));
			backdrop-filter: blur(calc(16px * var(--header-detach)));
		}
	}

	@media (width < 48rem), (pointer: coarse) {
		.header-bar::before {
			/* Keep the paper and floating morph without continuously filtering
			   every pixel scrolling beneath the header on a phone. */
			background-color: var(--card);
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
		}
	}

	.header-inner {
		display: grid;
		max-width: 74rem;
		min-height: var(--header-row-height);
		grid-template-columns: minmax(max-content, 1fr) auto minmax(max-content, 1fr);
		align-items: center;
		gap: clamp(0.875rem, 2.4vw, 2rem);
		margin-inline: auto;
		pointer-events: auto;
	}

	.theme-control {
		justify-self: end;
	}

	.desktop-links {
		display: flex;
		align-items: center;
		gap: clamp(1rem, 3vw, 2.375rem);
	}

	.nav-link {
		display: grid;
		min-height: 2.75rem;
		place-items: center;
		color: var(--muted);
		font-size: clamp(1rem, 1.6vw, 1.125rem);
		font-weight: 600;
	}

	.desktop-links .nav-link {
		position: relative;
	}

	.desktop-links .nav-link::after {
		position: absolute;
		inset: auto 0 0.3rem;
		height: 2px;
		border-radius: 1px;
		background: currentColor;
		opacity: 0;
		transform: scaleX(0);
		transform-origin: left;
		content: '';
	}

	.desktop-links .nav-link:is([aria-current], :focus-visible) {
		color: var(--ink);
	}

	.desktop-links .nav-link:is([aria-current], :focus-visible)::after {
		opacity: 1;
		transform: scaleX(1);
	}

	@media (hover: hover) and (pointer: fine) {
		.desktop-links .nav-link:hover {
			color: var(--ink);
		}

		.desktop-links .nav-link:hover::after {
			opacity: 1;
			transform: scaleX(1);
		}
	}

	.mobile-menu {
		display: none;
	}

	.menu-control {
		position: absolute;
		inset-block-start: calc(
			2px + var(--header-safe-top) + (var(--header-row-height) - var(--header-control-size)) / 2
		);
		inset-inline-end: var(--gutter);
		list-style: none;
		pointer-events: auto;
	}

	.menu-control::-webkit-details-marker {
		display: none;
	}

	.menu-icon,
	.close-icon {
		grid-area: 1 / 1;
	}

	.close-icon,
	.mobile-menu[open] .menu-icon {
		opacity: 0;
		transform: rotate(-35deg) scale(0.75);
	}

	.mobile-menu[open] .close-icon {
		opacity: 1;
		transform: none;
	}

	.mobile-menu[open] .menu-control {
		border-color: var(--ink);
		background: var(--ink);
		color: var(--paper);
	}

	.menu-reveal,
	.menu-clip {
		min-block-size: 0;
		overflow: hidden;
	}

	.mobile-links {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
		max-block-size: calc(100dvh - var(--header-row-height) - 2rem);
		margin-block: 0.25rem 0.75rem;
		overflow-y: auto;
		padding: 0.375rem;
		pointer-events: auto;
	}

	.mobile-links .nav-link {
		--press-x: 1px;
		--press-y: 2px;
		--press-shadow: var(--line);

		display: flex;
		min-block-size: 3.25rem;
		align-items: center;
		justify-content: space-between;
		gap: 0.25rem;
		padding: 0.5rem clamp(0.375rem, 1.6vw, 1rem);
		border: 1.5px solid var(--line-strong);
		border-radius: var(--paper-radius);
		background: var(--card);
		color: var(--ink);
		font-family: var(--serif);
		font-size: clamp(0.875rem, 2.6vw, 1.125rem);
		font-weight: 700;
		letter-spacing: -0.04em;
		line-height: 1.15;
		overflow-wrap: anywhere;
	}

	.tab-arrow {
		flex-shrink: 0;
	}

	.mobile-links .nav-link[aria-current] {
		border-color: var(--ink);
		background: var(--ink);
		color: var(--paper);
	}

	@media (prefers-reduced-motion: no-preference) {
		.desktop-links .nav-link {
			transition: color 160ms ease;
		}

		.desktop-links .nav-link::after {
			transition:
				transform 180ms ease-out,
				opacity 180ms ease;
		}

		.menu-icon,
		.close-icon {
			transition:
				opacity 150ms ease,
				transform 210ms ease;
		}

		.tab-arrow {
			transition: transform 140ms ease;
		}

		@media (hover: hover) and (pointer: fine) {
			.mobile-links .nav-link:hover .tab-arrow {
				transform: translateX(0.1875rem);
			}
		}

		@supports selector(::details-content) {
			.mobile-menu::details-content {
				opacity: 0;
				transform: translateY(-0.375rem);
				transition:
					opacity 140ms ease-out,
					transform var(--header-motion),
					content-visibility 180ms allow-discrete;
			}

			.mobile-menu[open]::details-content {
				opacity: 1;
				transform: none;
			}
		}

		@supports not selector(::details-content) {
			.mobile-menu[open] .menu-reveal {
				animation: reveal-menu var(--header-motion) both;
			}

			@keyframes reveal-menu {
				from {
					opacity: 0;
					transform: translateY(-0.375rem);
				}

				to {
					opacity: 1;
					transform: none;
				}
			}
		}
	}

	@media (width < 48rem) {
		header {
			--floating-offset: 0.625rem;
		}

		.header-inner {
			grid-template-columns: 1fr auto;
			gap: 1rem;
			padding-inline-end: calc(var(--header-control-size) + 0.5rem);
		}

		.desktop-links {
			display: none;
		}

		.mobile-menu {
			display: block;
		}
	}

	@media (max-width: 32rem) {
		.mobile-links {
			grid-template-columns: minmax(0, 1fr);
		}

		.mobile-links .nav-link {
			min-block-size: 3rem;
			padding-inline: 0.875rem;
			font-size: 1.125rem;
		}
	}
</style>
