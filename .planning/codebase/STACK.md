# Technology Stack

**Analysis Date:** 2026-06-12

## Languages

**Primary:**
- TypeScript 5 (strict mode) - All application code, configuration files, and type definitions

**Secondary:**
- JavaScript (ES2017 target) - For CSS/build configuration via `.mjs` files

## Runtime

**Environment:**
- Node.js (no explicit version file; follows Next.js 16 requirements, typically 18+)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Next.js 16.1.6 - App Router, React Server Components (RSC) enabled by default
- React 19.2.3 - UI component library, rendering engine

**Styling:**
- Tailwind CSS 4 - Utility-first CSS; configured via `@theme inline` in `src/app/globals.css` (no `tailwind.config.ts`)
- PostCSS 4 (via `@tailwindcss/postcss`) - CSS processing pipeline (`postcss.config.mjs`)

**Animation & Motion:**
- Framer Motion 12.34.3 - Scroll animations, micro-interactions, scroll-triggered components
- Remotion 4.0.429 - Video composition/rendering for embedded animations

**UI Component Framework:**
- shadcn/ui (New York style) - Pre-built accessible components
- Radix UI 1.4.3 - Headless UI primitives (dependency of shadcn)
- Class Variance Authority 0.7.1 - Component variant patterns

**Utilities:**
- React Intersection Observer 10.0.3 - Visibility detection for scroll-triggered animations
- clsx 2.1.1 - Conditional className composition
- Tailwind Merge 3.5.0 - Resolve conflicting Tailwind utilities
- Lucide React 0.575.0 - Icon library
- tw-animate-css 1.4.0 - Additional Tailwind animation utilities

## Key Dependencies

**Critical:**
- `next` 16.1.6 - Full-stack React framework with App Router, SSR, static generation
- `react` + `react-dom` 19.2.3 - React canary release for concurrent features and new JSX transform
- `framer-motion` 12.34.3 - Primary motion library (scroll, entrance, stagger animations)
- `remotion` + `@remotion/player` 4.0.429 - Embedded video compositions for animated content

**Infrastructure:**
- `tailwindcss` 4 - CSS utility framework with PostCSS integration
- `@tailwindcss/postcss` 4 - Next.js v4 Tailwind integration via PostCSS
- `typescript` 5 - Static type checking and compilation
- `eslint` 9 + `eslint-config-next` 16.1.6 - Linting with Next.js/React rules and Core Web Vitals

## Configuration

**Environment:**
- `NEXT_PUBLIC_APP_URL` - Public environment variable for linking to the main El Portal app (defaults to `https://app.el-portal.app`)
  - Used in: `src/components/Navbar.tsx`, `src/components/Hero.tsx`, `src/app/pricing/page.tsx`, `src/components/CTASection.tsx`, `src/app/mcp/page.tsx`
- `.env.local` file present (secrets management; contents not inspected per security policy)

**Build:**
- `tsconfig.json` - TypeScript strict mode enabled
  - Target: ES2017
  - Module resolution: bundler
  - Path aliases: `@/*` → `./src/*`
- `next.config.ts` - Minimal configuration; no additional exports or plugins
- `postcss.config.mjs` - Tailwind CSS PostCSS plugin only
- `eslint.config.mjs` - ESLint flat config using Next.js Core Web Vitals + TypeScript presets
- `components.json` - shadcn/ui configuration (New York style, RSC, Lucide icons, Tailwind CSS variables)

## Font Loading

**Server-side font loading via Next.js:**
- Inter (weights: 300, 400, 500, 600, 700, 900) - Body text and wordmark (font-black variant)
- JetBrains Mono (weights: 400, 500) - Code/metrics display
- Instrument Serif (weight: 400, italic) - Editorial accents (rare usage)
- Special Gothic Expanded One (weight: 400) - Display headings (H1, H2)

Fonts registered in `src/app/layout.tsx` with CSS variables:
- `--font-inter`
- `--font-jetbrains-mono`
- `--font-instrument-serif`
- `--font-special-gothic-expanded`

## Platform Requirements

**Development:**
- Node.js 18+ (inferred from Next.js 16 requirements)
- npm (or yarn/pnpm compatible with lockfile)
- Unix-like shell or Windows with bash (build scripts use standard npm conventions)

**Production:**
- Node.js 18+ runtime (if using `npm start` for standalone server)
- Or: Edge runtime via Vercel (Next.js default deployment target)
- Disk space: ~500MB (node_modules with all dependencies)

## Build & Dev Commands

```bash
npm run dev      # Start Next.js dev server (http://localhost:3000)
npm run build    # Production build (.next directory)
npm start        # Serve production build (requires npm run build first)
npm run lint     # Run ESLint with flat config
```

---

*Stack analysis: 2026-06-12*
