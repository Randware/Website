import { visitArtworkSeed } from '#lib/artwork.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const timestamp = Date.now();
	const { featuredProjects } = await locals.githubData();
	return {
		headlineArtworkSeed: visitArtworkSeed(timestamp),
		valuesArtworkSeed: visitArtworkSeed(timestamp),
		featuredProjects
	};
};
