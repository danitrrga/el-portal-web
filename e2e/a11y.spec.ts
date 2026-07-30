import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { ROUTES, gotoSettled } from "./support/pages";

test.describe.configure({ mode: "parallel" });

for (const route of ROUTES) {
  test(`axe: ${route}`, async ({ page }, testInfo) => {
    await gotoSettled(page, route);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      // WCAG 2.2 rules ship DISABLED by default in axe-core ("until WCAG 2.2
      // is more widely adopted"). target-size is the whole reason we're here,
      // so opt in explicitly.
      .options({ rules: { "target-size": { enabled: true } } })
      .analyze();

    if (results.violations.length) {
      await testInfo.attach("axe-violations", {
        body: JSON.stringify(
          results.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
          })),
          null,
          2,
        ),
        contentType: "application/json",
      });
    }

    expect(
      results.violations.map((v) => `${v.id} (${v.impact}) — ${v.help}`),
      `axe violations on ${route}`,
    ).toEqual([]);
  });

  // axe returns `incomplete` rather than a violation when it cannot compute a
  // background — which is exactly what happens on gradient / glass /
  // semi-transparent surfaces. This site is built almost entirely from those
  // (.glass-panel, .card-glow, the atmospheric radials), so the contrast gaps
  // land here rather than in `violations`. Reported, not failed: these need a
  // human eye, and failing them would train you to ignore the suite.
  test(`contrast needs-review: ${route}`, async ({ page }, testInfo) => {
    await gotoSettled(page, route);

    const results = await new AxeBuilder({ page }).withTags(["wcag2aa"]).analyze();
    const unknowns = results.incomplete.filter((r) => r.id === "color-contrast");

    if (unknowns.length) {
      await testInfo.attach("contrast-needs-review", {
        body: JSON.stringify(
          unknowns.flatMap((u) => u.nodes.map((n) => n.target)),
          null,
          2,
        ),
        contentType: "application/json",
      });
      testInfo.annotations.push({
        type: "contrast-needs-review",
        description: `${unknowns.reduce((n, u) => n + u.nodes.length, 0)} element(s) on ${route} sit on a gradient/glass background — verify contrast manually.`,
      });
    }
  });
}
