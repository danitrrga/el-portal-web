# Phase 2: Features Page — Pattern Map

**Mapped:** 2026-06-13
**Files analyzed:** 6 (2 new sections files + 1 new page + 2 modified components + 1 closing CTA adaptation)
**Analogs found:** 6 / 6

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/app/features/page.tsx` | page (RSC) | request-response | `src/app/methodology/page.tsx` | exact |
| `src/components/features/FeaturesHeroSection.tsx` | component (RSC) | request-response | `src/app/methodology/page.tsx` hero `<header>` | exact |
| `src/components/features/HighlightGrid.tsx` | component (RSC) | request-response | `methodology/page.tsx` `TemporalHierarchySection` / `ScaleTextContent` grid | role-match |
| `src/components/features/DeepDiveRow.tsx` | component, client island | request-response | `methodology/page.tsx` `PulseLoopSection` + `TrendsInsightsSection` | role-match |
| `src/components/features/FeaturesCTASection.tsx` | component (RSC) | request-response | `src/components/CTASection.tsx` | exact |
| `src/components/Navbar.tsx` | component, client | request-response | self (targeted edit: `navLinks` array) | self |
| `src/components/Footer.tsx` | component, client | request-response | self (targeted edit: `footerColumns[0].links`) | self |

---

## Pattern Assignments

### `src/app/features/page.tsx` (RSC page)

**Analog:** `src/app/privacy/page.tsx` (for `metadata` export) + `src/app/methodology/page.tsx` (for page shell and section composition)

**Imports pattern** (methodology lines 1-4 + privacy lines 1-2 combined):
```tsx
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// ... section component imports
```

**Metadata export** (privacy/page.tsx lines 6-9 — only file pattern that exports metadata):
```tsx
export const metadata: Metadata = {
  title: "Features — El Portal",
  description: "Everything El Portal tracks, analyzes, and surfaces — shipped and in your hands today.",
};
```

**Page shell pattern** (methodology lines 859-961 — the canonical page shell for inner pages):
```tsx
export default function FeaturesPage() {
  return (
    <div
      className="relative min-h-screen w-full"
      style={{ background: "var(--color-ep-section-bg)" }}
    >
      {/* Atmospheric top-light radial */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[700px]"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 50% 0%, var(--color-ep-accent-alpha-12), transparent 65%)`,
        }}
      />

      <Navbar />

      <main className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-28 pb-24 md:pt-36 md:px-8">
        {/* sections composed here */}
      </main>

      <Footer />
    </div>
  );
}
```

**Section divider pattern** (methodology lines 905-908 — hairline `h-px` between sections):
```tsx
<div
  aria-hidden
  className="h-px"
  style={{ background: "var(--color-ep-rule)" }}
/>
```

**Section spacing wrapper** (methodology line 899):
```tsx
<div className="space-y-20 md:space-y-28">
  {/* sections */}
</div>
```

**Token convention for new page** — DO NOT copy methodology's top-of-file SCREAMING_SNAKE constants (`const SECTION_BG = "#04060c"` etc.). Instead reference tokens directly inline:
```tsx
// CORRECT — new page pattern:
style={{ background: "var(--color-ep-section-bg)" }}
style={{ color: "var(--color-ep-fg-strong)" }}
style={{ color: "var(--color-ep-fg-muted)" }}
// Hairlines:
style={{ background: "var(--color-ep-hairline)" }}
style={{ borderColor: "var(--color-ep-rule)" }}
```

---

### `src/components/features/FeaturesHeroSection.tsx` (RSC, hero intro)

**Analog:** `src/app/methodology/page.tsx` hero `<header>` block (lines 877-896)

**Core pattern** (lines 877-896):
```tsx
<header className="mb-14 md:mb-20">
  <h1
    className="display text-balance leading-[1.05]"
    style={{
      fontSize: "clamp(42px, 4.2vw, 58px)",
      color: "var(--color-ep-fg-strong)",
    }}
  >
    {/* headline — D-09: "feature-overview intro, straightforward framing" */}
  </h1>
  <p
    className="mt-5 max-w-2xl text-[15px] leading-[1.6] md:text-base"
    style={{ color: "var(--color-ep-fg)" }}
  >
    {/* subhead */}
  </p>
</header>
```

**Display font rule** — `.display` utility (Special Gothic Expanded One, all-caps) on H1 only; no Instrument Serif, no gradient-clipped text. Defined in `globals.css` lines 326-332:
```css
.display {
  font-family: var(--font-special-gothic-expanded), "Arial Black", sans-serif;
  font-weight: 400;
  letter-spacing: -0.012em;
  text-transform: uppercase;
  line-height: 1.02;
}
```

**Architectural vertical-rules motif** (D-01) — the two margin lines are purely decorative `aria-hidden` `<div>`s. Implement as absolute positioned elements within the page wrapper, not inside the `<main>`:
```tsx
{/* Left vertical rule */}
<div
  aria-hidden
  className="pointer-events-none absolute inset-y-0 left-[calc(50%-320px)] hidden w-px xl:block"
  style={{ background: "var(--color-ep-hairline)" }}
/>
{/* Right vertical rule */}
<div
  aria-hidden
  className="pointer-events-none absolute inset-y-0 right-[calc(50%-320px)] hidden w-px xl:block"
  style={{ background: "var(--color-ep-hairline)" }}
/>
```

---

### `src/components/features/HighlightGrid.tsx` (RSC, line-ruled open grid)

**Analog:** `src/app/methodology/page.tsx` — `TemporalHierarchySection` (lines 144-172) for the open typographic grid with hairline dividers; also `ScaleTextContent` (lines 102-142) for the cell anatomy.

**SectionEyebrow pattern** (methodology lines 20-49) — copy and migrate to tokens:
```tsx
function SectionEyebrow({ num, label }: { num: string; label: string }) {
  return (
    <div className="mb-8 flex items-center gap-3 md:mb-10">
      <span
        className="font-mono text-[11px] tabular-nums"
        style={{ color: "var(--color-ep-fg-subtle-2)" }}
      >
        {num}
      </span>
      <span aria-hidden className="font-mono text-[10px]" style={{ color: "var(--color-ep-fg-subtle-2)" }}>
        ·
      </span>
      <span
        className="font-mono text-[11px] uppercase tracking-[0.22em]"
        style={{ color: "var(--color-ep-fg-muted)" }}
      >
        {label}
      </span>
      <div aria-hidden className="ml-1 h-px flex-1" style={{ background: "var(--color-ep-rule)" }} />
    </div>
  );
}
```

**Open grid cell anatomy** — D-05 specifies NO card backgrounds, cells divided by hairlines only (methodology line 106 `border-b` pattern):
```tsx
{/* Grid cell — hairline top border only, no card bg */}
<div className="flex flex-col border-t pt-6" style={{ borderColor: "var(--color-ep-hairline)" }}>
  <span
    className="font-mono text-[10px] uppercase tracking-[0.22em] mb-3"
    style={{ color: "var(--color-ep-fg-muted)" }}
  >
    {label}
  </span>
  <p className="text-[14px] leading-[1.6]" style={{ color: "var(--color-ep-fg)" }}>
    {body}
  </p>
</div>
```

**Grid layout** (methodology line 164 — 3-column responsive):
```tsx
<div className="grid gap-8 md:grid-cols-3 md:gap-12">
  {/* cells */}
</div>
```
For the bento-style layout with varied cell sizes, prefer a 2-column or 3-column CSS grid with `md:col-span-2` on featured cells.

**Mono annotation labels** (D-03) — eyebrow label, coordinate annotation, metric readout:
```tsx
<span className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--color-ep-fg-muted)" }}>
  {label}
</span>
```

**Icon convention** — D-04 mandates Phosphor Light at `strokeWidth={1.5}` for all icons on this page:
```tsx
import { SomeIcon } from "@phosphor-icons/react";
// Usage:
<SomeIcon size={18} weight="light" />
// Note: Phosphor uses `weight` prop, not `strokeWidth`
```
(NOT `lucide-react` — the methodology page's `ArrowRight`, `Sun`, `Moon` from lucide-react are legacy and must NOT be copied into new work.)

---

### `src/components/features/DeepDiveRow.tsx` (client island, Framer Motion)

**Analog:** `src/app/methodology/page.tsx` — `PulseLoopSection` (lines 363-548) for the asymmetric two-column deep-dive layout; `TrendsInsightsSection` (lines 703-853) for the visual + annotation card pattern.

**Two-column deep-dive layout** (methodology lines 369-395 — left sticky intro + right content):
```tsx
"use client";
import { motion } from "framer-motion";

// Entrance variants — canonical project easing (Footer.tsx lines 40-50)
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

// Inside the component:
<motion.section
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-60px" }}
>
  <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:gap-14">
    {/* LEFT — sticky intro */}
    <motion.div variants={itemVariants} className="md:sticky md:top-32 md:self-start">
      <h2
        className="display text-balance leading-[1.1]"
        style={{ fontSize: "clamp(26px, 2.6vw, 34px)", color: "var(--color-ep-fg-strong)" }}
      >
        {heading}
      </h2>
      <p className="mt-5 text-[15px] leading-[1.65] md:text-base" style={{ color: "var(--color-ep-fg)" }}>
        {body}
      </p>
    </motion.div>

    {/* RIGHT — visual / annotation */}
    <motion.div variants={itemVariants}>
      {/* line-style visual: SVG chart or typographic treatment (D-08) */}
    </motion.div>
  </div>
</motion.section>
```

**"use client" requirement** — Only apply `"use client"` at the island boundary (the component file that uses Framer Motion). The parent `src/app/features/page.tsx` stays RSC. Pattern from `Footer.tsx` line 1, `Navbar.tsx` line 1.

**Line-chart visual for Trends deep-dive** — D-08 says reuse line/curve visuals but NOT Remotion components (`AsymptoticAnimation.tsx` and `CyclesAnimation.tsx` use `useCurrentFrame` / `useVideoConfig` from Remotion — they are video render components, not web components). Implement a static SVG or Framer Motion SVG path animation instead, following the vocabulary of `AsymptoticAnimation.tsx` (lines 19-35: axis lines, dashed asymptote, curved path in `--color-ep-chart-line`):
```tsx
{/* Static line-chart SVG — Trends visual */}
<svg viewBox="0 0 200 120" className="w-full" aria-hidden>
  {/* Axes */}
  <line x1="20" y1="100" x2="180" y2="100" stroke="var(--color-ep-hairline)" strokeWidth="0.5" />
  <line x1="20" y1="10" x2="20" y2="100" stroke="var(--color-ep-hairline)" strokeWidth="0.5" />
  {/* Trend line */}
  <path
    d="M 20 90 Q 80 70, 110 50 T 180 30"
    fill="none"
    stroke="var(--color-ep-accent)"
    strokeWidth="1.5"
  />
</svg>
```

**Annotation / insight card** (methodology lines 730-784 — annotated insight card pattern):
```tsx
<div
  className="rounded-xl border p-6 md:p-7"
  style={{
    background: "rgba(255,255,255,0.015)",
    borderColor: "var(--color-ep-rule)",
  }}
>
  <div className="flex items-start gap-3">
    <span aria-hidden className="mt-[6px] size-2.5 shrink-0 rounded-full" style={{ background: "var(--color-ep-fg-strong)" }} />
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-semibold leading-[1.3] md:text-[15px]" style={{ color: "var(--color-ep-fg-strong)" }}>
        {insightTitle}
      </p>
      <p className="mt-1.5 text-[12px] leading-[1.5] md:text-[13px]" style={{ color: "var(--color-ep-fg-muted)" }}>
        {insightBody}
      </p>
    </div>
  </div>
</div>
```

**Left border accent** (methodology lines 672-694 — callout with left border rule):
```tsx
<div
  className="border-l-2 pl-4 py-1"
  style={{ borderColor: "var(--color-ep-accent-light-alpha-80)" }}
>
  <span className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--color-ep-accent-light)" }}>
    {label}
  </span>
  <p className="text-[13px] leading-[1.55] md:text-[14px]" style={{ color: "var(--color-ep-fg)" }}>
    {body}
  </p>
</div>
```

---

### `src/components/features/FeaturesCTASection.tsx` (RSC)

**Analog:** `src/components/CTASection.tsx` (lines 1-72) — exact match. Adapt to add a secondary pricing link.

**Full pattern** (CTASection.tsx lines 1-72 — migrate SCREAMING_SNAKE constants to inline tokens):
```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.el-portal.app";

export default function FeaturesCTASection() {
  return (
    <section
      className="relative overflow-hidden py-24 md:py-32"
      style={{ background: "var(--color-ep-section-bg)" }}
    >
      {/* Top hairline */}
      <div
        aria-hidden
        className="absolute left-0 right-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, var(--color-ep-hairline), transparent)" }}
      />
      {/* Atmospheric backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 70% 90% at 50% 0%, var(--color-ep-accent-alpha-12), transparent 60%)` }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2
          className="display text-balance"
          style={{ fontSize: "clamp(36px, 4.6vw, 58px)", color: "var(--color-ep-fg-strong)" }}
        >
          {heading}
        </h2>
        <p
          className="mt-6 text-base md:text-lg leading-[1.6] text-balance mx-auto max-w-xl"
          style={{ color: "var(--color-ep-fg)" }}
        >
          {subhead}
        </p>

        {/* D-10: primary "Open El Portal" + secondary "/pricing" link */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-6">
          <Button asChild variant="brand" size="lg" className="text-base">
            <Link href={APP_URL}>
              <span className="text-nowrap">Open El Portal</span>
            </Link>
          </Button>
          <Button asChild variant="brand-link" size="lg">
            <Link href="/pricing">See pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
```

**Button variants** — only `"brand"` (primary CTA) and `"brand-link"` (secondary) are permitted for hero/nav CTAs. Defined in `src/components/ui/button.tsx` lines 22-25:
```tsx
brand: "rounded-full border border-white/20 bg-white/[0.05] text-[var(--color-ep-fg-strong)] hover:bg-white/[0.08] hover:border-white/25",
"brand-link": "text-[var(--color-ep-fg)] hover:text-[var(--color-ep-fg-strong)]",
```

---

### `src/components/Navbar.tsx` — `navLinks` edit

**Analog:** self — targeted line edit only. No new pattern required.

**Current array** (Navbar.tsx lines 12-17):
```tsx
const navLinks = [
  { href: "/manifesto", label: "Manifesto" },
  { href: "/changelog", label: "Changelog" },
  { href: "/methodology", label: "Methodology" },
  { href: "/pricing", label: "Pricing" },
];
```

**Required change** (D-11) — insert Features before Pricing:
```tsx
const navLinks = [
  { href: "/manifesto", label: "Manifesto" },
  { href: "/changelog", label: "Changelog" },
  { href: "/methodology", label: "Methodology" },
  { href: "/features", label: "Features" },   // ADD
  { href: "/pricing", label: "Pricing" },
];
```

No other lines in `Navbar.tsx` are touched.

---

### `src/components/Footer.tsx` — `footerColumns` edit

**Analog:** self — targeted line edit only. No new pattern required.

**Current Features link** (Footer.tsx lines 9-12):
```tsx
{ label: "Features", href: "/" },
```

**Required change** (D-11 / QUAL-01):
```tsx
{ label: "Features", href: "/features" },
```

No other lines in `Footer.tsx` are touched.

---

## Shared Patterns

### Token Usage (all new files)

**Source:** `src/app/globals.css` lines 94-168, `src/components/CTASection.tsx` (demonstrates token usage after Phase-1 migration)

**Apply to:** `features/page.tsx`, `FeaturesHeroSection.tsx`, `HighlightGrid.tsx`, `DeepDiveRow.tsx`, `FeaturesCTASection.tsx`

Key tokens for this page:
```tsx
// Backgrounds
"var(--color-ep-section-bg)"        // #04060c — page/section bg
"var(--color-ep-bg-base)"           // #02030a — root bg

// Foregrounds
"var(--color-ep-fg-strong)"         // #f4f6fb — headings
"var(--color-ep-fg)"                // #aab3c5 — body
"var(--color-ep-fg-muted)"          // #a8b0c0 — eyebrow labels
"var(--color-ep-fg-muted-2)"        // #8590a8 — secondary muted
"var(--color-ep-fg-subtle)"         // #6f7889 — decorators, dividers
"var(--color-ep-fg-subtle-2)"       // #5a6478 — mono numbers

// Accent
"var(--color-ep-accent)"            // #4487D6
"var(--color-ep-accent-light)"      // #77B7ED
"var(--color-ep-accent-alpha-12)"   // #4487d61f — atmospheric radial fill
"var(--color-ep-accent-light-alpha-80)"  // #77b7edcc — left-border accent

// Borders / Rules
"var(--color-ep-hairline)"          // rgba(255,255,255,0.12) — structural rules
"var(--color-ep-rule)"              // rgba(255,255,255,0.14) — section dividers
"var(--color-ep-divider)"           // rgba(255,255,255,0.15) — emphasis

// Chart / data
"var(--color-ep-chart-line)"        // #3B82F6 — SVG line strokes
```

### Framer Motion Entrance Pattern (client islands)

**Source:** `src/components/Footer.tsx` lines 32-50

**Apply to:** `DeepDiveRow.tsx` (only component that needs `"use client"` for motion)

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

// Usage: whileInView + once
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-60px" }}
>
```

### Section Separator

**Source:** `src/components/Footer.tsx` line 56; also `methodology/page.tsx` lines 905-908

**Apply to:** Between every section in `features/page.tsx`

```tsx
// Gradient separator (Footer pattern):
<div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

// Plain rule (methodology pattern — use for in-page section dividers):
<div aria-hidden className="h-px" style={{ background: "var(--color-ep-rule)" }} />
```

### APP_URL Pattern

**Source:** `src/components/CTASection.tsx` line 9, `src/components/Navbar.tsx` line 10

**Apply to:** `FeaturesCTASection.tsx`, `features/page.tsx` if it includes inline CTAs

```tsx
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.el-portal.app";
```

### RSC vs Client Island Split

**Source:** `src/app/page.tsx` (RSC shell composing client components) + `src/components/Footer.tsx` / `Navbar.tsx` (client components with `"use client"`)

**Rule:** `src/app/features/page.tsx` is RSC (no `"use client"`). Framer Motion requires a client boundary — isolate motion to `DeepDiveRow.tsx` only. `FeaturesHeroSection.tsx`, `HighlightGrid.tsx`, and `FeaturesCTASection.tsx` are all RSC.

---

## No Analog Found

All files have analogs. The following are **NOT usable** as analogs despite being listed in CONTEXT.md:

| File | Reason |
|---|---|
| `src/components/animations/AsymptoticAnimation.tsx` | Uses Remotion (`useCurrentFrame`, `useVideoConfig`) — video render only, not a web component. Copy the SVG vocabulary only, not the component itself. |
| `src/components/animations/CyclesAnimation.tsx` | Same — Remotion video component with `frame * rotation` loop. Anti-pattern for web (perpetual motion, main-thread repaint). The line-ring SVG shapes are reusable as static elements. |
| `src/components/SystemBlueprintSection.tsx` / `DashboardPreview.tsx` | Explicitly excluded by D-08 — box-and-bracket mockup aesthetic clashes with line/blueprint direction. |

---

## Metadata

**Analog search scope:** `src/app/**/page.tsx`, `src/components/**/*.tsx`
**Files scanned:** 14
**Key constraint discovered:** No existing page exports `metadata` except `privacy/page.tsx` and `terms/page.tsx` — those are the only safe analogs for the `export const metadata` pattern.
**Pattern extraction date:** 2026-06-13
