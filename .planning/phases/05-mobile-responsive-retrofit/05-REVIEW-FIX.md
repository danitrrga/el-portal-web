---
phase: 05-mobile-responsive-retrofit
fixed_at: 2026-07-31T00:00:00Z
review_path: .planning/phases/05-mobile-responsive-retrofit/05-REVIEW.md
iteration: 1
findings_in_scope: 10
fixed: 9
skipped: 1
status: partial
---

# Phase 05: Code Review Fix Report

**Fixed at:** 2026-07-31
**Source review:** `.planning/phases/05-mobile-responsive-retrofit/05-REVIEW.md`
**Iteration:** 1

**Summary:**
- Findings in scope: 10 (CR-01, CR-02, WR-01..WR-08 — `fix_scope: critical_warning`)
- Fixed: 9
- Skipped: 1 (WR-08 — logged as a deferred design decision)

Both blockers are fixed, and fixing the harness did what the review predicted: it
turned `npm run audit:targets` red and exposed the real undersized targets, which
are also fixed. The now-meaningful green was obtained without weakening the guard.

One extra defect was found *by* the corrected harness during validation and fixed:
a sub-pixel measurement flake that made the suite intermittently fail on a button
that is genuinely 44px. See "Additional fix" below.

---

## Fixed Issues

### CR-01: AAA touch-target suite exempts every link inside `<li>`

**Files modified:** `e2e/touch-targets.spec.ts`, `src/components/Footer.tsx`
**Commit:** `d976281`

**Applied fix:** Replaced `el.closest("p, li")` with a discriminator that matches
SC 2.5.8's actual inline exception — an anchor is exempt only when its own parent
element also contains non-whitespace text nodes around it (i.e. it really is in
running prose). Gave the Footer nav links a real hit area with
`flex min-h-11 items-center ... md:inline md:min-h-0`.

**Verification:** With the harness corrected, a direct `getBoundingClientRect`
sweep at 390x844 across all 8 routes reproduced exactly the review's finding —
7 links at 17px tall per route, 56 total. After the Footer fix: 0 undersized on
all 8 routes.

Desktop parity checked empirically, not assumed: all 21 footer link boxes at
1440/1024/768 still measure `boxH: 17` (the original inline anchors), and rendered
text positions are unchanged. Sub-pixel `textTop` deltas of 0.01-0.04px appeared,
but an after-vs-after control run reproduced the same magnitude — they are Framer
settle jitter, not a layout change.

The review also cited the `/mcp` sticky-TOC anchors as hidden by the same
exemption. No change was needed there: that TOC is `hidden xl:block`, so below
1280px it is `display: none` and the probe skips it regardless.

---

### CR-02: `<summary>` absent from the target selector; `/pricing` FAQ controls 20px tall

**Files modified:** `e2e/touch-targets.spec.ts`, `src/app/pricing/page.tsx`
**Commit:** `217c870`

**Applied fix:** Added `summary` to the probe's selector. Moved the `px-5 py-4`
inset off the `<details>` wrapper and onto the `<summary>`, so the padding is part
of the disclosure's hit area rather than dead space around it. The answer `<p>`
absorbs the summary's new 16px bottom padding via `-mt-1` plus its own `px-5 pb-4`.

Hit area went from **20px to 52px**; the 8 FAQ controls on `/pricing` now pass.

**Desktop parity — the load-bearing part of this fix.** Padding placement changes
layout, so this was measured rather than reasoned about. A before/after comparison
of rendered *text* geometry (question text top/left/width, chevron position,
answer text top/left/width, and `<details>` height in both closed and open states)
across **five widths — 320, 390, 768, 1024, 1440 — is byte-identical**. Closed
height 54px, open height 133.171875px, question-to-answer gap 12px, all unchanged.
Only the tappable box grew.

I deliberately did not take the review's suggested `min-h-11` on the summary alone:
that meets the numeric contract but leaves the wrapper's padding visually part of
the row while being untappable.

---

### WR-01: `min-h-viewport` cannot be overridden by any Tailwind `min-h-*` utility

**Files modified:** `src/app/globals.css`
**Commit:** `5c885f1`

**Applied fix:** Nested the `@supports` block *inside* the `@utility` body rather
than moving both halves to a hand-written `@layer utilities` rule as the review
suggested. Both land inside `@layer utilities` either way, but the nested form also
keeps variant support — the review's version would have silently broken
`md:min-h-viewport` / `hover:min-h-viewport`, which currently resolve to the `vh`
value only.

**Verification:** All three of the review's failing cases now behave, measured
live against the production build:

| Case | Before | After |
|---|---|---|
| `min-h-viewport + min-h-0` @1440 | `900px` | `0px` |
| `min-h-viewport + md:min-h-0` @1440 | `900px` | `0px` |
| `min-h-viewport + min-h-11` | `900px` | `44px` |
| `md:min-h-viewport` @1440 | (fallback lost) | `900px` |
| `min-h-viewport` alone | `900px` | `900px` |

Emitted-CSS offsets confirm the cause is addressed: both `.min-h-viewport` rules
now sit at 19623/19686 inside `@layer utilities` (opens at 13017), ahead of
`.min-h-0` at 19721.

---

### WR-02: `svh` is the wrong unit for a `min-height` page floor

**Files modified:** `src/app/globals.css`, `.planning/.../05-05-SUMMARY.md`
**Commits:** `ec7ea0c`, `fc2ef10`

**Applied fix:** Switched both the `body` floor and the `.min-h-viewport` utility
from `svh` to `dvh`, and rewrote both justifying comments — they claimed the change
prevented the iOS address bar from *clipping* full-height sections, which a
`min-height` cannot do. The comments now argue the real trade-off (`svh` puts the
floor below the visual viewport when the URL bar retracts; `lvh` manufactures
phantom scroll; `dvh` tracks it in both directions).

Desktop is unaffected: with no dynamic toolbar, `100vh == 100dvh == 100svh`.

**Verification:** Emitted CSS confirms both floors survive minification —
`body{color:#cbd5e1;min-height:100vh}@supports (min-height:100dvh){body{min-height:100dvh}}`
— so the `vh` fallback for browsers without `dvh` is intact, which was the original
reason for the `@supports` wrapper. The one residual `svh` in the bundle is
Tailwind's own core `.min-h-svh` utility, not ours.

Second commit amends the RESP-05 evidence row in `05-05-SUMMARY.md`, which still
certified `svh` and would have been stale the moment this landed.

---

### WR-03: Desktop rendering is *not* unchanged

**Files modified:** `.planning/phases/05-mobile-responsive-retrofit/05-05-SUMMARY.md`
**Commit:** `9c65943`

**Applied fix:** Amended the RESP-08 evidence row and added a "RESP-08 colour
exception" section enumerating the changes, per the review's recommended remedy.
The colour changes are kept, not reverted — each is a justified AA fix, and
breakpoint-scoping them would ship a knowingly-failing desktop.

**I verified the claim independently rather than taking it on faith,** and the
count is **28**, slightly higher than the review's "~20":

| Change | Count | Files |
|---|---|---|
| `text-zinc-500` → `text-zinc-400` | 16 | `Footer.tsx` (3) · `mcp/page.tsx` (13) |
| `text-zinc-600` → `text-zinc-400` | 7 | `mcp/page.tsx` (7) |
| `FG_SUBTLE` `#5a6478` → `#8590a8` | 5 | features, manifesto, pricing, ChangelogItem, MethodologyPreview |

The review's contrast arithmetic also checks out exactly: relative luminance
0.1264 → 0.2778, contrast on `#04060c` 3.40:1 → 6.32:1.

---

### WR-04: Mobile menu has no `aria-expanded`, no `aria-controls`, no keyboard dismissal

**Files modified:** `src/components/Navbar.tsx`
**Commit:** `a3302c0`

**Applied fix:** Added `aria-expanded`, `aria-controls="mobile-nav"` and
`type="button"` to the toggle, `id="mobile-nav"` to the panel, an Escape keydown
handler bound only while the menu is open, and switched to the functional
`setMobileMenuOpen((open) => !open)` form.

**Verification:** probed on the production build at 390x844:

```
closed: {type:"button", ariaExpanded:"false", ariaControls:"mobile-nav", panel:absent, rect:44x44}
open:   {type:"button", ariaExpanded:"true",  ariaControls:"mobile-nav", panel:present, rect:44x44}
Escape → ariaExpanded:"false", panel:absent
```

I specifically checked the risk this introduces — `aria-controls` pointing at an
element that does not exist while the panel is unmounted. axe reports **0
violations in both the closed and open states**, and the dangling reference does
not even appear in `incomplete` (only `color-contrast` does), so no always-mounted
panel workaround was needed.

---

### WR-05: `FG_SUBTLE` renders identically to `FG_MUTED`

**Files modified:** `src/app/features/page.tsx`, `src/app/manifesto/page.tsx`,
`src/app/pricing/page.tsx`, `src/components/ChangelogItem.tsx`,
`src/components/MethodologyPreviewSection.tsx`
**Commit:** `c5bf453`

**Applied fix:** Took the review's second option — deleted `FG_SUBTLE` from all
five files and rewrote its 20 call sites to `FG_MUTED`, making the flattening
explicit instead of accidental. Added a comment to each file recording that the
ramp is deliberately three steps here and what restoring a fourth would require.

I did **not** take the first option (mint `--color-ep-fg-subtle-aa: #79839a`).
That changes rendered colour on five surfaces at all widths — a design-owner
decision, and one that would add a *new* desktop delta to the very phase whose
constraint is that desktop must not change.

**Verification:** zero visual change, measured not assumed. A computed-style sweep
of `color` / `background-color` / `border-top-color` / `fill` / `stroke` for every
element on `/`, `/features`, `/manifesto`, `/changelog`, `/pricing` at both
1440x900 and 390x844 — **5,114 elements, byte-identical before and after.**

---

### WR-06: Colour constants half-migrated — tokens and raw hex in the same block

**Files modified:** `src/app/features/page.tsx`, `src/app/manifesto/page.tsx`,
`src/app/pricing/page.tsx`, `src/components/ChangelogItem.tsx`,
`.planning/phases/05-mobile-responsive-retrofit/deferred-items.md`
**Commit:** `d9ff576`

**Applied fix (partial, deliberately).** Migrated `SECTION_BG`, `FG_STRONG`, `FG`
and `FG_MUTED` to their `--color-ep-*` tokens in all four files. `ChangelogItem.tsx`
had no blocking usage so its `ACCENT` / `ACCENT_LIGHT` migrated too — that file is
now fully token-backed.

**`ACCENT` / `ACCENT_LIGHT` deliberately left as raw hex in the other three files.**
The review's "finish the swap" instruction is unsafe as written: these three files
consume them as hex-alpha template literals — `${ACCENT}1f`, `${ACCENT}14`,
`${ACCENT}33`, `${ACCENT}66`, `${ACCENT_LIGHT}4d`, `${ACCENT_LIGHT}40`,
`${ACCENT_LIGHT}59` — and `var(--color-ep-accent)14` is invalid CSS, so the swap
would silently drop those declarations and break gradients and borders. This is the
"template-literal alpha trap" already documented in `01-02-PLAN.md`; the convention
is a pre-baked alpha token per opacity, and only three exist
(`--color-ep-accent-alpha-12/-08`, `--color-ep-accent-light-alpha-80`). Completing
it needs five new design tokens, which is a design-owner call. Logged in
`deferred-items.md` with the full list.

I also did **not** delete `--color-ep-fg-subtle-2` as the review suggested. It is
dead in `src/` (grep-verified, 1 reference: its own definition), but it is still a
documented rung of the ramp in `.planning/codebase/design/TOKENS.md` and the
natural starting point if a real fourth step is restored. Logged rather than
deleted — the review offered exactly this alternative.

**Verification:** same 5,114-element computed-colour sweep, still byte-identical to
the pre-WR-05 baseline. Every migrated token's value was confirmed equal to the hex
it replaced.

---

### WR-07: `<pre tabIndex={0}>` adds five unlabeled focus stops per `/mcp` visit

**Files modified:** `src/app/mcp/page.tsx`
**Commit:** `3d882c6`

**Applied fix:** Added a required `label` prop to `CodeBlock`, applied
`role="region"` + `aria-label={`${label} — code sample`}`, and named all five call
sites ("Stdio .mcp.json config", "HTTP endpoint config", "Get today's snapshot",
"Log a habit", "Morning check-in").

**Verification:** all five `pre[tabindex]` elements now report
`{tab:"0", role:"region", label:"..."}`, and axe still reports 0 violations on
`/mcp`.

**Not done:** the review also noted the global focus ring paints
`border-radius: 6px` on a `rounded-lg` (8px) `<pre>`. That rule
(`globals.css:250-254`) applies to every focusable element on the site, so changing
it alters focus rendering everywhere including desktop. Out of proportion to a
corner-radius mismatch on one element — left alone, noted here.

---

### Additional fix (found during validation, not in REVIEW.md): sub-pixel measurement flake

**Files modified:** `e2e/touch-targets.spec.ts`
**Commit:** `a9fe39c`

Running the full matrix after the CR-01/CR-02 fixes surfaced an intermittent
failure the review had not seen — `[reflow-320] / ` and `[mobile-360] / ` failing on
the Hero CTA, reported as `220x44` (a size that should pass).

**Root cause, reproduced directly under parallel load:** `getBoundingClientRect()`
returns the *transformed* border box, and Chromium computes that quad in float32
when an ancestor carries a transform. The Hero CTAs sit under a Framer
`AnimatedGroup` whose entrance spring asymptotes rather than terminating, so
`settle()` can return while a residual sub-pixel translate
(`matrix(1, 0, 0, 1, 0, 0.0188307)`) is still applied. The button reads back as
**43.99993896484375** while `offsetHeight === 44` and
`getComputedStyle().height === "44px"` on the same element. A strict `>= 44` fails
a button that is exactly 44px.

**Fix:** a 0.01px measurement tolerance — ~160x the observed 6.1e-5 error, and ~50x
smaller than one device pixel at 3x DPR, so it cannot mask a real shortfall
(genuine violations here were 17px and 20px). The sibling `overflow.spec.ts`
already carries a far looser `+ 1` px tolerance for the same class of noise. Also
changed failure reporting from `Math.round` to 2dp — rounding is what displayed a
43.6px failure as the string `"44"` and made the failure message read like a
passing measurement.

**This is pre-existing, not introduced by CR-01.** The Hero CTA has no `<p>`/`<li>`
ancestor (`el.closest("p, li") === false`, ancestor chain
`DIV > DIV > DIV > DIV > DIV > SECTION > SECTION > MAIN > DIV`), so the old harness
measured it too and simply got lucky.

**Verification:** three consecutive full-matrix runs, 208 passed each time, zero
non-WebKit failures.

---

## Skipped Issues

### WR-08: The `brand` variant's pill radius is always destroyed by the size variants

**File:** `src/components/ui/button.tsx:22-23, 27-36`
**Reason:** skipped — fix requires a design-owner decision and would violate this
phase's hard constraint. Logged in `deferred-items.md` (commit `bfaa1ed`) with the
verified measurement and the exact one-line change ready to apply.

**Original issue:** `variant.brand` sets `rounded-full` but `size.sm|lg|xs|icon-xs`
each set `rounded-md`; `tailwind-merge` resolves the conflict to the last class, so
no brand CTA is a pill despite CLAUDE.md specifying one.

**I confirmed the finding is factually correct** before deciding — measured
`borderRadius` on all 8 `[data-slot=button]` elements on `/` at both 1440x900 and
390x844: every one is `8px`, including `heroCta` (`brand`/`lg`) and `navSignUp`
(`brand`/`sm`).

**Why skipped anyway:** the fix changes the rendered radius of the hero CTA and the
nav Sign Up button from 8px to a full pill **at every width, desktop included**.
That is precisely the frozen-desktop change RESP-08 forbids, and it alters the most
visible element on the site. The defect is pre-existing and is really a mismatch
between CLAUDE.md's stated intent and the approved design that shipped —
reconciling those two is a design-owner call, not a mechanical review fix. Applying
it silently would be a larger, less reversible risk than the defect itself.

---

## Validation

All commands run against the worktree after the final commit.

| Check | Result |
|---|---|
| `npx tsc --noEmit` | **exit 0**, clean |
| `npm run typecheck:e2e` | **exit 0**, clean |
| `npm run lint` | **exit 0** — 0 errors, 2 warnings, both pre-existing (IN-01, out of scope: unused `FG_MUTED` in `changelog/page.tsx`, unused `ACCENT_LIGHT` in `manifesto/page.tsx`) |
| `npm run build` | **succeeds**; all 8 content routes plus `/_not-found` and `/icon.svg` remain `○ (Static)` — nothing became dynamic |
| `npm run audit:responsive` | **208 passed, 24 skipped, 32 failed** — all 32 failures are the `touch-iphone` WebKit project. Stable across 3 consecutive full runs. |
| `npm run audit:targets` | 32 passed, 24 correctly skipped at `>=768px`, 8 `touch-iphone` failures |

**The `touch-iphone` (WebKit) project was not exercised.** It cannot launch in this
environment — `Host system is missing dependencies` (`libicu74`, `libxml2`,
`libflite1`), which needs root. This is pre-existing and already logged in
`deferred-items.md`. All 32 of its tests fail identically on browser launch, before
any page loads, so none of them reflect on the changes in this pass. Everything
reported above was validated on the 7 Chromium-based projects that do run
(`reflow-320`, `mobile-360`, `mobile-390`, `mobile-430`, `tablet-768`,
`laptop-1024`, `desktop-1440`) plus `reduced-motion`.

Consequently `touch-iphone` remains the only project emulating
`hover: none` / `pointer: coarse`, so the `@media (hover: hover)` gating from this
phase is still unverified by CI — unchanged from what the review reported.

**Desktop parity (RESP-08).** Every change in this pass was checked against the
frozen desktop design empirically rather than by inspection:
- `/pricing` FAQ rendered text geometry: identical at 320/390/768/1024/1440.
- Footer link boxes at 768/1024/1440: still 17px inline anchors, unchanged.
- Computed colour of 5,114 elements across 5 routes x 2 widths: identical.
- WR-04 and WR-07 are attribute-only; WR-01/WR-02 resolve identically at desktop
  (`100vh == 100dvh` with no dynamic toolbar).

The one intentional exception is the pre-existing colour delta WR-03 documents,
which is now enumerated in `05-05-SUMMARY.md` rather than denied.

---

_Fixed: 2026-07-31_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
