import { siteConfig } from "@/site.config";

export function getFormattedDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
	return new Intl.DateTimeFormat(siteConfig.date.locale, {
		...siteConfig.date.options,
		...options,
	}).format(date);
}

export function getIsoDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}

export function getMonoDate(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}.${m}.${d}`;
}

export function getShortDate(date: Date): string {
	return new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit" }).format(date);
}
