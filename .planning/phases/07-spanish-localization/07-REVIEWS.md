---
phase: 7
reviewers: [codex, opencode]
reviewers_failed: [gemini]
reviewers_skipped: [claude, ollama]
reviewed_at: "2026-08-19T12:39:18Z"
plans_reviewed: [07-01, 07-02, 07-03, 07-04, 07-05, 07-06, 07-07, 07-08, 07-09, 07-10, 07-11, 07-12, 07-13, 07-14, 07-15, 07-16]
supersedes: 07-REVIEWS-2026-08-02.md
---

# Cross-AI Plan Review — Phase 7: Spanish Localization

Second review round. The first (2026-08-02) is preserved at
`07-REVIEWS-2026-08-02.md` because plan commits cite its findings; this file
replaces it as the current review of record.

## Round context

Since the first review the plans went through three `gsd-plan-checker`
iterations (final verdict PASSED, no blockers) and three requirement-driven
revisions on 2026-08-19: the language switcher gained a third mount inside the
mobile hamburger panel, a `LocaleHint` component was added so an explicit
Spanish choice is honoured on English URLs without a redirect, and an
append-only `TRANSLATION-FLAGS.md` register was introduced for lines whose
English effect does not survive into Spanish.

Reviewers were told which earlier findings were already closed (changelog count
33, switcher 44px width, site origin, corrected line references) and pointed at
the four new surfaces. **They were asked to find what three prior passes
missed, and both did.**

## Reviewer roster

| Reviewer | Status | Note |
|---|---|---|
| codex | completed | 341k tokens, full pass |
| opencode | completed | spawned its own source-exploration agents |
| gemini | **failed** | `IneligibleTierError: This client is no longer supported for Gemini Code Assist for individuals` — the standalone CLI is cut off for individual accounts pending migration to Antigravity. Not a timeout; no review produced. |
| claude | skipped | `CLAUDE_CODE_ENTRYPOINT=cli` — this session IS Claude. Reviewing its own plans with its own model defeats the purpose. |
| ollama | skipped | Server reachable, but its only chat model is `llama3.2:3b` and the review prompt is 457KB — roughly two orders of magnitude past what a 3B model can hold. It would return confident nonsense, which is worse than no review. |

---

## Codex Review

# Cross-AI Plan Review — Phase 7

## Summary

The plans are unusually thorough on static rendering, catalogue parity, routing, SEO, and translation-quality controls. However, several integration risks remain that could prevent the phase from satisfying its newest requirements. The most serious are the LocaleHint placement, locale-cookie behavior when switching back to English, the missing dependency ordering for metadata, and contradictory mobile-panel requirements. These are implementation blockers rather than polish issues. Overall risk is **HIGH until resolved**, despite the strong verification design.

## Strengths

- **Strong static-rendering discipline.** Plan 07-01 repeatedly requires both `generateStaticParams` and `setRequestLocale`, with a concrete `.next/prerender-manifest.json` assertion rather than relying on build symbols.

- **Good routing security model.** Plan 07-01 validates cookie/header values against the closed locale set and uses an internal redirect target rather than interpolating request-controlled values.

- **Bidirectional catalogue parity is correctly specified.** Plan 07-03 catches both missing Spanish keys and orphaned Spanish keys, which is stronger than the common one-directional check.

- **The persisted behavioral spec is well targeted.** Plan 07-16 Task 4 covers the two newly introduced silent regressions: the mobile panel switcher and cookie-dependent LocaleHint behavior.

- **The changelog plans have good data modeling.** Shared ISO dates, closed tag keys, preserved note icons, and derived entry counts substantially reduce recurring translation drift.

- **Translation quality is treated as more than key parity.** The wordplay register, human rewrite queue, legal read-throughs, and identical-value checks address failures that structural CI cannot detect.

- **Suppression reconciliation is explicit.** Plan 07-16 requires every remaining KU reference to map to a written finding and forbids suppressing defects introduced by this phase.

## Concerns

- **[HIGH] LocaleHint has no valid mounting architecture.** Plan 07-04 Task 3 says LocaleHint renders in `[locale]/layout.tsx` “directly below Navbar” (07-04, approximately lines 483–494). In the current codebase, Navbar is rendered by each page, not by the root layout; the future locale layout therefore cannot place the hint below it without either introducing a shared shell or moving Navbar/Footer ownership. Plan 07-01’s layout task does not perform that migration, and 07-04’s file scope does not include all page files.

  As written, the hint will either render before the Navbar, be duplicated, or require unplanned architectural edits. The tests only check presence/absence, not placement.

- **[HIGH] Locale selection can loop or fail to persist when switching to English.** Plan 07-01 only specifies setting `NEXT_LOCALE` when a prefixed locale pathname is encountered (07-01, approximately lines 280–286). Plan 07-04’s `LanguageSwitcher` accepts only a `context` prop and has no callback or cookie-writing mechanism (07-04, approximately lines 192–240).

  A likely sequence is:

  1. Visit `/es`; cookie becomes `es`.
  2. Click `EN`, navigating to `/`.
  3. The `/` proxy sees `NEXT_LOCALE=es` and redirects back to `/es`.

  Even if next-intl happens to write the cookie in some cases, the plan does not specify or test that an explicit English selection overwrites the cookie. Plan 07-01’s routing verification tests a manually supplied `NEXT_LOCALE=en`, but not the actual switcher flow.

- **[HIGH] The mobile-panel close requirement is not connected to the component contract.** Plan 07-04 says the panel switcher must call the Navbar close handler after navigation (approximately lines 352–386), but `LanguageSwitcher` is specified with no `onNavigate` or close callback. Plan 07-16 later tests that the panel closes, but the implementation contract never explains how that behavior is wired.

  This is precisely the sort of requirement that can pass review as prose while remaining absent from the code.

- **[HIGH] Plan 07-16 contains a direct contradiction about the mobile switcher.** Its human verification pack says the mobile hamburger-panel switcher is “ABSENT” and calls that a locked tradeoff (07-16, approximately lines 386–395). That contradicts:

  - the revised requirement;
  - 07-04’s three-mount requirement;
  - 07-16 Task 1’s panel measurement;
  - 07-16 Task 4’s panel Playwright test.

  The human checklist also later instructs the reviewer to repeat the switch inside the open hamburger panel. This must be corrected before execution; otherwise a human could sign off the wrong behavior.

- **[HIGH] Plan 07-15 can run before the Spanish catalogues are complete.** Its `depends_on` includes 07-06 through 07-12 but omits 07-13 and 07-14, even though Task 1 says metadata should be authored against the final page copy. Features and changelog Spanish translations can therefore be written concurrently with metadata generation.

  This is especially risky because the plan explicitly promises all per-locale metadata and descriptions, while the source copy is still changing.

- **[HIGH] CI does not appear to provide the required site-origin environment.** Plan 07-15 correctly refuses to use a hardcoded fallback for `NEXT_PUBLIC_SITE_URL`, but the current workflow does not define that variable. `.env.local` is not part of the repository and is not available in a clean CI checkout.

  The result is either a failing build or emitted metadata/sitemap URLs using an empty or undefined origin. The plan needs an explicit CI/deployment environment contract, not just a local `.env.local` check.

- **[MEDIUM] The append-only translation register is not safe for the declared parallel execution.** Plans in Waves 3 and 4 append to the same `TRANSLATION-FLAGS.md`, while several plans are explicitly parallel. “Append-only” prevents semantic deletion, but it does not prevent Git conflicts or lost append operations across isolated worktrees. The same problem applies when multiple plans append marketing-only terms to `GLOSSARY.md`.

  The claim in 07-02 that this is safe for parallel plans is therefore too strong.

- **[MEDIUM] The seeded example row conflicts with the register accounting model.** Plan 07-02 seeds one example row, marks it for deletion when a real row arrives, and says an empty final register means the rule was not applied. Plan 07-16 later reconciles row totals against eight summaries that may all report `TRANSLATION FLAGS: 0`.

  If no real flags are found, the example remains but the reported total is zero. If a real flag is found, deleting or moving the example conflicts with the append-only history model. Also, the example text is written as `Un metodo...` without the accent used by the approved hook.

- **[MEDIUM] Shared chrome is excluded from the wordplay workflow.** The list of translation plans required to append `TRANSLATION FLAGS: n` includes 07-05, 07-06, 07-07, 07-08, 07-09, 07-10, 07-13, and 07-14, but not 07-04. Plan 07-04 writes the common Navbar, Footer, CTA, and hint copy. I18N-07 applies to all user-facing strings, including shared chrome, so this is an unowned translation-quality surface.

- **[MEDIUM] The new Playwright project is not actually a coarse-pointer project.** Plan 07-16 Task 4 registers `i18n-chrome` using `devices["Desktop Chrome"]` at a 390px viewport. That device is not equivalent to a touch/coarse-pointer surface. The existing `touch-iphone` project is restricted to `LAYOUT_SPECS`, so the new behavioral spec will not run there either.

  Thus the plan’s “real coarse-pointer” claim is not satisfied by the specified project.

- **[MEDIUM] The residual-string audit is not reproducible enough.** Plan 07-16 asks for a manual grep-based sweep, but does not create a script or committed allowlist. Several likely strings are not included in 07-04’s extraction inventory, including current accessibility labels such as:

  - Navbar’s `aria-label="Primary"`;
  - Footer’s `aria-label="El Portal home"`;
  - `PortalIcon`’s `aria-label="Portal icon"`;
  - `HeroAppMockup`’s dashboard `alt` text;
  - MCP page navigation and code-sample labels;
  - `CopyButton`’s `Copy`/`Copied` labels.

  A final manual sweep can catch them, but the phase’s “no hardcoded user-facing string” criterion deserves a deterministic check and explicit classifications for intentional literals such as `EN` and `ES`.

- **[MEDIUM] LocaleHint accessibility and component compliance are underspecified.** Plan 07-04 does not specify a localized dismiss label, an accessible name for the dismiss control, or use of the project’s approved shadcn Button. Since the project bans raw `<button>`, the plan should explicitly require the approved Button component. A generic wrapper with `aria-label` also may not expose the intended switcher group semantics without `role="group"`.

- **[MEDIUM] Pricing PATH B is not executable as written.** Plan 07-09 proposes adding one visible Spanish explanatory line, but Task 2 owns only `src/messages/es/pricing.json`. A visible new line requires:

  - an English key;
  - a Spanish key;
  - an existing component render site or a component change.

  Adding the key only to Spanish would violate the orphan-key gate; adding it to both catalogues without rendering it has no effect. The branch needs a complete file/component contract or should be removed.

- **[LOW] Locale-formatted changelog dates need an explicit timezone.** Plan 07-12 converts dates to `YYYY-MM-DD` and formats them per locale, but does not require `timeZone: 'UTC'`. Depending on runtime timezone and parsing behavior, a date-only value can shift by one day. This is easy to prevent and important for a release-history page.

- **[LOW] The accented-display verification is not durable.** Plan 07-05 performs a one-time glyph check and removes the probe. A later font-loading, subset, or CSS change could reintroduce clipped accented capitals without any automated signal. Since the issue is explicitly called “load-bearing,” retaining a small regression probe would be safer.

- **[LOW] Root redirect query-string behavior is unspecified.** The redirect target is correctly constrained to an internal path, but constructing a literal `/es` may discard query parameters such as campaign tracking parameters. Preserve the query component while keeping the pathname closed, or document that query parameters are intentionally dropped.

## Suggestions

- Introduce a `SiteChrome` or `LocaleShell` component owned by `[locale]/layout.tsx`. Move Navbar and Footer into it, render LocaleHint immediately below Navbar, and remove page-local chrome mounts. Add an explicit `onNavigate` callback to LanguageSwitcher for mobile-panel closure.

- Define one explicit client-side locale-choice helper. It should set `NEXT_LOCALE` to the selected locale before navigation, then use the locale-aware Link. Add Playwright coverage for `/es → /` and `/ → /es`, including cookie value and final URL.

- Add `07-13` and `07-14` to 07-15’s dependencies, or move metadata into a later wave after all Spanish copy is complete.

- Add `NEXT_PUBLIC_SITE_URL=https://el-portal.app` to the CI environment through the repository’s approved configuration mechanism, and add a build-time assertion that the variable is present in CI.

- Serialize register/glossary aggregation. A safer pattern is one per-plan flag file, such as `TRANSLATION-FLAGS.07-06.md`, followed by a final aggregation task. Apply the same approach to marketing-only glossary additions.

- Separate the worked example from real findings. Put it under an `Examples` section, or mark it with a machine-readable `example: true` field and exclude it from reconciliation. Keep the register genuinely append-only.

- Add 07-04 to the wordplay/accounting contract, or explicitly assign common-chrome review to 07-16 with a count and summary line.

- Make `i18n-chrome` use a real touch/coarse-pointer device, or include the spec in the `touch-iphone` project with an appropriate `testMatch`. Keep the 390px Chromium project as a fast local check if desired.

- Create a reusable `scripts/audit-residual-strings.mjs` with explicit intentional-string exclusions. Include accessibility attributes, data modules, client defaults, error states, and the deliberate `EN`/`ES` language-code exception.

- Specify LocaleHint’s semantic structure, localized dismiss label, `role="group"`, test IDs, and approved Button usage.

- Complete the pricing PATH B contract before execution: either render a key-identical English/Spanish notice through an existing component or remove the branch.

- Require `timeZone: 'UTC'` for date formatting and retain an automated accented-glyph probe.

## Risk Assessment

**Overall risk: HIGH.**

The plans have strong defensive verification and good coverage of translation parity, static rendering, SEO, and accessibility. The risk is concentrated in a few cross-plan integration seams: shared chrome ownership, cookie semantics, mobile-panel navigation, CI environment configuration, and parallel writes to shared registers. These issues can produce a site that passes many catalogue and build checks while still failing the user-visible locale-switching contract. Resolve the HIGH concerns before Wave 2/3 execution; after that, the remaining risks are mostly manageable process and verification issues.

---

## OpenCode Review

## Cross-AI Plan Review — Phase 7: Spanish Localization

### 1. Language Switcher Triple Mount

**Plan 07-04 is thorough on sizing.** The `px-3 min-w-11 min-h-11` per-link contract is correct, the inline-text exemption analysis is correct, and the verify step checks for both class occurrences. However:

**Finding 07-04-T2: The 768px nav-row overflow risk is under-specified.** Plan 07-04 Task 2 says "Measure, do not assume, the tightest width budget in the nav" at 768px in Spanish, but gives no fallback if it overflows. It says "shorten the Spanish copy per the text-expansion contract" but the concrete strings — `Iniciar sesión` (14 chars vs 6), `Crear cuenta` (12 chars), plus the switcher — are in the `common` namespace which this plan owns. The accept criteria says "The 768px nav row was measured in Spanish and does not overflow" with no conditional on shortening. This is an assertion of success baked into an acceptance criterion that may require work to achieve. **Severity: low.** The plan is aware of the risk and has the levers; the concern is that the acceptance criterion may force a loop.

**Finding 07-04-T2: Footer switcher third child layout.** The plan says the switcher goes "between the copyright paragraph (line 105) and the decorative wordmark (line 110)". The Footer bottom bar at line 104 is `flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6`. Adding a third flex child to a `justify-between` row changes the spacing distribution for all three items. The existing copyright and wordmark were sized for a two-child `justify-between`. The plan acknowledges this ("this footer edit adds an element to an existing desktop flex row") but the verify step only runs `audit:targets` and `audit:containment` — neither catches a visual shift in the copyright-to-wordmark gap. **Severity: low.** The plan does measure at 768px for the nav row but does not explicitly mention measuring the footer bottom bar's visual layout.

**Finding 07-04-T3: Mobile panel close-on-navigate is tested in 07-04 AND 07-16.** Plan 07-04 Task 2 says "clicking ES inside the open mobile panel at 390px lands on the `/es` route with the panel closed; the closed state is observed on the destination page, not inferred." Plan 07-16 Task 4 also asserts "PANEL CLOSES ON LOCALE NAVIGATE." This is fine — 07-16 makes it permanent CI, while 07-04 verifies at build time — but both plans declare the same acceptance criterion as their own. No conflict, just redundancy.

### 2. LocaleHint Component

**Plan 07-04 Task 3 is well-reasoned on the cookie-only rendering and the hydration risk.** The server/client split (server reads `es` catalogue, client reads cookie) is correct for static rendering. However:

**Finding 07-04-T3: The server-side `getTranslations` call with a hardcoded `locale: 'es'` is unusual.** Line 485-486 says: "Resolve its two strings on the SERVER with `getTranslations({locale: 'es', namespace: 'common'})` and pass them as props." This bypasses the request-scoped locale to force Spanish copy on English pages. The approach is correct — the strings must come from `es/common.json` not `en/common.json` — but the `getTranslations` API in next-intl expects `locale` as the first argument in the non-scoped form: `getTranslations('es', 'common')`. The plan's notation `{locale: 'es', namespace: 'common'}` may be an API shape mismatch depending on the exact next-intl version. **Severity: low.** The executor should verify the API shape in 07-01's `next-intl` install, not assume the plan's notation matches.

**Finding 07-04-T3: `NEXT_LOCALE_HINT=off` cookie is a new cookie not written by 07-01.** Plan 07-01's proxy writes `NEXT_LOCALE` but the hint writes a second cookie `NEXT_LOCALE_HINT`. The proxy matcher at `'/((?!api|trpc|_next|_vercel|.*\\..*).*)'` will process this cookie on every navigation, but it only reads `NEXT_LOCALE`, so this is safe. However, the dismiss cookie is never cleared — once `off` is set, re-selecting ES from the switcher does not clear it. The user chose ES again, so the hint should reappear on the next English page load, but the `NEXT_LOCALE_HINT=off` cookie persists. The plan should specify that switching locale clears the hint cookie, or that the switcher writes `NEXT_LOCALE_HINT=es` instead of `off`. **Severity: medium.** This is a real UX gap: user picks ES → hint shows → dismisses → picks ES again from the switcher (a re-affirmation) → hint stays gone because the old `off` cookie was never cleared.

### 3. TRANSLATION-FLAGS.md Register

**The append-only design is sound.** Eight translation plans (07-05, 07-06, 07-07, 07-08, 07-09, 07-10, 07-13, 07-14) each append to the same file. The `TRANSLATION FLAGS: n` line in each summary is the reconciliation mechanism. 07-16 Task 2 reconciles.

**Finding: Plan 07-02 Task 4 creates the file, but plans 07-05 and 07-06 are in Wave 3, which depends on 07-02 (Wave 1). The dependency chain is correct — no append can race with creation.** No issue here.

**Finding: The seeded example row in 07-02 Task 4 uses `Un metodo para llegar a ser quien eres` (no accent on `método`).** This is explicitly marked as an example and to be deleted, so it will not ship as incorrect copy. No issue.

**Finding: Plans 07-05 through 07-14 each have an identical Task 3 (wordplay check).** This is 8 copies of the same task description. It is repetitive but not wrong — each plan needs its own wordplay check against its own translated strings, and the instruction text is the same because the rule is the same. The repetition makes the plans long but not incorrect.

### 4. Persisted Playwright Spec + Project (07-16 Task 4)

**Plan 07-16 Task 4 adds one new Playwright project `i18n-chrome` at 390px.** This is a deliberate addition after 07-03 explicitly said "no new project." The plan documents the contradiction and explains the rationale. However:

**Finding 07-16-T4: The `LAYOUT_SPECS` regex is not widened, but the verify step checks for this.** The automated verify at line 543 asserts `/\(overflow\|containment\|a11y\|touch-targets\|i18n/.test(s)` must be false — confirming `LAYOUT_SPECS` was NOT widened. Good. But the test file is `i18n-chrome.spec.ts`, which does NOT match `LAYOUT_SPECS`'s pattern, so it will only run in the `i18n-chrome` project. That is correct.

**Finding 07-16-T4: The spec file is allowed to add `data-testid` to LanguageSwitcher.tsx and LocaleHint.tsx.** The plan says "the ONLY change permitted to either component in this plan is adding a missing `data-testid` attribute." This is a tight scope exception. Plan 07-04 already adds these testids, so this is a fallback for the case where 07-04 did not. Fine.

**Finding 07-16-T4: The spec does not test the LANGUAGE SWITCHER in the DESKTOP NAV.** The `i18n-chrome` project runs at 390px, so the desktop nav switcher (which is `hidden md:flex`) is not rendered. The only desktop-width switcher coverage is `touch-targets.spec.ts` which skips at `>= 768`. This means the desktop nav switcher has NO automated touch-target or interaction coverage. It is tested only by the human verification pack. **Severity: low.** The desktop nav at 768px+ is a coarse-pointer mouse surface, not a touch surface, so touch-target compliance is less critical there. But a regression where the desktop switcher links shrink below readable size would be silent. The plan accepts this.

### 5. Cross-Cutting Findings

**Finding: Plan 07-05 Task 2's glyph probe runs `measureText` in a Playwright `page.evaluate`.** This is correct for reproducibility, but the three-width comparison (Special Gothic vs fallback vs Arial Black) depends on `document.fonts.check` being accurate. The plan notes this limitation. The probe is sound as a heuristic; no better mechanism exists without pixel-perfect font rasterization.

**Finding: Plan 07-12 derives the entry count into `07-12-ENTRY-COUNT.txt`.** This file is consumed by 07-14's gates. If 07-12 produces the file and 07-14 runs before the file is committed (possible in isolated worktrees), the gate reads stale data. But the dependency is `07-14 depends_on: ["07-12"]`, so 07-14 cannot start until 07-12 is complete and its summary is written. The file is in `files_modified` of 07-12, so it is committed before 07-14 starts. No issue.

**Finding: Plan 07-08 notes that `CopyButton.tsx` is a Client Component and uses `useTranslations`.** The plan correctly identifies this and says to confirm the directive. The file is indeed `"use client"` (verified by my read). The plan says to keep the raw `<button>` element unconverted (Phase 5's decision). Good.

**Finding: Plan 07-15 Task 1 checks `NEXT_PUBLIC_SITE_URL` at execution time.** It says "if the variable is absent or is not an https origin, STOP and report the plan as BLOCKED." The plan also says the value was `https://el-portal.app` as of 2026-08-02. The verify step reads from `.env.local` and asserts. This is correct.

**Finding: Plan 07-01 Task 3 has a `not-found` edge case.** It says "Because `[locale]` now sits at the root, an unmatched first segment reaches the layout and is rejected by the `hasLocale` guard. If Next instead errors because there is no root layout for the not-found boundary, add `src/app/not-found.tsx`." This is the right level of caution. The verify step does not explicitly test 404 — it relies on the build succeeding. The acceptance criterion says "An unmatched path returns 404, not 500" but the automated verify does not assert it. **Severity: low.** The human verification should include a 404 spot check.

### Summary

| # | Finding | Plan | Severity | Category |
|---|---------|------|----------|----------|
| 1 | 768px nav-row overflow fix path unspecified | 07-04 | low | robustness |
| 2 | Footer bottom-bar visual shift from third child | 07-04 | low | design |
| 3 | LocaleHint hint cookie never cleared on re-select | 07-04 | **medium** | UX gap |
| 4 | `getTranslations` API shape may not match plan notation | 07-04 | low | API |
| 5 | Desktop nav switcher has no automated coverage | 07-16 | low | coverage |
| 6 | 404 behavior asserted in acceptance but not in automated verify | 07-01 | low | verification |
| 7 | 8 identical wordplay tasks (repetition, not defect) | all | informational | — |

**The plans are strong.** The four new items (triple mount, LocaleHint, register, persisted spec) are all well-reasoned and correctly scoped. The one medium finding is the LocaleHint dismiss cookie not being cleared on locale re-selection — a real behavioral gap that the executor should address during implementation.

---

## Consensus Summary

The two reviewers landed in very different places, and the disagreement is the
most informative thing in this document. Codex rates the phase **HIGH risk**
and found five integration blockers. OpenCode rates it strong, with one medium
finding. They overlap on almost nothing.

That is not a tie to be split. Codex's findings were checkable against the
repository, and **every one I checked was real** — including two that are
mistakes I introduced during the 2026-08-19 revisions. OpenCode's pass read the
plans as documents and largely accepted their internal reasoning; it explicitly
called the `LocaleHint` mounting "well-reasoned" in the same paragraph where
codex found it cannot work. Where a finding below is marked VERIFIED, I checked
it against the actual source, not against the plan text.

### Agreed strengths

Both reviewers independently credited:

- **Static-rendering discipline.** Both singled out that 07-01 requires
  `generateStaticParams` AND `setRequestLocale` and evidences it from
  `.next/prerender-manifest.json` rather than a build symbol.
- **The persisted behavioural spec is aimed at the right two regressions** —
  the panel switcher and the cookie-dependent hint.
- **Translation quality is treated as more than key parity** — the wordplay
  register, the human read-throughs, and the identical-value checks cover what
  structural CI cannot see.
- **Catalogue parity is bidirectional** — 07-03 catches orphaned `es` keys, not
  just missing ones.

### Agreed concerns

Only one, and both reached it independently by different routes:

- **`TRANSLATION-FLAGS.md` append-only is not safe under parallel execution.**
  Append-only prevents semantic deletion; it does nothing about git conflicts or
  lost appends across isolated worktrees. Codex raises the same problem for
  marketing-only additions to `GLOSSARY.md`. OpenCode reached it from the
  dependency graph and concluded creation-vs-append ordering is fine — which is
  true and beside the point, since the risk is concurrent appends within Wave 3.

### Blockers — VERIFIED against the repository

1. **`LocaleHint` has no valid mount point. (codex, VERIFIED)** 07-04 Task 3
   says to render it in `src/app/[locale]/layout.tsx` "directly below the
   Navbar". `Navbar` is mounted per-page — all eight `src/app/*/page.tsx` import
   and render it; the layout never does. The instruction cannot be followed
   without a shared chrome component or moving Navbar ownership, and 07-04's
   file scope includes neither. This is a defect in the 2026-08-19 revision.

2. **Switching back to English can loop. (codex, VERIFIED by reading the plan
   logic)** Cookie is `es`; the user clicks EN and navigates to `/` (English is
   unprefixed under `as-needed`); the proxy at `/` reads the cookie, sees `es`,
   and redirects to `/es`. 07-04 gives `LanguageSwitcher` only a `context` prop
   with no cookie write, and 07-01 defers to "verify empirically whether
   `createMiddleware` still writes `NEXT_LOCALE` when `localeDetection` is
   false". 07-01's routing script tests a manually supplied `NEXT_LOCALE=en` but
   never the switcher flow that produces it. This is the phase's core
   user-visible contract and three prior passes missed it.

3. **07-16 still contradicts itself on the mobile switcher. (codex, VERIFIED)**
   Line 393 states the panel switcher is "ABSENT from the mobile hamburger panel
   (that absence is the locked D-11 tradeoff)". The 2026-08-19 revision fixed the
   human-check list below it and missed this prose. It contradicts the revised
   requirement, 07-04's three-mount contract, and 07-16's own Task 1 and Task 4 —
   a human following the pack would sign off the opposite of what ships.

4. **07-15 can run before the Spanish copy exists. (codex, VERIFIED)**
   `depends_on: ["07-06" … "07-12"]` omits 07-13 and 07-14, so per-locale
   metadata and descriptions get authored while the features and changelog
   Spanish translations are still being written.

5. **CI has no `NEXT_PUBLIC_SITE_URL`. (codex, VERIFIED)**
   `.github/workflows/responsive-audit.yml` defines no env block, `.env.local` is
   not in the repository, and 07-15 deliberately refuses a hardcoded fallback.
   A clean CI checkout therefore either fails the build or emits canonical and
   sitemap URLs against an undefined origin.

### Other findings worth acting on

- **07-04 is missing from the wordplay contract. (codex, VERIFIED)** The eight
  plans required to report `TRANSLATION FLAGS: n` exclude 07-04, which writes the
  Navbar, Footer, CTA and hint copy. I18N-07 covers all user-facing strings, so
  shared chrome is currently an unowned translation-quality surface.

- **The dismiss cookie is never cleared. (opencode, VERIFIED)** `LocaleHint`
  writes `NEXT_LOCALE_HINT=off` with a one-year lifetime and nothing clears it.
  A reader who dismisses the hint, then re-selects ES from the switcher — an
  explicit re-affirmation — never sees the hint again. OpenCode's best catch,
  and codex missed it.

- **The residual-string sweep misses live strings. (codex, VERIFIED)** All four
  named strings exist in the tree: `aria-label="Primary"` (Navbar.tsx:37),
  `aria-label="El Portal home"` (Footer.tsx:69), `aria-label="Portal icon"`
  (PortalIcon.tsx:21), and `CopyButton`'s `label = "Copy"` default. A manual
  grep is the only thing standing between these and the "no hardcoded
  user-facing string" criterion.

- **`i18n-chrome` is not a coarse-pointer project. (codex, plausible)** It
  registers `devices["Desktop Chrome"]` at 390px, which is not a touch surface,
  while `touch-iphone` is restricted to `LAYOUT_SPECS` and so will not run the
  new spec either.

- **Pricing PATH B is not executable as written. (codex, plausible)** It calls
  for a visible Spanish notice, but 07-09 Task 2 owns only
  `src/messages/es/pricing.json` — no English key, no render site.

- **Changelog dates need `timeZone: 'UTC'`. (codex, low)** A date-only value can
  shift a day depending on runtime timezone.

### Divergent views

- **`LocaleHint` mounting.** OpenCode: "well-reasoned … correct for static
  rendering." Codex: no valid mounting architecture. Codex is right; opencode
  reasoned about the server/client split without checking where `Navbar`
  actually renders.

- **Overall risk.** Codex HIGH, opencode strong-with-one-medium. Codex's
  position is supported by five findings that survive contact with the
  repository.

### Withdrawn — reviewer error

- **OpenCode finding 4, `getTranslations` API shape.** It suspected
  `getTranslations({locale: 'es', namespace: 'common'})` might not match
  next-intl's signature. It does. The source overload is
  `getTranslations(opts?: {locale: Locale; namespace?: NestedKey})`, and the
  documented examples pass exactly that object form. No change needed.

### Reviewer reliability note

OpenCode's transcript shows it re-stated the phase back as a session summary
twice and, in its closing recap, misnumbered the plans ("07-05 flag extraction",
"07-14 bulk translation gates") — neither matches the actual plan set. Its
in-body findings are sound and specific; treat its summary framing with less
confidence than its individual findings.

## Recommended next step

```
/gsd-plan-phase 7 --reviews
```

Five verified blockers, all in cross-plan integration seams rather than in any
single plan's internals. The pattern is consistent: these plans are strong on
what each one does alone and weakest where two of them have to meet. Two of the
five were introduced by the most recent revision round, which is its own lesson
about revising a plan set that has already passed its checker.
