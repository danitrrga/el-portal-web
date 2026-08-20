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
**Requirements**: I18N-01, I18N-02, I18N-03, I18N-04, I18N-05, I18N-06, I18N-07

**Locked decisions** (design owner, 2026-08-02, after research):

| Decision | Choice | Why |
|---|---|---|
| Detection | Negotiate on `/` only | Google: *"Avoid automatically redirecting users from one language version of a site to a different language version."* Googlebot crawls from the US and sends **no** `Accept-Language`, so blanket redirects can leave one locale permanently unindexed. |
| Precedence | URL prefix → `NEXT_LOCALE` cookie → `Accept-Language` → `en` | An explicit human choice must outrank a browser guess. This is next-intl's native order. |
| Cookie outside `/` | Honoured by a dismissible in-page hint, never by a redirect | Redirecting an English path on a cookie forces `Vary: Cookie` and takes every English route out of full-page CDN caching on an all-static build. The choice is honoured and visible without paying that. Revised 2026-08-19. |
| Switcher placement | Nav on every viewport (desktop row above 768px, hamburger panel below) plus the footer | Revises D-11's desktop-nav-only rule: footer-only on mobile makes changing language a scroll-to-the-bottom action on the viewport where pages are longest. Revised 2026-08-19. |
| Lost wordplay | Recorded in `TRANSLATION-FLAGS.md`, never silently flattened | Spanish here is a re-write in the brand voice, so departure from the English is expected; the failure mode is a line whose effect dies quietly and nobody learns it. Added 2026-08-19. |
| URL shape | `localePrefix: "as-needed"` — `/pricing` (en), `/es/pricing` (es) | Zero existing URLs move; no 301s, no re-crawl, no lost backlinks. |
| Library | `next-intl@^4.13` | Declares `next: ^16.0.0` in `peerDependencies` — real Next 16 support, App-Router-native, RSC-first. |
| Scope | All 8 routes + shared chrome + SEO metadata | Includes legal and changelog — see risks. |
| Register | `tú`, subject pronoun always omitted | Spanish is pro-drop, so "omit the subject" and `tú` are compatible: `Empieza tu primera Versión`, never `Tú empiezas…`. Infinitive for CTAs (`Abrir El Portal`); `tú` for prose. **No `usted` anywhere**; `vosotros` and peninsular vocabulary are fine — Spain-flavoured Spanish is intended, locale code stays `es` for hreflang reach. A first pass locked a fully impersonal register and was revised — it read institutional for a product about personal identity. See `07-RESEARCH.md` §7. |

**Success Criteria** (what must be TRUE):

  1. Visiting `/` with a Spanish-preferring browser serves Spanish; with any other browser, English. No other URL auto-redirects by language.
  2. A visible language switcher exists in the nav on every viewport — the desktop actions row above 768px, the hamburger panel below it — and in the footer on every page. The choice it sets survives navigation and outranks the browser header on subsequent visits.
  3. Every existing English URL resolves unchanged, with no redirect and byte-identical routing. A reader who has explicitly chosen Spanish and then opens an English URL directly is offered the Spanish twin by a dismissible in-page hint — never by a redirect, and never before an explicit choice has been made.
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

    **RESOLVED 2026-08-19 — D-09 stands, full scope.** A deletion was recommended and is not being taken: cutting `/es/changelog` to Spanish chrome over English entry bodies would remove the phase's largest cost and its only permanently recurring one (plan 07-14 in full, most of 07-12, plus a translation step in every future sync), on its lowest-value surface for reaching Spanish readers. It is not taken because the phase requirement is that every user-facing string resolves through the catalogue in both locales, and narrowing that is the design owner's call rather than the executor's — an unanswered question is not a licence to ship less. The recommendation stays available as an override up to the moment Wave 3 begins; taking it later means discarding finished translation work. The entry-count question that hung off this is settled separately: the tree holds **33** entries (2.0.28 down to 1.0.0), measured three times, and plans 07-12/07-14 already derive the count from source rather than asserting it.

**Sequencing note**: listed after Phase 6, but Phase 6 (CSP) and this phase both touch response headers and potentially `app/proxy.ts`. If Phase 6 implements CSP in `proxy.ts`, doing i18n first — or at least writing the CSP aware of a future locale proxy — avoids reworking that file twice.

**Plans:** 9/16 plans executed

Plans:

**Wave 1** — foundation and reference artifacts

- [x] 07-01-PLAN.md — next-intl setup, `/`-only negotiation proxy, `[locale]` restructure of all 8 routes, static-prerender proof, namespace + metadata contracts
- [x] 07-02-PLAN.md — Product glossary derived from the app's shipped `es.json`, plus the binding Spanish voice contract

**Wave 2** *(blocked on Wave 1)* — harness, shared chrome, register bar

- [x] 07-03-PLAN.md — Both-locale Playwright harness (16 routes, mirrored KU suppressions) and the register / parity / locale-aware-Link CI gates
- [x] 07-04-PLAN.md — `common` namespace (Navbar, Footer, CTASection) and the EN / ES language switcher
- [x] 07-05-PLAN.md — `/manifesto` translation, accented-uppercase glyph verification, and the blocking register-approval checkpoint (D-06)

**Wave 3** *(blocked on Wave 2)* — per-surface extraction and translation

- [x] 07-06-PLAN.md — Home part A: Hero, VCDSection, McpIntegrationSection
- [x] 07-07-PLAN.md — Home part B: SystemBlueprintSection, MethodologyPreviewSection
- [x] 07-08-PLAN.md — `/mcp` prose, with every code block left untranslated
- [x] 07-09-PLAN.md — `/pricing`, with the plan badge measured and KU-4 re-measured
- [ ] 07-10-PLAN.md — `/privacy` + `/terms` with the English-governs notice (D-07/D-08)
- [ ] 07-11-PLAN.md — `/features` extraction into the English catalogue (970 lines)
- [ ] 07-12-PLAN.md — `/changelog` extraction (every entry, count derived from source; ISO dates, closed tag keys) and the sync-skill translation step (D-09)

**Wave 4** *(blocked on Wave 3)* — large translations

- [ ] 07-13-PLAN.md — `/features` Spanish copy (single-file translation)
- [ ] 07-14-PLAN.md — `/changelog` Spanish copy, every entry with proven parity against the derived count

**Wave 5** *(blocked on Wave 4)* — SEO

- [ ] 07-15-PLAN.md — Per-locale metadata, `hreflang` + `x-default`, both-locale sitemap, and the `NEXT_PUBLIC_SITE_URL` environment contract (CI variable + build-time assertion)

**Wave 6** *(blocked on Wave 5)* — verification

- [ ] 07-16-PLAN.md — Full both-locale matrix, static-render and routing re-assertion, committed residual-string gate, register/glossary aggregation, suppression reconciliation, human verification pack

**Planning notes** (2026-08-02):

  - `localeDetection` is disabled in next-intl's routing config and re-implemented by hand for the `/` pathname only. next-intl's default middleware negotiates on *every* unprefixed path, which would redirect `/pricing` → `/es/pricing` for a Spanish browser and violate criterion 1.
  - `/pricing` is a Client Component today and cannot export `generateMetadata`; plan 07-01 splits it into a thin server wrapper plus `PricingClient.tsx`.
  - Criterion 6 is evidenced from `.next/prerender-manifest.json` rather than from the build-output symbol: routes with `generateStaticParams` report under the SSG marker rather than the plain static marker, so the symbol changes while the property does not.
  - `07-RESEARCH.md` has no Package Legitimacy Audit table, so plan 07-01 opens with a blocking human package-verification gate before the first install.

**Replanning notes** (2026-08-19, second cross-AI review — `07-REVIEWS.md`):

  - **Wave count moved from 5 to 6.** Plan 07-15 authors metadata and descriptions against final page copy but depended only on 07-06…07-12, so `/features` (07-13) and `/changelog` (07-14) Spanish copy was still moving while their search snippets were being written. 07-13 and 07-14 are now explicit dependencies; 07-15 moved to Wave 5 and 07-16 to Wave 6. One extra wave, bought with Spanish metadata that cannot be written from copy that later changed.
  - **The language switcher, not the proxy, persists an explicit locale choice.** Under `localePrefix: "as-needed"` a reader on `/es` choosing EN navigates to the unprefixed `/`, where the negotiation reads a still-`es` cookie and returns them to `/es` — English unreachable through the site's own control. `LanguageSwitcher` now writes `NEXT_LOCALE` (and expires `NEXT_LOCALE_HINT`) before navigating, and `e2e/i18n-chrome.spec.ts` asserts both directions on URL *and* cookie value.
  - **`LocaleHint` is fixed-position.** `Navbar` and `Footer` are mounted by each page rather than by a layout, so a layout-level hint renders above the nav. Fixed positioning makes placement independent of DOM order. Hoisting the chrome into a shared `SiteChrome` shell was considered and rejected: the eight pages have differing outer wrappers, and reconciling them is out of scope for this phase.
  - **The translation register and marketing-only glossary are one file per plan.** A single shared markdown table is a git conflict or a lost append under parallel wave execution. Nine per-plan files (07-04 included — it owns the shared chrome copy) are aggregated by 07-16.
  - **The residual-string criterion became a committed script** (`scripts/audit-residual-strings.mjs` plus a reasoned allowlist) wired into CI, replacing a one-time manual grep. Its scan surface covers accessibility attributes, default parameter values, data modules and error states — the categories that let `aria-label="Primary"`, `label = "Copy"` and the hero image `alt` survive the original extraction inventory.
  - **`/pricing` has no English-fallback branch.** 07-09's PATH B was deleted: it was not executable within that plan's file scope, and I18N-01 requires the page translated.
