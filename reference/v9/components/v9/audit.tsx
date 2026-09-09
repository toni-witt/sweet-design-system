"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { Mark } from "@/components/v9/mark";
import { useHeightFloor } from "@/components/v9/ui";
import { auditKindLabel, auditLog, type AuditKind, type AuditResult } from "@/lib/audit";
import { connectedApps } from "@/lib/apps";

const filters = ["All", "Tool calls", "Auth", "Policy", "Deploys", "Failures"] as const;
type Filter = (typeof filters)[number];

const kindFor: Partial<Record<Filter, AuditKind[]>> = {
  "Tool calls": ["tool_call"],
  Auth: ["auth"],
  Policy: ["policy"],
  Deploys: ["deploy"],
};

const resultPill: Record<AuditResult, string> = {
  ok: "pill pill-success",
  denied: "pill pill-warning",
  error: "pill pill-danger",
};

export function V9Audit() {
  const [filter, setFilter] = useState<Filter>("All");
  const [q, setQ] = useState("");

  // Same reason as the connections list: filtering must not shorten the page.
  const [rowsRef, rowsStyle] = useHeightFloor(filter === "All" && q === "");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return auditLog.filter((e) => {
      if (filter === "Failures" && e.result === "ok") return false;
      const kinds = kindFor[filter];
      if (kinds && !kinds.includes(e.kind)) return false;
      if (!needle) return true;
      return `${e.actor} ${e.summary} ${e.app ?? ""} ${e.hash}`.toLowerCase().includes(needle);
    });
  }, [filter, q]);

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
          <h1 className="page-title">Audit log</h1>
        </div>
        <span className="pill pill-neutral" style={{ marginTop: 8 }}>
          Append-only
        </span>
      </div>

      <div
        className="enter"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginTop: 28,
          animationDelay: "40ms",
        }}
      >
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
        <label className="search-line" style={{ width: 280 }}>
          <Icon.search />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter by actor, tool, hash…"
          />
        </label>
      </div>

      <div className="enter" style={{ marginTop: 12, animationDelay: "80ms" }}>
        <div className="audit-head">
          <span>Time</span>
          <span className="col-kind">Kind</span>
          <span>Actor</span>
          <span>Event</span>
          <span className="col-took" style={{ textAlign: "right" }}>
            Took
          </span>
          <span style={{ textAlign: "right" }}>Result</span>
          <span className="col-hash" style={{ textAlign: "right" }}>
            Hash
          </span>
        </div>

        <div key={`${filter}:${q}`} ref={rowsRef} style={rowsStyle}>
          {shown.map((e, i) => {
            const app = e.app ? connectedApps.find((a) => a.id === e.app) : null;
            return (
              <div
                key={e.id}
                className="audit-row enter"
                style={{ animationDelay: `${100 + Math.min(i, 12) * 40}ms` }}
              >
                <span className="mono fade" style={{ fontSize: "0.75rem" }}>
                  {e.at}
                </span>
                <span className="col-kind">
                  <span className="tag">{auditKindLabel[e.kind]}</span>
                </span>
                <span style={{ display: "flex", minWidth: 0, alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      flex: "none",
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background:
                        e.actorKind === "agent"
                          ? "var(--sweet-accent)"
                          : e.actorKind === "person"
                            ? "var(--sweet-ink)"
                            : "var(--sweet-border-strong)",
                    }}
                  />
                  <span
                    className="fade"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {e.actor}
                  </span>
                </span>
                <span style={{ display: "flex", minWidth: 0, alignItems: "center", gap: 8 }}>
                  {app && <Mark app={app} size="sm" />}
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "var(--sweet-text)",
                      fontWeight: e.result === "ok" ? 400 : 500,
                    }}
                  >
                    {e.summary}
                  </span>
                </span>
                <span className="col-took mono fade" style={{ textAlign: "right", fontSize: "0.75rem" }}>
                  {e.ms === null ? "—" : e.ms > 1000 ? `${(e.ms / 1000).toFixed(1)}s` : `${e.ms}ms`}
                </span>
                <span style={{ display: "flex", justifyContent: "flex-end" }}>
                  <span className={resultPill[e.result]}>{e.result}</span>
                </span>
                <span className="col-hash mono fade" style={{ textAlign: "right", fontSize: "0.75rem" }}>
                  {e.hash}
                </span>
              </div>
            );
          })}

          {shown.length === 0 && (
            <p
              className="fade"
              style={{ padding: "40px 20px", textAlign: "center", fontSize: "0.84375rem" }}
            >
              Nothing matches that filter.
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            padding: "14px 10px 0",
          }}
        >
          <p className="fade" style={{ margin: 0, fontSize: "0.75rem" }}>
            Showing {shown.length} of {auditLog.length} · chain head{" "}
            <span className="mono">#{auditLog[0].seq.toLocaleString()}</span>
          </p>
          <button type="button" className="button button-secondary button-small">
            Export range
          </button>
        </div>
      </div>
    </>
  );
}
