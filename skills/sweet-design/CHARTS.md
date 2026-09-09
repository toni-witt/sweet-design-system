# Charts

**Decided: navy and greys.** One navy for the series that matters, greys for
everything else, and any further difference carried by weight, dash and direct
labelling rather than by hue.

This is the strictest of the options we considered, and it costs something: with
five lines on one axis it is harder to tell them apart at a glance than a
rainbow would be. That cost is the point — it forces the chart to answer a
question rather than display a dataset. When a chart genuinely needs five equal
series, the answer is usually small multiples, not five colours.

---

## The palette

| Role | Value | When |
|---|---|---|
| Subject | `--primary` `#1e376b` | The series the chart is about. There is exactly one. |
| Context | `--chart-grey-1` `#94a3b8` | Comparison, prior period, benchmark |
| Context | `--chart-grey-2` `#cbd5e1` | A third series, or the remainder in a part-to-whole |
| Grid | `--rule-soft` | Horizontal only |
| Axis text | `--muted`, 11px | No axis line, no ticks |

Three series is the comfortable ceiling. Four is possible. Five means split the
chart.

**No green, no red, no amber** — the status rule holds inside charts too. Up and
down are already legible from the shape of the line and the sign on the number;
a hue that means "good" is a second copy of information the reader already has,
and it is exactly the decoration this system removed everywhere else.

For up-is-good / down-is-bad — margin, variance, cash flow — use:

- **Position and sign.** A zero line in `--rule` (heavier than the grid), values
  below it, and the number itself carrying a minus or parentheses.
- **Fill weight.** Positive bars solid navy; negative bars navy at 35% or
  outlined. The reader sees "different" without being told "bad".
- **Direct labelling.** Say `−4.2%` next to the bar. A word beats a colour.

---

## Differentiating without hue

| Device | Use |
|---|---|
| Weight | Subject 2px, context 1.5px. The important line is visibly heavier. |
| Dash | `strokeDasharray="4 3"` for anything that isn't actual — forecast, budget, target, prior period. |
| Fill | Only the subject gets an area fill. Context lines stay lines; two overlapping fills are unreadable. |
| Direct labels | Put the series name at the end of its line, in that line's colour, instead of a legend. The eye doesn't have to travel. |
| Opacity | Non-focused series at 0.55 on hover of another. Never below 0.4 — a ghost line is worse than no line. |

A legend is a failure state: it means the reader has to hold a colour-to-name
mapping in their head while looking somewhere else. Use one only when direct
labelling genuinely doesn't fit.

---

## Chart types we commit to

| Type | Use | Notes |
|---|---|---|
| **Area, single series** | A volume over time | Built. `--primary` stroke, gradient fill 0.22 → 0. |
| **Line, 2–3 series** | Comparison over time | Subject navy 2px, context grey 1.5px, prior-period dashed. |
| **Column / bar** | Categories, periods | Navy. Sort by value unless time is the axis. |
| **Stacked bar** | Part-to-whole over time | Navy + the two greys, and only if there are ≤3 parts. |
| **Horizontal bar** | Ranked categories with long names | Preferred over rotating labels. |
| **Waterfall** | Bridge between two figures | Accounting will ask for it. Navy for increases, navy-35% for decreases, grey for subtotals. |
| **Sparkline** | Trend inside a table row | Built (`Spark`). No axes, no tooltip — at 68×20 those are noise. |
| **Meter / bar** | A single proportion | Built (`.meter-track`). The length is the value; no colour coding. |

**Not committed:** donut and pie (a bar does the job and reads more accurately),
radar, gauge, treemap. If one is genuinely needed, add it here with its rules
rather than one-offing it in a feature.

---

## The furniture

Settled, and the same on every chart:

```tsx
grid        horizontal only, var(--rule-soft), no vertical lines
axes        no axis line, no tick marks, 11px var(--muted) labels
y-axis      4 ticks, compact numbers ("13.5k" not "13,500")
x-axis      interval chosen so labels never rotate — rotate means the chart is too narrow
zero line   var(--rule) when the data crosses zero, otherwise omitted
tooltip     a .popover card; never the recharts default
cursor      1px var(--rule) vertical line, no shaded band
dots        none on the line; activeDot r=4 with a white 2px stroke
animation   isAnimationActive={false}
```

**Data appearing is not an entrance.** A chart that draws itself on every render
is a chart you wait for. Animate a chart only when the *data* changes underneath
a chart already on screen — and then only the transition between values.

Numbers in and around charts are `tabular-nums`, always.

---

## Recharts

```tsx
<AreaChart data={data} margin={{ top: 4, right: 12, bottom: 0, left: -12 }}>
  <defs>
    <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.22} />
      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
    </linearGradient>
  </defs>
  <CartesianGrid vertical={false} stroke="var(--rule-soft)" />
  <XAxis dataKey="t" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11 }} tickMargin={8} />
  <YAxis tickLine={false} axisLine={false} width={48} tickCount={4}
         tick={{ fill: "#64748b", fontSize: 11 }}
         tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(v))} />
  <Tooltip content={<ChartTip />} cursor={{ stroke: "var(--rule)", strokeWidth: 1 }} />
  <Area type="monotone" dataKey="calls" stroke="var(--primary)" strokeWidth={2}
        fill="url(#fill)" dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
        isAnimationActive={false} />
</AreaChart>
```

Recharts reads CSS variables fine for `stroke` and `fill`, but **not** inside
`tick={{ fill }}` — that goes into an SVG attribute, so pass the literal.

---

## Still open

- Small multiples: the grid, the shared axis, and when to switch to them.
- Brush / zoom on long time ranges.
- Null and gap handling — a broken line vs a dashed bridge.
- Annotations: a marker for "policy changed here".
- Export: chart to PNG/PDF for a report, where hover doesn't exist.
