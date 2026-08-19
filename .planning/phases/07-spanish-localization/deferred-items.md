# Deferred Items — Phase 07 spanish-localization

Out-of-scope discoveries logged during plan execution but not fixed (per executor
scope-boundary rules). Not blockers for the plans that found them.

## From 07-01

- **`npm run lint` project-wide fails on pre-existing, out-of-scope errors
  unrelated to this plan's files.** All 26 errors and 9 of the 11 warnings
  originate in `.agents/skills/**` — a directory listed in `.gitignore`
  (`.agents/`) that ESLint's `globalIgnores` does not exclude (only `.claude/**`
  is ignored there). These are vendored skill example/reference files, not
  application code, and predate this plan (confirmed: `.agents/` is untracked
  by git). The remaining 2 warnings (`FG_MUTED` unused in
  `src/app/changelog/page.tsx`, `ACCENT_LIGHT` unused in
  `src/app/manifesto/page.tsx`) are pre-existing and in files this plan does
  not touch (07-01 only creates `src/i18n/*`, `src/proxy.ts`, `src/lib/seo.ts`,
  namespace JSON stubs, and edits `next.config.ts`).
  Verified in scope: `npx eslint src/i18n src/lib/seo.ts src/proxy.ts
  next.config.ts` returns zero errors/warnings.
  Fix (out of scope for this plan): add `.agents/**` to the ESLint
  `globalIgnores` list alongside `.claude/**` in `eslint.config.mjs`.
