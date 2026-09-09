"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Command } from "cmdk";
import { toast } from "sonner";
import { Icon } from "@/components/icons";
import { Mark } from "@/components/v9/mark";
import { catalog, type CatalogApp } from "@/lib/apps";
import { useConnections } from "@/components/v9/store";

type Phase = "pick" | "connecting" | "done";
type Step = "queued" | "authorizing" | "connected";

const stepLabel: Record<Step, string> = {
  queued: "Queued",
  authorizing: "Authorizing…",
  connected: "Connected",
};

export function V9Palette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const connect = useConnections((s) => s.connect);
  const connected = useConnections((s) => s.apps);
  const [phase, setPhase] = useState<Phase>("pick");
  const [picked, setPicked] = useState<string[]>([]);
  const [steps, setSteps] = useState<Record<string, Step>>({});
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const selected = useMemo(
    () => picked.map((id) => catalog.find((a) => a.id === id)!).filter(Boolean),
    [picked],
  );
  const totalTools = selected.reduce((n, a) => n + a.tools, 0);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Nothing animates on close, so reset in the handler rather than in an
  // effect — and drop any in-flight handshake timers with it.
  function handleOpenChange(next: boolean) {
    if (!next) {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setPhase("pick");
      setPicked([]);
      setSteps({});
    }
    onOpenChange(next);
  }

  const grouped = useMemo(() => {
    const map = new Map<string, CatalogApp[]>();
    for (const app of catalog) {
      map.set(app.category, [...(map.get(app.category) ?? []), app]);
    }
    return [...map.entries()];
  }, []);

  function connectAll() {
    if (!picked.length) return;
    setPhase("connecting");
    setSteps(Object.fromEntries(picked.map((id) => [id, "queued" as Step])));

    picked.forEach((id, i) => {
      const startAt = 120 + i * 90;
      const finishAt = startAt + 700 + Math.random() * 900;
      timers.current.push(
        setTimeout(() => setSteps((s) => ({ ...s, [id]: "authorizing" })), startAt),
        setTimeout(() => setSteps((s) => ({ ...s, [id]: "connected" })), finishAt),
      );
    });

    timers.current.push(
      setTimeout(
        () => {
          setPhase("done");
          // The handshakes are theatre; this is the line that actually adds them.
          connect(picked);
          toast.success(`${picked.length} apps connected`, {
            description: `${totalTools} new tools are now available to your agents.`,
          });
        },
        120 + picked.length * 90 + 1700,
      ),
    );
  }

  const connectedCount = Object.values(steps).filter((s) => s === "connected").length;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        {/* No transition on either layer — see DESIGN.md on keyboard surfaces. */}
        <div className="s9-root-portal">
          <Dialog.Backdrop className="palette-backdrop" />
          <Dialog.Popup className="palette">
            <Dialog.Title style={{ position: "absolute", left: -9999 }}>
              Connect apps
            </Dialog.Title>
            <Dialog.Description style={{ position: "absolute", left: -9999 }}>
              Search the catalog and connect several apps at once.
            </Dialog.Description>

            {phase === "pick" ? (
              <Command
                loop
                filter={(value, search) =>
                  value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
                }
              >
                <div className="palette-search">
                  <Icon.search />
                  <Command.Input
                    autoFocus
                    placeholder="Search 18 apps — accounting, commerce, payments…"
                  />
                  <span className="kbd">esc</span>
                </div>

                <Command.List className="palette-list">
                  <Command.Empty
                    style={{
                      padding: "32px 12px",
                      textAlign: "center",
                      fontSize: "0.84375rem",
                      color: "var(--sweet-text-muted)",
                    }}
                  >
                    No app matches that. Request a connector →
                  </Command.Empty>

                  {grouped.map(([category, apps]) => (
                    <Command.Group
                      key={category}
                      heading={category}
                    >
                      {apps.map((app) => {
                        const on = picked.includes(app.id);
                        const already = connected.some((c) => c.id === app.id);
                        return (
                          <Command.Item
                            key={app.id}
                            className="palette-item"
                            value={`${app.name} ${app.category} ${app.note}`}
                            data-connected={already || undefined}
                            onSelect={() => {
                              // Connecting something twice isn't an action. The
                              // row says so rather than going quietly dead.
                              if (already) return;
                              setPicked((p) =>
                                p.includes(app.id)
                                  ? p.filter((x) => x !== app.id)
                                  : [...p, app.id],
                              );
                            }}
                          >
                            <Mark app={app} size="sm" />
                            <span style={{ minWidth: 0, flex: 1 }}>
                              <span
                                style={{
                                  display: "block",
                                  fontSize: "0.84375rem",
                                  fontWeight: 600,
                                  color: "var(--sweet-ink)",
                                }}
                              >
                                {app.name}
                              </span>
                              <span
                                style={{
                                  display: "block",
                                  fontSize: "0.75rem",
                                  color: "var(--sweet-text-muted)",
                                }}
                              >
                                {app.note}
                              </span>
                            </span>
                            <span
                              style={{
                                flex: "none",
                                fontSize: "0.75rem",
                                color: "var(--sweet-text-muted)",
                              }}
                            >
                              {already ? "Connected" : `${app.tools} tools`}
                            </span>
                            <span
                              className="check"
                              data-on={on || already || undefined}
                              data-locked={already || undefined}
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path
                                  d="m5 12.5 4.5 4.5L19 7"
                                  stroke="currentColor"
                                  strokeWidth="3.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          </Command.Item>
                        );
                      })}
                    </Command.Group>
                  ))}
                </Command.List>

                <div className="palette-foot">
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flex: 1,
                      minWidth: 0,
                      fontSize: "0.78125rem",
                      color: "var(--sweet-text-muted)",
                    }}
                  >
                    {selected.length === 0 ? (
                      <>
                        <span className="kbd">↵</span> to select — pick as many as you like
                      </>
                    ) : (
                      <>
                        <span style={{ display: "flex" }}>
                          {selected.slice(0, 7).map((a, i) => (
                            <span key={a.id} style={{ marginLeft: i ? -5 : 0 }}>
                              <Mark app={a} size="sm" ring />
                            </span>
                          ))}
                        </span>
                        {selected.length > 7 && <span>+{selected.length - 7}</span>}
                        <span>{totalTools} tools</span>
                      </>
                    )}
                  </span>
                  <button
                    type="button"
                    className="button button-primary button-small"
                    onClick={connectAll}
                    disabled={selected.length === 0}
                  >
                    {selected.length > 1
                      ? `Connect ${selected.length} apps`
                      : selected.length === 1
                        ? "Connect app"
                        : "Connect"}
                  </button>
                </div>
              </Command>
            ) : (
              <div style={{ padding: 18 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    padding: "0 2px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--sweet-ink)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {phase === "done" ? "All set" : "Connecting in parallel"}
                  </h3>
                  <span
                    className="mono"
                    style={{ fontSize: "0.78125rem", color: "var(--sweet-text-muted)" }}
                  >
                    {connectedCount} of {picked.length}
                  </span>
                </div>

                <ul style={{ listStyle: "none", margin: "14px 0 0", padding: 0 }}>
                  {selected.map((app) => {
                    const step = steps[app.id] ?? "queued";
                    return (
                      <li
                        key={app.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "9px 2px",
                        }}
                      >
                        <Mark app={app} size="sm" />
                        <span
                          style={{
                            flex: 1,
                            fontSize: "0.84375rem",
                            fontWeight: 600,
                            color: "var(--sweet-ink)",
                          }}
                        >
                          {app.name}
                        </span>
                        <span
                          style={{
                            fontSize: "0.78125rem",
                            color:
                              step === "connected"
                                ? "var(--sweet-primary)"
                                : "var(--sweet-text-muted)",
                          }}
                        >
                          {stepLabel[step]}
                        </span>
                        <span style={{ display: "grid", placeItems: "center", width: 16 }}>
                          {step === "authorizing" && (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              style={{ animation: "sweet-spin 900ms linear infinite", color: "var(--sweet-accent)" }}
                              aria-hidden
                            >
                              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                          )}
                          {step === "connected" && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: "var(--sweet-primary)" }} aria-hidden>
                              <path
                                d="m5 12.5 4.5 4.5L19 7"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                          {step === "queued" && (
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: 999,
                                background: "var(--sweet-border-strong)",
                              }}
                            />
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginTop: 14,
                    paddingTop: 14,
                    borderTop: "1px solid var(--sweet-hairline)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      flex: 1,
                      fontSize: "0.78125rem",
                      color: "var(--sweet-text-muted)",
                    }}
                  >
                    {phase === "done"
                      ? `${totalTools} tools added. Health checks run every 60s.`
                      : "Handshakes run concurrently — no need to wait on each one."}
                  </p>
                  <Dialog.Close
                    className={`button button-small ${
                      phase === "done" ? "button-primary" : "button-secondary"
                    }`}
                  >
                    {phase === "done" ? "Done" : "Run in background"}
                  </Dialog.Close>
                </div>
              </div>
            )}
          </Dialog.Popup>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
