import type { APIContext } from "astro";

import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";

export const prerender = true;

export async function GET(context: APIContext): Promise<Response> {
	if (!context.site) {
		throw new Error("astro.config.ts must set `site` for llms.txt generation");
	}
	const site = context.site;
	const posts = await getAllPosts();
	const lines = posts.map((post) => {
		const url = new URL(`/posts/${post.id}/`, site).href;
		return `- [${post.data.title}](${url}): ${post.data.description}`;
	});
	const body =
		`# ${siteConfig.title}\n\n` +
		`> ${siteConfig.description}\n\n` +
		`## Posts\n\n` +
		lines.join("\n") +
		"\n";
	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
}
