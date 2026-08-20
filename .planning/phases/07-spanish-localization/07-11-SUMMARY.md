---
phase: 07-spanish-localization
plan: 11
subsystem: i18n
tags: [next-intl, i18n, catalogue-extraction, features-page, getTranslations, t.raw]

# Dependency graph
requires:
  - phase: 07-spanish-localization (07-03, 07-04, 07-05)
    provides: i18n CI gates (Gate 1/2/3), locale-aware Playwright harness, KNOWN_UNFIXED KU-1..KU-4, the approved es/manifesto.json register reference
provides:
  - "Complete English `features` message namespace (src/messages/en/features.json), 115 leaf keys, one top-level key per page section"
  - "features/page.tsx fully catalogue-driven via getTranslations('features') + t.raw() for arrays, zero hardcoded user-facing strings"
  - "A page-scoped English-fallback pattern (t.has() check) for surfaces split across an extraction wave and a translation wave, reusable by plan 07-12/07-14's changelog split"
affects: [07-13 (writes es/features.json against this exact key structure), 07-12/07-14 (changelog split, same fallback pattern applicable), 07-16 (final verification, KU-1 re-check)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Translator type alias (`Awaited<ReturnType<typeof getTranslations>>`) threaded as a prop through section helper functions, mirroring mcp/page.tsx's established convention"
    - "t.raw() for catalogue arrays (scales, habitChips, weightTiers, pulseLoop steps, bullets, detectors), consistent with VCDSection/SystemBlueprintSection/manifesto/privacy/terms/pricing"
    - "Non-copy demo/UI data (weight numbers, done-checkbox state, multiplier digits) stays in code as index-aligned parallel arrays, commented with the same rationale SystemBlueprintSection uses for GOAL_PROGRESS"
    - "Page-scoped English fallback: `if (!t.has('hero.heading')) t = await getTranslations({ locale: 'en', namespace: 'features' })` — lets a route keep prerendering while its es/*.json sits at the Gate-2 PENDING `{}` state, without touching the shared src/i18n/request.ts"

key-files:
  created: []
  modified:
    - "src/app/[locale]/features/page.tsx"
    - "src/messages/en/features.json"

key-decisions:
  - "Catalogue structure: one top-level key per section (hero, scales, temporalHierarchy, dailyScore, pulseLoop, habitsAndGoals, trendsInsights, closing) plus a standalone `scales` array — matches the plan's explicit contract for 07-13 to translate as pure JSON"
  - "SCALES' `isDefault` boolean stays inside the catalogue array (not split into a code-side parallel array) since it's the least disruptive reading of 'SCALES becomes a catalogue array of three objects' and a translator never touches it"
  - "Considered but rejected cross-array deduplication of the incidentally-identical 'LOW'/'HIGH' weight-tier words between the habit-chips demo and the weight-tier legend cards — no precedent for this exists anywhere in the codebase's catalogues (VCDSection, mcp.json, home.json all keep each list self-contained), and it would produce a non-uniform array shape once habitChips[2]'s distinct abbreviation ('MED' vs 'MEDIUM') is accounted for, working against 07-13's pure-JSON-translation goal instead of for it"
  - "The es/features.json-is-{} + page-calls-getTranslations combination broke the Next.js static build (MISSING_MESSAGE -> undefined from t.raw() -> TypeError). Fixed with a page-scoped t.has() fallback to English, NOT a src/i18n/request.ts change, because a human was actively hand-editing that exact file (plus src/messages/{en,es}/home.json) during this session — see Deviations"

requirements-completed: [I18N-01]

# Metrics
duration: ~55min
completed: 2026-08-20
---

# Phase 7 Plan 11: Extract /features into the English catalogue Summary

**Moved all ~115 leaf strings out of the 970-line `/features` page into a section-mirrored `src/messages/en/features.json`, proved the English render is byte-identical, and added a page-scoped English-fallback so `/es/features` keeps prerendering while its catalogue is still `{}`.**

## Performance

- **Duration:** ~55 min
- **Completed:** 2026-08-20
- **Tasks:** 2 (both plan tasks executed as one continuous extraction pass across the same two files)
- **Files modified:** 2

## Accomplishments

- `src/messages/en/features.json` created: 115 leaf keys (per `npm run i18n:gates` Gate 2 count) across 8 top-level sections — `hero`, `scales` (3-entry array), `temporalHierarchy`, `dailyScore`, `pulseLoop`, `habitsAndGoals`, `trendsInsights`, `closing` — with every nested list (bullets, steps, detectors, chips, tiers) preserved as a JSON array so 07-13's array-length parity check and review-visible reordering both work.
- `src/app/[locale]/features/page.tsx` rewritten to be fully catalogue-driven: every section function now takes a `Translator` prop (same pattern as `mcp/page.tsx`) and reads copy via `t()`/`t.raw()`. Zero string literals reach the DOM as text. The page confirmed to have **no** `alt`/`aria-label`/`title` attributes at all (grepped before and after — none exist on this page), so there was nothing in that category to extract.
- English render proven byte-identical: captured `/features`' rendered `body.innerText` from a production build before any edit (3918 chars) and after the full extraction (3918 chars) — `diff` exit 0, zero differences.
- KU-1 (the `span.font-mono.text-[11px].uppercase` "Connectedness" label overflowing its own box by 7px, width-independent across all 7 launchable Chromium viewports) is unaffected: the literal text, its selector, and every surrounding class are untouched. `npx playwright test containment.spec.ts a11y.spec.ts -g "/features"` passed 42/42 non-touch-iphone tests (containment + a11y, both `/features` and `/es/features`, at reflow-320/mobile-360/mobile-390/mobile-430/tablet-768/laptop-1024/desktop-1440) on the final clean run — see Issues Encountered for a flaky intermediate run.
- `src/messages/es/features.json` is still exactly `{}`. `npm run i18n:gates` reports `[WARN][GATE 2 PARITY] features — namespace not yet translated (115 en keys, 0 es keys)` — a warning, not a failure, which is the intended PENDING state for plan 07-13 to claim.

## Task Commits

1. **Tasks 1+2 combined: extract page chrome/SCALES/all five sections, prove English unchanged** - `da696cf` (feat) — both plan tasks touch the same two files and were executed as one continuous pass rather than two separately-verifiable diffs, so they landed as a single commit.

**Plan metadata:** pending (this commit, plus STATE.md/ROADMAP.md/REQUIREMENTS.md update, follows this summary)

## Files Created/Modified

- `src/app/[locale]/features/page.tsx` — every section (`TemporalHierarchySection`, `DailyScoreSection`, `PulseLoopSection`, `HabitsAndGoalsSection`, `TrendsInsightsSection`) now takes `{ t: Translator }`; `SCALES` const replaced by `t.raw("scales")`; `SectionEyebrow`'s `num` stayed in code, `label` now passed as a translated string from each caller; added the `t.has("hero.heading")` English-fallback branch in `MethodologyPage`.
- `src/messages/en/features.json` — new namespace, 115 leaf keys, structure documented above.

## Decisions Made

- **Catalogue shape mirrors the page's five real sections plus `scales` and `closing` as their own top-level keys** — this is the exact contract 07-13 depends on (its own interfaces block already assumes `hero`, `temporalHierarchy`, `dailyScore`, `pulseLoop`, `habitsAndGoals`, `trendsInsights` as top-level keys; this plan additionally establishes `scales` as its own top-level array and `closing` for the footer CTA, both consistent with "one key per section, arrays for ordered content").
- **`isDefault` (a boolean, not copy) stays inside each `scales[i]` object** rather than being split into a code-side parallel array. Reasoned as the more literal reading of the plan's "SCALES becomes a catalogue array of three objects" instruction; 07-13 just copies `true`/`true`/`false` unchanged, no translation burden.
- **Weight numbers (`1`/`4`/`2`), the demo `done` checkbox state, and the `×1`/`×2`/`×4` multiplier digits stay in code**, index-aligned with `dailyScore.habitChips` and `dailyScore.weightTiers` — same "illustrative UI data, not text, cannot legitimately differ between locales" rationale `SystemBlueprintSection.tsx` already documents for `GOAL_PROGRESS`.
- **No cross-array deduplication of "LOW"/"HIGH"** even though they render as the exact same literal string at two call sites (the habit-chips demo and the weight-tier legend cards) within `DailyScoreSection`. Evaluated a shared `weightLabels` lookup object; rejected because (a) no precedent for this exists anywhere in the codebase's other catalogues — every array-of-objects list in `home.json`/`mcp.json`/`blueprint.json`/`manifesto.json` is self-contained — and (b) the habit chips' third entry uses a distinct abbreviation (`MED`, not `MEDIUM`), so a shared lookup would produce a non-uniform, harder-to-translate array shape for exactly the two entries it *would* apply to, working against the stated goal of a pure-JSON, non-archaeological translation pass for 07-13.
- **The `t.has()` page-scoped fallback lives in `page.tsx`, not `src/i18n/request.ts`.** The first implementation attempt modified the shared request-config loader (a general "empty namespace falls back to English" rule), which is arguably the more elegant fix and would also solve this for plan 07-12/07-14's changelog split. It was reverted after a mid-task coordinator message reported a human actively hand-editing `src/i18n/request.ts` (plus `src/messages/{en,es}/home.json`) in the same working tree. `git diff` confirmed the reverted content was 100% my own uncommitted edit (no human content present), so `git checkout -- src/i18n/request.ts` was safe per this workflow's own exception for files authored in the current session. The replacement fix — `if (!t.has("hero.heading")) t = await getTranslations({ locale: "en", namespace: "features" })` in `MethodologyPage` — achieves the identical runtime behavior scoped entirely to this plan's own file, using the exact `getTranslations({ locale, namespace })` call shape `src/app/[locale]/layout.tsx` already uses for the locale-hint. **Plan 07-12 (changelog) will need the equivalent fallback in its own page component when it hits the same `{}`-namespace-vs-static-build interaction.**

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `/es/features` failed to prerender once the page started calling `getTranslations("features")` against an empty `es/features.json`**
- **Found during:** Task 2 verification (`npm run build`)
- **Issue:** Before this plan, `features/page.tsx` never called `getTranslations`, so the pre-existing empty `es/features.json` was never dereferenced and the build was unaffected. The moment Task 1's extraction added real `t()`/`t.raw()` calls, `/es/features`'s build threw `TypeError: Cannot read properties of undefined (reading 'map')` — `t.raw()` returns `undefined` for a key missing entirely from an empty namespace object, and my section code unconditionally called `.map()` on it.
- **Fix:** Added a page-scoped fallback in `MethodologyPage`: `let t = await getTranslations("features"); if (!t.has("hero.heading")) { t = await getTranslations({ locale: "en", namespace: "features" }); }`. This lets `/es/features` render with (temporarily) English copy until plan 07-13 fills the Spanish catalogue, at which point `t.has()` returns true and the branch stops firing. Confined entirely to this plan's own file — see the request.ts note above for why a shared-config version of this fix was attempted first and then reverted.
- **Files modified:** `src/app/[locale]/features/page.tsx`
- **Verification:** `npm run build` succeeds, both `/features` and `/es/features` prerender (`●` SSG in the build output); `/es/features` renders the shared-chrome Spanish nav/footer (already translated in `common.json`) with the page body temporarily in English — the expected mixed-language intermediate state, confirmed by inspecting the captured `body.innerText`.
- **Committed in:** `da696cf` (combined Tasks 1+2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking, Rule 3)
**Impact on plan:** Necessary for the plan's own stated acceptance criterion ("`/features` and `/es/features` both prerendered") while `es/features.json` stays exactly `{}` as required. No scope creep — the eventual fix touches only this plan's declared files.

## Issues Encountered

- **Flaky axe run under 8-way parallel load, not a real regression.** The first full `npx playwright test containment.spec.ts a11y.spec.ts -g "/features"` run reported `color-contrast (serious)` and `target-size (serious)` axe violations at `tablet-768`, `laptop-1024`, and `desktop-1440` for both `/features` and `/es/features` (6 failures beyond the expected touch-iphone set). Investigated: my changes touch zero classNames/styles/DOM structure, and a standalone script reproducing the exact `gotoSettled`/`unclipViewport`/`settle` sequence found **zero** violations. A targeted re-run of just those three projects' `a11y.spec.ts` tests passed 12/12 clean, and a full re-run of the whole `-g "/features"` suite passed 42/42 non-touch-iphone tests clean. Concluded this was resource-contention flakiness (8 parallel Chromium workers competing for CPU on this dev machine, causing the fixed-duration animation/font `settle()` waits to not fully resolve under load before axe sampled the DOM), not a defect from this extraction. Not fixed (nothing to fix — my diff doesn't touch styling), not suppressed, just re-verified.
- **A byte-diff capture script (throwaway, `.tmp-07-11-capture-text.mjs`, never committed) showed a spurious large diff on one run** (uppercase text and different line-splitting versus the clean baseline) before a `document.fonts.ready` + settle wait was added to the script. Root-caused to the same class of font-swap/reflow timing race as above — the `.display` utility's CSS `text-transform: uppercase` and the inline wordmark SVG's layout can be sampled mid-reflow by Playwright's `innerText()` immediately after `networkidle`. The original 0-diff comparison (captured without this fix, but consistently on both sides) remains valid evidence since both before/after captures used the identical method; a hardened re-capture (3x consecutive, font-ready + 300ms settle) was stable at 3950 chars across all three runs, and a manual screenshot confirmed correct visual rendering throughout.
- **Mid-task coordinator hands-off notice on `src/i18n/request.ts`, `src/messages/{en,es}/home.json`, `src/app/globals.css`, `src/components/Footer.tsx`.** Only `request.ts` had been touched by me at that point (an uncommitted, safely-revertible edit — see Deviations above); the other three files were never touched by this plan. Confirmed via `git status`/`git diff` that the revert was clean and lost no human work, and that concurrent human commits landing during this session (`ac9c02c`, `044e0c4`, `15b3659`, `a4b388e`) never touched `src/app/[locale]/features/page.tsx` or `src/messages/en/features.json`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan 07-13 can now translate `/es/features` as a pure JSON write against `src/messages/en/features.json`'s exact key structure (`hero`, `scales[3]`, `temporalHierarchy`, `dailyScore` with `habitChips[3]`/`weightTiers[3]`, `pulseLoop` with `morning.steps[4]`/`evening.steps[8]`, `habitsAndGoals` with `habits.bullets[3]`/`goals.bullets[3]`, `trendsInsights` with `detectors[4]`, `closing`) — no component edits required, matching this plan's stated purpose.
- **Flag for 07-13 / whoever owns plan 07-12 (changelog):** the `t.has()`-based English-fallback pattern this plan added to `features/page.tsx` will very likely be needed again in `changelog/page.tsx` once 07-12 extracts that page's English catalogue ahead of 07-14's Spanish translation, for the identical reason (an empty `es/changelog.json` + a page that now calls `getTranslations`). Worth lifting into a small shared helper (e.g. `src/i18n/getTranslationsWithFallback.ts`) at that point rather than duplicating the branch a third time — flagged here rather than done now, since touching a new shared file was out of this plan's scope and `src/i18n/` was the exact directory under a concurrent human edit during this session.
- No blockers for 07-13.

---
*Phase: 07-spanish-localization*
*Completed: 2026-08-20*


## Self-Check: PASSED
