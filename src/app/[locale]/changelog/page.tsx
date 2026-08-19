import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChangelogItem, type ChangelogEntry } from "@/components/ChangelogItem";
import { buildPageMetadata } from "@/lib/seo";

const SECTION_BG = "#04060c";
const FG_STRONG = "#f4f6fb";
const FG = "#aab3c5";
const FG_MUTED = "#8590a8";
const ACCENT = "#4487D6";

const ENTRIES: ChangelogEntry[] = [
  {
    version: "2.0.28",
    date: "May 20, 2026",
    tags: ["Fix"],
    title: "Sign-in now lands where it should",
    body:
      "Google sign-in now routes entirely through the app — no more redirects that landed on an external URL. A class of quiet auth failures is gone, and the login screen handles dark browser themes correctly.",
    bullets: [
      {
        lead: "Clean OAuth flow",
        body:
          "After signing in with Google, you land on your dashboard — never on a raw external URL.",
      },
      {
        lead: "Autofill polished",
        body:
          "Browser-autofilled inputs on the login screen now match the dark theme; no more white flash when Chrome fills in your credentials.",
      },
      {
        lead: "Email links secured",
        body:
          "Magic link emails are built from the app's own domain, not whatever URL the server happened to see at send time.",
      },
    ],
  },
  {
    version: "2.0.27",
    date: "May 11, 2026",
    tags: ["New Feature"],
    title: "A guided tour for your first day",
    body:
      "New users now get a step-by-step walkthrough of El Portal — from creating your first Version to setting up your first Cycle. A spotlight marks exactly where to look; a connector points you to the right control. When you finish, you're ready for day one.",
    bullets: [
      {
        lead: "Step-by-step spotlight",
        body:
          "Each tour step dims everything except the one thing you need to act on, with a clear arrow pointing right to it.",
      },
      {
        lead: "Tab-by-tab coaching",
        body:
          "The tour walks through Version creation and Cycle setup section by section, inside the actual modals.",
      },
      {
        lead: "Smart for returning users",
        body:
          "If you already have a Version or Cycle, the tour skips the creation steps and shows you what you've built instead.",
      },
      {
        lead: "Replay anytime",
        body: "Restart the tour from Settings whenever you want a refresher.",
      },
    ],
  },
  {
    version: "2.0.26",
    date: "May 11, 2026",
    tags: ["Improvement"],
    title: "Archives is now a vault",
    body:
      "Archives has been reimagined as a quieter, more intentional space. Instead of a tab-heavy surface packed with sections, you arrive at a threshold — six stone names, generous space, no clutter. Each one opens into its own room.",
    bullets: [
      {
        lead: "Threshold Hall",
        body:
          "Six stones centered on the screen: Vision, Life Checklist, Routines, Theory Notes, Mantras, and Skills & Traits. Click one to enter.",
      },
      {
        lead: "Each stone, its own room",
        body:
          "Every section now lives on a dedicated page. Routines and Theory Notes let you drill into individual entries from their own mini hall.",
      },
      {
        lead: "Skills & Traits chip gallery",
        body:
          "Browse your skills and traits as chips. Add inline, double-click to edit, no modal needed.",
      },
      {
        lead: "Debrief History removed",
        body: "That section is gone. The vault is calmer for it.",
      },
    ],
  },
  {
    version: "2.0.25",
    date: "May 11, 2026",
    tags: ["Improvement"],
    title: "A new first impression",
    body:
      "The moment after you verify your email, El Portal now introduces itself properly — an animated welcome overlaid on the actual dashboard, so you see the real interface while being shown around it.",
    bullets: [
      {
        lead: "Overlay, not a detour",
        body:
          "Onboarding now sits on top of the dashboard instead of routing you to a separate page. You land in the right place from the start.",
      },
      {
        lead: "Post-verify welcome screen",
        body:
          "Right after email confirmation, you get a clear, calm introduction — what El Portal is, what you're consenting to, and what comes next.",
      },
      {
        lead: "Animated system intro",
        body:
          "Version, Cycle, and Day are introduced with motion that mirrors how the system actually works.",
      },
    ],
  },
  {
    version: "2.0.24",
    date: "May 06, 2026",
    tags: ["Improvement"],
    title: "Records page, rebuilt",
    body:
      "The database records page has been rebuilt with a cleaner, more focused interface. The heavy header is gone, a sliding indicator tracks your active tab, and single-key shortcuts let you navigate without lifting your hands from the keyboard.",
    bullets: [
      {
        lead: "Tab bar leads the page",
        body:
          "The titled header is gone. Versions, Cycles, Habits, and Objectives tabs are the first thing you see.",
      },
      {
        lead: "Sliding indicator",
        body:
          "A smooth highlight follows your active tab, consistent with how the Trends view works.",
      },
      {
        lead: "Keyboard shortcuts",
        body: "Press V, C, H, or O to jump directly to each tab.",
      },
      {
        lead: "Cleaner status badges",
        body:
          "Active and archived states now render as quiet, consistent pills.",
      },
    ],
  },
  {
    version: "2.0.23",
    date: "May 11, 2026",
    tags: ["Fix"],
    title: "Daily Pulse, now reliable",
    body:
      "Your daily insights and notifications were silently failing to run on most days. The scheduling infrastructure has been replaced — your morning data is there when you need it.",
    bullets: [
      {
        lead: "Insights run on time",
        body:
          "Moved off a scheduler that was dropping roughly 80% of its runs. Daily reports now fire consistently, every day.",
      },
      {
        lead: "Notifications stay timely",
        body:
          "The 15-minute notification check now runs on independent scheduling, decoupled from the daily report job.",
      },
      {
        lead: "No silent cutoffs",
        body:
          "Insight generation can now run to completion even for longer processing windows.",
      },
    ],
  },
  {
    version: "2.0.22",
    date: "May 02, 2026",
    tags: ["New Feature", "Improvement"],
    title: "Smarter insights — deeper patterns, cleaner cards",
    body:
      "Insights surfaces deeper patterns now: how a habit you do today ripples into tomorrow, which feelings tend to come together, and which behaviors actually move your daily score. Cards have been redesigned around a single signal-strength indicator.",
    bullets: [
      {
        lead: "Habits that ripple forward",
        body:
          "Insights now spots when a habit you do today predicts how a vital looks tomorrow or the day after.",
      },
      {
        lead: "Feelings as signals",
        body:
          "Discover which feelings tend to show up together, and which habits make a feeling more — or less — likely.",
      },
      {
        lead: "Habits vs. your score",
        body:
          "See exactly which habits are pulling your daily score and overall wellbeing up, and which ones aren't earning their place.",
      },
      {
        lead: "One status, three states",
        body:
          "Each insight card now uses a single circle: empty for emerging, half-filled for moderate, full for strong. No more rainbow categories.",
      },
      {
        lead: "Browse past reports",
        body:
          "Step back through your last ten reports with a floating control, and see at a glance when the next one will be ready.",
      },
    ],
  },
  {
    version: "2.0.21",
    date: "April 30, 2026",
    tags: ["New Feature", "Improvement"],
    title: "Privacy you control & a quieter look",
    body:
      "You now control exactly what data you share, and you can take it all back at any time. The visual language has been pulled toward something quieter and more confident — green and amber retired in favor of a single cohesive blue.",
    bullets: [
      {
        lead: "Three independent privacy switches",
        body:
          "One for your personal data, one for anonymous usage analytics, one for opt-in research. Each toggleable in Settings, all off by default.",
      },
      {
        lead: "Export everything, delete everything",
        body:
          "One click downloads your full data in a readable format. Another permanently erases it. Both protected by a confirmation step.",
      },
      {
        lead: "A new public Privacy page",
        body:
          "Plain-language explanation of what each switch covers, where your data lives, and exactly which rights you have.",
      },
      {
        lead: "A more cohesive palette",
        body:
          "Green is gone, amber and yellow are out of analytics, and the blue used everywhere now comes straight from the portal logo.",
      },
      {
        lead: "No cookies, full stop",
        body: "Anonymous analytics no longer set any cookies on your device.",
      },
    ],
    note: {
      icon: "lock",
      text:
        "Privacy by default. Granular consent. Full export and erasure on request.",
    },
  },
  {
    version: "2.0.20",
    date: "April 25, 2026",
    tags: ["New Feature"],
    title: "Cinema — fall into the photo",
    body:
      "Opening a Cinema slide no longer just fades in — the photo itself expands smoothly into the full view, and everything else assembles around it. Tap a slide and you fall into it.",
    bullets: [
      {
        lead: "The photo leads",
        body:
          "When you open a slide, the image you tapped grows smoothly into the full-bleed view. Text and chrome fade in afterward, so the photo always feels like the centerpiece.",
      },
      {
        lead: "Snappy close",
        body:
          "Hit ESC or the back arrow and the slide closes cleanly, no overshoot.",
      },
      {
        lead: "Keyboard friendly",
        body:
          "Arrow keys to navigate, ESC to close, page scroll locks while you're immersed.",
      },
      {
        body:
          "If your system asks for less motion, the morph drops to a simple crossfade.",
      },
    ],
  },
  {
    version: "2.0.19",
    date: "April 22, 2026",
    tags: ["New Feature", "Improvement"],
    title: "Insights tab & unified time pill",
    body:
      "The Insights tab is live with real correlations and a written narrative each report. Period and time-scale navigation across analytics has been collapsed into a single floating pill at the bottom of the screen.",
    bullets: [
      {
        lead: "Insights tab",
        body:
          "Surfaces patterns across your habits, feelings, and vitals — written up as a short narrative. Includes a blurred preview of what your insights will look like once you've logged enough data.",
      },
      {
        lead: "Floating period pill",
        body:
          "Scale and time navigation are now one control: tap to switch week / month / year, step forward or back with the chevrons. Sits at the bottom on mobile and respects the safe area.",
      },
      {
        lead: "Notifications tab",
        body:
          "Notifications and email settings moved into their own tab. Changes save automatically — no more Save button. Pick how often you want reports: biweekly, monthly, every cycle, or quarterly.",
      },
      {
        lead: "Pulse always one tap away",
        body:
          "The Pulse check-in shortcut now lives in the header on mobile, so it's reachable from any screen.",
      },
      {
        body:
          "Better keyboard navigation and screen-reader support across every analytics screen, plus translation polish.",
      },
    ],
  },
  {
    version: "2.0.18",
    date: "April 20, 2026",
    tags: ["Improvement", "Fix"],
    title: "Wordmark, new sidebar & sign-in fixes",
    body:
      "A refined logo lockup, a sidebar that lights up around the page you're on, and Google Sign-In has been rebuilt so it works reliably — including after you log out and back in.",
    bullets: [
      {
        lead: "Refined wordmark",
        body:
          "A consistent El Portal lockup now appears across auth screens, the privacy page, and emails. Same wordmark everywhere.",
      },
      {
        lead: "Volumetric sidebar",
        body:
          "The active page in the sidebar glows with a soft conical light and a subtle film-grain overlay. Subtle, but unmistakable when you scan the nav.",
      },
      {
        lead: "Smoother loading",
        body:
          "Flat skeleton placeholders have been replaced with a polished shimmer that cascades across each page while data loads.",
      },
      {
        lead: "Google Sign-In, fixed",
        body:
          "The button now actually appears on the page, the sign-in flow works first try, and logging out then back in no longer breaks.",
      },
    ],
  },
  {
    version: "2.0.17",
    date: "April 18, 2026",
    tags: ["New Feature"],
    title: "Trends — tabbed analytics dashboard",
    body:
      "The Trends page has been reorganized into five focused tabs and is now free for everyone. Each tab takes a different angle on your data — wellbeing, performance, cycles, insights, and reports.",
    bullets: [
      {
        lead: "Five tabs",
        body:
          "Wellbeing, Performance, Cycles, Insights, and Reports. The dashboard is now free; only AI-generated reports remain a Pro feature.",
      },
      {
        lead: "Performance tab",
        body:
          "Daily-score average, perfect-day rate, best streak, and a habit reliability table you can sort. A year-long heatmap shows the days you tend to slip and the days you tend to nail.",
      },
      {
        lead: "Cycles tab",
        body:
          "Cycle-over-cycle score chart with a trend line, scrollable cycle reports, goal-journey cards, an identity-evolution timeline, and a recurrence scanner that flags frictions showing up across multiple cycles.",
      },
      {
        lead: "Reports tab",
        body:
          "A polished report card with narrative, sparkline, and highlights. Export as PNG or PDF, or print it.",
      },
      {
        lead: "Mobile mirror",
        body:
          "Every tab has a fully native mobile version with proper touch targets and the floating period pill.",
      },
      {
        body:
          "Wellbeing tab adds a composite wellbeing score, a vitals radar, a mood-delta chart, and a sleep-consistency card. Available in all five languages.",
      },
    ],
  },
  {
    version: "2.0.16",
    date: "April 02, 2026",
    tags: ["Improvement", "Optimization"],
    title: "Trends — mobile, speed & polish",
    body:
      "The Trends dashboard runs noticeably faster and reads beautifully on phones. Sections load on demand, charts share one calm blue palette, and the empty state has been redesigned.",
    bullets: [
      {
        lead: "Mobile Trends",
        body:
          "Full mobile layout with a floating time navigator, single-column charts, and a week-only mood calendar with bigger touch targets.",
      },
      {
        lead: "Faster scrolling",
        body:
          "Charts below the fold now load only when you scroll near them. Skeleton placeholders show while data comes in.",
      },
      {
        lead: "Calmer palette",
        body:
          "Every chart and mood indicator now shares one cohesive blue gradient, from deep navy to bright cyan.",
      },
      {
        body:
          "Redesigned empty state with a softer gradient and progress bar. Mood calendar dots scale with intensity. Reduced-motion preferences respected.",
      },
    ],
  },
  {
    version: "2.0.15",
    date: "March 19, 2026",
    tags: ["New Feature"],
    title: "Trends — your Pulse data, visualized",
    body:
      "A full analytics dashboard for your Pulse data — mood trajectories, vitals, sleep, activities, emotions, and the behaviors statistically tied to your best and worst days.",
    bullets: [
      {
        lead: "Nine sections",
        body:
          "Mood trend, six vitals (sleep, energy, stress, performance, motivation, connectedness), mood calendar, sleep duration, activities and emotions breakdown, and consistency streaks.",
      },
      {
        lead: "Five time scales",
        body:
          "Week, month, year, cycle, version. Step through any period with previous and next.",
      },
      {
        lead: "What lifts you, what drags you",
        body:
          "Cards highlight the activities most linked to your highest- and lowest-mood days.",
      },
      {
        body:
          "Every chart shows how the current period compares to the previous one. Sample data appears blurred until you've logged enough check-ins. Available in all five languages.",
      },
    ],
    note: {
      icon: "lock",
      text: "Trends is a Pro-exclusive feature available to Lifetime members.",
    },
  },
  {
    version: "2.0.14",
    date: "March 19, 2026",
    tags: ["New Feature"],
    title: "Feedback page & lighter emails",
    body:
      "Send feedback directly from inside the app, and receive auth emails that look polished in any inbox — light or dark.",
    bullets: [
      {
        lead: "Feedback page",
        body:
          "Share thoughts without leaving the app. Your name, email, and plan auto-fill, and a small confirmation animation plays on send.",
      },
      {
        lead: "Lighter email design",
        body:
          "Verification and password emails now use a clean light layout that reads well in any inbox, with a branded footer linking back to the app.",
      },
    ],
  },
  {
    version: "2.0.13",
    date: "March 18, 2026",
    tags: ["New Feature"],
    title: "Daily Pulse — morning & evening check-ins",
    body:
      "Track your daily wellbeing through structured morning and evening check-ins. Daily Pulse captures mood, vitals, emotions, and activities, building up a rich picture of your life over time.",
    bullets: [
      {
        lead: "Morning check-in",
        body:
          "Four steps: mood, sleep quality, how you're feeling (24 emotions to pick from), and what you want to focus on today.",
      },
      {
        lead: "Evening check-in",
        body:
          "Eight steps covering mood, productivity, stress, motivation, energy, and connectedness on a 0–100 scale, plus what you felt and what you did.",
      },
      {
        lead: "MoodOrb",
        body:
          "A glowing sphere that breathes with your mood: the colors drift, the eyes open, the smile curves up. The orb is tied to El Portal's logo palette.",
      },
      {
        lead: "Pulse card on the dashboard",
        body:
          "Split morning and evening card with sun and moon animations, and clear badges for what's done.",
      },
      {
        body:
          "Subtle indicators on the dashboard, a floating shortcut on mobile when a check-in is pending, and customizable reminder timing in Settings.",
      },
    ],
    note: {
      icon: "lock",
      text: "Daily Pulse is a Pro-exclusive feature available to Lifetime members.",
    },
  },
  {
    version: "2.0.12",
    date: "April 01, 2026",
    tags: ["New Feature"],
    title: "Archives — rich-text editor & checklists",
    body:
      "The Archives have a real writing experience now: a rich-text editor with a floating toolbar, and interactive checklists you can tick directly inside your notes.",
    bullets: [
      {
        lead: "Rich-text editing",
        body:
          "Floating toolbar with bold, italic, headings, quotes, lists, links, and code blocks. Themed to match the El Portal glass look.",
      },
      {
        lead: "Interactive checklists",
        body:
          "Type a checkbox marker and it turns into a real checkbox you can toggle. Works in the dark theme with proper focus states.",
      },
      {
        lead: "Faster, calmer page",
        body:
          "The Archives have been reorganized for snappier load and easier reading.",
      },
      {
        body:
          "Polished typography across all five languages — curly quotes, en dashes, and proper ellipses.",
      },
    ],
  },
  {
    version: "2.0.11",
    date: "March 29, 2026",
    tags: ["New Feature", "Improvement"],
    title: "Day Inspector & multi-cycle goals",
    body:
      "The standalone History page has been folded into the Dashboard as an inline Day Inspector. The Goals page now lets you view your goals across multiple cycles.",
    bullets: [
      {
        lead: "Day Inspector",
        body:
          "Click any point on your performance chart to inspect and edit that day's habits without leaving the page. The view stays in the URL, so you can share it.",
      },
      {
        lead: "Multi-cycle goals",
        body:
          "Toggle between cycles to see your goals across time. Past-cycle goals stay locked but can be carried forward into the current cycle.",
      },
      {
        lead: "Snappier chart",
        body:
          "The progress chart now updates instantly when you tick a habit, with no perceptible lag.",
      },
    ],
  },
  {
    version: "2.0.10",
    date: "March 28, 2026",
    tags: ["Improvement", "Fix"],
    title: "Faster, cleaner & more accessible",
    body:
      "Pages load faster, every screen is now usable with a keyboard or screen reader, and Lab and Settings have been rebuilt for clarity.",
    bullets: [
      {
        lead: "Reorganized Lab",
        body:
          "Clearer sections for versions, cycles, goals, and habits. Editing a version now goes through a focused stepper.",
      },
      {
        lead: "Cleaner Settings",
        body:
          "Five tabs: Account, General, Appearance, Pulse, Storage. Easy to find what you're looking for.",
      },
      {
        lead: "Accessibility",
        body:
          "Twelve key parts of the app now work properly with screen readers and keyboard-only navigation. WCAG AA compliant.",
      },
      {
        lead: "Faster loading",
        body:
          "Pages fetch their data in parallel and only load heavy bits when they're actually needed. The whole app feels meaningfully snappier.",
      },
      {
        lead: "Identity toggle",
        body:
          "Turn the identity system on or off in Settings, and the related UI hides instantly across Lab, Dashboard, Archives, and the cycle editor.",
      },
      {
        body:
          "Version-creation modal redesigned with a stepper, plus subtle Raycast-style hover states on the habit list.",
      },
    ],
  },
  {
    version: "2.0.9",
    date: "March 16, 2026",
    tags: ["Improvement"],
    title: "Database page — cleaner & faster",
    body:
      "The Database page has been rebuilt for speed and consistency. Every entity now behaves the same way, and navigating between tabs feels noticeably quicker.",
    bullets: [
      {
        lead: "Unified actions",
        body:
          "Duplicate, edit, and delete now work the same way across versions, cycles, habits, and goals.",
      },
      {
        lead: "Snappier interactions",
        body:
          "Filtering and switching tabs feels instant, even on large databases.",
      },
      { body: "New polished segmented toggle with a subtle graphite variant." },
    ],
  },
  {
    version: "2.0.8",
    date: "March 15, 2026",
    tags: ["Fix", "Optimization"],
    title: "Quality pass — stability & polish",
    body:
      "A focused pass to fix subtle bugs, tighten up data handling, and clear out dead weight across every page.",
    bullets: [
      {
        lead: "Dashboard fix",
        body:
          "Resolved a rare ordering issue that could cause a chart to render incorrectly under specific conditions.",
      },
      {
        lead: "More accurate goal data",
        body:
          "Goals carry richer metadata now, with safer handling when fields are missing.",
      },
      {
        lead: "Cleaner under the hood",
        body: "Removed leftover diagnostics and unused code paths.",
      },
      {
        body:
          "A stray English string in non-English locales has been pulled into the proper translation.",
      },
    ],
  },
  {
    version: "2.0.4",
    date: "March 12, 2026",
    tags: ["New Feature"],
    title: "Mobile-first experience",
    body:
      "El Portal is no longer desktop-only. A full mobile experience has been built from the ground up with native-feeling navigation.",
    bullets: [
      {
        body:
          "Dedicated mobile screens for habits, goals, and analytics — built for touch and small screens.",
      },
      {
        lead: "Bottom tab bar",
        body: "for fast switching between the screens you use most.",
      },
      {
        body: "Mobile-friendly sheets replace desktop modals where it matters.",
      },
      {
        body:
          "Automatic mobile detection on first load — open the app on your phone and you land in the right place.",
      },
    ],
  },
  {
    version: "2.0.7",
    date: "March 14, 2026",
    tags: ["New Feature"],
    title: "Now in 5 languages",
    body:
      "El Portal now speaks your language. Every screen has been fully translated, and your language preference follows you across devices.",
    bullets: [
      {
        lead: "Five languages",
        body:
          "English, Spanish, Chinese (Simplified), Portuguese, and French.",
      },
      {
        body:
          "Your language preference syncs to your account, so it follows you to any device.",
      },
      { body: "Every screen, every label, every error message — fully translated." },
      { body: "Proper Chinese character rendering with a dedicated font." },
    ],
  },
  {
    version: "2.0.6",
    date: "March 14, 2026",
    tags: ["New Feature", "Fix"],
    title: "Password reset & security hardening",
    body:
      "A complete forgot-password flow, plus important security improvements to the auth layer.",
    bullets: [
      {
        lead: "Reset your password",
        body:
          "Forgot-password link on the login screen sends a branded email with a one-hour reset link, and a clean reset page handles the new password and confirmation.",
      },
      {
        lead: "Security hardened",
        body:
          "Internal cleanup to remove unused fallback credentials and tighten how email assets are served.",
      },
    ],
    note: {
      icon: "lock",
      text: "Security-first: no credentials are ever exposed in client-side code.",
    },
  },
  {
    version: "2.0.5",
    date: "March 14, 2026",
    tags: ["Improvement"],
    title: "Tempo redesign",
    body:
      "A visual overhaul of the Tempo screen and a new dropdown that finally feels at home in the dark theme.",
    bullets: [
      {
        lead: "Tempo redesign",
        body:
          "Sprint length now sits as the centerpiece, with color-coded indicators showing whether your version divides cleanly into cycles. An animated timeline visualizes the breakdown.",
      },
      {
        lead: "Polished dropdowns",
        body:
          "Native dropdowns have been replaced with a styled version that matches the rest of the app and supports keyboard navigation.",
      },
    ],
  },
  {
    version: "2.0.3",
    date: "March 10, 2026",
    tags: ["New Feature", "Improvement"],
    title: "Drag-and-drop & unified settings",
    body:
      "Two upgrades that take real friction out of daily use: reorder habits and goals by dragging, and find every setting in one place.",
    bullets: [
      {
        lead: "Drag-and-drop reordering",
        body:
          "Reorder habits and goals with a smooth drag. The new order saves instantly.",
      },
      {
        lead: "One Settings window",
        body:
          "Account, Tempo, and General preferences now live in a single tabbed window. Password changes, avatar uploads, and account deletion all in one place.",
      },
      {
        lead: "Account deletion",
        body:
          "Delete your account directly from Settings. A confirmation step prevents accidents, and everything is removed cleanly.",
      },
    ],
  },
  {
    version: "2.0.2",
    date: "March 07, 2026",
    tags: ["Improvement"],
    title: "Design consistency & dashboard polish",
    body:
      "A consistency pass across the entire app — same surfaces, same blues, same hover states everywhere.",
    bullets: [
      {
        lead: "Unified visual language",
        body:
          "Every color and surface now comes from a single shared system, so the app looks coherent from screen to screen.",
      },
      {
        lead: "No more forced scrolling",
        body: "The Dashboard now fits cleanly in your viewport.",
      },
      { body: "Charts and numbers now use the same font as the rest of the app." },
      {
        body:
          "Chart tooltips now appear above your cursor instead of below, so they no longer trigger page scroll on hover.",
      },
    ],
  },
  {
    version: "2.0.1",
    date: "March 04, 2026",
    tags: ["Fix", "Improvement"],
    title: "Sign-in & foundations modernized",
    body:
      "Foundation-level work that makes El Portal faster, more secure, and easier to grow.",
    bullets: [
      {
        lead: "New sign-in pipeline",
        body:
          "Sign-in and verification now run on our own infrastructure, with faster, more reliable verification emails.",
      },
      {
        lead: "Modern foundation",
        body:
          "Underlying request handling has been brought up to the latest version of our stack, opening the door for faster pages and new features.",
      },
      {
        lead: "Cleaner data model",
        body:
          "Beliefs and Mantras are now one unified concept. Settings consolidated into a single, easier-to-manage place.",
      },
      {
        body:
          "General cleanup — unused files removed and overall project organization improved.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "March 14, 2026",
    tags: ["Release"],
    isRelease: true,
    title: "Version 2.0 — Official release",
    body:
      "El Portal V2 is live. A ground-up rebuild delivering a true mobile experience, a refined visual language, and a completely overhauled interaction model. Every screen has been rethought.",
    note: {
      icon: "rocket",
      text:
        "All existing user data has been seamlessly migrated. No action required.",
    },
  },
  {
    version: "1.2.0",
    date: "March 15, 2026",
    tags: ["New Feature", "Optimization"],
    title: "Heatmaps & smarter progress",
    body:
      "Faster sync, sharper-looking charts, and offline support so your daily logs are never lost.",
    bullets: [
      {
        body:
          "A new habit-consistency curve that rewards staying on a streak — early consistency now matters as much as long ones.",
      },
      {
        body:
          "Upgraded weekly progress charts and a new day-of-week heatmap that shows your strongest and weakest days.",
      },
      {
        body:
          "Offline support — your day logs save locally and sync when you're back online.",
      },
    ],
  },
  {
    version: "1.1.5",
    date: "March 02, 2026",
    tags: ["Improvement"],
    title: "Cinema Mode enhancements",
    body:
      "Visualizing your goals is a core mechanic of El Portal. Cinema Mode has been upgraded for better immersion and focus.",
    bullets: [
      {
        body:
          "You can now edit the dynamic caption text overlaying the 5 persistent life slides: Me, Her, Purpose, Social, Material Life.",
      },
      { body: "Smoother transitions between slides utilizing Framer Motion." },
    ],
    note: {
      icon: "info",
      text:
        "Existing custom images from Supabase Storage will remain unaffected.",
    },
  },
  {
    version: "1.1.0",
    date: "February 18, 2026",
    tags: ["New Feature"],
    title: "The Archives — advanced search syntax",
    body:
      "Unlock the power of writing across My Routines, Mantra Archive, and Theory Notes.",
    note: {
      icon: "pen",
      text: "Unleash the power of reflecting on your life and growth.",
    },
  },
  {
    version: "1.0.0",
    date: "January 26, 2026",
    tags: ["Release"],
    isRelease: true,
    title: "Deployment of Version 1",
    body: "The initial release of El Portal.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata(locale, "changelog");
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative min-h-viewport w-full" style={{ background: SECTION_BG }}>
      {/* Atmospheric top-light radial — same recipe as CTA / Methodology */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[700px]"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 50% 0%, ${ACCENT}14, transparent 65%)`,
        }}
      />

      <Navbar />

      <main className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-28 pb-24 md:pt-36 lg:px-8">
        {/* Hero — Raycast-style: big bold heading, no subtitle */}
        <header className="mb-6 md:mb-10">
          <h1
            className="display text-balance leading-[1.05] text-[clamp(2rem,3.92vw+1.12rem,3rem)] md:text-[clamp(48px,6vw,80px)]"
            style={{
              color: FG_STRONG,
            }}
          >
            Changelog
          </h1>
          <p
            className="mt-5 max-w-xl text-[15px] leading-[1.6] md:text-base"
            style={{ color: FG }}
          >
            Every shipped change to El Portal — what&apos;s new, what&apos;s
            fixed, what got faster.
          </p>
        </header>

        {/* Top hairline anchoring the entry list */}
        <div
          aria-hidden
          className="h-px"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />

        {/* Entries — flat list with hairline dividers, sticky left rail */}
        <div>
          {ENTRIES.map((entry, i) => (
            <ChangelogItem
              key={entry.version + entry.date + i}
              entry={entry}
              isLast={i === ENTRIES.length - 1}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
