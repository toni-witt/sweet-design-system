---
name: sweet-design
description: The Sweet design system — the brand's rules for building any UI, in product or marketing. Use whenever writing or reviewing interface code: components, pages, layouts, tables, forms, charts, dialogs, navigation, animation, or CSS. Also use when choosing a UI library, picking colours, spacing, type sizes, corner radius, or deciding how something should animate. Covers React, Next.js and plain CSS.
---

# Sweet design system

Everything in this skill is a decision already made. Follow it rather than
inventing an alternative, and if something genuinely isn't covered, say so
instead of guessing — the gaps are listed in `OPEN-QUESTIONS.md`.

## The ten rules

These cover most of what goes wrong. Read the referenced file before doing
detailed work in that area.

1. **One blue.** `--primary` `#1e376b` is the action colour, the link, the focus
   ring, the chart, and every "needs attention" state. There is no second blue
   and no accent colour.
2. **Status is blue or grey — never red, amber or green.** Hierarchy comes from
   fill weight: solid navy = broken now, navy on tint = needs a person, no fill
   with a grey dot = fine. Red exists only on a control that destroys something.
3. **One corner: 3px.** Every box. Floating layers step up — tooltip 6, popover
   9, modal 12.
4. **No shadows in the page.** Elevation belongs only to layers that float over
   content. No gradients, no ambient shading, no panel fills.
5. **Nothing decorative is boxed.** Not dashboard numbers, not icons, not search
   fields. Search is an icon and one thin line.
6. **Nothing goes under a page or section headline.** "Connections", not
   "Connections" plus a sentence explaining it. Marketing is the opposite.
7. **Type comes from the scale** — 26 / 15 / 14 / 13.5 / 12.5 / 12 / 11 / 10px.
   Nothing between the rungs. Tables use `tabular-nums`.
8. **Light only.** There is no dark mode and there won't be one.
9. **A filter must never change the page height.** Reserve it, or the page
   lurches when the reader is scrolled down.
10. **Anything opened by the keyboard doesn't animate.** And no animation ships
    without `prefers-reduced-motion` and hover gating.

## Where to read

| Doing this | Read |
|---|---|
| Anything visual — start here | `PRINCIPLES.md` |
| Choosing a library or component | `COMPONENTS.md` |
| Animating, or deciding not to | `MOTION.md` |
| A chart, graph or sparkline | `CHARTS.md` |
| A landing page, docs, OG image, deck | `MARKETING.md` |
| Something the system doesn't cover | `OPEN-QUESTIONS.md` |
| Writing the CSS | `tokens.css`, `patterns.css` |
| Seeing it applied, or checking a detail against real code | `../../reference/v9/` |

`reference/v9/` is eight built screens where every rule here was decided —
screenshots in `reference/v9/screens/`, source beside them. When a rule is
ambiguous, look at how it was actually resolved there.

Read the file. Don't work from this summary alone — every rule in
`PRINCIPLES.md` carries the reasoning behind it, and the reasoning is what tells
you what to do in the case that isn't listed.

## Using it in code

```tsx
import "@toni-witt/sweet-design/tokens.css";
import "@toni-witt/sweet-design/patterns.css";

<div className="sweet">            {/* the app tree */}
  <main className="page">…</main>
</div>
```

Anything portalled — menu, dialog, tooltip — mounts outside the app tree and
inherits nothing, so wrap the portal's children in `.sweet-portal`.

**Behaviour from a library, appearance from `patterns.css`.** Never restyle a
library's internals; give it our class and let the token sheet win on
specificity. Base UI (`@base-ui/react`) is the default for anything with
behaviour — its docs ship inside the package at
`node_modules/@base-ui/react/docs/react/components/*.md` and are authoritative.

`react/primitives.tsx` has the seven patterns no library provides: `Tip`,
`RowMenu`, `HoverPreview`, `Segmented`, `FilterTabs`, `Spark`, `useHeightFloor`.
`react/icon.tsx` sets the Lucide defaults (16px, 1.75 stroke, outline only).

## When you can't follow it

If the design system doesn't answer the question, don't quietly invent a rule
and ship it — that's how a system becomes three systems. Say what's missing, do
the closest thing the existing rules imply, and flag it so it gets added here
once rather than five times in five repos.
