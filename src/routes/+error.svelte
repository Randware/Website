<script>
	import { page } from '$app/state';
</script>

<div class="flex h-full items-center justify-center">
	<div class="flex flex-col items-center">
		<div class="font-fancy mb-4 text-6xl font-bold">
			{page.status}
		</div>

		{#if page.error}
			<div class="text-3xl">
				{page.error.message}
			</div>
		{/if}
	</div>
</div>
