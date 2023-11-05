import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
});

test("has page title & visible title", async ({ page }) => {
	await expect(page).toHaveTitle("Home • Quentin Delettre");
	expect(page.getByRole("link", { name: "Quentin Delettre" })).toBeTruthy();
});

test("has menu links & side links", async ({ page }) => {
	const menu = page.getByLabel("Main menu", { exact: true });
	expect(menu.getByRole("link", { name: "Home" })).toBeTruthy();
	expect(menu.getByRole("link", { name: "About" })).toBeTruthy();
	expect(menu.getByRole("link", { name: "Blog" })).toBeTruthy();

	expect(page.getByRole("button", { name: "search" })).toBeTruthy();
	expect(page.getByLabel("Toggle Dark Mode")).toBeTruthy();
});

test("has heading & socials", async ({ page }) => {
	expect(page.getByRole("heading", { name: "Hello World!" })).toBeTruthy();

	expect(page.getByText("Find me on")).toBeTruthy();
	expect(page.getByRole("link", { name: "Github" })).toBeTruthy();
	expect(page.getByRole("link", { name: "LinkedIn" })).toBeTruthy();
	expect(page.getByRole("link", { name: "email" })).toBeTruthy();
});

test("has recent posts", async ({ page }) => {
	expect(page.getByRole("heading", { name: "Recent Posts" })).toBeTruthy();
});
