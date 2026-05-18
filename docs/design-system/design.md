# Vector Design System

> Dark-first, editorial design system for `qdelettre.dev`. Inspired by Linear's product interface; adapted for a personal-site reading context.
>
> This document is the single source of truth for design tokens, typography, component styling, and agent-facing prompts. It is read by humans (in editor / on GitHub) and AI coding agents (loaded into prompt context).
>
> Rendered visual previews: see `preview.html` (light theme) and `preview-dark.html` (dark theme, matches shipped site) in this folder.

---

## 1. Visual Theme & Atmosphere

Vector is a dark-first, editorial, product-tool aesthetic — Linear is the influence, not the template. The system is built around a restrained palette: a single indigo accent, a four-step muted-gray hierarchy for foreground text, and green reserved exclusively for availability and status indication. Layering is done with near-black surfaces (`--bg-app` to `--bg-panel` to `--bg-surface`) and translucent white overlays (`--surface-02` through `--surface-08`) rather than colored fills.

Typography carries the identity. Inter Variable at the signature `510` weight (a half-step between 500 and 510 only reachable with the variable axis) anchors UI labels and display headlines; JetBrains Mono at 400/500 handles dates, eyebrow labels, keyboard chips, inline code, and timeline "when" markers. Both stacks enable `font-feature-settings: "cv01", "ss03"` globally, inheriting Linear's exact OpenType identity.

The reading pane is locked to 780px maximum width. Spacing follows an 8px base grid with optical half-steps (`--sp-1b`, `--sp-2b`, `--sp-3b`) for copy-tightening adjustments. Hierarchy is expressed through color and weight contrast — not large size ramps. Body copy lives at 12–16px.

Out of scope: illustrations, gradients, skeuomorphism, bright categorical colors as primary fills — small (≤ 6 px) tag swatches indicating tag identity are the documented exception (see §2 "Categorical / tag palette").

## 2. Color Palette & Roles

### Background surfaces

| Token            | Light              | Dark                     | Use                                                    |
| ---------------- | ------------------ | ------------------------ | ------------------------------------------------------ |
| `--bg-app`       | `#f7f8f8`          | `#08090a`                | Page background; `color-scheme: light dark` anchor     |
| `--bg-panel`     | `#ffffff`          | `#0f1011`                | Sidebars, footer rails, `<pre>` code blocks            |
| `--bg-surface`   | `#f3f4f5`          | `#191a1b`                | Cards, dropdowns, inline `<code>` in prose             |
| `--bg-surface-2` | `#e8eaec`          | `#28282c`                | Elevated raised state; Tailwind-mapped as `surface-2`  |
| `--surface-02`   | `rgba(0,0,0,0.02)` | `rgba(255,255,255,0.02)` | PostRow hover, NowCard/LinkCard bg, status-pill bg alt |
| `--surface-03`   | `rgba(0,0,0,0.03)` | `rgba(255,255,255,0.03)` | StatusPill bg, tooltip bg, kbd chip bg                 |
| `--surface-04`   | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.04)` | Card hover state, inline-code chip in NowCard          |
| `--surface-05`   | `rgba(0,0,0,0.05)` | `rgba(255,255,255,0.05)` | Active tag chip in Search filter row                   |
| `--surface-08`   | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.08)` | Reserved — heaviest overlay                            |

> _Note on naming: the shipped tokens `--bg-app`, `--bg-panel`, `--bg-surface`, `--bg-surface-2` correspond to canonical `colors_and_type.css` tokens `--bg-marketing`, `--bg-panel`, `--bg-surface`, `--bg-surface-2` respectively. `--bg-app` was renamed from `--bg-marketing` during handoff to better reflect its role for a personal-site context (no marketing page). Cross-referencing the canonical handoff file: search for `--bg-marketing` where this doc says `--bg-app`._

Stack surfaces from app outward (`--bg-app` darkest in dark mode, lightest in light mode). `--surface-02..08` translucents adapt to the active theme so an overlay always dims the underlying tone — black mix on light bg, white mix on dark bg.

### Foreground

| Token   | Light     | Dark      | Use                                                              |
| ------- | --------- | --------- | ---------------------------------------------------------------- |
| `--fg1` | `#0a0b0d` | `#f7f8f8` | Primary text, headlines, active nav                              |
| `--fg2` | `#2c3036` | `#d0d6e0` | Body copy (`.t-body`), lede (`.t-lede`), default nav links       |
| `--fg3` | `#5a6068` | `#8a8f98` | Eyebrows, secondary metadata, desc copy, muted labels            |
| `--fg4` | `#666b73` | `#757980` | Dates in mono, footer copyright, separator dots, tertiary chrome |

Use `--fg2` for body copy, `--fg3` for eyebrows and secondary metadata, `--fg4` for tertiary decorative tokens only.

> **Audit note:** `--fg4` was bumped from the handoff's original `#62666d` to the shipped `#757980` after a WCAG pass. `#62666d` on `--bg-app` measured 3.97:1 — under AA 4.5:1 for normal text. `#757980` lifts it to 4.54:1 and keeps the tonal relationship to `--fg3` intact. Document and use the shipped value everywhere.

> **Light-mode `--fg4` audit:** the original plan called for `#7e8590` (preserving tonal relationship with `--fg3`), but axe measured 3.49:1 on `#f7f8f8` — fails AA. Shipped value `#666b73` measures ≈ 4.85:1 — passes AA with margin and remains tonally distinct from `--fg3` (`#5a6068`).

### Lines & borders

| Token             | Light              | Dark                     | Use                                                   |
| ----------------- | ------------------ | ------------------------ | ----------------------------------------------------- |
| `--line`          | `rgba(0,0,0,0.10)` | `rgba(255,255,255,0.08)` | Card borders, input borders, NowCard/LinkCard outline |
| `--line-subtle`   | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.04)` | Post-row dividers, header/footer rules, kbd chip      |
| `--line-strong`   | `rgba(0,0,0,0.12)` | `rgba(255,255,255,0.12)` | Hover/active border on cards, kbd, filter-chip        |
| `--border-1`      | `#d0d6e0`          | `#23252a`                | Tag chip border, timeline rail, filter-chip border    |
| `--border-2`      | —                  | `#34343a`                | Reserved (not in shipped `global.css`)                |
| `--border-3`      | —                  | `#3e3e44`                | Reserved (not in shipped `global.css`)                |
| `--line-tint`     | —                  | `#141516`                | Reserved — tonal inner-rim on deep surfaces           |
| `--line-tertiary` | —                  | `#18191a`                | Reserved — deepest tint separator                     |

> _Note: shipped `--line-subtle` is `rgba(255, 255, 255, 0.04)`; canonical `colors_and_type.css` defines it as `rgba(255, 255, 255, 0.05)`. Shipped is slightly more subtle._

Use `--line-subtle` for horizontal rules, `--line` for 1px outlines, `--line-strong` for hover/active card and chip borders (one rung above `--line`), `--border-1` for solid chip borders that need to read against any surface.

### Accent & status

| Token               | Light     | Dark      | Use                                                         |
| ------------------- | --------- | --------- | ----------------------------------------------------------- |
| `--accent`          | `#5660c5` | `#7170ff` | Interactive accent, prose underlines, timeline ring         |
| `--accent-bg`       | `#5e6ad2` | `#5e6ad2` | Primary CTA bg, gradient bottom-stop, deeper accent surface |
| `--accent-hover`    | `#5660c5` | `#828fff` | Hover accent, gradient top-stop                             |
| `--accent-security` | `#7a7fad` | `#7a7fad` | Reserved — muted security indigo                            |
| `--green`           | `#1c8c3a` | `#27a644` | "Available" status dot, open-office-hours indicator         |
| `--emerald`         | `#0e9c70` | `#10b981` | Alt status — reserved                                       |
| `--red`             | `#d23a3f` | `#e5484d` | Reserved — error/destructive                                |
| `--amber`           | `#d97c2e` | `#f2994a` | Reserved — warn/pinned                                      |

**`--accent` darkens in light mode for AA text contrast.** Original plan kept `--accent` theme-invariant for brand consistency, but `#7170ff` measures 3.61:1 on `#f7f8f8` — fails AA. Shipped light value `#5660c5` measures ≈ 4.7:1 (same hue, lower lightness — brand identity preserved). `--accent-hover` matches `--accent` in light mode (no hue shift on hover); prose links carry a `border-bottom: 1px solid var(--accent)` affordance independent of color change.

**Status colors switch.** Dark-mode bright values fail WCAG AA on `#f7f8f8` (e.g., `#27a644` ≈ 3.0:1). Light-mode variants are darkened until each clears AA on the light bg.

Green is availability only. `--red` and `--amber` are pre-defined but unused in shipped pages — reach for them only when introducing a new semantic.

### Categorical / tag palette

A bounded categorical palette used only for **small (≤ 6 px) swatch dots** that indicate tag identity — currently `Tag.astro` post-meta swatches, `Search.astro` filter-chip swatches, and `index.astro` Stack chip dots. The palette is a separate semantic class from `--accent` / `--red` / `--amber` / `--emerald`, which stay reserved for interactive accent, status, and prose roles. Mirrored hex values (e.g. `--tag-red` matches `--red`) are intentional, not aliased, so design-system intent stays explicit.

| Token           | Light     | Dark      | Tag slug                |
| --------------- | --------- | --------- | ----------------------- |
| `--tag-blue`    | `#1f6feb` | `#5ab0ff` | `typescript`            |
| `--tag-iris`    | `#5660c5` | `#7170ff` | `php`, `test`           |
| `--tag-violet`  | `#6b4ff5` | `#9085ff` | `astro`                 |
| `--tag-red`     | `#d23a3f` | `#e5484d` | `angular`               |
| `--tag-amber`   | `#d97c2e` | `#f2994a` | `claude`                |
| `--tag-emerald` | `#0e9c70` | `#10b981` | `books`                 |
| `--tag-cyan`    | `#0891b2` | `#22d3ee` | `ci`                    |
| `--tag-slate`   | `#5a6068` | `#8a8f98` | `git`; default fallback |

Tag → token assignment lives in `siteConfig.tagColors` (`src/site.config.ts`). Unmapped tags resolve to `slate`. Color resolution goes through `src/utils/tag-color.ts`, which exposes a dual API:

- `tagColorVar(tag)` returns `var(--tag-X)` — used in Astro components, theme-aware via `light-dark()`.
- `tagColorHex(tag)` returns the dark-mode hex — used only by `src/pages/og-image/[...slug].png.ts` because the Satori render pipeline has no CSSOM. Dark hex matches the dark-only OG image policy (§8).

**Maintenance contract:** when adding or changing a `--tag-*` token in `global.css`, also update `COLOR_HEX_DARK` in `tag-color.ts`. A single comment in each file marks the link.

Do not use `--tag-*` tokens as primary fills (chip backgrounds, button surfaces, large blocks) — the palette is sized and tuned for 6 px dots only.

## 3. Typography Rules

### Font stacks

```css
--font-sans:
	"Inter", "Inter Variable", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen,
	Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
--font-mono: "Berkeley Mono", "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
```

Inter Variable at weight `510` is the signature — it only resolves on the variable axis. The shipped site loads Inter Variable via Astro v6's Fonts API (see `Base.astro`); Berkeley Mono is commercial and substituted for JetBrains Mono. Fallback: if the variable axis is not yet loaded, browsers will use `font-weight: 500` which is the closest integer step and visually acceptable for one paint.

### Type classes

| Class             | Size | Weight | Line | Tracking | Use                                  |
| ----------------- | ---- | ------ | ---- | -------- | ------------------------------------ |
| `.t-display-xl`   | 72px | 510    | 1.0  | -1.584px | Rare marketing hero                  |
| `.t-display-lg`   | 64px | 510    | 1.0  | -1.408px | Secondary marketing hero             |
| `.t-display`      | 48px | 510    | 1.02 | -1.056px | Home hero, About hero, blog index    |
| `h1`, `.t-h1`     | 32px | 400    | 1.13 | -0.704px | Post title (prose h1)                |
| `h2`, `.t-h2`     | 24px | 510    | 1.33 | -0.288px | Section heading, year group          |
| `h3`, `.t-h3`     | 20px | 590    | 1.33 | -0.24px  | Subsection heading in prose          |
| `.t-body-lg`      | 18px | 400    | 1.6  | -0.165px | Hero sub-paragraph                   |
| `p`, `.t-body`    | 16px | 400    | 1.5  | —        | Default body; prose overrides to 1.7 |
| `.t-body-med`     | 16px | 510    | 1.5  | —        | Medium-weight body                   |
| `.t-body-semi`    | 16px | 590    | 1.5  | —        | Semibold body                        |
| `.t-body-emph`    | 17px | 590    | 1.6  | —        | Emphasis body                        |
| `.t-sm`           | 15px | 400    | 1.6  | -0.165px | Dense small body                     |
| `.t-sm-med`       | 15px | 510    | 1.6  | -0.165px | PostRow title, Timeline role         |
| `.t-sm-semi`      | 15px | 590    | 1.6  | -0.165px | Semibold small                       |
| `.t-sm-light`     | 15px | 300    | 1.47 | -0.165px | Light small                          |
| `.t-caption-lg`   | 14px | 510    | 1.5  | -0.182px | Nav link, brand, LinkCard label      |
| `.t-caption`      | 13px | 400    | 1.5  | -0.13px  | Desc copy, caption, lede-adjacent    |
| `.t-label`        | 12px | 400    | 1.4  | —        | Label default                        |
| `.t-label-med`    | 12px | 510    | 1.4  | —        | Chip label, count, footer copy       |
| `.t-micro`        | 11px | 510    | 1.4  | —        | NowCard eyebrow, read-time, kbd chip |
| `.t-tiny`         | 10px | 510    | 1.5  | -0.15px  | Micro-label                          |
| `code`, `.t-mono` | 14px | 400    | 1.5  | —        | Inline code (mono)                   |
| `.t-mono-caption` | 13px | 400    | 1.5  | —        | Mono caption                         |
| `.t-mono-label`   | 12px | 400    | 1.4  | —        | Mono date, kbd, timeline "when"      |

Display classes carry `font-feature-settings: "cv01", "ss03"` explicitly; all other classes inherit from the root `html, body` declaration.

> **Shipped vs canonical:** Two rows above reflect shipped `global.css` values that diverge from the canonical `colors_and_type.css`:
>
> - `.t-display`: shipped `line-height: 1.02` (canonical: `1.0`)
> - `.t-h2`: shipped `font-weight: 510` (canonical: `400`)
>
> Where shipped and canonical disagree, shipped wins — this doc describes what's running on the site.

### Shipped additions

Classes present in `src/styles/global.css` but not in the canonical handoff. Values below are extracted directly from the shipped stylesheet.

| Class                | Size | Weight | Line | Tracking | Use                                                                                             |
| -------------------- | ---- | ------ | ---- | -------- | ----------------------------------------------------------------------------------------------- |
| `.t-eyebrow`         | 13px | 510    | —    | 0.8px    | Uppercase section eyebrows above block heads; color `--fg3`.                                    |
| `.t-eyebrow--accent` | 13px | 510    | —    | 0.8px    | Same metrics as `.t-eyebrow`, color overridden to `--accent` (About page, tag pages).           |
| `.t-lede`            | 17px | 400    | 1.6  | -0.165px | Post-head subtitle lines; color `--fg2`.                                                        |
| `.t-body`            | 16px | 400    | 1.7  | -0.13px  | Shipped override: `line-height: 1.7` for prose reading comfort (canonical: 1.5). Color `--fg2`. |
| `.t-label-sm`        | 11px | 510    | —    | 0.5px    | Uppercase micro-label; color `--fg3`.                                                           |
| `.t-mono-date`       | 12px | 510    | —    | —        | Mono date marker; uses `--font-mono`, color `--fg4`.                                            |

`.t-eyebrow` and `.t-eyebrow--accent` also set `text-transform: uppercase`. `.t-label-sm` does the same. `.t-mono-date` uses `var(--font-mono)` rather than the default sans stack.

### OpenType features

The root selector sets `font-feature-settings: "cv01", "ss03"` on `html, body`. `cv01` opens the `a` aperture for a more geometric lowercase, and `ss03` swaps the 6/9 glyphs for the alternate single-story forms. Together they produce Linear's exact typographic signature; they inherit everywhere except when overridden (none of the shipped components override it).

## 3a. Fluid Tokens

All font-size and macro-spacing values derive from `@theme`-registered fluid tokens anchored between **320 px** (minimum viewport) and **1280 px** (maximum viewport). Between anchors, values scale linearly via `clamp()`. Below 320 px they clamp to the minimum; above 1280 px they clamp to the maximum.

### Type scale

| Token         | Min (320 vw)  | Max (1280 vw) | Typical use                                               |
| ------------- | ------------- | ------------- | --------------------------------------------------------- |
| `--text-2xs`  | 12 px (fixed) | 12 px (fixed) | Tabular micro-labels (reading-time, post-meta timestamps) |
| `--text-xs`   | 12 px         | 14 px         | Eyebrows, dense meta                                      |
| `--text-sm`   | 13 px         | 16 px         | Nav links, brand wordmark, body labels                    |
| `--text-base` | 15 px         | 18 px         | Prose body, PostRow title                                 |
| `--text-lg`   | 16 px         | 22 px         | About lede, hero sub                                      |
| `--text-xl`   | 18 px         | 26 px         | Year headings, secondary titles                           |
| `--text-2xl`  | 22 px         | 32 px         | Section h2                                                |
| `--text-3xl`  | 28 px         | 42 px         | Large section titles (reserved; currently unused)         |
| `--text-4xl`  | 32 px         | 48 px         | Page-head h1 on every top-level route                     |

### Space scale

| Token         | Min          | Max          | Typical use                           |
| ------------- | ------------ | ------------ | ------------------------------------- |
| `--space-2xs` | 4 px (fixed) | 4 px (fixed) | Micro-gaps inside dense inline groups |
| `--space-xs`  | 6 px         | 8 px         | Tight gaps                            |
| `--space-sm`  | 8 px         | 12 px        | Header row-gap; small gaps            |
| `--space-md`  | 12 px        | 20 px        | Default component gap; header gap     |
| `--space-lg`  | 16 px        | 32 px        | Page padding; section gaps            |
| `--space-xl`  | 24 px        | 48 px        | Header bottom padding; large gaps     |
| `--space-2xl` | 32 px        | 72 px        | Page bottom padding; dramatic gaps    |

### Regenerating the scales

```ts
// Formula used for every token above.
function fluidClamp(minPx: number, maxPx: number, minVw = 320, maxVw = 1280) {
	const slope = (100 * (maxPx - minPx)) / (maxVw - minVw); // vw coefficient
	const intercept = (minPx - (slope * minVw) / 100) / 16; // rem intercept
	return `clamp(${minPx / 16}rem, ${intercept.toFixed(4)}rem + ${slope.toFixed(4)}vw, ${maxPx / 16}rem)`;
}
```

Tokens live in `src/styles/global.css`'s `@theme { … }` block. Changing a token affects every consumer site-wide — verify with `npx playwright test responsive.spec.ts` after edits.

## 4. Component Stylings

### Header

File: `src/components/Header.astro`

No `Props` interface — reads from `siteConfig` (`@/site.config`) and `OFFICE_HOURS_LABEL` (`@/utils/office-hours`).

Structural CSS — flex row with 24px gap, 20px top / 48px bottom padding, 1px `--line-subtle` bottom rule, 48px bottom margin:

```css
header.site {
	display: flex;
	align-items: center;
	gap: 24px;
	padding: 20px 0 48px;
	border-bottom: 1px solid var(--line-subtle);
	margin-bottom: 48px;
}
```

Brand is a 22×22 dark circle tile with `qd` monospace initials (SVG text, no external image). Adjacent `status-dot-link` is a 10px absolute-positioned dot on the brand wrap (7px inner dot + 2px `--bg-app` ring), colored `--green` when office hours are open, `--fg4` when closed. Nav is flex with 20px gap, 13px/510 `--fg2`, active and hover go to `--fg1` over 120ms ease-out.

States — default, hover (nav color → `--fg1`), active (same), tooltip-visible (on status dot via `[data-tooltip]` rule).

Usage — render once per page at the top of `Base.astro`'s `<main>`. The status dot re-reconciles on every `astro:after-swap`, so soft-navs that cross a schedule boundary flip the dot correctly.

### Footer

File: `src/components/Footer.astro`

```ts
interface Props {
	searchHint?: boolean;
}
```

Structural CSS — 80px top margin, 28px top padding, 1px `--line-subtle` top rule, space-between flex, 12px/510 `--fg4`. Anchor links are `--fg3` default, `--fg1` on hover (120ms). When `searchHint` is true, appends a `⌘K to search` hint link with a mono `.kbd` chip (`--surface-03` bg + `--line-subtle` border + 3px radius). A document-level keydown handler listens for Cmd/Ctrl+K, navigates to `/posts/` via `astro:transitions/client`, and focuses `#site-search` — but only if no search input already exists on the page.

States — default, hover (link color → `--fg1`, kbd border brightens to `rgba(255,255,255,0.12)`).

Usage — render once per page at the bottom of `Base.astro`'s `<main>`. Pass `searchHint={true}` on non-search pages (home, about, post detail) to expose the global keyboard shortcut; omit it on `/posts/` where `Search.astro` owns the input.

### PostRow

File: `src/components/PostRow.astro`

```ts
interface Props {
	post: Post;
	variant?: "home" | "index";
}
```

Structural CSS — styling lives in `global.css` under `.post-row` so that dynamically injected Pagefind result rows inherit the same layout. The component itself renders an `<a>` with class `post-row <variant>` and `data-testid="post-row"`. `home` variant uses `grid-template-columns: 90px 1fr auto` (date / main / tag). `index` variant uses `96px 1fr auto auto` — adding a read-time column on the right. Date format differs: `getMonoDate` on home (mono-formatted short date), `getShortDate` on index. View transitions morph the date, title, and first tag to the detail page via `transition:name={\`post-<field>-\${post.id}\`}`.

```css
.post-row {
	display: grid;
	gap: 20px;
	padding: 14px 2px;
	border-bottom: 1px solid var(--line-subtle);
	align-items: center;
	transition: background 120ms;
}
.post-row:hover {
	background: var(--surface-02);
}
.post-row:last-child {
	border-bottom: none;
}
```

States — default, hover (bg → `--surface-02`), last-child (no border).

Usage — the home and blog-index lists. Choose `variant="index"` whenever the read-time column is meaningful (long-form lists); `variant="home"` for the latest-posts block on `/`.

### StatusPill

File: `src/components/StatusPill.astro`

```ts
interface Props {
	label: string;
}
```

Structural CSS — inline-flex anchor wrapping a 6px colored dot and a label. 12px/510, `--fg2` text, `--surface-03` bg, 1px `--line` border, `--radius-pill` rounded-full, padding `3px 12px 3px 8px`. On hover the bg lifts to `--surface-04` (120ms). The pill is a `<a>` element with `href="mailto:quentin.delettre@pm.me"`; clicking opens the reader's mail client. Availability state is carried by the dot (`.open` / `.closed`), driven by `src/utils/office-hours.ts` and reconciled on `astro:after-swap`. The dot is colored `--green` when the shared `.status-dot-halo.open` class is set (by `Header.astro`'s reconciler running on the same page) and `--fg4` when `.closed`. Exposes the shared `data-tooltip` attribute populated with `OFFICE_HOURS_LABEL` — renders a CSS-only popover (rule in `global.css`).

States — default, hover (bg → `--surface-04`), tooltip-visible (via `[data-tooltip]` hover/focus), dot open/closed.

Usage — home hero only ("Available for interesting conversations"). Do not reuse for generic badges — use `Tag.astro` for categorical chips.

### NowCard

File: `src/components/NowCard.astro`

```ts
interface Props {
	label: string;
	dotColor?: string;
	headline: string;
}
```

Structural CSS — a 2×2 grid cell. `--surface-02` bg, 1px `--line` border, `--radius-card` (8px) rounded, `16px 18px` padding. Label row is 11px/510 uppercase `--fg3` with 0.5px tracking and a 6px dot (defaults to `--accent`, override via `dotColor` prop with any valid CSS color). Headline is 14px/510 `--fg1` with -0.15px tracking. Sub slot is 13px/400 `--fg3` at 1.5 line-height. Inline `<code>` inside the sub slot picks up `--surface-04` bg, `--line-subtle` border, 3px radius.

```css
.now-card {
	background: var(--surface-02);
	border: 1px solid var(--line);
	border-radius: var(--radius-card);
	padding: 16px 18px;
}
.now-card:hover {
	background: var(--surface-04);
	border-color: rgba(255, 255, 255, 0.12);
}
```

States — default, hover (bg → `--surface-04`, border → `rgba(255,255,255,0.12)`).

Usage — home page "Now" block, 2×2 grid with 12px gap. Pass per-card `dotColor` when the card represents a distinct category (green = active, `--amber` = reading, `--accent` = default project).

### LinkCard

File: `src/components/LinkCard.astro`

```ts
interface Props {
	href: string;
	label: string;
	handle: string;
	external?: boolean;
}
```

Structural CSS — flex row with 12px gap: 28×28 icon tile (slot `name="icon"`, `--surface-04` bg, 1px `--line`, `--radius-md`), main column (`label` 13px/510 `--fg1` + `handle` 12px mono `--fg3`), arrow glyph in `--fg4`. Card itself: `--surface-02` bg, 1px `--line`, `--radius-card`, `12px 14px` padding. When `external` is true the anchor gets `target="_blank"` and `rel="noopener noreferrer"` via prop spread.

States — default, hover (bg → `--surface-04`, border → `rgba(255,255,255,0.12)`).

Usage — About page "Elsewhere" 2×2 grid. Always set `external={true}` for off-site profiles so the rel attribute is applied; omit for internal links.

### Tag

File: `src/components/Tag.astro`

```ts
export interface Props {
	name: string;
	as?: "a" | "span";
	count?: number;
}
```

Structural CSS — inline-flex pill with 6px gap: colored 6px `swatch` (hex from `tagColorHex(name)`), the tag name, and an optional `count` span in `--fg4`. Transparent bg, 1px `--border-1` border, `--radius-pill` rounded-full, padding `1px 10px 1px 8px`, 11px/510 `--fg2`. When rendered `as="a"` it navigates to `/tags/<name>/` and hovers to `--surface-03` bg / `--fg1` color; when `as="span"` it is purely visual (used inside `PostRow` with a View Transition name applied to avoid nested anchors).

States — default, hover (only when `as="a"`).

Usage — render `as="a"` standalone in the Tags index, `as="span"` inside `PostRow` to preserve the "no nested `<a>` inside `<a>`" rule.

### Timeline

File: `src/components/Timeline.astro`

```ts
interface TimelineItem {
	when: string;
	role: string;
	where: string;
	past?: boolean;
}
interface Props {
	items: TimelineItem[];
}
```

Structural CSS — relative container with 20px left padding. A 1px `--border-1` vertical rail runs top-to-bottom (6px inset from top/bottom). Each `.t-item` is a 2-column grid (`110px 1fr`, 20px gap) with 8px top / 20px bottom padding. A 9px ring marker sits on the rail via `::before` — `--bg-app` fill, 1.5px `--accent` border by default; `past` items swap the border to `--fg4`. Type: `when` in 12px/510 mono `--fg4`; `role` in 15px/510 `--fg1` with -0.165px tracking; `where` in 13px/400 `--fg3`.

States — default, past (border color on marker only).

Usage — About page career timeline. Order items newest-first; mark everything except the current role with `past: true`.

### Search

File: `src/components/Search.astro`

No `Props` interface — loads posts + tags at build time via `getAllPosts()` and `getUniqueTags()`.

Structural CSS — three blocks:

1. `.toolbar`: flex row between two 1px `--line-subtle` rules. Left is a 36px-tall search label (`--surface-02` bg, `--line` border, `--radius-md`) containing an inline SVG magnifier, an `<input type="search" id="site-search">` (transparent, 13px, `--fg1` text, `--fg3` placeholder), and a `.kbd-mini` chip on the right. Right side shows `{count} posts` in 12px/510 `--fg3`.
2. `.filters`: horizontal tag chip row (8px gap, wrap). Each `.filter-tag` is a pill with `--border-1` border; `.active` sets bg to `--surface-05`, color to `--fg1`, border to `rgba(255,255,255,0.12)`. "All" clears; other chips hide rows whose `data-tags` don't include the clicked tag.
3. `.search-results`: hidden by default; populated with Pagefind results (each result rendered as a `.post-row index` anchor). When the input is cleared, results are hidden and year groups re-shown. Uses `[data-search-results]` / `[data-year-group]` / `[data-filters]` hooks plus a document-level Cmd/Ctrl+K handler that focuses and selects the input.

States — default, input focused, results visible (year groups hidden), filter active (one chip), Escape (clears input, restores year groups).

Usage — render once in `src/pages/posts/[...page].astro` above the grouped post list. Pairs with the home-page `Footer searchHint` shortcut — users hit ⌘K anywhere on the site to land here with focus inside the input.

Note: `Search.astro`'s injected search-result HTML also emits `data-testid="post-row"` on each `<a class="post-row index">` (see the `innerHTML` template), so Playwright selectors targeting `[data-testid="post-row"]` match both SSR'd list rows and dynamically injected search matches.

### About — `.about-head`

Grid with `grid-template-areas: "eyebrow eyebrow" / "hero title" / "lede lede"` at every viewport. Columns `auto minmax(0, 1fr)`. The inner wrapper `<div>` around eyebrow/h1/lede uses `display: contents` so its children participate directly in the parent grid (scoped selector: `.about-head > div:not(.hero-identity)`). The h1 carries `line-height: 1` + `margin: 0` so `align-items: center` aligns the h1's glyph cap-height midline to the hero's geometric center (not the h1's box center). `text-wrap: balance` on the h1 gives clean wrap breaks when the string doesn't fit on one line. `.hero-identity` uses `width: clamp(72px, 18vw, 110px)` and `aspect-ratio: 1`.

No `@media` rule is needed — the h1 wraps naturally when the column is too narrow and stays on one line when it fits (emerges from grid + content interaction).

## 5. Layout Principles

The canonical page shell lives in `Base.astro`'s `.page` selector: `max-width: 780px`, centered, `padding: 40px 32px 120px`. That 120px bottom lets the footer breathe and gives the Trajectory timeline space to terminate cleanly on About.

Spacing follows an 8px base grid with three optical half-steps — `--sp-1b` (7px), `--sp-2b` (11px), `--sp-3b` (19px) — introduced where strict 8px increments read too loose (between an 11px eyebrow and the mono date underneath, for example). Hierarchy is expressed through color (`--fg1` → `--fg2` → `--fg3` → `--fg4`) and weight (510 vs 400), not through size ramps; body copy sits inside 12–16px for nearly every component.

| Token     | Value | Use                              |
| --------- | ----- | -------------------------------- |
| `--sp-0`  | 1px   | Hairline offset                  |
| `--sp-1`  | 4px   | Radius, inline pad               |
| `--sp-1b` | 7px   | Optical inline-pad half-step     |
| `--sp-2`  | 8px   | Base grid unit                   |
| `--sp-2b` | 11px  | Optical label-to-mono spacing    |
| `--sp-3`  | 12px  | Card padding, filter gap         |
| `--sp-3b` | 19px  | Optical section gap              |
| `--sp-4`  | 16px  | Card inner pad, body gap         |
| `--sp-5`  | 20px  | Nav gap, timeline padding        |
| `--sp-6`  | 24px  | Header row gap, h2 baseline      |
| `--sp-7`  | 28px  | Footer top pad                   |
| `--sp-8`  | 32px  | Page horizontal pad, section gap |
| `--sp-9`  | 35px  | Vertical rhythm break            |

### Safe-area handling

Page-level surfaces must clear iOS notch, dynamic island, and home indicator. Idiom used in `src/layouts/Base.astro`:

```css
padding-top: max(var(--space-lg), env(safe-area-inset-top));
padding-inline: max(var(--space-lg), env(safe-area-inset-left), env(safe-area-inset-right));
padding-bottom: max(var(--space-xl), env(safe-area-inset-bottom));
```

`max()` falls back to design tokens on desktop (insets evaluate to `0`). On notched iOS the larger inset wins.

Absolute / fixed elements (e.g. `.skip-link`) bypass page padding — apply `calc(env(safe-area-inset-*, 0px) + Npx)` directly. The `0px` fallback inside `env()` is required: `calc(unsupported + 8px)` collapses the whole declaration to invalid.

Viewport meta must carry `viewport-fit=cover` (`src/components/BaseHead.astro`) — without it, all insets return `0` on iOS regardless of device.

Installable as iOS PWA via `display: standalone` (manifest) + `apple-mobile-web-app-status-bar-style="black-translucent"`. Status bar overlays content; safe-area handling above keeps content clear.

Known limits:

- `safe-area-max-inset-*` is Chromium-only. Not used today (no sticky bottom UI). If introducing fixed CTAs, prefer regular `-inset-*` with `calc()`.
- Manifest `theme_color` / `background_color` cannot be media-conditional. iOS PWA splash locked to dark `#08090a`.
- Chrome DevTools responsive view returns `0` for all insets. Test on real iOS device or Safari's iOS Simulator.

## 6. Depth & Elevation

| Token               | Value                                                                                                                                   | Use                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `--shadow-micro`    | `0 1.2px 0 0 rgba(0,0,0,0.03)`                                                                                                          | Borderless cards, hairline lift  |
| `--shadow-ring`     | `0 0 0 1px rgba(0,0,0,0.2)`                                                                                                             | Input ring, tile outline         |
| `--shadow-elevated` | `0 2px 4px rgba(0,0,0,0.4)`                                                                                                             | Avatar tile, OG image            |
| `--shadow-focus`    | `0 4px 12px rgba(0,0,0,0.1)`                                                                                                            | Modal promotion, focused surface |
| `--shadow-inset`    | `inset 0 0 12px 0 rgba(0,0,0,0.2)`                                                                                                      | Recessed well                    |
| `--shadow-dialog`   | `0 8px 2px rgba(0,0,0,0), 0 5px 2px rgba(0,0,0,0.01), 0 3px 2px rgba(0,0,0,0.04), 0 1px 1px rgba(0,0,0,0.07), 0 0 1px rgba(0,0,0,0.08)` | Future popovers, soft ladder     |

Surface stacking is additive and goes `--bg-app` → `--bg-panel` → `--bg-surface` as solid tiers, then shifts to translucent `--surface-02..08` for hover/pressed states so the parent tone tints through. A card on `--bg-app` with `--surface-02` hover reads as +2% white lift; the same card on `--bg-panel` reads +2% relative to the panel — one token, two elevations, no second declaration.

## 7. Do's and Don'ts

### Do

- Use `var(--fg3)` (dark: `#8a8f98`, light: `#5a6068`) for muted text that must pass WCAG AA — both values clear 4.5:1 on the matching `--bg-app`.
- Use `data-tooltip="..."` on interactive elements for the shared CSS-only tooltip (rule lives in `global.css` under `[data-tooltip]`).
- Apply `transition:name={\`post-<field>-\${post.id}\`}` on list→detail morph pairs (date, title, tag on PostRow).
- Gate external `<a target="_blank">` with `rel="noopener noreferrer"` — `LinkCard.astro` shows the pattern via prop spread.
- Respect 510 font-weight — load-bearing for Vector identity; fall back to 500 only when Inter Variable is not present.
- Use `satisfies GetStaticPaths` (not a type annotation) to preserve narrow inference in `[...slug].astro` routes.

### Don't

- Don't use `--accent` (dark: `#7170ff`, light: `#5660c5`) as a sole identity color — it's borrowed from Linear; pair it with tokens from `--fg*` or `--surface-*`.
- Don't use `--fg4` (dark: `#757980`, light: `#666b73`) for body text — it's reserved for decorative dots, tiny labels, separators, and footer copyright. Body copy is `--fg2`.
- Don't nest `<a>` inside `<a>` — use sibling anchors inside a `position: relative` wrapper (see `Header.astro`'s `.brand-wrap` holding `.brand` and `.status-dot-link` as siblings).
- Don't rely on `navigator.platform` — deprecated; use `navigator.userAgent` for platform detection (see `Footer.astro`'s Mac/non-Mac kbd rewrite).
- Don't echo Linear's gradient rounded-square brand template — Vector uses a circle-tile "qd" monogram as the brand-mark (see §10 Brand).
- **Don't ship stub/noop modules when a real integration is possible.** Example: the Pagefind dev-serve plugin in `astro.config.ts` proxies `/pagefind/*` requests to `dist/pagefind/` at dev time instead of serving a no-op stub, so dev mode runs the real search index (requires `npm run build` once).

## 8. Responsive Behavior

**Philosophy.** Fluid-first, minimal breakpoints. Typography and spacing scale continuously via `clamp()` tokens (`--text-*`, `--space-*`) registered in `@theme`, anchored between 320 px and 1280 px viewports. Prefer intrinsic responsive adaptation (fluid tokens, `flex-wrap`, `clamp()`, `minmax(0, 1fr)`, `grid-template-areas`). Where a layout's shape genuinely must switch between device classes — most commonly a horizontal multi-column row that becomes a stacked vertical block on narrow viewports — a single targeted `max-width: 640px` media query may be used, scoped narrowly to that concern.

**Concrete commitments:**

- At most one layout-level breakpoint (`max-width: 640px`), used only when intrinsic CSS cannot produce the correct shape at a given viewport range.
- Single-column content at all viewports.
- Reading pane: `max-width: 780px`, centered.
- `.page` uses `min-height: 100dvh` (not `100vh`) to avoid mobile URL-bar jump.
- Page horizontal padding: `max(var(--space-lg), env(safe-area-inset-*))` — honors notch insets.
- Header row wraps via explicit `flex-wrap: wrap` + `row-gap: var(--space-sm)`.
- Nav links: ≥ 44 × 44 px hit area, padded on the element (not the container).
- PostRows: ≥ 44 px tall (14 px v-pad + content).
- All heading `font-size` references `--text-*` tokens; no fixed-px font sizes above `--text-xs` ship in production CSS (OG image canvas is exempt — it renders to a fixed 1200×630 PNG).
- Tabular numerals (reading-time, post-meta time) use the non-fluid `--text-2xs` token to preserve column alignment.
- Headings carry `text-wrap: balance`; prose bodies carry `text-wrap: pretty`; `<body>` has `hyphens: auto`.
- Theme: dark + light supported; `color-scheme: light dark` on `:root`; `light-dark()` token resolution. Manual override via `<ThemeToggle>` in the header writing `<html data-theme>`. `prefers-reduced-motion: reduce` handled by Astro's default View Transitions behavior. See "Theme system" subsection below.

### Theme system

**Trigger.** First paint follows `prefers-color-scheme` because `:root` declares `color-scheme: light dark`. Visitors override via `<ThemeToggle>` in the header.

**Mechanism.** Every shipped token is declared once with `light-dark(L, D)`. Two attribute-selector rules — `html[data-theme="light"] { color-scheme: light }` and `html[data-theme="dark"] { color-scheme: dark }` — flip the active branch. Absent attribute → OS preference applies.

**Persistence.** `localStorage["theme"]` ∈ `{"light", "dark", null}`. `null` (system mode) means the key is removed.

**FOUC mitigation.** An inline `<script is:inline>` in `BaseHead.astro` runs synchronously before stylesheets paint, applying any stored override to `<html data-theme>` so the first painted frame is correct.

**Toggle behavior.** Three-state cycle: `light → dark → system → light`. The toggle button shows one of three icons (sun / moon / monitor) based on `data-theme-state`, transitioned via opacity. The button carries `data-tooltip` (one of `Light` / `Dark` / `System`) wired into the shared `[data-tooltip]::before` rule, so hover and `:focus-visible` reveal the current state. The tooltip is right-anchored on this button (`right: 0; transform: none;`) because the toggle sits at the header's edge and the default center-anchored popover would push past the viewport on narrow screens. The longer `aria-label` (`Theme: {State} — click for {Next}`) is kept for screen readers — visible tooltip and SR announcement intentionally differ in verbosity. Multi-tab sync via `window.addEventListener("storage", …)`. The button's `<meta name="theme-color">` content also updates via `matchMedia("(prefers-color-scheme: dark)").addEventListener("change", …)` when the OS preference flips while in system mode.

**Theme-color meta.** Two `<meta name="theme-color">` tags with `media="(prefers-color-scheme: light|dark)"` follow the OS preference. The toggle's JS overwrites both `content` attributes when a manual override applies, keeping browser chrome (mobile address bar, PWA title bar) in sync.

**OG images stay dark-only.** The `src/pages/og-image/[...slug].png.ts` Satori canvas renders to a fixed PNG and embeds in third-party platforms regardless of host theme. Documented as a known design choice.

**Brand-mark SVG.** The `qd` mark in the header and About hero is a self-contained visual unit — it stays dark across both themes, like a logo. Inline `fill="#18191d"` and `stroke="rgba(255,255,255,0.08)"` are intentional.

**Out of scope.** `prefers-contrast: more`, custom view-transition crossfade between themes, per-component theme overrides, print stylesheet.

## 9. Agent Prompt Guide

### Prompt 1 — New component

```markdown
Using the Vector DS tokens in `docs/design-system/design.md`, create `src/components/Callout.astro`. Accept `variant: 'info' | 'warning'` and a default slot. Info uses `--surface-02` bg + `--line` border; warning uses `--surface-02` bg + `var(--amber)` 1px accent on the left. Body text in `--fg2`, 13px, 1.5 line-height. 12/14 padding. No new dependencies.
```

### Prompt 2 — Tweak existing

```markdown
In `src/components/PostRow.astro`, add a `pinned: boolean` prop. When true, prepend a 10px `--amber` dot before the date column. Preserve `data-testid="post-row"`. Update the Component Stylings → PostRow block in `docs/design-system/design.md` to mention the new state. Re-run `npx playwright test` and `npx astro check`.
```

### Prompt 3 — New page

```markdown
Create `src/pages/now.astro` using `Base.astro`. Follow the home page's `.block` + `.block-head` pattern. Render a NowCard grid from a new `siteConfig.now` field — add that field to `src/types.ts` and `src/site.config.ts` first. Gate external links with `rel="noopener noreferrer"`.
```

## 10. Brand

The brand-mark is a single shape used at two scales. In the site header it renders at **22 × 22 px** as a compact identifier. On the About page it renders at **110 × 110 px** as the page's hero emblem — same dark-circle silhouette and mono `qd` text, but with a 1 px `--accent` stroke and a faint outer glow (`box-shadow: 0 0 24px -6px color-mix(in oklab, var(--accent) 40%, transparent)`) to anchor it at the larger scale.

Navigating to `/about` triggers a view-transition morph: the 22 px header mark grows in place into the 110 px hero, and its accent ring and glow fade in as it expands. The reverse animation plays on navigation away. The purple-gradient avatar previously used on the About page has been retired.

### SVG construction

Both scales share the same SVG path — a `<circle>` at `cx="16" cy="16" r="15.5"` inside a `viewBox="0 0 32 32"` — and the same `qd` text node. The differences are:

| Attribute          | Header 22 px                      | About hero 110 px                                               |
| ------------------ | --------------------------------- | --------------------------------------------------------------- |
| `width` / `height` | `22`                              | `110`                                                           |
| Circle `fill`      | `#18191d`                         | `#18191d`                                                       |
| Circle `stroke`    | `rgba(255,255,255,0.08)` hairline | `var(--accent)`                                                 |
| `vector-effect`    | —                                 | `non-scaling-stroke` (keeps stroke at 1 px regardless of scale) |
| Outer glow         | —                                 | `box-shadow` on wrapper `<span>`                                |

The `vector-effect="non-scaling-stroke"` attribute is required on the hero circle so the 1 px accent stroke does not scale up to ~5 px when the SVG is rendered at 110 px.

The header's office-hours status-dot participates in the same morph: on `/about` it rides the mark to the hero's bottom-right shoulder (22 × 22 link / 16 × 16 dot), paired via `transition:name="brand-status-dot"`. The wordmark "Quentin Delettre" is hidden on `/about` with a route-scoped `visibility: hidden` — no `transition:name`, so it fades out as part of the default root crossfade rather than flying across the screen. The hero is the complete identity anchor on that route; the header degrades to navigation.
