export type AuditKind =
  | "tool_call"
  | "auth"
  | "connect"
  | "disconnect"
  | "policy"
  | "deploy";

export type AuditResult = "ok" | "denied" | "error";

export type AuditEntry = {
  id: string;
  /** Chain position — the log is append-only, so this only ever counts up. */
  seq: number;
  at: string;
  actor: string;
  actorKind: "agent" | "person" | "system";
  kind: AuditKind;
  app: string | null;
  summary: string;
  result: AuditResult;
  ms: number | null;
  hash: string;
};

export const auditKindLabel: Record<AuditKind, string> = {
  tool_call: "Tool call",
  auth: "Auth",
  connect: "Connect",
  disconnect: "Disconnect",
  policy: "Policy",
  deploy: "Deploy",
};

export const auditLog: AuditEntry[] = [
  { id: "a1", seq: 184_922, at: "14:38:02", actor: "Claude Code", actorKind: "agent", kind: "tool_call", app: "qbo", summary: "qbo.reports.profit_and_loss — Jan 1 → Sep 8", result: "ok", ms: 214, hash: "9f3c1a" },
  { id: "a2", seq: 184_921, at: "14:37:58", actor: "Claude Code", actorKind: "agent", kind: "tool_call", app: "qbo", summary: "qbo.accounts.list — 214 rows", result: "ok", ms: 168, hash: "1b77e0" },
  { id: "a3", seq: 184_920, at: "14:36:41", actor: "Toni", actorKind: "person", kind: "policy", app: "ebay", summary: "Rate limit raised to 240 req/min", result: "ok", ms: null, hash: "c40a92" },
  { id: "a4", seq: 184_919, at: "14:35:12", actor: "Close Bot", actorKind: "agent", kind: "tool_call", app: "notion", summary: "notion.pages.update — Close checklist wk 36", result: "ok", ms: 402, hash: "7de114" },
  { id: "a5", seq: 184_918, at: "14:31:07", actor: "Margin Monitor", actorKind: "agent", kind: "tool_call", app: "ebay", summary: "ebay.orders.search — timed out after 3 retries", result: "error", ms: 9_012, hash: "22be5f" },
  { id: "a6", seq: 184_917, at: "14:28:44", actor: "Conduit", actorKind: "system", kind: "auth", app: "slack", summary: "Refresh token rejected — invalid_grant", result: "error", ms: 311, hash: "e01c73" },
  { id: "a7", seq: 184_916, at: "14:22:19", actor: "Cursor", actorKind: "agent", kind: "tool_call", app: "stripe", summary: "stripe.payouts.list — scope check passed", result: "ok", ms: 121, hash: "8a5d20" },
  { id: "a8", seq: 184_915, at: "14:20:03", actor: "Cursor", actorKind: "agent", kind: "tool_call", app: "qbo", summary: "qbo.journal_entries.create — blocked by write policy", result: "denied", ms: 12, hash: "4fc8b1" },
  { id: "a9", seq: 184_914, at: "14:11:55", actor: "Conduit", actorKind: "system", kind: "auth", app: "xero", summary: "Access token refreshed — expires in 30 min", result: "ok", ms: 288, hash: "d6920a" },
  { id: "a10", seq: 184_913, at: "13:58:30", actor: "Priya", actorKind: "person", kind: "deploy", app: null, summary: "Microsite ap-aging deployed — build 41", result: "ok", ms: 21_400, hash: "05e7cc" },
  { id: "a11", seq: 184_912, at: "13:47:16", actor: "Claude Desktop", actorKind: "agent", kind: "tool_call", app: "shopify", summary: "shopify.products.search — 88 rows", result: "ok", ms: 197, hash: "b3311d" },
  { id: "a12", seq: 184_911, at: "13:40:09", actor: "Marcus", actorKind: "person", kind: "connect", app: "square", summary: "Square connected — 13 tools registered", result: "ok", ms: 1_840, hash: "6ac402" },
  { id: "a13", seq: 184_910, at: "13:22:48", actor: "Close Bot", actorKind: "agent", kind: "tool_call", app: "drive", summary: "drive.files.search — folder 'Close / Sep'", result: "ok", ms: 260, hash: "f18e35" },
  { id: "a14", seq: 184_909, at: "13:04:31", actor: "Conduit", actorKind: "system", kind: "policy", app: null, summary: "Health sweep — 12 connections, 4 flagged", result: "ok", ms: 2_190, hash: "aa7601" },
  { id: "a15", seq: 184_908, at: "12:51:02", actor: "Toni", actorKind: "person", kind: "disconnect", app: "hubspot", summary: "Sandbox workspace removed", result: "ok", ms: null, hash: "3c9f88" },
];
