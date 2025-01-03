<script lang="ts">
	import RandwareLogo from './RandwareLogo.svelte';
	import ThemeSwitcher from './ThemeSwitcher.svelte';
</script>

<nav
	class="flex items-center justify-between rounded-full border-2 border-foreground px-6 py-3 text-foreground"
>
	<a href="/" class="h-14 w-14">
		<RandwareLogo />
	</a>

	<div class="flex items-center justify-center space-x-6 font-semibold">
		<a href="/about" class="text-foreground/80 hover:text-foreground/100">About</a>
		<a href="/projects" class="text-foreground/80 hover:text-foreground/100">Projects</a>
		<a href="/contact" class="text-foreground/80 hover:text-foreground/100">Contact</a>
	</div>
	<div>
		<ThemeSwitcher />
	</div>
</nav>
