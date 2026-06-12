# Roadmap: El Portal Hero — Features + Legal Rebrand Milestone

## Overview

This milestone unifies the El Portal marketing site under the ink-blue OKLCH token system and adds a truthful Features page. It starts by migrating the existing Hero and shared landing components off hardcoded hex onto `--color-*` / CSS variable tokens **using the same color values** — a pure, invisible refactor where the home page stays pixel- and motion-identical — so every new surface builds on a reliable token base. (Removing the existing perpetual animations is intentionally NOT part of this milestone; it is deferred to v2 because the top priority is that nothing changes how it looks.) From there it adds a new `/features` page grounded in the real app research (Version → Cycle → Day, Pulse, Lab, Goals, Trends, Archives) and rebrands the Terms and Privacy pages to the token system — leveling Terms up to Privacy's componentized quality and reconciling Privacy's factual claims with the actual app. A final cross-cutting pass verifies the whole site typechecks, lints, builds clean, and stays free of banned anti-patterns.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Token Foundation** - Migrate Hero + shared components to OKLCH/CSS variable tokens using identical hex/rgba values — pixel- and motion-identical (nothing changes how it looks)
- [ ] **Phase 2: Features Page** - New truthful `/features` route (hero → bento → deep-dive rows → CTA), linked from nav and footer
- [ ] **Phase 3: Legal Pages Rebrand** - Reskin Terms + Privacy to tokens, level Terms up to Privacy's quality, reconcile claims, meet WCAG AA
- [ ] **Phase 4: Verification & Polish** - Whole-site typecheck, lint, build, and route audit pass clean

## Phase Details

### Phase 1: Token Foundation
**Goal**: The Hero and shared landing components reference the `--color-*` / CSS variable token layer instead of hardcoded values — using the SAME hex/rgba values throughout — so the home page is pixel- and motion-identical before and after. This is a pure, invisible refactor. The single most important constraint: **nothing changes how it looks.**
**Depends on**: Nothing (first phase)
**Requirements**: TOKEN-01, TOKEN-02, TOKEN-04, QUAL-03
**Success Criteria** (what must be TRUE):
  1. The Hero and shared landing components (e.g. `Hero.tsx`, `DashboardPreview.tsx`, `PerformanceMetric.tsx`, `CalloutCard.tsx`) reference `--color-*` / CSS variable tokens instead of hardcoded hex on landing surfaces.
  2. Every migrated value is the SAME color as before — each token used resolves to the exact current hex/rgba value (the `rgba(30,64,175,…)` / `rgba(59,130,246,…)` glow values are tokenized at their current value, NOT changed/desaturated). Where an existing `--color-*` token does not already equal the current value, a value-equal token is used or added.
  3. The home page is visually and behaviorally IDENTICAL before and after — same colors, same glows, same animations and motion (the existing `animate-pulse` and animated `textShadow` are intentionally LEFT in place this phase). Verified by manual before/after visual review.
  4. No new banned anti-patterns are introduced in touched files (raw `<button>`, gradient-clipped text, pure black, `transition: all`, `useAnimationFrame` for decoration). Pre-existing patterns are left untouched this phase.
**Plans**: TBD
**UI hint**: yes

### Phase 2: Features Page
**Goal**: A visitor can reach a new `/features` page that describes El Portal's real, shipped features in the brand's voice and layout, and is driven onward to pricing/get-started.
**Depends on**: Phase 1
**Requirements**: FEAT-01, FEAT-02, FEAT-03, FEAT-04, FEAT-05, FEAT-06, QUAL-01
**Success Criteria** (what must be TRUE):
  1. A visitor can navigate to `/features` from both the site navigation and the footer, and the route renders with no console errors.
  2. The page uses the hybrid layout — hero intro → bento grid of feature highlights → deep-dive rows for headline features → closing CTA — and the CTA links to pricing / get-started.
  3. Every feature claim uses accurate product vocabulary (Version → Cycle → Day, Pulse, Lab, Goals, Trends, Archives) traceable to `.planning/research/app-features/`, with no invented or unshipped features (no "installable PWA", no shipped Calendar/Todoist sync, no unverified hosting city).
  4. The page is on-brand — ink-blue OKLCH tokens, Special Gothic display headings, atmospheric dark surface — and ships correct metadata (title + description).
  5. Entrance/scroll animations follow the brand motion system (GPU-composited transform/opacity, custom easing, staggered entrance) with no perpetual decorative motion.
  6. All site routes (`/`, `/features`, `/manifesto`, `/methodology`, `/changelog`, `/pricing`, `/mcp`, `/terms`, `/privacy`) resolve.
**Plans**: TBD
**UI hint**: yes

### Phase 3: Legal Pages Rebrand
**Goal**: The Terms and Privacy pages read as unmistakably El Portal — restyled to the ink-blue token system, with Terms leveled up to Privacy's componentized quality, factual claims reconciled with the real app, and meeting accessibility standards.
**Depends on**: Phase 1
**Requirements**: LEGAL-01, LEGAL-02, LEGAL-03, LEGAL-04, LEGAL-05
**Success Criteria** (what must be TRUE):
  1. Both the Terms and Privacy pages use only `--color-*` tokens — no `zinc-*` and no raw hex — and match the site's atmospheric dark surface.
  2. The Terms page is restructured into a componentized, designed layout matching Privacy's quality, with all original legal copy preserved verbatim.
  3. The Privacy page preserves its structure and copy, with factual claims reconciled to the real app — unverified claims (e.g. a specific hosting city) are corrected or softened, while confirmed claims (PostHog EU, opt-in analytics, export/delete, Gemini) are kept.
  4. Both legal pages meet WCAG AA text contrast and use semantic landmarks with a correct heading hierarchy.
**Plans**: TBD
**UI hint**: yes

### Phase 4: Verification & Polish
**Goal**: The whole site is provably clean — it typechecks, lints, and builds with no new errors, every route resolves, and no banned anti-patterns slipped in.
**Depends on**: Phase 2, Phase 3
**Requirements**: QUAL-02
**Success Criteria** (what must be TRUE):
  1. `tsc` (TypeScript typecheck) passes with no new errors.
  2. ESLint passes with no new errors.
  3. `next build` completes successfully.
  4. A final route check confirms every page (`/`, `/features`, `/manifesto`, `/methodology`, `/changelog`, `/pricing`, `/mcp`, `/terms`, `/privacy`) loads without console errors.
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Token Foundation | 0/TBD | Not started | - |
| 2. Features Page | 0/TBD | Not started | - |
| 3. Legal Pages Rebrand | 0/TBD | Not started | - |
| 4. Verification & Polish | 0/TBD | Not started | - |
