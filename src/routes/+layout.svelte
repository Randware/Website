<script lang="ts">
	import Footer from '$lib/components/footer/Footer.svelte';
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<header class="fixed z-50 w-screen px-6 pt-6">
		<Navbar />
	</header>

	<!-- Takes up the navbars space at the top -->
	<div class="invisible">
		<Navbar />
	</div>

	<!-- Add margins for a uniform look -->
	<main class="mx-12 my-32 flex-grow sm:mx-24 md:mx-48 lg:mx-36 xl:mx-48">
		{@render children()}
	</main>

	<!-- Make the footer peek out a bit -->
	<footer class="h-[5vh]">
		<Footer />
	</footer>
</div>
