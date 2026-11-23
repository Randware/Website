<script lang="ts">
	import { ArrowUpRight, Github } from 'lucide-svelte';

	let { message, url }: { message: string; url: string } = $props();
</script>

<div class="notice paper-panel">
	<p>{message}</p>
	<a class="button pressable" href={url}>
		<Github size={18} strokeWidth={1.7} aria-hidden="true" />
		Open on GitHub
		<ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
	</a>
</div>

<style>
	.notice {
		max-width: 42rem;
		padding: clamp(1.125rem, 3vw, 1.75rem);
	}

	.button {
		margin-top: 1rem;
	}
</style>
