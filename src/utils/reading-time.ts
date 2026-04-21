export function parseReadingTimeMinutes(label: string | undefined): number {
	if (!label) return 0;
	const match = label.match(/^(\d+)/);
	return match ? Number(match[1]) : 0;
}

export function shouldShowReadingTime(label: string | undefined): boolean {
	return parseReadingTimeMinutes(label) > 1;
}
