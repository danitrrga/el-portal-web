import { setRequestLocale } from "next-intl/server";
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

export default async function PrivacyPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

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
                            Privacy &amp; Data
                        </p>
                        <h1 className="display text-5xl sm:text-6xl text-[var(--color-ep-fg-strong)] text-balance">
                            Your data, fully visible.
                        </h1>
                        <p className="mt-6 text-lg text-[var(--color-ep-fg-body)] leading-relaxed text-pretty max-w-xl mx-auto">
                            El Portal is hosted in the EU and built on your consent. This page lists everything we
                            store, everything we never touch, and how to take it all back.
                        </p>
                    </section>

                    <Hairline />

                    <Bucket
                        tag="Required"
                        title="Mood, habit, and cycle data"
                        lede="The entries you log. Without these the app cannot work for you."
                        stored={[
                            "Mood and feelings you check in with",
                            "Habits you mark done or undone",
                            "Work cycles, goals, and reflections you write",
                            "Your account email and username",
                        ]}
                        neverStored={[
                            "Anything from outside the app",
                            "Browsing history or activity on other sites",
                            "Location, contacts, or device sensors",
                        ]}
                        meta="Stored only after you explicitly consent at signup."
                    />

                    <Hairline />

                    <Bucket
                        tag="Optional — default off"
                        title="Anonymous usage stats"
                        lede="We log feature taps, navigation, and load times so we can see what works and what is slow. No content, no cookies."
                        stored={[
                            "Which screens were opened",
                            "Which features were tapped",
                            "Page-load and route-change timings",
                            "Error codes when something breaks",
                        ]}
                        neverStored={[
                            "The text you write or the values you log",
                            "Any IP address (dropped before storage)",
                            "Cookies of any kind",
                        ]}
                        meta="EU-hosted in Frankfurt. Your toggle controls everything."
                    />

                    <Hairline />

                    <Bucket
                        tag="Optional — default off"
                        title="Reports and your reactions"
                        lede="When you ask El Portal for an AI report, we save the report and how you reacted to it. Over time, this helps us write reports that feel more like you."
                        stored={[
                            "The mood and habit summary the report was based on",
                            "The report text we wrote you",
                            "Your reaction (kept open, dismissed, asked again, marked helpful)",
                        ]}
                        neverStored={[
                            "Your name or account ID (replaced with a random hash)",
                            "Slide text or anything you write into a slide",
                            "Photos you upload",
                            "Free-form reflections or journal entries",
                        ]}
                        meta="Encrypted at rest. Never sold, never sent to ad networks, never shared with third-party AI providers."
                    />

                    <Hairline />

                    <section>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ep-fg-muted)] font-medium mb-3">
                            Where your data lives
                        </p>
                        <h2 className="display text-2xl text-[var(--color-ep-fg-strong)] text-balance mb-8">
                            Four providers, all in the EU.
                        </h2>
                        <ul>
                            <ProviderRow
                                name="Supabase"
                                region="EU — Frankfurt"
                                purpose="Primary database. Stores your account, entries, and consent log."
                            />
                            <ProviderRow
                                name="PostHog Cloud"
                                region="EU — Frankfurt"
                                purpose="Anonymous usage stats. Only active if you opt in."
                            />
                            <ProviderRow
                                name="Vercel"
                                region="EU — edge"
                                purpose="Hosts the app and runs server functions."
                            />
                            <ProviderRow
                                name="Google Gemini"
                                region="EU"
                                purpose="Generates AI report text. Only invoked when you request a report."
                            />
                        </ul>
                    </section>

                    <Hairline />

                    <section>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ep-fg-muted)] font-medium mb-3">
                            Your rights
                        </p>
                        <h2 className="display text-2xl text-[var(--color-ep-fg-strong)] text-balance mb-8">
                            Take it all back, any time.
                        </h2>
                        <ul>
                            <RightRow
                                title="Export everything"
                                description="Download a single file with everything we have on you."
                                action="Settings — Privacy — Download"
                            />
                            <RightRow
                                title="Delete everything"
                                description="Permanently erases your account and all your data. Cannot be undone."
                                action="Settings — Privacy — Delete"
                            />
                            <RightRow
                                title="Change your mind any time"
                                description="Flip any toggle in Settings — Privacy. We apply the change right away and keep a record of every choice."
                                action="Settings — Privacy"
                            />
                            <RightRow
                                title="Get in touch"
                                description="If something feels off, write to us or contact your local data protection authority."
                                action="dtarraga.emp@gmail.com"
                            />
                        </ul>
                    </section>

                    <footer className="mt-32 mb-16 text-center">
                        <p className="text-xs text-[var(--color-ep-fg-subtle)]">Last updated 2026-04-28</p>
                        <p className="mt-2 text-xs text-[var(--color-ep-fg-muted)]">
                            Reach us at{" "}
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

interface BucketProps {
    tag: string;
    title: string;
    lede: string;
    stored: string[];
    neverStored: string[];
    meta: string;
}

function Bucket({ tag, title, lede, stored, neverStored, meta }: BucketProps) {
    return (
        <section>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ep-fg-muted)] font-medium mb-3">{tag}</p>
            <h2 className="display text-2xl text-[var(--color-ep-fg-strong)] text-balance">{title}</h2>
            <p className="mt-4 text-[15px] md:text-base text-[var(--color-ep-fg-body)] leading-relaxed text-pretty">{lede}</p>

            <div className="mt-10 grid sm:grid-cols-2 gap-12">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ep-fg-muted)] font-medium mb-3">
                        What we store
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--color-ep-fg-body)] leading-relaxed">
                        {stored.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ep-fg-muted)] font-medium mb-3">
                        What we never touch
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

function ProviderRow({ name, region, purpose }: { name: string; region: string; purpose: string }) {
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

function RightRow({
    title,
    description,
    action,
}: {
    title: string;
    description: string;
    action: string;
}) {
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
