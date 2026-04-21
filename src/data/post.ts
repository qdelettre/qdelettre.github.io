import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export type Post = CollectionEntry<"post">;

export async function getAllPosts() {
	const posts: Post[] = await getCollection("post", ({ data }: Post) =>
		import.meta.env.PROD ? data.draft !== true : true,
	);
	return posts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

export function getAllTags(posts: Post[]): string[] {
	return posts.flatMap((p) => p.data.tags);
}

export function getUniqueTags(posts: Post[]): string[] {
	return [...new Set(getAllTags(posts))];
}

export function getTagCounts(posts: Post[]): Array<[string, number]> {
	const m = new Map<string, number>();
	for (const t of getAllTags(posts)) m.set(t, (m.get(t) ?? 0) + 1);
	return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export function groupByYear(posts: Post[]): Array<{ year: number; posts: Post[] }> {
	const map = new Map<number, Post[]>();
	for (const p of posts) {
		const y = p.data.publishDate.getFullYear();
		const arr = map.get(y) ?? [];
		arr.push(p);
		map.set(y, arr);
	}
	return [...map.entries()].sort((a, b) => b[0] - a[0]).map(([year, posts]) => ({ year, posts }));
}
