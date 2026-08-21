---
phase: 07-spanish-localization
plan: 02
subsystem: i18n
tags: [glossary, spanish, next-intl, brand-voice, translation-workflow]

# Dependency graph
requires: []
provides:
  - "src/messages/GLOSSARY.md — 747 distinct product terms derived mechanically from the app's shipped en.json/es.json (32 kept English, 715 translated), with provenance and a Marketing-only section"
  - "scripts/extract-glossary.mjs — hand-invocation-only extraction script, re-runnable to refresh the glossary, never wired to build/CI"
  - ".planning/codebase/design/SPANISH-VOICE.md — binding tú register, anti-words, punctuation and wordplay-escalation contract"
  - ".planning/phases/07-spanish-localization/TRANSLATION-FLAGS.md — seeded lost-in-translation register (empty Aggregated rows, one permanent example)"
  - "src/messages/glossary-additions/README.md — one-file-per-plan convention for marketing-only term coinages"
affects: [07-03, 07-04, 07-05, 07-06, 07-07, 07-08, 07-09, 07-10, 07-13, 07-14, 07-16]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Glossary derivation resolves same-English-value ambiguity by nav.* namespace priority (the app's own catalogue is not internally consistent for every term — e.g. Goals reads Objetivos in nav.goals but Metas in 7 other keys; Trends stays Trends in nav.trends but reads Tendencias as a page title)"
    - "Per-plan file convention (TRANSLATION-FLAGS.07-NN.md, glossary-additions/07-NN.md) replaces shared-file appends for anything nine parallel-capable plans might all write to; only the phase's aggregation plan (07-16) merges them"

key-files:
  created:
    - scripts/extract-glossary.mjs
    - src/messages/GLOSSARY.md
    - .planning/codebase/design/SPANISH-VOICE.md
    - .planning/phases/07-spanish-localization/TRANSLATION-FLAGS.md
    - src/messages/glossary-additions/README.md
  modified:
    - .planning/codebase/design/README.md

key-decisions:
  - "Task 1 gate passed: app catalogues parse, locale code is bare es (no es-ES in el-portal/src/lib/i18n.ts), Objetivos/Trends/Día all resolve in es.json. Observed key counts (en 1737, es 1694) differ from 07-CONTEXT.md's earlier snapshot (en 1,711, es 1,670) — per the plan's own <interfaces> note this reflects the app repo evolving between the two reads, not a flattening-method artifact, and nothing in this phase gates on a specific figure."
  - "Ambiguity resolution rule added to the extraction script beyond what the plan's action text specified verbatim: when the same English value maps to multiple distinct Spanish values across keys (44 of 747 terms), prefer the nav.* namespace occurrence, falling back to the most frequent value. This was necessary to reproduce D-01's Goals->Objetivos and Trends->kept-English rows correctly — a naive first-occurrence or last-occurrence rule would have selected Metas/Tendencias instead. Documented in the script's comments and in GLOSSARY.md's Derived-from-the-app intro."
  - "Marketing-only section seeded with exactly 2 terms (Methodology->Metodología, Manifesto->Manifiesto) — verified absent from the app's en.json before seeding, rather than guessing at a larger seed list. Wave 3/4 plans add more via glossary-additions/07-NN.md as they discover real need."

requirements-completed: [I18N-07]

# Metrics
duration: ~35min (Task 1 verification, Task 2 script design/derivation/authoring, Task 3 voice doc, Task 4 register seeding)
completed: 2026-08-19
---

# Phase 07 Plan 02: Spanish glossary and voice contract Summary

**Derived a 747-term Spanish product glossary mechanically from the El Portal app's shipped `es.json` (resolving 44 internal app-inconsistencies via nav-namespace priority) and wrote the binding `SPANISH-VOICE.md` register/anti-words/punctuation contract plus the seeded `TRANSLATION-FLAGS.md` lost-in-translation register.**

## Performance

- **Duration:** ~35 min (single continuous session, no interruption)
- **Completed:** 2026-08-19T18:21:11Z (last task commit, UTC)
- **Tasks:** 4 (1 verification gate, 3 artifact-producing)
- **Files created:** 5 (extract-glossary.mjs, GLOSSARY.md, SPANISH-VOICE.md, TRANSLATION-FLAGS.md, glossary-additions/README.md); 1 modified (design/README.md index entry)

## Accomplishments

- **Task 1 gate passed before any derivation ran:** app's `en.json`/`es.json` parse, locale code confirmed `es` (not `es-ES`) in `el-portal/src/lib/i18n.ts`, and `Objetivos`/`Trends`/`Día` all resolve as values in the app's `es.json`. Observed key counts: en 1737, es 1694 (flattened dotted-path count, this extraction run).
- `scripts/extract-glossary.mjs` reads exactly two files from the sibling app repo by absolute path (env-var overridable), flattens both catalogues, filters to 1-3 word noun-phrase candidates with no ICU placeholders and no sentence-ending punctuation, and dedupes by English value — reproducibly (`node scripts/extract-glossary.mjs` regenerates byte-identical output to the committed table, verified via diff).
- `src/messages/GLOSSARY.md`: 747 distinct English terms (32 kept English, 715 translated) with a provenance line (source paths, app next-intl `^4.8.3`, locale `es`, extraction date, observed key counts), a distinct "Kept English" section, and a "Marketing-only (decided here)" section seeded with `Methodology`/`Manifesto` plus the glossary-additions merge convention.
- All 11 rows from `07-CONTEXT.md` D-01 present with matching Spanish values, including the two non-obvious cases: `Goals -> Objetivos` (the app itself is inconsistent — `nav.goals` says `Objetivos` but 7 other keys say `Metas`) and `Trends -> Trends` kept-English (`nav.trends` keeps `Trends` but `trends.title` translates to `Tendencias`).
- `.planning/codebase/design/SPANISH-VOICE.md`: self-contained register contract (`tú`, subject pronoun always omitted, 7 priority-ordered rules, 3-row right/wrong table), `vosotros` explicitly ALLOWED and `su`/`sus` explicitly ADVISORY (both excluded from 07-03's CI hard-fail list), peninsular-vs-`es`-locale-code distinction, 4 locked CTA translations with the `text-nowrap` re-measure caveat, 16-item Spanish anti-words list, punctuation rules, product-vocabulary pointer, an `ACCENTED DISPLAY TYPE` placeholder pending 07-05, and a LOCKED `WORDPLAY ESCALATION` section naming its 4 triggers and the nine plans that owe a `TRANSLATION FLAGS: n` line.
- `.planning/phases/07-spanish-localization/TRANSLATION-FLAGS.md` seeded empty and complete: 5-column header, empty `Aggregated rows` table, empty `Rewritten` section, one permanent worked example (`Un método para llegar a ser quien eres`, accented), and an ownership contract naming all nine copy-writing plans plus 07-16 as sole aggregator.
- `src/messages/glossary-additions/README.md` created for the parallel-safe marketing-term-coinage convention.

## Task Commits

1. **Task 1: Verify the glossary source before deriving anything from it** — no commit (plan's own `<files>` spec: "no file written"). Gate verification run inline, printed `GLOSSARY_SOURCE_OK`.
2. **Task 2: Derive the product glossary mechanically** — `e627036` (feat)
3. **Task 3: Write the binding Spanish voice contract** — `a8ba5d0` (docs)
4. **Task 4: Seed the lost-in-translation register and glossary-additions** — `b648cbf` (docs)

## Files Created/Modified

- `scripts/extract-glossary.mjs` — hand-invocation-only extraction script (`EL_PORTAL_APP_PATH` env override, default absolute path), never referenced from `package.json`, `next.config.ts`, or `.github/` (verified: zero grep hits)
- `src/messages/GLOSSARY.md` — the derived glossary snapshot (see Accomplishments)
- `.planning/codebase/design/SPANISH-VOICE.md` — binding voice contract, peer of `BRAND.md`
- `.planning/codebase/design/README.md` — added index row for `SPANISH-VOICE.md`
- `.planning/phases/07-spanish-localization/TRANSLATION-FLAGS.md` — seeded lost-in-translation register
- `src/messages/glossary-additions/README.md` — marketing-term-coinage convention

## Decisions Made

- **nav.* namespace priority for ambiguous terms** (see key-decisions in frontmatter). This is the one place execution went beyond the plan's literal action text (which specified the filter shape but not a tie-break rule for same-English-value disagreement) — necessary to make the script's mechanical output match D-01's asserted eleven rows, per the plan's own instruction: "If any row disagrees, the script's filter is wrong — fix the script, do not hand-edit the table." Documented inline in the script and in the glossary's own "Derived from the app" section intro so a future reader isn't surprised by the `(resolved: nav-priority)` status tag on 2 of the 11 D-01 rows plus 42 other terms.
- **Glossary size (747 rows) not narrowed beyond the plan's literal filter.** The action text defines the candidate filter syntactically (word count, punctuation, capitalization) rather than semantically ("is this really a product noun"), and the result includes some short adjectives/verbs that happen to fit the shape (e.g. `Low`, `Skip`, `Back`). Not narrowed further because doing so would reintroduce the hand-curation the whole plan exists to avoid — deterministic and unfiltered beyond the stated criteria was judged truer to "mechanical, not authored" than a smaller hand-picked subset.
- **Marketing-only seed kept to 2 verified terms** rather than a speculative larger list (see key-decisions).
- **I18N-07 marked complete per this plan's own frontmatter `requirements: [I18N-07]`**, even though the requirement's literal checkbox text ("the catalogue contains no `usted`/`ustedes`... register is consistent across every route") describes a site-wide invariant that only fully holds once Waves 2-4 finish writing copy. Read this as: this plan is where the *contract* becomes binding (register rules + the 07-03 CI gate design they're built from + the hard-fail/advisory token split), and 07-03's gate then continuously enforces it from that point forward — not a claim that every route's copy already exists and conforms. Flagged here for visibility, not corrected, since the requirement assignment came from the plan's own frontmatter (cross-AI reviewed during planning).

## Deviations from Plan

None — plan executed exactly as written. The nav-priority ambiguity-resolution rule above is an implementation detail filling a gap the plan's action text left open (the plan specified the candidate filter and the dedup-by-English-value requirement, but not a tie-break for disagreement), not a deviation from an explicit instruction.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Wave 2 plans (07-04 through 07-10, minus dependencies not yet satisfied) can now resolve every El Portal product noun against `src/messages/GLOSSARY.md` and write copy against the locked `SPANISH-VOICE.md` register.
- `TRANSLATION-FLAGS.md` and `glossary-additions/README.md` are in place — each of the nine copy-writing plans can create its own `TRANSLATION-FLAGS.07-NN.md` and `glossary-additions/07-NN.md` without any shared-file collision risk.
- Plan 07-03 (CI register gate) can build its hard-fail list directly from `SPANISH-VOICE.md` § REGISTER, excluding `vosotros` and treating `su`/`sus` as advisory-only, as that section explicitly requires.
- Plan 07-05's `ACCENTED DISPLAY TYPE` measurement has a named home to write its outcome back into (`SPANISH-VOICE.md`, currently marked `CURRENT — pending 07-05`).
- Known environment blocker (unrelated to this plan, carried from 07-01): `test-results/`/`playwright-report/` are root-owned; not needed for this plan's verification and not touched.

---
*Phase: 07-spanish-localization*
*Completed: 2026-08-19*

## Self-Check: PASSED

All 6 claimed files found on disk (extract-glossary.mjs, GLOSSARY.md, SPANISH-VOICE.md, TRANSLATION-FLAGS.md, glossary-additions/README.md, this summary). All 3 claimed commits (`e627036`, `a8ba5d0`, `b648cbf`) found in git log.
