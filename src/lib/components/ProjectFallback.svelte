<script lang="ts">
	import { ArrowUpRight, Github } from 'lucide-svelte';

	let { message, url }: { message: string; url: string } = $props();
</script>

<div class="paper-panel max-w-[42rem] p-[clamp(1.125rem,3vw,1.75rem)]">
	<p>{message}</p>
	<a class="button pressable mt-4" href={url}>
		<Github size={18} strokeWidth={1.7} aria-hidden="true" />
		Open on GitHub
		<ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
	</a>
</div>
