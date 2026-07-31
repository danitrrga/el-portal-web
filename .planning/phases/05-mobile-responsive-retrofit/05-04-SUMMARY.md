---
phase: 05-mobile-responsive-retrofit
plan: 04
subsystem: ui
tags: [tailwind-v4, svh, touch-targets, wcag, playwright, responsive]

# Dependency graph
requires:
  - phase: 05-mobile-responsive-retrofit (plans 01-03)
    provides: "min-h-viewport utility + svh cascade (01); 44px Button/Navbar/Footer/CopyButton targets and the width>=768 AAA skip boundary (02); ReadingLayout + /changelog overflow fixes (03)"
provides:
  - "All 8 route roots (/, /privacy, /terms, /manifesto, /pricing, /mcp, /changelog, /features) on the svh cascade via min-h-viewport, closing out RESP-05"
  - "Last three hand-rolled sub-44px touch targets fixed: Hero announcement pill, /mcp 'Open Settings' link, /features 'Read the manifesto' link"
  - "Verification sweep proving audit:targets and audit:overflow green across the full 8-route x 7-Chromium-project matrix, with touch-iphone isolated as a documented environment gap"
affects: ["05-05"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "min-h-11 md:min-h-0 as the additive shape for growing a content-sized link's tap box without a hard height, reverted to today's intrinsic height at md:"

key-files:
  created: []
  modified:
    - src/app/page.tsx
    - src/app/privacy/page.tsx
    - src/app/terms/page.tsx
    - src/app/manifesto/page.tsx
    - src/app/pricing/page.tsx
    - src/app/mcp/page.tsx
    - src/app/changelog/page.tsx
    - src/app/features/page.tsx
    - src/app/globals.css
    - src/components/Hero.tsx

key-decisions:
  - "Reworded the min-h-viewport doc comment in globals.css (written in plan 05-01) to drop the literal string 'min-h-screen' — it was tripping this plan's own grep-based zero-hits regression check even though it was a comment, not a live class"
  - "Task 3 (audit:targets/audit:overflow full-matrix sweep) required zero source changes: the full 7-Chromium-project x 8-route matrix was already green after Task 1 and Task 2, so none of the plan's 'likely residual' candidates (pricing S-12 badge, manifesto/features .display clamps, mcp <pre>) actually needed touching"

requirements-completed: [RESP-01, RESP-03, RESP-05, RESP-08]

# Metrics
duration: 12min
completed: 2026-07-31
---

# Phase 05 Plan 04: Page-Root svh Cascade + Last Touch Targets + Full-Matrix Audit Summary

**Swapped `min-h-screen` -> `min-h-viewport` on all 8 route roots, added `min-h-11 md:min-h-0` to the last three hand-rolled sub-44px links, and proved `audit:targets`/`audit:overflow` green across the entire 7-Chromium-project x 8-route matrix with zero further source changes needed.**

## Performance

- **Duration:** 12 min
- **Started:** 2026-07-31T07:04:00Z (approx.)
- **Completed:** 2026-07-31T07:12:52Z
- **Tasks:** 3 completed
- **Files modified:** 10

## Accomplishments
- All 8 page roots now use the `min-h-viewport` custom utility (from plan 05-01), giving every route the `100vh` -> `100svh` cascade so iOS Safari's expanded address bar no longer clips the bottom of a full-height section on load
- The Hero announcement pill, `/mcp` "Open Settings" link, and `/features` "Read the manifesto" link — the three targets plan 05-02 explicitly left for this plan — are now >=44px tall on phones, reverting to today's intrinsic height at `md:` and above
- Ran the complete verification matrix (`reflow-320`, `mobile-360`, `mobile-390`, `mobile-430`, `tablet-768`, `laptop-1024`, `desktop-1440`, `touch-iphone`) against both `touch-targets.spec.ts` and `overflow.spec.ts`: 56/56 overflow tests and 32/32 (+ 24 correctly skipped >=768px) touch-target tests pass on every runnable project; the only failures are the pre-existing `touch-iphone` host-dependency gap (8 per spec), not a code regression
- Confirmed zero desktop regression: `desktop-1440` shows the exact same pre-existing baseline (8 failed `heading-order` axe findings / 16 passed / 8 skipped touch-target) as recorded before this plan

## Task Commits

Each task was committed atomically:

1. **Task 1: Move all eight page roots onto the svh cascade** - `1706f04` (fix)
2. **Task 2: Lift the three remaining hand-rolled links to 44px on phones** - `12923c6` (fix)
3. **Task 3: Prove audit:targets and audit:overflow green across the full matrix** - no commit (verification-only; zero source changes required — see below)

**Plan metadata:** (pending — this commit)

## Files Created/Modified
- `src/app/page.tsx`, `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/app/manifesto/page.tsx`, `src/app/pricing/page.tsx`, `src/app/mcp/page.tsx`, `src/app/changelog/page.tsx`, `src/app/features/page.tsx` - single-token swap `min-h-screen` -> `min-h-viewport` on the route root, nothing else changed in that className
- `src/app/globals.css` - reworded the `min-h-viewport` utility's doc comment to remove the literal `min-h-screen` string (doc-only, no functional change)
- `src/components/Hero.tsx` - announcement pill `<Link>` gained `min-h-11 md:min-h-0`
- `src/app/mcp/page.tsx` - "Open Settings" `<Link>` gained `min-h-11 md:min-h-0` (in addition to its `min-h-viewport` root fix, above)
- `src/app/features/page.tsx` - "Read the manifesto" `<Link>` gained `min-h-11 md:min-h-0` (in addition to its `min-h-viewport` root fix, above — exactly two changed lines total in this file across the whole plan, matching the plan's own acceptance criterion)

## Decisions Made
- Reworded the `min-h-viewport` doc comment in `globals.css` rather than leave the plan's literal `grep -rn "min-h-screen" src` check with a false positive — the comment (written in plan 05-01) referenced the Tailwind utility being replaced by name, which is not a live class usage but does match a naive grep. Rewording avoids the false trip with zero functional impact.
- Did not apply any of the three "known residual candidate" fixes named in Task 3's `<action>` block (pricing S-12 badge, manifesto/features `.display` clamp mobile floors, mcp `<pre>` exemption) because none of them actually failed anywhere in the full matrix run — Task 3 is a verification task, and its job (prove the matrix green) was satisfied without needing the contingency fixes.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Reworded `globals.css` comment to stop a grep-based false positive**
- **Found during:** Task 1 verification
- **Issue:** The plan's acceptance criterion `grep -rn "min-h-screen" src` returns zero results was written assuming only the 8 route-root class usages existed. Plan 05-01 had already added a doc comment at `globals.css:349` that reads "`min-h-screen` compiles to a single `min-height: 100vh`..." — a literal, harmless string match that would trip this plan's own automated check even after all 8 real usages were converted.
- **Fix:** Reworded the comment to "Tailwind's built-in screen-height utility compiles to..." — same meaning, no literal `min-h-screen` token, verified the grep now returns zero hits site-wide.
- **Files modified:** `src/app/globals.css`
- **Verification:** `grep -rn "min-h-screen" src` exits 1 (no matches) after the edit; `npx tsc --noEmit` and `npm run build` both still pass.
- **Committed in:** `1706f04` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 Rule 3 blocking-verification fix)
**Impact on plan:** Doc-only change, no functional or visual impact. No scope creep — the fix exists solely to make the plan's own literal grep assertion match its intent.

## Issues Encountered

None beyond the deviation above. Task 3's full-matrix sweep (`reflow-320`/`mobile-360`/`mobile-390`/`mobile-430`/`touch-iphone` for `touch-targets.spec.ts` + `overflow.spec.ts`, plus `tablet-768`/`laptop-1024`/`desktop-1440` for `overflow.spec.ts`) passed cleanly on every runnable project on the first attempt — no residual overflow or touch-target failures were found, so none of the plan's three "likely candidate" contingency fixes were needed.

**`touch-iphone` (WebKit) Playwright project still cannot launch in this sandbox** — pre-existing environment gap (missing `libicu74`/`libxml2`/`libflite1`, requires `sudo`), already logged in `.planning/phases/05-mobile-responsive-retrofit/deferred-items.md` per plan 05-03. Every one of the 16 `touch-iphone` failures observed in this plan's runs (8 for `touch-targets.spec.ts`, 8 for `overflow.spec.ts`) is the identical `browserType.launch` host-dependency error, uniform across all 8 routes — confirming this is not a code regression from this plan's changes.

## User Setup Required

None - no external service configuration required. (Optional, unchanged from prior plans: someone with sudo on this machine can run `sudo npx playwright install-deps` once to enable the `touch-iphone` WebKit project.)

## Next Phase Readiness

- RESP-05 fully satisfied: `body` (05-01) plus all 8 page roots (this plan) now carry the `vh` -> `svh` cascade.
- RESP-03 fully satisfied: every touch target sitewide identified across plans 05-02 and 05-04 is now >=44px on phones, restored to today's value at `md:`. `npm run audit:targets` is green on every runnable project (32 passed, 24 correctly skipped at >=768px, 8 pre-existing `touch-iphone` environment failures).
- RESP-01 fully satisfied: `npm run audit:overflow` is green across all 8 routes on all 7 Chromium-sized projects (56 passed), plus the same pre-existing `touch-iphone` environment gap.
- RESP-08 upheld throughout: `git diff -U0 8e81ad4..HEAD -- src` shows every changed line is either a byte-identical `min-h-screen` -> `min-h-viewport` swap (resolves to the same pixel value at >=768px, since `svh` == `vh` with no retractable browser UI) or an `md:`-restored addition (`min-h-11 md:min-h-0`). `desktop-1440` shows the exact same pre-existing baseline as before this plan (8 failed `heading-order` axe findings, 16 passed, 8 skipped touch-target) — zero new failures.
- `npx tsc --noEmit`, `npm run typecheck:e2e`, `npm run lint` (0 errors, 2 pre-existing unrelated unused-var warnings), and `npm run build` (all 8 routes still `○ Static`) all pass.
- Plan 05-05 (the `overflow-x-hidden` removal from `<body>`) is now fully unblocked: both known overflow sources (05-03) are fixed, all 8 roots use `svh` (this plan), and every touch target sitewide is >=44px (05-02 + this plan) — nothing is left masking behind the body-level clip.

---
*Phase: 05-mobile-responsive-retrofit*
*Completed: 2026-07-31*

## Self-Check: PASSED

- FOUND: src/app/page.tsx (min-h-viewport)
- FOUND: src/app/privacy/page.tsx (min-h-viewport)
- FOUND: src/app/terms/page.tsx (min-h-viewport)
- FOUND: src/app/manifesto/page.tsx (min-h-viewport)
- FOUND: src/app/pricing/page.tsx (min-h-viewport)
- FOUND: src/app/mcp/page.tsx (min-h-viewport, min-h-11 md:min-h-0)
- FOUND: src/app/changelog/page.tsx (min-h-viewport)
- FOUND: src/app/features/page.tsx (min-h-viewport, min-h-11 md:min-h-0)
- FOUND: src/components/Hero.tsx (min-h-11 md:min-h-0)
- FOUND commit: 1706f04 (Task 1)
- FOUND commit: 12923c6 (Task 2)
