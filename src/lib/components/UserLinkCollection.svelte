<script lang="ts">
	import type { SocialLink } from '#lib/links.js';
	import LinkCollection from './LinkCollection.svelte';

	let { name, avatar, links }: { name: string; avatar: string; links: SocialLink[] } = $props();
</script>

<article class="paper-panel">
	<div class="profile-heading">
		<img src={avatar} alt="" width="72" height="72" />
		<h3>{name}</h3>
	</div>

	<LinkCollection {links} label="{name} profiles" />
</article>

<style>
	article {
		height: 100%;
		min-width: 0;
		padding: clamp(1.125rem, 2.5vw, 1.5rem);
	}

	.profile-heading {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem 1rem;
		margin-bottom: 0.875rem;
	}

	img {
		width: 4.5rem;
		height: 4.5rem;
		border: 1px solid var(--line);
		border-radius: var(--paper-radius);
		object-fit: cover;
	}

	h3 {
		font-size: 1.625rem;
	}
</style>
