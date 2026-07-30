import { test, expect } from "@playwright/test";
import { ROUTES, gotoSettled } from "./support/pages";

test.describe.configure({ mode: "parallel" });

type Offender = {
  selector: string;
  left: number;
  right: number;
  width: number;
  viewportWidth: number;
  overflowBy: number;
};

for (const route of ROUTES) {
  test(`no horizontal overflow: ${route}`, async ({ page }, testInfo) => {
    await gotoSettled(page, route);

    // 1. Per-element sweep first — it names the culprit, so a failure is
    //    actionable instead of "something, somewhere, is too wide".
    const offenders = await page.evaluate<Offender[]>(() => {
      const vw = document.documentElement.clientWidth;
      const TOLERANCE = 1; // subpixel rounding
      const out: Offender[] = [];

      const describe = (el: Element) => {
        const id = el.id ? `#${el.id}` : "";
        const cls =
          typeof el.className === "string" && el.className.trim()
            ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
            : "";
        return `${el.tagName.toLowerCase()}${id}${cls}`;
      };

      // An element spilling past the viewport does NOT cause page scroll if an
      // ancestor clips the x-axis. Without this filter, every decorative
      // absolutely-positioned layer inside an `overflow-hidden` section reports
      // as a false positive. <body> is excluded from the walk because the probe
      // deliberately un-clips it (see support/pages.ts).
      const isClippedByAncestor = (el: Element) => {
        for (
          let p = el.parentElement;
          p && p !== document.body && p !== document.documentElement;
          p = p.parentElement
        ) {
          if (getComputedStyle(p).overflowX !== "visible") return true;
        }
        return false;
      };

      for (const el of Array.from(document.body.querySelectorAll("*"))) {
        // SC 1.4.10 permits content that scrolls itself horizontally, and
        // permits explicitly-marked 2-D-layout exceptions.
        if (el.closest("[data-reflow-exempt]")) continue;

        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0")
          continue;
        if (cs.overflowX === "auto" || cs.overflowX === "scroll") continue;

        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (r.right <= vw + TOLERANCE && r.left >= -TOLERANCE) continue;
        if (isClippedByAncestor(el)) continue;

        out.push({
          selector: describe(el),
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          viewportWidth: vw,
          overflowBy: Math.round(Math.max(r.right - vw, -r.left)),
        });
      }

      // Report widest-first; a wide parent drags its children along, so the
      // top entries are the ones actually worth fixing.
      return out.sort((a, b) => b.overflowBy - a.overflowBy).slice(0, 15);
    });

    if (offenders.length) {
      await testInfo.attach("overflow-offenders", {
        body: JSON.stringify(offenders, null, 2),
        contentType: "application/json",
      });
    }

    expect(
      offenders,
      `Elements overflowing the viewport on ${route}`,
    ).toEqual([]);

    // 2. Root-level check as a backstop.
    const root = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
    }));

    expect(root.scrollWidth, `documentElement scrollWidth on ${route}`).toBeLessThanOrEqual(
      root.clientWidth + 1,
    );
    expect(root.bodyScrollWidth, `body scrollWidth on ${route}`).toBeLessThanOrEqual(
      root.clientWidth + 1,
    );
  });
}
