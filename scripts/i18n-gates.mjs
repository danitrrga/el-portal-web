#!/usr/bin/env node
// Three independent CI gates for Phase 7 (spanish-localization). Each gate
// walks its whole input and reports EVERY violation it finds (file + key
// path, or file + line) before the script exits non-zero — a gate that stops
// at the first failure makes a ~390-string catalogue take twenty CI runs to
// clean up.
//
// GATE 1 — REGISTER      hard-fails a written `usted`/`ustedes`/subject `tú`,
//                         or an exclamation mark, in any src/messages/es/*.json
//                         value. Warns (does not fail) on `su`/`sus` and on any
//                         Spanish anti-word from SPANISH-VOICE.md. `vosotros`
//                         is explicitly allowed — never in the hard-fail list.
// GATE 2 — PARITY        bidirectional key-identity + placeholder-parity check
//                         between src/messages/en/*.json and its es/ mirror.
//                         Translation status is INFERRED from the catalogue,
//                         never configured: es === {} -> namespace PENDING
//                         (silent if en is also {}, else a warning naming the
//                         untranslated key count); es has ANY key -> enforced
//                         fully, both directions.
// GATE 3 — LOCALE-AWARE LINK   fails a file under src/ that imports a local
//                         identifier from "next/link" and then opens that
//                         identifier's JSX tag with an href literal (plain
//                         string, or template literal whose static leading
//                         text) starting with "/" — an internal path rendered
//                         through a locale-unaware Link strands a Spanish
//                         visitor on the English tree (T-07-03-02).
//
// Usage:
//   node scripts/i18n-gates.mjs            # default form, used by CI
//   node scripts/i18n-gates.mjs --strict   # upgrades "not yet translated"
//                                           # warnings to failures; used only
//                                           # by the phase's final
//                                           # verification plan (07-16)
//
// Registered as `npm run i18n:gates` / `npm run i18n:gates:strict`. Never
// wired into `npm run build` — CI runs this as its own `quality`-job step so
// a failure is independently attributable.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const STRICT = process.argv.includes("--strict");

let hardFailures = 0;
let warnings = 0;

function fail(gate, location, message) {
  hardFailures++;
  console.error(`[FAIL][${gate}] ${location} — ${message}`);
}

function warn(gate, location, message) {
  warnings++;
  console.warn(`[WARN][${gate}] ${location} — ${message}`);
}

// ---------------------------------------------------------------------------
// GATE 1 — REGISTER
// ---------------------------------------------------------------------------

// Extends BRAND.md's English anti-words list — SPANISH-VOICE.md § SPANISH
// ANTI-WORDS. Multi-word phrases matched as case-insensitive substrings;
// single words matched as substrings too (a small false-positive rate here
// is fine — this check is advisory-only, never a hard fail).
const ANTI_WORDS = [
  "moderno",
  "elegante",
  "estilizado",
  "desatar",
  "elevar",
  "de última generación",
  "revolucionario",
  "que cambia las reglas del juego",
  "potente",
  "poderoso",
  "hermoso",
  "inmersivo",
  "fluido",
  "sin fricciones",
  "vanguardista",
  "potenciar",
  "desbloquear",
  "empoderar",
];

/**
 * Discriminator between the banned written subject pronoun and the required
 * possessive (SPANISH-VOICE.md § REGISTER, rule 1 vs rule 5): the subject
 * pronoun carries the accent (`tú empiezas` — banned) and the possessive does
 * not (`tu primera Versión` — required). Tokenizing on Unicode letters and
 * comparing the LOWERCASED token against the exact accented string `"tú"`
 * means `tu` (possessive) never matches this check — do not "fix" this into
 * a single case-insensitive `tu`/`tú` merge; that would hard-fail the
 * register's own required form.
 */
function checkRegisterValue(value, location, gate) {
  if (typeof value !== "string") return;

  if (value.includes("!") || value.includes("¡")) {
    fail(gate, location, `exclamation mark banned site-wide: "${value}"`);
  }

  const words = value.match(/\p{L}+/gu) || [];
  for (const raw of words) {
    const word = raw.toLowerCase();
    if (word === "usted" || word === "ustedes") {
      fail(gate, location, `formal register ("${raw}") is banned — tú only: "${value}"`);
    } else if (word === "tú") {
      // Accented standalone subject pronoun — banned even though Spanish is
      // pro-drop and the rest of the register never writes it.
      fail(gate, location, `written subject pronoun "tú" is banned (Spanish drops it): "${value}"`);
    } else if (word === "su" || word === "sus") {
      // Advisory only: also the legitimate third-person possessive ("sus
      // tendencias" — a Version's/Cycle's, not the reader's). Never fails.
      warn(gate, location, `"${raw}" is advisory-only (formal possessive vs. legitimate third-person possessive) — review: "${value}"`);
    }
    // "vosotros"/"vosotras" intentionally has no branch: explicitly ALLOWED
    // by SPANISH-VOICE.md rule 7. Do not add a fail/warn arm for it.
  }

  const lower = value.toLowerCase();
  for (const term of ANTI_WORDS) {
    if (lower.includes(term)) {
      warn(gate, location, `Spanish anti-word "${term}": "${value}"`);
    }
  }
}

function walkRegister(value, location, gate) {
  if (Array.isArray(value)) {
    value.forEach((item, i) => walkRegister(item, `${location}[${i}]`, gate));
  } else if (value !== null && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      walkRegister(v, location ? `${location}.${k}` : k, gate);
    }
  } else {
    checkRegisterValue(value, location, gate);
  }
}

function runGate1() {
  const gate = "GATE 1 REGISTER";
  const esDir = path.join(ROOT, "src/messages/es");
  if (!fs.existsSync(esDir)) return;
  for (const file of fs.readdirSync(esDir).filter((f) => f.endsWith(".json")).sort()) {
    const rel = `src/messages/es/${file}`;
    const data = JSON.parse(fs.readFileSync(path.join(esDir, file), "utf8"));
    for (const [k, v] of Object.entries(data)) {
      walkRegister(v, `${rel} :: ${k}`, gate);
    }
  }
}

// ---------------------------------------------------------------------------
// GATE 2 — CATALOGUE PARITY (bidirectional key identity + placeholder parity)
// ---------------------------------------------------------------------------

/**
 * Flatten a nested message object to dotted key paths. Arrays get a
 * container entry recording their own length (so a length mismatch is
 * reported directly, not just inferred from a missing/orphaned index) AND
 * their elements are recursed into individually.
 */
function flatten(obj, prefix, out) {
  if (Array.isArray(obj)) {
    out[prefix] = { kind: "array", length: obj.length };
    obj.forEach((item, i) => flatten(item, prefix ? `${prefix}.${i}` : String(i), out));
    return out;
  }
  if (obj !== null && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      flatten(v, prefix ? `${prefix}.${k}` : k, out);
    }
    return out;
  }
  out[prefix] = { kind: typeof obj, value: obj };
  return out;
}

// Extracts the leading identifier of every `{name}` / `{name, plural, ...}`
// opening token as a SET (order legitimately differs between languages).
// Deliberately does not descend into nested ICU `{# ...}` shorthand — those
// aren't named arguments.
function extractPlaceholders(str) {
  const set = new Set();
  const re = /\{\s*([A-Za-z0-9_]+)/g;
  let m;
  while ((m = re.exec(str))) set.add(m[1]);
  return set;
}

function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

function runGate2() {
  const gate = "GATE 2 PARITY";
  const enDir = path.join(ROOT, "src/messages/en");
  const esDir = path.join(ROOT, "src/messages/es");
  const namespaces = fs
    .readdirSync(enDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();

  for (const ns of namespaces) {
    const enPath = path.join(enDir, `${ns}.json`);
    const esPath = path.join(esDir, `${ns}.json`);
    if (!fs.existsSync(esPath)) {
      fail(gate, `src/messages/es/${ns}.json`, "namespace file missing entirely");
      continue;
    }

    const enData = JSON.parse(fs.readFileSync(enPath, "utf8"));
    const esData = JSON.parse(fs.readFileSync(esPath, "utf8"));

    const enIsEmpty = Object.keys(enData).length === 0;
    const esIsEmpty = Object.keys(esData).length === 0;

    if (enIsEmpty && esIsEmpty) continue; // namespace not started — silent

    if (!enIsEmpty && esIsEmpty) {
      const enFlat = flatten(enData, "", {});
      const leafCount = Object.values(enFlat).filter((e) => e.kind !== "array").length;
      const msg = `namespace not yet translated (${leafCount} en keys, 0 es keys)`;
      if (STRICT) {
        fail(gate, `${ns}`, `${msg} — --strict`);
      } else {
        warn(gate, `${ns}`, msg);
      }
      continue; // PENDING — neither key-identity direction evaluated
    }

    // es has SOME keys (enIsEmpty && !esIsEmpty is also possible and is a
    // real defect — an English key was deleted out from under a translated
    // namespace — so it is NOT special-cased here; it falls through to full
    // bidirectional enforcement below like any other non-empty pairing.)
    const enFlat = flatten(enData, "", {});
    const esFlat = flatten(esData, "", {});
    const enKeys = new Set(Object.keys(enFlat));
    const esKeys = new Set(Object.keys(esFlat));

    for (const key of enKeys) {
      if (!esKeys.has(key)) {
        fail(gate, `${ns} :: ${key}`, "key present in en, missing from es (en ⊇ es direction)");
      }
    }
    for (const key of esKeys) {
      if (!enKeys.has(key)) {
        fail(gate, `${ns} :: ${key}`, "key present in es, absent from en — orphaned Spanish key (es ⊇ en direction)");
      }
    }

    for (const key of enKeys) {
      if (!esKeys.has(key)) continue;
      const enEntry = enFlat[key];
      const esEntry = esFlat[key];

      if (enEntry.kind === "array" || esEntry.kind === "array") {
        if (enEntry.kind !== esEntry.kind) {
          fail(gate, `${ns} :: ${key}`, `type mismatch: en is ${enEntry.kind}, es is ${esEntry.kind}`);
        } else if (enEntry.length !== esEntry.length) {
          fail(gate, `${ns} :: ${key}`, `array-length mismatch: en has ${enEntry.length}, es has ${esEntry.length}`);
        }
        continue;
      }

      if (enEntry.kind !== esEntry.kind) {
        fail(gate, `${ns} :: ${key}`, `type mismatch: en is ${enEntry.kind}, es is ${esEntry.kind}`);
        continue;
      }

      if (enEntry.kind === "string") {
        const enPh = extractPlaceholders(enEntry.value);
        const esPh = extractPlaceholders(esEntry.value);
        if (!setsEqual(enPh, esPh)) {
          fail(
            gate,
            `${ns} :: ${key}`,
            `ICU placeholder set mismatch: en {${[...enPh].join(", ")}} vs es {${[...esPh].join(", ")}}`,
          );
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// GATE 3 — LOCALE-AWARE LINK
// ---------------------------------------------------------------------------

function listFiles(dir, exts, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listFiles(full, exts, acc);
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      acc.push(full);
    }
  }
  return acc;
}

// Finds the end of a JSX opening tag starting at `start` (the `<` of
// `<Identifier`), tracking brace depth and quote state so a `>` inside a
// `{...}` expression or a string attribute doesn't end the tag early.
function findTagEnd(text, start) {
  let depth = 0;
  let quote = null;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (c === quote && text[i - 1] !== "\\") quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      quote = c;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (c === ">" && depth <= 0) return i;
  }
  return -1;
}

// Given the text of one JSX opening tag, extracts the `href` value and
// classifies it. Returns `{ internal: boolean, raw: string } | null`.
function classifyHref(tagText) {
  const m = tagText.match(/\bhref\s*=\s*("([^"]*)"|'([^']*)'|\{([\s\S]*?)\})/);
  if (!m) return null;

  if (m[2] !== undefined) return { internal: m[2].startsWith("/"), raw: m[2] };
  if (m[3] !== undefined) return { internal: m[3].startsWith("/"), raw: m[3] };

  // `{...}` expression. Only a template literal whose static leading text
  // starts with "/" is treated as internal — a bare identifier/property
  // access (`link.href`) or a template that opens on an interpolation
  // (`` `${APP_URL}/login` ``) cannot be statically classified as internal
  // and is not flagged, per the plan's literal-value scope.
  const expr = m[4].trim();
  if (expr.startsWith("`")) {
    const body = expr.slice(1);
    return { internal: body.startsWith("/"), raw: expr };
  }
  return { internal: false, raw: expr };
}

function runGate3() {
  const gate = "GATE 3 LINK";
  const srcDir = path.join(ROOT, "src");
  const files = listFiles(srcDir, [".tsx", ".jsx"], []);

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const importMatch = text.match(
      /import\s+([A-Za-z_$][\w$]*)\s+from\s+["']next\/link["']/,
    );
    if (!importMatch) continue;

    const identifier = importMatch[1];
    const rel = path.relative(ROOT, file);
    const tagRe = new RegExp(`<${identifier}(?=[\\s/>])`, "g");
    let tm;
    while ((tm = tagRe.exec(text))) {
      const tagEnd = findTagEnd(text, tm.index);
      if (tagEnd === -1) continue;
      const tagText = text.slice(tm.index, tagEnd);
      const href = classifyHref(tagText);
      if (href && href.internal) {
        const line = text.slice(0, tm.index).split("\n").length;
        fail(gate, `${rel}:${line}`, `<${identifier}> from "next/link" carries internal href ${JSON.stringify(href.raw)} — use the locale-aware Link from "@/i18n/navigation"`);
      }
    }
  }
}

// ---------------------------------------------------------------------------

runGate1();
runGate2();
runGate3();

console.log(
  `\ni18n-gates: ${hardFailures} failure(s), ${warnings} warning(s)${STRICT ? " (--strict)" : ""}.`,
);
process.exit(hardFailures > 0 ? 1 : 0);
