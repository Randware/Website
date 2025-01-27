import type { PageServerLoad } from './$types';
import { getProjects } from "$lib/store/projects";

export const load: PageServerLoad = async () => {
  return { projects: await getProjects() };
};
