# Testing Patterns

**Analysis Date:** 2026-06-12

## Test Framework

**Status:** No automated testing framework installed

- No Jest, Vitest, or other test runner in `package.json`
- No test files found in repository (no `*.test.*` or `*.spec.*` files)
- TypeScript strict mode (`strict: true` in `tsconfig.json`) provides compile-time type safety

**Type Checking:**
- TypeScript compilation via Next.js build (`npm run build`)
- Run command: `npm run build` validates all types before bundling

**Linting:**
- ESLint 9 with Next.js core-web-vitals + TypeScript rules
- Run command: `npm run lint`
- Config: `eslint.config.mjs` (no test-specific rules)

**Run Commands:**
```bash
npm run dev      # Development server — runs Next.js with hot reload
npm run build    # Production build — includes TypeScript type checking
npm start        # Start production server (requires build first)
npm run lint     # Run ESLint across all source files
```

## Verification Strategy (No Automated Tests)

**Manual Verification:**
- Build succeeds: `npm run build` (catches TypeScript errors, missing imports, syntax errors)
- Lint passes: `npm run lint` (catches ESLint violations)
- Dev server runs: `npm run dev` (runs Next.js with HMR)
- Component visual inspection during development (local browser testing)

**Type Safety:**
- TypeScript strict mode enforces all type checks at compile time
- No implicit `any` types allowed
- Component props validated via TypeScript interfaces (e.g., `MethodologyCardProps`)
- Framer Motion types are externally maintained (no internal type tests needed)

## Test File Organization

**Status:** Not applicable — no test framework installed

- No `__tests__/` directories
- No `.test.tsx` or `.spec.ts` files
- No fixtures or test data files
- No mock setup required

## Component Testing Approach

**Manual validation for:**
- **Animation rendering:** Viewed in browser during dev; Framer Motion handles animation logic
  - Example: `src/components/animations/PerformanceMetric.tsx` uses `useInView` hook for scroll-triggered animations
  - Tested by scrolling to component and observing smooth reveal with correct timing
- **TypeScript compilation:** Ensures all components have correct prop types
- **ESLint passes:** Ensures code style compliance
- **Build succeeds:** Ensures all dependencies resolve and bundle correctly

**No runtime testing:**
- No assertions on component behavior
- No snapshot testing
- No DOM event simulation tests

## Linting & Code Quality

**ESLint Configuration:**
- File: `eslint.config.mjs`
- Extends: `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Global ignores: `.next/`, `out/`, `build/`, `.claude/`

**What ESLint catches:**
- Unused variables and imports
- React hook dependency arrays (`exhaustive-deps`)
- TypeScript type errors
- Next.js-specific issues (Image optimization, Script tags, Link components)
- Web Vitals violations

**No Additional Tools:**
- No Prettier (ESLint handles formatting directives)
- No Husky pre-commit hooks (configured but not enforced)
- No test coverage requirements

## Animation Testing

**Manual Testing (No Automated Framework):**

**Scroll-triggered animations:**
- `src/components/animations/PerformanceMetric.tsx`
  - Tests: Scroll to component, verify habit bars slide in with correct stagger
  - Timing: 0.6s per bar with 0.4s stagger, divider at 0.8s delay
  - Number counter animates after 1.5s delay with 2s duration
- Other entrance animations: Viewed in browser with DevTools timeline for performance

**Hero ambient motion:**
- The hero section contains a subtle breathing effect (low-opacity gradient animation)
- Tested visually: No perpetual motion should distract; effect is atmospheric
- GPU composited via CSS `animation` on transform/opacity properties (not `useAnimationFrame`)

**Motion constraints (per `.impeccable.md`):**
- No `animate-pulse`, `animate-bounce`, `animate-ping` on decorative elements
- No `repeat: Infinity` on looping animations
- All animations respect `prefers-reduced-motion: reduce` via CSS
- No scale/growth transforms on card hover (border/opacity only)

**Example animation pattern from codebase:**

```typescript
// src/components/animations/PerformanceMetric.tsx
const transitionVariants = {
  item: {
    hidden: { opacity: 0, filter: "blur(12px)", y: 12 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { type: "spring", bounce: 0.3, duration: 1.5 }
    }
  }
};

// Scroll-triggered, one-shot animation
const isInView = useInView(containerRef, { once: false, amount: 0.3 });
if (isInView && !hasAnimated) {
  setHasAnimated(true);
  setTimeout(() => {
    animate(countValue, 100, { duration: 2, ease: "easeOut" });
  }, 1500);
}
```

## Build Verification

**TypeScript Compilation:**
- Happens as part of `npm run build`
- Catches all type errors before bundling
- `incremental: true` in `tsconfig.json` for faster builds

**Next.js Build Checks:**
- Image optimization validation
- Link component validation
- API route type checking
- Unused files detection

## Accessibility Testing

**Manual:** No automated a11y tests (no jest-axe, vitest-axe, etc.)

**Built-in Safeguards:**
- ESLint via `eslint-config-next` includes accessibility rules
- Focus ring on interactive elements: `focus-visible:outline 2px solid rgba(255, 255, 255, 0.30)`
- Semantic HTML enforced via ESLint (e.g., use `<button>` or `<Button>`, not `<div>` for actions)
- Dark mode contrast: Palette uses desaturated navy + tinted whites (not neon + pure black)

**Manual a11y checklist (run by developer):**
- Tab navigation works through all interactive elements
- Focus styles visible (white outline, 2px, 2px offset)
- Color contrast sufficient in dark mode (navy + white readable)
- Reduced motion respected (CSS `@media (prefers-reduced-motion: reduce)` removes Y-axis transforms)

## Performance Testing

**Lighthouse (Manual):**
- Chrome DevTools Lighthouse audits during dev/before deploy
- Target: Performance >= 90, Accessibility >= 95

**Core Web Vitals:**
- Tailwind CSS v4 with `@theme inline` keeps CSS payload small
- Framer Motion animations use GPU-composited transforms (not layout thrashing)
- Next.js App Router with Server Components reduces JS bundle

**Animation Performance:**
- All entrance animations use `transform` and `opacity` properties (GPU-composited)
- No `useAnimationFrame` decorative motion (main-thread safe)
- Scroll-triggered animations via `useInView` hook with `amount: 0.3` (no eager computation)

## What Would Need Testing (Future)

If automated testing were added:

**Unit Test Candidates:**
- Utility functions: `cn()` in `src/lib/utils.ts`
- Data transformations (if added to `src/data/`)
- Custom hooks (if extracted from components)

**Component Test Candidates:**
- Button variants (e.g., `brand` vs `ghost` rendering)
- Card hover states
- Accordion open/close (from shadcn/ui)
- Animation timing with `vitest-framer-motion` or similar

**Integration Test Candidates:**
- Page routing (Next.js App Router)
- Hero section entrance animation sequence
- Scroll-based animation triggers

**E2E Test Candidates (Playwright/Cypress):**
- Navigation between pages (/methodology, /pricing, /changelog)
- CTA buttons link correctly
- External links open in new tabs
- Mobile responsive layout

---

*Testing analysis: 2026-06-12*
