import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import PricingClient from "@/components/pricing/PricingClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata(locale, "pricing");
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PricingClient />;
}
