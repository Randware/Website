<script lang="ts">
	import { UserRound } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	let { src, children }: { src?: string; children?: Snippet } = $props();
	let failedSource = $state<string>();
</script>

<span class="avatar-frame" aria-hidden="true">
	{#if src && src !== failedSource}
		<img
			{src}
			alt=""
			width="120"
			height="120"
			referrerpolicy="no-referrer"
			onerror={() => (failedSource = src)}
		/>
	{:else if children}
		{@render children()}
	{:else}
		<UserRound size={26} strokeWidth={1.5} />
	{/if}
</span>

<style>
	.avatar-frame {
		display: grid;
		inline-size: var(--avatar-size, 7rem);
		block-size: var(--avatar-size, 7rem);
		flex-shrink: 0;
		place-items: center;
		padding: var(--avatar-gap, 0.25rem);
		border: var(--avatar-border-width, 3px) solid var(--line-strong);
		border-radius: 50%;
		background: var(--avatar-stock, var(--card));
		box-shadow: var(--avatar-shadow, none);
	}

	img {
		display: block;
		inline-size: 100%;
		block-size: 100%;
		border-radius: inherit;
		object-fit: cover;
	}
</style>
