<script lang="ts">
	import { Moon, Sun } from 'lucide-svelte';
	import { onMount } from 'svelte';

	type Theme = 'light' | 'dark';

	let mode = $state<Theme>();
	let preference: Theme | undefined;
	const label = $derived(mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');

	onMount(() => {
		const system = window.matchMedia('(prefers-color-scheme: dark)');
		const saved = document.documentElement.dataset.theme;
		if (saved === 'light' || saved === 'dark') preference = saved;

		function sync() {
			mode = preference ?? (system.matches ? 'dark' : 'light');
		}

		sync();
		system.addEventListener('change', sync);
		return () => system.removeEventListener('change', sync);
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

	function toggle(event: MouseEvent & { currentTarget: HTMLButtonElement }) {
		if (!mode) return;
		setTheme(mode === 'dark' ? 'light' : 'dark');

		const ripple = document.getElementById('theme-ripple');
		if (!ripple || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
		const x = left + width / 2;
		const y = top + height / 2;
		const origin = `${x}px ${y}px`;
		const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

		for (const animation of ripple.getAnimations()) animation.cancel();
		ripple.animate(
			[
				{ clipPath: `circle(0 at ${origin})`, opacity: 0.16 },
				{ clipPath: `circle(${radius}px at ${origin})`, opacity: 0 }
			],
			{ duration: 380, easing: 'cubic-bezier(0.25, 0.65, 0.3, 1)' }
		);
	}
</script>

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
