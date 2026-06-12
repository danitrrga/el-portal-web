# Phase 1: Token Foundation — Research

**Researched:** 2026-06-12
**Domain:** CSS custom property migration (hex/rgba → var(--…)) across Next.js/Tailwind v4 marketing components
**Confidence:** HIGH — all findings derived by direct source-code reading of the exact files to be modified

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TOKEN-01 | Hero and shared landing components reference `--color-*` / CSS variable tokens instead of hardcoded hex | Full inventory in §Hardcoded Color Inventory below |
| TOKEN-02 | Hardcoded glow values (`rgba(30,64,175,…)`, `rgba(59,130,246,…)`) are tokenized at current value — no color change | §Critical Issue — Value Equality; §Glow Value Tokens |
| TOKEN-04 | Migration is value-preserving — home page pixel- and motion-identical before and after | §Verification Approach; §Motion — Do Not Touch |
| QUAL-03 | No new banned anti-patterns introduced in touched files | §Banned Anti-Patterns (QUAL-03) |
</phase_requirements>

---

## Summary

Phase 1 is a purely mechanical refactor: every hardcoded `#hex` and `rgba(…)` color literal in the home-page render tree is replaced with a `var(--…)` CSS custom property, and the variable is defined to hold the **exact same value**. The page must be byte-for-byte identical in rendered appearance before and after.

The central technical risk is **value-space mismatch**: `globals.css` defines its ink-blue OKLCH tokens in OKLCH notation, while the components use hex/rgba. These are different color spaces and browsers may not render them identically at sub-pixel precision. The safe, value-preserving approach is therefore to **not** remap hardcoded values onto the OKLCH tokens. Instead, introduce a dedicated CSS variable for each distinct hardcoded value, defined in hex/rgba exactly as it appears today, and wire the component to that variable. The OKLCH tokens are left unchanged; they remain the aspirational target for future phases.

Only two components lie **outside** strict Phase 1 scope: `CalloutCard.tsx` and `DashboardPreview.tsx` are imported by pages other than the home page, but `CalloutCard` is never imported by `page.tsx` at all, and `DashboardPreview` is only referenced inside `HeroAppMockup` which is part of the Hero. Both are included in the inventory below because they carry significant hardcoded values — the plan must decide whether to migrate them as "sweep them up since Hero is in scope" or defer them. The research flags both and recommends migrating them: they are effectively owned by the Hero render tree.

**Primary recommendation:** Define a `/* Phase 1 value-equal tokens */` block in `globals.css` under `@theme inline`, named `--color-ep-*` to distinguish from the future OKLCH system. Each token holds the exact current hex/rgba. Replace inline values in components with `var(--color-ep-*)`. Touch nothing else.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Color token definition | CSS / globals.css | — | Single source of truth for all design tokens |
| Component color application | Client component (JSX `style={}` or Tailwind class) | — | Components consume tokens via `var()` |
| Visual regression check | Browser / developer | — | No automated test suite; manual before/after diff |
| TypeScript safety | Build-time (tsc) | — | No TS changes needed — only string values change |

---

## Scope: Components That Render on the Home Page

`src/app/page.tsx` imports and renders (in order):

| Component | File | Has Hardcoded Colors? |
|-----------|------|-----------------------|
| `Navbar` | `src/components/Navbar.tsx` | YES — nav bg, link colors |
| `Hero` | `src/components/Hero.tsx` | YES — bg, borders, text colors, announcement pill |
| `HeroAppMockup` | `src/components/hero/HeroAppMockup.tsx` | No (Image tag only) |
| `VCDSection` | `src/components/hero/VCDSection.tsx` | YES — many constants |
| `McpIntegrationSection` | `src/components/hero/McpIntegrationSection.tsx` | YES — ring borders, radial bg |
| `DashboardPreview` | `src/components/DashboardPreview.tsx` | YES — extensively (slate-*, hex, rgba) |
| `SystemBlueprintSection` | `src/components/SystemBlueprintSection.tsx` | YES — section/mockup bg constants |
| `MethodologyPreviewSection` | `src/components/MethodologyPreviewSection.tsx` | YES — constants |
| `CTASection` | `src/components/CTASection.tsx` | YES — constants |
| `Footer` | `src/components/Footer.tsx` | YES — zinc-* classes |
| `PerformanceMetric` | `src/components/animations/PerformanceMetric.tsx` | YES — rgba glow values |
| `CalloutCard` | `src/components/CalloutCard.tsx` | YES — `#0a0a0a`, rgba glow |

**Note on `PerformanceMetric` and `CalloutCard`:**
- `PerformanceMetric` is NOT directly imported by `page.tsx` but IS used inside sections that render on the home page. After tracing: it is only referenced in `SystemBlueprintSection` indirectly — actually, scanning confirms `PerformanceMetric` is in `src/components/animations/` and is not found in any home-page component import. It is included in scope because it was explicitly called out in the phase requirements and CONCERNS.md.
- `CalloutCard` is NOT imported by `page.tsx` or any component in the home tree based on source-file reading. It is out of strict home-page scope but included in requirements. The plan must decide: migrate it anyway (low risk, shared component) or defer it. Recommendation: migrate it — it's tiny and its glow values are identical to values already needing tokens.

**`page.tsx` itself:** Line 12 has `bg-[#02030a]` and line 14 has `bg-[#02030a]` plus an inline gradient with `#ffffff1a`. These are in scope.

**Components confirmed NOT on home page (out of Phase 1 scope):**
- `src/app/manifesto/page.tsx`, `methodology/page.tsx`, `changelog/page.tsx`, `pricing/page.tsx`, `mcp/page.tsx`, `terms/page.tsx`, `privacy/page.tsx` and their unique sub-components
- `ChangelogItem.tsx`, `ReadingLayout.tsx`, `BoundedContainer.tsx`, `MethodologyCard.tsx`

---

## Globals.css Token Inventory (Complete)

All variables defined in `@theme inline` block (lines 32–89):

### Custom brand tokens (the project's own hex-based tokens)

| Variable | Value | Notes |
|----------|-------|-------|
| `--color-primary` | `#1E40AF` | Brand blue — used via Tailwind `text-primary`, `bg-primary`, etc. |
| `--color-primary-glow` | `#3B82F6` | Banned per CONCERNS.md (too flat/bright) — used in `DashboardPreview` |
| `--color-accent-green` | `#10b981` | Green accent — used in `DashboardPreview` |
| `--color-accent-neon-green` | `#34d399` | Lighter green |
| `--color-accent-red` | `#ef4444` | Red accent |
| `--color-background-base` | `#020617` | Note: different from actual bg used (`#02030a`) — subtle but real difference |
| `--color-glass-surface` | `rgba(255,255,255,0.03)` | Glass bg |
| `--color-glass-border` | `rgba(255,255,255,0.06)` | Glass border |
| `--color-glass-highlight` | `rgba(255,255,255,0.08)` | Glass highlight |
| `--color-surface` | `rgba(2,6,23,0.8)` | Dark surface with opacity |
| `--color-surface-hover` | `rgba(15,23,42,0.7)` | Hover surface |
| `--shadow-glow-blue` | `0 0 40px -10px rgba(30,64,175,0.5)` | Used in `DashboardPreview` |
| `--shadow-glow-green` | `0 0 40px -10px rgba(16,185,129,0.4)` | — |
| `--shadow-glass` | `0 8px 32px 0 rgba(0,0,0,0.4)` | — |

### Shadcn/Tailwind system tokens (dark mode `.dark {}` block, lines 197–229)

| Variable | Value |
|----------|-------|
| `--background` | `#02030a` |
| `--foreground` | `#f4f4f5` |
| `--card` | `#02030a` |
| `--primary` | `hsl(222,84%,35%)` |
| `--primary-foreground` | `#ffffff` |
| `--muted` | `#18181b` |
| `--muted-foreground` | `#a1a1aa` |
| `--border` | `rgba(255,255,255,0.05)` |

### Utility classes with hardcoded values (in globals.css body, NOT in @theme)

| Utility | Hardcoded value |
|---------|----------------|
| `.text-glow-hero` | `text-shadow: 0 0 40px rgba(30,64,175,0.35), 0 0 12px rgba(255,255,255,0.08)` |
| `.glass-panel` | `background: rgba(2,6,23,0.7)`, border `rgba(148,163,184,0.08)`, shadow rgba values |
| `.card-glow::before` | `rgba(30,64,175,0.04)`, `rgba(139,92,246,0.03)` |
| `html` | `background: #02030a` |
| `body` | `color: #cbd5e1` |
| scrollbar | `#020617`, `#1e293b`, `#334155` |

---

## Hardcoded Color Inventory (THE CENTERPIECE)

Complete table of every hardcoded color value in in-scope components. Values are copied verbatim from source. "Value-equal token?" means: does an existing `--color-*` var in globals.css resolve to this **exact same value**?

### KEY: Value-Equal Token Assessment

Before reading the table, understand the assessment logic:

- **YES (exact)** — An existing token resolves to the **identical** hex string or rgba values.
- **NO — new var needed** — No existing token matches. A new CSS var must be added to globals.css holding this exact value.
- **APPROX (RISK)** — The existing OKLCH token is close but NOT provably byte-identical. Do NOT use it for value-preserving migration.
- **Tailwind utility** — Value comes from a Tailwind class like `bg-primary` which resolves through the token system already.

### page.tsx (src/app/page.tsx)

| Line | Current Value | Context | Proposed Token | Value-Equal? |
|------|---------------|---------|----------------|--------------|
| 12 | `#02030a` | Page wrapper div bg | `--color-ep-bg-base` | NO — `--color-background-base` is `#020617`, different value. New var needed. |
| 14 | `#02030a` | Background radial div bg (repeated) | `--color-ep-bg-base` | Same as above |
| 14 | `#ffffff1a` (in Tailwind arbitrary bg-[linear-gradient…]) | Grid texture line color | `--color-ep-grid-line` | NO — new var needed. Value = `rgba(255,255,255,0.10)` |

### Hero.tsx (src/components/Hero.tsx)

| Line | Current Value | Context | Proposed Token | Value-Equal? |
|------|---------------|---------|----------------|--------------|
| 34 | `#02030a` | Hero `<main>` background (inline style) | `--color-ep-bg-base` | NO — new var needed |
| 40 | `rgba(96,165,235,0.05)` | Atmospheric radial gradient stop 1 | `--color-ep-atmos-1` | NO — new var needed |
| 40 | `rgba(68,135,214,0.02)` | Atmospheric radial gradient stop 2 | `--color-ep-atmos-2` | NO — new var needed |
| 40 | `rgba(8,56,133,0)` | Atmospheric radial gradient stop 3 (transparent) | `transparent` | YES (transparent literal) |
| 41 | `rgba(150,200,245,0.028)` | Atmospheric radial left strip stop 1 | `--color-ep-atmos-3` | NO — new var needed |
| 41 | `rgba(68,135,214,0.01)` | Atmospheric radial left strip stop 2 | `--color-ep-atmos-4` | NO — new var needed |
| 42 | `rgba(180,215,250,0.02)` | Atmospheric radial left strip 2 stop 1 | `--color-ep-atmos-5` | NO — new var needed |
| 42 | `rgba(96,165,235,0.008)` | Atmospheric radial left strip 2 stop 2 | `--color-ep-atmos-6` | NO — new var needed |
| 64 | `#000` | Bottom fade gradient end color | `--color-ep-pure-black` | NO — banned anti-pattern (#000). However: this is a decorative overlay fade-to-black, not a surface or text color. It is correct here (the gradient needs to fade to pure black to kill the seam). New var `--color-ep-fade-black` = `#000000`. |
| 73 | `#02030a` | Radial inside section, bg in [background:…] | `--color-ep-bg-base` | NO — new var needed (same token as above) |
| 84–86 | `rgba(255,255,255,0.04)` | Announcement pill background | `--color-ep-pill-bg` | NO — new var needed |
| 84–86 | `rgba(255,255,255,0.10)` | Announcement pill border | `--color-ep-pill-border` | APPROX — `--color-glass-highlight` is `rgba(255,255,255,0.08)` (close but not 0.10). New var needed. |
| 88 | `#aab3c5` | Pill text muted | `--color-ep-fg` | NO — new var needed |
| 89 | `#77B7ED` | Pill "Early access" accent text | `--color-ep-accent-light` | NO — new var needed |
| 89 | `rgba(255,255,255,0.20)` | Pill separator dot | `--color-ep-separator` | NO — new var needed |
| 95 | `rgba(255,255,255,0.15)` | Pill divider bar | `--color-ep-divider` | NO — new var needed |
| 99 | `rgba(255,255,255,0.06)` | Pill arrow button bg | `--color-ep-pill-btn-bg` | YES — `--color-glass-border` = `rgba(255,255,255,0.06)` is EXACT match. Can use existing token. |
| 103, 106 | `#f4f6fb` | Arrow icon color | `--color-ep-fg-strong` | NO — new var needed. Note: `--foreground` = `#f4f4f5` (different last digit). New var needed. |
| 117 | `#f4f6fb` | H1 color | `--color-ep-fg-strong` | Same as above |
| 126 | `#aab3c5` | Subheading / body text color | `--color-ep-fg` | NO — new var needed. `--muted-foreground` = `#a1a1aa` (different). |
| 186 | `rgba(255,255,255,0.08)` | Mockup frame border color | `--color-ep-frame-border` | YES — `--color-glass-highlight` = `rgba(255,255,255,0.08)` is EXACT match. Can use existing token. |
| 186 | `#02030a` | Mockup frame background | `--color-ep-bg-base` | Same new var as before |
| 194 | `rgba(0,0,0,0.4)` | Mockup frame box-shadow color | `--color-ep-shadow-dark` | NO — `--shadow-glass` has different values. New var needed. |

### VCDSection.tsx (src/components/hero/VCDSection.tsx)

Constants at top of file drive all inline styles. Map each constant:

| Constant | Value | Proposed Token | Value-Equal? |
|----------|-------|----------------|--------------|
| `SECTION_BG` = `#04060c` | Section background | `--color-ep-section-bg` | NO — `#02030a` is different. New var. |
| `FG_STRONG` = `#ffffff` | Strong text | `--color-ep-fg-strong-white` | YES — `--color-primary-foreground` = `#ffffff`. Can reuse, but it's semantically misnamed. Better to use a dedicated `--color-ep-fg-strong`. Either works; the plan should decide. For safety: dedicated var. |
| `FG` = `#d4d9e3` | Body text | `--color-ep-fg-body` | NO — new var. `--foreground` = `#f4f4f5` (totally different). |
| `FG_MUTED` = `#a8b0c0` | Muted text | `--color-ep-fg-muted` | NO — close to `#a1a1aa` but not equal. New var. |
| `ACCENT` = `#4487D6` | Brand accent | `--color-ep-accent` | NO — `--color-primary` = `#1E40AF` (different). New var. |
| `ACCENT_LIGHT` = `#77B7ED` | Light accent | `--color-ep-accent-light` | NO — same as Hero.tsx line 89. Same new var. |
| `WHITE_STRONG` = `rgba(255,255,255,0.92)` | Strong white | `--color-ep-white-strong` | NO — new var. |
| `WHITE` = `rgba(255,255,255,0.55)` | Mid white | `--color-ep-white` | NO — new var. |
| `WHITE_DIM` = `rgba(255,255,255,0.22)` | Dim white | `--color-ep-white-dim` | NO — new var. |
| `WHITE_TRACK` = `rgba(255,255,255,0.08)` | Track/inactive | `--color-ep-white-track` | YES — `--color-glass-highlight` = `rgba(255,255,255,0.08)`. Exact match. |

Inline values not covered by constants:

| Location | Value | Proposed Token | Value-Equal? |
|----------|-------|----------------|--------------|
| Line 218 (cycle tick) | `rgba(255,255,255,0.2)` | `--color-ep-tick` | NO — new var. `rgba(255,255,255,0.20)` == `rgba(255,255,255,0.2)` (same, just notation). Consolidate with `--color-ep-separator` from Hero. |
| Line 228 (active highlight) | `rgba(255,255,255,0.18)` | `--color-ep-active-highlight` | NO — new var. |
| Line 313 (today dot glow) | `rgba(255,255,255,0.6)` | `--color-ep-dot-glow` | NO — new var. |
| Line 313 (today dot glow accent) | `#77B7EDcc` (hex with alpha) | Note: this is ACCENT_LIGHT (`#77B7ED`) with `cc` alpha appended. | Reuse `--color-ep-accent-light` and apply as `rgba(119,183,237,0.8)` or keep the `${ACCENT_LIGHT}cc` template literal pattern. |

### McpIntegrationSection.tsx (src/components/hero/McpIntegrationSection.tsx)

| Line | Current Value | Context | Proposed Token | Value-Equal? |
|------|---------------|---------|----------------|--------------|
| 36 | `rgba(119,183,237,0.30)` | Outer ring border-top | `--color-ep-ring-border-outer` | NO — new var. Note: `119,183,237` = `#77B7ED` = ACCENT_LIGHT. Could compute from existing var but safer as new var. |
| 37 | `rgba(68,135,214,0.18)` | Outer ring radial bg | `--color-ep-ring-bg-outer` | NO — new var. `68,135,214` ≈ `#4487D6` = ACCENT but opacity differs. |
| 55 | `rgba(119,183,237,0.22)` | Inner ring border-top | `--color-ep-ring-border-inner` | NO — new var. |
| 56 | `rgba(56,103,214,0.14)` | Inner ring radial bg | `--color-ep-ring-bg-inner` | NO — new var. |
| 76 | `#f4f6fb` | MCP logo icon color | `--color-ep-fg-strong` | Reuse from Hero inventory |

### DashboardPreview.tsx (src/components/DashboardPreview.tsx)

This component is the most Tailwind-heavy and uses many `slate-*` classes plus some hex and rgba values. Tailwind `slate-*` classes resolve through Tailwind's default palette, NOT through the project's OKLCH tokens. They are still hardcoded colors — just written as utility classes rather than inline styles.

**Assessment:** The `slate-*` classes in `DashboardPreview` are a known concern (CONCERNS.md line 6). However, for a strict value-preserving migration, converting `slate-950` to `var(--…)` only makes sense if the var is set to the exact same value (`#020617` for slate-950). This is doable but adds noise. The phase requirement says "reference `--color-*` tokens instead of hardcoded hex" — Tailwind utilities referencing the default palette technically count as "hardcoded" (they bake in a Tailwind value, not a project token).

**Decision for the planner:** Include `DashboardPreview`'s inline style values (the rgba glow values and the hex `#3B82F6` line) in Phase 1. For the `slate-*` Tailwind utility classes, the plan should migrate only the inline `style={}` hardcoded values and leave Tailwind class-based colors (since they require converting to `bg-[var(--…)]` syntax and are a separate concern that could be handled in a follow-up). This is the safest bounded scope.

| Location | Current Value | Context | Proposed Token | Value-Equal? |
|----------|---------------|---------|----------------|--------------|
| Line 10 | `shadow-[0_0_10px_rgba(30,64,175,0.5)]` (Tailwind arbitrary) | Logo glow shadow | Stays as Tailwind class OR extract to var. **For value-preservation: leave as-is.** | N/A — no inline style |
| Line 10 | `bg-gradient-to-br from-blue-500 to-purple-600` | Logo dot gradient | **BANNED**: `background-clip: text` would be banned, but this is a bg gradient on a div, not text. However, this is `bg-gradient-to-br` which is fine. Leave as-is (it's a Tailwind class, not inline hex). | N/A |
| Line 11 | `text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400` | "PORTAL" text (wordmark in mockup) | **BANNED**: `background-clip: text` with gradient = banned anti-pattern (CLAUDE.md ban). This is a pre-existing violation. QUAL-03 says "no new" banned patterns — don't introduce new ones, but don't fix pre-existing ones either this phase. **Document only.** | Pre-existing ban violation |
| Line 220–237 (SVG path) | `stroke="#3B82F6"` | Chart SVG line | `--color-ep-chart-line` → new var | NO — `--color-primary-glow` = `#3B82F6` is exact. But CONCERNS.md flags this token as banned (too flat/bright). Use new `--color-ep-chart-line` = `#3B82F6` instead. |
| Lines 220–237 (SVG gradient stops) | `rgba(30,64,175,0.3)` | Chart area fill stop 1 | `--color-ep-glow-blue-30` | NO — new var |
| Lines 220–237 (SVG gradient stops) | `rgba(30,64,175,0)` | Chart area fill stop 2 (transparent) | `transparent` | YES |

### SystemBlueprintSection.tsx (src/components/SystemBlueprintSection.tsx)

Constants at top:

| Constant | Value | Proposed Token | Value-Equal? |
|----------|-------|----------------|--------------|
| `BG` = `#04060c` | Section/mockup bg | `--color-ep-section-bg` | Same as VCDSection SECTION_BG. Reuse. |
| `FG_STRONG` = `#ffffff` | Strong text | `--color-ep-fg-strong-white` | Same as VCDSection |
| `FG` = `#d4d9e3` | Body text | `--color-ep-fg-body` | Same as VCDSection |
| `FG_MUTED` = `#a8b0c0` | Muted text | `--color-ep-fg-muted` | Same as VCDSection |
| `FG_SUBTLE` = `#6f7889` | Subtle text | `--color-ep-fg-subtle` | NO — new var |
| `RULE` = `rgba(255,255,255,0.14)` | Divider lines | `--color-ep-rule` | NO — new var |

Inline value in `CardDecorator`:

| Location | Value | Proposed Token | Value-Equal? |
|----------|-------|----------------|--------------|
| `LINE` = `rgba(255,255,255,0.22)` (line 451) | Edge trace gradients | `--color-ep-white-dim` | YES — same as VCDSection `WHITE_DIM`. Consolidate. |

Also: `LabMockup` friction dot: `background: "#ef4444"` (line 162) = `--color-accent-red` already defined in globals.css as `#ef4444`. **EXACT MATCH — use existing token.**

### MethodologyPreviewSection.tsx (src/components/MethodologyPreviewSection.tsx)

Constants at top:

| Constant | Value | Proposed Token | Value-Equal? |
|----------|-------|----------------|--------------|
| `SECTION_BG` = `#04060c` | Section bg | `--color-ep-section-bg` | Reuse — same as VCDSection, SystemBlueprint |
| `FG_STRONG` = `#f4f6fb` | Strong text | `--color-ep-fg-strong` | NO — different from `#ffffff`. New var. Note: same as Hero's `#f4f6fb`. Consolidate. |
| `FG` = `#aab3c5` | Body text | `--color-ep-fg` | Same as Hero `#aab3c5`. Reuse. |
| `FG_MUTED` = `#8590a8` | Muted text | `--color-ep-fg-muted-2` | NO — `#8590a8` ≠ VCDSection's `#a8b0c0`. Different var needed OR rename: VCD's muted is lighter. |
| `FG_SUBTLE` = `#5a6478` | Subtle text | `--color-ep-fg-subtle-2` | NO — `#5a6478` ≠ SystemBlueprint's `#6f7889`. Different values. |
| `ACCENT` = `#4487D6` | Accent | `--color-ep-accent` | Same as VCDSection. Reuse. |

### CTASection.tsx (src/components/CTASection.tsx)

| Constant | Value | Proposed Token | Value-Equal? |
|----------|-------|----------------|--------------|
| `SECTION_BG` = `#04060c` | Section bg | `--color-ep-section-bg` | Reuse |
| `FG_STRONG` = `#f4f6fb` | Strong text | `--color-ep-fg-strong` | Reuse (same as Methodology) |
| `FG` = `#aab3c5` | Body text | `--color-ep-fg` | Reuse |
| `FG_MUTED` = `#8590a8` | Muted text | `--color-ep-fg-muted-2` | Reuse `--color-ep-fg-muted-2` |
| `ACCENT` = `#4487D6` | Accent | `--color-ep-accent` | Reuse |

Inline in CTA:

| Line | Value | Proposed Token | Value-Equal? |
|------|-------|----------------|--------------|
| 25 | `rgba(255,255,255,0.12)` | Top hairline via gradient | `--color-ep-hairline` | NO — new var |

### Navbar.tsx (src/components/Navbar.tsx)

| Location | Current Value | Context | Proposed Token | Value-Equal? |
|----------|---------------|---------|----------------|--------------|
| Line 29 | `rgba(10,16,32,0.6)` | Nav bg | `--color-ep-nav-bg` | NO — new var |
| Line 30 | `border-white/[0.05]` | Nav border | Already Tailwind `white/[0.05]` = `rgba(255,255,255,0.05)`. `--border` = same value. Could alias; for now leave as Tailwind. | N/A |
| Line 32 | `rgba(0,0,0,0.5)` | Nav drop shadow | `--color-ep-nav-shadow` | NO — new var |
| Lines 49, 103 | `#f4f6fb` | Active nav link text | `--color-ep-fg-strong` | Reuse |
| Lines 50, 91, 93, 103 | `#aab3c5` | Inactive nav link text | `--color-ep-fg` | Reuse |
| Line 69 (mobile hamburger) | `#aab3c5` / `#f4f6fb` | Icon colors | `--color-ep-fg` / `--color-ep-fg-strong` | Reuse |
| Line 85 | `rgba(4,6,12,0.95)` | Mobile menu bg | `--color-ep-mobile-menu-bg` | NO — new var |

### Footer.tsx (src/components/Footer.tsx)

The Footer uses `zinc-*` Tailwind classes (not inline hex). These are class-based color values.

| Location | Current Value | Context | Proposed Token | Note |
|----------|---------------|---------|----------------|------|
| Line 70 | `font-serif italic text-2xl text-zinc-100` | Brand wordmark | The `font-serif italic` is a pre-existing violation of the retired convention (CONCERNS.md confirms). Do NOT fix this phase. | Pre-existing |
| Line 74 | `text-zinc-500` | Footer body text | This is a Tailwind utility. For value-preserving, either leave it OR replace with `text-[#71717a]` (zinc-500 hex = `#71717a`). Recommendation: leave Tailwind classes untouched this phase. `zinc-*` in Footer is a legitimate Phase 3 item. | Out of scope |
| Line 82 | `text-zinc-500` | Footer column headers | Same — leave |
| Line 88 | `text-zinc-400` | Footer links | Same — leave |
| Line 93 | `text-zinc-100` | Footer link hover | Same — leave |
| Line 103 | `text-zinc-500` | Copyright text | Same — leave |

**Footer verdict:** The Footer's `zinc-*` classes are outside Phase 1 scope. They will be addressed in Phase 3 (Legal Pages Rebrand) or a dedicated pass. No migration needed in Phase 1 unless the planner wants to include it as a "sweep." Research recommendation: exclude Footer from Phase 1 to keep scope tight.

### PerformanceMetric.tsx (src/components/animations/PerformanceMetric.tsx)

| Line | Current Value | Context | Proposed Token | Value-Equal? |
|------|---------------|---------|----------------|--------------|
| 39 | `hover:shadow-[0_0_40px_-10px_rgba(30,64,175,0.2)]` | Code block hover glow (Tailwind arbitrary) | Could become `hover:shadow-[var(--shadow-ep-glow-blue-20)]` — but this requires a shadow var, not a color var. | NO — create `--shadow-ep-glow-blue-20: 0 0 40px -10px rgba(30,64,175,0.2)` |
| 40 | `bg-zinc-950/80` (line 40) | Code block header bar | Tailwind utility — leave |
| 48 | `bg-[#0d1117]` | Code area background | `--color-ep-code-bg` | NO — new var |
| 68 | `bg-white/[0.03]` | Visualization panel bg | Already Tailwind `white/[0.03]` — close to `--color-glass-surface` = `rgba(255,255,255,0.03)`. **EXACT MATCH if needed.** Leave as Tailwind or alias. |
| 78 | `bg-primary shadow-[0_0_15px_-3px_rgba(30,64,175,0.6)]` | Habit bar 1 | `bg-primary` already uses token. Shadow: `--shadow-ep-habit-bar: 0 0 15px -3px rgba(30,64,175,0.6)` | NO — new shadow var |
| 78 | `bg-primary/50` | Habit bar 2 | Token-based — leave |
| 78 | `bg-primary/20` | Habit bar 3 | Token-based — leave |
| 103–104 | `textShadow: "0 0 40px rgba(30, 64, 175, 0.4), 0 0 12px rgba(255, 255, 255, 0.1)"` | Animated text glow (the TOKEN-02 glow) | See §Glow Value Tokens below | Critical — TOKEN-02 |
| 115 | `bg-zinc-900` | Tooltip bg | Tailwind — leave |

### CalloutCard.tsx (src/components/CalloutCard.tsx)

| Line | Current Value | Context | Proposed Token | Value-Equal? |
|------|---------------|---------|----------------|--------------|
| 30 | `bg-gradient-to-b from-blue-700/50 to-transparent` | Gradient border wrapper | Tailwind class — leave (it's a utility, not inline hex) |
| 32 | `bg-[#0a0a0a]` | Card background | `--color-ep-callout-bg` | NO — `#0a0a0a` ≠ `#02030a`. New var. Also: CONCERNS.md flags this as "pure black" anti-pattern. However, QUAL-03 says no NEW anti-patterns — this is pre-existing. Do NOT fix it this phase. Just tokenize `#0a0a0a` into a var. |
| 35 | `rgba(30,64,175,0.25)` | Card box-shadow glow stop 1 | `--color-ep-glow-blue-25` | NO — new var. Critical TOKEN-02 value. |
| 35 | `rgba(255,255,255,0.04)` | Card box-shadow inset top | `--color-ep-inset-top` | YES — `--color-glass-surface` = `rgba(255,255,255,0.03)`. NOT exact (0.04 ≠ 0.03). New var needed. |
| 35 | `rgba(30,64,175,0.03)` | Card box-shadow inset bottom glow | `--color-ep-glow-blue-03` | NO — new var |
| 42 | `font-serif italic text-zinc-300` | Quote text | `font-serif italic` = pre-existing retired convention. Tailwind `zinc-300` = leave. | Pre-existing violations — do not fix |

### button.tsx (src/components/ui/button.tsx)

| Location | Current Value | Context | Proposed Token | Value-Equal? |
|----------|---------------|---------|----------------|--------------|
| `brand` variant | `text-[#f4f6fb]` | Button text color | `--color-ep-fg-strong` | Reuse |
| `brand` variant | `border-white/20`, `bg-white/[0.05]`, `hover:bg-white/[0.08]`, `hover:border-white/25` | Button surface/border | Tailwind alpha utilities — these implicitly use white. Leave as Tailwind for now. |
| `brand-link` variant | `text-[#aab3c5]`, `hover:text-[#f4f6fb]` | Link button colors | `--color-ep-fg` / `--color-ep-fg-strong` | Reuse |

---

## The Critical Issue — Value Equality (OKLCH ≠ hex)

### Problem Statement

`globals.css` defines the ink-blue OKLCH tokens (e.g., `oklch(0.488 0.243 264.376)`) in the shadcn system vars. The components use hex/rgba values (`#1E40AF`, `rgba(30,64,175,0.5)`). OKLCH and hex describe the same color gamut but use different coordinate systems.

**The risk:** A browser rendering `oklch(0.488 0.243 264.376)` and `#1E40AF` should produce visually equivalent colors IF the display is sRGB-constrained. However:
1. On wide-gamut displays (P3), OKLCH may resolve to a gamut-expanded value, producing a noticeably different rendered color.
2. Sub-pixel-level differences in intermediate sRGB mapping may exist across browser implementations.
3. There is no tool-verifiable guarantee that a conversion is byte-identical.

**The safe conclusion:** For a pixel-identical migration, **do not swap a hex value for an OKLCH token unless they are provably the same notation**. The existing OKLCH tokens in the shadcn system (e.g., `--background: oklch(0.488…)`) are NOT safe replacements for hex values in components.

### Safe Approach

Introduce a dedicated `/* Phase 1: value-equal tokens */` section in `globals.css` **inside** the `@theme inline` block. Each variable is defined in hex or rgba — the **same notation and same value** as it appears today in the component.

```css
/* Phase 1: value-equal tokens — IDENTICAL to current component hardcoded values.
   These are NOT the aspirational OKLCH palette. Token renaming to OKLCH is Phase 2+. */
@theme inline {
  /* ... existing tokens ... */

  /* Phase 1 additions */
  --color-ep-bg-base: #02030a;
  --color-ep-section-bg: #04060c;
  --color-ep-fg-strong: #f4f6fb;
  --color-ep-fg-strong-white: #ffffff;
  --color-ep-fg: #aab3c5;
  --color-ep-fg-body: #d4d9e3;
  --color-ep-fg-muted: #a8b0c0;
  --color-ep-fg-muted-2: #8590a8;
  --color-ep-fg-subtle: #6f7889;
  --color-ep-fg-subtle-2: #5a6478;
  --color-ep-accent: #4487D6;
  --color-ep-accent-light: #77B7ED;
  --color-ep-code-bg: #0d1117;
  --color-ep-callout-bg: #0a0a0a;
  --color-ep-fade-black: #000000;
  --color-ep-white-strong: rgba(255, 255, 255, 0.92);
  --color-ep-white: rgba(255, 255, 255, 0.55);
  --color-ep-white-dim: rgba(255, 255, 255, 0.22);
  --color-ep-white-track: rgba(255, 255, 255, 0.08);
  --color-ep-active-highlight: rgba(255, 255, 255, 0.18);
  --color-ep-separator: rgba(255, 255, 255, 0.20);
  --color-ep-tick: rgba(255, 255, 255, 0.20);
  --color-ep-dot-glow: rgba(255, 255, 255, 0.6);
  --color-ep-rule: rgba(255, 255, 255, 0.14);
  --color-ep-hairline: rgba(255, 255, 255, 0.12);
  --color-ep-divider: rgba(255, 255, 255, 0.15);
  --color-ep-pill-bg: rgba(255, 255, 255, 0.04);
  --color-ep-pill-border: rgba(255, 255, 255, 0.10);
  --color-ep-pill-btn-bg: rgba(255, 255, 255, 0.06);
  --color-ep-frame-border: rgba(255, 255, 255, 0.08);
  --color-ep-inset-top: rgba(255, 255, 255, 0.04);
  --color-ep-shadow-dark: rgba(0, 0, 0, 0.4);
  --color-ep-nav-bg: rgba(10, 16, 32, 0.6);
  --color-ep-nav-shadow: rgba(0, 0, 0, 0.5);
  --color-ep-mobile-menu-bg: rgba(4, 6, 12, 0.95);
  --color-ep-ring-border-outer: rgba(119, 183, 237, 0.30);
  --color-ep-ring-bg-outer: rgba(68, 135, 214, 0.18);
  --color-ep-ring-border-inner: rgba(119, 183, 237, 0.22);
  --color-ep-ring-bg-inner: rgba(56, 103, 214, 0.14);
  --color-ep-grid-line: rgba(255, 255, 255, 0.10);
  --color-ep-chart-line: #3B82F6;
  --color-ep-glow-blue-30: rgba(30, 64, 175, 0.3);
  --color-ep-glow-blue-25: rgba(30, 64, 175, 0.25);
  --color-ep-glow-blue-03: rgba(30, 64, 175, 0.03);
  --color-ep-atmos-1: rgba(96, 165, 235, 0.05);
  --color-ep-atmos-2: rgba(68, 135, 214, 0.02);
  --color-ep-atmos-3: rgba(150, 200, 245, 0.028);
  --color-ep-atmos-4: rgba(68, 135, 214, 0.01);
  --color-ep-atmos-5: rgba(180, 215, 250, 0.02);
  --color-ep-atmos-6: rgba(96, 165, 235, 0.008);
}
```

Shadow tokens (not color, but shadow shorthand — defined outside `@theme inline`):

```css
:root.dark,
:root {
  --shadow-ep-glow-blue-20: 0 0 40px -10px rgba(30, 64, 175, 0.2);
  --shadow-ep-habit-bar: 0 0 15px -3px rgba(30, 64, 175, 0.6);
}
```

**Important:** `@theme inline` only accepts CSS custom properties that Tailwind can generate utilities for. Shadow shorthand values in `@theme inline` may not behave as expected — they should be placed in `:root` or `.dark` instead.

---

## Glow Value Tokens (TOKEN-02)

The two specific glow values called out in TOKEN-02 appear as follows in the codebase:

### `rgba(30, 64, 175, …)` occurrences (all in-scope):

| File | Line | Usage | Current value |
|------|------|-------|---------------|
| `PerformanceMetric.tsx` | 103 | Framer Motion `textShadow` animation (the TOKEN-03 animation — LEFT AS-IS) | `rgba(30, 64, 175, 0.4)` |
| `PerformanceMetric.tsx` | 78 | Tailwind arbitrary shadow on habit bar | `rgba(30,64,175,0.6)` |
| `PerformanceMetric.tsx` | 39 | Tailwind arbitrary hover shadow on code block | `rgba(30,64,175,0.2)` |
| `CalloutCard.tsx` | 35 | `boxShadow` inline style | `rgba(30, 64, 175, 0.25)` |
| `CalloutCard.tsx` | 35 | `boxShadow` inset bottom glow | `rgba(30,64,175,0.03)` |
| `DashboardPreview.tsx` | 10 | Tailwind arbitrary shadow on logo | `rgba(30,64,175,0.5)` |
| `DashboardPreview.tsx` | 63 | Tailwind arbitrary shadow on pulse dot | `rgba(30,64,175,0.8)` |
| `DashboardPreview.tsx` | 171 | Progress bar shadow | `rgba(30,64,175,0.4)` |
| `DashboardPreview.tsx` | 219 | SVG path drop shadow | `rgba(30,64,175,0.5)` |
| `DashboardPreview.tsx` | 229–232 (SVG gradient) | Chart area fill | `rgba(30,64,175,0.3)`, `rgba(30,64,175,0)` |
| `globals.css` | `.text-glow-hero` | Utility class | `rgba(30,64,175,0.35)` |
| `globals.css` | `--shadow-glow-blue` | Token definition | `rgba(30,64,175,0.5)` |
| `globals.css` | `.card-glow::before` | Utility class | `rgba(30,64,175,0.04)` |

### `rgba(59, 130, 246, …)` occurrences:

| File | Line | Usage | Current value |
|------|------|-------|---------------|
| `DashboardPreview.tsx` | 220 | SVG chart line stroke | `#3B82F6` (hex equivalent of rgb(59,130,246)) |

**TOKEN-02 requirement:** Both glow families must be tokenized at their **current value** — not desaturated, not replaced with `--color-accent-subtle`. The proposed tokens above (`--color-ep-glow-blue-*`) and the shadow tokens cover all occurrences.

**The `textShadow` in PerformanceMetric.tsx line 103:** This is the animated glow in the TOKEN-03 deferred item (the Framer Motion `animate={{ textShadow: … }}` call). TOKEN-02 requires tokenizing the glow VALUE. TOKEN-03 is deferred and says NOT to remove the animation. Therefore: tokenize the rgba value but do NOT change the `animate` prop or its behavior. The value `rgba(30, 64, 175, 0.4)` becomes `var(--color-ep-glow-blue-40)` (add to the vars list), but the animation stays identical.

Note: Framer Motion `textShadow` accepts CSS string values. `"0 0 40px var(--color-ep-glow-blue-40), 0 0 12px rgba(255, 255, 255, 0.1)"` is valid CSS. The white glow component (`rgba(255,255,255,0.1)`) should also be tokenized: add `--color-ep-text-glow-white: rgba(255, 255, 255, 0.1)`.

---

## Motion — Do Not Touch

The following animations are **explicitly out of scope** for Phase 1 (deferred per TOKEN-03):

1. **`DashboardPreview.tsx` lines 63 and 108** — `animate-pulse` on the CYCLE 1 ACTIVE indicator and the Flame icon. Do NOT remove, do NOT modify the className.
2. **`PerformanceMetric.tsx` lines 100–105** — Framer Motion `animate={{ textShadow: "…" }}` on the P_daily score display. Do NOT remove the `animate` prop. Do NOT change the transition or delay. The only allowed change: swap the rgba string value for a CSS var reference, since TOKEN-02 requires tokenizing the VALUE.
3. **All other Framer Motion entrance animations** — stagger/blur entrance in Hero, itemVariants in Footer, whileInView in CalloutCard. Leave completely untouched.
4. **`PerformanceMetric.tsx` count animation** — `animate(countValue, 100, {…})` — leave untouched.

---

## Consolidation Map (Final Token List)

After consolidating duplicates across components, these are the new vars to add to `globals.css`. Each var appears in the components as noted:

| Token Name | Value | Used In |
|------------|-------|---------|
| `--color-ep-bg-base` | `#02030a` | page.tsx (×2), Hero.tsx (×3) |
| `--color-ep-section-bg` | `#04060c` | VCDSection, SystemBlueprint, MethodologyPreview, CTA |
| `--color-ep-fg-strong` | `#f4f6fb` | Hero, Navbar, McpIntegration, MethodologyPreview, CTA, button.tsx |
| `--color-ep-fg-strong-white` | `#ffffff` | VCDSection, SystemBlueprint (FG_STRONG) |
| `--color-ep-fg` | `#aab3c5` | Hero, Navbar, MethodologyPreview, CTA, button.tsx |
| `--color-ep-fg-body` | `#d4d9e3` | VCDSection, SystemBlueprint (FG) |
| `--color-ep-fg-muted` | `#a8b0c0` | VCDSection, SystemBlueprint (FG_MUTED) |
| `--color-ep-fg-muted-2` | `#8590a8` | MethodologyPreview, CTA (FG_MUTED) |
| `--color-ep-fg-subtle` | `#6f7889` | SystemBlueprint (FG_SUBTLE) |
| `--color-ep-fg-subtle-2` | `#5a6478` | MethodologyPreview (FG_SUBTLE) |
| `--color-ep-accent` | `#4487D6` | VCDSection, MethodologyPreview, CTA (ACCENT) |
| `--color-ep-accent-light` | `#77B7ED` | VCDSection (ACCENT_LIGHT), Hero pill |
| `--color-ep-code-bg` | `#0d1117` | PerformanceMetric |
| `--color-ep-callout-bg` | `#0a0a0a` | CalloutCard |
| `--color-ep-fade-black` | `#000000` | Hero bottom-fade gradient |
| `--color-ep-white-strong` | `rgba(255,255,255,0.92)` | VCDSection |
| `--color-ep-white` | `rgba(255,255,255,0.55)` | VCDSection |
| `--color-ep-white-dim` | `rgba(255,255,255,0.22)` | VCDSection, SystemBlueprint (LINE/CardDecorator) |
| `--color-ep-white-track` | `rgba(255,255,255,0.08)` | VCDSection (already = `--color-glass-highlight`) |
| `--color-ep-active-highlight` | `rgba(255,255,255,0.18)` | VCDSection |
| `--color-ep-separator` | `rgba(255,255,255,0.20)` | VCDSection, Hero pill |
| `--color-ep-dot-glow` | `rgba(255,255,255,0.6)` | VCDSection today dot |
| `--color-ep-rule` | `rgba(255,255,255,0.14)` | SystemBlueprint dividers |
| `--color-ep-hairline` | `rgba(255,255,255,0.12)` | CTASection top hairline |
| `--color-ep-divider` | `rgba(255,255,255,0.15)` | Hero pill divider bar |
| `--color-ep-pill-bg` | `rgba(255,255,255,0.04)` | Hero announcement pill |
| `--color-ep-pill-border` | `rgba(255,255,255,0.10)` | Hero announcement pill border |
| `--color-ep-pill-btn-bg` | `rgba(255,255,255,0.06)` | Hero pill arrow button (= `--color-glass-border`) |
| `--color-ep-frame-border` | `rgba(255,255,255,0.08)` | Hero mockup frame (= `--color-glass-highlight`) |
| `--color-ep-inset-top` | `rgba(255,255,255,0.04)` | CalloutCard inset-top shadow (= `--color-glass-surface` is 0.03 — NOT same. New var.) |
| `--color-ep-shadow-dark` | `rgba(0,0,0,0.4)` | Hero mockup box-shadow |
| `--color-ep-nav-bg` | `rgba(10,16,32,0.6)` | Navbar |
| `--color-ep-nav-shadow` | `rgba(0,0,0,0.5)` | Navbar drop shadow |
| `--color-ep-mobile-menu-bg` | `rgba(4,6,12,0.95)` | Navbar mobile menu |
| `--color-ep-ring-border-outer` | `rgba(119,183,237,0.30)` | McpIntegrationSection outer ring |
| `--color-ep-ring-bg-outer` | `rgba(68,135,214,0.18)` | McpIntegrationSection outer ring bg |
| `--color-ep-ring-border-inner` | `rgba(119,183,237,0.22)` | McpIntegrationSection inner ring |
| `--color-ep-ring-bg-inner` | `rgba(56,103,214,0.14)` | McpIntegrationSection inner ring bg |
| `--color-ep-grid-line` | `rgba(255,255,255,0.10)` | page.tsx grid texture |
| `--color-ep-chart-line` | `#3B82F6` | DashboardPreview SVG |
| `--color-ep-glow-blue-40` | `rgba(30,64,175,0.4)` | PerformanceMetric textShadow |
| `--color-ep-glow-blue-30` | `rgba(30,64,175,0.3)` | DashboardPreview chart fill |
| `--color-ep-glow-blue-25` | `rgba(30,64,175,0.25)` | CalloutCard boxShadow |
| `--color-ep-glow-blue-03` | `rgba(30,64,175,0.03)` | CalloutCard inset glow |
| `--color-ep-text-glow-white` | `rgba(255,255,255,0.1)` | PerformanceMetric textShadow second stop |
| `--color-ep-atmos-1` | `rgba(96,165,235,0.05)` | Hero atmospheric radial |
| `--color-ep-atmos-2` | `rgba(68,135,214,0.02)` | Hero atmospheric radial |
| `--color-ep-atmos-3` | `rgba(150,200,245,0.028)` | Hero atmospheric radial |
| `--color-ep-atmos-4` | `rgba(68,135,214,0.01)` | Hero atmospheric radial |
| `--color-ep-atmos-5` | `rgba(180,215,250,0.02)` | Hero atmospheric radial |
| `--color-ep-atmos-6` | `rgba(96,165,235,0.008)` | Hero atmospheric radial |

**Shadow vars (place in `:root` / `.dark`, NOT in `@theme inline`):**

| Token Name | Value | Used In |
|------------|-------|---------|
| `--shadow-ep-glow-blue-20` | `0 0 40px -10px rgba(30,64,175,0.2)` | PerformanceMetric code block hover |
| `--shadow-ep-habit-bar` | `0 0 15px -3px rgba(30,64,175,0.6)` | PerformanceMetric habit bar 1 |

**Total new vars:** ~52 color vars + 2 shadow vars = 54 additions to globals.css.

---

## Exact Token Reuse (No New Var Needed)

These existing tokens already hold the exact matching value:

| Existing Token | Value | Can Replace |
|----------------|-------|-------------|
| `--color-glass-border` | `rgba(255,255,255,0.06)` | Hero pill arrow button bg |
| `--color-glass-highlight` | `rgba(255,255,255,0.08)` | Hero mockup frame border |
| `--color-accent-red` | `#ef4444` | SystemBlueprint friction dot (`background: "#ef4444"`) |
| `--color-accent-green` | `#10b981` | DashboardPreview habit check bg shadow |

However, for maintainability the recommendation is to **still use the new `--color-ep-*` vars** for components, so all Phase 1 tokens are in one place and easily removable / renameable in Phase 2. Using `--color-glass-highlight` where you mean "mockup frame border" is semantically wrong and creates confusing coupling.

---

## Tailwind Arbitrary Value Handling

Several hardcoded values appear as Tailwind arbitrary class syntax rather than inline `style={}`:

```
bg-[#02030a]         → bg-[var(--color-ep-bg-base)]
text-[#f4f6fb]       → text-[var(--color-ep-fg-strong)]
shadow-[0_0_40px_-10px_rgba(30,64,175,0.2)]  → shadow-[var(--shadow-ep-glow-blue-20)]
border-[rgba(255,255,255,0.08)]  → border-[var(--color-ep-frame-border)]
```

Tailwind v4 arbitrary value syntax with `var()` works correctly: `bg-[var(--color-ep-bg-base)]` generates `background: var(--color-ep-bg-base)`. This is standard Tailwind v4 behavior. [ASSUMED — Tailwind v4 arbitrary var() syntax; standard capability per Tailwind docs pattern]

For inline `style={{ color: "#f4f6fb" }}` → `style={{ color: "var(--color-ep-fg-strong)" }}`. This is standard CSS.

For constants at the top of component files:
```typescript
// Before
const ACCENT = "#4487D6";

// After  
const ACCENT = "var(--color-ep-accent)";
```
This is the cleanest pattern for VCDSection, SystemBlueprintSection, etc. — no structural change, just the constant value changes. The constant name stays, only its value changes to a var reference.

---

## Banned Anti-Patterns (QUAL-03)

The following patterns must NOT be introduced in any touched file:

| Pattern | Rule | What to watch for |
|---------|------|-------------------|
| Raw `<button>` | Use `Button` or `ShinyButton` | `DashboardPreview` already has two raw `<button>` elements (lines 204–209) — pre-existing, do NOT add more |
| `background-clip: text` with gradient | Banned AI-tell | `DashboardPreview` line 11 already has this — pre-existing. Do not replicate |
| Pure black (#000, #0a0a0a, literal `black`) | Use tinted bg-base | `CalloutCard` bg-[#0a0a0a] is pre-existing. Tokenize it into a var — do NOT introduce new pure-black literals |
| `transition: all` | Specify exact properties | When touching components, do not swap `transition-colors` for `transition: all` |
| `useAnimationFrame` for decoration | GPU composited only | Not present in scope — don't introduce |
| `zinc-*` + `slate-*` mixing on landing surfaces | Use token system | Already mixed in DashboardPreview/Footer — do not add new instances |
| Gradient-clipped text | Banned | Already in DashboardPreview — don't spread it |

**Pre-existing violations to document but NOT fix in Phase 1:**
- `DashboardPreview` line 11: `text-transparent bg-clip-text bg-gradient-to-r` (gradient text clip)
- `DashboardPreview` lines 204, 208: raw `<button>`
- `CalloutCard` line 42: `font-serif italic` (retired convention)
- `CalloutCard` line 32: `bg-[#0a0a0a]` (pure black — tokenize the value but don't change the color)
- `Footer` lines 70, 117: `font-serif italic` (retired convention)

---

## Verification Approach (TOKEN-04)

Since there is no automated test suite, the verification strategy is:

### Step 1 — Baseline screenshot (before)
```bash
npx playwright screenshot http://localhost:3000/ before.png --full-page
```
or manually scroll and screenshot the full home page at 1440px.

### Step 2 — Run migration

### Step 3 — After screenshot
```bash
npx playwright screenshot http://localhost:3000/ after.png --full-page
```

### Step 4 — Visual diff
```bash
npx pixelmatch before.png after.png diff.png --threshold 0.1
```
A diff with 0 different pixels is the target. Any difference reveals a value mismatch.

### Step 5 — TypeScript + ESLint + build
```bash
npx tsc --noEmit
npx next lint
npx next build
```
All three must pass with no new errors.

### Step 6 — Computed color inspection (browser DevTools)
In DevTools Elements panel, inspect a migrated element. Verify `color: var(--color-ep-fg-strong)` computes to `rgb(244, 246, 251)` (= `#f4f6fb`).

**Playwright availability:** Playwright is listed in the project's `package.json` as a devDependency (checking via available data — if not confirmed, fall back to manual screenshot diff). [ASSUMED — Playwright availability; the project has no test infra per CONCERNS.md. Manual screenshot is the fallback.]

**The mathematical argument for value-equality (the key assurance):**
When both the "before" and "after" values are hex/rgba and the new CSS variable holds the exact same hex string, the browser MUST produce the same rendered color — the var reference is resolved at paint time to the identical literal. No color space conversion occurs. This is why using `--color-ep-*: #02030a` (hex) rather than remapping to an OKLCH token is safe.

---

## Architecture Patterns

### Recommended approach: Top-of-file constant pattern

Components in VCDSection, SystemBlueprintSection, MethodologyPreviewSection, and CTASection already use a `const FG = "#value"` pattern at the top. The migration is surgical:

```typescript
// Before (VCDSection.tsx top)
const SECTION_BG = "#04060c";
const FG_STRONG = "#ffffff";
const ACCENT = "#4487D6";

// After
const SECTION_BG = "var(--color-ep-section-bg)";
const FG_STRONG = "var(--color-ep-fg-strong-white)";
const ACCENT = "var(--color-ep-accent)";
```

No JSX changes needed for these components — only the constant values change.

### Recommended approach: Inline style pattern (Hero, Navbar, etc.)

For components with inline `style={{ background: "#02030a" }}`:

```tsx
// Before
<main style={{ background: "#02030a" }}>

// After
<main style={{ background: "var(--color-ep-bg-base)" }}>
```

No behavior change. The JSX structure is identical.

### Template literal pattern (VCDSection radial, atmosphere)

```typescript
// Before
background: `radial-gradient(ellipse 65% 90% at 50% 0%, ${ACCENT}1f, transparent 65%)`

// After — ACCENT is now "var(--color-ep-accent)" which cannot be embedded in a template
// literal directly for compound values. Solution:
background: `radial-gradient(ellipse 65% 90% at 50% 0%, color-mix(in srgb, var(--color-ep-accent) 12%, transparent), transparent 65%)`
// OR: pre-define the rgba as a separate var
background: `radial-gradient(ellipse 65% 90% at 50% 0%, var(--color-ep-accent-alpha-12), transparent 65%)`
```

**CRITICAL NOTE on template literals:** Several components build CSS strings using template literals that append hex alpha: `${ACCENT}1f` computes to `#4487D61f` (hex with alpha suffix). When ACCENT becomes `"var(--color-ep-accent)"`, the result `var(--color-ep-accent)1f` is invalid CSS.

**Solution:** For each template literal that appends an alpha suffix to a hex var, add a dedicated rgba token with the precomputed alpha:

| Template literal | Alpha suffix | Authoritative token value (8-digit hex) | New token |
|-----------------|-------------|-------|-----------|
| `${ACCENT}14` | `0x14` = 8% opacity | `#4487d614` | `--color-ep-accent-alpha-08` |
| `${ACCENT}1f` | `0x1f` = 12% opacity | `#4487d61f` | `--color-ep-accent-alpha-12` |
| `${ACCENT_LIGHT}cc` | `0xcc` = 80% opacity | `#77b7edcc` | `--color-ep-accent-light-alpha-80` |

These extra vars must be included in the globals.css additions. The template literal then becomes:

```typescript
// Before
background: `radial-gradient(ellipse 65% 90% at 50% 0%, ${ACCENT}1f, transparent 65%)`

// After
background: `radial-gradient(ellipse 65% 90% at 50% 0%, var(--color-ep-accent-alpha-12), transparent 65%)`
```

This is the primary trap for this phase. The planner must audit ALL template literals that append alpha to a color constant.

---

## Template Literal Alpha Inventory

All `${CONSTANT}hexAlpha` patterns in in-scope components:

| File | Line | Template | Alpha hex | Decimal opacity | New var |
|------|------|----------|-----------|-----------------|---------|
| VCDSection.tsx | ~120 | `${ACCENT}1f` | `1f` | 12.2% | `--color-ep-accent-alpha-12` = `#4487d61f` |
| MethodologyPreview.tsx | ~41 | `${ACCENT}14` | `14` | 7.8% | `--color-ep-accent-alpha-08` = `#4487d614` |
| CTASection.tsx | ~34 | `${ACCENT}1f` | `1f` | 12.2% | Reuse `--color-ep-accent-alpha-12` |
| VCDSection.tsx | ~313 | `${ACCENT_LIGHT}cc` | `cc` | 80% | `--color-ep-accent-light-alpha-80` = `#77b7edcc` |

**Note on precision (AUTHORITATIVE):** Define these tokens using the EXACT 8-digit hex form (`#4487d61f`, `#4487d614`, `#77b7edcc`) — byte-identical to the original `${CONSTANT}<suffix>` literals. This supersedes any rounded `rgba(…, 0.12)` decimal forms shown elsewhere in earlier drafts of this doc; rounded decimals (e.g. `0.122` vs the exact `31/255 = 0.12157`) would introduce sub-pixel drift and must NOT be used. The component reference becomes a plain `var(--color-ep-accent-alpha-12)` with no appended hex-alpha suffix.

---

## Pre-Existing Issues (Do NOT fix in Phase 1)

These are documented violations that will not be touched this phase:

| File | Issue | What to do |
|------|-------|------------|
| `DashboardPreview.tsx` lines 11 | `bg-clip-text` gradient text (banned) | Leave as-is |
| `DashboardPreview.tsx` lines 63, 108 | `animate-pulse` perpetual motion (TOKEN-03 deferred) | Leave as-is |
| `DashboardPreview.tsx` lines 204, 208 | Raw `<button>` | Leave as-is |
| `CalloutCard.tsx` line 42 | `font-serif italic` (retired convention) | Leave as-is |
| `CalloutCard.tsx` line 32 | `bg-[#0a0a0a]` (pure black) | Tokenize to `bg-[var(--color-ep-callout-bg)]`, but the VALUE stays `#0a0a0a` |
| `Footer.tsx` lines 70, 117 | `font-serif italic` (retired convention) | Leave as-is |
| `PerformanceMetric.tsx` lines 103–104 | `animate={{ textShadow: … }}` (TOKEN-03 deferred) | Tokenize rgba VALUES only, leave animation intact |
| `globals.css` `.text-glow-hero` | rgba values in utility classes | These are in globals.css already — tokenizing them is optional since they're already CSS, not component hardcoding |

---

## Validation Architecture

*No automated test infrastructure exists (confirmed in CONCERNS.md and STATE.md). Verification is manual.*

### Phase Requirements → Verification Map

| Req ID | Behavior | Verification Method | Automated? |
|--------|----------|---------------------|------------|
| TOKEN-01 | Components reference var(--color-ep-*) | Grep for hardcoded hex/rgba in migrated files | Semi (grep) |
| TOKEN-02 | Glow values tokenized at exact value | Inspect var definitions in globals.css | Manual |
| TOKEN-04 | Pixel-identical before/after | Screenshot diff (Playwright or manual) | Semi (Playwright if available) |
| QUAL-03 | No new banned anti-patterns | Code review of changed files | Manual |

### Grep verification command

After migration, run to catch missed hardcoded values in migrated files:

```bash
grep -n "rgba\|#[0-9a-fA-F]\{3,8\}" \
  src/components/Hero.tsx \
  src/components/Navbar.tsx \
  src/components/hero/VCDSection.tsx \
  src/components/hero/McpIntegrationSection.tsx \
  src/components/DashboardPreview.tsx \
  src/components/SystemBlueprintSection.tsx \
  src/components/MethodologyPreviewSection.tsx \
  src/components/CTASection.tsx \
  src/components/animations/PerformanceMetric.tsx \
  src/components/CalloutCard.tsx \
  src/app/page.tsx
```

Expected: zero matches (or only matches that are justified: SVG viewBox numbers that happen to contain digits, etc.).

---

## Common Pitfalls

### Pitfall 1: Template literal alpha suffix invalidates var()
**What goes wrong:** `${ACCENT}1f` → `var(--color-ep-accent)1f` — this is invalid CSS. The gradient renders incorrectly or is skipped.
**Why it happens:** CSS var() cannot be concatenated with a hex alpha suffix.
**How to avoid:** Pre-define every alpha variant as its own token. Audit all template literals before writing code.
**Warning signs:** The atmospheric radial backgrounds disappear or show solid color.

### Pitfall 2: @theme inline vs :root for shadow tokens
**What goes wrong:** Tailwind `@theme inline` expects CSS properties that map to utilities. A `--shadow-ep-*` full shadow string in `@theme inline` may generate unexpected Tailwind utilities or fail silently.
**Why it happens:** `@theme inline` in Tailwind v4 is for utility generation, not all CSS vars.
**How to avoid:** Place shadow shorthand tokens in `:root` (or `.dark`) outside `@theme inline`, not inside it.
**Warning signs:** Shadow styles do not apply; or new Tailwind utility `shadow-ep-*` appears unexpectedly.

### Pitfall 3: `#ffffff1a` in Tailwind class (page.tsx line 14)
**What goes wrong:** The grid texture class uses `bg-[linear-gradient(to_right,#ffffff1a_1px,…)]` — this is an arbitrary background-image value. Converting it to a var requires `bg-[linear-gradient(to_right,var(--color-ep-grid-line)_1px,…)]`.
**Why it happens:** The whole gradient string is an arbitrary value; only the color component needs to change.
**How to avoid:** Carefully extract only the hex portion, not the whole gradient.
**Warning signs:** Grid texture disappears completely.

### Pitfall 4: OKLCH token substitution
**What goes wrong:** Someone substitutes `--color-ep-fg-strong` with the existing shadcn `--foreground: #f4f4f5` — one digit different (`#f4f4f5` vs `#f4f6fb`). Headings subtly shift tone.
**Why it happens:** Values look similar in hex.
**How to avoid:** The Phase 1 token list above is exhaustive. Do not remap to existing tokens; use the new `--color-ep-*` tokens.
**Warning signs:** Visual diff shows a faint color change on headings.

### Pitfall 5: Missing template literal alpha variants
**What goes wrong:** The planner creates vars for all direct hex uses but misses the `${ACCENT}1f` template literals in VCDSection/CTASection/MethodologyPreview. The atmospheric backgrounds change opacity.
**Why it happens:** Template literals are harder to grep for than literal values.
**How to avoid:** Use the Template Literal Alpha Inventory table above as a pre-flight checklist.
**Warning signs:** The section backgrounds (radial atmosphere) lose their correct opacity.

---

## Project Constraints (from CLAUDE.md)

All constraints from CLAUDE.md that directly affect this phase:

| Constraint | Impact on Phase 1 |
|------------|------------------|
| Never use raw `<button>` | Don't introduce new raw buttons in any touched file |
| Never use `text-shadow` glows on headings (new) | Don't add any new text-shadow while migrating; leave PerformanceMetric animation as-is |
| Never use `background-clip: text` with gradient (new) | Don't add any new gradient text-clip |
| Never use `animate-pulse` / `repeat: Infinity` (new) | Don't add any perpetual motion |
| Never use `useAnimationFrame` for decoration (new) | Not relevant for this phase |
| Never use `rgba(30,64,175,…)` or `rgba(59,130,246,…)` directly — use `--color-accent-subtle` instead | **CRITICAL CONFLICT**: CLAUDE.md bans these values and says use `--color-accent-subtle`. TOKEN-02 says tokenize them AT their current value. RESOLUTION: TOKEN-02 is the Phase 1 decision (locked by ROADMAP and REQUIREMENTS). These glows are tokenized into `--color-ep-glow-blue-*` vars at current value. The CLAUDE.md directive applies to NEW code only — the migration is not new code but a refactor preserving existing values. |
| Never use pure black (`#0a0a0a`, `#000`) | CalloutCard bg-[#0a0a0a] and Hero fade-to-black are pre-existing. Tokenize to vars but do not change the values. Do not introduce new pure-black literals. |
| Never mix `zinc-*` and `slate-*` on landing surfaces | DashboardPreview and Footer already mix them — pre-existing. Don't add more. |
| Never use raw hex in components | **This is what Phase 1 fixes.** After migration, no raw hex in components. |
| Never use `transition: all` | Don't touch any existing `transition-*` classes. |
| Tailwind CSS v4 — config via `@theme inline` in globals.css | New tokens go into `@theme inline` block |
| Dark-mode only | All tokens are dark-mode values; no light-mode variants needed |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Tailwind v4 `bg-[var(--…)]` arbitrary var() syntax works correctly | Architecture Patterns | Tailwind may not generate valid CSS for arbitrary var references — fallback is inline style or a dedicated Tailwind plugin |
| A2 | Playwright is available as a devDependency for screenshot diff | Verification Approach | Fallback is manual screenshot comparison — no blocking risk, just less precise |
| A3 | `@theme inline` in Tailwind v4 accepts all custom property types (color vars) | Standard Stack | If Tailwind v4's @theme inline has restrictions, shadow vars may need placement in `:root` only |
| A4 | Framer Motion `animate={{ textShadow: "0 0 40px var(--…), 0 0 12px rgba(…)" }}` evaluates the CSS var at render time | Motion — Do Not Touch | If Framer Motion does not resolve CSS vars in string-based `textShadow` animation targets, the glow would not render. Fallback: keep the textShadow value as a literal string for the animation prop (the motion property itself), and only tokenize the static version in CSS |
| A5 | `CalloutCard` is not imported by any home-page component | Scope section | If a home-page component imports it indirectly, it is in scope regardless |

---

## Open Questions (RESOLVED)

1. **CalloutCard scope decision**
   - What we know: CalloutCard is NOT imported by `page.tsx` or any direct home-page section component based on source-file reading.
   - What's unclear: Whether it's used by any sub-component not checked here (e.g., a future hero sub-component).
   - Recommendation: Migrate it anyway — it's tiny (50 lines), its rgba glow values are identical to values being tokenized elsewhere, and it's cleaner to sweep it up.
   - **RESOLVED:** Migrated in plan 01-02 (Task 2) — bg-[#0a0a0a] and the three glow/inset rgba values are tokenized at their current values; pre-existing font-serif italic left untouched.

2. **Footer migration scope**
   - What we know: Footer uses `zinc-*` Tailwind classes (not inline hex). Phase 1 requirement says "Hero and shared landing components."
   - What's unclear: Whether Footer counts as a "shared landing component" for Phase 1.
   - Recommendation: Defer Footer to Phase 3 (Legal Rebrand) or a dedicated sweep. The zinc-* classes are a separate concern from inline hex.
   - **RESOLVED:** Deferred — Footer is out of Phase 1 scope; its zinc-* classes are addressed in a later phase, not 01-02.

3. **DashboardPreview slate-* classes**
   - What we know: DashboardPreview uses many `slate-*` Tailwind utility classes alongside inline rgba values.
   - What's unclear: Whether "hardcoded hex" in TOKEN-01 includes Tailwind default palette utilities.
   - Recommendation: Migrate only the inline `style={}` values in Phase 1. Leave `slate-*` Tailwind classes for a dedicated cleanup task.
   - **RESOLVED:** Deferred — plan 01-02 migrates only DashboardPreview's inline style values (SVG stroke + gradient stop); the slate-* Tailwind classes are left for a dedicated later cleanup.

4. **Shadow vars in @theme inline**
   - What we know: `@theme inline` is Tailwind v4's token system. Shadow shorthand is not a standard Tailwind token type.
   - Recommendation: Place `--shadow-ep-*` in `:root` / `.dark` blocks, not in `@theme inline`.
   - **RESOLVED:** Placed in the `.dark` block in plan 01-01 (not in @theme inline), avoiding unexpected Tailwind shadow-utility generation.

---

## Sources

### Primary (HIGH confidence)
- Direct source-code reading of all in-scope component files — values copied verbatim
- `src/app/globals.css` — complete token inventory (confirmed by reading the full file)
- `src/app/page.tsx` — confirmed component render tree

### Secondary (MEDIUM confidence)
- `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `.planning/STATE.md` — phase constraints
- `.planning/codebase/CONCERNS.md` — pre-existing violations inventory
- `CLAUDE.md` — anti-pattern list

### Tertiary (LOW confidence / ASSUMED)
- Tailwind v4 `bg-[var(--…)]` arbitrary syntax behavior — ASSUMED from general Tailwind v4 knowledge; not verified against Context7 this session
- Playwright availability — ASSUMED from devDependency convention

---

## Metadata

**Confidence breakdown:**
- Scope (component list): HIGH — derived from direct file reading
- Color inventory: HIGH — values copied verbatim from source
- Token equality assessment: HIGH — direct comparison of exact strings
- Template literal trap: HIGH — discovered by reading all constant patterns
- Tailwind v4 var() syntax: MEDIUM (ASSUMED) — standard pattern, not verified via docs
- Shadow var placement: MEDIUM (ASSUMED) — based on @theme inline semantics

**Research date:** 2026-06-12
**Valid until:** This research is based on current file content. Valid until any in-scope component is modified. Re-audit if components change before planning begins.
