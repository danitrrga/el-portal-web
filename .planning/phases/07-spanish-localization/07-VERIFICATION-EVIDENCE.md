# Phase 07 Spanish Localization — Final Verification Evidence

Written by plan 07-16 (wave 6, the phase's final plan). This is the single
document that carries both the **machine-measured evidence** for each of the
phase's eight ROADMAP success criteria and the **human verification pack**
(D-05/D-08/D-11/D-12 read-throughs). Every number below was measured against
a production build (`next build && next start`) on this workstation on
2026-08-20/21, not assumed. Where a criterion can only be evidenced from CI
(the `touch-iphone` WebKit project), that is stated explicitly and the local
substitute measurement is given alongside it.

**Read this alongside `07-16-SUMMARY.md`**, which carries the task-by-task
commit history and deviation log this file does not repeat.

---

## 0. SWITCHER MOUNT COUNT — a correction to the plan text

The plan this evidence file answers to (`07-16-PLAN.md`) was written
assuming **three** switcher mounts (desktop actions row, mobile hamburger
panel, footer). That assumption was current as of 07-04's own
`07-04-SUMMARY.md`, but is **stale**: commit `044e0c4` ("fix(07-04): drop the
footer language switcher, keep the navbar one"), landed the same day as the
switcher itself, removed the footer mount deliberately — at desktop widths
the switcher sat directly on top of the giant grain-fill "El Portal"
wordmark in the footer's bottom bar and obscured it.

**Confirmed on the current tree:**
```
footer.querySelectorAll('[data-testid^="locale-switch-"]').length === 0
```
at every measured width (390px, 1440px). `Footer.tsx`'s own code comment
states this explicitly: *"the language switcher lives in the navbar only; a
second one here collided with the wordmark."*

**The switcher has TWO mounts, not three:** the desktop actions row
(`md:` and up, `hidden md:flex`) and the `#mobile-nav` hamburger panel
(below `md:`) — both rendering the same `LanguageSwitcher` component. Every
measurement and every checklist item below reflects this. Section 3 explains
why this plan could not literally fulfil its own "measure both footer
switcher links" instruction, and what was measured instead.

---

## 1. Static prerendering (I18N-06, criterion 6)

`npm run build` (Turbopack, production) succeeded. All 16 route paths are
present in `.next/prerender-manifest.json`.

**Correction to how the plan's own inline verify script reads the
manifest:** because `[locale]` is a Next.js dynamic route segment, the
manifest's route keys are always locale-prefixed by folder structure
(`/en`, `/en/pricing`, `/es/pricing`, …) — even though `localePrefix:
"as-needed"` means the PUBLIC English URL has no `/en` prefix at all (that
rewrite happens in `src/proxy.ts`, not in the manifest). A verify script
checking for a bare `/pricing` key (as the plan's literal inline
`<automated>` block does) will report every English route "NOT
PRERENDERED" — not because the page isn't static, but because it's asking
the wrong key. Verified directly:

```
node -e "... require('./.next/prerender-manifest.json').routes ..."
# returns: ["/_global-error","/_not-found","/en/changelog","/es/changelog",
#  "/en/features","/es/features","/en/manifesto","/es/manifesto","/en/mcp",
#  "/es/mcp","/en","/es","/en/pricing","/es/pricing","/en/privacy",
#  "/es/privacy","/en/terms","/es/terms","/icon.svg","/sitemap.xml"]
```

All 16 `/en/*` + `/es/*` pairs present. Missing-route check against the
correct key set: **0 missing**.

**Build-output markers** (the ● SSG symbol, not ○ static — 07-15's
`generateStaticParams` changes the symbol, not the property):

```
├ ● /[locale]              → /en, /es
├ ● /[locale]/changelog    → /en/changelog, /es/changelog
├ ● /[locale]/features     → /en/features, /es/features
├ ● /[locale]/manifesto    → /en/manifesto, /es/manifesto
├ ● /[locale]/mcp          → /en/mcp, /es/mcp
├ ● /[locale]/pricing      → /en/pricing, /es/pricing
├ ● /[locale]/privacy      → /en/privacy, /es/privacy
├ ● /[locale]/terms        → /en/terms, /es/terms
```
`●  (SSG)  prerendered as static HTML (uses generateStaticParams)` — the
symbol changed from Phase 5's plain `○` because 07-15 added
`generateStaticParams`; the property (fully static, no server render at
request time) did not change.

**Verdict: PASS.** All 16 routes prerender as static. No route silently
dropped to dynamic.

---

## 2. Routing (I18N-02, I18N-04, criteria 1 and 3)

`npm run verify:routing` against the production build:

```
verify-locale-routing: all assertions passed
```

Covers, per the script's own groups: all 8 English URLs return 200 with no
`location` header under both English and Spanish `Accept-Language`; `/`
redirects to `/es` (307) for `es-ES`, `es-419` and `es-AR` browsers; `/`
serves English with no `Accept-Language` header at all (the Googlebot case);
an explicit `NEXT_LOCALE=en` cookie outranks a Spanish `Accept-Language`
header at `/`; the redirect preserves query strings (campaign attribution)
and closes a path-escape attempt to exactly `/es` (T-07-01-03); all 8
Spanish `/es/*` paths return 200.

**Verdict: PASS.** Every English URL is unchanged and un-redirected; `/` is
the only URL that negotiates.

---

## 3. Switcher touch targets (I18N-03, criteria 2 and 7)

Measured directly against the production build with a standalone Playwright
script (not relying on a green `audit:targets`, since the project that would
have caught a regression — `touch-iphone` — cannot launch locally).

### Desktop actions row (≥768px, mouse — informational, not AAA-gated)

At 1440×900 on `/es`:
```
locale-switch-en: 44w × 24h
locale-switch-es: 44w × 24h
```
Only ONE instance in the DOM at this width (the mobile panel doesn't exist
until the hamburger is opened). AAA target size does not apply above 768px
(RESP-08: the frozen desktop design), matching `touch-targets.spec.ts:49`'s
own `test.skip(width >= 768, ...)`.

### Mobile hamburger panel (390px, panel OPENED first)

Measured on **both** `/es` and `/es/pricing`, panel opened via the hamburger
button before reading `getBoundingClientRect()` — a sweep that never opens
the menu would report a false clean pass on a control it never saw:

| Route | Link | width | height |
|---|---|---|---|
| `/es` | EN | 44 | 44 |
| `/es` | ES | 44 | 44 |
| `/es/pricing` | EN | 44 | 44 |
| `/es/pricing` | ES | 44 | 44 |

All four numbers ≥ 44. **Cross-checked against 07-04's own recorded
number** ("Mobile panel switcher, 390px, /pricing (opened panel): EN 44×44,
ES 44×44") — identical, no drift.

### Footer switcher — NOT MEASURED, because it does not exist

The plan instructed measuring "both footer switcher links... on `/es` and
`/es/pricing`... all eight `getBoundingClientRect()` numbers." This cannot
be done: the footer switcher mount was removed by commit `044e0c4` before
this plan ran (see Section 0). `footerSwitcherCount390 === 0`, confirmed
directly. 07-04's own recorded footer numbers ("Footer switcher, 390px, /
(en context): EN 44×44, ES 44×44" etc.) describe a mount that no longer
exists — they are historical record of a state later superseded by a
deliberate, documented human decision, not a regression this plan needs to
chase.

### `touch-iphone` (CI-only)

Cannot launch on this workstation (missing `libicu74`/`libxml2`/`libflite1`
system ABI, no sudo — recorded since Phase 5). **Not locally measured; CI
(`ubuntu-latest`, `.github/workflows/responsive-audit.yml`'s `responsive`
job) is the evidence path for this project specifically.** The switcher's
numeric touch-target measurement above (on a launchable Chromium project,
matching `hasTouch`/`isMobile` via `devices["Pixel 5"]` in the new
`i18n-chrome` project) is what closes the gap between "the matrix is green"
and "the one control the review named was actually measured" without
depending on that CI run.

**Verdict: PASS on every measured mount** (desktop row, mobile panel — both
routes, both locale links). Footer mount does not exist to fail or pass.
`touch-iphone` evidenced via CI citation, not a local skip disguised as a
pass.

---

## 4. Full Playwright matrix (criterion 7)

Two full runs were made: an initial run before `e2e/i18n-chrome.spec.ts` /
the `i18n-chrome` project existed (656 tests), and a final run after all
Task 1–4 changes landed (663 tests, +7 for the new project). Both used the
documented `--output=<scratch> --reporter=line` workaround —
`test-results/`/`playwright-report/` are still root-owned on this
workstation (confirmed: `ls -la` shows `root:root`, unchanged since
07-01/07-03's own deferred-items.md entries; a bare `npx playwright test`
run with no `--output` override reproduces the identical `EACCES` and exits
1 even though every test itself passes) — this is not a new limitation, it
carries forward unresolved from Phase 5/07-01.

### Final run (663 tests, all changes present)

| Project | Result |
|---|---|
| `reflow-320` (320px, Chromium) | 80/80 layout-spec tests passed |
| `mobile-360` | 80/80 passed (see flaky-run note below) |
| `mobile-390` | 80/80 passed |
| `mobile-430` | 80/80 passed |
| `tablet-768` | 80 total, 16 touch-targets self-skipped (≥768px), rest passed |
| `laptop-1024` | 80 total, 16 touch-targets self-skipped, rest passed |
| `desktop-1440` | 80 total, 16 touch-targets self-skipped, rest passed |
| `reduced-motion` | 16/16 passed |
| `i18n-chrome` (NEW, Pixel 5 @ 390px) | 7/7 passed |
| `touch-iphone` (WebKit) | 0/87 — **cannot launch**, environment-only |

Per-spec breakdown across the 7 launchable Chromium layout projects (16
routes × 7 projects each):
- `a11y.spec.ts`: 224/224 (axe + contrast-needs-review, both test types)
- `containment.spec.ts`: 112/112
- `overflow.spec.ts`: 112/112
- `touch-targets.spec.ts`: 64/64 run + 48 self-skipped (≥768px, by design)
- `motion.spec.ts` (`reduced-motion` project only): 16/16
- `i18n-chrome.spec.ts` (`i18n-chrome` project only): 7/7

**Zero non-`touch-iphone` failures, on the clean run being reported here.**
`touch-iphone`'s 80 (then 87) failures are 100% launch failures (`Host
system is missing dependencies to run browsers`), the same error Phase 5
first logged and every subsequent Phase 7 plan re-confirmed — not a single
one is a test assertion failure. `touch-iphone` is evidenced via the CI run
this workflow produces on every push/PR (`ubuntu-latest`, `--with-deps`
installs the WebKit system libraries Arch cannot); **cite that CI run, not
a local result, for this project specifically.**

**Flaky-run transparency note (raised as a known risk in this plan's own
briefing):** the second full-matrix run (663 tests) initially reported **6**
additional non-`touch-iphone` failures — all `[mobile-360] › a11y.spec.ts ›
axe:` on 6 of the 8 Spanish routes (`/es/features`, `/es/manifesto`,
`/es/changelog`, `/es/mcp`, `/es/pricing`, `/es/privacy`) — under the same
heavy parallel-worker load this repo's own tooling documentation warns is
prone to spurious `color-contrast`/`target-size` axe flakes. Per that
documented guidance, the exact failing set (`a11y.spec.ts --project=mobile-360`,
32 tests) was re-run in isolation immediately after: **32/32 passed**,
including every route that failed under load. **The table above and the
"zero non-touch-iphone failures" verdict report this clean re-run**, not the
flaky one — consistent with the documented policy of re-running before
concluding a defect exists. No code change was made in response to the
flaky run; nothing here needed fixing.

**Verdict: PASS on all 8 launchable projects, matrix-wide. `touch-iphone`
is a recorded environment gap with CI as the evidence path, not a silent
skip.**

---

## 5. The cross-locale hint (07-04 Task 3)

All three required assertions, run against the production build, using
`data-testid="locale-hint"`:

**No cookie, `/` and `/pricing`:** hint absent from the DOM on both routes.
This is the assertion that matters most — a hint shown to a first-time
visitor is exactly the silent browser-override this phase exists to avoid.

**`NEXT_LOCALE=es`, `/pricing`:** hint present; the page response itself is
`200` with no `location` header (no intermediate redirect); clicking the
hint's action link lands on `/es/pricing` (confirmed via `page.waitForURL`
after fixing a race in the first draft of the measurement script that made
a bare `waitForLoadState` resolve before the click's navigation began).

**Hydration, all 8 English routes, both cookie states (16 checks total):**
zero console errors, zero hydration-warning text, in every case. Sampled
per-route hint visibility:

| Route | Hint (no cookie) | Hint (`es` cookie) |
|---|---|---|
| `/` | absent | absent (negotiates away before English ever paints — matches 07-04's "structurally untestable" finding) |
| `/features` | absent | present |
| `/manifesto` | absent | present |
| `/changelog` | absent | present |
| `/mcp` | absent | present |
| `/pricing` | absent | present |
| `/privacy` | absent | present |
| `/terms` | absent | present |

**Hint vs. Navbar placement:** `boundingBox()` for `[data-testid="locale-hint"]`
(`x:16, y:618, w:384, h:86` at 1440×900) vs. `nav` (`x:128, y:16, w:1024,
h:66`) — no intersection (fixed bottom-anchored hint, fixed top-anchored
nav). Also asserted structurally, permanently, in `e2e/i18n-chrome.spec.ts`
test 6.

**Verdict: PASS**, all three assertions plus the hydration sweep.

---

## 6. Phase 5 non-regression

`npm run audit:overflow`, `npm run audit:containment`, `npm run
audit:targets` and `npm run audit:a11y` are each a `playwright test
<spec>.ts` invocation covered by the full-matrix runs in Section 4 (same
specs, same projects). Restated per-spec: overflow 112/112, containment
112/112, touch-targets 64/64 (+48 self-skip), a11y 224/224 — all on the 7
launchable Chromium projects, zero failures. `a11y.spec.ts`'s `axe:` test
runs with `target-size` explicitly enabled (`.options({ rules: {
"target-size": { enabled: true } } })`) — **zero axe violations, with
`target-size` enabled, confirmed** across all 16 routes × 7 projects (112
tests).

Note: running the bare npm scripts (`npm run audit:containment` etc.,
without the `--output=<scratch>` override) exits 1 due to the pre-existing
`test-results`/`playwright-report` `EACCES` issue described in Section 4 —
every test still passes; only the default report-path write fails. This is
not a regression this plan introduced; it is the same environment gap
07-01/07-03 logged and is unrelated to the actual audit result.

**Verdict: PASS.** Phase 5's 8/8 criteria hold on both locale trees; no
Spanish string broke a touch target or introduced an axe violation.

---

## 7. SEO signals (I18N-05, criteria 4 and 5)

Sampled all 16 routes (8 English + 8 Spanish, not just one pair) against the
production build:

| Route | Title | og:locale | hreflang set | html lang |
|---|---|---|---|---|
| `/` | El Portal — The Personal Operating System | en_US | en, es, x-default | en |
| `/es` | El Portal — El Sistema Operativo Personal | es_ES | en, es, x-default | es |
| `/features` | How It Works — El Portal | en_US | en, es, x-default | en |
| `/es/features` | Cómo Funciona — El Portal | es_ES | en, es, x-default | es |
| `/manifesto` | The Manifesto — El Portal | en_US | en, es, x-default | en |
| `/es/manifesto` | El Manifiesto — El Portal | es_ES | en, es, x-default | es |
| `/changelog` | Changelog — El Portal | en_US | en, es, x-default | en |
| `/es/changelog` | Historial de Cambios — El Portal | es_ES | en, es, x-default | es |
| `/mcp` | MCP Server — El Portal | en_US | en, es, x-default | en |
| `/es/mcp` | Servidor MCP — El Portal | es_ES | en, es, x-default | es |
| `/pricing` | Pricing — El Portal | en_US | en, es, x-default | en |
| `/es/pricing` | Precios — El Portal | es_ES | en, es, x-default | es |
| `/privacy` | Privacy Policy — El Portal | en_US | en, es, x-default | en |
| `/es/privacy` | Política de Privacidad — El Portal | es_ES | en, es, x-default | es |
| `/terms` | Terms of Service — El Portal | en_US | en, es, x-default | en |
| `/es/terms` | Términos de Servicio — El Portal | es_ES | en, es, x-default | es |

Every route carries all three hreflang alternates (`en`, `es`,
`x-default`). Confirmed `/`'s `x-default` `href` is
`https://el-portal.app` (the English root), **not** `/es` — the plan's
explicit worry.

`description` and `canonical` sampled on `/` and `/pricing` pairs
(both per-locale, distinct, and pointing at the correct absolute URL —
`getSiteOrigin()`'s confirmed origin below).

**Sitemap:** `GET /sitemap.xml` → `200`, **16 `<loc>` entries** (matches the
16 prerendered routes exactly).

**Site origin:** `https://el-portal.app` (`NEXT_PUBLIC_SITE_URL`, the
repository variable the user created on GitHub and 07-15 wired at workflow
level — confirmed present in `.env.local` locally, `env:` block in
`.github/workflows/responsive-audit.yml` preserved unedited by this plan).

**Verdict: PASS.**

---

## 8. Residual hardcoded strings (I18N-01, criterion 8)

`npm run audit:strings` → `RESIDUAL_STRINGS_CLEAN`, exit 0.

`scripts/audit-residual-strings.mjs` is a standalone Node script (no test
framework) walking every `.ts`/`.tsx` file under `src/` for five categories:
JSX text nodes, `aria-label`/`alt`/`title`/`placeholder` literals (including
template literals), destructured-prop default values, string literals
inside top-level `const` object/array literals (module-level data) and any
`src/data/**` file, and error/status strings (`throw new Error(...)`,
`setError`/`setStatus`/`setMessage`).

**Proven able to fail, not just able to pass clean:** a scratch file
carrying one literal per category was temporarily added under
`src/components/`, the script correctly reported all 5 (`default-param`,
`jsx-text`, `a11y-attr`, `module-data`, `error-status`), the file was
deleted, and the script returned to `RESIDUAL_STRINGS_CLEAN`. (This also
caught and fixed two real bugs in the script's own regex during
development — a missing `\s*` before `=` in the top-level `const` detector
that made it never match an untyped declaration, and camelCase catalogue
keys like `headingKey: "productHeading"` being mistaken for prose — both
fixed before this evidence was recorded.)

**Confirmed gone / never present**, matching the plan's named offender
list: `aria-label="Primary"`, `aria-label="El Portal home"`,
`aria-label="Portal icon"`, `label = "Copy"` default + its `"Copied"`
counterpart, `aria-label="On this page"`, the `${label} — code sample`
concatenation, and the `HERO_IMAGE.alt` literal — none survive in `src/`;
none is allowlisted (they were already fixed at source by 07-04/07-06/07-08
before this plan ran; this plan only re-confirmed their absence).

### Final allowlist (`scripts/residual-strings-allowlist.mjs`), every entry with its reason

| File | Match | Reason |
|---|---|---|
| `src/components/DashboardPreview.tsx` | (whole file) | Dead code, zero imports — excluded because nothing renders it, **not** because its strings were handled |
| `src/components/LanguageSwitcher.tsx` | `EN` | ISO language code, identical in both locales by design (D-10) |
| `src/components/LanguageSwitcher.tsx` | `ES` | ISO language code, identical in both locales by design (D-10) |
| `src/app/[locale]/mcp/page.tsx` | `portal_` | MCP tool identifier — API name, not prose |
| `src/app/[locale]/mcp/page.tsx` | `params` | Type-signature string in a code sample — code, not prose |
| `src/app/[locale]/mcp/page.tsx` | `returns:` | Tool interface's response-shape description; deliberately kept in English in both locales per the file's own top-of-data-block comment, same reasoning as `params` |
| `src/app/[locale]/mcp/page.tsx` | `Claude` | Provider proper noun — never translated |
| `src/app/[locale]/mcp/page.tsx` | `Cursor` | Provider proper noun — never translated |
| `src/app/[locale]/mcp/page.tsx` | `MCP` | Protocol/provider proper noun — never translated |
| `src/lib/seo.ts` | `E_MISSING_SITE_ORIGIN` | Build-time developer error, never rendered to a site visitor |
| `src/components/animations/PerformanceMetric.tsx` | (whole file) | Dead code, zero imports — same reasoning as `DashboardPreview.tsx`. **Found by this plan's sweep**, not previously known |
| `src/components/MethodologyCard.tsx` | (whole file) | Dead code, zero imports — same reasoning. **Found by this plan's sweep** |
| `src/components/remotion/AsymptoticCurve.tsx` | (whole file) | Dead code, zero imports, no `remotion.config.ts`/Root entry references it either. **Found by this plan's sweep** |
| `src/components/remotion/CyclicalRings.tsx` | (whole file) | Dead code, zero imports, same as above. **Found by this plan's sweep** |
| `src/components/ElPortalWordmark.tsx` | `EL` | Wordmark lockup letters (brand name), never translated |
| `src/components/ElPortalWordmark.tsx` | `RTAL` | Wordmark lockup letters (brand name), never translated |
| `src/components/Footer.tsx` | `El Portal` | Decorative `aria-hidden` ghost/fill brand wordmark, never translated |
| `src/app/[locale]/privacy/page.tsx` | `dtarraga.emp@gmail.com` | Contact email address — identical in both locales, not translatable prose |
| `src/app/[locale]/terms/page.tsx` | `dtarraga.emp@gmail.com` | Same as above |

19 entries, every one carrying a non-empty `reason`. Four are dead-code
findings this plan's own sweep surfaced beyond the plan's original,
narrower "just `DashboardPreview.tsx`" expectation — logged in
`.planning/phases/05-mobile-responsive-retrofit/deferred-items.md`'s new
"From 07-16" section as housekeeping for a later phase, not fixed here
(deleting or wiring up dead code is outside this plan's declared
`files_modified`).

**Wired into CI:** `.github/workflows/responsive-audit.yml`'s `quality` job
runs `npm run audit:strings` immediately after `npm run i18n:gates` — no
other line in that workflow changed (confirmed by diff: the `NEXT_PUBLIC_SITE_URL`
env block, browser caching, `--with-deps` install and concurrency block are
all byte-identical to before this plan).

**Verdict: PASS.**

---

## 9. `i18n:gates:strict` (namespace completeness)

`npm run i18n:gates:strict` → **exit 0**, `0 failure(s), 17 warning(s)
(--strict)`.

Precision on "zero warnings" (the plan's own phrasing conflates two
different things GATE 1 and the `--strict` upgrade check separately): **the
namespace-completeness class of warning — "not yet translated" — is at
zero**, confirmed directly (`grep -c "not yet translated"` → `0`). This is
what proves no `es` namespace was left at `{}`. GATE 2's key-identity check
(bidirectional) also reports **0 failures**, which is what proves no
orphaned `es` key survived an `en` deletion.

The 17 warnings that remain are all **GATE 1's advisory-only `su`/`sus`
possessive check**, which is explicitly documented in `i18n-gates.mjs`'s
own source as *"Never fails"* (a legitimate third-person possessive —
"Cada Versión tiene **su** propio título" — reads identically to the banned
formal-`su` construction, so the check is advisory, not a hard rule) — they
are unrelated to translation completeness. Namespaces carrying at least one
such warning: `src/messages/es/changelog.json`, `features.json`,
`legal.json`, `pricing.json`. Zero namespaces reported zero.

**Confirmed directly:** every `src/messages/es/*.json` and
`src/messages/en/*.json` pair has an equal top-level key count (10
namespaces, none empty). No namespace is `{}`.

**Verdict: PASS.** Every namespace is translated; no orphaned key; the only
remaining strict-mode output is the by-design-never-failing register
advisory.

---

## 10. `KNOWN_UNFIXED` reconciliation (`e2e/containment.spec.ts`)

Every ref traces to a written finding in
`.planning/phases/05-mobile-responsive-retrofit/deferred-items.md` (verified
mechanically: `grep`-derived ref list against that file, 0 orphans). All
four are **Phase 5 defects** (from `05-06`'s containment sweep) — phase 07
introduced no suppression of its own.

| Ref | Route | Classification | EN numbers (320/360/390/430) | ES numbers (320/360/390/430) |
|---|---|---|---|---|
| KU-1 | `/features` "Connectedness"/"Conexión" label (Sweep A) | **Still reproduces on EN; now UNUSED on ES** | 7px overflow, width-independent (all 7 viewports) | **0px** — 07-13 translated to "Conexión" (8 vs 14 chars); entry kept (never removed on only one side), recorded as currently unmatched on `/es/features` |
| KU-2 | `/mcp` prose paragraphs (Sweep A) | Still reproduces on both, ES better | 66 / 26 / 0 / 0 | 44 / 4 / 0 / 0 |
| KU-3 | `/privacy` legal paragraphs (Sweep A) | Still reproduces on both (320px only for ES), ES better | 73 / 33 / 3 / 0 | 15 / 0 / 0 / 0 |
| KU-4 | `/pricing` comparison table (Sweep B) | Still reproduces on both, ES better | 77 / 37 / 7 / 0 | 62 / 22 / 0 / 0 |

KU-4 was re-measured by this plan directly (the `comparisonFeatures` row set
changed from 19 → 12 rows after 07-09 shipped its own measurement) — the
re-measured numbers are **identical** to 07-09's original 62/22/0/0, so the
row-count change did not alter this table's overflow behaviour.

`e2e/containment.spec.ts`'s `KNOWN_UNFIXED_ES` generation logic was updated
from a single generic "English copy still renders on /es/* until Waves 3-4
translate it" suffix (now false, since translation has landed) to per-ref
override reason strings carrying the numbers above. `npm run audit:containment`
equivalent (`playwright test containment.spec.ts` on the 7 launchable
Chromium projects): **112/112 passed**, confirming the reconciled reason
strings did not break the suppression matching logic.

**Verdict: PASS.** No suppression covers a defect this phase introduced;
every ref is current, not stale.

---

## 11. Aggregated `TRANSLATION-FLAGS.md`

All **nine** required per-plan register files exist (07-04, 07-05, 07-06,
07-07, 07-08, 07-09, 07-10, 07-13, 07-14). All nine summaries carry a
`TRANSLATION FLAGS: n` line (07-04 and 07-08 were missing theirs — an
unanswered question, not a zero — and were answered by this plan against
each file's own already-written row count, per the plan's own instruction:
*"A plan reporting nothing is an unanswered question and this task must go
back and answer it against that plan's Spanish namespace"*).

| Plan | Rows (own file) | Claimed in summary | Match |
|---|---|---|---|
| 07-04 | 1 | 1 (added by 07-16) | ✓ |
| 07-05 | 6 | 6 | ✓ |
| 07-06 | 4 | 4 | ✓ |
| 07-07 | 9 | 9 | ✓ |
| 07-08 | 0 | 0 (added by 07-16) | ✓ |
| 07-09 | 7 | 7 | ✓ |
| 07-10 | 2 | 2 | ✓ |
| 07-13 | 3 | 3 | ✓ |
| 07-14 | 1 | 1 | ✓ |
| **Total** | **33** | | |

All 33 rows appear once, verbatim (no rewording), in `TRANSLATION-FLAGS.md`'s
`## Aggregated rows` table, in plan order. The `## Example (never counted,
never deleted)` section is present, unmodified, and excluded from the
reconciled total (verified: the aggregated-row count excludes it).

**Verdict: PASS.** Aggregated total: **33 rows**, reconciled against all
nine plan summaries.

---

## 12. Merged `GLOSSARY.md` marketing-only section

Every `src/messages/glossary-additions/07-NN.md` file (all nine) was read.
Five contributed zero rows (07-05, 07-07, 07-08, 07-10 — each documents in
its own file why: every product noun the page needed already resolved
through the derived glossary section). The remaining rows:

| Plan | Rows contributed |
|---|---|
| 07-04 | 9 |
| 07-06 | 1 |
| 07-09 | 4 (2 original + 2 post-plan design-owner edits, dated 2026-08-20) |
| 07-13 | 6 |
| 07-14 | 1 |
| **Total merged** | **21** |

All 21 rows were merged, in plan order, verbatim, into `GLOSSARY.md`'s
`## Marketing-only (decided here)` section (which also retains its original
2 seed rows from plan 07-02, now carrying a `Plan` column value of `07-02`
for provenance — the table gained a 4th column, `Plan`, to carry this
attribution cleanly rather than dropping it).

**No coinage conflicts found.** Checked programmatically: all 21 English
terms across all nine files are unique (no two plans coined different
Spanish for the same English term).

**Verdict: PASS.** 21 terms merged, 23 total rows in the section including
the 2 pre-existing seeds.

---

## 13. Locale round trip — URL AND cookie

Measured directly (and permanently protected by `e2e/i18n-chrome.spec.ts`
tests 5a/5b):

| Direction | URL after click | `NEXT_LOCALE` cookie after click | After reload |
|---|---|---|---|
| `/es` → EN | `/` | `en` | still `/` (no bounce back to `/es`) |
| `/` → ES | `/es` | `es` | (not re-tested; 5a's reload is the one that catches the historical loop defect) |

The `/es → EN` reload check is the one that matters: asserting only the URL
right after the click is what let the original English-unreachable defect
through three earlier checker passes and a first review round — the
immediate client-side navigation looks correct even when the cookie write
is broken, and the loop only appears on the **next** request to `/`.

**Verdict: PASS.** Both directions produce the correct URL and the correct
cookie value; the reload confirms no bounce-back.

---

## 14. Recorded decisions carried into sign-off

- **07-05's `ACCENTED DISPLAY TYPE` verdict is Outcome A ("no change
  needed"), not Outcome C.** The plan text conditionally asked this file to
  carry forward "outcome C's copy rule, if that outcome applied" — it did
  not apply. The actual recorded decision: 13/13 probed accented uppercase
  characters render in the real Special Gothic Expanded One face with no
  fallback substitution, and a comparative control proved the small
  `scrollHeight`-vs-`clientHeight` overshoot (3px/6px) is identical for
  accented and unaccented ALL-CAPS text — i.e. a pre-existing
  `line-height: 1.02` property already shipped for English, not something
  Spanish accents make worse. No subsets edit, no per-instance padding, no
  copy rule was needed. (Author: plan 07-05, verified 2026-08-19.)
- **07-04's `nav.changelog` ("Cambios") vs. `footer.changelog`
  ("Changelog") inconsistency** — a deliberate, logged TRANSLATION-FLAGS row
  (trigger 4, length budget), not an oversight: the nav instance is
  width-constrained by the switcher's fixed 44px targets at 768px, the
  footer instance is not. Recorded in `TRANSLATION-FLAGS.07-04.md`, now part
  of the aggregated register (Section 11) for the design owner to read and
  decide whether to reconcile.
- **`/es/pricing` has no PATH B / partial-translation scope decision.**
  Confirmed: `src/messages/es/pricing.json` contains full Spanish prose
  throughout (spot-checked against the English catalogue — no duplicated
  English values). The plan's own text anticipated this needing a check;
  the check found nothing to flag.
- **The footer switcher removal (Section 0)** is itself a recorded decision
  (commit `044e0c4`) carried into this evidence rather than treated as a
  defect to chase — see Section 0 and the new "From 07-16" section of
  `deferred-items.md`.
- **Five dead-code components** (`DashboardPreview.tsx`,
  `PerformanceMetric.tsx`, `MethodologyCard.tsx`, `AsymptoticCurve.tsx`,
  `CyclicalRings.tsx`) are logged as a housekeeping item for a later phase
  in `deferred-items.md`'s new "From 07-16" section, not deleted here (out
  of this plan's declared `files_modified`).

---

## 15. Threat surface scan

No new network endpoint, auth path, file-access pattern, or trust-boundary
schema change was introduced by this plan's files. `scripts/audit-residual-strings.mjs`
and `scripts/residual-strings-allowlist.mjs` are build/CI-time static
analysis only (no runtime surface); `e2e/i18n-chrome.spec.ts` is test-only
code, never shipped. No `## Threat Flags` entries.

---

## 16. Human verification pack

Everything below is a **sitting-down-and-reading exercise**, backed by the
measured evidence above — not a research exercise. Start a production build
on the documented port and visit the listed URLs directly:

```
npm run build && npm run start -- --port 3987
```
Then visit `http://localhost:3987/<route>` for any route below.

### Check 1 — `/es/manifesto` register re-read (D-05, D-06)

Visit `http://localhost:3987/es/manifesto`. The hook line, at the top of
the hero, must read verbatim:

> **Un método para llegar a ser quien eres.**

Read the seven principle cards below it. Confirm: no written subject
pronoun anywhere ("tú" never appears as a standalone word — verbs carry the
subject, e.g. "Aportas la voluntad," not "Tú aportas la voluntad"), no
`usted`/`su` formal register, `tú`-register verb forms throughout where the
reader is addressed directly.

This is the confirmation read, not the original decision — plan 07-05 took
a blocking decision checkpoint on this register before Wave 3 propagated it
everywhere else; this is whether it still reads correctly now that the rest
of the site was written against it.

### Check 2 — `/es/privacy` and `/es/terms` read-through (D-08)

Visit both `http://localhost:3987/es/privacy` and
`http://localhost:3987/es/terms`, and their English twins for comparison.
Reproduce plan 07-10's four-point check:

1. **Clause parity** — every clause present in English is present in
   Spanish (no silent omission or addition).
2. **No `usted` or formal `su`** — the tú register throughout.
3. **Governing-language notice** reads unambiguously and appears on **both**
   pages, **both** locales (confirmed programmatically present at all four
   URLs — this check is whether the wording is clear to a human reader, not
   whether it exists).
4. **No data-handling claim differs in meaning** between the two locales —
   read each clause pair side by side.

### Check 3 — Language switcher at 390px, coarse pointer (I18N-03, D-11, D-12)

**This is the check the cross-AI review named as the single defect most
likely to survive to the end of the phase — treat it as the most important
item in this pack, not a formality.**

On a real phone, or with Chrome DevTools' device toolbar set to a touch
device at 390px width: open `http://localhost:3987/es` and tap the desktop
switcher... — there is no desktop switcher at this width. Open the hamburger
menu (top-right icon) and tap the `EN` link inside the panel, without
zooming. **It must be comfortably tappable, not a pixel-hunt.** Section 3
above recorded the measured rect (44×44 at every checked instance); this
check is whether the number matches the felt experience.

Confirm the **TWO** mounts (not three — see Section 0's correction):
- The switcher is visible in the desktop actions row from `md:` (768px) up.
- The **same** switcher is present inside the mobile hamburger panel below
  `md:`, and the panel closes automatically on the destination page after
  tapping a locale link (do not have to tap the hamburger again to see the
  new page).

There is **no** footer switcher — do not go looking for a third mount at
the bottom of the page; its absence is intentional (Section 0).

Then: switching locale on a deep route (e.g. `/es/pricing`) preserves the
route in both directions (`EN` from `/es/pricing` lands on `/pricing`, not
`/`). Choosing `EN` from `/es` lands on `/` and **stays there** after a
manual browser reload — it must not bounce back to `/es`. The choice
survives a reload and outranks a Spanish browser `Accept-Language` header.

### Check 4 — Spanish rendering on a real phone

Phase 5 closed with a physical-iPhone check; an emulator can flatter
accented uppercase display type and 15-25% longer Spanish strings in ways a
real device does not. On an actual phone, load `/es` and `/es/pricing` and
look specifically at:

1. **The hero H1** ("El sistema operativo definitivo para el alto
   rendimiento.") — no clipped accent, no overflow.
2. **A `.display` heading carrying an accented capital** (e.g. the
   manifesto hook, or any Special Gothic Expanded One heading with an
   accented vowel) — confirm plan 07-05's Outcome A glyph verdict holds
   visually, not just in the automated `document.fonts.check` measurement.
3. **The pricing plan badge** ("Lifetime" / the tier card header) — no
   spilling out of its card at 320-390px.

### Check 5 — The cross-locale hint, no-cookie case first

In a clean browser profile with no cookies, open `http://localhost:3987/pricing`
directly: **no hint may appear.** This is the case that matters most — a
hint shown to a first-time visitor is the exact silent browser-override this
phase was built to avoid, and it is invisible to anyone who already has the
cookie set (which is why it must be checked in a genuinely clean profile,
not just "no hint visible right now").

Then choose ES from the switcher, and open `/pricing` directly again (not
by clicking a nav link — type the URL or reload): the Spanish hint appears
and reaches `/es/pricing` in one tap, no intermediate redirect. Dismiss it,
reload: still gone (the dismissal persists).

### Check 6 — Read `TRANSLATION-FLAGS.md` end to end

`.planning/phases/07-spanish-localization/TRANSLATION-FLAGS.md`'s
`## Aggregated rows` table now carries 33 real rows (Section 11). **An
empty register at this point in the phase would have been a signal the
escalation rule was never applied — not a clean result.** For each row,
decide: keep the shipped Spanish as-is, or re-write the line yourself. This
is the only check in this pack that produces work rather than a verdict.

### Check 7 — Recorded decisions

Read Section 14 above (Recorded decisions carried into sign-off) and
confirm each one is a decision you are willing to ship, not a gap you are
discovering here for the first time.

---

*Evidence compiled by plan 07-16, 2026-08-20/21. Machine measurements and
the human checklist above live in this one document by design — see
`07-16-SUMMARY.md` for the commit-by-commit record of how this evidence was
produced.*
