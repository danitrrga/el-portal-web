---
phase: 01-token-foundation
plan: 02
subsystem: design-tokens
tags: [css, tokens, migration, value-equal, components, home-page]
dependency_graph:
  requires: [Phase 1 value-equal token block (--color-ep-* + --shadow-ep-*)]
  provides: [Home-page components referencing value-equal var tokens (TOKEN-01)]
  affects:
    - src/app/page.tsx
    - src/components/Hero.tsx
    - src/components/Navbar.tsx
    - src/components/hero/VCDSection.tsx
    - src/components/hero/McpIntegrationSection.tsx
    - src/components/SystemBlueprintSection.tsx
    - src/components/MethodologyPreviewSection.tsx
    - src/components/CTASection.tsx
    - src/components/DashboardPreview.tsx
    - src/components/animations/PerformanceMetric.tsx
    - src/components/CalloutCard.tsx
    - src/components/ui/button.tsx
tech_stack:
  added: []
  patterns: [var(--color-ep-*) references via inline style / Tailwind arbitrary / top-of-file constants]
key_files:
  created: []
  modified:
    - src/app/page.tsx
    - src/components/Hero.tsx
    - src/components/Navbar.tsx
    - src/components/hero/VCDSection.tsx
    - src/components/hero/McpIntegrationSection.tsx
    - src/components/SystemBlueprintSection.tsx
    - src/components/MethodologyPreviewSection.tsx
    - src/components/CTASection.tsx
    - src/components/DashboardPreview.tsx
    - src/components/animations/PerformanceMetric.tsx
    - src/components/CalloutCard.tsx
    - src/components/ui/button.tsx
decisions:
  - "A4 (PerformanceMetric textShadow): vars KEPT, not reverted. The component is dead code (rendered on no route), so there is no live motion to preserve — TOKEN-04 is trivially satisfied and the runtime var-resolution risk is moot for production."
  - "Two inventory-gap literals not enumerated in 01-RESEARCH (VCDSection today-dot fill #ffffff, SystemBlueprint NEW-badge bg rgba(255,255,255,0.1)) were migrated to byte-exact value-equal tokens."
  - "ACCENT/ACCENT_LIGHT constants orphaned by the alpha-trap fix were removed (dead code created by this migration; per surgical-changes guideline)."
  - "DashboardPreview, PerformanceMetric, CalloutCard are dead code — migrated for static token completeness but render on no route; value-equality rests on static proof, not live visual check."
metrics:
  duration: 50
  completed: "2026-06-13"
  tasks_completed: 3
  tasks_total: 3
  files_changed: 12
---

# Phase 01 Plan 02: Component Token Migration Summary

**One-liner:** Every hardcoded hex/rgba in the 12 home-page-tree files replaced with value-equal `var(--color-ep-*)` / `var(--shadow-ep-*)` references; the live home page (`/`) is pixel- and motion-identical, proven by static gates + browser computed-color checks + a human visual review.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Migrate constant/inline-style/page components | `dc2ce5d` | Hero, Navbar, page.tsx, VCDSection, SystemBlueprint, MethodologyPreview, CTASection |
| 1b | Tokenize two inventory-gap literals | `9862a12` | VCDSection (today-dot fill), SystemBlueprint (NEW-badge bg) |
| 1c | Remove ACCENT constants orphaned by alpha-trap migration | `843bef8` | CTASection, MethodologyPreview, VCDSection |
| 2 | Migrate Tailwind-arbitrary/shadow/glow components | `07be874` | McpIntegrationSection, DashboardPreview, PerformanceMetric, CalloutCard, button.tsx |
| 3 | Whole-page verification (human-verify checkpoint) | — | gates + browser + human review |

## Per-File Changes

**page.tsx** — both `bg-[#02030a]` → `bg-[var(--color-ep-bg-base)]`; the two `#ffffff1a` grid-texture gradient stops → `var(--color-ep-grid-line)`; `#000` mask stop preserved byte-identical.

**Hero.tsx** — main bg + gradient-overlay + mockup-frame bg `#02030a` → `var(--color-ep-bg-base)`; atmospheric radial stops → `--color-ep-atmos-1..6`; `rgba(8,56,133,0)` transparent stop preserved byte-identical; bottom-fade `#000` → `var(--color-ep-fade-black)`; pill bg/border/separator/divider/btn-bg → ep tokens; H1/arrow `#f4f6fb` → `var(--color-ep-fg-strong)`; subheading `#aab3c5` → `var(--color-ep-fg)`; frame border/box-shadow → `--color-ep-frame-border` / `--color-ep-shadow-dark`.

**Navbar.tsx** — nav bg → `--color-ep-nav-bg`; drop shadow → `--color-ep-nav-shadow`; active/inactive link + icon `#f4f6fb`/`#aab3c5` → `--color-ep-fg-strong`/`--color-ep-fg`; mobile menu bg → `--color-ep-mobile-menu-bg`.

**VCDSection.tsx** — top-of-file color constants → var tokens; template-literal alpha traps `${ACCENT}1f` → `var(--color-ep-accent-alpha-12)`, `${ACCENT_LIGHT}cc` → `var(--color-ep-accent-light-alpha-80)`; tick/separator/active-highlight/today-dot-glow → ep tokens; today-dot fill `#ffffff` → `var(--color-ep-fg-strong-white)` (inventory-gap fix); orphaned `ACCENT`/`ACCENT_LIGHT` consts removed.

**McpIntegrationSection.tsx** — outer/inner ring border + radial bg rgba's → `--color-ep-ring-border-outer/-bg-outer/-border-inner/-bg-inner`; logo/H2 `#f4f6fb` → `var(--color-ep-fg-strong)`.

**SystemBlueprintSection.tsx** — palette constants → var tokens; `RULE` → `--color-ep-rule`; CardDecorator `LINE` → `--color-ep-white-dim`; NEW-badge bg `rgba(255,255,255,0.1)` → `var(--color-ep-text-glow-white)` (inventory-gap fix); `#ef4444` friction dot preserved byte-identical; orphaned `ACCENT` removed.

**MethodologyPreviewSection.tsx** / **CTASection.tsx** — section constants → var tokens; `${ACCENT}14`/`${ACCENT}1f` → `var(--color-ep-accent-alpha-08)`/`var(--color-ep-accent-alpha-12)`; CTA top hairline → `--color-ep-hairline`; orphaned `ACCENT` removed.

**DashboardPreview.tsx** *(dead code — see below)* — SVG chart line `stroke="#3B82F6"` → `var(--color-ep-chart-line)`; gradient area-fill stop `rgba(30,64,175,0.3)` → `var(--color-ep-glow-blue-30)`; transparent stop + Tailwind-arbitrary class shadows left as documented out-of-scope exceptions.

**PerformanceMetric.tsx** *(dead code — see below)* — code-bg `#0d1117` → `var(--color-ep-code-bg)`; hover arbitrary shadow → `hover:shadow-[var(--shadow-ep-glow-blue-20)]`; habit-bar shadow → `shadow-[var(--shadow-ep-habit-bar)]`; textShadow animate target colors → `var(--color-ep-glow-blue-40)` + `var(--color-ep-text-glow-white)` (animate structure/transition/delay/"none" branch byte-identical).

**CalloutCard.tsx** *(dead code — see below)* — `bg-[#0a0a0a]` → `bg-[var(--color-ep-callout-bg)]` (value still #0a0a0a); boxShadow rgba's → `--color-ep-glow-blue-25` / `--color-ep-inset-top` / `--color-ep-glow-blue-03`; `font-serif italic` preserved.

**button.tsx** — brand `text-[#f4f6fb]` → `text-[var(--color-ep-fg-strong)]`; brand-link `text-[#aab3c5]`/`hover:text-[#f4f6fb]` → `var(--color-ep-fg)`/`var(--color-ep-fg-strong)`; white-alpha utilities preserved.

## A4 Smoke-Test Outcome (PerformanceMetric textShadow)

**Outcome: vars KEPT (not reverted to literals).**

The plan's A4 guard called for running the dev server and visually confirming the Framer-Motion textShadow scroll-in glow still animates, reverting to literal rgba if Framer Motion fails to resolve the embedded `var()`. During orchestrator browser verification, `PerformanceMetric` was found to be **dead code — imported by no route** (confirmed: `grep PerformanceMetric src/**/*.tsx` returns only its own definition). It therefore renders nowhere and the scroll-in animation never executes in production.

Because there is **no live motion to preserve**, TOKEN-04 (motion-identical) is trivially satisfied regardless of the var-vs-literal choice. The vars were kept to maximize tokenization completeness (TOKEN-01/02). Static value-equality is proven: in-browser, `--color-ep-glow-blue-40` resolves to `#1e40af66` (= rgba(30,64,175,0.4)) and `--color-ep-text-glow-white` to `#ffffff1a` (= rgba(255,255,255,0.1)). **If this component is ever wired into a live page, do a one-time visual check that the glow animates; if Framer Motion does not resolve the vars at runtime, revert those two strings to the literal rgba values.**

## Dead-Code Components

`DashboardPreview`, `PerformanceMetric`, and `CalloutCard` are defined but imported by **no route**. Only **9 of the 12** migrated files render (all on `/`): Navbar, Hero, VCDSection, McpIntegrationSection, SystemBlueprintSection, MethodologyPreviewSection, CTASection, page.tsx, button.tsx. The 3 dead components were migrated for static token completeness; their value-equality rests on the mathematical guarantee (var resolves to identical literal) + passing static gates, not on live visual confirmation. **Open question for the user: wire these into a page, or flag for removal.**

## Verification Results

- `npx tsc --noEmit` — PASSED (no errors)
- `npx eslint` (12 files) — PASSED, 0 errors / **0 warnings** (the 4 unused-var warnings from the alpha-trap orphans were resolved by removing the dead constants)
- `npx next build` — PASSED, all 11 routes compiled (1 pre-existing font-override warning for Special Gothic Expanded One, not introduced here)
- Invalid-CSS guard — PASSED: no `var(--color-ep-…)` immediately followed by two hex chars in any of the 12 files
- Residual-hex grep — PASSED: every remaining match is a documented exception (Hero `rgba(8,56,133,0)`, DashboardPreview `rgba(30,64,175,0)` transparent stop + Tailwind-arbitrary-class shadows, page.tsx `#000` mask stop, `#ef4444` friction dot, slate-*/zinc-* classes, button white-alpha utilities)
- **Browser computed-color proof (live, port 3001):** tokens resolve live; Hero H1 computes to `rgb(244,246,251)` = exactly `#f4f6fb`; Hero `<main>` bg = `rgb(2,3,10)` = `#02030a`; full-page screenshot shows zero visual regression across all live sections
- **Human-verify checkpoint:** approved by user ("approved, looks the same") on 2026-06-13

## Decisions Made

1. **A4 vars kept** — PerformanceMetric is dead code; no live motion to preserve; full tokenization retained. (See A4 section.)
2. **Inventory-gap fixes** — two inline literals the research inventory missed were migrated to byte-exact value-equal tokens (`#ffffff` → `--color-ep-fg-strong-white`; `rgba(255,255,255,0.1)` → `--color-ep-text-glow-white`).
3. **Orphan cleanup** — `ACCENT`/`ACCENT_LIGHT` constants left unreferenced by the alpha-trap fix were removed per the surgical-changes guideline.

## Deviations from Plan

- **A4 path:** plan assumed PerformanceMetric was a live home-page component; it is dead code, so the visual smoke test was unperformable and is moot for production (vars kept rather than the plan's conditional revert).
- **Inventory completeness:** the research §Hardcoded Color Inventory missed two inline literals (VCDSection today-dot fill, SystemBlueprint NEW-badge bg); both migrated to byte-exact tokens.
- **Orphan removal:** the plan said "keep every constant NAME unchanged," but the alpha-trap fix orphaned `ACCENT`/`ACCENT_LIGHT`; removed as dead code per the higher-priority user surgical-changes rule.
- **Execution recovery:** the first executor hit a stream-idle timeout mid-Task-1 with nothing committed; a fresh continuation agent finished the migration (partial work was inspected and confirmed correct before building on it).

## Known Stubs

`DashboardPreview`, `PerformanceMetric`, `CalloutCard` — migrated but rendered on no route (dead code). Tracked as an open question for the user.

## Threat Flags

None — static marketing-site CSS/token refactor. No user input, new dependency, network surface, auth path, or schema change.

## Self-Check: PASSED

- All 12 in-scope files reference value-equal var tokens: CONFIRMED
- Commits `dc2ce5d`, `07be874`, `9862a12`, `843bef8` exist: FOUND
- `tsc` / `eslint` / `next build` pass: PASSED
- Invalid-CSS guard + residual-hex grep: PASSED (only documented exceptions)
- Browser value-equality proof (H1 = #f4f6fb, bg = #02030a) + human visual approval: CONFIRMED
