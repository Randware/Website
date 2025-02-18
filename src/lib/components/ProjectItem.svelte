<script lang="ts">
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
		<div class="font-fancy break-words text-lg font-bold sm:text-xl">{project.name}</div>
	</div>
	<div
		class="flex flex-col gap-8 rounded-b-3xl border-2 border-foreground p-8 align-middle text-lg"
	>
		<div class="break-words text-center">{project.about}</div>
		<div class="flex items-center gap-4">
			<div class="flex flex-wrap gap-2">
				<button
					class="rounded-xl bg-foreground px-4 py-2 text-lg text-background hover:bg-foreground/80 hover:transition-colors"
					onclick={toggleModal}
				>
					More
				</button>

				<a
					class="rounded-xl bg-foreground px-4 py-2 text-lg text-background hover:bg-foreground/80 hover:transition-colors"
					href={project.url}
					aria-label="Check out the {project.name} project on GitHub"
					target="_blank"
					rel="noopener noreferrer"
				>
					Source
				</a>
			</div>

			<div class="ml-auto flex items-center gap-2">
				<Star size={20} />
				<div class="text-xl">{project.stars}</div>
			</div>
		</div>
	</div>
</div>

{#if isModalOpen}
	<div
		role="dialog"
		aria-modal="true"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
		onclick={toggleModal}
		in:fly={{ duration: $transitionDuration }}
		out:fly={{ duration: $transitionDuration }}
	>
		<div
			class="relative max-h-[90vh] w-full max-w-[90%] rounded-3xl border-2 border-foreground
                   bg-background sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%] xl:max-w-[55%]"
			onclick={(e) => e.stopPropagation()}
			in:scale={{ duration: $transitionDuration }}
			out:fly={{ duration: $transitionDuration }}
		>
			<div class="flex h-full max-h-[90vh] flex-col">
				<!-- Header -->
				<div
					class="sticky top-0 z-10 flex items-center justify-between rounded-t-full border-b-2 border-foreground bg-background p-6"
				>
					<div class="truncate text-lg font-semibold sm:text-xl">
						More about {project.name}
					</div>
					<button
						onclick={toggleModal}
						class="rounded-full p-2 transition-colors hover:bg-foreground/10"
						aria-label="Close modal"
					>
						<X size={24} />
					</button>
				</div>

				<!-- Content -->
				<div class="no-scrollbar flex-1 overflow-y-auto p-8">
					<div class="prose prose-lg max-w-none dark:prose-invert">
						{@html project.readme}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
