<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { Moon, Sun } from 'lucide-svelte';
	import { flushSync, onMount } from 'svelte';

	type Theme = 'light' | 'dark';

	let mode = $state<Theme>();
	let preference: Theme | undefined;
	let activeTransition:
		{ animation: ViewTransition; target: Theme; scroll: number; width: number } | undefined;
	const label = $derived(mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');

	beforeNavigate(stopReveal);

	onMount(() => {
		const system = window.matchMedia('(prefers-color-scheme: dark)');
		const saved = document.documentElement.dataset.theme;
		if (saved === 'light' || saved === 'dark') preference = saved;

		function sync() {
			mode = preference ?? (system.matches ? 'dark' : 'light');
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
		document.documentElement.dataset.theme = next;

		try {
			localStorage.setItem('theme', next);
		} catch {
			// The preference still applies to this page.
		}
	}

	function clearReveal(transition: ViewTransition) {
		if (activeTransition?.animation !== transition) return;

		activeTransition = undefined;
		const root = document.documentElement;
		root.classList.remove('theme-reveal');
		root.style.removeProperty('--theme-origin');
		root.style.removeProperty('--theme-radius');
	}

	function stopReveal() {
		if (!activeTransition) return;
		const { animation, target } = activeTransition;
		animation.skipTransition();
		clearReveal(animation);
		if (target !== preference) setTheme(target);
	}

	function toggle(event: MouseEvent & { currentTarget: HTMLButtonElement }) {
		const current = activeTransition?.target ?? mode;
		if (!current) return;

		const next = current === 'dark' ? 'light' : 'dark';
		const animate = matchMedia('(prefers-reduced-motion: no-preference)').matches;
		if (activeTransition || !animate || !document.startViewTransition) {
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
		root.style.setProperty('--theme-origin', origin);
		root.style.setProperty('--theme-radius', `${radius}px`);
		root.classList.add('theme-reveal');

		const animation = document.startViewTransition(() => {
			if (activeTransition?.animation === animation) flushSync(() => setTheme(next));
		});
		activeTransition = { animation, target: next, scroll: scrollY, width: innerWidth };
		void animation.ready.catch(() => {});
		const finish = () => clearReveal(animation);
		void animation.finished.then(finish, finish);
	}

	function onScroll() {
		if (activeTransition && Math.abs(scrollY - activeTransition.scroll) > 1) stopReveal();
	}

	function onResize() {
		// Safari's toolbar can resize vertically without moving the page. That
		// should not cancel a reveal immediately after a tap on the theme control.
		if (activeTransition && innerWidth !== activeTransition.width) stopReveal();
	}
</script>

<svelte:window onscroll={onScroll} onresize={onResize} />

<button
	class="header-control pressable"
	type="button"
	onclick={toggle}
	disabled={!mode}
	class:dark={mode === 'dark'}
	aria-label={label}
	title={label}
>
	<span class="sun" aria-hidden="true"><Sun size={21} strokeWidth={2.1} /></span>
	<span class="moon" aria-hidden="true"><Moon size={20} strokeWidth={2.1} /></span>
</button>

<style>
	button:disabled {
		visibility: hidden;
	}

	span {
		grid-area: 1 / 1;
	}

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
