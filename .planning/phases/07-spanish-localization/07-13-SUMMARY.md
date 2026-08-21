---
phase: 07-spanish-localization
plan: 13
subsystem: i18n
tags: [next-intl, i18n, spanish-translation, features-page, register-voice]

# Dependency graph
requires:
  - phase: 07-spanish-localization (07-11)
    provides: "src/messages/en/features.json (115 leaf keys, one top-level key per page section) and the page-scoped t.has() English-fallback in features/page.tsx"
  - phase: 07-spanish-localization (07-03, 07-04, 07-05)
    provides: "i18n CI gates (Gate 1 register / Gate 2 parity), the locale-aware Playwright containment/a11y harness, the approved es/manifesto.json register reference"
provides:
  - "Complete Spanish `features` message namespace (src/messages/es/features.json), 115 leaf keys, key-identical to the English catalogue with equal array lengths"
  - "Gate 2 flips features from PENDING ({} warning) to FULLY ENFORCED — the 07-11 t.has() English-fallback in features/page.tsx stops firing"
  - "Two per-plan register files: TRANSLATION-FLAGS.07-13.md (3 wordplay-loss rows) and glossary-additions/07-13.md (6 marketing-only coinages)"
affects: [07-16 (final verification: aggregates TRANSLATION-FLAGS.07-13.md, re-checks KU-1 against the shorter Spanish "Conexión" label, reconciles GLOSSARY.md against the 07-13 coinages)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Product-noun capitalization split confirmed and applied: Versión/Ciclo/Día stay capitalized mid-sentence everywhere (matches manifesto.json/home.json/pricing.json precedent — these are brand-level proper nouns), while Hábito(s)/Objetivo(s) are lowercase in flowing prose and capitalized only when used as standalone headings/labels — matches pricing.json's own mixed casing exactly."
    - "Cross-page precedent-lookup discipline: reused pricing.json/home.json/mcp.json/blueprint.json's own established renderings (Un método, no una moda / Un sprint / Jerarquía / rendimiento for the Productivity axis) instead of coining fresh Spanish for concepts already translated elsewhere on the site, keeping voice consistent across namespaces written by different plans."

key-files:
  created:
    - ".planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-13.md"
    - "src/messages/glossary-additions/07-13.md"
  modified:
    - "src/messages/es/features.json"

key-decisions:
  - "scales[].duration mirrors GLOSSARY.md's corrected PRODUCT TRUTHFULNESS wording verbatim in concept — 'Una identidad' / 'Un sprint' / '1 día' — never a fixed day count, matching the manifesto's own 'Una Versión es el periodo en el que fijas una identidad. Un Ciclo es un sprint dentro de ella...' phrasing this plan deliberately reused for scales[0].role and scales[1].bullets[1]."
  - "'Productivity' (Pulse evening check-in axis, a standalone chip label) translated as 'Rendimiento' rather than the more literal 'Productividad' — no isolated GLOSSARY.md row exists for this axis as a short noun, so this plan followed src/messages/es/mcp.json's own sibling rendering of the identical seven-item Pulse check-in list ('ánimo, energía, sueño, estrés, rendimiento, sentimientos y reflexión') for cross-page consistency, and recorded the reasoning in glossary-additions/07-13.md. This also kept the 110px-fixed evening-steps label column safely under KU-1's overflow threshold (11 chars vs. English 'Productivity' at 12)."
  - "Four pattern-detector names (Burnout, Regression, Weekday Blind Spot, Sleep Lag) are this page's own marketing coinages, not app UI strings — the shipped app only exposes the rendered per-instance headline/body copy for these detectors (patternHeadline, regressionHeadline/Body, blindspotHeadline/Body), never a standalone category label. Translated as Agotamiento / Retroceso / Punto Ciego Semanal / Desfase del Sueño and recorded in glossary-additions/07-13.md; two of the four (Burnout, Sleep Lag) also got a TRANSLATION-FLAGS row for the loanword-recognition loss."
  - "'Connectedness' → 'Conexión' (8 vs. 14 chars) directly targets KU-1 (the known-unfixed 7px overflow on the evening-steps 110px label column) — confirmed via the containment sweep that the Spanish route no longer reports it, and per the plan's interfaces note this is expected, not a defect requiring a new suppression entry."
  - "task_project and consistency_metric (Goals bullet strings) shipped byte-identical in both locales — the English source itself displays them as literal snake_case type identifiers, not natural-language copy, so there is nothing to translate."

patterns-established:
  - "When a page's product vocabulary overlaps a sibling namespace already translated in an earlier 07-NN plan, check that sibling's shipped Spanish first (via a targeted grep across src/messages/es/*.json) before coining independently — cheaper than a glossary-additions row and keeps cross-page voice consistent by construction."

requirements-completed: [I18N-01, I18N-07]

# Metrics
duration: ~55min
completed: 2026-08-20
---

# Phase 7 Plan 13: Spanish /features catalogue Summary

**Wrote all 115 Spanish leaf strings for `src/messages/es/features.json` — the site's largest single-file translation — mirroring the English catalogue's exact key structure and array lengths, flipping Gate 2 to full enforcement and retiring the 07-11 English-fallback's active firing without touching the fallback code itself.**

## Performance

- **Duration:** ~55 min
- **Completed:** 2026-08-20
- **Tasks:** 3 (Tasks 1+2 landed as one commit — both are a single continuous diff on the same file, matching plan 07-11's own precedent for this page)
- **Files modified:** 3 (1 translation file, 2 new per-plan register files)

## Accomplishments

- `src/messages/es/features.json` complete: 115/115 leaf keys, key-identical to `src/messages/en/features.json` with equal array lengths and zero missing/orphaned keys (verified with a flattening script covering nested arrays-of-objects, not just top-level keys).
- Every product noun resolved through `src/messages/GLOSSARY.md` (or a sibling plan's already-shipped rendering when GLOSSARY.md had no isolated row) rather than inferred: `Versión`/`Ciclo`/`Día`/`Hábito(s)`/`Objetivo(s)`/`Puntuación`/`Peso`/`Correlación`/`Signos Vitales`/`Consistencia` translated; `Trends`, `Insights`, `Pulse`, `Check-ins` kept English exactly as the app does.
- `npm run i18n:gates` passes with 0 failures — `features` no longer appears in the Gate 2 warning list (it previously read `[WARN] features — namespace not yet translated (115 en keys, 0 es keys)`; that line is gone). Two advisory `su`/`sus` warnings on this file are both legitimate third-person possessives ("Contiene sus Ciclos" = the Version's own Cycles; "cada uno con su propia definición" = each goal type's own definition), not formal address — correctly non-blocking per `SPANISH-VOICE.md`'s explicit carve-out.
- `npm run build` succeeds; both `/en/features` and `/es/features` prerender as SSG (confirmed in the build's route table).
- `npx playwright test containment.spec.ts a11y.spec.ts -g "/es/features"` passed 21/21 non-touch-iphone tests on **two consecutive clean runs** (reflow-320, mobile-360, mobile-390, mobile-430, tablet-768, laptop-1024, desktop-1440 — both containment and a11y specs) — no flakiness observed on either run, so no third re-run was needed. `touch-iphone` (WebKit) could not launch on this machine (missing `libicu74`/`libxml2`/`libflite1`, pre-existing host limitation) and is recorded as **blocked**, not passing.
- `npx tsc --noEmit` clean (exit 0). `npx eslint src e2e scripts` clean — 0 errors, 2 pre-existing warnings in unrelated files (`changelog/page.tsx`, `manifesto/page.tsx`), not touched by this plan.
- Wordplay register (`TRANSLATION-FLAGS.07-13.md`) checked every one of the 115 shipped strings against all four triggers: 3 rows recorded, none of them "sounds worse" preferences — each names a specific effect that died (gym-slang terseness on "reps"; loanword/branding recognition on "Burnout" and "Sleep Lag").
- Glossary additions (`src/messages/glossary-additions/07-13.md`): 6 marketing-only coinages, each with a stated reason the app has no string to resolve against.

## Task Commits

1. **Tasks 1+2: translate all five sections + scales/closing, prove containment** — `bec834c` (feat) — combined into one commit since both tasks are a single continuous diff on `src/messages/es/features.json`, matching plan 07-11's precedent for this exact page.
2. **Task 3: wordplay register + glossary additions** — `a0309f4` (docs)

**Plan metadata:** this commit (SUMMARY.md + STATE.md/ROADMAP.md/REQUIREMENTS.md update) follows this summary.

## Files Created/Modified

- `src/messages/es/features.json` — new Spanish catalogue, 115 leaf keys across `hero`, `scales[3]`, `temporalHierarchy`, `dailyScore` (`habitChips[3]`, `weightTiers[3]`), `pulseLoop` (`morning.steps[4]`, `evening.steps[8]`), `habitsAndGoals` (`habits.bullets[3]`, `goals.bullets[3]`), `trendsInsights` (`detectors[4]`), `closing`.
- `.planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-13.md` — new, this plan's own wordplay register (3 rows). `TRANSLATION-FLAGS.md` (the shared aggregation file) is byte-unchanged.
- `src/messages/glossary-additions/07-13.md` — new, 6 marketing-only coinages. `src/messages/GLOSSARY.md` is byte-unchanged.

## Decisions Made

See `key-decisions` in frontmatter above for the full reasoning on: scales duration truthfulness wording, the Productivity→Rendimiento choice (matched to mcp.json's sibling rendering), the four detector-name coinages, the Connectedness→Conexión KU-1 fix, and the task_project/consistency_metric literal pass-through.

Two additional casing/register decisions worth noting explicitly:

- **Version/Cycle/Day stay capitalized everywhere, including mid-sentence and in bullet lists** (e.g. "Contiene sus Ciclos.", "Dentro de un Ciclo."), matching the established site-wide treatment of these three as brand-level proper nouns (`manifesto.json`: "Un Ciclo es un sprint..."; `pricing.json`: "Versiones, Ciclos y Días ilimitados"). Habit/Goal, by contrast, are lowercase in flowing prose and capitalized only as standalone headings — matching `pricing.json`'s own mixed casing pattern exactly ("Objetivos de doble progresión" as a sentence-initial list item vs. "puntuación de rendimiento diaria" with lowercase "hábitos" mid-sentence elsewhere in the same file).
- **"A method, not a vibe."** reused `src/messages/es/blueprint.json`'s existing `methodology.heading` translation ("Un método, no una moda.") verbatim rather than coining independently, since that exact English phrase already has a shipped, presumably-approved Spanish rendering on a sibling page.

## Deviations from Plan

None - plan executed exactly as written. No component edits, no CSS/clamp changes, no files touched outside the three declared in `files_modified`.

## Issues Encountered

None. The only pre-write risk identified — the `temporalHierarchy` scale-card header row combining `scale.duration` + ` · ` + `defaultLabel` in a `justify-between` flex row with no `flex-wrap`, where "Una identidad · por defecto" (28 chars) is meaningfully longer than the English "An identity · default" (22 chars) — was resolved by choosing the shorter established app phrase "por defecto" (`settings.appearance.defaultCollapsed` → "Contraída **por Defecto**") over the more literal "predeterminado" (14 chars alone), and confirmed clean by the containment sweep at all four mobile breakpoints plus desktop. No offender was found requiring a finding for 07-16.

## English typos noticed, not fixed

None found. `src/messages/en/features.json` reads cleanly; nothing flagged as a typo or awkward-phrase candidate for a separate English-copy fix.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `/es/features` is fully translated, gate-enforced, and proven to contain itself at every tested width via copy alone — no blockers for plan 07-16's final verification pass.
- Plan 07-16 will find 3 rows already in `TRANSLATION-FLAGS.07-13.md` to fold into the aggregated `TRANSLATION-FLAGS.md` table, and 6 rows in `src/messages/glossary-additions/07-13.md` if/when `GLOSSARY.md` itself is ever regenerated to include marketing-only coinages.
- **Flag for 07-16:** KU-1 ("Connectedness" 7px overflow) is expected to stop reproducing on `/es/features` now that the Spanish label is "Conexión" (8 chars vs. 14) — worth a quick re-check during final verification to confirm the known-unfixed entry can be marked locale-scoped-resolved rather than removed outright (the English route still carries the original defect, untouched by this plan).
- The `07-11` `t.has("hero.heading")` English-fallback in `features/page.tsx` now evaluates `true` on every request (`es/features.json` has the key), so the fallback branch stops firing — it was left in place per this plan's explicit file-scope boundary. See "English fallback status" below.

## English fallback status

`src/app/[locale]/features/page.tsx`'s `if (!t.has("hero.heading")) t = await getTranslations({ locale: "en", namespace: "features" })` branch (added by plan 07-11) is **still present, unmodified, and now dormant**. `es/features.json` has a real `hero.heading` key as of this plan, so `t.has("hero.heading")` now evaluates `true` on every `/es/features` request and the fallback branch never executes — `/es/features` renders entirely from the Spanish catalogue. Removing the now-dead branch was explicitly out of this plan's declared file scope (`files_modified` lists only `src/messages/es/features.json` plus the two register files), so it was left in place per the task instructions. If the design owner wants it deleted as dead code, that is a one-line `features/page.tsx` edit for a future plan (likely 07-16) to pick up — not raised here as a defect, just flagged as available cleanup.

TRANSLATION FLAGS: 3

---
*Phase: 07-spanish-localization*
*Completed: 2026-08-20*

## Self-Check: PASSED

All 4 created/modified files confirmed present on disk (`src/messages/es/features.json`, `TRANSLATION-FLAGS.07-13.md`, `glossary-additions/07-13.md`, this SUMMARY). Both task commits (`bec834c`, `a0309f4`) confirmed present in `git log --oneline --all`.
