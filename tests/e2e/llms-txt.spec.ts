import { test, expect } from "@playwright/test";

test.describe("llms.txt", () => {
	test("returns 200 with text/plain content type", async ({ request }) => {
		const response = await request.get("/llms.txt");
		expect(response.status()).toBe(200);
		expect(response.headers()["content-type"]).toContain("text/plain");
	});

	test("body opens with site title, description, and Posts section", async ({ request }) => {
		const response = await request.get("/llms.txt");
		const body = await response.text();
		expect(body).toMatch(
			/^# Quentin Delettre\n\n> Fullstack engineer, for the web, building with care\n\n## Posts\n\n/,
		);
	});

	test("body contains at least one post bullet in the spec format", async ({ request }) => {
		const response = await request.get("/llms.txt");
		const body = await response.text();
		expect(body).toMatch(/^- \[.+\]\(https?:\/\/.+\): .+$/m);
	});

	test("bullet count matches the published-post count on /posts/", async ({ page, request }) => {
		await page.goto("/posts/");
		const postRowCount = await page.locator('a[data-testid="post-row"]').count();
		const llmsResponse = await request.get("/llms.txt");
		const body = await llmsResponse.text();
		const bulletCount = (body.match(/^- \[/gm) ?? []).length;
		expect(bulletCount).toBe(postRowCount);
	});
});
