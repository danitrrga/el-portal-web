---
phase: 07-spanish-localization
plan: 15
subsystem: seo
tags: [next-intl, metadata-api, hreflang, sitemap, next-15-app-router, github-actions]

requires:
  - phase: 07-spanish-localization
    provides: "Final Spanish copy for every namespace (07-04 through 07-14), the RouteKey/ROUTE_PATHS/buildPageMetadata signature fixed by 07-01, and 07-REVIEWS.md's HIGH finding on the missing CI origin variable"
provides:
  - "Per-locale, catalogue-driven metadata (title/description/OG/Twitter) for all 8 routes x 2 locales"
  - "hreflang alternates (en, es, x-default) on every page, agreeing with sitemap.xml"
  - "src/app/sitemap.ts — 16-URL both-locale sitemap derived from ROUTE_PATHS"
  - "Build-time E_MISSING_SITE_ORIGIN assertion in src/lib/seo.ts — no silent empty-origin build"
  - "Workflow-level NEXT_PUBLIC_SITE_URL wiring in responsive-audit.yml, sourced from a repository variable the human still has to create"
affects: [07-16]

tech-stack:
  added: []
  patterns:
    - "Single absoluteUrl(locale, route) helper over a cached getSiteOrigin() — every canonical, hreflang alternate, OG url and sitemap entry derives from it, never a hand-built string"
    - "Origin resolution memoized at module scope, invoked lazily (first call, not at import time), so a type-only import of RouteKey never trips the assertion"

key-files:
  created:
    - src/app/sitemap.ts
  modified:
    - src/lib/seo.ts
    - src/messages/en/metadata.json
    - src/messages/es/metadata.json
    - src/app/[locale]/layout.tsx
    - .github/workflows/responsive-audit.yml

key-decisions:
  - "Did not run `gh variable set` per explicit orchestrator instruction — implemented the workflow-side env wiring only and report the exact manual step below"
  - "Removed the now-dead VALUE_PRESERVED_METADATA object from seo.ts once privacy/terms' exact strings moved into metadata.json — every route now goes through the same getTranslations('metadata') path, one code path instead of two"
  - "Proved the E_MISSING_SITE_ORIGIN build-time assertion by physically renaming .env.local for one build (Next.js's own dotenv loader re-populates process.env from the file regardless of `env -u`, so unsetting the shell var alone does not test this)"

requirements-completed: [I18N-05]

duration: ~35min
completed: 2026-08-20
---

# Phase 07 Plan 15: Per-locale metadata, hreflang, sitemap Summary

**Catalogue-driven per-locale metadata (title/description/OG/Twitter) and hreflang for all 16 pages, a 16-URL both-locale sitemap, and a build-time E_MISSING_SITE_ORIGIN assertion — origin confirmed as `https://el-portal.app`, CI wiring added but the actual repository variable still needs a human click.**

## Performance

- **Duration:** ~35 min
- **Completed:** 2026-08-20
- **Tasks:** 2/2
- **Files modified:** 5 modified, 1 created

## Accomplishments

- Confirmed `NEXT_PUBLIC_SITE_URL=https://el-portal.app` at execution time (read directly from `.env.local`), distinct from `NEXT_PUBLIC_APP_URL=https://app.el-portal.app`
- `src/lib/seo.ts` now resolves the origin through a memoized `getSiteOrigin()` that throws `E_MISSING_SITE_ORIGIN` (proven by an actual failing build, not just a code read)
- Authored `src/messages/{en,es}/metadata.json` — one title/description pair per `RouteKey`, Spanish written against final shipped copy and sized to the search-snippet length budget
- `buildPageMetadata` emits canonical, `alternates.languages` (`en`/`es`/`x-default`), `openGraph` (`en_US`/`es_ES` + `alternateLocale`) and `twitter` tags, all built from one `absoluteUrl(locale, route)` helper
- `src/app/sitemap.ts` — 16 URLs (8 routes x 2 locales), each with its own `alternates.languages`, derived from the same `ROUTE_PATHS` table (no second route list)
- `src/app/[locale]/layout.tsx` gets a per-locale `generateMetadata` (was a static `metadata` export) supplying `metadataBase` and a per-locale fallback title/description
- `.github/workflows/responsive-audit.yml` gets a workflow-level `env: NEXT_PUBLIC_SITE_URL: ${{ vars.NEXT_PUBLIC_SITE_URL }}` block — nothing else in the file changed
- All 16 routes confirmed still prerendered after adding `getTranslations` calls to every `generateMetadata`

## Task Commits

1. **Task 1: Confirm the site origin, then write per-locale metadata copy and implement buildPageMetadata with hreflang** - `834b603` (feat)
2. **Task 2: Emit a both-locale sitemap and re-assert the static build** - `99e7825` (feat)

No separate plan-metadata commit was requested by the orchestrator for this run (STATE.md/ROADMAP.md updates below are covered by the final commit).

## Files Created/Modified

- `src/lib/seo.ts` — `getSiteOrigin()` (memoized, throws `E_MISSING_SITE_ORIGIN`), `localePath`/`absoluteUrl` helpers, `buildPageMetadata` rewritten to be catalogue-driven with hreflang/OG/Twitter
- `src/app/sitemap.ts` — new, app-root `MetadataRoute.Sitemap` default export, 16 entries
- `src/messages/en/metadata.json` / `src/messages/es/metadata.json` — 8 `RouteKey` groups each, `title` + `description`
- `src/app/[locale]/layout.tsx` — static `metadata` export replaced with `generateMetadata` (locale-aware, sets `metadataBase`)
- `.github/workflows/responsive-audit.yml` — workflow-level `env:` block added after the `concurrency:` block

## Decisions Made

- **Origin confirmation method:** read `.env.local` directly (`NEXT_PUBLIC_SITE_URL = https://el-portal.app`, `NEXT_PUBLIC_APP_URL = https://app.el-portal.app` — note the spaces around `=`, the reader in `seo.ts` uses `process.env` via Next's own dotenv loader, which tolerates this). Confirmed non-empty, absolute `https:`, and origin-distinct from the app URL.
- **No `gh variable set` run.** The orchestrator's instructions explicitly superseded the plan's Task 1(a) — I did not create or modify any GitHub repository variable via `gh`. See "CI origin — human action required" below for the exact manual step.
- **`VALUE_PRESERVED_METADATA` removed from `seo.ts`.** The plan's intent (privacy/terms English values preserved verbatim) is satisfied by copying those exact two strings into `metadata.json` itself; keeping a second hardcoded object with the same values would have been a second source of truth for the same two routes.
- **Real build-failure proof over an `env -u` check.** `env -u NEXT_PUBLIC_SITE_URL npm run build` still succeeded, because Next.js's dotenv loader repopulates `process.env.NEXT_PUBLIC_SITE_URL` from `.env.local` regardless of the parent shell's environment. I instead renamed `.env.local` to a `.bak` name for one build (confirmed `E_MISSING_SITE_ORIGIN` in the failure), then renamed it back immediately and re-ran a normal build to confirm success. `.env.local` was never staged, edited, or committed.
- **`hrefLang` (camelCase) vs `hreflang` in the rendered HTML `<link>` tags.** This is Next.js's own `alternates.languages` metadata generator (`node_modules/next/dist/lib/metadata/generate/alternate.js`), not something `seo.ts` controls. HTML attribute names are case-insensitive per the WHATWG spec and Google's own hreflang documentation notes this explicitly, so it is functionally identical to lowercase `hreflang` for crawlers. The generated `sitemap.xml` itself uses lowercase `hreflang` (the XML sitemap schema's own attribute), which is unaffected.

## Deviations from Plan

None requiring Rule 1-4 handling. One instruction supersession, documented above: the orchestrator's explicit "do not use `gh` to create repository secrets or variables yourself" directive overrode the plan's Task 1(a) (`gh variable set`), so I implemented only the workflow-side wiring and report the manual step below instead.

## Issues Encountered

- The plan's verify script tests the missing-origin case with `env -u NEXT_PUBLIC_SITE_URL npm run build`, which does not actually exercise the failure path because Next.js reloads `.env.local` on its own. Worked around by temporarily renaming `.env.local` for a single build (see Decisions Made above). Recorded here since a future executor re-running this exact verify command will see it pass regardless of whether the assertion works.

## CI origin — human action required

`gh` was not used to create anything. To make CI's checkout build correctly (the 07-REVIEWS.md HIGH finding), a human needs to:

1. Go to the repository's **Settings → Secrets and variables → Actions → Variables** tab (not Secrets — the origin is a public value).
2. Click **New repository variable**.
3. Name: `NEXT_PUBLIC_SITE_URL`
4. Value: `https://el-portal.app`
5. Save.

Once that variable exists, `.github/workflows/responsive-audit.yml`'s new workflow-level `env:` block (`NEXT_PUBLIC_SITE_URL: ${{ vars.NEXT_PUBLIC_SITE_URL }}`) makes it visible to every job/step in the workflow, including the `responsive` job's `npm run build && npm run start` invoked from inside `playwright.config.ts`'s `webServer`. Until the variable is created, any CI build in this workflow will fail fast with `E_MISSING_SITE_ORIGIN` rather than silently emitting canonicals against an undefined origin — that failure mode is the intended, safe default in the interim.

## Next Phase Readiness

- All I18N-05 SEO signals (per-locale metadata, hreflang, sitemap) are in place and verified against a real production build.
- 07-16 (final phase verification) can proceed; nothing in this plan is blocking, aside from the human CI-variable step above (which only affects the `responsive-audit.yml` workflow's own builds, not local development or this plan's own verification, both of which use `.env.local`).

---
*Phase: 07-spanish-localization*
*Completed: 2026-08-20*

## Self-Check: PASSED
- FOUND: src/lib/seo.ts
- FOUND: src/app/sitemap.ts
- FOUND: src/messages/en/metadata.json
- FOUND: src/messages/es/metadata.json
- FOUND: commit 834b603
- FOUND: commit 99e7825
- FOUND: .planning/phases/07-spanish-localization/07-15-SUMMARY.md
