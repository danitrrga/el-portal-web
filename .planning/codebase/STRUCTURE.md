# Codebase Structure

**Analysis Date:** 2026-06-12

## Directory Layout

```
el-portal-hero/
├── .claude/                         # Project-specific Claude skills & configs
├── .antigravitycli/                 # AI CLI artifact directory (not committed)
├── public/                          # Static assets (images, icons, favicon)
├── src/
│   ├── app/                         # Next.js App Router (routes)
│   │   ├── layout.tsx               # Root layout (fonts, dark mode, Navbar/Footer wrapper)
│   │   ├── globals.css              # Global styles, Tailwind theme, OKLCH tokens
│   │   ├── page.tsx                 # Home page (/)
│   │   ├── manifesto/
│   │   │   └── page.tsx             # Manifesto page (/manifesto)
│   │   ├── methodology/
│   │   │   └── page.tsx             # Methodology page (/methodology)
│   │   ├── changelog/
│   │   │   └── page.tsx             # Changelog page (/changelog)
│   │   ├── pricing/
│   │   │   └── page.tsx             # Pricing page (/pricing)
│   │   ├── mcp/
│   │   │   └── page.tsx             # MCP integration page (/mcp)
│   │   ├── terms/
│   │   │   └── page.tsx             # Terms of service (/terms)
│   │   └── privacy/
│   │       └── page.tsx             # Privacy policy (/privacy)
│   └── components/                  # React components
│       ├── ui/                      # Base UI components (shadcn + custom)
│       │   ├── button.tsx           # Button with variants (brand, ghost, default)
│       │   ├── shiny-button.tsx     # Animated gradient border button
│       │   ├── card.tsx             # Surface container
│       │   ├── badge.tsx            # Small label/tag
│       │   ├── animated-group.tsx   # Framer Motion staggered animation wrapper
│       │   ├── accordion.tsx        # Collapsible content (shadcn)
│       │   ├── scroll-area.tsx      # Scrollable container
│       │   ├── separator.tsx        # Divider line
│       │   └── container-scroll-animation.tsx  # Scroll-triggered animation utility
│       ├── animations/              # Framer Motion & canvas animations
│       │   ├── PerformanceMetric.tsx  # Animated metric visualization (canvas)
│       │   ├── AnimationPlayers.tsx   # Animation utility wrapper
│       │   ├── AsymptoticAnimation.tsx  # Asymptotic curve animation
│       │   └── CyclesAnimation.tsx   # Cyclical animation
│       ├── remotion/                # Remotion video/animation exports
│       │   ├── AsymptoticCurve.tsx  # Remotion composition for curve
│       │   └── CyclicalRings.tsx    # Remotion composition for rings
│       ├── hero/                    # Hero section components
│       │   ├── HeroAppMockup.tsx    # Mobile app mockup visualization
│       │   ├── VCDSection.tsx       # Version/Cycle/Day explanation
│       │   └── McpIntegrationSection.tsx  # MCP protocol story
│       ├── Navbar.tsx               # Navigation bar (logo, links, mobile menu)
│       ├── Footer.tsx               # Footer (links, copyright)
│       ├── Hero.tsx                 # Main hero section (home page top)
│       ├── SystemBlueprintSection.tsx  # Feature grid & architecture overview
│       ├── MethodologyPreviewSection.tsx  # Teaser for methodology page
│       ├── MethodologyCard.tsx      # Reusable methodology card
│       ├── CTASection.tsx           # Call-to-action section
│       ├── ElPortalWordmark.tsx     # Logo & wordmark (Inter 900 + icon SVG)
│       ├── PortalIcon.tsx           # Portal icon SVG
│       ├── BoundedContainer.tsx     # Layout wrapper (max-width + padding)
│       ├── ReadingLayout.tsx        # Reading article layout
│       ├── CalloutCard.tsx          # Highlighted callout component
│       ├── ChangelogItem.tsx        # Changelog entry component
│       ├── CopyButton.tsx           # Copy-to-clipboard button (client)
│       └── DashboardPreview.tsx     # Dashboard mockup visualization
│   └── lib/
│       └── utils.ts                 # Utility functions (cn, clsx + merge)
├── eslint.config.mjs                # ESLint config (v9)
├── CLAUDE.md                        # Project-specific instructions
├── DESIGN.md                        # Historical design system reference
├── .impeccable.md                   # Brand identity & design context
├── GEMINI.md                        # Gemini/Claude integration notes
├── tailwind.config.ts               # Tailwind config (or inline in globals.css)
├── tsconfig.json                    # TypeScript config
├── next.config.ts                   # Next.js config
├── package.json                     # Dependencies
└── package-lock.json                # Lockfile
```

## Directory Purposes

**`src/app/`:**
- Purpose: App Router routes — one `page.tsx` per URL route
- Contains: Route-level pages (home, manifesto, methodology, etc.)
- Key files: `layout.tsx` (root wrapper), `globals.css` (design tokens), `page.tsx` files

**`src/app/globals.css`:**
- Purpose: Global styles, Tailwind configuration, design token palette
- Contains: OKLCH color tokens in `@theme inline`, font setup, scrollbar styling, animations
- Customization: Add new color tokens here, not in `tailwind.config.ts`

**`src/components/`:**
- Purpose: Reusable React components
- Contains: Sections, UI elements, animations, layouts
- Subdirectories: `ui/` (atomic), `animations/` (motion), `hero/` (homepage sections), `remotion/` (video)

**`src/components/ui/`:**
- Purpose: Base design system components — buttons, cards, badges, inputs
- Contains: shadcn/ui components + custom variants
- Pattern: Each component uses CVA (class-variance-authority) for style variants

**`src/components/animations/`:**
- Purpose: Framer Motion animations and canvas-based visualizations
- Contains: Scroll animations, metrics, curve/ring animations
- Usage: Imported by sections and pages for entrance/scroll effects

**`src/components/remotion/`:**
- Purpose: Remotion video composition exports
- Contains: Pre-rendered or frame-based animation compositions
- Usage: Rendered as videos/images and embedded in pages

**`src/components/hero/`:**
- Purpose: Homepage hero section sub-components
- Contains: App mockup, VCD explanation, MCP integration
- Used by: `src/app/page.tsx` and `src/components/Hero.tsx`

**`src/lib/`:**
- Purpose: Utility functions (not components)
- Contains: `cn()` function for class merging, helper functions
- Usage: Imported by components and pages

**`public/`:**
- Purpose: Static assets (images, icons, video files, fonts)
- Contains: Favicon, social preview image, remotion renders, SVGs
- Served as: Direct HTTP URLs (e.g., `/apple-touch-icon.png`)

## Key File Locations

**Entry Points:**
- Home page: `src/app/page.tsx` — renders Hero, VCD, MCP, SystemBlueprint, Methodology preview, CTA
- Root layout: `src/app/layout.tsx` — font loading, dark mode, Navbar/Footer wrapper
- Design tokens: `src/app/globals.css` — OKLCH palette, all color variables

**Configuration:**
- Tailwind: `src/app/globals.css` (not `tailwind.config.ts`)
- TypeScript: `tsconfig.json`
- ESLint: `eslint.config.mjs` (v9)
- Next.js: `next.config.ts`
- Project instructions: `CLAUDE.md`, `.impeccable.md` (brand), `DESIGN.md` (historical)

**Core Logic:**
- Page sections: `src/components/*Section.tsx` — VCD, MCP, SystemBlueprint, Methodology, CTA
- Navigation: `src/components/Navbar.tsx` — logo, links, mobile menu (client component)
- Footer: `src/components/Footer.tsx` — links, copyright
- Utilities: `src/lib/utils.ts` — `cn()` function

**Testing:**
- Not set up — no tests yet. Future: tests in `src/**/*.test.tsx` or `__tests__/` directories

## Naming Conventions

**Files:**
- Components: PascalCase (e.g., `Hero.tsx`, `Navbar.tsx`, `VCDSection.tsx`)
- Pages: `page.tsx` in each route directory (Next.js convention)
- Layout files: `layout.tsx` (Next.js convention)
- Utilities: camelCase (e.g., `utils.ts`, `types.ts`)
- Styles: `globals.css` for global, inline styles in components, no CSS modules

**Directories:**
- Feature sections: `src/components/{Feature}Section.tsx` (e.g., `MethodologyPreviewSection.tsx`)
- Sub-components of a section: `src/components/{feature}/*.tsx` (e.g., `src/components/hero/VCDSection.tsx`)
- Routes: lowercase, kebab-case inside `src/app/` (e.g., `/methodology`, `/mcp`, `/privacy`)
- UI components: lowercase, kebab-case (e.g., `animated-group.tsx`, `shiny-button.tsx`)

**Variables & Functions:**
- Constants (colors, data): SCREAMING_SNAKE_CASE (e.g., `FG_STRONG`, `SECTION_BG`, `PRINCIPLES[]`)
- Functions: camelCase (e.g., `cn()`, `SectionEyebrow()`)
- React components: PascalCase (e.g., `Hero`, `Navbar`, `AnimatedGroup`)
- CSS custom properties: kebab-case prefixed with `--color-`, `--font-`, `--shadow-` (e.g., `--color-primary`, `--font-sans`)

**Import Aliases:**
- `@/components/*` — components directory
- `@/lib/*` — lib utilities
- `@/app/*` — app directory (rarely used in components)

## Where to Add New Code

**New Feature / Marketing Section:**
- Create section file: `src/components/NewFeatureSection.tsx`
- Export it from the component
- Import it in the relevant page (e.g., `src/app/page.tsx` for homepage)
- Compose it into the page JSX alongside other sections

**New Page (Route):**
- Create directory: `src/app/{new-route}/`
- Add `page.tsx` inside it: `src/app/{new-route}/page.tsx`
- Import Navbar and Footer (persistent across all pages)
- Build page content by composing sections and UI components
- Update Navbar nav links if it should appear in main menu

**New UI Component (Reusable):**
- Create in `src/components/ui/{component-name}.tsx`
- Use CVA (class-variance-authority) for variants if it has multiple styles
- Export the component and its variants/types
- Follow shadcn pattern: small, single-responsibility, composable

**New Animation / Effect:**
- Canvas-based or Framer Motion: `src/components/animations/{EffectName}.tsx`
- Remotion composition: `src/components/remotion/{EffectName}.tsx`
- Use Framer Motion `motion.*` components or Remotion `<Composition>`
- Export as client component (`"use client"` at top)

**New Utility Function:**
- Add to `src/lib/utils.ts` or create a new file in `src/lib/`
- Use camelCase for function names
- Export and import with `@/lib/` alias

**New Color Token or Design Variable:**
- Add to `src/app/globals.css` in the `@theme inline { ... }` block
- Use `--color-*`, `--font-*`, `--shadow-*` naming
- Reference in components via `style={{ color: 'var(--color-primary)' }}` or Tailwind utilities

**New Page-Level Constant (Data, Colors):**
- Define at the top of the page file (e.g., `src/app/methodology/page.tsx`)
- Pattern: SCREAMING_SNAKE_CASE for constants (e.g., `FG_STRONG`, `ACCENT`, `PRINCIPLES`)
- Keep data structures near the top so they're visible; component JSX below

## Special Directories

**`.claude/skills/`:**
- Purpose: Project-specific Claude agents and skills for design, code, etc.
- Generated: Yes (via `npx skills add` commands)
- Committed: Yes, checked into git

**`.antigravitycli/`:**
- Purpose: Temporary build artifacts from antigravity CLI
- Generated: Yes (AI CLI tool output)
- Committed: No (in `.gitignore`)

**`public/`:**
- Purpose: Static files served as-is by Next.js
- Generated: Partially (remotion renders output here)
- Committed: Yes

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes (from `npm install`)
- Committed: No (in `.gitignore`)

**`.next/`:**
- Purpose: Next.js build output
- Generated: Yes (from `npm run build`)
- Committed: No (in `.gitignore`)

---

*Structure analysis: 2026-06-12*
