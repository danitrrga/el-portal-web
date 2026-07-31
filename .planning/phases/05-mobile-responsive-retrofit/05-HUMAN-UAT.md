---
status: partial
phase: 05-mobile-responsive-retrofit
source: [05-VERIFICATION.md]
started: 2026-07-31T00:00:00Z
updated: 2026-07-31T00:00:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. RESP-08 colour exception — accept or reject the 28 un-gated colour changes
expected: Either (a) accept the deviation and add a formal override to `05-VERIFICATION.md`'s frontmatter citing `05-05-SUMMARY.md`'s "RESP-08 colour exception" section as justification, or (b) direct that the colours be reverted and the resulting axe color-contrast violations be re-opened as a separate, explicitly-scoped follow-up phase.
detail: `text-zinc-500`→`text-zinc-400` ×16, `text-zinc-600`→`text-zinc-400` ×7, `FG_SUBTLE` `#5a6478`→`var(--color-ep-fg-muted-2)` ×5. None are behind an `md:`/`lg:` gate, so all render differently at 1440px. Independently confirmed via `git diff 358f6ee HEAD -- src/components/Footer.tsx` and 6 other files. These are the only non-additive changes in the phase's 81-hunk diff. SC4 (zero axe violations) and SC7 (desktop freeze) are in direct tension here; no automated check can arbitrate.
result: [pending]

### 2. RESP-05 `svh` → `dvh` unit substitution — accept and correct the contracts, or revert
expected: Either (a) accept `dvh`, correct `RESPONSIVE.md`'s locked Viewport Units table and `REQUIREMENTS.md`'s RESP-05 wording (both still say `svh`), and confirm on a real iOS device that `dvh`'s re-resolve-during-scroll cost produces no visible jank on the decorative overlays (ReadingLayout glow/grain, glass-panel blur); or (b) revert to `svh` with a corrected justifying comment.
detail: Code now uses `dvh` exclusively (`src/app/globals.css:213,231-234,380-385`). The change came from code-review finding WR-02 — the original "svh prevents clipping" rationale was factually wrong, since `min-height` cannot clip. But `RESPONSIVE.md` frames `dvh` as "only with a specific tested reason… visible jank on complex subtrees" and `svh` as "the default for full-height work." The code currently contradicts the project's own locked contract with no recorded design-owner sign-off.
result: [pending]

### 3. Literal 1440px visual sign-off + real-iPhone check
expected: Visual parity confirmed at 1440px across all 8 routes for layout, spacing and sizing (colour deltas being the separately-decided exception in test 1); dark theme-color browser chrome and an unclipped hero bottom confirmed on a physical iPhone.
detail: ROADMAP SC7 and `05-05-PLAN.md` both explicitly require this. `05-05-SUMMARY.md` states plainly it was never performed — no human eyes, no physical device in the execution context. The verifier had neither either. Automated hunk classification and `desktop-1440` Playwright parity are not a substitute.
result: [pending]

### 4. `touch-iphone` WebKit project — run once host libs are installed
expected: All `touch-iphone` tests pass across `overflow.spec.ts`, `touch-targets.spec.ts` and `a11y.spec.ts` for all 8 routes.
detail: Blocked in this sandbox — `browserType.launch` fails on missing host libraries (`libicu74`, `libxml2`, `libflite1`), which need root. All 32 observed `touch-iphone` failures are identical launch errors, not code regressions. Unblock with `sudo npx playwright install-deps`. This matters beyond bookkeeping: the 7 Chromium projects that do run never emulate `hover: none`, so RESP-06's `@media (hover: hover)` gating has no automated coverage with a genuinely coarse pointer.
result: [pending]

### 5. RESP-07 runtime reduced-motion behaviour
expected: Visual confirmation (screen recording, or DevTools "Emulate CSS prefers-reduced-motion") that Framer's entrance and scroll animations — Hero's `AnimatedGroup`, section `whileInView` reveals — are actually suppressed under `prefers-reduced-motion: reduce`, while opacity/colour transitions remain.
detail: `e2e/motion.spec.ts` asserts only the absence of `animation-iteration-count: infinite`. That is a CSS keyframe check, unaffected by whether `<MotionConfig reducedMotion="user">` exists at all. `MotionProvider`'s existence and wiring are proven; its runtime effect is not tested by anything in this phase.
result: [pending]

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0
blocked: 0

## Gaps
