# Tokens — Color, Radius, Breakpoints

> 📦 **Ground truth = `src/app/globals.css`.** This file documents the tokens
> that actually exist there. The OKLCH `--color-bg-base` / `--color-accent`
> system described in the old docs was **never built** — see DEBT at the bottom.

Theme: **dark mode only** (`<html class="dark">` hardcoded). Light mode is out
of scope permanently.

---

## 📦 Color tokens (real — `@theme inline`)

All live under the `--color-ep-*` namespace. Use these via Tailwind arbitrary
values: `bg-[var(--color-ep-bg-base)]`, `text-[var(--color-ep-fg-strong)]`.

### Backgrounds (atmospheric layers)

| Token | Value | Role |
|-------|-------|------|
| `--color-ep-bg-base` | `#02030a` | Page background (Sky). Blue-tinted near-black, **not** `#0a0a0a`. Also set on `html`. |
| `--color-ep-section-bg` | `#04060c` | Section surfaces (Instrument layer) |
| `--color-ep-code-bg` | `#0d1117` | Code blocks |
| `--color-ep-callout-bg` | `#0a0a0a` | Callout cards |

### Foregrounds (all blue-tinted — never pure gray)

| Token | Value | Role |
|-------|-------|------|
| `--color-ep-fg-strong` | `#f4f6fb` | Headings, primary content (tinted, not `#fff`) |
| `--color-ep-fg-strong-white` | `#ffffff` | Reserved emphasis only |
| `--color-ep-fg-body` | `#d4d9e3` | Body copy |
| `--color-ep-fg` | `#aab3c5` | Default secondary text |
| `--color-ep-fg-muted` | `#a8b0c0` | Eyebrows, meta |
| `--color-ep-fg-muted-2` | `#8590a8` | Quieter meta |
| `--color-ep-fg-subtle` | `#6f7889` | Dividers, disabled |
| `--color-ep-fg-subtle-2` | `#5a6478` | Quietest |

### Accent (the 10%)

| Token | Value | Role |
|-------|-------|------|
| `--color-ep-accent` | `#4487D6` | Desaturated navy-cobalt. CTAs, one active state. **Not** flat `#3B82F6`. |
| `--color-ep-accent-light` | `#77B7ED` | Lighter accent, rings |
| `--color-ep-accent-alpha-12` | `#4487d61f` | 12% accent fill |
| `--color-ep-accent-alpha-08` | `#4487d614` | 8% accent fill |

> The real accent reconciles both old directives: it is **desaturated**
> (vs. neon `#3B82F6`) and reads as **navy-cobalt**. `#4487D6` is canonical.

### Borders & hairlines (white overlays)

| Token | Value | Role |
|-------|-------|------|
| `--color-ep-hairline` | `rgba(255,255,255,0.12)` | Default hairline |
| `--color-ep-rule` | `rgba(255,255,255,0.14)` | Rules |
| `--color-ep-divider` | `rgba(255,255,255,0.15)` | Dividers / connectors |
| `--color-ep-separator` | `rgba(255,255,255,0.20)` | Strong separators |
| `--color-ep-frame-border` | `rgba(255,255,255,0.08)` | Card frame border |
| `--color-ep-pill-border` | `rgba(255,255,255,0.10)` | Pills, badges, navbar |

In components, the equivalent raw utilities `border-white/8` → `hover:border-white/15`
are the established card pattern (see COMPONENTS.md).

### Surfaces, shadows, atmospherics

| Token | Value | Role |
|-------|-------|------|
| `--color-ep-pill-bg` | `rgba(255,255,255,0.04)` | Pill background |
| `--color-ep-nav-bg` | `rgba(10,16,32,0.6)` | Floating navbar |
| `--color-ep-mobile-menu-bg` | `rgba(4,6,12,0.95)` | Mobile menu |
| `--color-ep-atmos-1…6` | `rgba(96–180, 165–215, 235–250, 0.008–0.05)` | Hero atmospheric radials (very low alpha, blue-tinted) |

---

## 🔒 Accent rule (60-30-10)

Blue is the **10%**. It appears on:
- the single most important CTA,
- one active/selected state per interactive component,
- at most one accent moment per section.

It emits from **within** the surface (a subtle radial glow behind it), not
painted on top as a border. It does **not** appear on every hover border, every
badge, every eyebrow, every icon.

---

## 🔒 Atmospheric layers

The page has depth — navy at the surface, shifting deeper as you scroll.

| Layer | Role | Direction |
|-------|------|-----------|
| **Sky** | Hero, top of page | Deep navy, almost black. Light breaks through from a single source above. |
| **Instrument** | Product sections | Richer navy. Cards solid, slightly warmer than the void behind them. |
| **Deep** | CTA, footer | Deepest layer. Accent moments live here. |

**Gradients are technique, not identity.** Background gradients use the blue
spectrum (navy, cobalt, indigo) as atmospheric depth — like light refracting.
You'd never point at a section and name a specific color.

**The grayscale test:** screenshot, desaturate. If it looks identical to the
color version, the palette is too flat. There should be visible tonal shifts
between sections even in grayscale.

---

## 🔒 Border radius scale

Base `--radius: 0.625rem` (10px). **Default: `rounded-xl` (12px).**

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-md` | `--radius - 2px` | Buttons xs/sm |
| `rounded-lg` | `--radius` (10px) | Small elements |
| `rounded-xl` | 12px | **Default** — cards, inputs |
| `rounded-2xl` | 16px | Large panels, hero image |
| `rounded-full` | 99px | Pills, badges |

---

## 🔒 Responsive breakpoints

| Breakpoint | Width | Usage |
|-----------|-------|-------|
| Default | 0px+ | Single column, full-width |
| `sm:` | 640px+ | Minor adjustments |
| `md:` | 768px+ | 2-column grids, expanded padding |
| `lg:` | 1024px+ | 3-column grids |

All grids stack to 1 column on mobile. Container padding `px-6 md:px-8`.

---

## 🔒 Spacing & layout

Spacing values are multiples of 4 (GSD 8-pt baseline). El Portal runs
**art-gallery density** (`VISUAL_DENSITY ~ 3`) — never pack content; whitespace is
a feature.

**Containers:**

| Width | Usage |
|-------|-------|
| `max-w-7xl` | Hero outer container (center-aligned) |
| `max-w-5xl` | Default content / feature sections |
| `max-w-3xl` | Reading pages |
| `max-w-xl`–`max-w-2xl` | Prose line length (never full-width body) |

Container shell: `mx-auto max-w-5xl px-6 md:px-8`.

**Section vertical rhythm:**

| Importance | Padding |
|------------|---------|
| Hero | `pt-32 pb-24` |
| Primary section | `py-32` (major sections range `py-28`–`py-40`) |
| Secondary section | `py-24` |
| Content block | `py-16` |

**Cards:** internal padding `p-6`–`p-8`. Grids `grid-cols-1 md:grid-cols-2
lg:grid-cols-3` with `gap-4`/`gap-6`.

**Composition:** asymmetric by default (`DESIGN_VARIANCE ~ 7`); sections alternate
density (open → constrained → open). **Hero exception:** centered text + product
mockup below is allowed for the main marketing hero.

---

## 📦 Legacy / shadcn tokens (present, not preferred)

`globals.css` also carries a shadcn baseline used by `ui/` primitives. Prefer
`--color-ep-*` for landing surfaces; these exist for component compatibility:

- `--color-primary: #1E40AF`, `--color-primary-glow: #3B82F6`
- `.dark` shadcn set: `--primary: hsl(222 84% 35%)`, `--background: #02030a`, `--border: rgba(255,255,255,0.05)`, etc.
- `--color-glass-*`, `--color-surface*`

---

## 🛠 DEBT — token migration (deferred)

1. **OKLCH ink-blue system not built.** The old docs and `CLAUDE.md` describe
   `--color-bg-base`, `--color-bg-raised`, `--color-fg-strong`, `--color-accent`
   as OKLCH tokens. **These names do not exist in `globals.css`.** The real
   system is the hex `--color-ep-*` family above. Until a migration PR lands,
   write `--color-ep-*` — do not reference the OKLCH names.
2. **Glow-blue family keeps the banned value.** `--color-ep-glow-blue-{40,30,25,03}`
   = `rgba(30, 64, 175, …)` — tokenized "at current value, no desaturation"
   (TOKEN-02). The desaturation pass is deferred. Do not add new `rgba(30,64,175)`
   or `rgba(59,130,246)` usages; consume the tokens if a glow already exists.
3. **`--color-ep-chart-line: #3B82F6`** — the banned neon blue survives as a
   chart token. Deferred.
