<script>
	import LinkCollection from '$lib/components/LinkCollection.svelte';
	import UserLinkCollection from '$lib/components/UserLinkCollection.svelte';
	import { Container, Github, Gitlab, Youtube } from 'lucide-svelte';
	import Twitch from 'lucide-svelte/icons/twitch';

	import ghaxzPicture from '$lib/assets/images/ghaxz-picture.png?enhanced';
	import dariosPicture from '$lib/assets/images/darios-picture.png?enhanced';
</script>

<div class="space-y-32">
	<div class="flex flex-col items-center gap-12 md:flex-row">
		<div class="flex-1 text-center">
			<h2 class="font-fancy mb-4 text-4xl font-bold">Where to find us.</h2>
			<div class="mb-6 text-xl">Contact us, or check out our work.</div>
		</div>
	</div>

	<div class="flex flex-col items-center gap-32 lg:flex-row lg:items-start">
		<div class="flex flex-1 flex-col items-center gap-6">
			<div class="font-fancy text-4xl font-bold">Randware</div>

			<LinkCollection
				links={[
					{
						name: 'GitHub',
						url: 'https://github.com/Randware',
						icon: Github
					},
					{
						name: 'Gitlab',
						url: 'https://gitlab.com/Randware',
						icon: Gitlab
					},
					{
						name: 'YouTube',
						url: 'https://youtube.com/@Randware',
						icon: Youtube
					},
					{
						name: 'Docker',
						url: 'https://registry.hub.docker.com/u/randware',
						icon: Container
					}
				]}
			/>
		</div>

		<div class="flex flex-1 flex-col items-center gap-y-6">
			<div class="font-fancy text-4xl font-bold">Members</div>

			<div class="flex flex-wrap justify-evenly gap-x-24 gap-y-12">
				<UserLinkCollection
					username="GHaxZ"
					picture={ghaxzPicture}
					links={[
						{
							name: 'GitHub',
							url: 'https://github.com/GHaxZ',
							icon: Github
						},
						{
							name: 'Twitch',
							url: 'https://twitch.tv/ghax_z',
							icon: Twitch
						},
						{
							name: 'YouTube',
							url: 'https://youtube.com/@GHaxZ',
							icon: Youtube
						},
						{
							name: 'Gitlab',
							url: 'https://gitlab.com/GHaxZ',
							icon: Gitlab
						}
					]}
				/>
				<UserLinkCollection
					username="Dari-OS"
					picture={dariosPicture}
					links={[
						{
							name: 'GitHub',
							url: 'https://github.com/Dari-OS',
							icon: Github
						},
						{
							name: 'Gitlab',
							url: 'https://gitlab.com/Dari-OS',
							icon: Gitlab
						}
					]}
				/>
			</div>
		</div>
	</div>
</div>
