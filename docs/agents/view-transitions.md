# View transitions — Astro `<ClientRouter />`

`<ClientRouter />` mounts in `src/layouts/Base.astro`'s `<head>`. Pair elements across routes via the `transition:name` directive.

## Naming convention

- **Per-instance:** `transition:name={`post-title-${post.id}`}` — append a stable slug.
- **Singleton:** `transition:name="brand-mark"` — site-wide identity element.

## Pairing ambiguity (the most common failure mode)

If both source AND destination pages declare the same `transition:name` for distinct elements, the browser cannot resolve the morph target. Symptom: the transition silently degrades to a crossfade.

**Resolution pattern** (used by the brand-mark morph): release the transition name on the destination route via route-scoped CSS.

```css
body[data-route="about"] .brand-mark:not(.brand-mark--hero) {
	view-transition-name: none !important;
	visibility: hidden;
}
```

The `!important` is required because Astro's `transition:name` directive compiles to an inline `style="view-transition-name: ..."` attribute (specificity 1,0,0,0). A regular `view-transition-name: none` rule cannot beat it.

## Route attribute for CSS scoping

`Base.astro` derives a single-segment route name and emits `<body data-route={routeName}>`:

```astro
const routeName = Astro.url.pathname === "/" ? "home" :
(Astro.url.pathname.split("/").filter(Boolean)[0] ?? "home");
```

Use `body[data-route="<route>"]` for any route-specific CSS — including releasing transition names on routes that need them suppressed.

## Companion JS lifecycle

Soft-navigation re-runs scripts via `astro:after-swap`. Patterns that need to re-bind on every soft-nav (e.g., office-hours dot reconciliation):

```ts
function reconcile() {
	/* ... */
}
reconcile(); // initial paint
document.addEventListener("astro:after-swap", reconcile); // every soft-nav arrival
```

Do NOT rely on `astro:page-load` — it fires after Playwright's `goto` resolves, breaking deterministic test setup. `astro:after-swap` fires at the right moment and only on soft-navs (no double-bind on initial paint).
