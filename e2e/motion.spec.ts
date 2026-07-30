import { test, expect } from "@playwright/test";
import { ROUTES, gotoSettled } from "./support/pages";

test.describe.configure({ mode: "parallel" });

/**
 * Runs under an emulated `prefers-reduced-motion: reduce`.
 *
 * Deliberately narrow. A blanket "no element has a non-zero transition-duration"
 * assertion would be wrong — reduced-motion does not require removing every
 * transition, and such a test flags ordinary hover fades as violations.
 *
 * What IS a hard invariant for this project: no perpetual motion. CLAUDE.md and
 * ANTI-PATTERNS.md ban `animate-pulse` / `animate-bounce` / `animate-ping` /
 * `repeat: Infinity` on decorative elements outright. That is deterministic and
 * cheap to check, and it doubles as a mobile battery/CPU guard.
 */
for (const route of ROUTES) {
  test(`no perpetual motion: ${route}`, async ({ page }, testInfo) => {
    await gotoSettled(page, route);

    const infinite = await page.evaluate(() => {
      const out: { selector: string; name: string; duration: string }[] = [];

      for (const el of Array.from(document.body.querySelectorAll("*"))) {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        if (!cs.animationIterationCount.split(",").some((v) => v.trim() === "infinite"))
          continue;

        const id = el.id ? `#${el.id}` : "";
        const cls =
          typeof el.className === "string" && el.className.trim()
            ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
            : "";
        out.push({
          selector: `${el.tagName.toLowerCase()}${id}${cls}`,
          name: cs.animationName,
          duration: cs.animationDuration,
        });
      }
      return out;
    });

    if (infinite.length) {
      await testInfo.attach("perpetual-motion", {
        body: JSON.stringify(infinite, null, 2),
        contentType: "application/json",
      });
    }

    expect(
      infinite.map((i) => `${i.selector} — ${i.name} ${i.duration}`),
      `Infinitely-repeating animations on ${route} (banned by ANTI-PATTERNS.md)`,
    ).toEqual([]);
  });
}
