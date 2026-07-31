---
phase: 05-mobile-responsive-retrofit
verified: 2026-07-31T12:00:00Z
status: human_needed
score: 8/8 roadmap success criteria satisfied at the code/harness level (2 with a documented, still-open policy deviation); all 3 goal-level gaps from the prior verification independently confirmed closed; 5 pre-existing human-decision items remain open and unaffected by the gap-closure work
overrides_applied: 0
re_verification: true
re_verification_detail:
  previous_status: gaps_found
  previous_score: "6/8 roadmap success criteria cleanly verified; 2/8 flagged for design-owner decision; 3 goal-level gaps found by human inspection that no success criterion covered"
  gaps_closed:
    - "GAP-01 — Hero H1 42px floor / box overflow on `/` and `/features` (closed by 05-07 Task 1)"
    - "GAP-02 — Dashboard preview 36% off-screen bleed on `/` (closed by 05-07 Task 2)"
    - "GAP-03 — Harness blind to container-relative overflow behind a clipping ancestor (closed by 05-06, proven RED against unfixed `src/`, turned GREEN by 05-07)"
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Decide whether the RESP-08 'desktop unchanged' contract accepts the 28 un-gated colour-declaration changes made for WCAG AA contrast remediation (text-zinc-500→400 ×16, text-zinc-600→400 ×7, FG_SUBTLE #5a6478→var(--color-ep-fg-muted-2) ×5), all of which render differently at 1440px and are NOT behind any `md:`/`lg:` gate."
    expected: "Either (a) accept the deviation and add a formal override to this file's frontmatter citing 05-05-SUMMARY.md's 'RESP-08 colour exception' section as justification, or (b) direct that the colours be reverted and the resulting axe color-contrast violations be re-opened as a separate, explicitly-scoped follow-up phase."
    why_human: "Genuine, honestly-documented trade-off between two roadmap success criteria in direct tension (SC4 zero-axe-violations vs SC7 byte-for-byte-desktop-freeze). Carried forward unchanged — gap-closure plans 05-06/05-07 deliberately fenced this out of scope (confirmed: neither plan's diff touches Footer.tsx or any zinc-*/FG_SUBTLE declaration)."
  - test: "Decide whether the RESP-05 svh→dvh unit substitution is acceptable, and if so, update RESPONSIVE.md's locked Viewport Units table and REQUIREMENTS.md's RESP-05 wording to match (both still say svh)."
    expected: "Either (a) accept dvh and correct the two contract documents, verifying dvh's known re-resolve-during-scroll cost does not produce visible jank on a real iOS device, or (b) revert to svh with a corrected justifying comment."
    why_human: "RESPONSIVE.md's own locked design contract frames dvh as needing a specific tested reason and svh as the default. Carried forward unchanged — confirmed `src/app/globals.css` still uses `dvh` (grep at lines 213, 231-234, 380-385) and REQUIREMENTS.md RESP-05 still reads 'svh' verbatim."
  - test: "Perform the literal 1440px before/after visual comparison across all 8 routes, and a real-iPhone check of `/` and `/changelog` for dark browser-chrome + address-bar-clip behaviour, as ROADMAP.md SC7 and the 05-05-PLAN.md human-check both require."
    expected: "Visual parity confirmed at 1440px for layout/spacing/sizing (colour deltas are the known, separately-decided exception above); dark theme-color chrome and unclipped hero bottom confirmed on a physical iPhone."
    why_human: "Never performed by an actual human in any plan or verification pass, including this one — this verifier again has no real iPhone or human eyes. The mechanical `git diff --stat` + before/after computed-value proof in 05-07-SUMMARY.md (independently re-measured in this pass) is evidence of additivity, not a substitute for visual sign-off."
  - test: "Run the `touch-iphone` (WebKit/iPhone 13) Playwright project once `sudo npx playwright install-deps` has been run on this machine, covering `overflow.spec.ts`, `touch-targets.spec.ts`, `a11y.spec.ts`, and the new `containment.spec.ts` for all 8 routes."
    expected: "All `touch-iphone` tests pass, giving the phase's only real `hover: none` / `pointer: coarse` coverage."
    why_human: "Still blocked in this sandbox — re-ran `npm run audit:responsive`-equivalent checks in this pass and reproduced the identical `browserType.launch` host-dependency errors (missing libicu74/libxml2/libflite1) on all touch-iphone tests, now 8 routes × 4 specs = 32 (was 24 before containment.spec.ts added 8 more)."
  - test: "Confirm RESP-07's runtime behaviour: with the OS `prefers-reduced-motion: reduce` preference set, do Framer Motion's transform/layout entrance and scroll animations actually stop?"
    expected: "Visual confirmation that entrance/scroll animations are suppressed while opacity/colour transitions remain."
    why_human: "`e2e/motion.spec.ts` still asserts only the absence of `animation-iteration-count: infinite`, unaffected by whether `<MotionConfig reducedMotion=\"user\">` exists. Unchanged by gap-closure work (confirmed: neither 05-06 nor 05-07 touched `e2e/motion.spec.ts`, both explicitly fenced it out)."
  - test: "Decide whether the newly-introduced `.wordmark__fill` gradient `background-clip: text` effect (Footer brand watermark, `src/app/globals.css:440-475`, consumed by `src/components/Footer.tsx:118-121`) is an acceptable scoped exception to CLAUDE.md's unconditional ban on that pattern, or should be reimplemented without it."
    expected: "Either (a) grant a documented, scoped exception in `.planning/codebase/design/ANTI-PATTERNS.md` for this one decorative, non-heading, aria-hidden use, or (b) replace the gradient-clip fill with a non-`background-clip:text` technique (e.g. SVG glyph fill)."
    why_human: "Confirmed still present in the codebase at HEAD (`571e8f3`) — CLAUDE.md's ban is stated as unconditional ('Never use background-clip: text with a gradient on text') with no decorative-element carve-out, and no override or design-owner decision exists anywhere in the phase's artifacts for this specific pattern. Surfaced by the current code review (05-REVIEW.md WR-01, added after gap closure) and not yet addressed by any fix pass — the phase has only one 05-REVIEW-FIX.md, and its frontmatter (`findings_in_scope: CR-01, CR-02, WR-01..WR-08` matching the *earlier* review round's numbering) shows it fixed the first review round, not this second one."
---

# Phase 5: Mobile Responsive Retrofit — Verification Report (Re-verification after gap closure)

**Phase Goal:** Every route on the site is comfortable to use on a phone — nothing scrolls sideways, nothing is too small to tap, nothing is clipped by the browser chrome — while the approved desktop design at ≥768px stays visually unchanged.
**Verified:** 2026-07-31
**Status:** human_needed
**Re-verification:** Yes — after gap-closure plans 05-06 and 05-07

This report supersedes the prior `05-VERIFICATION.md` (`status: gaps_found`, 3 goal-level gaps GAP-01/GAP-02/GAP-03). Per the harness instructions, all three gaps were **independently re-measured against the live codebase in this session**, not taken from 05-06-SUMMARY.md or 05-07-SUMMARY.md prose.

## Independent Re-Verification of the Three Prior Gaps

### GAP-01 — Hero H1 42px floor / box overflow — CLOSED, confirmed

Ran a fresh Playwright measurement (not reused from any SUMMARY) against the live production build at 320/360/390/430/768/1024/1440 on `/`:

| Viewport | `h1FontSize` | `scrollWidth` | `clientWidth` | Overflow |
|---|---|---|---|---|
| 320 | `26.0032px` | 272 | 272 | 0 |
| 360 | `27.4316px` | 312 | 312 | 0 |
| 390 | `28.5029px` | 342 | 342 | 0 |
| 430 | `29.9313px` | 382 | 382 | 0 |
| 768 | `42px` | 720 | 720 | 0 |
| 1024 | `43.008px` | 896 | 896 | 0 |
| 1440 | `58px` | 896 | 896 | 0 |

The 768/1024/1440 values are byte-identical to the pre-gap-closure baseline recorded in the original 05-VERIFICATION.md (`42px` / `43.008px` / `58px`) and to 05-07-SUMMARY.md's claimed before=after desktop column. `src/components/Hero.tsx` no longer has an inline `fontSize` (`grep -c 'fontSize' src/components/Hero.tsx` → 0); `src/app/features/page.tsx` carries the identical `md:text-[clamp(42px,4.2vw,58px)]` restoration (read directly, line ~895). **VERIFIED, independently.**

### GAP-02 — Dashboard preview 36% off-screen bleed — CLOSED, confirmed

Same fresh measurement pass, card `div.relative.mx-auto.max-w-6xl`:

| Viewport | `cardLeft` | `cardRight` | Viewport width | Fully on-screen? |
|---|---|---|---|---|
| 320 | 8 | 312 | 320 | yes |
| 360 | 8 | 352 | 360 | yes |
| 390 | 8 | 382 | 390 | yes |
| 430 | 8 | 422 | 430 | yes |
| 768 | 8 | 760 | — | yes (unchanged) |
| 1024 | 8 | 1016 | — | yes (unchanged) |
| 1440 | 144 | 1296 | — | yes (unchanged, rect identical to pre-change) |

`grep -cF -- '-mr-56' src/components/Hero.tsx` → 0. `marginRight` computed `0px` at every measured width, matching the pre-existing ≥640px value. **VERIFIED, independently.**

### GAP-03 — Harness blind to container-relative overflow — CLOSED, confirmed

`e2e/containment.spec.ts` exists (274 lines), is wired into `playwright.config.ts`'s `LAYOUT_SPECS` (confirmed: `const LAYOUT_SPECS = /(overflow|containment|a11y|touch-targets)\.spec\.ts/;`) and into `package.json` (`"audit:containment": "playwright test containment.spec.ts"`). Ran it myself, fresh, across all 7 launchable Chromium projects (not reused from any SUMMARY):

```
npx playwright test containment.spec.ts --project=reflow-320 --project=mobile-360 \
  --project=mobile-390 --project=mobile-430 --project=tablet-768 --project=laptop-1024 \
  --project=desktop-1440
→ 56 passed (26.6s)
```

56/56 green, matching the 264/24/40 full-matrix total the orchestrator reported (208 pre-gap-closure baseline + 56 new containment passes = 264; the 40 failures are exclusively `touch-iphone` launch errors, an environment gap unrelated to code). The 05-06 plan's RED baseline (pre-05-07) is independently corroborated by the plan/SUMMARY's own measured evidence (4 real failures on `/` at the phone widths, reconciled exactly against a measured baseline) — this session did not re-run the RED state (that would require reverting `src/`, which is destructive and unnecessary; the red→green ordering is independently plausible from the diff and matches the GREEN state actually observed). **VERIFIED, independently, for the GREEN (current) state.**

## Goal Achievement

### Observable Truths (ROADMAP.md Success Criteria 1–8)

| # | Truth (ROADMAP SC) | Status | Evidence |
|---|------|--------|----------|
| 1 | `npm run audit:overflow` passes on all 8 routes across the 4 phone-width projects | ✓ VERIFIED | Unchanged from prior verification; independently re-confirmed via `npx tsc --noEmit`/build success and the containment run above sharing the same production build. No regression reported by 05-07-SUMMARY.md (56/56 non-env), and the orchestrator's fresh full-matrix run (264/24/40, all 40 failures touch-iphone-only) is consistent. |
| 2 | `overflow-x-hidden` gone from `<body>`; `ReadingLayout.tsx` and `/changelog` overflows fixed at source | ✓ VERIFIED | `grep -rn "overflow-x-hidden" src` → 0 results (re-checked). Unchanged by gap closure (neither 05-06 nor 05-07 touched these files — confirmed via each plan's `files_modified` frontmatter). |
| 3 | `npm run audit:targets` passes | ✓ VERIFIED | Unchanged by gap closure. Orchestrator's fresh run shows the same 32 passed / 24 skipped non-env profile as the original verification. |
| 4 | `npm run audit:a11y` reports zero axe violations | ✓ VERIFIED | Unchanged by gap closure; orchestrator's run shows 112/112 non-env, same as original. |
| 5 | `viewport` export correct; full-height sections use a viewport-relative unit | ⚠ PARTIAL — see human_verification | Unchanged: code still uses `dvh`, not the `svh` the roadmap/REQUIREMENTS.md text specifies. Gap-closure plans explicitly fenced this out. Routed to human_verification item 2. |
| 6 | Hover rules gated behind `@media (hover: hover)`; root `MotionConfig` in place | ✓ VERIFIED (structurally) | Unchanged, re-confirmed present. |
| 7 | Desktop design unchanged — every diff additive | ✓ VERIFIED for the gap-closure diff itself; ⚠ the pre-existing 28-colour exception still open | The new `git diff 5f4ba1d -- src/` (2 files: `Hero.tsx`, `features/page.tsx`) was independently re-measured in this session at 768/1024/1440 and is byte-identical to the pre-gap-closure baseline (see GAP-01/GAP-02 tables above) — no new desktop deviation was introduced by 05-06/05-07. The **pre-existing** 28 un-gated colour declarations (from the original 5 plans, not gap closure) remain an open human-decision item, unchanged, routed to human_verification item 1. |
| 8 | `tsc`, ESLint, `next build` pass; all 8 routes prerender static | ✓ VERIFIED | Re-ran `npx tsc --noEmit` (exit 0) and `npm run typecheck:e2e` (exit 0) myself in this session. Production build succeeded as a side effect of the Playwright `webServer` step (`npm run build && npm run start`) run twice in this session without error. Orchestrator independently confirmed `npm run build` succeeded with only the pre-existing font-override warning. |

**Score:** 6/8 truths cleanly VERIFIED, unchanged from the prior pass. 2/8 (SC5, SC7's colour sub-clause) remain real, honestly-documented, **unaffected-by-gap-closure** deviations awaiting a design-owner decision — not code defects.

### Full-matrix confirmation

Orchestrator-reported and independently spot-confirmed in this session:

```
npm run audit:responsive (full 8-project matrix) → 264 passed / 24 skipped / 40 failed
```

All 40 failures are `[touch-iphone]` `browserType.launch` host-dependency errors (missing `libicu74`, `libxml2`, `libflite1`) — a pre-existing environment gap, not a code regression. `264 = 208 (pre-gap-closure baseline) + 56 (new containment.spec.ts passes)`; `40 = 32 (pre-existing touch-iphone fails) + 8 (new containment.spec.ts touch-iphone fails)`. Independently re-ran the 7-project containment matrix in this session (56/56, see above) and `npx tsc --noEmit` / `npm run typecheck:e2e` (both exit 0).

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `e2e/containment.spec.ts` | Sweep A + Sweep B, `KNOWN_UNFIXED`, wired into all viewport projects | ✓ VERIFIED | Read/grepped directly: 274 lines, `KNOWN_UNFIXED` with 4 entries (KU-1..KU-4), zero `documentElement.scrollWidth` references (container-relative by construction) |
| `playwright.config.ts` `LAYOUT_SPECS` | Matches `containment.spec.ts` | ✓ VERIFIED | Read directly: `/(overflow\|containment\|a11y\|touch-targets)\.spec\.ts/` |
| `package.json` `audit:containment` | Present | ✓ VERIFIED | `"audit:containment": "playwright test containment.spec.ts"` present |
| `src/components/Hero.tsx` | No inline `fontSize` on H1; `md:text-[clamp(42px,4.2vw,58px)]`; no `-mr-56` | ✓ VERIFIED | Read directly, matches exactly |
| `src/app/features/page.tsx` | Same H1 treatment | ✓ VERIFIED | Read directly, matches exactly |
| `.planning/.../deferred-items.md` | KU-1..KU-4 logged | ✓ VERIFIED | `## From 05-06 containment sweep` section present with all 4 entries, each with route/selector/magnitude/reason |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `playwright.config.ts` | `e2e/containment.spec.ts` | `LAYOUT_SPECS` regex | ✓ WIRED | Confirmed by direct grep and by the spec actually running (56/56) under all 7 named projects |
| `npm run audit:containment` | `e2e/containment.spec.ts` | `package.json` script | ✓ WIRED | Ran it, green |
| `src/components/Hero.tsx` H1 | `e2e/containment.spec.ts` Sweep A | box-overflow measurement | ✓ WIRED | Fresh run shows no `h1.display` offender on any route/project |
| `src/components/Hero.tsx` wrapper | `e2e/containment.spec.ts` Sweep B | off-screen-vs-clipper measurement | ✓ WIRED | Fresh run shows no `div.relative.z-[5]` offender on any route/project |
| `e2e/containment.spec.ts` `KNOWN_UNFIXED` | `deferred-items.md` | `ref` field | ✓ WIRED | Cross-checked KU-1..KU-4 present in both files |

### Data-Flow Trace (Level 4)

Not applicable — this is a CSS/markup/test-harness retrofit phase with no data-fetching. The Level-4 equivalent (live DOM measurement) is the independent Playwright measurement performed directly in this verification session, not reused from SUMMARY.md text.

### Behavioral Spot-Checks / Probe Execution

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Hero H1 no longer overflows its own box at any phone width | Fresh Playwright measurement (this session) | `scrollWidth == clientWidth` at 320/360/390/430 | ✓ PASS |
| Dashboard preview card fully on-screen at every phone width | Fresh Playwright measurement (this session) | `cardRight <= viewportWidth` at 320/360/390/430 | ✓ PASS |
| Desktop (768/1024/1440) computed values unchanged by the gap-closure diff | Fresh Playwright measurement (this session) | `42px`/`43.008px`/`58px`, card rects match pre-change baseline | ✓ PASS |
| `containment.spec.ts` green on all 8 routes, 7 launchable projects | `npx playwright test containment.spec.ts --project=... (x7)` | 56 passed | ✓ PASS |
| Typecheck (app + e2e) | `npx tsc --noEmit`; `npm run typecheck:e2e` | exit 0, exit 0 | ✓ PASS |
| `touch-iphone` project | (via full matrix, orchestrator + this session's containment run) | `browserType.launch` fails, missing host libs | ? SKIP — environment limitation, routed to human_verification |

### Requirements Coverage

| Requirement | Source Plan(s) | Description | Status | Evidence |
|---|---|---|---|---|
| RESP-01 | 05-03, 05-04, 05-05, 05-07 | No route scrolls horizontally; nothing overflows its own box | ✓ SATISFIED | `overflow.spec.ts` unchanged-green; GAP-01/GAP-02 (Hero H1, dashboard bleed) independently confirmed closed in this session |
| RESP-02 | 05-03, 05-05, 05-06 | `overflow-x-hidden` removed at source; harness sees container-relative overflow too | ✓ SATISFIED (evidentiary strength bounded — see WR-02/WR-03 below) | Code read directly, zero hits; `containment.spec.ts` independently re-run green (56/56). Note: 05-REVIEW.md WR-02 (the `/privacy` `KNOWN_UNFIXED` selector `"p.text-"` is broader than the 5 paragraphs it's documented to suppress) and WR-03 (`.slice(0,15)` before filtering/asserting, so a 16th+-ranked offender per route/sweep is never evaluated) are real, unfixed harness-quality gaps confirmed still present in `e2e/containment.spec.ts` at HEAD. They do not falsify the current green result — the sweep does fire correctly on GAP-01/GAP-02 and was proven RED against unfixed code — but they cap how much future-regression confidence the green carries, particularly on `/privacy`. |
| RESP-03 | 05-02, 05-04, 05-05 | Every interactive target ≥44×44 on touch viewports | ✓ SATISFIED | Unchanged; `audit:targets` still 32/32 non-skip non-env per orchestrator's fresh run |
| RESP-04 | 05-01, 05-05 | `viewport` export correct | ✓ SATISFIED | Unchanged, re-confirmed present |
| RESP-05 | 05-01, 05-04, 05-05 | Full-height sections use a viewport-relative unit with fallback | ⚠ NEEDS HUMAN DECISION | Unchanged: `dvh`, not the `svh` the two contract docs (RESPONSIVE.md, REQUIREMENTS.md) still specify verbatim |
| RESP-06 | 05-01, 05-05 | Hover gated behind `@media (hover: hover)` | ✓ SATISFIED | Unchanged, re-confirmed |
| RESP-07 | 05-01, 05-05 | Root `MotionConfig reducedMotion="user"` | ⚠ NEEDS HUMAN | Structural wiring SATISFIED; runtime behaviour still has zero automated coverage, unchanged |
| RESP-08 | all 5 original plans + 05-06/05-07 | Desktop rendering ≥768px unchanged | ✓ SATISFIED for the gap-closure diff (independently re-measured, byte-identical); ⚠ pre-existing 28-colour exception still open | The new geometry changes (H1 clamp, preview bleed removal) are provably additive at 768/1024/1440 — measured directly in this session, not just read from SUMMARY.md. The colour exception predates gap closure and remains a separate open item |

No orphaned requirements: REQUIREMENTS.md lists exactly RESP-01..RESP-08 for Phase 5 (confirmed by direct read, lines 48-55), and all 8 appear across the phase's plans' `requirements:` frontmatter, including the 2 gap-closure plans (05-06: RESP-02; 05-07: RESP-01).

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|---|---|---|---|---|
| `src/app/globals.css` | 440-475 (consumed by `Footer.tsx:118-121`) | `.wordmark__fill` uses `background-clip: text` with a gradient — CLAUDE.md's unconditional anti-pattern ban ("instant AI design tell") | ⚠ WARNING | Newly introduced during this phase (Footer wordmark redesign), confirmed still present at HEAD, surfaced by 05-REVIEW.md's second round (WR-01) and **not yet fixed** — the phase's one `05-REVIEW-FIX.md` addresses only the first review round's WR-01..WR-08 (different content, different numbering). Routed to human_verification as a 6th item since no override or design-sign-off exists |
| `e2e/containment.spec.ts` | 71 | `KNOWN_UNFIXED` selector `"p.text-"` for `/privacy` is broader than the 5 documented paragraphs it suppresses | ⚠ WARNING | 05-REVIEW.md WR-02, confirmed still present. A future genuine overflow regression on any other `/privacy` `<p>` starting with a `text-` class would be silently suppressed rather than failing the suite |
| `e2e/containment.spec.ts` | 209-210 | Both sweeps `.slice(0, 15)` before `KNOWN_UNFIXED` filtering and the assertion, so a 16th+-ranked offender per route/sweep is invisible to the check | ⚠ WARNING | 05-REVIEW.md WR-03, confirmed still present. Bounds (does not eliminate) the evidentiary strength of the GAP-03 closure claim above |
| `e2e/touch-targets.spec.ts` | 94-104 | Inline-link discriminator only checks the anchor's immediate parent for sibling text nodes | ℹ INFO | 05-REVIEW.md WR-04. Currently latent (no such markup exists in reviewed files today) |
| `src/app/changelog/page.tsx` | 5-9 | Not migrated to `var(--color-ep-*)` tokens in this phase's contrast-cleanup pass, unlike its sibling pages | ℹ INFO | 05-REVIEW.md WR-05. Pre-existing inconsistency, not a runtime defect |
| `src/components/ui/button.tsx` | 22-36 | `brand` variant's `rounded-full` always overridden to `rounded-md` — no brand CTA renders as a pill | ℹ INFO (pre-existing, logged) | Unchanged from prior verification; logged in `deferred-items.md` as WR-08, needs design-owner sign-off, correctly deferred rather than silently applied |
| — | — | No `TBD`/`FIXME`/`XXX` debt markers found in any file touched by 05-06 or 05-07 | — | Debt-marker gate: clean |
| — | — | No `TODO`/`HACK`/`PLACEHOLDER` strings found | — | Clean |

### Deferred Items (informational — not gaps)

Per Step 9b, these are logged findings addressed by neither the original 5 plans nor the 2 gap-closure plans, are explicitly out of every plan's fence, and do not block this phase's goal:

| # | Item | Where logged | Notes |
|---|------|--------------|-------|
| 1 | KU-1 — `/features` "Connectedness" badge overflows its own box by 7px at all 7 Chromium viewports | `deferred-items.md` | Pre-existing, width-independent, unrelated to the Hero |
| 2 | KU-2 — `/mcp` prose paragraphs overflow their box at 320/360px (max 66px) | `deferred-items.md` | Pre-existing, unrelated component |
| 3 | KU-3 — `/privacy` legal-copy paragraphs overflow their box at 320-390px (max 73px) | `deferred-items.md` | Pre-existing, unrelated to Hero gaps; note the imprecise `KNOWN_UNFIXED` suppression above (WR-02) |
| 4 | KU-4 — `/pricing` comparison table clipped by its own `overflow-hidden` wrapper, escaping by up to 77px at 320px | `deferred-items.md` | **New finding**, discovered by the GAP-03 closure sweep on its first run; genuinely the same defect class GAP-03 exists to catch, but on a different route/component than the two named gaps. Needs a design-owner decision (self-scrolling table vs. mobile restructure). Correctly out of this phase's fence — it is not part of the phase goal's two named symptoms and would expand scope beyond the Hero |
| 5 | WR-08 (button pill radius) | `deferred-items.md` | Carried forward unchanged from before gap closure |

### Human Verification Required

See the `human_verification` list in the frontmatter (6 items — 5 carried forward unchanged, plus 1 new item for the `background-clip: text` anti-pattern surfaced by the post-gap-closure code review). Summary:

1. **RESP-08 colour exception** — accept or reject the 28 un-gated colour changes (carried forward, unaffected by gap closure).
2. **RESP-05 svh→dvh** — accept the unit substitution and correct the two stale contract documents, or revert (carried forward, unaffected).
3. **Literal 1440px visual sign-off + real-iPhone check** — never performed by an actual human, including in this pass (carried forward, unaffected).
4. **`touch-iphone` WebKit project** — still cannot launch in this sandbox; re-confirmed identical host-dependency error in this session (carried forward, now covers 4 specs instead of 3 since `containment.spec.ts` was added).
5. **RESP-07 runtime behaviour** — no automated test exercises Framer's JS-driven reduced-motion behaviour (carried forward, unaffected — `e2e/motion.spec.ts` untouched by both gap-closure plans).
6. **NEW: `.wordmark__fill` `background-clip: text` gradient** — a CLAUDE.md-banned pattern, introduced during this phase's Footer redesign, confirmed still present, flagged by the post-gap-closure code review (05-REVIEW.md WR-01) and not yet fixed or granted an exception.

### Gaps Summary

**All three goal-level gaps from the prior verification (GAP-01, GAP-02, GAP-03) are independently confirmed closed in this session** — measured directly against the live production build with a fresh Playwright script, not taken from 05-06-SUMMARY.md or 05-07-SUMMARY.md prose. The desktop band (768/1024/1440) computed values for every touched element are byte-identical to the pre-gap-closure baseline, also independently re-measured. No regression was found in the pre-existing harness (`overflow.spec.ts`, `touch-targets.spec.ts`, `a11y.spec.ts` all unchanged per the orchestrator's fresh full-matrix run, consistent with this session's spot checks).

Status is `human_needed`, not `passed`, because the phase still carries 6 items that require a human/design-owner decision rather than a code fix: 5 unchanged from the prior pass (RESP-08 colour exception, RESP-05 unit substitution, the literal 1440px/real-iPhone visual sign-off, the `touch-iphone` environment gap, and RESP-07's untested runtime behaviour), plus 1 new item surfaced by the post-gap-closure code review (the `background-clip: text` gradient on the Footer wordmark, a CLAUDE.md-banned pattern with no recorded exception). None of these 6 items are code defects in the sense of missing, stub, or unwired artifacts — they are honest, disclosed trade-offs or untested-but-plausibly-correct runtime behaviour awaiting a decision this verifier is not authorized to make on its own.

Two harness-quality warnings (05-REVIEW.md WR-02, WR-03) were independently confirmed still present in `e2e/containment.spec.ts` and bound (without invalidating) the evidentiary strength of the RESP-02/GAP-03 green result — noted in the Requirements Coverage table above for the next reader's awareness.

---

_Verified: 2026-07-31_
_Verifier: Claude (gsd-verifier)_
