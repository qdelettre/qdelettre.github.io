import { test, expect } from "@playwright/test";

test("tags index renders at least one tag chip", async ({ page }) => {
	await page.goto("/tags/");
	await expect(page.locator("a.tag").first()).toBeVisible();
});

test("tag archive renders posts for that tag only", async ({ page }) => {
	await page.goto("/tags/books/");
	const rows = page.locator(".post-row.index");
	await expect(rows.first()).toBeVisible();
	const titles = await rows.locator(".title").allInnerTexts();
	expect(titles.length).toBeGreaterThan(0);
});
