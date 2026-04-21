const OFFICE_DAYS: readonly string[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export const OFFICE_HOURS_LABEL = "Mon–Fri 9:00–18:00 (Europe/Paris)";

export function isOfficeHoursNow(now: Date = new Date()): boolean {
	const dayName = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Europe/Paris",
		weekday: "short",
	}).format(now);
	if (!OFFICE_DAYS.includes(dayName)) return false;
	const hour = Number(
		new Intl.DateTimeFormat("en-GB", {
			timeZone: "Europe/Paris",
			hour: "2-digit",
			hour12: false,
		}).format(now),
	);
	return hour >= 9 && hour < 18;
}
