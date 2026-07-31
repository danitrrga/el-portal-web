---
phase: 05-mobile-responsive-retrofit
verified: 2026-07-31T00:00:00Z
status: human_needed
score: 6/8 roadmap success criteria cleanly verified; 2/8 flagged for explicit human/design-owner decision
overrides_applied: 0
re_verification: false
human_verification:
  - test: "Decide whether the RESP-08 'desktop unchanged' contract accepts the 28 un-gated colour-declaration changes made for WCAG AA contrast remediation (text-zinc-500→400 ×16, text-zinc-600→400 ×7, FG_SUBTLE #5a6478→var(--color-ep-fg-muted-2) ×5), all of which render differently at 1440px and are NOT behind any `md:`/`lg:` gate."
    expected: "Either (a) accept the deviation and add a formal override to this file's frontmatter citing 05-05-SUMMARY.md's 'RESP-08 colour exception' section as justification, or (b) direct that the colours be reverted and the resulting axe color-contrast violations be re-opened as a separate, explicitly-scoped follow-up phase."
    why_human: "This is a genuine, honestly-documented trade-off between two roadmap success criteria that are in direct tension (SC4 zero-axe-violations-no-viewport-skip vs SC7 byte-for-byte-desktop-freeze). No automated check can arbitrate which contract wins; independently verified the colour deltas are real (git diff shows un-gated className changes) and are the only non-additive changes in the phase's 81-hunk diff."
  - test: "Decide whether the RESP-05 svh→dvh unit substitution is acceptable, and if so, update RESPONSIVE.md's locked Viewport Units table and REQUIREMENTS.md's RESP-05 wording to match (both still say svh)."
    expected: "Either (a) accept dvh and correct the two contract documents (currently silently contradicted by the code), verifying dvh's known re-resolve-during-scroll cost does not produce visible jank on this site's decorative overlays (ReadingLayout glow/grain, glass-panel blur) on a real iOS device, or (b) revert to svh with a corrected justifying comment (the original 'clipping' rationale was factually wrong per WR-02, but svh's own rationale — never exposing the wrong background colour on a short page — is still valid and was the documented contract)."
    why_human: "RESPONSIVE.md (the project's own locked design contract) explicitly frames dvh as 'only with a specific tested reason... visible jank on complex subtrees' and frames svh as 'the default for full-height work.' The code now does the opposite of the documented contract with no real-device jank test and no design-owner sign-off recorded anywhere in the phase artifacts."
  - test: "Perform the literal 1440px before/after visual comparison across all 8 routes, and a real-iPhone check of `/` and `/changelog` for dark browser-chrome + address-bar-clip behaviour, as ROADMAP.md SC7 and the 05-05-PLAN.md human-check both require."
    expected: "Visual parity confirmed at 1440px for layout/spacing/sizing (colour deltas are the known, separately-decided exception above); dark theme-color chrome and unclipped hero bottom confirmed on a physical iPhone."
    why_human: "05-05-SUMMARY.md explicitly states this was never performed ('I do not have a human's eyes or a physical iPhone available in this execution context... that step remains outstanding'). Automated hunk classification and desktop-1440 Playwright parity are not a substitute for an actual visual sign-off, and this verifier likewise has no real iPhone or human eyes available."
  - test: "Run the `touch-iphone` (WebKit/iPhone 13) Playwright project once `sudo npx playwright install-deps` has been run on this machine, covering `overflow.spec.ts`, `touch-targets.spec.ts`, and `a11y.spec.ts` for all 8 routes."
    expected: "All `touch-iphone` tests pass, giving the phase's only real `hover: none` / `pointer: coarse` coverage — which is what the `@media (hover: hover)` gating (RESP-06) and the touch-target fixes (RESP-03) actually need to be proven against."
    why_human: "This sandbox cannot install the missing host libraries (`libicu74`, `libxml2`, `libflite1`) without root. All 32 touch-iphone failures observed in this verification are identical `browserType.launch` host-dependency errors on all 8 routes across all 3 specs — confirmed by running the suite directly — not code regressions. But the gap is real: the 7 Chromium-based projects that did run never emulate `hover: none`, so RESP-06's hover-gating fix is unverified by any automated test that actually has a coarse pointer."
  - test: "Confirm RESP-07's runtime behaviour: with the OS `prefers-reduced-motion: reduce` preference set, do Framer Motion's transform/layout entrance and scroll animations (e.g. Hero's `AnimatedGroup`, section `whileInView` reveals) actually stop, not just fail to violate the unrelated perpetual-motion check?"
    expected: "Visual confirmation (screen recording or manual DevTools 'Emulate CSS prefers-reduced-motion' toggle) that entrance/scroll animations are suppressed while opacity/colour transitions remain."
    why_human: "`e2e/motion.spec.ts` (read in full during this verification) asserts only the absence of `animation-iteration-count: infinite` — a CSS keyframe-animation check that is unaffected by whether `<MotionConfig reducedMotion=\"user\">` exists at all. No automated test in this phase exercises Framer's JS-driven reduced-motion behaviour. This is honestly disclosed in 05-01-SUMMARY.md and 05-05-SUMMARY.md; independently confirmed by reading the spec source."
---

# Phase 5: Mobile Responsive Retrofit — Verification Report

**Phase Goal:** Every route on the site is comfortable to use on a phone — nothing scrolls sideways, nothing is too small to tap, nothing is clipped by the browser chrome — while the approved desktop design at ≥768px stays visually unchanged.
**Verified:** 2026-07-31
**Status:** human_needed
**Re-verification:** No — initial verification

**Note on ROADMAP.md's checkbox:** ROADMAP.md already shows Phase 5's checkbox and all 5 plan checkboxes as `[x]` — this was set by the executor before verification ran and carries no evidentiary weight. This report verifies against the live codebase and live test runs, not against that checkbox or against SUMMARY.md prose.

## Goal Achievement

### Observable Truths (ROADMAP.md Success Criteria 1–8)

| # | Truth (ROADMAP SC) | Status | Evidence |
|---|------|--------|----------|
| 1 | `npm run audit:overflow` passes on all 8 routes across `reflow-320`/`mobile-360`/`mobile-390`/`mobile-430` | ✓ VERIFIED | Ran `npx playwright test overflow.spec.ts` myself: 56/56 passed on the 7 launchable Chromium projects (includes all 4 named projects), 8 failures are `touch-iphone` browser-launch errors only (environment gap, see human_verification) |
| 2 | `overflow-x-hidden` gone from `<body>`; `ReadingLayout.tsx` (420px) and `/changelog` (27px) overflows fixed at source | ✓ VERIFIED | `grep -rn "overflow-x-hidden" src` → 0 results (checked myself). `src/app/layout.tsx:57` body className has no `overflow-x-hidden` token (read directly). `src/components/ReadingLayout.tsx:12,14` — `overflow-x-clip` on wrapper + `w-full md:w-[1200px]` glow (read directly). `src/app/changelog/page.tsx:906` — H1 uses `text-[clamp(2rem,3.92vw+1.12rem,3rem)] md:text-[clamp(48px,6vw,80px)]`, no inline `fontSize` (read directly) |
| 3 | `npm run audit:targets` passes — hamburger (was 20×20) and Sign Up CTA (was 80×32) now ≥44×44 | ✓ VERIFIED | Ran `npx playwright test touch-targets.spec.ts` myself: 32/32 passed on the 4 mobile projects, 24 correctly `skip`ped at ≥768px, 8 `touch-iphone` env failures only. `src/components/Navbar.tsx` hamburger is `<Button size="icon">` (`size-11 md:size-9`) — no raw `<button>` remains. `src/components/ui/button.tsx` `sm` size is `h-11 md:h-8`. **Harness integrity independently confirmed**: read `e2e/touch-targets.spec.ts` in full — the selector now includes `summary`, and the inline-link exemption was rewritten from the defective `el.closest("p, li")` to a genuine "surrounded by sibling text nodes" discriminator, closing the exact false-green gap CR-01/CR-02 found. This is a real pass, not a re-confirmed false-green |
| 4 | `npm run audit:a11y` reports zero axe violations across all 8 routes at mobile viewports, with `target-size` enabled | ✓ VERIFIED | Ran `npx playwright test a11y.spec.ts` myself: 112/112 passed on all 7 launchable projects (includes desktop-1440 — the spec has no viewport skip, so this is a stronger result than the literal "mobile viewports" wording requires). Read `e2e/a11y.spec.ts` in full: `target-size: { enabled: true }` present, full `wcag2a/2aa/21a/21aa/22aa` tag list present, `color-contrast incomplete` results correctly routed to a separate non-failing annotation test rather than silenced |
| 5 | `layout.tsx` exports `viewport` with `themeColor`+`colorScheme:'dark'`, no zoom-blockers; full-height sections use `svh` | ⚠ PARTIAL — see human_verification | Viewport export **verified**: `src/app/layout.tsx:39-44` = `{ width: "device-width", initialScale: 1, themeColor: "#02030a", colorScheme: "dark" }`; no `maximumScale`/`userScalable`/`viewportFit` anywhere (grep confirmed). Full-height-section unit is **not** `svh` — `src/app/globals.css:213,231-234,380-385` implement `min-height: 100vh` + `@supports (min-height: 100dvh) { min-height: 100dvh }`. This is a literal deviation from the roadmap wording, from REQUIREMENTS.md's RESP-05 text, and from RESPONSIVE.md's own locked table (which frames `dvh` as "only with a specific tested reason... visible jank on complex subtrees" and `svh` as "the default"). Routed to human_verification — see reasoning there |
| 6 | Hand-written `:hover` rules gated behind `@media (hover: hover)`; root `MotionConfig reducedMotion="user"` in place | ✓ VERIFIED (structurally) | `grep -c ':hover' src/app/globals.css` → 4; all 4 (`::-webkit-scrollbar-thumb:hover`, `.card-glow:hover::before`, `.wordmark:hover .wordmark__outline`, `.wordmark:hover .wordmark__fill`) read directly inside `@media (hover: hover) { }` blocks. `src/components/MotionProvider.tsx` exists, is `"use client"`, exports `<MotionConfig reducedMotion="user">{children}</MotionConfig>`; wired at `src/app/layout.tsx:59`. **Caveat**: existence/wiring is proven; runtime effect is not — see human_verification (RESP-07) |
| 7 | **Desktop design is unchanged** — every diff additive, verified by human 1440px review | ⚠ PARTIAL — see human_verification | Layout/sizing/spacing changes are genuinely additive: every geometry-affecting hunk sampled (Button sizes, Navbar, Footer wordmark, CopyButton, ReadingLayout glow, changelog H1, min-h-viewport swap) carries a verified `md:` restoration or lives in an `md:hidden` subtree. **However**, independently confirmed in `git diff 358f6ee HEAD -- src/components/Footer.tsx` (and `mcp/page.tsx`, and 5 more files) that ~28 colour-only class/constant changes (`text-zinc-500`→`text-zinc-400` ×16, `text-zinc-600`→`text-zinc-400` ×7, `FG_SUBTLE` hex→token ×5) are **not** gated by any breakpoint and therefore render differently at 1440px too. This is honestly disclosed in `05-05-SUMMARY.md`'s "RESP-08 colour exception" section (which itself corrects an earlier, false "zero className diffs" claim caught by code review WR-03) — but the literal "desktop unchanged" contract is not met by these 28 declarations, and the human 1440px visual review this criterion explicitly requires was never performed by an actual human. Routed to human_verification |
| 8 | `tsc`, ESLint, `next build` pass; all 8 routes still prerender static | ✓ VERIFIED | Ran myself: `npx tsc --noEmit` → exit 0, no output. `npm run lint` → exit 0, 2 pre-existing unused-var warnings only (both predate this phase, out of scope). `npm run build` → exit 0, route table shows `○ (Static)` for `/`, `/_not-found`, `/changelog`, `/features`, `/icon.svg`, `/manifesto`, `/mcp`, `/pricing`, `/privacy`, `/terms` — all 8 content routes static |

**Score:** 6/8 truths cleanly VERIFIED. 2/8 (SC5, SC7) are real, honestly-documented deviations from the literal written criterion that require an explicit human/design-owner accept-or-reject decision — they are not code defects (nothing is broken, missing, or stubbed) but they are not what the roadmap literally promised either.

### Full-matrix confirmation (independently run, not taken from SUMMARY.md)

```
npm run audit:responsive → 208 passed, 24 skipped, 32 failed
```
All 32 failures are `touch-iphone` (WebKit) `browserType.launch` host-dependency errors — identical across all 8 routes × 4 specs, reproduced directly in this verification session. This matches `05-05-SUMMARY.md`'s claimed numbers exactly, and was independently re-run rather than trusted.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/app/layout.tsx` | `viewport` export, `MotionProvider` wiring, no dead CDN link, no `overflow-x-hidden` | ✓ VERIFIED | Read in full; all four conditions hold |
| `src/components/MotionProvider.tsx` | `"use client"` + `MotionConfig reducedMotion="user"` wrapper | ✓ VERIFIED | Read in full, exact shape |
| `src/app/globals.css` | 4/4 hover rules gated; `min-h-viewport` utility; viewport-unit cascade | ✓ VERIFIED (unit is `dvh`, see SC5) | Read in full; `@utility min-h-viewport` nests the `@supports` block inside itself (WR-01 fix), confirmed correctly layered |
| `src/components/ReadingLayout.tsx` | `overflow-x-clip` wrapper, `w-full md:w-[1200px]` glow | ✓ VERIFIED | Read in full |
| `src/app/changelog/page.tsx` | Breakpoint-gated H1 clamp, no inline fontSize | ✓ VERIFIED | Read in full |
| `src/components/ui/button.tsx` | 8/8 size variants `h-11`/`size-11` mobile + `md:` restore | ✓ VERIFIED | Read in full; WR-08 pill-radius issue is pre-existing/deferred (see Anti-Patterns) |
| `src/components/Navbar.tsx` | No raw `<button>`; 44px hamburger/wordmark/menu rows; `aria-expanded`/`aria-controls`/Escape | ✓ VERIFIED | Read in full; all WR-04 accessibility additions present and correct |
| `src/components/Footer.tsx` | 44px brand link; footerColumns links get real hit area (CR-01 fix) | ✓ VERIFIED | Read in full |
| `src/app/pricing/page.tsx` | FAQ `<summary>` 44px hit area (CR-02 fix) | ✓ VERIFIED | Read in full; padding moved from `<details>` to `<summary>` as documented |
| `e2e/touch-targets.spec.ts` | `width >= 768` skip boundary; `summary` in selector; correct inline-text discriminator | ✓ VERIFIED | Read in full; harness integrity confirmed, not just its exit code |
| `.planning/.../05-05-SUMMARY.md` | Per-project results table, hunk classification, RESP-01..08 evidence table | ✓ VERIFIED (exists, substantive, and independently spot-checked against the live repo — numbers match) | |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `layout.tsx` | `MotionProvider.tsx` | `import` + wraps `{children}` | ✓ WIRED | `src/app/layout.tsx:59`: `<MotionProvider>{children}</MotionProvider>` |
| `globals.css` `min-h-viewport` | 8 page roots | class usage | ✓ WIRED | `grep -rl "min-h-viewport" src/app --include='*.tsx'` → 8 files |
| `Navbar.tsx` hamburger | `ui/button.tsx` | `<Button size="icon">` | ✓ WIRED | Confirmed in Navbar.tsx source |
| `e2e/touch-targets.spec.ts` | `ui/button.tsx` size variants | 44px assertion measures the compiled `h-11`/`size-11` | ✓ WIRED | Live Playwright run passed |
| `npm run audit:responsive` | RESP-01..RESP-08 | single command proving the phase | ✓ WIRED | Ran it myself: 208/24/32, matches disclosed numbers |

### Data-Flow Trace (Level 4)

Not applicable in the conventional sense — this phase is CSS/markup/layout retrofitting with no data-fetching components, API routes, or dynamic state to trace. The equivalent "does it actually work" check for this phase is the live Playwright DOM measurement (`getBoundingClientRect`, `getComputedStyle`) performed by the harness, which was independently re-run rather than trusted from SUMMARY.md — see "Full-matrix confirmation" above.

### Behavioral Spot-Checks / Probe Execution

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| No route scrolls horizontally at 320/360/390/430 | `npx playwright test overflow.spec.ts` | 56 passed / 8 failed (env) | ✓ PASS |
| Every touch target ≥44px below `md:` | `npx playwright test touch-targets.spec.ts` | 32 passed / 24 skipped / 8 failed (env) | ✓ PASS |
| Zero axe violations, `target-size` enabled, no viewport skip | `npx playwright test a11y.spec.ts` | 112 passed / 16 failed (env) | ✓ PASS |
| No perpetual (`animation-iteration-count: infinite`) motion under reduced-motion emulation | `npx playwright test --project=reduced-motion motion.spec.ts` | 8/8 passed | ✓ PASS (narrow scope — see RESP-07 caveat) |
| Full harness | `npm run audit:responsive` | 208 passed / 24 skipped / 32 failed (all env) | ✓ PASS |
| Typecheck | `npx tsc --noEmit` | exit 0 | ✓ PASS |
| Lint | `npm run lint` | exit 0, 2 pre-existing warnings | ✓ PASS |
| Production build, static-route check | `npm run build` | exit 0, 8/8 routes `○ (Static)` | ✓ PASS |
| `touch-iphone` (WebKit) project | `npx playwright test --project=touch-iphone` (via full runs above) | `browserType.launch` fails — missing `libicu74`/`libxml2`/`libflite1`, needs `sudo` | ? SKIP — environment limitation, routed to human_verification |

### Requirements Coverage

| Requirement | Source Plan(s) | Description | Status | Evidence |
|---|---|---|---|---|
| RESP-01 | 05-03, 05-04, 05-05 | No route scrolls horizontally 320–430px | ✓ SATISFIED | `audit:overflow` 56/56 (non-env) |
| RESP-02 | 05-03, 05-05 | `overflow-x-hidden` removed, sources fixed at source | ✓ SATISFIED | Code read directly, zero hits site-wide |
| RESP-03 | 05-02, 05-04, 05-05 | Every interactive target ≥44×44 on touch viewports | ✓ SATISFIED | `audit:targets` 32/32 (non-skip, non-env); harness integrity independently confirmed |
| RESP-04 | 05-01, 05-05 | `viewport` export, `themeColor`+`colorScheme`, no zoom-blockers | ✓ SATISFIED | `layout.tsx` read directly |
| RESP-05 | 05-01, 05-04, 05-05 | Full-height sections use viewport-relative unit with `vh` fallback | ⚠ NEEDS HUMAN DECISION | Implemented as `dvh`, not the `svh` REQUIREMENTS.md/ROADMAP.md/RESPONSIVE.md all specify. Functionally reasonable per WR-02's analysis, but undocumented in the two contract files and untested for dvh's known jank risk on a real device |
| RESP-06 | 05-01, 05-05 | Hand-written `:hover` gated behind `@media (hover: hover)` | ✓ SATISFIED | 4/4 confirmed in `globals.css` |
| RESP-07 | 05-01, 05-05 | Root `MotionConfig reducedMotion="user"` | ⚠ NEEDS HUMAN | Structural wiring SATISFIED; runtime behaviour (animations actually stop) has zero automated coverage, honestly disclosed |
| RESP-08 | all 5 plans | Desktop rendering ≥768px byte-for-byte unchanged | ⚠ NEEDS HUMAN DECISION | Geometry/layout SATISFIED (verified additive); 28 un-gated colour declarations are a real, disclosed exception; literal human 1440px sign-off never performed |

No orphaned requirements: REQUIREMENTS.md lists exactly RESP-01..RESP-08 for Phase 5, and all 8 appear in at least one plan's `requirements:` frontmatter (05-01 through 05-05 collectively cover all 8, cross-checked by grep).

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|---|---|---|---|---|
| `src/components/ui/button.tsx` | 22-23, 27-36 | `brand` variant's `rounded-full` is always overridden to `rounded-md` by every size variant (`tailwind-merge` resolves to the last class) — no brand CTA renders as a pill despite CLAUDE.md specifying one | ℹ INFO (pre-existing) | Predates phase 05; this phase rewrote the size strings but did not introduce the bug. Deliberately identified, measured, and deferred with a design-owner escalation logged in `deferred-items.md` (WR-08) rather than silently applied or silently ignored — correct handling of a pre-existing defect discovered mid-phase, not a phase-05 regression |
| `src/app/globals.css` | 191-194 | `.text-glow-hero` is dead, unreferenced CSS using a banned `text-shadow` glow and the banned `rgba(30, 64, 175, …)` neon-blue value | ℹ INFO (pre-existing) | `grep -rn "text-glow-hero" src` returns only its own definition. Untouched by this phase (not in any plan's `files_modified`); a genuine CLAUDE.md violation but dead code with zero runtime effect |
| `.planning/codebase/design/RESPONSIVE.md` + `.planning/REQUIREMENTS.md` | RESPONSIVE.md "Viewport units" table; REQUIREMENTS.md RESP-05 line | Both design-contract documents still say `svh`; the shipped code implements `dvh` (WR-02 fix) and neither document was updated | ⚠ WARNING | Traceability gap: the next contributor reading the locked contract will write new code against a rule the codebase no longer follows. Not a runtime defect, but leaves the phase's central "written contract = code" premise broken |
| — | — | No `TBD`/`FIXME`/`XXX` debt markers found in any of the ~21 files this phase touched | — | Debt-marker gate: clean |
| — | — | No `TODO`/`HACK`/`PLACEHOLDER` strings found in any touched file | — | Clean |

### Human Verification Required

See the `human_verification` list in the frontmatter for the full detail (5 items). Summary:

1. **RESP-08 colour exception** — accept or reject the 28 un-gated colour changes as within the "desktop unchanged" contract (recommend: accept via a formal override, since they are justified WCAG AA fixes, independently verified as colour-only, and honestly disclosed — but this is a call for the design owner, not the verifier).
2. **RESP-05 svh→dvh** — accept the unit substitution and correct the two stale contract documents, or revert to `svh` with a corrected comment.
3. **Literal 1440px visual sign-off + real-iPhone check** — never performed by an actual human; both this verifier and the executor lack real eyes/hardware.
4. **`touch-iphone` WebKit project** — cannot run in this sandbox; run once `sudo npx playwright install-deps` is available, to get real `hover:none`/`pointer:coarse` coverage.
5. **RESP-07 runtime behaviour** — confirm Framer Motion animations actually stop under `prefers-reduced-motion: reduce`; no automated test in this phase (or in this verification) exercises this.

### Gaps Summary

There are no code-level gaps in the sense of missing artifacts, stub implementations, or broken wiring — every mechanical claim in the SUMMARYs was independently re-derived from the live codebase and live test runs in this verification, not taken on faith, and all of it held up. The phase's actual failure mode is narrower and more interesting: two of the roadmap's own literal success criteria (SC5's "svh", SC7's "byte-for-byte unchanged") were knowingly and transparently superseded during execution by the code-review/fix pass, for defensible reasons, but without updating the criteria's source documents or obtaining a recorded accept/reject decision. That is exactly what the escalation-gate pattern exists for — surfacing a real, honest trade-off to a human rather than letting an AI agent's own after-the-fact rationalization stand in for sign-off. Nothing here should block iteration on Phase 6, but Phase 5 should not be considered fully closed until a human has recorded a decision on the two items above and (ideally) performed the literal 1440px / real-device checks the phase's own plan called for.

---

_Verified: 2026-07-31_
_Verifier: Claude (gsd-verifier)_
