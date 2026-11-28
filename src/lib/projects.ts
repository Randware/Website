export const organization = 'Randware';
export const githubProfile = `https://github.com/${organization}`;
export const githubRepositories = `https://github.com/orgs/${organization}/repositories`;
export const githubPeople = `https://github.com/orgs/${organization}/people`;

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
