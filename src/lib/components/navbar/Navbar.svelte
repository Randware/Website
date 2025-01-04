<script lang="ts">
	import NavbarItem from './NavbarItem.svelte';
	import RandwareLogo from '$lib/components/RandwareLogo.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import NavbarMenuButton from './NavbarMenuButton.svelte';

	import { afterNavigate } from '$app/navigation';
	import { slide } from 'svelte/transition';

	let menuOpen: boolean = false;

	afterNavigate(() => {
		menuOpen = false;
	});

	const navLinks = [
		{ text: 'About', redirect: '/about' },
		{ text: 'Projects', redirect: '/projects' },
		{ text: 'Contact', redirect: '/contact' }
	];
</script>

<nav
	class="z-20 flex items-center justify-between rounded-full border-2 border-foreground bg-background p-3 text-foreground"
>
	<a href="/" class="ms-2 h-14 w-14">
		<RandwareLogo />
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
		class="absolute left-10 right-10 z-10 rounded-b-3xl border-2 border-t-0 border-foreground bg-background md:hidden"
		in:slide={{ duration: 300 }}
		out:slide={{ duration: 300 }}
	>
		<div class="flex flex-col items-center space-y-4 p-6 text-lg font-semibold">
			{#each navLinks as { text, redirect }}
				<NavbarItem {text} {redirect} />
			{/each}
		</div>
	</div>
{/if}
