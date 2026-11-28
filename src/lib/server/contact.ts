import { GITHUB_TOKEN } from '$app/env/private';
import type { ContactProfile, ProfileStatus, PublicMember } from '#lib/contact.js';
import { organization } from '#lib/projects.js';
import { createRequire } from 'node:module';
import { githubFetch, githubRefreshInterval, type GitHubReader } from './github-cache.js';

// Use the same synchronous loading path as sanitize-html when routes load together.
const { DomUtils, parseDocument }: typeof import('htmlparser2') = createRequire(import.meta.url)(
	'htmlparser2'
);

type Account = 'user' | 'organization';
type ProfileElement = NonNullable<ReturnType<typeof DomUtils.findOne>>;
type ProfilePage = {
	fetchedAt: number;
	details?: Pick<ContactProfile, 'location' | 'website' | 'socials'>;
	offsetMinutes?: number;
	status?: Omit<ProfileStatus, 'validUntil'>;
};

const api = 'https://api.github.com';
const github = 'https://github.com';
const requestTimeout = 3500;
const profilePageLifetime = 2 * githubRefreshInterval;

export function getPublicMembers(read: GitHubReader) {
	return read(`contact:public-members:${organization.toLowerCase()}`, fetchPublicMembers);
}

async function fetchPublicMembers(): Promise<PublicMember[]> {
	const path = `/orgs/${encodeURIComponent(organization)}/public_members`;
	const pageSize = 100;
	const members = new Map<string, PublicMember>();

	for (let page = 1; ; page++) {
		const data = await publicJson(`${path}?per_page=${pageSize}&page=${page}`);
		if (!Array.isArray(data)) throw new Error('GitHub public members response is invalid');

		for (const member of data) {
			if (!isObject(member)) continue;
			const login = text(member.login);
			if (login) members.set(login.toLowerCase(), { login, avatar: avatarUrl(member.avatar_url) });
		}

		if (data.length < pageSize) return [...members.values()];
	}
}

export async function getContactProfile(
	read: GitHubReader,
	login: string,
	account: Account
): Promise<ContactProfile> {
	const path = encodeURIComponent(login);
	const url = `${github}/${path}`;
	const key = `contact:${account}:${login.toLowerCase()}`;
	const token = GITHUB_TOKEN;
	const [profile, socials, page, pronouns] = await Promise.all([
		read(`${key}:profile`, () => fetchProfile(path, account)),
		read(`${key}:socials`, () => fetchSocials(path)),
		account === 'user' ? read(`${key}:public-page`, () => fetchProfilePage(url, login)) : null,
		account === 'user' && token ? read(`${key}:pronouns`, () => fetchPronouns(login, token)) : null
	]);

	// Keep the sidebar through background revalidation. Expire it separately
	// from the API snapshots so an outage doesn't keep old status and time data visible.
	const validUntil = page ? page.fetchedAt + profilePageLifetime : 0;
	const recentPage = validUntil > Date.now() ? page : null;
	const details = recentPage?.details;
	return {
		login,
		name: login,
		url,
		...profile,
		location: details ? details.location : profile?.location,
		website: details ? details.website : profile?.website,
		socials: details?.socials ?? socials ?? [],
		pronouns: pronouns?.value,
		localTime:
			recentPage?.offsetMinutes === undefined
				? undefined
				: { offsetMinutes: recentPage.offsetMinutes, validUntil },
		status: recentPage?.status ? { ...recentPage.status, validUntil } : undefined
	};
}

async function fetchPronouns(login: string, token: string) {
	const response = await githubFetch(`${api}/graphql`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: 'query ContactPronouns($login: String!) { user(login: $login) { login pronouns } }',
			variables: { login }
		}),
		signal: AbortSignal.timeout(requestTimeout)
	});
	if (!response.ok) throw new Error(`GitHub pronouns returned ${response.status}`);

	const {
		data,
		errors
	}: {
		data?: { user?: { login?: string; pronouns?: string | null } };
		errors?: unknown[];
	} = await response.json();
	if (errors?.length || data?.user?.login?.toLowerCase() !== login.toLowerCase()) {
		throw new Error('GitHub pronouns are unavailable');
	}

	return { value: text(data.user.pronouns) };
}

async function publicJson(path: string): Promise<unknown> {
	// Make these requests anonymously so the cache contains only public profile fields.
	const response = await githubFetch(`${api}${path}`, {
		headers: { Accept: 'application/vnd.github+json' },
		signal: AbortSignal.timeout(requestTimeout)
	});
	if (!response.ok) throw new Error(`GitHub profile API returned ${response.status}`);
	return response.json();
}

async function fetchProfile(path: string, account: Account) {
	const data = await publicJson(`/${account === 'user' ? 'users' : 'orgs'}/${path}`);
	if (!isObject(data)) throw new Error('GitHub profile response is invalid');
	const login = text(data.login);
	const url = webUrl(data.html_url);
	if (!login || !url || new URL(url).origin !== github) {
		throw new Error('GitHub profile is missing its identity');
	}

	return {
		login,
		name: text(data.name) ?? login,
		url,
		avatar: avatarUrl(data.avatar_url),
		bio: text(account === 'user' ? data.bio : data.description),
		company: text(data.company),
		location: text(data.location),
		email: publicEmail(data.email),
		website: webUrl(data.blog, true)
	};
}

function avatarUrl(value: unknown) {
	const url = webUrl(value);
	return url && new URL(url).origin === 'https://avatars.githubusercontent.com' ? url : undefined;
}

async function fetchSocials(path: string) {
	// GitHub exposes organization social accounts on this user endpoint as well.
	const data = await publicJson(`/users/${path}/social_accounts`);
	if (!Array.isArray(data)) throw new Error('GitHub social accounts response is invalid');

	const urls = new Set<string>();
	for (const account of data) {
		const url = isObject(account) ? webUrl(account.url) : undefined;
		if (url) urls.add(url);
	}
	return [...urls];
}

async function fetchProfilePage(url: string, login: string): Promise<ProfilePage> {
	const response = await githubFetch(url, {
		headers: { Accept: 'text/html' },
		signal: AbortSignal.timeout(requestTimeout)
	});
	if (!response.ok) throw new Error(`GitHub public profile returned ${response.status}`);
	return parseProfilePage(await response.text(), login);
}

function parseProfilePage(markup: string, login: string): ProfilePage {
	// Status and local time appear on the signed-out profile but aren't in the public REST payload.
	// Read location and links here too so they refresh with the rest of the sidebar.
	// Scope the lookup to the profile sidebar so repository READMEs can't supply these values.
	const document = parseDocument(markup);
	const hasClass = (classes: string | undefined, name: string) =>
		classes?.split(/\s+/).includes(name) ?? false;
	const sidebar = DomUtils.findOne(
		(node) => hasClass(node.attribs.class, 'js-profile-editable-replace'),
		document.children
	);
	const handle =
		sidebar &&
		DomUtils.findOne((node) => node.attribs.itemprop === 'additionalName', sidebar.children);
	if (
		!sidebar ||
		!handle ||
		DomUtils.textContent(handle).trim().toLowerCase() !== login.toLowerCase()
	) {
		throw new Error('GitHub public profile markup is unavailable');
	}

	const find = (predicate: Parameters<typeof DomUtils.findOne>[0]) =>
		DomUtils.findOne(predicate, sidebar.children);
	const status = find((node) => hasClass(node.attribs.class, 'user-status-has-content'));
	const messageNode =
		status &&
		DomUtils.findOne(
			(node) => hasClass(node.attribs.class, 'user-status-message-wrapper'),
			status.children
		);
	const emojiNode = status && DomUtils.findOne((node) => node.name === 'g-emoji', status.children);
	const message = text(messageNode && DomUtils.textContent(messageNode));
	const emoji = text(emojiNode && DomUtils.textContent(emojiNode));
	const details = find(
		(node) => node.name === 'ul' && hasClass(node.attribs.class, 'vcard-details')
	);
	const zone = find((node) => node.name === 'profile-timezone');
	const offset = text(zone?.attribs['data-hours-ahead-of-utc']);
	const minutes = offset === undefined ? NaN : Number(offset) * 60;

	return {
		fetchedAt: Date.now(),
		details: details ? readProfileDetails(details) : undefined,
		offsetMinutes: Number.isInteger(minutes) && Math.abs(minutes) <= 14 * 60 ? minutes : undefined,
		status: message || emoji ? { message, emoji } : undefined
	};
}

function readProfileDetails(list: ProfileElement): NonNullable<ProfilePage['details']> {
	const home = DomUtils.findOne((node) => node.attribs.itemprop === 'homeLocation', list.children);
	const website = DomUtils.findOne(
		(node) => node.attribs['data-test-selector'] === 'profile-website-url',
		list.children
	);
	const socialAccounts = DomUtils.findAll(
		(node) => node.attribs.itemprop === 'social',
		list.children
	);
	const link = (row: ProfileElement) =>
		webUrl(DomUtils.findOne((node) => node.name === 'a', row.children)?.attribs.href);
	const socials = socialAccounts.map(link).filter((url) => url !== undefined);
	return {
		location: text(home && DomUtils.textContent(home)),
		website: website ? link(website) : undefined,
		socials: [...new Set(socials)]
	};
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function text(value: unknown) {
	return typeof value === 'string' ? value.trim() || undefined : undefined;
}

function publicEmail(value: unknown) {
	const email = text(value);
	return email && /^[^\s@]+@[^\s@]+$/.test(email) ? email : undefined;
}

function webUrl(value: unknown, allowBare = false) {
	const href = text(value);
	if (!href) return;

	try {
		const url = new URL(
			allowBare && !/^[a-z][\w+.-]*:/i.test(href) ? `https://${href.replace(/^\/\//, '')}` : href
		);
		if ((url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password) {
			return url.href;
		}
	} catch {
		return;
	}
}
