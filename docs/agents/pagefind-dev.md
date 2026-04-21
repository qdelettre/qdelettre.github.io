# Pagefind dev mode

The Pagefind index is built only by `npm run build`. The `build` script chains: `astro check && astro build && pagefind --site dist`. Output lands in `dist/pagefind/`.

## Dev server middleware

In dev (`npm run dev`), no Pagefind binary runs. A custom Vite middleware in `astro.config.ts` (`pagefindDevServe()`) proxies any `/pagefind/*` request to the most recent `dist/pagefind/` build.

**Workflow:** run `npm run build` once to populate the index, then `npm run dev` for iterative work. Search functionality continues to work in dev because the middleware serves the cached index. Re-run `npm run build` only when post content changes and you want fresh search results.

## Search component

`src/components/Search.astro` loads Pagefind's runtime via a dynamic specifier:

```ts
const pagefindUrl = "/pagefind/pagefind.js";
const pagefind = await import(/* @vite-ignore */ pagefindUrl);
```

The `/* @vite-ignore */` is mandatory — without it, Vite tries to resolve `/pagefind/pagefind.js` as a bundler import at dev time (before the middleware can intercept) and fails. With the comment, Vite leaves the dynamic import alone, browser fetches at runtime, middleware serves.

## Build-time externalization

`astro.config.ts` also declares:

```ts
vite: {
	build: {
		rollupOptions: {
			external: [/^\/pagefind\//];
		}
	}
}
```

This prevents Rollup from trying to resolve `/pagefind/pagefind.js` during the production build (the file doesn't exist yet at that point — it gets created by the subsequent `pagefind --site dist` step in the build chain).
