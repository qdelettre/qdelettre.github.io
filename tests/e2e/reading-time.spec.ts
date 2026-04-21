import { test, expect } from "@playwright/test";

test("blog index shows reading-time badge for posts > 1 min", async ({ page }) => {
	await page.goto("/posts/");
	const readingListRow = page.locator('[data-testid="post-row"][href$="reading-list-2023/"]');
	await expect(readingListRow.locator(".read")).toBeVisible();
	await expect(readingListRow.locator(".read")).toHaveText(/\d+ min read/);
});

test("blog index suppresses badge for posts <= 1 min", async ({ page }) => {
	await page.goto("/posts/");
	const itWorksRow = page.locator('[data-testid="post-row"][href$="it-works/"]');
	await expect(itWorksRow).toBeVisible();
	await expect(itWorksRow.locator(".read")).toHaveCount(0);
});

test("post detail shows reading-time badge only when > 1 min", async ({ page }) => {
	await page.goto("/posts/2023-12-02-reading-list-2023/");
	await expect(page.locator(".post-meta .read")).toBeVisible();
	await expect(page.locator(".post-meta .read")).toHaveText(/\d+ min read/);

	await page.goto("/posts/it-works/");
	await expect(page.locator(".post-meta .read")).toHaveCount(0);
});
