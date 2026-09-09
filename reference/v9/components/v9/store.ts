"use client";

import { create } from "zustand";
import { catalog, connectedApps, type ConnectedApp } from "@/lib/apps";

/**
 * The connection list, as state rather than a constant.
 *
 * The palette lives in the shell and the table lives in the page, so connecting
 * an app has to change something both of them read. Zustand rather than context
 * because the rail's badge subscribes to one derived number and shouldn't
 * re-render on every unrelated change.
 */
type ConnectionsState = {
  apps: ConnectedApp[];
  /** Ids connected in this session, so the table can mark them as new. */
  justAdded: string[];
  connect: (ids: string[]) => void;
  disconnect: (id: string) => void;
};

/** A catalog entry has no health or throughput yet — a fresh connection starts
 *  syncing, with nothing to report until the first handshake lands. */
function fromCatalog(id: string): ConnectedApp | null {
  const app = catalog.find((a) => a.id === id);
  if (!app) return null;
  return {
    id: app.id,
    name: app.name,
    category: app.category,
    tint: app.tint,
    mark: app.mark,
    health: "syncing",
    note: "First sync running — tools appear as they are discovered",
    tools: app.tools,
    callsToday: 0,
    latencyMs: 0,
    lastSync: "just now",
    account: "connected just now",
  };
}

export const useConnections = create<ConnectionsState>((set) => ({
  apps: connectedApps,
  justAdded: [],

  connect: (ids) =>
    set((s) => {
      const fresh = ids
        .filter((id) => !s.apps.some((a) => a.id === id))
        .map(fromCatalog)
        .filter((a): a is ConnectedApp => a !== null);
      if (!fresh.length) return s;
      return {
        apps: [...fresh, ...s.apps],
        justAdded: [...s.justAdded, ...fresh.map((a) => a.id)],
      };
    }),

  disconnect: (id) =>
    set((s) => ({
      apps: s.apps.filter((a) => a.id !== id),
      justAdded: s.justAdded.filter((x) => x !== id),
    })),
}));

/** How many connections need a person to do something. Drives the rail badge. */
export function attentionCount(apps: ConnectedApp[]) {
  return apps.filter((a) => a.health !== "healthy" && a.health !== "syncing").length;
}
