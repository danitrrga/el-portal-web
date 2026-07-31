import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CopyButton } from "@/components/CopyButton";

/* ─── Data ────────────────────────────────────────────────────────── */

interface Tool {
  name: string;
  description: string;
  params: string;
  returns: string;
}

const readTools: Tool[] = [
  {
    name: "portal_snapshot",
    description:
      "Full dashboard state. Active cycle, habits with streaks and done_today, goals, daily score. Optional sections: pulse_today, archives, identity, mantras.",
    params: 'include?: ("pulse_today" | "archives" | "identity" | "mantras")[]',
    returns:
      "Snapshot object with cycle, habits array, goals array, daily score, and any requested optional sections.",
  },
  {
    name: "portal_review",
    description:
      "Cycle review data. Daily scores, habit consistency percentages, days remaining.",
    params: 'include?: ("insights" | "pulse_history" | "debrief_stats")[]',
    returns:
      "Review object with scores array, consistency map, days remaining, and optional extras.",
  },
  {
    name: "portal_history",
    description:
      "Browse past versions, cycles, or debriefs. Filter by version or status.",
    params: 'type: "version" | "cycle" | "debrief", version?: string, status?: string',
    returns: "Array of matching historical records ordered by creation date.",
  },
  {
    name: "portal_search",
    description:
      "Full-text search across goals, habits, archives, and mantras. Up to 50 results.",
    params: "query: string, limit?: number (max 50)",
    returns: "Array of matching entities with type, id, title, and excerpt.",
  },
];

const writeTools: Tool[] = [
  {
    name: "portal_log_habits",
    description:
      "Log habits done or undone for any date. Upsert-safe. Batch up to 30. Returns updated streaks and daily score.",
    params:
      "entries: { habit_id: string; status: boolean; date?: string }[], up to 30",
    returns: "Array of updated habit records with current streak and revised daily score.",
  },
  {
    name: "portal_pulse",
    description:
      "Read or write morning/evening pulse check-ins. Covers mood, energy, sleep, stress, performance, feelings, and reflection.",
    params:
      'action: "read" | "write", section: "morning" | "evening", data?: PulseData',
    returns: "Current pulse check-in data for the given section, or confirmation of write.",
  },
  {
    name: "portal_create_cycle",
    description:
      "Create a complete cycle in one call: goals, habits, priorities, mantras, and carry-over goals from previous cycles.",
    params:
      "title: string, goals: Goal[], habits: Habit[], priorities?: string[], mantras?: string[], carry_over?: string[]",
    returns: "Created cycle object with all nested entities and generated IDs.",
  },
  {
    name: "portal_debrief_cycle",
    description:
      "Close a cycle. Server computes stats (average score, top habits, goal completion rate). You provide the reflection.",
    params: "cycle_id: string, reflection: string",
    returns:
      "Debrief record with server-computed stats, reflection text, and closed cycle summary.",
  },
  {
    name: "portal_create",
    description:
      "Create new entities: version, goal, habit, archive, mantra, or identity item. Batch up to 10.",
    params: "entities: { type: EntityType; data: EntityData }[], up to 10",
    returns: "Array of created entities with generated IDs and timestamps.",
  },
  {
    name: "portal_update",
    description: "Partial update any entity type. Batch up to 10 operations.",
    params:
      "operations: { type: EntityType; id: string; data: Partial<EntityData> }[], up to 10",
    returns: "Array of updated entities reflecting the applied changes.",
  },
  {
    name: "portal_delete",
    description:
      "Delete entities by ID. Cascades where applicable. Batch up to 10.",
    params: "items: { type: EntityType; id: string }[], up to 10",
    returns: "Confirmation array with deleted IDs and cascade summary per item.",
  },
  {
    name: "portal_settings",
    description: "Read or update your user profile and app preferences.",
    params: 'action: "read" | "update", data?: Partial<UserSettings>',
    returns: "Current or updated user settings object.",
  },
];

/* ─── Code strings ────────────────────────────────────────────────── */

const STDIO_CONFIG = `{
  "mcpServers": {
    "el-portal": {
      "type": "stdio",
      "command": "cmd",
      "args": [
        "/c", "npx", "tsx",
        "--env-file-if-exists=.env.local",
        "--tsconfig", "tsconfig.json",
        "src/mcp/index.ts"
      ],
      "env": {
        "PORTAL_API_KEY": "ep_YOUR_KEY_HERE"
      }
    }
  }
}`;

const HTTP_CONFIG = `POST https://app.el-portal.app/api/mcp
Authorization: Bearer ep_YOUR_KEY_HERE
Content-Type: application/json`;

const EXAMPLE_SNAPSHOT = `{
  "method": "tools/call",
  "params": {
    "name": "portal_snapshot",
    "arguments": {
      "include": ["pulse_today"]
    }
  }
}`;

const EXAMPLE_LOG_HABIT = `{
  "method": "tools/call",
  "params": {
    "name": "portal_log_habits",
    "arguments": {
      "entries": [
        { "habit_id": "your-habit-uuid", "status": true }
      ]
    }
  }
}`;

const EXAMPLE_MORNING = `{
  "method": "tools/call",
  "params": {
    "name": "portal_pulse",
    "arguments": {
      "action": "write",
      "section": "morning",
      "data": {
        "sleep_quality": "good",
        "morning_mood": "energized",
        "one_thing": "Finish the MCP docs"
      }
    }
  }
}`;

/* ─── Shared primitives ───────────────────────────────────────────── */

/**
 * `tabIndex={0}` is required: the <pre> scrolls horizontally, and a
 * scrollable region must be keyboard-reachable (axe `scrollable-region-focusable`).
 * But a focus stop with no role and no accessible name announces as nothing —
 * five silent stops per /mcp visit. `role="region"` + `aria-label` is what turns
 * each one into a named landmark a screen reader can announce and skip.
 */
function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="relative group">
      <pre
        tabIndex={0}
        role="region"
        aria-label={`${label} — code sample`}
        className="rounded-lg bg-zinc-900 border border-zinc-800/60 px-4 py-3.5 pr-20 text-[13px] font-mono text-zinc-300 leading-[1.65] overflow-x-auto"
      >
        <code>{code}</code>
      </pre>
      <CopyButton value={code} />
    </div>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[12px] text-zinc-300 bg-zinc-800/60 px-1.5 py-0.5 rounded">
      {children}
    </code>
  );
}

function H2({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="text-zinc-100 text-base font-semibold tracking-tight mt-14 mb-5 scroll-mt-24 pb-3 border-b border-zinc-800/60"
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-zinc-300 text-sm font-medium mt-6 mb-2">{children}</h3>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-zinc-400 text-sm leading-7">{children}</p>
  );
}

function ToolRow({ tool, write }: { tool: Tool; write: boolean }) {
  return (
    <details className="group border-b border-zinc-800/50 last:border-0">
      <summary className="flex items-center justify-between py-3 cursor-pointer list-none">
        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] font-mono font-medium w-8 shrink-0 ${
              write ? "text-amber-500/70" : "text-blue-400/85"
            }`}
          >
            {write ? "write" : "read"}
          </span>
          <code className="text-sm font-mono text-zinc-200">{tool.name}</code>
        </div>
        <svg
          className="w-3.5 h-3.5 text-zinc-600 transition-transform duration-200 group-open:rotate-180 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </summary>
      <div className="pb-4 pl-11 space-y-3">
        <p className="text-sm text-zinc-400 leading-6">{tool.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1.5">
              Parameters
            </p>
            <p className="text-xs font-mono text-zinc-400 leading-5">{tool.params}</p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1.5">
              Returns
            </p>
            <p className="text-xs text-zinc-400 leading-5">{tool.returns}</p>
          </div>
        </div>
      </div>
    </details>
  );
}

/* ─── TOC ─────────────────────────────────────────────────────────── */

const tocItems = [
  { id: "capabilities", label: "Capabilities" },
  { id: "getting-started", label: "Getting started" },
  { id: "tool-reference", label: "Tool reference" },
  { id: "examples", label: "Examples" },
  { id: "permissions", label: "Permissions" },
] as const;

/* ─── Page ────────────────────────────────────────────────────────── */

export default function McpPage() {
  return (
    <div className="relative w-full bg-zinc-950 min-h-viewport">
      <Navbar />

      <div className="mx-auto max-w-5xl px-6 md:px-8 pt-32 pb-24">
        <div className="flex gap-16 items-start">

          {/* ── Main content ─────────────────────────────────── */}
          <main className="flex-1 min-w-0">

            {/* Hero */}
            <div className="mb-12">
              <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-4">
                Model Context Protocol
              </p>
              <h1 className="text-zinc-100 text-3xl font-semibold tracking-tight mb-4 leading-snug">
                Connect your AI agent to El Portal.
              </h1>
              <Para>
                The El Portal MCP server exposes your personal operating system
                to any MCP-compatible AI client. Read your cycle state, log
                habits, and run daily check-ins without leaving your agent
                workflow.
              </Para>
              <div className="flex items-center gap-4 mt-5 text-[12px] font-mono text-zinc-400">
                <span>12 tools</span>
                <span>stdio + HTTP</span>
                <span>JSON-RPC 2.0</span>
              </div>
            </div>

            {/* ── Capabilities ─────────────────────────────────── */}
            <H2 id="capabilities">Capabilities</H2>
            <Para>
              Read tools are granted on all keys by default. Write tools require
              explicit opt-in at key creation time.
            </Para>

            <H3>Read tools</H3>
            <div className="rounded-lg border border-zinc-800/60 overflow-hidden mb-6">
              {readTools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex gap-4 px-4 py-3 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/50 transition-colors duration-150"
                >
                  <code className="text-sm font-mono text-zinc-200 shrink-0 w-44">
                    {tool.name}
                  </code>
                  <p className="text-sm text-zinc-400 leading-5 min-w-0">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>

            <H3>Write tools</H3>
            <div className="rounded-lg border border-zinc-800/60 overflow-hidden">
              {writeTools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex gap-4 px-4 py-3 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/50 transition-colors duration-150"
                >
                  <code className="text-sm font-mono text-zinc-200 shrink-0 w-44">
                    {tool.name}
                  </code>
                  <p className="text-sm text-zinc-400 leading-5 min-w-0">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Getting started ──────────────────────────────── */}
            <H2 id="getting-started">Getting started</H2>

            <div className="space-y-8">
              {/* Step 1 */}
              <div>
                <H3>1. Generate an API key</H3>
                <Para>
                  Go to{" "}
                  <span className="text-zinc-300">Settings &gt; API Keys</span>{" "}
                  in El Portal. Your key is shown once on creation. Copy it
                  immediately. Keys start with <InlineCode>ep_</InlineCode>{" "}
                  followed by 64 hex characters. SHA-256 hashed before storage,
                  never recoverable after creation. Up to 10 active keys per
                  account, with optional expiry up to 365 days.
                </Para>
              </div>

              {/* Step 2 */}
              <div>
                <H3>2. Choose a transport</H3>
                <Para>
                  Use <span className="text-zinc-300">stdio</span> for local AI
                  tools (Cursor, Claude Desktop, Continue). Use{" "}
                  <span className="text-zinc-300">HTTP</span> for web-based
                  agents or custom server-side integrations.
                </Para>
              </div>

              {/* Step 3 */}
              <div>
                <H3>3. Add your config</H3>
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-2 mt-4">
                  Stdio (.mcp.json)
                </p>
                <CodeBlock code={STDIO_CONFIG} label="Stdio .mcp.json config" />
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-2 mt-5">
                  HTTP endpoint
                </p>
                <CodeBlock code={HTTP_CONFIG} label="HTTP endpoint config" />
              </div>
            </div>

            {/* ── Tool reference ───────────────────────────────── */}
            <H2 id="tool-reference">Tool reference</H2>
            <Para>
              All tools use JSON-RPC 2.0 via the MCP protocol. Expand each
              entry for parameter shapes and return values.
            </Para>

            <div className="mt-6 rounded-lg border border-zinc-800/60 px-4">
              {readTools.map((tool) => (
                <ToolRow key={tool.name} tool={tool} write={false} />
              ))}
              {writeTools.map((tool) => (
                <ToolRow key={tool.name} tool={tool} write={true} />
              ))}
            </div>

            {/* ── Examples ─────────────────────────────────────── */}
            <H2 id="examples">Examples</H2>

            <H3>Get today&apos;s snapshot</H3>
            <CodeBlock code={EXAMPLE_SNAPSHOT} label="Get today's snapshot" />

            <H3>Log a habit</H3>
            <CodeBlock code={EXAMPLE_LOG_HABIT} label="Log a habit" />

            <H3>Morning check-in</H3>
            <CodeBlock code={EXAMPLE_MORNING} label="Morning check-in" />

            {/* ── Permissions ──────────────────────────────────── */}
            <H2 id="permissions">Permissions and rate limits</H2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
              {/* Permission model */}
              <div className="rounded-lg border border-zinc-800/60 p-5">
                <p className="text-sm font-medium text-zinc-300 mb-4">
                  Permission model
                </p>
                <ul className="space-y-3.5">
                  <li>
                    <p className="text-[11px] font-mono text-blue-400/85 uppercase tracking-wider mb-1">
                      read
                    </p>
                    <p className="text-xs text-zinc-400 leading-5">
                      Granted on all keys by default. No extra configuration
                      required.
                    </p>
                  </li>
                  <li>
                    <p className="text-[11px] font-mono text-amber-500/70 uppercase tracking-wider mb-1">
                      write
                    </p>
                    <p className="text-xs text-zinc-400 leading-5">
                      Opt-in per key. Toggle individual write tools during key
                      creation or in key settings.
                    </p>
                  </li>
                  <li>
                    <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                      storage
                    </p>
                    <p className="text-xs text-zinc-400 leading-5">
                      Keys are SHA-256 hashed before storage. Plaintext is never
                      stored and cannot be recovered after creation.
                    </p>
                  </li>
                </ul>
              </div>

              {/* Rate limits */}
              <div className="rounded-lg border border-zinc-800/60 p-5">
                <p className="text-sm font-medium text-zinc-300 mb-4">
                  Rate limits
                </p>
                <table className="w-full">
                  <tbody className="divide-y divide-zinc-800/50">
                    {(
                      [
                        ["Read tools", "Unlimited"],
                        ["Write tools", "30 / min"],
                        ["Key creation", "5 / hr"],
                        ["Active keys", "10 per account"],
                      ] as const
                    ).map(([op, limit]) => (
                      <tr key={op}>
                        <td className="text-xs text-zinc-400 py-2">{op}</td>
                        <td className="text-xs text-zinc-400 text-right py-2 font-mono">
                          {limit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-14 pt-8 border-t border-zinc-800/60">
              <p className="text-zinc-100 text-base font-medium mb-2">
                Ready to connect?
              </p>
              <p className="text-sm text-zinc-400 mb-5">
                Generate your first API key in Settings and drop it into your
                MCP config. Full read access in under a minute.
              </p>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.el-portal.app'}/settings`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-100 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2 rounded-lg transition-colors duration-150 min-h-11 md:min-h-0"
              >
                Open Settings
                <svg
                  className="w-3.5 h-3.5 text-zinc-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </main>

          {/* ── Sticky TOC ───────────────────────────────────────── */}
          <aside className="hidden xl:block w-44 shrink-0">
            <div className="sticky top-28">
              <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mb-3">
                On this page
              </p>
              <nav aria-label="On this page">
                <ul className="space-y-1">
                  {tocItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block text-xs text-zinc-400 hover:text-zinc-300 py-0.5 transition-colors duration-150"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

        </div>
      </div>

      <Footer />
    </div>
  );
}
