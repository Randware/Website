import { error } from '@sveltejs/kit';
import { githubProfile } from '#lib/projects.js';
import { renderReadme } from '#lib/server/projects.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const name = params.name.toLowerCase();
	if (!/^[a-z0-9._-]{1,100}$/.test(name) || name === '.' || name === '..') {
		error(404, 'Project not found');
	}

	const { projects, projectDetails } = await locals.githubData();
	if (!projects) {
		return {
			result: {
				state: 'unavailable' as const,
				url: `${githubProfile}/${encodeURIComponent(name)}`,
				message: 'Project details couldn’t be loaded from GitHub.'
			}
		};
	}

	const project = projects.find((repository) => repository.name.toLowerCase() === name);
	if (!project) error(404, 'Project not found');

	const details = projectDetails.get(name);
	const readme = renderReadme(details?.readme ?? null, url.origin);
	const languages = details?.languages ?? null;
	return { result: { state: 'available' as const, project, readme, languages } };
};
