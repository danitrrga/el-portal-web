# Phase 7: Spanish Localization - Context

**Gathered:** 2026-08-02
**Status:** Ready for planning
**Mode:** `--auto` — every question below was auto-resolved to the recommended
option without prompting. Each selection is logged so it can be audited and
overridden before planning.

<domain>
## Phase Boundary

Deliver the existing marketing site in Spanish alongside English: extract every
user-facing string into a message catalogue, add Spanish copy, negotiate locale at
`/`, and emit the SEO signals that make both versions indexable — without changing
any existing English URL, and without any route losing static prerendering.

This phase translates and routes. It does **not** redesign, restructure content, add
locales beyond `es`, or touch the El Portal application itself (separate repo).

</domain>

<decisions>
## Implementation Decisions

### Already locked before this discussion — do NOT re-open

These were settled during pre-planning research (`07-RESEARCH.md`) and are recorded
in ROADMAP.md's decision table. They are inputs, not open questions:

- **Detection at `/` only.** Never blanket-redirect. Precedence: URL prefix →
  `NEXT_LOCALE` cookie → `Accept-Language` → `en`.
- **`localePrefix: "as-needed"`.** English stays at `/pricing`; Spanish at
  `/es/pricing`. Zero existing URLs move.
- **`next-intl@^4.13`** — verified `next: ^16.0.0` peer dependency.
- **Register: `tú`, subject pronoun always omitted.** Infinitive for CTAs, `tú` for
  prose, no `usted` anywhere. Peninsular Spanish; `vosotros` fine.
- **Locale code `es`** (not `es-ES`) for maximum `hreflang` reach.
- **Scope: all 8 routes + shared chrome + SEO metadata.**

### Product vocabulary

- **D-01: Translate the conceptual primitives, keep proper feature names in English.**
  `Version → Versión`, `Cycle → Ciclo`, `Day → Día` — these appear constantly as
  common nouns in prose and leaving them English would make Spanish sentences
  unreadable. But named features that appear as **UI labels inside the app** —
  `The Lab`, `The Archives`, `Cinema Mode`, `Daily Pulse` — stay in English, with an
  optional first-use gloss (`Cinema Mode (modo cine)`).

  Rationale: a reader who sees `El Laboratorio` on the marketing site and then opens
  an app that says `The Lab` has been actively misled. Marketing copy should not
  invent a vocabulary the product does not use.

  **ASSUMPTION TO VERIFY BEFORE PLANNING:** this rests on the El Portal app being
  English-only UI. That was not verified — the app lives in a separate repo. If the
  app is localized (or will be), this decision flips to full translation and the
  glossary must match the app's own Spanish strings. Planner: confirm first.

- **D-02: Build a glossary file as a first-class deliverable**, not an afterthought.
  Every product primitive and feature name gets one canonical Spanish form (or an
  explicit "do not translate" marker). With ~390 strings across 8 routes, term drift
  is the most likely quality failure, and it is invisible in per-file review.

### Message catalogue organisation

- **D-03: Namespace by route/component, not one flat file per locale.**
  `messages/en/home.json`, `messages/en/pricing.json`, … and the `es` mirror.
  A single 390-key file is unreviewable in a diff, and next-intl supports namespaces
  natively. Shared chrome (Navbar, Footer, CTA, cards) gets its own `common`
  namespace so it is translated once.

- **D-04: Keys are semantic, not content-derived.** `hero.headline`, not
  `hero.theFinalOperatingSystem`. Content-derived keys silently rot the moment the
  English copy is edited.

### How the Spanish copy gets produced

- **D-05: AI-drafted in-phase against the locked register rules, committed as real
  copy — with `/manifesto` and the two legal pages flagged for human read-through
  before merge.**

  Not scaffolded placeholders (that ships a half-broken site), and not
  machine-translated-and-forgotten (that ships copy nobody has read). The register
  rules in `07-RESEARCH.md` §7 are specific enough to draft against, and the
  flagged surfaces are exactly the ones where a wrong nuance costs something.

- **D-06: `/manifesto` is the quality bar, not the last file.** It is 244 lines of
  philosophical second-person prose and the surface the whole `tú` register decision
  was made for. Draft it early and read it before committing to the register across
  the rest of the site — if it reads wrong there, it reads wrong everywhere.

### Legal pages

- **D-07: Translate both, and add a visible notice that the English version is
  authoritative in case of discrepancy.** Standard practice, keeps content parity,
  and removes the meaning risk that made this an open question. Spanish legal copy
  is for comprehension; English governs.

- **D-08: Legal pages get human read-through before merge** (see D-05). Flagged, not
  assumed.

### Changelog

- **D-09: Translate the 35 existing entries, and extend the `el-portal-changelog`
  skill with a translation step in the same phase.**

  This is a deliberate, named scope inclusion rather than creep. The phase's own
  success criteria require locale parity; the changelog is synced continuously from
  the app repo, so without a sync-time translation step the Spanish changelog decays
  from the first sync onward — while still *looking* complete, which is worse than
  visibly missing.

  **Scope boundary:** extend the existing skill's workflow only. Do not redesign the
  changelog, its sync mechanism, or its data model.

  **Fallback if the skill change proves out of reach:** mark `/es/changelog`
  English-only with a visible notice and a link to the English page. Silent drift is
  the one outcome that is not acceptable.

### Language switcher

- **D-10: Text toggle `EN / ES`, no flag icons.** Flags denote countries, not
  languages — a well-documented i18n anti-pattern (which flag represents Spanish?).
  Text is unambiguous and needs no image assets.

- **D-11: Nav on desktop, footer on all viewports, 44px minimum target.** Inherits
  RESP-04 from Phase 5 — the touch-target suite runs against both locales, so a
  switcher below 44px fails CI rather than shipping.

- **D-12: Switching locale preserves the current route.** `/es/pricing` ↔ `/pricing`,
  never a bounce to the homepage. next-intl's `Link`/`usePathname` handle this; the
  planner should verify it against the `as-needed` prefix strategy, where the English
  path has no prefix to swap.

### Claude's Discretion

Under `--auto` these were resolved without prompting and are open to override:

- Exact JSON namespace filenames and directory layout.
- Whether the glossary lives in `.planning/` or beside the message catalogue.
- Visual treatment of the switcher within D-10/D-11's constraints.
- Whether the first-use gloss in D-01 appears once per page or once per site.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### This phase
- `.planning/phases/07-spanish-localization/07-RESEARCH.md` — full pre-planning
  research. §3.2 (static rendering) and §7 (register rules) are load-bearing and
  must be read in full, not skimmed.
- `.planning/ROADMAP.md` § Phase 7 — locked decision table, success criteria,
  non-goals, sequencing note.
- `.planning/REQUIREMENTS.md` — I18N-01 … I18N-07.

### Brand and design constraints
- `.planning/codebase/design/BRAND.md` — register, principles, anti-words. The
  anti-words list is English and needs a Spanish equivalent as part of this phase.
- `.planning/codebase/design/TYPOGRAPHY.md` — Spanish text averages ~15–25% longer
  than English; check the display-font headings that Phase 5 tuned to exact clamps.
- `.planning/codebase/design/RESPONSIVE.md` — the locked responsive contract that
  longer Spanish strings must not break.
- `./CLAUDE.md` — project-wide anti-patterns, still binding.

### Phase 5 constraints this phase must not regress
- `.planning/phases/05-mobile-responsive-retrofit/05-VERIFICATION.md` — 8/8 criteria
  and override OVR-01. Both locales must hold these.
- `.planning/phases/05-mobile-responsive-retrofit/deferred-items.md` — KU-1…KU-4
  known-unfixed containment findings; do not let Spanish copy add more.
- `e2e/containment.spec.ts` — the sweep that catches text overflowing its own box.
  **This is the harness most likely to fire on longer Spanish strings.**

### External
- [Google — Managing multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [next-intl — App Router with i18n routing](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing)
- [next-intl — locale detection](https://next-intl.dev/docs/routing/middleware)
- [Next.js — Renaming Middleware to Proxy](https://nextjs.org/docs/messages/middleware-to-proxy)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`e2e/support/pages.ts`** — `ROUTES`, `gotoSettled`, `settle`. The existing suite
  is route-driven, so extending it to both locales is a data change, not a rewrite.
- **`playwright.config.ts`** — 7 Chromium viewport projects + `touch-iphone` +
  `reduced-motion`, all driven by `LAYOUT_SPECS`. Locale coverage should extend this
  matrix rather than introduce a parallel one.
- **`.github/workflows/responsive-audit.yml`** — already runs the full matrix on
  every PR, including `touch-iphone`. The natural home for the I18N-07 register
  check and the placeholder-parity gate.
- **`src/components/Navbar.tsx` / `Footer.tsx`** — the switcher's two mount points;
  both already carry 44px-compliant targets from Phase 5.

### Established Patterns
- **All copy is currently hardcoded inline in components.** No extraction layer
  exists. ~390 translatable strings across ~6,100 lines of TSX.
- **Type-scale is fluid and breakpoint-gated** (`text-[clamp(…)] md:text-[clamp(…)]`),
  tuned in Phase 5 to exact measured values. Longer Spanish strings interact directly
  with this — heading line counts will change.
- **Static prerendering everywhere** — all 8 routes build as `○`. This is a hard
  constraint shared with Phase 6 (SEC-01).
- **`.display` headings are uppercase Special Gothic Expanded One.** Spanish accented
  capitals (`Á É Í Ó Ú Ñ`) must be checked in that font — missing glyphs or clipped
  diacritics on uppercase display type is a real and easily-missed failure.

### Integration Points
- `src/app/layout.tsx` — locale on `<html lang>`, per-locale metadata, `MotionProvider`
  wrapping. Becomes `app/[locale]/layout.tsx`.
- `app/proxy.ts` (new, Next 16) — locale negotiation. **Shared surface with Phase 6**
  if that phase implements CSP there.
- All 8 `page.tsx` files move under `app/[locale]/`, each needing
  `generateStaticParams` + `setRequestLocale`.
- `sitemap.xml` / metadata exports — per-locale entries and `hreflang` alternates.

</code_context>

<specifics>
## Specific Ideas

- **`/manifesto` hook is the register's proof:** *"A method for becoming yourself"* →
  `Un método para llegar a ser quien eres.` Under the rejected impersonal register
  this was `…llegar a ser uno mismo`, which is what prompted the revision. Read this
  line first once copy exists.
- **Flags are banned on the switcher** (D-10) — languages are not countries.
- **English stays authoritative for legal** (D-07), stated visibly on the page.

</specifics>

<deferred>
## Deferred Ideas

- **Additional locales beyond `es`.** Explicit non-goal. The `[locale]` structure will
  make it cheap later; adding one now is scope creep.
- **Localizing the El Portal app itself.** Separate repo, separate decision. Blocks
  nothing here, but D-01 depends on knowing the answer.
- **Locale-specific pricing or currency.** Explicit non-goal.
- **RTL support.** No RTL locale is planned.
- **Paid TMS (Crowdin / Lokalise / Phrase).** Recorded in `07-RESEARCH.md` §5 as
  disproportionate: they solve multi-translator coordination, which does not exist
  with two locales and one maintainer. Revisit only if locale count or translator
  count grows.
- **Promoting the RESP-07 reduced-motion probe into `e2e/motion.spec.ts`.** Carried
  from Phase 5's outstanding items; unrelated to i18n but still open.

</deferred>

---

*Phase: 07-spanish-localization*
*Context gathered: 2026-08-02*
