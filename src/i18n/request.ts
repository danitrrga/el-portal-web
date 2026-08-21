import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * Single source of truth for the namespace list. Adding a locale or a
 * namespace is a data change here, not a refactor of the loading logic —
 * every namespace file is dynamically imported by name below.
 */
export const NAMESPACES = [
  "common",
  "metadata",
  "home",
  "blueprint",
  "manifesto",
  "features",
  "mcp",
  "pricing",
  "changelog",
  "legal",
] as const;

export type Namespace = (typeof NAMESPACES)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = Object.fromEntries(
    await Promise.all(
      NAMESPACES.map(async (namespace) => [
        namespace,
        (await import(`../messages/${locale}/${namespace}.json`)).default,
      ]),
    ),
  );

  return { locale, messages };
});
