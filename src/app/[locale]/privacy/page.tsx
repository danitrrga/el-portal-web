import { Fragment } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadingLayout from "@/components/ReadingLayout";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return buildPageMetadata(locale, "privacy");
}

interface BucketData {
    tag: string;
    title: string;
    lede: string;
    stored: string[];
    neverStored: string[];
    meta: string;
}

interface ProviderData {
    name: string;
    region: string;
    purpose: string;
}

interface RightData {
    title: string;
    description: string;
    action: string;
}

export default async function PrivacyPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations("legal");
    const buckets = t.raw("privacy.buckets") as BucketData[];
    const providers = t.raw("privacy.providers") as ProviderData[];
    const rights = t.raw("privacy.rights") as RightData[];
    const storedLabel = t("privacy.storedLabel");
    const neverStoredLabel = t("privacy.neverStoredLabel");

    return (
        <div className="relative w-full bg-[var(--color-ep-bg-base)] min-h-viewport">
            <div
                className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
                style={{
                    maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
                }}
            />

            <Navbar />

            <main className="relative z-10 flex-1 pt-24">
                <ReadingLayout>
                    {/* Hero */}
                    <section className="pt-16 pb-4 text-center">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ep-fg-muted)] font-medium mb-4">
                            {t("privacy.eyebrow")}
                        </p>
                        <h1 className="display text-5xl sm:text-6xl text-[var(--color-ep-fg-strong)] text-balance">
                            {t("privacy.h1")}
                        </h1>
                        <p className="mt-6 text-sm text-[var(--color-ep-fg-muted)] max-w-xl mx-auto">
                            {t("authority.notice")}
                        </p>
                        <p className="mt-6 text-lg text-[var(--color-ep-fg-body)] leading-relaxed text-pretty max-w-xl mx-auto">
                            {t("privacy.intro")}
                        </p>
                    </section>

                    <Hairline />

                    {buckets.map((bucket, i) => (
                        <Fragment key={bucket.title}>
                            <Bucket {...bucket} storedLabel={storedLabel} neverStoredLabel={neverStoredLabel} />
                            {i < buckets.length - 1 && <Hairline />}
                        </Fragment>
                    ))}

                    <Hairline />

                    <section>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ep-fg-muted)] font-medium mb-3">
                            {t("privacy.providersEyebrow")}
                        </p>
                        <h2 className="display text-2xl text-[var(--color-ep-fg-strong)] text-balance mb-8">
                            {t("privacy.providersHeading")}
                        </h2>
                        <ul>
                            {providers.map((provider) => (
                                <ProviderRow key={provider.name} {...provider} />
                            ))}
                        </ul>
                    </section>

                    <Hairline />

                    <section>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ep-fg-muted)] font-medium mb-3">
                            {t("privacy.rightsEyebrow")}
                        </p>
                        <h2 className="display text-2xl text-[var(--color-ep-fg-strong)] text-balance mb-8">
                            {t("privacy.rightsHeading")}
                        </h2>
                        <ul>
                            {rights.map((right) => (
                                <RightRow key={right.title} {...right} />
                            ))}
                        </ul>
                    </section>

                    <footer className="mt-32 mb-16 text-center">
                        <p className="text-xs text-[var(--color-ep-fg-subtle)]">{t("privacy.lastUpdated")}</p>
                        <p className="mt-2 text-xs text-[var(--color-ep-fg-muted)]">
                            {t("privacy.reachUs")}{" "}
                            <a
                                href="mailto:dtarraga.emp@gmail.com"
                                className="text-[var(--color-ep-fg-body)] underline underline-offset-4 decoration-[var(--color-ep-fg-subtle)] hover:text-[var(--color-ep-fg-strong)] hover:decoration-[var(--color-ep-fg-muted)] transition-colors duration-300"
                            >
                                dtarraga.emp@gmail.com
                            </a>
                        </p>
                    </footer>
                </ReadingLayout>
            </main>

            <Footer />
        </div>
    );
}

function Hairline() {
    return <hr className="my-20 border-t border-[var(--color-ep-hairline)]" />;
}

interface BucketProps extends BucketData {
    storedLabel: string;
    neverStoredLabel: string;
}

function Bucket({ tag, title, lede, stored, neverStored, meta, storedLabel, neverStoredLabel }: BucketProps) {
    return (
        <section>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ep-fg-muted)] font-medium mb-3">{tag}</p>
            <h2 className="display text-2xl text-[var(--color-ep-fg-strong)] text-balance">{title}</h2>
            <p className="mt-4 text-[15px] md:text-base text-[var(--color-ep-fg-body)] leading-relaxed text-pretty">{lede}</p>

            <div className="mt-10 grid sm:grid-cols-2 gap-12">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ep-fg-muted)] font-medium mb-3">
                        {storedLabel}
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--color-ep-fg-body)] leading-relaxed">
                        {stored.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ep-fg-muted)] font-medium mb-3">
                        {neverStoredLabel}
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--color-ep-fg-body)] leading-relaxed">
                        {neverStored.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <p className="mt-10 text-xs text-[var(--color-ep-fg-subtle)] leading-relaxed">{meta}</p>
        </section>
    );
}

function ProviderRow({ name, region, purpose }: ProviderData) {
    return (
        <li className="flex items-baseline justify-between gap-4 py-4 border-b border-[var(--color-ep-hairline)] last:border-b-0">
            <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-ep-fg-strong)]">{name}</p>
                <p className="text-xs text-[var(--color-ep-fg-body)] mt-0.5 leading-relaxed">{purpose}</p>
            </div>
            <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ep-fg-muted)] font-medium flex-shrink-0">
                {region}
            </span>
        </li>
    );
}

function RightRow({ title, description, action }: RightData) {
    return (
        <li className="flex items-start justify-between gap-6 py-5 border-b border-[var(--color-ep-hairline)] last:border-b-0">
            <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-ep-fg-strong)]">{title}</p>
                <p className="text-xs text-[var(--color-ep-fg-body)] mt-0.5 leading-relaxed">{description}</p>
            </div>
            <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ep-fg-muted)] font-medium flex-shrink-0 mt-0.5">
                {action}
            </span>
        </li>
    );
}
