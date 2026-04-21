import { test, expect } from "@playwright/test";

test("home ⌘K navigates to /posts/ and focuses input (no URL marker)", async ({ page }) => {
	await page.goto("/");
	await page.keyboard.press("Meta+KeyK");
	await page.waitForURL("**/posts/", { timeout: 5_000 });
	expect(page.url()).toMatch(/\/posts\/$/);
	await expect(page.getByPlaceholder("Search posts…")).toBeFocused();
});

test("home hint click navigates to /posts/ without query string", async ({ page }) => {
	await page.goto("/");
	await page.locator("a.hint-link").click();
	await page.waitForURL("**/posts/", { timeout: 5_000 });
	expect(page.url()).toMatch(/\/posts\/$/);
	expect(page.url()).not.toContain("?focus=");
});

test("post row click navigates to post detail via soft-nav", async ({ page }) => {
	await page.goto("/");
	const firstRow = page.getByTestId("post-row").first();
	await firstRow.click();
	await page.waitForURL("**/posts/**/", { timeout: 5_000 });
	await expect(page.locator("article.prose")).toBeVisible();
});
