# Deferred Items — Phase 07 spanish-localization

Out-of-scope discoveries logged during plan execution but not fixed (per executor
scope-boundary rules). Not blockers for the plans that found them.

## From 07-01

- **`npm run lint` project-wide fails on pre-existing, out-of-scope errors
  unrelated to this plan's files.** All 26 errors and 9 of the 11 warnings
  originate in `.agents/skills/**` — a directory listed in `.gitignore`
  (`.agents/`) that ESLint's `globalIgnores` does not exclude (only `.claude/**`
  is ignored there). These are vendored skill example/reference files, not
  application code, and predate this plan (confirmed: `.agents/` is untracked
  by git). The remaining 2 warnings (`FG_MUTED` unused in
  `src/app/changelog/page.tsx`, `ACCENT_LIGHT` unused in
  `src/app/manifesto/page.tsx`) are pre-existing and in files this plan does
  not touch (07-01 only creates `src/i18n/*`, `src/proxy.ts`, `src/lib/seo.ts`,
  namespace JSON stubs, and edits `next.config.ts`).
  Verified in scope: `npx eslint src/i18n src/lib/seo.ts src/proxy.ts
  next.config.ts` returns zero errors/warnings.
  Fix (out of scope for this plan): add `.agents/**` to the ESLint
  `globalIgnores` list alongside `.claude/**` in `eslint.config.mjs`.

## From 07-03

- **`npm run audit:containment` / `npm run audit:overflow` / `npm run
  audit:responsive` (the plan's own literal `<verify>` commands) still fail
  on `EACCES` — `test-results/` and `playwright-report/` remain root-owned
  from the prior session (`ls -la` still shows `root:root`, dated Aug 1),
  and this sandbox user still has no `sudo`. Carried forward verbatim from
  07-01/07-02's own deferred note; re-confirmed broken at 07-03 execution
  time (2026-08-19) by running `npm run audit:containment` directly:
  `Error: EACCES: permission denied, unlink
  '.../test-results/.last-run.json'` and `... open
  '.../playwright-report/index.html'` — the test run itself completes, only
  the default report-path writes fail.

  **Not a silent skip.** Every layout spec this plan touches or extends was
  actually run, with real results read, by redirecting Playwright's own
  output path away from the root-owned directories
  (`--output=<scratch dir> --reporter=line`, never committed to
  `playwright.config.ts`):
  - `containment.spec.ts`, all 7 launchable Chromium projects, 16 routes:
    **112 passed** (36.6s). The four `KNOWN_UNFIXED` `/es` twins (KU-1..KU-4)
    were confirmed to actually fire (not silently pass because nothing
    loaded) — annotation counts on `/es/features`, `/es/mcp`, `/es/pricing`,
    `/es/privacy` exactly mirror their English counterparts (1, 12, 15, 5
    respectively), because `/es/*` still renders English copy at this point
    in the phase (Waves 3-4 have not run). No new offender, no asymmetry —
    nothing to fix at source.
  - `overflow.spec.ts`, same matrix: **112 passed** (37.2s).
  - `a11y.spec.ts`, same matrix: **224 passed** (1.4m — includes both the
    `axe` and `contrast needs-review` test per route).
  - `touch-targets.spec.ts`, same matrix: **64 passed, 48 skipped** (the
    spec's own `>=768px` self-skip, doubled from the prior 8-route count —
    27.0s).
  - `touch-iphone` (WebKit) still cannot launch in this sandbox — same
    pre-existing host-dependency gap Phase 5 logged
    (`.planning/phases/05-mobile-responsive-retrofit/deferred-items.md`,
    "From 05-03"), re-confirmed here with the same
    `Host system is missing dependencies` error. CI (`ubuntu-latest`) is
    where this project gets real coverage; not a regression from this plan.

  **Measured wall-clock delta (07-PATTERNS.md's own ask, not estimated):**
  `containment.spec.ts` across the 7 launchable Chromium projects,
  English-only (56 tests, `--grep-invert "overflow: /es"`): **25.3s**. Same
  spec, both locale trees (112 tests): **36.6s**. Doubling the route count
  added **+11.3s**, well inside the CI job's 30-minute timeout against the
  ~1.5 minute baseline the workflow's sharding comment already accounts for
  — the accepted-risk entry T-07-03-03 in 07-03-PLAN.md's threat model holds
  on measured evidence, not assumption.

  **Needed before Wave 6 (07-16) can run any audit script by its literal
  `npm run audit:*` invocation:** `sudo rm -rf test-results playwright-report
  && mkdir test-results playwright-report` (or equivalent ownership fix) by
  whoever next has `sudo` on this box. Until then, every subsequent Wave 3-6
  plan needing a real Playwright run must use the same `--output=<scratch>
  --reporter=line` workaround documented here, not skip the check.
