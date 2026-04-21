# OG images — Satori + satori-html

OG images are generated server-side at build time by `src/pages/og-image/[...slug].png.ts` using `satori` + `satori-html` + `@resvg/resvg-js`. Each post gets a `/og-image/<slug>.png` URL referenced from `<meta property="og:image">`.

## Quirks (learned the hard way — preserve the patterns)

### `satori-html` does not compose nested `html\`\`` results

Interpolating one `html\`...\``tagged template's output into another via`${nested}`produces literal`[object Object]` text in the rendered PNG.

**Pattern:** for conditional content, write **two complete `html\`\`` templates** (one with the optional element, one without) and branch with `if (...)`. Verbose but reliable.

### Multi-child elements must declare `display: flex` explicitly

Satori enforces a strict rule: any element with more than one child node must declare `display: flex`, `display: contents`, or `display: none`. The `tw="flex"` shorthand is unreliable for this check — apply `style="display:flex;..."` explicitly.

Whitespace text nodes between elements count as children. If you write:

```html
<div>
	<span>...</span>
	<span>...</span>
</div>
```

the parser sees `[whitespace, span, whitespace, span, whitespace]` = 5 children. Fix: add `display:flex` to the parent (or compress whitespace).

### Use `<span>` not `<div>` for inline flex children

Mixing inline content (text) with block children (`<div>`) inside a flex container triggers Satori's child-count rejection in subtle ways. For pill-style components (e.g., a tag chip with a colored swatch + label), use `<span>` for both children of the chip outer.

### Image sizing

Output canvas is `1200 × 630`. Hex values in the OG template are deliberately theme-invariant — third-party platforms (Twitter, Slack, LinkedIn) embed the PNG as-is regardless of host page theme.

## Verification

After `npm run build`, OG images land in `dist/og-image/<slug>.png`. Inspect directly via `open dist/og-image/<slug>.png`. The post page references them in `<meta property="og:image">` — verify with `curl -s http://localhost:4321/posts/<slug>/ | rg "og:image"` after `npm run preview`.

For real-world preview against social platforms, deploy then feed the URL to [opengraph.xyz](https://www.opengraph.xyz).
