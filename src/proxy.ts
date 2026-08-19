import { match } from "@formatjs/intl-localematcher";
import createMiddleware from "next-intl/middleware";
import Negotiator from "negotiator";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

/**
 * WHO OWNS `NEXT_LOCALE`:
 *
 * The CLIENT owns an EXPLICIT choice. `LanguageSwitcher` (plan 07-04) writes
 * `NEXT_LOCALE` to the locale the reader selected BEFORE it navigates, with
 * `path=/`, `max-age=31536000`, `SameSite=Lax`. This proxy never overwrites an
 * explicit choice with a guess.
 *
 * The PROXY only READS the cookie, and only at `/`.
 *
 * Without a client-side write, this sequence never terminates: a reader on
 * `/es` clicks EN, `localePrefix: "as-needed"` sends them to the unprefixed
 * `/`, the `/` negotiation reads the still-`es` cookie, and sends them
 * straight back to `/es`. English becomes unreachable through the site's own
 * control. This file's job is to be compatible with the switcher's write, not
 * to perform it.
 *
 * OBSERVED (2026-08-19, next-intl 4.13.7): `createMiddleware` writes/syncs
 * `NEXT_LOCALE` unconditionally via an internal `syncCookie` step, even with
 * `localeDetection: false`. Traced `resolveLocale.js`: with detection off,
 * the resolved locale is derived ONLY from the URL's locale prefix (falling
 * back to `defaultLocale` when no prefix is present) — the cookie and
 * `Accept-Language` are never consulted. `syncCookie` then writes that
 * prefix-derived value to `NEXT_LOCALE` if it differs from what's already
 * there. Consequence: visiting `/es/*` writes `NEXT_LOCALE=es`; visiting an
 * unprefixed English route writes `NEXT_LOCALE=en`. The written value always
 * AGREES with the URL actually being browsed — it can never disagree with an
 * explicit choice already reflected by the navigation that produced the
 * request. No override was needed to disable it.
 */
const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") {
    return handleI18nRouting(request);
  }

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const locale =
    cookieLocale && routing.locales.includes(cookieLocale as (typeof routing.locales)[number])
      ? cookieLocale
      : resolveFromAcceptLanguage(request);

  if (locale === routing.defaultLocale) {
    return handleI18nRouting(request);
  }

  // Closed pathname, preserved query (threat T-07-01-03). `url.pathname` is
  // assigned as a literal from the closed locale set — never derived from a
  // header, query parameter or cookie — and `url.host`/`protocol`/`port` are
  // never touched. `url.search` is left exactly as it arrived: it is data the
  // destination page receives, not a navigation target, and dropping it
  // silently destroys campaign attribution (e.g. `/?utm_source=x`).
  const url = request.nextUrl.clone();
  url.pathname = "/es";
  return NextResponse.redirect(url);
}

function resolveFromAcceptLanguage(request: NextRequest): string {
  // No Accept-Language header (the Googlebot case) makes negotiator report
  // the wildcard `"*"`, which is not a valid BCP-47 tag and makes `match()`
  // throw internally (next-intl's own `resolveLocale.js` guards the same
  // call with try/catch). Falling back to `defaultLocale` here is what makes
  // a header-less request resolve to English with no redirect.
  try {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      negotiatorHeaders[key] = value;
    });

    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

    return match(languages, routing.locales, routing.defaultLocale, {
      algorithm: "best fit",
    });
  } catch {
    return routing.defaultLocale;
  }
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
