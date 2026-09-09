# Sweet — design principles

The rules the product is built on, and the reason behind each one. If a value
here and a value in `tokens.css` disagree, the CSS wins and this file is out of
date — fix it.

Everything below was decided against real screens (v9 in this repo). Where a
decision reversed an earlier one, the reversal is written down too, because the
thing we tried and rejected is usually the thing the next person will try.

---

## The short version

A flat, quiet, monochrome-navy product surface. One blue does every job. No
elevation, no gradients, no colour that isn't carrying information. Corners are
3px — square enough to read as precise, soft enough not to feel harsh. Type is
small and dense; structure comes from alignment, hairlines and whitespace rather
than from boxes. Status is blue or grey, never red-amber-green.

It should read as **precise and calm**. Not playful, not enterprise-grey, and
never decorated.

---

## 1. Colour

| Role | Token | Value |
|---|---|---|
| Headings, numerals | `--ink` | `#081526` |
| Body text | `--text` | `#0f172a` |
| Secondary text | `--muted` | `#64748b` |
| Everything primary | `--primary` | `#1e376b` |
| Ground | `--bg` | `#fbfbfc` |
| Floating layers only | `--paper` | `#ffffff` |
| Frames and separators | `--rule` | `rgba(15, 23, 42, 0.13)` |
| Row dividers | `--rule-soft` | `rgba(15, 23, 42, 0.07)` |

**One blue.** `--primary` is the action colour, the link colour, the focus ring,
the selection tint, the chart stroke, and every "this needs attention" state.
There is no secondary blue and no accent colour. Two blues is the fastest way to
break this.

**Never pure black, never pure white as a page.** `#081526` is the darkest ink.
The ground is the off-white `#fbfbfc`; pure white is reserved for layers that
float above it, which is what makes them read as floating.

**Lines are translucent ink, not grey hex.** `rgba(15, 23, 42, 0.13)` sits
correctly on the ground *and* on white. `#e5e7eb` does not.

**Where hue is still allowed.** Connector monograms and vendor tiles carry brand
tints, and thumbnail artwork carries whatever it carries. That is identity, not
state, and it is the only place colour runs free.

**Light only.** Decided, not deferred. There is no dark palette and no
`prefers-color-scheme` branch, which means every value in `tokens.css` can be
read as final rather than as one half of a pair. Marketing may use large navy
fields (see `MARKETING.md`); that is a section on a light page, not a dark mode.

**Charts follow the same rule.** Navy for the series the chart is about, greys
for the rest, and difference carried by weight, dash and direct labelling
instead of hue — including for up-is-good / down-is-bad. Full rules in
`CHARTS.md`.

---

## 2. Status — blue or grey, never red/amber/green

The rule: **if something needs attention it is blue; if it doesn't it is grey.**

Red, amber and green were three hues doing one job. The row already says "Token
expiring" — a second signal in a third colour is decoration, and once every row
carries a colour, none of them stand out.

Hierarchy comes from **fill weight**, not hue:

| State | Treatment | Class |
|---|---|---|
| Broken now, an agent is failing | Solid navy, white text | `.pill-critical` |
| Needs a person soon | Navy on 9% navy tint | `.pill-attention` |
| Nothing owed | No fill, grey text, grey dot | `.pill-quiet` |

Filling the quiet states is what made the loud ones hard to find. Eleven healthy
rows should recede; the one broken row should be the only filled thing in the
column.

**Red survives in exactly one place:** a control that destroys something when
you press it — Delete, Disconnect, Revoke, Remove. That is a warning about your
own next action, not a status. A *repair* action ("Reconnect", "Renew") is
primary navy, because fixing a thing is the most useful button on the screen,
not the most dangerous one.

Meters and confidence bars are navy at every value. The length is the number;
colouring it as well says the same thing twice.

---

## 3. Shape

**One corner: 3px** (`--corner`), applied to every box in the system —
buttons, inputs, panels, tags, monograms, avatars, popups. We tried 0 (read as a
terminal) and 2 (still landed hard). 3 takes the edge off without ever reading
as "rounded".

**Floating layers scale up with their size**, because 3px on a 640px modal reads
as a hard cut:

- tooltip — 6px
- menu, popover, preview card — 9px (`--corner-popover`)
- modal, sheet, command palette — 12px (`--corner-modal`)

**Round is reserved for three things**, because in each the shape is the
meaning: status dots, the caps on a 2px bar, and switches (a pill says "this
slides").

When the ask is "a bit more rounding", it means **every box across the app**,
not the element being discussed. It is one token; change it there.

---

## 4. Elevation, or the absence of it

**Nothing in the page has a shadow.** Not cards, not buttons, not the rail. The
only `box-shadow` in the system is `--shadow-float`, and it belongs to layers
that float over content — menu, tooltip, modal, sheet, palette — where the edge
is the difference between a panel and a smudge.

**No ambient shading.** No page gradient, no blurred colour orbs, no dot grid.
One flat ground.

**No panel fills.** A panel is a 1px frame around content that has to read as
one object. It has no background of its own.

---

## 5. Lines — where a rule goes, and where it doesn't

Two weights: `--rule` frames and separates, `--rule-soft` divides rows inside
something `--rule` already framed.

**A rule goes:**

- around the chrome — the rail's right edge, the top bar's bottom edge
- under a table's column labels, and between its rows
- around a block of data that must read as one object (a chart, a feed, a
  settings group)
- around an unfilled control — an outlined button, an input
- under the selected filter tab

**A rule does not go:**

- between a heading and its content — the gap is the separator
- around dashboard numbers (see below)
- around an icon (see below)
- around a search field (see below)
- around a list that reserves height for filtering — an empty framed box
  advertises the reservation that the flat layout hides
- anywhere a second rule would land within a few pixels of the first

---

## 6. Things that are never boxed

**Dashboard numbers.** A stat is a number with a label. Ruling four of them into
cells makes the row read as a form. `.stat-row` is spacing only.

**Icons.** An icon never gets its own border. The glyph is the affordance; a
frame around each one turns a toolbar into a row of tiny competing buttons. The
fill arrives on hover, where it means something. A dozen framed `⋯` triggers
down the right edge of a table is a column of noise — those get their frame on
hover only.

**Search fields.** A box around a search field is a box around a word. Search is
an icon and a single line (`.search-line`), with the line turning navy on focus.
The one exception is the command bar in the nav, which is a button pretending to
be a field and has to look pressable.

---

## 7. Typography

The scale, and nothing between the rungs:

| Token | Size | Used for |
|---|---|---|
| `--t-display` | 26px | page titles, stat values |
| `--t-section` | 15px | section headings, dialog titles |
| `--t-body` | 14px | body prose, used sparingly |
| `--t-name` | 13.5px | row names, lede |
| `--t-cell` | 12.5px | table cells, buttons, menu items |
| `--t-meta` | 12px | secondary cell text, hints |
| `--t-label` | 11px | column labels, pills, tags, timestamps |
| `--t-micro` | 10px | captions inside dense panels |

- Weights: **600** for headings, numerals and the selected thing; **500** for
  labels and secondary text; 400 body.
- Tracking is size-specific: `-0.03em` at 26px, `-0.015em` at 15px, 0 at body
  sizes, and **+0.05em uppercase** for column labels.
- Numerals are always `tabular-nums` in tables. A column of figures that shifts
  as it updates is a column you cannot scan.
- Monospace (`--font-mono`) for anything a person might copy or compare: ids,
  hashes, tool names, amounts in a ledger, file paths, durations.

### No explainers under a headline

**Nothing goes under a page title but the page.** Not "Connections / One MCP
endpoint in front of every tool your agents can reach…" — just **Connections**.
The nav item already said what this is; a sentence repeating it is the product
reassuring itself.

Same under a section heading: "Workspace", not "Workspace / Identity and
region".

The test is whether the line survives deletion. A lede under a headline never
does — it restates the headline in more words, and the screen underneath is the
real answer.

**This is about headings, not about prose.** Copy that carries information stays
wherever it earns its place:

- a line stating what needs attention and why, above the list of it
- a card explaining a guarantee the customer is buying ("agents never see an
  upstream credential")
- a notification's detail, an invoice's description, the agent's stated reason
  for a coding — that is data the product is *showing*
- a hint attached to a control, a consequence in a confirm, a toast description

**Marketing is the opposite.** Headlines there are *supposed* to be followed by
a paragraph — see `MARKETING.md`.

---

## 8. Navigation and chrome

- The rail is 196px, 60px collapsed, on the flat ground with a hairline edge.
- **The current page is marked, not highlighted.** A 6% ink fill with dark
  text — grey, not navy. The loudest thing on screen should never be a statement
  of where you already are; that competes with the primary button.
- Badges count things a person has to act on, and nothing else.
- The top bar is 44-ish px, hairline underneath, and holds the command bar plus
  frameless icon buttons.

---

## 9. Density

| Token | Value | Used for |
|---|---|---|
| `--row` | 58px | the standard table row |
| `--row-dense` | 46px | the audit log, where volume beats comfort |
| `--row-head` | 32px | column labels |

Column headers stay at 32px even when rows grow — growing them only pushes the
first row further from its own labels.

Content column is 1180px (`--page-max`). Label-and-control rows cap at 880px
(`--measure`); without a card edge to stop them, a label and its control drift a
full page apart.

---

## 10. Motion

**Full reference: `MOTION.md`** — the decision order, the tool choice, the
easing and duration tables, and what never ships. The house rules:

- Everything eases with `--ease` — `cubic-bezier(0.16, 1, 0.3, 1)`.
- Durations: 120ms for a tooltip, 160ms for a control or a modal, 260ms for a
  list entrance. Nothing in the product animates for longer than 300ms.
- Entrances are opacity + 6px, staggered 40ms. Never scale from 0.
- **Keyboard-triggered surfaces don't animate in.** The command palette opens
  instantly; if you typed `⌘K` you are already looking at where it will be.
- Layout animation (`motion`'s `layout`) is for things that *move* — a filtered
  list re-ordering, a selection pill sliding. Not for things that appear.
- **No exit animations on filtered lists.** A row on its way out still occupies
  the track, so a list that loses eight of twelve spends a beat looking broken.
  Removed rows go at once; the survivors slide.
- Everything respects `prefers-reduced-motion`, and `MotionConfig
  reducedMotion="user"` covers the JS-driven half.

---

## 11. Behaviour that is part of the design

These aren't visual rules, but they are house style, and skipping them is what
makes a mock feel like a mock.

**A filter must not change the page height.** If the reader is scrolled past the
new bottom, the browser clamps the scroll and the whole page lurches. Reserve
the unfiltered height (`useHeightFloor`) or use a fixed page size. Since panels
have no visible edge, the reserved space is simply blank page.

**Destructive actions get a stop, and the stop says what breaks.** Not "Are you
sure?" — "18 tools stop responding immediately, for every agent pointed at this
endpoint."

**State changes are visible.** Connecting adds a row tagged *New* in a syncing
state; disconnecting removes it. A mock that toasts and changes nothing teaches
nothing.

**Every action gets a receipt.** A toast with a consequence in the description,
not just a verb.

---

---

## 12. Icons

**Lucide**, at 16px and 1.75 stroke, outline only, inheriting `currentColor`.
`react/icon.tsx` sets the defaults and names the nav set by role rather than by
picture, so changing what "proposals" looks like is one edit.

The hand-drawn set in `react/icons.tsx` is legacy: it matches Lucide's stroke
and cap, so the two sit side by side without a seam. Leave what exists; use
Lucide for anything new.

Never above 20px in product — a big icon is a picture, and this system doesn't
use pictures. And an icon never gets its own box (§ 6).

---

## 13. Craft — the rules underneath the rules

Adapted from Emil Kowalski's design-engineering skill. These aren't specific to
this brand; they are why the specific rules above are worth keeping.

**Taste is trained, not innate.** It is the ability to see what elevates,
developed by studying work that feels right and asking why. When you build
something, reverse-engineer the interface you wish it felt like rather than
guessing.

**Unseen details compound.** Most of what makes an interface feel expensive is
never consciously noticed — that is the point. When a thing behaves exactly as
someone assumed it would, they carry on without a second thought.

> "All those unseen details combine to produce something that's just stunning,
> like a thousand barely audible voices all singing in tune." — Paul Graham

**Beauty is leverage.** In a market where everyone's software works, the
experience is the differentiator. Good defaults and good motion are not polish
applied at the end; they are the product.

**Cohesion beats correctness.** Sonner's animation feels good partly because the
easing, the timing, the visual design and even the name are in harmony. Match
the motion to the mood: a professional ledger should be crisp and fast; a
playful thing can bounce. Ours is crisp and fast.

**Good defaults matter more than options.** Most people never customise
anything. Ship the right thing out of the box; make the escape hatch exist but
never require it.

**Handle edge cases invisibly.** Pause a timer when the tab is hidden. Keep
hover state across the gap between stacked items. Capture the pointer during a
drag. Nobody notices any of it, and that is exactly right.

**Low friction wins adoption.** Inside a design system that means: one import,
one class name, no context provider, no configuration to get the default. If a
pattern needs a paragraph of setup, the pattern is wrong.

**Review it the next day.** With fresh eyes you see what you couldn't while
building it. This applies to layout and copy as much as to motion.

### The button rule, as a worked example

A button that doesn't move on press feels broken, and nobody can say why. Ours
does `scale(0.985)` on `:active` over 160ms. That's it — one line, invisible,
and its absence is felt on every single press.

Every rule in this document is that shape: small, invisible, and load-bearing.

---

## 14. What we do not have yet

Decisions this system has not had to make, listed so nobody invents one
quietly. See `OPEN-QUESTIONS.md` for the questions, and answer them there
before the first feature that needs one.

- Empty, loading and error states as a documented set
- Forms at length — validation, multi-step, unsaved changes
- Email and PDF output, where there is no hover and no motion
- Mobile below 860px, beyond the reflow rules already in the CSS
- Table affordances: sorting, sticky headers, row expansion, select-across-pages

Settled since the first draft, and written up in their own files: **charts**
(`CHARTS.md`), **marketing** (`MARKETING.md`), **icons** (§ 12), and **dark
mode** (there isn't one).
