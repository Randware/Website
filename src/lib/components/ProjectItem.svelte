<script lang="ts">
	//  TODO:
	//  - Add proper css for GitHub specific markdown (alerts for example)
	//  - Change modal width based on screen size
	//  - Make text wrap correctly

	import 'github-markdown-css';
	import { transitionDuration } from '$lib/store/settings';
	import { X, Star } from 'lucide-svelte';
	import { fly, scale } from 'svelte/transition';
	import type { Project } from '$lib/store/projects';
	import { onMount } from 'svelte';

	export let project: Project;

	let isModalOpen = false;

	function toggleModal() {
		isModalOpen = !isModalOpen;

		if (isModalOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	}

	onMount(() => {
		document.body.style.overflow = 'auto';
	});
</script>

<div class="flex flex-col rounded-3xl">
	<div class="rounded-t-3xl bg-foreground px-12 py-4 text-center text-background">
		<div class="font-fancy text-xl font-bold">{project.name}</div>
	</div>
	<div
		class="flex flex-col gap-8 rounded-b-3xl border-2 border-foreground p-8 align-middle text-lg"
	>
		<div class="text-lg">{project.about}</div>
		<div class="flex">
			<div class="flex gap-2">
				<button
					class="rounded-xl bg-foreground px-4 py-2 text-lg text-background hover:bg-foreground/80 hover:transition-colors"
					onclick={toggleModal}
				>
					More
				</button>

				<a
					class="rounded-xl bg-foreground px-4 py-2 text-lg text-background hover:bg-foreground/80 hover:transition-colors"
					href={project.url}
					target="_blank"
				>
					Source
				</a>
			</div>

			<div class="ms-auto flex items-center gap-2">
				<Star size={26} />
				<div class="text-xl">{project.stars}</div>
			</div>
		</div>
	</div>
</div>

{#if isModalOpen}
	<!-- Dim background and close modal if the outside area is clicked -->
	<div
		role="navigation"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
		onclick={toggleModal}
		in:fly={{
			duration: $transitionDuration
		}}
		out:fly={{
			duration: $transitionDuration
		}}
	>
		<!-- Main modal container -->
		<div
			role="dialog"
			class="scrollbar fixed bottom-6 top-6 mx-6 overflow-y-auto rounded-3xl border-2 border-foreground bg-background"
			onclick={(e) => e.stopPropagation()}
			in:scale={{
				duration: $transitionDuration
			}}
			out:fly={{
				duration: $transitionDuration
			}}
		>
			<div class="flex flex-col gap-6 overflow-y-auto p-8">
				<!-- Head -->
				<div class="sticky flex items-center justify-between bg-background">
					<div class="text-xl font-semibold">More about {project.name}</div>

					<button onclick={toggleModal}>
						<X size={26} />
					</button>
				</div>

				<hr class="rounded-full border-2 border-foreground" />

				<!-- Body -->
				<div class="prose dark:prose-invert">
					{@html project.readme}
				</div>
			</div>
		</div>
	</div>
{/if}
