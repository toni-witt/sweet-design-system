# Changelog

## 1.0.0

First cut, extracted from v9 of the Conduit mocks — the reference
implementation every rule here was decided against.

**Settled in this release**

- One blue (`#1e376b`) for every primary, link, focus and attention state.
- Status is blue or grey, never red/amber/green; hierarchy by fill weight.
  Red belongs only to controls that destroy something.
- 3px corner everywhere; floating layers step up to 6 / 9 / 12.
- No shadows in the page, no gradients, no ambient shading, no panel fills.
- Dashboard numbers, icons and search fields are never boxed.
- Nothing goes under a page or section headline.
- The type scale, and nothing between its rungs.
- Light only — no dark mode, by decision.
- Charts are navy and greys; difference by weight, dash and direct labelling.
- Icons are Lucide at 16px / 1.75 stroke, outline only.
- Marketing gets more expression on the same palette and edges — subway
  signage and Ramp as the references.
- Motion follows Emil Kowalski's framework, adapted to these tokens.

**Known gaps** — empty/loading/error states, forms at length, email and PDF,
mobile below 860px, table affordances. See `OPEN-QUESTIONS.md`.
