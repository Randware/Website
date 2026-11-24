function animatedElements(site: HTMLElement) {
	try {
		const elements = new Set<Element>();
		for (const { effect } of site.getAnimations({ subtree: true })) {
			if (effect && 'target' in effect && effect.target instanceof Element) {
				elements.add(effect.target);
			}
		}
		return elements;
	} catch {
		// The reveal can still copy the current frame without animation inspection.
		return null;
	}
}

// An inert copy can paint under mobile browser controls and works without native
// view transitions. The real page keeps its old theme until the circle finishes.
export function createThemeLayer(theme: 'light' | 'dark', paintUnderToolbar: boolean) {
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
	// The layer can reach the toolbar even at the end of the page. The theme
	// switcher removes this extra space as soon as the user starts a gesture.
	layer.toggleAttribute('data-toolbar-bleed', paintUnderToolbar);
	layer.style.setProperty('--theme-layer-page-height', `${Math.max(0, documentHeight - offset)}px`);
	try {
		// Read the overscan height without inserting the copied page yet.
		document.body.append(layer);
		const bottom = layer.getBoundingClientRect().height;
		const header = site.querySelector(':scope > header');
		const animated = animatedElements(site);

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

			const style = animated?.has(node) === false ? null : getComputedStyle(node);
			if (style && (animated || style.animationName !== 'none')) {
				// Freeze scroll/drift animations at the frame the user actually sees.
				for (const property of ['transform', 'translate', 'opacity', 'clip-path']) {
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
