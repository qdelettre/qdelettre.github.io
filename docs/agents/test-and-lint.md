# Test and lint gotchas

## Prettier — TABS, not spaces

`useTabs: true` in the Prettier config. New code MUST use tab indentation from the start. `npm run format` normalizes; `npm run format:check` flags drift.

ESLint's `prettier/prettier` rule and standalone `prettier --check .` occasionally disagree on whitespace ordering. When in doubt, `npm run format` (the canonical tool) wins. If `lint:check` flags a mismatch the script can fix, run `npm run format` and re-check.

## TypeScript — no `as`, no `!`

Project conventions:

- **No `as` type casts.** Use type guards (`'prop' in obj`, `instanceof`, custom predicates), generic type parameters, the `satisfies` operator, or discriminated unions. If a third-party library forces a cast, ask the user before introducing it.
- **No `!` non-null assertions.** Use explicit narrowing (`if (x === null) throw ...`) or optional chaining (`x?.y ?? fallback`).

These rules apply across `src/**` and `tests/e2e/**`.

## Playwright lint rules

Two rules fire frequently — internalize the patterns to avoid retries.

### `playwright/no-conditional-in-test`

Forbids `if (...)` inside test bodies. The pattern that breaks the rule:

```ts
const box = await locator.boundingBox();
if (box === null) throw new Error("...");  // ❌ conditional in test
expect(box.x).toBeCloseTo(...);
```

Idiomatic replacement: assert visibility first (auto-retries; throws on missing element), then use optional chaining:

```ts
const locator = page.locator(".target");
await expect(locator).toBeVisible();        // ✅ auto-retrying, no conditional
const box = await locator.boundingBox();
expect(box?.x ?? 0).toBeCloseTo(...);
```

`expect(undefined).toBeCloseTo(N, 0)` fails loudly (NaN comparison), so the optional chain doesn't silently pass.

### `playwright/prefer-web-first-assertions`

Forbids capturing `textContent()` then asserting equality. The pattern that breaks:

```ts
const text = await locator.textContent(); // ❌ no auto-retry
expect(text).toBe("expected");
```

Replacement:

```ts
await expect(locator).toHaveText("expected"); // ✅ auto-retries
```

When you need to compare across two routes:

```ts
const expectedText = await page.locator("...").textContent();
expect(expectedText).not.toBeNull();
await page.goto("/other/");
await expect(page.locator("...")).toHaveText(expectedText ?? "");
```

The `??` fallback satisfies the type system (`textContent()` returns `string | null`) without a non-null assertion.

## Pre-existing failures

The full Playwright suite has one known unrelated failure on this site:

- `tests/e2e/home.spec.ts` — `home has title and hero heading` expects "Humble developer" but the hero copy now reads "Fullstack engineer, for the web / building with care." The test wasn't updated when the hero was rewritten.

Treat this as a known unrelated failure unless touching home page content. The expected pass count for the full suite at any given moment is `total - 1`.

## Test count discipline

When adding/removing tests in `tests/e2e/responsive.spec.ts` or `tests/e2e/brand-mark-morph.spec.ts`, document the new total in the implementation plan's Self-Review section — catches off-by-one errors.
