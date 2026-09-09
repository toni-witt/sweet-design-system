"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

/**
 * A boolean in localStorage, read through useSyncExternalStore so SSR renders
 * the fallback and the client swaps in the stored value without an effect.
 */
export function useStoredFlag(key: string, fallback = false) {
  const subscribe = useCallback((cb: () => void) => {
    listeners.add(cb);
    window.addEventListener("storage", cb);
    return () => {
      listeners.delete(cb);
      window.removeEventListener("storage", cb);
    };
  }, []);

  const value = useSyncExternalStore(
    subscribe,
    () => {
      try {
        const raw = window.localStorage.getItem(key);
        return raw === null ? fallback : raw === "1";
      } catch {
        return fallback;
      }
    },
    () => fallback,
  );

  const set = useCallback(
    (next: boolean) => {
      try {
        window.localStorage.setItem(key, next ? "1" : "0");
      } catch {
        /* private mode — the flag just won't persist */
      }
      listeners.forEach((l) => l());
    },
    [key],
  );

  return [value, set] as const;
}
