# Components — what to reach for

Every library in this project, what it is good for, and the class to give it so
it wears the brand. The rule of thumb:

> **Behaviour from a library, appearance from `patterns.css`.**
> Never restyle a library's internals; give it our class and let the token sheet
> win on specificity.

And the corollary, from `MOTION.md`: if what you need is a *component* — a
toast, a drawer, a menu, a command palette — reach for one of these rather than
hand-rolling it. A `<div>` dropdown with no focus management is how a system
starts leaking.

The vendored source is copied into `library/` so this folder is self-contained.
In the app it also lives at `src/components/lab/*` — keep them in sync or delete
one.

---

## Decide by need

| I need… | Use | Notes |
|---|---|---|
| Dialog, sheet, confirm | **Base UI** `dialog`, `alert-dialog` | `.modal` / `.sheet` / `.confirm` |
| Dropdown / row actions | **Base UI** `menu` | `.popover` + `.menu-item` |
| Tooltip | **Base UI** `tooltip` | `.tip`; wrap the app in one `Tooltip.Provider` |
| Hover preview of a record | **Base UI** `preview-card` | `.popover`, `delay={350}` on the trigger |
| Popover panel (notifications) | **Base UI** `popover` | `.popover` |
| Tabs inside a panel | **Base UI** `tabs` | `.tabs` / `.tab` / `.tab-underline` |
| Select | **Base UI** `select`, or native `<select className="select">` | native is fine for ≤ 6 short options |
| Checkbox / radio | **Base UI** `checkbox`, `radio-group` | `.check` |
| **Switch** | **uitimate** `switch` (Radix) | `className="data-[state=checked]:bg-[var(--primary)]"` |
| **Pagination** | **uitimate** `pagination` | `.pager` / `.pager-link`; see Proposals |
| Command palette / ⌘K | **cmdk** | `.modal` shell, `.search-line` inside |
| Toasts | **sonner** | one `<Toaster>` at the root; always give a description |
| Animated numbers | **@number-flow/react** | for values that *change*, not for static ones |
| List/layout animation | **motion** | `layout` for movement, never for appearance — see MOTION.md § 3 |
| A fade, a hover, a press | **plain CSS** | cheapest tool that works; don't reach for a library |
| Charts | **recharts** | navy + greys — see `CHARTS.md` |
| Long lists (500+ rows) | **react-virtuoso** | below that, paginate instead |
| Drag to reorder | **@dnd-kit** | not yet used in product; no visual spec yet |
| Code / syntax highlighting | **shiki** | render server-side, `github-light` |
| Cross-tree state | **zustand** | e.g. the connections store |
| Icons | **lucide-react** via `react/icon.tsx` | 16px, 1.75 stroke, outline only. The hand-drawn set is legacy. |
| OTP input | **input-otp** | |
| Globe / 3D flourish | **cobe** | marketing only |

---

## Base UI — the default for anything with behaviour

`@base-ui/react`. Unstyled, headless, portals, focus management, and a
`data-starting-style` / `data-ending-style` API that our transitions hook into.
**Prefer it over the Radix-based `library/uitimate` set** for new work: it is
the newer generation and its parts render nothing we have to fight.

Its docs ship inside the package —
`node_modules/@base-ui/react/docs/react/components/*.md` — and they are
authoritative over anything a model remembers.

Available: accordion, alert-dialog, autocomplete, avatar, checkbox,
checkbox-group, collapsible, combobox, context-menu, dialog, drawer, field,
fieldset, form, input, menu, menubar, meter, navigation-menu, number-field,
otp-field, popover, preview-card, progress, radio, radio-group, scroll-area,
select, separator, slider, switch, tabs, toast, toggle, toggle-group, toolbar,
tooltip.

**Portals need the token class.** Anything portalled mounts outside the app
tree, so wrap the portal's children:

```tsx
<Menu.Portal>
  <div className="sweet-portal">
    <Menu.Positioner align="end" sideOffset={6}>
      <Menu.Popup className="popover">…</Menu.Popup>
    </Menu.Positioner>
  </div>
</Menu.Portal>
```

---

## library/uitimate — the Radix/shadcn set

36 components, vendored. Written against shadcn token names
(`bg-primary`, `border-border`), which `globals.css` bridges onto ours — so they
drop in wearing roughly the right palette, but they arrive at shadcn's *scale*
(36px controls, 6px radius). Give them a class from `patterns.css` and let it
win.

Worth keeping, in rough order of usefulness:

| File | Use it for |
|---|---|
| `switch.tsx` | **the** switch — Radix, correct affordance, pill shape |
| `pagination.tsx` | **the** pager — structure is right, restyle via `.pager-link` |
| `table.tsx` | semantic `<table>` when the data really is tabular and needs a caption/footer; our grid rows cover the rest |
| `tabs.tsx`, `accordion.tsx`, `collapsible.tsx` | Radix equivalents if you prefer Radix to Base UI |
| `select.tsx`, `checkbox.tsx`, `radio-group.tsx`, `slider.tsx`, `textarea.tsx`, `input.tsx`, `label.tsx` | form parts |
| `dropdown-menu.tsx`, `context-menu.tsx`, `menubar.tsx`, `popover.tsx`, `hover-card.tsx`, `tooltip.tsx`, `dialog.tsx` | Radix popper family |
| `breadcrumb.tsx`, `navigation-menu.tsx`, `pagination.tsx` | navigation |
| `avatar.tsx` | image avatars with a fallback (ours are initials only) |
| `progress.tsx` + `progress.css` | determinate progress |
| `scroll-area.tsx` | custom scrollbars in a panel |
| `separator.tsx`, `skeleton.tsx`, `timeline.tsx`, `list.tsx`, `heading.tsx` | small structural pieces |
| `icon.tsx`, `accessible-icon.tsx` | Iconify wrapper — **note it fetches icon data over the network**; prefer our local `icons.tsx` in product |
| `cta.tsx` | shadcn button variants; we use `.button` instead |
| `slot.tsx`, `utils.ts` | internals the rest depend on |

---

## library/magicui — motion pieces, use sparingly

Eight components. These are decorative by nature, and the system is not. Rules:

- **Fine in product:** `number-ticker` (or prefer `@number-flow/react`),
  `animated-circular-progress-bar` (as a gauge, recoloured to `--primary`),
  `animated-list` (a live feed — though `motion` + `AnimatePresence` does it in
  ten lines).
- **Marketing only:** `border-beam`, `shimmer-button`, `animated-beam`,
  `word-rotate`, `interactive-hover-button`. A beam travelling around a border
  is exactly the decoration this system removed.

They are Tailwind-class based and read `--animate-*` keyframes from
`lab-magicui.css`; copy that file too if you use them outside this repo.

---

## library/dotmatrix — loaders

Three dot-matrix loaders plus their core and hooks. Candidate for the
"something is happening and we can't say how long" state. **Not yet adopted** —
see the loading-state question in `OPEN-QUESTIONS.md`.

---

## Charts

Only one chart exists so far: a single-series area chart, plus an inline
sparkline drawn as a bare `<path>` (68×20, no library — at that size axes and
tooltips are noise).

Settled so far:

```tsx
stroke      var(--primary)          // 2px, monotone, no dots
fill        url(#gradient)          // --primary at 0.22 → 0
grid        var(--rule-soft)        // horizontal only, no vertical lines
axes        no line, no ticks, 11px --muted labels
tooltip     a .popover card, never the recharts default
animation   isAnimationActive={false} — data appearing is not an entrance
```

Multi-series is decided: **navy for the series the chart is about, greys for
everything else**, with weight, dash and direct labelling doing the work hue
would have done. No green or red, including for up-is-good — full rules,
committed chart types and the Recharts boilerplate are in **`CHARTS.md`**.

---

## Patterns that live here, not in a library

In `react/primitives.tsx`:

| Export | What it is |
|---|---|
| `Tip` | tooltip wrapper — for icon-only chrome and numbers whose column header is too far away |
| `RowMenu` | the `⋯` row overflow menu; every item must be reachable elsewhere too |
| `AppPreview` | hover preview of a record, for detail a row had to truncate |
| `Segmented` | exclusive view switch with a sliding pill (`motion` `layoutId`) |
| `Spark` | 24-point inline trend, plain SVG |
| `useHeightFloor` | holds a filterable block at its unfiltered height so a filter can't lurch the page |

In `react/brand.tsx`: `SweetLogo` and `SweetMark`, both cropped from the one real
lockup — see `assets/README.md`.
