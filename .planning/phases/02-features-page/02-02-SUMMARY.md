---
phase: 02-features-page
plan: "02"
subsystem: features-page
tags: [RSC, features, highlight-grid, CTA, phosphor-icons, tokens]
requires: []
provides:
  - FeaturesHeroSection (RSC hero intro, .display H1, mono eyebrow)
  - HighlightGrid (RSC open line-ruled feature grid, Phosphor Light icons)
  - FeaturesCTASection (RSC closing CTA, APP_URL + /pricing)
affects:
  - src/app/features/page.tsx (will compose these in plan 04)
tech-stack:
  added:
    - "@phosphor-icons/react (Phosphor Light icons, weight='light')"
  patterns:
    - "Open line-ruled grid cells: border-t hairline + pt-6, no card backgrounds (D-05)"
    - "SectionEyebrow helper: mono num · label + h-px rule, all var(--color-ep-*) tokens"
    - "Inline token pattern: var(--color-ep-*) direct in style props, no SCREAMING_SNAKE constants (D-04)"
    - "APP_URL constant: process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.el-portal.app'"
key-files:
  created:
    - src/components/features/FeaturesHeroSection.tsx
    - src/components/features/HighlightGrid.tsx
    - src/components/features/FeaturesCTASection.tsx
  modified: []
key-decisions:
  - "D-04 inline token pattern: no SCREAMING_SNAKE constant block — var(--color-ep-*) referenced directly in style props"
  - "D-05 open grid: border-t hairlines only, no card backgrounds — aligns with blueprint aesthetic"
  - "D-07 V->C->D brief: one terse cell with three-sentence summary, not a re-explanation"
  - "D-09 hero framing: straightforward feature-overview ('here's what El Portal does'), not 'system reads, you decide'"
  - "D-10 CTA: primary variant=brand -> APP_URL ('Open El Portal'), secondary variant=brand-link -> /pricing ('See pricing')"
  - "Phosphor Light for all grid icons: weight='light', not strokeWidth, not lucide-react"
  - "9 highlight cells: temporal system, goals, lab, archives, cinema, daily flow, configurable tempo, pulse, 5 languages — all grounded in features.md"
requirements-completed: [FEAT-02, FEAT-03, FEAT-04, FEAT-05]
metrics:
  duration: "~18 min"
  completed: "2026-06-13"
  tasks: 3
  files: 3
---

# Phase 2 Plan 02: Features Content Sections Summary

Three RSC content components — FeaturesHeroSection, HighlightGrid, FeaturesCTASection — built with inline `var(--color-ep-*)` tokens, Phosphor Light icons, and truthful copy grounded in `features.md`.

## What Was Built

**Task 1 — FeaturesHeroSection** (`db1d69c`)
- RSC `<header>` with mono eyebrow (`Features · 01`, font-mono uppercase tracking-[0.22em]), `.display` H1 `clamp(42px, 4.2vw, 58px)`, and a grounded subhead referencing the temporal system + rooms vocabulary.
- D-09 framing: "Everything El Portal does." — feature-overview, not "the system reads" angle.
- All color via `var(--color-ep-fg-strong)`, `var(--color-ep-fg)`, `var(--color-ep-fg-muted)` — no raw hex.

**Task 2 — HighlightGrid** (`8d8b78b`, lint fix `e429e26`)
- RSC open line-ruled grid: `border-t` hairline (`var(--color-ep-hairline)`) + `pt-6` on each cell, no card backgrounds or full border boxes (D-05).
- `SectionEyebrow` helper pattern ported from methodology — migrated to `var(--color-ep-*)` tokens (no hardcoded hex).
- 9 cells grounded in `features.md`: temporal system (V→C→D, one terse cell per D-07), goals, lab, archives, cinema, daily flow, configurable tempo, pulse, 5 languages.
- Phosphor Light icons from `@phosphor-icons/react`, `weight="light"` — no lucide-react.
- No `installable PWA`, no shipped `Todoist`/`Calendar sync`, no biometrics/focus timer as shipped.
- `md:col-span-2` on Goals and Daily Flow cells for bento-style variation.

**Task 3 — FeaturesCTASection** (`6a7604d`)
- RSC closing CTA adapting `CTASection.tsx` pattern with tokens inlined (no SCREAMING_SNAKE constants, D-04).
- D-10: primary `variant="brand"` Button → `APP_URL` ("Open El Portal"), secondary `variant="brand-link"` Button → `/pricing` ("See pricing").
- `.display` H2 with `clamp(36px, 4.6vw, 58px)`, top hairline gradient, atmospheric `accent-alpha-12` radial backdrop.
- No raw `<button>`, no raw hex.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused `ChartLineUp` import from HighlightGrid**
- **Found during:** ESLint run after Task 2 commit
- **Issue:** `ChartLineUp` was included in the import list but not referenced in the `HIGHLIGHTS` array
- **Fix:** Removed `ChartLineUp` from the `@phosphor-icons/react` import
- **Files modified:** `src/components/features/HighlightGrid.tsx`
- **Commit:** `e429e26`

**Total deviations:** 1 auto-fixed (unused import).
**Impact:** Zero — mechanical cleanup, no behavioral change.

## Verification Results

| Check | Result |
|-------|--------|
| `node tmp-verify-t1.js` (RSC, .display, no hex, ep tokens) | PASS |
| `node tmp-verify-t2.js` (RSC, Phosphor, no lucide, no banned claims, border-t, V->C->D) | PASS |
| `node tmp-verify-t3.js` (RSC, brand+brand-link, /pricing, APP_URL, no raw button, no hex, ep tokens) | PASS |
| `npx tsc --noEmit` — errors from new files | NONE |
| `npx eslint src/components/features/` | 0 errors, 0 warnings |

## Known Stubs

None — all three components are fully wired RSC components with real copy grounded in `features.md`.

## Threat Flags

None — pure static RSC components, no new network endpoints, no auth paths, no file access. The `APP_URL` external link uses `<Link>` without `target="_blank"` (mirrors reviewed `CTASection.tsx` pattern, T-02-02 in plan threat model).

## Self-Check: PASSED

- [x] `src/components/features/FeaturesHeroSection.tsx` exists
- [x] `src/components/features/HighlightGrid.tsx` exists
- [x] `src/components/features/FeaturesCTASection.tsx` exists
- [x] Commits `db1d69c`, `8d8b78b`, `6a7604d`, `e429e26` present in git log
- [x] All 3 node verify scripts pass
- [x] TSC clean, ESLint clean

## Next

Ready for `02-03-PLAN.md` (DeepDiveRow — Pulse + Trends client island sections).
