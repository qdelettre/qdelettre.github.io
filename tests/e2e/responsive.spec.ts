import { test, expect } from "@playwright/test";

test.describe("fluid type tokens", () => {
	test("--text-4xl resolves to 32px at 320 viewport", async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 640 });
		await page.goto("/");
		const computed = await page.evaluate(() =>
			getComputedStyle(document.documentElement).getPropertyValue("--text-4xl").trim(),
		);
		expect(computed).toMatch(/clamp/);
		const fontSize = await page.evaluate(() => {
			const probe = document.createElement("span");
			probe.style.fontSize = "var(--text-4xl)";
			document.body.appendChild(probe);
			const px = parseFloat(getComputedStyle(probe).fontSize);
			probe.remove();
			return px;
		});
		expect(fontSize).toBeGreaterThanOrEqual(31.5);
		expect(fontSize).toBeLessThanOrEqual(32.5);
	});

	test("--text-4xl resolves to 48px at 1280 viewport", async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto("/");
		const fontSize = await page.evaluate(() => {
			const probe = document.createElement("span");
			probe.style.fontSize = "var(--text-4xl)";
			document.body.appendChild(probe);
			const px = parseFloat(getComputedStyle(probe).fontSize);
			probe.remove();
			return px;
		});
		expect(fontSize).toBeGreaterThanOrEqual(47.5);
		expect(fontSize).toBeLessThanOrEqual(48.5);
	});

	test("--text-2xs is fixed 12px across viewports", async ({ page }) => {
		for (const width of [375, 1280]) {
			await page.setViewportSize({ width, height: 800 });
			await page.goto("/");
			const fontSize = await page.evaluate(() => {
				const probe = document.createElement("span");
				probe.style.fontSize = "var(--text-2xs)";
				document.body.appendChild(probe);
				const px = parseFloat(getComputedStyle(probe).fontSize);
				probe.remove();
				return px;
			});
			expect(fontSize).toBeCloseTo(12, 0);
		}
	});

	test("home page h1 uses --text-4xl and scales with viewport", async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 640 });
		await page.goto("/");
		const sizeAt320 = await page
			.locator(".hero h1")
			.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
		await page.setViewportSize({ width: 1280, height: 800 });
		const sizeAt1280 = await page
			.locator(".hero h1")
			.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
		expect(sizeAt320).toBeCloseTo(32, 0);
		expect(sizeAt1280).toBeCloseTo(48, 0);
	});
});

test.describe("global layer", () => {
	test(".page uses 100dvh as min-height", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto("/");
		const minHeight = await page.locator(".page").evaluate((el) => getComputedStyle(el).minHeight);
		expect(parseFloat(minHeight)).toBeCloseTo(667, 0);
	});

	test(".page horizontal padding is fluid (scales with viewport)", async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 640 });
		await page.goto("/");
		const padAt320 = await page
			.locator(".page")
			.evaluate((el) => parseFloat(getComputedStyle(el).paddingLeft));
		await page.setViewportSize({ width: 1280, height: 800 });
		const padAt1280 = await page
			.locator(".page")
			.evaluate((el) => parseFloat(getComputedStyle(el).paddingLeft));
		expect(padAt320).toBeCloseTo(16, 0);
		expect(padAt1280).toBeCloseTo(32, 0);
	});

	test("h1 has text-wrap: balance", async ({ page }) => {
		await page.goto("/about/");
		const textWrap = await page
			.locator(".about-head h1")
			.evaluate((el) => getComputedStyle(el).textWrap);
		expect(textWrap).toBe("balance");
	});

	test("body has hyphens: auto", async ({ page }) => {
		await page.goto("/");
		const hyphens = await page.locator("body").evaluate((el) => getComputedStyle(el).hyphens);
		expect(hyphens).toBe("auto");
	});
});

test.describe("header responsiveness", () => {
	test("header has flex-wrap: wrap", async ({ page }) => {
		await page.goto("/");
		const flexWrap = await page
			.locator("header.site")
			.evaluate((el) => getComputedStyle(el).flexWrap);
		expect(flexWrap).toBe("wrap");
	});

	test("nav links have ≥ 44x44 hit area on mobile viewport", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto("/");
		const firstNavLink = page.locator("header.site nav.site-nav a").first();
		await expect(firstNavLink).toBeVisible();
		const box = await firstNavLink.boundingBox();
		expect(box?.width).toBeGreaterThanOrEqual(44);
		expect(box?.height).toBeGreaterThanOrEqual(44);
	});

	test("nav font-size scales with viewport", async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 640 });
		await page.goto("/");
		const at320 = await page
			.locator("header.site nav.site-nav a")
			.first()
			.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
		await page.setViewportSize({ width: 1280, height: 800 });
		const at1280 = await page
			.locator("header.site nav.site-nav a")
			.first()
			.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
		expect(at320).toBeCloseTo(13, 0);
		expect(at1280).toBeCloseTo(16, 0);
	});
});

test.describe("about page responsiveness", () => {
	test(".about-head hero is left of h1 at 375 viewport", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 800 });
		await page.goto("/about/");
		await expect(page.locator(".about-head h1")).toBeVisible();
		await expect(page.locator(".about-head .hero-identity")).toBeVisible();
		const heroBox = await page.locator(".about-head .hero-identity").boundingBox();
		const h1Box = await page.locator(".about-head h1").boundingBox();
		expect((heroBox?.x ?? 0) + (heroBox?.width ?? 0)).toBeLessThanOrEqual((h1Box?.x ?? 0) + 2);
	});

	test(".about-head hero is left of h1 at 1024 viewport", async ({ page }) => {
		await page.setViewportSize({ width: 1024, height: 800 });
		await page.goto("/about/");
		await expect(page.locator(".about-head h1")).toBeVisible();
		await expect(page.locator(".about-head .hero-identity")).toBeVisible();
		const heroBox = await page.locator(".about-head .hero-identity").boundingBox();
		const h1Box = await page.locator(".about-head h1").boundingBox();
		expect((heroBox?.x ?? 0) + (heroBox?.width ?? 0)).toBeLessThanOrEqual((h1Box?.x ?? 0) + 2);
	});

	test("hero cy is within 4px of h1 cy (cap-height centering)", async ({ page }) => {
		await page.setViewportSize({ width: 1024, height: 800 });
		await page.goto("/about/");
		await expect(page.locator(".about-head h1")).toBeVisible();
		await expect(page.locator(".about-head .hero-identity")).toBeVisible();
		const heroBox = await page.locator(".about-head .hero-identity").boundingBox();
		const h1Box = await page.locator(".about-head h1").boundingBox();
		const heroCy = (heroBox?.y ?? 0) + (heroBox?.height ?? 0) / 2;
		const h1Cy = (h1Box?.y ?? 0) + (h1Box?.height ?? 0) / 2;
		expect(Math.abs(heroCy - h1Cy)).toBeLessThanOrEqual(4);
	});

	test("h1 is single-line at 640 viewport when string fits", async ({ page }) => {
		await page.setViewportSize({ width: 640, height: 800 });
		await page.goto("/about/");
		await expect(page.locator(".about-head h1")).toBeVisible();
		const h1Box = await page.locator(".about-head h1").boundingBox();
		const h1LineHeight = await page.locator(".about-head h1").evaluate((el) => {
			const cs = getComputedStyle(el);
			const fontSize = parseFloat(cs.fontSize);
			const lh = cs.lineHeight === "normal" ? fontSize * 1.2 : parseFloat(cs.lineHeight);
			return lh;
		});
		expect(h1Box?.height ?? 999).toBeLessThan(h1LineHeight * 1.5);
	});

	test("h1 wraps to 2 lines at 375 viewport when narrow", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 800 });
		await page.goto("/about/");
		await expect(page.locator(".about-head h1")).toBeVisible();
		const h1Box = await page.locator(".about-head h1").boundingBox();
		const h1LineHeight = await page.locator(".about-head h1").evaluate((el) => {
			const cs = getComputedStyle(el);
			const fontSize = parseFloat(cs.fontSize);
			const lh = cs.lineHeight === "normal" ? fontSize * 1.2 : parseFloat(cs.lineHeight);
			return lh;
		});
		expect(h1Box?.height ?? 0).toBeGreaterThan(h1LineHeight * 1.5);
	});

	test("hero mark width bounded by clamp (72–110)", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 800 });
		await page.goto("/about/");
		const widthAt375 = await page
			.locator(".about-head .hero-identity")
			.evaluate((el) => el.getBoundingClientRect().width);
		expect(widthAt375).toBeGreaterThanOrEqual(71);
		expect(widthAt375).toBeLessThanOrEqual(73);
		await page.setViewportSize({ width: 1024, height: 800 });
		const widthAt1024 = await page
			.locator(".about-head .hero-identity")
			.evaluate((el) => el.getBoundingClientRect().width);
		expect(widthAt1024).toBeCloseTo(110, 0);
	});

	test("about h1 uses --text-4xl (32→48 fluid)", async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 640 });
		await page.goto("/about/");
		const at320 = await page
			.locator(".about-head h1")
			.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
		await page.setViewportSize({ width: 1280, height: 800 });
		const at1280 = await page
			.locator(".about-head h1")
			.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
		expect(at320).toBeCloseTo(32, 0);
		expect(at1280).toBeCloseTo(48, 0);
	});
});

const VIEWPORTS = [
	{ label: "375x667 iPhone SE", width: 375, height: 667 },
	{ label: "390x844 iPhone 14", width: 390, height: 844 },
	{ label: "768x1024 iPad", width: 768, height: 1024 },
	{ label: "1440x900 desktop", width: 1440, height: 900 },
];

const PAGES = ["/", "/about/", "/posts/", "/posts/it-works/", "/tags/"];

test.describe("cross-viewport — no horizontal overflow", () => {
	for (const viewport of VIEWPORTS) {
		for (const pagePath of PAGES) {
			test(`${pagePath} at ${viewport.label} has no horizontal overflow`, async ({ page }) => {
				await page.setViewportSize({ width: viewport.width, height: viewport.height });
				await page.goto(pagePath);
				const [scrollWidth, clientWidth] = await page.evaluate(() => [
					document.documentElement.scrollWidth,
					document.documentElement.clientWidth,
				]);
				expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
			});
		}
	}
});

test.describe("cross-viewport — touch targets", () => {
	for (const viewport of VIEWPORTS.filter((v) => v.width <= 640)) {
		test(`first PostRow is ≥ 44px tall on ${viewport.label}`, async ({ page }) => {
			await page.setViewportSize({ width: viewport.width, height: viewport.height });
			await page.goto("/posts/");
			const box = await page.locator('[data-testid="post-row"]').first().boundingBox();
			expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
		});
	}
});

test.describe("header trimmed spacing", () => {
	test("header.site has no margin-bottom (merged into padding-bottom)", async ({ page }) => {
		await page.goto("/");
		const marginBottom = await page
			.locator("header.site")
			.evaluate((el) => parseFloat(getComputedStyle(el).marginBottom));
		expect(marginBottom).toBeCloseTo(0, 0);
	});

	test("header.site padding-bottom resolves to space-lg at 375", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 800 });
		await page.goto("/");
		const paddingBottom = await page
			.locator("header.site")
			.evaluate((el) => parseFloat(getComputedStyle(el).paddingBottom));
		expect(paddingBottom).toBeGreaterThanOrEqual(16);
		expect(paddingBottom).toBeLessThanOrEqual(24);
	});
});

test.describe(".page bottom padding", () => {
	test(".page padding-bottom resolves to space-xl at 375", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 800 });
		await page.goto("/");
		const paddingBottom = await page
			.locator(".page")
			.evaluate((el) => parseFloat(getComputedStyle(el).paddingBottom));
		expect(paddingBottom).toBeGreaterThanOrEqual(22);
		expect(paddingBottom).toBeLessThanOrEqual(32);
	});
});

test.describe("section gaps tokenized", () => {
	test("home section.block margin-top is fluid (~37px at 375, ~72px at 1280)", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 800 });
		await page.goto("/");
		const at375 = await page
			.locator("section.block")
			.first()
			.evaluate((el) => parseFloat(getComputedStyle(el).marginTop));
		await page.setViewportSize({ width: 1280, height: 800 });
		const at1280 = await page
			.locator("section.block")
			.first()
			.evaluate((el) => parseFloat(getComputedStyle(el).marginTop));
		expect(at375).toBeGreaterThanOrEqual(32);
		expect(at375).toBeLessThanOrEqual(42);
		expect(at1280).toBeCloseTo(72, 0);
	});
});

test.describe("wasted-space budget", () => {
	test("first content on / sits within 130px of viewport top at 375", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 800 });
		await page.goto("/");
		const firstContent = page.locator(".hero").first();
		await expect(firstContent).toBeVisible();
		const box = await firstContent.boundingBox();
		expect(box?.y ?? 999).toBeLessThanOrEqual(130);
	});

	test("first content on /about/ sits within 130px of viewport top at 375", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 800 });
		await page.goto("/about/");
		const firstContent = page.locator(".about-head h1").first();
		await expect(firstContent).toBeVisible();
		const box = await firstContent.boundingBox();
		expect(box?.y ?? 999).toBeLessThanOrEqual(130);
	});

	test("home .hero to Writing section gap is tight on mobile (≤ 60px)", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 800 });
		await page.goto("/");
		const heroMeta = page.locator(".hero-meta");
		const firstBlock = page.locator("section.block").first();
		await expect(heroMeta).toBeVisible();
		await expect(firstBlock).toBeVisible();
		const heroMetaBox = await heroMeta.boundingBox();
		const blockBox = await firstBlock.boundingBox();
		const gap = (blockBox?.y ?? 0) - ((heroMetaBox?.y ?? 0) + (heroMetaBox?.height ?? 0));
		expect(gap).toBeLessThanOrEqual(60);
	});
});

test.describe("PostRow stacks on narrow viewports", () => {
	test(".post-row.index: title + desc span full width on 375", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 800 });
		await page.goto("/posts/");
		const row = page.locator('[data-testid="post-row"].index').first();
		const main = row.locator(".main");
		await expect(main).toBeVisible();
		const rowBox = await row.boundingBox();
		const mainBox = await main.boundingBox();
		expect(mainBox?.width ?? 0).toBeGreaterThanOrEqual((rowBox?.width ?? 0) - 8);
	});

	test(".post-row.index title fits on one line for short titles on 375", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 800 });
		await page.goto("/posts/");
		const title = page.locator('[data-testid="post-row"].index .title').first();
		await expect(title).toBeVisible();
		const titleBox = await title.boundingBox();
		const lineHeight = await title.evaluate((el) => {
			const cs = getComputedStyle(el);
			const fs = parseFloat(cs.fontSize);
			return cs.lineHeight === "normal" ? fs * 1.2 : parseFloat(cs.lineHeight);
		});
		expect(titleBox?.height ?? 999).toBeLessThan(lineHeight * 1.6);
	});

	test(".post-row.index read badge is one line on 375", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 800 });
		await page.goto("/posts/");
		const read = page.locator('[data-testid="post-row"].index .read').first();
		await expect(read).toBeVisible();
		const readBox = await read.boundingBox();
		const lineHeight = await read.evaluate((el) => {
			const cs = getComputedStyle(el);
			const fs = parseFloat(cs.fontSize);
			return cs.lineHeight === "normal" ? fs * 1.2 : parseFloat(cs.lineHeight);
		});
		expect(readBox?.height ?? 999).toBeLessThan(lineHeight * 1.6);
	});

	test(".post-row stays side-by-side on desktop (1024)", async ({ page }) => {
		await page.setViewportSize({ width: 1024, height: 800 });
		await page.goto("/posts/");
		const row = page.locator('[data-testid="post-row"].index').first();
		const date = row.locator(".date");
		const main = row.locator(".main");
		const dateBox = await date.boundingBox();
		const mainBox = await main.boundingBox();
		expect((dateBox?.x ?? 0) + (dateBox?.width ?? 0)).toBeLessThanOrEqual((mainBox?.x ?? 0) + 2);
		const dateTop = dateBox?.y ?? 0;
		const dateBot = dateTop + (dateBox?.height ?? 0);
		const mainTop = mainBox?.y ?? 0;
		const mainBot = mainTop + (mainBox?.height ?? 0);
		expect(Math.min(dateBot, mainBot)).toBeGreaterThan(Math.max(dateTop, mainTop));
	});
});
