<script lang="ts">
	let { name }: { name: string } = $props();
	const initial = $derived([...name][0]);
</script>

<span
	class={[
		'relative grid aspect-square shrink-0 place-items-center inline-[var(--glyph-size,3.5rem)]',
		'rounded-paper border-2 border-line-strong bg-ink [box-shadow:2px_2px_0_var(--paper-edge)]',
		'font-serif text-[calc(var(--glyph-size,3.5rem)*0.52)] font-bold leading-none text-paper',
		"before:absolute before:inset-[3px] before:rounded-[calc(var(--paper-radius)-4px)] before:border before:border-dashed before:border-current before:opacity-30 before:content-['']"
	]}
	aria-hidden="true"
>
	{initial}
</span>
