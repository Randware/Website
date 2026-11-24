import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import NodeCache from 'node-cache';

// hooks.server imports this module before rendering starts. Background cache
// refreshes must retain the server transport, not SvelteKit's temporary SSR
// fetch wrapper from whichever request happens to be rendering at that moment.
const serverFetch = globalThis.fetch.bind(globalThis);

type Snapshot<T> = { data: T; updatedAt: number };

const hour = 60 * 60 * 1000;
const retainFor = 7 * 24 * hour;
const retryFor = 5 * 60 * 1000;
const memory = new NodeCache({ stdTTL: retainFor / 1000, checkperiod: 3600, useClones: false });
const pendingRequests = new Map<string, Promise<unknown>>();
const directory = resolve(process.env.GITHUB_CACHE_DIR || '.cache/github');
let refreshQueue = Promise.resolve();
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

async function lastGood<T>(key: string): Promise<Snapshot<T> | null> {
	const inMemory = memory.get<Snapshot<T> | null>(key);
	if (inMemory !== undefined) return inMemory;

	const stored = await readJson<Snapshot<T>>(key);
	const current = memory.get<Snapshot<T> | null>(key);
	if (current !== undefined) return current;

	const valid = stored && Number.isFinite(stored.updatedAt) && Object.hasOwn(stored, 'data');
	const snapshot = valid ? stored : null;
	memory.set(key, snapshot, snapshot ? retainFor / 1000 : 60);
	return snapshot;
}

export async function cached<T>(
	key: string,
	fetchData: () => Promise<T>,
	freshFor = 6 * hour
): Promise<T | null> {
	const cacheKey = `data:${key}`;
	const snapshot = await lastGood<T>(cacheKey);
	const age = snapshot ? Date.now() - snapshot.updatedAt : Infinity;
	if (snapshot && age < freshFor) return snapshot.data;

	const refresh = revalidate(cacheKey, fetchData);
	return snapshot && age < retainFor ? snapshot.data : refresh;
}

function revalidate<T>(key: string, fetchData: () => Promise<T>): Promise<T | null> {
	const pending = pendingRequests.get(key) as Promise<T | null> | undefined;
	if (pending) return pending;
	const retryKey = `retry:${key}`;
	if (memory.get(retryKey) || Date.now() < (blockedUntil ?? 0)) return Promise.resolve(null);

	// Coalesce refreshes of the same key and send different GitHub reads serially.
	const request = refreshQueue
		.then(async () => {
			if (Date.now() < (blockedUntil ?? 0)) return null;
			const data = await fetchData();
			const snapshot = { data, updatedAt: Date.now() };
			memory.set(key, snapshot);
			await writeJson(key, snapshot);
			return data;
		})
		.catch(() => {
			if (Date.now() >= (blockedUntil ?? 0)) memory.set(retryKey, true, retryFor / 1000);
			return null;
		})
		.finally(() => pendingRequests.delete(key));
	refreshQueue = request.then(() => {});
	pendingRequests.set(key, request);
	return request;
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
