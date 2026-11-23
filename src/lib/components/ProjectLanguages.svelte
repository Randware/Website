<script lang="ts">
	import { ArrowUpRight } from 'lucide-svelte';
	import type { ProjectLanguage } from '#lib/projects.js';

	let { languages, url }: { languages: ProjectLanguage[] | null; url: string } = $props();
	const total = $derived(languages?.reduce((sum, { bytes }) => sum + bytes, 0) ?? 0);
	const percent = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 1 });
</script>

<section class="languages paper-panel" aria-labelledby="project-languages">
	<h2 id="project-languages">Languages</h2>
	{#if languages && total > 0}
		<p>Share of code bytes on GitHub.</p>
		<ul>
			{#each languages as { name, bytes } (name)}
				{@const share = bytes / total}
				<li>
					<div class="language-label">
						<span>{name}</span>
						<span>{share < 0.001 ? '<0.1%' : percent.format(share)}</span>
					</div>
					<div class="track" aria-hidden="true">
						<span style:width="{share * 100}%"></span>
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

<style>
	.languages {
		padding: clamp(1.125rem, 2.5vw, 1.625rem);
	}

	h2 {
		font-size: 1.375rem;
	}

	p {
		margin-top: 0.375rem;
		color: var(--muted);
		font-size: 0.875rem;
	}

	ul {
		display: grid;
		gap: 0.875rem;
		margin-top: 1.125rem;
	}

	.language-label {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
		font-size: 0.875rem;
		overflow-wrap: anywhere;
	}

	.language-label span:last-child {
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}

	.track {
		height: 0.375rem;
		overflow: hidden;
		border-radius: 0.125rem;
		background: var(--tint);
	}

	.track span {
		display: block;
		height: 100%;
		background: var(--ink);
	}
</style>
