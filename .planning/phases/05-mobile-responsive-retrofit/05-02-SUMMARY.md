---
phase: 05-mobile-responsive-retrofit
plan: 02
subsystem: ui
tags: [tailwind, touch-targets, wcag, playwright, shadcn, responsive]

# Dependency graph
requires:
  - phase: 05-mobile-responsive-retrofit
    provides: "05-01 delivered the viewport export, root MotionConfig, gated :hover rules, and the svh cascade — the app-shell contract this plan builds touch-target fixes on top of"
provides:
  - "Mobile-first 44px size variants for every shadcn Button size (default/xs/sm/lg/icon/icon-xs/icon-sm/icon-lg), restored to their pre-phase heights at md: and above"
  - "Navbar hamburger converted from a raw <button> to a Button-based 44x44 control (CLAUDE.md raw-button ban satisfied)"
  - "44px nav wordmark link, 44px mobile-menu rows (navLinks + Log in) with 8px separation"
  - "44px Footer brand wordmark link on phones, byte-identical at >=768px"
  - "44px CopyButton hit area on /mcp code blocks, unchanged 14px icon and pr-20 clearance"
  - "Touch-target harness skip boundary corrected from width > 768 to width >= 768 to match Tailwind's md: breakpoint exactly"
affects: [05-04, 06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Mobile-first h-11/size-11 (44px) default + md:h-* / md:size-* restoring the pre-phase desktop value, applied uniformly across all buttonVariants size keys"
    - "min-h-11 items-center (flex) as the additive pattern for growing a link's tap box without changing its content position, reverted via md:min-h-0"
    - "Icon inside a Button needs an explicit size-* class — buttonVariants' base [&_svg:not([class*='size-'])]:size-4 rule overrides lucide's HTML size={N} attribute"

key-files:
  created: []
  modified:
    - src/components/ui/button.tsx
    - src/components/Navbar.tsx
    - src/components/Footer.tsx
    - src/components/CopyButton.tsx
    - e2e/touch-targets.spec.ts

key-decisions:
  - "AAA touch-target skip boundary changed from width > 768 to width >= 768: Tailwind's md: breakpoint compiles to @media (width >= 48rem)/768px, so at exactly 768px the frozen desktop layout is already active; holding the AAA check there would force a desktop restyle"
  - "CopyButton's raw <button> intentionally NOT converted to the Button component — it is not a nav/hero CTA, conversion is out of RESP-01..08 scope, and converting risks a /mcp styling regression for no responsive gain"

patterns-established:
  - "Every Button size variant carries a 44px mobile floor with an md: restoration — future new size variants should follow the same h-11 md:h-N / size-11 md:size-N shape"

requirements-completed: [RESP-03, RESP-08]

# Metrics
duration: 12min
completed: 2026-07-31
---

# Phase 05 Plan 02: Touch Targets — Button, Navbar, Footer, CopyButton Summary

**Mobile-first 44px size variants added to `buttonVariants` plus hand-rolled 44px fixes for the Navbar hamburger/wordmark/menu rows, Footer wordmark link, and `/mcp` CopyButton — all restored to pre-phase values at `md:` (>=768px)**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-07-31T06:45:00Z (approx.)
- **Completed:** 2026-07-31T06:57:29Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Fixed the touch-target harness's own skip boundary (`> 768` → `>= 768`) so the AAA assertion runs exactly where Tailwind's `md:` breakpoint says desktop begins — a single-line, high-leverage correction that also unblocks Tasks 2-3's own Playwright verification.
- Made all 8 `buttonVariants` size keys 44px on phones (`h-11`/`size-11`) with an `md:` restoring every pre-phase value byte-for-byte — this single file lifts the Hero CTAs, `CTASection`, `MethodologyPreviewSection`, `McpIntegrationSection`, the `/pricing` CTA, and both Navbar buttons above 44px on phones simultaneously.
- Eliminated the last raw `<button>` in `Navbar.tsx` (CLAUDE.md ban / finding S-04), replacing it with a `Button variant="brand-link" size="icon"` control, and fixed the nav wordmark link and all four mobile-menu rows (S-05) to 44px with 8px separation.
- Grew the Footer brand wordmark link and the `/mcp` `CopyButton` hit areas to 44px on phones while leaving `footerColumns` links, `globals.css`, and every desktop rendering path untouched.

## Task Commits

Each task was committed atomically:

1. **Task 1: Align the AAA skip boundary with md:, then make every Button size 44px on mobile** - `d3062a0` (feat)
2. **Task 2: Navbar — Button-based hamburger, 44px wordmark link, 44px mobile menu rows** - `2505d45` (fix)
3. **Task 3: Footer wordmark link and CopyButton to 44px on phones** - `25cdbf7` (fix)

**Plan metadata:** (pending — this commit)

## Files Created/Modified

- `e2e/touch-targets.spec.ts` - Skip boundary changed to `width >= 768` with an inline rationale comment; `AAA_TARGET` and every other assertion untouched
- `src/components/ui/button.tsx` - All 8 `size` variants now `h-11`/`size-11` mobile-first with `md:` restoring the exact pre-phase value
- `src/components/Navbar.tsx` - Raw `<button>` hamburger replaced with `Button size="icon" className="md:hidden"`; nav wordmark link gets `min-h-11 md:min-h-0`; mobile-menu rows switch `block ... py-2` → `flex min-h-11 items-center`; container `space-y-1` → `space-y-2`
- `src/components/Footer.tsx` - Brand wordmark `Link` gets `inline-flex min-h-11 items-center ... md:inline-block md:min-h-0`
- `src/components/CopyButton.tsx` - Hit box `h-7 w-7` → `size-11 md:size-7`; inner icon spans (`h-3.5 w-3.5`) unchanged

## Decisions Made

- Corrected the touch-target harness's skip boundary as the very first task (Task 1) since it gates all downstream verification for Tasks 2 and 3 — matches the plan's stated dependency.
- Left `CopyButton`'s raw `<button>` element as-is (not converted to the shared `Button` component) per explicit plan scope: it's not a nav/hero CTA and conversion risked an unrelated `/mcp` regression.
- Kept `.wordmark__layer`'s `clamp(1.9rem, 8.6vw, 7.6rem)` in `globals.css` deferred, per 05-CONTEXT.md and the plan's explicit instruction not to touch it in this plan.

## Deviations from Plan

None - plan executed exactly as written. All three tasks were implemented per the `<action>` blocks verbatim, including the exact Tailwind class strings specified for each `buttonVariants` size key.

## Issues Encountered

None. All automated verification commands (`npx tsc --noEmit`, `npm run typecheck:e2e`, `npm run lint`, `npm run build`, and the `mobile-360`/`mobile-430`/`tablet-768`/`desktop-1440` Playwright projects) passed exactly as the plan predicted:

- `mobile-360` full-route run: only `/features` ("Read the manifesto") and `/mcp` ("Open Settings") remain undersized — both explicitly named in the plan as owned by plan 05-04, not this plan.
- `mobile-430`: same two remaining, consistent with the plan's scope.
- `tablet-768` and `desktop-1440`: all touch-target tests report **skipped**, not failed, confirming the `width >= 768` boundary correction works as intended.
- `git diff -U0 443a4dc..HEAD -- src` was manually audited line-by-line: every removed class token is either replaced by an `md:`-restored equivalent or lives inside an `md:hidden` subtree (the mobile hamburger button and mobile-menu markup). No change touches an element visible at >=768px.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- RESP-03 substantially satisfied for all Button-based targets and both global surfaces (Navbar, Footer); the only remaining undersized touch targets sitewide are the Hero announcement pill, `/mcp` "Open Settings" link, and `/features` "Read the manifesto" link — all explicitly scoped to plan 05-04.
- RESP-08 upheld throughout: every changed utility is either mobile-first + `md:`-restored, or confined to an `md:hidden` subtree; desktop rendering at 1440px is unchanged (confirmed via Playwright and manual diff audit).
- The touch-target harness's assertion strength is unchanged (still 44px, still runs on 5 projects including the real `touch-iphone` device) — only its skip boundary was corrected to match `md:` exactly.
- Plan 05-04 can now proceed against a clean touch-target baseline with only its own three named targets remaining.

---
*Phase: 05-mobile-responsive-retrofit*
*Completed: 2026-07-31*

## Self-Check: PASSED

All 5 modified files confirmed present on disk; all 3 task commits (`d3062a0`, `2505d45`, `25cdbf7`) confirmed present in git history.
