<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowUp, ArrowUpRight } from 'lucide-svelte';
	import { organizationLinks } from '#lib/links.js';

	const year = new Date().getUTCFullYear();
</script>

<footer>
	<div class="footer-paper">
		<div class="footer-main">
			<a class="footer-name" href={resolve('/')}>Randware</a>
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

		<div class="footer-end">
			<small>© {year} Randware</small>
			<a class="to-top pressable" href="#page-top">
				Back to top <ArrowUp size={17} strokeWidth={1.9} aria-hidden="true" />
			</a>
		</div>
	</div>
</footer>

<style>
	footer {
		margin-inline: var(--frame-inset);
		padding-block-end: clamp(1.5rem, 4vw, 3rem);
	}

	.footer-paper {
		--focus: var(--paper);
		--footer-line: color-mix(in srgb, var(--paper) 52%, var(--ink));
		--footer-muted: color-mix(in srgb, var(--paper) 82%, var(--ink));

		padding: clamp(0.875rem, 2.5vw, 1.625rem);
		border: 2px solid var(--ink);
		border-radius: var(--paper-radius);
		background: var(--ink);
		box-shadow: 0.25rem 0.3125rem 0 var(--line);
		color: var(--paper);
	}

	.footer-main {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.5rem clamp(0.5rem, 3vw, 1.5rem);
		padding-bottom: 0.5rem;
	}

	.footer-name {
		width: fit-content;
		font-family: var(--serif);
		font-size: clamp(1.375rem, 3.4vw, 2.5rem);
		font-weight: 700;
		letter-spacing: -0.065em;
		line-height: 1.12;
	}

	.profiles ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 0 clamp(0.375rem, 1.8vw, 1.375rem);
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

	.footer-end {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px dashed var(--footer-line);
	}

	small {
		color: var(--footer-muted);
		font-size: 0.8125rem;
	}

	.to-top {
		--press-x: 0px;
		--press-y: 1px;
		--press-shadow: transparent;

		display: inline-flex;
		min-height: 2.75rem;
		align-items: center;
		gap: 0.375rem;
		color: var(--footer-muted);
		font-size: 0.875rem;
		font-weight: 500;
		text-underline-offset: 0.2em;
	}

	.to-top:is(:hover, :focus-visible) {
		color: var(--paper);
		text-decoration: underline;
	}

	@media (max-width: 44rem) {
		.profiles a {
			min-width: 2.75rem;
			justify-content: center;
		}

		.profile-name,
		.profiles a :global(.profile-arrow) {
			display: none;
		}

		.profiles a:hover {
			opacity: 0.7;
		}
	}

	@media (max-width: 24rem) {
		.profiles ul {
			display: grid;
			grid-template-columns: repeat(2, 2.75rem);
			gap: 0;
		}
	}
</style>
