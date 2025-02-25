<script lang="ts">
	import NavbarItem from './NavbarItem.svelte';
	import RandwareLogo from '$lib/assets/icons/RandwareLogo.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import NavbarMenuButton from './NavbarMenuButton.svelte';

	import { afterNavigate } from '$app/navigation';
	import { fly, slide } from 'svelte/transition';
	import { transitionDuration } from '$lib/store/settings';
	import { browser } from '$app/environment';

	let menuOpen: boolean = false;

	$: {
		if (browser) {
			if (menuOpen) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}
		}
	}

	afterNavigate(() => {
		menuOpen = false;
	});

	const navLinks = [
		{ text: 'About', redirect: '/about' },
		{ text: 'Projects', redirect: '/projects' },
		{ text: 'Contact', redirect: '/contact' }
	];
</script>

{#if menuOpen}
	<div
		class="fixed inset-0 z-0 bg-black/60 md:hidden"
		in:fly={{ duration: $transitionDuration }}
		out:fly={{ duration: $transitionDuration }}
		onclick={() => (menuOpen = false)}
	></div>
{/if}

<nav
	class="relative z-10 flex items-center justify-between rounded-full border-2 border-foreground bg-background p-3 text-foreground"
>
	<a href="/" aria-label="Go to the start page" class="ms-4">
		<RandwareLogo size={56} />
	</a>

	<div class="hidden items-center justify-center space-x-6 text-lg font-semibold md:flex">
		{#each navLinks as { text, redirect }}
			<NavbarItem {text} {redirect} />
		{/each}
	</div>

	<div class="flex gap-4">
		<ThemeSwitcher />
		<div class="md:hidden">
			<NavbarMenuButton bind:open={menuOpen} />
		</div>
	</div>
</nav>

{#if menuOpen}
	<div
		class="absolute left-16 right-16 z-10 rounded-b-3xl border-2 border-t-0 border-foreground bg-background md:hidden"
		in:slide={{
			duration: $transitionDuration
		}}
		out:slide={{
			duration: $transitionDuration
		}}
	>
		<div class="flex flex-col items-center space-y-4 p-6 text-lg font-semibold">
			{#each navLinks as { text, redirect }}
				<NavbarItem {text} {redirect} />
			{/each}
		</div>
	</div>
{/if}
