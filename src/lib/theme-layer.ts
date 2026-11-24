// iOS clips native view-transition snapshots at the browser controls. A short-
// lived, inert copy of the visible page can paint into that area as normal
// document content. The real page keeps its old theme until the circle finishes.
export function createThemeLayer(theme: 'light' | 'dark') {
	const site = document.querySelector<HTMLElement>('.site');
	if (!site) return null;
	const offset = Math.max(0, scrollY);
	const documentHeight = document.documentElement.scrollHeight;

	const layer = document.createElement('div');
	layer.className = 'theme-layer';
	layer.dataset.theme = theme;
	layer.inert = true;
	layer.setAttribute('aria-hidden', 'true');
	layer.style.top = `${offset}px`;
	// Overscan may paint below the viewport, but must never add a temporary
	// scroll range at the end of the document and clamp a gesture on removal.
	layer.style.maxHeight = `${Math.max(0, documentHeight - offset)}px`;
	// Read the overscan height without inserting the copied page yet.
	document.body.append(layer);
	const bottom = layer.getBoundingClientRect().height;

	function copy(node: Node): Node {
		if (!(node instanceof HTMLElement)) return node.cloneNode(true);
		const clone = node.cloneNode(false) as HTMLElement;
		clone.removeAttribute('id');
		clone.removeAttribute('data-intro');
		const bounds = node.getBoundingClientRect();
		const style = getComputedStyle(node);

		// Preserve layout but avoid duplicating off-screen cards and README trees.
		if (
			bounds.height > 0 &&
			style.height.endsWith('px') &&
			(bounds.bottom < 0 || bounds.top > bottom) &&
			style.position !== 'sticky'
		) {
			clone.style.height = style.height;
			clone.style.minHeight = style.height;
			clone.style.visibility = 'hidden';
			return clone;
		}

		if (style.animationName !== 'none') {
			// Freeze scroll/drift animations at the frame the user actually sees.
			for (const property of [
				'transform',
				'translate',
				'rotate',
				'opacity',
				'clip-path',
				'top',
				'right',
				'bottom',
				'left',
				'border-radius'
			])
				clone.style.setProperty(property, style.getPropertyValue(property));
		}
		if (style.position === 'sticky') {
			clone.style.position = 'relative';
			clone.style.top = 'auto';
			clone.style.transform = `translateY(${offset}px)`;
		}
		for (const child of node.childNodes) clone.append(copy(child));
		return clone;
	}

	try {
		const page = copy(site) as HTMLElement;
		page.style.transform = `translateY(${-offset}px)`;
		page.style.opacity = '1';
		const button = page.querySelector('[data-theme-toggle]');
		button?.classList.toggle('dark', theme === 'dark');
		layer.append(page);
		return layer;
	} catch {
		layer.remove();
		return null;
	}
}
