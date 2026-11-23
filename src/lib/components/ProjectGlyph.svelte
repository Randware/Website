<script lang="ts">
	let { name }: { name: string } = $props();
	const initial = $derived([...name][0]);
</script>

<span class="glyph" aria-hidden="true">
	{initial}
</span>

<style>
	.glyph {
		position: relative;
		display: grid;
		inline-size: var(--glyph-size, 3.5rem);
		aspect-ratio: 1;
		flex-shrink: 0;
		place-items: center;
		border: 2px solid var(--line-strong);
		border-radius: var(--paper-radius);
		background: var(--ink);
		box-shadow: 2px 2px 0 var(--paper-edge);
		color: var(--paper);
		font-family: var(--serif);
		font-size: calc(var(--glyph-size, 3.5rem) * 0.52);
		font-weight: 700;
		line-height: 1;
	}

	.glyph::before {
		position: absolute;
		inset: 3px;
		border: 1px dashed currentColor;
		border-radius: calc(var(--paper-radius) - 4px);
		opacity: 0.3;
		content: '';
	}
</style>
