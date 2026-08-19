---
phase: 07-spanish-localization
plan: 05
subsystem: i18n
tags: [next-intl, i18n, spanish, register, typography, glyph-verification]

# Dependency graph
requires:
  - phase: 07-01
    provides: "next-intl routing, src/i18n/{routing,navigation,request}.ts, [locale] route tree, generateStaticParams for en/es"
  - phase: 07-02
    provides: "SPANISH-VOICE.md register rules, GLOSSARY.md product vocabulary, TRANSLATION-FLAGS.md ownership contract"
provides:
  - "/manifesto fully catalogue-driven in both locales (src/messages/{en,es}/manifesto.json), the phase's approved register-quality reference"
  - "D-06 register approval (decision: approve) — Waves 3-4 propagate this register unchanged"
  - "SPANISH-VOICE.md ACCENTED DISPLAY TYPE section: scripted Outcome A verdict (no change needed), removing typography risk from every later .display heading"
  - "SPANISH-VOICE.md PRODUCT TRUTHFULNESS section: binding rule — never state Version/Cycle as a fixed duration, describe what they are"
  - "TRANSLATION-FLAGS.07-05.md (6 rows), glossary-additions/07-05.md (0 coinages, documented)"
affects: [07-06, 07-07, 07-08, 07-09, 07-10, 07-13, 07-14, 07-16]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "manifesto/page.tsx reads PRINCIPLES/ACTS via t.raw('principles')/t.raw('acts') rather than per-key lookups, keeping them ordered arrays in the catalogue so the parity gate can compare array lengths; the render's p.act === act.name filter runs entirely within one locale's own catalogue values, so translating act names per locale is safe as long as the two fields agree within that locale"
    - "Scripted glyph verification via page.evaluate: document.fonts.check per-character (not one aggregate boolean) + canvas measureText width comparison across 3 font stacks (fallback detection) + scrollHeight-vs-clientHeight (clipping), with a comparative accented-vs-unaccented control that the task text didn't literally require but the measurement demanded"

key-files:
  created:
    - .planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-05.md
    - src/messages/glossary-additions/07-05.md
  modified:
    - "src/app/[locale]/manifesto/page.tsx"
    - src/messages/en/manifesto.json
    - src/messages/es/manifesto.json
    - .planning/codebase/design/SPANISH-VOICE.md

key-decisions:
  - "D-06 register checkpoint: approve. Propagates the tu register, as applied on /es/manifesto, unchanged to Waves 3-4. Later edits to es/manifesto.json in subsequent phases are delegated and do not reopen this gate unless a rule changes, not a sentence."
  - "Glyph verification Outcome A (verified, no change needed): all 13 probed accented characters render in the real Special Gothic Expanded One face, no fallback substitution (147px vs ~122.6px measured width), and — critically — a comparative control proved the 3px/6px scrollHeight-vs-clientHeight overshoot is identical for accented and unaccented ALL-CAPS text, meaning it's a pre-existing .display line-height:1.02 property already shipped for English, not something Spanish accents make worse. No subsets edit, no per-instance padding, no copy rule, and the register/typography decisions stayed decoupled for this plan."
  - "Card 02's body came from outside this plan's own Task 1 commit: cdca004 (orchestrator, both en/es, 8 files) first removed a factual error (Version/Cycle stated as fixed 90/15-day durations, which the app treats as user-chosen defaults); a same-session follow-up refinement (this plan, commit 3d975dc) then replaced cdca004's still-vague replacement wording with the actual concept (a Version is the period an identity is set for; a Cycle is a sprint inside it targeting that identity's problems and skills). The binding rule for both corrections is recorded in SPANISH-VOICE.md's PRODUCT TRUTHFULNESS section for Waves 3-4 to read."
  - "'Companion' (BRAND.md's core metaphor) translated directly as 'compañero' with no glossary entry — not an app product noun, and the design owner reviewed this exact rendering ('Un compañero, no un entrenador') as part of the D-06 checkpoint read-through."

requirements-completed: [I18N-01, I18N-07]

# Metrics
duration: ~41min (across the pre-checkpoint work, the D-06 human pause, and the post-approval correction round)
completed: 2026-08-19
---

# Phase 07 Plan 05: /manifesto Register Proof Surface Summary

**Extracted /manifesto into the i18n catalogue, drafted and got D-06 approval for the phase's Spanish `tú` register on its hardest surface, proved by script (not eyeball) that Special Gothic Expanded One renders accented uppercase cleanly with zero Spanish-specific clipping risk, and — via two rounds of post-checkpoint correction — replaced a factual error about fixed Version/Cycle durations with the actual product concept in both locales.**

## Performance

- **Duration:** ~41 min (`d2824d8` 21:54:45Z → `5bf5758` 22:35:55Z), spanning the D-06 checkpoint pause and two rounds of coordinator-directed correction after approval
- **Tasks:** 4 (Task 1 auto, Task 2 auto, Task 3 `checkpoint:decision` — blocking, resolved `approve` — Task 4 auto)
- **Files modified:** 7 across all commits (2 created: `TRANSLATION-FLAGS.07-05.md`, `glossary-additions/07-05.md`; 5 modified, one of them — `SPANISH-VOICE.md` — touched across 3 separate commits as the register/glyph/truthfulness sections each landed)

## Accomplishments

- `src/app/[locale]/manifesto/page.tsx` reads all copy via `getTranslations('manifesto')`, `t.raw('principles')`/`t.raw('acts')` for the two ordered arrays; zero hardcoded user-facing strings remain; stays a Server Component; `setRequestLocale` untouched
- `src/messages/{en,es}/manifesto.json`: 7 principles × 3 acts + hero H1/paragraph, key-identical, array-length-equal (Gate 2 enforces this now that `es` left `{}`)
- Register drafted against `SPANISH-VOICE.md`: no written subject pronoun anywhere, locked hook `Un método para llegar a ser quien eres.`, every product noun (Identidad, Hábitos, Versión, Ciclo, Día, Sistema, Fricción, Patrones, Correlaciones, Señales, Sprint) resolved via `GLOSSARY.md`
- D-06 checkpoint: design owner read the hook, all 7 cards, and Task 2's glyph verdict on the production build at `/es/manifesto`, and approved — Waves 3-4 propagate this register unchanged
- Accented-uppercase glyph rendering measured, not assumed: `document.fonts.check` per character (13/13 true), a `measureText` fallback-detection comparison across 3 font stacks, and a `scrollHeight`/`clientHeight` clipping measurement with an accented-vs-unaccented comparative control — Outcome A, no code change needed, verdict written into `SPANISH-VOICE.md`
- Two-stage correction to Card 02's Version/Cycle copy, both verified against the register gate and rebuilt: first removing a fixed-duration factual error (upstream commit `cdca004`), then replacing the vague replacement wording with the actual product concept (this plan's `3d975dc`)
- Wordplay check: 6 rows flagged in `TRANSLATION-FLAGS.07-05.md` (the hook's compression loss, a paired-subject symmetry the register's pro-drop rule can't fully replicate, "grind," "ripples," "Boring beats clever," and "compounds"' financial-metaphor loss) — zero marketing-only term coinages needed

## Task Commits

1. **Task 1: Extract /manifesto into the catalogue and write the Spanish copy** — `d2824d8` (feat)
2. **Task 2: Prove accented uppercase rendering with a script** — `0af9c19` (docs)
3. **Task 3: Register approval before Wave 3 propagates it** — checkpoint resolved `approve`, bookkeeping in `fda3cf6` (docs) and, after a coordinator-directed correction to Card 02, `3d975dc` (fix)
4. **Task 4: Wordplay check** — `5bf5758` (docs)

*(Upstream, not this plan's own commit but load-bearing for Task 3's context: `cdca004` — orchestrator fix removing a Version/Cycle fixed-duration factual error across 8 files, 2 of them this plan's own `manifesto.json` catalogues.)*

## Files Created/Modified

- `src/app/[locale]/manifesto/page.tsx` — catalogue-driven render, `Principle`/`ActInfo` types now `string`-based (locale-dependent) instead of a fixed English literal union
- `src/messages/en/manifesto.json`, `src/messages/es/manifesto.json` — new namespace: `hero.{headline,body}`, `acts[]`, `principles[]`
- `.planning/codebase/design/SPANISH-VOICE.md` — three sections added/filled: `ACCENTED DISPLAY TYPE` (now LOCKED, Outcome A), a new `PRODUCT TRUTHFULNESS — VERSION/CYCLE/DAY` LOCKED section (the binding copy rule for Waves 3-4), and the D-06 approval record folded into the register's history
- `.planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-05.md` — new, 6 rows
- `src/messages/glossary-additions/07-05.md` — new, 0 rows (documented reasoning: every product noun already resolves via `GLOSSARY.md`)

## Decisions Made

See frontmatter `key-decisions`. In short: D-06 approved with scope stated (propagates to Waves 3-4, later `es/manifesto.json` sentence edits don't reopen the gate); the glyph verdict is Outcome A with a comparative-control finding stronger than what the task literally asked for; Card 02's Version/Cycle copy went through two corrections that originated outside this plan's own Task 1 draft (one upstream commit, one coordinator-directed refinement mid-checkpoint), both fully documented with provenance so the record doesn't misattribute them.

## Deviations from Plan

### Auto-fixed / Coordinator-directed corrections

**1. [Coordinator-directed, post-checkpoint] Card 02 asserted a product falsehood inherited from the plan's own English source**

- **Found during:** the D-06 checkpoint window, by the orchestrator/design-owner, not by this plan's own Task 1 draft
- **Issue:** This plan's Task 1 draft (committed in `d2824d8`) faithfully translated the English source's "A Version is 90 days. A Cycle is 15." — but that claim is false: Version/Cycle durations are user-chosen defaults in the app, not fixed invariants. The error originated in the English source (`07-PATTERNS.md`'s own read of the pre-move file), so translating it faithfully propagated a factual error into Spanish rather than catching it.
- **Fix (two stages, both outside this plan's own file-editing turn until the second):**
  1. `cdca004` (orchestrator, both locales, 8 files) removed the fixed-duration claim, replacing it with vaguer "holds the arc" / "holds the focus" wording.
  2. This plan's own `3d975dc` replaced that still-vague wording with the actual concept per design-owner refinement: a Version is the period an identity is set for; a Cycle is a sprint inside it targeting that identity's problems and skills.
- **Files modified:** `src/messages/en/manifesto.json`, `src/messages/es/manifesto.json` (both stages); `.planning/codebase/design/SPANISH-VOICE.md` (rule recorded)
- **Verification:** `npm run i18n:gates` (0/0) and `npm run build` (green) re-run after each stage; register check confirms no written `tú` in the refined `fijas`/`exige` conjugations.
- **Committed in:** `cdca004` (upstream) and `3d975dc` (this plan)
- **Follow-up recorded, not this plan's scope:** `Hero.tsx`, the pricing FAQ, the features scales table, and the VCD explainer carry the same corrected concept, applied by the orchestrator after this plan returns — noted in `SPANISH-VOICE.md` so it isn't mistaken for an oversight in this plan's own file list.

---

**Total deviations:** 1 (a two-stage factual correction, both stages verified and documented with accurate commit provenance)
**Impact on plan:** No scope creep — the binding rule now lives in `SPANISH-VOICE.md` precisely so Waves 3-4 don't reintroduce either the fixed-duration error or its vague-but-still-incomplete replacement when they translate Version/Cycle references on home, features, pricing, mcp, or the changelog.

## Gate Proofs (cadence requirement — measure, don't assume)

| Check | Result |
|---|---|
| `document.fonts.check` per character (13 chars: `Á É Í Ó Ú Ñ á é í ó ú ñ ¿`) | 13/13 `true` |
| `measureText` width — real face / generic fallback / Arial Black (400 32px, `ÁÉÍÓÚÑ`) | 147px / 122.6875px / 122.640625px — real face distinct from both fallback candidates |
| `scrollHeight`-`clientHeight` delta, accented probe, mobile-floor (23.008px) / desktop-ceiling (48px) | 3px / 6px |
| Same measurement, unaccented control (`PORTAL METODO PRACTICA` and the hook with accents stripped) | 3px / 6px — **identical**, proving the overshoot isn't accent-specific |
| Real `/es/manifesto` H1 at default viewport | scrollHeight 147 / clientHeight 141 / delta 6px, consistent with the desktop-ceiling synthetic probe |
| Computed `.display` font-family | `"Special Gothic Expanded One", "Arial Black", sans-serif` (named face resolves first) |
| Rendered English text of `/manifesto`, Task 1 extraction, before vs. after | byte-identical (later Version/Cycle content changes are deliberate, approved corrections, not extraction drift) |
| `npm run i18n:gates` (final state) | 0 failures, 0 warnings |
| `npm run build` (final state) | exit 0, both `/en/manifesto` and `/es/manifesto` in `.next/prerender-manifest.json` |
| `npx playwright test containment.spec.ts a11y.spec.ts -g "manifesto"` (final state, 7 launchable projects) | 42 passed; 6 failed, all `touch-iphone` (WebKit) — pre-existing sandbox dependency gap per `STATE.md`, not a code regression |

## Known Stubs

None.

## Threat Flags

None — this plan's threat register (`T-07-05-01`..`T-07-05-04`) covered exactly the surfaces touched (catalogue-rendered text, the `latin-ext` subset question that ultimately wasn't exercised, and probe-residue removal); no new network endpoints, auth paths, or trust-boundary changes were introduced.

TRANSLATION FLAGS: 6

## Self-Check: PASSED

Verified all claimed artifacts exist and all claimed commits are in history:

- `src/app/[locale]/manifesto/page.tsx` — FOUND
- `src/messages/en/manifesto.json` — FOUND
- `src/messages/es/manifesto.json` — FOUND
- `.planning/codebase/design/SPANISH-VOICE.md` — FOUND
- `.planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-05.md` — FOUND
- `src/messages/glossary-additions/07-05.md` — FOUND
- Commits `d2824d8`, `0af9c19`, `fda3cf6`, `3d975dc`, `5bf5758` — all FOUND in `git log`
- Commit `cdca004` (upstream, cited as provenance not as this plan's own work) — FOUND in `git log`
