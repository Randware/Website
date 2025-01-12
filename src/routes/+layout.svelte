<script lang="ts">
	import Footer from '$lib/components/footer/Footer.svelte';
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import '../app.css';

	let { children } = $props();

	let navbar: HTMLElement | undefined = $state(undefined);
</script>

<div class="flex min-h-screen flex-col">
	<header bind:this={navbar} class="fixed z-50 w-screen px-6 pt-6">
		<Navbar />
	</header>

	<!-- This spacer always takes up the height of the navbar at the top of the page -->
	{#if navbar}
		<div style={`height: ${navbar.offsetHeight}px;`}></div>
	{/if}

	<!-- Add margins for a uniform look -->
	<main class="mx-12 my-32 flex-grow sm:mx-24 md:mx-48 lg:mx-36 xl:mx-48">
		{@render children()}
	</main>

	<!-- Make the footer peek out a bit -->
	<footer class="h-[5vh]">
		<Footer />
	</footer>
</div>
