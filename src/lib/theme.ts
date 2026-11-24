export type Theme = 'light' | 'dark';

// Match the paper colors in app.css. Explicit canvas colors and theme-color
// updates also notify Safari's browser chrome after an in-page theme change.
const paper = { light: '#f2f0e3', dark: '#202020' } as const;

export function applyTheme(theme: Theme) {
	const root = document.documentElement;
	root.dataset.theme = theme;
	root.style.colorScheme = theme;
	root.style.backgroundColor = paper[theme];
	document.body.style.backgroundColor = paper[theme];
	document.querySelector('meta[name="theme-color"]')?.setAttribute('content', paper[theme]);
}
