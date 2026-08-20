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
    return buildPageMetadata(locale, "terms");
}

interface TermsSection {
    heading: string;
    body: string;
}

interface TermsListSection {
    heading: string;
    intro: string;
    items: string[];
}

interface TermsTwoBodySection {
    heading: string;
    body1: string;
    body2: string;
}

export default async function TermsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations("legal");
    const agreement = t.raw("terms.agreement") as TermsSection;
    const description = t.raw("terms.description") as TermsSection;
    const userAccounts = t.raw("terms.userAccounts") as TermsListSection;
    const acceptableUse = t.raw("terms.acceptableUse") as TermsListSection;
    const intellectualProperty = t.raw("terms.intellectualProperty") as TermsTwoBodySection;
    const userContent = t.raw("terms.userContent") as TermsTwoBodySection;
    const paymentTerms = t.raw("terms.paymentTerms") as TermsListSection;
    const disclaimers = t.raw("terms.disclaimers") as TermsSection;
    const limitationOfLiability = t.raw("terms.limitationOfLiability") as TermsSection;
    const termination = t.raw("terms.termination") as TermsTwoBodySection;
    const governingLaw = t.raw("terms.governingLaw") as TermsSection;
    const changes = t.raw("terms.changes") as TermsSection;
    const contact = t.raw("terms.contact") as TermsSection;

    return (
        <div className="relative w-full bg-[var(--color-ep-bg-base)] min-h-viewport">
            {/* Background grid texture */}
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
                    {/* Header */}
                    <header className="pt-16 pb-12">
                        <h1 className="display text-3xl md:text-4xl text-[var(--color-ep-fg-strong)] mb-3">
                            {t("terms.h1")}
                        </h1>
                        <p className="text-sm text-[var(--color-ep-fg-muted)]">
                            {t("terms.lastUpdated")}
                        </p>
                        <p className="mt-3 text-sm text-[var(--color-ep-fg-muted)]">
                            {t("authority.notice")}
                        </p>
                    </header>

                    {/* Content */}
                    <div className="space-y-10 pb-24">
                        <section>
                            <h2 className="display text-xl text-[var(--color-ep-fg-strong)] mb-4">
                                {agreement.heading}
                            </h2>
                            <p className="text-sm text-[var(--color-ep-fg-body)] leading-relaxed">
                                {agreement.body}
                            </p>
                        </section>

                        <section>
                            <h2 className="display text-xl text-[var(--color-ep-fg-strong)] mb-4">
                                {description.heading}
                            </h2>
                            <p className="text-sm text-[var(--color-ep-fg-body)] leading-relaxed">
                                {description.body}
                            </p>
                        </section>

                        <section>
                            <h2 className="display text-xl text-[var(--color-ep-fg-strong)] mb-4">
                                {userAccounts.heading}
                            </h2>
                            <p className="text-sm text-[var(--color-ep-fg-body)] leading-relaxed mb-4">
                                {userAccounts.intro}
                            </p>
                            <ul className="list-disc list-inside text-sm text-[var(--color-ep-fg-body)] leading-relaxed space-y-2">
                                {userAccounts.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="display text-xl text-[var(--color-ep-fg-strong)] mb-4">
                                {acceptableUse.heading}
                            </h2>
                            <p className="text-sm text-[var(--color-ep-fg-body)] leading-relaxed mb-4">
                                {acceptableUse.intro}
                            </p>
                            <ul className="list-disc list-inside text-sm text-[var(--color-ep-fg-body)] leading-relaxed space-y-2">
                                {acceptableUse.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="display text-xl text-[var(--color-ep-fg-strong)] mb-4">
                                {intellectualProperty.heading}
                            </h2>
                            <p className="text-sm text-[var(--color-ep-fg-body)] leading-relaxed mb-4">
                                {intellectualProperty.body1}
                            </p>
                            <p className="text-sm text-[var(--color-ep-fg-body)] leading-relaxed">
                                {intellectualProperty.body2}
                            </p>
                        </section>

                        <section>
                            <h2 className="display text-xl text-[var(--color-ep-fg-strong)] mb-4">
                                {userContent.heading}
                            </h2>
                            <p className="text-sm text-[var(--color-ep-fg-body)] leading-relaxed mb-4">
                                {userContent.body1}
                            </p>
                            <p className="text-sm text-[var(--color-ep-fg-body)] leading-relaxed">
                                {userContent.body2}
                            </p>
                        </section>

                        <section>
                            <h2 className="display text-xl text-[var(--color-ep-fg-strong)] mb-4">
                                {paymentTerms.heading}
                            </h2>
                            <p className="text-sm text-[var(--color-ep-fg-body)] leading-relaxed mb-4">
                                {paymentTerms.intro}
                            </p>
                            <ul className="list-disc list-inside text-sm text-[var(--color-ep-fg-body)] leading-relaxed space-y-2">
                                {paymentTerms.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="display text-xl text-[var(--color-ep-fg-strong)] mb-4">
                                {disclaimers.heading}
                            </h2>
                            <p className="text-sm text-[var(--color-ep-fg-body)] leading-relaxed">
                                {disclaimers.body}
                            </p>
                        </section>

                        <section>
                            <h2 className="display text-xl text-[var(--color-ep-fg-strong)] mb-4">
                                {limitationOfLiability.heading}
                            </h2>
                            <p className="text-sm text-[var(--color-ep-fg-body)] leading-relaxed">
                                {limitationOfLiability.body}
                            </p>
                        </section>

                        <section>
                            <h2 className="display text-xl text-[var(--color-ep-fg-strong)] mb-4">
                                {termination.heading}
                            </h2>
                            <p className="text-sm text-[var(--color-ep-fg-body)] leading-relaxed mb-4">
                                {termination.body1}
                            </p>
                            <p className="text-sm text-[var(--color-ep-fg-body)] leading-relaxed">
                                {termination.body2}
                            </p>
                        </section>

                        <section>
                            <h2 className="display text-xl text-[var(--color-ep-fg-strong)] mb-4">
                                {governingLaw.heading}
                            </h2>
                            <p className="text-sm text-[var(--color-ep-fg-body)] leading-relaxed">
                                {governingLaw.body}
                            </p>
                        </section>

                        <section>
                            <h2 className="display text-xl text-[var(--color-ep-fg-strong)] mb-4">
                                {changes.heading}
                            </h2>
                            <p className="text-sm text-[var(--color-ep-fg-body)] leading-relaxed">
                                {changes.body}
                            </p>
                        </section>

                        <section>
                            <h2 className="display text-xl text-[var(--color-ep-fg-strong)] mb-4">
                                {contact.heading}
                            </h2>
                            <p className="text-sm text-[var(--color-ep-fg-body)] leading-relaxed">
                                {contact.body}{" "}
                                <a
                                    href="mailto:dtarraga.emp@gmail.com"
                                    className="text-[var(--color-ep-fg-body)] underline underline-offset-4 decoration-[var(--color-ep-fg-subtle)] hover:text-[var(--color-ep-fg-strong)] hover:decoration-[var(--color-ep-fg-muted)] transition-colors duration-300"
                                >
                                    dtarraga.emp@gmail.com
                                </a>
                                .
                            </p>
                        </section>
                    </div>
                </ReadingLayout>
            </main>

            <Footer />
        </div>
    );
}
