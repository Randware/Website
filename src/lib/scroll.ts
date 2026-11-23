export function easedScrollProgress(offset: number, distance: number) {
	if (distance <= 0) return 0;

	const progress = Math.min(1, Math.max(0, offset / distance));
	return progress * (2 - progress);
}
