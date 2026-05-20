import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadingLayout from "@/components/ReadingLayout";
import ManifestoHero from "@/components/ManifestoHero";
import PrincipleSection from "@/components/PrincipleSection";
import NorthStarSection from "@/components/NorthStarSection";
import CTASection from "@/components/CTASection";
import { Card, CardContent } from "@/components/ui/card";

const principles = [
    {
        number: "01",
        title: "Radical Intentionality",
        description:
            "Every interaction is designed to eliminate friction. We strip away the noise of the modern web to foster deep work. Your tools should disappear, leaving only you and your craft.",
    },
    {
        number: "02",
        title: "The Speed of Thought",
        description:
            "Software should respond before you've even finished the action. Low latency isn't a feature; it's a fundamental requirement for excellence.",
    },
    {
        number: "03",
        title: "Aesthetic Calibration",
        description:
            "Visual harmony reduces mental fatigue. We use high-contrast typography and deep neutrals to create a workspace that feels like a premium instrument.",
    },
    {
        number: "04",
        title: "Digital Sanctuary",
        description:
            "A private space designed for clarity. Your data is yours, your focus is protected. We build walls so you can think freely.",
    },
    {
        number: "05",
        title: "Tool for Mastery",
        description:
            "El Portal doesn't hold your hand; it empowers your expertise. It is a canvas for those who have already mastered their workflow and need a platform that matches their pace.",
    },
    {
        number: "06",
        title: "Flow State First",
        description:
            "Optimization for the cognitive load. Every element earns its place in your field of focus.",
    },
    {
        number: "08",
        title: "Elegant Restraint",
        description:
            "We add nothing that doesn't earn its place. Every pixel has purpose, every transition has intent. Simplicity is the ultimate sophistication.",
    },
];

export default function ManifestoPage() {
    return (
        <div className="relative w-full bg-zinc-950 min-h-screen">
            {/* Background grid texture */}
            <div
                className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
                style={{
                    maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)"
                }}
            />

            <Navbar />

            <main className="relative z-10 flex-1 pt-24">
                <ReadingLayout>
                    {/* Hero */}
                    <ManifestoHero
                        title="A New Era of Focus"
                        subtitle="El Portal is crafted for those who demand an immersive, high-performance environment. We believe productivity is not about doing more, but about being present in the work that matters."
                    />

                    {/* Principles */}
                    <section className="py-16 space-y-12">
                        {principles.map((principle) => (
                            <PrincipleSection
                                key={principle.number}
                                number={principle.number}
                                title={principle.title}
                                description={principle.description}
                            />
                        ))}
                    </section>

                    {/* Diamond section divider */}
                    <div className="flex items-center justify-center gap-4 py-8">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-zinc-700/30" />
                        <span className="text-blue-700/30 text-sm select-none">◆</span>
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-zinc-700/30" />
                    </div>

                    {/* North Star Redesign */}
                    <NorthStarSection />
                </ReadingLayout>
            </main>

            <Footer />
        </div>
    );
}
