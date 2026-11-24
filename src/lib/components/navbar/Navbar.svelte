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
			class={[
				'nav-link',
				mobile
					? [
							'pressable flex min-block-13 items-center justify-between gap-1 px-[clamp(0.375rem,1.6vw,1rem)] py-2',
							'rounded-paper border-[1.5px] border-line-strong bg-card [--press-shadow:var(--line)] [--press-x:1px] [--press-y:2px]',
							'font-serif text-[clamp(0.875rem,2.6vw,1.125rem)] font-bold leading-[1.15] tracking-[-0.04em] wrap-anywhere text-ink',
							'[@media(max-width:32rem)]:min-block-12 [@media(max-width:32rem)]:px-3.5 [@media(max-width:32rem)]:text-[1.125rem]'
						]
					: 'relative grid min-h-11 place-items-center text-[clamp(1rem,1.6vw,1.125rem)] font-semibold text-muted'
			]}
			href={resolve(route)}
			aria-current={current ? 'page' : inSection ? 'location' : undefined}
			onclick={closeMenu}
		>
			<span>{label}</span>
			{#if mobile}
				<span class="tab-arrow shrink-0" aria-hidden="true">
					<ArrowRight size={18} strokeWidth={1.8} />
				</span>
			{/if}
		</a>
	{/each}
{/snippet}

<header
	class="pointer-events-none sticky z-10 inset-bs-0 min-block-(--site-header-height) max-md:[--floating-offset:0.625rem]"
	data-floating={scrollProgress > 0}
	data-menu-open={menuOpen}
	style:--page-scroll-progress={scrollProgress}
>
	<div
		class="header-bar absolute inset-x-0 top-0 z-0 select-none px-(--gutter) pb-0.5 pt-[calc(2px+var(--header-safe-top))]"
		bind:this={headerBar}
	>
		<div
			class={[
				'pointer-events-auto mx-auto grid min-h-(--header-row-height) max-w-[74rem] items-center',
				'grid-cols-[minmax(max-content,1fr)_auto_minmax(max-content,1fr)] gap-[clamp(0.875rem,2.4vw,2rem)]',
				'max-md:grid-cols-[1fr_auto] max-md:gap-4 max-md:pe-[calc(var(--header-control-size)+0.5rem)]'
			]}
		>
			<Brand size={56} showName={false} />

			<nav
				class="desktop-links flex items-center gap-[clamp(1rem,3vw,2.375rem)] max-md:hidden"
				aria-label="Main navigation"
				data-sveltekit-preload-data="tap"
			>
				{@render navigationLinks(false)}
			</nav>

			<div class="justify-self-end">
				<ThemeSwitcher />
			</div>
		</div>

		<details class="mobile-menu hidden max-md:block" bind:open={menuOpen}>
			<summary
				class="header-control menu-control pressable pointer-events-auto absolute list-none inset-bs-[calc(2px+var(--header-safe-top)+(var(--header-row-height)-var(--header-control-size))/2)] inset-e-(--gutter)"
				aria-label="Navigation menu"
				aria-controls="mobile-navigation"
				bind:this={menuButton}
			>
				<span class="menu-icon [grid-area:1/1]" aria-hidden="true">
					<Menu size={22} strokeWidth={2.1} />
				</span>
				<span class="close-icon [grid-area:1/1]" aria-hidden="true">
					<X size={22} strokeWidth={2.1} />
				</span>
			</summary>

			<div class="menu-reveal overflow-hidden min-block-0" inert={enhanced && !menuOpen}>
				<div class="overflow-hidden min-block-0">
					<nav
						id="mobile-navigation"
						class="mobile-links pointer-events-auto mb-3 mt-1 grid grid-cols-3 gap-3 overflow-y-auto p-1.5 max-block-[calc(100dvh-var(--header-row-height)-2rem)] [@media(max-width:32rem)]:grid-cols-1"
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

<style lang="postcss">
	@reference '../../../app.css';

	header {
		--header-motion: 240ms cubic-bezier(0.2, 0.7, 0.3, 1);
		--header-detach: var(--page-scroll-progress, 0);
		--header-menu-shadow: 0;
		--header-safe-top: env(safe-area-inset-top, 0px);
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
		transform: translateY(calc(var(--floating-offset, 0.875rem) * var(--header-detach)));
		/* Menu expansion only lays out this floating surface and its contents. */
		contain: layout;
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
		header[data-floating='true'] .header-bar::before {
			background-color: color-mix(
				in srgb,
				var(--card) calc(100% - 14% * var(--header-detach)),
				transparent
			);
		}

		header[data-floating='true'] .header-bar::after {
			/* Keep the blur inside the stroke. Safari can then sample the outer
			   paper surface for its toolbar tint without a backdrop-filter there. */
			position: absolute;
			z-index: -2;
			inset: calc(var(--header-safe-top) + 2px)
				calc(var(--frame-inset) * var(--header-detach) + 2px) 2px;
			border-radius: max(0px, calc(var(--paper-radius) * var(--header-detach) - 2px));
			-webkit-backdrop-filter: blur(16px);
			backdrop-filter: blur(16px);
			pointer-events: none;
			content: '';
		}
	}

	.desktop-links .nav-link::after {
		@apply absolute inset-x-0 bottom-[0.3rem] h-0.5 origin-left rounded-[1px] bg-current opacity-0 content-[''];
		transform: scaleX(0);
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

	.menu-control::-webkit-details-marker {
		display: none;
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
		@apply border-ink bg-ink text-paper;
	}

	.mobile-links .nav-link[aria-current] {
		@apply border-ink bg-ink text-paper;
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
				display: grid;
				grid-template-rows: 0fr;
				opacity: 0;
				transform: translateY(-0.375rem);
				transition:
					grid-template-rows var(--header-motion),
					opacity 160ms ease-out,
					transform var(--header-motion),
					content-visibility 240ms allow-discrete;
			}

			.mobile-menu[open]::details-content {
				grid-template-rows: 1fr;
				opacity: 1;
				transform: none;
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
					transform: translateY(-0.375rem);
				}

				to {
					grid-template-rows: 1fr;
					opacity: 1;
					transform: none;
				}
			}
		}
	}
</style>
