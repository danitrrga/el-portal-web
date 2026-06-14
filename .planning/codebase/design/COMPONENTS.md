# Approved Component Patterns

> Copy-ready patterns for landing surfaces. Match these; don't reinvent. Real
> implementations live in `src/components/`.

---

## 🔒 Standard card

```tsx
<div className="rounded-2xl border border-white/8 bg-[var(--color-ep-section-bg)] p-6
                transition-colors duration-300 hover:border-white/15">
```

Solid dark surface, hairline border. **Not glass by default.** No `backdrop-blur`
unless the card physically floats over content. No scale, no glow, no colored
border on hover. Card internal padding `p-6`–`p-8`.

## 🔒 Glass surface (floating only — navbar, modals, dropdowns)

`.glass-panel` utility (`globals.css`):

```css
.glass-panel {
  background: rgba(2, 6, 23, 0.7);
  backdrop-filter: blur(20px) saturate(1.5);
  border: 1px solid rgba(148, 163, 184, 0.08);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03);
}
```

Reserved for surfaces that sit above a blurred background. Not for content cards.

## 🔒 Dot-pattern section background (primary texture)

```tsx
<div className="absolute inset-0 pointer-events-none" style={{
  backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
  maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%)",
  WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%)",
}} />
```

Texture must be structural — it frames real content, never ambient noise.

## 🔒 Connecting line / separator

```tsx
{/* connector — only when it links something real */}
<div className="h-px w-16 bg-gradient-to-r from-transparent via-white/15 to-transparent" />

{/* section separator (hairline) */}
<hr className="border-none h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
```

## 🔒 Badge / eyebrow (max one per page)

```tsx
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10
                 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-ep-fg-muted)]">
```

No blue badge border, no blue badge background, no glowing dot unless it
represents a real live status.

## 🔒 Navbar

Floating pill — `border-white/10`, `backdrop-blur-xl` acceptable here because it
floats over the page. Reference: `src/components/Navbar.tsx`.

## 🔒 Iconography

**Phosphor Light** at `strokeWidth={1.5}`, imported from `@phosphor-icons/react`.
Material Symbols (CDN) banned. Lucide banned for new work.

---

## Buttons & CTAs

Use the shadcn `<Button>` (`src/components/ui/button.tsx`) with brand variants:

| Variant | Usage | Pattern |
|---------|-------|---------|
| `brand` | Primary CTA / "Get Started" chip | Pill, `border-white/20 bg-white/[0.05] hover:bg-white/[0.08]`, `rounded-full` |
| `brand-link` | Secondary CTA, nav text-actions | `text-[#aab3c5] hover:text-[#f4f6fb]`, no border |
| `ghost` | Internal interactive (icons) | shadcn ghost |

No transform on hover. `transition-colors` only — never `transition: all`. Never
use raw `<button>`; never use the shadcn `default`/`ghost` variant for hero/nav CTAs.

### 🔒 ShinyButton is retired

The primary CTA is the shadcn `<Button>` **`brand`** variant. `ShinyButton` is
**retired** (the UI was changed away from it). Do not use it in new work.

`src/components/ui/shiny-button.tsx` is now unused dead code — referenced only by
its own file and a stale `globals.css` block. It's kept (not deleted) but is safe
to remove in a cleanup pass.

---

## 🛠 DEBT — existing glow utilities

- **`.card-glow`** (`globals.css`, used in `CalloutCard.tsx`, `MethodologyCard.tsx`)
  fades in a `linear-gradient(135deg, rgba(30,64,175,0.04), rgba(139,92,246,0.03))`
  on hover — a faint **chromatic** (blue + violet) tint. This contradicts the
  "cards don't glow / one brand hue" rules. It's grandfathered, not a pattern to
  copy. New cards use the Standard card (border-opacity hover) above.
- **`.text-glow-hero`** applies `text-shadow` glow to hero text — contradicts the
  "no `text-shadow` glow on headings" ban. Grandfathered on the hero only; do not
  extend.
- `MethodologyCard.tsx` carries a `shadow-[…rgba(30,64,175,0.1)]`. Same family of
  deferred glow debt (TOKEN-02).

---

## Real component map

| File | Role |
|------|------|
| `ui/button.tsx` | shadcn Button — `brand` / `brand-link` variants |
| `ui/shiny-button.tsx` | ShinyButton — 🔒 retired, unused (safe to delete) |
| `ui/animated-group.tsx` | Reusable stagger wrapper (ibelick/tailark primitive) |
| `ElPortalWordmark.tsx` | Canonical brand lockup (Inter 900 + PortalIcon) |
| `PortalIcon.tsx` | Brand icon — 7 concentric rings |
| `Navbar.tsx` | Floating glass nav (glass-panel reference) |
| `Footer.tsx` | Footer + `.wordmark` grain-fill display word |
| `Hero.tsx`, `hero/HeroAppMockup.tsx` | Hero (companion philosophy, tailark structure) |
