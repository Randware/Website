<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { Moon, Sun } from 'lucide-svelte';
	import { flushSync, onMount } from 'svelte';
	import { createThemeLayer } from '#lib/theme-layer.js';
	import { applyTheme, type Theme } from '#lib/theme.js';

	let mode = $state<Theme>();
	let preference: Theme | undefined;
	let activeTransition:
		| {
				animation: ViewTransition | Animation;
				target: Theme;
				scroll: number;
				width: number;
				layer?: HTMLElement;
				dismiss?: Animation;
				interrupted?: boolean;
		  }
		| undefined;
	const label = $derived(mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
	let settleFrame = 0;
	let gestureFrame = 0;

	beforeNavigate(stopReveal);

	onMount(() => {
		const system = window.matchMedia('(prefers-color-scheme: dark)');
		try {
			const saved = localStorage.getItem('theme');
			if (saved === 'light' || saved === 'dark') preference = saved;
		} catch {
			// With storage disabled the system preference still stays live.
		}

		function sync() {
			mode = preference ?? (system.matches ? 'dark' : 'light');
			applyTheme(mode);
		}

		sync();
		system.addEventListener('change', sync);
		return () => {
			system.removeEventListener('change', sync);
			stopReveal();
		};
	});

	function setTheme(next: Theme) {
		preference = next;
		mode = next;
		applyTheme(next);

		try {
			localStorage.setItem('theme', next);
		} catch {
			// The preference still applies to this page.
		}
	}

	function clearReveal(transition: ViewTransition | Animation, settle = false) {
		if (activeTransition?.animation !== transition) return;

		cancelAnimationFrame(settleFrame);
		cancelAnimationFrame(gestureFrame);
		gestureFrame = 0;
		settleFrame = 0;
		activeTransition.dismiss?.cancel();
		activeTransition.layer?.remove();
		activeTransition = undefined;
		const root = document.documentElement;
		const clearStyles = () => {
			if (activeTransition) return;
			root.classList.remove('theme-reveal');
			root.style.removeProperty('--theme-origin');
			root.style.removeProperty('--theme-radius');
		};
		if (settle)
			settleFrame = requestAnimationFrame(() => {
				settleFrame = requestAnimationFrame(clearStyles);
			});
		else clearStyles();
	}

	function stopReveal() {
		if (!activeTransition) return;
		const { animation, target } = activeTransition;
		if ('skipTransition' in animation) animation.skipTransition();
		else animation.cancel();
		if (target !== preference) flushSync(() => setTheme(target));
		clearReveal(animation, true);
	}

	function dismissForGesture() {
		const current = activeTransition;
		if (!current || current.interrupted) return;
		if (!current.layer || 'skipTransition' in current.animation) {
			stopReveal();
			return;
		}
		current.interrupted = true;
		// Never measure/rebuild a snapshot or force layout in a touch/scroll
		// handler. Finish its color change, then blend the cover into the live,
		// freely scrolling page over a few frames.
		gestureFrame = requestAnimationFrame(() => {
			gestureFrame = 0;
			if (activeTransition !== current) return;
			(current.animation as Animation).finish();
			flushSync(() => setTheme(current.target));
			settleFrame = requestAnimationFrame(() => {
				if (activeTransition !== current || !current.layer) return;
				const fade = current.layer.animate(
					{ opacity: [1, 0] },
					{
						duration: 80,
						easing: 'ease-out',
						fill: 'both'
					}
				);
				current.dismiss = fade;
				void fade.finished.then(
					() => clearReveal(current.animation),
					() => {}
				);
			});
		});
	}

	function toggle(event: MouseEvent & { currentTarget: HTMLButtonElement }) {
		const current = activeTransition?.target ?? mode;
		if (!current) return;

		const next = current === 'dark' ? 'light' : 'dark';
		const animate = matchMedia('(prefers-reduced-motion: no-preference)').matches;
		if (activeTransition || !animate) {
			stopReveal();
			setTheme(next);
			return;
		}

		const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
		const x = left + width / 2;
		const y = top + height / 2;
		const origin = `${x}px ${y}px`;
		const radius =
			Math.hypot(
				Math.max(x, document.documentElement.clientWidth - x),
				Math.max(y, document.documentElement.clientHeight - y, innerHeight - y)
			) + 1;

		const root = document.documentElement;
		cancelAnimationFrame(settleFrame);
		root.style.setProperty('--theme-origin', origin);
		root.style.setProperty('--theme-radius', `${radius}px`);
		root.classList.add('theme-reveal');

		if (CSS.supports('-webkit-touch-callout', 'none') || !document.startViewTransition) {
			const layer = createThemeLayer(next);
			if (!layer) {
				root.classList.remove('theme-reveal');
				root.style.removeProperty('--theme-origin');
				root.style.removeProperty('--theme-radius');
				setTheme(next);
				return;
			}
			const fullRadius =
				Math.hypot(
					Math.max(x, root.clientWidth - x),
					Math.max(y, layer.getBoundingClientRect().height - y)
				) + 1;
			const animation = layer.animate(
				{ clipPath: [`circle(0px at ${origin})`, `circle(${fullRadius}px at ${origin})`] },
				{ duration: 390, easing: 'cubic-bezier(.25,.7,.3,1)', fill: 'both' }
			);
			activeTransition = { animation, target: next, scroll: scrollY, width: innerWidth, layer };
			void animation.finished.then(
				() => {
					if (activeTransition?.animation !== animation || activeTransition.interrupted) return;
					flushSync(() => setTheme(next));
					// Let the real page paint with transitions still disabled before
					// removing its cover. Otherwise Safari can coalesce both changes
					// and start a second color transition after the circle has finished.
					settleFrame = requestAnimationFrame(() => {
						settleFrame = requestAnimationFrame(() => clearReveal(animation));
					});
				},
				() => clearReveal(animation)
			);
			return;
		}

		const animation = document.startViewTransition(() => {
			if (activeTransition?.animation === animation) flushSync(() => setTheme(next));
		});
		activeTransition = { animation, target: next, scroll: scrollY, width: innerWidth };
		void animation.ready.catch(() => {});
		const finish = () => clearReveal(animation);
		void animation.finished.then(finish, finish);
	}

	function onScroll() {
		if (activeTransition && Math.abs(scrollY - activeTransition.scroll) > 1) dismissForGesture();
	}

	function onResize() {
		// Safari's toolbar can resize vertically without moving the page. That
		// should not cancel a reveal immediately after a tap on the theme control.
		if (activeTransition && innerWidth !== activeTransition.width) stopReveal();
	}
</script>

<svelte:window onscroll={onScroll} onpointerdown={dismissForGesture} onresize={onResize} />

<button
	data-theme-toggle
	class="header-control pressable disabled:invisible"
	type="button"
	onclick={toggle}
	disabled={!mode}
	class:dark={mode === 'dark'}
	aria-label={label}
	title={label}
>
	<span class="sun [grid-area:1/1]" aria-hidden="true"><Sun size={21} strokeWidth={2.1} /></span>
	<span class="moon [grid-area:1/1]" aria-hidden="true"><Moon size={20} strokeWidth={2.1} /></span>
</button>

<style>
	.sun,
	button.dark .moon {
		opacity: 0;
		transform: rotate(-35deg) scale(0.75);
	}

	button.dark .sun {
		opacity: 1;
		transform: none;
	}

	@media (prefers-reduced-motion: no-preference) {
		span {
			transition:
				opacity 180ms ease,
				transform 250ms ease;
		}
	}
</style>
