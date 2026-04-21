import { test, expect } from "@playwright/test";

test("404 page renders on unknown route", async ({ page }) => {
	const response = await page.goto("/this-does-not-exist/", { waitUntil: "domcontentloaded" });
	expect(response?.status()).toBe(404);
	await expect(page.getByRole("heading", { level: 1 })).toContainText("Page not found");
	await expect(page.getByRole("link", { name: /back home/i })).toHaveAttribute("href", "/");
});
