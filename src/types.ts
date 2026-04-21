export interface SiteConfig {
	author: string;
	title: string;
	description: string;
	lang: string;
	ogLocale: string;
	date: {
		locale: string;
		options: Intl.DateTimeFormatOptions;
	};
	tagColors: Record<string, TagColorKey>;
	socials: {
		github: string;
	};
	ogImageDefault: string;
}

export type TagColorKey =
	| "blue"
	| "iris"
	| "violet"
	| "red"
	| "amber"
	| "emerald"
	| "cyan"
	| "slate";

export interface MenuLink {
	title: string;
	/** Must include a trailing slash (except the root `/`). The Header's
	 * isActive check relies on this invariant to avoid false prefix matches. */
	path: string;
}
