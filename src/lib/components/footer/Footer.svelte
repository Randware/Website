<script lang="ts">
	import { Github, Youtube, Gitlab } from 'lucide-svelte';
	import FooterSection from './FooterSection.svelte';
</script>

<div
	class="flex flex-col items-center justify-center gap-16 bg-foreground p-32 text-center text-background lg:flex-row lg:text-start"
>
	<div class="flex flex-col space-y-2">
		<div class="font-fancy text-4xl font-bold">Randware</div>
		<div class="text-xl">Random software, you may enjoy.</div>
	</div>

	<div
		class="flex flex-1 flex-col justify-start gap-x-20 gap-y-10 text-start sm:flex-row lg:justify-evenly lg:gap-0"
	>
		<FooterSection
			heading="Follow us"
			links={[
				{
					icon: Github,
					name: 'GitHub',
					url: 'https://github.com/Randware'
				},
				{
					icon: Youtube,
					name: 'YouTube',
					url: 'https://youtube.com/@randware'
				},
				{
					icon: Gitlab,
					name: 'Gitlab',
					url: 'https://gitlab.com/Randware'
				}
			]}
		/>

		<FooterSection
			heading="Randware"
			links={[
				{
					name: 'About',
					url: '/about'
				},
				{
					name: 'Projects',
					url: '/projects'
				},
				{
					name: 'Contact',
					url: '/contact'
				}
			]}
		/>

		<FooterSection
			heading="Members"
			links={[
				{
					name: '@Dari-OS',
					url: 'https://github.com/Dari-OS'
				},
				{
					name: '@GHaxZ',
					url: 'https://github.com/GHaxZ'
				}
			]}
		/>
	</div>
</div>
