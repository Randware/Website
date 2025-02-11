import { checkCache } from '$lib/store/projects';
import type { ServerInit } from '@sveltejs/kit';

export const init: ServerInit = async () => {
  await checkCache();
};
