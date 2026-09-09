"use client";

import Link from "next/link";
import { SweetLogo, SweetMark } from "@/components/brand";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { attentionCount, useConnections } from "@/components/v9/store";
import { proposals } from "@/lib/proposals";
import { V9Palette } from "@/components/v9/palette";
import { PaletteContext } from "@/components/palette-context";
import { MotionConfig } from "motion/react";
import { Notifications } from "@/components/v9/notifications";
import { Tip, Tooltip } from "@/components/v9/ui";
import { useStoredFlag } from "@/lib/use-stored-flag";

const nav = [
  { href: "/v9", label: "Connections", icon: Icon.connections },
  { href: "/v9/mcp", label: "MCP", icon: Icon.mcp },
  { href: "/v9/skills", label: "Skills", icon: Icon.skills },
  { href: "/v9/proposals", label: "Proposals", icon: Icon.proposals },
  { href: "/v9/microsites", label: "Microsites", icon: Icon.microsites },
  { href: "/v9/audit", label: "Audit log", icon: Icon.audit },
  { href: "/v9/team", label: "Team", icon: Icon.team },
  { href: "/v9/settings", label: "Settings", icon: Icon.settings },
];

/* Two rails' worth of badge, both counting something a person has to act on. */
const PROPOSALS_PENDING = proposals.filter(
  (p) => p.status === "review" || p.status === "ready",
).length;

export function V9Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const needsAttention = useConnections((s) => attentionCount(s.apps));
  const [collapsed, setCollapsed] = useStoredFlag("v9:rail-collapsed", false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const openPalette = useCallback(() => setPaletteOpen(true), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
    <Tooltip.Provider delay={400} closeDelay={80}>
    <div className="s9-root">
      <div className="app-ground">
        <div aria-hidden className="app-ground-ambient">
          <span className="app-ground-orb app-ground-orb-a" />
          <span className="app-ground-orb app-ground-orb-b" />
          <span className="app-ground-glow" />
        </div>

        <div className="app-ground-content shell">
          <aside className="rail" data-collapsed={collapsed || undefined}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                minHeight: 40,
                padding: "0 8px 12px",
              }}
            >
              {collapsed ? <SweetMark size={22} /> : <SweetLogo height={22} />}
            </div>

            <nav style={{ display: "grid", gap: 4 }}>
              {nav.map((item) => {
                const Glyph = item.icon;
                const active = pathname === item.href;
                const badge =
                  item.href === "/v9"
                    ? needsAttention
                    : item.href === "/v9/proposals"
                      ? PROPOSALS_PENDING
                      : null;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rail-link"
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                  >
                    <Glyph />
                    {!collapsed && (
                      <>
                        <span>{item.label}</span>
                        {badge ? <span className="rail-badge">{badge}</span> : null}
                      </>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div style={{ marginTop: "auto", display: "grid", gap: 10 }}>
              <button
                type="button"
                className="rail-link"
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                style={{ background: "none", cursor: "pointer", textAlign: "left" }}
              >
                <Icon.panel />
                {!collapsed && <span>Collapse</span>}
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  paddingTop: 14,
                }}
              >
                <span className="avatar">T</span>
                {!collapsed && (
                  <span style={{ minWidth: 0, lineHeight: 1.25 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.78125rem",
                        fontWeight: 600,
                        color: "var(--sweet-ink)",
                      }}
                    >
                      Toni
                    </span>
                    <span style={{ display: "block", fontSize: "0.75rem" }} className="fade">
                      Northwind · Owner
                    </span>
                  </span>
                )}
              </div>
            </div>
          </aside>

          <div style={{ display: "flex", minWidth: 0, flex: 1, flexDirection: "column" }}>
            <header className="topbar">
              <button
                type="button"
                onClick={openPalette}
                className="input input-small"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  maxWidth: 420,
                  paddingRight: 8,
                  cursor: "pointer",
                  textAlign: "left",
                  color: "var(--sweet-text-muted)",
                }}
              >
                <Icon.search />
                <span style={{ flex: 1 }}>Search or connect an app…</span>
                <span className="kbd">⌘K</span>
              </button>

              <button
                type="button"
                onClick={openPalette}
                className="button button-primary button-small"
              >
                <Icon.plus />
                Add connection
              </button>

              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                <Tip label="Support">
                  <button
                    type="button"
                    className="button button-secondary button-icon"
                    aria-label="Support"
                  >
                    <Icon.support />
                  </button>
                </Tip>
                <Notifications />
                <Tip label="Settings">
                  <Link
                    href="/v9/settings"
                    className="button button-secondary button-icon"
                    aria-label="Settings"
                  >
                    <Icon.settings />
                  </Link>
                </Tip>
                <span className="avatar">T</span>
              </div>
            </header>

            {/* The home screen is the one place trying a softer button. */}
            <main className="page" data-home={pathname === "/v9" || undefined}>
              <PaletteContext.Provider value={openPalette}>{children}</PaletteContext.Provider>

              <p className="fade" style={{ marginTop: 40, fontSize: "0.78125rem" }}>
                v9 — v8&apos;s flat, compact base with every corner squared and the
                hairlines put back where alignment needs them.{" "}
                <Link href="/v8" style={{ color: "var(--sweet-primary)", fontWeight: 600 }}>
                  Compare with v8 →
                </Link>
              </p>
            </main>
          </div>
        </div>
      </div>

      <V9Palette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
    </Tooltip.Provider>
    </MotionConfig>
  );
}
