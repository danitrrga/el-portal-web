import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadingLayout from "@/components/ReadingLayout";

export const metadata: Metadata = {
    title: "Terms of Service — El Portal",
    description: "Terms governing your use of El Portal.",
};

export default function TermsPage() {
    return (
        <div className="relative w-full bg-zinc-950 min-h-screen">
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
                        <h1 className="text-3xl md:text-4xl font-semibold text-zinc-100 tracking-tight mb-3">
                            Terms of Service
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Last updated — April 13, 2026
                        </p>
                    </header>

                    {/* Content */}
                    <div className="space-y-10 pb-24">
                        <section>
                            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
                                Agreement to Terms
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                By accessing or using El Portal (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service. These terms apply to all users, whether free or paid.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
                                Description of Service
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                El Portal is a mobile-first personal operating system designed for intentional living and peak performance. It provides tools for habit tracking, deep work cycles, task management, and personal analytics through a structured Version &rarr; Cycle &rarr; Day framework.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
                                User Accounts
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                                To use El Portal, you must create an account. You are responsible for:
                            </p>
                            <ul className="list-disc list-inside text-sm text-zinc-400 leading-relaxed space-y-2">
                                <li>Providing accurate and complete registration information</li>
                                <li>Maintaining the security of your account credentials</li>
                                <li>All activity that occurs under your account</li>
                                <li>Notifying us immediately of any unauthorized access</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
                                Acceptable Use
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                                You agree not to:
                            </p>
                            <ul className="list-disc list-inside text-sm text-zinc-400 leading-relaxed space-y-2">
                                <li>Use the Service for any unlawful purpose</li>
                                <li>Attempt to reverse engineer, decompile, or disassemble any part of the Service</li>
                                <li>Scrape, crawl, or use automated tools to extract data from the Service</li>
                                <li>Interfere with or disrupt the Service&apos;s infrastructure</li>
                                <li>Impersonate another person or misrepresent your affiliation</li>
                                <li>Upload malicious code, viruses, or harmful content</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
                                Intellectual Property
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                                The Service, including its design, code, branding, and methodology, is owned by El Portal and protected by intellectual property laws. You may not copy, modify, or distribute any part of the Service without explicit permission.
                            </p>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                The El Portal name, logo, and visual identity are trademarks. Nothing in these terms grants you rights to use them.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
                                User Content
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                                You retain full ownership of all content you create within El Portal — habits, tasks, notes, cycles, and performance data. We do not claim ownership of your content.
                            </p>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                By using the Service, you grant us a limited license to store, process, and display your content solely for the purpose of providing the Service to you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
                                Payment Terms
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                                El Portal offers a free tier and a one-time lifetime purchase. By making a payment, you acknowledge:
                            </p>
                            <ul className="list-disc list-inside text-sm text-zinc-400 leading-relaxed space-y-2">
                                <li>The lifetime license is a one-time, non-recurring payment</li>
                                <li>Refund requests are handled on a case-by-case basis within 14 days of purchase</li>
                                <li>Access to paid features is granted immediately upon payment confirmation</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
                                Disclaimers
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                El Portal is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or secure at all times. Your use of the Service is at your sole risk.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
                                Limitation of Liability
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                To the maximum extent permitted by law, El Portal and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, revenue, or profits, arising from your use of the Service. Our total liability shall not exceed the amount you paid for the Service in the twelve months preceding the claim.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
                                Termination
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                                You may delete your account at any time through the app settings. Upon deletion, all your data will be permanently removed within 30 days.
                            </p>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                We reserve the right to suspend or terminate your account if you violate these terms. We will provide notice where reasonably possible.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
                                Governing Law
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                These terms are governed by and construed in accordance with applicable law, without regard to conflict of law principles. Any disputes shall be resolved in the courts of the jurisdiction where El Portal operates.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
                                Changes to These Terms
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                We may update these Terms of Service from time to time. Changes take effect when posted on this page. Continued use of El Portal after changes constitutes acceptance of the revised terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
                                Contact
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                For questions about these terms, reach us at{" "}
                                <a
                                    href="mailto:legal@elportal.app"
                                    className="text-zinc-300 underline underline-offset-4 decoration-zinc-600 hover:text-zinc-100 hover:decoration-zinc-400 transition-colors duration-300"
                                >
                                    legal@elportal.app
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
