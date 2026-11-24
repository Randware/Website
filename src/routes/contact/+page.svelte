<script lang="ts">
	import LinkCollection from '#lib/components/LinkCollection.svelte';
	import UserLinkCollection from '#lib/components/UserLinkCollection.svelte';
	import RandwareLogo from '#lib/assets/icons/RandwareLogo.svelte';
	import { members, organizationLinks } from '#lib/links.js';
</script>

<svelte:head>
	<title>Contact · Randware</title>
	<meta
		name="description"
		content="Find Randware and its members on GitHub, GitLab, and elsewhere."
	/>
</svelte:head>

<div class="shell pb-[clamp(3rem,7vw,6rem)]">
	<header class="page-heading">
		<h1>Contact</h1>
		<p>Find the people behind Randware and the places we share our work.</p>
	</header>

	<div
		class="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-x-[clamp(1.125rem,4vw,3.25rem)] gap-y-8 border-t border-line pt-[clamp(1.5rem,3vw,2.25rem)] [@media(max-width:48rem)]:grid-cols-1"
	>
		<section aria-labelledby="members">
			<h2 class="mb-4 text-[clamp(1.65rem,3.4vw,2.25rem)] scroll-mbs-5" id="members">Members</h2>
			<ul class="grid grid-cols-2 gap-4 [@media(max-width:31rem)]:grid-cols-1">
				{#each members as { name, avatar, links } (name)}
					<li><UserLinkCollection {name} {avatar} {links} /></li>
				{/each}
			</ul>
		</section>

		<section aria-labelledby="organization">
			<h2 class="mb-4 text-[clamp(1.65rem,3.4vw,2.25rem)] scroll-mbs-5" id="organization">
				Randware
			</h2>
			<div class="paper-panel bg-wash p-[clamp(1.125rem,2.5vw,1.5rem)]">
				<div class="mb-3.5 grid size-18 place-items-center text-ink" aria-hidden="true">
					<RandwareLogo size={56} />
				</div>
				<LinkCollection links={organizationLinks} label="Randware profiles" />
			</div>
		</section>
	</div>
</div>
