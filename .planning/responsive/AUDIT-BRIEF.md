# Mobile Audit — Agent Brief

> The contract every spawned audit agent receives. Paste the **Prompt template**
> at the bottom, substituting the assigned surface from
> [`SURFACES.md`](./SURFACES.md).
>
> First fleet run is **audit only** — no agent writes to `src/`.

---

## Why this brief exists

Without it, N agents produce N differently-shaped reports, half of them
speculative ("this *might* overflow on mobile"), and the findings can't be
compared, deduplicated, or prioritised. The brief makes every agent produce the
same artifact against the same rules with the same evidence standard.

---

## Required reading (every agent, every run)

| Doc | Why |
|---|---|
| [`../codebase/design/RESPONSIVE.md`](../codebase/design/RESPONSIVE.md) | **The rules being audited against.** A finding that doesn't map to a rule here is out of scope. |
| [`../codebase/design/ANTI-PATTERNS.md`](../codebase/design/ANTI-PATTERNS.md) | Permanent bans that still apply. |
| [`SURFACES.md`](./SURFACES.md) | Assigned surface, the dead-code exclusion list, the 16 pre-seeded findings, and the verified non-issues. |
| `CLAUDE.md` | Project-wide constraints (token usage, banned utilities, component rules). |

---

## Hard constraints

1. **Read-only.** Do not edit anything under `src/`. Propose diffs in the report;
   do not apply them.
2. **The desktop design is frozen and approved.** Every proposed fix must be
   *additive*: a mobile-first default plus `md:`/`lg:` that restores today's
   desktop value. A proposal that changes rendering at ≥768px is rejected on
   sight, however much better it looks.
3. **Do not audit dead code.** The exclusion list in `SURFACES.md` is
   import-graph-verified. If you believe something on it is actually live, say
   so and stop — don't audit it speculatively.
4. **Do not re-report the verified non-issues** (all grids already stack; no
   unprefixed large type utilities).
5. **Evidence or silence.** See below.

---

## The evidence standard

This is the part that matters most.

> **Every finding must carry either (a) harness output, or (b) a specific
> `file:line` plus the concrete value that violates a named rule.**
>
> "This may not look good on mobile" is not a finding. Delete it.

Three acceptable evidence forms:

| Form | Example |
|---|---|
| **Harness output** | `npm run audit:overflow -- --project=mobile-360` → attached `overflow-offenders` JSON naming `div.absolute.w-[1200px]` overflowing by 840px |
| **Measured value vs rule** | `ReadingLayout.tsx:14` sets `w-[1200px]`; RESPONSIVE.md forbids fixed `w-[NNNpx]` on anything rendering at mobile widths; 1200 > 360 floor by 840px |
| **Computed style at viewport** | Playwright `getComputedStyle` showing `min-height: 100vh` where the contract requires `svh` |

If you suspect a problem but cannot evidence it, put it in a separate
**"Unverified suspicions"** section. Do not mix it into findings.

---

## Running the harness

The harness is already installed and green-on-build. From the repo root:

```bash
npm run audit:responsive                      # full matrix, all specs
npm run audit:overflow                        # horizontal overflow only
npm run audit:a11y                            # axe, incl. WCAG 2.2 target-size
npm run audit:targets                         # 44px AAA touch targets
npm run audit:report                          # open the HTML report

# scope to one viewport (much faster while iterating):
npx playwright test --project=mobile-360
npx playwright test --project=reflow-320 overflow.spec.ts
```

Projects: `reflow-320` · `mobile-360` · `mobile-390` · `mobile-430` ·
`tablet-768` · `laptop-1024` · `desktop-1440` · `touch-iphone` · `reduced-motion`.

### Four things to know before you trust the output

1. **The harness deliberately un-clips the viewport.** `layout.tsx:50` sets
   `overflow-x-hidden` on `<body>`, which clips overflow rather than preventing
   it. `e2e/support/pages.ts` forces `overflow-x: visible` during the probe.
   **This means the harness reports overflow that you cannot see in a browser.**
   That is intended — the clipping is the bug (finding S-01).
2. **Framer Motion is not stopped by Playwright's `animations: 'disabled'`.**
   Motion runs a hybrid rAF/WAAPI engine, and `useScroll`/`useTransform` are
   pure rAF. `settle()` scrolls the page and returns to top so motion values
   reach rest. If you add a spec, use `gotoSettled()`, never a bare `page.goto`.
3. **The suite runs on port 3987 and never reuses an existing server.** The El
   Portal *app* (a different repo) occupies 3000 and 3100 on this machine. The
   first bring-up run silently audited **that** application instead — it happily
   reported login-form touch targets and clean overflow checks for pages it had
   never loaded. If you ever change the port, keep `reuseExistingServer: false`.
   A test suite that confidently measures the wrong thing is worse than none.
4. **An empty offender list does not mean no overflow.** On `/changelog` the
   root-level `scrollWidth` assertion caught 27px of overflow that the
   per-element sweep missed entirely. Trust the root assertion; use the sweep to
   *locate*, not to *decide*.

---

## Finding schema

One row per finding, ordered most-severe first.

```markdown
### F-<surface>-<n> · <one-line claim>

- **Severity:** Blocker | High | Medium | Low
- **Rule:** <the RESPONSIVE.md / ANTI-PATTERNS.md rule violated>
- **Location:** `path/to/file.tsx:LINE`
- **Viewports affected:** 320 / 360 / 390 / 430 / 768
- **Evidence:** <harness output, or measured value vs rule>
- **User impact:** <what the person on the phone actually experiences>
- **Proposed fix:** <additive diff — mobile-first default + md:/lg: restoring desktop>
- **Desktop-safe:** yes — <why rendering at ≥768px is unchanged>
```

### Severity rubric

| Severity | Means |
|---|---|
| **Blocker** | Content unreachable, unreadable, or untappable at 360px. Horizontal page scroll. |
| **High** | Significant discomfort — cramped, clipped, mis-tappable — but usable. Touch target under 24px (WCAG AA failure). |
| **Medium** | Contract violation with mild user impact. Touch target 24–43px (AAA miss). Non-fluid type below 14px. |
| **Low** | Polish, consistency, or latent risk that isn't currently biting. |

---

## Report location

Write to `.planning/responsive/findings/<surface-id>.md` (e.g. `P2-changelog.md`).
Do not write anywhere else. Do not touch `SURFACES.md` — the orchestrator
consolidates.

End the report with:

```markdown
## Coverage statement
- Viewports actually run: <list>
- Specs actually run: <list>
- Files read in full: <list>
- What I did NOT check, and why: <list>
```

The coverage statement is not optional. A report that silently skipped a
viewport reads identically to one that passed it — and that is exactly the
failure mode this whole harness exists to prevent.

---

## Prompt template

```
You are auditing ONE surface of the El Portal marketing site for mobile
responsiveness. You are read-only: propose fixes, apply nothing.

ASSIGNED SURFACE: <id + name from SURFACES.md>
FILES: <paths>

Read first, in this order:
  1. .planning/responsive/AUDIT-BRIEF.md   (your full contract — follow it exactly)
  2. .planning/codebase/design/RESPONSIVE.md (the rules)
  3. .planning/responsive/SURFACES.md      (dead code, pre-seeded findings, non-issues)

Then:
  - Run the harness scoped to your surface's routes across the mobile projects.
  - Read every assigned file IN FULL. Do not skim.
  - Produce findings per the schema in the brief, most-severe first.
  - Every finding needs evidence: harness output, or file:line + the value that
    violates a named rule. Unevidenced hunches go in "Unverified suspicions".
  - Every proposed fix must be additive and desktop-safe. The desktop design is
    approved and frozen.

Write your report to .planning/responsive/findings/<surface-id>.md and end with
the mandatory coverage statement. Your final message should be a <=10 line
summary: counts by severity plus the single worst finding.
```

---

## Fleet sequencing

Global surfaces first — a finding in `G1`/`G2` multiplies across all 8 pages, and
fixing it may resolve page-level findings before they're written.

```
Wave 1 (blocking):   G1 app shell · G2 Navbar · G3 Footer · G4 ReadingLayout
Wave 2 (parallel):   P2 changelog · P3 mcp · P4 pricing · P1 home
Wave 3 (parallel):   P6 manifesto · P7 privacy+terms · P5 features (verify-only)
```

Wave 1 is 4 agents, Wave 2 is 4, Wave 3 is 3 — 11 total for full coverage.
