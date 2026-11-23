<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight } from 'lucide-svelte';
	import { members } from '#lib/links.js';
</script>

<svelte:head>
	<title>About us · Randware</title>
	<meta
		name="description"
		content="How a school project became Randware, and why we like building open-source software together."
	/>
</svelte:head>

<div class="shell about">
	<header class="about-header">
		<div class="page-heading">
			<h1>About us</h1>
			<p>We’re a group of friends who like making useful things together.</p>
		</div>

		<a class="people paper-panel pressable" href={resolve('/contact#members')}>
			<span class="avatars">
				{#each members as member (member.name)}
					<img src={member.avatar} alt="" width="72" height="72" />
				{/each}
			</span>
			<span class="people-copy">
				Meet the team <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
			</span>
		</a>
	</header>

	<section class="story" aria-labelledby="origins">
		<h2 id="origins">How it started</h2>
		<div>
			<p>
				Randware began with a school project in early 2023. That project became
				<a
					class="prose-link"
					href={resolve('/projects/[name]', { name: 'jchad' })}
					data-sveltekit-preload-data="tap"
				>
					JChad
				</a>, a chat platform we wanted to be able to host ourselves.
			</p>
			<p>
				We called ourselves Randware, short for “random software.” It seemed fitting at the time,
				and the name stuck.
			</p>
		</div>
	</section>

	<section class="story" aria-labelledby="open-source">
		<h2 id="open-source">Why open source?</h2>
		<div>
			<p>
				We like being able to see how the tools we use work and change them when we need to. Sharing
				the code lets you do the same with ours. It also gives us a place to build things together.
			</p>
		</div>
	</section>

	<section class="story" aria-labelledby="projects">
		<h2 id="projects">What we make</h2>
		<div>
			<p>
				We follow whatever seems interesting and useful, then pick the tools that fit. That’s led us
				from a chat server to a programming language and a digital garden.
			</p>
			<a class="text-link" href={resolve('/projects')} data-sveltekit-preload-data="tap">
				Browse projects <ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" />
			</a>
		</div>
	</section>
</div>

<style>
	.about {
		padding-bottom: clamp(3rem, 7vw, 6rem);
	}

	.about-header {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 0 2rem;
	}

	.people {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: fit-content;
		padding: 1rem 1.125rem;
		background: var(--wash);
	}

	.people:hover {
		border-color: var(--accent);
	}

	.avatars {
		display: flex;
		flex-shrink: 0;
		padding-left: 0.375rem;
	}

	.avatars img {
		width: 2.875rem;
		height: 2.875rem;
		margin-left: -0.375rem;
		border: 2px solid var(--wash);
		border-radius: var(--paper-radius);
		object-fit: cover;
	}

	.people-copy {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		color: var(--accent);
		font-size: 0.9375rem;
		font-weight: 500;
	}

	.story {
		display: grid;
		grid-template-columns: minmax(11rem, 0.7fr) minmax(0, 1.3fr);
		gap: 0.75rem 2.5rem;
		padding-block: clamp(1.75rem, 4.5vw, 3.25rem);
		border-top: 1px solid var(--line);
	}

	.story h2 {
		font-size: clamp(1.625rem, 3.5vw, 2.625rem);
	}

	.story p {
		max-width: 37rem;
		color: var(--muted);
		font-size: clamp(1rem, 1.8vw, 1.125rem);
	}

	.story p + p {
		margin-top: 0.75rem;
	}

	.story .text-link {
		margin-top: 0.5rem;
	}

	@media (max-width: 49rem) {
		.about-header {
			grid-template-columns: minmax(0, 1fr);
		}

		.people {
			margin-bottom: 2rem;
		}

		.page-heading {
			padding-bottom: 1.5rem;
		}
	}

	@media (max-width: 38rem) {
		.story {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
