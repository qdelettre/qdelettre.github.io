import { test, expect } from "@playwright/test";

test("og image returns png for known post", async ({ request }) => {
	const response = await request.get("/og-image/it-works.png");
	expect(response.status()).toBe(200);
	expect(response.headers()["content-type"]).toContain("image/png");
	const body = await response.body();
	expect(body.byteLength).toBeGreaterThan(10_000);
});
