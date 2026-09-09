# v9 — the reference implementation

Eight screens where every rule in this system was actually decided. When a rule
in `PRINCIPLES.md` and this code disagree, work out which is right and fix the
other one the same day — a reference that has drifted is worse than none.

Look at `screens/` first. Read the code when you need to know how something was
built rather than what it looks like.

---

## The screens, and what each one is evidence for

| Screenshot | Screen | Demonstrates |
|---|---|---|
| `01-connections.jpg` | Connections | The status hierarchy in one column — solid navy broken, tinted navy needs-a-person, grey unfilled fine. Unboxed dashboard numbers. Filters as tabs. Frameless icon buttons. A page title with nothing under it. |
| `02-proposals.jpg` | Proposals | The densest table: nine columns, checkbox selection, confidence meters carrying value in length alone, and the library pager restyled to 24px. |
| `03-skills-panel.jpg` | Skills | The panel view and its Panel/Rows segmented control. Cards as frames, not fills. |
| `04-team.jpg` | Team | Inline role pickers, scoped access rendered as monograms, and the permission matrix read capability-by-role. |
| `05-audit-log.jpg` | Audit log | The dense row (46px), uppercase column labels, and the underline search field. |
| `06-settings.jpg` | Settings | Framed groups, the Radix switch tinted navy, label-and-control rows capped at 880px. |
| `07-mcp.jpg` | MCP | Flush panels whose head rule runs edge to edge; Base UI tabs with the sliding underline. |
| `08-skill-detail-sheet.jpg` | Skill detail | The right-hand sheet: four tabs, rendered markdown, Read/Edit, and the footer carrying quality plus the destructive control. |
| `09-proposal-detail-sheet.jpg` | Proposal detail | Source document, suggested coding as a real debit table, the agent's stated reason, and flags in navy — the whole "no red for warnings" rule under load. |
| `10-command-palette.jpg` | ⌘K palette | The one surface that opens with no animation, and the 12px corner a 640px modal needs. |
| `11-notifications.jpg` | Notifications | A popover panel, unread as a gutter dot rather than a filled row. |

## Behaviour worth reading the code for

Static screenshots miss the half of this system that is behaviour:

- **`components/v9/store.ts`** — connect/disconnect as real state. The palette
  adds rows tagged *New* in a syncing state; disconnect removes them behind a
  confirm that says what breaks. A mock that toasts and changes nothing teaches
  nothing.
- **`components/v9/ui.tsx` → `useHeightFloor`** — why a filter never changes the
  page height. This is the rule people skip and then can't explain why the page
  feels broken.
- **`components/v9/proposals.tsx`** — pagination with the page clamped during
  render rather than corrected in an effect, so the empty page is never painted.
  Also per-page bulk selection that persists across pages.
- **`components/v9/home.tsx`** — filtered lists with `layout` on the survivors
  and *no exit animation*, and why (there's a comment).
- **`components/v9/skills.tsx`** — the ~50-line markdown renderer. Proof that
  not every problem needs a dependency.

---

## Running it

This is source, not an app — there's no `package.json` here on purpose, because
a second dependency tree is a second thing to drift. To run it, drop these into
a Next.js app (App Router, React 19, Tailwind v4 for the preflight):

```
app/         → src/app/(anything)/
components/  → src/components/
lib/         → src/lib/
```

Then map the imports that point at files already living elsewhere in this repo:

| Import in this code | Comes from |
|---|---|
| `@/components/lab/uitimate/*` | `skills/sweet-design/library/uitimate/` |
| `@/components/icons` | `skills/sweet-design/react/icons.tsx` |
| `@/components/brand` | `skills/sweet-design/react/brand.tsx` |

They are not copied here for the obvious reason.

Dependencies it expects: `@base-ui/react`, `motion`, `recharts`, `sonner`,
`cmdk`, `@number-flow/react`, `zustand`, `shiki`, `next-themes`,
`@radix-ui/react-switch`, `tailwind-variants`.

---

## Two honest caveats

**`app/v9.css` is not the system's stylesheet.** It is the kit v9 grew out of
plus eight patch layers, in the order the decisions were actually made. It
produces the right result and it is useful as a changelog of the argument, but
**`skills/sweet-design/tokens.css` + `patterns.css` are the canonical sheets** —
they are that file flattened, with the class names cleaned up
(`.s9-root` → `.sweet`, `.menu-popup` → `.popover`, and so on). Build new work
against those.

**`components/v9/ui.tsx` and `react/primitives.tsx` are the same primitives in
two spellings.** The v9 one uses the mock's class names; `primitives.tsx` is the
canonical version against `patterns.css`. If you change the behaviour of one,
change both — this is the single most likely place for this repo to drift.
