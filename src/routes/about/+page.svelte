<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight } from 'lucide-svelte';
	import { members } from '#lib/links.js';

	const storyLayout =
		'grid grid-cols-[minmax(11rem,0.7fr)_minmax(0,1.3fr)] gap-x-10 gap-y-3 border-t border-line py-[clamp(1.75rem,4.5vw,3.25rem)] [@media(max-width:38rem)]:grid-cols-1';
	const storyCopy = 'max-w-[37rem] text-[clamp(1rem,1.8vw,1.125rem)] text-muted';
</script>

<svelte:head>
	<title>About us · Randware</title>
	<meta
		name="description"
		content="How a school project became Randware, and why we like building open-source software together."
	/>
</svelte:head>

<div class="shell pb-[clamp(3rem,7vw,6rem)]">
	<header
		class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-8 [@media(max-width:49rem)]:grid-cols-1"
	>
		<div class="page-heading [@media(max-width:49rem)]:pb-6">
			<h1>About us</h1>
			<p>We’re a group of friends who like making useful things together.</p>
		</div>

		<a
			class="paper-panel pressable flex w-fit items-center gap-4 bg-wash px-[1.125rem] py-4 hover:border-accent [@media(max-width:49rem)]:mb-8"
			href={resolve('/contact#members')}
		>
			<span class="flex shrink-0 pl-1.5">
				{#each members as member (member.name)}
					<img
						class="-ml-1.5 size-[2.875rem] rounded-paper border-2 border-wash object-cover"
						src={member.avatar}
						alt=""
						width="72"
						height="72"
					/>
				{/each}
			</span>
			<span class="flex items-center gap-2.5 text-[0.9375rem] font-medium text-accent">
				Meet the team <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
			</span>
		</a>
	</header>

	<section class={storyLayout} aria-labelledby="origins">
		<h2 class="text-[clamp(1.625rem,3.5vw,2.625rem)]" id="origins">How it started</h2>
		<div>
			<p class={storyCopy}>
				Randware began with a school project in early 2023. That project became
				<a
					class="prose-link"
					href={resolve('/projects/[name]', { name: 'jchad' })}
					data-sveltekit-preload-data="tap"
				>
					JChad
				</a>, a chat platform we wanted to be able to host ourselves.
			</p>
			<p class={[storyCopy, 'mt-3']}>
				We called ourselves Randware, short for “random software.” It seemed fitting at the time,
				and the name stuck.
			</p>
		</div>
	</section>

	<section class={storyLayout} aria-labelledby="open-source">
		<h2 class="text-[clamp(1.625rem,3.5vw,2.625rem)]" id="open-source">Why open source?</h2>
		<div>
			<p class={storyCopy}>
				We like being able to see how the tools we use work and change them when we need to. Sharing
				the code lets you do the same with ours. It also gives us a place to build things together.
			</p>
		</div>
	</section>

	<section class={storyLayout} aria-labelledby="projects">
		<h2 class="text-[clamp(1.625rem,3.5vw,2.625rem)]" id="projects">What we make</h2>
		<div>
			<p class={storyCopy}>
				We follow whatever seems interesting and useful, then pick the tools that fit. That’s led us
				from a chat server to a programming language and a digital garden.
			</p>
			<a class="text-link mt-2" href={resolve('/projects')} data-sveltekit-preload-data="tap">
				Browse projects <ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" />
			</a>
		</div>
	</section>
</div>
