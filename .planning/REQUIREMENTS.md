# Requirements: El Portal Hero — Features + Legal Rebrand Milestone

**Defined:** 2026-06-12
**Core Value:** Every page reads as unmistakably El Portal (ink-blue brand system) and describes the app truthfully.

## v1 Requirements

Requirements for this milestone. Each maps to a roadmap phase.

### Token Foundation

<!-- Adopt the OKLCH token system on shared surfaces before building new pages on top of them. -->

- [ ] **TOKEN-01**: The Hero and shared landing components use the `--color-*` OKLCH tokens instead of hardcoded hex values
- [ ] **TOKEN-02**: Banned neon-blue glow values (`rgba(30,64,175,…)`, `rgba(59,130,246,…)`) are removed or replaced with `--color-accent-subtle`
- [ ] **TOKEN-03**: Decorative perpetual/expensive motion is removed per brand rules — animated `textShadow` in `PerformanceMetric.tsx` and `animate-pulse` in `DashboardPreview.tsx`
- [ ] **TOKEN-04**: The token migration produces no visual regression on existing pages (verified by manual visual review against the locked palette)

### Features Page

<!-- New /features route. Content grounded in .planning/research/app-features/. -->

- [ ] **FEAT-01**: Visitor can reach a new `/features` page from the site navigation and footer
- [ ] **FEAT-02**: The Features page presents the app's real features using accurate product vocabulary (Version → Cycle → Day, Pulse, Lab, Goals, Trends, Archives), grounded in the app research — no invented or unshipped features are claimed
- [ ] **FEAT-03**: The Features page uses the hybrid layout — hero intro → bento grid of feature highlights → deep-dive rows for the headline features → closing CTA
- [ ] **FEAT-04**: The Features page CTA drives the visitor to pricing / get-started
- [ ] **FEAT-05**: The Features page is on-brand (ink-blue OKLCH tokens, Special Gothic display headings, atmospheric dark surface) and has correct page metadata (title + description)
- [ ] **FEAT-06**: Features page entrance/scroll animations follow the brand motion system (GPU-composited transform/opacity, custom easing, staggered entrance — no perpetual decorative motion)

### Legal Pages Rebrand

<!-- Reskin both to tokens; level Terms up to Privacy's componentized quality; legal copy preserved. -->

- [ ] **LEGAL-01**: The Terms page is restyled to the ink-blue OKLCH token system (no `zinc-*` or raw hex), matching the site's atmosphere
- [ ] **LEGAL-02**: The Terms page is restructured into a componentized, designed layout matching Privacy's quality, with all legal copy preserved
- [ ] **LEGAL-03**: The Privacy page is restyled to the ink-blue OKLCH token system, preserving its structure and copy
- [ ] **LEGAL-04**: Privacy page factual claims are reconciled with the real app — unverified claims (e.g. a specific hosting city) are corrected or softened; confirmed claims (PostHog EU, opt-in analytics, export/delete, Gemini) are kept
- [ ] **LEGAL-05**: Both legal pages meet WCAG AA text contrast and use semantic landmarks and a correct heading hierarchy

### Cross-Cutting Quality

- [ ] **QUAL-01**: Site navigation and footer include the Features link, and every route (`/`, `/features`, `/manifesto`, `/methodology`, `/changelog`, `/pricing`, `/mcp`, `/terms`, `/privacy`) resolves
- [ ] **QUAL-02**: TypeScript typecheck (`tsc`), ESLint, and `next build` all pass with no new errors
- [ ] **QUAL-03**: No new uses of banned anti-patterns are introduced (raw `<button>`, gradient-clipped text, pure black, `zinc`/`slate` mixing on landing surfaces, `transition: all`, `useAnimationFrame` for decoration)

## v2 Requirements

Deferred to a future milestone. Tracked but not in this roadmap.

### Token Foundation

- **TOKEN-05**: Full-site token migration of all remaining pages/components (manifesto, methodology, changelog, mcp, pricing) beyond the Hero and shared components
- **TOKEN-06**: Retire/rename legacy tokens (`--color-primary-glow`, `--shadow-glow-*`) and reconcile naming with the OKLCH system

### Features Page

- **FEAT-07**: Per-feature visuals/mockups or short looping product captures for the deep-dive rows (beyond static/CSS visuals)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| App functionality (habits, cycles, AI reports, auth, DB) | This is the marketing site, not the app |
| Light mode | Site is dark-mode-only by design |
| Legal copy rewrite (new wording/voice) | Chosen rebrand was visual + restructure, not a copy refresh |
| CMS/backend for legal pages | Content stays hard-coded; revisit only if updates become frequent |
| Automated test infrastructure | None exists; verification is typecheck + lint + build + manual review |
| Claiming unverified facts or unshipped features | Truthfulness guardrail — e.g. specific hosting city unverified; Calendar/Todoist sync are "planned" |

## Traceability

Which phases cover which requirements. Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TOKEN-01 | — | Pending |
| TOKEN-02 | — | Pending |
| TOKEN-03 | — | Pending |
| TOKEN-04 | — | Pending |
| FEAT-01 | — | Pending |
| FEAT-02 | — | Pending |
| FEAT-03 | — | Pending |
| FEAT-04 | — | Pending |
| FEAT-05 | — | Pending |
| FEAT-06 | — | Pending |
| LEGAL-01 | — | Pending |
| LEGAL-02 | — | Pending |
| LEGAL-03 | — | Pending |
| LEGAL-04 | — | Pending |
| LEGAL-05 | — | Pending |
| QUAL-01 | — | Pending |
| QUAL-02 | — | Pending |
| QUAL-03 | — | Pending |

**Coverage:**
- v1 requirements: 18 total
- Mapped to phases: 0 (roadmap pending)
- Unmapped: 18 ⚠️ (to be mapped by roadmapper)

---
*Requirements defined: 2026-06-12*
*Last updated: 2026-06-12 after initial definition*
