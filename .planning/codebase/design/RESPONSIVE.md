# Responsive & Mobile

> Part of the El Portal design system. Read [`README.md`](./README.md) first for the
> **🔒 LOCKED / 📦 CURRENT / 🛠 DEBT / ⚠️ OPEN** convention used throughout.
>
> This file is the responsive contract. `gsd-ui-researcher` seeds phase UI-SPECs from it;
> `gsd-ui-checker` / `gsd-ui-auditor` enforce it; the mobile-audit fleet
> ([`../../responsive/AUDIT-BRIEF.md`](../../responsive/AUDIT-BRIEF.md)) audits against it.

---

## 🔒 Scope

| Rule | Value |
|---|---|
| **Minimum supported viewport** | **360px**. Everything must be usable and unclipped at 360×800. Below 360 is out of scope. |
| **WCAG reflow floor** | **320px** (SC 1.4.10). Narrower than the design floor, and a stricter, purely-automated check — no horizontal scrolling at 320px. |
| **Desktop design** | **Frozen.** The current desktop rendering is approved and must not change. Responsive work is *additive*. |
| **Theme** | Dark-mode only, unchanged. No light-mode responsive variants. |

### 🔒 The additive rule

Every fix takes the shape **"mobile-first default + `md:`/`lg:` that restores today's desktop value."**
Never change a value that is already correct at ≥768px.

```tsx
// ✅ Additive — desktop unchanged, mobile fixed
<div className="flex-col gap-4 md:flex-row md:gap-8">

// ❌ Rewrites the desktop design
<div className="flex-col gap-6 lg:flex-row lg:gap-6">
```

A responsive PR that alters desktop rendering is a **failed** PR, however good it looks.

---

## 🔒 Breakpoints

Tailwind v4 defaults. No custom `--breakpoint-*` — the existing scale is sufficient and
overriding it invalidates every `md:` already in the codebase.

| Variant | Min width | Role |
|---|---|---|
| *(none)* | 0+ | **The mobile design.** Single column, full-bleed-safe. This is the default, not the fallback. |
| `sm:` | 40rem / 640px | Minor adjustments |
| `md:` | 48rem / 768px | 2-column grids, expanded padding — the main phone↔tablet switch |
| `lg:` | 64rem / 1024px | 3-column grids |
| `xl:` | 80rem / 1280px | Rare |

**v4 note:** these compile to CSS range syntax `@media (width >= 48rem)`, not `min-width`,
and the values are **rem, not px**. Any doc or snippet using `theme(screens.md)` is v3 and
will not work — v4 uses `theme(--breakpoint-md)`.

### Test matrix

`360×800` · `390×844` · `430×932` · `768×1024` · `1024×768` · `1440×900`, plus `320×512`
for the WCAG reflow check only.

---

## 🔒 Container queries — when, and the three footguns

Container queries are **core in Tailwind v4** — do **not** install `@tailwindcss/container-queries`
(that's the v3 plugin; it's redundant here).

| Use viewport `md:` | Use container `@md:` |
|---|---|
| Page shell, `max-w-5xl px-6 md:px-8` | A section component that could render at more than one column count |
| Navbar's desktop↔mobile switch (nav is viewport-anchored by definition) | Card internals: icon-above vs icon-beside, meta row wrapping |
| Hero H1 sizing | Anything you'd write `md:` on and then have to override when reused |

```tsx
// Parent grid: viewport breakpoints (page-level concern)
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {/* Each card responds to ITS OWN width, not the window */}
  <article className="@container rounded-xl border border-[var(--color-ep-hairline)]">
    <div className="flex flex-col gap-4 p-6 @sm:flex-row @sm:items-start">…</div>
  </article>
</div>
```

### 🛠 Footguns — all three are live risks in this repo

1. **`--container-*` is a shared namespace.** It drives both `max-w-*` sizing utilities *and*
   the `@md:` container variants. Adding `--container-prose: 65ch` to `@theme` silently mints
   both `max-w-prose` **and** an `@prose:` variant. This repo already has a large `@theme inline`
   block — be deliberate.
2. **`@container` becomes the containing block for `position: fixed` descendants.**
   `container-type: inline-size` applies layout containment. **Never put `@container` on any
   wrapper containing `Navbar`** — the fixed nav would position against the container, not the viewport.
3. **`@container-size` requires Tailwind ≥4.3.** This repo is on **4.2.1**, so only
   inline-size `@container` works. `cqh`/`cqb` queries are unavailable. Also: a stray `cqw`
   outside any container silently resolves as `svw` rather than erroring.

---

## 🔒 Fluid typography

### The formula

For min size `y₁` at viewport `x₁`, max `y₂` at `x₂` (px):

```
slope     v = 100 × (y₂ − y₁) / (x₂ − x₁)          → vw
intercept r = (x₁y₂ − x₂y₁) / (x₁ − x₂)            → px, ÷16 for rem

font-size: clamp(y₁rem, {v}vw + {r}rem, y₂rem);
```

### 🔒 Two non-negotiable rules

1. **The `+ Nrem` term is mandatory.** Browsers do **not** scale `vw` units on zoom. A preferred
   value of pure `vw` is frozen at 400% zoom — an outright WCAG 1.4.4 failure.
2. **`max ≤ 2.5 × min`.** This is the derived accessible ceiling for guaranteeing 200% resize.
   Prefer `≤2×`.

### 📦 Where fluid type goes

Add to a **plain `@theme` block, NOT `@theme inline`.** The existing block is `inline` because
it aliases `var(--sidebar-ring)` etc.; `inline` resolves `var()` at definition site, which is
wrong for self-contained `clamp()` values.

```css
@theme {
  /* Each pair satisfies max ≤ 2.5 × min. Band: 380px → 1280px. */
  --text-fluid-base: clamp(0.9375rem, 0.222vw + 0.884rem, 1.0625rem); /* 15 → 17 */
  --text-fluid-base--line-height: 1.6;

  --text-fluid-2xl: clamp(1.75rem, 1.556vw + 1.380rem, 2.625rem);     /* 28 → 42 */
  --text-fluid-2xl--line-height: 1.1;
  --text-fluid-2xl--letter-spacing: -0.012em;

  --text-fluid-hero: clamp(2.125rem, 2.667vw + 1.492rem, 3.625rem);   /* 34 → 58 */
  --text-fluid-hero--line-height: 1.02;
  --text-fluid-hero--letter-spacing: -0.012em;
}
```

### 🛠 DEBT — `.wordmark__layer`

`globals.css:366` is `clamp(1.9rem, 8.6vw, 7.6rem)` — **no `rem` term** and a **4× ratio**.
It violates both rules above. Decorative footer text, so low practical harm, but it is the exact
anti-pattern this section exists to prevent. Rewrite as `clamp(1.9rem, 7.4vw + 0.42rem, 4.75rem)`
when the footer is next touched. Also carries `white-space: nowrap` — verify at 360px.

### 🔒 Minimum sizes

No body or UI text below **14px** on mobile. The `text-[10px]` / `text-[11px]` fixed sizes in
`SystemBlueprintSection`, `VCDSection`, and `MethodologyPreviewSection` are 🛠 DEBT.

---

## 🔒 Viewport units

| Unit | Use |
|---|---|
| **`dvh`** | **The default for full-height work here.** See the amendment below. |
| `svh` | Small viewport = browser UI expanded. Static, never clips. Correct when a *fixed* height must never change. |
| `lvh` | Rarely. Equals legacy `vh`. |
| `vh` | Legacy. On iOS Safari it resolves to the *large* viewport, so a `100vh` hero has its CTA cut off below the fold on load. |

**Amendment (phase 05 UAT item 2, design-owner decision).** This table previously
made `svh` the default and `dvh` conditional. That ordering rested on the claim that
`svh` "never clips" — but every full-height rule on this site is a `min-height`
floor, and a `min-height` cannot clip its content regardless of unit. The stated
reason for preferring `svh` therefore did not apply. Code review WR-02 corrected the
implementation to `dvh` (`globals.css` lines ~213, ~231–234, ~380–385); this table
and REQUIREMENTS.md RESP-05 are now corrected to match, rather than leaving the
contract contradicting the code.

The jank caveat below still stands and is the reason `dvh` is not a blanket default:
it re-resolves as the toolbar animates. Outstanding: a physical-iOS check that the
decorative overlays (ReadingLayout glow/grain, `.glass-panel` blur) do not visibly
jank during toolbar transitions. Tracked as the remaining half of UAT item 3.

**Never animate to/from `dvh`** — the target moves mid-animation.
**None of these account for the virtual keyboard** (irrelevant here — no forms).

### 🛠 DEBT — `globals.css:211`

`body { min-height: 100vh }`. Harmless as a floor today, but it's the wrong default. Fix via
two-declaration cascade fallback (no `@supports` needed):

```css
body {
  min-height: 100vh;   /* ~5% of browsers */
  min-height: 100svh;  /* modern */
}
```

Baseline Widely Available since June 2025; ~95% support. Note DevTools emulation does **not**
reproduce iOS address-bar behaviour — this needs a real device to verify.

---

## ⚠️ OPEN → 🔒 RESOLVED: safe-area insets

`env(safe-area-inset-*)` resolves to **`0px` unless `viewport-fit=cover` is set**. This repo
sets no viewport at all, so safe-area is currently inert.

**Decision: do NOT adopt `viewport-fit=cover`.** With the default `auto`, the browser letterboxes
content inside the safe area automatically. The site has no edge-to-edge immersive media that
would justify opting in, and opting in means `Navbar` needs `pt-safe px-safe`, `Footer` needs
`pb-safe`, and the mobile menu overlay needs both — ongoing cost for no visual gain.

### 🔒 But DO add the viewport export

`src/app/layout.tsx` has **no `viewport` export**, so mobile browser chrome renders a default
light color against a `#02030a` page.

```tsx
import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#02030a',  // --color-ep-bg-base
  colorScheme: 'dark',
}
```

**Never add `maximumScale: 1` or `userScalable: false`.** They appear in the Next.js docs example
"for completeness" and they block pinch-zoom — a WCAG 1.4.4 violation.

---

## 🔒 Touch targets

| Standard | Size | Status here |
|---|---|---|
| WCAG 2.2 SC 2.5.8 (AA) | **24×24 CSS px** | Hard floor. Non-negotiable. |
| WCAG 2.2 SC 2.5.5 (AAA) | **44×44 CSS px** | **Our target.** Every tap is a conversion on a marketing site. |

SC 2.5.8 exceptions: inline targets constrained by line-height; targets with an equivalent
control elsewhere on the page; UA-controlled sizing; essential presentation; **or** spacing —
a 24px-diameter circle centred on each undersized target must not intersect another's.

Grow the hit area without changing the visual:

```tsx
// Visually 28px, tappable 44px
<button className="relative inline-flex size-7 items-center justify-center
                   after:absolute after:left-1/2 after:top-1/2 after:size-11
                   after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']">
```

Or just put `size-11` on the button with a smaller icon inside — cleaner, and the right fix
for `Navbar`'s hamburger.

Use `pointer-coarse:` to **upsize**, never to restyle:
```tsx
<a className="px-4 py-2 pointer-coarse:px-5 pointer-coarse:py-3">
```
⚠️ `pointer-coarse` is **not** "is mobile" — it reports the *primary* pointer. A touchscreen
laptop reports coarse primary with `any-pointer: fine` also true.

---

## 🔒 Hover on touch

**Tailwind v4 gates `hover:` automatically** — it compiles to `@media (hover: hover) { &:hover }`.
This was an opt-in `future.hoverOnlyWhenSupported` flag in v3; it is core behaviour in v4.
**Every blog post telling you to enable that flag or install a touch plugin is v3 advice.**

Consequence: the ~40 `hover:` utilities across the TSX are already touch-safe.

### 🛠 DEBT — hand-written CSS is NOT gated

`globals.css` rules bypass the variant system entirely and latch on tap:

```css
@media (hover: hover) {
  .card-glow:hover::before          { opacity: 1; }
  .wordmark:hover .wordmark__outline { opacity: 0.6; }
  .wordmark:hover .wordmark__fill    { --wordmark-reveal: 117%; }
}
```

🔒 **Any new hand-written `:hover` rule in `globals.css` must be wrapped in
`@media (hover: hover)`.** Utilities need no wrapper.

---

## 🔒 Motion on mobile

**Do not blanket-disable animation on mobile.** Entrance animations via `whileInView` use a
pooled `IntersectionObserver` and settle into compositor-only `transform`/`opacity` — they are
cheap, and killing them costs brand feel for near-zero gain. Motion v12 hardware-accelerates
`useScroll`.

Three things **do** get gated:

### 1. 🔒 `prefers-reduced-motion` — accessibility, not performance

Framer Motion's default is **not** `reducedMotion: "user"`, so today only `.wordmark` honours
the OS setting. One root-level fix covers everything:

```tsx
<MotionConfig reducedMotion="user">{children}</MotionConfig>
```

This also makes Playwright's `reducedMotion: 'reduce'` emulation actually do work in tests.

### 2. 🔒 Continuous scroll-linked effects

Per-scroll-frame parallax reads as noise on a 6-inch screen anyway:

```css
@media (pointer: coarse) { .parallax-layer { transform: none !important; } }
```

### 3. 🛠 `backdrop-filter` — the likeliest real jank source here

`.glass-panel` uses `backdrop-filter: blur(20px) saturate(1.5)`; `Navbar` stacks `backdrop-blur-xl`.
Backdrop blur forces an expensive off-thread raster of everything behind the element, re-run
whenever the backdrop changes. **This costs more on mobile than every entrance animation combined.**

```css
@media (pointer: coarse) {
  .glass-panel { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
}
```

### ❌ Never gate motion by rendering different trees

```tsx
// ❌ Hydration mismatch in RSC, ships both trees, shifts layout
{isMobile ? <MobileHero /> : <DesktopHero />}
```
Gate with CSS. (The dead `container-scroll-animation.tsx` does exactly this via a
`window.innerWidth` state — one more reason it stays deleted rather than fixed.)

---

## 🔒 Reflow — WCAG 2.2 SC 1.4.10

> Content presented without loss of information or functionality, and **without requiring
> scrolling in two dimensions**, at a width equivalent to **320 CSS pixels**.

320px ≡ a 1280px viewport at 400% zoom. Exceptions exist for content requiring 2-D layout —
images, video, data tables, diagrams, maps. Mark those explicitly so the automated check stays
honest instead of being weakened:

```tsx
<div data-reflow-exempt className="overflow-x-auto">…</div>
```

🔒 An element may scroll *itself* horizontally (`overflow-x: auto`) — that is a legitimate
pattern for code blocks. The **page** must never scroll horizontally.

---

## ❌ Responsive anti-patterns

Additions to [`ANTI-PATTERNS.md`](./ANTI-PATTERNS.md); the bans there still apply.

| Never | Why |
|---|---|
| **`overflow-x: hidden` on `body`/`html` to "fix" overflow** | Hides the symptom and makes every overflow bug invisible to eye and test alike. Find the offending element. *(Currently live at `layout.tsx:50` — 🛠 DEBT, see S-01.)* |
| Fixed `w-[NNNpx]` on anything that renders at mobile widths | Guaranteed overflow below `NNN`px. Use `max-w-*` + `w-full`, or clamp. |
| `100vh` for full-height sections | iOS Safari clips the bottom on load. Use `svh`. |
| `maximumScale: 1` / `userScalable: false` | Blocks pinch-zoom. WCAG 1.4.4 failure. |
| Pure-`vw` preferred value in `clamp()` | Doesn't scale on zoom. Always `Nvw + Mrem`. |
| `max > 2.5 × min` in a type `clamp()` | Fails the 200%-resize guarantee. |
| Hiding content on mobile with `hidden md:block` as the *fix* | Mobile users lose information. Acceptable only for genuinely decorative elements — and then it should be `aria-hidden` anyway. |
| JS `window.innerWidth` branching to pick a layout | Hydration mismatch, double payload, layout shift. Use CSS. |
| `@container` on a wrapper containing `position: fixed` children | Containment re-parents the fixed positioning context. |
| Un-gated `:hover` in hand-written CSS | Latches on tap. Utilities are auto-gated; raw CSS is not. |
| `transition-all` (already banned) — **especially** on `backdrop-filter` elements | Makes the browser watch every animatable property including the filter. |

---

## Cross-references

- [`TOKENS.md`](./TOKENS.md) — the breakpoint table there is the same scale; this file supersedes it on detail.
- [`MOTION.md`](./MOTION.md) — easing, duration, stagger. This file adds only the mobile gating rules.
- [`TYPOGRAPHY.md`](./TYPOGRAPHY.md) — the type scale. This file adds the fluid-clamp construction rules.
- [`../../responsive/SURFACES.md`](../../responsive/SURFACES.md) — per-surface inventory and the live findings list.
