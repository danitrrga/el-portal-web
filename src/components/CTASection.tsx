import Link from "next/link";
import { ShinyButton } from "@/components/ui/shiny-button";

export default function CTASection() {
    return (
        <section className="py-20 relative overflow-hidden bg-transparent z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(30,64,175,0.15)_0%,_transparent_60%)] pointer-events-none"></div>
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div
                className="relative max-w-4xl mx-auto px-4 text-center z-10 transition-transform duration-500"
                style={{ transform: "scale(0.8)", transformOrigin: "center center" }}
            >
                <h2 className="text-5xl md:text-7xl font-bold text-zinc-100 mb-8 tracking-tight">
                    Ready to optimize your <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">life?</span>
                </h2>
                <p className="text-lg md:text-xl text-zinc-400 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of engineers, designers, and founders who use EL PORTAL to
                    manage their life&apos;s work.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <ShinyButton asChild className="!px-8 !py-3 !text-sm !rounded-xl !h-[44px] !font-medium">
                        <Link href={process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.el-portal.app'}>
                            Join for free
                        </Link>
                    </ShinyButton>
                    <span className="text-sm font-medium text-zinc-500 tracking-wide uppercase">
                        No credit card required
                    </span>
                </div>
            </div>
        </section>
    );
}
