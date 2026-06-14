# Typography

> Type is the primary tool of hierarchy on this site. Weight, style, and size do
> what color and borders cannot (Stripe Press rule). Ground truth: fonts load in
> `src/app/layout.tsx`; the `.display` utility lives in `globals.css`.

---

## 🔒 Font roles

| Role | Font | CSS variable | Class / utility |
|------|------|--------------|-----------------|
| Body | Inter | `--font-inter` | `font-sans` (default) |
| Display (H1, H2) | Special Gothic Expanded One | `--font-special-gothic-expanded` | `.display` (uppercase, weight 400) |
| Wordmark | Inter `font-black` (900) | `--font-inter` | `font-sans font-black` + inlined PortalIcon SVG |
| Code / metrics | **JetBrains Mono** | `--font-jetbrains-mono` | `font-mono` |
| Editorial accent (rare) | Instrument Serif | `--font-instrument-serif` | `font-serif italic` — **never** H1/H2 |

> **Resolved conflict:** the mono font is **JetBrains Mono** (loaded in
> `layout.tsx`, `--font-mono: "JetBrains Mono"`). The retired docs said "Geist
> Mono" — that was stale. JetBrains Mono is canonical.

---

## 🔒 The `.display` utility

```css
.display {
  font-family: var(--font-special-gothic-expanded), "Arial Black", sans-serif;
  font-weight: 400;            /* single weight */
  letter-spacing: -0.012em;
  text-transform: uppercase;
  line-height: 1.02;
}
```

Apply to **every H1 and H2**. The font is naturally expanded, so no extra
tracking is needed. No serif decoration, no gradient, no glow.

---

## 🔒 Type scale

| Level | Tag | Font | Weight | Size | Notes |
|-------|-----|------|--------|------|-------|
| Page title | `h1` | Special Gothic Expanded One | 400 | `clamp(42px, 4.2vw, 58px)` uppercase | `.display`, `letter-spacing -0.012em`, `line-height 1.02` |
| Section heading | `h2` | Special Gothic Expanded One | 400 | `text-3xl` / `text-4xl` uppercase | `.display` |
| Card heading | `h3` | Inter (sans) | 500 | `text-xl` / `text-2xl` | `tracking-tight` |
| Body | `p` | Inter | 400 | `text-base` | line length `max-w-xl`–`max-w-2xl`, never full-width |
| Caption / meta | `span` | Inter | 500 | `text-[11px]` | `uppercase tracking-[0.12em]` |
| Code / metrics | `code` | JetBrains Mono | 400 | `text-sm` | tabular numbers |

---

## 🔒 Weight ceiling

- **Max weight for text is `font-semibold` (600).**
- `font-bold` (700) is reserved for the single most important number or CTA label on a page.
- `font-black` (900) is the **wordmark only** (Inter 900). Banned on all other display text.

---

## 🔒 Wordmark

The wordmark is **Inter `font-black` (900)** + the PortalIcon SVG (the "O"),
rendered by `src/components/ElPortalWordmark.tsx` — `P` + PortalIcon + `RTAL`.
It is **never** Special Gothic Expanded One.

The footer's large editorial `EL PORTAL` is a separate decorative treatment (the
`.wordmark` grain-fill element) — that one *is* Special Gothic Expanded One. Do
not confuse the two: the brand lockup ≠ the footer display word.

---

## 🔒 Retired / banned

- **Payoff word convention: RETIRED (2026-05-26).** The italic Instrument Serif
  payoff word is no longer used for heading emphasis. Special Gothic Expanded One
  uppercase carries all heading hierarchy. Instrument Serif may still appear in
  unrelated body-editorial moments, never in H1/H2.
- **Gradient text is permanently banned.** `background-clip: text` with any
  gradient is the single most recognizable AI-generated design tell.
  *(Sole sanctioned exception: the footer `.wordmark__fill` grain treatment,
  an art-directed decorative element — see COMPONENTS.md. Do not generalize it.)*
- No exclamation marks. No em-dashes substituting commas.
