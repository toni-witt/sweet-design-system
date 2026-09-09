import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Stands in for Uitimate's `#/helpers/utils.ts`, which re-exports all of
 * lodash-es and change-case. The component layer uses exactly two things from
 * it — `cn` and `casing.kebabCase` — so this is the whole surface, minus two
 * dependencies we would otherwise be carrying for one string transform.
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const casing = {
  kebabCase: (s: string) =>
    s
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase(),
};
