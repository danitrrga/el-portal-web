import type { Metadata } from "next";

/**
 * Metadata contract consumed by every page under `src/app/[locale]`. In this
 * plan the body is deliberately VALUE-PRESERVING, not translated: `privacy`
 * and `terms` return the exact metadata literal they carried before the
 * route move (moved out of the two page files, not duplicated), and every
 * other route returns an empty object so it keeps inheriting the root
 * layout's title exactly as it does today. Plan 07-15 replaces this body
 * with per-locale, catalogue-driven metadata plus hreflang — no other plan
 * touches this file, which is why the signature is fixed here.
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

const VALUE_PRESERVED_METADATA: Partial<Record<RouteKey, Metadata>> = {
  privacy: {
    title: "Privacy Policy — El Portal",
    description: "How El Portal handles your data and protects your privacy.",
  },
  terms: {
    title: "Terms of Service — El Portal",
    description: "Terms governing your use of El Portal.",
  },
};

export async function buildPageMetadata(_locale: string, route: RouteKey): Promise<Metadata> {
  return VALUE_PRESERVED_METADATA[route] ?? {};
}
