<script lang="ts">
	import { theme } from '$lib/store/settings';

	function toggle() {
		const newTheme = $theme === 'dark' ? 'light' : 'dark';
		$theme = newTheme;
	}
</script>

<button
	onclick={toggle}
	class="group relative h-12 w-16 overflow-hidden overflow-x-hidden rounded-full border-2 border-foreground text-foreground hover:text-background"
	><span class="relative z-10 text-xl">
		{#if $theme == 'dark'}
			<i class="fa fa-sun-o" aria-hidden="true"></i>
		{/if}

		{#if $theme == 'light'}
			<i class="fa fa-moon-o" aria-hidden="true"></i>
		{/if}
	</span><span class="absolute inset-0 overflow-hidden rounded-full"
		><span
			class="absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full bg-foreground transition-all duration-300 group-hover:-translate-x-0 group-hover:scale-150"
		></span></span
	></button
>
