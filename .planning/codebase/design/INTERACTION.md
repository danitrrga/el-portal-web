# Interaction

> Emil's component-craft principles, reconciled with El Portal's "stillness is
> the default" identity. Where the brand is quieter than Emil's general advice,
> the brand wins — and the tension is flagged.

---

## 🔒 Hover & press on El Portal surfaces

- **Cards do not move, grow, or glow.** Hover = border opacity only: `border-white/8`
  → `hover:border-white/15`, `transition-colors duration-300`. No scale, no colored
  border, no chromatic glow.
- **Buttons:** `transition-colors` only on hover. No transform on hover.
- **Focus ring** (global, `globals.css`): `outline: 2px solid rgba(255,255,255,0.30)`
  with `outline-offset: 2px` on `:focus-visible` for `a, button, input, select,
  textarea, [tabindex]`. Neutral white — not accent.

### ⚠️ OPEN — press feedback (`scale(0.97)` on `:active`)

Emil: pressable elements should `transform: scale(0.97)` on `:active` for instant
feedback. El Portal's locked rule says buttons take **no transform**. These
conflict. The brand rule (no transform) is currently LOCKED; Emil's press-scale is
**not adopted**. If a future decision wants tactile CTAs, scope `scale(0.97)` to
the **primary CTA on `:active` only** (press ≠ hover) and keep it subtle. Until
decided, do not add it.

---

## Component principles (Emil)

### Never animate from `scale(0)`

Nothing in the real world appears from nothing. Start entrances from `scale(0.95)`
+ `opacity: 0`, never `scale(0)`.

### Make popovers origin-aware

Popovers scale **from their trigger**, not center. Default `transform-origin:
center` is wrong for almost every popover.

```css
/* Radix */ .popover { transform-origin: var(--radix-popover-content-transform-origin); }
/* Base UI */ .popover { transform-origin: var(--transform-origin); }
```

**Exception: modals** keep `transform-origin: center` — they aren't anchored to a
trigger.

### Tooltips: skip delay on subsequent hovers

Delay the first tooltip to prevent accidental activation. Once one is open,
adjacent tooltips open **instantly** (`transition-duration: 0ms`, no entrance).
Feels faster without defeating the initial delay.

### Use transitions, not keyframes, for interruptible UI

Rapidly-triggered elements (toasts, toggles) should use CSS transitions so they
retarget mid-flight. Keyframes restart from zero.

### Blur to mask imperfect crossfades

When a state crossfade looks like two overlapping objects, add `filter: blur(2px)`
during the transition to blend them into one. Keep blur < 20px (expensive in
Safari).

### Animate entry with `@starting-style`

Prefer modern CSS entry over the `useEffect(setMounted)` pattern where browser
support allows:

```css
.toast {
  opacity: 1; transform: translateY(0);
  transition: opacity 400ms ease, transform 400ms ease;
  @starting-style { opacity: 0; transform: translateY(100%); }
}
```

---

## Touch-device hover gating

Touch devices fire hover on tap → false positives. Gate hover animations:

```css
@media (hover: hover) and (pointer: fine) {
  .element:hover { /* hover-only effects */ }
}
```

---

## Transforms & clip-path (technique reference)

- **`translate()` percentages** are relative to the element's own size — use
  `translateY(100%)` to move an element exactly its own height regardless of
  dimensions. Prefer percentages over hardcoded px.
- **`scale()` scales children too** (font, icons) — a feature for press states.
- **`clip-path: inset(…)`** is a top-tier animation tool: left→right reveals,
  hold-to-delete overlays, scroll image reveals (`inset(0 0 100% 0)` → `inset(0)`
  with `useInView { once: true, margin: "-100px" }`), and comparison sliders — all
  hardware-accelerated, no extra DOM.
- **WAAPI** (`element.animate([...], {duration, easing, fill})`) gives JS control
  with CSS performance when you need programmatic, interruptible motion.

---

## Gestures (if/when drag is added)

- **Momentum dismissal:** dismiss on `velocity > ~0.11` (`|distance| / elapsed`),
  not just a distance threshold — a quick flick should be enough.
- **Damping at boundaries / friction instead of hard stops** — the further past the
  edge, the less it moves.
- **Pointer capture** once drag starts; **ignore extra touch points** mid-drag.

---

## Cohesion (the Sonner lens)

Match motion to the component's personality. El Portal is a professional,
disciplined tool — motion is **crisp and quiet**, not playful or bouncy. Good
defaults beat options: ship the right easing/timing so nothing needs tuning.
Handle edge cases invisibly (pause timers on hidden tabs, maintain hover state
across stacked elements). Users never notice — which is exactly right.
