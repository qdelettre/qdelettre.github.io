import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
	{ path: "/", name: "home" },
	{ path: "/posts/", name: "blog index" },
	{ path: "/about/", name: "about" },
	{ path: "/posts/it-works/", name: "post detail" },
	{ path: "/tags/", name: "tags index" },
];

const schemes = ["light", "dark"] as const;

for (const scheme of schemes) {
	for (const { path, name } of routes) {
		test(`${name} (${path}) has no automatically-detectable WCAG 2.1 AA violations [${scheme} mode]`, async ({
			page,
		}) => {
			await page.emulateMedia({ colorScheme: scheme });
			await page.goto(path, { waitUntil: "domcontentloaded" });
			const scan = await new AxeBuilder({ page })
				.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"])
				.analyze();
			expect(scan.violations).toEqual([]);
		});
	}
}

test("axe clean on / at 375x667", async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 667 });
	await page.goto("/");
	const results = await new AxeBuilder({ page }).analyze();
	expect(results.violations).toEqual([]);
});

test("axe clean on /about/ at 390x844", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/about/");
	const results = await new AxeBuilder({ page }).analyze();
	expect(results.violations).toEqual([]);
});
