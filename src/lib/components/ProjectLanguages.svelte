<script lang="ts">
	import { ArrowUpRight } from 'lucide-svelte';
	import type { ProjectLanguage } from '#lib/projects.js';

	let { languages, url }: { languages: ProjectLanguage[] | null; url: string } = $props();
	const total = $derived(languages?.reduce((sum, { bytes }) => sum + bytes, 0) ?? 0);
	const percent = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 1 });
</script>

<section
	class="paper-panel p-[clamp(1.125rem,2.5vw,1.625rem)] [&>p]:mt-1.5 [&>p]:text-[0.875rem] [&>p]:text-muted"
	aria-labelledby="project-languages"
>
	<h2 class="text-[1.375rem]" id="project-languages">Languages</h2>
	{#if languages && total > 0}
		<p>Share of code bytes on GitHub.</p>
		<ul class="mt-[1.125rem] grid gap-3.5">
			{#each languages as { name, bytes } (name)}
				{@const share = bytes / total}
				<li>
					<div class="mb-1 flex justify-between gap-2 text-[0.875rem] wrap-anywhere">
						<span>{name}</span>
						<span class="text-muted tabular-nums">
							{share < 0.001 ? '<0.1%' : percent.format(share)}
						</span>
					</div>
					<div class="h-1.5 overflow-hidden rounded-xs bg-tint" aria-hidden="true">
						<span class="block h-full bg-ink" style:width="{share * 100}%"></span>
					</div>
				</li>
			{/each}
		</ul>
	{:else if languages}
		<p>GitHub hasn’t reported a language breakdown for this repository.</p>
	{:else}
		<p>The language breakdown couldn’t be loaded.</p>
		<a class="text-link" href={url}>
			View on GitHub <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
		</a>
	{/if}
</section>
