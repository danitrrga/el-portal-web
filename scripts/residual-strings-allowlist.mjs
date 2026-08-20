// Committed, COMMENTED allowlist of deliberate literals for
// `scripts/audit-residual-strings.mjs`. Every entry carries a `reason` —
// an allowlist entry with no reason is indistinguishable from a missed
// extraction, so the script itself refuses to load an entry that lacks one.
//
// `file` is matched against the POSIX-style path relative to the repo root
// (e.g. "src/components/DashboardPreview.tsx"). `match` is matched as a
// case-sensitive substring against the reported literal text — not a regex,
// so a literal containing regex metacharacters still allowlists correctly.
// Leave `match` undefined to allowlist an entire file (used for dead code).
//
// Registered as the single source of truth for exclusions — never duplicate
// an exclusion inline inside the scanner script itself.

/** @type {{ file: string, match?: string, reason: string }[]} */
export const ALLOWLIST = [
  // ---------------------------------------------------------------------
  // Dead code — excluded because nothing renders it, NOT because its
  // strings were handled. Confirmed zero imports anywhere under src/
  // (`grep -rn DashboardPreview src` finds only its own declaration).
  // Deleting this file is a housekeeping item for a later phase; it also
  // carries banned `animate-pulse` and `rgba(30,64,175,...)` patterns
  // (CLAUDE.md anti-patterns) that a future cleanup pass should remove
  // alongside it.
  // ---------------------------------------------------------------------
  {
    file: "src/components/DashboardPreview.tsx",
    reason:
      "dead code, zero imports — excluded because nothing renders it, not because its strings were handled",
  },

  // ---------------------------------------------------------------------
  // ISO language codes — D-10 (text-toggle switcher, no flags). Spanish
  // for "EN" is still "EN"; translating these would just reproduce the
  // same two letters, so the literal is correct as written, in every
  // locale, by design.
  // ---------------------------------------------------------------------
  {
    file: "src/components/LanguageSwitcher.tsx",
    match: "EN",
    reason: "ISO language code, identical in both locales by design (D-10)",
  },
  {
    file: "src/components/LanguageSwitcher.tsx",
    match: "ES",
    reason: "ISO language code, identical in both locales by design (D-10)",
  },

  // ---------------------------------------------------------------------
  // /mcp — API reference documentation. Tool identifiers and params
  // type-signature strings are code, not prose (07-PATTERNS.md).
  // ---------------------------------------------------------------------
  {
    file: "src/app/[locale]/mcp/page.tsx",
    match: "portal_",
    reason: "MCP tool identifier — API name, not prose",
  },
  {
    file: "src/app/[locale]/mcp/page.tsx",
    match: "params",
    reason: "type-signature string in a code sample — code, not prose",
  },
  {
    file: "src/app/[locale]/mcp/page.tsx",
    match: "returns:",
    reason:
      "the Tool interface's `returns` field is a wire-format/API-response-shape description that doubles as documentation of the literal contract the API exposes — the file's own top-of-data-block comment states this is deliberately kept in English in both locales for the same reason `params` is (translating it would describe a contract the API does not actually expose)",
  },

  // ---------------------------------------------------------------------
  // Provider proper nouns, version numbers, ISO dates, tag keys, class
  // names, token names. None of these are translatable prose.
  // ---------------------------------------------------------------------
  {
    file: "src/app/[locale]/mcp/page.tsx",
    match: "Claude",
    reason: "provider proper noun — not translated in any locale",
  },
  {
    file: "src/app/[locale]/mcp/page.tsx",
    match: "Cursor",
    reason: "provider proper noun — not translated in any locale",
  },
  {
    file: "src/app/[locale]/mcp/page.tsx",
    match: "MCP",
    reason: "protocol/provider proper noun (Model Context Protocol) — not translated",
  },

  // ---------------------------------------------------------------------
  // Additional dead-code components found by this plan's residual-string
  // sweep (07-16) — the same "excluded because nothing renders it, NOT
  // because its strings were handled" policy the plan's own text already
  // applies to DashboardPreview.tsx, extended to every other zero-import
  // component the sweep surfaced. Confirmed by `grep -rn "<Name>" src/`
  // returning only each file's own declaration. Housekeeping items for a
  // later phase — see 07-16-SUMMARY.md.
  // ---------------------------------------------------------------------
  {
    file: "src/components/animations/PerformanceMetric.tsx",
    reason:
      "dead code, zero imports — excluded because nothing renders it, not because its strings were handled",
  },
  {
    file: "src/components/MethodologyCard.tsx",
    reason:
      "dead code, zero imports — excluded because nothing renders it, not because its strings were handled",
  },
  {
    file: "src/components/remotion/AsymptoticCurve.tsx",
    reason:
      "dead code, zero imports (no remotion.config.ts/Root.tsx entry point references it either) — excluded because nothing renders it, not because its strings were handled",
  },
  {
    file: "src/components/remotion/CyclicalRings.tsx",
    reason:
      "dead code, zero imports (no remotion.config.ts/Root.tsx entry point references it either) — excluded because nothing renders it, not because its strings were handled",
  },

  // ---------------------------------------------------------------------
  // Brand wordmark lockup (commit a4b388e, human-owned — not touched by
  // this plan). "EL" / "RTAL" split the letters of the PORTAL wordmark
  // around the inlined PortalIcon standing in for the "O"; Footer.tsx's
  // ghost/fill layered spans render the same "El Portal" brand name as
  // decorative aria-hidden content. A brand name/lockup is never
  // translated, in any locale.
  // ---------------------------------------------------------------------
  {
    file: "src/components/ElPortalWordmark.tsx",
    match: "EL",
    reason: "wordmark lockup letters (brand name), never translated",
  },
  {
    file: "src/components/ElPortalWordmark.tsx",
    match: "RTAL",
    reason: "wordmark lockup letters (brand name), never translated",
  },
  {
    file: "src/components/Footer.tsx",
    match: "El Portal",
    reason:
      "decorative aria-hidden ghost/fill brand wordmark in the footer bottom bar — brand name, never translated",
  },

  // ---------------------------------------------------------------------
  // Legal contact email address — a proper noun/address, identical in
  // both locales by nature (an email address is not prose to translate).
  // ---------------------------------------------------------------------
  {
    file: "src/app/[locale]/privacy/page.tsx",
    match: "dtarraga.emp@gmail.com",
    reason: "contact email address — identical in both locales, not translatable prose",
  },
  {
    file: "src/app/[locale]/terms/page.tsx",
    match: "dtarraga.emp@gmail.com",
    reason: "contact email address — identical in both locales, not translatable prose",
  },

  // ---------------------------------------------------------------------
  // Build-time developer error, never rendered to a site visitor. Thrown
  // during `next build`/`next start` startup when NEXT_PUBLIC_SITE_URL is
  // missing — a deploy-config problem for the maintainer, not user-facing
  // copy that needs a Spanish translation.
  // ---------------------------------------------------------------------
  {
    file: "src/lib/seo.ts",
    match: "E_MISSING_SITE_ORIGIN",
    reason:
      "build-time developer error (missing env var), never rendered to a site visitor — not user-facing copy",
  },

  // ---------------------------------------------------------------------
  // Changelog entry data — version tags, ISO dates and semver-style
  // identifiers stored alongside translated prose in the same catalogue
  // entries. These are not string literals in component source (they live
  // in src/messages/*/changelog.json, outside this script's src/**/*.tsx
  // scan surface) — kept here only as a documented non-match for a future
  // reader who greps this file wondering why changelog tags aren't listed.
  // ---------------------------------------------------------------------
];

/**
 * Validates the allowlist shape at load time so a future edit that drops a
 * `reason` fails loudly instead of silently becoming an unexplained
 * exclusion.
 */
export function assertAllowlistValid() {
  for (const [i, entry] of ALLOWLIST.entries()) {
    if (!entry.file || typeof entry.file !== "string") {
      throw new Error(`residual-strings-allowlist.mjs entry ${i} has no file`);
    }
    if (!entry.reason || typeof entry.reason !== "string" || entry.reason.trim() === "") {
      throw new Error(
        `residual-strings-allowlist.mjs entry ${i} (${entry.file}) has no reason — every allowlist entry must carry one`,
      );
    }
  }
}
