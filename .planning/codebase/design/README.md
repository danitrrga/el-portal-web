# El Portal — Design System (GSD)

> Canonical, project-level design system for the El Portal marketing site.
> This directory **replaces** the retired `.impeccable.md` and `DESIGN.md`
> (archived under `.planning/archive/`). It is the single source of truth for
> all visual, typographic, motion, and component decisions.

---

## How GSD consumes this

This is the durable, project-level design contract that sits beside the other
`.planning/codebase/` reference docs (`ARCHITECTURE.md`, `CONVENTIONS.md`,
`STACK.md`). GSD's frontend workflow reads it directly:

| Agent | Use |
|-------|-----|
| `gsd-ui-researcher` | Seeds every phase `UI-SPEC.md` from these tokens/rules instead of re-deriving them |
| `gsd-planner` | References tokens, components, and copy rules in plan tasks |
| `gsd-executor` | Visual source of truth during implementation |
| `gsd-ui-checker` / `gsd-ui-auditor` | Enforces the 6 dimensions (Spacing, Typography, Color, Copywriting, Visuals, Registry) against this contract |

When a frontend phase runs `/gsd:ui-phase`, the resulting per-phase `UI-SPEC.md`
should **inherit** from this system and only add phase-specific deltas.

---

## LOCKED vs CURRENT convention

Every rule here is tagged so the contract stays honest against real code:

- **🔒 LOCKED** — a decided rule. New work MUST follow it. Violations are bugs.
- **📦 CURRENT** — what `globals.css` / components actually do today.
- **🛠 DEBT** — a known gap between LOCKED and CURRENT, deferred to a tracked migration. Do not "fix" silently; do not propagate.
- **⚠️ OPEN** — an unresolved conflict between source docs. Needs a human decision before it becomes LOCKED.

This separation is deliberate: the documented OKLCH token system
(`--color-bg-base`, `--color-accent`, …) was **never built** — the real tokens
are the `--color-ep-*` family. The contract records both so agents read truth,
not aspiration.

---

## Files

| File | Contents |
|------|----------|
| [`BRAND.md`](./BRAND.md) | Who it's for, the three brand words, the Companion metaphor, anti-words, aesthetic references, design principles, solo-dev constraint |
| [`TOKENS.md`](./TOKENS.md) | Real `--color-ep-*` color tokens, atmospheric layers, accent rule, radius scale, breakpoints |
| [`TYPOGRAPHY.md`](./TYPOGRAPHY.md) | Font roles, `.display` utility, type scale, weight ceiling, wordmark rules |
| [`MOTION.md`](./MOTION.md) | Emil's animation decision framework, easing, durations, springs, stagger, hero-breathing exception, performance rules, reduced-motion |
| [`INTERACTION.md`](./INTERACTION.md) | Button/hover/press feedback, origin-aware popovers, tooltips, focus rings, touch-gated hover, clip-path techniques |
| [`COMPONENTS.md`](./COMPONENTS.md) | Approved patterns — cards, glass, dot-pattern, separators, badges, CTAs, navbar, iconography + real component map |
| [`ANTI-PATTERNS.md`](./ANTI-PATTERNS.md) | Permanent bans, the AI-Slop Test, Emil's review checklist, and the current known-debt list |

---

## Quick reference

- **Theme:** dark mode only (`<html class="dark">` hardcoded). Light mode out of scope.
- **Color:** 60 / 30 / 10. Blue is the 10%. One accent per surface. Real accent `--color-ep-accent: #4487D6`.
- **Fonts:** Inter (body) · Special Gothic Expanded One (display, `.display`) · JetBrains Mono (code) · Instrument Serif (rare editorial).
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)`, 300–500ms, 80ms stagger. Entrance-only. Only the hero breathes.
- **Container:** `max-w-5xl px-6 md:px-8` (content) · `max-w-3xl` (reading) · `max-w-7xl` (hero outer).
- **Icons:** Phosphor Light at `strokeWidth={1.5}`.

## Code sources (ground truth)

| File | Role |
|------|------|
| `src/app/globals.css` | `@theme inline` tokens, `.display`, `.glass-panel`, `.card-glow`, `.wordmark`, focus ring |
| `src/app/layout.tsx` | Font loading, `<body>` base styling |
| `src/components/ui/button.tsx` | shadcn Button — `brand` / `brand-link` variants |
| `src/components/ui/shiny-button.tsx` | `ShinyButton` — retired, unused (see COMPONENTS.md) |
| `src/components/ElPortalWordmark.tsx` | Canonical brand lockup |
| `src/components/PortalIcon.tsx` | Brand icon (7 concentric rings) |
