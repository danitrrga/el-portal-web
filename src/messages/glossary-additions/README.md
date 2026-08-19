# Glossary Additions — per-plan marketing-only term coinages

A translation plan that needs a Spanish term for a marketing concept the El
Portal app has no string for (D-02b, `.planning/phases/07-spanish-localization/07-CONTEXT.md`)
writes its own file here: `src/messages/glossary-additions/07-NN.md` — one
file per plan, named for the plan that coined the term.

Each file is a table with exactly these columns:

```
| English | Spanish | Why the app has no string | Plan |
|---|---|---|---|
```

**Plan 07-16 merges every file in this directory into
[`src/messages/GLOSSARY.md`](../GLOSSARY.md)'s `## Marketing-only (decided
here)` section** once the last translation wave has landed.

**Any plan may READ every file in this directory** to see what a sibling plan
has already coined, avoiding a duplicate or conflicting term. **No plan may
write to another plan's file, and no plan may edit `GLOSSARY.md`'s
`Marketing-only` section directly during Waves 2-4** — only 07-16's merge
touches that section. This convention exists so parallel plans in the same
wave never collide on a shared file: one file each.
