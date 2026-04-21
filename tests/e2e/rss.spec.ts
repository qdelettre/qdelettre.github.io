import { test, expect } from "@playwright/test";

test("rss feed is valid", async ({ request }) => {
	const response = await request.get("/rss.xml");
	expect(response.status()).toBe(200);
	const contentType = response.headers()["content-type"] ?? "";
	expect(contentType).toMatch(/xml/);
	const body = await response.text();
	expect(body).toContain("<rss");
	expect(body).toContain("<channel>");
	expect(body).toContain("<item>");
});
