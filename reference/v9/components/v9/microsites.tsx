"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/icons";
import { Mark } from "@/components/v9/mark";
import { RowMenu, useHeightFloor } from "@/components/v9/ui";
import { connectedApps } from "@/lib/apps";
import { microsites, siteStatusLabel, type SiteStatus } from "@/lib/microsites";

const filters = ["All", "Internal", "Client", "Drafts"] as const;
type Filter = (typeof filters)[number];

const pillFor: Record<SiteStatus, string> = {
  live: "pill pill-success",
  building: "pill pill-accent pill-pulse",
  draft: "pill pill-neutral",
  paused: "pill pill-warning",
};

const live = microsites.filter((s) => s.status === "live").length;
const views = microsites.reduce((n, s) => n + s.views7d, 0);
const bars = [38, 62, 44, 78, 55, 88, 66, 94, 72];

export function V9Microsites() {
  const [filter, setFilter] = useState<Filter>("All");

  const [gridRef, gridStyle] = useHeightFloor(filter === "All");

  const shown = useMemo(() => {
    if (filter === "All") return microsites;
    if (filter === "Drafts") return microsites.filter((s) => s.status === "draft");
    return microsites.filter((s) => s.audience === filter);
  }, [filter]);

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
          <h1 className="page-title">Microsites</h1>
        </div>
        <button
          type="button"
          className="button button-primary"
          onClick={() =>
            toast.success("Describe what you need", {
              description: "The builder opens with your 12 connections already in scope.",
            })
          }
        >
          <Icon.plus />
          New microsite
        </button>
      </div>

      <div className="stat-row enter" style={{ marginTop: 24, animationDelay: "40ms" }}>
        <div className="stat-cell">
          <span className="stat-label">Live sites</span>
          <span className="stat-value">{live}</span>
          <span className="stat-caption">{microsites.length} total</span>
        </div>
        <div className="stat-cell">
          <span className="stat-label">Views · 7 days</span>
          <span className="stat-value">{views.toLocaleString()}</span>
          <span className="stat-caption">across all sites</span>
        </div>
        <div className="stat-cell">
          <span className="stat-label">Data freshness</span>
          <span className="stat-value">5 min</span>
          <span className="stat-caption">fastest refresh interval</span>
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
          marginTop: 36,
          animationDelay: "80ms",
        }}
      >
        <h2 className="section-title">All sites</h2>
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

      <div
        key={filter}
        className="site-grid"
        ref={gridRef}
        style={{ marginTop: 12, ...gridStyle }}
      >
        {shown.map((site, i) => (
          <article
            key={site.id}
            className="card site-card enter"
            style={{ animationDelay: `${100 + i * 40}ms` }}
          >
            <div
              className="site-plate"
              style={{
                background: `linear-gradient(135deg, ${site.hue[0]} 0%, ${site.hue[1]} 100%)`,
              }}
            >
              <div className="site-chrome">
                <div style={{ display: "flex", gap: 4 }}>
                  {[0.45, 0.3, 0.2].map((o) => (
                    <span
                      key={o}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 999,
                        background: `rgba(255,255,255,${o})`,
                      }}
                    />
                  ))}
                </div>
                <div className="site-bars">
                  {bars.map((h, n) => (
                    <span key={n} className="site-bar" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <span
                className={pillFor[site.status]}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 14,
                  background: "rgba(8, 21, 38, 0.32)",
                  color: "#ffffff",
                  backdropFilter: "blur(4px)",
                }}
              >
                {siteStatusLabel[site.status]}
              </span>
            </div>

            <div className="site-body">
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <h3
                  style={{
                    margin: 0,
                    flex: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--sweet-ink)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {site.name}
                </h3>
                <span className={site.audience === "Client" ? "pill pill-accent" : "tag"}>
                  {site.audience}
                </span>
                <RowMenu
                  label={`Actions for ${site.name}`}
                  actions={[
                    { label: "Open site", onSelect: () => toast(`${site.name} — opening`) },
                    { label: "Rebuild now", onSelect: () => toast.success(`Rebuilding ${site.name}…`) },
                    { label: "Copy public link", onSelect: () => toast.success("Link copied") },
                    {
                      label: "Unpublish",
                      danger: true,
                      separatorBefore: true,
                      onSelect: () =>
                        toast.error(`Unpublish ${site.name}?`, {
                          description: "Anyone holding the link loses access immediately.",
                        }),
                    },
                  ]}
                />
              </div>

              <p
                className="fade"
                style={{ margin: "8px 0 0", fontSize: "0.78125rem", lineHeight: 1.5 }}
              >
                {site.blurb}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 14,
                }}
              >
                <span style={{ display: "flex" }}>
                  {site.sources.map((id, n) => {
                    const app = connectedApps.find((a) => a.id === id);
                    return app ? (
                      <span key={id} style={{ marginLeft: n ? -5 : 0 }}>
                        <Mark app={app} size="sm" ring />
                      </span>
                    ) : null;
                  })}
                </span>
                <span className="fade" style={{ fontSize: "0.75rem" }}>
                  {site.refresh}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <span className="fade" style={{ fontSize: "0.75rem" }}>
                  {site.views7d ? `${site.views7d.toLocaleString()} views · ` : ""}
                  {site.lastDeploy}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--sweet-primary)",
                  }}
                >
                  Open
                  <Icon.external />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
