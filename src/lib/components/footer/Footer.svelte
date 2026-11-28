<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowUp } from 'lucide-svelte';
	import type { ContactLink } from '#lib/contact.js';
	import LinkCollection from '../LinkCollection.svelte';

	let { name, links }: { name: string; links: ContactLink[] } = $props();
	const year = new Date().getUTCFullYear();
</script>

<footer
	class="shell [--footer-padding:clamp(1rem,2.5vw,1.625rem)] pbe-[calc(clamp(2rem,4vw,3rem)+env(safe-area-inset-bottom,0px))]"
>
	<div class="relative isolate">
		<div class="paper-panel relative isolate overflow-hidden">
			<div class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-(--footer-padding)">
				<div class="grid gap-[0.4375rem]">
					<a
						class="w-fit font-serif text-[clamp(1.625rem,3.4vw,2rem)] font-bold leading-[1.2] tracking-[-0.065em]"
						href={resolve('/')}
					>
						{name}
					</a>
					<small class="text-[0.8125rem] text-muted">© {year} {name}</small>
				</div>
				<a
					class="header-control pressable border-line-strong [--header-control-size:2.75rem] [--press-shadow:var(--paper-edge)] [--press-y:2px]"
					href="#page-top"
					aria-label="Back to top"
					title="Back to top"
				>
					<ArrowUp size={19} strokeWidth={1.9} aria-hidden="true" />
				</a>
			</div>
			<nav
				class="border-t border-dashed border-line px-(--footer-padding) py-2.5"
				aria-label="{name} social links"
			>
				<LinkCollection {links} label="{name} profiles" footer />
			</nav>
		</div>
	</div>
</footer>
