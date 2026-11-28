import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

// hooks.server imports this module before rendering starts. Background cache
// refreshes must retain the server transport, not SvelteKit's temporary SSR
// fetch wrapper from whichever request happens to be rendering at that moment.
const serverFetch = globalThis.fetch.bind(globalThis);

type Entry<T> = { data: T; updatedAt: number };
type CacheSnapshot = { updatedAt: number; entries: Record<string, Entry<unknown>> };
export type GitHubReader = <T>(key: string, fetchData: () => Promise<T>) => Promise<T | null>;

export const githubRefreshInterval = 30 * 60 * 1000;
const retainFor = 7 * 24 * 60 * 60 * 1000;
const retryFor = 5 * 60 * 1000;
const snapshotKey = 'data:website';
const directory = resolve(process.env.GITHUB_CACHE_DIR || '.cache/github');
let blockedUntil: number | undefined;

function filename(key: string) {
	return join(directory, createHash('sha256').update(key).digest('hex') + '.json');
}

async function readJson<T>(key: string): Promise<T | null> {
	try {
		return JSON.parse(await readFile(filename(key), 'utf8')) as T;
	} catch {
		return null;
	}
}

async function writeJson(key: string, value: unknown) {
	const path = filename(key);
	const temporary = `${path}.${randomUUID()}.tmp`;
	try {
		await mkdir(directory, { recursive: true });
		await writeFile(temporary, JSON.stringify(value));
		await rename(temporary, path);
	} catch {
		// A read-only filesystem can still use the in-memory cache.
		await rm(temporary, { force: true }).catch(() => {});
	}
}

async function lastGood<T>(snapshot: CacheSnapshot | null, key: string): Promise<Entry<T> | null> {
	// Import entries from the old per-key cache when upgrading.
	const entry = snapshot
		? (snapshot.entries[key] as Entry<T> | undefined)
		: await readJson<Entry<T>>(`data:${key}`);
	return entry && Date.now() - entry.updatedAt < retainFor && Object.hasOwn(entry, 'data')
		? entry
		: null;
}

export function cacheGitHubData<T>(collect: (read: GitHubReader) => Promise<T>) {
	let current: { snapshot: CacheSnapshot; data: T } | undefined;
	let pending: Promise<T> | undefined;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let disposed = false;
	import.meta.hot?.dispose(() => {
		disposed = true;
		clearTimeout(timer);
	});

	function scheduleRefresh(at: number) {
		if (disposed) return;
		clearTimeout(timer);
		timer = setTimeout(
			() => void run(refresh).catch((error) => console.error('GitHub refresh failed', error)),
			Math.max(0, at - Date.now())
		).unref();
	}

	function run(update: () => Promise<T>) {
		return (pending ??= update().finally(() => {
			pending = undefined;
		}));
	}

	async function refresh() {
		const previous = current?.snapshot ?? null;
		const entries: CacheSnapshot['entries'] = {};
		let queue = Promise.resolve();
		const read: GitHubReader = <Value>(key: string, fetchData: () => Promise<Value>) => {
			const request = queue.then(async () => {
				// Keep requests serial and carry forward successful values during a GitHub outage.
				let entry: Entry<Value> | null;
				try {
					entry = { data: await fetchData(), updatedAt: Date.now() };
				} catch {
					entry = await lastGood<Value>(previous, key);
				}
				if (entry) entries[key] = entry;
				return entry?.data ?? null;
			});
			queue = request.then(() => {});
			return request;
		};

		try {
			const data = await collect(read);
			if (disposed) return data;
			const snapshot = { entries, updatedAt: Date.now() };
			await writeJson(snapshotKey, snapshot);
			current = { snapshot, data };
			return data;
		} finally {
			scheduleRefresh(Date.now() + githubRefreshInterval);
		}
	}

	async function initialize() {
		const snapshot = await readJson<CacheSnapshot>(snapshotKey);
		if (
			!snapshot?.entries ||
			Object.keys(snapshot.entries).length === 0 ||
			!(Date.now() - snapshot.updatedAt < retainFor)
		) {
			return refresh();
		}

		const read: GitHubReader = async <Value>(key: string) =>
			(await lastGood<Value>(snapshot, key))?.data ?? null;
		const data = await collect(read);
		current = { snapshot, data };
		scheduleRefresh(snapshot.updatedAt + githubRefreshInterval);
		return data;
	}

	return () => (current ? Promise.resolve(current.data) : run(initialize));
}

export async function githubFetch(url: string, options: RequestInit) {
	if (blockedUntil === undefined) {
		const stored = await readJson<number>('rate-limit');
		blockedUntil = typeof stored === 'number' && Number.isFinite(stored) ? stored : 0;
	}
	if (Date.now() < blockedUntil) throw new Error('GitHub requests are paused');

	const response = await serverFetch(url, options);
	const budgetExhausted = response.headers.get('x-ratelimit-remaining') === '0';
	const retryHeader = response.headers.get('retry-after');
	const rateLimited =
		budgetExhausted ||
		response.status === 429 ||
		(response.status === 403 &&
			(retryHeader !== null ||
				/rate limit/i.test(
					await response
						.clone()
						.text()
						.catch(() => '')
				)));
	if (rateLimited) {
		const now = Date.now();
		const retryAt =
			retryHeader && /^\d+$/.test(retryHeader)
				? now + Number(retryHeader) * 1000
				: Date.parse(retryHeader ?? '') || 0;
		const resetAt = budgetExhausted
			? Number(response.headers.get('x-ratelimit-reset')) * 1000 || 0
			: 0;
		blockedUntil = Math.max(retryAt, resetAt);
		blockedUntil = blockedUntil > now ? blockedUntil + 1000 : now + retryFor;
		await writeJson('rate-limit', blockedUntil);
	}
	return response;
}
