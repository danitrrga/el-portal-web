import { test, expect } from "@playwright/test";
import { ROUTES, gotoSettled } from "./support/pages";

test.describe.configure({ mode: "parallel" });

/**
 * WCAG 2.2 SC 2.5.8 (AA) requires 24x24 CSS px — that is what axe's
 * `target-size` rule enforces in a11y.spec.ts.
 *
 * This suite holds the stricter line the design system commits to:
 * SC 2.5.5 (AAA) at 44x44, matching Apple HIG (44pt) and Material (48dp).
 * On a marketing site every tap is a conversion, so 24px "legal minimum"
 * is not the bar we want.
 *
 * Only runs at widths where touch is plausible; desktop pointer precision
 * makes the AAA target irrelevant there.
 */
const AAA_TARGET = 44;

/**
 * Measurement tolerance, not a relaxation of the 44px contract.
 *
 * `getBoundingClientRect()` returns the *transformed* border box. When any
 * ancestor carries a transform, Chromium computes that quad in float32, so an
 * element whose layout height is exactly 44px reads back as e.g.
 * 43.99993896484375. The Hero CTAs sit under a Framer `AnimatedGroup` whose
 * entrance spring asymptotes rather than terminating, so under parallel load
 * `settle()` can return while a residual sub-pixel translate
 * (`matrix(1, 0, 0, 1, 0, 0.0188307)`) is still applied — reproduced directly,
 * with `offsetHeight === 44` and `getComputedStyle().height === "44px"` on the
 * very same element. A strict `>= 44` turns that into an intermittent failure
 * on a button that is, in fact, exactly 44px.
 *
 * 0.01px absorbs that quantisation (~160x the observed 6.1e-5 error) while
 * being ~50x smaller than one device pixel at 3x DPR, so it cannot mask a real
 * shortfall — genuine violations here are 17px and 20px, not 43.99px. The
 * sibling `overflow.spec.ts` already carries a far looser `+ 1` px tolerance
 * for the same class of sub-pixel noise.
 */
const EPSILON = 0.01;

for (const route of ROUTES) {
  test(`touch targets >= ${AAA_TARGET}px: ${route}`, async ({ page }, testInfo) => {
    const width = page.viewportSize()?.width ?? 0;
    // Tailwind's `md:` breakpoint is 48rem = 768px, compiling to
    // `@media (width >= 48rem)` — at exactly 768 CSS px the frozen, approved
    // desktop layout is already active. Holding the AAA target at 768 would
    // force a desktop restyle, which RESP-08 forbids.
    test.skip(width >= 768, "AAA touch target applies below the md: breakpoint; >=768px is the frozen desktop design");

    await gotoSettled(page, route);

    const undersized = await page.evaluate((min) => {
      const out: { selector: string; w: number; h: number; text: string }[] = [];

      const describe = (el: Element) => {
        const id = el.id ? `#${el.id}` : "";
        const cls =
          typeof el.className === "string" && el.className.trim()
            ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
            : "";
        return `${el.tagName.toLowerCase()}${id}${cls}`;
      };

      // `summary` is the operative control of a <details> disclosure and is
      // natively focusable/activatable, but it matches none of the other
      // selectors here. Omitting it meant the suite never measured a single
      // disclosure control — and <details>/<summary> is the primary
      // interaction on /features, /pricing and /mcp.
      const targets = document.querySelectorAll<HTMLElement>(
        'a[href], button, summary, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      for (const el of Array.from(targets)) {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;

        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;

        // SC 2.5.8 "inline" exception: a target *in a sentence or block of
        // text* is sized by the line-height of the surrounding copy, not by
        // the author, so it is out of scope.
        //
        // The previous form of this check was `el.closest("p, li")`, which
        // exempted every anchor with a <p> OR <li> ancestor. A standalone
        // navigation link that merely happens to sit in a <ul><li> is
        // author-sized and is expressly NOT the inline case — that spelling
        // silently exempted all seven Footer nav links on all eight routes
        // and reported green.
        //
        // Correct discriminator: an anchor is "inline in running text" only
        // if its own parent also contains non-whitespace text around it.
        if (el.tagName === "A") {
          const parent = el.parentElement;
          const inRunningText =
            !!parent &&
            Array.from(parent.childNodes).some(
              (n) =>
                n.nodeType === Node.TEXT_NODE &&
                (n.textContent ?? "").trim().length > 0,
            );
          if (inRunningText) continue;
        }

        // `min` arrives already reduced by EPSILON — see its definition for why
        // an exact `>= 44` is not a safe comparison against a transformed quad.
        if (r.width >= min && r.height >= min) continue;

        out.push({
          selector: describe(el),
          // Reported to 2dp, not rounded to an integer. `Math.round` turned a
          // 43.6px failure into the string "44" in the failure message, which
          // reads as a passing measurement and sends you hunting the wrong bug.
          w: Math.round(r.width * 100) / 100,
          h: Math.round(r.height * 100) / 100,
          text: (el.textContent ?? "").trim().slice(0, 40),
        });
      }
      return out;
    }, AAA_TARGET - EPSILON);

    if (undersized.length) {
      await testInfo.attach("undersized-targets", {
        body: JSON.stringify(undersized, null, 2),
        contentType: "application/json",
      });
    }

    expect(
      undersized.map((u) => `${u.selector} — ${u.w}x${u.h} — "${u.text}"`),
      `Interactive targets under ${AAA_TARGET}px on ${route}`,
    ).toEqual([]);
  });
}
