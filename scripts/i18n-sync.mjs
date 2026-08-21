#!/usr/bin/env node
// Structural sync from the English catalogue to the Spanish one.
//
// English is the source of truth for SHAPE — which keys exist, how long each
// array is, and which values are data rather than prose. Spanish is the source
// of truth for its own TRANSLATIONS. This script makes the Spanish files match
// the English shape without ever silently overwriting a real translation.
//
// THE BASELINE IS WHAT MAKES THIS WORK.
// Comparing en/ against es/ alone is not enough, because the two files share no
// common vocabulary — "The Archives" and "Los Archivos" are the same row and
// nothing in either file says so. So the script also reads the PREVIOUS commit
// of both files (`git show HEAD:<path>`) and uses that as a Rosetta stone:
// baseline-en[i] and baseline-es[i] were the same row, so once it works out
// where baseline-en[i] moved to in the edited English file, it knows which
// Spanish string travels with it.
//
// Without the baseline, deleting a row from the MIDDLE of an English array
// would shift every later Spanish row up by one and mispair the whole table
// while looking perfectly valid to a key-parity check.
//
// What it does, per namespace in src/messages/en/*.json:
//   REMAP     array entries are matched to the baseline by identity (an entry's
//             `name`/`id`/`key`, or the whole value), so rows deleted, added or
//             reordered anywhere in an array carry their translations with them.
//   PRUNE     a key or array entry that no longer exists in en/ is deleted from
//             es/, and its value is printed so it is never a silent loss.
//   MIRROR    a scalar that was IDENTICAL in both locales at the baseline is
//             data, not translation (a boolean, "60 MB", an em dash). When
//             English changes it, Spanish follows automatically.
//   STALE     a scalar that DIFFERED at the baseline is a translation. If the
//             English changed, the Spanish is kept and reported as stale — the
//             script will not machine-translate, and will not leave you
//             thinking a reworded row was retranslated.
//   REPORT    a key present in en/ but missing from es/ is reported, NOT
//             invented. Writing English into an es file ships untranslated copy
//             that looks translated and passes every gate. Pass --fill to
//             insert "TODO: <english>" instead — visible and greppable.
//   REFUSE    a key whose en and es types disagree is left untouched and
//             reported as a conflict; that is a restructure only a human can do.
//
// A namespace whose es file is exactly {} is left alone: that is the "not yet
// translated" state scripts/i18n-gates.mjs already understands.
//
// Usage:
//   node scripts/i18n-sync.mjs                    # apply to every namespace
//   node scripts/i18n-sync.mjs pricing home       # named namespaces only
//   node scripts/i18n-sync.mjs --check            # report drift, write nothing
//   node scripts/i18n-sync.mjs --fill             # insert TODO placeholders
//   node scripts/i18n-sync.mjs --baseline=<ref>   # compare against another ref
//
// The baseline defaults to HEAD, so the intended loop is: commit, edit English,
// run this, translate what it reports, commit. If you edit English across
// several commits before syncing, point --baseline at the last commit where the
// two catalogues were in step.
//
// Registered as `npm run i18n:sync` / `npm run i18n:sync:check`.
// Run `npm run i18n:gates` afterwards — this script fixes shape drift, the
// gates are what actually pass or fail the build.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const EN_DIR = path.join(ROOT, "src/messages/en");
const ES_DIR = path.join(ROOT, "src/messages/es");

const argv = process.argv.slice(2);
const CHECK_ONLY = argv.includes("--check");
const FILL = argv.includes("--fill");
const BASELINE =
  (argv.find((a) => a.startsWith("--baseline=")) || "--baseline=HEAD").split(
    "=",
  )[1] || "HEAD";
const ONLY = argv.filter((a) => !a.startsWith("--"));

const removed = [];
const missing = [];
const conflicts = [];
const mirrored = [];
const stale = [];
const noBaseline = [];

function typeOf(v) {
  if (Array.isArray(v)) return "array";
  if (v === null) return "null";
  return typeof v;
}

// Read a file as it stood at the baseline ref. Absent file, unknown ref or no
// git at all are all normal (a brand-new namespace, a shallow checkout) — the
// caller falls back to positional matching and says so.
function readAtBaseline(relPath) {
  try {
    const out = execFileSync("git", ["show", `${BASELINE}:${relPath}`], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return JSON.parse(out);
  } catch {
    return undefined;
  }
}

// What makes two array entries "the same row" across an edit.
function identity(v) {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    for (const k of ["name", "id", "key", "slug", "term", "label", "q"]) {
      if (typeof v[k] === "string") return `${k}:${v[k]}`;
    }
  }
  return `raw:${JSON.stringify(v)}`;
}

function sync(en, es, bEn, bEs, file, keyPath) {
  const enType = typeOf(en);
  const esType = typeOf(es);

  if (esType === "undefined") {
    missing.push({ file, keyPath, en });
    if (!FILL) return { present: false };
    return { present: true, value: placeholder(en) };
  }

  // A scalar that was identical in both locales at the baseline, and that
  // Spanish has not touched since, is data rather than translation — English
  // owns it. Checked BEFORE the type guard on purpose: flipping a comparison
  // cell from `true` to "-" is a type change AND a legitimate data edit, and
  // refusing it would leave the Spanish table claiming a feature the English
  // table says is absent.
  const scalarBase =
    bEn !== undefined &&
    bEs !== undefined &&
    typeOf(bEn) !== "object" &&
    typeOf(bEn) !== "array" &&
    typeOf(bEs) !== "object" &&
    typeOf(bEs) !== "array";
  if (scalarBase && bEn === bEs && es === bEs && en !== es) {
    mirrored.push({ file, keyPath, from: es, to: en });
    return { present: true, value: en };
  }

  if (enType !== esType) {
    conflicts.push({ file, keyPath, enType, esType });
    return { present: true, value: es };
  }

  if (enType === "object") {
    const out = {};
    // en's key order wins, so the two files read the same top to bottom.
    for (const k of Object.keys(en)) {
      const child = sync(
        en[k],
        es[k],
        bEn && typeof bEn === "object" ? bEn[k] : undefined,
        bEs && typeof bEs === "object" ? bEs[k] : undefined,
        file,
        keyPath ? `${keyPath}.${k}` : k,
      );
      if (child.present) out[k] = child.value;
    }
    for (const k of Object.keys(es)) {
      if (!(k in en)) {
        removed.push({
          file,
          keyPath: keyPath ? `${keyPath}.${k}` : k,
          value: es[k],
        });
      }
    }
    return { present: true, value: out };
  }

  if (enType === "array") return syncArray(en, es, bEn, bEs, file, keyPath);

  // --- scalar ---------------------------------------------------------------
  // Was this value data or translation at the baseline? If both locales held
  // the SAME scalar, it was never translated, so English owns it and any change
  // propagates. If they differed, it is a translation and English cannot
  // overwrite it — but a changed source means the Spanish is now stale.
  const haveBase = bEn !== undefined && bEs !== undefined;
  if (haveBase && bEn === bEs) {
    // Data the guarded rule above already handled, or a Spanish value that has
    // diverged from the baseline since — which means somebody translated it,
    // so English must not overwrite it.
    return { present: true, value: es };
  }
  if (haveBase && bEn !== en) {
    stale.push({ file, keyPath, was: bEn, now: en, es });
  }
  return { present: true, value: es };
}

function syncArray(en, es, bEn, bEs, file, keyPath) {
  const baselineUsable =
    Array.isArray(bEn) &&
    Array.isArray(bEs) &&
    bEn.length === bEs.length &&
    es.length === bEs.length;

  if (!baselineUsable) {
    if (Array.isArray(bEn) && en.length !== es.length) {
      noBaseline.push({ file, keyPath, enLen: en.length, esLen: es.length });
    }
    // No trustworthy row pairing, so no baseline-derived judgement either:
    // comparing es[i] against a baseline row that is not its own would report
    // nonsense and could overwrite a good translation.
    return syncArrayPositional(en, es, undefined, undefined, file, keyPath);
  }

  // Baseline index -> the row it became in the edited English array.
  const takenSources = new Set();
  const out = [];
  for (let j = 0; j < en.length; j++) {
    const wanted = identity(en[j]);
    let src = -1;
    for (let i = 0; i < bEn.length; i++) {
      if (takenSources.has(i)) continue;
      if (identity(bEn[i]) === wanted) {
        src = i;
        break;
      }
    }
    if (src === -1) {
      // No baseline row carries this identity: a new or renamed entry.
      missing.push({ file, keyPath: `${keyPath}[${j}]`, en: en[j] });
      if (FILL) out.push(placeholder(en[j]));
      continue;
    }
    takenSources.add(src);
    const child = sync(
      en[j],
      es[src],
      bEn[src],
      bEs[src],
      file,
      `${keyPath}[${j}]`,
    );
    if (child.present) out.push(child.value);
  }

  for (let i = 0; i < es.length; i++) {
    if (!takenSources.has(i)) {
      removed.push({ file, keyPath: `${keyPath}[${i}]`, value: es[i] });
    }
  }

  return { present: true, value: out };
}

// Used when there is no usable baseline (new namespace, or es already drifted
// out of step with it). Position is the only signal left.
function syncArrayPositional(en, es, bEn, bEs, file, keyPath) {
  const out = [];
  for (let i = 0; i < en.length; i++) {
    const child = sync(
      en[i],
      es[i],
      Array.isArray(bEn) ? bEn[i] : undefined,
      Array.isArray(bEs) ? bEs[i] : undefined,
      file,
      `${keyPath}[${i}]`,
    );
    if (child.present) out.push(child.value);
    else if (!FILL) {
      // Keep the array dense: a hole would corrupt every later index.
      break;
    }
  }
  for (let i = en.length; i < es.length; i++) {
    removed.push({ file, keyPath: `${keyPath}[${i}]`, value: es[i] });
  }
  return { present: true, value: out };
}

function placeholder(en) {
  if (typeof en === "string") return `TODO: ${en}`;
  if (Array.isArray(en)) return en.map(placeholder);
  if (en && typeof en === "object") {
    return Object.fromEntries(
      Object.entries(en).map(([k, v]) => [k, placeholder(v)]),
    );
  }
  return en;
}

function short(v) {
  const s = typeof v === "string" ? v : JSON.stringify(v);
  return s.length > 72 ? `${s.slice(0, 69)}...` : s;
}

const known = fs
  .readdirSync(EN_DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => path.basename(f, ".json"));

for (const n of ONLY) {
  if (!known.includes(n)) {
    console.error(`unknown namespace: ${n} (no src/messages/en/${n}.json)`);
    process.exit(2);
  }
}

const namespaces = known.filter((n) => ONLY.length === 0 || ONLY.includes(n));

const written = [];
const skipped = [];
const unbaselined = [];

for (const ns of namespaces) {
  const enPath = path.join(EN_DIR, `${ns}.json`);
  const esPath = path.join(ES_DIR, `${ns}.json`);

  if (!fs.existsSync(esPath)) {
    console.error(`missing Spanish catalogue: src/messages/es/${ns}.json`);
    process.exit(2);
  }

  const esRaw = fs.readFileSync(esPath, "utf8");
  let enObj;
  let esObj;
  try {
    enObj = JSON.parse(fs.readFileSync(enPath, "utf8"));
  } catch (e) {
    console.error(`src/messages/en/${ns}.json is not valid JSON: ${e.message}`);
    process.exit(2);
  }
  try {
    esObj = JSON.parse(esRaw);
  } catch (e) {
    console.error(`src/messages/es/${ns}.json is not valid JSON: ${e.message}`);
    process.exit(2);
  }

  if (Object.keys(esObj).length === 0) {
    skipped.push(ns);
    continue;
  }

  const bEn = readAtBaseline(`src/messages/en/${ns}.json`);
  const bEs = readAtBaseline(`src/messages/es/${ns}.json`);
  if (!bEn || !bEs) unbaselined.push(ns);

  const before = {
    removed: removed.length,
    missing: missing.length,
    mirrored: mirrored.length,
  };
  const synced = sync(enObj, esObj, bEn, bEs, `${ns}.json`, "").value;
  const changed =
    removed.length > before.removed ||
    mirrored.length > before.mirrored ||
    (FILL && missing.length > before.missing);

  // Only rewrite a file whose CONTENT changed. The catalogues are hand
  // formatted and no single rule reproduces their line breaking, so rewriting a
  // file just to reorder keys would reformat it wholesale and bury the real
  // edit in the diff. A file that does change is normalised to 2-space JSON.
  if (changed) {
    if (!CHECK_ONLY) {
      fs.writeFileSync(esPath, `${JSON.stringify(synced, null, 2)}\n`, "utf8");
    }
    written.push(ns);
  }
}

const lines = [];

if (removed.length) {
  lines.push(`REMOVED — gone from en/, deleted from es/ (${removed.length}):`);
  for (const r of removed)
    lines.push(`  ${r.file}  ${r.keyPath}  was: ${short(r.value)}`);
}
if (mirrored.length) {
  lines.push(
    `MIRRORED — untranslated data, English change copied across (${mirrored.length}):`,
  );
  for (const m of mirrored)
    lines.push(`  ${m.file}  ${m.keyPath}  ${short(m.from)} -> ${short(m.to)}`);
}
if (missing.length) {
  const verb = FILL
    ? "filled with a TODO placeholder"
    : "NOT written — translate it by hand";
  lines.push(
    `MISSING — new or renamed in en/, no Spanish counterpart, ${verb} (${missing.length}):`,
  );
  for (const m of missing)
    lines.push(`  ${m.file}  ${m.keyPath}  en: ${short(m.en)}`);
}
if (stale.length) {
  lines.push(
    `STALE — English reworded, existing Spanish kept, review it (${stale.length}):`,
  );
  for (const s of stale) {
    lines.push(`  ${s.file}  ${s.keyPath}`);
    lines.push(`      en was: ${short(s.was)}`);
    lines.push(`      en now: ${short(s.now)}`);
    lines.push(`      es is:  ${short(s.es)}`);
  }
}
if (conflicts.length) {
  lines.push(
    `CONFLICT — en and es disagree on type, left untouched (${conflicts.length}):`,
  );
  for (const c of conflicts)
    lines.push(
      `  ${c.file}  ${c.keyPath}  en is ${c.enType}, es is ${c.esType}`,
    );
}
if (noBaseline.length) {
  lines.push(
    `POSITIONAL — es/ no longer lines up with the ${BASELINE} baseline, matched by position (${noBaseline.length}):`,
  );
  for (const n of noBaseline)
    lines.push(
      `  ${n.file}  ${n.keyPath}  en has ${n.enLen}, es has ${n.esLen} — check the pairing by eye`,
    );
}

if (lines.length) console.log(lines.join("\n"));

if (unbaselined.length) {
  console.log(
    `\nno ${BASELINE} baseline for: ${unbaselined.join(", ")} — matched by position, so a row deleted from the middle of an array cannot be detected`,
  );
}
if (skipped.length) {
  console.log(
    `\nskipped (es catalogue still empty, not yet translated): ${skipped.join(", ")}`,
  );
}

if (written.length) {
  console.log(
    CHECK_ONLY
      ? `\nes/ has content drift against en/ in: ${written.join(", ")}`
      : `\nrewrote: ${written.map((n) => `src/messages/es/${n}.json`).join(", ")}`,
  );
} else if (missing.length || conflicts.length || stale.length) {
  console.log("\nnothing to rewrite — what is left needs a human, see above.");
} else {
  console.log("\nes/ already matches en/ in shape — nothing to rewrite.");
}

if (missing.length || conflicts.length) {
  console.log(
    "\nRun `npm run i18n:gates` — missing keys and type conflicts fail the build until resolved.",
  );
}

// --check is the CI-shaped form: any drift at all is a non-zero exit.
// The applying form only fails on what it could not fix by itself.
if (
  CHECK_ONLY &&
  (written.length || missing.length || conflicts.length || stale.length)
) {
  process.exit(1);
}
if (!CHECK_ONLY && conflicts.length) process.exit(1);
