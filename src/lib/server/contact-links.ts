import type { ContactLink, ContactLinkIcon, ContactProfile } from '#lib/contact.js';
import {
	siApplemusic,
	siApplepodcasts,
	siBandcamp,
	siBehance,
	siBilibili,
	siBitbucket,
	siBluesky,
	siBuymeacoffee,
	siCodeberg,
	siDevdotto,
	siDiscord,
	siFacebook,
	siInstagram,
	siKick,
	siKofi,
	siLetterboxd,
	siLine,
	siLinktree,
	siMastodon,
	siMatrix,
	siMedium,
	siMessenger,
	siPatreon,
	siPinterest,
	siReddit,
	siSinaweibo,
	siSnapchat,
	siSoundcloud,
	siSpotify,
	siStackoverflow,
	siSteam,
	siSubstack,
	siTelegram,
	siThreads,
	siTiktok,
	siTumblr,
	siVimeo,
	siWechat,
	siWhatsapp,
	siX,
	siXiaohongshu
} from 'simple-icons';

const platforms: [name: string, icon: ContactLinkIcon, ...domains: string[]][] = [
	['Apple Music', { path: siApplemusic.path }, 'music.apple.com'],
	['Apple Podcasts', { path: siApplepodcasts.path }, 'podcasts.apple.com'],
	['Bandcamp', { path: siBandcamp.path }, 'bandcamp.com'],
	['Behance', { path: siBehance.path }, 'behance.net'],
	['Bilibili', { path: siBilibili.path }, 'bilibili.com', 'b23.tv'],
	['Bitbucket', { path: siBitbucket.path }, 'bitbucket.org'],
	['Bluesky', { path: siBluesky.path }, 'bsky.app', 'bsky.social'],
	['Buy Me a Coffee', { path: siBuymeacoffee.path }, 'buymeacoffee.com'],
	['Codeberg', { path: siCodeberg.path }, 'codeberg.org'],
	['CodePen', 'codepen', 'codepen.io'],
	['DEV', { path: siDevdotto.path }, 'dev.to'],
	['Discord', { path: siDiscord.path }, 'discord.com', 'discord.gg', 'discordapp.com'],
	['Docker Hub', 'container', 'hub.docker.com'],
	['Facebook', { path: siFacebook.path }, 'facebook.com', 'fb.com', 'fb.me'],
	['GitHub', 'github', 'github.com'],
	['GitLab', 'gitlab', 'gitlab.com'],
	['Instagram', { path: siInstagram.path }, 'instagram.com', 'instagr.am'],
	['Kick', { path: siKick.path }, 'kick.com'],
	['Ko-fi', { path: siKofi.path }, 'ko-fi.com'],
	['Letterboxd', { path: siLetterboxd.path }, 'letterboxd.com', 'boxd.it'],
	['LINE', { path: siLine.path }, 'line.me', 'lin.ee'],
	['LinkedIn', 'linkedin', 'linkedin.com', 'lnkd.in'],
	['Linktree', { path: siLinktree.path }, 'linktr.ee', 'linktree.com'],
	[
		'Mastodon',
		{ path: siMastodon.path },
		'mastodon.social',
		'mastodon.online',
		'fosstodon.org',
		'hachyderm.io'
	],
	['Matrix', { path: siMatrix.path }, 'matrix.to'],
	['Medium', { path: siMedium.path }, 'medium.com'],
	['Messenger', { path: siMessenger.path }, 'messenger.com', 'm.me'],
	['Patreon', { path: siPatreon.path }, 'patreon.com'],
	['Pinterest', { path: siPinterest.path }, 'pinterest.com', 'pinterest.co.uk', 'pin.it'],
	['Reddit', { path: siReddit.path }, 'reddit.com', 'redd.it'],
	['Snapchat', { path: siSnapchat.path }, 'snapchat.com'],
	['SoundCloud', { path: siSoundcloud.path }, 'soundcloud.com', 'snd.sc'],
	['Spotify', { path: siSpotify.path }, 'spotify.com'],
	['Stack Overflow', { path: siStackoverflow.path }, 'stackoverflow.com', 'stackexchange.com'],
	['Steam', { path: siSteam.path }, 'steamcommunity.com', 'steampowered.com'],
	['Substack', { path: siSubstack.path }, 'substack.com'],
	['Telegram', { path: siTelegram.path }, 't.me', 'telegram.me', 'telegram.org'],
	['Threads', { path: siThreads.path }, 'threads.com', 'threads.net'],
	['TikTok', { path: siTiktok.path }, 'tiktok.com'],
	['Tumblr', { path: siTumblr.path }, 'tumblr.com'],
	['Twitch', 'twitch', 'twitch.tv'],
	['Vimeo', { path: siVimeo.path }, 'vimeo.com'],
	['WeChat', { path: siWechat.path }, 'wechat.com', 'weixin.qq.com'],
	['Weibo', { path: siSinaweibo.path }, 'weibo.com', 'weibo.cn'],
	['WhatsApp', { path: siWhatsapp.path }, 'whatsapp.com', 'wa.me'],
	['X', { path: siX.path }, 'x.com', 'twitter.com'],
	['Xiaohongshu', { path: siXiaohongshu.path }, 'xiaohongshu.com', 'xhslink.com'],
	['YouTube', 'youtube', 'youtube.com', 'youtu.be', 'youtube-nocookie.com']
];

const byDomain = new Map(
	platforms.flatMap(([name, icon, ...domains]) =>
		domains.map((domain) => [domain, { name, icon }] as const)
	)
);

export function getContactLinks({ url, website, socials }: ContactProfile): ContactLink[] {
	return [...new Set([url, ...socials.filter((link) => link !== website)])].map(contactLink);
}

function contactLink(url: string): ContactLink {
	const hostname = new URL(url).hostname.replace(/^www\.|\.$/g, '');
	const labels = hostname.split('.');
	// Check exact hosts before parent domains, such as music.apple.com or old.reddit.com.
	for (let start = 0; start < labels.length - 1; start++) {
		const platform = byDomain.get(labels.slice(start).join('.'));
		if (platform) return { url, ...platform };
	}
	return { url, name: hostname, icon: 'link' };
}
