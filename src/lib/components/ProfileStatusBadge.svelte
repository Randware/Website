<script lang="ts">
	import type { ProfileStatus } from '#lib/contact.js';

	let { status }: { status: ProfileStatus } = $props();
	let slot = $state<HTMLDivElement>();
	let message = $state<HTMLSpanElement>();

	$effect(() => {
		const container = slot;
		const label = message;
		if (!container || !label || !status.message) return;

		const range = document.createRange();
		let frame = 0;

		const fitBadge = () => {
			// Let the text wrap at the available width first, then fit its rendered lines.
			label.style.removeProperty('inline-size');
			range.selectNodeContents(label);
			const width = Math.ceil(range.getBoundingClientRect().width);
			if (width && width < label.getBoundingClientRect().width) {
				label.style.inlineSize = `${width}px`;
			}
		};

		function scheduleFit() {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(fitBadge);
		}

		const observer = new ResizeObserver(scheduleFit);
		observer.observe(container);
		document.fonts.addEventListener('loadingdone', scheduleFit);
		scheduleFit();

		return () => {
			observer.disconnect();
			document.fonts.removeEventListener('loadingdone', scheduleFit);
			cancelAnimationFrame(frame);
		};
	});
</script>

<div class="relative z-1 min-w-0 pb-2.5" bind:this={slot}>
	<p
		class="flex w-fit max-w-full items-baseline gap-2 rounded-2xl border-2 border-line-strong bg-card px-2.5 py-1 text-[0.9375rem] leading-snug text-ink"
	>
		<span class="sr-only">GitHub status</span>
		{#if status.emoji}
			<span class="shrink-0" aria-hidden={status.message ? 'true' : undefined}>{status.emoji}</span>
		{/if}
		{#if status.message}
			<span class="min-w-0 text-balance wrap-anywhere" bind:this={message}>{status.message}</span>
		{/if}
	</p>
</div>
