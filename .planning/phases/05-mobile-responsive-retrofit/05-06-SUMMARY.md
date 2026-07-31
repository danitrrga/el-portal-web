---
phase: 05-mobile-responsive-retrofit
plan: 06
subsystem: testing
tags: [playwright, e2e, responsive, harness, overflow, containment]

# Dependency graph
requires:
  - phase: 05-mobile-responsive-retrofit
    provides: "e2e/overflow.spec.ts and e2e/support/pages.ts (gotoSettled, ROUTES) — the harness this plan extends"
provides:
  - "e2e/containment.spec.ts: container-relative overflow sweep (Sweep A text-vs-own-box, Sweep B off-screen-vs-clipping-ancestor)"
  - "npm run audit:containment, wired into npm run audit:responsive via playwright.config.ts's LAYOUT_SPECS"
  - "Proven RED baseline against unfixed src/, naming GAP-01 and GAP-02 by measurement"
  - "KU-1..KU-4 out-of-fence backlog logged in deferred-items.md, including a newly discovered /pricing table clip defect"
affects: [05-07-hero-h1-clamp-and-preview-bleed, 05-VERIFICATION]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Container-relative + viewport-relative offender sweep (never document-root-relative) as the complement to a documentElement.scrollWidth check"
    - "KNOWN_UNFIXED suppression list that always annotates suppressed offenders on testInfo, never silently drops them"

key-files:
  created:
    - e2e/containment.spec.ts
  modified:
    - playwright.config.ts
    - package.json
    - .planning/phases/05-mobile-responsive-retrofit/deferred-items.md

key-decisions:
  - "Ref field on KNOWN_UNFIXED entries uses short greppable IDs (KU-1..KU-4) rather than full prose, keeping the spec file lean while deferred-items.md carries the full writeup"
  - "isExcluded's six guards were verified individually against a named false positive (SVG internals, ReadingLayout glow, Hero pill arrow track, Tailwind truncate) rather than added speculatively"
  - "No fifth KNOWN_UNFIXED entry or exclusion-branch tightening was needed — the RED run reproduced the plan's measured baseline with zero divergence"

requirements-completed: [RESP-02]

# Metrics
duration: 24min
completed: 2026-07-31
---

# Phase 05 Plan 06: Container-Relative Containment Sweep Summary

**New `e2e/containment.spec.ts` Playwright sweep (Sweep A: text-wider-than-own-box, Sweep B: off-screen-content-behind-a-clipping-ancestor) wired into all 8 viewport projects, proven RED on `/` against unmodified `src/` for exactly GAP-01 (`h1.display`, 42px floor) and GAP-02 (dashboard preview 224px bleed) with zero source files touched.**

## Performance

- **Duration:** 24 min
- **Started:** 2026-07-31T15:35:00Z (approx, per STATE.md session continuity)
- **Completed:** 2026-07-31
- **Tasks:** 2 completed
- **Files modified:** 4 (1 created, 3 modified)

## Accomplishments

- Closed **GAP-03**: the harness is no longer blind to defects hidden behind a clipping
  ancestor. `e2e/containment.spec.ts` measures elements against their own box (Sweep A)
  and against the viewport while naming the clipping ancestor (Sweep B) — the exact
  complement of `overflow.spec.ts`'s `documentElement.scrollWidth`-only check.
- Proved the new check is genuinely red against the current, unfixed `src/`: it fails
  on `/` at `reflow-320`, `mobile-360`, `mobile-390` (both sweeps) and `mobile-430`
  (Sweep B only), and passes on all other 7 routes at all 7 launchable Chromium
  viewports. This red→green ordering (plan 05-07 will turn it green) is the proof that
  the harness gap is closed rather than merely asserted.
- Discovered a genuinely new defect on its first run: the `/pricing` comparison table
  is clipped by `div.rounded-xl.border.overflow-hidden` and escapes it by up to 77px at
  320px — invisible to `overflow.spec.ts`, exactly the defect class GAP-03 exists to
  catch. Logged as KU-4, flagged for a design-owner decision.
- Logged all four out-of-fence findings (KU-1..KU-4) in `deferred-items.md`, suppressed
  in the spec only via a greppable `KNOWN_UNFIXED` array whose entries are still pushed
  onto `testInfo.annotations` on every run — never silently dropped.
- Confirmed zero regression in the pre-existing harness (`overflow.spec.ts`,
  `touch-targets.spec.ts`, `a11y.spec.ts`) — identical pass/skip/fail profile to the
  05-VERIFICATION baseline.

## Task Commits

1. **Task 1: Add the container-relative containment spec and wire it into the harness** - `f50d164` (feat)
2. **Task 2: Prove RED against unfixed main and log the out-of-fence backlog** - `9e863d1` (docs)

_Note: Task 2 produced no source changes — the RED run reconciled exactly with the
plan's `<measured_baseline>`, so the only artifact was the `deferred-items.md` writeup._

## Files Created/Modified

- `e2e/containment.spec.ts` — new spec: Sweep A (text wider than its own box) and
  Sweep B (off-screen content masked by a clipping ancestor), with a 6-branch
  `isExcluded` false-positive guard and a `KNOWN_UNFIXED` suppression list.
- `playwright.config.ts` — `LAYOUT_SPECS` regex extended to match `containment.spec.ts`
  (one line changed, nothing else).
- `package.json` — added `"audit:containment": "playwright test containment.spec.ts"`
  immediately after `"audit:overflow"`.
- `.planning/phases/05-mobile-responsive-retrofit/deferred-items.md` — new
  `## From 05-06 containment sweep` section documenting KU-1 through KU-4.

## RED Run — Full Per-Project Result Matrix

`npm run audit:containment` against unmodified `src/`, all 7 launchable Chromium
projects + `touch-iphone` (environment-gapped, see below):

| Project | `/` | `/features` | `/manifesto` | `/changelog` | `/mcp` | `/pricing` | `/privacy` | `/terms` |
|---|---|---|---|---|---|---|---|---|
| reflow-320 | **FAIL** (Sweep A + B) | pass | pass | pass | pass | pass | pass | pass |
| mobile-360 | **FAIL** (Sweep A + B) | pass | pass | pass | pass | pass | pass | pass |
| mobile-390 | **FAIL** (Sweep A + B) | pass | pass | pass | pass | pass | pass | pass |
| mobile-430 | **FAIL** (Sweep B only) | pass | pass | pass | pass | pass | pass | pass |
| tablet-768 | pass | pass | pass | pass | pass | pass | pass | pass |
| laptop-1024 | pass | pass | pass | pass | pass | pass | pass | pass |
| desktop-1440 | pass | pass | pass | pass | pass | pass | pass | pass |
| touch-iphone | FAIL (env) | FAIL (env) | FAIL (env) | FAIL (env) | FAIL (env) | FAIL (env) | FAIL (env) | FAIL (env) |

**Totals:** `12 failed, 52 passed` across 64 tests (7 Chromium projects × 8 routes = 56,
plus `touch-iphone` × 8 routes = 8). Exit code: **1** (non-zero, as required).

- 4 real failures: `/` on `reflow-320`, `mobile-360`, `mobile-390`, `mobile-430` —
  exactly GAP-01 and GAP-02, exactly as predicted.
- 8 `touch-iphone` failures: all identical `browserType.launch` host-dependency errors
  (`libicu74`/`libxml2`/`libflite1` missing, needs `sudo npx playwright install-deps`).
  This is the pre-existing, already-documented environment gap from 05-03 —
  **not a regression**, and no acceptance criterion in this plan requires
  `touch-iphone` to pass.
- All 7 non-`/` routes pass cleanly on all 7 Chromium projects (56 − 4 = 52 ✓).

## JSON Attachment Contents — `mobile-390` on `/`

**`text-overflow-offenders`:**

```json
[
  {
    "selector": "h1.display.mt-8.max-w-4xl",
    "scrollWidth": 358,
    "clientWidth": 342,
    "overflowBy": 16,
    "fontSize": "42px",
    "height": 214,
    "text": "The final operating system for high-performers."
  }
]
```

**`clip-escape-offenders`:**

```json
[
  {
    "selector": "div.relative.z-[5].-mr-56",
    "clipper": "section.relative.overflow-hidden",
    "nearestClipper": "section.relative.overflow-hidden",
    "elLeft": 0,
    "elRight": 614,
    "viewportWidth": 390,
    "offscreenBy": 224
  },
  {
    "selector": "div.relative.mx-auto.max-w-6xl",
    "clipper": "section.relative.overflow-hidden",
    "nearestClipper": "div.relative.z-[5].-mr-56",
    "elLeft": 8,
    "elRight": 606,
    "viewportWidth": 390,
    "offscreenBy": 216
  },
  {
    "selector": "img.mx-auto.block.w-full",
    "clipper": "section.relative.overflow-hidden",
    "nearestClipper": "div.relative.mx-auto.max-w-6xl",
    "elLeft": 25,
    "elRight": 589,
    "viewportWidth": 390,
    "offscreenBy": 199
  }
]
```

Both attachments are captured even though Playwright's reporter only prints the diff
for the first failing `expect` (Sweep A's) in its terminal output — `testInfo.attach`
runs for both arrays before either `expect` call, confirmed by re-running the single
test with `--reporter=json` and reading `results[].attachments[]` directly.

Note the reported `elLeft`/`elRight`/`offscreenBy` for the wrapper div use a viewport
of 390 (`elRight: 614` against `viewportWidth: 390` → `offscreenBy: 224`, i.e.
`614 - 390 = 224`), consistent across all four phone widths (see below).

## Reconciliation Against `<measured_baseline>`

**Exact match, zero divergence.**

| Check | Plan's measured baseline | RED run result | Match? |
|---|---|---|---|
| GAP-01 selector | `h1.display.mt-8.max-w-4xl` | `h1.display.mt-8.max-w-4xl` | ✓ |
| GAP-01 fontSize | `42px` at all 4 phone widths | `42px` at all 4 phone widths | ✓ |
| GAP-01 `scrollWidth` | `358` | `358` | ✓ |
| GAP-01 `height` | `214.14` (rounds to `214`) | `214` | ✓ |
| GAP-01 overflowBy 320/360/390/430 | `86 / 46 / 16 / 0` | `86 / 46 / 16 / 0` | ✓ |
| GAP-02 clipper | `section.relative.overflow-hidden` | `section.relative.overflow-hidden` | ✓ |
| GAP-02 offscreenBy (all 4 phone widths) | wrapper `224`, frame `216`, img `199` | wrapper `224`, frame `216`, img `199` at 320/360/390/430 | ✓ |
| KU-1 `/features` | `117` vs `110`, `overflowBy 7`, all 7 viewports | Suppressed at `mobile-390` via `known-unfixed` annotation on every viewport it fires | ✓ |
| KU-2 `/mcp` | max `66` @320, `26` @360, none ≥390 | No failures at `/mcp` on any viewport (suppressed where it fires) | ✓ |
| KU-3 `/privacy` | max `73` @320, `33` @360, `3` @390 | Suppressed; annotation observed at `mobile-390` (`p.text-sm.font-semibold…`) | ✓ |
| KU-4 `/pricing` | `77` @320, `37` @360, `7` @390, none @430 | 15 `known-unfixed` annotations at `mobile-390` (table + 14 descendants, all matched via `clipper` equality) | ✓ |

No offender outside the measured baseline appeared anywhere in the 64-test matrix.
No exclusion branch needed tightening, and no fifth `KNOWN_UNFIXED` entry was required.

## Sweep-A 430px Non-Firing Asymmetry and the `/features` Pass

- **Sweep A does not fire on `/` at `mobile-430`.** At 430px the H1's content box
  widens to 382px, which exceeds its 358px `scrollWidth` — the box-overflow symptom
  vanishes even though the 42px floor and the 5-line/214px vertical stack are still
  present (both are only detectable by other means, not by this box-overflow check).
  This is not a miss: it is the exact asymmetry `05-VERIFICATION.md` (amendment 2)
  documents — box overflow is `86 / 46 / 16 / 0px` at `320 / 360 / 390 / 430`, i.e. the
  detector's coverage genuinely ends at 430px for this specific symptom. `/` still
  fails at `mobile-430` because Sweep B (the dashboard bleed) fires there regardless of
  width — the bleed is driven by a constant `-14rem` margin, not by viewport width.
- **`/features` passes at every viewport, including the phone widths, and this is
  correct, not a miss.** `src/app/features/page.tsx:898` carries the identical
  `clamp(42px, …)` inline-style floor, but its longest token (`works.`, 199.98px) fits
  inside a 342px box at 390px, wrapping to 3 lines with zero box overflow. The 42px
  floor is present there too — it simply produces no *measurable* box-overflow symptom
  on that route. `/features`'s half of GAP-01 is closed in plan 05-07 on the strength
  of the gap statement (the shared clamp pattern), not on harness evidence from this
  spec — that asymmetry is expected and does not indicate this sweep is somehow
  incomplete.

## Confirmation Against `05-VERIFICATION.md` Amendment 2

`05-VERIFICATION.md`'s amendment 2 (2026-07-31) records the corrected GAP-01 overflow
curve as **86 / 46 / 16 / 0px at 320 / 360 / 390 / 430**. The RED run's Sweep-A
`overflowBy` values — captured directly above from the live test attachments — are
**86 / 46 / 16 / (no offender, i.e. 0) at 320 / 360 / 390 / 430**, an exact match. No
divergence: the harness and the verification record agree, and neither needed a second
correction.

## `KU-4` — New Finding Needing a Design-Owner Decision

The `/pricing` comparison table (`table.w-full.text-left.border-collapse` plus 14
descendants) is clipped by `div.rounded-xl.border.overflow-hidden` and extends 77px
past the viewport at 320px, 37px at 360px, 7px at 390px, none at 430px.
`overflow.spec.ts` cannot see this — its `isClippedByAncestor` skip deliberately
discards anything absorbed by an `overflow-hidden` ancestor, which is exactly what this
wrapper does. This is a genuine, previously-undetected defect of the exact class GAP-03
exists to catch, found by the new sweep on its first run against unmodified `src/`.
Logged in `deferred-items.md` under `## From 05-06 containment sweep`, needing a
design-owner decision between `overflow-x-auto` + `data-reflow-exempt` (self-scrolling
table) or a mobile-specific table restructure. Out of this gap-closure phase's fence.

## Decisions Made

- Kept `KNOWN_UNFIXED.ref` values as short IDs (`KU-1`..`KU-4`) rather than embedding
  full prose in the spec file — the spec stays lean and greppable, `deferred-items.md`
  carries the detail, and the acceptance criterion's `grep -F "<ref value>"` check
  passes cleanly against short IDs.
- Verified all six `isExcluded` guards individually against a named false positive
  during Task 1 (SVG internals on `/`, `ReadingLayout.tsx:14`'s glow at tablet-768 and
  laptop-1024 on `/privacy`/`/terms`, the Hero announcement-pill arrow track's masked
  reveal, and the three `truncate` spans on `/` at 320px) rather than adding guards
  speculatively.
- No exclusion-branch tightening or fifth `KNOWN_UNFIXED` entry was needed — the RED
  run reproduced the plan's `<measured_baseline>` exactly.

## Deviations from Plan

None — plan executed exactly as written. Both tasks' acceptance criteria were verified
against live command output, not asserted from memory:

- `npm run typecheck:e2e` exits 0.
- `npx playwright test containment.spec.ts --list --project=mobile-390` lists exactly 8
  tests.
- `git diff --numstat playwright.config.ts` showed `1 1` (exactly one line changed).
- `node -e "..."` package.json check exited 0.
- All grep-based structural checks (`documentElement.scrollWidth` count 0,
  `nearestClipper` count ≥2, all six exclusion-branch keywords present,
  `known-unfixed` present, `h1.display`/`mr-56` absent outside comments) passed —
  one fix was needed mid-task (see below).
- `git status --porcelain src/` was empty both after Task 1 and after Task 2.
- `npm run audit:containment` exited non-zero, failing on `/` only.
- `npm run audit:overflow` (56 passed / 8 failed touch-iphone), `npm run audit:targets`
  (32 passed / 24 skipped / 8 failed touch-iphone) and `npm run audit:a11y`
  (112 passed / 16 failed touch-iphone) all matched the 05-VERIFICATION baseline
  exactly.
- `npx tsc --noEmit` and `npm run lint` both exited 0 (lint showed 2 pre-existing,
  unrelated unused-variable warnings in `changelog/page.tsx` and `manifesto/page.tsx` —
  out of this plan's scope).

### Auto-fixed Issues

**1. [Rule 1 - Bug] File-header comment tripped the spec's own zero-hits regression check**
- **Found during:** Task 1, running the acceptance-criteria grep checks after writing
  `e2e/containment.spec.ts`.
- **Issue:** The header comment explaining the relationship to `overflow.spec.ts`
  literally contained the string `` document.documentElement.scrollWidth `` to describe
  what that spec asserts on. The acceptance criterion
  `grep -c 'documentElement.scrollWidth' e2e/containment.spec.ts` requires **0** hits
  (unconditionally, not comment-excluded) — the check exists to guarantee the new spec
  is container-relative and viewport-relative by construction, never root-relative,
  and a doc-comment mention is indistinguishable from a real reference to the grep.
- **Fix:** Reworded the comment to say "the root element's `scrollWidth`" instead of
  spelling out the literal property-access chain, preserving the explanation without
  tripping the check.
- **Files modified:** `e2e/containment.spec.ts`
- **Verification:** `grep -c 'documentElement.scrollWidth' e2e/containment.spec.ts`
  returns `0`; `npm run typecheck:e2e` still exits 0.
- **Committed in:** `f50d164` (part of Task 1 commit — caught before commit, not a
  separate fix commit)

---

**Total deviations:** 1 auto-fixed (1 bug — self-inflicted regression-check trip, fixed
before the task's first commit).
**Impact on plan:** No scope creep; the fix only reworded a comment string.

## Issues Encountered

None beyond the auto-fixed comment wording above.

## User Setup Required

None — no external service configuration required. `touch-iphone` remains blocked on
`sudo npx playwright install-deps`, already documented in `deferred-items.md` since
plan 05-03; not a new requirement from this plan.

## Next Phase Readiness

- The harness now has evidentiary weight it did not have before: a green result on
  `/` in plan 05-07 will mean the fix actually closed GAP-01 and GAP-02, not that the
  check never could have seen them.
- Plan 05-07 (Hero H1 clamp + preview bleed) can proceed immediately — this plan
  intentionally leaves `src/` untouched and the suite red, which is the proof that
  05-07's fix is what turns it green.
- KU-4 (`/pricing` table clip) is a new, real defect needing a design-owner decision
  before any code fix — flagged here and in `deferred-items.md`, not silently
  scheduled into 05-07 (which is scoped to the Hero only).
- No blockers.

---
*Phase: 05-mobile-responsive-retrofit*
*Completed: 2026-07-31*

## Self-Check: PASSED

All claimed files exist on disk (`e2e/containment.spec.ts`, `playwright.config.ts`,
`package.json`, `deferred-items.md`, this SUMMARY) and both task commits (`f50d164`,
`9e863d1`) are present in `git log`.
