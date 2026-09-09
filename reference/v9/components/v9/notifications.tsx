"use client";

import { useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { toast } from "sonner";
import { Icon } from "@/components/icons";
import { Mark } from "@/components/v9/mark";
import { connectedApps } from "@/lib/apps";

type Tone = "bad" | "warn" | "ok";

type Notification = {
  id: string;
  /** Which connection this is about, so the row can carry its monogram. */
  app: string | null;
  tone: Tone;
  title: string;
  detail: string;
  at: string;
};

/* The same four incidents the connections table is showing, plus the two
   background events that would have produced a notification but no alarm. */
const seed: Notification[] = [
  {
    id: "n1",
    app: "slack",
    tone: "bad",
    title: "Slack disconnected",
    detail: "Refresh token revoked upstream. 14 tools are offline for every agent.",
    at: "9h ago",
  },
  {
    id: "n2",
    app: "ebay",
    tone: "warn",
    title: "eBay is answering slowly",
    detail: "p95 is 3.2s, past the 3s threshold for the last 40 minutes.",
    at: "1m ago",
  },
  {
    id: "n3",
    app: "xero",
    tone: "warn",
    title: "Xero token expires in 4 days",
    detail: "Auto-renew runs at 72 hours. Renew now to skip the window.",
    at: "6m ago",
  },
  {
    id: "n4",
    app: "amazon",
    tone: "warn",
    title: "Amazon Seller token expires in 9 days",
    detail: "LWA refresh token. No action needed yet.",
    at: "14m ago",
  },
  {
    id: "n5",
    app: null,
    tone: "ok",
    title: "Month-End Close Board deployed",
    detail: "Build 41 is live. 208 views since the last deploy.",
    at: "2h ago",
  },
  {
    id: "n6",
    app: "qbo",
    tone: "ok",
    title: "QuickBooks token refreshed",
    detail: "Rotated 30 minutes ahead of expiry. Nothing to do.",
    at: "3h ago",
  },
];

/* Two signals, not three: navy means someone has to look, grey means it is
   on the record and nothing is owed. */
const dotFor: Record<Tone, string> = {
  bad: "var(--sweet-attention)",
  warn: "var(--sweet-attention)",
  ok: "var(--sweet-border-strong)",
};

/**
 * The bell and its panel. Unread is a count on the bell and a dot in the
 * gutter of each row — reading one clears its dot, so the mock demonstrates
 * the state change rather than just describing it.
 */
export function Notifications() {
  const [read, setRead] = useState<string[]>(["n5", "n6"]);
  const unread = seed.filter((n) => !read.includes(n.id)).length;

  return (
    <Popover.Root>
      <Popover.Trigger
        className="button button-secondary button-icon"
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        style={{ position: "relative" }}
      >
        <Icon.bell />
        {unread > 0 && (
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "var(--sweet-primary)",
              boxShadow: "0 0 0 2px var(--sweet-bg)",
            }}
          />
        )}
      </Popover.Trigger>

      <Popover.Portal>
        <div className="s9-root-portal">
          <Popover.Positioner align="end" sideOffset={8}>
            <Popover.Popup className="notif-popup">
              <div className="notif-head">
                <Popover.Title
                  className="strong"
                  style={{ margin: 0, fontSize: "0.84375rem" }}
                >
                  Notifications
                  {unread > 0 && (
                    <span className="fade" style={{ fontWeight: 400 }}>
                      {" "}
                      · {unread} unread
                    </span>
                  )}
                </Popover.Title>
                <button
                  type="button"
                  className="chip"
                  onClick={() => setRead(seed.map((n) => n.id))}
                  disabled={unread === 0}
                  style={{ opacity: unread === 0 ? 0.45 : 1 }}
                >
                  Mark all read
                </button>
              </div>

              <div className="notif-list">
                {seed.map((n) => {
                  const app = n.app ? connectedApps.find((a) => a.id === n.app) : null;
                  const isRead = read.includes(n.id);
                  return (
                    <button
                      key={n.id}
                      type="button"
                      className="notif-item"
                      onClick={() =>
                        setRead((r) => (r.includes(n.id) ? r : [...r, n.id]))
                      }
                    >
                      <span
                        className="notif-dot"
                        style={{ background: isRead ? "transparent" : dotFor[n.tone] }}
                        aria-hidden
                      />
                      {app ? (
                        <Mark app={app} size="sm" />
                      ) : (
                        <span style={{ flex: "none", width: 22 }} />
                      )}
                      <span style={{ minWidth: 0, flex: 1 }}>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            justifyContent: "space-between",
                            gap: 8,
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.78125rem",
                              fontWeight: isRead ? 500 : 600,
                              color: isRead ? "var(--sweet-text)" : "var(--sweet-ink)",
                            }}
                          >
                            {n.title}
                          </span>
                          <span
                            className="mono fade"
                            style={{ flex: "none", fontSize: "0.6875rem" }}
                          >
                            {n.at}
                          </span>
                        </span>
                        <span
                          className="fade"
                          style={{
                            display: "block",
                            marginTop: 2,
                            fontSize: "0.75rem",
                            lineHeight: 1.45,
                          }}
                        >
                          {n.detail}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="notif-foot">
                <span className="fade" style={{ fontSize: "0.6875rem" }}>
                  Health checks run every 60s
                </span>
                <button
                  type="button"
                  className="chip"
                  onClick={() =>
                    toast("Notification settings", {
                      description: "Where each alert lands is set per workspace.",
                    })
                  }
                >
                  Settings
                </button>
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </div>
      </Popover.Portal>
    </Popover.Root>
  );
}
