<script lang="ts">
	import TopicItem from '$lib/components/TopicItem.svelte';
	import openSourceLogo from '$lib/assets/images/open-source-logo.webp';
	import securityLogo from '$lib/assets/images/security-logo.png';
	import performanceLogo from '$lib/assets/images/performance-logo.png';
</script>

<div class="space-y-32">
	<div class="flex flex-col items-center gap-12 md:flex-row md:gap-16">
		<div class="flex-1 text-center">
			<h2 class="font-fancy mb-4 text-4xl font-bold">Random software, you may enjoy.</h2>
			<div class="mb-6 text-xl">We ❤️ software.</div>
		</div>
	</div>

	<TopicItem
		heading="Open source"
		paragraphs={[
			"We believe open source is a great thing! That's why we are committed to creating software, which can be used, modified, distributed and even made profit from, no strings attached.",
			'Any contributions to our projects will directly profit every single user of our software, so if you have ideas and the know-how, you can help us keep software open and free!'
		]}
		image={openSourceLogo}
		imageAlt="Open source logo"
		imageRight={true}
	/>

	<TopicItem
		heading="Security"
		paragraphs={[
			'Security is a cruicial factor for well-made software, especially in the modern day and age. That is why we make sure that our software lives up to the security standards.',
			'If you have any security concerns, or have found an active vulnerability, please reach out to us confidentially, so we can try and resolve the issue as soon as possible.'
		]}
		image={securityLogo}
		imageAlt="Security lock icon"
		imageRight={false}
	/>

	<TopicItem
		heading="Performance"
		paragraphs={[
			'Performance is at the forefront of all our projects, since it can make or break a project. A lot of modern software feels and often times is slow and sluggish. Our goal is to bring back software, which focuses on speed.',
			'From the moment we start working on something, we think about performance. We also keep on steadily improving performance as time goes on.'
		]}
		image={performanceLogo}
		imageAlt="Lightning icon"
		imageRight={true}
	/>
</div>
