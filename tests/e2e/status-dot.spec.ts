import { test, expect } from "@playwright/test";

test("status dot is open during Mon 10:00 Paris", async ({ page }) => {
	// 2026-04-20 08:00 UTC === Monday 10:00 CEST (Europe/Paris, DST)
	await page.clock.setFixedTime(new Date(Date.UTC(2026, 3, 20, 8, 0, 0)));
	await page.goto("/");
	await expect(page.locator("html")).toHaveAttribute("data-office-hours", "open");
	await expect(page.locator(".status-dot-halo").first()).toBeVisible();
});

test("status dot is closed on Sunday 15:00 Paris", async ({ page }) => {
	// 2026-04-19 13:00 UTC === Sunday 15:00 CEST
	await page.clock.setFixedTime(new Date(Date.UTC(2026, 3, 19, 13, 0, 0)));
	await page.goto("/");
	await expect(page.locator("html")).toHaveAttribute("data-office-hours", "closed");
	await expect(page.locator(".status-dot-halo").first()).toBeVisible();
});

test("status-pill is a mailto with schedule in aria-label", async ({ page }) => {
	await page.goto("/");
	const pill = page.locator("a.status-pill");
	await expect(pill).toHaveAttribute("href", "mailto:quentin.delettre@pm.me");
	await expect(pill).toHaveAttribute(
		"aria-label",
		/Available.+Mon.+Fri 9:00.+18:00.+Europe\/Paris/,
	);
});
