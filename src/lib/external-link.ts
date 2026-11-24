export function isExternalLink(href: string, origin: string) {
	try {
		const url = new URL(href, origin);
		return (
			(url.protocol === 'https:' || url.protocol === 'http:') &&
			url.origin !== origin &&
			url.hostname !== 'randware.org' &&
			url.hostname !== 'www.randware.org'
		);
	} catch {
		return false;
	}
}
