import { test, expect } from "@playwright/test";

const LIGHT_BG_RGB = "rgb(247, 248, 248)"; // #f7f8f8
const DARK_BG_RGB = "rgb(8, 9, 10)"; // #08090a

test.describe("theme — OS preference", () => {
	test("light OS → body background is light", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "light" });
		await page.goto("/");
		await expect
			.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
			.toBe(LIGHT_BG_RGB);
	});

	test("dark OS → body background is dark", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "dark" });
		await page.goto("/");
		await expect
			.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
			.toBe(DARK_BG_RGB);
	});
});

test.describe("theme — toggle cycle", () => {
	test("cycle is system → light → dark → system on a dark-OS host", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "dark" });
		await page.goto("/");

		const toggle = page.locator(".theme-toggle");
		await expect(toggle).toBeVisible();
		await expect(toggle).toHaveAttribute("data-theme-state", "system");

		await toggle.click();
		await expect(toggle).toHaveAttribute("data-theme-state", "light");
		await expect.poll(() => page.evaluate(() => localStorage.getItem("theme"))).toBe("light");
		await expect
			.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
			.toBe(LIGHT_BG_RGB);

		await toggle.click();
		await expect(toggle).toHaveAttribute("data-theme-state", "dark");
		await expect.poll(() => page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");
		await expect
			.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
			.toBe(DARK_BG_RGB);

		await toggle.click();
		await expect(toggle).toHaveAttribute("data-theme-state", "system");
		await expect.poll(() => page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
		// Back to OS preference (dark, in this test).
		await expect
			.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
			.toBe(DARK_BG_RGB);
	});
});

test.describe("theme — persistence", () => {
	test("manual override survives reload (light OS, override to dark)", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "light" });
		await page.goto("/");
		const toggle = page.locator(".theme-toggle");

		// system → light → dark
		await toggle.click();
		await toggle.click();
		await expect(toggle).toHaveAttribute("data-theme-state", "dark");

		await page.reload();
		await expect(page.locator(".theme-toggle")).toHaveAttribute("data-theme-state", "dark");
		await expect
			.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
			.toBe(DARK_BG_RGB);
	});

	test("manual override survives soft-nav via view transitions", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "dark" });
		await page.goto("/");

		// system → light
		await page.locator(".theme-toggle").click();
		await expect(page.locator(".theme-toggle")).toHaveAttribute("data-theme-state", "light");

		// Soft-nav to /about/ via the header nav link.
		await page
			.getByRole("navigation", { name: "Main menu" })
			.getByRole("link", { name: "About" })
			.click();
		await expect(page).toHaveURL(/\/about\/?$/);

		// data-theme must still be "light" and body bg must still be light after the swap.
		await expect
			.poll(() => page.evaluate(() => document.documentElement.dataset.theme ?? null))
			.toBe("light");
		await expect
			.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
			.toBe(LIGHT_BG_RGB);
		await expect(page.locator(".theme-toggle")).toHaveAttribute("data-theme-state", "light");
	});
});

test.describe("theme — multi-tab sync", () => {
	test("storage event propagates across tabs", async ({ context }) => {
		const tab1 = await context.newPage();
		const tab2 = await context.newPage();
		await tab1.emulateMedia({ colorScheme: "dark" });
		await tab2.emulateMedia({ colorScheme: "dark" });
		await tab1.goto("/");
		await tab2.goto("/");

		await tab1.locator(".theme-toggle").click(); // system → light

		await expect
			.poll(() => tab2.evaluate(() => document.documentElement.dataset.theme ?? null))
			.toBe("light");
		await expect
			.poll(() => tab2.evaluate(() => getComputedStyle(document.body).backgroundColor))
			.toBe(LIGHT_BG_RGB);
		await expect(tab2.locator(".theme-toggle")).toHaveAttribute("data-theme-state", "light");
	});
});

test.describe("theme — FOUC mitigation", () => {
	test("hydration script ships inline in <head> before stylesheets", async ({ page }) => {
		const response = await page.goto("/");
		const html = (await response?.text()) ?? "";
		const headEnd = html.indexOf("</head>");
		expect(headEnd).toBeGreaterThan(0);
		const headHtml = html.slice(0, headEnd);
		expect(headHtml).toContain('localStorage.getItem("theme")');
		const scriptIdx = headHtml.indexOf('localStorage.getItem("theme")');
		const firstStylesheet = headHtml.indexOf('rel="stylesheet"');
		expect(scriptIdx).toBeGreaterThan(-1);
		// If no <link rel=stylesheet> in head (pure inline), firstStylesheet === -1 — ordering trivially satisfied.
		expect(firstStylesheet === -1 || scriptIdx < firstStylesheet).toBe(true);
	});

	test("first paint with stored override applies stored value, not OS preference", async ({
		page,
	}) => {
		// Pre-seed localStorage by visiting once and toggling.
		await page.emulateMedia({ colorScheme: "dark" });
		await page.goto("/");
		await page.locator(".theme-toggle").click(); // system → light (stored "light")

		// Reload with dark OS — stored "light" must win.
		await page.reload();
		await expect
			.poll(() => page.evaluate(() => document.documentElement.dataset.theme ?? null))
			.toBe("light");
		await expect
			.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
			.toBe(LIGHT_BG_RGB);
	});
});

test.describe("theme — matchMedia listener", () => {
	test("OS preference change in system mode updates body bg", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "light" });
		await page.goto("/");
		await expect
			.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
			.toBe(LIGHT_BG_RGB);

		await page.emulateMedia({ colorScheme: "dark" });
		await expect
			.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
			.toBe(DARK_BG_RGB);
	});
});
