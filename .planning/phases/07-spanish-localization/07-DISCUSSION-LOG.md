# Phase 7: Spanish Localization — Discussion Log

**Date:** 2026-08-02
**Mode:** `--auto` (fully autonomous — no interactive prompts)
**Areas discussed:** 6 of 6 (auto-selected)

> Human-reference only. Downstream agents read `07-CONTEXT.md`, not this file.

---

## Auto-selection log

Per `modes/auto.md`, every question was resolved to the recommended option without
prompting. Each is recorded here so the choices can be audited and overridden.

```
[--auto] Selected all gray areas: Product vocabulary, Catalogue organisation,
         Copy production, Legal pages, Changelog, Language switcher.
```

### Area 1 — Product vocabulary

```
[auto] Product vocabulary — Q: "Do product primitives and feature names translate?"
       → Selected: "Translate conceptual primitives, keep app-UI feature names in English"
         (recommended default)
```

Options considered:
1. **Hybrid — primitives translate, feature names don't** ← selected
2. Translate everything
3. Keep all product terms in English

Rationale: `Version`/`Cycle`/`Day` appear constantly as common nouns; leaving them
English makes Spanish prose unreadable. But `The Lab`/`Cinema Mode` are UI labels in
the app — translating them on the marketing site means the reader is told a name the
product never shows them.

**Caveat recorded, not hidden:** this rests on the app being English-only UI, which
was **not verified** (separate repo). Flagged in CONTEXT.md D-01 as an assumption the
planner must confirm before writing copy. If the app is localized, the decision flips.

```
[auto] Product vocabulary — Q: "How is term consistency enforced across ~390 strings?"
       → Selected: "Glossary as a first-class deliverable" (recommended default)
```

### Area 2 — Catalogue organisation

```
[auto] Catalogue organisation — Q: "One file per locale, or namespaced by route?"
       → Selected: "Namespaced by route/component" (recommended default)
[auto] Catalogue organisation — Q: "Semantic keys or content-derived keys?"
       → Selected: "Semantic keys" (recommended default)
```

Rationale: a flat 390-key file is unreviewable in a diff. Content-derived keys rot as
soon as English copy changes.

### Area 3 — How the Spanish copy gets produced

```
[auto] Copy production — Q: "AI-drafted, scaffolded placeholders, or unreviewed MT?"
       → Selected: "AI-drafted in-phase, with manifesto + legal flagged for human
         read-through before merge" (recommended default)
[auto] Copy production — Q: "Which surface sets the quality bar?"
       → Selected: "/manifesto, drafted early" (recommended default)
```

Rationale: placeholders ship a half-broken site; unreviewed MT ships copy nobody has
read. The register rules in `07-RESEARCH.md` §7 are specific enough to draft against.

### Area 4 — Legal pages

```
[auto] Legal pages — Q: "Translate, English-only, or translate with English authoritative?"
       → Selected: "Translate + visible English-authoritative notice" (recommended default)
```

Rationale: keeps parity, removes the meaning risk that made this an open question.
Standard industry practice.

### Area 5 — Changelog

```
[auto] Changelog — Q: "How is ongoing sync parity handled?"
       → Selected: "Translate existing 35 entries + extend el-portal-changelog skill
         with a translation step" (recommended default)
```

Options considered:
1. **Translate now + extend the sync workflow** ← selected
2. Translate now, accept drift
3. English-only with a notice

Rationale: option 2 is the worst outcome — the Spanish changelog decays from the first
sync while still *looking* complete. Option 3 is the recorded fallback if extending the
skill proves out of reach.

**Scope note:** extending the skill is a deliberate, named inclusion, not creep — the
phase's own parity criterion cannot hold without it. Bounded to the sync workflow only.

### Area 6 — Language switcher

```
[auto] Language switcher — Q: "Flags, dropdown, or text toggle?"
       → Selected: "Text toggle EN / ES, no flags" (recommended default)
[auto] Language switcher — Q: "Where does it live?"
       → Selected: "Nav on desktop, footer everywhere, 44px target" (recommended default)
[auto] Language switcher — Q: "What happens to the current route on switch?"
       → Selected: "Preserve route" (recommended default)
```

Rationale: flags denote countries, not languages — which flag would represent Spanish?
44px inherits RESP-04 from Phase 5, so an undersized switcher fails CI rather than
shipping.

---

## Claude's discretion

Resolved without prompting, open to override: JSON namespace filenames and layout,
glossary location, switcher visual treatment within D-10/D-11, and gloss frequency.

## Deferred ideas

Additional locales; localizing the app itself; locale-specific pricing; RTL; a paid
TMS; promoting the RESP-07 reduced-motion probe into `motion.spec.ts` (carried from
Phase 5, unrelated to i18n).

## Risks surfaced during analysis, not previously recorded

- **Spanish runs ~15–25% longer than English**, and Phase 5 tuned every heading to
  exact measured clamps. `e2e/containment.spec.ts` — built in Phase 5 specifically to
  catch text overflowing its own box — is the harness most likely to fire.
- **Uppercase accented glyphs** (`Á É Í Ó Ú Ñ`) in Special Gothic Expanded One on
  `.display` headings. Missing glyphs or clipped diacritics on uppercase display type
  is easy to miss and looks broken.
- **`app/proxy.ts` is a shared surface with Phase 6** if that phase puts CSP there.

---

*Phase: 07-spanish-localization*
*Logged: 2026-08-02*

---

## Post-discussion correction (same session)

The `--auto` pass resolved Area 1 with an explicit caveat: D-01 rested on the
assumption that the El Portal app was English-only UI, which had **not** been
verified. That assumption was checked before chaining to plan-phase.

**It was false.** `/home/danitrrga/dev/Projects/el-portal` already ships:

- `next-intl@^4.8.3`
- five locales — `en`, `es`, `fr`, `pt`, `zh`
- `src/messages/es.json`, 80 KB / 1,711 keys, in production

The auto-selected recommendation had the right *shape* (hybrid: some terms
translate, some don't) but would have produced **wrong specifics**. Extracting the
real term pairs shows `Trends` and `Dashboard` stay English in the app despite
having obvious Spanish equivalents — a split no amount of reasoning would have
guessed. Drafting copy from the recommendation would have contradicted the shipping
product on at least those two terms, plus `Cinema` and `Pulse`.

D-01 and D-02 were rewritten: the glossary is now **derived mechanically from the
app's `es.json`**, not authored. D-02b added for marketing-only concepts the product
UI never names.

Two knock-on changes:

- Canonical refs gained the app repo's `es.json` and `lib/i18n.ts` (read-only
  reference — no build-time dependency across repos).
- "Localizing the app itself" was removed from Deferred; it is already done. The
  deferred entry for additional locales was re-framed: the marketing site is three
  locales behind a product that already speaks `fr`/`pt`/`zh`, so the structure
  should make adding them a data change.

**Process note:** this is the value of flagging assumptions explicitly rather than
letting a confident recommendation pass as settled. `--auto` picks defaults; it does
not make them true. The caveat was written into D-01 precisely so it would get
checked, and checking cost one command.
