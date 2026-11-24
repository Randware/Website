// Initialize the shared GitHub cache transport before any page starts SSR.
// Stale entries can then refresh in the background without using a render's fetch.
import '#lib/server/github-cache.js';
