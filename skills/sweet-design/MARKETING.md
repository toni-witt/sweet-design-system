# Marketing and web

The product system is deliberately restrained: nothing decorative, nothing
larger than 26px, no imagery. A landing page built to those rules reads as
unfinished. So marketing gets **more expression and more freedom** — but not a
different brand.

**Shared with product, non-negotiable:** the palette (navy, greys, off-white),
the logo, the voice, and the corner. Everything else is open.

---

## The reference points

Two, both deliberate:

**The NYC subway signage system** — Vignelli and Unimark, 1970. A strict grid, a
single grotesque, thin rules that organise rather than decorate, generous
emptiness, and information placed where the system says it goes rather than
where it looks nice. Colour is functional and sparse. Nothing is centred by
default. That is the discipline underneath the freedom.

**Ramp** — the fintech. Big confident type, editorial layout, sharp corners,
monospace for numbers and labels, one accent used sparingly against a lot of
neutral, product screenshots treated as the imagery. Serious about money without
being grey and corporate.

The shorthand: **straight thin lines, greys and navy, hard edges, a clean
grotesque, and text set in the corners.**

---

## Rules

### Type

- One clean grotesque, in the Helvetica lineage. The product runs Geist, which
  is in that family and is already loaded — **use it unless there's a reason
  not to.** If a licensed face is wanted, Helvetica Now or Söhne are the
  reference; see the open question below.
- Display sizes marketing may use that product may not: **80 / 64 / 48 / 36px**.
  Tighten tracking as size goes up — `-0.04em` at 80, `-0.03em` at 48.
- **A headline may be followed by a paragraph here.** In product nothing goes
  under a headline (`PRINCIPLES.md` § 7); marketing is where the explaining
  happens, and a bare headline on a landing page reads as unfinished. Body at
  15–18px, leading 1.6, measure around 65 characters. Two or three sentences,
  then a rule, a number or an image.
- **Monospace for labels, figures and eyebrows.** Uppercase, letterspaced,
  11–12px. This is the Ramp move and it does a lot of work: it signals precision
  and it stops small text reading as an afterthought.
- Sentence case in headlines. No title case, no exclamation marks.

### Layout

- **A visible grid.** 12 columns, and let things sit on it obviously. Asymmetry
  is fine; arbitrary placement isn't.
- **Text in the corners.** Set labels, captions and metadata at the edges of a
  block rather than centred under it — signage, not a poster.
- **Thin rules as structure.** `--rule` at 1px, full-bleed section dividers,
  rules under headings, rules boxing a stat. This is the main decorative device
  and it should be the only one.
- Left-align by default. Centre only a hero, and only when it's short.
- Generous emptiness. If a section feels sparse, it is probably right.

### Colour

- Navy is the accent, and it is used *sparingly* — a button, a rule, one
  highlighted word, one filled block per screen.
- Greys carry the page. The off-white ground, the rules, the secondary text.
- **Large navy fields are allowed here** and not in product: a full-bleed navy
  section with the logo reversed out is on-brand.
- Still no gradients, no glow, no shadow used for depth. Flat and edged.
- Still no red/amber/green, except where a chart or a status is quoted from the
  product, in which case it follows `CHARTS.md`.

### Imagery

- Product screenshots are the primary imagery, and they're allowed to be
  cropped hard, bled off the edge, or shown as a fragment. A fragment reads more
  confident than a full window with a browser chrome around it.
- If a screenshot is framed, frame it with a 1px rule, not a shadow.
- No stock photography. No 3D blobs. No illustrated mascots.
- Diagrams follow the signage logic: thin lines, navy for the path that matters,
  greys for context, labels set close and small.

### Motion

Marketing is where the delight budget lives (see `MOTION.md` § 1 — the
rare/first-view tier).

- Scroll reveals are allowed. Keep them to opacity plus a short translate, and
  fire them once.
- The magicui pieces banned from product live here: `border-beam`,
  `shimmer-button`, `animated-beam`, `word-rotate`,
  `interactive-hover-button`. Use them like seasoning — one per page, not one
  per section.
- Durations can go past 300ms when the motion is explaining something.
- Everything still respects `prefers-reduced-motion`.

### Corners

The product's 3px holds for anything that looks like product UI — a button, an
input, a quoted screenshot. **Large marketing blocks may be fully square.** A
full-bleed navy section with a 3px radius looks like a mistake; at that scale,
0 is the correct value.

---

## Surfaces this covers

Landing pages, docs, changelog, blog, pricing, OG and social images, slide
decks, and email. Each will need a pass; none is specified yet.

---

## Open

- **Typeface.** Geist for everything, or license a display face for marketing
  while product stays on Geist? A licensed grotesque is the single biggest
  lever on "does this look like a real brand" — worth deciding before the first
  page.
- **Photography.** Is there any? Team photos, office, customer logos?
- **Customer logos.** Greyscale on the off-white, or full colour? (Greyscale is
  more consistent with everything above; full colour reads as more credible.)
- **Dark sections.** Navy fields are allowed — do they get their own token set,
  given the product is light-only by decision?
- **OG image template.** One layout, generated per page, or hand-made per post?
