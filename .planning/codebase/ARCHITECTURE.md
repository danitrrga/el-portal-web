<!-- refreshed: 2026-06-12 -->
# Architecture

**Analysis Date:** 2026-06-12

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                   Pages (App Router)                        │
│   Home / Manifesto / Methodology / Changelog / Pricing       │
│   Privacy / Terms / MCP                                      │
│  `src/app/{route}/page.tsx`                                  │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Layout & Navigation                        │
│  Root Layout + Navbar + Footer (persistent across routes)    │
│  `src/app/layout.tsx`, `src/components/Navbar.tsx`          │
│  `src/components/Footer.tsx`                                │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              Feature Sections & Components                   │
│  Hero, VCD, MCP Integration, System Blueprint, Methodology   │
│  `src/components/Hero.tsx`, `src/components/hero/*`         │
│  `src/components/*Section.tsx`                               │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│           UI Components (shadcn + Custom)                    │
│  Button, Card, Badge, Accordion, ScrollArea, ShinyButton     │
│  `src/components/ui/*.tsx`                                   │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  Animations (Framer Motion + Remotion + Custom Canvas)       │
│  PerformanceMetric, AnimatedGroup, Scroll Effects            │
│  `src/components/animations/*`, `src/components/remotion/*`  │
└────────┬────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  Styling & Utilities                                         │
│  Tailwind v4, OKLCH tokens in globals.css, cn() helper       │
│  `src/app/globals.css`, `src/lib/utils.ts`                  │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Root Layout | Font loading, dark mode, metadata, HTML setup | `src/app/layout.tsx` |
| Navbar | Navigation links, mobile menu, logo, route awareness | `src/components/Navbar.tsx` |
| Hero | Main pitch with animated mockup, entry section | `src/components/Hero.tsx` |
| VCDSection | Version/Cycle/Day temporal hierarchy explanation | `src/components/hero/VCDSection.tsx` |
| McpIntegrationSection | MCP protocol and integration story | `src/components/hero/McpIntegrationSection.tsx` |
| SystemBlueprintSection | System architecture and feature grid | `src/components/SystemBlueprintSection.tsx` |
| MethodologyPreviewSection | Teaser for full methodology page | `src/components/MethodologyPreviewSection.tsx` |
| CTASection | Call-to-action to download or sign up | `src/components/CTASection.tsx` |
| Footer | Links, company info, copyright | `src/components/Footer.tsx` |
| Button (shadcn) | Reusable button with variant system (brand, ghost, etc.) | `src/components/ui/button.tsx` |
| ShinyButton | Animated gradient border button for CTAs | `src/components/ui/shiny-button.tsx` |
| AnimatedGroup | Framer Motion wrapper for staggered list animations | `src/components/ui/animated-group.tsx` |
| Card | Surface container with border and raised styling | `src/components/ui/card.tsx` |
| Badge | Small label/tag component | `src/components/ui/badge.tsx` |
| PerformanceMetric | Canvas-based animated metric visualization | `src/components/animations/PerformanceMetric.tsx` |
| ElPortalWordmark | Logo and wordmark (Inter 900 + SVG icon) | `src/components/ElPortalWordmark.tsx` |

## Pattern Overview

**Overall:** Next.js 16 App Router with React Server Components (RSC) by default. Pages are SSR/SSG unless marked `"use client"`. Client-side interactivity is minimal and opt-in (navigation, mobile menu, animations).

**Key Characteristics:**
- Static marketing site — no database, no auth, no dynamic user data
- App Router file-based routing — each `page.tsx` in `src/app/{route}/` maps to a URL
- Server-side rendering by default; client components used only for interactive features
- Tailwind v4 with OKLCH color tokens defined in `@theme inline` in `globals.css`
- Framer Motion for scroll-triggered and entrance animations
- shadcn/ui base components (button, card, badge, accordion) with custom variants
- Remotion and canvas-based visualizations for complex animations
- Dark mode only (hardcoded `class="dark"` on `<html>`)

## Layers

**Page Layer (Routing):**
- Purpose: Entry points for each URL route
- Location: `src/app/{route}/page.tsx`
- Contains: Page-level JSX, metadata, section composition
- Depends on: Navbar, Footer, feature sections, utility functions
- Used by: Browser router

**Section/Feature Layer:**
- Purpose: Reusable content sections (Hero, Methodology preview, MCP integration, etc.)
- Location: `src/components/*Section.tsx`, `src/components/hero/*`
- Contains: Multi-component layout, typography, data structure
- Depends on: UI components, animations, utilities
- Used by: Pages, other sections

**UI Component Layer:**
- Purpose: Atomic design elements (Button, Card, Badge, etc.)
- Location: `src/components/ui/*.tsx`
- Contains: Base styles, variants, accessibility attributes
- Depends on: Tailwind, shadcn utilities, CVA (class-variance-authority)
- Used by: Sections, feature components

**Animation Layer:**
- Purpose: Motion, transitions, and visual effects
- Location: `src/components/animations/*`, `src/components/remotion/*`
- Contains: Framer Motion variants, canvas elements, scroll triggers
- Depends on: framer-motion, @remotion/player, browser APIs
- Used by: Sections, pages

**Styling Layer:**
- Purpose: Design tokens, utilities, typography
- Location: `src/app/globals.css`, `src/lib/utils.ts`
- Contains: OKLCH color palette, font setup, Tailwind theme, utility functions
- Depends on: Tailwind v4, Next.js font loader
- Used by: All components

## Data Flow

### Primary Request Path (Page Load)

1. Browser requests `/` (or other route) → Next.js App Router matches `src/app/page.tsx`
2. Root `src/app/layout.tsx` loads fonts and renders `<html>` frame
3. Page component renders → imports Navbar, Hero, feature sections, Footer
4. Feature sections compose UI components and static content
5. Tailwind + globals.css hydrate dark mode styling and color tokens
6. Framer Motion animates on initial page load and scroll
7. Server sends HTML to browser, client hydrates React tree

### Interactive Features (Client-Side)

**Mobile Menu Toggle:**
- User clicks hamburger icon → Navbar state updates → mobile nav slides in/out
- `src/components/Navbar.tsx` uses `useState` and `usePathname` (client component)

**Scroll Animations:**
- Framer Motion listens to scroll position via viewport and triggers animations
- `src/components/ui/animated-group.tsx` uses `initial`, `animate`, `variants` pattern
- No external scroll library — browser scroll events + Motion viewport detection

**Copy Button:**
- User clicks copy icon in changelog → `src/components/CopyButton.tsx` copies text to clipboard
- Uses Clipboard API and brief toast feedback (inline state)

**Active Route Highlighting:**
- Navbar reads `usePathname()` and applies active color to matching nav link
- `src/components/Navbar.tsx` compares `pathname === link.href`

### Static Content Rendering

Pages like `/methodology`, `/manifesto`, `/changelog` import pre-defined data structures (arrays of principles, changelog entries, scales) and render them as static HTML. No runtime API calls or data fetching.

**State Management:**
- No Redux, Zustand, or Context API — site is too simple
- Component-level state only: `useState` in interactive components (Navbar mobile menu, CopyButton)
- Static data as module constants in page files (e.g., `ENTRIES[]` in changelog page)

## Key Abstractions

**UI Variant Pattern (CVA):**
- Button, Badge, and other components use `class-variance-authority` to manage style variants
- Example: Button has `variant: 'brand' | 'ghost' | 'default'` and `size: 'sm' | 'md' | 'lg'`
- Pattern: `const buttonVariants = cva(...); function Button({ variant, size, ... }) { return <button className={cn(buttonVariants(...))} /> }`
- Files: `src/components/ui/button.tsx`, `src/components/ui/badge.tsx`

**Animation Presets (AnimatedGroup):**
- Framer Motion animation variants packaged as named presets: `fade`, `slide`, `scale`, `blur`, `zoom`, `bounce`, etc.
- Users pass `preset="fade"` or `preset="blur-slide"` instead of writing Motion JSX
- Files: `src/components/ui/animated-group.tsx`

**Tailwind Utility Shorthand (cn):**
- `cn()` function merges clsx + tailwind-merge to avoid class conflicts
- Used throughout: `className={cn('px-4', customClass)}`
- File: `src/lib/utils.ts`

**Section Eyebrow Pattern (Methodology/Manifesto):**
- Numbered label + icon + full-width rule divider at top of each section
- Reused across pages for consistent visual hierarchy
- File: Inline within page files (e.g., `src/app/methodology/page.tsx`)

**Color Tokens (OKLCH):**
- Design palette defined as CSS custom properties in `@theme inline` in `globals.css`
- Used in inline styles and Tailwind utility classes
- Tokens: `--color-primary`, `--color-accent-subtle`, `--color-bg-raised`, etc.
- File: `src/app/globals.css` (lines 32-89)

## Entry Points

**Browser Entry (Home Page):**
- Location: `src/app/page.tsx`
- Triggers: User navigates to `/` or domain root
- Responsibilities: Compose Hero, VCD, MCP, SystemBlueprint, Methodology preview, CTA sections

**Other Route Entry Points:**
- `/manifesto` → `src/app/manifesto/page.tsx`
- `/methodology` → `src/app/methodology/page.tsx`
- `/changelog` → `src/app/changelog/page.tsx`
- `/pricing` → `src/app/pricing/page.tsx`
- `/mcp` → `src/app/mcp/page.tsx`
- `/terms` → `src/app/terms/page.tsx`
- `/privacy` → `src/app/privacy/page.tsx`

**Layout Entry (All Routes):**
- Location: `src/app/layout.tsx`
- Triggers: Every page render
- Responsibilities: Load fonts, set dark mode, render Navbar and Footer wrapper

**Client-Side Interactivity Entry:**
- Navbar mobile menu: User clicks hamburger → `src/components/Navbar.tsx` (client component)
- Copy button: User clicks icon → `src/components/CopyButton.tsx` (client component)
- Scroll animations: Browser scroll fires Framer Motion triggers (global)

## Architectural Constraints

- **Server vs Client:** Next.js App Router serves components as RSC by default. Only mark `"use client"` when you need React hooks or browser APIs (mobile menu, copy button, scroll listeners).

- **No External Data Fetching:** All content is static. No API calls, no Supabase, no external data layer. Content lives in page/section files as constants or imported from `src/components`.

- **Dark Mode Only:** `<html class="dark">` is hardcoded in layout. Light mode logic is removed. All color tokens assume dark background.

- **Tailwind v4 Inline Theme:** No `tailwind.config.ts`. All color tokens and design config live in `@theme inline { ... }` block in `globals.css`. To add a token, edit globals.css, not a config file.

- **No CSS-in-JS:** All styling is Tailwind utility classes and inline `style` props. No `styled-components`, no CSS modules, no Emotion.

- **Animation via Framer Motion:** Client components use Framer Motion for animated sequences. No CSS animations on perpetual loops (anti-pattern: `animate-pulse`, `animate-bounce`, `repeat: Infinity`).

- **Static Assets:** Images, SVGs, and icons live in `public/`. Remotion exports are pre-rendered video files, not real-time.

## Anti-Patterns

### Neon Blue Glow Text

**What happens:** A heading or badge gets a `text-shadow` glow or `background-clip: text` gradient that shines like neon.

**Why it's wrong:** This is instant AI design signal. El Portal brand is desaturated ink-blue, not bright neon. Emphasis comes from weight and size, not glows.

**Do this instead:** Use `.display` utility (Special Gothic Expanded One, uppercase) on headings. For subtle emphasis, apply desaturated `--color-accent` background or border. No glows. See `src/app/methodology/page.tsx` for correct example (H2 with `.display` utility + FG_STRONG color).

### Perpetual Animation Loops

**What happens:** A decorative element has `animate-pulse`, `animate-bounce`, or custom animation with `repeat: Infinity`.

**Why it's wrong:** Perpetual motion on a landing page is noisy and exhausting. Modern design trend (Emil's rule 1) is to animate on entrance or scroll, not loop forever.

**Do this instead:** Use Framer Motion `initial`, `animate`, `whileInView` to trigger motion once, on scroll, or on hover. File: `src/components/ui/animated-group.tsx` for examples of preset animations that complete, not loop.

### Hardcoded Hex Colors in Components

**What happens:** A component has `style={{ color: '#1E40AF' }}` or `className="text-blue-500"`.

**Why it's wrong:** Breaks the design token system. When the brand palette changes, scattered hardcodes become orphans.

**Do this instead:** Use CSS custom properties from globals.css. Example: `style={{ color: 'var(--color-primary)' }}` or inline style with token. File: `src/app/methodology/page.tsx` uses `const FG_STRONG = '#f4f6fb'` at page top, then `style={{ color: FG_STRONG }}` throughout. This centralizes tokens and makes changes painless.

### Light Mode Fallbacks

**What happens:** Component has light-mode styles, light/dark mode branches, or `className="dark:bg-slate-900 bg-white"`.

**Why it's wrong:** Site is dark-only. Light mode code is dead and adds confusion.

**Do this instead:** Never write light-mode styles. Always assume dark background. Tokens and utilities are dark-first. Example: `bg-[#02030a]` (dark), not `bg-white dark:bg-slate-900`.

### Material Symbols CDN

**What happens:** New component imports Material Symbols via CDN link in layout or inline.

**Why it's wrong:** CDN dependency, potential latency, conflicts with Phosphor Light migration plan.

**Do this instead:** Import icons from `lucide-react` (already in use) or migrate to Phosphor Light at `strokeWidth 1.5` when ready. Files using icons: `src/components/Navbar.tsx`, `src/components/Hero.tsx`, `src/components/hero/VCDSection.tsx`.

### Mixing Slate and Zinc Tailwind Scales

**What happens:** Component uses both `slate-*` and `zinc-*` classes for grays.

**Why it's wrong:** Inconsistent gray scale. The OKLCH tokens in globals.css replace both.

**Do this instead:** Use `--color-fg-default`, `--color-fg-muted`, `--color-fg-subtle` from the palette. Or use `text-slate-*` consistently (but prefer tokens). File: `src/app/globals.css` defines the canonical gray/neutral palette.

## Error Handling

**Strategy:** No formal error boundaries. Pages are static, routes all exist. Client-side interactivity (mobile menu, copy button) has silent fallback (state resets or clipboard fails gracefully).

**Patterns:**
- Copy button: If Clipboard API unavailable, button remains functional but silently fails
- Mobile menu: Clicking outside menu closes it; no error state needed
- Page routes: All routes pre-defined in App Router structure; 404 returns Next.js default 404 page

## Cross-Cutting Concerns

**Logging:** No logging infrastructure. Site is static and client-side only. Errors in production won't be captured (optional future: integrate Sentry or similar).

**Validation:** No form validation needed. No forms on pages except potential sign-up CTA (handled by external app URL).

**Authentication:** No auth. All pages are public. Links to `https://app.el-portal.app` for sign-in and dashboard.

---

*Architecture analysis: 2026-06-12*
