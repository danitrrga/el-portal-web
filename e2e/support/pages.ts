import type { Page } from "@playwright/test";

/** Every prerendered route. Keep in sync with `src/app/`. */
export const ROUTES = [
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
