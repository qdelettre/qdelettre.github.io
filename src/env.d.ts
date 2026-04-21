/// <reference types="astro/client" />

declare module "*pagefind.js" {
	interface PagefindItem {
		url: string;
		excerpt: string;
		meta?: { title?: string; date?: string };
	}
	interface PagefindResult {
		data(): Promise<PagefindItem>;
	}
	export function init(): Promise<void>;
	export function debouncedSearch(query: string): Promise<{ results: PagefindResult[] }>;
}
