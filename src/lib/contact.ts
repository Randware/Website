export type ContactLinkIcon =
	| { path: string }
	| 'codepen'
	| 'container'
	| 'github'
	| 'gitlab'
	| 'link'
	| 'linkedin'
	| 'twitch'
	| 'youtube';

export interface ContactLink {
	name: string;
	url: string;
	icon: ContactLinkIcon;
}

export interface ProfileStatus {
	message?: string;
	emoji?: string;
	validUntil: number;
}

export interface PublicMember {
	login: string;
	avatar?: string;
}

export interface ProfileTime {
	offsetMinutes: number;
	validUntil: number;
}

export interface ContactProfile {
	login: string;
	name: string;
	url: string;
	avatar?: string;
	bio?: string;
	company?: string;
	location?: string;
	pronouns?: string;
	email?: string;
	website?: string;
	socials: string[];
	localTime?: ProfileTime;
	status?: ProfileStatus;
}
