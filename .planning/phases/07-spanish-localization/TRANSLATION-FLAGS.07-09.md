# Translation Flags — Plan 07-09 (/pricing)

Per-plan register file (see `TRANSLATION-FLAGS.md`'s ownership contract —
this plan writes only here, never to the shared file). Every Spanish string
this plan wrote in the `pricing` namespace (`hero.*`, `tiers[]`,
`comparison.*`, `comparisonFeatures[]`, `faq.*`, `faqs[]`) was checked
against `SPANISH-VOICE.md`'s four wordplay triggers, not sampled. Seven rows
fired — this page carries more brand-voice prose (a punchy hero line, tier
descriptions, and FAQ answers written in a deliberately casual register)
than a pure documentation surface like `/mcp`, so a non-zero count here is
expected rather than a quality signal by itself.

| Key | English | Spanish shipped | What was lost | Trigger |
|---|---|---|---|---|
| pricing.hero.heading | Pay once. Own the system. | Paga una vez. Sé dueño del sistema. | The English second sentence is a one-word imperative ("Own") landing the whole payoff in a single hard beat; no single Spanish verb carries "own the system" as a command, so the accurate rendering needs a copula + noun phrase ("Sé dueño del sistema") that is two words longer and trades the one-verb punch for a softer construction. | 2 (rhythm) |
| pricing.tiers[1].description | Everything in Initiate, plus AI on top. | Todo lo de Initiate, más IA. | "on top" is a casual idiom (an unexpected bonus stacked onto the base) with no equivalent in "más IA," which reads as a flat additive "plus AI" rather than "AI as a bonus." | 1 (idiom) |
| pricing.faqs[4].a | ...The only real ceilings are storage (60 MB cap) and the AI layer on top (narratives, sentiment, weekly digest emails). | ...Los únicos límites reales son el almacenamiento (tope de 60 MB) y la capa de IA (narrativas, sentimiento, correos de resumen semanal). | Same "on top" idiom as the row above, dropped a second time in this answer for the same reason — no single Spanish phrase captures "layered on as a bonus" without a much longer construction that would not fit the sentence's existing rhythm. | 1 (idiom) |
| pricing.tiers[1].cta | Claim Lifetime access | Obtener acceso | The accurate infinitive rendering, "Obtener acceso de por vida," pushed both pricing cards 7px past their shared grid track at 320px (measured; see the Task 2 commit) because the CTA button's `whitespace-nowrap` text was the min-content driver for the single-column grid track shared by both stacked cards. Shortened to "Obtener acceso," which drops the explicit "for life" qualifier from the button label itself — the qualifier is still visible one line above as the card's own H2 ("Lifetime"), so the loss is compensated by context rather than eliminated outright. | 4 (length budget) |
| pricing.comparisonFeatures[10].name | Internationalization (5 languages) | 5 idiomas | "Internacionalización" is a single 131px unbreakable word (vs. the English "Internationalization" at 123px) that widened the comparison table's Feature column and measurably worsened the pre-existing KU-4 escape in Spanish (85/45/15/0px vs. the English 77/37/7/0px baseline at 320/360/390/430). Shortened to "5 idiomas," which drops the explicit category label "Internacionalización" and states only the count. | 4 (length budget) |
| pricing.faqs[2].a | El Portal is built for serious operators, not for profit margins. | El Portal está pensado para quienes se lo toman en serio, no para maximizar márgenes. | "operators" is a deliberate, specific brand-voice noun (implying a serious practitioner running their own system, not a generic "user") that appears only in this one sentence on this page — GLOSSARY.md has no entry for it, and no single Spanish noun ("operadores"? "profesionales"?) carries the same connotation without sounding either overly literal or overly formal. Shipped as a relative clause ("quienes se lo toman en serio," those who take it seriously) that preserves the meaning but not the specific identity-noun framing. | 3 (no clean equivalent) |
| pricing.faqs[3].a | ...how your mood lines up with your output... | ...cómo se relaciona tu ánimo con tu producción... | "lines up with" carries a spatial/alignment image (two things falling into sync) that the accurate but generic "se relaciona con" (relates to) does not carry — the correlation is stated, the visual metaphor for it is not. | 1 (idiom) / 2 (imagery) |

## Notes on what did NOT fire

- **Product vocabulary** — every El Portal noun this page uses (Version,
  Cycle, Day, Habit, Goal, Streak, Project, Score, Archives, Storage,
  Language, Weekly digest, AI, plus the kept-English terms The Lab, Trends,
  Dashboard-adjacent Pulse, Mantra) resolved directly through
  `src/messages/GLOSSARY.md`. See `src/messages/glossary-additions/07-09.md`
  for the one deliberate coinage this plan made (tier/plan brand names
  staying English) and the reasoning for it.
- **The Version/Cycle FAQ answers** (`faqs[0].a`, `faqs[1].a`) were already
  clean of fixed-duration claims on disk before this plan touched them
  (commit `d319f52`, per `SPANISH-VOICE.md`'s PRODUCT TRUTHFULNESS section).
  Both were translated as concept descriptions, not durations, in both
  languages — no wordplay loss to record, since the English source itself
  is already plain, factual prose here (title/persona/macro-goals
  enumeration), not brand-voice wordplay.
- **The "no exclamation marks" / anti-word constraints** shaped several
  word choices (e.g. avoiding "desbloquea" for "unlocks" in `faqs[2].a`,
  landing on "da acceso a todo" instead) but these are register-policy
  substitutions with a clean, equally strong Spanish result, not a trigger
  under the four-item test — a row here would be manufactured, not real.
