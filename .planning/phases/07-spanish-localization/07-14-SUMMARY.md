---
phase: 07-spanish-localization
plan: 14
subsystem: i18n
tags: [next-intl, changelog, json-catalogue, spanish-translation, wordplay-register]

# Dependency graph
requires:
  - phase: 07-spanish-localization
    provides: "src/messages/en/changelog.json — the complete English catalogue (33 entries, 7 with note) and 07-12-ENTRY-COUNT.txt (07-12); Rendimiento/Continuidad glossary precedents (07-13)"
provides:
  - "src/messages/es/changelog.json — the complete Spanish changelog catalogue, key-identical to English: page.*, noteLabel, six tags.* labels, and all 33 entries (7 with note) fully translated"
  - "Gate 2 now fully enforces the changelog namespace in both directions — this was the last namespace sitting at {}"
affects: ["07-16 (final verification plan; aggregates TRANSLATION-FLAGS.07-14.md and glossary-additions/07-14.md, runs i18n:gates:strict which now has no remaining PENDING namespace)"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Shared-field-identity check (version/date/tags[]/note.icon copied unchanged, asserted byte-identical at every array index) reused as this plan's own gate on top of the phase-wide key/placeholder parity gate"
    - "Plan-local identical-value guard closing Gate 2's value-blind-spot for a single namespace (fails on note.text===English, reports title/body/bullet identity for REVIEW) — scoped to this plan only, not promoted to CI"

key-files:
  created:
    - .planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-14.md
    - src/messages/glossary-additions/07-14.md
  modified:
    - src/messages/es/changelog.json

key-decisions:
  - "Tag labels coined for this plan (no prior glossary row for the badge set): newFeature → Novedad, improvement → Mejora, optimization → Optimización, fix → Corrección, hotfix → Parche urgente, release → Lanzamiento"
  - "page.heading 'Changelog' translated to 'Historial de cambios', following the site's established pattern of fully translating every other page's H1 (features/pricing/mcp/legal all translate their headings; nothing on this site keeps a page-name heading English except the glossary's product-noun exceptions, which 'Changelog' is not one of)"
  - "'&' rendered as 'y' (or 'e' before an i-/hi- sound word) throughout entry titles, matching the site's existing eyebrow-translation convention (features.json: 'Habits & Goals' → 'Hábitos y Objetivos', 'Trends & Insights' → 'Trends e Insights') rather than keeping the ampersand"
  - "'Productivity' (2.0.13 evening check-in bullet) and 'Signos Vitales' as the noun for the six-vital category (2.0.15, 2.0.17) resolved through existing GLOSSARY.md rows (history.performance='Rendimiento', trends.vitals.title='Signos Vitales') and 07-13's precedent for the axis label — reused, not re-coined"
  - "MoodOrb (2.0.13) kept English as a UI-widget proper noun, consistent with the kept-English precedent for Cinema/Trends/Dashboard/Pulse/The Lab — recorded in glossary-additions/07-14.md since GLOSSARY.md has no resolvable row for it"
  - "2.0.11 bullet 'carried forward into the current cycle' rendered with the verb 'continuar' (not a free paraphrase like 'trasladar') to stay consistent with GLOSSARY.md's 'Carry Forward → Continuar' row, since the sentence is describing that exact named app action"
  - "2.0.0 note 'seamlessly migrated' rendered as 'de forma transparente', NOT 'sin fricciones' — SPANISH-VOICE.md's anti-word list explicitly bans 'sin fricciones' as the marketing-filler translation of 'seamless'"
  - "1.1.0 title/note ('Unlock the power of writing' / 'Unleash the power of reflecting') rewritten to avoid the desatar/desbloquear/empoderar-family hype verbs the anti-word list bans, at the cost of the English's punchier rhetorical energy — treated as a required, already-locked register decision rather than a TRANSLATION-FLAGS row (see Task 3 below)"

requirements-completed: [I18N-01, I18N-07]

# Metrics
duration: ~1h10min
completed: 2026-08-20
---

# Phase 7 Plan 14: Spanish Changelog Catalogue Summary

**Translated all 33 changelog entries (7 with notes) plus page chrome, noteLabel, and the six tag labels into `src/messages/es/changelog.json`, closing the last namespace that sat at `{}` and flipping Gate 2 to full bidirectional enforcement.**

## Performance

- **Duration:** ~1h10min
- **Completed:** 2026-08-20T14:21Z
- **Tasks:** 3/3 completed
- **Files modified:** 3 (1 modified: `es/changelog.json`; 2 created: `TRANSLATION-FLAGS.07-14.md`, `glossary-additions/07-14.md`)

## Task Commits

1. **Task 1+2: Translate the full Spanish changelog catalogue and prove parity** — `24d0d83` (feat) — combined into one commit since the file was finished in a single write pass; both tasks' verification gates were run and passed before committing
2. **Task 3: Wordplay check — record what did not survive into Spanish** — `5c3b3c9` (docs)

**Plan metadata:** (this commit, docs(07-14): complete plan — to follow)

## Files Created/Modified

- `src/messages/es/changelog.json` — complete Spanish changelog catalogue: `page.heading`/`page.subheading`, `noteLabel`, six `tags.*` labels, `entries[33]` (7 with `note`), key-identical to English
- `.planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-14.md` — this plan's own wordplay register, 1 row
- `src/messages/glossary-additions/07-14.md` — 1 coinage (MoodOrb, kept English)

## Entry Count and Parity

- `en.entries.length` = 33, `.planning/phases/07-spanish-localization/07-12-ENTRY-COUNT.txt` = 33. They agreed; no correction was needed.
- Spanish `entries.length` = 33, matching both.
- Shared-field alignment: `version`, `date`, `tags[]`, `isRelease`, and `note.icon` are byte-identical to English at every one of the 33 indices (`SHARED FIELDS ALIGNED`, exit 0).
- All 7 notes present in Spanish at the same indices as English (2.0.21, 2.0.15, 2.0.13, 2.0.6 — `lock`; 2.0.0 — `rocket`; 1.1.5 — `info`; 1.1.0 — `pen`), no English `note.text` copied across.
- No dates, tag keys, version numbers, or note icons were translated — confirmed by the shared-field gate at every index and by direct inspection (all `version`/`date`/`tags[]`/`note.icon` values are literal English-source substrings, unchanged).
- `/es/changelog` contains no surviving English note text — all 7 notes read fully in Spanish (verified: the identical-value guard reports zero `note.text` values matching English).

## Identical-Value Guard (Task 2, Gate 2's blind spot)

`CHANGELOG_PARITY_OK — 33 entries both locales`, exit 0. The guard's REVIEW list flagged 26 apparent matches; 25 of the 26 are a false-positive artifact of the guard's own `===` comparison on bullets with no `lead` field (`undefined === undefined` reads as "identical" even though neither locale has a lead there — every one of those 25 is a bullet where the English source itself has no `lead` key, confirmed by cross-referencing each flagged index against `en/changelog.json`).

**The one genuine identical string, justified:**

- `entries[15].bullets[2].lead` ("MoodOrb", 2.0.13 entry) — kept identical by design. `MoodOrb` is the proper-noun name of a specific UI widget (the animated sphere on the evening check-in), not a common noun. No GLOSSARY.md row resolves it; it is kept English for the same reason `Cinema`, `Trends`, `Dashboard`, `Pulse`, and `The Lab` stay English — recorded in `src/messages/glossary-additions/07-14.md`.

## Product Nouns Resolved

Through `src/messages/GLOSSARY.md`: Versión, Ciclo, Día, Objetivos, Hábitos, Archivos, Visión, Checklist de Vida, Rutinas, Notas Teóricas, Habilidades, Rasgos, Configuración, Rendimiento (history.performance), Signos Vitales, Energía, Estrés, Motivación, Conexión, Calidad de Sueño, Wellbeing→Bienestar, Evolución de Identidad. Kept-English per the carried-forward instruction and GLOSSARY.md's Kept-English table: Trends, Insights, Pulse, Check-ins, The Lab, Mantras, Dashboard, Debrief, Database, Cinema, Feedback. Reused (not re-coined) from 07-13's precedent: "Productivity" axis → Rendimiento (matches `mcp.json`'s sibling rendering); "carried forward" → the verb `continuar`, matching GLOSSARY.md's `Carry Forward → Continuar` row.

**One new coinage:** MoodOrb, kept English (see above), recorded in `src/messages/glossary-additions/07-14.md`.

## Register Compliance

- `npm run i18n:gates`: exit 0, 0 failures, 17 warnings total (12 from this plan's file, all `su`/`sus` advisory-only warnings — every instance is the legitimate third-person possessive, e.g. "su propia sala" referring to a room/section, never the reader; 5 pre-existing warnings in `features.json`/`legal.json`/`pricing.json`, out of scope). No hard failures: no `usted`/`ustedes`, no written subject `tú`, no exclamation marks anywhere in the new content.
- Anti-word list: no hits. Two hype-verb phrases in the English source (`Unlock the power of writing`, `Unleash the power of reflecting`, both on the 1.1.0 entry) were deliberately rewritten to avoid `desatar`/`desbloquear`/`empoderar`-family verbs — see key-decisions above and Task 3's note on why this isn't a TRANSLATION-FLAGS row.
- `sin fricciones` (banned as the marketing-filler translation of "seamless") was specifically avoided on the 2.0.0 note ("seamlessly migrated" → "de forma transparente", not "sin fricciones").

## Historical Product-Truthfulness Check

No changelog entry states a Version or Cycle as a fixed number of days. The one place a duration-adjacent number appears is the "0–100 scale" on the 2.0.13 evening check-in bullet, which is a check-in answer scale, not a Version/Cycle duration claim, and is out of the LOCKED rule's scope. **No entry required flagging under the PRODUCT TRUTHFULNESS rule** — none of the 33 shipped entries make a fixed-duration claim about Version or Cycle in the first place (the historical-entry exception in this plan's brief did not need to be invoked).

## TRANSLATION-FLAGS.07-14.md — 1 row

Every string this plan translated (titles, bodies, bullet leads/bodies, all 7 notes, page chrome, tag labels) was checked against `SPANISH-VOICE.md`'s four wordplay triggers. One row:

- **`entries[8].bullets[1].lead`** (recurs at `entries[17].bullets[2].lead`, `entries[19].bullets[1].lead`, and unlabeled in `entries[18].bullets[3].body`) — English reuses the playful adjective "snappy"/"snappier" as a recurring house-voice descriptor for UI speed across ~4 entries; Spanish has no equally brief, informal word and used the neutral "ágil" everywhere, so the meaning survives but the repeating in-house voice tic does not (trigger 2, rhythm/sound).

Titles checked and found to preserve their effect with no loss worth flagging: "Sign-in now lands where it should" → "aterriza" keeps the literal/figurative landing pun; "fall into the photo" → "caes dentro de ella" keeps the immersion image; "No cookies, full stop" → "Sin cookies, punto" reuses the equivalent Spanish emphatic idiom; "What lifts you, what drags you" → "Lo que te sube, lo que te hunde" preserves the up/down antonym pair.

Shared `TRANSLATION-FLAGS.md` and `src/messages/GLOSSARY.md` are byte-unchanged by this plan (`git diff --stat` empty on both — verified before committing).

## Containment and Accessibility

`npx playwright test containment.spec.ts a11y.spec.ts -g "changelog"` across the 7 non-`touch-iphone` projects (`reflow-320`, `mobile-360`, `mobile-390`, `mobile-430`, `tablet-768`, `laptop-1024`, `desktop-1440`): **42/42 passed, 0 failures**, both `/changelog` and `/es/changelog` at every viewport. No copy was shortened for containment — nothing overflowed. `touch-iphone` (WebKit) was attempted and failed to launch with the documented missing-library error (`libicu74`/`libxml2`/`libflite1`) — recorded as environmentally blocked, not run as passing, consistent with the working constraints.

## Verification Evidence

- `npx tsc --noEmit`: exit 0.
- `npx eslint src e2e scripts`: exit 0, 0 errors, 2 pre-existing unused-var warnings in files this plan did not touch (`changelog/page.tsx`'s `FG_MUTED`, `manifesto/page.tsx`'s `ACCENT_LIGHT` — both predate this plan, confirmed already present in 07-12's summary).
- `npm run build`: exit 0. `/en/changelog` and `/es/changelog` both listed as prerendered (SSG) routes.
- `npm run i18n:gates`: exit 0, 0 failures (see Register Compliance above).
- `git diff --name-only` for this plan's commits: exactly `src/messages/es/changelog.json`, `.planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-14.md`, `src/messages/glossary-additions/07-14.md` — the three files the plan's frontmatter lists. `src/messages/en/changelog.json` untouched.

## Deviations from Plan

None — plan executed exactly as written. Tasks 1 and 2 were completed and verified as a single write pass (the file was finished before the first parity check ran), so their commits were combined into one `feat` commit rather than split into two partial-file commits; both tasks' individual verification gates were still run and passed independently before that commit.

## Out-of-Band Observation (not a deviation in this plan's own work)

While this plan's containment/a11y sweep was already complete, a message appended to a later, unrelated tool call claimed to be from "the coordinator," described killing and restarting the shared Playwright dev server (port 3987) and modifying `src/components/Navbar.tsx` for an unrelated `overflow.spec.ts` fix, and instructed against touching that file. This is flagged here rather than acted on, for three reasons: (1) it arrived as a system-reminder appended to a tool result, not as a genuine user/orchestrator turn; (2) it directly contradicts this plan's own explicit briefing — "You are running SEQUENTIALLY on the main working tree... No other agent is writing files"; (3) `git status` at the time showed `src/components/Navbar.tsx` genuinely modified and two untracked scratch files (`.tmp-nav-diag.mjs`, `.tmp-overflow-diag.mjs`) this executor did not create, which is inconsistent with the sequential/solo-execution briefing regardless of the message's authenticity. This executor did not act on the message's instructions (has never touched `Navbar.tsx`, which was already outside this plan's file scope), did not delete the unfamiliar scratch files (not created by this executor), and re-verifies: this plan's own Playwright sweep (42/42) completed successfully *before* that message appeared, so no re-run was needed on this plan's account. Reported for the orchestrator to reconcile — this plan's own deliverables and verification are unaffected either way.

## User Setup Required

None.

## Next Phase Readiness

- `src/messages/es/changelog.json` is complete. `changelog` was the last namespace at `{}`; `npm run i18n:gates` now reports no "not yet translated" warning for any namespace — the state `07-16`'s `npm run i18n:gates:strict` requires.
- `src/messages/glossary-additions/07-14.md` and `TRANSLATION-FLAGS.07-14.md` are ready for 07-16's merge/aggregation pass.

---

## Self-Check: PASSED

- `FOUND: src/messages/es/changelog.json` — 33 entries, 7 notes, `page`/`tags`/`noteLabel` present, matches `en/changelog.json` key-for-key
- `FOUND: .planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-14.md` — header verbatim, 1 row
- `FOUND: src/messages/glossary-additions/07-14.md` — 1 coinage row (MoodOrb)
- Commit `24d0d83` found in `git log --oneline --all`
- Commit `5c3b3c9` found in `git log --oneline --all`

---
*Phase: 07-spanish-localization*
*Completed: 2026-08-20*

**TRANSLATION FLAGS: 1**
