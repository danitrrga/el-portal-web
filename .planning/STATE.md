---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed 07-08-PLAN.md
last_updated: "2026-08-20T08:35:56.600Z"
last_activity: 2026-08-20
progress:
  total_phases: 7
  completed_phases: 3
  total_plans: 29
  completed_plans: 21
  percent: 43
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-12)

**Core value:** Every page reads as unmistakably El Portal (ink-blue brand system) and describes the app truthfully.
**Current focus:** Phase 07 — spanish-localization

## Current Position

Phase: 07 (spanish-localization) — EXECUTING
Plan: 9 of 16
Status: Ready to execute

  16 plans across 6 waves. Cross-AI reviewed twice — 2026-08-02, then again on
  2026-08-19 after the plans were revised against the design owner's restated
  i18n requirements. The second review (codex + opencode) found nine defects the
  three gsd-plan-checker iterations had missed, all of them in seams between
  plans rather than inside any one plan: the cross-locale hint had no valid mount
  point, an explicit switch back to English could loop forever, the mobile-panel
  close requirement had no component contract, the human sign-off pack still
  described the opposite of what ships, SEO metadata could be generated before
  the Spanish copy it describes existed, and CI supplied no site origin to build
  canonical URLs from. All nine were verified against the repository before being
  acted on; one reviewer finding was withdrawn as reviewer error.

  Those fixes landed in commit e180d73, re-verified with zero blockers. Two
  residual warnings (a same-wave shared-file collision described in terms an
  executor could not act on, and a stale "last plan to edit this workflow"
  claim) were fixed in place rather than by another planner pass. Requirements
  coverage 7/7 (I18N-01…I18N-07). No open decisions block execution.

  The wave count moved 5 to 6: adding 07-13 and 07-14 to plan 07-15's
  dependencies put a dependency inside 07-15's own wave, so metadata moved to
  wave 5 and final verification to wave 6.

  Nothing implemented yet — no `src/i18n`, no `src/proxy.ts`, next-intl not
  installed. Wave 1 (07-01 routing foundation, 07-02 glossary + voice contract)
  is unblocked and has no dependencies.

  Two gates reach the design owner mid-execution rather than after: 07-05 holds
  a blocking checkpoint to approve the Spanish `tú` register on /es/manifesto
  before Wave 3 propagates it site-wide, and the per-plan translation-flag files
  accumulate the lines whose English effect did not survive, for hand-rewriting.

  Phase 5 closed 2026-08-01: verification `passed`, 7/7 plans, all 3 goal-level
  gaps re-measured closed, 6/6 human-verification items resolved (0 blocked)
  including a physical-iPhone check. One accepted override, OVR-01, covering the
  WCAG-AA colour remediation that deviates from the desktop-freeze criterion.

  Carried into Phase 6 and beyond (none block phase 6):

  - REQUIREMENTS.md FEAT-01…FEAT-06 / QUAL-01 still need disposition (cancel /
    repurpose) after the Phase 2 cancellation.

  - e2e/motion.spec.ts does not assert RESP-07's runtime behaviour; it was proven
    once by a frame-count probe but has no standing regression coverage.

  - KU-4: /pricing comparison table escapes its overflow-hidden wrapper by 77px at
    320px (deferred-items.md) — needs a design decision.

  - 05-REVIEW.md IN-01/IN-02 (two unused constants), WR-02/WR-03 (containment
    sweep suppression breadth and the .slice(0,15) cap).

Last activity: 2026-08-20

Progress: [███████░░░] 72%

## Performance Metrics

**Velocity:**

- Total plans completed: 9
- Average duration: — min
- Total execution time: — hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 | 2 | - | - |
| 05 | 7 | - | - |

**Recent Trend:**

- Last 5 plans: —
- Trend: —

*Updated after each plan completion*
| Phase 01-token-foundation P01 | 8 | 1 tasks | 1 files |
| Phase 02-features-page P01 | 5min | 2 tasks | 2 files |
| Phase 02-features-page P02-02 | 18 min | 3 tasks | 3 files |
| Phase 02-features-page PP02-03 | 18 min | 1 tasks | 1 files |
| Phase 02-features-page P02-04 | 15 min | 2 tasks | 2 files |
| Phase 05 P01 | 9min | 3 tasks | 3 files |
| Phase 05 P02 | 12min | 3 tasks | 5 files |
| Phase 05 P03 | 9min | 2 tasks | 2 files |
| Phase 05 P04 | 12min | 3 tasks | 10 files |
| Phase 05 P05 | 32min | 3 tasks | 11 files |
| Phase 05 P06 | 24min | 2 tasks | 4 files |
| Phase 05 P07 | 38min | 3 tasks | 2 files |
| Phase 07 P01 | 2h24m | 3 tasks | 11 files |
| Phase 07 P02 | 35min | 4 tasks | 6 files |
| Phase 07 P03 | 20min | 3 tasks | 11 files |
| Phase 07 P04 | 53min | 4 tasks | 12 files |
| Phase 07 P05 | 41min | 4 tasks | 7 files |
| Phase 07 P06 | 45min | 3 tasks | 6 files |
| Phase 07 P07 | 15min | 3 tasks | 6 files |
| Phase 07-spanish-localization P08 | 50min | 3 tasks | 6 files |

## Accumulated Context

### Roadmap Evolution

- Phase 7 added 2026-08-02: Spanish Localization (I18N-01…I18N-07). Research
  completed before planning — see `07-RESEARCH.md`. Three decisions locked by the
  design owner: negotiate locale on `/` only (never blanket-redirect, per Google's
  multi-regional guidance and because Googlebot sends no `Accept-Language`);
  `localePrefix: "as-needed"` so no existing English URL moves; scope covers all 8
  routes incl. legal and changelog plus SEO metadata. Library: `next-intl@^4.13`
  (verified `next: ^16.0.0` peer dep). Register: `tú` with the subject pronoun
  always omitted — an initial fully-impersonal rule was revised the same day as
  reading too institutional for a product about personal identity.

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Milestone]: Token Foundation first — migrate Hero + shared components to OKLCH tokens before building new pages on them.
- [Milestone]: **Phase 1 is VALUE-PRESERVING** — same hex/rgba values, pixel- and motion-identical. Nothing changes how it looks. This is the top-priority constraint; the migration is an invisible refactor.
- [Milestone]: Perpetual-motion removal (TOKEN-03: `animate-pulse`, animated `textShadow`) DEFERRED to v2 — it would change motion.
- [Milestone]: Features content derived from grounded app research; truthfulness guardrails enforced (no PWA claim, no shipped Calendar/Todoist sync, verify hosting region).
- [Milestone]: Terms rebrand = reskin + restructure to Privacy's componentized quality; legal copy preserved.
- [Phase 05-01]: svh cascade fallback implemented via @supports (min-height: 100svh) instead of a bare duplicate declaration — production lightningcss minifier collapses duplicate same-property declarations in one rule to the last one, silently deleting the vh floor for non-svh browsers; verified empirically
- [Phase 05-02]: Touch-target AAA skip boundary corrected from width > 768 to width >= 768 to exactly match Tailwind's md: breakpoint (768px), avoiding a forced desktop restyle
- [Phase 05-02]: CopyButton's raw button intentionally not converted to the shared Button component — out of RESP-01..08 scope, risked /mcp styling regression for no responsive gain
- [Phase 05-03]: Used overflow-x-clip (never overflow-x-hidden) on ReadingLayout's root wrapper, per phase-level lock, to contain the restored 1200px glow at the 768-1199px band without breaking position:sticky
- [Phase 05-03]: Did not touch ChangelogItem.tsx — the /changelog H1 fluid-clamp fix alone resolved the 27px overflow across the full 7-project harness matrix, so the plan's contingency edit to the release-heading clamp was unnecessary
- [Phase 05-04]: Reworded globals.css min-h-viewport doc comment to drop literal 'min-h-screen' token, avoiding a false-positive grep regression check — Plan 05-01 wrote a comment documenting what min-h-viewport replaces; the literal string tripped this plan's own zero-hits check even though it was documentation, not a live class
- [Phase 05-04]: Task 3 full-matrix audit sweep required zero source changes -- all 3 named residual candidates (pricing S-12 badge, manifesto/features clamp floors, mcp pre exemption) were already passing — Prior plans (05-01/02/03) already resolved every overflow and touch-target source; Task 3 confirmed this via the complete 8-route x 7-project matrix rather than needing new fixes
- [Phase 05-05]: Empirically verified (temporary JS injection, not shipped) that removing overflow-x-hidden from body does not change ChangelogItem's position:sticky behavior either way -- overflow-x-hidden propagates from body to the viewport in standards mode, so the viewport stays the sticky scrolling box regardless
- [Phase 05-05]: Fixed axe violations beyond the plan's predicted blast radius (Hero.tsx nested main, heading-order in SystemBlueprintSection/MethodologyPreviewSection/features/pricing, color-contrast in 5 files) because a11y.spec.ts runs with target-size enabled and no viewport skip, surfacing pre-existing defects that predate this phase
- [Phase 05-05]: Classified color-contrast fixes (FG_SUBTLE hex, text-zinc-500/600) as an explicitly-documented delta rather than md:-gated, since WCAG contrast violations are not breakpoint-scoped -- the same colors were failing at desktop-1440 too
- [Phase 05-06]: KNOWN_UNFIXED ref field uses short greppable IDs (KU-1..KU-4) instead of full prose, keeping deferred-items.md as the source of the full writeup — Spec file stays lean and the acceptance criterion's grep -F ref-value check passes cleanly against short IDs
- [Phase 05-06]: isExcluded's six false-positive guards were each verified individually against a named offender before being added, not speculatively — SVG internals, ReadingLayout glow, Hero pill arrow track, and Tailwind truncate spans each had a measured false positive that a specific guard removes
- [Phase 05-07]: No sm:/md: restoration added after removing -mr-56 -- the desktop band already computed margin-right:0px from 640px up, so removal with no restore point is the only edit that leaves >=768px untouched
- [Phase 05-07]: /features H1 clamp converted on the strength of the shared gap statement, not on harness evidence -- the containment sweep never flagged /features because its longest token fits its box even at the 42px floor
- [Phase 07-01]: createMiddleware writes NEXT_LOCALE unconditionally via syncCookie even with localeDetection:false, but the value is always derived from the URL's own locale prefix, so it can never disagree with an explicit client choice -- no override needed
- [Phase 07-01]: No src/app/not-found.tsx needed -- [locale] layout's hasLocale guard already returns 404 for unmatched path segments
- [Phase 07-01]: Pricing split shape locked: PricingClient.tsx holds the byte-identical client body, [locale]/pricing/page.tsx is a thin server wrapper -- plan 07-09 works against this shape
- [Phase 07-02]: Ambiguity resolution: nav.* namespace priority resolves same-English-value disagreement in the app's own catalogue (44/747 terms), e.g. Goals->Objetivos over the majority Metas, Trends kept-English over Tendencias
- [Phase 07-02]: Glossary size (747 rows) kept unfiltered beyond the plan's literal syntactic candidate filter, to preserve mechanical/non-curated derivation
- [Phase 07-03]: Migrated 6 components' internal next/link usage to the locale-aware Link (src/i18n/navigation.ts) -- Gate 3 requires the tree to already be free of next/link-plus-internal-href, and no prior plan had wired the navigation.ts contract into a consuming component
- [Phase 07-03]: Gate 2's translation-status inference (es === {} -> PENDING/warn-only; any es key -> enforce fully, bidirectionally) replaces a shared allowlist so nine Wave 3/4 plans across two waves never edit the same config file
- [Phase 07-04]: Fixed a switcher-caused 768px nav overflow (32.6px over in English, 140.6px over in Spanish) via mid-range-only responsive gap classes plus shortening nav.changelog to Cambios (flagged as trigger-4)
- [Phase 07-04]: Fixed src/proxy.ts syncCookie bug: an explicit NEXT_LOCALE=es choice was being silently overwritten to en on every unprefixed English route, defeating LocaleHint's entire purpose; restored the es cookie on unprefixed-route responses only
- [Phase 07-05]: D-06 register checkpoint: approve. /es/manifesto register propagates unchanged to Waves 3-4; later es/manifesto.json sentence edits don't reopen the gate, only a rule change does.
- [Phase 07-05]: Glyph verification Outcome A (no change needed): scripted document.fonts.check + measureText fallback-detection + scrollHeight/clientHeight clipping, with a comparative accented-vs-unaccented control proving the small overshoot is a pre-existing .display line-height property, not accent-specific.
- [Phase 07-05]: Card 02's Version/Cycle copy corrected in two stages outside this plan's own Task 1 draft: cdca004 (upstream, 8 files) removed a fixed-90/15-day factual error; this plan's 3d975dc then replaced the still-vague replacement with the actual concept (Version = period an identity is set for, Cycle = sprint inside it). Binding rule recorded in SPANISH-VOICE.md for Waves 3-4.
- [Phase 07]: 07-06: Version/Cycle/Day deduplicated to one vcd.captions catalogue array read from both the Caption grid and BandLabel so the two renderings cannot drift
- [Phase 07]: 07-06: hero headline translated as 'para el alto rendimiento' (domain) rather than a longer literal people-targeted phrasing, to keep Spanish H1 line count within 1 line of English at 320-430px; nuance loss logged in TRANSLATION-FLAGS.07-06.md
- [Phase 07]: 07-07: src/data/systemBlueprintData.ts deleted — verified dead code (zero importers); its two strings preserved in blueprintHeader.* anyway per plan instruction
- [Phase 07]: 07-07: 'The Lab' stays kept-English in Spanish alongside 'Trends' — GLOSSARY.md's nav.lab entry (nav-priority resolution) overrides the plan's interfaces framing
- [Phase 07-08]: Tool.params/returns stay hardcoded English in both /mcp locales (literal type-signature/wire-shape documentation); only Tool.description is translated — plan interfaces text names only name+description as translate/never-translate; params contain quoted enum literals the real API must match verbatim
- [Phase 07-08]: Fixed a NEW containment offender: ToolRow role-badge (w-8, 32px) overflowed under Spanish 'escritura' at every viewport; widened to w-16 in both locales — not a KU-2 twin, no English counterpart, could not be suppressed per plan's own decision tree

### Pending Todos

[From .planning/todos/pending/ — ideas captured during sessions]

None yet.

### Blockers/Concerns

[Issues that affect future work]

- Phase 7 changelog scope: RESOLVED 2026-08-19. D-09 stands — all 33 entries are
  translated and the `el-portal-changelog` sync skill gains a translation step.
  The recommended cut (Spanish chrome over English bodies) was declined by
  default rather than by preference: narrowing the phase's own coverage
  requirement is the design owner's call, and it remains available as an
  override until Wave 3 starts.

- Privacy hosting-region claim (e.g. a specific city) is NOT verified in app code — confirm with the user / Supabase dashboard before asserting it (affects Phase 3 / LEGAL-04).
- No automated test suite exists — verification relies on `tsc`, ESLint, `next build`, and manual visual/a11y review (affects Phase 4 / QUAL-02).
- touch-iphone (WebKit) Playwright project cannot launch in this sandbox — host deps require sudo (see .planning/phases/05-mobile-responsive-retrofit/deferred-items.md). Not a code regression; all 7 other harness projects pass.
- npm run audit:responsive cannot run: test-results/ and playwright-report/ are root-owned from a prior session, sandbox user has no sudo to clear them (EACCES). Needs sudo rm -rf test-results playwright-report before Phase 5 responsive-audit regression check can run against the new [locale] route tree. Not blocking Wave 2+ execution (affects Phase 07 / final verification wave).

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260613-716 | Footer wordmark rebrand — grain-fill EL PORTAL + canonical brand lockup | 2026-06-13 | 6ccaba4 | [260613-716-footer-wordmark](./quick/260613-716-footer-wordmark/) |
| 260614-edt | Reskin /privacy + /terms to ink-blue brand: ep tokens, .display headings, no zinc/purple/font-mono | 2026-06-14 | e756cad | [260614-edt-redesign-privacy-and-terms-pages-to-fit-](./quick/260614-edt-redesign-privacy-and-terms-pages-to-fit-/) |

## Deferred Items

Items acknowledged and carried forward from previous milestone close:

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| *(none)* | | | |

## Session Continuity

Last session: 2026-08-20T08:35:56.591Z
Stopped at: Completed 07-08-PLAN.md
Resume file: None
