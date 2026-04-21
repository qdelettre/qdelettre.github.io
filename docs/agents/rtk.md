# RTK (Rust Token Killer)

**Optional, machine-scope tool.** RTK is a CLI proxy that compresses noisy command output before it reaches the LLM context window. It's not project-specific — install it once per machine and it benefits every Claude Code repo you work in. Skipping it is fine; this repo doesn't depend on it.

Project: <https://www.rtk-ai.app/> · Source: <https://github.com/rtk-ai/rtk>

## Install

macOS / Linux (Homebrew):

```sh
brew install rtk
```

macOS / Linux (script):

```sh
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
```

Windows: download a binary from the GitHub Releases page.

After install, register the Claude Code PreToolUse hook so commands are auto-rewritten:

```sh
rtk init --global
```

**Opt out of telemetry immediately after install.** Do this every time on every machine — telemetry is on by default:

```sh
rtk telemetry disable
rtk telemetry forget       # also wipes any data already collected
rtk telemetry status       # confirm: should report disabled
```

Verify the install:

```sh
rtk --version          # rtk X.Y.Z
which rtk              # single binary path
rtk gain               # should run; if "command not found", see name collision below
```

**Name collision warning:** an unrelated package `reachingforthejack/rtk` (Rust Type Kit) shares the binary name. If `rtk gain` errors out, that one is on your PATH instead — uninstall it and reinstall from Homebrew.

## How it works

Two mechanisms operate together:

1. **PreToolUse hook (auto-rewrite).** After `rtk init --global`, every `Bash` tool call from Claude Code is transparently rewritten before execution. `git status` becomes `rtk git status`, `ls` becomes `rtk ls`, `gh pr view` becomes `rtk gh pr view`, etc. Output is compressed; the agent's intent is unchanged.
2. **Direct CLI usage.** You can call `rtk <subcommand>` yourself in a shell — the hook only kicks in inside Claude Code's Bash tool.

Compression is per-tool: each subcommand has tailored filtering (e.g. `rtk git diff` strips diff context; `rtk gh pr view` summarizes the JSON response; `rtk pytest` shows only failures).

## Subcommands you'll touch most

| Command              | Purpose                                                             |
| -------------------- | ------------------------------------------------------------------- |
| `rtk gain`           | Cumulative token savings analytics on this machine                  |
| `rtk gain --history` | Per-command usage history                                           |
| `rtk discover`       | Replay Claude Code history to find missed compression opportunities |
| `rtk session`        | RTK adoption rate across recent sessions                            |
| `rtk learn`          | Learn CLI corrections from your error history                       |

The full list (40+ subcommands covering `git`, `gh`, `glab`, `aws`, `psql`, `pnpm`, `pip`, `pytest`, `mypy`, `ruff`, `cargo`, `go`, `docker`, `tree`, `find`, `grep`, etc.) is in `rtk --help`.

## The `rtk proxy` escape hatch

Some commands break under rewriting — anything that depends on TTY behavior, exact output formatting, or unexpected flag positions. For those, bypass the rewriter while keeping usage tracking:

```sh
rtk proxy <command>           # run raw, but record stats
rtk run <command>             # run raw, no tracking either
```

Known cases in this repo:

- **`npx skills`** — the rewriter mangles the `skills` subcommand. Always invoke as `rtk proxy npx skills …`.
- Anything interactive that wants a real TTY (e.g. login prompts, `gcloud auth login`).

When in doubt, run once via `rtk proxy` to confirm the unmodified command works, then decide whether the compressed version is acceptable.

## Trust model for project-local filters

RTK supports project-local TOML filter overrides. To use them in a checked-out repo:

```sh
rtk trust          # trust this project's TOML filters
rtk untrust        # revoke
rtk verify         # validate filter integrity + run inline tests
```

This repo does not currently ship project-local filters — defaults are sufficient.
