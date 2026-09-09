"use client";

/**
 * Icons — Lucide, with our defaults
 * =================================
 *
 * **Decided: Lucide.** Thousands of glyphs at a consistent stroke, so a feature
 * never waits on someone drawing one. The hand-drawn set in `icons.tsx` is
 * legacy — leave it where it is, and use this for anything new.
 *
 *   import { Icon } from "@/design-system/react/icon";
 *   import { Plug, FileText } from "lucide-react";
 *
 *   <Icon of={Plug} />
 *   <Icon of={FileText} size={14} />
 *
 * The defaults exist so nobody has to remember them: 16px at 1.75 stroke, round
 * caps and joins, `currentColor`. That is what the hand-drawn set was already
 * doing, which is why Lucide drops in beside it without a seam.
 */

import type { LucideIcon } from "lucide-react";

export function Icon({
  of: Glyph,
  size = 16,
  strokeWidth = 1.75,
  className,
}: {
  of: LucideIcon;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <Glyph
      size={size}
      strokeWidth={strokeWidth}
      absoluteStrokeWidth
      className={className}
      aria-hidden
    />
  );
}

/**
 * The nav set, named by role rather than by picture.
 *
 * Import the glyph here rather than at the call site, so changing what
 * "proposals" looks like is one edit in one file — and so nobody reaches for a
 * near-miss glyph because the right one wasn't obvious.
 */
export {
  Plug as ConnectionsIcon,
  SquareTerminal as McpIcon,
  FileText as SkillsIcon,
  ClipboardCheck as ProposalsIcon,
  LayoutPanelTop as MicrositesIcon,
  ScrollText as AuditIcon,
  Users as TeamIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Bell as BellIcon,
  LifeBuoy as SupportIcon,
  PanelLeft as PanelIcon,
  ChevronRight as ChevronIcon,
  Plus as PlusIcon,
  Copy as CopyIcon,
  ExternalLink as ExternalIcon,
  Lock as LockIcon,
  MoreHorizontal as MoreIcon,
  Check as CheckIcon,
  X as CloseIcon,
} from "lucide-react";

/**
 * Rules, so the set stays coherent:
 *
 * - 16px in rows, chrome and menus. 14px inside dense popovers. Never above 20
 *   in product — a big icon is a picture, and this system doesn't use pictures.
 * - `absoluteStrokeWidth` on, so the stroke stays 1.75 when the size changes.
 *   Without it Lucide scales the stroke and a 14px icon looks thinner than a
 *   16px one sitting next to it.
 * - Icons inherit `currentColor`. Never colour one directly; colour the thing
 *   it sits in.
 * - An icon never gets its own border or box — see PRINCIPLES.md § 6.
 * - Outline only. Lucide has no filled variants and we don't want any: filled
 *   glyphs read as a second weight the system has no use for.
 */
