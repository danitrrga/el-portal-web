"use client"
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChangelogItem } from "@/components/ChangelogItem";

// Filter type
type FilterType = "All" | "Features" | "Fixes" | "Release";

export default function ChangelogPage() {
    const [filter, setFilter] = useState<FilterType>("All");

    // Extracted changelog data to cleanly filter and map
    const changelogData = [
        {
            version: "2.0.28",
            date: "May 20, 2026",
            tags: ["Fix"],
            type: "Features",
            title: "Sign-in Now Lands Where It Should",
            description: (
                <>
                    <p>Google sign-in now routes entirely through the app — no more redirects that landed on an external URL. A class of quiet auth failures is gone, and the login screen handles dark browser themes correctly.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Clean OAuth flow</strong> — After signing in with Google, you land on your dashboard — never on a raw external URL.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Autofill polished</strong> — Browser-autofilled inputs on the login screen now match the dark theme; no more white flash when Chrome fills in your credentials.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Email links secured</strong> — Magic link emails are built from the app&apos;s own domain, not whatever URL the server happened to see at send time.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.27",
            date: "May 11, 2026",
            tags: ["New Feature"],
            type: "Features",
            title: "A Guided Tour for Your First Day",
            description: (
                <>
                    <p>New users now get a step-by-step walkthrough of El Portal — from creating your first Version to setting up your first Cycle. A spotlight marks exactly where to look; a connector points you to the right control. When you finish, you&apos;re ready for day one.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Step-by-step spotlight</strong> — Each tour step dims everything except the one thing you need to act on, with a clear arrow pointing right to it.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Tab-by-tab coaching</strong> — The tour walks through Version creation and Cycle setup section by section, inside the actual modals.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Smart for returning users</strong> — If you already have a Version or Cycle, the tour skips the creation steps and shows you what you&apos;ve built instead.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Replay anytime</strong> — Restart the tour from Settings whenever you want a refresher.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.26",
            date: "May 11, 2026",
            tags: ["Improvement"],
            type: "Features",
            title: "Archives Is Now a Vault",
            description: (
                <>
                    <p>Archives has been reimagined as a quieter, more intentional space. Instead of a tab-heavy surface packed with sections, you arrive at a threshold — six stone names, generous space, no clutter. Each one opens into its own room.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Threshold Hall</strong> — Six stones centered on the screen: Vision, Life Checklist, Routines, Theory Notes, Mantras, and Skills &amp; Traits. Click one to enter.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Each stone, its own room</strong> — Every section now lives on a dedicated page. Routines and Theory Notes let you drill into individual entries from their own mini hall.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Skills &amp; Traits chip gallery</strong> — Browse your skills and traits as chips. Add inline, double-click to edit, no modal needed.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Debrief History removed</strong> — That section is gone. The vault is calmer for it.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.25",
            date: "May 11, 2026",
            tags: ["Improvement"],
            type: "Features",
            title: "A New First Impression",
            description: (
                <>
                    <p>The moment after you verify your email, El Portal now introduces itself properly — an animated welcome overlaid on the actual dashboard, so you see the real interface while being shown around it.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Overlay, not a detour</strong> — Onboarding now sits on top of the dashboard instead of routing you to a separate page. You land in the right place from the start.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Post-verify welcome screen</strong> — Right after email confirmation, you get a clear, calm introduction — what El Portal is, what you&apos;re consenting to, and what comes next.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Animated system intro</strong> — Version, Cycle, and Day are introduced with motion that mirrors how the system actually works.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.24",
            date: "May 06, 2026",
            tags: ["Improvement"],
            type: "Features",
            title: "Records Page, Rebuilt",
            description: (
                <>
                    <p>The database records page has been rebuilt with a cleaner, more focused interface. The heavy header is gone, a sliding indicator tracks your active tab, and single-key shortcuts let you navigate without lifting your hands from the keyboard.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Tab bar leads the page</strong> — The titled header is gone. Versions, Cycles, Habits, and Objectives tabs are the first thing you see.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Sliding indicator</strong> — A smooth highlight follows your active tab, consistent with how the Trends view works.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Keyboard shortcuts</strong> — Press V, C, H, or O to jump directly to each tab.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Cleaner status badges</strong> — Active and archived states now render as quiet, consistent pills.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.23",
            date: "May 11, 2026",
            tags: ["Fix"],
            type: "Features",
            title: "Daily Pulse, Now Reliable",
            description: (
                <>
                    <p>Your daily insights and notifications were silently failing to run on most days. The scheduling infrastructure has been replaced — your morning data is there when you need it.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Insights run on time</strong> — Moved off a scheduler that was dropping roughly 80% of its runs. Daily reports now fire consistently, every day.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Notifications stay timely</strong> — The 15-minute notification check now runs on independent scheduling, decoupled from the daily report job.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">No silent cutoffs</strong> — Insight generation can now run to completion even for longer processing windows.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.22",
            date: "May 02, 2026",
            tags: ["New Feature", "Improvement"],
            type: "Features",
            title: "Smarter Insights — Deeper Patterns, Cleaner Cards",
            description: (
                <>
                    <p>Insights surfaces deeper patterns now: how a habit you do today ripples into tomorrow, which feelings tend to come together, and which behaviors actually move your daily score. Cards have been redesigned around a single signal-strength indicator.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Habits that ripple forward</strong> — Insights now spots when a habit you do today predicts how a vital looks tomorrow or the day after.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Feelings as signals</strong> — Discover which feelings tend to show up together, and which habits make a feeling more — or less — likely.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Habits vs. your score</strong> — See exactly which habits are pulling your daily score and overall wellbeing up, and which ones aren&apos;t earning their place.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">One status, three states</strong> — Each insight card now uses a single circle: empty for emerging, half-filled for moderate, full for strong. No more rainbow categories.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Browse past reports</strong> — Step back through your last ten reports with a floating control, and see at a glance when the next one will be ready.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.21",
            date: "April 30, 2026",
            tags: ["New Feature", "Improvement"],
            type: "Features",
            title: "Privacy You Control & A Quieter Look",
            description: (
                <>
                    <p>You now control exactly what data you share, and you can take it all back at any time. The visual language has been pulled toward something quieter and more confident — green and amber retired in favor of a single cohesive blue.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Three independent privacy switches</strong> — One for your personal data, one for anonymous usage analytics, one for opt-in research. Each toggleable in Settings, all off by default.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Export everything, delete everything</strong> — One click downloads your full data in a readable format. Another permanently erases it. Both protected by a confirmation step.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">A new public Privacy page</strong> — Plain-language explanation of what each switch covers, where your data lives, and exactly which rights you have.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">A more cohesive palette</strong> — Green is gone, amber and yellow are out of analytics, and the blue used everywhere now comes straight from the portal logo.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">No cookies, full stop</strong> — Anonymous analytics no longer set any cookies on your device.</span></li>
                    </ul>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-950/30 border border-blue-900/50 mt-4">
                        <span className="material-symbols-outlined text-blue-200">lock</span>
                        <p className="text-sm font-medium text-blue-200">Privacy by default. Granular consent. Full export and erasure on request.</p>
                    </div>
                </>
            ),
        },
        {
            version: "2.0.20",
            date: "April 25, 2026",
            tags: ["New Feature"],
            type: "Features",
            title: "Cinema — Fall Into the Photo",
            description: (
                <>
                    <p>Opening a Cinema slide no longer just fades in — the photo itself expands smoothly into the full view, and everything else assembles around it. Tap a slide and you fall into it.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">The photo leads</strong> — When you open a slide, the image you tapped grows smoothly into the full-bleed view. Text and chrome fade in afterward, so the photo always feels like the centerpiece.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Snappy close</strong> — Hit ESC or the back arrow and the slide closes cleanly, no overshoot.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Keyboard friendly</strong> — Arrow keys to navigate, ESC to close, page scroll locks while you&apos;re immersed.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>If your system asks for less motion, the morph drops to a simple crossfade.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.19",
            date: "April 22, 2026",
            tags: ["New Feature", "Improvement"],
            type: "Features",
            title: "Insights Tab & Unified Time Pill",
            description: (
                <>
                    <p>The Insights tab is live with real correlations and a written narrative each report. Period and time-scale navigation across analytics has been collapsed into a single floating pill at the bottom of the screen.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Insights tab</strong> — Surfaces patterns across your habits, feelings, and vitals — written up as a short narrative. Includes a blurred preview of what your insights will look like once you&apos;ve logged enough data.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Floating period pill</strong> — Scale and time navigation are now one control: tap to switch week / month / year, step forward or back with the chevrons. Sits at the bottom on mobile and respects the safe area.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Notifications tab</strong> — Notifications and email settings moved into their own tab. Changes save automatically — no more Save button. Pick how often you want reports: biweekly, monthly, every cycle, or quarterly.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Pulse always one tap away</strong> — The Pulse check-in shortcut now lives in the header on mobile, so it&apos;s reachable from any screen.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Better keyboard navigation and screen-reader support across every analytics screen, plus translation polish.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.18",
            date: "April 20, 2026",
            tags: ["Improvement", "Fix"],
            type: "Features",
            title: "Wordmark, New Sidebar & Sign-In Fixes",
            description: (
                <>
                    <p>A refined logo lockup, a sidebar that lights up around the page you&apos;re on, and Google Sign-In has been rebuilt so it works reliably — including after you log out and back in.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Refined wordmark</strong> — A consistent El Portal lockup now appears across auth screens, the privacy page, and emails. Same wordmark everywhere.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Volumetric sidebar</strong> — The active page in the sidebar glows with a soft conical light and a subtle film-grain overlay. Subtle, but unmistakable when you scan the nav.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Smoother loading</strong> — Flat skeleton placeholders have been replaced with a polished shimmer that cascades across each page while data loads.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Google Sign-In, fixed</strong> — The button now actually appears on the page, the sign-in flow works first try, and logging out then back in no longer breaks.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.17",
            date: "April 18, 2026",
            tags: ["New Feature"],
            type: "Features",
            title: "Trends — Tabbed Analytics Dashboard",
            description: (
                <>
                    <p>The Trends page has been reorganized into five focused tabs and is now free for everyone. Each tab takes a different angle on your data — wellbeing, performance, cycles, insights, and reports.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Five tabs</strong> — Wellbeing, Performance, Cycles, Insights, and Reports. The dashboard is now free; only AI-generated reports remain a Pro feature.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Performance tab</strong> — Daily-score average, perfect-day rate, best streak, and a habit reliability table you can sort. A year-long heatmap shows the days you tend to slip and the days you tend to nail.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Cycles tab</strong> — Cycle-over-cycle score chart with a trend line, scrollable cycle reports, goal-journey cards, an identity-evolution timeline, and a recurrence scanner that flags frictions showing up across multiple cycles.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Reports tab</strong> — A polished report card with narrative, sparkline, and highlights. Export as PNG or PDF, or print it.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Mobile mirror</strong> — Every tab has a fully native mobile version with proper touch targets and the floating period pill.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Wellbeing tab adds a composite wellbeing score, a vitals radar, a mood-delta chart, and a sleep-consistency card. Available in all five languages.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.16",
            date: "April 02, 2026",
            tags: ["Improvement", "Optimization"],
            type: "Features",
            title: "Trends — Mobile, Speed & Polish",
            description: (
                <>
                    <p>The Trends dashboard runs noticeably faster and reads beautifully on phones. Sections load on demand, charts share one calm blue palette, and the empty state has been redesigned.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Mobile Trends</strong> — Full mobile layout with a floating time navigator, single-column charts, and a week-only mood calendar with bigger touch targets.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Faster scrolling</strong> — Charts below the fold now load only when you scroll near them. Skeleton placeholders show while data comes in.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Calmer palette</strong> — Every chart and mood indicator now shares one cohesive blue gradient, from deep navy to bright cyan.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Redesigned empty state with a softer gradient and progress bar. Mood calendar dots scale with intensity. Reduced-motion preferences respected.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.15",
            date: "March 19, 2026",
            tags: ["New Feature"],
            type: "Features",
            title: "Trends — Your Pulse Data, Visualized",
            description: (
                <>
                    <p>A full analytics dashboard for your Pulse data — mood trajectories, vitals, sleep, activities, emotions, and the behaviors statistically tied to your best and worst days.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Nine sections</strong> — Mood trend, six vitals (sleep, energy, stress, performance, motivation, connectedness), mood calendar, sleep duration, activities and emotions breakdown, and consistency streaks.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Five time scales</strong> — Week, month, year, cycle, version. Step through any period with previous and next.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">What lifts you, what drags you</strong> — Cards highlight the activities most linked to your highest- and lowest-mood days.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Every chart shows how the current period compares to the previous one. Sample data appears blurred until you&apos;ve logged enough check-ins. Available in all five languages.</span></li>
                    </ul>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-950/30 border border-blue-900/50 mt-4">
                        <span className="material-symbols-outlined text-blue-200">lock</span>
                        <p className="text-sm font-medium text-blue-200">Trends is a Pro-exclusive feature available to Lifetime members.</p>
                    </div>
                </>
            ),
        },
        {
            version: "2.0.14",
            date: "March 19, 2026",
            tags: ["New Feature"],
            type: "Features",
            title: "Feedback Page & Lighter Emails",
            description: (
                <>
                    <p>Send feedback directly from inside the app, and receive auth emails that look polished in any inbox — light or dark.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Feedback page</strong> — Share thoughts without leaving the app. Your name, email, and plan auto-fill, and a small confirmation animation plays on send.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Lighter email design</strong> — Verification and password emails now use a clean light layout that reads well in any inbox, with a branded footer linking back to the app.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.13",
            date: "March 18, 2026",
            tags: ["New Feature"],
            type: "Features",
            title: "Daily Pulse — Morning & Evening Check-Ins",
            description: (
                <>
                    <p>Track your daily wellbeing through structured morning and evening check-ins. Daily Pulse captures mood, vitals, emotions, and activities, building up a rich picture of your life over time.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Morning check-in</strong> — Four steps: mood, sleep quality, how you&apos;re feeling (24 emotions to pick from), and what you want to focus on today.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Evening check-in</strong> — Eight steps covering mood, productivity, stress, motivation, energy, and connectedness on a 0–100 scale, plus what you felt and what you did.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">MoodOrb</strong> — A glowing sphere that breathes with your mood: the colors drift, the eyes open, the smile curves up. The orb is tied to El Portal&apos;s logo palette.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Pulse card on the dashboard</strong> — Split morning and evening card with sun and moon animations, and clear badges for what&apos;s done.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Subtle indicators on the dashboard, a floating shortcut on mobile when a check-in is pending, and customizable reminder timing in Settings.</span></li>
                    </ul>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-950/30 border border-blue-900/50 mt-4">
                        <span className="material-symbols-outlined text-blue-200">lock</span>
                        <p className="text-sm font-medium text-blue-200">Daily Pulse is a Pro-exclusive feature available to Lifetime members.</p>
                    </div>
                </>
            ),
        },
        {
            version: "2.0.12",
            date: "April 01, 2026",
            tags: ["New Feature"],
            type: "Features",
            title: "Archives — Rich-Text Editor & Checklists",
            description: (
                <>
                    <p>The Archives have a real writing experience now: a rich-text editor with a floating toolbar, and interactive checklists you can tick directly inside your notes.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Rich-text editing</strong> — Floating toolbar with bold, italic, headings, quotes, lists, links, and code blocks. Themed to match the El Portal glass look.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Interactive checklists</strong> — Type a checkbox marker and it turns into a real checkbox you can toggle. Works in the dark theme with proper focus states.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Faster, calmer page</strong> — The Archives have been reorganized for snappier load and easier reading.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Polished typography across all five languages — curly quotes, en dashes, and proper ellipses.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.11",
            date: "March 29, 2026",
            tags: ["New Feature", "Improvement"],
            type: "Features",
            title: "Day Inspector & Multi-Cycle Goals",
            description: (
                <>
                    <p>The standalone History page has been folded into the Dashboard as an inline Day Inspector. The Goals page now lets you view your goals across multiple cycles.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Day Inspector</strong> — Click any point on your performance chart to inspect and edit that day&apos;s habits without leaving the page. The view stays in the URL, so you can share it.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Multi-cycle goals</strong> — Toggle between cycles to see your goals across time. Past-cycle goals stay locked but can be carried forward into the current cycle.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Snappier chart</strong> — The progress chart now updates instantly when you tick a habit, with no perceptible lag.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.10",
            date: "March 28, 2026",
            tags: ["Improvement", "Fix"],
            type: "Features",
            title: "Faster, Cleaner & More Accessible",
            description: (
                <>
                    <p>Pages load faster, every screen is now usable with a keyboard or screen reader, and Lab and Settings have been rebuilt for clarity.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Reorganized Lab</strong> — Clearer sections for versions, cycles, goals, and habits. Editing a version now goes through a focused stepper.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Cleaner Settings</strong> — Five tabs: Account, General, Appearance, Pulse, Storage. Easy to find what you&apos;re looking for.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Accessibility</strong> — Twelve key parts of the app now work properly with screen readers and keyboard-only navigation. WCAG AA compliant.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Faster loading</strong> — Pages fetch their data in parallel and only load heavy bits when they&apos;re actually needed. The whole app feels meaningfully snappier.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Identity toggle</strong> — Turn the identity system on or off in Settings, and the related UI hides instantly across Lab, Dashboard, Archives, and the cycle editor.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Version-creation modal redesigned with a stepper, plus subtle Raycast-style hover states on the habit list.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.9",
            date: "March 16, 2026",
            tags: ["Improvement"],
            type: "Features",
            title: "Database Page — Cleaner & Faster",
            description: (
                <>
                    <p>The Database page has been rebuilt for speed and consistency. Every entity now behaves the same way, and navigating between tabs feels noticeably quicker.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Unified actions</strong> — Duplicate, edit, and delete now work the same way across versions, cycles, habits, and goals.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Snappier interactions</strong> — Filtering and switching tabs feels instant, even on large databases.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>New polished segmented toggle with a subtle graphite variant.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.8",
            date: "March 15, 2026",
            tags: ["Fix", "Optimization"],
            type: "Features",
            title: "Quality Pass — Stability & Polish",
            description: (
                <>
                    <p>A focused pass to fix subtle bugs, tighten up data handling, and clear out dead weight across every page.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Dashboard fix</strong> — Resolved a rare ordering issue that could cause a chart to render incorrectly under specific conditions.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">More accurate goal data</strong> — Goals carry richer metadata now, with safer handling when fields are missing.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Cleaner under the hood</strong> — Removed leftover diagnostics and unused code paths.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>A stray English string in non-English locales has been pulled into the proper translation.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.4",
            date: "March 12, 2026",
            tags: ["New Feature"],
            type: "Features",
            title: "Mobile-First Experience",
            description: (
                <>
                    <p>El Portal is no longer desktop-only. A full mobile experience has been built from the ground up with native-feeling navigation.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Dedicated mobile screens for habits, goals, and analytics — built for touch and small screens.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>New <strong className="text-zinc-200">bottom tab bar</strong> for fast switching between the screens you use most.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Mobile-friendly sheets replace desktop modals where it matters.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Automatic mobile detection on first load — open the app on your phone and you land in the right place.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.7",
            date: "March 14, 2026",
            tags: ["New Feature"],
            type: "Features",
            title: "Now in 5 Languages",
            description: (
                <>
                    <p>El Portal now speaks your language. Every screen has been fully translated, and your language preference follows you across devices.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Available in <strong className="text-zinc-200">English, Spanish, Chinese (Simplified), Portuguese, and French</strong>.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Your language preference syncs to your account, so it follows you to any device.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Every screen, every label, every error message — fully translated.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Proper Chinese character rendering with a dedicated font.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.6",
            date: "March 14, 2026",
            tags: ["New Feature", "Fix"],
            type: "Features",
            title: "Password Reset & Security Hardening",
            description: (
                <>
                    <p>A complete forgot-password flow, plus important security improvements to the auth layer.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Reset your password</strong> — Forgot-password link on the login screen sends a branded email with a one-hour reset link, and a clean reset page handles the new password and confirmation.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Security hardened</strong> — Internal cleanup to remove unused fallback credentials and tighten how email assets are served.</span></li>
                    </ul>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-950/30 border border-blue-900/50 mt-4">
                        <span className="material-symbols-outlined text-blue-200">lock</span>
                        <p className="text-sm font-medium text-blue-200">Security-first: no credentials are ever exposed in client-side code.</p>
                    </div>
                </>
            ),
        },
        {
            version: "2.0.5",
            date: "March 14, 2026",
            tags: ["Improvement"],
            type: "Features",
            title: "Tempo Redesign",
            description: (
                <>
                    <p>A visual overhaul of the Tempo screen and a new dropdown that finally feels at home in the dark theme.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Tempo redesign</strong> — Sprint length now sits as the centerpiece, with color-coded indicators showing whether your version divides cleanly into cycles. An animated timeline visualizes the breakdown.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Polished dropdowns</strong> — Native dropdowns have been replaced with a styled version that matches the rest of the app and supports keyboard navigation.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.3",
            date: "March 10, 2026",
            tags: ["New Feature", "Improvement"],
            type: "Features",
            title: "Drag-and-Drop & Unified Settings",
            description: (
                <>
                    <p>Two upgrades that take real friction out of daily use: reorder habits and goals by dragging, and find every setting in one place.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Drag-and-drop reordering</strong> — Reorder habits and goals with a smooth drag. The new order saves instantly.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">One Settings window</strong> — Account, Tempo, and General preferences now live in a single tabbed window. Password changes, avatar uploads, and account deletion all in one place.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Account deletion</strong> — Delete your account directly from Settings. A confirmation step prevents accidents, and everything is removed cleanly.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.2",
            date: "March 07, 2026",
            tags: ["Improvement"],
            type: "Features",
            title: "Design Consistency & Dashboard Polish",
            description: (
                <>
                    <p>A consistency pass across the entire app — same surfaces, same blues, same hover states everywhere.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Unified visual language</strong> — Every color and surface now comes from a single shared system, so the app looks coherent from screen to screen.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">No more forced scrolling</strong> — The Dashboard now fits cleanly in your viewport.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Charts and numbers now use the same font as the rest of the app.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Chart tooltips now appear above your cursor instead of below, so they no longer trigger page scroll on hover.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.1",
            date: "March 04, 2026",
            tags: ["Fix", "Improvement"],
            type: "Features",
            title: "Sign-In & Foundations Modernized",
            description: (
                <>
                    <p>Foundation-level work that makes El Portal faster, more secure, and easier to grow.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">New sign-in pipeline</strong> — Sign-in and verification now run on our own infrastructure, with faster, more reliable verification emails.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Modern foundation</strong> — Underlying request handling has been brought up to the latest version of our stack, opening the door for faster pages and new features.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span><strong className="text-zinc-200">Cleaner data model</strong> — Beliefs and Mantras are now one unified concept. Settings consolidated into a single, easier-to-manage place.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>General cleanup — unused files removed and overall project organization improved.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "2.0.0",
            date: "March 14, 2026",
            tags: ["Release"],
            type: "Release",
            title: "Version 2.0 — Official Release",
            description: (
                <>
                    <p>El Portal V2 is live. A ground-up rebuild delivering a true mobile experience, a refined visual language, and a completely overhauled interaction model. Every screen has been rethought.</p>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-950/30 border border-blue-900/50 mt-4">
                        <span className="material-symbols-outlined text-blue-200">rocket_launch</span>
                        <p className="text-sm font-medium text-blue-200">All existing user data has been seamlessly migrated. No action required.</p>
                    </div>
                </>
            ),
        },
        {
            version: "1.2.0",
            date: "March 15, 2026",
            tags: ["New Feature", "Optimization"],
            type: "Features",
            title: "Heatmaps & Smarter Progress",
            description: (
                <>
                    <p>Faster sync, sharper-looking charts, and offline support so your daily logs are never lost.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>A new habit-consistency curve that rewards staying on a streak — early consistency now matters as much as long ones.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Upgraded weekly progress charts and a new day-of-week heatmap that shows your strongest and weakest days.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Offline support — your day logs save locally and sync when you&apos;re back online.</span></li>
                    </ul>
                </>
            ),
        },
        {
            version: "1.1.5",
            date: "March 02, 2026",
            tags: ["Improvement"],
            type: "Features",
            title: "Cinema Mode Enhancements",
            description: (
                <>
                    <p>Visualizing your goals is a core mechanic of El Portal. Cinema Mode has been upgraded for better immersion and focus.</p>
                    <ul className="list-none space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>You can now edit the dynamic caption text overlaying the 5 persistent life slides: Me, Her, Purpose, Social, Material Life.</span></li>
                        <li className="flex items-start gap-2"><span className="text-zinc-700 mt-1">-</span><span>Smoother transitions between slides utilizing Framer Motion.</span></li>
                    </ul>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-950/30 border border-blue-900/50 mt-4">
                        <span className="material-symbols-outlined text-blue-200">info</span>
                        <p className="text-sm font-medium text-blue-200">Existing custom images from Supabase Storage will remain unaffected.</p>
                    </div>
                </>
            ),
        },
        {
            version: "1.1.0",
            date: "February 18, 2026",
            tags: ["New Feature"],
            type: "Features",
            title: "The Archives: Advanced Search Syntax",
            description: (
                <>
                    <p>Unlock the power of writing across My Routines, Mantra Archive, and Theory Notes.</p>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-950/30 border border-blue-900/50 mt-4">
                        <span className="material-symbols-outlined text-blue-200">edit_note</span>
                        <p className="text-sm font-medium text-blue-200">
                            Unleash the power of reflecting on your life and growth.
                        </p>
                    </div>
                </>
            ),
        },
        {
            version: "1.0.0",
            date: "January 26, 2026",
            tags: ["Release"],
            type: "Release",
            title: "Deployment of Version 1",
            description: (
                <>
                    <p>The initial release of El Portal.</p>
                </>
            ),
        },
    ];

    const filteredData = changelogData.filter(item => {
        if (filter === "All") return true;
        if (filter === "Features") return item.tags.some(t => t.toLowerCase().includes("feature") || t.toLowerCase().includes("improvement") || t.toLowerCase().includes("optimization"));
        if (filter === "Fixes") return item.tags.some(t => t.toLowerCase().includes("fix"));
        return true;
    });

    return (
        <div className="relative min-h-screen w-full flex-col overflow-x-hidden bg-zinc-950">
            {/* Background grid texture */}
            <div
                className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
                style={{
                    maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)"
                }}
            />

            {/* Subtle Top Radial Gradient */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-700/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

            <Navbar />

            <main className="relative z-10 mx-auto flex w-full max-w-[960px] flex-1 flex-col px-6 pt-56 pb-24 lg:px-10">
                {/* Title & Filter */}
                <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-black tracking-tight text-zinc-100 lg:text-5xl">Changelog</h1>
                        <p className="text-zinc-400 text-lg">Stay updated with our latest improvements and technical milestones.</p>
                    </div>

                    {/* Segmented Control (Shadcn Style) */}
                    <div className="flex h-9 items-center rounded-xl bg-zinc-900/80 p-1 border border-white/5 shadow-inner backdrop-blur-md">
                        {(["All", "Features", "Fixes"] as FilterType[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex h-full flex-1 items-center justify-center rounded-lg px-5 text-xs font-semibold shadow-sm transition-colors ${filter === f
                                    ? "bg-zinc-800 text-zinc-100" // Active state
                                    : "text-zinc-400 hover:text-zinc-300" // Inactive state
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Timeline Container */}
                <div className="relative mt-8">
                    {/* The absolute vertical line running exactly through the dots */}
                    <div className="absolute left-0 top-4 bottom-0 w-px bg-white/5 z-0 md:top-6" />

                    {filteredData.map((item, index) => (
                        <ChangelogItem
                            key={index}
                            version={item.version}
                            date={item.date}
                            tags={item.tags}
                            title={item.title}
                            description={item.description}
                        />
                    ))}

                    {filteredData.length === 0 && (
                        <div className="text-center py-12 border border-white/5 bg-zinc-900/50 rounded-xl">
                            <p className="text-zinc-400">No entries found for this category.</p>
                        </div>
                    )}
                </div>

            </main>

            <Footer />
        </div>
    );
}
