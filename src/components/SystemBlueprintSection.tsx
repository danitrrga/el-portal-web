import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  FlaskConical,
  LineChart,
  LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

/* ─── Monotone palette ─ white / grey / black only.
   No brand accent inside mockups — pure typographic hierarchy. */
const BG = "var(--color-ep-section-bg)"; // matches Hero section bg
const FG_STRONG = "var(--color-ep-fg-strong-white)";
const FG = "var(--color-ep-fg-body)";
const FG_MUTED = "var(--color-ep-fg-muted)";
const FG_SUBTLE = "var(--color-ep-fg-subtle)";
const RULE = "var(--color-ep-rule)";

// Stays a Server Component (getTranslations from next-intl/server) — this is
// a static marketing section with no interactivity, and adding a client
// directive here would ship it into the client bundle for no gain.
export default async function SystemBlueprintSection() {
  const t = await getTranslations("blueprint");

  return (
    <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-5xl">
        <div className="mx-auto grid gap-4 lg:grid-cols-2">
          {/* THE LAB — "The Lab" is a kept-English glossary term (nav.lab);
              only the description translates. */}
          <FeatureCard>
            <CardHeader className="pb-3">
              <CardHeading
                icon={FlaskConical}
                title={t("mockup.lab.cardTitle")}
                description={t("mockup.lab.cardDescription")}
              />
            </CardHeader>

            <div className="relative mb-6 mt-auto border-t border-dashed sm:mb-0">
              <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,hsl(var(--muted)),white_125%)]"></div>
              <div className="aspect-[76/59] p-1 px-6">
                <MockupFrame>
                  <LabMockup />
                </MockupFrame>
              </div>
            </div>
          </FeatureCard>

          {/* TRENDS — "Trends" is a kept-English glossary term (nav.trends,
              D-01); only the description translates. */}
          <FeatureCard>
            <CardHeader className="pb-3">
              <CardHeading
                icon={LineChart}
                title={t("mockup.trends.cardTitle")}
                description={t("mockup.trends.cardDescription")}
              />
            </CardHeader>

            <div className="relative mb-6 mt-auto border-t border-dashed sm:mb-0">
              <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,hsl(var(--muted)),white_125%)]"></div>
              <div className="aspect-[76/59] p-1 px-6">
                <MockupFrame>
                  <TrendsMockup />
                </MockupFrame>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

/* ─── Mockup frame — pure black surface ──────────────────────────── */
function MockupFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: BG }}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   LabMockup — minimal monotone Cycle 6 view.
   Adapted from el-portal/src/components/lab/CycleCard.tsx, stripped of
   all card chrome — just typographic hierarchy.
   Sections shown: Priorities · Friction · Goals (collapsed)
   ──────────────────────────────────────────────────────────────────── */
// Progress percentages are illustrative UI data, not text — they cannot
// legitimately differ between locales, so they stay in code, index-aligned
// with the catalogue's `mockup.lab.goals` array (see 07-07-PLAN.md Task 1).
const GOAL_PROGRESS = [13, 33, 0, 9];

async function LabMockup() {
  const t = await getTranslations("blueprint");
  const priorities = t.raw("mockup.lab.priorities") as string[];
  const frictionItems = t.raw("mockup.lab.frictionItems") as string[];
  const goals = t.raw("mockup.lab.goals") as string[];

  return (
    <div className="absolute inset-0 overflow-hidden flex flex-col px-6 py-5">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <ChevronDown size={14} style={{ color: FG_MUTED }} />
          <h2
            className="text-[15px] font-bold tracking-tight"
            style={{ color: FG_STRONG }}
          >
            {t("mockup.lab.cycleName")}
          </h2>
          <span
            className="text-[9px] font-bold uppercase tracking-[0.18em]"
            style={{ color: FG_MUTED }}
          >
            {t("mockup.lab.activeLabel")}
          </span>
        </div>
        <span
          className="text-[11px]"
          style={{ color: FG_SUBTLE }}
        >
          {t("mockup.lab.dateRange")}
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-4">
        {/* PRIORITIES */}
        <SectionLabel>{t("mockup.lab.prioritiesLabel")}</SectionLabel>
        <div className="space-y-1.5">
          {priorities.map((p, i) => (
            <div
              key={p}
              className="flex items-baseline gap-3"
            >
              <span
                className="text-[11px] font-bold tabular-nums"
                style={{ color: FG_SUBTLE }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="text-[13px] font-medium"
                style={{ color: FG_STRONG }}
              >
                {p}
              </span>
            </div>
          ))}
        </div>

        {/* divider */}
        <div className="h-px" style={{ background: RULE }} />

        {/* FRICTION */}
        <SectionLabel>{t("mockup.lab.frictionLabel")}</SectionLabel>
        <ul className="space-y-1.5">
          {frictionItems.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2.5 text-[12px] leading-[1.4]"
              style={{ color: FG }}
            >
              <span
                className="mt-[6px] w-[5px] h-[5px] rounded-full flex-shrink-0"
                style={{ background: "#ef4444" }}
              />
              {f}
            </li>
          ))}
        </ul>

        {/* divider */}
        <div className="h-px" style={{ background: RULE }} />

        {/* GOALS (collapsed) */}
        <SectionLabel>{t("mockup.lab.goalsLabel")}</SectionLabel>
        <div className="space-y-1">
          {goals.map((title, i) => {
            const pct = GOAL_PROGRESS[i];
            return (
              <div
                key={title}
                className="flex items-baseline justify-between gap-3"
              >
                <span
                  className="text-[13px] font-medium truncate"
                  style={{ color: FG_STRONG }}
                >
                  {title}
                </span>
                <span
                  className="text-[12px] font-bold tabular-nums flex-shrink-0"
                  style={{ color: pct === 0 ? FG_SUBTLE : FG }}
                >
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   TrendsMockup — minimal monotone Insights view.
   Adapted from el-portal/src/components/trends/InsightCard.tsx +
   InsightCardRow.tsx — weekly summary + correlation data points.
   No tag cards, no meter bars — just the correlations.
   ──────────────────────────────────────────────────────────────────── */
// Correlation strength/polarity/lift are illustrative UI data driving icon
// and color logic, not text — they cannot legitimately differ between
// locales, so they stay in code, index-aligned with the catalogue's
// `mockup.trends.insights` array (see 07-07-PLAN.md Task 1).
const INSIGHT_META: {
  lift: number;
  polarity: "positive" | "negative";
  strength: "strong" | "moderate" | "low";
  isNew: boolean;
}[] = [
  { lift: 28, polarity: "positive", strength: "strong", isNew: true },
  { lift: 16, polarity: "positive", strength: "moderate", isNew: true },
  { lift: 12, polarity: "negative", strength: "low", isNew: false },
];

type TranslatedInsight = { headline: string; body: string; date: string };

async function TrendsMockup() {
  const t = await getTranslations("blueprint");
  const insights = t.raw("mockup.trends.insights") as TranslatedInsight[];

  return (
    <div className="absolute inset-0 overflow-hidden flex flex-col px-6 py-5">
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-4">
        {/* WEEKLY SUMMARY */}
        <SectionLabel>{t("mockup.trends.weeklySummaryLabel")}</SectionLabel>
        <p className="text-[12px] leading-[1.55]" style={{ color: FG }}>
          {t("mockup.trends.summaryBody")}{" "}
          <span style={{ color: FG_STRONG }}>
            {t("mockup.trends.summaryHighlight")}
          </span>
        </p>

        {/* divider */}
        <div className="h-px" style={{ background: RULE }} />

        {/* WHAT YOUR DATA REVEALS — insight cards */}
        <SectionLabel>{t("mockup.trends.dataRevealsLabel")}</SectionLabel>
        <div className="space-y-2">
          {insights.map((insight, i) => (
            <InsightRow
              key={insight.headline}
              insight={{ ...insight, ...INSIGHT_META[i] }}
              newBadgeLabel={t("mockup.trends.newBadge")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── InsightRow — adapted from el-portal trends/InsightCardRow.tsx ─ */
function InsightRow({
  insight,
  newBadgeLabel,
}: {
  insight: {
    headline: string;
    body: string;
    lift: number;
    polarity: "positive" | "negative";
    strength: "strong" | "moderate" | "low";
    isNew: boolean;
    date: string;
  };
  newBadgeLabel: string;
}) {
  const arrow = insight.polarity === "positive" ? "↑" : "↓";

  return (
    <div className="flex items-start gap-2.5">
      {/* Strength circle */}
      <div className="pt-[3px] shrink-0">
        <StrengthCircle level={insight.strength} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className="text-[12px] font-semibold leading-[1.3] tracking-[-0.01em]"
            style={{ color: FG_STRONG }}
          >
            {insight.headline}
          </p>
          <span
            className="text-[12px] tabular-nums font-semibold shrink-0 leading-[1.3]"
            style={{ color: FG_STRONG }}
          >
            {arrow}
            {insight.lift}%
          </span>
        </div>
        <p
          className="text-[11px] mt-1 leading-[1.4]"
          style={{ color: FG_MUTED }}
        >
          {insight.body}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          {insight.isNew && (
            <span
              className="text-[8.5px] uppercase tracking-[0.1em] font-semibold rounded-full px-1.5 py-[1px]"
              style={{
                background: "var(--color-ep-text-glow-white)",
                color: FG_STRONG,
              }}
            >
              {newBadgeLabel}
            </span>
          )}
          <span
            className="text-[10px] ml-auto tabular-nums"
            style={{ color: FG_SUBTLE }}
          >
            {insight.date}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── StrengthCircle — monotone version of el-portal's primitive ── */
function StrengthCircle({
  level,
  size = 11,
}: {
  level: "strong" | "moderate" | "low";
  size?: number;
}) {
  const r = size / 2 - 1;
  const c = size / 2;

  if (level === "strong") {
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shrink-0"
      >
        <circle cx={c} cy={c} r={r} fill={FG_STRONG} />
      </svg>
    );
  }

  if (level === "moderate") {
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shrink-0"
      >
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={FG_STRONG}
          strokeWidth={1.25}
        />
        <path
          d={`M ${c} ${c - r} A ${r} ${r} 0 0 1 ${c} ${c + r} Z`}
          fill={FG_STRONG}
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
    >
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke={FG_SUBTLE}
        strokeWidth={1.25}
      />
    </svg>
  );
}

/* ─── Section label — uppercase tracked eyebrow ──────────────────── */
function SectionLabel({
  icon: Icon,
  children,
}: {
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <h3
      className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.22em]"
      style={{ color: FG_MUTED }}
    >
      {Icon && <Icon size={9} />}
      {children}
    </h3>
  );
}

/* ─── FeatureCard wrapper + decorator (tailark features-10) ────── */
interface FeatureCardProps {
  children: ReactNode;
  className?: string;
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
  <Card
    className={cn(
      "group relative rounded-none border-0 shadow-none flex flex-col",
      className,
    )}
    style={{ background: BG }}
  >
    <CardDecorator />
    {children}
  </Card>
);

const CardDecorator = () => {
  const LINE = "var(--color-ep-white-dim)";
  return (
    <>
      {/* Corner brackets — anchor points for the trace */}
      <span className="border-white absolute -left-px -top-px block size-2 border-l-2 border-t-2 z-10" />
      <span className="border-white absolute -right-px -top-px block size-2 border-r-2 border-t-2 z-10" />
      <span className="border-white absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 z-10" />
      <span className="border-white absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 z-10" />

      {/* Edge traces — thin lines that fade where they approach the brackets */}
      <span
        aria-hidden
        className="absolute top-0 left-2 right-2 h-px pointer-events-none"
        style={{
          background: `linear-gradient(to right, transparent 0%, ${LINE} 12%, ${LINE} 88%, transparent 100%)`,
        }}
      />
      <span
        aria-hidden
        className="absolute bottom-0 left-2 right-2 h-px pointer-events-none"
        style={{
          background: `linear-gradient(to right, transparent 0%, ${LINE} 12%, ${LINE} 88%, transparent 100%)`,
        }}
      />
      <span
        aria-hidden
        className="absolute left-0 top-2 bottom-2 w-px pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${LINE} 12%, ${LINE} 88%, transparent 100%)`,
        }}
      />
      <span
        aria-hidden
        className="absolute right-0 top-2 bottom-2 w-px pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${LINE} 12%, ${LINE} 88%, transparent 100%)`,
        }}
      />
    </>
  );
};

interface CardHeadingProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
  <div className="px-6 pt-6 pb-0">
    <span className="text-muted-foreground flex items-center gap-2">
      <Icon className="size-4" />
      {title}
    </span>
    {/* No min-h — heading flows naturally. FeatureCard uses flex-col +
        mt-auto on the mockup wrapper to pin mockups to the bottom of the
        card. Grid stretches both cards to equal height, so mockups
        bottom-align regardless of heading length. */}
    <p className="mt-6 text-2xl font-semibold">{description}</p>
  </div>
);
