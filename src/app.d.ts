// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { getGitHubData } from '#lib/server/github-data.js';

declare global {
	namespace App {
		interface Locals {
			githubData: typeof getGitHubData;
		}
	}
}
