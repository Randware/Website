import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => ({ artworkTimestamp: Date.now() });
