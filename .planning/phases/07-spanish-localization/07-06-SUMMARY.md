---
phase: 07-spanish-localization
plan: 06
subsystem: i18n
tags: [next-intl, i18n, home, hero, vcd, mcp-integration, spanish]

# Dependency graph
requires:
  - phase: 07-spanish-localization
    provides: "next-intl routing/navigation infra (07-01), i18n CI gates (07-03), common namespace + LanguageSwitcher (07-04), ACCENTED DISPLAY TYPE verdict Outcome A (07-05)"
provides:
  - "home namespace (hero.*, vcd.*, mcpIntro.*) in en/home.json and es/home.json, both fully populated and key-identical"
  - "Hero, VCDSection, McpIntegrationSection and HeroAppMockup converted from inline JSX copy to useTranslations('home')"
  - "Version/Cycle/Day deduplicated to one vcd.captions array, referenced from both the Caption grid and BandLabel/LayeredStrata"
  - "biometrics -> biometría glossary-additions/07-06.md coinage"
  - "TRANSLATION-FLAGS.07-06.md with 4 wordplay-loss rows"
affects: ["07-16 (aggregates TRANSLATION-FLAGS + glossary-additions, runs the full Playwright battery)"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Client Component copy extraction: useTranslations('home') alongside a second useTranslations('common') call in the same component when a string is shared cross-namespace (Hero's primary CTA)"
    - "Ordered content stored as a catalogue array (vcd.captions) and read with t.raw(), indexed by both the Caption grid and a second call site (BandLabel) so a repeated word cannot drift between its two renderings"

key-files:
  created:
    - src/messages/glossary-additions/07-06.md
    - .planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-06.md
  modified:
    - src/components/Hero.tsx
    - src/components/hero/VCDSection.tsx
    - src/components/hero/HeroAppMockup.tsx
    - src/components/hero/McpIntegrationSection.tsx
    - src/messages/en/home.json
    - src/messages/es/home.json

key-decisions:
  - "Hero's primary CTA ('Open El Portal') reads common.cta.button via a second useTranslations('common') call instead of a duplicate home key, per the plan's explicit instruction not to re-duplicate a string 07-04 already owns."
  - "VCD's three horizon labels/bodies are one catalogue array (home.vcd.captions), read by index from both the Caption grid and BandLabel inside LayeredStrata, so Version/Cycle/Day cannot diverge between their two render sites."
  - "Hero headline translated as 'El sistema operativo definitivo para el alto rendimiento.' (targets the domain of high performance) rather than a longer literal 'para las personas de alto rendimiento' (targets the people) — chosen to keep the H1 line count close to English (5/5/5/4 vs English's 5/5/4/4 at 320/360/390/430) while staying within the frozen clamp; the identity-label nuance loss is recorded in TRANSLATION-FLAGS.07-06.md."
  - "'trends' in Hero's subcopy ('the trends the eye misses') translated as the ordinary Spanish noun 'tendencias', not the kept-English product noun 'Trends' — read here as descriptive prose about pattern-recognition, not a literal reference to the app's Trends screen, distinct from McpIntegrationSection's 'habits, cycles, and trends' list which does name the three real product domains and keeps 'Trends' in English accordingly."
  - "'biometrics' has no app UI string (GLOSSARY.md has no entry) — translated as the standard dictionary term 'biometría' and logged in glossary-additions/07-06.md rather than left unresolved or invented ad hoc."

patterns-established: []

requirements-completed: [I18N-01, I18N-07]

# Metrics
duration: ~45min
completed: 2026-08-20
---

# Phase 07 Plan 06: Home Hero/VCD/MCP-Intro Translation Summary

**Extracted Hero, VCDSection and McpIntegrationSection into a `home` next-intl namespace, wrote the Spanish mirror, and proved the hero H1 contains itself at 320/360/390/430 with a near-identical line count to English (5/5/5/4 vs 5/5/4/4).**

## Performance

- **Duration:** ~45 min
- **Started:** ~2026-08-20T09:10Z (estimated — context loading preceded the first commit)
- **Completed:** 2026-08-20T09:53:28+02:00
- **Tasks:** 3/3 completed
- **Files modified:** 6 (4 components, 2 catalogue files) + 2 new (glossary-additions, translation-flags)

## Accomplishments

- `Hero.tsx`, `VCDSection.tsx`, `McpIntegrationSection.tsx` and `HeroAppMockup.tsx` are fully catalogue-driven via `useTranslations('home')`; English rendering is unchanged (verified via `npm run build` prerendering `/` cleanly and a residual grep finding zero leftover JSX text nodes or `label=`/`body=`/`title=` literals).
- `home.vcd.captions` is a single 3-item array read from two call sites (the `Caption` grid and `BandLabel` inside `LayeredStrata`), so `Version`/`Cycle`/`Day` cannot drift between their two renderings on the page — the exact drift risk the plan's threat register (T-07-06-04) called out.
- `HeroAppMockup.tsx`'s hardcoded `alt` text moved to `home.hero.heroImage.alt`, closing an I18N-01 gap that a plain JSX-string extraction pass would have missed (the alt lived in a module-level data constant, not JSX).
- Spanish `home` namespace is key-identical to English (17/17 keys, matching array lengths), passes `npm run i18n:gates` with 0 failures/0 warnings, and contains itself at every mobile width with zero clamp/type-scale changes.
- Wordplay register (`TRANSLATION-FLAGS.07-06.md`) checked every translated string against all four triggers and logged 4 concrete losses (not sampled, not padded).

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract Hero, VCDSection and McpIntegrationSection into the home namespace** - `4a27efb` (feat)
2. **Task 2: Write the Spanish home copy and prove it fits** - `1f8185a` (feat)
3. **Task 3: Wordplay check — record what did not survive into Spanish** - `71aaac4` (docs)

_No plan-metadata commit yet — created below, after this summary and STATE.md update._

## Files Created/Modified

- `src/components/Hero.tsx` - Announcement pill, H1, subcopy and secondary CTA now read from `useTranslations('home')`; primary CTA reads `useTranslations('common')` (`cta.button`)
- `src/components/hero/VCDSection.tsx` - Heading/subheading and the deduplicated `vcd.captions` array now read from `useTranslations('home')`; `LayeredStrata`/`BandLabel` take `captions` as a prop instead of hardcoded label strings
- `src/components/hero/HeroAppMockup.tsx` - `alt` moved out of the `HERO_IMAGE` constant into `home.hero.heroImage.alt`; `src`/`width`/`height` stay as configuration
- `src/components/hero/McpIntegrationSection.tsx` - h2/body/CTA now read from `useTranslations('home')`; internal `/mcp` link was already on `@/i18n/navigation` from an earlier commit
- `src/messages/en/home.json` - New `hero.*`, `vcd.*`, `mcpIntro.*` namespace, English source
- `src/messages/es/home.json` - Spanish mirror, key-identical
- `src/messages/glossary-additions/07-06.md` - `biometrics -> biometría` coinage
- `.planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-06.md` - 4 wordplay-loss rows

## Decisions Made

See `key-decisions` in frontmatter. Summarized: the Hero primary CTA references `common.cta.button` rather than duplicating the string; `vcd.captions` is one array read from two call sites to make label drift structurally impossible; the hero headline trades a fully literal "for the people who are high-performers" for a shorter "for high performance" phrasing to keep line-count parity with English (logged as a wordplay loss, not a silent flattening); `trends` in Hero's subcopy is the ordinary word, not the kept-English product noun, since it reads as descriptive prose rather than a literal reference to the app's Trends screen (contrast with McpIntegrationSection's `habits, cycles, and trends` list, which does name the three product domains and keeps `Trends` in English there).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking, self-resolving by task order] `npm run build` fails mid-plan because `es/home.json` is `{}` until Task 2**
- **Found during:** Task 1's own verification block (which chains `npm run build` after the mechanical extraction check)
- **Issue:** Task 1's `<verify>` block runs `npm run build` immediately after extracting strings to `useTranslations('home')`, but `src/messages/es/home.json` stays `{}` until Task 2 runs — next-intl's default `getRequestConfig` (no custom `onError`/`getMessageFallback` is configured in `src/i18n/request.ts`) throws `MISSING_MESSAGE` for every `home.*` key during static prerendering of `/es`, failing the build. This is a structural consequence of splitting "extract to English" and "write Spanish" into two separate tasks in one plan, not a bug in the extraction.
- **Fix:** Ran Task 1's non-build checks (`tsc`, `lint` scoped to the four touched files, the plan's mechanical `node -e` check, and a manual residual grep for leftover JSX text/props) to completion and confirmed all passed before committing Task 1. Deferred the `npm run build` + Playwright portion of Task 1's verify chain to immediately after Task 2 landed the Spanish content, at which point `npm run build` succeeded cleanly with both `/` and `/es` prerendered (confirmed in the Route table: `● /[locale]` → `/en`, `/es`). No code changed to work around this — it resolved itself once both tasks' commits existed in the branch, which they do.
- **Files modified:** None beyond the plan's own Task 1/Task 2 file list.
- **Verification:** `npm run build` after Task 2's commit shows `/[locale]` prerendered for both `en` and `es`; `npm run i18n:gates` reports `0 failure(s), 0 warning(s)`.
- **Committed in:** `4a27efb` (Task 1), `1f8185a` (Task 2) — both commits exist and the full build/Playwright chain was confirmed green after the second.

---

**Total deviations:** 1 auto-fixed (1 blocking, sequencing-only — no code defect)
**Impact on plan:** None on scope or output. The two-task split (English extraction, then Spanish authoring) is the plan's own structure; the build simply can't succeed on Task 1's commit alone, and both tasks landed in the same execution session before any commit was reported as final.

## Issues Encountered

- `e2e` Playwright's `touch-iphone` project (WebKit) fails to launch on this host — "Host system is missing dependencies to run browsers" (`sudo npx playwright install-deps` required, no sudo available per this session's working constraints). All 8 tests that ran under `touch-iphone` (axe, contrast, containment, touch-targets for `/` and `/es`) could not execute; every other project (`reflow-320`, `mobile-360`, `mobile-390`, `mobile-430`, `tablet-768`, `laptop-1024`, `desktop-1440`) ran cleanly: 50 passed, 6 skipped (touch-targets tests correctly self-skip at `>=768px`, per the harness's own `test.skip` for the frozen desktop design), 0 failed. This is a pre-existing environment limitation (same root-owned/no-sudo class of issue called out in this plan's working constraints), not something this plan's changes caused or could fix.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The `home` namespace's first three sections are fully translated and structurally protected against label drift (Version/Cycle/Day read from one array).
- `SystemBlueprintSection`, `MethodologyPreviewSection` and the rest of `/` below the fold are out of this plan's scope — a later Wave 3/4 plan owns them.
- `TRANSLATION-FLAGS.07-06.md` and `glossary-additions/07-06.md` are ready for 07-16's aggregation pass; both are new files, neither touched the shared `TRANSLATION-FLAGS.md` or `GLOSSARY.md`.
- The `touch-iphone`/WebKit Playwright gap is environmental, not phase-specific — flagging for whoever runs the full battery in 07-16 in case the same host is used.

## Hero H1 — Spanish line count and containment (required by plan output spec)

`ACCENTED DISPLAY TYPE` verdict that constrained the headline: **Outcome A** (SPANISH-VOICE.md, verified 2026-08-19 by 07-05 Task 2) — Special Gothic Expanded One renders all 13 tested accented glyphs correctly under `.display`'s uppercase transform, so the headline was written with accented capitals freely available (the shipped Spanish headline in this plan happens not to need one, but no avoidance constraint applied).

Measured with a scripted Chromium probe against the production build (`localhost:3988/es`, same method class as 07-05's glyph check — `getBoundingClientRect` + computed `line-height`, not a visual guess), `h1.display` text = "El sistema operativo definitivo para el alto rendimiento.":

| Width | Lines (ES) | Lines (EN, same probe) | Overflow (scrollWidth > clientWidth) |
|---|---|---|---|
| 320px | 5 | 5 | No |
| 360px | 5 | 5 | No |
| 390px | 5 | 4 | No |
| 430px | 4 | 4 | No |

No width shows horizontal overflow (`scrollWidth === clientWidth` at all four); Spanish wraps to one additional line only at 390px versus English, which is within the text-expansion contract's "acceptable and expected" allowance (`07-UI-SPEC.md`: more lines is fine, wider-than-box is not). No clamp or `leading-*` value was touched to achieve this.

**Spanish strings shortened to fit:** none required a fit-driven shortening — no width overflow was found at any measured breakpoint (320/360/390/430 for the H1; 390/430 and, additionally checked, 768/1024 for the three VCD caption cells, all clean). The hero headline's shorter "para el alto rendimiento" phrasing (vs. a longer literal "para las personas de alto rendimiento") was chosen to keep Spanish line-count parity with English and is recorded as a wordplay loss in `TRANSLATION-FLAGS.07-06.md`, not as an overflow-driven cut.

**Glossary additions filed:** `biometrics -> biometría` in `src/messages/glossary-additions/07-06.md` (one term; see that file for the "why the app has no string" rationale).

TRANSLATION FLAGS: 4

---
*Phase: 07-spanish-localization*
*Completed: 2026-08-20*

## Self-Check: PASSED

All 9 created/modified files confirmed present on disk (4 components, 2 catalogue files, 2 new register files, this summary). All 3 task commits (`4a27efb`, `1f8185a`, `71aaac4`) confirmed in `git log --oneline --all`.
