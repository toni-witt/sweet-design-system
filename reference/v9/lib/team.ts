export type Role = "Owner" | "Admin" | "Member" | "Viewer";

export type Member = {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** Avatar tint — initials stand in for photos, same as the app monograms. */
  tint: string;
  lastActive: string;
  /** Connections this person can reach. `null` means every one of them. */
  scope: string[] | null;
};

export type Invite = {
  id: string;
  email: string;
  role: Role;
  sentBy: string;
  sentAt: string;
  /** Invites lapse after a week; the row says so before it becomes a support ticket. */
  expiresIn: string;
};

export const roles: Role[] = ["Owner", "Admin", "Member", "Viewer"];

export const roleBlurb: Record<Role, string> = {
  Owner: "Billing, workspace deletion, and everything an admin can do.",
  Admin: "Connections, agent policy and people. Cannot delete the workspace.",
  Member: "Uses the endpoint and builds skills. Cannot change policy.",
  Viewer: "Reads dashboards and the audit log. No tool calls.",
};

export const members: Member[] = [
  {
    id: "m1",
    name: "Toni",
    email: "toni@northwind.co",
    role: "Owner",
    tint: "#1e376b",
    lastActive: "now",
    scope: null,
  },
  {
    id: "m2",
    name: "Priya Raman",
    email: "priya@northwind.co",
    role: "Admin",
    tint: "#7c3aed",
    lastActive: "12 min ago",
    scope: null,
  },
  {
    id: "m3",
    name: "Marcus Bell",
    email: "marcus@northwind.co",
    role: "Member",
    tint: "#0f766e",
    lastActive: "2 hours ago",
    scope: ["qbo", "xero", "stripe"],
  },
  {
    id: "m4",
    name: "Dana Whitfield",
    email: "dana@northwind.co",
    role: "Member",
    tint: "#b45309",
    lastActive: "yesterday",
    scope: ["shopify", "ebay", "amazon"],
  },
  {
    id: "m5",
    name: "Sofia Marek",
    email: "sofia@sweetbooks.com",
    role: "Member",
    tint: "#be185d",
    lastActive: "3 days ago",
    scope: ["qbo", "bill"],
  },
  {
    id: "m6",
    name: "Ray Okonkwo",
    email: "ray@northwind.co",
    role: "Viewer",
    tint: "#475569",
    lastActive: "last week",
    scope: null,
  },
];

export const invites: Invite[] = [
  {
    id: "i1",
    email: "jules@northwind.co",
    role: "Member",
    sentBy: "Priya Raman",
    sentAt: "2 days ago",
    expiresIn: "5 days",
  },
  {
    id: "i2",
    email: "audit@sweetbooks.com",
    role: "Viewer",
    sentBy: "Toni",
    sentAt: "6 days ago",
    expiresIn: "tomorrow",
  },
];

/**
 * The permission matrix. Written as capability-by-role rather than
 * role-by-capability, because the question people actually arrive with is
 * "who can do X", not "what can an Admin do".
 */
export const permissions: Array<{ capability: string; allowed: Role[] }> = [
  { capability: "Call tools through the endpoint", allowed: ["Owner", "Admin", "Member"] },
  { capability: "Connect and disconnect apps", allowed: ["Owner", "Admin"] },
  { capability: "Edit and publish shared skills", allowed: ["Owner", "Admin", "Member"] },
  { capability: "Approve proposals to the ledger", allowed: ["Owner", "Admin"] },
  { capability: "Change agent policy and rate limits", allowed: ["Owner", "Admin"] },
  { capability: "Invite and remove people", allowed: ["Owner", "Admin"] },
  { capability: "Read dashboards and the audit log", allowed: ["Owner", "Admin", "Member", "Viewer"] },
  { capability: "Billing and workspace deletion", allowed: ["Owner"] },
];
