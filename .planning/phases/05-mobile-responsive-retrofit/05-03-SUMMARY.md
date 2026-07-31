---
phase: 05-mobile-responsive-retrofit
plan: 03
subsystem: ui
tags: [tailwind-v4, overflow, fluid-typography, playwright, responsive]

# Dependency graph
requires:
  - phase: 05-mobile-responsive-retrofit (plans 01-02)
    provides: viewport export, MotionConfig, svh cascade, hover gating (01); 44px touch targets on Navbar/Footer/Button (02)
provides:
  - Viewport-safe ReadingLayout decorative glow (no horizontal overflow at any tested width)
  - Breakpoint-gated /changelog H1 font size (no horizontal overflow at any tested width)
  - Both machine-confirmed overflow sources (S-03, F-changelog-overflow) fixed at source
affects: [05-04, 05-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Mobile-first decorative element: w-full md:w-[NNNpx] instead of a bare fixed width, so the desktop value is restored verbatim behind md: rather than narrowed"
    - "overflow-x-clip on a specific wrapper (never body/html, never overflow-x-hidden) to contain a decorative layer without breaking position:sticky or forcing a scroll container"
    - "Fluid-type clamp moved from inline style to breakpoint-gated Tailwind arbitrary classes (text-[clamp(...)] md:text-[clamp(...)]) so a single className carries both the mobile floor and the restored desktop value"

key-files:
  created: []
  modified:
    - src/components/ReadingLayout.tsx
    - src/app/changelog/page.tsx

key-decisions:
  - "Used overflow-x-clip (never overflow-x-hidden) on ReadingLayout's root wrapper, per phase-level lock, to contain the 768-1199px band spill without creating a scroll container or breaking position:sticky"
  - "Did not touch ChangelogItem.tsx — the H1 fix alone resolved the /changelog overflow across the full 7-project harness matrix (320/360/390/430/768/1024/1440), so the plan's contingency edit to the release-heading clamp was not needed"

patterns-established:
  - "Fluid-clamp derivation for mobile H1 floors: slope = 100*(y2-y1)/(x2-x1) vw, intercept = (x1*y2-x2*y1)/(x1-x2) px/16 rem, verified against both RESPONSIVE.md rules (mandatory +Nrem term, max <= 2.5x min)"

requirements-completed: [RESP-01, RESP-02, RESP-08]

# Metrics
duration: 9min
completed: 2026-07-31
---

# Phase 05 Plan 03: Overflow Source Fixes (ReadingLayout + Changelog) Summary

**Eliminated the two harness-confirmed horizontal overflows (420px ReadingLayout glow, 27px /changelog H1) at source, using mobile-first defaults with `md:`-restored desktop values and `overflow-x-clip` instead of `overflow-x-hidden`.**

## Performance

- **Duration:** 9 min
- **Started:** 2026-07-31T08:59:41+02:00 (immediately after 05-02 completion commit)
- **Completed:** 2026-07-31T09:05:12+02:00 (last task commit)
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- `/privacy` and `/terms` no longer overflow horizontally at any tested viewport (320/360/390/430/768/1024/1440) — previously the decorative radial glow overflowed by 420px at 360px
- `/changelog` no longer overflows horizontally at any tested viewport — previously `documentElement.scrollWidth` was 388px against a 361px `clientWidth` at 360px
- Both fixes are additive: the desktop value at ≥768px is restored verbatim behind `md:`, verified character-for-character against the pre-existing values

## Task Commits

Each task was committed atomically:

1. **Task 1: Make the ReadingLayout accent glow viewport-safe** - `8320313` (fix)
2. **Task 2: Give the /changelog H1 a mobile font-size floor** - `699c0d0` (fix)

**Plan metadata:** (this commit)

## Files Created/Modified
- `src/components/ReadingLayout.tsx` - Decorative radial glow: `w-[1200px]` → `w-full md:w-[1200px]`; root wrapper gained `overflow-x-clip` to contain the restored 1200px glow at the 768-1199px band
- `src/app/changelog/page.tsx` - H1 `fontSize` moved out of the inline `style` object onto `text-[clamp(2rem,3.92vw+1.12rem,3rem)] md:text-[clamp(48px,6vw,80px)]`

## Decisions Made
- `overflow-x-clip`, never `overflow-x-hidden`, on `ReadingLayout`'s root — locked by 05-CONTEXT.md; `clip` doesn't create a scroll container, keeps `overflow-y` visible, and doesn't break `position: sticky`
- Left `ChangelogItem.tsx`'s release-heading clamp (`fontSize: "clamp(28px, 2.8vw, 36px)"`) untouched — the plan flagged it as a possible second overflow source, but the H1 fix alone resolved the overflow across the entire harness matrix, so no further edit was needed (verified by re-running the harness before concluding)

## Deviations from Plan

None - plan executed exactly as written. Both files matched the plan's `files_modified` list exactly; no additional edits were required.

## Issues Encountered

**`touch-iphone` (WebKit) Playwright project cannot launch in this sandbox.** `npx playwright install webkit` downloads the binary successfully, but launching it fails host-dependency validation (`Host system is missing dependencies to run browsers`), requiring `sudo apt-get install libicu74 libxml2 libflite1` or `sudo npx playwright install-deps` — both need root, which is out of scope for a code-fixing plan. All 8 routes fail identically with the same host-dependency error (not a per-route overflow finding), confirming this is a pre-existing environment gap, unrelated to any 05-03 code change. Logged to `.planning/phases/05-mobile-responsive-retrofit/deferred-items.md`. The other 7 projects in the required matrix (`reflow-320`, `mobile-360`, `mobile-390`, `mobile-430`, `tablet-768`, `laptop-1024`, `desktop-1440` — 56 tests total) all pass, which fully covers this plan's acceptance criteria.

## User Setup Required

None - no external service configuration required. (Optional, for full harness coverage: someone with sudo on this machine can run `sudo npx playwright install-deps` once to enable the `touch-iphone` WebKit project — see deferred-items.md.)

## Next Phase Readiness

Both machine-confirmed overflow sources (S-03 `ReadingLayout`, F-changelog-overflow) are fixed at source, which was this plan's explicit purpose: unblocking the `overflow-x-hidden` removal from `<body>` in plan 05-05. `npm run build` exits 0 with all 8 routes still `○ (Static)`; `npx tsc --noEmit` and `npm run lint` show no new errors (2 pre-existing unrelated unused-var warnings in `changelog/page.tsx` and `manifesto/page.tsx`, out of this plan's scope).

## Self-Check: PASSED

- FOUND: src/components/ReadingLayout.tsx
- FOUND: src/app/changelog/page.tsx
- FOUND: .planning/phases/05-mobile-responsive-retrofit/deferred-items.md
- FOUND commit: 8320313
- FOUND commit: 699c0d0

---
*Phase: 05-mobile-responsive-retrofit*
*Completed: 2026-07-31*
