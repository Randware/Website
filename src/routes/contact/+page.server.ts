import { visitArtworkSeed } from '#lib/artwork.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const artworkSeed = visitArtworkSeed();
	const { profiles } = await locals.githubData();
	const timestamp = Date.now();

	return { profiles, artworkSeed, timestamp };
};
