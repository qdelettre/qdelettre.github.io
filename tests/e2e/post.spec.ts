import { test, expect } from "@playwright/test";

test("post page renders title and prose", async ({ page }) => {
	await page.goto("/posts/it-works/");
	await expect(page.getByRole("heading", { level: 1 })).toContainText("It works");
	const prose = page.locator("article.prose");
	await expect(prose).toBeVisible();
	await expect(prose.locator("p").first()).toBeVisible();
});
