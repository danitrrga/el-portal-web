# Codebase Concerns

**Analysis Date:** 2026-06-12

## Design Token Inconsistency — Hardcoded Colors vs. OKLCH System

**Issue:** Terms and Privacy pages use `zinc-*` and raw hex colors while global tokens are defined in OKLCH in `globals.css`. The brand design calls for an ink-blue palette with tinted neutrals, but these pages bypass the token system.

**Files affected:**
- `src/app/terms/page.tsx` — lines 13, 29, 32, 40, 43, 64, etc. use `bg-zinc-950`, `text-zinc-100`, `text-zinc-400`, `text-zinc-500`, `text-zinc-300`, `text-zinc-600`
- `src/app/privacy/page.tsx` — lines 13, 28, 31, 34, etc. use same `zinc-*` scale
- `src/components/CalloutCard.tsx` — line 32 uses `bg-[#0a0a0a]` (pure black), line 42 uses `font-serif italic` (banned for headings per .impeccable.md)

**Impact:** Creates visual drift between pages. Terms/Privacy feel disconnected from the brand identity—they lack the blue-tinted atmospheric depth specified in .impeccable.md. The `zinc-*` scale reads as gray instead of blue-tinted, violating the color philosophy. Maintenance burden increases when tokens are updated later (phase-2 token migration).

**What should happen:**
- Pages should use OKLCH tokens from `--color-*` CSS variables or Tailwind aliases that inherit them
- Backgrounds should tint toward blue (`--color-bg-base`, `--color-bg-raised`)
- Text should shift from neutral to blue-gray (`--color-fg-default`, `--color-fg-muted`)
- The italic Instrument Serif convention in CalloutCard (line 42) is retired as of 2026-05-26

**Do this instead:** Refactor `terms/page.tsx` and `privacy/page.tsx` to use the design token palette and match the atmospheric dark-mode color language of the home page. Update CalloutCard to use proper heading utility instead of serif italic.

---

## Animation Performance Anti-Patterns

### 1. Text Shadow on Every Frame

**What happens:** `PerformanceMetric.tsx` lines 103–104 animates `textShadow` as a style transform:
```typescript
animate={hasAnimated ? {
    textShadow: "0 0 40px rgba(30, 64, 175, 0.4), 0 0 12px rgba(255, 255, 255, 0.1)"
} : { textShadow: "none" }}
```

**Why it's wrong:** Text shadow changes trigger layout recalculations and repaints on every animation frame. This is a main-thread blocking operation. The `.impeccable.md` spec (line 152) explicitly bans `useAnimationFrame` for decorative motion and requires GPU-composited transforms only (transform/opacity). Text shadows fall outside that constraint.

**Files:** `src/components/animations/PerformanceMetric.tsx` lines 102–104

**Fix:** Remove the animated textShadow. Apply the glow as a static CSS class on the final element instead, or use a GPU-accelerated box-shadow on a pseudo-element that's already composited.

### 2. Overuse of `animate-pulse` on Decorative Elements

**What happens:** `DashboardPreview.tsx` line 63 and line 108 use `animate-pulse` — a Tailwind utility that creates infinite loop animation on what appears to be a decorative indicator.

**Why it's wrong:** `.impeccable.md` rule (Emil's rule 1, line 167): "perpetual motion on a landing page = remove". The `animate-pulse` runs indefinitely (`animation: pulse 2s cubic-bezier... infinite;`), which violates the "stillness is default" philosophy. Eye movement is exhausting on dark-mode pages.

**Files:** `src/components/DashboardPreview.tsx` lines 63, 108

**Impact:** Visual fatigue. On a page meant to feel "disciplined and atmospheric," infinite animation on passive decorative elements breaks the quietness contract.

**Fix:** Remove the `animate-pulse` class entirely. The "CYCLE 1 ACTIVE" indicator should be static. If pulsing is needed, gate it to hover/interactive state only (entrance animation on mount, not looped).

### 3. Hardcoded glow shadows (potential main-thread impact)

**What happens:** Throughout the codebase, drop-shadow filters and box-shadow glow effects are applied inline:
- `DashboardPreview.tsx` line 10: `shadow-[0_0_10px_rgba(30,64,175,0.5)]`
- `PerformanceMetric.tsx` line 39: `shadow-[0_0_40px_-10px_rgba(30,64,175,0.2)]`
- Many other hardcoded drop-shadow values

**Why it's concerning:** Shadows that blur across large areas (40px+ blur radius) on frequently-repainted surfaces cause expensive shadow calculation work. When combined with scroll or animation, this compounds repainting cost.

**Impact:** Lower frame rate during scroll-triggered animations (e.g., `MethodologyPreviewSection`, hero entrance). Performance especially bad on mid-range mobile devices.

**Fix:** Reserve large-radius glows (40px+) for static hero/CTA sections only. Use smaller or no glows (2-8px) on cards that move, fade, or hover. Batch shadow definitions into dedicated CSS classes so they're pre-painted rather than recalculated.

---

## Font Stacks — Missing Fallbacks for Brand Font

**Issue:** Special Gothic Expanded One (brand display font) has no fallback spec in layout/globals.

**Files:**
- `src/app/globals.css` line 243: defines `.display` utility but references `--font-special-gothic-expanded` with only one fallback: `"Arial Black"`

**Impact:** If the font fails to load (CDN issue, slow network, no WOFF2 support), headings render in Arial Black instead of a closer substitute. The design intention is lost.

**Fix:** Expand the fallback stack. Consider:
```css
.display {
  font-family: var(--font-special-gothic-expanded), "Futura", "ITC Avant Garde Gothic", "Arial Black", sans-serif;
}
```

---

## Accessibility Gaps

### 1. Focus Visibility on Minimal Interactive Elements

**Issue:** The site has very few explicit `aria-*` attributes. Quick audit found only 23 occurrences of `aria-`, `role=`, `tabindex`, or `alt=` across 12 component files. Pages like privacy and terms have minimal semantic structure.

**Files:** `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` — no nav landmarks, no `aria-label` on icon-only buttons, no heading hierarchy validation.

**Impact:** Screen reader users may struggle to understand page structure. Keyboard navigation may skip interactive elements. Link and button purposes may be unclear without visual context.

**Current approach (from `.impeccable.md` line 156-160):**
```css
:where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.30);
  outline-offset: 2px;
}
```

This is solid for sighted keyboard users but insufficient for screen readers. No `aria-label` on nav, no `role` on sections that act as landmarks.

**Fix:** Add semantic HTML markup:
- Wrap navbar in `<nav aria-label="Main navigation">`
- Add `role="main"` to main content areas
- Add `alt=""` to decorative SVGs, `alt="description"` to content SVGs
- Use `aria-current="page"` on active nav links
- Add `aria-label` to icon-only buttons (CTA buttons)

### 2. Color Contrast in Terms/Privacy Pages

**Issue:** `terms/page.tsx` and `privacy/page.tsx` use `text-zinc-400` and `text-zinc-500` for body and meta text. Against `bg-zinc-950`, these may fail WCAG AA contrast ratio (4.5:1 for normal text).

**Files:** `src/app/terms/page.tsx` lines 43, 64, 76, 143, etc.

**Fix:** Test contrast ratios. Shift text colors toward lighter neutrals (`text-zinc-200` or `text-slate-300`) or ensure backgrounds are lighter to compensate.

---

## Type Safety Regressions

**Issue:** `src/components/ui/container-scroll-animation.tsx` had `any` type on `Header` props (line 57 in original code). The uncommitted changes fix this with proper `MotionValue` types, but similar patterns may exist elsewhere.

**Files:** `src/components/ui/container-scroll-animation.tsx` (already being fixed in working tree)

**Status:** In progress (staged in eslint.config.mjs and TS fix). No action needed.

---

## Styling Fragility — Tailwind Utility Clash

**Issue:** Multiple components mix utility styles with inline CSS. Example from `CalloutCard.tsx` line 34–36:
```typescript
style={{
    boxShadow: "0 0 40px -10px rgba(30, 64, 175, 0.25), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 60px rgba(30,64,175,0.03)",
}}
```

Combined with `className="card-glow border-0 bg-[#0a0a0a]..."`, this creates three layers of shadow (inline + `.card-glow` + Tailwind). Specificity issues, maintenance burden when colors change.

**Files:**
- `src/components/CalloutCard.tsx` lines 30–36
- `src/components/animations/PerformanceMetric.tsx` lines 78–79, 103–104
- `src/components/MethodologyCard.tsx` line 21

**Impact:** Hard to predict final shadow look. If `.card-glow` or Tailwind utilities are updated, inline styles take precedence and may cause unexpected visual regressions.

**Fix:** Move inline shadow definitions to CSS variables or a dedicated Tailwind plugin. Use only Tailwind utilities for colors and shadows on marketing components. Reserve inline styles for motion-value transforms only (Framer Motion `animate` props).

---

## Dead Code and Organizational Debt

**Issue:** Multiple unused or under-used patterns exist:
- `--color-primary-glow` (line 34 in globals.css) references `#3B82F6` which `.impeccable.md` explicitly calls out as too flat/bright and banned
- `--shadow-glow-blue` and `--shadow-glow-green` tokens (lines 49–50) are used inconsistently throughout
- Token naming doesn't align with the new OKLCH system (phase-2 deferred, but causes naming confusion)

**Files:** `src/app/globals.css` lines 34, 49–50

**Impact:** Maintenance confusion. Tokens suggest functionality but don't match brand intent (`.impeccable.md` section "The test: desaturate to grayscale").

**Fix:** Phase-2 token migration will address this. For now, document in a REFACTOR note which tokens are to be replaced.

---

## Test Coverage Gaps

**Issue:** No visible test files in the repository. Components like `PerformanceMetric`, `DashboardPreview`, animation utilities have no unit or integration tests.

**Files affected:** All interactive components, especially:
- `src/components/animations/PerformanceMetric.tsx` — relies on `useInView` + `useEffect` + `useMotionValue` coordination
- `src/components/ui/container-scroll-animation.tsx` — scroll-driven transforms
- Animation entrance sequences across all pages

**Impact:** Scroll behavior, animation timing, and motion-value transforms are untested. Regression in animation logic goes undetected until manual QA. Frame rate issues or timing bugs may only surface on deploy.

**Fix:** Create vitest + Framer Motion test suites for:
1. Scroll trigger behavior (mock `useInView`, verify animation fire)
2. Motion value transforms (test `useTransform` output for scroll ranges)
3. Animation entrance timing (verify stagger delays, easing curves)
4. Accessibility: verify focus ring applies to interactive elements

---

## Security Considerations

**Issue:** No explicit XSS or injection vector found in the codebase (no `dangerouslySetInnerHTML`, no unsanitized user input), but the site is a pure static marketing site with no backend.

**Files:** All pages are RSC-based (`"use client"` only on animation components).

**Impact:** Low risk. Content is hard-coded. If a CMS is added later (e.g., for terms/privacy updates), sanitization middleware must be added.

**Fix:** Document policy: "All user-facing content must be sanitized before rendering. HTML from external sources is forbidden."

---

## Known Animation Timing Issues

**Issue:** `PerformanceMetric.tsx` uses `setTimeout` to delay animation start (lines 21–23):
```typescript
setTimeout(() => {
    animate(countValue, 100, { duration: 2, ease: "easeOut" });
}, 1500);
```

The 1500ms delay is hardcoded and tied to external scroll sync (`isInView`). If the scroll trigger fires but the component unmounts before 1500ms, the `animate()` call runs on an unmounted component (no error, but side effect is wasted).

**Files:** `src/components/animations/PerformanceMetric.tsx` lines 21–23

**Impact:** Memory leak risk. Timeout references accumulate if the component is mounted/unmounted repeatedly (e.g., during fast scroll).

**Fix:** Clear the timeout in a cleanup function:
```typescript
useEffect(() => {
    if (isInView && !hasAnimated) {
        setHasAnimated(true);
        const timerId = setTimeout(() => {
            animate(countValue, 100, { duration: 2, ease: "easeOut" });
        }, 1500);
        return () => clearTimeout(timerId);
    }
}, [isInView, hasAnimated, countValue]);
```

---

## Features Missing Before Launch

**Issue:** The upcoming Features page and rebrand of terms/privacy pages require:
1. Consistent token usage (currently missing on terms/privacy)
2. Semantic HTML for accessibility
3. Animation audit to remove perpetual motion
4. Color contrast validation

**Scope:** These are not bugs but pre-launch blockers for the upcoming milestone.

**Fix approach:**
1. Refactor terms/privacy to use OKLCH tokens and fix contrast
2. Run axe/WAVE accessibility audit
3. Remove `animate-pulse` and text-shadow animations
4. Create Features page using the same token-based, accessible pattern as home page
5. Test all pages at 30fps throttle on Lighthouse mobile

---

## Uncommitted Working Tree Changes

**Status:** Three files have staged changes (linting improvements, type safety):
- `eslint.config.mjs` — added `.claude/**` to ignore patterns (tooling, not application code)
- `src/components/animations/PerformanceMetric.tsx` — added ESLint disable comment for intentional `setState` in `useEffect`
- `src/components/ui/container-scroll-animation.tsx` — converted `any` type to proper `MotionValue<number>` typing

**Impact:** All changes are safe (linting improvements, type correctness). No behavioral regressions.

**Recommendation:** Commit these changes. They improve code quality with no risk.

---

*Concerns audit: 2026-06-12*
