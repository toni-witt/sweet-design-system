# Motion

How to animate in this system, and — more often — how to decide not to.

Adapted from **Emil Kowalski's design-engineering skills**
([emilkowal.ski/skill](https://emilkowal.ski/skill), and the course at
[animations.dev](https://animations.dev/)). The framework is his; the tokens,
durations and the worked examples are ours. If you have the skills installed,
`animate` builds one, `review-animations` critiques one, and
`find-animation-opportunities` looks for places that want one.

The bar: **an animation either has a job or it doesn't ship.** In a product
people use every day, the aggregate of unnoticed correctness is what makes an
interface feel expensive — and an animation nobody asked for is what makes it
feel slow.

---

## Run these in order

Steps 1 and 2 gate everything. Don't reach for a curve before you know whether
the thing animates at all.

### 1. Should this animate?

| How often will someone see it | Decision |
|---|---|
| 100+/day — keyboard shortcuts, the command palette | **Never animate.** Stop here. |
| Tens/day — hover, list navigation | Near-imperceptible, or nothing |
| Occasional — modals, drawers, toasts | Standard animation |
| Rare / first-run — onboarding, celebration | The delight budget lives here |

**Keyboard-initiated actions are a disqualifier, not a judgement call.** Raycast
has no open/close animation, and that is correct for something opened hundreds
of times a day. This is already house rule — our command palette opens
instantly. If you typed `⌘K` you are already looking at where it will be.

Producing zero lines of code here is a success.

### 2. Name the purpose

One of these words, before you continue:

- **Feedback** — confirming the interface heard the user
- **Spatial consistency** — showing where something came from or went
- **State indication** — making a change legible
- **Preventing a jarring change** — bridging content that would otherwise teleport
- **Explanation** — marketing and onboarding only
- **Delight** — allowed only at the rare / first-run tier

Can't name it? Don't build it. And check function: **data someone is reading or
acting on does not move for style.** A decorative mouse-tracking effect belongs
on a marketing page, not on a chart in an accounting product.

### 3. Pick the cheapest tool that works

Walk down; stop at the first that fits.

| Need | Tool |
|---|---|
| Hover, press, colour, a state you toggle with a class or attribute | **CSS transition** |
| Entry on mount, no JS state | **CSS `@starting-style`** |
| Predetermined motion that must stay smooth while the page is loading | **CSS animation** (off the main thread) |
| Programmatic control with CSS performance, no library | **WAAPI** — `element.animate()` |
| Springs, layout animation, exit animation, gesture-driven values | **motion** (`motion/react`) |

CSS beats JS under load: `requestAnimationFrame` animation drops frames while
the browser is loading, scripting or painting; CSS animation doesn't.

If what you actually need is a *component* — a toast, a drawer, a menu, a
command palette — stop and read `COMPONENTS.md`. Hand-rolling those is how you
end up with a `<div>` dropdown and no focus management.

### 4. Pick the properties

- **`transform` and `opacity` only.** They skip layout and paint and run on the
  GPU. `width`, `height`, `margin`, `padding`, `top`, `left` trigger all three.
  (`clip-path` is the sanctioned fourth; `height` is tolerated for accordions,
  where there is no transform equivalent.)
- **Never `scale(0)`.** Start at `scale(0.95–0.97)` with `opacity: 0`. Nothing
  in the real world appears from nothing.
- **`transform-origin` at the trigger** for popovers, menus and tooltips — Base
  UI gives you `var(--transform-origin)` and our `.popover` and `.tip` already
  use it. **Modals are exempt**: they aren't anchored to a trigger, so they stay
  centred.
- **Percentages in `translate()`** are relative to the element's own size.
  `translateY(100%)` moves it by its own height whatever the content is.
- **In motion, use the full transform string.** The `x` / `y` / `scale`
  shorthands are not hardware-accelerated:

  ```jsx
  <motion.div animate={{ x: 100 }} />                          // drops frames under load
  <motion.div animate={{ transform: "translateX(100px)" }} />  // hardware accelerated
  ```

- **Never drive a child's transform from a CSS variable on the parent** — it
  recalculates styles for every child. Set `transform` on the element itself.

### 5. Easing and duration — or a spring

| Situation | Easing | Token |
|---|---|---|
| Entering or exiting | ease-out | `--ease-out` |
| Moving or morphing on screen | ease-in-out | `--ease-in-out` |
| Hover, colour change | ease | — |
| Constant motion (marquee, progress) | linear | — |
| Default | ease-out | `--ease-out` |

**Never `ease-in` on UI.** It starts slow, delaying the exact moment the user is
watching. `ease-out` at 200ms *feels* faster than `ease-in` at 200ms. There is
deliberately no ease-in token in `tokens.css`.

Built-in CSS easings are too weak to read as intentional. Use the named curves;
if you need one that isn't there, take it from [easing.dev](https://easing.dev/)
rather than inventing a `cubic-bezier` that looks familiar.

| Element | Duration | Token |
|---|---|---|
| Button press feedback | 100–160ms | `--fast` |
| Tooltip, small popover | 125–200ms | `--fast` |
| Dropdown, select | 150–250ms | `--base` |
| Modal, drawer | 200–500ms | `--base` |
| List entrance | 260ms | `--slow` |
| Marketing / explanatory | can be longer | — |

**Under 300ms, always,** unless there is a reason. A 180ms dropdown feels more
responsive than a 400ms one — and perceived speed is real speed as far as the
user is concerned. A faster spinner makes a page feel like it loaded quicker at
identical load times.

**Reach for a spring** when the motion carries momentum or can be interrupted: a
drag, a sliding selection, a gesture that can reverse. Springs keep velocity
through an interruption; CSS transitions and keyframes restart.

```js
{ type: "spring", duration: 0.5, bounce: 0.2 }             // Apple's form — reasons better
{ type: "spring", mass: 1, stiffness: 100, damping: 10 }   // traditional, more control
```

Keep bounce at 0.1–0.3 and out of most product UI. Ours: the segmented control's
sliding pill, at `stiffness: 520, damping: 42, mass: 0.7`.

### 6. Interruption and exit

- **Transitions, not keyframes, for anything triggered rapidly** — toasts,
  toggles, anything firable twice in a second. Transitions retarget from the
  current value; keyframes restart from zero.
- **Exit the way it entered.** A toast that slides in from the bottom leaves
  through the bottom. Symmetric paths are what make swipe-to-dismiss obvious.
- **Asymmetric timing where the user is deciding.** Slow on the deliberate phase
  (hold-to-confirm: 2s linear), snappy on the response (release: 200ms ease-out).
- **No exit animation on a filtered list.** House rule, learned the hard way: a
  row on its way out still occupies the track, so a list that loses eight of
  twelve spends a beat looking broken — and `mode="popLayout"` pops them out of
  flow, where an interrupted exit strands them as ghosts over the live rows.
  Removed rows go at once; the survivors slide with `layout`.

### 7. Gating ships with the animation

Not as a follow-up.

```css
@media (prefers-reduced-motion: reduce) { /* keep opacity, drop movement */ }
@media (hover: hover) and (pointer: fine) { /* touch fires false hovers on tap */ }
```

```jsx
<MotionConfig reducedMotion="user">  {/* covers the JS half */}
```

Reduced motion means **fewer and gentler**, not zero — keep the transitions that
aid comprehension, remove the ones that move things.

---

## What we already do, and why

| Where | What | Why |
|---|---|---|
| Command palette | No open/close animation | Keyboard-initiated, seen constantly |
| Buttons | `scale(0.985)` on `:active` | Instant feedback; the UI heard you |
| Popovers, menus, tooltips | `scale(0.96–0.97)` + opacity, from `var(--transform-origin)` | Scales out of its trigger, never from nothing |
| Modals | `scale(0.98)` + opacity, centred | Not anchored to a trigger |
| Sheet | `translateX(16px)` + opacity | Comes from the edge it lives on |
| List entrance | opacity + 6px, 40ms stagger | Cascade reads as arrival, not a flash |
| Filter change | `layout` on rows, no exit | Survivors slide, leavers go |
| Segmented control | `layoutId` spring | The selection moves, so it should move |
| Live feed | `AnimatePresence`, enter from −10px | New things arrive from where new things come from |
| Meters | `width` over 600ms | The one width transition; a bar filling is the content |

---

## Never ship

| Never | Instead |
|---|---|
| `transition: all` | Name the exact properties |
| `scale(0)` entrance | `scale(0.95)` + `opacity: 0` |
| `ease-in` on UI | `ease-out` or a strong custom curve |
| Built-in `ease-out` on something deliberate | `var(--ease-out)` |
| Animation on a keyboard action or a 100+/day interaction | No animation |
| A UI duration over 300ms without a reason | 150–250ms |
| `transform-origin: center` on a trigger-anchored popover | `var(--transform-origin)` |
| Keyframes on toasts, toggles, rapidly-triggered things | CSS transitions |
| Animating `width` / `height` / `margin` / `top` | `transform` / `opacity` |
| motion's `x` / `y` / `scale` under load | The full `transform` string |
| Ungated `:hover` motion | `@media (hover: hover) and (pointer: fine)` |
| Missing `prefers-reduced-motion` | A gentler variant, not zero |
| Everything entering at once | 30–80ms stagger |

---

## Checking your work

Code review can't settle feel. When the result depends on it — a crossfade, a
spring's bounce, the opacity/height balance in an entering list:

- Play it at **2–5× the duration**, or use the DevTools animation inspector.
  Things invisible at full speed are obvious at a quarter speed: two states
  overlapping in a crossfade, a transform-origin at the wrong corner, properties
  drifting out of sync.
- Step it **frame by frame** for coordinated properties.
- Test gestures on **real hardware**, not the simulator.
- **Look again the next day.** You will see what you missed while building it.

A trick worth knowing: when a crossfade between two states feels off no matter
the easing, add `filter: blur(2px)` during the transition. Without it you see two
distinct objects overlapping; blur blends them into one thing changing. Keep it
under 20px — heavy blur is expensive, especially in Safari.
