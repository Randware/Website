import { organization } from '#lib/projects.js';
import { getContactLinks } from './contact-links.js';
import { getContactProfile, getPublicMembers } from './contact.js';
import { cacheGitHubData, type GitHubReader } from './github-cache.js';
import { getProjectDetails, getProjectIndex } from './projects.js';

async function collectGitHubData(read: GitHubReader) {
	const [projectIndex, members, organizationProfile] = await Promise.all([
		getProjectIndex(read),
		getPublicMembers(read),
		getContactProfile(read, organization, 'organization')
	]);
	const [profiles, details] = await Promise.all([
		members &&
			Promise.all(
				members.map(async ({ login, avatar }) => {
					const profile = await getContactProfile(read, login, 'user');
					return {
						profile: { ...profile, avatar: profile.avatar ?? avatar },
						links: getContactLinks(profile)
					};
				})
			),
		Promise.all(
			(projectIndex.projects ?? []).map(async (project) => {
				const details = await getProjectDetails(read, project);
				return [project.name.toLowerCase(), details] as const;
			})
		)
	]);

	return {
		...projectIndex,
		projectDetails: new Map(details),
		members,
		profiles,
		organizationProfile,
		organizationLinks: getContactLinks(organizationProfile)
	};
}

export const getGitHubData = cacheGitHubData(collectGitHubData);
