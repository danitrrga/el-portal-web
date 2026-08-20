import type { MetadataRoute } from "next";
import { absoluteUrl, ROUTE_PATHS, type RouteKey } from "@/lib/seo";
import { routing } from "@/i18n/routing";

/**
 * App-root sitemap — NOT under `[locale]`. A sitemap is a single site-wide
 * file; nesting it under the locale segment would produce two competing
 * sitemaps.
 *
 * One entry per route per locale (8 routes x 2 locales = 16), each carrying
 * an `alternates.languages` map so the sitemap agrees with the per-page
 * `hreflang` annotations instead of contradicting them. Paths and URLs both
 * derive from `ROUTE_PATHS` and the shared `absoluteUrl` helper over the
 * confirmed site origin — no second, hand-maintained route list here. The
 * eight English paths agree with `EN_ROUTES` in `e2e/support/pages.ts`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routeKeys = Object.keys(ROUTE_PATHS) as RouteKey[];

  return routeKeys.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(locale, route),
      alternates: {
        languages: {
          en: absoluteUrl("en", route),
          es: absoluteUrl("es", route),
          "x-default": absoluteUrl("en", route),
        },
      },
    })),
  );
}
