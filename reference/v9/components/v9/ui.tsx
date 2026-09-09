"use client";

import { useEffect, useRef, useState } from "react";
import { Menu } from "@base-ui/react/menu";
import { PreviewCard } from "@base-ui/react/preview-card";
import { Tooltip } from "@base-ui/react/tooltip";
import { motion } from "motion/react";
import { Mark } from "@/components/v9/mark";
import type { ConnectedApp } from "@/lib/apps";

/**
 * Popups portal to <body>, outside .s8-root, so each one carries the tokens
 * itself — same arrangement the palette uses for its dialog.
 */
function PortalTokens({ children }: { children: React.ReactNode }) {
  return <div className="s9-root-portal">{children}</div>;
}

/* ------------------------------------------------------------------ tooltip */

/**
 * For labelling chrome that has no visible label, and for the numbers in dense
 * rows where the column header is too far away to help.
 */
export function Tip({
  label,
  side = "top",
  children,
}: {
  label: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactElement<Record<string, unknown>>;
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

/* --------------------------------------------------------------- row menu */

export type RowAction = {
  label: string;
  onSelect?: () => void;
  danger?: boolean;
  separatorBefore?: boolean;
};

/**
 * The per-row overflow menu. Everything in here is reachable elsewhere in the
 * product — the menu is a shortcut, never the only route to an action.
 */
export function RowMenu({ label, actions }: { label: string; actions: RowAction[] }) {
  return (
    <Menu.Root>
      <Menu.Trigger
        className="button button-secondary button-icon"
        aria-label={label}
        style={{ minHeight: 32, width: 32, background: "transparent" }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="5" cy="12" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="19" cy="12" r="1.8" />
        </svg>
      </Menu.Trigger>
      <Menu.Portal>
        <PortalTokens>
          <Menu.Positioner align="end" sideOffset={6} style={{ outline: "none" }}>
            <Menu.Popup className="menu-popup">
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

/* ------------------------------------------------------------ app preview */

/**
 * Hovering a connection's name shows the detail the row had to truncate —
 * scopes, account, throughput — without a navigation.
 */
export function AppPreview({
  app,
  children,
}: {
  app: ConnectedApp;
  children: React.ReactElement<Record<string, unknown>>;
}) {
  return (
    <PreviewCard.Root>
      <PreviewCard.Trigger delay={350} render={children} />
      <PreviewCard.Portal>
        <PortalTokens>
          <PreviewCard.Positioner side="top" align="start" sideOffset={8}>
            <PreviewCard.Popup className="preview-popup">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Mark app={app} />
                <span style={{ minWidth: 0 }}>
                  <span className="strong" style={{ display: "block", fontSize: "0.875rem" }}>
                    {app.name}
                  </span>
                  <span className="fade" style={{ display: "block", fontSize: "0.75rem" }}>
                    {app.account}
                  </span>
                </span>
              </div>

              <p
                className="fade"
                style={{ margin: "12px 0 0", fontSize: "0.78125rem", lineHeight: 1.5 }}
              >
                {app.note}
              </p>

              <div
                style={{
                  display: "grid",
                  gap: 8,
                  marginTop: 14,
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                }}
              >
                {[
                  { k: "Tools", v: String(app.tools) },
                  { k: "Calls", v: app.callsToday.toLocaleString() },
                  { k: "p95", v: app.latencyMs ? `${(app.latencyMs / 1000).toFixed(2)}s` : "—" },
                ].map((s) => (
                  <span key={s.k}>
                    <span
                      className="fade"
                      style={{ display: "block", fontSize: "0.6875rem" }}
                    >
                      {s.k}
                    </span>
                    <span className="strong mono" style={{ fontSize: "0.84375rem" }}>
                      {s.v}
                    </span>
                  </span>
                ))}
              </div>
            </PreviewCard.Popup>
          </PreviewCard.Positioner>
        </PortalTokens>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
}

/* ------------------------------------------------------- segmented control */

/**
 * Switches what one panel is showing. Distinct from the filter chips, which
 * narrow a list — this is exclusive and the selection slides, so the two never
 * read as the same control.
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
  /** Scopes the sliding pill, so two segmented controls don't animate into each other. */
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

/* ----------------------------------------------------------- height floor */

/**
 * Holds a filterable block at the height it has when nothing is filtered out.
 *
 * Without this, narrowing a list shortens the document; if the reader was
 * scrolled past the new bottom the browser clamps the scroll position and the
 * whole page lurches upward — you press a filter and the screen jumps. Since
 * v8 draws no panel edges, the reserved space below a short result is simply
 * blank page, which costs nothing to look at.
 *
 * Pass `true` while the full set is showing: that pass measures, and every
 * filtered pass afterwards is pinned to what it measured. Returns a
 * `[ref, style]` pair to spread onto the block.
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
 * A 24-point trend, inline in a row. Deliberately not a chart component: no
 * axes, no tooltip, no library — at 68×20 those would all be noise.
 */
export function Spark({
  points,
  width = 68,
  height = 20,
  stroke = "var(--sweet-primary)",
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
    .map((p, i) => `${i ? "L" : "M"}${(i * step).toFixed(1)},${(height - ((p - min) / span) * height).toFixed(1)}`)
    .join(" ");

  return (
    <svg
      className="spark"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
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

export { Tooltip };
