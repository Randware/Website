<script lang="ts">
	import QuestionItem from '$lib/components/QuestionItem.svelte';
</script>

<div class="space-y-32">
	<div class="flex flex-col items-center gap-12 md:flex-row">
		<div class="flex-1 text-center">
			<h2 class="font-fancy mb-4 text-4xl font-bold">Find out more about Randware.</h2>
			<div class="mb-6 text-xl">Answers to questions, you might have.</div>
		</div>
	</div>

	<!--  TODO: Center the last items if they don't fill the entire row -->
	<div class="grid grid-cols-1 place-items-center gap-12 lg:grid-cols-2 2xl:grid-cols-3">
		<QuestionItem
			question="Who is Randware?"
			answer="Randware is a code organization consisisting of a group of friends, who are passionate about software development and open source. Our goal is to create interesting and useful software, simply because we love creating things."
		/>

		<QuestionItem
			question="Why are you into open source?"
			answer="We like open source because we think software is best, when the user has complete control over their tools. Don't like something? Change it! Sceptical about you privacy? Check the code! All those reasons and the additional benefit of working together to create software, is what is so amazing to us."
		/>

		<QuestionItem
			question="Do you specialize in anything?"
			answer="Our current line up of projects does currently not have a specific type, we are happy to do anything that migth seem interesting and useful to us. As for technologies, we try to use what we think is the best tool at hand for the job."
		/>

		<QuestionItem
			question="When was Randware created?"
			answer="Randware was created in early 2023 as a result of a school project. This project would later become JChad, our chat server hosting solution."
		/>

		<QuestionItem
			question="What does the name Randware mean?"
			answer="Randware stands for random software. Why we chose that name? We're not really sure, but it seemed fitting at the time."
		/>
	</div>

	<div class="flex flex-col items-center gap-12 md:flex-row md:gap-16">
		<div class="flex-1 text-center">
			<div class="font-fancy mb-4 text-2xl font-bold">
				For further questions, feel free to reach out to us!
			</div>
			<div class="mb-6 text-xl">
				You can find our contacts <a
					class="underline"
					href="/contact"
					aria-label="Go to the contact page">here</a
				>.
			</div>
		</div>
	</div>
</div>
