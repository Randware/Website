<script lang="ts">
	import { theme } from '$lib/store/settings';
	import { fade } from 'svelte/transition';
</script>

<div class="relative h-full w-full">
	{#if $theme === 'light'}
		<enhanced:img
			class="absolute inset-0 h-full w-full object-contain"
			src="$lib/assets/img/logo-light.png"
			alt="Randware logo"
			in:fade={{ duration: 300 }}
			out:fade={{ duration: 300 }}
		/>
	{/if}

	{#if $theme === 'dark'}
		<enhanced:img
			class="absolute inset-0 h-full w-full object-contain"
			src="$lib/assets/img/logo-dark.png"
			alt="Randware logo"
			in:fade={{ duration: 300 }}
			out:fade={{ duration: 300 }}
		/>
	{/if}
</div>
