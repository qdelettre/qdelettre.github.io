import fs from "node:fs";
import path from "node:path";

import type { APIContext, GetStaticPaths, InferGetStaticPropsType } from "astro";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";

import { getAllPosts } from "@/data/post";
import { getFormattedDate } from "@/utils/date";
import { tagColorHex } from "@/utils/tag-color";

function loadFont(rel: string): Buffer {
	const full = path.join(process.cwd(), "node_modules", rel);
	return fs.readFileSync(full);
}

const ogOptions: SatoriOptions = {
	width: 1200,
	height: 630,
	fonts: [
		{
			name: "Inter",
			weight: 500,
			style: "normal",
			data: loadFont("@fontsource/inter/files/inter-latin-500-normal.woff"),
		},
		{
			name: "JetBrains Mono",
			weight: 500,
			style: "normal",
			data: loadFont("@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff"),
		},
	],
};

function markup(title: string, pubDate: string, tag: string | undefined) {
	const tagColor = tag ? tagColorHex(tag) : "#8a8f98";
	if (tag) {
		return html`
			<div
				tw="flex flex-col w-full h-full"
				style="background:#08090a;color:#f7f8f8;font-family:Inter;"
			>
				<div tw="flex items-center" style="padding:56px 72px 24px;">
					<div
						tw="flex items-center justify-center"
						style="width:28px;height:28px;border-radius:50%;background:#18191d;border:1px solid rgba(255,255,255,0.08);margin-right:12px;"
					>
						<div
							style="font-family:'JetBrains Mono';font-size:13px;font-weight:500;color:#f7f8f8;letter-spacing:-0.5px;line-height:1;"
						>
							qd
						</div>
					</div>
					<div style="font-size:22px;font-weight:500;">Quentin Delettre</div>
				</div>
				<div tw="flex flex-col flex-1 justify-center" style="padding:0 72px;">
					<div
						style="font-family:'JetBrains Mono';font-size:18px;color:#8a8f98;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:20px;"
					>
						Blog
					</div>
					<div
						style="font-size:64px;font-weight:500;line-height:1.08;letter-spacing:-1.4px;max-width:1000px;"
					>
						${title}
					</div>
				</div>
				<div tw="flex items-center justify-between" style="padding:28px 72px 56px;">
					<div style="font-family:'JetBrains Mono';font-size:20px;color:#62666d;">${pubDate}</div>
					<div
						style="display:flex;align-items:center;border:1px solid rgba(255,255,255,0.08);border-radius:9999px;padding:6px 14px 6px 12px;font-family:'JetBrains Mono';font-size:18px;color:#d0d6e0;"
					>
						<span
							style="display:flex;width:8px;height:8px;border-radius:50%;background:${tagColor};margin-right:8px;"
						></span
						><span>${tag}</span>
					</div>
				</div>
			</div>
		`;
	}
	return html`
		<div
			tw="flex flex-col w-full h-full"
			style="background:#08090a;color:#f7f8f8;font-family:Inter;"
		>
			<div tw="flex items-center" style="padding:56px 72px 24px;">
				<div
					tw="flex items-center justify-center"
					style="width:28px;height:28px;border-radius:50%;background:#18191d;border:1px solid rgba(255,255,255,0.08);margin-right:12px;"
				>
					<div
						style="font-family:'JetBrains Mono';font-size:13px;font-weight:500;color:#f7f8f8;letter-spacing:-0.5px;line-height:1;"
					>
						qd
					</div>
				</div>
				<div style="font-size:22px;font-weight:500;">Quentin Delettre</div>
			</div>
			<div tw="flex flex-col flex-1 justify-center" style="padding:0 72px;">
				<div
					style="font-family:'JetBrains Mono';font-size:18px;color:#8a8f98;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:20px;"
				>
					Blog
				</div>
				<div
					style="font-size:64px;font-weight:500;line-height:1.08;letter-spacing:-1.4px;max-width:1000px;"
				>
					${title}
				</div>
			</div>
			<div tw="flex items-center" style="padding:28px 72px 56px;">
				<div style="font-family:'JetBrains Mono';font-size:20px;color:#62666d;">${pubDate}</div>
			</div>
		</div>
	`;
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext<Props>) {
	const { title, pubDate, tag } = context.props;
	const postDate = getFormattedDate(pubDate, { day: "numeric", month: "long", year: "numeric" });
	const svg = await satori(markup(title, postDate, tag), ogOptions);
	const png = new Resvg(svg).render().asPng();
	return new Response(new Uint8Array(png), {
		headers: {
			"Cache-Control": "public, max-age=31536000, immutable",
			"Content-Type": "image/png",
		},
	});
}

export const getStaticPaths = (async () => {
	const posts = await getAllPosts();
	return posts
		.filter(({ data }) => !data.ogImage)
		.map((post) => ({
			params: { slug: post.id },
			props: {
				title: post.data.title,
				pubDate: post.data.publishDate,
				tag: post.data.tags[0],
			},
		}));
}) satisfies GetStaticPaths;
