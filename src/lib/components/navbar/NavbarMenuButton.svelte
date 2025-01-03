<script lang="ts">
	import { Menu, X } from 'lucide-svelte';

	export let open: boolean = false;

	function toggle() {
		open = !open;
	}
</script>

<button
	on:click={toggle}
	class="relative overflow-hidden rounded-full border-2 border-foreground text-foreground"
>
	<span
		class="relative z-10 flex h-full w-full items-center justify-center p-3"
		class:text-background={open}
	>
		{#if open}
			<X size={26} />
		{:else}
			<Menu size={26} />
		{/if}
	</span>
	<span class="absolute inset-0 overflow-hidden rounded-full">
		<span
			class="absolute left-0 aspect-square w-full origin-center rounded-full bg-foreground transition-all duration-300"
			class:translate-x-0={open}
			class:scale-150={open}
			class:-translate-x-full={!open}
		></span>
	</span>
</button>
