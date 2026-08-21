#!/usr/bin/env node
// Rerunnable residual-string gate (I18N-01, phase 07 success criterion 8).
//
// An earlier draft of this check was a one-time human grep. That proves
// nothing about the day after this phase closes — the next feature branch
// can add a hardcoded `aria-label` literal and nothing would notice. This
// script is the replacement: it walks every `.ts`/`.tsx` file under `src/`
// and reports every user-facing string literal that never reached the
// message catalogue, across five categories a JSX-text-only grep is blind
// to:
//
//   1. JSX text nodes between tags
//   2. aria-label / alt / title / placeholder attribute literals
//   3. default parameter values in destructured component props
//   4. string literals inside top-level const object/array literals
//      (module-level data) and files under src/data/
//   5. error / status strings surfaced to a user (throw new Error(...),
//      setError("..."), setStatus("..."), setMessage("..."))
//
// Usage: `npm run audit:strings`. Exits non-zero listing `file:line —
// literal` for every unallowlisted hit; prints RESIDUAL_STRINGS_CLEAN and
// exits 0 when there are none.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ALLOWLIST, assertAllowlistValid } from "./residual-strings-allowlist.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src");

assertAllowlistValid();

/** @typedef {{ file: string, line: number, category: string, literal: string }} Hit */

/** Recursively collect every .ts/.tsx file under `dir`. */
function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, acc);
    } else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) {
      acc.push(full);
    }
  }
  return acc;
}

/**
 * Replace every `//...` and `/*...*​/` comment body with spaces (preserving
 * line breaks and total length) so line numbers stay accurate and comment
 * prose never trips a category below.
 */
function stripComments(text) {
  let out = "";
  let i = 0;
  const n = text.length;
  while (i < n) {
    const two = text.slice(i, i + 2);
    if (two === "//") {
      let j = i;
      while (j < n && text[j] !== "\n") j++;
      out += " ".repeat(j - i);
      i = j;
    } else if (two === "/*") {
      let j = i + 2;
      while (j < n - 1 && text.slice(j, j + 2) !== "*/") j++;
      j = Math.min(j + 2, n);
      out += text
        .slice(i, j)
        .split("\n")
        .map((line) => " ".repeat(line.length))
        .join("\n");
      i = j;
    } else {
      out += text[i];
      i++;
    }
  }
  return out;
}

function lineOf(text, index) {
  let line = 1;
  for (let i = 0; i < index; i++) {
    if (text[i] === "\n") line++;
  }
  return line;
}

function hasLetters(str) {
  return /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(str);
}

/** Values that look like code/tokens/paths rather than prose. Not hardcoded
 * per-file — applied everywhere, since a URL or a Tailwind class is never
 * user-facing prose regardless of which file it appears in. */
function looksLikeNonProse(value) {
  const v = value.trim();
  if (v === "") return true;
  if (/^https?:\/\//.test(v)) return true; // URL
  if (/^\//.test(v) && !/\s/.test(v)) return true; // path, no spaces
  if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return true; // hex color
  if (/^rgba?\(/.test(v)) return true; // rgb()/rgba() color function
  if (/^\d+(\.\d+)?(px|rem|em|vh|vw|%|s|ms)?$/.test(v)) return true; // bare number/unit
  if (/^\$[\d,.]+$/.test(v)) return true; // bare currency amount ("$0", "$10")
  // A single CSS/animation-config-style token: lowercase, no spaces,
  // optionally followed by a parenthesised argument list (e.g. "spring",
  // "blur(4px)", "vertical", "positive") — cva variant keys and Framer
  // Motion transition config values, never translatable prose.
  if (/^[a-z][a-z0-9-]*(\([^)]*\))?$/.test(v) && v.length < 30) return true;
  // A single space-free token containing a hyphen, bracket, colon or slash
  // is a Tailwind class list / arbitrary-value class / CSS custom-property
  // reference (e.g. "text-[var(--color-ep-fg-strong)]"), never prose —
  // real prose is never one unbroken token.
  if (!v.includes(" ") && /[-[\]:/]/.test(v)) return true;
  // A single camelCase token with no spaces ("gettingStarted",
  // "mcpIntegration") is a catalogue-key / object-key identifier used to
  // look up the real (translated) copy via `t(...)`, not the copy itself.
  if (!v.includes(" ") && /^[a-z][a-zA-Z0-9]*$/.test(v) && /[A-Z]/.test(v)) return true;
  return false;
}

/**
 * JSX-text-specific guard: a `>...<` slice that contains raw JS/TS syntax
 * leaking from an interface/type declaration, a generic (`Foo<Bar>`), an
 * arrow function, or an inline expression the outer bracket-matching regex
 * couldn't tell apart from real rendered text. Real rendered prose never
 * contains these tokens.
 */
function looksLikeLeakedCode(trimmed) {
  return /[;&]|=>|===|!==|&&|\|\|/.test(trimmed);
}

/** @type {Hit[]} */
const hits = [];

function record(file, index, textFull, category, literal, checkValue) {
  const toCheck = checkValue ?? literal;
  if (!hasLetters(toCheck)) return;
  if (looksLikeNonProse(toCheck)) return;
  hits.push({
    file,
    line: lineOf(textFull, index),
    category,
    literal: literal.trim().slice(0, 120),
  });
}

// ---------------------------------------------------------------------------
// Category 1 — JSX text nodes between tags, outside {...} expressions.
// ---------------------------------------------------------------------------
function scanJsxText(file, text) {
  const re = />([^<>{}]+)</g;
  let m;
  while ((m = re.exec(text))) {
    const literal = m[1];
    const trimmed = literal.trim();
    if (trimmed.length < 2) continue;
    if (!hasLetters(trimmed)) continue;
    if (looksLikeLeakedCode(trimmed)) continue;
    record(file, m.index + 1, text, "jsx-text", trimmed);
  }
}

// ---------------------------------------------------------------------------
// Category 2 — aria-label / alt / title / placeholder literal values,
// including template literals.
// ---------------------------------------------------------------------------
function scanAccessibilityAttrs(file, text) {
  const re =
    /\b(aria-label|alt|title|placeholder)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*`([^`]*)`\s*\})/g;
  let m;
  while ((m = re.exec(text))) {
    const literal = m[2] ?? m[3] ?? m[4] ?? "";
    // Strip ${...} interpolations from a template literal before judging —
    // only the static prose fragments matter here.
    const staticText = literal.replace(/\$\{[^}]*\}/g, " ").trim();
    if (!staticText) continue;
    record(file, m.index, text, "a11y-attr", `${m[1]}="${staticText}"`);
  }
}

// ---------------------------------------------------------------------------
// Category 3 — default parameter values in destructured props:
// `{ label = "Copy" }`. The `key = "literal"` shape inside braces is valid
// JS ONLY for a destructuring default, never for a plain object literal
// (which uses `:`), so this is a precise discriminator.
// ---------------------------------------------------------------------------
function scanDefaultParams(file, text) {
  const re = /[{,]\s*([A-Za-z_$][\w$]*)\s*=\s*"([^"]{1,80})"\s*[,}]/g;
  let m;
  while ((m = re.exec(text))) {
    record(file, m.index, text, "default-param", `${m[1]} = "${m[2]}"`, m[2]);
  }
  const re2 = /[{,]\s*([A-Za-z_$][\w$]*)\s*=\s*'([^']{1,80})'\s*[,}]/g;
  while ((m = re2.exec(text))) {
    record(file, m.index, text, "default-param", `${m[1]} = '${m[2]}'`, m[2]);
  }
}

// ---------------------------------------------------------------------------
// Category 4 — string literals inside top-level const object/array
// literals (module-level data) and any file under src/data/.
// ---------------------------------------------------------------------------
function extractTopLevelConstBlocks(text) {
  const blocks = [];
  const declRe = /\bconst\s+[A-Za-z_$][\w$]*(?:\s*:\s*[^=]+)?\s*=\s*[{[]/g;
  let m;
  while ((m = declRe.exec(text))) {
    // Only true top-level (module-scope) declarations: the character
    // immediately preceding "const" on its own line, ignoring
    // indentation, must be a newline — i.e. not nested inside a function
    // body at deeper indentation. We approximate "top-level" by requiring
    // zero leading whitespace before `const` on its line.
    const lineStart = text.lastIndexOf("\n", m.index) + 1;
    const indent = text.slice(lineStart, m.index);
    if (indent.trim() !== "") continue; // indented => not top-level

    const openIdx = text.lastIndexOf(m[0][m[0].length - 1] === "{" ? "{" : "[", m.index + m[0].length);
    const openChar = m[0][m[0].length - 1];
    const closeChar = openChar === "{" ? "}" : "]";
    let depth = 1;
    let i = openIdx + 1;
    while (i < text.length && depth > 0) {
      if (text[i] === openChar) depth++;
      else if (text[i] === closeChar) depth--;
      i++;
    }
    blocks.push({ start: openIdx, end: i });
  }
  return blocks;
}

function scanModuleConstData(file, text, isDataDir) {
  const blocks = isDataDir
    ? [{ start: 0, end: text.length }]
    : extractTopLevelConstBlocks(text);

  for (const block of blocks) {
    const chunk = text.slice(block.start, block.end);
    // Requires a `key: "value"` shape (colon present) — reduces false
    // positives on bare-string array entries that aren't prose.
    const re = /([A-Za-z_$][\w$]*)\s*:\s*"([^"]{2,200})"/g;
    let m;
    while ((m = re.exec(chunk))) {
      const key = m[1];
      const value = m[2];
      record(file, block.start + m.index, text, "module-data", `${key}: "${value}"`, value);
    }
  }
}

// ---------------------------------------------------------------------------
// Category 5 — error / status strings surfaced to a user.
// ---------------------------------------------------------------------------
function scanErrorStrings(file, text) {
  const throwRe = /throw\s+new\s+Error\(\s*"([^"]+)"\s*\)/g;
  let m;
  while ((m = throwRe.exec(text))) {
    record(file, m.index, text, "error-status", `throw new Error("${m[1]}")`);
  }
  const throwRe2 = /throw\s+new\s+Error\(\s*'([^']+)'\s*\)/g;
  while ((m = throwRe2.exec(text))) {
    record(file, m.index, text, "error-status", `throw new Error('${m[1]}')`);
  }
  const setterRe = /\b(setError|setStatus|setMessage)\(\s*"([^"]+)"\s*\)/g;
  while ((m = setterRe.exec(text))) {
    record(file, m.index, text, "error-status", `${m[1]}("${m[2]}")`);
  }
}

// ---------------------------------------------------------------------------

const files = walk(SRC);
for (const file of files) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  const raw = fs.readFileSync(file, "utf8");
  const text = stripComments(raw);
  const isTsx = file.endsWith(".tsx");
  const isDataDir = rel.startsWith("src/data/");

  if (isTsx) {
    scanJsxText(rel, text);
    scanAccessibilityAttrs(rel, text);
    scanDefaultParams(rel, text);
  }
  scanModuleConstData(rel, text, isDataDir);
  scanErrorStrings(rel, text);
}

function isAllowlisted(hit) {
  return ALLOWLIST.some((entry) => {
    if (entry.file !== hit.file) return false;
    if (entry.match === undefined) return true; // whole-file allowlist
    return hit.literal.includes(entry.match) || `${hit.file}`.includes(entry.match);
  });
}

const unallowlisted = hits.filter((h) => !isAllowlisted(h));

// De-duplicate identical (file, line, literal) triples — the same literal
// can be caught by more than one category's regex (e.g. a JSX attribute
// value also matching the module-data scan on a rare overlapping file).
const seen = new Set();
const deduped = [];
for (const h of unallowlisted) {
  const key = `${h.file}:${h.line}:${h.category}:${h.literal}`;
  if (seen.has(key)) continue;
  seen.add(key);
  deduped.push(h);
}

deduped.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file.localeCompare(b.file)));

if (deduped.length > 0) {
  console.error(`audit-residual-strings: ${deduped.length} unallowlisted literal(s) found\n`);
  for (const h of deduped) {
    console.error(`  ${h.file}:${h.line} [${h.category}] — ${h.literal}`);
  }
  process.exit(1);
}

console.log("RESIDUAL_STRINGS_CLEAN");
process.exit(0);
