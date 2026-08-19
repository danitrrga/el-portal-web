#!/usr/bin/env node
// Derives the marketing site's Spanish product glossary MECHANICALLY from the
// El Portal app's own shipped message catalogues. Never authored by hand.
//
// D-01/D-02 (07-CONTEXT.md): the app already ships next-intl with a
// production `es.json`; the marketing site must use the exact terms the
// product already shows users, not an invented parallel vocabulary.
//
// This script is HAND-INVOKED ONLY. It must never be wired into
// `npm run build`, a pre-commit hook, or CI (D-02: this repo does not gain a
// build-time dependency on the app repo). It reads exactly two JSON files
// from the sibling repo and copies only English/Spanish string pairs — it
// does not walk the app's source tree and does not read its `.env`.
//
// Usage:
//   node scripts/extract-glossary.mjs                # writes the derived table to stdout
//   EL_PORTAL_APP_PATH=/other/path node scripts/extract-glossary.mjs
//
// Re-run whenever the app's catalogues change to refresh
// `src/messages/GLOSSARY.md`'s "## Derived from the app" section.

import fs from "node:fs";
import path from "node:path";

const APP_ROOT =
  process.env.EL_PORTAL_APP_PATH || "/home/danitrrga/dev/Projects/el-portal";
const MESSAGES_DIR = path.join(APP_ROOT, "src/messages");
const EN_PATH = path.join(MESSAGES_DIR, "en.json");
const ES_PATH = path.join(MESSAGES_DIR, "es.json");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

// Flatten a nested message object to dotted key paths, e.g.
// { nav: { goals: "Goals" } } -> { "nav.goals": "Goals" }
function flatten(obj, prefix = "") {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key));
    } else {
      out[key] = v;
    }
  }
  return out;
}

// A "short noun-phrase candidate": one to three words, no ICU placeholders,
// no sentence-ending punctuation, starting with a capital letter (or one of
// the KNOWN_PRODUCT_TERMS below, for the rare lowercase edge case).
const KNOWN_PRODUCT_TERMS = [];

function isCandidate(value) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.includes("{")) return false; // ICU placeholder
  if (/[.!?]$/.test(trimmed)) return false; // sentence-ending punctuation
  const words = trimmed.split(/\s+/);
  if (words.length < 1 || words.length > 3) return false;
  const startsCapital = /^[A-ZÁÉÍÓÚÑÜ]/.test(trimmed);
  const isKnownTerm = KNOWN_PRODUCT_TERMS.includes(trimmed);
  if (!startsCapital && !isKnownTerm) return false;
  return true;
}

function extract(en, es) {
  const flatEn = flatten(en);
  const flatEs = flatten(es);

  const candidates = [];
  for (const [key, enValue] of Object.entries(flatEn)) {
    if (!(key in flatEs)) continue; // only keys present in BOTH catalogues
    if (!isCandidate(enValue)) continue;
    candidates.push({ key, en: enValue, es: flatEs[key] });
  }

  // Group by English value — the glossary is one row per English term, not
  // one row per key. Several keys can share the same English noun.
  const byEnglish = new Map();
  for (const c of candidates) {
    if (!byEnglish.has(c.en)) byEnglish.set(c.en, []);
    byEnglish.get(c.en).push(c);
  }

  const rows = [];
  for (const [enValue, occurrences] of byEnglish) {
    const distinctSpanish = [...new Set(occurrences.map((o) => o.es))];

    let resolved;
    let sourceKey;
    let ambiguous = false;

    if (distinctSpanish.length === 1) {
      resolved = distinctSpanish[0];
      sourceKey = occurrences[0].key;
    } else {
      // Disagreement across occurrences of the same English term (the app
      // itself is not internally consistent for every term — e.g. "Goals"
      // reads "Objetivos" in nav.goals but "Metas" elsewhere; "Trends" reads
      // "Trends" in nav.trends but "Tendencias" in trends.title).
      //
      // Resolution: prefer the `nav.*` namespace, since that is the app's
      // primary, first-encountered, most user-visible label for a room or
      // concept — exactly the instance a marketing reader would meet first
      // if they opened the app. Falls back to the most frequent value
      // (ties broken alphabetically) when no nav.* occurrence exists.
      ambiguous = true;
      const navOccurrence = occurrences.find((o) => o.key.startsWith("nav."));
      if (navOccurrence) {
        resolved = navOccurrence.es;
        sourceKey = navOccurrence.key;
      } else {
        const counts = new Map();
        for (const o of occurrences) {
          counts.set(o.es, (counts.get(o.es) || 0) + 1);
        }
        const ranked = [...counts.entries()].sort((a, b) => {
          if (b[1] !== a[1]) return b[1] - a[1];
          return a[0].localeCompare(b[0]);
        });
        resolved = ranked[0][0];
        sourceKey = occurrences.find((o) => o.es === resolved).key;
      }
    }

    rows.push({
      en: enValue,
      es: resolved,
      key: sourceKey,
      keptEnglish: enValue === resolved,
      ambiguous,
      allOccurrenceKeys: occurrences.map((o) => o.key),
    });
  }

  // Sort: translated pairs first (alphabetical by English value), then
  // kept-English pairs (alphabetical) — the split IS the finding
  // (07-CONTEXT.md D-01: it is not guessable which group a term falls in).
  rows.sort((a, b) => {
    if (a.keptEnglish !== b.keptEnglish) return a.keptEnglish ? 1 : -1;
    return a.en.localeCompare(b.en);
  });

  return rows;
}

function main() {
  let en, es;
  try {
    en = readJson(EN_PATH);
    es = readJson(ES_PATH);
  } catch (err) {
    console.error(
      `Could not read app catalogues from ${MESSAGES_DIR}: ${err.message}`,
    );
    process.exit(1);
  }

  const rows = extract(en, es);

  // Emit as a markdown table fragment on stdout — GLOSSARY.md's derived
  // section is this output, framed with provenance/header text by hand.
  console.log("| English | Spanish | Source key | Status |");
  console.log("|---|---|---|---|");
  for (const row of rows) {
    const status = row.keptEnglish
      ? "kept English"
      : row.ambiguous
        ? "translated (resolved: nav-priority)"
        : "translated";
    console.log(`| ${row.en} | ${row.es} | \`${row.key}\` | ${status} |`);
  }

  console.error(
    `\n${rows.length} distinct English terms extracted (${rows.filter((r) => r.keptEnglish).length} kept English, ${rows.filter((r) => !r.keptEnglish).length} translated).`,
  );
}

main();
