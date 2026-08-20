import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

/**
 * Metadata contract consumed by every page under `src/app/[locale]`. Fixed
 * by plan 07-01 — `RouteKey`, `ROUTE_PATHS` and `buildPageMetadata`'s
 * signature do not change here, only the body. Plan 07-15 fills the body
 * with per-locale, catalogue-driven metadata plus `hreflang`, `sitemap.ts`
 * and every emitted absolute URL.
 */
export type RouteKey =
  | "home"
  | "features"
  | "manifesto"
  | "changelog"
  | "mcp"
  | "pricing"
  | "privacy"
  | "terms";

export const ROUTE_PATHS: Record<RouteKey, string> = {
  home: "/",
  features: "/features",
  manifesto: "/manifesto",
  changelog: "/changelog",
  mcp: "/mcp",
  pricing: "/pricing",
  privacy: "/privacy",
  terms: "/terms",
};

const SITE_NAME = "El Portal";

/**
 * Distinctive, greppable failure — `generateMetadata` and `sitemap.ts` both
 * run during `next build`, so an absent or malformed origin fails the build
 * instead of shipping sixteen pages of canonicals against `undefined/pricing`.
 * No hardcoded fallback origin and no development-only bypass exist here or
 * anywhere else in this module — see 07-15-PLAN.md Task 1 for why a wrong
 * absolute URL is worse than a missing one.
 */
export const E_MISSING_SITE_ORIGIN =
  "E_MISSING_SITE_ORIGIN: NEXT_PUBLIC_SITE_URL is required to emit canonical URLs, hreflang alternates and sitemap.xml";

let cachedOrigin: string | undefined;

/**
 * Resolves the confirmed site origin once and caches it. Throws
 * `E_MISSING_SITE_ORIGIN` when the variable is missing, empty, unparsable,
 * or not an absolute `https:` URL — never softened to a warning.
 */
export function getSiteOrigin(): string {
  if (cachedOrigin !== undefined) {
    return cachedOrigin;
  }

  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) {
    throw new Error(E_MISSING_SITE_ORIGIN);
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(E_MISSING_SITE_ORIGIN);
  }

  if (parsed.protocol !== "https:") {
    throw new Error(E_MISSING_SITE_ORIGIN);
  }

  cachedOrigin = parsed.origin;
  return cachedOrigin;
}

/**
 * `localePrefix: "as-needed"` — English stays unprefixed, Spanish gets `/es`,
 * and `/` (home) becomes the literal `/es`, never `/es/`. One helper so the
 * canonical, the alternates, the OG url and the sitemap can never disagree.
 */
export function localePath(locale: Locale, route: RouteKey): string {
  const path = ROUTE_PATHS[route];
  if (locale === "en") {
    return path;
  }
  return path === "/" ? "/es" : `/es${path}`;
}

export function absoluteUrl(locale: Locale, route: RouteKey): string {
  return `${getSiteOrigin()}${localePath(locale, route)}`;
}

export async function buildPageMetadata(locale: string, route: RouteKey): Promise<Metadata> {
  const loc = locale as Locale;
  const t = await getTranslations({ locale: loc, namespace: "metadata" });
  const title = t(`${route}.title`);
  const description = t(`${route}.description`);

  const canonical = absoluteUrl(loc, route);
  // x-default always points at the ENGLISH, unprefixed URL — including on
  // `/`, where the set is en: /, es: /es, x-default: /. Getting this wrong
  // on `/` is what would make `/es` the canonical home page for a crawler
  // whose language matches neither.
  const languages: Record<string, string> = {
    en: absoluteUrl("en", route),
    es: absoluteUrl("es", route),
    "x-default": absoluteUrl("en", route),
  };

  const ogLocale = loc === "es" ? "es_ES" : "en_US";
  const alternateLocale = loc === "es" ? "en_US" : "es_ES";

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: ogLocale,
      alternateLocale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
