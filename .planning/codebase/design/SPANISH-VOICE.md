# Spanish Voice Contract

> The binding Spanish register, anti-words and punctuation contract for Phase
> 7 (spanish-localization) and every locale added after it. This is the one
> file every translation plan in Waves 2-4 reads — it is self-contained: a
> reader must not need `07-RESEARCH.md` open to apply it. Uses the same
> LOCKED / CURRENT / DEBT convention as the rest of this directory (see
> [`README.md`](./README.md)).

---

## 🔒 REGISTER — LOCKED

**`tú`, subject pronoun always omitted.** Spain-flavoured, peninsular
register. This is the design owner's decision (2026-08-02, revised same day
after an initial fully-impersonal draft read "suena raro" — too institutional
for a product about personal identity).

**The two halves are not in conflict.** Spanish is pro-drop, so the subject
pronoun is dropped regardless of register. "Omit the subject" is satisfied by
`tú` copy that never writes the pronoun itself.

### The rule, in priority order

1. **Never write a subject pronoun** — no `tú`, `usted`, `vosotros`,
   `ustedes` written out. Spanish drops it; writing it sounds emphatic or
   translated-from-English.
2. **CTAs, buttons and links → infinitive.** Standard UI convention, and it
   keeps buttons short: `Abrir El Portal`, `Iniciar sesión`, `Crear cuenta`,
   `Leer la metodología`.
3. **Headings → nominal where it reads naturally, `tú` conjugation where it
   does not.** `Tres horizontes. Una jerarquía.` (nominal) but `Empieza tu
   primera Versión.` (`tú` conjugation, no written pronoun).
4. **Prose and instructions addressing the reader → `tú` conjugation.**
   `Registra hábitos, objetivos y biometría.`
5. **`your X` → `tu X`.** The definite-article dodge (`la primera Versión`)
   is not required and generally reads colder — prefer `tu primera Versión`.
6. **Never `usted` / formal `su` anywhere — including legal copy.** Not as a
   fallback, not for `/privacy` or `/terms`. One register across the whole
   site, no exceptions for "serious" surfaces.
7. **Second-person plural: `vosotros` when plural address is needed,
   `ustedes` never.** Spain-flavoured Spanish is explicitly fine (design
   owner, 2026-08-02: *"we don't care, vosotros is fine"*). Do not contort a
   sentence to avoid plural address. Mixing `vosotros` and `ustedes` in the
   same site is the actual error — pick one, and it's `vosotros`.

### Fastest sanity check — the three-row table

| | |
|---|---|
| ✓ | `Empieza tu primera Version` — no pronoun written, `tú` conjugation |
| ✗ | `Tu empiezas tu primera Version` — pronoun written |
| ✗ | `Empiece su primera Version` — `usted` |

If a sentence doesn't sort cleanly into the ✓ row, it doesn't ship.

### Two tokens that are NOT hard-fail candidates

Plan 07-03 builds the CI register gate directly from this document. These two
tokens must never land in that gate's hard-fail list:

- **`vosotros` is ALLOWED.** Rule 7 above sanctions it explicitly. A hard-fail
  on `vosotros` would fail the project's own correct, intended copy.
- **`su` / `sus` is ADVISORY ONLY, never a hard fail.** It is banned as the
  *formal* possessive (Rule 6) but is also the legitimate third-person
  possessive — "sus tendencias" ("its trends," referring to a Version or a
  Cycle, not the reader). The gate should flag `su`/`sus` for human review,
  not fail the build on the token alone.

---

## 🔒 REGIONAL VARIANT — LOCKED, RESOLVED

**Peninsular Spanish, no neutrality constraint.** `ordenador`, `móvil`,
`vale` and other Spain-specific vocabulary are fine. Translators should write
natural peninsular Spanish rather than hedging toward a neutral
Latin-American-safe register.

**Locale code stays `es`, not `es-ES`.** Task 1 of `07-02-PLAN.md` verified
the app itself uses the bare `es` code (`el-portal/src/lib/i18n.ts`:
`locales = ['en', 'es', 'zh', 'pt', 'fr']`, no `es-ES` anywhere in that file).

**These are two separate decisions — do not conflate them.** The *copy* is
Spain-flavoured (this section). The *`hreflang`/locale code* is the broader
`es`, not the narrower `es-ES` (previous section's sibling decision in
`07-CONTEXT.md`/`07-RESEARCH.md` §7): `hreflang="es"` targets Spanish
speakers everywhere, and a Latin-American reader is better served by
peninsular Spanish than by English, so the broader code maximises reach at no
cost. Revisit only if a region-specific variant is ever added.

---

## 🔒 CONFIRMED CTA TRANSLATIONS — LOCKED

| Element | English (current code) | Spanish |
|---------|------------------------|---------|
| Primary CTA (Hero, CTASection) | `Open El Portal` | `Abrir El Portal` |
| Secondary CTA (Hero) | `Read the methodology` | `Leer la metodología` |
| Navbar auth link | `Log in` | `Iniciar sesión` |
| Navbar primary CTA | `Sign Up` | `Crear cuenta` |

**`text-nowrap` caveat:** all three primary-CTA call sites (`Hero.tsx:148`,
`Hero.tsx:159`, `CTASection.tsx:58`) wrap their label in a
`<span className="text-nowrap">`. The Spanish strings above are comparable
length or shorter than their English source — low risk today — but because
the wrapper forbids wrapping, **any future re-wording of these exact four
strings must be re-measured against button width at 320px before merge**
(buttons stack `flex-col` below `md:`, so width pressure is a desktop-only
concern for these specific CTAs, not a mobile one).

---

## 🔒 SPANISH ANTI-WORDS — LOCKED

Extends `BRAND.md`'s English anti-words list — it does **not** replace it.
Both bind; check copy against both lists.

> moderno, elegante, estilizado, desatar, elevar (as a verb of ambition —
> "elevar tu vida"), de última generación, revolucionario, que cambia las
> reglas del juego, potente/poderoso, hermoso, inmersivo, fluido/sin
> fricciones (as marketing filler — "seamless"), vanguardista, potenciar (as
> hype — "potencia tu día"), desbloquear (as hype — "desbloquea tu
> potencial"), empoderar.

**Copy rules carry over unchanged from `BRAND.md`:** no exclamation marks
anywhere, no em-dashes substituting commas.

---

## 🔒 PUNCTUATION — LOCKED

- **Exclamation marks:** none anywhere. This bans the inverted `¡` in Spanish
  too — it is inseparable from an exclamation, and exclamations are already
  banned site-wide. There is no locale exception.
- **Question marks:** `¿…?` is permitted for genuine questions in prose, but
  rare on this site — headings here are declarative, per `BRAND.md`'s
  "Disciplined" principle. **When used, BOTH marks are required.** Dropping
  the opening `¿` to save width is not a stylistic option in Spanish.
- **Quotation marks:** straight double quotes, as today. Never guillemets
  (`«»`) — the site renders Spanish and English chrome side by side (nav,
  unprefixed English routes), and a second quotation-mark convention would
  read as a second typographic language on the same site.
- **Dashes:** correctly-used em/en dashes stay — they translate to the
  equivalent Spanish em/en-dash construction. The "no em-dash substituting
  commas" rule bans dashes *replacing* commas; it does not ban dashes used
  correctly, which the current English copy already does (e.g.
  `CTASection.tsx:51` — "tracks, analyzes, and surfaces patterns — you focus
  on the work").

---

## 🔒 PRODUCT VOCABULARY — LOCKED

Single lookup: [`src/messages/GLOSSARY.md`](../../../src/messages/GLOSSARY.md).
Every El Portal product noun resolves there — derived mechanically from the
app's own shipped catalogues, never authored.

**Inventing a term is a defect.** If the glossary has no entry for a term the
marketing copy needs, the app UI genuinely has no string for it (D-02b). The
sanctioned move is writing the coinage to your own plan's
`src/messages/glossary-additions/07-NN.md` file — never editing
`GLOSSARY.md`'s "Marketing-only" section in place. One reason, stated
plainly: parallel plans, one file each — a shared write target under
concurrent execution is a lost append at best and a merge conflict at worst.

---

## 📦 ACCENTED DISPLAY TYPE — CURRENT, pending 07-05

Whether Special Gothic Expanded One renders `Á É Í Ó Ú Ñ` correctly under the
`.display` uppercase treatment is **UNVERIFIED** at the time of writing. This
section is a placeholder for that answer, not the answer itself.

Plan 07-05 Task 2 measures it directly (does the font have those glyphs, do
they clip or render at expected width under the existing display clamp) and
writes the outcome — and any resulting copy rule (e.g. a fallback for a
heading that clips) — back into this section. This question is recorded here
rather than buried in one plan's summary because every Wave 3 and Wave 4 plan
writes Spanish display headings against this file, and the answer affects
all of them, not just 07-05's own surface.

*07-05 fills this in — do not treat the absence of a verified answer here as
"no risk."*

---

## 🔒 WORDPLAY ESCALATION — LOCKED

Spanish copy on this site is a **re-write in the brand voice**, not a
literal translation — a translator is expected to depart from the English
when the brand voice calls for it. The failure mode this rule exists to
catch is narrower and quieter: an English line whose effect depends on a
pun, a rhythm, a double meaning, or a term of art with no Spanish equivalent
gets rendered as a flat, accurate sentence. The catalogue looks complete.
Nobody ever learns the line died.

**The rule:** if carrying an English string into Spanish costs its **effect**
— not its meaning — the translator ships the best Spanish available **and**
records the loss in
[`TRANSLATION-FLAGS.md`](../../phases/07-spanish-localization/TRANSLATION-FLAGS.md).

- **Shipping a flattened line without recording it is a defect.**
- **Leaving the key untranslated or empty is also a defect** — parity gates
  fail, and a blank is not a flag. The shipped Spanish must always be real,
  correct copy; the flag is a request for a *better* rewrite, not a
  placeholder for a missing one.

### The four triggers (a check, not a judgement call)

1. The English turns on a pun, idiom, or double meaning.
2. The effect is carried by rhythm or sound that the Spanish version loses.
3. The term has no Spanish equivalent the GLOSSARY resolves, and no
   marketing-only coinage feels right.
4. The Spanish that preserves the meaning breaks the length budget the
   display clamp allows.

### Who owes a count

The register is a **phase deliverable read by the design owner**, not a
scratch file. **Nine plans write Spanish copy and therefore owe a count:**
07-04, 07-05, 07-06, 07-07, 07-08, 07-09, 07-10, 07-13, 07-14.

07-04 is on that list because it writes the shared chrome (Navbar, Footer,
CTASection labels, and the cross-locale hint) — I18N-07 covers all
user-facing strings, chrome included, and leaving it off would make the
site's most-repeated copy the one surface with no translation-quality owner.

Each of the nine plans ends its summary with the line
`TRANSLATION FLAGS: n`, where `n` is the number of rows it wrote into its own
`TRANSLATION-FLAGS.07-NN.md`. **Zero is a legitimate answer** and is a claim
the plan's author is making. **No line at all is an unanswered question** —
plan 07-16 fails on the missing line, never on a low count. That is
deliberate: a gate that demanded rows would manufacture them.

### How this is enforced

Two mechanisms, both named so no plan has to guess at enforcement:

1. **The CI gate from plan 07-03** — the automated register check (hard-fail
   on `usted`/`ustedes`/a written subject `tú`, advisory-only on `su`/`sus`,
   `vosotros` explicitly excluded from the hard-fail list) built directly
   against the REGISTER section above.
2. **Human read-throughs (D-05/D-08)** — required before merge for
   `/manifesto`, `/privacy`, and `/terms`. These are the surfaces where a
   wrong nuance costs something: `/manifesto` is the register's own proof
   surface (244 lines of philosophical second-person prose — read it first
   once copy exists), and the two legal pages carry the English-governs
   notice (`07-UI-SPEC.md` § Legal pages authority notice) that a machine
   check cannot validate for meaning.

---

*This document is a peer of [`BRAND.md`](./BRAND.md),
[`TYPOGRAPHY.md`](./TYPOGRAPHY.md), and the rest of this directory — see
[`README.md`](./README.md) for the full index and the LOCKED/CURRENT/DEBT
convention.*
