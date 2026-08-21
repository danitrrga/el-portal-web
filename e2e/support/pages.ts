import type { Page } from "@playwright/test";

/**
 * Every prerendered English route. Keep in sync with `src/app/[locale]/`.
 * Single source of truth for both locale trees — `ES_ROUTES` and `ROUTES`
 * below are derived from this list, never hand-duplicated, so the two trees
 * cannot drift apart.
 */
export const EN_ROUTES = [
  "/",
  "/features",
  "/manifesto",
  "/changelog",
  "/mcp",
  "/pricing",
  "/privacy",
  "/terms",
] as const;

/**
 * `localePrefix: "as-needed"` closes `/` to the literal `/es` (not `/es/`) —
 * see `src/proxy.ts`'s own redirect assertion. Every other route gets a
 * plain `/es` prefix.
 */
export const ES_ROUTES = EN_ROUTES.map((route) =>
  route === "/" ? "/es" : `/es${route}`,
);

/**
 * Doubles the layout-spec matrix this drives from 8 routes x 8 Playwright
 * projects to 16 x 8 (`overflow`, `containment`, `a11y`, `touch-targets`).
 * See `07-03-SUMMARY.md` for the measured wall-clock delta this produced —
 * the CI job's 30-minute timeout was sized with this headroom in mind, but
 * the number was recorded rather than assumed.
 */
export const ROUTES = [...EN_ROUTES, ...ES_ROUTES] as const;

/**
 * `src/app/layout.tsx` puts `overflow-x-hidden` on <body>.
 *
 * That clips horizontal overflow instead of preventing it, which makes every
 * overflow bug invisible to both the eye and to `documentElement.scrollWidth`.
 * Auditing the site with it in place measures a lie, so the probe neutralises
 * it for the duration of the check.
 *
 * When the underlying issue is fixed (see SURFACES.md S-01), this stays: it
 * guarantees the suite keeps failing honestly if the class is ever re-added.
 */
export async function unclipViewport(page: Page) {
  await page.addStyleTag({
    content: `html, body { overflow-x: visible !important; }`,
  });
}

/**
 * Drive the page to a deterministic resting state.
 *
 * Playwright's `animations: 'disabled'` only stops CSS animations, CSS
 * transitions, and Web Animations. Motion (Framer Motion) runs a hybrid
 * engine and falls back to a main-thread rAF driver for springs and for
 * scroll-linked `useScroll`/`useTransform` values — none of which that flag
 * touches. The only reliable way to settle them is to actually scroll the
 * page and let the values reach their resting state.
 *
 * Without this, entrance variants with an off-screen `initial` (e.g.
 * `initial={{ x: -150 }}`) register as false-positive overflow.
 */
export async function settle(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    const max = document.body.scrollHeight;
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
  await page.evaluate(() => document.fonts.ready);
}

export async function gotoSettled(page: Page, route: string) {
  await page.goto(route, { waitUntil: "networkidle" });
  await unclipViewport(page);
  await settle(page);
}
