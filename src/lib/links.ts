import { Container, Github, Gitlab, Twitch, Youtube, type Icon } from 'lucide-svelte';
import ghaxz from '#lib/assets/images/ghaxz-avatar.webp';
import darios from '#lib/assets/images/darios-avatar.webp';
import { githubProfile } from '#lib/projects.js';

export interface SocialLink {
	name: string;
	url: string;
	icon: typeof Icon;
}

export const organizationLinks: SocialLink[] = [
	{ name: 'GitHub', url: githubProfile, icon: Github },
	{ name: 'GitLab', url: 'https://gitlab.com/Randware', icon: Gitlab },
	{ name: 'YouTube', url: 'https://youtube.com/@Randware', icon: Youtube },
	{ name: 'Docker Hub', url: 'https://registry.hub.docker.com/u/randware', icon: Container }
];

export const members: { name: string; avatar: string; links: SocialLink[] }[] = [
	{
		name: 'GHaxZ',
		avatar: ghaxz,
		links: [
			{ name: 'GitHub', url: 'https://github.com/GHaxZ', icon: Github },
			{ name: 'GitLab', url: 'https://gitlab.com/GHaxZ', icon: Gitlab },
			{ name: 'Twitch', url: 'https://twitch.tv/ghax_z', icon: Twitch },
			{ name: 'YouTube', url: 'https://youtube.com/@GHaxZ', icon: Youtube }
		]
	},
	{
		name: 'Dari-OS',
		avatar: darios,
		links: [
			{ name: 'GitHub', url: 'https://github.com/Dari-OS', icon: Github },
			{ name: 'GitLab', url: 'https://gitlab.com/Dari-OS', icon: Gitlab }
		]
	}
];
