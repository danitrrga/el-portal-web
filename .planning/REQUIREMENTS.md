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

### Mobile Responsive Retrofit

<!-- Added 2026-07-30. The site is desktop-approved and frozen; this is an additive mobile pass.
     Contract: .planning/codebase/design/RESPONSIVE.md · Findings: .planning/responsive/SURFACES.md
     Verified by the committed Playwright/axe harness (`npm run audit:responsive`). -->

- [x] **RESP-01**: No route scrolls horizontally at any viewport from 320px to 430px — verified by `overflow.spec.ts` across the `reflow-320`, `mobile-360`, `mobile-390`, and `mobile-430` projects
- [x] **RESP-02**: `<body>`'s `overflow-x-hidden` is removed and every overflow it was masking is fixed at source (currently `ReadingLayout.tsx:14` overflows 420px; `/changelog` overflows 27px)
- [x] **RESP-03**: Every interactive target is at least 44×44 CSS px on touch-sized viewports (WCAG 2.2 SC 2.5.5), with the documented inline-link exception — verified by `touch-targets.spec.ts`
- [x] **RESP-04**: `src/app/layout.tsx` exports a `viewport` object with `themeColor` and `colorScheme: 'dark'`, and never sets `maximumScale` or `userScalable: false`
- [x] **RESP-05**: Full-height sections use `dvh` (with a `vh` fallback declaration) rather than `vh`, so iOS Safari's address bar does not clip content. *(Amended after phase 05 UAT item 2: originally specified `svh`. Since every full-height rule is a `min-height` floor, which cannot clip, the original `svh` rationale did not hold — see RESPONSIVE.md § Viewport units.)*
- [x] **RESP-06**: Hand-written `:hover` rules in `globals.css` are wrapped in `@media (hover: hover)` so hover states do not latch on tap
- [x] **RESP-07**: A root `<MotionConfig reducedMotion="user">` makes every Framer Motion animation honour the OS reduced-motion preference
- [x] **RESP-08**: The desktop rendering at ≥768px is byte-for-byte visually unchanged — every fix is additive (mobile-first default + `md:`/`lg:` restoring today's approved values)

### Security Headers

<!-- Added 2026-07-30. Static marketing site: no auth, no DB, no forms, no PII.
     Deliberately excludes nonce-based CSP — it would force dynamic rendering,
     kill CDN caching, and still break Framer Motion's inline style attributes. -->

- [ ] **SEC-01**: `next.config.ts` sets a static (no-nonce) Content-Security-Policy that keeps `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, and a restricted `connect-src`, while **preserving static prerendering of all 8 routes**
- [ ] **SEC-02**: `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` are set, and `poweredByHeader` is disabled
- [ ] **SEC-03**: Dependabot is configured with grouped weekly updates, and CI fails on high-severity production-dependency advisories (`npm audit --omit=dev --audit-level=high`)

### Internationalisation (Phase 7)

- [ ] **I18N-01**: Every user-facing string on all 8 routes and in shared chrome (Navbar, Footer, CTA, cards) resolves through a message catalogue rather than being hardcoded in a component, for both `en` and `es`
- [ ] **I18N-02**: `/` negotiates locale from `Accept-Language`; **no other URL auto-redirects by language**. Precedence is URL prefix → `NEXT_LOCALE` cookie → `Accept-Language` → `en`, so an explicit human choice always outranks a browser guess. Outside `/`, a stored choice is honoured by a dismissible in-page hint offering the other locale's twin URL, never by a redirect, and never shown before a choice has been made
- [ ] **I18N-03**: A language switcher is reachable from every page in the nav at every viewport — the desktop actions row above 768px, the hamburger panel below it — plus the footer, meets the 44px touch target from RESP-03, and persists the chosen locale
- [ ] **I18N-04**: English URLs are unchanged — `localePrefix: "as-needed"` means `/pricing` stays `/pricing` and Spanish lives at `/es/pricing`. No existing URL 301s
- [ ] **I18N-05**: Each page emits `hreflang` alternates for `en`/`es` plus `x-default`, per-locale `<title>`/`<meta description>`/OG tags, and `sitemap.xml` covers both locales
- [ ] **I18N-06**: All 8 routes × 2 locales remain statically prerendered (`○` in build output) — `generateStaticParams` **and** `setRequestLocale` are both present, so no route silently falls back to dynamic rendering
- [ ] **I18N-07**: Spanish copy uses the `tú` register with the subject pronoun always omitted (`Empieza tu primera Versión`, never `Tú empiezas…`), infinitive for CTAs and buttons, and `tú` conjugation for prose. Spain-flavoured Spanish is intended — `vosotros` and peninsular vocabulary are fine. The catalogue contains no `usted`/`ustedes` and no written subject pronouns; register is consistent across every route including legal copy. Any string whose English effect — a pun, a rhythm, a double meaning, a term of art — does not survive into Spanish ships as the best available Spanish AND is recorded in `TRANSLATION-FLAGS.md` for the design owner to re-write by hand

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
| RESP-01 | Phase 5 | Complete |
| RESP-02 | Phase 5 | Complete |
| RESP-03 | Phase 5 | Complete |
| RESP-04 | Phase 5 | Complete |
| RESP-05 | Phase 5 | Complete |
| RESP-06 | Phase 5 | Complete |
| RESP-07 | Phase 5 | Complete |
| RESP-08 | Phase 5 | Complete |
| SEC-01 | Phase 6 | Pending |
| SEC-02 | Phase 6 | Pending |
| SEC-03 | Phase 6 | Pending |
| I18N-01 | Phase 7 | Pending |
| I18N-02 | Phase 7 | Pending |
| I18N-03 | Phase 7 | Pending |
| I18N-04 | Phase 7 | Pending |
| I18N-05 | Phase 7 | Pending |
| I18N-06 | Phase 7 | Pending |
| I18N-07 | Phase 7 | Pending |
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
- v1 requirements: 35 total (17 original + 8 RESP + 3 SEC + 7 I18N)
- Mapped to phases: 35 ✓
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-12*
*Last updated: 2026-08-02 — added I18N-01…I18N-07 (Phase 7, Spanish localization). Previously 2026-07-30 — RESP-01…RESP-08 (Phase 5) and SEC-01…SEC-03 (Phase 6).*
