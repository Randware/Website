<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowUp, ArrowUpRight } from 'lucide-svelte';
	import { organizationLinks } from '#lib/links.js';

	const year = new Date().getUTCFullYear();
</script>

<footer class="shell">
	<div class="footer-stack">
		<div class="footer-paper paper-panel">
			<div class="footer-main">
				<div class="footer-brand">
					<a class="footer-name" href={resolve('/')}>Randware</a>
					<small>© {year} Randware</small>
				</div>
				<a
					class="to-top header-control pressable"
					href="#page-top"
					aria-label="Back to top"
					title="Back to top"
				>
					<ArrowUp size={19} strokeWidth={1.9} aria-hidden="true" />
				</a>
			</div>
			<nav class="profiles" aria-label="Randware social links">
				<ul>
					{#each organizationLinks as { name, url, icon: Icon } (url)}
						<li>
							<a href={url} aria-label={name} title={name}>
								<Icon size={18} strokeWidth={1.75} aria-hidden="true" />
								<span class="profile-name">{name}</span>
								<ArrowUpRight
									class="profile-arrow"
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

<style>
	footer {
		--footer-padding: clamp(1rem, 2.5vw, 1.625rem);

		padding-block-end: clamp(2rem, 4vw, 3rem);
	}

	.footer-stack {
		position: relative;
		isolation: isolate;
	}

	.footer-stack::before {
		position: absolute;
		z-index: -1;
		inset: 7px -5px -7px 5px;
		border: 1px solid var(--line-strong);
		border-radius: var(--paper-radius);
		background: color-mix(in srgb, var(--card), var(--ink) 5%);
		content: '';
	}

	.footer-paper {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		box-shadow: none;
	}

	.footer-paper::before {
		position: absolute;
		z-index: -1;
		inset: 0;
		background-image:
			repeating-linear-gradient(0deg, transparent 0 11px, var(--line) 11px 12px),
			repeating-linear-gradient(90deg, transparent 0 11px, var(--line) 11px 12px);
		mask-image: linear-gradient(90deg, transparent 35%, #000);
		opacity: 0.18;
		pointer-events: none;
		content: '';
	}

	.footer-main {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 1rem;
		padding: var(--footer-padding);
	}

	.footer-brand {
		display: grid;
		gap: 0.4375rem;
	}

	.footer-name {
		width: fit-content;
		font-family: var(--serif);
		font-size: clamp(1.625rem, 3.4vw, 2rem);
		font-weight: 700;
		letter-spacing: -0.065em;
		line-height: 1.2;
	}

	.profiles {
		padding: 0.625rem var(--footer-padding);
		border-top: 1px dashed var(--line);
	}

	.profiles ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0 1rem;
	}

	.profiles a {
		display: inline-flex;
		min-height: 2.75rem;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		line-height: 1.3;
	}

	.profiles a :global(svg) {
		flex-shrink: 0;
	}

	.profiles a :global(.profile-arrow) {
		opacity: 0.75;
	}

	.profiles a:hover {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	small {
		color: var(--muted);
		font-size: 0.8125rem;
	}

	.to-top {
		--header-control-size: 2.75rem;
		--press-y: 2px;
		--press-shadow: var(--paper-edge);

		border-color: var(--line-strong);
	}

	@media (max-width: 44rem) {
		.profiles ul {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 24rem) {
		.profiles a :global(.profile-arrow) {
			display: none;
		}
	}
</style>
