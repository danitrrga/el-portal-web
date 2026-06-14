# Coding Conventions

**Analysis Date:** 2026-06-12

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `Hero.tsx`, `MethodologyCard.tsx`, `ElPortalWordmark.tsx`)
- Utility files: camelCase (e.g., `globals.css`, `utils.ts`)
- UI component primitives: lowercase (e.g., `button.tsx`, `card.tsx`, `badge.tsx`)
- Directories: lowercase with hyphens or single-word (e.g., `components/ui/`, `components/hero/`, `components/animations/`)

**Functions and Variables:**
- React components: PascalCase for component names
- Hooks and event handlers: camelCase (e.g., `setHasAnimated`, `isInView`, `onMouseEnter`)
- Constants: UPPER_SNAKE_CASE (e.g., `APP_URL`)

**Types:**
- Interfaces for component props: PascalCase with `Props` suffix (e.g., `MethodologyCardProps`, `ShinyButtonProps`)
- Type aliases: PascalCase (e.g., `ClassValue`)
- CSS variables: kebab-case with `--` prefix (e.g., `--color-bg-base`, `--font-inter`, `--shadow-glow-blue`)

## Code Style

**Formatting:**
- Tool: ESLint 9 with Next.js core-web-vitals and TypeScript configurations (`eslint.config.mjs`)
- No Prettier — ESLint alone handles linting
- TypeScript strict mode enabled (`tsconfig.json`)
- Semicolons required, trailing commas in objects

**Linting:**
- Config: `eslint.config.mjs`
- Rules: Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Ignores: `.next/`, `out/`, `build/`, `.claude/` (skill bundles, not app code)
- Run with: `npm run lint` (defaults to ESLint with no additional flags)

**Build/Dev:**
- Next.js 16 with App Router
- React 19 with strict mode
- Tailwind CSS v4 with `@theme inline` in `globals.css` (no `tailwind.config.ts`)
- TypeScript compilation with incremental build support

## Import Organization

**Order:**
1. React and Next.js imports (e.g., `import React from "react"`, `import Link from "next/link"`)
2. Third-party libraries (e.g., `import { motion } from "framer-motion"`, `import { ArrowRight } from "lucide-react"`)
3. Local components (e.g., `import { Button } from "@/components/ui/button"`)
4. Local utilities (e.g., `import { cn } from "@/lib/utils"`)
5. Type imports: `import type` statements are separated and appear with their category

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- Always use `@/` prefix for imports from `src/` directory

**"use client" directive:**
- Placed at the top of file (line 1) when component uses React hooks or browser APIs
- Example: `src/components/Hero.tsx`, `src/components/animations/PerformanceMetric.tsx`
- Server components by default; only add `"use client"` to interactive leaves

## Error Handling

**Patterns:**
- No explicit try-catch blocks in most components (relies on Next.js error boundaries)
- Motion libraries handle animation failures gracefully with fallbacks
- PropTypes not used — TypeScript provides full type safety
- Component props validated via TypeScript interfaces at compile time

## Logging

**Framework:** `console` (no external logging library)

**Patterns:**
- Console use is minimal in production code
- Debug comments use JSDoc-style explanations (e.g., `// Intentional: one-shot animation trigger gated on scroll-into-view`)
- No `console.log()` left in committed code unless explicitly marked for debugging

## Comments

**When to Comment:**
- Document non-obvious animation timing or scroll-sync logic
- Explain why certain Framer Motion options are used (e.g., `once: false` on `useInView`)
- No comment clutter; code should be self-documenting
- Disable ESLint rules ONLY with specific inline comments (e.g., `// eslint-disable-next-line react-hooks/set-state-in-effect`)

**JSDoc/TSDoc:**
- Used for exported component and utility function signatures
- Example from `MethodologyCard.tsx`:
  ```typescript
  interface MethodologyCardProps {
      title: string
      subtitle: string
      animationSlot?: React.ReactNode
      deepDiveText: React.ReactNode
  }
  ```

## Function Design

**Size:** 
- Component functions typically 100–300 lines (including JSX)
- Hooks and utilities extracted to separate files for reuse
- Animation logic broken into dedicated files (e.g., `src/components/animations/PerformanceMetric.tsx`)

**Parameters:**
- Component props passed as single object (destructured in function signature)
- Event handlers follow the pattern: `on[Event]` (e.g., `onMouseEnter`, `onMouseLeave`)
- Framer Motion animations accept `variants` object prop

**Return Values:**
- Components return single root JSX element (wrapped in fragments if necessary)
- Animations use Framer Motion's `motion.*` components
- No direct DOM manipulation with `useRef().current.style`

## Module Design

**Exports:**
- Named exports for utilities and components (e.g., `export function cn()`, `export { Button, buttonVariants }`)
- Default exports reserved for page components (e.g., `export default function Hero()`)
- Re-exports in UI component index files for convenience

**Barrel Files:**
- Used sparingly; most UI imports are direct (e.g., `import { Button } from "@/components/ui/button"`)
- Component grouping by function: `components/hero/`, `components/animations/`, `components/ui/`

## Design Token & Tailwind Patterns

**Color Tokens:**
- All color tokens defined in `src/app/globals.css` via `@theme inline`
- CSS custom properties (e.g., `--color-bg-base`, `--color-accent`, `--color-border-hairline`)
- In components: use `var(--color-*)` in inline styles OR Tailwind arbitrary values
- Example: `bg-[var(--color-bg-raised)]` or `className="border-[var(--color-border-hairline)]"`

**Typography:**
- Display headings (H1, H2): Apply `.display` utility class
- Special Gothic Expanded One font loaded in `src/app/layout.tsx`
- Body text: defaults to Inter via `font-sans`
- Code/metrics: `font-mono` (JetBrains Mono)
- Wordmark: Inter `font-black` (900) only, NEVER Special Gothic Expanded One

**Spacing & Containers:**
- Section padding: `py-28` to `py-40` for major sections (per `design/TOKENS.md` → Spacing & layout)
- Card padding: `p-6` to `p-8`
- Main container: `max-w-5xl px-6 md:px-8`
- Hero container: `max-w-7xl px-6`

**Utility Classes:**
- `.display` — Special Gothic Expanded One, uppercase, `letter-spacing: -0.012em`, `line-height: 1.02`
- `.card-glow` — Subtle border + bg lift on hover (NO chromatic glow) via `::before` pseudo-element
- `.glass-panel` — Frosted glass effect with `backdrop-filter: blur(20px)` for floated surfaces only
- `.text-glow-hero` — Text shadow for hero display text (rgba(30, 64, 175, 0.35))

**Transitions:**
- Always specify exact properties: `transition-colors`, `transition-transform`, `transition-opacity`
- Duration typically 200–300ms for UI state changes
- Custom easing for animations: `cubic-bezier(0.22, 1, 0.36, 1)` (entrance animations)
- Hover effects on cards: `transition-colors duration-300`

## Animation Conventions

**Framer Motion:**
- Entrance animations: `initial` (hidden state) → `animate` (visible state) with 300–500ms duration
- Stagger between siblings: 80ms delay increments
- Scroll-triggered: `useInView()` with `once: true` for one-shot reveals, or `once: false` for scroll re-triggers
- Spring physics: `type: "spring"` with `bounce: 0.3` for interactive state changes only
- All animations respect `prefers-reduced-motion: reduce` (via CSS)

**Motion Timing:**
- Hero section: slow, ambient motion at very low opacity (0.02Hz breathing effect, NOT perpetual loops)
- Card hovers: 200–300ms color/opacity transitions, NO scale or glow transforms
- Number counters: 2s animation with `easeOut` easing

**Anti-Patterns in Animation:**
- NEVER use `animate-pulse`, `animate-bounce`, `animate-ping`, `repeat: Infinity` on decorative elements
- NEVER use `useAnimationFrame` for decorative motion (main-thread repaints at 60fps are banned)
- NEVER use `text-shadow` glows on headings (emphasis via weight + size only)
- Card hover effects do NOT grow, scale, or add chromatic glow — border + bg lift only
- No perpetual motion anywhere except the hero breathing effect

## Component Patterns

**Button Components:**
- Use `<Button>` from `@/components/ui/button` with `variant` prop
- Variants available: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `brand`, `brand-link`
- For hero/nav CTAs: use `brand` or `brand-link` variants ONLY (NOT `default` or `ghost`)
- `ShinyButton` component exists but usage is context-dependent (see CONCERNS for notes on animation intensity)

**Card Components:**
- Base: `bg-[var(--color-bg-raised)] border border-[var(--color-border-hairline)] hover:border-[var(--color-border-strong)] rounded-2xl`
- Hover effect: Apply `.card-glow` utility for subtle pseudo-element glow
- No `backdrop-blur` unless the card floats over content

**Eyebrow Badges:**
- Max one per page
- Pattern: `bg-[var(--color-accent-subtle)] border border-[var(--color-border-strong)] text-[var(--color-accent-hover)]`
- Never use colored borders or blue backgrounds on multiple elements

**Section Separators:**
- Hairline divider: `h-px bg-gradient-to-r from-transparent via-[var(--color-border-strong)] to-transparent`
- Used to create visual breathing room between sections

## Design System Constraints

**Dark Mode Only:**
- `<html class="dark">` is hardcoded in `src/app/layout.tsx`
- No light mode support — styling decisions are dark-first
- All backgrounds tinted toward blue-gray, never pure black or raw gray neutrals

**Banned Patterns (from `design/ANTI-PATTERNS.md`):**
- Never use raw `<button>` — wrap with `<Button>` component
- Never use `background-clip: text` with gradients (instant AI design tell)
- Never use `rgba(30, 64, 175, ...)` or `rgba(59, 130, 246, ...)` neon blue — use `--color-accent-subtle` instead
- Never use pure black `#0a0a0a`, `#000`, or literal `black` — use tinted `--color-bg-base`
- Never mix `zinc-*` and `slate-*` Tailwind scales — OKLCH tokens replace both
- Never use raw hex colors in components — always use CSS custom properties
- Never use `transition: all` — specify exact properties
- Never load Material Symbols via CDN in new work — Phosphor Light pending (currently Lucide used)
- Never re-introduce italic Instrument Serif payoff word convention (retired 2026-05-26)
- Never use Special Gothic Expanded One for the wordmark — that's Inter `font-black` 900 only

**Copy/Content Rules:**
- No exclamation marks anywhere on the site
- No em-dashes substituting commas

## React & Next.js Patterns

**Server Components by Default:**
- All pages and most components are Server Components (RSC)
- Add `"use client"` only to components that need interactivity (hooks, browser APIs)
- Client components are "leaves" — push interactivity to the boundary

**Environment Variables:**
- NEXT_PUBLIC_* prefix for client-side vars (e.g., `NEXT_PUBLIC_APP_URL`)
- Access via `process.env.*`
- Example: `const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.el-portal.app"`

**Data & Type Safety:**
- All component props typed via TypeScript interfaces
- No `any` types — strict mode enforced
- External data (if needed) typed in `src/data/` directory

---

*Convention analysis: 2026-06-12*
