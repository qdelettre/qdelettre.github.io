# Workflow conventions

## Specs and plans

Write design specs and implementation plans to `docs/plans/`. Filename pattern:

- `YYYY-MM-DD-<topic>-design.md` — design spec from brainstorming
- `YYYY-MM-DD-<topic>-plan.md` — task-by-task implementation plan

Do NOT write to `docs/superpowers/specs/` or `docs/superpowers/plans/` even though those are the skill defaults. The user's preference overrides skill defaults.

## Decisive resolution of open questions

When the user asks for "best in class" / "best practices" / "best UX", the spec should commit to a specific choice rather than listing A/B/C tradeoffs in an Open Questions section. Document the rationale inline. The user redirects when needed.

This applies during brainstorming AND while writing specs — closing decisions early shortens the iteration loop.

## Tailwind v4 first

The site uses Tailwind v4 with tokens registered in `@theme` (in `src/styles/global.css`). Before proposing hand-rolled CSS, check whether Tailwind ships the capability:

- Modern viewport units → `h-dvh`, `min-h-dvh`, `h-svh` utilities.
- Text wrap → `text-balance`, `text-pretty` utilities.
- Typography variants → `text-xs/sm/base/lg/xl/2xl/3xl/4xl` utilities (drive token values directly when registered in `@theme`).
- Hyphens → `hyphens-auto`.

For the predominant scoped-style pattern this site uses, the practical implication is: tokens go in `@theme`, and reference them as `var(--*)` from scoped Astro `<style>` blocks. Tokens defined in `@theme` are simultaneously available as Tailwind utilities AND as CSS custom properties.

## Subagent-driven development

Multi-task plans use the `superpowers:subagent-driven-development` skill: dispatch a fresh implementer subagent per task, then a spec-compliance reviewer, then a code-quality reviewer. The implementer never sees the full plan — the controller (you) extracts each task and dispatches with curated context.

The user's flow: brainstorm → write design spec → write implementation plan → execute (subagent-driven). Skills `superpowers:brainstorming`, `superpowers:writing-plans`, and `superpowers:subagent-driven-development` automate the sequence.

Don't proactively read linked skill prompt template files (`implementer-prompt.md` etc.) when running subagent-driven-development — the user prefers concise execution and trusts the dispatch prompts to be self-contained.

## Skills CLI

Skills are managed with the `vercel-labs/skills` CLI. The repo commits the manifest, not the skill content.

- **`skills-lock.json`** at the project root is the manifest — committed to git.
- **`.claude/skills/`** holds the resolved skill content — gitignored; regenerated locally from the lock file.
- Install at **project scope** (default, no `-g`). Adding a skill rewrites `skills-lock.json`; review the diff before squashing.

Common commands:

```sh
npx skills add <owner>/<repo>     # add a skill (updates skills-lock.json)
npx skills install                # restore from skills-lock.json on a fresh clone
npx skills update                 # bump pinned hashes to latest upstream
npx skills list                   # show installed skills + paths
```

If `rtk` is installed, the bare `npx skills …` invocation is intercepted by the rtk shell rewriter and breaks. Prefix with `rtk proxy` to opt out for that command — see `docs/agents/rtk.md`.

## No unrequested initiatives

Do exactly what the user asks. Do not take additional actions they didn't request, even when seemingly helpful. Examples to avoid:

- Opening files in editors.
- Writing or modifying memory/rule files without asking.
- "While I'm here" cleanups, refactors, or reorganizations.
- Generalizing a previous explicit request into a default for similar future cases.

If you think a related action would be useful, ask in one short sentence first. Memory and rule files in particular: always ask before creating, modifying, or deleting them.
