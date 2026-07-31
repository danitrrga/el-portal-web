import { test, expect } from "@playwright/test";
import { ROUTES, gotoSettled } from "./support/pages";

test.describe.configure({ mode: "parallel" });

type TextOverflow = {
  selector: string;
  scrollWidth: number;
  clientWidth: number;
  overflowBy: number;
  fontSize: string;
  height: number;
  text: string;
};

type ClipEscape = {
  selector: string;
  clipper: string;
  nearestClipper: string;
  elLeft: number;
  elRight: number;
  viewportWidth: number;
  offscreenBy: number;
};

/**
 * `overflow.spec.ts` asserts on the root element's `scrollWidth`, which is
 * exactly the thing a clipping ancestor (`overflow-hidden`/`overflow-x-clip`
 * on some element between the offender and <body>) hides. This spec is the
 * complement: Sweep A measures text against its own box regardless of any
 * ancestor, and Sweep B measures elements against the *viewport* while naming
 * the ancestor that keeps their escape from ever reaching the document root.
 */

/**
 * Known, out-of-fence defects the sweeps surface that are not GAP-01, GAP-02
 * or GAP-03. Each entry here is debt made VISIBLE — a suppressed offender is
 * still pushed onto `testInfo.annotations` on every run (see `known-unfixed`
 * below), never silently dropped. This is not a mechanism for hiding a defect
 * this phase owns; it exists only so the harness can be red on the two gaps
 * it was written to catch without also being red on four unrelated,
 * already-logged findings. See `deferred-items.md` for the full writeup.
 */
const KNOWN_UNFIXED: {
  route: string;
  sweep: "A" | "B";
  selector?: string;
  clipper?: string;
  reason: string;
  ref: string;
}[] = [
  {
    route: "/features",
    sweep: "A",
    selector: "span.font-mono.text-[11px].uppercase",
    reason:
      '"Connectedness" label overflows its own box by 7px (117 vs 110) at all 7 launchable Chromium viewports, including desktop-1440 — a width-independent defect, not phone-only.',
    ref: "KU-1",
  },
  {
    route: "/mcp",
    sweep: "A",
    selector: "p.text-sm.text-zinc-400.leading-5",
    reason:
      "Twelve prose paragraphs overflow their box by up to 66px at 320px and 26px at 360px; none overflow at >=390px.",
    ref: "KU-2",
  },
  {
    route: "/privacy",
    sweep: "A",
    selector: "p.text-",
    reason:
      "Five legal-copy paragraphs overflow their box by up to 73px at 320px, 33px at 360px and 3px at 390px.",
    ref: "KU-3",
  },
  {
    route: "/pricing",
    sweep: "B",
    clipper: "div.rounded-xl.border.overflow-hidden",
    reason:
      "The comparison table (plus 14 descendants) escapes its overflow-hidden wrapper by 77px at 320px, 37px at 360px and 7px at 390px, none at 430px — a newly discovered defect of the exact class GAP-03 exists to catch.",
    ref: "KU-4",
  },
];

for (const route of ROUTES) {
  test(`container-relative overflow: ${route}`, async ({ page }, testInfo) => {
    await gotoSettled(page, route);

    const { textOverflow, clipEscape } = await page.evaluate<{
      textOverflow: TextOverflow[];
      clipEscape: ClipEscape[];
    }>(() => {
      const vw = document.documentElement.clientWidth;

      const describe = (el: Element) => {
        const id = el.id ? `#${el.id}` : "";
        const cls =
          typeof el.className === "string" && el.className.trim()
            ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
            : "";
        return `${el.tagName.toLowerCase()}${id}${cls}`;
      };

      // Six independently-justified false-positive guards. Each removes one
      // named, verified false positive without removing any target offender.
      const isExcluded = (el: Element): boolean => {
        // 1. SVG internals are painted geometry, not layout boxes.
        if (el.namespaceURI !== "http://www.w3.org/1999/xhtml") return true;
        // 2. RESPONSIVE.md's sanctioned 2-D-layout escape hatch.
        if (el.closest("[data-reflow-exempt]")) return true;
        // 3. Decorative subtrees (Footer wordmark, Hero atmosphere layers).
        if (el.closest('[aria-hidden="true"]')) return true;

        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") {
          return true;
        }
        // 5. A fixed element's containing block is the viewport, so
        //    comparing it against an ancestor's box is meaningless.
        if (cs.position === "fixed") return true;
        // 6. Presentational overlay: absolutely-positioned, non-interactive,
        //    childless and textless. Exempts ReadingLayout.tsx's glow.
        if (
          cs.position === "absolute" &&
          cs.pointerEvents === "none" &&
          el.children.length === 0 &&
          (el.textContent ?? "").trim() === ""
        ) {
          return true;
        }
        return false;
      };

      const textOverflow: TextOverflow[] = [];
      const clipEscape: ClipEscape[] = [];

      for (const el of Array.from(document.body.querySelectorAll("*"))) {
        if (isExcluded(el)) continue;

        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();

        // Sweep A — text wider than its own box. Sees a defect regardless of
        // how many clipping ancestors sit above it.
        if (
          el.children.length === 0 &&
          (el.textContent ?? "").trim() !== "" &&
          cs.display !== "inline" &&
          cs.overflowX !== "auto" &&
          cs.overflowX !== "scroll" &&
          cs.textOverflow !== "ellipsis" &&
          el.scrollWidth > el.clientWidth + 1
        ) {
          textOverflow.push({
            selector: describe(el),
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
            overflowBy: el.scrollWidth - el.clientWidth,
            fontSize: cs.fontSize,
            height: Math.round(r.height),
            text: (el.textContent ?? "").trim().slice(0, 60),
          });
        }

        // Sweep B — off-screen content masked by a clipping ancestor. The
        // exact complement of overflow.spec.ts's isClippedByAncestor skip.
        if (r.width > 0 && r.height > 0) {
          const offscreenBy = Math.round(Math.max(r.right - vw, -r.left));
          // 2px, not 1px: float32 transform quantisation (this phase's CR-01
          // fix) produces sub-2px noise that is not a real defect.
          if (offscreenBy > 2) {
            let nearestClipper: Element | null = null;
            let outermostClipper: Element | null = null;

            for (
              let p = el.parentElement;
              p && p !== document.body;
              p = p.parentElement
            ) {
              if (getComputedStyle(p).overflowX !== "visible") {
                if (!nearestClipper) nearestClipper = p;
                outermostClipper = p;
              }
            }

            if (nearestClipper && outermostClipper) {
              const nearestOverflowX = getComputedStyle(nearestClipper).overflowX;
              // A legitimate self-scrolling container (e.g. <pre> on /mcp) is
              // not a defect. No clipping ancestor at all means this is
              // viewport-level overflow, which overflow.spec.ts already owns.
              if (nearestOverflowX !== "auto" && nearestOverflowX !== "scroll") {
                clipEscape.push({
                  selector: describe(el),
                  clipper: describe(outermostClipper),
                  nearestClipper: describe(nearestClipper),
                  elLeft: Math.round(r.left),
                  elRight: Math.round(r.right),
                  viewportWidth: vw,
                  offscreenBy,
                });
              }
            }
          }
        }
      }

      return {
        textOverflow: textOverflow.sort((a, b) => b.overflowBy - a.overflowBy).slice(0, 15),
        clipEscape: clipEscape.sort((a, b) => b.offscreenBy - a.offscreenBy).slice(0, 15),
      };
    });

    const unsuppressedTextOverflow: TextOverflow[] = [];
    for (const offender of textOverflow) {
      const known = KNOWN_UNFIXED.find(
        (k) =>
          k.sweep === "A" &&
          k.route === route &&
          k.selector !== undefined &&
          offender.selector.startsWith(k.selector),
      );
      if (known) {
        testInfo.annotations.push({
          type: "known-unfixed",
          description: `${route} ${offender.selector} — ${known.ref}`,
        });
      } else {
        unsuppressedTextOverflow.push(offender);
      }
    }

    const unsuppressedClipEscape: ClipEscape[] = [];
    for (const offender of clipEscape) {
      const known = KNOWN_UNFIXED.find(
        (k) =>
          k.sweep === "B" &&
          k.route === route &&
          ((k.selector !== undefined && offender.selector.startsWith(k.selector)) ||
            (k.clipper !== undefined && offender.clipper === k.clipper)),
      );
      if (known) {
        testInfo.annotations.push({
          type: "known-unfixed",
          description: `${route} ${offender.selector} — ${known.ref}`,
        });
      } else {
        unsuppressedClipEscape.push(offender);
      }
    }

    if (unsuppressedTextOverflow.length) {
      await testInfo.attach("text-overflow-offenders", {
        body: JSON.stringify(unsuppressedTextOverflow, null, 2),
        contentType: "application/json",
      });
    }
    if (unsuppressedClipEscape.length) {
      await testInfo.attach("clip-escape-offenders", {
        body: JSON.stringify(unsuppressedClipEscape, null, 2),
        contentType: "application/json",
      });
    }

    expect(
      unsuppressedTextOverflow,
      `Text wider than its own container on ${route}`,
    ).toEqual([]);
    expect(
      unsuppressedClipEscape,
      `Off-screen content masked by a clipping ancestor on ${route}`,
    ).toEqual([]);
  });
}
