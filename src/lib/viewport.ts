export function screenBleed(
	width: number,
	largeHeight: number,
	screenWidth: number,
	screenHeight: number
) {
	const short = Math.min(screenWidth, screenHeight);
	const long = Math.max(screenWidth, screenHeight);
	const fullHeight = Math.abs(width - short) <= 2 ? long : Math.abs(width - long) <= 2 ? short : 0;
	// A split-view window must use its own viewport, not the whole iPad display.
	return fullHeight && short <= 600 ? Math.max(0, Math.ceil(fullHeight - largeHeight)) : 0;
}

export function usesTouchViewport() {
	return matchMedia('(pointer: coarse)').matches || CSS.supports('-webkit-touch-callout', 'none');
}

export function syncViewportBleed() {
	if (!usesTouchViewport()) return;
	const probe = document.createElement('div');
	probe.style.cssText =
		'position:absolute;width:0;height:100lvh;visibility:hidden;pointer-events:none';
	document.body.append(probe);
	const bleed = screenBleed(
		document.documentElement.clientWidth,
		probe.getBoundingClientRect().height,
		window.screen.width,
		window.screen.height
	);
	probe.remove();
	document.documentElement.style.setProperty('--screen-bleed', `${bleed}px`);
}
