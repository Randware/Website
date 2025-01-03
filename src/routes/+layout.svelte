<script lang="ts">
	import Footer from '$lib/components/footer/Footer.svelte';
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="flex h-screen flex-col">
	<!-- Add margins for Navbar -->
	<header class="mx-6 mt-6">
		<Navbar />
	</header>

	<!-- Add margins for a uniform look -->
	<main class="mx-12 my-32 flex-grow sm:mx-24 md:mx-48 lg:mx-36 xl:mx-48">
		{@render children()}
	</main>

	<!-- Make the footer peek out a bit -->
	<footer class="h-[5vh]">
		<Footer />
	</footer>
</div>
