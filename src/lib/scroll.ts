import { writable } from 'svelte/store';

// Published after mount, so the header can follow the hero's exact progress
// without changing inherited styles on the entire document each frame.
export const heroScrollProgress = writable<number | undefined>(undefined);

export function easedScrollProgress(offset: number, distance: number) {
	if (distance <= 0) return 0;

	const progress = Math.min(1, Math.max(0, offset / distance));
	return progress * (2 - progress);
}

export function visibleViewportHeight(
	layoutHeight: number,
	viewport?: { height: number; scale: number } | null
) {
	// Safari's layout viewport can extend behind its toolbars. Pinch zoom should
	// magnify the existing layout rather than resize the opening around the user.
	return viewport && viewport.height > 0 && Math.abs(viewport.scale - 1) < 0.01
		? viewport.height
		: layoutHeight;
}

export function heroGeometry({
	viewportWidth,
	viewportHeight,
	top,
	stageHeight,
	frameWidth,
	frameHeight
}: {
	viewportWidth: number;
	viewportHeight: number;
	top: number;
	stageHeight: number;
	frameWidth: number;
	frameHeight: number;
}) {
	const height = Math.max(0, viewportHeight - top);
	return {
		height,
		scaleX: frameWidth > 0 ? viewportWidth / frameWidth : 1,
		scaleY: frameHeight > 0 ? height / frameHeight : 1,
		extra: height - stageHeight
	};
}
