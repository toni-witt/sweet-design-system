# Open questions

Decisions the system hasn't had to make yet. Each one will get made the first
time a feature needs it — the point of writing them down is that it gets made
once, on purpose, rather than five times by whoever is closest to the deadline.

Ordered by how soon it will bite.

---

## Settled — 2026-09-09

Four of these are now answered, and have moved into files of their own:

| Question | Answer | Where |
|---|---|---|
| Chart colour | **Navy and greys.** One navy for the subject, greys for context; difference by weight, dash and direct labelling, never hue. | `CHARTS.md` |
| Dark mode | **Never — light only.** No dark palette, no `prefers-color-scheme` branch. | `PRINCIPLES.md` § 1 |
| Marketing | **More expression, same principles.** Straight thin lines, greys and navy, hard edges, a clean grotesque, text in the corners. NYC subway signage and Ramp as the references. | `MARKETING.md` |
| Icons | **Lucide**, 16px / 1.75 stroke, outline only. Hand-drawn set is legacy. | `PRINCIPLES.md` § 12, `react/icon.tsx` |

---

## 1. Empty, loading and error states

Not a single one is specified. They are the states people see when things go
wrong, which is when the brand matters most.

- **Empty:** an icon and a sentence? Just a sentence? Does an empty table keep
  its column headers? (My instinct: yes — the headers say what will be here.)
- **Loading:** skeleton rows, a spinner, or nothing until the data lands?
  `library/uitimate/skeleton.tsx` and `library/dotmatrix` are both sitting
  unused. A flat, no-shadow system makes shimmering skeletons look odd.
- **Error:** inline in the panel, a toast, or a full-page state? And given red
  is reserved for destructive controls, what colour is a failure?
- **First-run / zero-data:** the state a new customer actually sees first.

---

## 2. Forms at length

We have single fields and one small dialog. Nothing about: multi-column forms,
required/optional marking, inline validation timing (on blur? on submit?),
error message placement, help text vs placeholder, multi-step flows, unsaved
changes, or destructive-confirm patterns beyond the one alert dialog.

**Question:** how form-heavy does this product get? Onboarding, vendor records
and workspace settings suggest fairly.

---

## 3. Density and mobile

The product assumes a wide screen and a rail. Below 860px the CSS reflows the
tables by hiding columns, which is a guess rather than a decision.

**Questions:** does this need to work on a phone at all? Is there a "comfortable
/ compact" density toggle, given accountants often want *more* rows on screen,
not fewer?

---

## 4. Voice

Not visual, but it is half the brand and the mock has a strong one already:
sentence case, no exclamation marks, plain nouns, and every confirmation says
what will happen rather than asking if you're sure.

**Question:** should this be written down as copy rules — button verbs, toast
structure, error phrasing, empty-state tone — so it survives contact with more
writers?

---

## 5. Smaller things, still unanswered

- **Focus rings.** Currently a 2px navy outline at 2px offset. Fine on the
  ground, tight against a filled button. Worth a proper spec.
- **Selection.** Multi-select exists on one table. No spec for shift-click
  ranges, select-across-pages, or a "select all 34" affordance.
- **Keyboard.** ⌘K is the only shortcut. Is there a wider map (j/k navigation,
  `/` to search, `g then p` to go to a page)?
- **Notifications.** In-app panel exists. Email/Slack templates don't.
- **Avatars.** We render initials on a tint. No answer for uploaded photos,
  fallbacks, or group/stacked avatars beyond the overlapping monograms.
- **Tables.** No sorting affordance, no column resize, no sticky header on long
  scrolls, no row expansion. All will be asked for.
- **Time and number formatting.** Relative ("14 min ago") vs absolute, timezone
  display, currency for non-USD, negative number style (parentheses vs minus —
  accountants have opinions).

---

## 6. Follow-ons from the decisions just made

**Charts** — small multiples (grid, shared axis, when to switch), brush/zoom on
long ranges, null and gap handling, annotations, and export to a surface with no
hover. Listed at the end of `CHARTS.md`.

**Marketing** — the typeface is the big one: Geist everywhere, or license a
display grotesque for marketing while product stays on Geist? Also photography
(is there any), customer logos in greyscale or colour, whether navy sections get
their own tokens, and the OG image template. Listed at the end of
`MARKETING.md`.

**Icons** — whether to migrate the existing hand-drawn nav glyphs to Lucide or
leave them. They match on stroke and cap, so there is no visible seam either
way; it is a tidiness call, not a design one.
