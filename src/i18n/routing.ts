import { defineRouting } from "next-intl/routing";

/**
 * Locale routing contract for the whole site.
 *
 * `localePrefix: "as-needed"` is LOCKED — English stays unprefixed so no
 * existing English URL moves. `localeDetection: false` is equally load-bearing:
 * next-intl's own middleware negotiates on EVERY unprefixed pathname by
 * default, which would redirect a Spanish-preferring browser away from
 * `/pricing`. Detection is disabled here and re-implemented by hand for the
 * single `/` pathname in `src/proxy.ts`.
 */
export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
