---
phase: 07-spanish-localization
plan: 12
subsystem: i18n
tags: [next-intl, changelog, json-catalogue, date-formatting, icu, skill-authoring]

# Dependency graph
requires:
  - phase: 07-spanish-localization
    provides: "next-intl routing/request scaffolding (07-03), locale-aware harness + CI gates (07-03), LanguageSwitcher (07-04)"
provides:
  - "src/messages/en/changelog.json — the complete changelog English catalogue: page chrome, closed tags.* set, noteLabel, and all 33 entries with ISO dates and closed tag keys"
  - "ChangelogItem.tsx as an async Server Component reading noteLabel/tags.* via getTranslations and formatting entry.date via next-intl's getFormatter with an explicit timeZone: 'UTC' pin"
  - "changelog/page.tsx reading page.heading/page.subheading/entries via getTranslations, with the same page-scoped English-fallback gate 07-11 established for /features"
  - "07-12-ENTRY-COUNT.txt — the derived entry count (33) plan 07-14 reads for its own parity check"
  - "el-portal-changelog skill corrected to describe the catalogue-driven codebase and mandate a Spanish-write step on every future sync"
affects: ["07-14 (translates src/messages/es/changelog.json against this plan's catalogue shape)"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Page-scoped English-translator fallback for a PENDING namespace (t.has() gate), reused verbatim from 07-11's /features precedent, applied at two call sites in this plan (page.tsx and ChangelogItem.tsx)"
    - "Shared-once ISO date + next-intl getFormatter().dateTime(..., { timeZone: 'UTC' }) instead of a per-locale formatted date string, to remove a whole translatable-string class from every future sync"
    - "Closed six-key tag set (tags.* labels defined once per locale) instead of free-text tags on each entry"

key-files:
  created:
    - .planning/phases/07-spanish-localization/07-12-ENTRY-COUNT.txt
  modified:
    - "src/app/[locale]/changelog/page.tsx"
    - src/components/ChangelogItem.tsx
    - src/messages/en/changelog.json
    - .claude/skills/el-portal-changelog/SKILL.md

key-decisions:
  - "Entry count derived by grep at execution time (33 entries, 7 notes), matching the 07-PATTERNS.md corroborated figure exactly — no delta from the 33 observed at planning time"
  - "Dates stored as bare ISO strings (\"YYYY-MM-DD\") and rendered via next-intl's server getFormatter with { year: 'numeric', month: 'long', day: '2-digit', timeZone: 'UTC' } — day: '2-digit' was required (not day: 'numeric') to match the source's existing zero-padded days (\"May 06, 2026\")"
  - "Added a datetime={entry.date} attribute to the <time> element as a small, in-scope correctness improvement now that a real Date value exists — does not affect rendered text, class names, or the frozen layout"
  - ".claude/skills/el-portal-changelog/SKILL.md is written correctly on disk but is NOT git-committed: the project's own .gitignore blanket-excludes .claude/ (only .claude/AGENT-SYSTEM.md is allow-listed), consistent with CLAUDE.md's Shared agent-config system section describing .claude/ as LifeOS-governed, not a project deliverable — `git ls-files .claude/` confirms zero files under that path have ever been tracked in this repo. CLAUDE.md takes precedence over the plan's files_modified/commit expectation per the harness's own enforcement rule."

requirements-completed: [I18N-01, I18N-07]

# Metrics
duration: ~50min
completed: 2026-08-20
---

# Phase 7 Plan 12: Changelog English Extraction Summary

**Moved all 33 changelog entries (7 with notes) out of a hardcoded TSX array into `src/messages/en/changelog.json`, converted dates to shared ISO values rendered through a UTC-pinned next-intl formatter, closed the tag set to six catalogue-driven keys, and extended the changelog sync skill to write both locales on every future sync.**

## Performance

- **Duration:** ~50 min (not formally timed at session start; estimated from tool-call sequence)
- **Completed:** 2026-08-20T13:43Z
- **Tasks:** 2/2 completed
- **Files modified:** 4 (1 created: `07-12-ENTRY-COUNT.txt`; 3 modified: `page.tsx`, `ChangelogItem.tsx`, `en/changelog.json`) + 1 skill file corrected on disk but not git-tracked (see Deviations)

## Accomplishments

- Derived the entry count mechanically (`grep -c 'version:'` → 33, `grep -c 'note:'` → 7) and wrote it to `.planning/phases/07-spanish-localization/07-12-ENTRY-COUNT.txt`, matching the number both 07-PATTERNS.md readings had already independently corroborated — no plan-constant drift risk
- Extracted the entire `ENTRIES` array plus the page's H1/subheading into `src/messages/en/changelog.json` under `page.*`, `tags.*`, `noteLabel`, and `entries[]`; every field of the `ChangelogEntry` type carried across, including the two optional fields (`bullets`, `note`) that a manual eyeball pass would risk dropping
- Converted every entry's date to a bare ISO string and made `ChangelogItem` an async Server Component that formats it via `next-intl`'s `getFormatter().dateTime(..., { timeZone: "UTC" })` — English rendering verified byte-identical to the pre-extraction capture, and the same entry renders identically under `TZ=UTC`, `TZ=Pacific/Kiritimati` (UTC+14), and `TZ=Pacific/Midway` (UTC-11)
- Mapped free-text tags (`"New Feature"`, `"Fix"`, ...) onto a closed six-key set (`newFeature | improvement | optimization | fix | hotfix | release`), with display labels defined once per locale under `tags.*`
- Extracted the hardcoded `Note:` label out of `ChangelogItem.tsx` into `noteLabel`, read via `getTranslations('changelog')`
- Rewrote `.claude/skills/el-portal-changelog/SKILL.md` to describe the catalogue-driven codebase (corrected repo paths, target files, entry template) and added a mandatory Spanish-write step (Step 5) plus an entry-count-currency step (Step 6) to the sync workflow

## Task Commits

Each task's file-level changes were committed atomically where the files were git-trackable:

1. **Task 1: Derive the entry count, then move every entry into the catalogue with locale-formatted dates, closed tag keys, and notes intact** — `b2e077e` (feat)
2. **Task 2: Extend the changelog sync skill to write both locales** — no commit (file corrected on disk; not git-trackable in this repo — see Deviations)

**Plan metadata:** (this commit, docs(07-12): complete plan)

## Files Created/Modified

- `.planning/phases/07-spanish-localization/07-12-ENTRY-COUNT.txt` - single line, `33` — derived expected-entry-count artifact for this plan's gate and plan 07-14's parity check
- `src/messages/en/changelog.json` - the complete English changelog catalogue (`page`, `tags`, `noteLabel`, `entries[33]`, 7 with `note`)
- `src/components/ChangelogItem.tsx` - now an async Server Component; reads `noteLabel`/`tags.*` via `getTranslations('changelog')` (with the page-scoped English-fallback gate), formats `entry.date` via `getFormatter().dateTime(..., { timeZone: "UTC" })`, adds a `TagKey` union type
- `src/app/[locale]/changelog/page.tsx` - reads `page.heading`, `page.subheading`, and the raw `entries` array via `getTranslations('changelog')` with the same fallback gate; the hardcoded `ENTRIES` TSX array is gone
- `.claude/skills/el-portal-changelog/SKILL.md` - corrected on disk (real repo paths, catalogue-shaped entry template, mandatory bilingual-write step, entry-count-currency step) — **not git-tracked**, see Deviations

## Decisions Made

- **Date format options:** `{ year: "numeric", month: "long", day: "2-digit", timeZone: "UTC" }`. `day: "2-digit"` (not the more common `day: "numeric"`) was necessary to reproduce the source's existing zero-padded single-digit days (`"May 06, 2026"`, `"April 01, 2026"`) — verified with a direct `Intl.DateTimeFormat` comparison before wiring it into the component.
- **`dateTime` attribute added to `<time>`:** a byte-for-byte-safe, in-scope correctness improvement (semantic `<time datetime="...">` now that a real ISO value exists) — does not change rendered text, class names, or any frozen layout value.
- **Skill file not committed to git** (see Deviations below) — a CLAUDE.md-driven adjustment, not an oversight.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 — CLAUDE.md-driven adjustment] `.claude/skills/el-portal-changelog/SKILL.md` corrected on disk but not git-committed**
- **Found during:** Task 2, immediately before staging
- **Issue:** The plan's `files_modified` lists `.claude/skills/el-portal-changelog/SKILL.md` and expects it to land in a `docs(07-12):`-prefixed commit. The project's own `.gitignore` (line 63: `.claude`) blanket-excludes the entire `.claude/` tree, allow-listing only `.claude/AGENT-SYSTEM.md`. `git ls-files .claude/` returns zero results — no file under `.claude/`, including this skill, has ever been tracked in this repository. CLAUDE.md's "Shared agent-config system" section explicitly frames `.claude/` content (MCP servers, skills, plugins, memory) as governed by a LifeOS-rooted system external to the project repo, and per the harness's own CLAUDE.md-enforcement rule, that directive takes precedence over the plan's commit expectation.
- **Fix:** Wrote the fully corrected `SKILL.md` content to its canonical on-disk path (verified via the Task 2 automated gate: `SKILL_UPDATED`, exit 0) so the skill functions correctly for any future invocation that reads it directly. Did not `git add -f` the file or stage it in any commit.
- **Files modified:** `.claude/skills/el-portal-changelog/SKILL.md` (disk only, not staged)
- **Verification:** Task 2's automated gate script ran directly against the file and passed with `SKILL_UPDATED`; `git status` confirms the file produces no trackable diff (it was never tracked to begin with)
- **Committed in:** N/A — no commit exists for this file; see explanation above

---

**Total deviations:** 1 (CLAUDE.md-driven, not a bug/gap fix)
**Impact on plan:** The skill's functional content is fully corrected and matches every acceptance criterion in Task 2 (verified by the plan's own gate). The only shortfall relative to the plan's literal wording is that no git commit exists for this one file, because git-tracking it would contradict this project's own `.gitignore`/CLAUDE.md convention. All other plan deliverables (catalogue shape, date formatting, tag closure, note label, entry count artifact) are git-committed exactly as specified.

## Issues Encountered

- **Self-inflicted `pkill -f` false kill during TZ verification:** an early attempt to stop the background dev server used `pkill -f "port 3987"` / `pkill -f "next-server"`, both of which matched the *invoking* bash command's own argv (since the pattern text was present in the script being executed), terminating the running Bash tool call itself rather than the target server. Recovered by switching to PID-based `kill "$SRV_PID"` (captured via `$!` immediately after backgrounding each server) for the remaining two TZ runs — both completed cleanly with the port verified free afterward via `ss -ltnp`.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `src/messages/en/changelog.json` is complete and stable — plan 07-14 can translate `entries[]`, `page.*`, `tags.*`, and `noteLabel` directly against this shape without any further mechanical extraction.
- `src/messages/es/changelog.json` is confirmed unchanged, still exactly `{}` (verified via `git diff --stat` producing no output and `cat` showing `{}`). `npm run i18n:gates` reports `[WARN][GATE 2 PARITY] changelog — namespace not yet translated (404 en keys, 0 es keys)` — a warning, not a failure, exactly the PENDING state the plan calls for.
- `.planning/phases/07-spanish-localization/07-12-ENTRY-COUNT.txt` (`33`) is available for 07-14's own parity check.
- The `el-portal-changelog` skill's Step 5 (mandatory bilingual write) and Step 6 (entry-count currency) are in place on disk for whenever the next real changelog sync runs — no code path depends on the skill being git-tracked for it to function.
- Per plan 07-11's carried-forward note, do not attempt to "fix" the PENDING-namespace fallback in `src/i18n/request.ts` — it is human-owned and out of scope; the page-scoped `t.has()` gate pattern (now used identically in `page.tsx` and `ChangelogItem.tsx`) is the sanctioned mechanism, established by 07-11 and reused here without modification.

---

## Verification Evidence

**PROVE-01 — byte-identical English rendering.** Captured `/changelog` and `/es/changelog` rendered `<main>` innerText via a scratch Playwright script, once against the pre-extraction build (hardcoded `ENTRIES` array, `en/changelog.json` already written but not yet wired) and once against the post-extraction build. `diff` on both captures reported zero differences (22,672 characters each, byte-identical) for both routes.

**PROVE-02 — UTC timezone pin.** The top entry (`v2.0.28`, ISO `2026-05-20`) rendered as `May 20, 2026` under all three tested runtime zones:
```
TZ=UTC                 -> May 20, 2026
TZ=Pacific/Kiritimati  -> May 20, 2026   (UTC+14)
TZ=Pacific/Midway      -> May 20, 2026   (UTC-11)
```

**PROVE-03 — entry-shape gate.** `ENTRY_SHAPE_OK — 33 entries, 7 notes` (exit 0) — catalogue length matches the derived count file, exactly 7 notes each with a valid `icon` from the closed `lock|rocket|info|pen` set, `noteLabel` present, no `Note:` literal remaining in `ChangelogItem.tsx`, `timeZone` pin present in the rendering path.

**PROVE-04 — quality gates.** `npx tsc --noEmit` exit 0. `npx eslint src e2e scripts` exit 0 (0 errors; 2 pre-existing unused-var warnings in unrelated files — `changelog/page.tsx`'s `FG_MUTED` was already unused before this plan's edits, confirmed via `git show HEAD~1:...`; `manifesto/page.tsx`'s `ACCENT_LIGHT` is a different file entirely — both out of scope per the SCOPE BOUNDARY rule). `npm run i18n:gates` exit 0, 0 failures, 5 warnings (the `changelog` PENDING-namespace warning plus 4 pre-existing warnings in unrelated `legal.json`/`pricing.json`/`features.json` files).

**PROVE-05 — build.** `npm run build` exit 0; both `/en/changelog` and `/es/changelog` listed as prerendered (SSG) routes.

**PROVE-06 — layout/a11y.** `npx playwright test containment.spec.ts a11y.spec.ts -g "changelog"` across the 7 non-`touch-iphone` projects (`reflow-320`, `mobile-360`, `mobile-390`, `mobile-430`, `tablet-768`, `laptop-1024`, `desktop-1440`): 42/42 passed, 0 failures. `touch-iphone` was not run (confirmed environmentally blocked per the carried-forward WebKit/libicu74 constraint, not attempted as passing).

**PROVE-07 — es/changelog.json untouched.** `cat src/messages/es/changelog.json` → `{}`. `git diff --stat src/messages/es/changelog.json` → no output (zero changes). `git status --short` never listed this file as modified at any point in this plan's execution.

**PROVE-08 — tag/date/note.icon closure.** All 5 tag strings actually present in the pre-extraction source (`Fix`, `New Feature`, `Improvement`, `Optimization`, `Release` — `Hotfix` never appears in the shipped data but is included in `tags.*` per the plan's closed six-key set) mapped cleanly to their catalogue keys with no unmapped value; all 33 dates parsed to valid `YYYY-MM-DD` ISO strings with no parse failures; all 7 `note.icon` values (`lock` ×4, `rocket` ×1, `info` ×1, `pen` ×1) are members of the closed set.

## Self-Check: PASSED

- `FOUND: .planning/phases/07-spanish-localization/07-12-ENTRY-COUNT.txt` (created, contains `33`)
- `FOUND: src/messages/en/changelog.json` (33 entries, 7 notes, `page`/`tags`/`noteLabel` present)
- `FOUND: src/components/ChangelogItem.tsx` (async, `getFormatter`/`getTranslations` imported, `timeZone` present, no `Note:` literal)
- `FOUND: src/app/[locale]/changelog/page.tsx` (no `ENTRIES` array, `getTranslations('changelog')` present)
- `FOUND: .claude/skills/el-portal-changelog/SKILL.md` (on disk, verified via Task 2's gate; not git-tracked, by design — see Deviations)
- Commit `b2e077e` found in `git log --oneline --all`

---
*Phase: 07-spanish-localization*
*Completed: 2026-08-20*
