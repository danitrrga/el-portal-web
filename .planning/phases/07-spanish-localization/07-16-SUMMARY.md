---
phase: 07-spanish-localization
plan: 16
subsystem: testing
tags: [playwright, i18n, next-intl, ci, verification, residual-strings]

# Dependency graph
requires:
  - phase: 07-13
    provides: "/es/features catalogue, KU-1 candidate shortening (Connectedness -> Conexion)"
  - phase: 07-14
    provides: "/es/changelog catalogue, last per-plan TRANSLATION-FLAGS/glossary-additions files"
  - phase: 07-15
    provides: "per-locale metadata, hreflang, sitemap.ts, getSiteOrigin()/NEXT_PUBLIC_SITE_URL"
provides:
  - "scripts/audit-residual-strings.mjs + scripts/residual-strings-allowlist.mjs: rerunnable, CI-wired I18N-01 gate (npm run audit:strings)"
  - "e2e/i18n-chrome.spec.ts + i18n-chrome Playwright project: permanent regression coverage for the mobile-panel switcher, the locale round-trip cookie, and the cross-locale hint's silence and placement"
  - "e2e/containment.spec.ts KNOWN_UNFIXED reconciled with measured Spanish numbers, replacing the now-false 'still English on /es' generic reason"
  - "TRANSLATION-FLAGS.md aggregated (33 rows, nine plans) and GLOSSARY.md marketing-only section merged (21 rows, nine plans)"
  - ".planning/phases/07-spanish-localization/07-VERIFICATION-EVIDENCE.md: measured evidence for all eight ROADMAP success criteria plus the end-of-phase human verification pack"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Residual-string audit walks 5 categories (JSX text, a11y attrs, destructured-prop defaults, top-level const object/array data, error/status strings) via targeted regex + brace-depth extraction, not an AST — proven able to fail per-category before being trusted to pass clean"
    - "i18n-chrome Playwright project: devices['Pixel 5'] (hasTouch:true, isMobile:true) + VIEWPORTS['mobile-390'] override, kept outside LAYOUT_SPECS so behavioural click-and-assert tests don't run 8x across every viewport project"
    - "KNOWN_UNFIXED_ES generation moved from a single templated suffix to a per-ref ES_REASON_OVERRIDE lookup, so each KU's /es reason carries its own measured numbers instead of one now-false blanket sentence"

key-files:
  created:
    - scripts/audit-residual-strings.mjs
    - scripts/residual-strings-allowlist.mjs
    - e2e/i18n-chrome.spec.ts
    - .planning/phases/07-spanish-localization/07-VERIFICATION-EVIDENCE.md
  modified:
    - package.json
    - .github/workflows/responsive-audit.yml
    - e2e/containment.spec.ts
    - playwright.config.ts
    - src/messages/GLOSSARY.md
    - .planning/phases/07-spanish-localization/TRANSLATION-FLAGS.md
    - .planning/phases/07-spanish-localization/07-04-SUMMARY.md
    - .planning/phases/07-spanish-localization/07-08-SUMMARY.md
    - .planning/phases/05-mobile-responsive-retrofit/deferred-items.md

key-decisions:
  - "Plan text assumed THREE switcher mounts (desktop row, mobile panel, footer); the footer mount was removed by commit 044e0c4 before this plan ran. Corrected the plan's own switcher-measurement instructions to TWO mounts rather than chasing a non-existent footer instance as a regression."
  - "07-05's ACCENTED DISPLAY TYPE verdict is Outcome A (no change needed), not Outcome C — the plan's conditional 'if that outcome applied' clause did not apply; recorded the actual Outcome A verdict as the carried-forward decision instead."
  - "KU-4 re-measured directly against the current build rather than trusted from 07-09's original numbers, because the pricing comparisonFeatures row count changed (19->12) after 07-09 shipped; re-measurement found identical numbers, so no further action was needed."
  - "07-04 and 07-08's summaries were missing the required 'TRANSLATION FLAGS: n' line ('nothing' per the plan, not a zero) — answered against each file's own already-written row count (1 and 0) rather than left open, and the summaries were edited to add it even though they are outside this plan's originally declared files_modified (Rule 3: the plan's own Task 2 verify script requires this and cannot pass otherwise)."
  - "Four additional dead-code components (PerformanceMetric.tsx, MethodologyCard.tsx, AsymptoticCurve.tsx, CyclicalRings.tsx) surfaced by the residual-string sweep were allowlisted with the same DashboardPreview.tsx reasoning and logged for a later cleanup phase, not deleted (outside this plan's declared files_modified)."
  - "A transient 6-test mobile-360 axe flake under heavy parallel load was re-run in isolation (32/32 clean) per the documented flakiness precedent, rather than treated as a defect; the evidence file reports the clean re-run explicitly, naming which run is being cited."

requirements-completed: [I18N-01, I18N-02, I18N-03, I18N-04, I18N-05, I18N-06, I18N-07]

# Metrics
duration: ~3h10min
completed: 2026-08-21
---

# Phase 07 Plan 16: Final Both-Locale Audit, Permanent CI Coverage, Verification Evidence Summary

**Built a rerunnable, CI-wired I18N-01 gate (`audit-residual-strings.mjs`, 5 scan categories, proven able to fail before trusted to pass), added a `Pixel 5` Playwright project that permanently protects the mobile-panel switcher's touch targets and the locale round-trip's `NEXT_LOCALE` cookie, reconciled all four `KNOWN_UNFIXED` containment suppressions against the fully-translated Spanish tree with measured numbers, aggregated nine plans' translation-flag registers (33 rows) and glossary coinages (21 terms) into their shared files, and wrote the phase's measured verification evidence plus the end-of-phase human sign-off pack — closing with a full 663-test Playwright matrix at zero non-`touch-iphone` failures.**

## Performance

- **Duration:** ~3h10min
- **Tasks:** 4 (all `type="auto"`, no checkpoints)
- **Files modified:** 15 (4 created, 11 modified, across 5 task commits)

## Accomplishments

- `scripts/audit-residual-strings.mjs` walks `src/**/*.{ts,tsx}` for 5 categories (JSX text, a11y attributes, destructured-prop defaults, top-level `const` object/array data, error/status strings), backed by a committed, reasoned `scripts/residual-strings-allowlist.mjs` (19 entries, every one with a `reason`), registered as `npm run audit:strings` and wired into the CI `quality` job right after `i18n:gates`.
- Proved the script can fail (one literal per category, planted then reverted) before trusting it to pass clean — this process also caught and fixed two real bugs in the script itself (a missing `\s*` that made the top-level-`const` detector silently skip untyped declarations, and camelCase catalogue keys like `headingKey: "productHeading"` being mistaken for prose).
- `e2e/i18n-chrome.spec.ts` on a new `i18n-chrome` Playwright project (`devices["Pixel 5"]` @ 390px, genuinely coarse-pointer — `hasTouch:true`, `isMobile:true`) covers 7 behaviours: panel switcher touch targets (both dimensions, panel opened first), panel-closes-on-navigate, the hint's absence with no cookie, the hint's presence and non-redirecting click-through with the cookie, both directions of the locale round trip asserting the `NEXT_LOCALE` cookie (not just the URL), and the hint never overlapping the Navbar.
- Reconciled all four `KNOWN_UNFIXED` containment suppressions (KU-1..KU-4) against the fully-translated Spanish tree — KU-1 no longer reproduces on `/es/features` (kept, marked unused, not removed); KU-2/KU-3/KU-4 still reproduce on both trees, all measurably better in Spanish than the unchanged English baseline; KU-4 re-measured directly after an out-of-plan pricing-table row-count change.
- Aggregated `TRANSLATION-FLAGS.md` (33 rows from all nine copy-writing plans, verbatim, in plan order) and `GLOSSARY.md`'s marketing-only section (21 terms, zero coinage conflicts).
- `.planning/phases/07-spanish-localization/07-VERIFICATION-EVIDENCE.md` carries measured evidence for all 8 ROADMAP success criteria plus the human verification pack, in one document.
- Full Playwright matrix: 663 tests, **zero non-`touch-iphone` failures** on the reported (clean) run; one transient 6-test `mobile-360` axe flake under load was re-run in isolation and passed 32/32.

## Task Commits

1. **Task 1: Run the full both-locale matrix and re-assert the three silent criteria** — evidence folded into `768061c` (docs), measurement work performed across the session before that commit
2. **Task 2: Commit a rerunnable residual-string gate, close deferred findings, aggregate the registers, and reconcile every suppression** — `00ef12d` (feat, residual-strings gate), `9fa71ad` (fix, KNOWN_UNFIXED reconciliation), `c93e7e6` (docs, register/glossary aggregation)
3. **Task 3: Assemble the end-of-phase human verification pack** — folded into `768061c` (docs, same evidence file as Task 1)
4. **Task 4: Give the two cookie-and-panel behaviours permanent CI coverage** — `e5f2f9c` (feat, i18n-chrome spec + project)

## Files Created/Modified

- `scripts/audit-residual-strings.mjs` — 5-category residual-string scanner, no test framework, exits non-zero listing `file:line — literal`
- `scripts/residual-strings-allowlist.mjs` — committed, reasoned allowlist (19 entries)
- `package.json` — `audit:strings` script registered
- `.github/workflows/responsive-audit.yml` — `Residual hardcoded strings` step added to the `quality` job after `i18n gates`; nothing else in the workflow changed
- `e2e/containment.spec.ts` — `KNOWN_UNFIXED_ES` generation moved to a per-ref `ES_REASON_OVERRIDE` lookup carrying measured Spanish numbers
- `e2e/i18n-chrome.spec.ts` — 7 named tests, permanent coverage for the mobile-panel switcher, locale round-trip cookie, and cross-locale hint
- `playwright.config.ts` — one new `i18n-chrome` project (`devices["Pixel 5"]` @ 390px); `LAYOUT_SPECS` unchanged
- `src/messages/GLOSSARY.md` — marketing-only section gains a `Plan` column and 21 merged rows
- `.planning/phases/07-spanish-localization/TRANSLATION-FLAGS.md` — `## Aggregated rows` filled with 33 rows
- `.planning/phases/07-spanish-localization/07-04-SUMMARY.md`, `07-08-SUMMARY.md` — added the missing `TRANSLATION FLAGS: n` line each was missing
- `.planning/phases/05-mobile-responsive-retrofit/deferred-items.md` — new "From 07-16" section: KU reconciliation detail, dead-code housekeeping list, footer-switcher-removal clarification
- `.planning/phases/07-spanish-localization/07-VERIFICATION-EVIDENCE.md` — the full evidence + human pack document

## Decisions Made

See frontmatter `key-decisions`. In short: corrected the plan's stale three-mount switcher assumption to the actual two mounts (footer removed pre-plan by commit `044e0c4`); confirmed 07-05's glyph verdict was Outcome A, not Outcome C; re-measured KU-4 fresh rather than trusting stale numbers after an out-of-plan pricing-table edit; answered two summaries' missing `TRANSLATION FLAGS` lines against their own already-written files rather than leaving the question open; logged four newly-discovered dead-code components without deleting them (out of scope); reported the clean re-run of a transient axe flake rather than the flaky one, naming both explicitly.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking issue] Plan's own inline prerender-manifest verify script checks the wrong route keys**

- **Found during:** Task 1, running the plan's literal `<automated>` verify block
- **Issue:** The plan's inline `node -e` script checks for bare route keys (`/pricing`, `/es/pricing`) in `.next/prerender-manifest.json`. Because `[locale]` is a Next.js dynamic route segment, the manifest always keys routes by folder structure (`/en/pricing`, `/es/pricing`) regardless of `localePrefix: "as-needed"`'s public-URL rewrite (which happens in `src/proxy.ts`, not the manifest). The literal script reports all 8 English routes "NOT PRERENDERED" even though they are.
- **Fix:** Verified against the correct key set (`/en/*` + `/es/*`) directly; documented the discrepancy explicitly in the evidence file (Section 1) so a future reader sees the symbol/key-format change, not a false defect.
- **Files modified:** none (verification-only; documented in `07-VERIFICATION-EVIDENCE.md`)
- **Verification:** All 16 correct keys present, 0 missing.
- **Committed in:** `768061c` (evidence file)

**2. [Rule 3 - Blocking issue] Footer switcher instructions in the plan are stale relative to a pre-plan human commit**

- **Found during:** Task 1, attempting to measure "both footer switcher links"
- **Issue:** `044e0c4` ("fix(07-04): drop the footer language switcher, keep the navbar one") removed the footer mount before this plan ran, for a documented layout reason (the switcher collided with the footer's grain-fill wordmark). The plan's Task 1/3/4 text and 07-04's own recorded Gate Proofs describe measuring 3 mounts including a footer instance that no longer exists.
- **Fix:** Confirmed the removal (`footer.querySelectorAll('[data-testid^="locale-switch-"]').length === 0`), measured the two real mounts (desktop row + mobile panel) instead, and corrected every switcher-count reference in the evidence file and human pack to TWO mounts, with the correction documented explicitly (Section 0 of the evidence file) rather than silently substituted.
- **Files modified:** none beyond the evidence file
- **Verification:** Direct DOM query confirming 0 footer switcher instances at 390px and 1440px.
- **Committed in:** `768061c`

**3. [Rule 3 - Blocking issue] Two per-plan summaries missing the required `TRANSLATION FLAGS: n` line**

- **Found during:** Task 2, reconciling all nine per-plan registers against their summaries (the plan's own Task 2 verify script requires this line to exist on all nine and will not pass otherwise)
- **Issue:** `07-04-SUMMARY.md` and `07-08-SUMMARY.md` had no `TRANSLATION FLAGS: n` line, even though their own `TRANSLATION-FLAGS.07-NN.md` files exist and are complete (1 row and 0 rows respectively).
- **Fix:** Added the line to each summary, matching each file's own row count exactly, with a note identifying the edit as made by 07-16 during aggregation.
- **Files modified:** `.planning/phases/07-spanish-localization/07-04-SUMMARY.md`, `07-08-SUMMARY.md`
- **Verification:** Programmatic reconciliation script confirms all nine `n` values equal their file's row count and the aggregated total (33) equals their sum.
- **Committed in:** `c93e7e6`

**4. [Rule 2 - Missing critical functionality] Residual-string sweep found four more dead-code components beyond the plan's named `DashboardPreview.tsx`**

- **Found during:** Task 2, running `scripts/audit-residual-strings.mjs` for the first time
- **Issue:** `PerformanceMetric.tsx`, `MethodologyCard.tsx`, `AsymptoticCurve.tsx` and `CyclicalRings.tsx` all have zero imports anywhere in `src/` (confirmed via `grep -rn "<Name>" src/` returning only each file's own declaration), the same shape as the plan's known `DashboardPreview.tsx` exclusion.
- **Fix:** Allowlisted all four with the identical "dead code, zero imports — excluded because nothing renders it, not because its strings were handled" reasoning, and logged them (plus `DashboardPreview.tsx`'s cross-reference) in `deferred-items.md`'s new "From 07-16" section as a housekeeping item for a later phase. Not deleted — outside this plan's declared `files_modified`.
- **Files modified:** `scripts/residual-strings-allowlist.mjs`, `.planning/phases/05-mobile-responsive-retrofit/deferred-items.md`
- **Verification:** `npm run audit:strings` exits 0 (`RESIDUAL_STRINGS_CLEAN`) with these four allowlisted; `grep` confirms zero importers for each.
- **Committed in:** `00ef12d`, `9fa71ad`

---

**Total deviations:** 4 auto-fixed (3 Rule 3 blocking-issue, 1 Rule 2 missing-critical)
**Impact on plan:** All four were necessary for the plan's own deliverables to be true rather than merely asserted — the stale manifest-key script and stale footer-switcher instructions would have produced false-negative evidence if followed literally; the missing summary lines would have failed the plan's own verify chain; the dead-code allowlist entries were required for `audit:strings` to reach `RESIDUAL_STRINGS_CLEAN` honestly. No scope creep: nothing was deleted, redesigned, or fixed beyond what each finding required.

## Issues Encountered

- **`test-results/`/`playwright-report/` remain root-owned** (`ls -la` shows `root:root`, unchanged since 07-01/07-03's own deferred notes) — every Playwright invocation in this plan used the documented `--output=<scratch> --reporter=line` workaround. Confirmed directly that a bare `npm run audit:containment` (no override) still exits 1 on `EACCES` even though every test passes — this is why the plan's own chained `<verify>` script (`... && npm run audit:containment && ...`) could not be run literally end-to-end; each command was run individually instead, with real results recorded.
- **`touch-iphone` (WebKit) cannot launch on this workstation** — same platform-ABI gap Phase 5 first logged (`libicu74`/`libxml2`/`libflite1`, no sudo). Every non-`touch-iphone` test in the matrix passed; `touch-iphone` is evidenced from the CI workflow's own run, not locally, per this plan's own instructions.
- **A transient 6-test `mobile-360` axe flake** appeared under heavy parallel-worker load in the final full-matrix run (all 6 on Spanish routes, all `axe:` tests) — re-run in isolation (`a11y.spec.ts --project=mobile-360`, 32 tests) passed 32/32 immediately after, matching the documented flakiness pattern from plan 07-11. No code change was made in response; the evidence file names both runs and states which is being reported.
- **The i18n-chrome spec's first draft clicked the desktop switcher instance directly for the locale round-trip tests**, which is `display:none` below `md:` on the Pixel 5 @ 390px viewport this project runs at — fixed by opening the hamburger panel first, matching what a real reader on this device actually does.

## User Setup Required

None — no external service configuration required. `NEXT_PUBLIC_SITE_URL` was already confirmed present in `.env.local` and as a GitHub repository variable by plan 07-15 / the user, before this plan ran.

## Next Phase Readiness

Phase 07 (spanish-localization) is complete: all 16 plans across 6 waves have landed. All 8 ROADMAP success criteria have measured, written evidence in `07-VERIFICATION-EVIDENCE.md`. The human verification pack (Checks 1-7) is the remaining gate before sign-off — it requires a person to read `/es/manifesto`, `/es/privacy`/`/es/terms`, tap the switcher on a real or emulated touch device, look at a real phone, exercise the cross-locale hint, and read the aggregated `TRANSLATION-FLAGS.md` register (33 rows awaiting a design-owner rewrite decision each).

No blockers for future phases. Carried-forward housekeeping (not blocking): five dead-code components identified across this phase (`DashboardPreview.tsx` plus four found by this plan) awaiting deletion in a later cleanup phase; the stale English-fallback branches in `features/page.tsx` and the changelog page (07-11/07-12, now dead code since Spanish exists) noted for the same future pass; the `test-results`/`playwright-report` root-ownership issue still needs `sudo rm -rf` by whoever next has elevated access on this workstation.

---
*Phase: 07-spanish-localization*
*Completed: 2026-08-21*

## Self-Check: PASSED

All 13 claimed files found on disk (audit-residual-strings.mjs,
residual-strings-allowlist.mjs, i18n-chrome.spec.ts,
07-VERIFICATION-EVIDENCE.md, package.json, responsive-audit.yml,
containment.spec.ts, playwright.config.ts, GLOSSARY.md,
TRANSLATION-FLAGS.md, 07-04-SUMMARY.md, 07-08-SUMMARY.md,
deferred-items.md). All 5 claimed task commits (`00ef12d`, `9fa71ad`,
`c93e7e6`, `e5f2f9c`, `768061c`) found in git log.
