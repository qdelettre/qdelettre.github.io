import type { RemarkPlugin } from "@astrojs/markdown-remark";
import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

export const remarkReadingTime: RemarkPlugin = () => {
	return (tree, file) => {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);
		file.data.astro ??= {};
		file.data.astro.frontmatter ??= {};
		file.data.astro.frontmatter.readingTime = readingTime.text;
	};
};
