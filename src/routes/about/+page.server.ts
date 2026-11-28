import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { members } = await locals.githubData();
	return { teamPreview: members?.slice(0, 3) ?? [] };
};
