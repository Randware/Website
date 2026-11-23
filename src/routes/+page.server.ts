import { getFeaturedProjects } from '#lib/server/projects.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const timestamp = Date.now();
	const [headline, values] = crypto.getRandomValues(new Uint32Array(2));

	return {
		headlineArtworkSeed: (timestamp ^ headline) >>> 0,
		valuesArtworkSeed: (timestamp ^ values) >>> 0,
		featuredProjects: await getFeaturedProjects()
	};
};
