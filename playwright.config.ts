import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: [
		["list"],
		["html", { open: "never" }],
		["json", { outputFile: "playwright-report/report.json" }],
	],
	use: {
		baseURL: "http://localhost:4321",
		trace: "retain-on-failure",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: {
		// In CI the dist/ is downloaded as an artifact from the build job, so
		// preview can serve it directly. Locally, build first to be self-contained.
		command: process.env.CI ? "npm run preview" : "npm run build && npm run preview",
		url: "http://localhost:4321",
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
	},
});
