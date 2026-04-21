import { siteConfig } from "@/site.config";
import type { TagColorKey } from "@/types";

const COLOR_VAR: Record<TagColorKey, string> = {
	blue: "var(--tag-blue)",
	iris: "var(--tag-iris)",
	violet: "var(--tag-violet)",
	red: "var(--tag-red)",
	amber: "var(--tag-amber)",
	emerald: "var(--tag-emerald)",
	cyan: "var(--tag-cyan)",
	slate: "var(--tag-slate)",
};

// Dark-mode hex per token. Used only for the Satori OG image, which has
// no CSSOM and cannot resolve var(--tag-*). Keep these values in sync
// with the dark side of each --tag-* token in src/styles/global.css.
const COLOR_HEX_DARK: Record<TagColorKey, string> = {
	blue: "#5ab0ff",
	iris: "#7170ff",
	violet: "#9085ff",
	red: "#e5484d",
	amber: "#f2994a",
	emerald: "#10b981",
	cyan: "#22d3ee",
	slate: "#8a8f98",
};

function resolveKey(tag: string): TagColorKey {
	return siteConfig.tagColors[tag.toLowerCase()] ?? "slate";
}

export function tagColorVar(tag: string): string {
	return COLOR_VAR[resolveKey(tag)];
}

export function tagColorHex(tag: string): string {
	return COLOR_HEX_DARK[resolveKey(tag)];
}
