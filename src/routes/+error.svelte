<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { ArrowLeft } from 'lucide-svelte';

	const missing = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{missing ? 'Page not found' : 'Something went wrong'} · Randware</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="shell">
	<div class="page-heading pb-[clamp(3.5rem,8vw,7rem)]">
		<h1>{missing ? 'Page not found' : 'Something went wrong'}</h1>
		<p>
			{missing
				? 'We couldn’t find that page.'
				: (page.error?.message ?? 'Please try again in a moment.')}
		</p>
		<a class="text-link mt-4" href={resolve('/')}>
			<ArrowLeft size={17} strokeWidth={1.8} aria-hidden="true" /> Back to home
		</a>
	</div>
</div>
