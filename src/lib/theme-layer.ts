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
	try {
		// Read the overscan height without inserting the copied page yet.
		document.body.append(layer);
		const bottom = layer.getBoundingClientRect().height;
		const header = site.querySelector(':scope > header');
		const animated = new Set<Element>();
		for (const animation of site.getAnimations({ subtree: true })) {
			const effect = animation.effect;
			if (animation instanceof CSSAnimation && effect instanceof KeyframeEffect && effect.target) {
				animated.add(effect.target);
			}
		}

		function copy(node: Node): Node {
			if (!(node instanceof HTMLElement)) return node.cloneNode(true);
			const clone = node.cloneNode(false) as HTMLElement;
			clone.removeAttribute('id');
			clone.removeAttribute('data-intro');

			// Preserve layout but avoid duplicating off-screen cards and README trees.
			if (node !== header && node.firstElementChild) {
				const bounds = node.getBoundingClientRect();
				if (bounds.height > 0 && (bounds.bottom < 0 || bounds.top > bottom)) {
					const height = getComputedStyle(node).height;
					if (height.endsWith('px')) {
						clone.style.height = height;
						clone.style.minHeight = height;
						clone.style.visibility = 'hidden';
						return clone;
					}
				}
			}

			if (animated.has(node)) {
				// Freeze scroll/drift animations at the frame the user actually sees.
				const style = getComputedStyle(node);
				for (const property of ['transform', 'opacity', 'clip-path']) {
					clone.style.setProperty(property, style.getPropertyValue(property));
				}
			}
			if (node === header) {
				clone.style.position = 'relative';
				clone.style.top = 'auto';
				clone.style.transform = `translateY(${offset}px)`;
			}
			for (const child of node.childNodes) clone.append(copy(child));
			return clone;
		}

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
