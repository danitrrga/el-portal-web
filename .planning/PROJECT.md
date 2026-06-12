# El Portal Hero — Marketing Website

## What This Is

The marketing/landing website for **El Portal**, a personal operating system app for high-performers ("the gateway between your current self and your future self"). This repo is the public-facing site only — static, dark-mode-only, content-driven pages (home, manifesto, methodology, changelog, pricing, mcp, terms, privacy). It is NOT the app: no database, no auth, no user sessions, no Supabase. Its job is to explain what El Portal is and convert visitors, in the brand's "Companion" voice — a system that reads and analyzes while the user focuses on important work.

## Core Value

Every page must read as unmistakably El Portal — the ink-blue, disciplined, atmospheric brand system in `.impeccable.md` — and describe the app **truthfully**. If a page looks off-brand or claims a feature the app doesn't actually ship, it has failed.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. Inferred from the existing codebase (see .planning/codebase/). -->

- ✓ Next.js 16 App Router site (RSC by default) with Tailwind v4 + Framer Motion + shadcn/ui — existing
- ✓ Home page with hero, methodology preview, dashboard preview, performance metrics — existing
- ✓ Manifesto, Methodology, Changelog, Pricing, MCP pages — existing
- ✓ Brand design system: ink-blue OKLCH token palette in `globals.css`, Special Gothic Expanded display font, Inter body, JetBrains Mono — existing
- ✓ Terms and Privacy pages (functional, but off-brand on the `zinc-*` scale) — existing
- ✓ Changelog sync workflow from the app repo — existing

### Active

<!-- Current milestone scope. Building toward these. -->

- [ ] New **Features** page describing the app's real features (hybrid layout: hero → bento grid → deep-dive rows → CTA), content grounded in the actual el-portal app
- [ ] **Terms** page rebranded to the ink-blue token system AND restructured to match Privacy's componentized, designed quality (legal copy preserved)
- [ ] **Privacy** page rebranded to the ink-blue token system (structure/copy preserved; verify claims against the real app)
- [ ] **OKLCH token migration (value-preserving)**: convert the existing Hero (and shared components) from hardcoded hex/`rgba()` to `--color-*` / CSS variable tokens **using the same color values** — pixel- and motion-identical, an invisible refactor. (Removing perpetual motion / desaturating glows is an intentional visual change → deferred to v2.)
- [ ] New/changed pages (Features, Terms, Privacy): WCAG AA color contrast, semantic landmarks, brand-compliant motion (per `.impeccable.md`)

### Out of Scope

<!-- Explicit boundaries with reasoning. -->

- App functionality (habit tracking, cycles, AI reports, auth, database) — this is the marketing site, not the app
- Light mode — site is dark-mode-only by design (late-night planning is the primary context)
- Backend/CMS for legal pages — content stays hard-coded; revisit only if legal updates become frequent
- Claiming unverified facts (e.g. "Frankfurt hosting") or unshipped features (Calendar/Todoist sync are "planned", not shipped) — marketing must not overstate
- Rewriting legal wording on Terms/Privacy beyond what the rebrand requires — copy refresh was explicitly not chosen for this milestone
- Adding automated test infrastructure — none exists; verification is typecheck + lint + build + manual review

## Context

- **Brand source of truth:** `.impeccable.md` (brand brief, "The Companion" metaphor — observatory framing was rejected 2026-05-26), `src/app/globals.css` (OKLCH tokens), `CLAUDE.md` (conventions + anti-patterns), `DESIGN.md` (historical).
- **Codebase map:** `.planning/codebase/` (STACK, ARCHITECTURE, STRUCTURE, CONVENTIONS, TESTING, CONCERNS, INTEGRATIONS).
- **App feature research:** `.planning/research/app-features/` — 4 grounded investigations of the real el-portal app (vision/core model, daily tracking, intelligence/analytics, onboarding/data/platform). These are the source for Features-page copy.
- **Real product model:** Version → Cycle → Day framework. Rooms: Dashboard, Lab, Goals, Trends, Archives, Cinema, Pulse. Intelligence via Google Gemini 2.5 Flash. 3-bucket GDPR consent. 5 languages (en/es/zh/pt/fr). Pro tier gates AI insights.
- **Known issues to address in this milestone (from `.planning/codebase/CONCERNS.md`):** Terms/Privacy use `zinc-*` not tokens; animated `textShadow` in `PerformanceMetric.tsx`; `animate-pulse` in `DashboardPreview.tsx`; hardcoded neon-blue glow `rgba(30,64,175,…)` values; possible AA contrast failures on `text-zinc-400/500`.
- **Truthfulness caveats (must not overstate):** Frankfurt/Supabase region NOT verified in app code; not a true installable PWA (separate mobile routes, no manifest); Calendar/Todoist sync + focus timer are "planned", not shipped.
- **Working tree at milestone start:** uncommitted edits to `eslint.config.mjs`, `PerformanceMetric.tsx`, `container-scroll-animation.tsx` (safe lint/type fixes — fold in or commit separately).

## Constraints

- **Tech stack**: Next.js 16 (App Router, RSC default), React 19, Tailwind v4 (`@theme inline`, no `tailwind.config.ts`), Framer Motion, shadcn/ui (New York, neutral), TypeScript strict — match existing; no new heavy deps without reason.
- **Design**: Dark-mode only. Ink-blue palette. No `text-shadow` glows, no gradient-clipped text, no perpetual decorative motion, no `useAnimationFrame` for decoration, no raw `<button>`, no pure black, no `zinc`/`slate` mixing on landing surfaces. (Full anti-pattern list in `CLAUDE.md`.)
- **Color**: Adopt the `--color-*` OKLCH tokens for new/changed surfaces — including migrating the Hero off hardcoded hex (per milestone decision).
- **Performance**: Maintain Core Web Vitals; GPU-composited transforms/opacity only for motion; verify at mobile throttle.
- **Accessibility**: WCAG AA on text contrast; semantic landmarks; visible focus.
- **Verification**: No test suite — rely on `tsc`, ESLint, `next build`, and manual visual/a11y review.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Features content derived from deep multi-agent investigation of the real app | Marketing must be truthful and use real product vocabulary, not invented features | — Pending |
| Features layout = hybrid (hero → bento → deep-dive rows → CTA) | Most editorial; matches home-page atmosphere while staying scannable | — Pending |
| Terms rebrand = reskin + restructure to Privacy's quality; copy preserved | Terms is plain stacked text; Privacy is already well-componentized — level Terms up | — Pending |
| Adopt OKLCH tokens now AND migrate Hero hardcoded hex to tokens | New pages are the right place to start the system; unify the Hero rather than defer | — Pending |
| Phase 1 token migration is strictly **value-preserving** (same hex/rgba) — pixel- and motion-identical | User's top priority: nothing changes how it looks; the migration is an invisible refactor, not a restyle | — Pending |
| Defer perpetual-motion removal (TOKEN-03) to v2 | Removing `animate-pulse`/animated `textShadow` is an intentional motion change that conflicts with the no-visual-change priority | — Pending |
| Map codebase before init (brownfield) | Establish accurate Validated baseline and surface concerns | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-12 after initialization*
