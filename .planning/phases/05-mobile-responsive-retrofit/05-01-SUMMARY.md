---
phase: 05-mobile-responsive-retrofit
plan: 01
subsystem: ui
tags: [nextjs, tailwind-v4, framer-motion, viewport, accessibility, lightningcss]

# Dependency graph
requires: []
provides:
  - "viewport export (themeColor + colorScheme, no zoom-blocking properties) in src/app/layout.tsx"
  - "src/components/MotionProvider.tsx — root MotionConfig reducedMotion=user wrapper"
  - "hover-gated hand-written CSS rules in globals.css (4/4 wrapped in @media (hover: hover))"
  - "svh cascade fallback on body, minifier-safe via @supports"
  - "@utility min-h-viewport (vh base + @supports svh enhancement) for plan 05-04 to consume"
affects: ["05-02", "05-03", "05-04", "05-05"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "svh/vh cascade fallback MUST use @supports (min-height: 100svh), never a bare duplicate min-height declaration — the production lightningcss minifier collapses same-property duplicates to the last one and silently deletes the fallback"
    - "hand-written :hover CSS rules in globals.css must be wrapped in @media (hover: hover); Tailwind v4 hover: utilities in TSX are already auto-gated and need no change"

key-files:
  created:
    - src/components/MotionProvider.tsx
  modified:
    - src/app/layout.tsx
    - src/app/globals.css

key-decisions:
  - "svh fallback implemented via @supports (min-height: 100svh) instead of the plan's literal bare two-declaration cascade — verified empirically that lightningcss's production minifier collapses duplicate min-height declarations to the last one, destroying the vh floor for non-svh browsers"

patterns-established:
  - "Progressive-enhancement CSS in this repo (any future 'declare twice, let unsupported browsers ignore the second' pattern) must be wrapped in @supports, not written as bare duplicate declarations, because this build pipeline's minifier does not preserve them"

requirements-completed: [RESP-04, RESP-05, RESP-06, RESP-07, RESP-08]

# Metrics
duration: 9min
completed: 2026-07-31
---

# Phase 05 Plan 01: App-shell mobile contract Summary

**Next.js `viewport` export with dark themeColor, a root `MotionConfig reducedMotion="user"` provider, hover-gated hand-written CSS, and a minifier-safe `svh` cascade + `min-h-viewport` utility — all inert at >=768px.**

## Performance

- **Duration:** 9 min
- **Started:** 2026-07-31T06:40:34Z
- **Completed:** 2026-07-31T06:49:25Z
- **Tasks:** 3 completed
- **Files modified:** 3 (1 created, 2 modified)

## Accomplishments
- `src/app/layout.tsx` exports `viewport: Viewport` with `themeColor: "#02030a"` and `colorScheme: "dark"` (no `maximumScale`/`userScalable`/`viewportFit`), and the dead `fonts.googleapis.com` Material Symbols stylesheet link is deleted
- New `src/components/MotionProvider.tsx` wraps the whole app in `<MotionConfig reducedMotion="user">`, so every Framer Motion transform/layout animation now honours the OS reduced-motion preference (previously only `.wordmark` did)
- All 4 hand-written `:hover` rules in `globals.css` (scrollbar thumb, `.card-glow`, `.wordmark` outline, `.wordmark` fill) are wrapped in `@media (hover: hover)` so a tap on a touch device can no longer latch a hover state; zero `.tsx` files touched (Tailwind v4 already auto-gates `hover:` utilities)
- `body` and the new `@utility min-h-viewport` both carry a minifier-safe `svh` floor via `@supports (min-height: 100svh)`, ready for plan 05-04 to apply to the eight page roots

## Task Commits

Each task was committed atomically:

1. **Task 1: Add the viewport export and delete the unused Google Fonts CDN link** - `b2c04fe` (feat)
2. **Task 2: Wire a root MotionConfig reducedMotion="user" provider** - `27089b9` (feat)
3. **Task 3: Gate hand-written :hover, add the svh cascade, add the min-h-viewport utility** - `4fa5131` (feat)

_No TDD tasks in this plan — all three are `type="auto"` structural/CSS changes with no `<behavior>` block._

## Files Created/Modified
- `src/app/layout.tsx` - added `viewport` export, removed dead Material Symbols CDN `<link>`, wired `MotionProvider` around `{children}`
- `src/components/MotionProvider.tsx` - new client component: `<MotionConfig reducedMotion="user">{children}</MotionConfig>`
- `src/app/globals.css` - 4 hand-written `:hover` rules gated behind `@media (hover: hover)`; `body` and new `@utility min-h-viewport` carry an `@supports`-guarded `svh` cascade

## Decisions Made
- **svh cascade via `@supports`, not a bare duplicate declaration.** RESPONSIVE.md and the plan both specified "two declarations, no `@supports` needed," reasoning that `svh`-ignorant browsers simply drop the unrecognized second declaration. That reasoning is correct for the *browser*, but the production build's `lightningcss` minifier runs first and collapses two same-property declarations within one rule down to the last one (verified empirically with a standalone `lightningcss.transform({ minify: true })` call and confirmed in the actual `next build` output: `body{color:#cbd5e1;min-height:100svh}` with the `vh` floor gone). That silently deletes the fallback for the ~5% of browsers without `svh` support before it ever reaches the client. Wrapping the enhancement in `@supports (min-height: 100svh) { ... }` is a genuinely different rule (not a duplicate property in the same rule), which `lightningcss` does not collapse — verified both in a standalone transform test and in the real `.next/static/chunks/*.css` output, where both `body{min-height:100vh}` and `@supports (min-height:100svh){body{min-height:100svh}}` now survive intact. Applied the same fix to `@utility min-h-viewport`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] svh cascade rewritten as `@supports`-guarded rule instead of bare duplicate declaration**
- **Found during:** Task 3 (svh cascade + min-h-viewport utility)
- **Issue:** The plan's literal instruction ("two declarations, no `@supports` needed... browsers without svh drop the second and keep the first") does not survive this repo's production build. `next build` runs Turbopack + `lightningcss` with `minify: true` and no `browserslist`/targets configuration; `lightningcss`'s minifier treats two same-property declarations in one rule as fully redundant and keeps only the last, since it has no instruction that any target browser might not understand the later value. Verified with a standalone `lightningcss.transform()` call reproducing the exact collapse, and confirmed the actual `next build` output for the plan's literal draft showed `body{color:#cbd5e1;min-height:100svh}` — the `vh` floor silently gone.
- **Fix:** Replaced the bare duplicate `min-height: 100vh; min-height: 100svh;` in both the `body` rule and the new `@utility min-h-viewport` with `min-height: 100vh;` followed by a separate `@supports (min-height: 100svh) { ... min-height: 100svh; ... }` block. `@supports` blocks are not subject to the same-rule duplicate-property collapse, so both values now survive minification and appear in the compiled `.next/static/chunks/*.css` output as two intact rules.
- **Files modified:** `src/app/globals.css`
- **Verification:** Standalone `lightningcss` transform test confirmed the collapse and the fix; `npm run build` + `grep -o 'body{[^}]*}' .next/static/chunks/*.css` shows both `body{color:#cbd5e1;min-height:100vh}` and `@supports (min-height:100svh){body{min-height:100svh}}`; same pattern confirmed for `.min-h-viewport`.
- **Committed in:** `4fa5131` (Task 3 commit)

**2. [Verification-script correction, no code change] Adjusted the plan's literal grep-based build/CSS-path checks**
- **Found during:** Task 2 and Task 3 verification
- **Issue:** The plan's automated check `grep -cE '^\s*(○|◐)'` assumes route-table lines start with whitespace directly before the status glyph, but Next.js 16.1.6's route table prefixes each line with box-drawing tree characters (`┌`, `├`, `└`), so the anchored regex matches zero lines even though all 8+ routes are correctly `○ (Static)`. Separately, the plan's check `grep -rq 'min-h-viewport' .next/static/css` assumes webpack's output directory; this repo builds with Turbopack, which writes compiled CSS to `.next/static/chunks/*.css` instead — `.next/static/css` does not exist.
- **Fix:** No source change. Verified the same underlying facts (all 8 routes prerender static; `.min-h-viewport` is present in the compiled CSS) using the correct paths/patterns for this Next 16.1.6 + Turbopack build (`grep -cE '(○|◐)'` without the anchor, and `.next/static/chunks/*.css` instead of `.next/static/css`).
- **Files modified:** none
- **Verification:** `npm run build` output manually inspected: 9 route lines all show `○`; `grep -rq 'min-h-viewport' .next/static/chunks` succeeds.
- **Committed in:** n/a (verification-only, no code change)

---

**Total deviations:** 1 auto-fixed code change (1 Rule 1 bug), 1 verification-script correction (no code impact)
**Impact on plan:** The `@supports` rewrite is essential for RESP-05 to actually work in production — without it, the entire svh-cascade fix would have been silently inert for its target browsers. No scope creep; both `body` and `min-h-viewport` still land on exactly the same visual/behavioral outcome the plan intended, just via a minifier-safe mechanism.

## Issues Encountered
None beyond the deviation documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `min-h-viewport` utility is compiled and available; plan 05-04 can swap the eight page roots off `min-h-screen` onto it.
- `MotionProvider` is wired at the root; its runtime reduced-motion behavior is verified structurally (client boundary wraps `children`, all 8 routes still `○ (Static)`) but not asserted end-to-end by `e2e/motion.spec.ts` (which only checks for banned perpetual `animation-iteration-count: infinite`, not `MotionConfig` behavior) — this is expected per the plan's own guidance and remains unverified until a future manual/real-device check.
- `overflow-x-hidden` deliberately remains on `<body>` — its removal belongs to plan 05-05, after the overflow sources it masks are fixed in plans 05-03 and 05-04.
- Desktop rendering at 1440px is unchanged: `desktop-1440` Playwright project shows the identical pre-existing 8 failed / 16 passed / 8 skipped result as the recorded pre-plan baseline (the 8 failures are pre-existing `heading-order` axe findings, out of this plan's scope).
- No blockers for 05-02 through 05-05.

---
*Phase: 05-mobile-responsive-retrofit*
*Completed: 2026-07-31*

## Self-Check: PASSED

- FOUND: src/components/MotionProvider.tsx
- FOUND: .planning/phases/05-mobile-responsive-retrofit/05-01-SUMMARY.md
- FOUND: b2c04fe (Task 1 commit)
- FOUND: 27089b9 (Task 2 commit)
- FOUND: 4fa5131 (Task 3 commit)
