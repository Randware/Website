<script lang="ts">
	import { page } from '$app/state';

	export let text: string;
	export let redirect: string;

	function currentPath(): string {
		return page.url.pathname;
	}
</script>

<a
	href={redirect}
	aria-label="Go to the {text.toLowerCase()} page"
	class="{currentPath() === redirect
		? 'text-foreground'
		: 'text-foreground/80 hover:text-foreground'} hover:transition-colors"
>
	{text}
</a>
