import { test, expect } from "@playwright/test";

test.describe("head meta — safe-area + iOS PWA", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("viewport meta carries viewport-fit=cover", async ({ page }) => {
		const viewport = page.locator('meta[name="viewport"]');
		await expect(viewport).toHaveAttribute("content", /\bviewport-fit=cover\b/);
	});

	test("viewport meta retains width and initial-scale", async ({ page }) => {
		const viewport = page.locator('meta[name="viewport"]');
		await expect(viewport).toHaveAttribute("content", /\bwidth=device-width\b/);
		await expect(viewport).toHaveAttribute("content", /\binitial-scale=1\b/);
	});

	test("mobile-web-app-capable is yes", async ({ page }) => {
		await expect(page.locator('meta[name="mobile-web-app-capable"]')).toHaveAttribute(
			"content",
			"yes",
		);
	});

	test("apple-mobile-web-app-capable is yes", async ({ page }) => {
		await expect(page.locator('meta[name="apple-mobile-web-app-capable"]')).toHaveAttribute(
			"content",
			"yes",
		);
	});

	test("apple-mobile-web-app-status-bar-style is black-translucent", async ({ page }) => {
		await expect(
			page.locator('meta[name="apple-mobile-web-app-status-bar-style"]'),
		).toHaveAttribute("content", "black-translucent");
	});

	test("apple-mobile-web-app-title is qdelettre", async ({ page }) => {
		await expect(page.locator('meta[name="apple-mobile-web-app-title"]')).toHaveAttribute(
			"content",
			"qdelettre",
		);
	});
});
