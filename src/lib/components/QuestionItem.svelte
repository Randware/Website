<script lang="ts">
	export let question: string;
	export let answer: string;
</script>

<div class="flex flex-col">
	<div
		class="font-fancy rounded-t-3xl bg-foreground px-12 py-4 text-center text-lg font-semibold text-background transition-colors"
	>
		{question}
	</div>

	<!--  TODO: Fix text color transition delay on theme change -->
	<div
		class="text-md rounded-b-3xl border-2 border-foreground px-12 py-4 text-center transition-colors"
	>
		<div class="">{answer}</div>
	</div>
</div>
