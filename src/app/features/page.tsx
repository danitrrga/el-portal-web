import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturesHeroSection from "@/components/features/FeaturesHeroSection";
import HighlightGrid from "@/components/features/HighlightGrid";
import DeepDiveRows from "@/components/features/DeepDiveRow";
import FeaturesCTASection from "@/components/features/FeaturesCTASection";

export const metadata: Metadata = {
  title: "Features — El Portal",
  description:
    "Everything El Portal tracks, analyzes, and surfaces — shipped and in your hands today.",
};

export default function FeaturesPage() {
  return (
    <div
      className="relative min-h-screen w-full"
      style={{ background: "var(--color-ep-section-bg)" }}
    >
      {/* Atmospheric top-light radial — matches changelog / manifesto */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[700px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 0%, var(--color-ep-accent-alpha-12), transparent 65%)",
        }}
      />

      {/* D-01 Architect frame — two vertical hairline rules at content margins */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-[calc(50%-320px)] hidden w-px xl:block"
        style={{ background: "var(--color-ep-hairline)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-[calc(50%-320px)] hidden w-px xl:block"
        style={{ background: "var(--color-ep-hairline)" }}
      />

      <Navbar />

      <main className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-28 pb-24 md:pt-36 md:px-8">
        {/* Hybrid section order (FEAT-03): hero → grid → deep-dives → CTA */}
        <FeaturesHeroSection />

        <div className="space-y-20 md:space-y-28">
          {/* D-02 horizontal hairline divider between sections */}
          <div
            aria-hidden
            className="h-px"
            style={{ background: "var(--color-ep-rule)" }}
          />

          <HighlightGrid />

          <div
            aria-hidden
            className="h-px"
            style={{ background: "var(--color-ep-rule)" }}
          />

          <DeepDiveRows />

          <div
            aria-hidden
            className="h-px"
            style={{ background: "var(--color-ep-rule)" }}
          />

          <FeaturesCTASection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
