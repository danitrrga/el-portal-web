# Phase 5: Mobile Responsive Retrofit — Research

**Researched:** 2026-07-30
**Source:** Four parallel research agents (Tailwind v4 responsive · Playwright harness ·
a11y/WCAG automation · mobile CWV + Framer Motion perf), then verified against this
codebase. Only the actionable, El-Portal-specific conclusions are kept here.

> Everything below was checked against the installed versions in this repo
> (Next 16.1.6, Tailwind 4.2.1, Motion 12.34.3, Playwright 1.62.1) — not taken from
> docs at face value. Where a widely-repeated claim turned out to be v3-only or
> version-specific, it is flagged.

---

## 1. Tailwind v4 specifics that change the work

**`hover:` is already gated.** v4 compiles `hover:` to
`@media (hover: hover) { &:hover }`. In v3 this required
`future.hoverOnlyWhenSupported`. **Any guide telling you to enable that flag or install
a touch plugin is v3 advice.** Consequence: the TSX utility hovers need no change; only
hand-written CSS does.

**Container queries are core** — do not install `@tailwindcss/container-queries`.
Three footguns, all live here:
1. `--container-*` is a shared namespace — it drives both `max-w-*` and the `@md:`
   variants. Adding one mints both.
2. `@container` becomes the containing block for `position: fixed` descendants.
   **Never wrap anything containing `Navbar`.**
3. `@container-size` needs Tailwind ≥4.3; this repo is on **4.2.1**. Only inline-size
   `@container` works. A stray `cqw` outside a container silently resolves as `svw`.

**Breakpoints are rem and compile to range syntax** (`@media (width >= 48rem)`).
`theme(screens.md)` is v3; v4 is `theme(--breakpoint-md)`.

**Fluid type belongs in a plain `@theme` block, not `@theme inline`.** The existing
block is `inline` because it aliases `var(--sidebar-ring)` etc.; `inline` resolves
`var()` at definition site, which is wrong for self-contained `clamp()`.

**Safe-area:** there is no native `pt-safe` in v4 (still an open discussion). Use
`@utility` or arbitrary values — and note arbitrary values **must not contain spaces
after commas**: `pb-[max(1.5rem,env(safe-area-inset-bottom))]`. This is the #1 reason
safe-area arbitrary values silently fail to compile. *(Moot unless `viewport-fit=cover`
is adopted, which CONTEXT.md rejects.)*

---

## 2. Fluid typography — the two rules

```
slope     v = 100 × (y₂ − y₁) / (x₂ − x₁)     → vw
intercept r = (x₁y₂ − x₂y₁) / (x₁ − x₂)       → px, ÷16 for rem
font-size: clamp(y₁rem, {v}vw + {r}rem, y₂rem);
```

1. **The `+ Nrem` term is mandatory.** Browsers do not scale `vw` on zoom; a pure-`vw`
   preferred value is frozen at 400% zoom — a WCAG 1.4.4 failure.
2. **`max ≤ 2.5 × min`.** The derived ceiling for guaranteeing 200% resize.

`.wordmark__layer` (`globals.css:366`) violates both: `clamp(1.9rem, 8.6vw, 7.6rem)` —
no rem term, 4× ratio. Deferred, but do not copy the pattern.

---

## 3. Viewport units

`svh` = UI expanded, static, never clips. `lvh` = UI retracted (equals legacy `vh`).
`dvh` = tracks live.

**`dvh` is a CLS *source*, not a CLS fix.** Dynamic values are throttled/debounced
rather than updated at 60fps, and address-bar collapse happens *during scroll* —
which gets no `hadRecentInput` exemption, so those shifts are charged in full.

Use the two-declaration cascade fallback; no `@supports` needed:
```css
body { min-height: 100vh; min-height: 100svh; }
```
Baseline Widely Available since June 2025 (~95%). **DevTools emulation cannot reproduce
address-bar behaviour** — this one needs a real device.

Known WebKit bug 261185: on iOS, `svh` and `dvh` are unexpectedly equal when the Safari
tab bar isn't visible.

---

## 4. WCAG numbers that gate this phase

| Criterion | Requirement | Automatable? |
|---|---|---|
| **2.5.8 Target Size (Min), AA** | 24×24 CSS px | ✅ axe `target-size` — **but disabled by default** in axe-core until WCAG 2.2 is more widely adopted. Must be opted in (the harness does). |
| **2.5.5 Target Size (Enhanced), AAA** | 44×44 CSS px | ✅ custom spec (`touch-targets.spec.ts`) |
| **1.4.10 Reflow** | No 2-D scrolling at 320 CSS px (≡ 1280px @ 400% zoom) | ⚠️ No axe rule. Scriptable — the harness does it. Cannot judge "loss of information". |
| **1.4.4 Resize Text** | 200% without loss | ⚠️ Overlaps reflow; the clamp ratio rule covers the type side. |
| **2.4.7 Focus Visible** | — | ❌ Manual. No axe rule, no Lighthouse audit. |
| **2.4.11 Focus Not Obscured** | — | ❌ Manual. Relevant: the sticky nav over anchored sections. |
| **1.4.3 Contrast** | 4.5:1 | ✅ but returns `incomplete` on gradient/glass/semi-transparent backgrounds — i.e. most of this site. The harness reports these separately rather than failing them. |

**Calibrate expectations on automation:** Deque's widely-cited "57%" is *by issue
volume*, not by success criteria. The share of WCAG SCs that are machine-testable is
**20–30%**. Automation is a regression net, not a compliance certificate.

SC 2.5.8 exceptions worth knowing: inline targets constrained by line-height (the
harness already excludes links inside `p`/`li`); an equivalent control elsewhere on the
page; UA-controlled sizing; essential presentation; or the spacing exception (a 24px
circle centred on each undersized target must not intersect another's).

---

## 5. Motion and mobile performance

**Do not blanket-disable animation on mobile.** `whileInView` uses a pooled
`IntersectionObserver` and settles into compositor-only `transform`/`opacity`. Motion
v12 hardware-accelerates `useScroll`. Killing entrances costs brand feel for ~nothing.

**Property cost tiers:**

| Tier | Properties |
|---|---|
| Safe everywhere | `transform`, `opacity` |
| Patchy | `filter`, `clipPath`, `background-color` |
| Paint-only | `box-shadow`, `border-radius` |
| **Never** | `height`, `width`, `padding`, `top`/`left` — full render cycle, ~100ms |

**Three things worth gating:**
1. **`prefers-reduced-motion`** — Motion's default is *not* `reducedMotion: "user"`, so
   today only `.wordmark` honours it. `<MotionConfig reducedMotion="user">` disables
   transform and layout animations while preserving opacity and colour. This is an
   accessibility requirement, not a perf tweak — and it makes Playwright's
   `reducedMotion` emulation actually meaningful.
2. **Continuous scroll-linked parallax** — gate with `@media (pointer: coarse)`.
3. **`backdrop-filter`** — the likeliest real jank source here. Blur is a convolution:
   cost scales with area × radius. **`will-change` makes animated blur worse, not
   better** — Chrome measured ~90ms frames, because each promoted texture must be
   re-blurred every frame. Static blur is fine; animated or scroll-linked blur is not.
   Practical mobile budget: 3–5 simultaneous blurred surfaces.

**Motion gotcha:** the individual-transform shorthand (`x: 100, scale: 2`) is implemented
via CSS variables, which are **not** accelerated. A full `transform` string is the fast
path. The ergonomic API is the slow one.

**Framer entrance states are an overflow source.** `initial={{ x: -150 }}` on a
full-width element puts the start state off-screen and widens the document on first
paint. Prefer `opacity` + small `y`. *(This is why the harness `settle()`s before
measuring.)*

---

## 6. Harness mechanics the executor must respect

- **Playwright's `animations: 'disabled'` does not stop Motion.** It stops CSS
  animations, CSS transitions, and Web Animations only. Motion runs a hybrid engine and
  falls back to a main-thread rAF driver for springs and for `useScroll`/`useTransform`.
  Use `gotoSettled()` from `e2e/support/pages.ts`; never a bare `page.goto`.
- **The probe force-unclips the viewport** (`overflow-x: visible` on `html, body`), so
  it reports overflow you cannot see in a browser. That is intentional — the clipping is
  the bug.
- **Port 3987, `reuseExistingServer: false`.** The El Portal *app* holds 3000 and 3100
  on this machine; the first bring-up run silently audited that app instead.
- **An empty offender list ≠ no overflow.** On `/changelog` the root `scrollWidth`
  assertion caught 27px the per-element sweep missed. Trust the root assertion.
- **`reducedMotion` is not a top-level `use` option** in Playwright 1.62 — it belongs
  under `contextOptions`.
- `e2e/` is excluded from the Next build; type-check it with `npm run typecheck:e2e`.

---

## 7. Environment landmine (already hit once)

`npm run build` failed with `Cannot find module '../lightningcss.linux-x64-gnu.node'`.
`package-lock.json` lists the Linux binary, but npm had installed only
`lightningcss-win32-x64-msvc` — the npm optional-dependency bug. Repaired via
`npm install lightningcss-linux-x64-gnu@1.31.1 --no-save`. **If it recurs after a fresh
clone: `rm -rf node_modules && npm ci`.** Nothing is verifiable until the build is green.

---

## 8. Deliberately rejected

| Rejected | Why |
|---|---|
| Nonce-based CSP | Forces every page dynamic, kills CDN caching and PPR, and still breaks Motion's inline `style` *attributes* (nonces don't apply to style attributes). *(Phase 6 concern.)* |
| `viewport-fit=cover` | Default `auto` letterboxes automatically; opting in means safe-area plumbing across Navbar/Footer/menu for no visual gain. |
| Chromatic / Percy / Argos / Lost Pixel | 8 routes × 6 viewports = 48 baselines regenerated on every intentional tweak. Negative value for a solo dev on a design that is actively being polished. |
| Cross-browser matrix (Firefox + WebKit × 6) | 18 projects, ~3× runtime. `isMobile` isn't even supported in Firefox. One WebKit project on `/` at 390px would be the only worthwhile addition. |
| `pa11y-ci` alongside Playwright | Second browser stack, lower detection rate, higher false positives, same 8 URLs. |
| Vitest / RTL | Almost nothing in `src/` has testable logic. |
| Real-device clouds | Emulated viewports catch >95% of this bug class. Reserve BrowserStack free minutes for a pre-launch pass. |

---

## Sources

Tailwind v4 responsive/theme/hover docs · W3C WAI Understanding SC 1.4.10 / 2.5.5 /
2.5.8 · Deque axe-core rule descriptions + automated-coverage study · Playwright
emulation / test-snapshots / CI docs · Next.js Image + generateViewport (v16.2) ·
Motion performance, useScroll, and accessibility docs · Chrome Developers animated-blur ·
web.dev vitals / optimize-cls / viewport-units · MDN `env()`, container queries,
`backdrop-filter` · WebKit bug 261185.
