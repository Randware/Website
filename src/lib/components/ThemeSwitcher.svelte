<script lang="ts">
	import { theme } from '$lib/store/settings';
	import { Sun, Moon } from 'lucide-svelte';

	function toggle() {
		const newTheme = $theme === 'dark' ? 'light' : 'dark';
		$theme = newTheme;
	}
</script>

<button
	onclick={toggle}
	class="group relative overflow-hidden overflow-x-hidden rounded-full border-2 border-foreground text-foreground hover:text-background"
>
	<span class="relative z-10 flex h-full w-full items-center justify-center p-3">
		{#if $theme === 'dark'}
			<Sun size={26} />
		{:else}
			<Moon size={26} />
		{/if}
	</span>
	<span class="absolute inset-0 overflow-hidden rounded-full">
		<span
			class="absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full bg-foreground transition-all duration-300 group-hover:-translate-x-0 group-hover:scale-150"
		></span>
	</span>
</button>
