import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Track navigation so the footer reads the same snapshot as the new page.
	void url.href;
	const artworkTimestamp = Date.now();
	const { organizationProfile, organizationLinks } = await locals.githubData();
	return {
		artworkTimestamp,
		organizationProfile,
		organizationLinks
	};
};
