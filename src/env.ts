import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	GITHUB_TOKEN: {
		description:
			'Optional token for reading Randware’s GitHub profile pins and public repositories.',
		schema: (value) => value
	}
});
