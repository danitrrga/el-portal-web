import { defineConfig, devices, type PlaywrightTestConfig } from "@playwright/test";

/**
 * Viewport matrix for the responsive audit.
 *
 * Raw viewports rather than device descriptors: descriptors bake in
 * deviceScaleFactor 3 and a platform-specific UA, which triples screenshot
 * cost for zero layout signal. One real touch-device project is kept so the
 * meta viewport tag, `isMobile`, and touch events are genuinely exercised.
 *
 * 320 is not a design target — it is the WCAG 2.2 SC 1.4.10 reflow floor
 * (320 CSS px ≡ 1280px at 400% zoom). See design/RESPONSIVE.md.
 */
export const VIEWPORTS = {
  "reflow-320": { width: 320, height: 512 },
  "mobile-360": { width: 360, height: 800 },
  "mobile-390": { width: 390, height: 844 },
  "mobile-430": { width: 430, height: 932 },
  "tablet-768": { width: 768, height: 1024 },
  "laptop-1024": { width: 1024, height: 768 },
  "desktop-1440": { width: 1440, height: 900 },
} as const;

const LAYOUT_SPECS = /(overflow|a11y|touch-targets)\.spec\.ts/;

/**
 * Annotated explicitly rather than inferred: spreading a `devices[...]`
 * descriptor inside `Object.entries(...).map(...)` widens the element type
 * enough that TypeScript rejects valid options (e.g. `reducedMotion`) on the
 * later literals via excess-property checking.
 */
const PROJECTS: PlaywrightTestConfig["projects"] = [
  // Layout invariants across the full matrix.
  ...Object.entries(VIEWPORTS).map(([name, viewport]) => ({
    name,
    testMatch: LAYOUT_SPECS,
    use: { ...devices["Desktop Chrome"], viewport },
  })),

  // One genuine touch device: exercises the meta viewport tag, hasTouch, and
  // `@media (pointer: coarse)` / `(hover: hover)` gating for real.
  {
    name: "touch-iphone",
    testMatch: LAYOUT_SPECS,
    use: { ...devices["iPhone 13"] },
  },

  // Motion behaviour under an emulated OS reduced-motion preference.
  {
    name: "reduced-motion",
    testMatch: /motion\.spec\.ts/,
    use: {
      ...devices["Desktop Chrome"],
      viewport: VIEWPORTS["mobile-390"],
      // Not a top-level `use` option in Playwright 1.62 — it belongs to the
      // browser context. Setting it at the top level type-errors.
      contextOptions: { reducedMotion: "reduce" as const },
    },
  },
];

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],

  use: {
    // Deliberately an odd port. The El Portal *app* (a different repo) already
    // runs on 3000 AND 3100 on this machine, and with `reuseExistingServer` the
    // suite silently audited it instead — reporting login-form touch targets
    // and clean overflow checks for a site it never loaded. An unusual port
    // plus `reuseExistingServer: false` makes that class of false result
    // impossible rather than merely unlikely.
    baseURL: "http://localhost:3987",
    colorScheme: "dark", // site is dark-mode only
    trace: "on-first-retry",
  },

  projects: PROJECTS,

  // Production build, not dev: dev ships different bundles, an error overlay,
  // and 'unsafe-eval'. Testing dev would measure something you never ship.
  webServer: {
    command: "npm run build && npm run start -- --port 3987",
    url: "http://localhost:3987",
    // Never reuse. A stray server on this port would be audited in place of
    // the real site, and the suite would report confident, wrong results.
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
