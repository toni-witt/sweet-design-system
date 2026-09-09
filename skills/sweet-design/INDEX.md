# Sweet design system — index

Everything needed to build a new feature that looks like it belongs, plus the
reasoning behind each rule so the next decision can be made the same way.

Agents load `SKILL.md` first; this is the human entry point. Consuming this in
another repo — plugin or npm — is in the root `README.md`.

Distilled from **v9** in this repo (`/v9`), which is the reference
implementation — when this folder and v9 disagree, v9 is the one people have
looked at, so check there before changing anything here.

## Read in this order

| File | What it is |
|---|---|
| **SKILL.md** | The ten rules, and which file to read for what. |
| **PRINCIPLES.md** | The design language. Start here. Every rule, and why. |
| **COMPONENTS.md** | What to reach for, from which library, with the class to give it. |
| **MOTION.md** | How to animate, and how to decide not to. Adapted from Emil Kowalski's skills. |
| **CHARTS.md** | Navy and greys, and how to tell series apart without hue. |
| **MARKETING.md** | Where the rules loosen — and the four that don't. |
| **OPEN-QUESTIONS.md** | Decisions we haven't made. Answer before the feature that needs one. |
| `tokens.css` | Colour, type, spacing, shape, motion — one flat sheet. |
| `patterns.css` | Every component shape the system has settled on. |
| `react/` | The primitives that aren't in any library. |
| `library/` | Vendored component source, copied so this folder stands alone. |
| `assets/` | The logo, and a note on which file is safe to use. |
| `../../reference/v9/` | Eight built screens — screenshots and source — where all of this was decided. |

## Starting a feature

```tsx
import "@toni-witt/sweet-design/tokens.css";
import "@toni-witt/sweet-design/patterns.css";

export default function Screen() {
  return (
    <div className="sweet">
      <main className="page">
        <h1 className="page-title">Proposals</h1>
        {/* no subtitle — see PRINCIPLES.md § 7 */}
      </main>
    </div>
  );
}
```

Two class scopes exist and both matter:

- `.sweet` — the app tree.
- `.sweet-portal` — wraps the children of any portal (menu, dialog, tooltip),
  because those mount outside the app tree and inherit nothing.

## Settled, so you don't have to ask

- **Light only.** There is no dark mode and there won't be one.
- **Charts are navy and greys** — never a rainbow, never red/green for up/down.
- **Icons are Lucide**, 16px at 1.75 stroke.
- **Marketing gets more freedom**, on the same palette and the same edges.

## The five rules that catch people out

1. **One blue.** Attention is navy, everything else is grey. No red, amber or
   green on status — hierarchy comes from fill weight.
2. **No shadows in the page.** Elevation exists only on layers that float over
   content.
3. **Nothing decorative is boxed.** Not dashboard numbers, not icons, not search
   fields.
4. **Nothing goes under a page or section headline.** "Connections", not
   "Connections" plus a sentence explaining it. Marketing is the opposite.
5. **A filter must never change the page height.** Reserve it.

Plus one from `MOTION.md` that catches everyone: **anything opened by the
keyboard doesn't animate.** The command palette appears instantly.

## Keeping it honest

One copy of every rule, in this folder, consumed by both the plugin and the npm
package. See the root `README.md` for where drift comes from and how changes
land.
