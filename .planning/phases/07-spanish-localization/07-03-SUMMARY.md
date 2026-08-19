---
phase: 07-spanish-localization
plan: 03
subsystem: testing
tags: [i18n, playwright, ci, next-intl, ci-gates, containment, register-check]

# Dependency graph
requires:
  - phase: 07-01
    provides: "next-intl routing (localePrefix as-needed), src/i18n/navigation.ts locale-aware Link contract, 8 routes moved under [locale]"
  - phase: 07-02
    provides: "SPANISH-VOICE.md register rules (tú, vosotros allowed, su/sus advisory), GLOSSARY.md"
provides:
  - "scripts/i18n-gates.mjs — three independently-runnable CI gates (register, bidirectional catalogue parity, locale-aware Link), registered as npm run i18n:gates / i18n:gates:strict"
  - "e2e/support/pages.ts — EN_ROUTES/ES_ROUTES/ROUTES (16 total), single 8-path source of truth"
  - "e2e/containment.spec.ts — KU-1..KU-4 /es twins generated programmatically from the English KNOWN_UNFIXED entries"
  - ".github/workflows/responsive-audit.yml quality job — i18n gates step after Lint"
  - "Locale-aware Link migration in Navbar.tsx, Footer.tsx, Hero.tsx, MethodologyPreviewSection.tsx, McpIntegrationSection.tsx, features/page.tsx (unplanned but required — see Deviations)"
affects: [07-04, 07-05, 07-06, 07-07, 07-08, 07-09, 07-10, 07-13, 07-14, 07-15, 07-16]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Gate 3's href-literal check only classifies static string/template-literal hrefs as internal or external — a dynamic prop pass-through (e.g. href={link.href}) is invisible to it by design (the plan's own acceptance-criteria examples are literal-value only); components with mixed internal/external next/link usage alias the external import (ExternalLink) rather than the internal one, so the primary Link identifier always resolves to the locale-aware import"
    - "Gate 2 tokenizes register text on \\p{L}+ (Unicode letters) and exact-matches lowercased tokens against usted/ustedes/tú, which cleanly separates the banned accented subject pronoun tú from the required unaccented possessive tu without any special-casing"
    - "KNOWN_UNFIXED /es twins are generated with .map() over the English array (KNOWN_UNFIXED_EN -> KNOWN_UNFIXED_ES), never hand-pasted, so a future fix deletes one row not two"

key-files:
  created:
    - scripts/i18n-gates.mjs
  modified:
    - package.json
    - e2e/support/pages.ts
    - e2e/containment.spec.ts
    - .github/workflows/responsive-audit.yml
    - src/components/Navbar.tsx
    - src/components/Footer.tsx
    - src/components/Hero.tsx
    - src/components/MethodologyPreviewSection.tsx
    - src/components/hero/McpIntegrationSection.tsx
    - src/app/[locale]/features/page.tsx
    - .planning/phases/07-spanish-localization/deferred-items.md

key-decisions:
  - "Migrated 6 components' internal next/link usage to the locale-aware Link (src/i18n/navigation.ts) — not in this plan's declared <files> — because Gate 3 as specified requires the current tree to already be free of next/link-plus-internal-href, and no prior plan (07-01 built the navigation.ts contract but never wired it into a consuming component) had done that migration. Left as-is, Gate 3 would have failed the plan's own acceptance criterion (\"exits 0 against the current catalogue\") and broken CI for the rest of the phase."
  - "Gate 3's href check is literal-value only (string or template-literal leading text), matching the plan's own acceptance-criteria examples verbatim — it does not attempt to statically resolve a dynamic prop like href={link.href}. Where a file mixed internal (literal) and external (APP_URL) next/link usage, the external one was renamed to ExternalLink so the bare `Link` identifier always resolves to the locale-aware import; this also brought the array-driven internal hrefs (Navbar/Footer's .map()) onto the locale-aware Link even though Gate 3 itself can't detect them, since leaving an adjacent, textually-identical bug in a file already being edited for the same reason would be irresponsible."
  - "test-results/ and playwright-report/ remain root-owned (same blocker 07-01/07-02 logged). Every Playwright spec this plan touched was still run for real by redirecting --output to a scratch directory with --reporter=line, never by editing playwright.config.ts's default paths."

requirements-completed: [I18N-01, I18N-07]

# Metrics
duration: ~20min
completed: 2026-08-19
---

# Phase 07 Plan 03: i18n CI gates and locale-aware harness Summary

**Built three from-scratch CI gates (register, bidirectional catalogue parity, locale-aware Link) proven RED against nine distinct planted violations, doubled the Playwright layout-spec matrix to 16 routes with programmatically-generated `/es` KNOWN_UNFIXED twins, and — because Gate 3 required it to be true today, not just eventually — migrated the six components still using bare `next/link` for internal navigation onto the locale-aware `Link` next-intl contract 07-01 built but never wired in.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-08-19T18:23:00Z (approx., immediately after 07-02's session end)
- **Completed:** 2026-08-19T18:40:46Z (Task 3 commit)
- **Tasks:** 3 (all `type="auto"`, no checkpoints)
- **Files modified:** 11 (1 created, 10 modified) across the three task commits, plus 1 deferred-items.md entry

## Accomplishments

- `scripts/i18n-gates.mjs`: Gate 1 (register — hard-fail `usted`/`ustedes`/written `tú`/exclamation marks, advisory-only `su`/`sus`, `vosotros` explicitly excluded from any fail path), Gate 2 (bidirectional catalogue parity — `en ⊇ es` and `es ⊇ en` both enforced the moment a namespace has any Spanish key, ICU placeholder-set parity, translation status inferred from the catalogue with no shared allowlist), Gate 3 (fails a `next/link` import combined with a static internal href)
- Every distinct behavior in the plan's acceptance criteria was proven RED with an isolated, controlled scratch mutation and reverted — not just "the script exits non-zero for some reason" (see Gate Proofs below)
- `e2e/support/pages.ts`: `EN_ROUTES` (renamed from the old flat `ROUTES`) is the single 8-path source; `ES_ROUTES` and `ROUTES` (16 total) are derived, `/` maps to `/es` not `/es/`
- `e2e/containment.spec.ts`: `KNOWN_UNFIXED_ES` is generated from `KNOWN_UNFIXED_EN` via `.map()`, reusing `ref` KU-1..KU-4 — confirmed by inspecting real annotation output that all four fire correctly on their `/es` twin with the exact same offender counts as English (1/12/15/5), because `/es/*` still renders English copy at this point in the phase
- `.github/workflows/responsive-audit.yml`: one new `quality`-job step (`npm run i18n:gates`) after Lint, with a comment recording the inference rule and pointing at the strict form 07-16 will use; `responsive` job diffed byte-identical against `HEAD` to confirm it was untouched
- Full 16-route Playwright coverage actually run and read (not estimated) across `containment`, `overflow`, `a11y`, and `touch-targets` — all passing — despite the root-owned `test-results`/`playwright-report` blocker, by redirecting `--output` to a scratch directory
- `npm run build` (production) still emits all 16 static route variants after the Link migration; runtime `curl` confirmed English pages render unprefixed hrefs and `/es/*` pages render `/es`-prefixed hrefs

## Task Commits

1. **Task 1: Build the three i18n CI gates** — `c8535cc` (feat) — includes the Link-migration deviation (see below)
2. **Task 2: Extend the Playwright harness to both locale trees and reconcile KNOWN_UNFIXED** — `e1ec5c8` (feat)
3. **Task 3: Wire the gates into the existing CI workflow** — `9a08fdd` (chore)

## Files Created/Modified

- `scripts/i18n-gates.mjs` — the three gates (created)
- `package.json` — `i18n:gates` / `i18n:gates:strict` scripts
- `e2e/support/pages.ts` — `EN_ROUTES`/`ES_ROUTES`/`ROUTES`
- `e2e/containment.spec.ts` — `KNOWN_UNFIXED_EN`/`KNOWN_UNFIXED_ES`/`KNOWN_UNFIXED`
- `.github/workflows/responsive-audit.yml` — `i18n gates` step in `quality` job
- `src/components/Navbar.tsx`, `Footer.tsx`, `Hero.tsx`, `MethodologyPreviewSection.tsx`, `hero/McpIntegrationSection.tsx`, `src/app/[locale]/features/page.tsx` — internal `next/link` usage migrated to the locale-aware `Link`
- `.planning/phases/07-spanish-localization/deferred-items.md` — `## From 07-03` entry documenting the environment blocker, real measured Playwright results, and the wall-clock delta

## Decisions Made

See frontmatter `key-decisions`. In short: Gate 3 forced an unplanned but small, mechanical, value-preserving migration of six components (7 real violations found and fixed); Gate 3's href check is deliberately literal-value-only per the plan's own acceptance-criteria examples; the environment blocker was worked around for real measurement rather than silently skipped.

## Gate Proofs (cadence requirement — every distinct behavior proven RED, isolated, then reverted)

All run against scratch mutations to `src/messages/{en,es}/common.json` (restored via `git checkout --` after each), or a throwaway scratch component under `src/components/__scratch_gate3_test/` (deleted after). Each test isolates ONE gate so the failure is attributable to the gate under test, not a side effect (the plan's own inline verify script reuses `common.json` for both the register and orphan-key probes, which — since `en/common.json` is currently `{}` — actually proves Gate 2's orphan-key check, not Gate 1's register check; redone here with matching keys so each gate is genuinely isolated):

| # | Gate | Planted violation | Result |
|---|------|---|---|
| 1 | 1 REGISTER | `es: "Usted debe empezar"` (matching en key) | FAIL — `formal register ("Usted") is banned` |
| 2 | 1 REGISTER | `es: "Tú empiezas tu primera Version"` | FAIL — `written subject pronoun "tú" is banned`; sanctioned control `"Empieza tu primera Version"` (no written pronoun) passed clean |
| 3 | 1 REGISTER | `es: "Vosotros empezáis vuestra primera Version"` | PASS (0 failures) — confirms `vosotros` is never in the hard-fail path |
| 4 | 1 REGISTER | `es: "Revisa sus tendencias"` | PASS with 1 WARNING — confirms `su`/`sus` is advisory-only |
| 5 | 1 REGISTER | `es: "Empieza ahora!"` | FAIL — `exclamation mark banned site-wide` |
| 6 | 2 PARITY | `es` has orphan key `b` absent from `en` (both non-empty) | FAIL — `key present in es, absent from en — orphaned Spanish key (es ⊇ en direction)` |
| 7 | 2 PARITY | `en` has key `c` missing from a non-empty `es` | FAIL — `key present in en, missing from es (en ⊇ es direction)` |
| 8 | 2 PARITY | `en: "Hello {name}"`, `es: "Hola"` | FAIL — `ICU placeholder set mismatch: en {name} vs es {}` |
| 9 | 2 PARITY | `en` non-empty, `es` exactly `{}` | non-strict: WARN only, exit 0; `--strict`: FAIL |
| 10 | 3 LINK | scratch `.tsx`, `import Link from "next/link"` + `<Link href="/manifesto">` | FAIL — `carries internal href "/manifesto"` |
| 10b | 3 LINK | same file, href swapped to `APP_URL` (external only) | PASS |
| — | 3 LINK | **real** (not scratch): unmodified tree before the Task 1 fix | FAIL x7 across 6 real files — this is the actual violation the fix in Task 1 addresses, see Deviations |

Every scratch file/mutation was reverted; `git status --short src/messages/` and the scratch directory removal were confirmed clean before each subsequent test and before the final commit.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2/3 - Missing critical functionality / blocking issue] Gate 3 required a locale-aware-Link migration no prior plan had performed**

- **Found during:** Task 1, running `node scripts/i18n-gates.mjs` against the unmodified tree as the plan's own inline `<verify>` command requires
- **Issue:** `src/i18n/navigation.ts` (built by 07-01) already documents the intended contract in its own comment ("Every component with an INTERNAL href imports Link from here, never from next/link"), but no plan's `<files>` list ever wired a consuming component to it. Running the freshly-built Gate 3 against the real tree found 7 real, pre-existing violations — a static `<Link href="/...">` from `next/link` — in `Navbar.tsx` (logo), `Footer.tsx` (logo), `Hero.tsx` (pricing pill, secondary CTA), `MethodologyPreviewSection.tsx`, `McpIntegrationSection.tsx`, and `features/page.tsx`. This directly contradicted the plan's own acceptance criterion ("`node scripts/i18n-gates.mjs` exits 0 against the current (mostly empty) catalogue") and, left unfixed, would have made the CI step Task 3 wires in fail on every PR for the remainder of the phase — a plan whose own frontmatter says "no plan after this one edits `scripts/i18n-gates.mjs`", so there is no later opportunity to loosen the gate instead.
- **Fix:** Migrated the 7 statically-detectable internal-href call sites to `import { Link } from "@/i18n/navigation"`. Two files (`Navbar.tsx`, `Hero.tsx`) also use `next/link` for a genuinely external `APP_URL` destination in the same file; there the external import was renamed to `ExternalLink` so the bare `Link` identifier always resolves to the locale-aware one. While in `Navbar.tsx`/`Footer.tsx` for this fix, also switched the array-driven `.map()` internal links (`href={link.href}`) onto the same locale-aware `Link` — Gate 3's literal-value check cannot detect these (a dynamic prop, not a string/template literal), but leaving the identical adjacent bug in a file already being edited for the same reason, in the same JSX tag family, would have been irresponsible.
- **Files modified:** `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/Hero.tsx`, `src/components/MethodologyPreviewSection.tsx`, `src/components/hero/McpIntegrationSection.tsx`, `src/app/[locale]/features/page.tsx`
- **Verification:** `node scripts/i18n-gates.mjs` now exits 0; `npx tsc --noEmit` and `npx eslint` clean on all six files; `npm run build` still emits all 16 static route variants; runtime `curl` against a production `next start` confirmed English pages render unprefixed hrefs (`href="/pricing"`) and `/es/*` pages render `/es`-prefixed hrefs (`href="/es/pricing"`) for every nav/footer link.
- **Committed in:** `c8535cc` (Task 1 commit — folded in rather than split out, since Gate 3 cannot honestly be called "done" without it)

---

**Total deviations:** 1 auto-fixed (Rule 2/3 — missing critical functionality that was also a blocking issue for the plan's own acceptance criterion)
**Impact on plan:** Necessary for Gate 3 (a deliverable this plan explicitly builds) to be meaningfully true against the real tree, not just against a scratch fixture. No scope creep into copy/content — the six files gained only an import swap and, in two of them, an import rename; zero visible/behavioral change other than correcting the actual T-07-03-02 vulnerability (a Spanish visitor on `/es/pricing` clicking a nav link and landing on unprefixed `/manifesto`) that already existed in production before this plan ran.

## Issues Encountered

- **`test-results/`/`playwright-report/` still root-owned** (carried from 07-01/07-02, re-confirmed via a direct `npm run audit:containment` run that failed with `EACCES` on both paths — the test run itself completed, only the report-path writes failed). Not silently skipped: every layout spec this plan touched was run for real via `--output=<scratch> --reporter=line`, with results documented in `deferred-items.md` `## From 07-03` and summarized in Gate Proofs / Accomplishments above. `touch-iphone` (WebKit) still cannot launch in this sandbox — same pre-existing host-dependency gap Phase 5 logged, re-confirmed with the identical error, not a regression.
- **The plan's own inline `<verify>` script for Task 1 does not actually isolate Gate 1** — it reuses `src/messages/es/common.json` for both the register probe and the orphan-key probe, and since `en/common.json` is currently `{}`, the register probe (`{"probe":"Empiece su primera Version"}`) is caught by Gate 2's orphan-key check (an `es` key with no `en` counterpart), not by Gate 1's register check, even though the overall script still correctly exits non-zero (satisfying the letter of the verify command). Ran the plan's exact script as specified — it passed — and additionally ran 10 properly isolated proofs (see Gate Proofs) so each gate's own behavior is honestly attributed, not just "the aggregate exit code moved."

## User Setup Required

- Whoever next has `sudo` on this box: `sudo rm -rf test-results playwright-report && mkdir test-results playwright-report` (or equivalent ownership fix) so `npm run audit:*` scripts work by their literal invocation for Wave 3-6 plans and CI parity checks going forward. Documented in `deferred-items.md`.

## Next Phase Readiness

- Every Wave 3/4 translation plan (07-04 through 07-14) writes into a catalogue that is now continuously checked by three gates in CI, without any shared allowlist to contend over across parallel worktrees.
- The Playwright harness sees both locale trees for every layout spec; no Wave 3/4 plan needs to touch `e2e/support/pages.ts` or `e2e/containment.spec.ts`'s `KNOWN_UNFIXED` arrays to get `/es` coverage.
- 07-04 (shared chrome: Navbar, Footer, CTASection, cross-locale hint) inherits `Navbar.tsx`/`Footer.tsx` already on the locale-aware `Link` — one less mechanical step in that plan's own diff.
- 07-16 (final verification) has `npm run i18n:gates:strict` ready to assert no namespace was left untranslated, and the wall-clock delta (`+11.3s` for the 16-route `containment.spec.ts` run) already measured for its own CI-timeout sanity check.

---
*Phase: 07-spanish-localization*
*Completed: 2026-08-19*
