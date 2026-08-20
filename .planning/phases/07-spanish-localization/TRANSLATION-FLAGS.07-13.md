# Translation Flags — Plan 07-13 (/features)

Per-plan register for `src/messages/es/features.json`, checked against all
four `SPANISH-VOICE.md` § WORDPLAY ESCALATION triggers for every one of the
115 strings this plan wrote. This file is the ONLY file plan 07-13 writes
into for the wordplay register — `TRANSLATION-FLAGS.md` itself is untouched
and is aggregated by plan 07-16.

| Key | English | Spanish shipped | What was lost | Trigger |
|---|---|---|---|---|
| scales[2].role | The reps, the only scale you actually live in. | Las repeticiones, la única escala en la que vives de verdad. | "Reps" is one punchy gym-slang syllable that mirrors the Day mechanic's own terse, atomic feel — the shortest word describing the shortest scale. "Repeticiones" is a four-syllable formal noun; the sound-match between the word's own brevity and the concept it names (a Day is the small, repeated unit) doesn't survive. | 2 (rhythm/sound) |
| trendsInsights.detectors[0].name | Burnout | Agotamiento | "Burnout" is a specific, widely-recognized clinical/pop-psychology label (a named syndrome, not just tiredness) — Spanish speakers commonly keep it as the loanword ("síndrome de burnout") precisely because "agotamiento" reads as generic exhaustion rather than the named pattern the detector is diagnosing. GLOSSARY.md has no row for it (the app itself never surfaces this detector name), so there was no established resolution to defer to. | 3 (no glossary-resolved equivalent) |
| trendsInsights.detectors[3].name | Sleep Lag | Desfase del Sueño | "X Lag" is a compact two-word branding pattern that borrows its recognizability from "jet lag" — English readers pattern-match it instantly. "Desfase del Sueño" is grammatically correct and clear but three words, more clinical in register, and carries none of the "jet lag" familiarity that made the English name land as an easy, memorable label. | 2 (rhythm/sound) + 3 (no compact Spanish equivalent) |

**Rows: 3.**
