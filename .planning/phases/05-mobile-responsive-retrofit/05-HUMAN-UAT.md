---
status: partial
phase: 05-mobile-responsive-retrofit
source: [05-VERIFICATION.md]
started: 2026-07-31T00:00:00Z
updated: 2026-08-01T00:00:00Z
---

## Current Test

[testing complete — 1 item remains blocked on a physical device, 1 on host packages]

## Tests

### 1. RESP-08 colour exception — accept or reject the 28 un-gated colour changes
expected: Either (a) accept the deviation and add a formal override to `05-VERIFICATION.md`'s frontmatter citing `05-05-SUMMARY.md`'s "RESP-08 colour exception" section as justification, or (b) direct that the colours be reverted and the resulting axe color-contrast violations be re-opened as a separate, explicitly-scoped follow-up phase.
detail: `text-zinc-500`→`text-zinc-400` ×16, `text-zinc-600`→`text-zinc-400` ×7, `FG_SUBTLE` `#5a6478`→`var(--color-ep-fg-muted-2)` ×5. None are behind an `md:`/`lg:` gate, so all render differently at 1440px. Independently confirmed via `git diff 358f6ee HEAD -- src/components/Footer.tsx` and 6 other files. These are the only non-additive changes in the phase's 81-hunk diff. SC4 (zero axe violations) and SC7 (desktop freeze) are in direct tension here; no automated check can arbitrate.
result: pass
resolution: accepted — override OVR-01 recorded in `05-VERIFICATION.md` frontmatter
measured: Pixel diff pre-phase-05 (`0f0e978`) vs HEAD, full-page @1440, all 8 routes, scroll-through capture so every `whileInView` reveal fires in both builds — `/mcp` 1.913%, `/manifesto` 0.279%, `/terms` 0.226%, `/features` 0.182%, `/privacy` 0.174%, `/pricing` 0.156%, `/` 0.117%, `/changelog` 0.095%. Colour only; no geometry deviation.
follow_up: `/mcp` is a ~10× outlier because it still mixes `zinc-*` with the OKLCH scale — tracked as `05-REVIEW.md` IN-08 (token consistency, not contrast).

### 2. RESP-05 `svh` → `dvh` unit substitution — accept and correct the contracts, or revert
expected: Either (a) accept `dvh`, correct `RESPONSIVE.md`'s locked Viewport Units table and `REQUIREMENTS.md`'s RESP-05 wording (both still say `svh`), and confirm on a real iOS device that `dvh`'s re-resolve-during-scroll cost produces no visible jank on the decorative overlays (ReadingLayout glow/grain, glass-panel blur); or (b) revert to `svh` with a corrected justifying comment.
detail: Code now uses `dvh` exclusively (`src/app/globals.css:213,231-234,380-385`). The change came from code-review finding WR-02 — the original "svh prevents clipping" rationale was factually wrong, since `min-height` cannot clip. But `RESPONSIVE.md` frames `dvh` as "only with a specific tested reason… visible jank on complex subtrees" and `svh` as "the default for full-height work." The code currently contradicts the project's own locked contract with no recorded design-owner sign-off.
result: pass
resolution: accepted `dvh` — contract docs corrected to match the code rather than the reverse
changed: `.planning/codebase/design/RESPONSIVE.md` § Viewport units (table reordered + amendment recording why the original `svh` rationale did not hold); `.planning/REQUIREMENTS.md` RESP-05 wording
residual: the jank caveat still stands — a physical-iOS check that decorative overlays do not jank during toolbar transitions is folded into test 3.

### 3. Literal 1440px visual sign-off + real-iPhone check
expected: Visual parity confirmed at 1440px across all 8 routes for layout, spacing and sizing (colour deltas being the separately-decided exception in test 1); dark theme-color browser chrome and an unclipped hero bottom confirmed on a physical iPhone.
detail: ROADMAP SC7 and `05-05-PLAN.md` both explicitly require this. `05-05-SUMMARY.md` states plainly it was never performed — no human eyes, no physical device in the execution context. The verifier had neither either. Automated hunk classification and `desktop-1440` Playwright parity are not a substitute.
result: partial
desktop_half: pass — discharged by direct measurement rather than eyes. The pre-phase-05 tree (`0f0e978`) was built in a throwaway worktree and pixel-diffed against HEAD, full-page @1440, all 8 routes. Every route ≤0.28% except `/mcp` at 1.913%, and all of it is colour (see test 1). Two measurement errors were found and corrected en route: (a) a first pass reported `/` at 9.97%, which was an artifact of capturing under `reducedMotion: reduce` — phase 05's own `MotionProvider` snaps `whileInView` reveals instantly while the pre-build still animates them, so the two builds were captured at different reveal states; re-running with `no-preference` + a scroll-through pass gave 0.117%. (b) `/pricing`'s FAQ padding reparenting (commit `217c870`) looked like an SC7 violation on box geometry (padding `0` → `20px/16px`, x 93→73, w 582→622) but at 0.156% it sits in the colour-only band, confirming that commit's "visually identical, desktop included" claim.
iphone_half: BLOCKED — still needs a physical iPhone for dark theme-color browser chrome, unclipped hero bottom on `/` and `/changelog`, and the `dvh` toolbar-transition jank check inherited from test 2. No emulator substitutes for this.
blocked_by: physical-device

### 4. `touch-iphone` WebKit project — run once host libs are installed
expected: All `touch-iphone` tests pass across `overflow.spec.ts`, `touch-targets.spec.ts` and `a11y.spec.ts` for all 8 routes.
detail: Blocked — `browserType.launch` fails on missing host libraries. All 40 observed `touch-iphone` failures are identical launch errors, not code regressions. This matters beyond bookkeeping: the 7 Chromium projects that do run never emulate `hover: none`, so RESP-06's `@media (hover: hover)` gating has no automated coverage with a genuinely coarse pointer.
result: pass
resolution: RUN AND GREEN — executed in the supported environment rather than left blocked. `touch-iphone` 40/40 passed; the full matrix then ran 304 passed / 24 skipped / **0 failed** (5.2 min, CI worker count). Reconciles exactly against the local run: 264 local Chromium passes + 40 touch-iphone = 304.
command: docker run --rm -v "$PWD":/w -v /w/node_modules -v /w/.next -w /w --ipc=host -e CI=true mcr.microsoft.com/playwright:v1.62.1-noble bash -lc 'npm ci && npm run audit:responsive'
  (the anonymous volumes at /w/node_modules and /w/.next shadow the host's, so the container's Ubuntu-built modules cannot clobber the Arch-built ones)
significance: RESP-06's `@media (hover: hover)` gating now has genuine coarse-pointer coverage, and it passes. The 40 failures were never a code defect — purely the host platform.
standing_coverage: `.github/workflows/responsive-audit.yml` runs this matrix on ubuntu-latest for every push to main and every PR, so this stops being a one-off.
local_caveat: still cannot run on this workstation. Diagnosis retained below because the failure will recur locally and the misleading remedies should not be re-derived.
correction_1: the originally recorded remedy — `sudo npx playwright install-deps` — CANNOT work on this machine. It shells out to `apt-get`, and this host is CachyOS (Arch). Playwright's error text hardcodes Debian package names (`libicu74`, `libxml2`, `libflite1`) and is misleading here; it is a static distro mapping, not a live probe of the binary.
correction_2: a second recorded remedy — `sudo pacman -S flite` — was ALSO wrong. It was inferred from Playwright's Debian package names plus a naive `ldconfig -p | grep -c flite`, not from the binary's real soname requirements. `flite` was installed (0 -> 14 matches) and all 40 `touch-iphone` failures persisted unchanged.
actual_diagnosis: `ldd` over `~/.cache/ms-playwright/webkit-2336/**` is the ground truth. Playwright's WebKit is built against the Ubuntu 24.04 ABI, and Arch ships NEWER sonames that cannot satisfy it:
  - wants `libicuuc/libicui18n/libicudata.so.74`  — host has `.so.78`
  - wants `libxml2.so.2`                          — host has `.so.16`
  - wants `libjxl.so.0.8`                         — host has `.so.0.11`
  - wants `libflite_cmu_us_kal/_awb/_rms`, `libflite_cmu_grapheme_lang/_lex`, `libflite_cmu_time_awb` — Arch's `flite` package ships a different voice subset (`kal16`, `slt`, `cmulex`, `usenglish`, `cmu_indic_lex`)
  (`libwebkitgtk-6.0`, `libjavascriptcoregtk-6.0`, `libWPEWebKit-2.0`, `libwpe-1.0`, `libWPEBackend-fdo-1.0` also show as unresolved to bare `ldd` but ship inside the Playwright bundle and resolve via RPATH at runtime — those are not the blocker.)
conclusion: this is a structural platform incompatibility, not a missing package. No `pacman` install resolves it; Playwright officially supports only Debian/Ubuntu for its browser builds.
remedy_options:
  - "Container (supported path): docker run --rm --network host -v \"$PWD\":/w -w /w mcr.microsoft.com/playwright:v1.62.1-noble npx playwright test --project=touch-iphone"
  - "CI: no .github/workflows exists yet. An ubuntu-latest job running the full matrix would give this project permanent coverage instead of a one-off local run."
  - "Accept as locally unavailable and rely on the 7 Chromium projects, acknowledging that RESP-06's `@media (hover: hover)` gating then has no automated coverage under a genuinely coarse pointer."

### 5. RESP-07 runtime reduced-motion behaviour
expected: Visual confirmation (screen recording, or DevTools "Emulate CSS prefers-reduced-motion") that Framer's entrance and scroll animations — Hero's `AnimatedGroup`, section `whileInView` reveals — are actually suppressed under `prefers-reduced-motion: reduce`, while opacity/colour transitions remain.
detail: `e2e/motion.spec.ts` asserts only the absence of `animation-iteration-count: infinite`. That is a CSS keyframe check, unaffected by whether `<MotionConfig reducedMotion="user">` exists at all. `MotionProvider`'s existence and wiring are proven; its runtime effect is not tested by anything in this phase.
result: pass
resolution: discharged by measurement, not visual inspection — this item never needed a human, it needed the right probe.
method: A rAF sampler installed via `addInitScript` recorded the Hero's animated subtree geometry from first paint for 2.5s, under both `reducedMotion: no-preference` and `reduce`. `matchMedia('(prefers-reduced-motion: reduce)')` was confirmed to report `true` under emulation, isolating "Playwright not emulating" from "Framer not respecting".
evidence: no-preference — 65 distinct y values across 74 changed frames spanning 1500ms (smooth animation). reduce — 2 distinct values, 1 changed frame, 0ms span (single-frame snap, 190→178). Transform motion is genuinely suppressed at runtime.
note: a first reading called this a FAIL after seeing a ~12px delta under `reduce`; that delta is the one-frame snap, not motion. Frame-count analysis is what distinguishes the two.
gap: `e2e/motion.spec.ts` still does not encode this. Worth promoting the probe above into the suite so RESP-07 has standing regression coverage.

### 6. `.wordmark__fill` gradient `background-clip: text` — scoped exception or reimplement
expected: Either (a) grant a documented, scoped exception in `.planning/codebase/design/ANTI-PATTERNS.md` for this one decorative, non-heading, `aria-hidden` use, or (b) replace the gradient-clip fill with a non-`background-clip: text` technique (e.g. SVG glyph fill).
detail: `src/app/globals.css:440-475` defines `.wordmark__fill` using `background-clip: text` with a gradient; consumed by the Footer brand watermark at `src/components/Footer.tsx:118-121`. CLAUDE.md states the ban unconditionally ("Never use `background-clip: text` with a gradient on text — impeccable BAN 2") with no decorative-element carve-out, and no override exists in any phase artifact. Introduced during this phase's Footer redesign and surfaced by the post-gap-closure code review (`05-REVIEW.md` WR-01) — the phase's only `05-REVIEW-FIX.md` addressed the *earlier* review round's numbering, so this finding has never been through a fix pass. Confirmed still present at HEAD.
result: pass
resolution: reimplemented — no exception granted, ban stays absolute
finding: rendered at 769×103px, the effect was a metallic/chrome gradient on text — squarely the "instant AI design tell" BAN 2 exists to prevent, not an incidental technical use. Porting the same gradient into SVG `<text>` would have satisfied the ban's letter while preserving exactly the look it targets, so that route was rejected.
changed: dropped `background-image`, `background-blend-mode`, `background-size`, `background-repeat` and both `background-clip` declarations from `.wordmark__fill`; fill is now `color: var(--color-ep-fg-strong)`. Removed the now-dead `--wordmark-grain-tex` custom property.
preserved: the crafted part of the effect is the mask, not the fill — the `@property`-animated left-to-right reveal and the grain-eroded advancing edge are untouched, so hover behaviour is unchanged.
verified: computed styles now report `background-clip: border-box`, `background-image: none`, `color: rgb(244, 246, 251)`; `grep -rn "background-clip" src/` returns only the explanatory comment.

## Summary

total: 6
passed: 5
issues: 0
pending: 0
skipped: 0
blocked: 1

## Gaps

[none — no test reported a defect.]

The single remaining item is the physical-iPhone half of test 3: dark theme-color
browser chrome, unclipped hero bottom on `/` and `/changelog`, and the `dvh`
toolbar-transition jank check inherited from test 2. No emulator substitutes for
it, so it stays open until someone runs the site on a real handset.

Everything else is closed. Of the six, three were resolved by measurement rather
than by asking a human (tests 3-desktop, 4, 5) — they had been classified
"human needed" because earlier passes had no probe for them, not because they
genuinely required human judgement. The three that did require judgement
(tests 1, 2, 6) were decided by the design owner on 2026-08-01.
