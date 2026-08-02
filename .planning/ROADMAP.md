# Roadmap: El Portal Hero — Features + Legal Rebrand Milestone

## Overview

This milestone unifies the El Portal marketing site under the ink-blue OKLCH token system and adds a truthful Features page. It starts by migrating the existing Hero and shared landing components off hardcoded hex onto `--color-*` / CSS variable tokens **using the same color values** — a pure, invisible refactor where the home page stays pixel- and motion-identical — so every new surface builds on a reliable token base. (Removing the existing perpetual animations is intentionally NOT part of this milestone; it is deferred to v2 because the top priority is that nothing changes how it looks.) From there it adds a new `/features` page grounded in the real app research (Version → Cycle → Day, Pulse, Lab, Goals, Trends, Archives) and rebrands the Terms and Privacy pages to the token system — leveling Terms up to Privacy's componentized quality and reconciling Privacy's factual claims with the actual app. A final cross-cutting pass verifies the whole site typechecks, lints, builds clean, and stays free of banned anti-patterns.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Token Foundation** - Migrate Hero + shared components to OKLCH/CSS variable tokens using identical hex/rgba values — pixel- and motion-identical (nothing changes how it looks) (completed 2026-06-13)
- [~] **Phase 2: Features Page** — CANCELLED 2026-06-13 (coded design rejected; `/features` route + components deleted). Only surviving change: the Methodology page was relabeled "Features" and its route renamed `/methodology` → `/features`.
- [ ] **Phase 3: Legal Pages Rebrand** - Reskin Terms + Privacy to tokens, level Terms up to Privacy's quality, reconcile claims, meet WCAG AA
- [ ] **Phase 4: Verification & Polish** - Whole-site typecheck, lint, build, and route audit pass clean
- [x] **Phase 5: Mobile Responsive Retrofit** - Every route is comfortable at 320–430px, with the approved desktop design unchanged (7/7 plans executed incl. 2 gap-closure; verification `passed` — 3 goal-level gaps closed and re-measured, 6/6 human-verification items resolved incl. a physical-iPhone check, 1 accepted override OVR-01 for the WCAG-AA colour remediation) (completed 2026-08-01)
- [ ] **Phase 6: Security Headers** - Static CSP + baseline security headers, with static prerendering preserved
- [ ] **Phase 7: Spanish Localization** - Every page readable in Spanish, negotiated from the browser at `/` only, with English URLs unchanged and both locales indexable

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

**Plans**: 2 plans

  - [x] 01-01-PLAN.md — Add the value-equal --color-ep-* token block to globals.css (foundation; no component touched)
  - [x] 01-02-PLAN.md — Migrate the 12 home-page components to reference the value-equal tokens + value-preserving verification

**UI hint**: yes

### Phase 2: Features Page — CANCELLED (2026-06-13)

> **CANCELLED by user.** The features-page design that was coded (plans 02-01…02-04)
> was rejected and reverted — `src/app/features/page.tsx` and its section components
> were deleted. The only change kept from this phase is relabeling the Navbar + Footer
> "Methodology" page to "Features" and renaming its route `/methodology` → `/features`. Requirements
> FEAT-01…FEAT-06 and QUAL-01 are dropped (see REQUIREMENTS.md). Plans below are
> retained for history only and no longer reflect shipped code.

**Goal**: ~~A visitor can reach a new `/features` page that describes El Portal's real, shipped features in the brand's voice and layout, and is driven onward to pricing/get-started.~~ (cancelled)
**Depends on**: Phase 1
**Requirements**: ~~FEAT-01, FEAT-02, FEAT-03, FEAT-04, FEAT-05, FEAT-06, QUAL-01~~ (cancelled)
**Success Criteria** (what must be TRUE):

  1. A visitor can navigate to `/features` from both the site navigation and the footer, and the route renders with no console errors.
  2. The page uses the hybrid layout — hero intro → bento grid of feature highlights → deep-dive rows for headline features → closing CTA — and the CTA links to pricing / get-started.
  3. Every feature claim uses accurate product vocabulary (Version → Cycle → Day, Pulse, Lab, Goals, Trends, Archives) traceable to `.planning/research/app-features/`, with no invented or unshipped features (no "installable PWA", no shipped Calendar/Todoist sync, no unverified hosting city).
  4. The page is on-brand — ink-blue OKLCH tokens, Special Gothic display headings, atmospheric dark surface — and ships correct metadata (title + description).
  5. Entrance/scroll animations follow the brand motion system (GPU-composited transform/opacity, custom easing, staggered entrance) with no perpetual decorative motion.
  6. All site routes (`/`, `/features`, `/manifesto`, `/methodology`, `/changelog`, `/pricing`, `/mcp`, `/terms`, `/privacy`) resolve.

**Plans**: 4 plans (executed then REVERTED — retained for history)

  - [~] 02-01-PLAN.md — Wire Features into Navbar navLinks + repoint Footer Product link (REVERTED; relabel-only change kept)
  - [~] 02-02-PLAN.md — Build the RSC content sections: hero intro, line-ruled highlight grid, closing CTA (REVERTED — deleted)
  - [~] 02-03-PLAN.md — Build the Pulse + Trends deep-dive rows (REVERTED — deleted)
  - [~] 02-04-PLAN.md — Assemble /features route: metadata, hybrid order, architect frame (REVERTED — deleted)

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
**Depends on**: Phase 3 (Phase 2 cancelled)
**Requirements**: QUAL-02
**Success Criteria** (what must be TRUE):

  1. `tsc` (TypeScript typecheck) passes with no new errors.
  2. ESLint passes with no new errors.
  3. `next build` completes successfully.
  4. A final route check confirms every page (`/`, `/features`, `/manifesto`, `/changelog`, `/pricing`, `/mcp`, `/terms`, `/privacy`) loads without console errors.

**Plans**: TBD
**UI hint**: yes

### Phase 5: Mobile Responsive Retrofit

**Goal**: Every route on the site is comfortable to use on a phone — nothing scrolls sideways, nothing is too small to tap, nothing is clipped by the browser chrome — while the approved desktop design at ≥768px stays visually unchanged.
**Depends on**: Nothing (the foundation is already committed — see below)
**Requirements**: RESP-01, RESP-02, RESP-03, RESP-04, RESP-05, RESP-06, RESP-07, RESP-08
**Foundation (already shipped, commits `5b0cc91` + `d1dfce1`)**:

  - `.planning/codebase/design/RESPONSIVE.md` — the LOCKED/CURRENT/DEBT responsive contract
  - `.planning/responsive/SURFACES.md` — surface inventory, dead-code exclusions, 20 findings (several machine-confirmed)
  - `.planning/responsive/AUDIT-BRIEF.md` — the audit-agent contract and 3-wave sequencing
  - `playwright.config.ts` + `e2e/` — the harness that proves each fix (`npm run audit:responsive`)

**Success Criteria** (what must be TRUE):

  1. `npm run audit:overflow` passes on all 8 routes across `reflow-320`, `mobile-360`, `mobile-390`, and `mobile-430`.
  2. `overflow-x-hidden` is gone from `<body>` in `src/app/layout.tsx`, and the overflow it was masking is fixed at source — including `ReadingLayout.tsx:14` (420px) and the 27px `/changelog` overflow that the element sweep could not localize.
  3. `npm run audit:targets` passes — every interactive target is ≥44×44px on touch viewports, including the Navbar hamburger (currently 20×20) and the "Sign Up" CTA (currently 80×32).
  4. `npm run audit:a11y` reports zero axe violations across all 8 routes at mobile viewports, with `target-size` enabled.
  5. `layout.tsx` exports `viewport` with `themeColor` + `colorScheme: 'dark'` and no zoom-blocking properties; full-height sections use `svh`.
  6. Hand-written `:hover` rules in `globals.css` are gated behind `@media (hover: hover)`, and a root `MotionConfig reducedMotion="user"` is in place.
  7. **The desktop design is unchanged.** Every diff is additive — a mobile-first default plus `md:`/`lg:` restoring today's values. Verified by before/after visual review at 1440px.
  8. `tsc`, ESLint, and `next build` still pass, and all 8 routes still prerender static.

**Non-goals**: Deleting the dead component tree (tracked separately); the `priority` → `preload` migration on `HeroAppMockup` unless it blocks a criterion; any desktop redesign.
**Plans**: 7 plans (5 executed; 2 gap-closure plans added 2026-07-31)
Plans:
**Wave 1**

- [x] 05-01-PLAN.md — App shell contract: viewport export, root MotionConfig, hover gating, svh cascade + `min-h-viewport` utility (wave 1)
- [x] 05-02-PLAN.md — Global touch targets: Button size variants, Navbar hamburger/menu, Footer wordmark, CopyButton (wave 1)
- [x] 05-03-PLAN.md — The two confirmed overflow sources: ReadingLayout 420px glow, /changelog 27px H1 (wave 1)
- [x] 05-06-PLAN.md — GAP-03: container-relative overflow assertion (`e2e/containment.spec.ts`), proven RED against unfixed `src/` (wave 1, gap closure)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 05-04-PLAN.md — Page surfaces: svh on all 8 roots, remaining 44px links, full targets/overflow sweep (wave 2)
- [x] 05-07-PLAN.md — GAP-01 + GAP-02: breakpoint-gated hero/features H1 clamp, remove the phone-width dashboard bleed; turns 05-06 green (wave 2, gap closure)

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 05-05-PLAN.md — Remove `overflow-x-hidden`, zero axe violations, full harness + desktop-freeze review (wave 3)

**Cross-cutting constraints:**

- Desktop rendering at 1440px is unchanged

**UI hint**: yes

### Phase 6: Security Headers

**Goal**: The site ships the security headers that actually matter for a static marketing site with no backend, without sacrificing static prerendering or CDN caching.
**Depends on**: Nothing (independent of Phase 5)
**Requirements**: SEC-01, SEC-02, SEC-03
**Success Criteria** (what must be TRUE):

  1. `next.config.ts` sets a **static, no-nonce** CSP including `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, and a restricted `connect-src`.
  2. All 8 routes still prerender as static (`○` in the build output) — a nonce-based CSP would force dynamic rendering and is explicitly rejected.
  3. `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy` are set; `poweredByHeader` is `false`.
  4. The site renders and animates correctly under the CSP — Framer Motion writes inline `style` attributes, so `style-src` must accommodate them.
  5. Dependabot is configured with grouped weekly updates, and CI fails on high-severity production advisories.

**Non-goals**: Nonce-based CSP, `experimental.sri`, COEP, a WAF, CSRF tooling — all rejected as inapplicable or net-negative for a site with no auth, forms, or PII.
**Plans**: TBD
**UI hint**: no

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6
Phases 5 and 6 are independent of each other and of 3/4 — they may run in any order.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Token Foundation | 2/2 | Complete   | 2026-06-13 |
| 2. Features Page | 4/4 | Complete   | 2026-06-13 |
| 3. Legal Pages Rebrand | 0/TBD | Not started | - |
| 4. Verification & Polish | 0/TBD | Not started | - |
| 5. Mobile Responsive Retrofit | 7/7 | Complete   | 2026-07-31 |
| 6. Security Headers | 0/TBD | Not started | - |

### Phase 7: Spanish Localization

**Goal**: A Spanish speaker lands on the site and reads it in Spanish without doing anything, while an English speaker's experience and every existing English URL stay exactly as they are — and Google can find, crawl and index both language versions.
**Depends on**: Phase 6 (see sequencing note below)
**Requirements**: I18N-01, I18N-02, I18N-03, I18N-04, I18N-05, I18N-06

**Locked decisions** (design owner, 2026-08-02, after research):

| Decision | Choice | Why |
|---|---|---|
| Detection | Negotiate on `/` only | Google: *"Avoid automatically redirecting users from one language version of a site to a different language version."* Googlebot crawls from the US and sends **no** `Accept-Language`, so blanket redirects can leave one locale permanently unindexed. |
| Precedence | URL prefix → `NEXT_LOCALE` cookie → `Accept-Language` → `en` | An explicit human choice must outrank a browser guess. This is next-intl's native order. |
| URL shape | `localePrefix: "as-needed"` — `/pricing` (en), `/es/pricing` (es) | Zero existing URLs move; no 301s, no re-crawl, no lost backlinks. |
| Library | `next-intl@^4.13` | Declares `next: ^16.0.0` in `peerDependencies` — real Next 16 support, App-Router-native, RSC-first. |
| Scope | All 8 routes + shared chrome + SEO metadata | Includes legal and changelog — see risks. |

**Success Criteria** (what must be TRUE):

  1. Visiting `/` with a Spanish-preferring browser serves Spanish; with any other browser, English. No other URL auto-redirects by language.
  2. A visible language switcher exists in the nav and footer on every page, and the choice it sets survives navigation and outranks the browser header on subsequent visits.
  3. Every existing English URL resolves unchanged, with no redirect and byte-identical routing.
  4. Every page emits `hreflang` alternates for `en` and `es` plus `x-default`, and `sitemap.xml` lists both locales.
  5. Per-locale `<title>`, `<meta name="description">` and OG/Twitter tags — no page inherits English metadata while rendering Spanish.
  6. All 8 routes × 2 locales still prerender as static (`○` in the build output). No route silently becomes dynamic.
  7. The full Playwright matrix passes for both locales, including the `touch-iphone` project in CI.
  8. No hardcoded user-facing string remains in a component; all copy resolves through the message catalogue.

**Non-goals**: More than two locales; locale-specific pricing or currency; RTL support; translating the app itself (different repo); a paid TMS.

**Known risks / open questions for discuss-phase**:

  - **Static rendering is the sharp edge.** next-intl needs **both** `generateStaticParams` *and* `setRequestLocale`. Omit the latter and it reads `headers()`, silently dropping pages to dynamic — which would undo the all-static build and collide with Phase 6's CSP.
  - **Next 16 renamed `middleware.ts` → `app/proxy.ts`** (Node runtime, routing-scoped). Locale negotiation belongs there. Any Phase 6 CSP work that also lands in `proxy.ts` will share the file — see sequencing.
  - **Changelog is an ongoing cost, not a one-off.** 35 entries / 944 lines, and the `el-portal-changelog` skill syncs new entries from the app repo continuously. Without a translation step in that workflow, the Spanish changelog silently drifts out of parity. Needs a decision: translate on sync, or mark the changelog English-only with a notice.
  - **Legal text carries meaning risk.** `/privacy` + `/terms` are 465 lines where a mistranslation has consequences. Decide whether machine translation is acceptable or whether the Spanish version needs human review — and whether English remains authoritative.
  - **Brand voice.** `.planning/codebase/design/BRAND.md` defines a specific register and anti-words. Those constraints need a Spanish equivalent, or the translation will read like a different product.

**Sequencing note**: listed after Phase 6, but Phase 6 (CSP) and this phase both touch response headers and potentially `app/proxy.ts`. If Phase 6 implements CSP in `proxy.ts`, doing i18n first — or at least writing the CSP aware of a future locale proxy — avoids reworking that file twice.

**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd:plan-phase 7 to break down)
