export type Audience = "Internal" | "Client";
export type SiteStatus = "live" | "building" | "draft" | "paused";

export type Microsite = {
  id: string;
  name: string;
  blurb: string;
  audience: Audience;
  status: SiteStatus;
  /** ids from connectedApps — the MCP connections feeding this site. */
  sources: string[];
  slug: string;
  author: string;
  lastDeploy: string;
  views7d: number;
  refresh: string;
  /** Two-tone gradient used for the card's preview plate. */
  hue: [string, string];
};

export const microsites: Microsite[] = [
  {
    id: "runway",
    name: "Cash Runway",
    blurb: "Rolling 13-week cash view with scenario sliders, straight off the ledger.",
    audience: "Client",
    status: "live",
    sources: ["qbo", "stripe"],
    slug: "northwind.sites.conduit.dev",
    author: "Toni",
    lastDeploy: "2 hours ago",
    views7d: 1840,
    refresh: "every 15 min",
    hue: ["#6366f1", "#0ea5e9"],
  },
  {
    id: "ap-aging",
    name: "AP Aging Triage",
    blurb: "Bills past 30 days, grouped by vendor, with one-click approve back into Bill.com.",
    audience: "Internal",
    status: "live",
    sources: ["qbo"],
    slug: "ap-aging.sites.conduit.dev",
    author: "Priya",
    lastDeploy: "yesterday",
    views7d: 612,
    refresh: "every 5 min",
    hue: ["#f59e0b", "#ef4444"],
  },
  {
    id: "margin",
    name: "Marketplace Margin Monitor",
    blurb: "Per-SKU contribution margin across three storefronts after fees and returns.",
    audience: "Internal",
    status: "live",
    sources: ["ebay", "shopify", "amazon"],
    slug: "margins.sites.conduit.dev",
    author: "Toni",
    lastDeploy: "4 days ago",
    views7d: 993,
    refresh: "hourly",
    hue: ["#10b981", "#14b8a6"],
  },
  {
    id: "close",
    name: "Month-End Close Board",
    blurb: "Every close task, owner and blocker — reconciled against the trial balance nightly.",
    audience: "Internal",
    status: "building",
    sources: ["qbo", "notion"],
    slug: "close.sites.conduit.dev",
    author: "Marcus",
    lastDeploy: "deploying now",
    views7d: 208,
    refresh: "nightly",
    hue: ["#8b5cf6", "#d946ef"],
  },
  {
    id: "harbor",
    name: "Harbor Foods Portal",
    blurb: "White-labelled client portal — P&L, AR ageing, and a receipts drop box.",
    audience: "Client",
    status: "live",
    sources: ["qbo", "stripe", "drive"],
    slug: "harbor.sites.conduit.dev",
    author: "Priya",
    lastDeploy: "6 days ago",
    views7d: 447,
    refresh: "every 15 min",
    hue: ["#0ea5e9", "#22d3ee"],
  },
  {
    id: "reorder",
    name: "Inventory Reorder Signals",
    blurb: "Velocity vs. on-hand by location, flagging what to reorder before it stocks out.",
    audience: "Internal",
    status: "draft",
    sources: ["shopify", "square"],
    slug: "reorder.sites.conduit.dev",
    author: "Marcus",
    lastDeploy: "never",
    views7d: 0,
    refresh: "every 30 min",
    hue: ["#f43f5e", "#f97316"],
  },
];

export const siteStatusLabel: Record<SiteStatus, string> = {
  live: "Live",
  building: "Deploying",
  draft: "Draft",
  paused: "Paused",
};
