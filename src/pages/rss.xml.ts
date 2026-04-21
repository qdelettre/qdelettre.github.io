import rss from "@astrojs/rss";
import type { APIContext } from "astro";

import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";

export async function GET(context: APIContext) {
	if (!context.site) {
		throw new Error("astro.config.ts must set `site` for RSS generation");
	}
	const posts = await getAllPosts();
	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: context.site.toString(),
		customData: "<language>en-GB</language>",
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.publishDate,
			link: `/posts/${post.id}/`,
			categories: post.data.tags,
		})),
	});
}
