# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal site (`qdelettre.github.io`) — Astro v6, TypeScript `strictest`, Tailwind v4 (`@theme` tokens), Pagefind search, Satori OG images, `<ClientRouter />` view transitions. Deployed to GitHub Pages.

## Commands

```bash
npm run dev            # local dev server (Pagefind index served via dev middleware)
npm run build          # astro check && astro build && pagefind --site dist
npm run preview        # preview the built site
npm run check          # astro check (TS + content collections + Astro diagnostics)
npm run lint:check     # eslint . --no-fix
npm run format:check   # prettier --check .
npm run format         # prettier -w --cache .
npm run test           # full Playwright e2e suite
```

Single-test runs:

```bash
npx playwright test responsive.spec.ts --reporter=list
npx playwright test responsive.spec.ts -g "describe block name" --reporter=list
```

## Where to read next

Progressive disclosure — load the file relevant to the task at hand.

- **Design system & tokens** — `docs/design-system/design.md` (canonical), with visual previews at `docs/design-system/preview.html` and `preview-dark.html`.
- **Workflow conventions** (commits, plan locations, Tailwind-first, subagent-driven flow, skills install) — `docs/agents/workflow.md`.
- **View transitions** (`<ClientRouter />` patterns, `transition:name` pairing, route-scoped overrides) — `docs/agents/view-transitions.md`.
- **OG images** (Satori + satori-html quirks; conditional content; multi-child flex requirements) — `docs/agents/og-images.md`.
- **Pagefind dev mode** (Vite middleware proxy, `@vite-ignore` dynamic import) — `docs/agents/pagefind-dev.md`.
- **Test and lint gotchas** (Prettier tabs, `no-conditional-in-test`, `prefer-web-first-assertions`, no `as`, no `!`) — `docs/agents/test-and-lint.md`.
- **RTK (token-compression CLI proxy)** — install, hook setup, telemetry opt-out, `rtk proxy` escape hatch — `docs/agents/rtk.md`.
