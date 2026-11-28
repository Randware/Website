<script lang="ts">
	import ContactCard from '#lib/components/ContactCard.svelte';
	import { githubPeople } from '#lib/projects.js';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let browserTime = $state<number>();
	let now = $derived(browserTime ?? data.timestamp);
	const cardGrid =
		'grid grid-cols-2 gap-[clamp(1rem,2vw,1.5rem)] [@media(max-width:52rem)]:grid-cols-1';
	const sectionHeading = 'section-heading mb-[clamp(1rem,2vw,1.5rem)]';

	onMount(() => {
		const tick = () => (browserTime = Date.now());
		tick();
		const clock = window.setInterval(tick, 15_000);
		return () => window.clearInterval(clock);
	});
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
	</header>

	<section aria-labelledby="members">
		<h2 class={sectionHeading} id="members">Members</h2>
		{#if data.profiles?.length}
			<ul class={cardGrid}>
				{#each data.profiles as { profile, links } (profile.login)}
					<li class="min-w-0">
						<ContactCard {profile} {links} {now} artworkSeed={data.artworkSeed} />
					</li>
				{/each}
			</ul>
		{:else}
			<p class="text-muted">
				{data.profiles
					? 'No public members are listed.'
					: 'The public member list is temporarily unavailable.'}
			</p>
			<a class="text-link" href={githubPeople} target="_blank" rel="noopener">
				View members on GitHub
			</a>
		{/if}
	</section>

	<section aria-labelledby="organization" class="mt-[clamp(1.75rem,4.5vw,3.25rem)]">
		<h2 class={sectionHeading} id="organization">Organization</h2>
		<div class={cardGrid}>
			<ContactCard
				profile={data.organizationProfile}
				links={data.organizationLinks}
				{now}
				artworkSeed={data.artworkSeed}
				organization
			/>
		</div>
	</section>
</div>
