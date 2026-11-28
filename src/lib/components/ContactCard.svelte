<script lang="ts">
	import { Building2, Clock, Link, Mail, MapPin, UserRound, type Icon } from 'lucide-svelte';
	import type { ContactLink, ContactProfile } from '#lib/contact.js';
	import LinkCollection from './LinkCollection.svelte';
	import PaperBanner from './PaperBanner.svelte';
	import ProfileAvatar from './ProfileAvatar.svelte';
	import ProfileStatusBadge from './ProfileStatusBadge.svelte';

	let {
		profile,
		links,
		artworkSeed,
		now,
		organization = false
	}: {
		profile: ContactProfile;
		links: ContactLink[];
		artworkSeed: number;
		now: number;
		organization?: boolean;
	} = $props();

	const profileMention = /(?<![\w@])(@[a-z0-9]+(?:-[a-z0-9]+)*)(?![\w-])/gi;
	const mutedLink = 'underline decoration-line-strong underline-offset-3 hover:text-ink';
	const timeFormat = new Intl.DateTimeFormat('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'UTC'
	});

	let headingId = $derived(`contact-${organization ? 'organization-' : ''}${profile.login}`);
	let AvatarFallback = $derived(organization ? Building2 : UserRound);
	let status = $derived(
		profile.status && profile.status.validUntil > now ? profile.status : undefined
	);
	let localTime = $derived.by(() => {
		if (!profile.localTime || profile.localTime.validUntil <= now) return;
		const { offsetMinutes } = profile.localTime;
		const offset = Math.abs(offsetMinutes);
		const hours = String(Math.floor(offset / 60)).padStart(2, '0');
		const minutes = String(offset % 60).padStart(2, '0');
		return {
			time: timeFormat.format(now + offsetMinutes * 60_000),
			offset: `UTC${offsetMinutes < 0 ? '−' : '+'}${hours}:${minutes}`
		};
	});
	let hasDetails = $derived(
		!!(profile.company || profile.location || profile.email || profile.website || localTime)
	);
</script>

{#snippet withMentions(value: string)}
	{#each value.split(profileMention) as part, index}
		{#if index % 2}
			<a class={mutedLink} href="https://github.com/{part.slice(1)}" target="_blank" rel="noopener">
				{part}
			</a>
		{:else}
			{part}
		{/if}
	{/each}
{/snippet}

{#snippet bio()}
	{#if profile.bio}
		<div class="grid gap-2 leading-[1.5] wrap-anywhere whitespace-pre-line text-muted">
			{#each profile.bio.split(/\r?\n(?:\s*\r?\n)+/) as paragraph}
				<p>{@render withMentions(paragraph)}</p>
			{/each}
		</div>
	{/if}
{/snippet}

{#snippet detail(Glyph: typeof Icon, label: string, content: import('svelte').Snippet)}
	<div class="grid grid-cols-[1rem_minmax(0,1fr)] items-start gap-x-2">
		<dt class="pt-[0.15rem]">
			<Glyph size={16} strokeWidth={1.7} aria-hidden="true" />
			<span class="sr-only">{label}</span>
		</dt>
		<dd class="wrap-anywhere">{@render content()}</dd>
	</div>
{/snippet}

{#snippet details()}
	{#if hasDetails}
		<dl class="grid gap-1.5 text-sm leading-relaxed text-muted">
			{#if profile.company}
				{#snippet value()}{@render withMentions(profile.company ?? '')}{/snippet}
				{@render detail(Building2, 'Company', value)}
			{/if}
			{#if profile.location}
				{#snippet value()}{profile.location}{/snippet}
				{@render detail(MapPin, 'Location', value)}
			{/if}
			{#if localTime}
				{#snippet value()}
					<time class="tabular-nums" datetime={localTime?.time}>{localTime?.time}</time>
					<span class="whitespace-nowrap">({localTime?.offset})</span>
				{/snippet}
				{@render detail(Clock, 'Local time', value)}
			{/if}
			{#if profile.email}
				{#snippet value()}
					<a
						class={mutedLink}
						href="mailto:{encodeURIComponent(profile.email ?? '').replace('%40', '@')}"
					>
						{profile.email}
					</a>
				{/snippet}
				{@render detail(Mail, 'Public email', value)}
			{/if}
			{#if profile.website}
				{#snippet value()}
					<a class={mutedLink} href={profile.website} target="_blank" rel="noopener">
						{profile.website?.replace(/^https?:\/\//, '').replace(/\/$/, '')}
					</a>
				{/snippet}
				{@render detail(Link, 'Website', value)}
			{/if}
		</dl>
	{/if}
{/snippet}

<article
	class="contact-card paper-panel flex h-full min-w-0 flex-col [--avatar-size:clamp(4.75rem,8vw,5.75rem)] [--card-gutter:clamp(1rem,2.5vw,1.75rem)] focus-within:border-accent"
	aria-labelledby={headingId}
>
	<div
		class="paper-card-banner grid grid-cols-[calc(var(--avatar-size)-1.625rem)_minmax(0,1fr)] items-end py-[clamp(0.875rem,1.6vw,1.125rem)]"
	>
		<PaperBanner name={profile.login} visitSeed={artworkSeed} />
		<ProfileAvatar src={profile.avatar}>
			<AvatarFallback size={26} strokeWidth={1.5} />
		</ProfileAvatar>
		{#if status}
			<ProfileStatusBadge {status} />
		{/if}
	</div>

	<div
		class="flex flex-1 flex-col gap-3 px-(--card-gutter) pt-[clamp(1rem,1.7vw,1.375rem)] pb-[clamp(1.125rem,2vw,1.5rem)]"
	>
		<header>
			<h3
				class="text-[clamp(1.55rem,2.8vw,2rem)] wrap-anywhere max-[23rem]:text-[1.35rem]"
				id={headingId}
			>
				{profile.name}
			</h3>
			<p class="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-sm wrap-anywhere text-muted">
				<span>@{profile.login}</span>
				{#if profile.pronouns}
					<span class="inline-flex items-baseline gap-x-2">
						<span aria-hidden="true">·</span>
						<span>
							<span class="sr-only">Pronouns</span>
							{profile.pronouns}
						</span>
					</span>
				{/if}
			</p>
		</header>
		{@render bio()}
		{@render details()}
	</div>

	<div class="paper-card-footer min-h-[3.25rem] py-1">
		<LinkCollection {links} label="{profile.name} links" />
	</div>
</article>

<style>
	.contact-card {
		--avatar-shadow: 2px 2px 0 var(--paper-edge);
	}
</style>
