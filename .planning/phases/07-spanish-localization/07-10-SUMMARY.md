---
phase: 07-spanish-localization
plan: 10
subsystem: i18n
tags: [next-intl, spanish-localization, legal, privacy, terms, register-gate]

# Dependency graph
requires:
  - phase: 07-spanish-localization
    provides: legal namespace scaffold, i18n gates (07-03), CI register/translation-status gates, LanguageSwitcher (07-04)
provides:
  - src/messages/en/legal.json and src/messages/es/legal.json — full legal namespace (privacy.*, terms.*, authority.*)
  - Catalogue-driven /privacy and /terms pages in both locales
  - English-governs authority notice rendered on both pages in both locales
  - Re-measured KU-3 numbers for /es/privacy
affects: [07-16 (aggregation of TRANSLATION-FLAGS.07-10.md and glossary-additions/07-10.md), end-of-phase human read-through (D-08)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Legal page extraction: t.raw() for structured array/object catalogue data (Bucket/Provider/Right arrays, Terms per-section objects), matching the manifesto.tsx precedent"
    - "Authority notice as a single shared authority.notice key rendered identically (translated) on both /privacy and /terms in both locales"

key-files:
  created:
    - src/messages/en/legal.json
    - src/messages/es/legal.json
    - .planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-10.md
    - src/messages/glossary-additions/07-10.md
  modified:
    - src/app/[locale]/privacy/page.tsx
    - src/app/[locale]/terms/page.tsx

key-decisions:
  - "Hosting region strings (privacy.providers[].region) kept verbatim English (\"EU — Frankfurt\", \"EU — edge\", \"EU\") rather than localized to \"UE\" — conservative reading of \"hosting regions stay factually identical\" to guarantee zero drift risk on a Phase-3-reconciled claim"
  - "\"Lifetime\" (Terms payment section) kept English/capitalized, matching the tier-name convention 07-09 already established for pricing.json, rather than the generic-adjective glossary row (\"de por vida\") used elsewhere in the app's own settings strings"
  - "privacy.h1 shortened from a literal translation to \"Tus datos, a la vista.\" to fix a NEW h1 containment offender (122px overflow at 320px, zero English counterpart) — logged in TRANSLATION-FLAGS.07-10.md, not silently shipped"
  - "privacy.rights[].action breadcrumbs shortened (dropped the \"Configuración — \" prefix) to fix a NEW clip-escape offender on the flex-shrink-0 action span (43px off-screen at 320px) — also logged in TRANSLATION-FLAGS.07-10.md"

patterns-established:
  - "New containment offenders introduced purely by longer Spanish text are fixed by rewording copy first, before considering any CSS/layout change — both fixes in this plan were copy-only, zero CSS touched"

requirements-completed: [I18N-01, I18N-07]

# Metrics
duration: 19min
completed: 2026-08-20
---

# Phase 07 Plan 10: /privacy and /terms Spanish Localization Summary

**Extracted 465 lines of `/privacy` and `/terms` into a `legal` i18n namespace, wrote full-parity Spanish copy in the locked tú register, added a bilingual English-governs authority notice, and fixed two NEW (not KU-3) containment offenders caused by longer Spanish text — all via copy changes, zero CSS touched.**

## Performance

- **Duration:** 19 min
- **Started:** 2026-08-20T13:22:00+02:00
- **Completed:** 2026-08-20T13:41:12+02:00
- **Tasks:** 3
- **Files modified:** 6 (2 pages, 2 catalogues, 2 new register files)

## Accomplishments

- `/privacy` and `/terms` are fully catalogue-driven Server Components in both locales, with zero hardcoded user-facing strings remaining
- `legal` namespace (en/es) is key-identical: same keys, same array lengths (buckets ×3, providers ×4, rights ×4, terms sections ×13) — verified programmatically, not by eye
- English-governs authority notice renders on both `/privacy` and `/terms`, in both `en` and `es`, styled as plain `text-sm` muted meta text directly under the H1 — no banner, no chrome
- Spanish legal copy holds the `tú` register throughout: zero `usted`/`ustedes`/written subject `tú`; the two `su`/`sus` occurrences are legitimate third-person possessives (`su diseño` referring to "el Servicio", `sus operadores` referring to "El Portal"), confirmed by `npm run i18n:gates` (advisory-only, 0 failures)
- KU-3 (`/privacy`'s `p.text-` legal-paragraph overflow) re-measured on `/es/privacy`: **better** than the English baseline, not worse — no design-owner escalation needed
- Two NEW containment offenders (Spanish-only, zero English counterpart) found and fixed at the copy level, both logged in `TRANSLATION-FLAGS.07-10.md`

## Task Commits

1. **Task 1: Extract both legal pages into the legal namespace and add the authority notice** - `914256d` (feat)
2. **Task 2: Write the Spanish legal copy and re-measure KU-3** - `2448878` (feat)
3. **Task 3: Wordplay check — record what did not survive into Spanish** - `42d5153` (docs)

_No separate plan-metadata commit — STATE.md/ROADMAP.md/REQUIREMENTS.md updates land in the final commit below._

## Files Created/Modified

- `src/messages/en/legal.json` - New `legal` namespace: `authority.notice`, `privacy.*` (eyebrow/h1/intro/buckets×3/providers×4/rights×4/labels), `terms.*` (h1/lastUpdated + 13 named sections)
- `src/messages/es/legal.json` - Key-identical Spanish mirror, tú register throughout
- `src/app/[locale]/privacy/page.tsx` - Now a `getTranslations('legal')` Server Component; `Bucket`/`ProviderRow`/`RightRow` render from `t.raw()` arrays; components and class names unchanged; authority notice inserted between H1 and intro
- `src/app/[locale]/terms/page.tsx` - Now a `getTranslations('legal')` Server Component; 13 sections render from `t.raw()` objects; authority notice inserted after the existing "Last updated" line, before the content sections
- `.planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-10.md` - 2 rows (both trigger 4, length budget)
- `src/messages/glossary-additions/07-10.md` - 0 rows; every product noun already resolves through `GLOSSARY.md`

## Decisions Made

- **Hosting regions kept verbatim English** (`"EU — Frankfurt"`, `"EU — edge"`, `"EU"`) rather than localizing "EU" → "UE". The plan's instruction — "Hosting regions stay factually identical... a translation must not introduce a new claim" — is satisfied more conservatively by not touching the string at all than by trusting a one-word substitution to be risk-free.
- **"Lifetime" kept English/capitalized** in the Terms payment section, matching the pricing-tier-name convention `07-09` already shipped (`la facturación de Lifetime`, `el nivel Pro`), rather than the app's generic-adjective glossary row (`Lifetime` → `De por vida`, used for a settings-page string, not a tier name). This avoids a cross-page inconsistency where the same commercial concept reads two different ways depending on which page a Spanish reader is on.
- **Authority notice placement on Terms**: inserted after the existing "Last updated — [date]" line rather than before it, since both lines are meta text (not the "first body paragraph" the plan's placement rule targets) and this order reads more naturally: title → date → governing-language note → content.
- **New-offender fixes were copy-only, never CSS**: both containment defects Task 2 surfaced (see below) were resolved by shortening Spanish strings, not by touching `ReadingLayout.tsx` or any Tailwind class — consistent with "do not delete or refactor anything outside your plan's declared files_modified" and with keeping the layout-change bar high per the working constraints.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] NEW containment offender: `privacy.h1` overflowed its own box in Spanish, zero English counterpart**
- **Found during:** Task 2 (containment sweep on `/es/privacy`)
- **Issue:** The literal translation of the H1 ("Tus datos, totalmente visibles.") overflowed `h1.display.text-5xl.sm:text-6xl` by 122px at 320px, 82px at 360px, 52px at 390px, and 12px at 430px — a brand-new Sweep A offender at a selector (`h1.display...`) that KU-3 (`p.text-`) does not cover and that the English H1 never triggers at any of the 7 launchable viewport projects.
- **Fix:** Shortened the Spanish H1 to "Tus datos, a la vista." — idiomatic, faithful to "fully visible," and fits at all four narrow widths with zero overflow.
- **Files modified:** `src/messages/es/legal.json`
- **Verification:** Re-ran `npx playwright test containment.spec.ts -g "/es/privacy"` — the `h1.display` offender is gone from the unsuppressed-offenders list at all 4 mobile widths.
- **Committed in:** `2448878` (Task 2 commit)

**2. [Rule 1 - Bug] NEW containment offender: `privacy.rights[].action` breadcrumb clipped off-screen in Spanish, zero English counterpart**
- **Found during:** Task 2 (containment sweep on `/es/privacy`, Sweep B — clip escape)
- **Issue:** `RightRow`'s action `span` is `flex-shrink-0` (deliberately kept at natural width so the adjacent `min-w-0` title/description column absorbs all the shrinking). The longer Spanish breadcrumbs ("Configuración — Privacidad — Descargar", "Configuración — Privacidad — Eliminar") pushed that span up to 43px past the right edge of the viewport at 320px, clipped by `ReadingLayout`'s `overflow-x-clip` ancestor. English's shorter equivalents ("Settings — Privacy — Download") never trigger this.
- **Fix:** Dropped the redundant "Configuración — " (Settings) prefix from all three `rights[].action` strings, uniformly, for consistency: `"Privacidad — Descargar"`, `"Privacidad — Eliminar"`, `"Privacidad"`. No CSS touched.
- **Files modified:** `src/messages/es/legal.json`
- **Verification:** Re-ran the containment sweep — the clip-escape offender is gone; only `touch-iphone` (environmental, WebKit launch failure) remains failing.
- **Committed in:** `2448878` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1, both new-offender copy fixes triggered by longer Spanish text; both logged as design-owner rewrite candidates in `TRANSLATION-FLAGS.07-10.md` per the wordplay-escalation rule's trigger 4, "length budget")
**Impact on plan:** Both fixes were required to satisfy the plan's explicit "A NEW offender ... fix it at source; it does not inherit KU status" instruction. No scope creep — no file outside `files_modified` was touched, no CSS/layout code changed.

## Issues Encountered

- **Known structural build failure between Task 1 and Task 2:** `npm run build` (and Playwright) were intentionally skipped for the Task 1 commit, per the working constraints — `es/legal.json` was still `{}` after Task 1, so `next-intl` throws `MISSING_MESSAGE` prerendering `/es/privacy` and `/es/terms`. Confirmed this exact failure occurred (`npm run build` exit 1, `MISSING_MESSAGE: legal.privacy.buckets (es)` etc.) before proceeding to Task 2, then re-ran the full build + Playwright suite once Spanish landed — both green (touch-iphone environmental failures aside).
- **`touch-iphone` (WebKit) cannot launch on this host** — confirmed environmental (missing system deps: `libicu74`, `libxml2`, `libflite1`), consistent with plans 07-06/07/08/09. Ran the other 7 viewport projects; recorded as blocked, not claimed as a pass.

## Verbatim-content check (Task 1)

Extracted every string literal, JSX text node, and array item from the pre-extraction `privacy/page.tsx` and `terms/page.tsx` (via `git show HEAD:...` on the pre-Task-1 commit) and diffed against `en/legal.json`'s flattened string set: **108/109 matched byte-for-byte**; the one non-match was a regex-extraction artifact at an HTML-entity boundary (`"("` from `El Portal (&ldquo;the Service&rdquo;)`), not real content. HTML entities (`&ldquo;`/`&rdquo;`/`&rarr;`/`&apos;`) were converted to their literal Unicode characters (`" " → ' '`) in the catalogue so the rendered output is identical to the entity-rendered original.

## Authority notice — exact wording

- **English:** "This document is provided in both English and Spanish. In the event of any discrepancy between the two versions, the English version governs."
- **Spanish:** "Este documento está disponible en inglés y en español. En caso de discrepancia entre ambas versiones, prevalece la versión en inglés."

Confirmed rendering on `/privacy`, `/terms`, `/es/privacy`, and `/es/terms` — same key (`authority.notice`), placed directly under the H1 on Privacy (before the intro paragraph) and directly after the "Last updated" line on Terms (before the content sections), styled `text-sm` + `text-[var(--color-ep-fg-muted)]` on both pages, no banner/chrome.

## KU-3 re-measurement (Task 2)

Measured `p.text-*` legal-copy paragraph overflow directly (matching `containment.spec.ts`'s Sweep A methodology) at 320/360/390/430px:

| Route | 320px | 360px | 390px | 430px |
|---|---|---|---|---|
| `/privacy` (EN baseline, unchanged) | 73px | 33px | 3px | 0px |
| `/es/privacy` | **15px** | 0px | 0px | 0px |
| `/terms` (EN) | 0px | 0px | 0px | 0px |
| `/es/terms` | 0px | 0px | 0px | 0px |

**Outcome: comparable to — actually better than — English.** The mirrored KU-3 suppression (already in place from 07-03) stands unchanged; no suppression was widened; nothing was logged to `deferred-items.md` because Spanish did not get worse. `/es/terms` shows zero overflow at all four widths, consistent with KU-3's scope always having been `/privacy` only, never `/terms`.

## TRANSLATION FLAGS: 2

Both rows are trigger 4 (length budget breaks display/layout constraints), both are the two new-offender copy fixes documented above under "Deviations from Plan" — see `.planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-10.md` for the full English/Spanish/what-was-lost detail.

## Next Phase Readiness

- `legal` namespace is fully enforced by Gate 2 (both catalogues non-empty, key-identical)
- D-08 human read-through (Spanish clause-by-clause verification, no usted, notice legibility, hosting-region claim accuracy) is queued for end-of-phase collection per `human_verify_mode: end-of-phase` — not performed by this executor
- No blockers for 07-16's aggregation of `TRANSLATION-FLAGS.07-10.md` (2 rows) and `glossary-additions/07-10.md` (0 rows)

---
*Phase: 07-spanish-localization*
*Completed: 2026-08-20*

## Self-Check: PASSED

All 7 declared files verified present on disk (`src/messages/en/legal.json`, `src/messages/es/legal.json`, `src/app/[locale]/privacy/page.tsx`, `src/app/[locale]/terms/page.tsx`, `TRANSLATION-FLAGS.07-10.md`, `glossary-additions/07-10.md`, this summary). All 3 task commit hashes (`914256d`, `2448878`, `42d5153`) verified present in `git log`.
