---
phase: 07-spanish-localization
plan: 07
subsystem: i18n
tags: [next-intl, react-server-components, i18n, spanish-localization]

requires:
  - phase: 07-spanish-localization (07-03)
    provides: i18n:gates CI script, blueprint namespace pre-registered in src/i18n/request.ts NAMESPACES
  - phase: 07-spanish-localization (07-04)
    provides: common namespace (Navbar/Footer/CTASection/LanguageSwitcher), locale-aware Link (@/i18n/navigation)
  - phase: 07-spanish-localization (07-05)
    provides: SPANISH-VOICE.md register contract, ACCENTED DISPLAY TYPE verdict, PRODUCT TRUTHFULNESS rule
provides:
  - "blueprint namespace (en/es) covering SystemBlueprintSection and MethodologyPreviewSection"
  - "Lower half of / and /es fully catalogue-driven, no remaining hardcoded English below the fold"
affects: [07-16 (translation-flags aggregation, glossary-additions merge)]

tech-stack:
  added: []
  patterns:
    - "async Server Component + getTranslations('namespace') for sibling mockup sub-components (LabMockup, TrendsMockup, InsightRow), not just the top-level section"
    - "Non-translatable UI data (percentages, enum flags, sequence numbers) kept in code as index-aligned arrays, zipped with catalogue text arrays at render time — never smuggled into the message catalogue as phantom translatable strings"

key-files:
  created:
    - src/messages/glossary-additions/07-07.md
    - .planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-07.md
  modified:
    - src/components/SystemBlueprintSection.tsx
    - src/components/MethodologyPreviewSection.tsx
    - src/messages/en/blueprint.json
    - src/messages/es/blueprint.json
  deleted:
    - src/data/systemBlueprintData.ts

key-decisions:
  - "src/data/systemBlueprintData.ts deleted: verified dead code (zero importers anywhere in the repo) whose two strings (badge/title) were never actually rendered by SystemBlueprintSection — likely orphaned during the 2894e58 'Hero Redesign: Simplified Methodology Layout' refactor. Strings were still moved into blueprintHeader.* in both catalogues per the plan's explicit instruction, even though nothing currently renders them."
  - "'The Lab' (title=\"The Lab\" prop, line 30) stays kept-English in Spanish, contradicting the plan's <interfaces> framing of Trends as 'the single exception on this surface' — GLOSSARY.md resolves 'The Lab' to kept-English via nav.lab (nav-priority), a different, exact-string-match entry from the translated 'THE LAB'/'EL LAB' (lab.title). Followed the plan's own instruction to look up rather than infer."
  - "Sample goal/priority titles under 07-07-PLAN.md's truncate risk were shortened rather than translated in full, per the plan's explicit license to treat this as a copy-length edit"

requirements-completed: [I18N-01, I18N-07]

duration: ~15min
completed: 2026-08-20
---

# Phase 07 Plan 07: SystemBlueprintSection + MethodologyPreviewSection Spanish Translation Summary

**Extracted the home page's dashboard-mockup and methodology-principles sections into a `blueprint` namespace, kept both `The Lab` and `Trends` English per the glossary, and shortened four truncate-classed Spanish sample-goal titles so none ellipsis at 320/390px.**

## Performance

- **Duration:** ~15 min
- **Tasks:** 3/3 completed
- **Files modified:** 4 (2 components, 2 catalogues) + 1 deleted + 2 created

## Accomplishments

- `SystemBlueprintSection.tsx` and `MethodologyPreviewSection.tsx` are now async Server Components reading from `getTranslations('blueprint')`, including the previously-inline `LabMockup`/`TrendsMockup`/`InsightRow` sub-components
- English rendering verified byte-identical against the pre-extraction source (grepped the `/en` prerendered HTML output for every extracted string, including the two kept-English card titles)
- `src/data/systemBlueprintData.ts` deleted after confirming via repo-wide grep and `git log --follow` that it had zero importers — its content survives in `blueprintHeader.*` in both catalogues anyway
- Full Spanish catalogue written and verified: `npm run i18n:gates` reports `0 failure(s), 0 warning(s)` (blueprint moved from warning to fully-enforced)
- Measured (not assumed) truncation risk: scripted a headless-browser check of `scrollWidth` vs `clientWidth` on all four `.truncate`-classed goal-title spans at 320px and 390px on `/es` — none truncate at all
- Nine wordplay/compression losses recorded in the per-plan translation register

## Task Commits

1. **Task 1: Extract SystemBlueprintSection and MethodologyPreviewSection into the blueprint namespace** - `3615966` (feat)
2. **Task 2: Write the Spanish blueprint copy and check the truncating mockup** - `a615fca` (feat)
3. **Task 3: Wordplay check — record what did not survive into Spanish** - `a9f6f28` (docs)

_No separate plan-metadata commit — STATE.md/ROADMAP.md updates are batched into the final commit below._

## Files Created/Modified

- `src/components/SystemBlueprintSection.tsx` - Async Server Component; `LabMockup`/`TrendsMockup` also converted to async and call their own `getTranslations('blueprint')`; `GOAL_PROGRESS`/`INSIGHT_META` hold non-translatable numeric/enum data, index-aligned with catalogue arrays
- `src/components/MethodologyPreviewSection.tsx` - Async Server Component; `PRINCIPLE_NUMBERS` sequence marker stays in code, catalogue array holds only `title`/`body`
- `src/messages/en/blueprint.json` - New namespace: `blueprintHeader.*` (2 orphaned-but-preserved strings), `mockup.lab.*`, `mockup.trends.*`, `methodology.*`
- `src/messages/es/blueprint.json` - Key-identical Spanish mirror
- `src/data/systemBlueprintData.ts` - **Deleted** (dead code, see Decisions)
- `.planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-07.md` - **Created**, 9 rows
- `src/messages/glossary-additions/07-07.md` - **Created**, 0 rows (every product noun resolved via `GLOSSARY.md`)

## Decisions Made

**`systemBlueprintData.ts` deletion.** The plan's `<interfaces>` section (dated 2026-08-02) asserted this module fed the component's header. A repo-wide grep (`grep -rn "systemBlueprintData"`) and `git log --follow` on both files showed the module was only ever referenced at its own declaration — `SystemBlueprintSection.tsx` has no import of it, and the component's JSX has no header render slot for `badge`/`title` at all. `git log --oneline --follow` on the component shows a `2894e58 "Hero Redesign: Simplified Methodology Layout & Text Refinements"` commit landed after the data file was added (`f38850e`) and never touched again — consistent with the header render being cut during that redesign while the data file was left behind. Followed the plan's instruction anyway: moved both strings into `blueprintHeader.badge`/`blueprintHeader.title` in both catalogues (so the mechanical extraction-completeness gate in Task 1's verify script, which greps for `'BEHAVIORAL SYSTEM'` in the catalogue blob, passes), then deleted the now-genuinely-empty module. The two strings are consequently unused/inert data sitting in the catalogue — not a stub in the "empty value flowing to the UI" sense (nothing renders it, so nothing renders empty), but flagging it here since a future reader might wonder why `blueprintHeader.*` exists with no call site.

**"The Lab" kept English, not translated.** The plan's `<interfaces>` narrative describes `Trends` as "the single exception on this surface" that stays English while its sibling `title="The Lab"` was implied to translate. Direct lookup in `src/messages/GLOSSARY.md` shows `The Lab` (exact Title Case string, matching the component's literal prop) resolves to kept-English via `nav.lab` under the glossary's nav-priority resolution rule — a different row from the separately-cased `THE LAB` → `EL LAB` (`lab.title`), which *is* translated. Both "The Lab" and "Trends" therefore stay English in this component; only their `description=` props translate. This follows the plan's own repeated instruction ("Resolve product nouns through GLOSSARY.md... Look up rather than infer") over the interfaces section's narrative framing, which was written before this specific lookup was run.

**Mockup sample-goal shortening.** Per the plan's explicit license, four sample titles were shortened for Spanish rather than translated in full, both to avoid `truncate`-mid-word risk at 320px and — for two of them — to avoid any appearance of asserting a fixed Version/Cycle duration (see PRODUCT TRUTHFULNESS rule). `"Sub-22 5k race in 30 days"` → `"Carrera 5K sub-22"` and `"Read 12 books this version"` → `"Leer 12 libros"` both drop their timeframe/version anchor entirely rather than ship a borderline-length translation; recorded as trigger-4 rows in the translation register.

## Deviations from Plan

**1. [Discovery, not Rule 1-4] `systemBlueprintData.ts` was already dead code before this plan touched it.** See Decisions above. No bug was introduced or fixed — the plan's premise about the file's usage was stale relative to the current component; the plan's own fallback instruction ("If, contrary to the verified read, non-string data is present, keep the module... and say so in the summary") covers the inverse case, not this one, so this is recorded as a discovery rather than filed under Rules 1-4.

**2. [Discovery, glossary lookup overrides interfaces narrative] "The Lab" stays kept-English.** See Decisions above. Not a Rule 4 architectural change — it is the direct, literal result of following the plan's own instruction to check `GLOSSARY.md` rather than infer from the `<interfaces>` prose.

No Rule 1/2/3 auto-fixes were needed — no bugs, missing critical functionality, or blocking issues were encountered in either component.

## Issues Encountered

None. `npm run build` failed as expected on the Task 1 commit alone (before `es/blueprint.json` was populated) — this is the documented "known structural quirk" from plan 07-06 (next-intl's `MISSING_MESSAGE` on `/es` prerender against a namespace whose Spanish half doesn't exist yet), not a defect. Full build + containment/a11y specs were run and passed after Task 2 landed the Spanish catalogue.

## Verification Results

- `npx tsc --noEmit` — clean (both after Task 1 and after Task 2)
- `npm run lint` — clean for both modified component files (pre-existing, unrelated errors exist elsewhere in the repo under `.agents/skills/` and `changelog`/`manifesto` unused-var warnings — out of scope, not touched by this plan)
- Task 1's mechanical extraction-completeness check — `BLUEPRINT_EXTRACTION_OK`
- `npm run i18n:gates` — `0 failure(s), 0 warning(s)` (blueprint namespace fully enforced)
- Kept-English gate — `KEPT_ENGLISH_OK` (`Trends` present verbatim, `Tendencias` absent)
- `npm run build` — succeeds after Task 2; both `/en` and `/es` prerendered as static (SSG) routes
- `npx playwright test containment.spec.ts a11y.spec.ts -g "overflow: /$"` — 7/8 passed; `touch-iphone` failed on `browserType.launch` (pre-existing environmental blocker, missing system deps, no sudo available — confirmed by plan 07-06, not this plan's regression)
- `npx playwright test containment.spec.ts a11y.spec.ts -g "/es$"` — 21/24 passed; the 3 failures are all `touch-iphone` (same environmental blocker)
- Truncation measurement (scripted, not visual-only): all four `.truncate`-classed Spanish goal titles measured `scrollWidth === clientWidth` at both 320px and 390px on `/es` — zero truncation, not merely "no mid-word ellipsis"
- Grepped the `/en` prerendered HTML output directly for every extracted English string (card descriptions, "A method, not a vibe.", subheading, "Read the full methodology", "Identity drives behavior.", and both `>The Lab<`/`>Trends<` kept-English titles) — all present verbatim

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

The `blueprint` namespace is complete and fully enforced by Gate 2 in both locales. Plan 07-16 will merge `src/messages/glossary-additions/07-07.md` (zero rows) into `GLOSSARY.md` and aggregate this plan's 9-row `TRANSLATION-FLAGS.07-07.md` into the shared register once the last translation wave lands — no action needed from this plan beyond having both files present and correctly formatted, which they are.

---
*Phase: 07-spanish-localization*
*Completed: 2026-08-20*

## Self-Check: PASSED
All created/modified files verified present on disk; all three task commits (3615966, a615fca, a9f6f28) verified in git log.

TRANSLATION FLAGS: 9
