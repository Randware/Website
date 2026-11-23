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

<div class="shell contact">
	<header class="page-heading">
		<h1>Contact</h1>
		<p>Find the people behind Randware and the places we share our work.</p>
	</header>

	<div class="contact-grid">
		<section aria-labelledby="members">
			<h2 id="members">Members</h2>
			<ul class="member-grid">
				{#each members as { name, avatar, links } (name)}
					<li><UserLinkCollection {name} {avatar} {links} /></li>
				{/each}
			</ul>
		</section>

		<section aria-labelledby="organization">
			<h2 id="organization">Randware</h2>
			<div class="organization-card paper-panel">
				<div class="organization-mark" aria-hidden="true">
					<RandwareLogo size={56} />
				</div>
				<LinkCollection links={organizationLinks} label="Randware profiles" />
			</div>
		</section>
	</div>
</div>

<style>
	.contact {
		padding-bottom: clamp(3rem, 7vw, 6rem);
	}

	.contact-grid {
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
		gap: 2rem clamp(1.125rem, 4vw, 3.25rem);
		padding-top: clamp(1.5rem, 3vw, 2.25rem);
		border-top: 1px solid var(--line);
	}

	h2 {
		margin-bottom: 1rem;
		font-size: clamp(1.65rem, 3.4vw, 2.25rem);
		scroll-margin-block-start: 1.25rem;
	}

	.member-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.organization-card {
		padding: clamp(1.125rem, 2.5vw, 1.5rem);
		background: var(--wash);
	}

	.organization-mark {
		display: grid;
		width: 4.5rem;
		height: 4.5rem;
		place-items: center;
		margin-bottom: 0.875rem;
		color: var(--ink);
	}

	@media (max-width: 48rem) {
		.contact-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	@media (max-width: 31rem) {
		.member-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
