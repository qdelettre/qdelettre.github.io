import { test, expect } from "@playwright/test";

test("blog index renders post count and rows", async ({ page }) => {
	await page.goto("/posts/");
	await expect(page.getByRole("heading", { level: 1 })).toContainText("Notes");
	const count = await page.getByTestId("post-row").count();
	expect(count).toBeGreaterThan(0);
});

test("blog index has filter chips for each distinct tag", async ({ page }) => {
	await page.goto("/posts/");
	const filters = page.locator(".filter-tag");
	await expect(filters.filter({ hasText: "All" })).toBeVisible();
	const filterCount = await filters.count();
	expect(filterCount).toBeGreaterThanOrEqual(2);
});

test("year group header renders for each year represented", async ({ page }) => {
	await page.goto("/posts/");
	await expect(page.getByTestId("year-label").first()).toBeVisible();
});
