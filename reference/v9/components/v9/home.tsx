"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import NumberFlow from "@number-flow/react";
import { Meter } from "@base-ui/react/meter";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Mark } from "@/components/v9/mark";
import { AppPreview, RowMenu, Segmented, Spark, Tip, useHeightFloor } from "@/components/v9/ui";
import { useConnections } from "@/components/v9/store";
import { auditLog } from "@/lib/audit";
import { connectedApps, throughput, type ConnectedApp, type Health } from "@/lib/apps";

/* One hue, and it is the dark one — stroke and fill are the same navy at
   different opacities rather than two blues. */
const SERIES = "#1e376b";

const filters = [
  "All",
  "Needs attention",
  "Accounting",
  "Commerce",
  "Payments",
  "Communication",
  "Documents",
  "CRM",
] as const;
type Filter = (typeof filters)[number];

const ranges = ["24h", "7d", "30d"] as const;
type Range = (typeof ranges)[number];

const severity: Record<Health, number> = {
  error: 0,
  degraded: 1,
  expiring: 2,
  syncing: 3,
  healthy: 4,
};

const pillFor: Record<Health, { cls: string; label: string }> = {
  healthy: { cls: "pill pill-success", label: "Healthy" },
  expiring: { cls: "pill pill-warning", label: "Token expiring" },
  degraded: { cls: "pill pill-warning", label: "Degraded" },
  error: { cls: "pill pill-danger", label: "Reconnect" },
  syncing: { cls: "pill pill-accent pill-pulse", label: "Syncing" },
};

const railFor: Record<Health, string> = {
  healthy: "transparent",
  expiring: "var(--sweet-attention)",
  degraded: "var(--sweet-attention)",
  error: "var(--sweet-attention)",
  syncing: "var(--sweet-accent)",
};

const actionFor: Record<Health, string | null> = {
  healthy: null,
  expiring: "Renew",
  degraded: "Diagnose",
  error: "Reconnect",
  syncing: null,
};

const errorsToday = throughput.reduce((n, p) => n + p.errors, 0);
const baseCalls = throughput.reduce((n, p) => n + p.calls, 0);
const errorRate = (errorsToday / baseCalls) * 100;

/* The mock only ships 24h of real shape. The longer windows are folded out of
   it deterministically — same numbers on the server and the client, and the
   curve keeps the working-day rhythm instead of turning into noise. */
function wobble(i: number) {
  return 0.86 + ((Math.sin(i * 12.9898) * 43758.5453) % 1) * 0.28;
}

const series: Record<Range, Array<{ t: string; calls: number }>> = {
  "24h": throughput.map((p) => ({ t: p.t, calls: p.calls })),
  "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((t, i) => ({
    t,
    calls: Math.round(baseCalls * (i > 4 ? 0.42 : 1) * wobble(i)),
  })),
  "30d": Array.from({ length: 30 }, (_, i) => ({
    t: `${i + 1}`,
    calls: Math.round(baseCalls * (i % 7 > 4 ? 0.44 : 1) * wobble(i + 3)),
  })),
};

const rangeNote: Record<Range, string> = {
  "24h": "Last 24 hours, UTC",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
};

function ChartTip({
  active,
  payload,
  label,
  suffix,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        padding: "6px 9px",
        border: "1px solid var(--sweet-rule)",
        background: "#ffffff",
        boxShadow: "var(--sweet-shadow-lg)",
      }}
    >
      <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--sweet-text-muted)" }}>
        {label}
        {suffix}
      </p>
      <p className="mono strong" style={{ margin: "2px 0 0", fontSize: "0.84375rem" }}>
        {payload[0].value.toLocaleString()} calls
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ live activity */

const feedSeed = auditLog.slice(0, 5);

function LiveFeed() {
  const [items, setItems] = useState(feedSeed);

  useEffect(() => {
    let n = feedSeed.length;
    const id = setInterval(() => {
      const next = auditLog[n % auditLog.length];
      n += 1;
      setItems((prev) => [{ ...next, id: `${next.id}-${n}` }, ...prev].slice(0, 6));
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="feed">
      <AnimatePresence initial={false}>
        {items.map((e) => {
          const app = e.app ? connectedApps.find((a) => a.id === e.app) : null;
          return (
            <motion.div
              key={e.id}
              layout
              className="feed-item"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            >
              {app ? (
                <Mark app={app} size="sm" />
              ) : (
                <span
                  style={{
                    flex: "none",
                    width: 22,
                    display: "grid",
                    placeItems: "center",
                    color: "var(--sweet-text-muted)",
                  }}
                >
                  ·
                </span>
              )}
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color:
                    e.result === "ok" ? "var(--sweet-text)" : "var(--sweet-ink)",
                  fontWeight: e.result === "ok" ? 400 : 500,
                }}
              >
                {e.summary}
              </span>
              {e.result !== "ok" && (
                <span
                  className={e.result === "error" ? "pill pill-danger" : "pill pill-warning"}
                >
                  {e.result}
                </span>
              )}
              <span className="mono fade" style={{ flex: "none", fontSize: "0.6875rem" }}>
                {e.at}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ screen */

export function V9Home() {
  const apps = useConnections((s) => s.apps);
  const justAdded = useConnections((s) => s.justAdded);
  const disconnect = useConnections((s) => s.disconnect);
  /** The connection a confirm dialog is currently asking about. */
  const [pendingDisconnect, setPendingDisconnect] = useState<ConnectedApp | null>(null);

  const [filter, setFilter] = useState<Filter>("All");
  const [range, setRange] = useState<Range>("24h");
  const [calls, setCalls] = useState(baseCalls);

  useEffect(() => {
    const id = setInterval(
      () => setCalls((c) => c + Math.floor(2 + Math.random() * 9)),
      2600,
    );
    return () => clearInterval(id);
  }, []);

  const [rowsRef, rowsStyle] = useHeightFloor(filter === "All");

  const healthy = apps.filter((a) => a.health === "healthy").length;
  const attention = apps.filter((a) => a.health !== "healthy" && a.health !== "syncing");
  const healthyPct = apps.length ? Math.round((healthy / apps.length) * 100) : 0;

  const shown = useMemo(() => {
    const base =
      filter === "All"
        ? apps
        : filter === "Needs attention"
          ? apps.filter((a) => a.health !== "healthy" && a.health !== "syncing")
          : apps.filter((a) => a.category === filter);
    return [...base].sort(
      (a, b) => severity[a.health] - severity[b.health] || a.name.localeCompare(b.name),
    );
  }, [filter, apps]);

  return (
    <>
      <div
        className="enter"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <div>
          <h1 className="page-title">Connections</h1>
        </div>
        <span className="pill pill-success" style={{ marginTop: 8 }}>
          Endpoint live
        </span>
      </div>

      {/* The attention band is a navy wash rather than a bordered white card —
          it has to read as *above* the page without reading as a card. */}
      <div
        className="card panel-soft enter"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 16,
          marginTop: 20,
          animationDelay: "40ms",
        }}
      >
        <span style={{ display: "flex" }}>
          {attention.map((a, i) => (
            <span key={a.id} style={{ marginLeft: i ? -6 : 0 }}>
              <Mark app={a} size="sm" ring />
            </span>
          ))}
        </span>
        <p style={{ margin: 0, flex: 1, minWidth: 260, fontSize: "0.84375rem", lineHeight: 1.5 }}>
          <span className="strong">{attention.length} connections need attention.</span>{" "}
          <span className="fade">
            One token was revoked upstream, two expire this week, and eBay is answering
            slowly. Agents fail silently when these lapse.
          </span>
        </p>
        <button
          type="button"
          className="button button-secondary button-small"
          onClick={() => setFilter("Needs attention")}
        >
          Review all
        </button>
      </div>

      <div className="stat-row enter" style={{ marginTop: 28, animationDelay: "80ms" }}>
        <div className="stat-cell">
          <span className="stat-label">Connected apps</span>
          <span className="stat-value">
            <NumberFlow value={apps.length} />
          </span>
          <span className="stat-caption">Across 6 categories</span>
        </div>

        <div className="stat-cell">
          <span className="stat-label">Healthy</span>
          <span className="stat-value" style={{ color: "var(--sweet-success)" }}>
            {healthy}
          </span>
          {/* The bar says "of the fleet" faster than the caption can. */}
          <Meter.Root value={healthyPct} style={{ display: "grid", gap: 6 }}>
            <Meter.Track className="meter-track">
              <Meter.Indicator
                className="meter-fill"
                style={{ background: "var(--sweet-primary)" }}
              />
            </Meter.Track>
            <Meter.Label className="stat-caption">{healthyPct}% of fleet</Meter.Label>
          </Meter.Root>
        </div>

        <div className="stat-cell">
          <span className="stat-label">Needs attention</span>
          <span className="stat-value" style={{ color: "var(--sweet-warning)" }}>
            {attention.length}
          </span>
          <span className="stat-caption">2 expiring · 1 slow · 1 revoked</span>
        </div>

        <div className="stat-cell">
          <span className="stat-label">Tool calls today</span>
          <span className="stat-value">
            <NumberFlow value={calls} />
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <span className="stat-caption">{errorRate.toFixed(2)}% error rate</span>
            <Spark points={throughput.map((p) => p.calls)} />
          </span>
        </div>
      </div>

      <div
        className="enter home-split"
        style={{ marginTop: 32, animationDelay: "120ms" }}
      >
        <div className="card card-raised">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div>
              <h2 className="section-title">MCP tool calls</h2>
              <span className="fade" style={{ fontSize: "0.78125rem" }}>
                {rangeNote[range]}
              </span>
            </div>
            <Segmented name="range" value={range} onChange={setRange} options={ranges} />
          </div>

          <div style={{ height: 140, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={series[range]}
                margin={{ top: 4, right: 12, bottom: 0, left: -12 }}
              >
                <defs>
                  <linearGradient id="v9Calls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={SERIES} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={SERIES} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--sweet-rule-soft)" />
                <XAxis
                  dataKey="t"
                  tickLine={false}
                  axisLine={false}
                  interval={range === "24h" ? 3 : range === "30d" ? 4 : 0}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  tickCount={4}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  /* Five-figure counts don't fit a 48px gutter, and widening
                     it steals from the plot. 13.5k reads at a glance anyway. */
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${(v / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(v)
                  }
                />
                <ChartTooltip
                  content={<ChartTip suffix={range === "24h" ? ":00" : ""} />}
                  cursor={{ stroke: "rgba(15, 23, 42, 0.16)", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="calls"
                  stroke={SERIES}
                  strokeWidth={2}
                  fill="url(#v9Calls)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: "#ffffff" }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card card-raised">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <h2 className="section-title">Live activity</h2>
            <span className="pill pill-accent pill-pulse">Streaming</span>
          </div>
          <LiveFeed />
        </div>
      </div>

      <div
        className="enter"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginTop: 40,
          animationDelay: "160ms",
        }}
      >
        <h2 className="section-title">Your connections</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className="chip"
              aria-pressed={f === filter}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="enter" style={{ marginTop: 10, animationDelay: "200ms" }}>
        <div className="conn-head">
          <span>App</span>
          <span>Status</span>
          <span className="col-detail">Detail</span>
          <span className="col-tools" style={{ textAlign: "right" }}>
            Tools
          </span>
          <span className="col-calls" style={{ textAlign: "right" }}>
            Calls
          </span>
          <span className="col-p95" style={{ textAlign: "right" }}>
            p95
          </span>
          <span className="col-sync">Last sync</span>
          <span />
        </div>

        {/* A filtered-out row leaves at once; the rows that survive slide to
            their new position rather than snapping. Exit animations are
            deliberately absent here: a row on its way out still occupies the
            track, so a list that loses eight of twelve spends a beat looking
            broken — and `mode="popLayout"` pops them out of flow, where an
            interrupted exit strands them as ghosts over the live rows. And the
            block holds its full height, so narrowing the list can never pull
            the page out from under the reader. */}
        <div ref={rowsRef} style={rowsStyle}>
        <motion.div layout>
          {shown.map((app) => {
              const pill = pillFor[app.health];
              const cta = actionFor[app.health];
              return (
                <motion.div
                  key={app.id}
                  layout="position"
                  className="conn-row"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="conn-rail" style={{ background: railFor[app.health] }} />

                  <AppPreview app={app}>
                    <span
                      style={{
                        display: "flex",
                        minWidth: 0,
                        alignItems: "center",
                        gap: 12,
                        cursor: "default",
                      }}
                    >
                      <Mark app={app} />
                      <span style={{ minWidth: 0 }}>
                        <span
                          style={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "0.84375rem",
                            fontWeight: 600,
                            color: "var(--sweet-ink)",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {app.name}
                          {justAdded.includes(app.id) && (
                            <span className="tag" style={{ marginLeft: 6 }}>
                              New
                            </span>
                          )}
                        </span>
                        <span
                          className="fade"
                          style={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "0.75rem",
                          }}
                        >
                          {app.account}
                        </span>
                      </span>
                    </span>
                  </AppPreview>

                  <span>
                    <span className={pill.cls}>{pill.label}</span>
                  </span>

                  <span
                    className="col-detail"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: "0.78125rem",
                      color:
                        app.health === "healthy" || app.health === "syncing"
                          ? "var(--sweet-text-muted)"
                          : "var(--sweet-text)",
                    }}
                  >
                    {app.note}
                  </span>

                  <span
                    className="col-tools mono fade"
                    style={{ textAlign: "right", fontSize: "0.78125rem" }}
                  >
                    {app.tools}
                  </span>
                  <span
                    className="col-calls mono fade"
                    style={{ textAlign: "right", fontSize: "0.78125rem" }}
                  >
                    {app.callsToday.toLocaleString()}
                  </span>

                  {/* p95 is the one number in the row people misread, so it
                      gets the definition rather than the column header. */}
                  <Tip label="95th percentile round-trip, last hour">
                    <span
                      className="col-p95 mono"
                      style={{
                        textAlign: "right",
                        fontSize: "0.78125rem",
                        color:
                          app.latencyMs > 1000
                            ? "var(--sweet-warning)"
                            : "var(--sweet-text-muted)",
                      }}
                    >
                      {app.latencyMs ? `${(app.latencyMs / 1000).toFixed(2)}s` : "—"}
                    </span>
                  </Tip>

                  <span className="col-sync fade" style={{ fontSize: "0.75rem" }}>
                    {app.health === "syncing" ? "syncing now" : app.lastSync}
                  </span>

                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 4,
                    }}
                  >
                    {cta && (
                      <button
                        type="button"
                        /* The broken row's action is the one thing on this
                           screen worth pressing, so it is the filled button —
                           red would be saying "danger" about a repair. */
                        className={`button button-small ${
                          app.health === "error" ? "button-primary" : "button-secondary"
                        }`}
                        onClick={() =>
                          toast.success(`${cta} — ${app.name}`, {
                            description: "Handshake queued. The row updates when it lands.",
                          })
                        }
                      >
                        {cta}
                      </button>
                    )}
                    <RowMenu
                      label={`Actions for ${app.name}`}
                      actions={[
                        { label: "Open connection", onSelect: () => toast(`${app.name} — connection`) },
                        { label: "Run health check", onSelect: () => toast.success(`Checking ${app.name}…`) },
                        { label: "Copy tool namespace", onSelect: () => toast.success(`${app.id}.* copied`) },
                        {
                          label: "Disconnect",
                          danger: true,
                          separatorBefore: true,
                          onSelect: () => setPendingDisconnect(app),
                        },
                      ]}
                    />
                  </span>
                </motion.div>
              );
          })}
        </motion.div>
        </div>
      </div>

      <AlertDialog.Root
        open={pendingDisconnect !== null}
        onOpenChange={(open) => !open && setPendingDisconnect(null)}
      >
        <AlertDialog.Portal>
          <div className="s9-root-portal">
            <AlertDialog.Backdrop className="palette-backdrop" />
            <AlertDialog.Popup className="confirm">
              <AlertDialog.Title className="confirm-title">
                Disconnect {pendingDisconnect?.name}?
              </AlertDialog.Title>
              <AlertDialog.Description className="confirm-body">
                {pendingDisconnect?.tools} tools stop responding immediately, for every
                agent pointed at this endpoint. The stored credential is dropped; the
                audit log is kept.
              </AlertDialog.Description>

              <div className="confirm-actions">
                <AlertDialog.Close className="button button-secondary button-small">
                  Keep it
                </AlertDialog.Close>
                <button
                  type="button"
                  className="button button-danger button-small"
                  onClick={() => {
                    const app = pendingDisconnect;
                    if (!app) return;
                    disconnect(app.id);
                    setPendingDisconnect(null);
                    toast.error(`${app.name} disconnected`, {
                      description: `${app.tools} tools are offline. Reconnect from ⌘K.`,
                    });
                  }}
                >
                  Disconnect
                </button>
              </div>
            </AlertDialog.Popup>
          </div>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
}
