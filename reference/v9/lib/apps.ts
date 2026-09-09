export type Health = "healthy" | "expiring" | "degraded" | "error" | "syncing";

export type Category =
  | "Accounting"
  | "Commerce"
  | "Payments"
  | "Communication"
  | "Documents"
  | "CRM";

export type ConnectedApp = {
  id: string;
  name: string;
  category: Category;
  /** Monogram tile colour. Stylised marks, not official brand logos. */
  tint: string;
  mark: string;
  health: Health;
  /** Short human explanation of the health state. */
  note: string;
  tools: number;
  callsToday: number;
  latencyMs: number;
  lastSync: string;
  account: string;
};

export type CatalogApp = {
  id: string;
  name: string;
  category: Category;
  tint: string;
  mark: string;
  tools: number;
  note: string;
};

export const connectedApps: ConnectedApp[] = [
  {
    id: "qbo",
    name: "QuickBooks Online",
    category: "Accounting",
    tint: "#2CA01C",
    mark: "qb",
    health: "healthy",
    note: "All 34 tools responding",
    tools: 34,
    callsToday: 1284,
    latencyMs: 210,
    lastSync: "2 min ago",
    account: "Sweet Books LLC",
  },
  {
    id: "xero",
    name: "Xero",
    category: "Accounting",
    tint: "#13B5EA",
    mark: "xo",
    health: "expiring",
    note: "OAuth token expires in 4 days",
    tools: 28,
    callsToday: 617,
    latencyMs: 340,
    lastSync: "6 min ago",
    account: "Northwind Trading",
  },
  {
    id: "ebay",
    name: "eBay",
    category: "Commerce",
    tint: "#E53238",
    mark: "eb",
    health: "degraded",
    note: "p95 latency 3.2s — upstream is slow",
    tools: 19,
    callsToday: 402,
    latencyMs: 3210,
    lastSync: "1 min ago",
    account: "northwind_store",
  },
  {
    id: "shopify",
    name: "Shopify",
    category: "Commerce",
    tint: "#95BF47",
    mark: "sh",
    health: "healthy",
    note: "All 22 tools responding",
    tools: 22,
    callsToday: 938,
    latencyMs: 180,
    lastSync: "just now",
    account: "northwind.myshopify.com",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments",
    tint: "#635BFF",
    mark: "st",
    health: "healthy",
    note: "All 16 tools responding",
    tools: 16,
    callsToday: 2140,
    latencyMs: 120,
    lastSync: "just now",
    account: "acct_1Nxq…7Yb",
  },
  {
    id: "gmail",
    name: "Gmail",
    category: "Communication",
    tint: "#EA4335",
    mark: "gm",
    health: "healthy",
    note: "All 12 tools responding",
    tools: 12,
    callsToday: 486,
    latencyMs: 240,
    lastSync: "4 min ago",
    account: "ops@northwind.co",
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    tint: "#4A154B",
    mark: "sl",
    health: "error",
    note: "Refresh token revoked upstream",
    tools: 14,
    callsToday: 0,
    latencyMs: 0,
    lastSync: "9 hours ago",
    account: "northwind.slack.com",
  },
  {
    id: "notion",
    name: "Notion",
    category: "Documents",
    tint: "#111111",
    mark: "nt",
    health: "syncing",
    note: "Indexing 1,204 pages — 68% complete",
    tools: 11,
    callsToday: 173,
    latencyMs: 410,
    lastSync: "syncing",
    account: "Northwind Workspace",
  },
  {
    id: "drive",
    name: "Google Drive",
    category: "Documents",
    tint: "#1A73E8",
    mark: "dr",
    health: "healthy",
    note: "All 9 tools responding",
    tools: 9,
    callsToday: 351,
    latencyMs: 260,
    lastSync: "11 min ago",
    account: "ops@northwind.co",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM",
    tint: "#FF7A59",
    mark: "hs",
    health: "healthy",
    note: "All 21 tools responding",
    tools: 21,
    callsToday: 724,
    latencyMs: 290,
    lastSync: "3 min ago",
    account: "Northwind — Prod",
  },
  {
    id: "square",
    name: "Square",
    category: "Payments",
    tint: "#3E4348",
    mark: "sq",
    health: "healthy",
    note: "All 13 tools responding",
    tools: 13,
    callsToday: 288,
    latencyMs: 200,
    lastSync: "7 min ago",
    account: "Northwind Retail",
  },
  {
    id: "amazon",
    name: "Amazon Seller",
    category: "Commerce",
    tint: "#FF9900",
    mark: "az",
    health: "expiring",
    note: "LWA refresh token expires in 9 days",
    tools: 17,
    callsToday: 512,
    latencyMs: 520,
    lastSync: "14 min ago",
    account: "A2K…8QF",
  },
];

export const catalog: CatalogApp[] = [
  { id: "bill", name: "Bill.com", category: "Accounting", tint: "#1C7EF2", mark: "bl", tools: 18, note: "AP & AR automation" },
  { id: "freshbooks", name: "FreshBooks", category: "Accounting", tint: "#0075DD", mark: "fb", tools: 15, note: "Invoicing and time tracking" },
  { id: "sage", name: "Sage Intacct", category: "Accounting", tint: "#00DC06", mark: "sg", tools: 26, note: "Mid-market general ledger" },
  { id: "netsuite", name: "NetSuite", category: "Accounting", tint: "#125A9C", mark: "ns", tools: 41, note: "ERP records and saved searches" },
  { id: "woo", name: "WooCommerce", category: "Commerce", tint: "#7F54B3", mark: "wc", tools: 20, note: "Orders, products, customers" },
  { id: "etsy", name: "Etsy", category: "Commerce", tint: "#F1641E", mark: "et", tools: 12, note: "Listings and shop orders" },
  { id: "bigcommerce", name: "BigCommerce", category: "Commerce", tint: "#121118", mark: "bc", tools: 16, note: "Storefront and catalog" },
  { id: "paypal", name: "PayPal", category: "Payments", tint: "#003087", mark: "pp", tools: 14, note: "Transactions and payouts" },
  { id: "brex", name: "Brex", category: "Payments", tint: "#F46A35", mark: "bx", tools: 11, note: "Cards, expenses, receipts" },
  { id: "outlook", name: "Outlook", category: "Communication", tint: "#0078D4", mark: "ol", tools: 13, note: "Mail, calendar, contacts" },
  { id: "teams", name: "Microsoft Teams", category: "Communication", tint: "#5059C9", mark: "tm", tools: 10, note: "Channels and chat" },
  { id: "intercom", name: "Intercom", category: "Communication", tint: "#1F8DED", mark: "ic", tools: 12, note: "Conversations and contacts" },
  { id: "dropbox", name: "Dropbox", category: "Documents", tint: "#0061FF", mark: "db", tools: 8, note: "Files and shared folders" },
  { id: "onedrive", name: "OneDrive", category: "Documents", tint: "#0364B8", mark: "od", tools: 9, note: "Files and sharing links" },
  { id: "box", name: "Box", category: "Documents", tint: "#0061D5", mark: "bo", tools: 10, note: "Enterprise file storage" },
  { id: "salesforce", name: "Salesforce", category: "CRM", tint: "#00A1E0", mark: "sf", tools: 38, note: "Objects, SOQL, reports" },
  { id: "pipedrive", name: "Pipedrive", category: "CRM", tint: "#017737", mark: "pd", tools: 17, note: "Deals and pipelines" },
  { id: "attio", name: "Attio", category: "CRM", tint: "#1A1A1A", mark: "at", tools: 14, note: "Records and lists" },
];

export const healthLabel: Record<Health, string> = {
  healthy: "Healthy",
  expiring: "Token expiring",
  degraded: "Degraded",
  error: "Reconnect",
  syncing: "Syncing",
};

/** 24h of MCP tool calls, one point per hour. */
export const throughput = [
  { t: "00", calls: 210, errors: 2 },
  { t: "01", calls: 168, errors: 1 },
  { t: "02", calls: 140, errors: 0 },
  { t: "03", calls: 122, errors: 0 },
  { t: "04", calls: 151, errors: 1 },
  { t: "05", calls: 205, errors: 3 },
  { t: "06", calls: 318, errors: 4 },
  { t: "07", calls: 452, errors: 3 },
  { t: "08", calls: 618, errors: 6 },
  { t: "09", calls: 742, errors: 5 },
  { t: "10", calls: 806, errors: 4 },
  { t: "11", calls: 771, errors: 9 },
  { t: "12", calls: 690, errors: 7 },
  { t: "13", calls: 728, errors: 5 },
  { t: "14", calls: 813, errors: 4 },
  { t: "15", calls: 869, errors: 11 },
  { t: "16", calls: 794, errors: 18 },
  { t: "17", calls: 655, errors: 12 },
  { t: "18", calls: 498, errors: 6 },
  { t: "19", calls: 392, errors: 3 },
  { t: "20", calls: 341, errors: 2 },
  { t: "21", calls: 305, errors: 2 },
  { t: "22", calls: 268, errors: 1 },
  { t: "23", calls: 232, errors: 1 },
];
