---
phase: 07-spanish-localization
plan: 04
subsystem: i18n
tags: [next-intl, i18n, ui, accessibility, proxy, middleware]

# Dependency graph
requires:
  - phase: 07-01
    provides: "next-intl routing (localePrefix as-needed), src/i18n/navigation.ts locale-aware Link/usePathname/useRouter, src/proxy.ts / negotiation, 8 routes under [locale]"
  - phase: 07-02
    provides: "SPANISH-VOICE.md register rules, GLOSSARY.md"
  - phase: 07-03
    provides: "i18n:gates CI checks (register/parity/locale-aware-Link), 16-route Playwright harness, Navbar/Footer already on the locale-aware Link"
provides:
  - "common namespace (nav/footer/cta/switcher/localeHint) in both locales, mounted by Navbar, Footer, CTASection"
  - "LanguageSwitcher component (context, onNavigate props) mounted at 3 points: Navbar desktop, Navbar mobile panel, Footer"
  - "LocaleHint component: fixed-position, dismissible, English-route-only cross-locale notice"
  - "src/proxy.ts fix: an explicit NEXT_LOCALE=es choice now survives a direct visit to an unprefixed English route instead of being silently overwritten by next-intl's syncCookie"
  - "TRANSLATION-FLAGS.07-04.md (1 row) and glossary-additions/07-04.md (9 marketing-only coinages)"
affects: [07-05, 07-06, 07-07, 07-08, 07-09, 07-10, 07-13, 07-14, 07-16]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "LanguageSwitcher writes NEXT_LOCALE + expires NEXT_LOCALE_HINT via document.cookie inside the locale Link's onClick, BEFORE navigation — the one place in the phase that writes locale-choice cookies"
    - "LocaleHint resolves its copy server-side via getTranslations({locale: 'es', namespace: 'common'}) regardless of the surrounding route locale, then renders null until mounted client-side (cookie unreadable during prerender)"
    - "Responsive gap classes (space-x-1 lg:space-x-8 / space-x-0 lg:space-x-4) used to tighten only the 768-1024px zone without touching the already-correct >=1024px spacing — RESPONSIVE.md's 'never change a value already correct at >=768' rule applied at the sub-range level, not just the breakpoint level"

key-files:
  created:
    - src/components/LocaleHint.tsx
    - .planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-04.md
    - src/messages/glossary-additions/07-04.md
  modified:
    - src/components/LanguageSwitcher.tsx
    - src/components/Navbar.tsx
    - src/components/Footer.tsx
    - src/components/CTASection.tsx
    - src/components/PortalIcon.tsx
    - src/messages/en/common.json
    - src/messages/es/common.json
    - "src/app/[locale]/layout.tsx"
    - src/proxy.ts

key-decisions:
  - "Fixed a real 768px nav overflow the switcher's own addition caused (measured 32.6px over in English, 140.6px over in Spanish before any fix — not just a Spanish-copy-length problem) by tightening flex gaps in the md..lg range only (reverting to the original, unchanged values at >=1024px) plus shortening nav.changelog from 'Changelog' to 'Cambios' for the remaining ~17px; documented as a trigger-4 TRANSLATION-FLAGS row"
  - "Fixed src/proxy.ts (not in this plan's declared <files>, but required for LocaleHint's own stated purpose to work at all): next-intl's createMiddleware writes a syncCookie Set-Cookie on every request, which was silently downgrading an explicit NEXT_LOCALE=es choice back to en the instant a reader opened any unprefixed English URL — before LocaleHint's client-side check ever ran. Confirmed with curl. Restored the incoming es cookie on the response for unprefixed routes only; /es/* and requests with no cookie or an already-en cookie are untouched"
  - "LocaleHint's aside gets a 4th prop (label, resolved from common.localeHint.label) beyond the 3 listed in the plan's own <interfaces> prop table, because the plan's own acceptance criteria and SEMANTICS section require an aria-label distinct from the notice's body message, and that value must come from the server (a client component cannot read the es catalogue for a landmark name while the surrounding page is en)"
  - "Used the site's real --color-ep-hairline / --color-ep-mobile-menu-bg tokens for LocaleHint's border/surface instead of the plan text's literal 'bg-ep-bg-elevated' reference, which does not exist in globals.css (CLAUDE.md: the OKLCH --color-bg-* names in TOKENS.md were never built)"
  - "PortalIcon's eslint react-hooks/set-state-in-effect flag on LocaleHint's mount-then-read-cookie effect suppressed with a one-line justified eslint-disable, matching the existing precedent in src/components/animations/PerformanceMetric.tsx"

requirements-completed: [I18N-01, I18N-03, I18N-07]

# Metrics
duration: ~53min (across an interrupted session resumed by this continuation agent; first commit 18:50:52Z, last commit 19:43:37Z)
completed: 2026-08-19
---

# Phase 07 Plan 04: Shared Chrome, Language Switcher, Cross-Locale Hint Summary

**Translated Navbar/Footer/CTASection into a `common` catalogue, mounted a flagless EN/ES `LanguageSwitcher` at 3 points with per-link 44x44 touch targets and a client-side cookie write that closes 07-01's English-unreachable loop, built a fixed-position `LocaleHint` for readers with an explicit Spanish choice who land on an English URL — and fixed a `src/proxy.ts` cookie-sync bug (undocumented in any prior plan) that would have made the hint permanently unable to fire.**

## Performance

- **Duration:** ~53 min total (18:50:52Z first commit by the original executor → 19:43:37Z last commit by this continuation agent)
- **Tasks:** 4 (all `type="auto"`, no checkpoints)
- **Files modified:** 12 (2 created — LocaleHint.tsx is new code; TRANSLATION-FLAGS.07-04.md and glossary-additions/07-04.md are new docs — 10 modified)

## Accomplishments

- `LanguageSwitcher` (`src/components/LanguageSwitcher.tsx`): two locale `Link`s from `@/i18n/navigation`, each individually carrying `min-h-11 min-w-11 px-3 justify-center`; `onClick` writes `NEXT_LOCALE=<locale>; path=/; max-age=31536000; samesite=lax` and expires `NEXT_LOCALE_HINT` before navigation; `onNavigate` prop closes the mobile panel
- `common` namespace (`nav.*`, `footer.*`, `cta.*`, `switcher.*`, `localeHint.*`) in both locales; `Navbar`/`Footer` read via `useTranslations`, `CTASection` stays a Server Component via `getTranslations` (confirmed still prerendered)
- `PortalIcon`'s `aria-label="Portal icon"` replaced with `aria-hidden="true" focusable="false"` — it's decorative inside `ElPortalWordmark`, which already carries its own accessible name at every call site; `npm run audit:a11y` confirms zero violations
- Switcher mounted 3 times (Navbar desktop `hidden md:flex`, Navbar mobile panel with `onNavigate`, Footer bottom bar) — all 3 render the same component, no styling fork
- `LocaleHint` (`src/components/LocaleHint.tsx`): fixed `inset-x-4 bottom-4 z-40` (below Navbar's `z-50`), renders `null` until mounted and until `NEXT_LOCALE=es`, dismiss control is the shared `Button` (`variant="brand-link" size="icon"`), action `Link` carries its own `min-h-11 px-3`
- `src/proxy.ts` fix: an explicit Spanish choice now survives opening a bookmarked/shared English URL directly, which is the entire scenario `LocaleHint` exists for — see Deviations
- 768px nav-row overflow fixed for both locales (measured, not assumed) via mid-range-only responsive gap classes plus one shortened Spanish label

## Task Commits

1. **Task 1: Build the LanguageSwitcher** — `67b3a2d` (feat) — landed by the original (interrupted) executor
2. **Task 2: Extract Navbar/Footer/CTASection into common, mount switcher** — `52a843c` (feat) — completed by this continuation agent; includes the 768px nav-overflow fix
3. **Task 3: The cross-locale hint** — `46b1140` (feat) — includes the `src/proxy.ts` deviation
4. **Task 4: Wordplay check** — `35a7594` (docs)

## Files Created/Modified

- `src/components/LanguageSwitcher.tsx` — EN/ES toggle, cookie writes, touch targets (created in Task 1, minor `md:min-h-6` desktop-alignment tweak carried over uncommitted from the interrupted session)
- `src/components/Navbar.tsx` — `common` strings, 2 switcher mounts, responsive gap tightening (md..lg only)
- `src/components/Footer.tsx` — `common` strings, 1 switcher mount, ICU `{year}` copyright
- `src/components/CTASection.tsx` — `common` strings via `getTranslations`, stays a Server Component
- `src/components/PortalIcon.tsx` — `aria-hidden` instead of a duplicate accessible name
- `src/components/LocaleHint.tsx` — new: fixed-position cross-locale notice
- `src/messages/en/common.json`, `src/messages/es/common.json` — `nav`/`footer`/`cta`/`switcher`/`localeHint` keys
- `src/app/[locale]/layout.tsx` — `<LocaleHint />` mount, conditional on route locale `en`, resolving against the `es` catalogue
- `src/proxy.ts` — `preserveExplicitSpanishChoice`, restores an incoming `es` cookie on unprefixed-route responses
- `.planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-04.md`, `src/messages/glossary-additions/07-04.md` — new docs

## Decisions Made

See frontmatter `key-decisions`. In short: fixed a switcher-caused nav overflow at 768px (measured 32.6px over in English, 140.6px over in Spanish, not just a Spanish-length issue), fixed an inherited `src/proxy.ts` cookie-sync bug that broke `LocaleHint`'s own premise, added a 4th `label` prop to `LocaleHint` the interfaces table omitted but the acceptance criteria required, and used the codebase's real `--color-ep-*` tokens instead of the plan text's aspirational (non-existent) `bg-ep-bg-elevated`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] 768px nav row overflowed in both locales once the switcher was added**

- **Found during:** Task 2, the plan's own mandated "measure, do not assume" 768px check
- **Issue:** Real `getBoundingClientRect()` measurement at exactly 768px (the md breakpoint, where the desktop cluster first appears) showed the right-actions row extending 32.6px past the nav's own right edge in English and 140.6px in Spanish — not the Spanish-only problem the plan's action text anticipated. `npm run audit:overflow`/`audit:containment` do not catch this: the offending elements sit inside a `position: fixed` ancestor (the Navbar), so their overflow past the viewport edge does not register on `document.documentElement.scrollWidth`, and `containment.spec.ts`'s own `isExcluded` guard explicitly skips anything with a fixed ancestor and anything with no clipping ancestor at all ("viewport-level overflow, which overflow.spec.ts already owns" — and overflow.spec.ts's own scrollWidth check doesn't see it either, for the same reason).
- **Fix:** Tightened `Navbar.tsx`'s desktop nav-links gap (`space-x-8` → `space-x-1 lg:space-x-8`) and right-actions gap (`space-x-4` → `space-x-0 lg:space-x-4`) so the tighter value only applies in the 768-1024px zone, reverting to the exact original spacing at `lg:` and up (RESPONSIVE.md: "never change a value that's already correct at >=768px" — applied here at the sub-range level, since >=1024px was already correct and >=768px-<1024px was not). This alone closed English's 32.6px deficit (`-25px` margin after) but left Spanish 16.6px over. Shortened `nav.changelog` (es) from "Changelog" to "Cambios" (no prior GLOSSARY entry existed for this term) for the rest, landing at a `-7.4px` margin (fits, moderate safety margin) — recorded as a TRANSLATION-FLAGS trigger-4 row since it creates a nav/footer wording inconsistency ("Cambios" vs. footer's unshortened "Changelog") a design owner may want to reconcile.
- **Files modified:** `src/components/Navbar.tsx`, `src/messages/es/common.json`
- **Verification:** Real `getBoundingClientRect()` re-measured at 768px after the fix: English `-25px` margin, Spanish `-7.4px` margin (both fit, no offenders). `npm run audit:overflow`/`audit:containment`/`audit:targets`/`audit:a11y` all still pass (they never caught this in the first place, per above). Visually confirmed via screenshot at 768px (both locales, readable, no clipped/overlapping text) and 1440px (spacing unchanged from before this plan, confirming the `lg:` revert is exact).
- **Committed in:** `52a843c` (Task 2 commit)

**2. [Rule 2/3 - Missing critical functionality / blocking issue] `src/proxy.ts`'s syncCookie silently defeated `LocaleHint`'s entire purpose**

- **Found during:** Task 3, while empirically verifying (per the plan's own "prove the placement, do not assert it" instruction) that the hint actually renders with a real `NEXT_LOCALE=es` cookie on `/pricing`
- **Issue:** `curl -b "NEXT_LOCALE=es" http://localhost:3987/pricing` returned `set-cookie: NEXT_LOCALE=en` in the SAME response that served the page. `next-intl`'s `createMiddleware` (07-01's `handleI18nRouting`) writes a `syncCookie` `Set-Cookie` on every request it handles, not just `/`, and 07-01's own code comment documented this as intentional and harmless ("the written value always AGREES with the URL actually being browsed"). But that comment predates `LocaleHint`: a reader who chose Spanish earlier and then opens a bookmarked/shared/search-result English URL directly (never through `LanguageSwitcher`) was having their `es` cookie overwritten to `en` by the very response serving that page, before any client-side JavaScript — including `LocaleHint`'s cookie check — ever ran. This made the hint permanently unable to fire on exactly the scenario the plan's own problem statement describes, and no test in the repo caught it because `verify-locale-routing.mjs` (07-01) only exercises cookie behavior at `/`.
- **Fix:** Added `preserveExplicitSpanishChoice` to `src/proxy.ts`. For any request whose pathname is NOT `/` and NOT under `/es`, if the incoming request cookie is `es`, the outgoing response's `NEXT_LOCALE` cookie is restored to `es` (same attributes `LanguageSwitcher` uses: `path=/`, `max-age=31536000`, `SameSite=Lax`). Requests with no cookie, an already-`en` cookie, or a path under `/es/*` are untouched — an explicit switch to English (written client-side by `LanguageSwitcher` before it navigates) always wins, and `/es/*` syncing to `es` was already correct.
- **Files modified:** `src/proxy.ts`
- **Verification:** `curl -b "NEXT_LOCALE=es" .../pricing` now returns `set-cookie: NEXT_LOCALE=es` (was `en`); `curl -b "NEXT_LOCALE=en" .../pricing` returns no `set-cookie` header (already correct, unaffected); `curl -b "NEXT_LOCALE=es" .../es/pricing` returns no `set-cookie` header (unaffected, as designed); no-cookie request still syncs to `en` (first-time-visitor behavior unchanged). Full Playwright run confirmed the hint now actually renders on `/pricing` at all 4 widths with a real `es` cookie, never intersects the Navbar, and `npm run verify:routing` (07-01's own 40+ assertion suite, which only tests cookie behavior at `/`) still passes unchanged.
- **Committed in:** `46b1140` (Task 3 commit)

**3. [Rule 2 - Missing critical functionality] `LocaleHint`'s `<aside>` needed a 4th prop the interfaces table omitted**

- **Found during:** Task 3, reconciling the plan's `<interfaces>` prop list (`{ message, action, dismissLabel }`) against its own acceptance criteria ("The root is an `<aside>` with an `aria-label` from `common.localeHint.label`")
- **Issue:** The interfaces table lists only 3 props, but the SEMANTICS section and acceptance criteria require the `<aside>`'s accessible name to come from a distinct, shorter noun phrase (`common.localeHint.label`) rather than the full notice `message` — and that value must be resolved server-side against the `es` catalogue (a client component reading `useTranslations` inside an English page would resolve against the `en` messages, not `es`), so it cannot be computed inside the component from the other 3 props.
- **Fix:** Added a 4th `label: string` prop, resolved server-side in `layout.tsx` alongside the other 3 and passed through the same way.
- **Files modified:** `src/components/LocaleHint.tsx`, `src/app/[locale]/layout.tsx`
- **Verification:** Task 3's inline verify script (which checks for the `localeHint.label` catalogue key, not the prop wiring itself) passes; manually confirmed via `page.evaluate` that the rendered `<aside>`'s `aria-label` reads "Aviso de idioma", not the full message sentence.
- **Committed in:** `46b1140` (Task 3 commit)

---

**Total deviations:** 3 auto-fixed (1 Rule 1 bug, 2 Rule 2/3 missing-critical/blocking)
**Impact on plan:** All three were necessary for this plan's own stated deliverables to actually work in the real browser, not just pass a narrow inline verify script. No scope creep beyond what each deliverable required: the nav-gap fix only touches the one file/breakpoint range causing it; the proxy fix only touches unprefixed-route responses when the incoming cookie is `es`; the 4th prop only threads an already-catalogued string through.

## Gate Proofs (cadence requirement — measure, don't assume)

| Check | Result |
|---|---|
| Footer switcher, 390px, `/` (en context) | EN 44×44, ES 44×44 |
| Footer switcher, 390px, `/es` (es context) | EN 44×44, ES 44×44 |
| Mobile panel switcher, 390px, `/pricing` (opened panel) | EN 44×44, ES 44×44 |
| 768px nav row, English (before fix / after fix) | 32.6px overflow / **-25px margin (fits)** |
| 768px nav row, Spanish (before fix / after fix) | 140.6px overflow / **-7.4px margin (fits)** |
| `/es/manifesto` → click EN | lands on `/manifesto`, `<html lang>`=`en`, `document.cookie`=`NEXT_LOCALE=en` |
| `/pricing` → click ES | lands on `/es/pricing`, `<html lang>`=`es`, `document.cookie`=`NEXT_LOCALE=es` |
| ES clicked inside open mobile panel on `/pricing` | lands on `/es/pricing`, panel confirmed closed on destination, `<html lang>`=`es` |
| Cookie write mechanism | `onClick` synchronous `document.cookie` write proved sufficient — no bounce-back observed from `/es` → EN → `/`, confirmed with a page reload afterward; no escalation to `router.replace` needed |
| `curl -b "NEXT_LOCALE=es" /pricing` before/after the `src/proxy.ts` fix | `set-cookie: NEXT_LOCALE=en` → `set-cookie: NEXT_LOCALE=es` |
| LocaleHint present with `es` cookie | `/pricing` at 320/390/768/1440px — present, `navIntersect: false` at all 4 widths |
| LocaleHint absent, no cookie | `/` and `/pricing` — absent |
| LocaleHint absent on `/es/*` | `/es/pricing` with `es` cookie — absent (never renders on the Spanish tree) |
| LocaleHint vs. CTASection's primary CTA | **Structurally untestable as literally specified**: CTASection only renders on the homepage (`page.tsx`), and the homepage is the one route (`/`) that negotiates — a reader with an `es` cookie visiting `/` is redirected to `/es` before any English content paints, so the hint and the CTA can never coexist on a rendered English page. Confirmed via `curl -b "NEXT_LOCALE=es" localhost:3987/` → `307` to `/es`, and via Playwright (`hintExists: false`, `htmlLang: es` on `/`). This is inherent to 07-01's `/`-only negotiation design, not a defect this plan introduces or can fix within its own `<files>` scope |
| LocaleHint dismiss control (390px) | 44×44 |
| LocaleHint action link (390px) | 130×44 |
| Dismiss → reload | hint stays gone, `NEXT_LOCALE_HINT=off` persists |
| Switcher click after dismissal | `NEXT_LOCALE_HINT` expired, hint reappears on next load |
| `npm run audit:a11y` with `NEXT_LOCALE=es` cookie set, hint visible | 0 violations on `/pricing`, `/features`, `/manifesto` |
| `npm run audit:containment`/overflow with `es` cookie, hint visible | no offenders at 320/360/390/430/768px |
| Hydration warnings (no cookie / `es` cookie) | none in either case |
| `npm run build` | all 16 routes still prerendered (`● /[locale]/*` × 8 en + 8 es) |
| `npm run verify:routing` | all assertions pass (unaffected by the proxy change, which only touches non-`/` paths) |
| `npm run i18n:gates` | 0 failures, 0 warnings |
| `npx tsc --noEmit` / `npm run lint` (touched files) | clean |
| `npm run audit:targets` | 64 passed on all 7 launchable Chromium viewport projects; `touch-iphone` (WebKit) could not launch — same pre-existing sandbox blocker 07-01/07-02/07-03 logged (`sudo npx playwright install-deps` required, no sudo available here) |

## Issues Encountered

- **`touch-iphone` (WebKit) still cannot launch** in this sandbox — identical, pre-existing blocker from 07-01/07-02/07-03 (missing system deps, no sudo). Every layout spec this plan touched (touch-targets, containment, a11y, overflow) was run for real on all 7 Chromium-based viewport projects via `--output=<scratch> --reporter=line` (root-owned `test-results`/`playwright-report`, same workaround as 07-03).
- **The interrupted prior session left uncommitted work and 3 scratch measurement scripts** (`.tmp-axe-debug.mjs`, `.tmp-nav-measure.mjs`, `.tmp-nav-measure2.mjs`) in the repo root, plus one already-committed task. Reconciled by diffing the uncommitted tree against the plan's 4 tasks: Task 1 was fully committed, Task 2's extraction work was present but uncommitted and functionally complete (verified against its own inline verify script), Tasks 3 and 4 had not been started. The 3 scratch scripts were deleted (never committed) after confirming they were disposable Playwright debug helpers, not deliverables.

## User Setup Required

None - no external service configuration required. (The `test-results`/`playwright-report` root-ownership issue carried from 07-01/07-02/07-03 remains open; see that phase's `deferred-items.md`.)

## Next Phase Readiness

- Every Wave 3/4 translation plan (07-05 through 07-14) inherits a `common` namespace that already carries the site's shared chrome, a working switcher on all 3 required mount points, and a cross-locale hint that now actually fires for the scenario it exists for.
- `src/proxy.ts`'s cookie-sync fix is a general correctness fix, not scoped to this plan's own routes — any future plan reading `NEXT_LOCALE` client-side on an unprefixed route benefits from it.
- The one open item: `nav.changelog` ("Cambios") and `footer.changelog` ("Changelog") now say different things for the same destination — flagged in `TRANSLATION-FLAGS.07-04.md` for the design owner, not silently left inconsistent.
- 07-16 has one glossary-additions file (`07-04.md`, 9 terms) and one translation-flags file (`07-04.md`, 1 row) ready to merge.

TRANSLATION FLAGS: 1

*(Added by plan 07-16 during aggregation — this summary originally omitted the required `TRANSLATION FLAGS: n` line despite `TRANSLATION-FLAGS.07-04.md` carrying 1 row; the count matches that file's own row count, verified by 07-16 before merging.)*

---
*Phase: 07-spanish-localization*
*Completed: 2026-08-19*

## Self-Check: PASSED

All 13 claimed files found on disk (LanguageSwitcher.tsx, Navbar.tsx,
Footer.tsx, CTASection.tsx, PortalIcon.tsx, LocaleHint.tsx, en/common.json,
es/common.json, layout.tsx, proxy.ts, TRANSLATION-FLAGS.07-04.md,
glossary-additions/07-04.md, this summary). All 4 claimed task commits
(`67b3a2d`, `52a843c`, `46b1140`, `35a7594`) found in git log.
