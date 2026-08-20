import { test, expect } from "@playwright/test";
import { gotoSettled, settle } from "./support/pages";

/**
 * Permanent CI coverage for the two cookie-and-panel behaviours the rest of
 * the harness only measures once (07-16, wave 6, final verification).
 *
 * Runs on the `i18n-chrome` project (`playwright.config.ts`), built on
 * `devices["Pixel 5"]` at the 390px viewport — a genuine coarse-pointer
 * Chromium device (`hasTouch: true`, `isMobile: true`), never
 * `devices["Desktop Chrome"]` at a narrow width, which is a narrow MOUSE
 * browser and would exercise none of the touch behaviour this file exists
 * to protect.
 *
 * Note: plan 07-03 asserted "no new Playwright project was added" for its
 * own scope. This plan adds one deliberately, in a later wave — that is not
 * a contradiction of 07-03's acceptance criteria, which was scoped to that
 * plan's own tasks.
 *
 * Four specific regressions this file exists to catch (see 07-16-PLAN.md
 * Task 4 for the full reasoning):
 *   1. Someone removes `px-3` from the switcher — the `#mobile-nav`
 *      instance is invisible to a sweep that never opens the hamburger.
 *   2. Someone renders `LocaleHint` without checking the cookie — the
 *      silent browser-override D-13 forbids.
 *   3. Someone breaks the switcher's `NEXT_LOCALE` cookie write — every URL
 *      assertion still passes, and English becomes unreachable only on the
 *      NEXT request to `/`. A test that asserts only the URL cannot see it.
 *   4. Someone moves the hint on top of the Navbar — no structural
 *      guarantee protects its placement, only a measured one.
 */

const HAMBURGER = 'button[aria-controls="mobile-nav"]';

test.describe.configure({ mode: "parallel" });

test("1. panel switcher targets: both links >= 44x44 with the panel open", async ({ page }) => {
  await gotoSettled(page, "/es");
  await page.click(HAMBURGER);
  await page.waitForSelector("#mobile-nav", { state: "visible" });

  const rects = await page.evaluate(() => {
    const panel = document.getElementById("mobile-nav");
    const en = panel?.querySelector('[data-testid="locale-switch-en"]');
    const es = panel?.querySelector('[data-testid="locale-switch-es"]');
    const r = (el: Element | null | undefined) =>
      el
        ? { w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height }
        : null;
    return { en: r(en), es: r(es) };
  });

  expect(rects.en, "panel EN switcher link not found").not.toBeNull();
  expect(rects.es, "panel ES switcher link not found").not.toBeNull();
  expect(rects.en!.w).toBeGreaterThanOrEqual(44);
  expect(rects.en!.h).toBeGreaterThanOrEqual(44);
  expect(rects.es!.w).toBeGreaterThanOrEqual(44);
  expect(rects.es!.h).toBeGreaterThanOrEqual(44);
});

test("2. panel closes on locale navigate", async ({ page }) => {
  await gotoSettled(page, "/es");
  await page.click(HAMBURGER);
  await page.waitForSelector("#mobile-nav", { state: "visible" });

  const panelEn = page.locator('#mobile-nav [data-testid="locale-switch-en"]');
  await panelEn.click();

  await page.waitForURL((url) => url.pathname === "/", { timeout: 5000 });
  await expect(page.locator("#mobile-nav")).toBeHidden();
});

test("3. no cookie, no hint (the most important assertion in this file)", async ({ page }) => {
  // Default `page` fixture is a fresh, isolated context with no cookies —
  // no explicit clearing needed. A hint shown to someone who never chose
  // Spanish is the exact behaviour D-13 forbids, and it is
  // indistinguishable from correct behaviour to anyone who happens to
  // already have the cookie set — which is exactly why this must be
  // asserted on a clean context, not inferred from the cookie tests below.
  await gotoSettled(page, "/pricing");
  await expect(page.locator('[data-testid="locale-hint"]')).toHaveCount(0);

  await gotoSettled(page, "/");
  await expect(page.locator('[data-testid="locale-hint"]')).toHaveCount(0);
});

test("4. cookie means hint, and the hint does not redirect", async ({ page, context }) => {
  await context.addCookies([
    {
      name: "NEXT_LOCALE",
      value: "es",
      url: new URL("/", test.info().project.use.baseURL as string).toString(),
    },
  ]);

  const response = await page.goto("/pricing", { waitUntil: "networkidle" });
  await settle(page);

  expect(response?.status()).toBe(200);
  expect(response?.headers()["location"]).toBeUndefined();
  // No intermediate redirect chain — the response that served /pricing is
  // the same one whose URL Playwright reports.
  expect(new URL(page.url()).pathname).toBe("/pricing");

  const hint = page.locator('[data-testid="locale-hint"]');
  await expect(hint).toBeVisible();

  await hint.locator('a[href="/es/pricing"]').click();
  await page.waitForURL(/\/es\/pricing/, { timeout: 5000 });
  expect(new URL(page.url()).pathname).toBe("/es/pricing");
});

test("5a. locale round trip /es -> EN: URL AND NEXT_LOCALE cookie, survives reload", async ({
  page,
  context,
}) => {
  await context.addCookies([
    {
      name: "NEXT_LOCALE",
      value: "es",
      url: new URL("/", test.info().project.use.baseURL as string).toString(),
    },
  ]);

  // At the 390px coarse-pointer viewport this project runs at, the desktop
  // switcher mount exists in the DOM but is `hidden md:flex` (display:none)
  // — the only VISIBLE switcher below md: is inside the closed hamburger
  // panel, so opening it first is what a real reader on this device does.
  await gotoSettled(page, "/es");
  await page.click(HAMBURGER);
  await page.waitForSelector("#mobile-nav", { state: "visible" });
  await page.click('#mobile-nav [data-testid="locale-switch-en"]');
  await page.waitForURL((url) => url.pathname === "/", { timeout: 5000 });

  const cookiesAfterClick = await context.cookies();
  const nextLocale = cookiesAfterClick.find((c) => c.name === "NEXT_LOCALE");
  expect(nextLocale?.value).toBe("en");

  // The defect this test exists to catch: asserting only the URL after the
  // click is not enough — the immediate client-side navigation looks
  // correct even when the switcher never wrote the cookie. The loop (an
  // unreachable English) only appears on the NEXT request to `/`, which is
  // exactly what a reload exercises.
  await page.reload({ waitUntil: "networkidle" });
  expect(new URL(page.url()).pathname).toBe("/");
});

test("5b. locale round trip / -> ES: URL AND NEXT_LOCALE cookie", async ({ page, context }) => {
  await gotoSettled(page, "/");
  await page.click(HAMBURGER);
  await page.waitForSelector("#mobile-nav", { state: "visible" });
  await page.click('#mobile-nav [data-testid="locale-switch-es"]');
  await page.waitForURL((url) => url.pathname === "/es", { timeout: 5000 });

  const cookies = await context.cookies();
  const nextLocale = cookies.find((c) => c.name === "NEXT_LOCALE");
  expect(nextLocale?.value).toBe("es");
  expect(new URL(page.url()).pathname).toBe("/es");
});

test("6. the hint never covers the Navbar", async ({ page, context }) => {
  await context.addCookies([
    {
      name: "NEXT_LOCALE",
      value: "es",
      url: new URL("/", test.info().project.use.baseURL as string).toString(),
    },
  ]);

  await gotoSettled(page, "/pricing");
  const hint = page.locator('[data-testid="locale-hint"]');
  await expect(hint).toBeVisible();

  const hintBox = await hint.boundingBox();
  const navBox = await page.locator("nav").boundingBox();

  expect(hintBox).not.toBeNull();
  expect(navBox).not.toBeNull();

  const intersects =
    hintBox!.x < navBox!.x + navBox!.width &&
    hintBox!.x + hintBox!.width > navBox!.x &&
    hintBox!.y < navBox!.y + navBox!.height &&
    hintBox!.y + hintBox!.height > navBox!.y;

  expect(intersects, "the hint's bounding box overlaps the Navbar's").toBe(false);
});
