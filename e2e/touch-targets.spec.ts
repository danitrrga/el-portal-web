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

      const targets = document.querySelectorAll<HTMLElement>(
        'a[href], button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      for (const el of Array.from(targets)) {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;

        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;

        // SC 2.5.8 "inline" exception: a link inside a sentence is sized by
        // the line-height of the surrounding text, not by the author.
        if (el.tagName === "A" && el.closest("p, li")) continue;

        if (r.width >= min && r.height >= min) continue;

        out.push({
          selector: describe(el),
          w: Math.round(r.width),
          h: Math.round(r.height),
          text: (el.textContent ?? "").trim().slice(0, 40),
        });
      }
      return out;
    }, AAA_TARGET);

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
