# Translation Flags — Plan 07-08 (/mcp)

Per-plan register file (see `TRANSLATION-FLAGS.md`'s ownership contract —
this plan writes only here, never to the shared file). Every Spanish string
this plan wrote in the `mcp` namespace (`hero.*`, `toc.*`, `sections.*`,
`tools.read.*`, `tools.write.*`, `cta.*`, `copyButton.*`) was checked against
`SPANISH-VOICE.md`'s four wordplay triggers, not sampled. Zero rows fired.

`/mcp` is API reference documentation, not brand-voice marketing copy — the
English source itself is deliberately flat and factual (tool descriptions,
setup steps, permission and rate-limit tables), the register the rest of the
site's wordplay tends to live in (idiom, rhythm, a term with no clean
equivalent, a punchy phrase that outgrows its clamp). Reading back over every
string against the four triggers specifically:

1. **Pun / idiom / double meaning** — none found. The closest candidate,
   the CTA heading "Ready to connect?", is a literal question about the
   page's literal subject (connecting an agent to the API), not a play on
   words; "¿Listo para conectar?" carries the same literal question with no
   loss.
2. **Rhythm / sound** — the English prose here is expository, not
   percussive (contrast the home namespace's "Tuesdays peak." or "Versions
   plan identity."); nothing on this page leans on a beat or cadence that
   Spanish's extra syllables would flatten.
3. **No clean glossary equivalent** — every product noun this page uses
   (Habits, Goals, Cycle, Version, Archives, Identity, Mantras, Pulse,
   Dashboard, Debrief, Check-in) resolved directly through
   `src/messages/GLOSSARY.md`; none needed a marketing-only coinage (see
   `src/messages/glossary-additions/07-08.md`, empty for the same reason).
4. **Length budget forcing a weaker phrasing** — the one length problem
   this plan found (the read/write role badge overflowing under
   "escritura") was fixed by widening the badge's container, not by
   cutting the word down to a weaker Spanish alternative, so no phrasing
   was compromised to fit a clamp.

| Key | English | Spanish shipped | What was lost | Trigger |
|---|---|---|---|---|
