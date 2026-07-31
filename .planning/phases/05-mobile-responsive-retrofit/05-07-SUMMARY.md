---
phase: 05-mobile-responsive-retrofit
plan: 07
subsystem: frontend
tags: [responsive, hero, typography, containment, gap-closure]

# Dependency graph
requires:
  - phase: 05-mobile-responsive-retrofit
    provides: "e2e/containment.spec.ts (05-06) — the RED harness this plan turns green"
provides:
  - "Breakpoint-gated fluid H1 clamp on / and /features, replacing the 42px-floor inline fontSize"
  - "Bleed-free dashboard-preview wrapper on / at all four phone widths"
  - "e2e/containment.spec.ts GREEN on / and everywhere else, across all 7 launchable Chromium projects"
affects: [05-VERIFICATION]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Mobile-first fluid clamp() as the unprefixed text-[...] utility, with the original desktop clamp restored byte-for-byte behind md: — mirrors the pattern shipped in plan 05-03 (changelog H1)"
    - "Removal-with-no-restoration for a negative-margin bleed that already had a same-breakpoint zero-out (sm:mr-0) — adding a restore point would introduce a desktop-band change rather than prevent one"

key-files:
  created: []
  modified:
    - src/components/Hero.tsx
    - src/app/features/page.tsx

key-decisions:
  - "No sm:/md: restoration added to the dashboard-preview wrapper after removing -mr-56 — -mr-56 only ever applied below 640px (sm:mr-0 already zeroed it from 640px up), so removal with no restore point is the only edit that leaves the >=768px band untouched. Adding a restore point would reinstate a bleed in the 640-767px band where none exists today."
  - "/features' H1 clamp was converted on the strength of the gap statement (identical inline clamp pattern to Hero.tsx), not on harness evidence — the containment sweep never flagged /features because its longest token fits its box even at the 42px floor. This asymmetry is expected and documented in 05-06's SUMMARY."

requirements-completed: [RESP-01]

# Metrics
duration: 38min
completed: 2026-07-31
---

# Phase 05 Plan 07: Hero H1 Clamp + Preview Bleed Summary

**Deleted the inline `fontSize: clamp(42px, 4.2vw, 58px)` from both H1s (replaced with a mobile-first fluid clamp behind an unprefixed utility, desktop clamp restored byte-for-byte behind `md:`) and removed the `-mr-56`/`sm:mr-0` pair from the Hero dashboard-preview wrapper — closing GAP-01 and GAP-02 and turning `e2e/containment.spec.ts` from red to green with zero change to any `>=768px` computed value.**

## Performance

- **Duration:** 38 min
- **Started:** 2026-07-31 (immediately after 05-06)
- **Completed:** 2026-07-31
- **Tasks:** 3 completed (Task 3 required no source changes — see below)
- **Files modified:** 2 (`src/components/Hero.tsx`, `src/app/features/page.tsx`)

## Accomplishments

- Closed **GAP-01**: neither H1 carries an inline `fontSize` anymore. Both now compute a
  fluid size between ≈26px and 42px across the phone band (320→768px) and the exact
  pre-existing size at every viewport ≥768px (42px / 43.008px / 58px, bit-identical to
  before). The `/` hero H1 no longer overflows its own text box at any phone width, and
  its height at 390px dropped from 214.14px (5 lines, 25.4% of an 844px viewport) to
  116.25px (4 lines, 13.77%).
- Closed **GAP-02**: removed `-mr-56` and the now-redundant `sm:mr-0` from the dashboard
  preview wrapper. The card is now 100% on screen at 320/360/390/430 (was 63.9-66.1%
  visible, 216-224px past the viewport edge), and computes an identical
  `margin-right: 0px` at 640/768/1024/1440 both before and after — the `>=768px` band was
  never touched.
- `e2e/containment.spec.ts` (built RED by plan 05-06) is now green on `/`: `npm run
  audit:containment` reports 56/56 on the 7 launchable Chromium projects.
- Full-matrix run (`npm run audit:responsive`): **264 passed / 24 skipped / 40 failed**,
  every failure a `touch-iphone` `browserType.launch` host-dependency error — reconciles
  exactly against the plan's predicted totals (see reconciliation table below).
- `git diff --stat 5f4ba1d -- src/` confirms exactly 2 files changed, nothing else in the
  out-of-scope fence was touched.

## Task Commits

1. **Task 1: Replace the 42px-floor inline H1 clamp with a breakpoint-gated fluid clamp** - `df3814c` (fix)
2. **Task 2: Remove the phone-width dashboard-preview bleed** - `6c02ea0` (fix)
3. **Task 3: Green the full matrix and prove the desktop freeze** - no commit (verification-only; see below)

_Note: Task 3 produced no source changes. The full-matrix run reconciled exactly with the
plan's predicted totals and no residual offender was found, so `deferred-items.md` and
`e2e/containment.spec.ts` were both left untouched — mirroring plan 05-06's Task 2._

## Files Created/Modified

- `src/components/Hero.tsx` — H1 (line 113-121): inline `fontSize` deleted, className
  gained `text-[clamp(1.625rem,3.571vw+0.911rem,2.625rem)] md:text-[clamp(42px,4.2vw,58px)]`.
  Dashboard-preview wrapper (line 181): `-mr-56` and `sm:mr-0` removed.
- `src/app/features/page.tsx` — H1 (line ~895): identical inline-`fontSize`-to-utility
  transformation, same clamp values.

## Before/After Computed Font-Size — Both H1s

| Viewport | `/` before | `/` after | `/features` before | `/features` after |
|---|---|---|---|---|
| 320 | `42px` | `26.0032px` | `42px`* | `26.0032px` |
| 360 | `42px` | `27.4316px` | `42px`* | `27.4316px` |
| 390 | `42px` | `28.5029px` | `42px`* | `28.5029px` |
| 430 | `42px` | `29.9313px` | `42px`* | `29.9313px` |
| 768 | `42px` | `42px` | `42px` | `42px` |
| 1024 | `43.008px` | `43.008px` | `43.008px` | `43.008px` |
| 1440 | `58px` | `58px` | `58px` | `58px` |

`*` — `/features`' 42px floor at phone widths was never independently re-measured in this
plan; it follows from the byte-identical inline clamp expression documented in the plan's
gap statement and 05-06's SUMMARY (the containment sweep never flagged `/features` because
its longest token fits its box even at the floor — see 05-06's "Sweep-A 430px Non-Firing
Asymmetry" section).

**The 768/1024/1440 column is identical before and after on both routes** — confirmed by
direct Playwright measurement against the post-edit production build, matching the plan's
`<measured_baseline>` table exactly.

## H1 Box Overflow, `/`, Phone Widths

| Viewport | `scrollWidth` before | `clientWidth` | Overflow before | `scrollWidth` after | Overflow after |
|---|---|---|---|---|---|
| 320 | 358 | 272 | 86px | 272 | 0px |
| 360 | 358 | 312 | 46px | 312 | 0px |
| 390 | 358 | 342 | 16px | 342 | 0px |
| 430 | 358 | 382 | 0px | 382 | 0px |

## H1 Height and Line Count at 390px on `/`

| Metric | Before | After |
|---|---|---|
| `getBoundingClientRect().height` | `214.14px` | `116.25px` |
| Line count | 5 | 4 |
| % of 844px viewport height | 25.4% | 13.77% |

Both after-values are well inside the plan's ceilings (`<=150px`, `<=18%`).

## Dashboard Preview Card — Visibility and Bounding Rect

| Viewport | Before: left/right | Before: visible% | After: left/right | After: visible% |
|---|---|---|---|---|
| 320 | 8 / 536 | — (216px past edge) | 8 / 312 | 100% |
| 360 | 8 / 576 | — (216px past edge) | 8 / 352 | 100% |
| 390 | 8 / 606 | 63.9% | 8 / 382 | 100% |
| 430 | 8 / 646 | 66.1% | 8 / 422 | 100% |
| 768 | 8 / 760 | 100% | 8 / 760 | 100% (unchanged) |
| 1024 | 8 / 1016 | 100% | 8 / 1016 | 100% (unchanged) |
| 1440 | 144 / 1296 | 100% | 144 / 1296 | 100% (unchanged, rect identical) |

## Why Line 181 Needs No `sm:`/`md:` Restoration

`-mr-56` (`margin-right: -14rem`) applied only from 0 to 639px, because `sm:mr-0` already
zeroed it from 640px up. Direct measurement of the wrapper's computed `margin-right`
confirms this boundary and its post-edit collapse to a constant:

| Width | `margin-right` before | `margin-right` after |
|---|---|---|
| 639px | `-224px` | `0px` |
| 640px | `0px` | `0px` |
| 768px | `0px` | `0px` |
| 1024px | `0px` | `0px` |
| 1440px | `0px` | `0px` |

The entire `>=640px` band already computed `margin-right: 0px` before this edit, so
deleting `-mr-56`/`sm:mr-0` with **no** replacement breakpoint restore point is the only
change that touches the phone band (0-639px) without altering the desktop band. Adding a
`sm:` or `md:` restore would have reintroduced a `-224px` bleed in the 640-767px window
where none currently exists — the opposite of this plan's SC7 obligation.

## Full-Matrix Reconciliation

`npm run audit:responsive` (production build, 7 launchable Chromium projects +
`touch-iphone`):

**264 passed / 24 skipped / 40 failed** (328 total tests). Exit code 1 (non-zero, from the
`touch-iphone` environment gap only).

| Component | 05-VERIFICATION baseline | This run | Delta explanation |
|---|---|---|---|
| Passed | 208 | 264 | +56 — the 7 non-`touch-iphone` projects × 8 routes for `containment.spec.ts`, all green (was 4 real red on `/` before this plan) |
| Skipped | 24 | 24 | unchanged — touch-target skip logic is unrelated to this plan |
| Failed | 32 | 40 | +8 — `touch-iphone` × 8 routes for `containment.spec.ts`, all `browserType.launch` host-dependency errors, same class as the other 32 pre-existing `touch-iphone` failures |

`208 + 56 = 264` ✓ · `32 + 8 = 40` ✓ · `264 + 24 = 288` baseline-tests-equivalent total,
`+64` new containment tests (`56` pass + `8` touch-iphone fail) `= 328` ✓. Every one of the
40 failures was confirmed to be a `touch-iphone` `browserType.launch` error and nothing
else (verified by listing the full failure set from the run output — 16 from `a11y.spec.ts`,
8 from `containment.spec.ts`, 8 from `overflow.spec.ts`, 8 from `touch-targets.spec.ts`, all
`touch-iphone`).

**Per-audit breakdown, non-`touch-iphone` only:**

| Command | Result |
|---|---|
| `npm run audit:containment` | 56/56 passed |
| `npm run audit:overflow` | 56/56 passed |
| `npm run audit:targets` | 32 passed / 24 skipped |
| `npm run audit:a11y` | 112/112 passed |

No regression in any pre-existing spec.

## Verification Commands Run

- `npx tsc --noEmit` → exit 0
- `npm run lint` → exit 0, 2 pre-existing unused-var warnings only (`changelog/page.tsx`,
  `manifesto/page.tsx`), unchanged from before this plan
- `npm run typecheck:e2e` → exit 0
- `npm run build` → exit 0, `○ (Static)` on all 8 content routes (`/`, `/features`,
  `/manifesto`, `/changelog`, `/mcp`, `/pricing`, `/privacy`, `/terms`)
- `git diff --stat 5f4ba1d -- src/` → exactly 2 files (`src/components/Hero.tsx`,
  `src/app/features/page.tsx`)
- `git diff --name-only 5f4ba1d | grep -E 'layout\.tsx|globals\.css|button\.tsx|motion\.spec\.ts'`
  → no lines
- `git diff 5f4ba1d -- src/ | grep -E '^\+.*(text-zinc-|FG_SUBTLE|svh|dvh)'` → no lines
- `git diff --unified=0 5f4ba1d -- src/components/Hero.tsx` → confirmed exactly two hunks
  (H1 className/style, line-181 wrapper className)

## Deviations from Plan

None — plan executed exactly as written. All acceptance criteria were verified against
live command output (production build + Playwright), not asserted from memory. Task 3
required zero source changes because the full-matrix run reconciled exactly against the
plan's predicted totals with no residual offender surfaced.

## Issues Encountered

None.

## Open Items — Explicitly Not Performed Here

Per the plan's fence and output spec, the following remain open `human_verification` items
in `05-VERIFICATION.md` and were **not** performed or claimed in this plan:

- The human 1440px visual review.
- The real-iPhone check (the `touch-iphone` WebKit project cannot launch in this sandbox —
  missing `libicu74`/`libxml2`/`libflite1`, requires `sudo npx playwright install-deps`;
  this is a pre-existing environment gap, not a regression introduced here).
- The `svh`/`dvh` decision, the 28 un-gated color declarations, and
  `e2e/motion.spec.ts` — all untouched, as required by the scope fence.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- GAP-01 and GAP-02 are closed. `e2e/containment.spec.ts` is green everywhere, including
  `/`, proving the fix rather than merely asserting it.
- KU-1 through KU-4 (logged in `deferred-items.md` by plan 05-06) remain open,
  design-owner-decision items — out of this plan's fence, untouched.
- The five open `human_verification` items in `05-VERIFICATION.md` (1440px visual review,
  real-iPhone check, `svh`/`dvh` decision, 28 un-gated color declarations,
  `motion.spec.ts` rewrite) remain open — none were pre-empted by this plan.
- No blockers.

---
*Phase: 05-mobile-responsive-retrofit*
*Completed: 2026-07-31*

## Self-Check: PASSED

`.planning/phases/05-mobile-responsive-retrofit/05-07-SUMMARY.md` exists on disk and both
task commits (`df3814c`, `6c02ea0`) are present in `git log`.
