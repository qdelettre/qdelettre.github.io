import type { MenuLink, SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
	author: "Quentin Delettre",
	title: "Quentin Delettre",
	description: "Fullstack engineer, for the web, building with care",
	lang: "en-GB",
	ogLocale: "en_GB",
	date: {
		locale: "en-GB",
		options: {
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	},
	tagColors: {
		typescript: "blue",
		php: "iris",
		astro: "violet",
		angular: "red",
		claude: "amber",
		git: "slate",
		ci: "cyan",
		books: "emerald",
		test: "iris",
	},
	socials: {
		github: "https://github.com/qdelettre",
	},
	ogImageDefault: "/og-image/default.png",
};

export const menuLinks: MenuLink[] = [
	{ title: "Home", path: "/" },
	{ title: "About", path: "/about/" },
	{ title: "Blog", path: "/posts/" },
];
