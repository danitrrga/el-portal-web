import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VCDSection from "@/components/hero/VCDSection";
import McpIntegrationSection from "@/components/hero/McpIntegrationSection";
import SystemBlueprintSection from "@/components/SystemBlueprintSection";
import MethodologyPreviewSection from "@/components/MethodologyPreviewSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative w-full bg-[#02030a] min-h-screen">
      {/* Background grid texture */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[#02030a] bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <VCDSection />
        <McpIntegrationSection />
        <SystemBlueprintSection />
        <MethodologyPreviewSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
