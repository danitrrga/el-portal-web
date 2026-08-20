# Translation Flags — Plan 07-10 (/privacy, /terms)

Per-plan register for `07-10-PLAN.md`, per the ownership contract in
`TRANSLATION-FLAGS.md`. This file is written only by 07-10 and is aggregated
into the shared register by plan 07-16.

| Key | English | Spanish shipped | What was lost | Trigger |
|---|---|---|---|---|
| legal.privacy.h1 | Your data, fully visible. | Tus datos, a la vista. | The literal translation ("Tus datos, totalmente visibles.") overflowed the H1's own box by up to 122px at 320–430px — a NEW containment offender with no English counterpart, fixed at source per Task 2's decision tree rather than deferred. The shipped line reads well and keeps "visible," but drops the explicit sense of completeness/transparency English carries with "fully" (nothing held back) in favor of a shorter idiom about being "in view." | 4 (length budget) |
| legal.privacy.rights[0,1,2].action | Settings — Privacy — Download / Settings — Privacy — Delete / Settings — Privacy | Privacidad — Descargar / Privacidad — Eliminar / Privacidad | Dropped the "Configuración — " (Settings) prefix from all three navigation breadcrumbs to resolve a NEW clip-escape offender (the RightRow action `span` is `flex-shrink-0`, and the fuller Spanish breadcrumb pushed up to 43px off-screen at 320px, clipped by `ReadingLayout`'s ancestor). The shipped breadcrumbs still point the reader to the right screen but no longer name the top-level "Settings" navigation step English states explicitly. | 4 (length budget) |

Zero additional rows: the rest of the legal namespace (both pages' body prose,
all Bucket/Provider/Right descriptions, and every Terms of Service section)
is formal boilerplate or plain descriptive prose in the English source with no
pun, idiom, rhythm-dependent phrasing, or untranslatable term of art — each
was checked against all four triggers and none fired beyond the two rows
above.
