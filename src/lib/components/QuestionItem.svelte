<script lang="ts">
	export let question: string;
	export let answer: string;
</script>

<div class="flex flex-col">
	<div
		class="font-fancy rounded-t-3xl bg-foreground px-12 py-4 text-center text-xl font-semibold text-background"
	>
		{question}
	</div>

	<!--  TODO: Fix text color transition delay on theme change -->
	<div class="rounded-b-3xl border-2 border-foreground p-8 text-center text-lg">
		<div class="">{answer}</div>
	</div>
</div>
