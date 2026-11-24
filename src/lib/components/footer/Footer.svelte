<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowUp, ArrowUpRight } from 'lucide-svelte';
	import { organizationLinks } from '#lib/links.js';

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
						Randware
					</a>
					<small class="text-[0.8125rem] text-muted">© {year} Randware</small>
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
				aria-label="Randware social links"
			>
				<ul
					class="flex flex-wrap justify-between gap-x-4 [@media(max-width:44rem)]:grid [@media(max-width:44rem)]:grid-cols-2"
				>
					{#each organizationLinks as { name, url, icon: Icon } (url)}
						<li>
							<a
								class="inline-flex min-h-11 items-center gap-1.5 text-[0.875rem] font-medium leading-[1.3] underline-offset-[0.2em] hover:underline [&_svg]:shrink-0"
								href={url}
								aria-label={name}
								title={name}
							>
								<Icon size={18} strokeWidth={1.75} aria-hidden="true" />
								<span>{name}</span>
								<ArrowUpRight
									class="opacity-75 [@media(max-width:24rem)]:hidden"
									size={12}
									strokeWidth={1.75}
									aria-hidden="true"
								/>
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	</div>
</footer>
