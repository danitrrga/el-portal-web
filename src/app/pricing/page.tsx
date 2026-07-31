"use client";

import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

/* ─── Brand palette (matches Hero / VCD / CTA / Methodology) ──────── */
const SECTION_BG = "var(--color-ep-section-bg)";
const FG_STRONG = "var(--color-ep-fg-strong)";
const FG = "var(--color-ep-fg)";
const FG_MUTED = "var(--color-ep-fg-muted-2)";
// Foreground ramp is intentionally THREE steps on this surface, not four.
// The AA contrast remediation in phase 05 pointed the old `FG_SUBTLE`
// (`#5a6478`, 3.40:1 on `#04060c`) at `--color-ep-fg-muted-2` (`#8590a8`,
// 6.32:1) — the exact value `FG_MUTED` already held. Keeping both names would
// be a constant that lies: every FG_SUBTLE-vs-FG_MUTED distinction rendered
// identically. `FG_SUBTLE` is therefore removed rather than left as a dead
// alias. Restoring a real fourth step needs a new AA-clearing token
// (`--color-ep-fg-subtle-2` = `#5a6478` does not clear AA) — a design decision,
// not a mechanical one.
// ACCENT / ACCENT_LIGHT deliberately stay raw hex. They are consumed as
// hex-alpha template literals (`${ACCENT}14`, `${ACCENT_LIGHT}4d`, ...), and
// `var(--color-ep-accent)14` is invalid CSS — the swap would silently drop the
// declaration. The project convention (01-02-PLAN.md) is a pre-baked alpha
// token per opacity; only `--color-ep-accent-alpha-12/-08` and
// `--color-ep-accent-light-alpha-80` exist today, and these files need five
// more (33, 66, 4d, 40, 59). Minting design tokens is a design decision, so
// this is logged as debt in deferred-items.md rather than guessed at here.
const ACCENT = "#4487D6";
const ACCENT_LIGHT = "#77B7ED";
const BORDER = "rgba(255,255,255,0.08)";
const BORDER_STRONG = "rgba(255,255,255,0.14)";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.el-portal.app";

/* ─── Data ────────────────────────────────────────────────────────── */

const tiers = [
    {
        name: "Initiate",
        description: "The full system. Free, forever.",
        price: "$0",
        period: "forever free",
        cta: "Begin your journey",
        featured: false,
        features: [
            "Unlimited Versions, Cycles, and Days",
            "Dual-progression Goals (streaks + projects)",
            "Habit tracking + daily performance scoring",
            "The Lab — Cycle planner",
            "The Archives — full knowledge base",
            "Cinema Mode — 5 immersive slides",
            "Daily Pulse — mood & vitals",
            "Trends — basic analytics",
            "MCP integration + API keys",
            "Mobile experience · 5 languages",
            "60 MB storage",
        ],
    },
    {
        name: "Lifetime",
        description: "Everything in Initiate, plus AI on top.",
        price: "$10",
        period: "one-time",
        cta: "Claim Lifetime access",
        featured: true,
        badge: "Free for first 30",
        features: [
            "Everything in Initiate",
            "Unlimited storage (vs 60 MB)",
            "AI Insight Narratives — weekly auto-summaries",
            "Reflection Sentiment Analysis",
            "Weekly Digest emails",
            "Founding Member badge",
            "Direct line to the creator",
            "Early access to new features",
            "Lifetime updates, zero renewals",
        ],
    },
] as const;

const comparisonFeatures: {
    name: string;
    initiate: string | boolean;
    lifetime: string | boolean;
}[] = [
        { name: "Versions, Cycles, Days", initiate: "Unlimited", lifetime: "Unlimited" },
        { name: "Habit Tracking + Goal System", initiate: true, lifetime: true },
        { name: "The Lab — Cycle planner", initiate: true, lifetime: true },
        { name: "The Archives", initiate: true, lifetime: true },
        { name: "Cinema Mode", initiate: true, lifetime: true },
        { name: "Daily Pulse (mood + vitals)", initiate: true, lifetime: true },
        { name: "Trends — basic analytics", initiate: true, lifetime: true },
        { name: "Keyboard-centric design", initiate: true, lifetime: true },
        { name: "Drag-and-drop reordering", initiate: true, lifetime: true },
        { name: "Mobile experience", initiate: true, lifetime: true },
        { name: "Internationalization (5 languages)", initiate: true, lifetime: true },
        { name: "MCP integration + API keys", initiate: true, lifetime: true },
        { name: "Storage", initiate: "60 MB", lifetime: "Unlimited" },
        { name: "AI Insight Narratives", initiate: "—", lifetime: true },
        { name: "Reflection Sentiment Analysis", initiate: "—", lifetime: true },
        { name: "Weekly Digest emails", initiate: "—", lifetime: true },
        { name: "Founding Member badge", initiate: "—", lifetime: true },
        { name: "Direct line to the creator", initiate: "—", lifetime: true },
        { name: "Lifetime updates, zero renewals", initiate: "—", lifetime: true },
    ];

const faqs = [
    {
        q: "What is a Version?",
        a: "A Version is a 90-day identity phase, a deliberate container for who you're becoming. Each Version has its own title, persona, macro goals, and habits. When it ends, it's permanently archived so you can see how you've evolved.",
    },
    {
        q: "How do Cycles work inside a Version?",
        a: "Each Version is divided into 15-day Cycles, tactical sprints where you define mini-priorities, select habits, and execute daily. At the end of every Cycle, your performance is snapshotted and you decide which habits to carry forward or kill.",
    },
    {
        q: "Why is it only $10?",
        a: "El Portal is built for serious operators, not for profit margins. A one-time $10 payment unlocks everything. Future updates are included. No subscriptions, no renewals, no hidden fees. You pay once and the whole system is yours, forever.",
    },
    {
        q: "What is Trends and what data powers it?",
        a: "Trends displays all the data collected so you can access it and visualize it at anytime. Insights are computed with all the data collects, your habits, goal progress, daily mood and energy check-ins, and Cycle scores. You can see how consistent you've been, how your mood lines up with your output, and how each Cycle compares to the last. In the future, as we expand the app, we will be able to offer much more comprehensive analytics systems, tracking biometric data and more. Connecting a smart band or apple health, we can use sleep, heart rate, recovery, screen time... To relate it to your performance in all ways.",
    },
    {
        q: "What's actually different about the free tier?",
        a: "Less than you might think. Initiate gives you the whole working system — unlimited Versions, Cycles, and Days, the full Lab, Archives, Cinema Mode, basic Trends, Pulse check-ins, mobile, MCP, all of it. The only real ceilings are storage (60 MB cap) and the AI layer on top (narratives, sentiment, weekly digest emails). Your data is never deleted regardless of tier.",
    },
    {
        q: "When does Lifetime billing launch?",
        a: "El Portal is launching soon. As a thank-you for showing up early, the first 30 signups get the Pro tier activated for free at launch — no payment required, kept for life. Everyone after that pays the one-time $10 through Stripe (PCI-DSS Level 1, card details never touch El Portal's servers).",
    },
    {
        q: "What happens to my data?",
        a: "Your data will never be sold or shared with third parties. It will always remain under your ownership. You can export all your data at any time in a JSON format or delete it on demand.",
    },
    {
        q: "Is my payment secure?",
        a: "Yes. Payments are processed by Stripe, a PCI-DSS Level 1 certified provider used by millions of businesses worldwide. Your card details never touch El Portal's servers. They go directly to Stripe over an encrypted connection, and we only receive a confirmation token. No card numbers, no CVVs, no storage on our end.",
    },

];

/* ─── Page ────────────────────────────────────────────────────────── */

export default function PricingPage() {
    return (
        <div
            className="relative w-full min-h-viewport"
            style={{ background: SECTION_BG }}
        >
            {/* Atmospheric backdrop — top-light radial (matches Hero / CTA recipe) */}
            <div
                aria-hidden
                className="absolute inset-0 -z-10 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${ACCENT}1f, transparent 65%)`,
                }}
            />

            <Navbar />

            <main className="relative z-10 flex flex-col items-center">
                {/* ── Hero ─────────────────────────────────────────── */}
                <section className="w-full max-w-3xl px-6 pt-40 md:pt-48 pb-12 text-center">
                    <h1
                        className="display text-balance text-[clamp(1.5rem,2.679vw+0.964rem,2.25rem)] md:text-[clamp(36px,4.6vw,58px)]"
                        style={{
                            color: FG_STRONG,
                        }}
                    >
                        Pay once. Own the system.
                    </h1>
                    <p
                        className="mt-6 text-[15px] md:text-lg leading-[1.6] text-balance mx-auto max-w-xl"
                        style={{ color: FG }}
                    >
                        Start free or unlock everything with one payment. No
                        subscriptions, no tiers above this, no renewals.
                    </p>

                    {/* Promo banner */}
                    <div
                        className="mt-8 inline-flex items-center gap-3 rounded-full border px-4 py-2"
                        style={{
                            background: `${ACCENT}14`,
                            borderColor: `${ACCENT_LIGHT}4d`,
                        }}
                    >
                        <span
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em]"
                            style={{ color: ACCENT_LIGHT }}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: ACCENT_LIGHT }}
                            />
                            Early access
                        </span>
                        <span
                            className="block h-3 w-px"
                            style={{ background: "rgba(255,255,255,0.15)" }}
                        />
                        <span
                            className="text-xs font-medium"
                            style={{ color: FG_STRONG }}
                        >
                            Launching soon · First 30 signups get Lifetime free at launch
                        </span>
                    </div>
                </section>

                {/* ── Pricing cards — tailark pricing-2 recipe on brand tokens ── */}
                <section className="w-full max-w-3xl px-6 pb-16">
                    <div className="grid gap-4 md:grid-cols-2 items-stretch">
                        {tiers.map((tier) => (
                            <PricingCard key={tier.name} tier={tier} />
                        ))}
                    </div>
                </section>

                {/* ── Comparison table ─────────────────────────────── */}
                <section className="w-full max-w-3xl px-6 py-16">
                    <div className="text-center mb-10">
                        <span
                            className="text-[11px] font-medium uppercase tracking-[0.22em]"
                            style={{ color: FG_MUTED }}
                        >
                            Compare
                        </span>
                        <h2
                            className="display text-balance mt-4 text-[clamp(1.188rem,1.116vw+0.964rem,1.5rem)] md:text-[clamp(24px,2.6vw,32px)]"
                            style={{
                                color: FG_STRONG,
                            }}
                        >
                            Feature by feature.
                        </h2>
                    </div>
                    <div
                        className="rounded-xl border overflow-hidden"
                        style={{ borderColor: BORDER, background: "rgba(255,255,255,0.015)" }}
                    >
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr
                                    className="border-b"
                                    style={{ borderColor: BORDER }}
                                >
                                    <th
                                        className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.16em]"
                                        style={{ color: FG_MUTED }}
                                    >
                                        Feature
                                    </th>
                                    <th
                                        className="px-5 py-4 text-[11px] font-medium uppercase tracking-[0.16em] text-center"
                                        style={{ color: FG_MUTED }}
                                    >
                                        Initiate
                                    </th>
                                    <th
                                        className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-center"
                                        style={{ color: FG_STRONG }}
                                    >
                                        Lifetime
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonFeatures.map((row, i) => (
                                    <tr
                                        key={row.name}
                                        className="transition-colors"
                                        style={{
                                            borderTop:
                                                i === 0
                                                    ? undefined
                                                    : `1px solid ${BORDER}`,
                                        }}
                                    >
                                        <td
                                            className="px-5 py-3.5 text-sm"
                                            style={{ color: FG }}
                                        >
                                            {row.name}
                                        </td>
                                        {(["initiate", "lifetime"] as const).map((tier) => {
                                            const val = row[tier];
                                            return (
                                                <td
                                                    key={tier}
                                                    className="px-5 py-3.5 text-center"
                                                >
                                                    {val === true ? (
                                                        <Check
                                                            className="inline-block size-3.5"
                                                            strokeWidth={2.5}
                                                            style={{
                                                                color:
                                                                    tier === "lifetime"
                                                                        ? ACCENT_LIGHT
                                                                        : FG_MUTED,
                                                            }}
                                                        />
                                                    ) : (
                                                        <span
                                                            className="text-sm tabular-nums"
                                                            style={{
                                                                color:
                                                                    val === "—"
                                                                        ? FG_MUTED
                                                                        : tier === "lifetime"
                                                                            ? FG_STRONG
                                                                            : FG_MUTED,
                                                            }}
                                                        >
                                                            {val as string}
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ── FAQ ──────────────────────────────────────────── */}
                <section className="w-full max-w-2xl px-6 py-16">
                    <div className="text-center mb-10">
                        <span
                            className="text-[11px] font-medium uppercase tracking-[0.22em]"
                            style={{ color: FG_MUTED }}
                        >
                            FAQ
                        </span>
                        <h2
                            className="display text-balance mt-4 text-[clamp(1.188rem,1.116vw+0.964rem,1.5rem)] md:text-[clamp(24px,2.6vw,32px)]"
                            style={{
                                color: FG_STRONG,
                            }}
                        >
                            Common questions.
                        </h2>
                    </div>
                    <div className="space-y-2">
                        {faqs.map((faq) => (
                            /* The `px-5 py-4` inset lives on the <summary>, not on the
                               <details>: padding on the wrapper is not part of the
                               disclosure's hit area, which left the tappable box at the
                               20px text line-box. Moving it makes the whole visible row
                               tappable (52px) at zero visual cost — the `-mt-1` on the
                               answer absorbs the summary's new 16px bottom padding so the
                               12px question-to-answer gap, the 54px closed height and the
                               133px open height are all byte-identical to before at every
                               width, desktop included. */
                            <details
                                key={faq.q}
                                className="group rounded-lg border transition-colors"
                                style={{
                                    background: "rgba(255,255,255,0.015)",
                                    borderColor: BORDER,
                                }}
                            >
                                <summary
                                    className="flex min-h-11 items-center justify-between px-5 py-4 text-sm font-medium list-none cursor-pointer md:min-h-0"
                                    style={{ color: FG_STRONG }}
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown
                                        className="size-4 transition-transform duration-300 group-open:rotate-180"
                                        style={{ color: FG_MUTED }}
                                    />
                                </summary>
                                <p
                                    className="-mt-1 px-5 pb-4 text-sm leading-[1.6]"
                                    style={{ color: FG }}
                                >
                                    {faq.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </section>

                <div className="pb-16" />
            </main>

            <Footer />
        </div>
    );
}

/* ─── PricingCard — tailark pricing-2 structure on brand tokens ──── */
function PricingCard({
    tier,
}: {
    tier: {
        name: string;
        description: string;
        price: string;
        period: string;
        cta: string;
        featured: boolean;
        features: readonly string[];
        badge?: string;
    };
}) {
    return (
        <div
            className="relative flex flex-col rounded-xl border"
            style={{
                background: tier.featured
                    ? "rgba(68,135,214,0.06)"
                    : "rgba(255,255,255,0.015)",
                borderColor: tier.featured ? `${ACCENT_LIGHT}40` : BORDER,
            }}
        >
            {tier.badge && (
                <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.16em] whitespace-nowrap border"
                    style={{
                        background: SECTION_BG,
                        borderColor: `${ACCENT_LIGHT}59`,
                        color: ACCENT_LIGHT,
                    }}
                >
                    {tier.badge}
                </span>
            )}

            {/* Header */}
            <div className="p-6">
                <h2
                    className="text-base font-semibold"
                    style={{ color: FG_STRONG }}
                >
                    {tier.name}
                </h2>
                <p
                    className="mt-1 text-xs leading-[1.55]"
                    style={{ color: FG_MUTED }}
                >
                    {tier.description}
                </p>
                <div className="mt-5 flex items-baseline gap-2">
                    <span
                        className="text-4xl font-bold tabular-nums tracking-tight"
                        style={{ color: FG_STRONG }}
                    >
                        {tier.price}
                    </span>
                    <span
                        className="text-xs"
                        style={{ color: FG_MUTED }}
                    >
                        {tier.period}
                    </span>
                </div>
            </div>

            {/* Dashed divider */}
            <div
                className="border-t border-dashed mx-6"
                style={{ borderColor: BORDER_STRONG }}
            />

            {/* Features */}
            <ul className="p-6 space-y-2.5 flex-grow">
                {tier.features.map((feature) => (
                    <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm leading-[1.5]"
                        style={{ color: FG }}
                    >
                        <Check
                            className="size-3.5 mt-[3px] flex-shrink-0"
                            strokeWidth={2.5}
                            style={{
                                color: tier.featured ? ACCENT_LIGHT : FG_MUTED,
                            }}
                        />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <div className="p-6 pt-0">
                <Button
                    asChild
                    variant="brand"
                    size="default"
                    className="w-full"
                >
                    <Link href={APP_URL}>{tier.cta}</Link>
                </Button>
            </div>
        </div>
    );
}
