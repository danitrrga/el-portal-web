# Motion

> Distilled from Emil Kowalski's design-engineering philosophy, scoped to El
> Portal. The brand rule comes first: **stillness is the default.**
> `MOTION_INTENSITY ~ 3`. The page is quiet when you're not interacting. Only the
> hero breathes.

---

## 🔒 El Portal motion rules

- **Entrance-only, everywhere except the hero.** Scroll-triggered reveals fire
  once and never replay.
- **Canonical easing:** `cubic-bezier(0.22, 1, 0.36, 1)`, **300–500ms**.
- **Stagger:** 80ms between siblings (`staggerChildren: 0.08`).
- **Springs only for interactive state changes** (tab switches, drag) — never for entrances.
- **Every animation respects `prefers-reduced-motion: reduce`.**
- **Hover is subtle:** border-opacity shift, slight background lift. No color
  change, no scale, no glow on cards. Buttons use `transition-colors` only.

Reference implementation (`DESIGN.md` legacy → keep):

```tsx
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};
// container: { transition: { staggerChildren: 0.08 } }
```

---

## The Animation Decision Framework (Emil)

Answer these **in order** before writing any animation.

### 1. Should this animate at all?

| Frequency | Decision |
|-----------|----------|
| 100+×/day (shortcuts, palette toggle) | No animation. Ever. |
| Tens×/day (hover, list nav) | Remove or drastically reduce |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare / first-time (onboarding, celebration) | Can add delight |

Never animate keyboard-initiated actions — they repeat hundreds of times a day
and animation makes them feel slow.

### 2. What is the purpose?

Valid purposes: spatial consistency, state indication, explanation, feedback,
preventing jarring change. If the purpose is "it looks cool" and the user sees it
often — don't animate.

### 3. What easing?

- Entering / exiting → **ease-out** (starts fast, feels responsive).
- Moving / morphing on screen → ease-in-out.
- Hover / color → ease.
- Constant motion (progress, marquee) → linear.
- **Never `ease-in` on UI** — it delays the moment the user is watching most.

Built-in curves are too weak. El Portal's canonical entrance curve is
`cubic-bezier(0.22, 1, 0.36, 1)`. Emil's stronger general-purpose curves, if a
sharper feel is needed:

```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

### 4. How fast?

| Element | Duration |
|---------|----------|
| Button press feedback | 100–160ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns, selects | 150–250ms |
| Modals, drawers | 200–500ms |
| Marketing / explanatory | Can be longer |

**UI animations stay under 300ms.** A 180ms dropdown feels more responsive than
a 400ms one. Perceived speed matters as much as actual speed: `ease-out` at 200ms
feels faster than `ease-in` at 200ms.

---

## Springs (interactive state only)

Springs simulate physics and maintain velocity when interrupted — ideal for
gestures and tab/state changes, never for entrances on this site.

```js
// Apple-style (recommended, easier to reason about)
{ type: "spring", duration: 0.5, bounce: 0.2 }
// Traditional
{ type: "spring", mass: 1, stiffness: 100, damping: 10 }
```

Keep bounce subtle (0.1–0.3); avoid it in most UI. Use `useSpring` to smooth
mouse-tracked decorative values rather than binding to the raw pointer.

---

## 🔒 The hero-breathing exception

The **one** place perpetual subtle motion is allowed: slow, ambient movement in
the branded hero graphic — a gradient that breathes at ~0.02Hz. Background motion
you *feel* but don't *watch*. Constraints:

- **GPU-composited only** — CSS animation on `transform`/`opacity`.
- **Never `useAnimationFrame`** on DOM elements (main-thread repaint at 60fps).
- Nowhere else. No `repeat: Infinity` on any other decorative element.

---

## Performance rules (Emil)

- **Only animate `transform` and `opacity`.** They skip layout and paint. Animating
  `height`/`width`/`margin`/`padding` triggers all three.
- **Framer Motion shorthand (`x`, `y`, `scale`) is NOT hardware-accelerated** — it
  runs on `requestAnimationFrame` on the main thread. Under load (page transitions,
  scripts) it drops frames. Use the full transform string for predetermined motion:
  `animate={{ transform: "translateX(100px)" }}`.
- **CSS animations beat JS under load** — they run off the main thread. Use CSS for
  predetermined animations; JS only for dynamic, interruptible ones.
- **Use CSS transitions over keyframes for interruptible UI** — transitions retarget
  smoothly mid-flight; keyframes restart from zero.
- **Don't thrash inherited CSS vars** — changing a var on a parent recalcs all
  children. Set `transform` directly on the moving element.

---

## Reduced motion (Emil)

Reduced motion means *fewer and gentler* animations, not zero. Keep opacity and
color transitions that aid comprehension; remove movement and position changes.

```css
@media (prefers-reduced-motion: reduce) {
  /* keep fades; drop transforms */
}
```

```jsx
const shouldReduceMotion = useReducedMotion();
const closedX = shouldReduceMotion ? 0 : "-100%";
```

---

## Stagger & asymmetric timing

- Stagger entering siblings 30–80ms apart (El Portal default: 80ms). Long delays
  feel slow. Stagger is decorative — never block interaction while it plays.
- **Asymmetric enter/exit:** slow where the user is *deciding*, fast where the
  *system responds*. Releases snap back at ~200ms ease-out even when the press was
  deliberate.

---

## Reference implementation: the footer wordmark

`.wordmark__fill` (`globals.css`) is the model for "rich motion without violating
the rules": a left→right grain reveal driven by an animated `@property
--wordmark-reveal` and a `mask-composite` of (linear sweep ∩ feTurbulence grain).
It is CSS-only, reversible, crisp at any size, **no `useAnimationFrame`, no
perpetual loop**, and honors `prefers-reduced-motion`. When you need expressive
motion, reach for CSS `@property` + mask/clip-path like this — not a JS rAF loop.

---

## Debugging

Review animations the next day with fresh eyes. Play them at 2–5× slow motion (or
DevTools Animations panel) to catch overlapping states, wrong `transform-origin`,
or out-of-sync properties. Test gestures on real devices.
