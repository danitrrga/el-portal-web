# Anti-Patterns

> The bans that keep the site from reading as AI-slop, plus Emil's review
> checklist and the current known-debt list. A violation in new code is a bug.

---

## The AI-Slop Test

Before shipping, ask: **can every element justify itself?** Generated design
can't. If you can't explain why a thing is there — its job in the hierarchy, the
reason for its color/motion/weight — remove it. Then run the **grayscale test**
(see TOKENS.md): desaturate a screenshot; if nothing changes, the palette is too
flat.

---

## 🔒 Permanent bans

| Ban | Reason / replacement |
|-----|----------------------|
| `background-clip: text` with a gradient on text | #1 AI design tell. Solid color only. (Sole exception: footer `.wordmark__fill`.) |
| `font-black` / `font-extrabold` on display text | Crude weight. Exception: wordmark = Inter 900. |
| `repeat: Infinity` on decorative motion | Perpetual animation = generated design. Exception: hero breathing graphic. |
| `animate-pulse` / `animate-bounce` / `animate-ping` on decoration | Same. |
| `useAnimationFrame` for decoration | Main-thread repaint at 60fps. Use CSS or Framer `animate`. |
| `transition: all` | Specify exact properties (`transition-colors`, `transition-transform`) — including the cva button base. |
| Scale transforms on hover for cards | Cards don't move, grow, or glow. |
| Colored / blue border transition on hover | Accent is the 10%, not on every hover. `hover:border-white/15`. |
| `backdrop-blur` on cards that don't float | Glass is for floating surfaces only (navbar, modals). |
| `text-shadow` glow on headings or badges | Emphasis comes from weight and size. (Grandfathered: `.text-glow-hero`.) |
| `#3B82F6` as accent | Too flat/bright. Use `--color-ep-accent: #4487D6`. |
| `rgba(30,64,175,…)` / `rgba(59,130,246,…)` neon glow | Banned for new work. Consume existing `--color-ep-glow-blue-*` tokens only. |
| Untinted gray neutrals (`zinc-*`/`slate-*` raw) | All neutrals tint toward blue. Use `--color-ep-fg-*`. |
| Pure black (`#000` / `#0a0a0a`) backgrounds | Use `--color-ep-bg-base: #02030a`. |
| Material Symbols CDN | Phosphor Light at 1.5 only. |
| Lucide for new work | Phosphor Light. |
| Nested `overflow-x-hidden` on page wrappers | Already on `body`; nesting creates implicit scroll containers. |
| Designing for light mode | Dark only. |
| Em-dashes substituting commas · exclamation marks | Banned in copy. |
| Micro-version numbers (`v2.0.47`) | Major versions only. |
| Raw `<button>` | Use `Button` / `ShinyButton`. |
| Importing from `src/lib/supabaseService` | Does not exist — this is the marketing site, no backend. |

---

## Emil's review checklist

When reviewing UI motion, check for:

| Issue | Fix |
|-------|-----|
| `transition: all` | `transition: transform 200ms ease-out` (exact props) |
| `scale(0)` entry | Start from `scale(0.95)` + `opacity: 0` |
| `ease-in` on UI | Switch to `ease-out` / custom curve |
| `transform-origin: center` on popover | Trigger location / Radix var (modals exempt) |
| Animation on keyboard action | Remove entirely |
| Duration > 300ms on UI element | Reduce to 150–250ms |
| Hover animation without media query | Add `@media (hover: hover) and (pointer: fine)` |
| Keyframes on rapidly-triggered element | Use CSS transitions (interruptible) |
| Framer Motion `x`/`y` props under load | Use `transform: "translateX()"` for HW accel |
| Same enter/exit speed | Exit faster than enter |
| Everything appears at once | Stagger 30–80ms |

> **Review format:** when auditing UI code, output findings as a single markdown
> table with `| Before | After | Why |` columns — one row per issue. Not a list.

---

## 🛠 Current known debt (do not propagate, do not silently "fix")

These exist in code today and are tracked, not pattern material:

1. **Token names** — OKLCH `--color-bg-base`/`--color-accent` system never built;
   real tokens are `--color-ep-*`. (TOKENS.md DEBT 1)
2. **Glow-blue tokens** keep `rgba(30,64,175,…)` "at current value, no
   desaturation" (TOKEN-02); `--color-ep-chart-line: #3B82F6` survives.
3. **`.card-glow`** uses a blue+violet chromatic tint; **`.text-glow-hero`** uses a
   `text-shadow` glow; `MethodologyCard` carries an `rgba(30,64,175,0.1)` shadow.
   Grandfathered, deferred.

When a migration PR addresses any of these, update the corresponding doc's tag
from 🛠 DEBT to 🔒 / 📦 and remove the entry here.
