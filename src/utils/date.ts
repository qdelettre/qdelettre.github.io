import { siteConfig } from "@/site.config";
import type { CollectionEntry } from "astro:content";

const dateFormat = new Intl.DateTimeFormat(siteConfig.date.locale, siteConfig.date.options);

export function getFormattedDate(
	date: string | number | Date,
	options?: Intl.DateTimeFormatOptions,
) {
	if (typeof options !== "undefined") {
		return new Date(date).toLocaleDateString(siteConfig.date.locale, {
			...(siteConfig.date.options as Intl.DateTimeFormatOptions),
			...options,
		});
	}

	return dateFormat.format(new Date(date));
}

export function collectionDateSort(a: CollectionEntry<"post">, b: CollectionEntry<"post">) {
	return b.data.publishDate.getTime() - a.data.publishDate.getTime();
}
