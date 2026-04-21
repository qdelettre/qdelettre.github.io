import fs from "node:fs";
import path from "node:path";

import { defineConfig, fontProviders } from "astro/config";
import type { Plugin } from "vite";
import mdx from "@astrojs/mdx";
import mermaid from "astro-mermaid";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import rehypeUnwrapImages from "rehype-unwrap-images";

import { remarkReadingTime } from "./src/plugins/remark-reading-time.ts";

export default defineConfig({
	site: "https://qdelettre.github.io",

	// Astro v6 built-in Fonts API — replaces manual @fontsource/* imports for site rendering.
	// Satori (in src/pages/og-image/…) still reads TTFs directly from node_modules;
	// see the @fontsource/inter and @fontsource/jetbrains-mono devDependencies.
	fonts: [
		{
			name: "Inter",
			cssVariable: "--font-inter",
			provider: fontProviders.fontsource(),
			weights: [400, 500, 600],
			styles: ["normal"],
			subsets: ["latin", "latin-ext"],
			fallbacks: ["system-ui", "sans-serif"],
			formats: ["woff2"],
		},
		{
			name: "JetBrains Mono",
			cssVariable: "--font-jetbrains-mono",
			provider: fontProviders.fontsource(),
			weights: [400, 500],
			styles: ["normal"],
			subsets: ["latin", "latin-ext"],
			fallbacks: ["ui-monospace", "SFMono-Regular", "monospace"],
			formats: ["woff2"],
		},
	],

	markdown: {
		rehypePlugins: [rehypeUnwrapImages],
		remarkPlugins: [remarkReadingTime],
		remarkRehype: { footnoteLabelProperties: { className: [""] } },
		shikiConfig: {
			theme: "vitesse-dark",
			wrap: true,
		},
	},
	prefetch: true,
	// astro-mermaid must come BEFORE mdx — it registers a remark plugin that runs
	// at the same hook. autoTheme follows <html data-theme="light|dark"> set by
	// <ThemeToggle>: `base` for light (with the themeVariables below), mermaid's
	// built-in `dark` for dark. themeVariables are static, so the light side gets
	// the rich treatment; dark falls back to mermaid's defaults.
	integrations: [
		mermaid({
			theme: "base",
			autoTheme: true,
			mermaidConfig: {
				themeVariables: {
					fontFamily: "Inter Variable, Inter, system-ui, sans-serif",
					background: "transparent",
					primaryColor: "#f7f8f8",
					primaryTextColor: "#1a1a1a",
					primaryBorderColor: "#5660c5",
					lineColor: "#666b73",
					secondaryColor: "#eef0f2",
					tertiaryColor: "#e0e3e7",
				},
			},
		}),
		mdx({}),
		sitemap(),
	],
	vite: {
		plugins: [tailwindcss(), rawFonts([".ttf"]), pagefindDevServe()],
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
		build: {
			rollupOptions: {
				external: [/^\/pagefind\//],
			},
		},
	},
});

function rawFonts(ext: Array<string>) {
	return {
		name: "vite-plugin-raw-fonts",
		transform(_code: string, id: string) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return {
					code: `export default ${JSON.stringify(buffer)}`,
					map: null,
				};
			}
			return undefined;
		},
	};
}

// Pagefind is a post-build CLI that emits `dist/pagefind/`; `astro dev` doesn't
// run it, so /pagefind/* would 404. Serve those files from `dist/pagefind/`
// during dev. Requires at least one prior `npm run build`; re-run build to
// refresh the index after editing posts. `build.rollupOptions.external` above
// handles the build-time case.
function pagefindDevServe(): Plugin {
	const PAGEFIND_MIME: Record<string, string> = {
		".js": "application/javascript",
		".json": "application/json",
		".wasm": "application/wasm",
		".css": "text/css",
		".pf_index": "application/octet-stream",
		".pf_meta": "application/octet-stream",
		".pf_fragment": "application/octet-stream",
	};
	return {
		name: "pagefind-dev-serve",
		apply: "serve",
		configureServer(server) {
			const distPagefind = path.join(process.cwd(), "dist", "pagefind");
			server.middlewares.use("/pagefind/", (req, res) => {
				const rel = (req.url ?? "/").split("?")[0] ?? "/";
				const filePath = path.join(distPagefind, rel);
				if (!filePath.startsWith(distPagefind)) {
					res.statusCode = 403;
					res.end();
					return;
				}
				if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
					res.statusCode = 404;
					res.setHeader("Content-Type", "text/plain; charset=utf-8");
					res.end(
						`[pagefind-dev-serve] ${rel} not found under dist/pagefind/. ` +
							`Run \`npm run build\` at least once to generate the index.`,
					);
					return;
				}
				const ext = path.extname(filePath);
				res.setHeader("Content-Type", PAGEFIND_MIME[ext] ?? "application/octet-stream");
				res.end(fs.readFileSync(filePath));
			});
		},
	};
}
