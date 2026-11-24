import { GITHUB_TOKEN } from '$app/env/private';
import { isExternalLink } from '#lib/external-link.js';
import { organization, type Project, type ProjectLanguage } from '#lib/projects.js';
import sanitizeHtml from 'sanitize-html';
import { cached, githubFetch } from './github-cache.js';

type GitHubRepository = {
	name: string;
	description: string | null;
	homepage: string | null;
	language: string | null;
	stargazers_count: number;
	default_branch: string;
	private: boolean;
	html_url: string;
};

type PinnedItemsResponse = {
	data?: {
		organization?: {
			pinnedItems: { nodes: ({ nameWithOwner: string; isPrivate: boolean } | null)[] };
		};
	};
	errors?: unknown[];
};

const api = 'https://api.github.com';
const requestTimeout = 3500;
const ignoredRepositories = new Set(['.github', 'homebrew-tap']);

function githubHeaders() {
	const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
	if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
	return headers;
}

export function getProjects() {
	return cached('repositories', fetchProjects, 60 * 60 * 1000);
}

export async function getFeaturedProjects(): Promise<Project[] | null> {
	const [projects, pinnedNames] = await Promise.all([
		getProjects(),
		GITHUB_TOKEN ? cached('profile-pins', fetchPinnedNames) : null
	]);
	if (!projects) return null;

	const byName = new Map(
		projects.map((project) => [`${organization}/${project.name}`.toLowerCase(), project])
	);
	const pinned = pinnedNames?.flatMap((name) => {
		const project = byName.get(name.toLowerCase());
		return project ? [project] : [];
	});

	return (pinned?.length ? pinned : projects).slice(0, 3);
}

async function fetchProjects() {
	const projects: Project[] = [];
	const pageSize = 100;
	const headers = githubHeaders();
	const signal = AbortSignal.timeout(requestTimeout);

	for (let page = 1; ; page++) {
		const response = await githubFetch(
			`${api}/orgs/${organization}/repos?type=public&per_page=${pageSize}&page=${page}`,
			{ headers, signal }
		);

		if (!response.ok) throw new Error(`GitHub repositories returned ${response.status}`);
		const repositories: GitHubRepository[] = await response.json();

		for (const repo of repositories) {
			if (repo.private !== false || ignoredRepositories.has(repo.name.toLowerCase())) continue;

			projects.push({
				name: repo.name,
				description: repo.description,
				language: repo.language,
				stars: repo.stargazers_count,
				branch: repo.default_branch,
				url: repo.html_url,
				website: repositoryWebsite(repo.homepage)
			});
		}

		if (repositories.length < pageSize) break;
	}

	return projects.sort(
		(a, b) => b.stars - a.stars || a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
	);
}

function repositoryWebsite(homepage: string | null) {
	if (!homepage) return;

	try {
		const url = new URL(homepage);
		return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined;
	} catch {
		return;
	}
}

async function fetchPinnedNames() {
	const response = await githubFetch(`${api}/graphql`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${GITHUB_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: `query RandwarePins($login: String!) {
				organization(login: $login) {
					pinnedItems(first: 6, types: [REPOSITORY]) {
						nodes {
							... on Repository { nameWithOwner isPrivate }
						}
					}
				}
			}`,
			variables: { login: organization }
		}),
		signal: AbortSignal.timeout(requestTimeout)
	});

	if (!response.ok) throw new Error(`GitHub profile pins returned ${response.status}`);
	const { data, errors }: PinnedItemsResponse = await response.json();
	const nodes = data?.organization?.pinnedItems?.nodes;
	if (errors?.length || !nodes) throw new Error('GitHub profile pins are unavailable');

	return nodes.flatMap((node) =>
		node?.isPrivate === false && typeof node.nameWithOwner === 'string' ? [node.nameWithOwner] : []
	);
}

export async function getReadme(project: Project, origin: string) {
	const readme = await cached(`readme:${project.name.toLowerCase()}:${project.branch}`, () =>
		fetchReadme(project)
	);
	if (!readme) return null;

	// Apply tab behavior when serving the README so existing snapshots work at any site origin.
	return sanitizeHtml(readme, {
		...readmeSanitizerOptions,
		transformTags: {
			a: (tagName, attribs) => ({
				tagName,
				attribs:
					attribs.href && isExternalLink(attribs.href, origin)
						? { ...attribs, target: '_blank', rel: 'noopener' }
						: attribs
			})
		}
	});
}

export function getLanguages(project: Project) {
	return cached(`languages:${project.name.toLowerCase()}`, () => fetchLanguages(project));
}

async function fetchLanguages(project: Project): Promise<ProjectLanguage[]> {
	const response = await githubFetch(
		`${api}/repos/${organization}/${encodeURIComponent(project.name)}/languages`,
		{ headers: githubHeaders(), signal: AbortSignal.timeout(requestTimeout) }
	);

	if (!response.ok) throw new Error(`GitHub languages returned ${response.status}`);

	const data: unknown = await response.json();
	if (!data || typeof data !== 'object' || Array.isArray(data)) {
		throw new Error('GitHub languages returned an invalid response');
	}

	return Object.entries(data)
		.filter(([, bytes]) => typeof bytes === 'number' && Number.isFinite(bytes) && bytes > 0)
		.map(([name, bytes]) => ({ name, bytes }))
		.sort((a, b) => b.bytes - a.bytes || a.name.localeCompare(b.name, 'en'));
}

async function fetchReadme(project: Project) {
	// Only expose README content GitHub serves publicly.
	const response = await githubFetch(
		`${api}/repos/${organization}/${encodeURIComponent(project.name)}/readme`,
		{
			headers: { ...githubHeaders(), Accept: 'application/vnd.github.html+json' },
			signal: AbortSignal.timeout(requestTimeout)
		}
	);

	if (!response.ok) throw new Error(`GitHub README returned ${response.status}`);
	const readme = cleanReadme(await response.text(), project).trim();
	if (!readme) throw new Error('GitHub README is empty');

	return readme;
}

const readmeSanitizerOptions = {
	allowedTags: [
		...sanitizeHtml.defaults.allowedTags,
		'img',
		'details',
		'summary',
		'del',
		'kbd',
		'samp',
		'input'
	],
	allowedAttributes: {
		a: ['href', 'id', 'title', 'target', 'rel'],
		details: ['open'],
		div: [{ name: 'align', values: ['center'] }],
		img: ['src', 'alt', 'title', 'loading', 'referrerpolicy', 'width', 'height'],
		h3: ['id'],
		h4: ['id'],
		h5: ['id'],
		h6: ['id'],
		input: ['type', 'checked', 'disabled', 'aria-label'],
		ol: ['start'],
		span: ['id'],
		td: ['colspan', 'rowspan'],
		th: ['colspan', 'rowspan', 'scope']
	},
	allowedSchemes: ['https', 'mailto'],
	allowedSchemesByTag: { img: ['https'] },
	allowProtocolRelative: false
} satisfies sanitizeHtml.IOptions;

function cleanReadme(html: string, project: Project) {
	const branch = project.branch.split('/').map(encodeURIComponent).join('/');
	const files = `${project.url}/blob/${branch}/`;
	const raw = `https://raw.githubusercontent.com/${organization}/${project.name}/${branch}/`;

	return sanitizeHtml(html, {
		...readmeSanitizerOptions,
		transformTags: {
			a: (tagName, { href, id, title, class: classes }) => {
				if (id && classes?.split(/\s+/).includes('anchor')) {
					return { tagName: 'span', attribs: { id: readmeId(id) } };
				}

				const link = href?.startsWith('#') ? '#' + readmeId(href.slice(1)) : readmeUrl(href, files);
				return {
					tagName,
					attribs: {
						...(link ? { href: link } : {}),
						...(id ? { id: readmeId(id) } : {}),
						...(title ? { title } : {})
					}
				};
			},
			img: (tagName, { src, alt, title, width, height }) => ({
				tagName,
				attribs: {
					src: src ? readmeUrl(src, src.startsWith('/') ? files : raw) : '',
					alt: alt ?? '',
					loading: 'lazy',
					referrerpolicy: 'no-referrer',
					...(title ? { title } : {}),
					...(/^\d+$/.test(width ?? '') ? { width } : {}),
					...(/^\d+$/.test(height ?? '') ? { height } : {})
				}
			}),
			input: (tagName, { checked }) => ({
				tagName,
				attribs: {
					type: 'checkbox',
					disabled: '',
					'aria-label': checked === undefined ? 'Incomplete task' : 'Completed task',
					...(checked === undefined ? {} : { checked: '' })
				}
			}),
			'*': (tagName, attribs) => {
				if (!/^h[1-6]$/.test(tagName)) return { tagName, attribs };

				const level = Math.min(6, Math.max(3, Number(tagName[1]) + 1));
				return {
					tagName: `h${level}`,
					attribs: attribs.id ? { id: readmeId(attribs.id) } : {}
				};
			}
		},
		exclusiveFilter: (frame) => frame.tag === 'img' && !frame.attribs.src
	});
}

function readmeId(value: string) {
	return 'readme-' + value.replace(/^user-content-/, '');
}

function readmeUrl(value: string | undefined, base: string) {
	if (!value) return '';

	try {
		const url = new URL(value, base);
		return url.protocol === 'https:' || url.protocol === 'mailto:' ? url.href : '';
	} catch {
		return '';
	}
}
