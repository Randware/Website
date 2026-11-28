import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	GITHUB_TOKEN: {
		description:
			'Optional token for reading Randware’s GitHub profile pins, public repositories, and public members’ pronouns.',
		schema: (value) => value
	}
});
