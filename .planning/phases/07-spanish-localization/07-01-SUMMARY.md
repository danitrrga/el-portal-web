---
phase: 07-spanish-localization
plan: 01
subsystem: i18n
tags: [next-intl, nextjs-16, app-router, proxy, routing, static-generation]

# Dependency graph
requires: []
provides:
  - next-intl routing config (`src/i18n/routing.ts`) with locales en/es, `as-needed` prefix, detection off
  - "/-only negotiation proxy (`src/proxy.ts`) that never redirects any URL except `/`"
  - Namespace-merging request config (`src/i18n/request.ts`) and 20 stub JSON message files
  - `buildPageMetadata(locale, routeKey)` contract in `src/lib/seo.ts` (value-preserving in this plan)
  - Locale-aware navigation exports (`src/i18n/navigation.ts`: Link, redirect, usePathname, useRouter, getPathname)
  - All 8 routes moved under `src/app/[locale]/`, each statically prerendered for both locales
  - Server/client split for the pricing route (`src/components/pricing/PricingClient.tsx` + thin server wrapper)
  - `scripts/verify-locale-routing.mjs` — standalone proof of the negotiation contract, wired to `npm run verify:routing`
affects: [07-02, 07-03, 07-04, 07-05, 07-06, 07-07, 07-08, 07-09, 07-10, 07-11, 07-12, 07-13, 07-14, 07-15, 07-16]

# Tech tracking
tech-stack:
  added: ["next-intl@^4.13", "@formatjs/intl-localematcher", "negotiator", "@types/negotiator"]
  patterns:
    - "Next 16 proxy.ts (not middleware.ts) negotiates locale only at `/`; every other pathname is delegated straight to next-intl's own middleware"
    - "Client Components needing generateMetadata/setRequestLocale get split into a thin async server page + a `*Client.tsx` component holding the original body verbatim"
    - "NEXT_LOCALE cookie ownership split: client (LanguageSwitcher, plan 07-04) writes explicit choices; proxy only reads it, only at `/`"

key-files:
  created:
    - src/i18n/routing.ts
    - src/i18n/navigation.ts
    - src/i18n/request.ts
    - src/proxy.ts
    - src/lib/seo.ts
    - scripts/verify-locale-routing.mjs
    - src/messages/en/*.json (10 namespace stubs)
    - src/messages/es/*.json (10 namespace stubs)
    - src/components/pricing/PricingClient.tsx
  modified:
    - next.config.ts
    - src/app/[locale]/layout.tsx (moved from src/app/layout.tsx)
    - src/app/[locale]/page.tsx, features/page.tsx, manifesto/page.tsx, changelog/page.tsx, mcp/page.tsx, pricing/page.tsx, privacy/page.tsx, terms/page.tsx (all moved from src/app/*)

key-decisions:
  - "createMiddleware writes NEXT_LOCALE unconditionally via its internal syncCookie step even with localeDetection:false, but the written value is always derived from the URL's own locale prefix — it can never disagree with an explicit choice already reflected by the navigation that produced the request. No override needed; documented in a top-of-file comment in src/proxy.ts for plan 07-04."
  - "No src/app/not-found.tsx needed — the [locale] layout's hasLocale guard correctly 404s an unmatched first path segment (verified empirically: /definitely-not-a-route returns 404, not 500)."
  - "Pricing split: original client body moved byte-for-byte into src/components/pricing/PricingClient.tsx (only the default export identifier changed, PricingPage -> PricingClient); src/app/[locale]/pricing/page.tsx is a 20-line async server wrapper calling setRequestLocale + generateMetadata and rendering <PricingClient />."

patterns-established:
  - "Every server page under src/app/[locale] calls setRequestLocale(locale) as its first statement and exports generateMetadata delegating to buildPageMetadata(locale, routeKey) — later plans filling in copy must preserve both."
  - "Metadata literals live only in src/lib/seo.ts, never duplicated in page files."

requirements-completed: [I18N-01, I18N-02, I18N-04, I18N-06]

# Metrics
duration: 2h24m (across an interruption; task 3 resumed and completed in ~20min by the continuation agent)
completed: 2026-08-19
---

# Phase 07 Plan 01: next-intl routing foundation Summary

**Stood up next-intl on Next.js 16 with a `/`-only negotiation proxy and moved all 8 routes under `src/app/[locale]/`, prerendering all 16 English+Spanish URLs with zero English URL moved and zero route falling off static generation.**

## Performance

- **Duration:** ~2h24m total (17:46-20:10 CEST), spanning an interruption between Task 2 and Task 3
- **Started:** 2026-08-19T15:46:13Z (Task 1 approval)
- **Completed:** 2026-08-19T18:10:19Z (Task 3 commit)
- **Tasks:** 3 (1 checkpoint, 2 auto)
- **Files modified:** 11 in this continuation's commit (9 route moves + 1 new component + 1 script fix), plus the 30+ files from Task 2's commit

## Accomplishments
- next-intl 4.13, `@formatjs/intl-localematcher`, and `negotiator` installed after an explicit human legitimacy approval (Task 1)
- `src/proxy.ts` negotiates locale only at `/`; every other pathname (including all 8 English routes) passes straight through to next-intl's own middleware untouched — proven by `npm run verify:routing`
- All 8 routes + root layout moved under `src/app/[locale]/` via `git mv`, each calling `setRequestLocale` and exporting `generateMetadata`
- `pricing/page.tsx` (a Client Component) split into a thin server wrapper + `src/components/pricing/PricingClient.tsx` holding the original body verbatim
- `npm run build` prerenders all 16 route variants as static (SSG) — zero fell back to on-demand rendering
- `<html lang>` now reflects the active locale (`en` / `es`) instead of a hardcoded `"en"`
- Unmatched paths (e.g. `/definitely-not-a-route`) return 404, not 500 — no custom `not-found.tsx` was required
- Observed and documented `createMiddleware`'s cookie-write behavior with `localeDetection:false` for plan 07-04 to consume directly (see `src/proxy.ts` top comment)

## Task Commits

Task 1 and Task 2 were completed by a prior executor session before this continuation began:

1. **Task 1: Package legitimacy gate** - `ec6b7ad` (chore) — human-approved before install
2. **Task 2: next-intl config, proxy, contracts** - `de7dc65` (feat)
3. **Task 3: Move all 8 routes under [locale], split pricing, prove 16 prerender** - `69c3005` (feat) — completed by this continuation agent

_Task 3 also folded in a bugfix to `scripts/verify-locale-routing.mjs` (Rule 1) discovered while running the verification this task requires — see Deviations below._

## Files Created/Modified (Task 3, this continuation)

- `src/app/[locale]/layout.tsx` — root layout with `hasLocale` guard, `setRequestLocale`, `generateStaticParams`, `NextIntlClientProvider`, `<html lang={locale}>`
- `src/app/[locale]/page.tsx`, `features/page.tsx`, `manifesto/page.tsx`, `changelog/page.tsx`, `mcp/page.tsx`, `privacy/page.tsx`, `terms/page.tsx` — each gains `setRequestLocale` + `generateMetadata`; `privacy`/`terms` had their duplicated `metadata` literals removed (now solely in `src/lib/seo.ts`)
- `src/app/[locale]/pricing/page.tsx` — new thin server wrapper (`setRequestLocale`, `generateMetadata`, renders `<PricingClient />`)
- `src/components/pricing/PricingClient.tsx` — original pricing page body moved verbatim (`"use client"` retained; only the default export identifier changed)
- `scripts/verify-locale-routing.mjs` — fixed `new URL(location)` to `new URL(location, BASE)` so a relative `Location` redirect header doesn't throw

## Decisions Made

- **`createMiddleware` cookie-write behavior (recorded for plan 07-04):** with `localeDetection:false`, next-intl still writes `NEXT_LOCALE` via its internal `syncCookie` step, but the value it writes is derived solely from the requested URL's own locale prefix (falling back to `defaultLocale` when unprefixed). It can never disagree with an explicit choice already reflected by the navigation that produced the request, so no override was needed. Fully documented in the `src/proxy.ts` top-of-file comment.
- **No `src/app/not-found.tsx` added** — confirmed via `next start` + curl that `/definitely-not-a-route` returns 404 (not 500); the `[locale]` layout's `hasLocale` guard already rejects unmatched first segments correctly.
- **Pricing split shape locked for plan 07-09**: `PricingClient.tsx` is the byte-identical client body (diffed against the pre-move file — only the default export name changed); `[locale]/pricing/page.tsx` is a ~20-line server wrapper. Plan 07-09 works against this shape.
- **Observed redirect header** for `/?utm_source=test&x=1` under `Accept-Language: es-ES,es;q=0.9,en;q=0.5`: `307` with `location: /es?utm_source=test&x=1` — pathname closed to the literal `/es`, query preserved verbatim, origin untouched.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `verify-locale-routing.mjs` threw on a relative redirect Location header**
- **Found during:** Task 3, running `npm run verify:routing` against the newly-moved route tree
- **Issue:** `new URL(location)` with no base argument throws `Invalid URL` when Next's `redirect()` (used internally by `next-intl`'s middleware and this plan's own `/` handler) emits a relative `Location` header (e.g. `/es`) rather than an absolute one — this was silently masking real assertions from ever running.
- **Fix:** Changed both call sites to `new URL(location, BASE)`, resolving relative headers against the script's own `BASE` constant (`http://localhost:3988`).
- **Files modified:** `scripts/verify-locale-routing.mjs`
- **Verification:** `npm run verify:routing` now runs to completion and reports "all assertions passed" (previously the script's own bug meant these two assertion groups either threw or silently no-op'd).
- **Committed in:** `69c3005` (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Necessary for the plan's own I18N-02/I18N-04 proof script to actually run and pass. No scope creep — the fix touches only the verification script created in Task 2, not application code.

## Issues Encountered

- **Prior executor interruption between Task 2 and Task 3:** this continuation agent found Task 3's file moves and the pricing split already staged in the working tree but uncommitted. Reconciled by diffing every moved file against its pre-move `HEAD` content (via `git diff` on the detected renames) to confirm the interrupted agent's work matched the plan exactly (mechanical move + three additions per file, pricing split byte-identical apart from the export name) before committing.
- **The plan's own inline `<verify>` command for Task 3 checks `.next/prerender-manifest.json` for literal bare English paths** (e.g. `/features`) alongside `/es/features`. In practice, because the underlying filesystem route is `[locale]/features/page.tsx` and `generateStaticParams` returns both `en` and `es`, Next.js's manifest lists both variants under their locale-prefixed path (`/en/features`, `/es/features`) — the unprefixed English URL is served via next-intl's request-time rewrite, not a build-time manifest entry. Verified all 16 prefixed entries are present (`/en`, `/es`, `/en/features`, `/es/features`, ... = 16 total, all marked `● SSG` in the build output, zero `ƒ` dynamic routes among them) and separately confirmed via `curl` that `/pricing` (unprefixed) returns `200` with `<html lang="en">` and `/es/pricing` returns `200` with `<html lang="es">`. This satisfies the actual I18N-06 intent (nothing fell off static generation) even though the plan's literal grep-style check would have needed adjusting for next-intl's manifest shape.
- **`npm run audit:responsive` (plan's verification step 4, Phase 5 regression check) could not be run** — `test-results/` and `playwright-report/` in this working tree are owned by `root` from a prior session, and this sandbox user has no `sudo` access to clear them (`EACCES: permission denied` on `test-results/.last-run.json`). This is a pre-existing environment artifact unrelated to this plan's changes (confirmed via `ls -la`, directories dated Aug 1). Deferred — needs `sudo rm -rf test-results playwright-report` run by someone with elevated access before the Phase 5 responsive-audit regression check can execute against the new `[locale]` route tree.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Wave 1 partner plan 07-02 (glossary + voice contract) can proceed independently — no shared files with this plan.
- Waves 2-4 (the ten namespace-filling plans) are unblocked: all 20 stub JSON files exist, `buildPageMetadata`, `RouteKey`, `ROUTE_PATHS`, and the navigation exports are stable per the `<interfaces>` contract.
- Plan 07-04 (LanguageSwitcher) has its exact `NEXT_LOCALE` cookie-ownership answer recorded in `src/proxy.ts` and does not need to rediscover it.
- Plan 07-09 (pricing copy) has the exact server/client split shape to work against.
- **Blocker for a full Phase 5 regression re-check:** `npm run audit:responsive` needs `test-results/`/`playwright-report/` (currently root-owned) cleared with elevated permissions before it can run against the moved route tree — not blocking for Wave 2+ execution, but should be cleared before Phase 7's final verification wave (Wave 6).

---
*Phase: 07-spanish-localization*
*Completed: 2026-08-19*

## Self-Check: PASSED

All 16 claimed files found on disk (9 route files, PricingClient.tsx, 5 i18n/seo/proxy contract files, verify script, this summary). All 3 claimed commits (`ec6b7ad`, `de7dc65`, `69c3005`) found in git log.
