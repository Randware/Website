<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Brand from '#lib/components/Brand.svelte';
	import ThemeSwitcher from '#lib/components/ThemeSwitcher.svelte';
	import { ArrowRight, Menu, X } from 'lucide-svelte';
	import { onMount } from 'svelte';

	const links = [
		{ label: 'Projects', route: '/projects' },
		{ label: 'About', route: '/about' },
		{ label: 'Contact', route: '/contact' }
	] as const;

	let scrolled = $state(false);
	let menuOpen = $state(false);
	let enhanced = $state(false);
	let headerBar: HTMLDivElement;
	let menuButton: HTMLElement;

	function updateScrollPosition() {
		const offset = window.scrollY;
		if (offset >= 20) scrolled = true;
		else if (offset <= 4) scrolled = false;
	}

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
		updateScrollPosition();

		const desktop = matchMedia('(min-width: 48rem)');
		desktop.addEventListener('change', closeMenu);
		return () => desktop.removeEventListener('change', closeMenu);
	});
</script>

<svelte:window
	onscroll={updateScrollPosition}
	onpointerdown={closeOnOutsidePress}
	onkeydown={closeOnEscape}
/>

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

<header data-floating={scrolled} data-menu-open={menuOpen}>
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
		--header-row-height: 4.75rem;
		--header-motion: 240ms cubic-bezier(0.25, 0.75, 0.35, 1);

		position: sticky;
		z-index: 10;
		inset-block-start: 0;
		min-block-size: calc(var(--header-row-height) + 4px);
		pointer-events: none;
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
		opacity: 0;
		content: '';
	}

	header[data-floating='true']::before {
		opacity: 1;
	}

	.header-bar {
		position: absolute;
		z-index: 0;
		inset: 0 0 auto;
		padding: 2px var(--gutter);
		transform: translateY(0);
		-webkit-user-select: none;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	.header-bar::before {
		position: absolute;
		z-index: -1;
		inset: 0;
		border: 2px solid transparent;
		border-bottom-color: var(--line-strong);
		background-color: var(--card);
		pointer-events: auto;
		content: '';
	}

	header[data-floating='false'][data-menu-open='true'] .header-bar::before {
		box-shadow:
			0 0.25rem 0 var(--paper-edge),
			0 0.5rem 1.2rem rgb(0 0 0 / 12%);
	}

	header[data-floating='true'] .header-bar {
		transform: translateY(var(--floating-offset, 0.875rem));
	}

	header[data-floating='true'] .header-bar::before {
		inset-inline: var(--frame-inset);
		border-color: var(--line-strong);
		border-radius: var(--paper-radius);
		box-shadow:
			0.25rem 0.3125rem 0 var(--line),
			0 -0.5rem 1.5rem rgb(0 0 0 / 20%),
			0 0.4rem 1.2rem rgb(0 0 0 / 10%);
	}

	@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
		header[data-floating='true'] .header-bar::before {
			background-color: color-mix(in srgb, var(--card) 86%, transparent);
			-webkit-backdrop-filter: blur(16px);
			backdrop-filter: blur(16px);
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
		inset-block-start: calc(2px + (var(--header-row-height) - var(--header-control-size)) / 2);
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

		header::before {
			transition: opacity var(--header-motion);
		}

		.header-bar {
			transition: transform var(--header-motion);
		}

		.header-bar::before {
			transition-property: inset-inline, border-radius, border-color, box-shadow;
			transition-duration: 240ms;
			transition-timing-function: cubic-bezier(0.25, 0.75, 0.35, 1);
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
				display: grid;
				grid-template-rows: 0fr;
				opacity: 0;
				transition:
					grid-template-rows var(--header-motion),
					opacity 160ms ease,
					content-visibility 240ms allow-discrete;
			}

			.mobile-menu[open]::details-content {
				grid-template-rows: 1fr;
				opacity: 1;
			}
		}

		@supports not selector(::details-content) {
			.mobile-menu[open] .menu-reveal {
				display: grid;
				animation: reveal-menu var(--header-motion) both;
			}

			@keyframes reveal-menu {
				from {
					grid-template-rows: 0fr;
					opacity: 0;
				}

				to {
					grid-template-rows: 1fr;
					opacity: 1;
				}
			}
		}
	}

	@media (width < 48rem) {
		header {
			--header-row-height: 4.125rem;
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
