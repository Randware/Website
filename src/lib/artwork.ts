export function visitArtworkSeed(timestamp = Date.now()) {
	return (timestamp ^ crypto.getRandomValues(new Uint32Array(1))[0]) >>> 0;
}

export function bannerSeed(name: string, visitSeed: number) {
	let hash = 2166136261;
	for (const character of `${name.toLowerCase()}:${visitSeed}`) {
		hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
	}
	return hash >>> 0;
}
