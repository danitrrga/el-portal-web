# Requirements: El Portal Hero — Features + Legal Rebrand Milestone

**Defined:** 2026-06-12
**Core Value:** Every page reads as unmistakably El Portal (ink-blue brand system) and describes the app truthfully.

## v1 Requirements

Requirements for this milestone. Each maps to a roadmap phase.

### Token Foundation

<!-- Adopt the OKLCH token system on shared surfaces before building new pages on top of them. -->

- [ ] **TOKEN-01**: The Hero and shared landing components reference `--color-*` / CSS variable tokens instead of hardcoded hex values
- [x] **TOKEN-02**: Hardcoded glow values (`rgba(30,64,175,…)`, `rgba(59,130,246,…)`) are tokenized into CSS variables carrying the **same value** — no color change, appearance identical (desaturation/restyle of glows is out of scope this milestone)
- [ ] **TOKEN-04**: The token migration is value-preserving — the home page is pixel- and motion-identical before and after; every token used resolves to the exact current hex/rgba value (verified by manual before/after visual review)

### Features Page — CANCELLED (2026-06-13)

<!-- Phase 2 features page CANCELLED by user: the coded design was rejected and the
     /features route + components were deleted. The only surviving change is the
     Navbar/Footer "Methodology" link relabeled "Features" (still → /methodology).
     FEAT-01…FEAT-06 are dropped, not delivered. -->

- [~] **FEAT-01**: ~~Visitor can reach a new `/features` page from the site navigation and footer~~ — CANCELLED (no /features page)
- [~] **FEAT-02**: ~~The Features page presents the app's real features using accurate product vocabulary…~~ — CANCELLED
- [~] **FEAT-03**: ~~The Features page uses the hybrid layout — hero intro → bento grid → deep-dive rows → closing CTA~~ — CANCELLED
- [~] **FEAT-04**: ~~The Features page CTA drives the visitor to pricing / get-started~~ — CANCELLED
- [~] **FEAT-05**: ~~The Features page is on-brand … and has correct page metadata~~ — CANCELLED
- [~] **FEAT-06**: ~~Features page entrance/scroll animations follow the brand motion system…~~ — CANCELLED

### Legal Pages Rebrand

<!-- Reskin both to tokens; level Terms up to Privacy's componentized quality; legal copy preserved. -->

- [ ] **LEGAL-01**: The Terms page is restyled to the ink-blue OKLCH token system (no `zinc-*` or raw hex), matching the site's atmosphere
- [ ] **LEGAL-02**: The Terms page is restructured into a componentized, designed layout matching Privacy's quality, with all legal copy preserved
- [ ] **LEGAL-03**: The Privacy page is restyled to the ink-blue OKLCH token system, preserving its structure and copy
- [ ] **LEGAL-04**: Privacy page factual claims are reconciled with the real app — unverified claims (e.g. a specific hosting city) are corrected or softened; confirmed claims (PostHog EU, opt-in analytics, export/delete, Gemini) are kept
- [ ] **LEGAL-05**: Both legal pages meet WCAG AA text contrast and use semantic landmarks and a correct heading hierarchy

### Cross-Cutting Quality

- [~] **QUAL-01**: ~~Site navigation and footer include the Features link, and every route (incl. `/features`) resolves~~ — CANCELLED with Phase 2. (General route-resolution health is still covered by Phase 4 / QUAL-02's build gate. Nav/footer now show a "Features" label pointing to `/methodology`.)
- [ ] **QUAL-02**: TypeScript typecheck (`tsc`), ESLint, and `next build` all pass with no new errors
- [ ] **QUAL-03**: No new uses of banned anti-patterns are introduced (raw `<button>`, gradient-clipped text, pure black, `zinc`/`slate` mixing on landing surfaces, `transition: all`, `useAnimationFrame` for decoration)

## v2 Requirements

Deferred to a future milestone. Tracked but not in this roadmap.

### Token Foundation

- **TOKEN-03**: Remove decorative perpetual/expensive motion per brand rules — animated `textShadow` in `PerformanceMetric.tsx` and `animate-pulse` in `DashboardPreview.tsx`. **Deferred from v1** — this is an intentional motion change, and this milestone's top priority is that nothing changes how it looks. Revisit on its own merits.
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
| TOKEN-01 | Phase 1 | Pending |
| TOKEN-02 | Phase 1 | Complete |
| TOKEN-04 | Phase 1 | Pending |
| FEAT-01 | Phase 2 | Cancelled |
| FEAT-02 | Phase 2 | Cancelled |
| FEAT-03 | Phase 2 | Cancelled |
| FEAT-04 | Phase 2 | Cancelled |
| FEAT-05 | Phase 2 | Cancelled |
| FEAT-06 | Phase 2 | Cancelled |
| LEGAL-01 | Phase 3 | Pending |
| LEGAL-02 | Phase 3 | Pending |
| LEGAL-03 | Phase 3 | Pending |
| LEGAL-04 | Phase 3 | Pending |
| LEGAL-05 | Phase 3 | Pending |
| QUAL-01 | Phase 2 | Cancelled |
| QUAL-02 | Phase 4 | Pending |
| QUAL-03 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 17 total
- Mapped to phases: 17 ✓
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-12*
*Last updated: 2026-06-12 — TOKEN-03 deferred to v2 (Phase 1 is strictly value-preserving); traceability + counts updated*
