#!/usr/bin/env node
// Standalone proof (no test framework) of the /-only negotiation contract and
// the no-English-URL-moved contract. Spawns `next start` against an existing
// production build (`npm run build` must have already run), asserts with
// plain `fetch` + `redirect: "manual"`, and exits non-zero listing every
// failed assertion.
//
// Run via `npm run verify:routing`.

import { spawn } from "node:child_process";

const PORT = 3988;
const BASE = `http://localhost:${PORT}`;

const EN_PATHS = [
  "/",
  "/features",
  "/manifesto",
  "/changelog",
  "/mcp",
  "/pricing",
  "/privacy",
  "/terms",
];

const ES_PATHS = EN_PATHS.map((p) => (p === "/" ? "/es" : `/es${p}`));

const SPANISH_AL = "es-ES,es;q=0.9,en;q=0.5";
const ENGLISH_AL = "en-US,en;q=0.9";

const failures = [];

function record(label, condition, detail) {
  if (!condition) {
    failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
  }
}

async function fetchPath(path, { acceptLanguage, cookie } = {}) {
  const headers = {};
  if (acceptLanguage) headers["accept-language"] = acceptLanguage;
  if (cookie) headers["cookie"] = cookie;
  return fetch(`${BASE}${path}`, { redirect: "manual", headers });
}

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE}/`, { redirect: "manual" });
      if (res.status) return true;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Server did not become ready within ${timeoutMs}ms`);
}

async function runAssertions() {
  // Group 1: each of the 8 English paths returns 200 with no `location`
  // header, under both a Spanish and an English Accept-Language. `/` is the
  // one path that negotiates, so its Spanish-header behaviour is asserted
  // separately in Group 2 rather than here.
  for (const path of EN_PATHS) {
    const resEn = await fetchPath(path, { acceptLanguage: ENGLISH_AL });
    record(
      `[EN header] ${path} returns 200`,
      resEn.status === 200,
      `got ${resEn.status}`,
    );
    record(
      `[EN header] ${path} has no location header`,
      !resEn.headers.get("location"),
      `got location=${resEn.headers.get("location")}`,
    );

    if (path === "/") continue; // root negotiates; see Group 2.

    const resEs = await fetchPath(path, { acceptLanguage: SPANISH_AL });
    record(
      `[ES header] ${path} returns 200 (no auto-redirect)`,
      resEs.status === 200,
      `got ${resEs.status}`,
    );
    record(
      `[ES header] ${path} has no location header`,
      !resEs.headers.get("location"),
      `got location=${resEs.headers.get("location")}`,
    );
  }

  // Group 2/3: `/` negotiates for es-ES, es-419 and es-AR (best-fit matching).
  for (const al of ["es-ES,es;q=0.9", "es-419", "es-AR"]) {
    const res = await fetchPath("/", { acceptLanguage: al });
    const location = res.headers.get("location");
    record(
      `[${al}] / returns 3xx`,
      res.status >= 300 && res.status < 400,
      `got ${res.status}`,
    );
    record(
      `[${al}] / location ends in /es`,
      !!location && new URL(location, BASE).pathname === "/es",
      `got location=${location}`,
    );
  }

  // Group 4: no Accept-Language header at all (the Googlebot case) serves
  // English with no redirect.
  {
    const res = await fetch(`${BASE}/`, { redirect: "manual" });
    record("[no header] / returns 200", res.status === 200, `got ${res.status}`);
    record(
      "[no header] / has no location header",
      !res.headers.get("location"),
      `got location=${res.headers.get("location")}`,
    );
  }

  // Group 5: explicit human choice (NEXT_LOCALE=en cookie) outranks the
  // browser guess.
  {
    const res = await fetchPath("/", {
      acceptLanguage: SPANISH_AL,
      cookie: "NEXT_LOCALE=en",
    });
    record(
      "[cookie=en + ES header] / returns 200",
      res.status === 200,
      `got ${res.status}`,
    );
    record(
      "[cookie=en + ES header] / has no location header",
      !res.headers.get("location"),
      `got location=${res.headers.get("location")}`,
    );
  }

  // Group 6: redirect preserves the query string (campaign attribution).
  {
    const res = await fetchPath("/?utm_source=test&x=1", {
      acceptLanguage: SPANISH_AL,
    });
    const location = res.headers.get("location");
    record(
      "[query] /?utm_source=test&x=1 returns 3xx",
      res.status >= 300 && res.status < 400,
      `got ${res.status}`,
    );
    record(
      "[query] location ends in /es?utm_source=test&x=1",
      !!location && location.endsWith("/es?utm_source=test&x=1"),
      `got location=${location}`,
    );
  }

  // Group 7: pathname stays closed even when the query string attempts a
  // path-escape (open-redirect check, threat T-07-01-03).
  {
    const res = await fetchPath("/?next=https://evil.example", {
      acceptLanguage: SPANISH_AL,
    });
    const location = res.headers.get("location");
    let parsed;
    try {
      parsed = location ? new URL(location, BASE) : null;
    } catch {
      parsed = null;
    }
    record(
      "[escape] location pathname is exactly /es",
      !!parsed && parsed.pathname === "/es",
      `got location=${location}`,
    );
    record(
      "[escape] origin is unchanged",
      !!parsed && parsed.origin === BASE,
      `got origin=${parsed?.origin}`,
    );
  }

  // Group 8: each of the 8 Spanish paths returns 200.
  for (const path of ES_PATHS) {
    const res = await fetchPath(path, { acceptLanguage: ENGLISH_AL });
    record(`[ES path] ${path} returns 200`, res.status === 200, `got ${res.status}`);
  }
}

async function main() {
  const server = spawn(
    "node_modules/.bin/next",
    ["start", "-p", String(PORT)],
    { stdio: "pipe" },
  );

  let serverOutput = "";
  server.stdout?.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });
  server.stderr?.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });

  try {
    await waitForServer();
    await runAssertions();
  } catch (err) {
    failures.push(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    if (serverOutput) failures.push(`--- server output ---\n${serverOutput}`);
  } finally {
    server.kill();
  }

  if (failures.length > 0) {
    console.error(`verify-locale-routing: ${failures.length} assertion(s) FAILED\n`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }

  console.log("verify-locale-routing: all assertions passed");
}

main();
