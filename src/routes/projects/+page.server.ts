import { getProjects } from '#lib/server/projects.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({ projects: await getProjects() });
