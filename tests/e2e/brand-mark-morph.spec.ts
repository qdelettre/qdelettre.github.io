import { test, expect } from "@playwright/test";

test.describe("body[data-route] attribute", () => {
	test("home sets data-route=home", async ({ page }) => {
		await page.goto("/");
		await expect(page.locator("body")).toHaveAttribute("data-route", "home");
	});

	test("about sets data-route=about", async ({ page }) => {
		await page.goto("/about/");
		await expect(page.locator("body")).toHaveAttribute("data-route", "about");
	});

	test("posts index sets data-route=posts", async ({ page }) => {
		await page.goto("/posts/");
		await expect(page.locator("body")).toHaveAttribute("data-route", "posts");
	});

	test("post detail sets data-route=posts", async ({ page }) => {
		await page.goto("/posts/it-works/");
		await expect(page.locator("body")).toHaveAttribute("data-route", "posts");
	});

	test("tags index sets data-route=tags", async ({ page }) => {
		await page.goto("/tags/");
		await expect(page.locator("body")).toHaveAttribute("data-route", "tags");
	});
});

test.describe("header brand-mark transition name", () => {
	test("header brand-mark carries view-transition-name: brand-mark on non-about routes", async ({
		page,
	}) => {
		await page.goto("/");
		const mark = page.locator("header.site .brand-mark").first();
		await expect(mark).toHaveCSS("view-transition-name", "brand-mark");
	});
});

test.describe("about hero brand-mark", () => {
	test("renders hero brand-mark, not purple avatar", async ({ page }) => {
		await page.goto("/about/");
		await expect(page.locator(".brand-mark--hero")).toBeVisible();
		await expect(page.locator(".avatar")).toHaveCount(0);
	});

	test("hero brand-mark contains the 'qd' text", async ({ page }) => {
		await page.goto("/about/");
		const heroText = page.locator(".brand-mark--hero svg text");
		await expect(heroText).toHaveText("qd");
	});

	test("hero brand-mark carries view-transition-name: brand-mark", async ({ page }) => {
		await page.goto("/about/");
		await expect(page.locator(".brand-mark--hero")).toHaveCSS("view-transition-name", "brand-mark");
	});

	test("hero brand-mark renders at 110x110 CSS pixels", async ({ page }) => {
		await page.goto("/about/");
		const box = await page.locator(".brand-mark--hero").boundingBox();
		await expect(page.locator(".brand-mark--hero")).toBeVisible();
		expect(box?.width).toBeCloseTo(110, 0);
		expect(box?.height).toBeCloseTo(110, 0);
	});
});

test.describe("header brand-mark on /about", () => {
	test("header brand-mark is visibility: hidden on /about", async ({ page }) => {
		await page.goto("/about/");
		const headerMark = page.locator("header.site .brand-mark").first();
		await expect(headerMark).toHaveCSS("visibility", "hidden");
	});

	test("header brand-mark loses view-transition-name on /about", async ({ page }) => {
		await page.goto("/about/");
		const headerMark = page.locator("header.site .brand-mark").first();
		await expect(headerMark).toHaveCSS("view-transition-name", "none");
	});

	test("header brand-mark preserves its 22px layout slot on /about", async ({ page }) => {
		await page.goto("/about/");
		const headerMark = page.locator("header.site .brand-mark").first();
		await expect(headerMark).toHaveCount(1);
		const box = await headerMark.boundingBox();
		expect(box?.width).toBeCloseTo(22, 0);
		expect(box?.height).toBeCloseTo(22, 0);
	});

	test("status-dot-link is still present on /about", async ({ page }) => {
		await page.goto("/about/");
		await expect(page.locator("header.site .status-dot-link")).toHaveCount(1);
	});

	test("header brand-mark is visible on non-about routes", async ({ page }) => {
		await page.goto("/posts/");
		const headerMark = page.locator("header.site .brand-mark").first();
		await expect(headerMark).toHaveCSS("visibility", "visible");
	});
});

test.describe("navigation boundary", () => {
	test("navigating / -> /about hides header mark and reveals hero", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("link", { name: "About" }).click();
		await page.waitForURL("**/about/");
		await expect(page.locator("body")).toHaveAttribute("data-route", "about");
		await expect(page.locator(".brand-mark--hero")).toBeVisible();
		await expect(page.locator("header.site .brand-mark").first()).toHaveCSS("visibility", "hidden");
	});

	test("navigating /about -> / restores header mark visibility", async ({ page }) => {
		await page.goto("/about/");
		await page.getByRole("link", { name: "Home" }).click();
		await page.waitForURL((url) => url.pathname === "/");
		await expect(page.locator("body")).toHaveAttribute("data-route", "home");
		await expect(page.locator("header.site .brand-mark").first()).toHaveCSS(
			"visibility",
			"visible",
		);
	});

	test("navigating / -> /about also hides header dot and wordmark, reveals hero dot", async ({
		page,
	}) => {
		await page.goto("/");
		await page.getByRole("link", { name: "About" }).click();
		await page.waitForURL("**/about/");
		await expect(page.locator(".status-dot-link--hero")).toBeVisible();
		await expect(page.locator("header.site .status-dot-link").first()).toHaveCSS(
			"visibility",
			"hidden",
		);
		await expect(page.locator("header.site .brand-wordmark")).toHaveCSS("visibility", "hidden");
	});

	test("navigating /about -> / restores header dot and wordmark", async ({ page }) => {
		await page.goto("/about/");
		await page.getByRole("link", { name: "Home" }).click();
		await page.waitForURL((url) => url.pathname === "/");
		await expect(page.locator("header.site .status-dot-link").first()).toHaveCSS(
			"visibility",
			"visible",
		);
		await expect(page.locator("header.site .brand-wordmark")).toHaveCSS("visibility", "visible");
	});
});

test.describe("header wordmark + status-dot hooks", () => {
	test("wordmark span has the brand-wordmark class on /", async ({ page }) => {
		await page.goto("/");
		await expect(page.locator("header.site .brand-wordmark")).toHaveCount(1);
	});

	test("header status-dot carries view-transition-name: brand-status-dot on /", async ({
		page,
	}) => {
		await page.goto("/");
		await expect(page.locator("header.site .status-dot-link")).toHaveCSS(
			"view-transition-name",
			"brand-status-dot",
		);
	});
});

test.describe("about hero status-dot", () => {
	test("hero status-dot is present on /about", async ({ page }) => {
		await page.goto("/about/");
		await expect(page.locator(".status-dot-link--hero")).toBeVisible();
	});

	test("hero status-dot carries view-transition-name: brand-status-dot", async ({ page }) => {
		await page.goto("/about/");
		await expect(page.locator(".status-dot-link--hero")).toHaveCSS(
			"view-transition-name",
			"brand-status-dot",
		);
	});

	test("hero status-dot is a mailto link", async ({ page }) => {
		await page.goto("/about/");
		const href = await page.locator(".status-dot-link--hero").getAttribute("href");
		expect(href).toMatch(/^mailto:/);
	});

	test("hero status-dot renders at 22x22 CSS pixels", async ({ page }) => {
		await page.goto("/about/");
		const heroDot = page.locator(".status-dot-link--hero");
		await expect(heroDot).toBeVisible();
		const box = await heroDot.boundingBox();
		expect(box?.width).toBeCloseTo(22, 0);
		expect(box?.height).toBeCloseTo(22, 0);
	});

	test("hero status-dot inner .dot carries the status-dot-halo class", async ({ page }) => {
		await page.goto("/about/");
		await expect(page.locator(".status-dot-link--hero .dot.status-dot-halo")).toHaveCount(1);
	});

	test("hero status-dot has an aria-label mentioning office hours", async ({ page }) => {
		await page.goto("/about/");
		const label = await page.locator(".status-dot-link--hero").getAttribute("aria-label");
		expect(label).toMatch(/Email Quentin/);
	});

	test("hero status-dot has no data-tooltip (no visual tooltip on /about)", async ({ page }) => {
		await page.goto("/about/");
		const tooltip = await page.locator(".status-dot-link--hero").getAttribute("data-tooltip");
		expect(tooltip).toBeNull();
	});
});

test.describe("header status-dot on /about", () => {
	test("header status-dot is visibility: hidden on /about", async ({ page }) => {
		await page.goto("/about/");
		await expect(page.locator("header.site .status-dot-link").first()).toHaveCSS(
			"visibility",
			"hidden",
		);
	});

	test("header status-dot loses view-transition-name on /about", async ({ page }) => {
		await page.goto("/about/");
		await expect(page.locator("header.site .status-dot-link").first()).toHaveCSS(
			"view-transition-name",
			"none",
		);
	});

	test("header status-dot has pointer-events: none on /about", async ({ page }) => {
		await page.goto("/about/");
		await expect(page.locator("header.site .status-dot-link").first()).toHaveCSS(
			"pointer-events",
			"none",
		);
	});

	test("header status-dot is visible + clickable on non-about routes", async ({ page }) => {
		await page.goto("/");
		const headerDot = page.locator("header.site .status-dot-link").first();
		await expect(headerDot).toHaveCSS("visibility", "visible");
		await expect(headerDot).toHaveCSS("pointer-events", "auto");
	});
});

test.describe("header wordmark on /about", () => {
	test("wordmark is visibility: hidden on /about", async ({ page }) => {
		await page.goto("/about/");
		await expect(page.locator("header.site .brand-wordmark")).toHaveCSS("visibility", "hidden");
	});

	test("wordmark is visible on /", async ({ page }) => {
		await page.goto("/");
		await expect(page.locator("header.site .brand-wordmark")).toHaveCSS("visibility", "visible");
	});

	test("wordmark text is preserved across routes", async ({ page }) => {
		await page.goto("/");
		const wordmarkOnHome = await page.locator("header.site .brand-wordmark").textContent();
		expect(wordmarkOnHome).not.toBeNull();
		await page.goto("/about/");
		await expect(page.locator("header.site .brand-wordmark")).toHaveText(wordmarkOnHome ?? "");
	});
});
