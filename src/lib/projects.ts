export const organization = 'Randware';
export const githubProfile = `https://github.com/${organization}`;
export const githubRepositories = `https://github.com/orgs/${organization}/repositories`;

export interface Project {
	name: string;
	description: string | null;
	language: string | null;
	stars: number;
	branch: string;
	url: string;
	website?: string;
}

export interface ProjectLanguage {
	name: string;
	bytes: number;
}

export function projectSeed(name: string, artworkTimestamp: number) {
	let hash = 2166136261;
	for (const character of `${name.toLowerCase()}:${artworkTimestamp}`) {
		hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
	}
	return hash >>> 0;
}
