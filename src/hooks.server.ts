import { building } from '$app/env';
import type { Handle, ServerInit } from '@sveltejs/kit/hooks';
import { getGitHubData } from '#lib/server/github-data.js';

export const init: ServerInit = async () => {
	if (!building) await getGitHubData();
};

export const handle: Handle = ({ event, resolve }) => {
	let snapshot: ReturnType<typeof getGitHubData> | undefined;
	// Keep the layout and page on the same snapshot if a refresh finishes mid-request.
	event.locals.githubData = () => (snapshot ??= getGitHubData());
	return resolve(event);
};
