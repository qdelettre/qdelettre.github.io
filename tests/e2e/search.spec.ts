import { test, expect } from "@playwright/test";

const modifier = process.platform === "darwin" ? "Meta" : "Control";

test("search filters results to match query", async ({ page }) => {
	await page.goto("/posts/");
	const input = page.getByPlaceholder("Search posts…");
	await input.fill("reading");

	const results = page.locator("[data-search-results]");
	await expect(results).not.toHaveAttribute("hidden", "");
	await expect(results.getByTestId("post-row").first()).toContainText("Reading", {
		timeout: 10_000,
	});
});

test("cmd+K focuses the search input", async ({ page }) => {
	await page.goto("/posts/");
	await page.keyboard.press(`${modifier}+KeyK`);
	const input = page.getByPlaceholder("Search posts…");
	await expect(input).toBeFocused();
});
