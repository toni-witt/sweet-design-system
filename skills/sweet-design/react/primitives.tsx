"use client";

/**
 * Sweet — primitives
 * ==================
 *
 * The handful of patterns that aren't in any library but appear on every
 * screen. Written against the class names in `patterns.css`, so they work
 * anywhere `tokens.css` + `patterns.css` are loaded.
 *
 * Copy this file into the app rather than importing across a folder boundary,
 * and keep the two in sync — or better, move it into the app's component tree
 * and let this copy be the reference.
 */

import { useEffect, useRef, useState, type ReactElement } from "react";
import { Menu } from "@base-ui/react/menu";
import { PreviewCard } from "@base-ui/react/preview-card";
import { Tooltip } from "@base-ui/react/tooltip";
import { motion } from "motion/react";

/**
 * Anything portalled mounts outside the app tree, so it carries the tokens
 * itself. Every floating layer in the system goes through this.
 */
export function PortalTokens({ children }: { children: React.ReactNode }) {
  return <div className="sweet-portal">{children}</div>;
}

/* ------------------------------------------------------------------ tooltip */

/**
 * For labelling chrome that has no visible label, and for numbers in dense
 * rows whose column header is too far away to help.
 *
 * Put one `<Tooltip.Provider delay={400} closeDelay={80}>` at the app root so
 * moving between two icon buttons shows the second instantly.
 */
export function Tip({
  label,
  side = "top",
  children,
}: {
  label: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  children: ReactElement<Record<string, unknown>>;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={children} />
      <Tooltip.Portal>
        <PortalTokens>
          <Tooltip.Positioner side={side} sideOffset={7}>
            <Tooltip.Popup className="tip">{label}</Tooltip.Popup>
          </Tooltip.Positioner>
        </PortalTokens>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export { Tooltip };

/* ---------------------------------------------------------------- row menu */

export type RowAction = {
  label: string;
  onSelect?: () => void;
  /** Renders in `--destructive`. Only for things that destroy something. */
  danger?: boolean;
  separatorBefore?: boolean;
};

/**
 * The per-row overflow menu. Everything in it must be reachable elsewhere in
 * the product — the menu is a shortcut, never the only route to an action.
 */
export function RowMenu({ label, actions }: { label: string; actions: RowAction[] }) {
  return (
    <Menu.Root>
      <Menu.Trigger className="button button-icon" aria-label={label} style={{ minHeight: 26, width: 26 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="5" cy="12" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="19" cy="12" r="1.8" />
        </svg>
      </Menu.Trigger>
      <Menu.Portal>
        <PortalTokens>
          <Menu.Positioner align="end" sideOffset={6} style={{ outline: "none" }}>
            <Menu.Popup className="popover" style={{ minWidth: 196 }}>
              {actions.map((a) => (
                <div key={a.label}>
                  {a.separatorBefore && <div className="menu-sep" />}
                  <Menu.Item
                    className="menu-item"
                    data-danger={a.danger || undefined}
                    onClick={a.onSelect}
                  >
                    {a.label}
                  </Menu.Item>
                </div>
              ))}
            </Menu.Popup>
          </Menu.Positioner>
        </PortalTokens>
      </Menu.Portal>
    </Menu.Root>
  );
}

/* ------------------------------------------------------------ hover preview */

/**
 * Shows the detail a row had to truncate, without a navigation. Give it
 * whatever the record's summary is; the trigger is your own markup.
 */
export function HoverPreview({
  children,
  content,
  delay = 350,
}: {
  children: ReactElement<Record<string, unknown>>;
  content: React.ReactNode;
  delay?: number;
}) {
  return (
    <PreviewCard.Root>
      <PreviewCard.Trigger delay={delay} render={children} />
      <PreviewCard.Portal>
        <PortalTokens>
          <PreviewCard.Positioner side="top" align="start" sideOffset={8}>
            <PreviewCard.Popup className="popover" style={{ width: 252, padding: 12 }}>
              {content}
            </PreviewCard.Popup>
          </PreviewCard.Positioner>
        </PortalTokens>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
}

/* ------------------------------------------------------- segmented control */

/**
 * Switches what one panel is showing. Deliberately distinct from the filter
 * tabs, which narrow a list — this is exclusive, small, and the selection
 * slides so the two never read as the same control.
 */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  name,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
  /** Scopes the sliding pill so two controls don't animate into each other. */
  name: string;
}) {
  return (
    <div className="seg" role="group">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className="seg-item"
          data-pressed={o === value || undefined}
          aria-pressed={o === value}
          onClick={() => onChange(o)}
        >
          {o === value && (
            <motion.span
              layoutId={`seg-${name}`}
              className="seg-thumb"
              transition={{ type: "spring", stiffness: 520, damping: 42, mass: 0.7 }}
            />
          )}
          <span className="seg-label">{o}</span>
        </button>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- filter tabs */

/** The row of views over one list. Underline plus weight, never a box. */
export function FilterTabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className="tab-filter"
          aria-pressed={o === value}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------ height floor */

/**
 * Holds a filterable block at the height it has when nothing is filtered out.
 *
 * Without it, narrowing a list shortens the document; if the reader is scrolled
 * past the new bottom the browser clamps the scroll and the page lurches
 * upward. Since panels have no visible edge, the reserved space below a short
 * result is simply blank page.
 *
 * Pass `true` while the full set is showing: that pass measures, and every
 * filtered pass afterwards is pinned to what it measured. Returns a
 * `[ref, style]` pair to spread onto the block.
 *
 * If the list is paginated with a fixed page size, don't use this — reserve
 * `pageSize * rowHeight` instead. It's arithmetic, and it's exact.
 */
export function useHeightFloor(atFullHeight: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [floor, setFloor] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !atFullHeight) return;
    const measure = () => setFloor(el.getBoundingClientRect().height);
    measure();
    // Re-measure on resize: rows re-wrap and grids re-flow at other widths.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [atFullHeight]);

  // Never pinned while measuring — the full set is the tallest state anyway.
  const style = { minHeight: atFullHeight ? undefined : floor || undefined };
  return [ref, style] as const;
}

/* ----------------------------------------------------------------- spark */

/**
 * A 24-point trend, inline in a row. Deliberately not a chart component: at
 * 68×20 an axis, a tooltip and a library would all be noise.
 */
export function Spark({
  points,
  width = 68,
  height = 20,
  stroke = "var(--primary)",
}: {
  points: number[];
  width?: number;
  height?: number;
  stroke?: string;
}) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = width / (points.length - 1);
  const d = points
    .map(
      (p, i) =>
        `${i ? "L" : "M"}${(i * step).toFixed(1)},${(
          height -
          ((p - min) / span) * height
        ).toFixed(1)}`,
    )
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={{ display: "block", overflow: "visible" }}
      aria-hidden
    >
      <path
        d={d}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  );
}
