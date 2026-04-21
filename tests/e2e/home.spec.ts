import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
});

test("home has title and hero heading", async ({ page }) => {
	await expect(page).toHaveTitle(/Quentin Delettre/);
	await expect(page.getByRole("heading", { level: 1 })).toContainText("Fullstack engineer");
});

test("home nav links exist and point to correct routes", async ({ page }) => {
	const nav = page.getByRole("navigation", { name: "Main menu" });
	await expect(nav.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
	await expect(nav.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about/");
	await expect(nav.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/posts/");
});

test("home renders at least one writing row", async ({ page }) => {
	const rows = page.getByTestId("post-row");
	await expect(rows.first()).toBeVisible();
});

test("home footer has RSS and GitHub links", async ({ page }) => {
	const footer = page.getByTestId("site-footer");
	await expect(footer.getByRole("link", { name: "RSS" })).toHaveAttribute("href", "/rss.xml");
	await expect(footer.getByRole("link", { name: "GitHub" })).toHaveAttribute(
		"href",
		/github\.com\/qdelettre/,
	);
});
