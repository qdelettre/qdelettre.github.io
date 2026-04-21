import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

function dedupeLower(arr: string[]): string[] {
	return Array.from(new Set(arr.map((s) => s.toLowerCase())));
}

const post = defineCollection({
	loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		z.object({
			title: z.string().max(120),
			description: z.string().min(10).max(200),
			publishDate: z
				.string()
				.or(z.date())
				.transform((val: string | Date) => new Date(val)),
			updatedDate: z
				.string()
				.optional()
				.transform((str: string | undefined) => (str ? new Date(str) : undefined)),
			coverImage: z
				.object({
					src: image(),
					alt: z.string(),
				})
				.optional(),
			draft: z.boolean().default(false),
			tags: z.array(z.string()).default([]).transform(dedupeLower),
			ogImage: z.string().optional(),
		}),
});

export const collections = { post };
