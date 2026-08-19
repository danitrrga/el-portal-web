# Translation Flags — Lost-in-Translation Register

This is the one file the design owner reads to find every English line whose
effect did not survive into Spanish, so those lines can be re-written by hand
rather than shipped flat. A row here is a **request for a human rewrite**, not
a bug report — the Spanish already shipped is correct, complete copy; the row
just says it could be better. **An empty register at the end of the phase
means the escalation rule (`SPANISH-VOICE.md` § WORDPLAY ESCALATION) was never
applied — not that nothing was lost.**

## Ownership contract — read this before writing anything

**THIS FILE IS NOT A SHARED WRITE TARGET.** Waves 2-4 run nine copy-writing
plans, several of them in parallel, and a single shared markdown table under
parallel execution is a git conflict at best and a silently dropped append at
worst — "append-only" constrains what a plan may do to a row, not what a
merge does to a file. So:

- Each of the nine copy-writing plans — **07-04, 07-05, 07-06, 07-07, 07-08,
  07-09, 07-10, 07-13, 07-14** — writes its own
  `.planning/phases/07-spanish-localization/TRANSLATION-FLAGS.07-NN.md`,
  created from the header template below, even when it has zero rows.
- **Plan 07-16 aggregates** every per-plan file into the Aggregated-rows
  table (heading below) of *this* file after the last translation wave
  lands, and reconciles the row totals against each plan summary's
  `TRANSLATION FLAGS: n` line.
- **No plan other than 07-16 writes to this file (`TRANSLATION-FLAGS.md`).**
  An executor reading only this file should not be able to get that wrong.

### Per-plan file template

Each of the nine plans creates its own file with this exact header row
(copy it byte-for-byte so 07-16's aggregation can match on it):

```
| Key | English | Spanish shipped | What was lost | Trigger |
|---|---|---|---|---|
```

| Column | Meaning |
|---|---|
| **Key** | namespace-qualified catalogue key, e.g. `home.hero.headline` |
| **English** | the source string verbatim |
| **Spanish shipped** | what is actually in `es/*.json` right now — never blank, never a placeholder; the site must read correctly with no rewrite |
| **What was lost** | one sentence, concrete: the pun, the rhythm, the double meaning, the term of art. "Sounds worse" is not an entry |
| **Trigger** | which of `SPANISH-VOICE.md`'s four wordplay triggers fired |

## Aggregated rows

Filled only by plan 07-16, after the last translation wave lands. Empty until
then.

| Key | English | Spanish shipped | What was lost | Trigger |
|---|---|---|---|---|

## Rewritten

The design owner moves rows here once a line has been hand-rewritten, so the
working queue in the Aggregated-rows table above stays short and the history
is not lost.
Empty until the design owner acts on a row.

## Example (never counted, never deleted)

This section is **excluded from 07-16's reconciliation** — the aggregated row
count is checked against nine plan summaries that may legitimately all report
`TRANSLATION FLAGS: 0`, and an example row sitting in the counted table would
make a correct zero total look like a miscount. It lives under its own
heading for exactly that reason, and it is **never deleted** — a real row
arriving does not retire it.

| Key | English | Spanish shipped | What was lost | Trigger |
|---|---|---|---|---|
| manifesto.hook | A method for becoming yourself | Un método para llegar a ser quien eres | The English compresses "a method" and "becoming yourself" into one clean noun phrase with no verb; the Spanish needs an explicit infinitive clause ("para llegar a ser quien eres") to read naturally under the tú register, which is longer and slightly less aphoristic than the English original — the meaning survives, the compression does not. | 2 (rhythm) |
