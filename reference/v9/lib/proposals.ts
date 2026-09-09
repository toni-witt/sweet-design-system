export type ProposalStatus = "review" | "ready" | "posted" | "rejected";

export type ProposalSource = "inbox" | "bill";

export type ProposalLine = {
  account: string;
  /** Chart-of-accounts code, shown in mono next to the name. */
  code: string;
  className: string | null;
  amount: number;
};

export type Proposal = {
  id: string;
  vendor: string;
  /** Monogram tint for the vendor tile — no real brand marks in a mock. */
  tint: string;
  mark: string;
  invoiceNo: string;
  source: ProposalSource;
  /** Where the document actually came from, verbatim enough to be checkable. */
  sourceDetail: string;
  received: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  currency: "USD";
  status: ProposalStatus;
  /** 0–1 on the agent's own coding suggestion, not on the extraction. */
  confidence: number;
  lines: ProposalLine[];
  /** Why the agent coded it this way, in one sentence a reviewer can check. */
  rationale: string;
  /** Anything the agent could not confirm; empty means a clean extraction. */
  flags: string[];
  /** Set once posted. */
  ledgerRef: string | null;
  destination: "QuickBooks" | "Xero";
};

export const statusLabel: Record<ProposalStatus, string> = {
  review: "Needs review",
  ready: "Ready to post",
  posted: "Posted",
  rejected: "Rejected",
};

export const sourceLabel: Record<ProposalSource, string> = {
  inbox: "AP inbox",
  bill: "Bill.com",
};

const detailed: Proposal[] = [
  {
    id: "p1",
    vendor: "Cloudflare",
    tint: "#f38020",
    mark: "CF",
    invoiceNo: "INV-99214",
    source: "inbox",
    sourceDetail: "ap@northwind.co · “Your Cloudflare invoice”",
    received: "14:31",
    invoiceDate: "Sep 1",
    dueDate: "Sep 30",
    amount: 1_240.0,
    currency: "USD",
    status: "review",
    confidence: 0.96,
    lines: [
      { account: "Software subscriptions", code: "6120", className: "Engineering", amount: 1_240.0 },
    ],
    rationale:
      "Coded to 6120 — the last 11 Cloudflare bills went there, all to Engineering.",
    flags: [],
    ledgerRef: null,
    destination: "QuickBooks",
  },
  {
    id: "p2",
    vendor: "Ironwood Logistics",
    tint: "#0f766e",
    mark: "IL",
    invoiceNo: "8842",
    source: "bill",
    sourceDetail: "Bill.com · captured from vendor portal",
    received: "13:58",
    invoiceDate: "Aug 29",
    dueDate: "Sep 28",
    amount: 8_915.4,
    currency: "USD",
    status: "review",
    confidence: 0.72,
    lines: [
      { account: "Freight and delivery", code: "5210", className: "Commerce", amount: 7_400.0 },
      { account: "Fuel surcharge", code: "5215", className: "Commerce", amount: 1_515.4 },
    ],
    rationale:
      "Split across two accounts because the invoice itemises the surcharge; last quarter it was coded as one line.",
    flags: ["Surcharge split is new — previous bills were single-line", "No PO on the document"],
    ledgerRef: null,
    destination: "QuickBooks",
  },
  {
    id: "p3",
    vendor: "Meridian Legal",
    tint: "#1e376b",
    mark: "ML",
    invoiceNo: "2025-0914",
    source: "inbox",
    sourceDetail: "ap@northwind.co · “September retainer”",
    received: "11:04",
    invoiceDate: "Sep 1",
    dueDate: "Sep 15",
    amount: 6_000.0,
    currency: "USD",
    status: "ready",
    confidence: 0.91,
    lines: [{ account: "Legal and professional", code: "6310", className: null, amount: 6_000.0 }],
    rationale: "Monthly retainer, same amount and account as the previous five months.",
    flags: [],
    ledgerRef: null,
    destination: "QuickBooks",
  },
  {
    id: "p4",
    vendor: "Bright Harbour Print",
    tint: "#be185d",
    mark: "BH",
    invoiceNo: "BH-3391",
    source: "inbox",
    sourceDetail: "ap@northwind.co · “Packaging run — Sept”",
    received: "yesterday",
    invoiceDate: "Aug 30",
    dueDate: "Sep 29",
    amount: 2_780.15,
    currency: "USD",
    status: "ready",
    confidence: 0.88,
    lines: [{ account: "Packaging and supplies", code: "5130", className: "Commerce", amount: 2_780.15 }],
    rationale: "Matched to PO 4417 from the subject line; amounts agree to the cent.",
    flags: [],
    ledgerRef: null,
    destination: "QuickBooks",
  },
  {
    id: "p5",
    vendor: "Northwind Utilities",
    tint: "#475569",
    mark: "NU",
    invoiceNo: "A-77120",
    source: "bill",
    sourceDetail: "Bill.com · recurring vendor",
    received: "yesterday",
    invoiceDate: "Aug 28",
    dueDate: "Sep 20",
    amount: 412.88,
    currency: "USD",
    status: "review",
    confidence: 0.64,
    lines: [{ account: "Utilities", code: "6410", className: "Warehouse", amount: 412.88 }],
    rationale:
      "Coded to Warehouse by history, but the service address on this bill is the new office.",
    flags: ["Service address differs from the last 6 bills", "Class may be wrong"],
    ledgerRef: null,
    destination: "QuickBooks",
  },
  {
    id: "p6",
    vendor: "Ada Consulting",
    tint: "#7c3aed",
    mark: "AC",
    invoiceNo: "AC-0042",
    source: "inbox",
    sourceDetail: "ap@northwind.co · “Statement of work 3 — final”",
    received: "2 days ago",
    invoiceDate: "Aug 25",
    dueDate: "Sep 24",
    amount: 18_500.0,
    currency: "USD",
    status: "review",
    confidence: 0.55,
    lines: [
      { account: "Consulting", code: "6320", className: "Engineering", amount: 12_000.0 },
      { account: "Capitalised development", code: "1740", className: "Engineering", amount: 6_500.0 },
    ],
    rationale:
      "The SOW describes both advisory work and build work; the split follows the hours table on page 2.",
    flags: [
      "Capitalisation split is a judgement call — needs a human",
      "Above the $10,000 approval threshold",
    ],
    ledgerRef: null,
    destination: "QuickBooks",
  },
  {
    id: "p7",
    vendor: "Stripe",
    tint: "#635bff",
    mark: "ST",
    invoiceNo: "AUG-FEES",
    source: "bill",
    sourceDetail: "Bill.com · statement import",
    received: "3 days ago",
    invoiceDate: "Aug 31",
    dueDate: "Sep 1",
    amount: 3_204.77,
    currency: "USD",
    status: "posted",
    confidence: 0.98,
    lines: [{ account: "Merchant fees", code: "6510", className: null, amount: 3_204.77 }],
    rationale: "Monthly processing fees, matched to the Stripe payout statement.",
    flags: [],
    ledgerRef: "QBO · Bill 4471",
    destination: "QuickBooks",
  },
  {
    id: "p8",
    vendor: "Halcyon Media",
    tint: "#b45309",
    mark: "HM",
    invoiceNo: "HM-8817",
    source: "inbox",
    sourceDetail: "ap@northwind.co · “Q3 campaign — invoice 2 of 2”",
    received: "4 days ago",
    invoiceDate: "Aug 20",
    dueDate: "Sep 19",
    amount: 9_600.0,
    currency: "USD",
    status: "rejected",
    confidence: 0.83,
    lines: [{ account: "Advertising", code: "6210", className: "Marketing", amount: 9_600.0 }],
    rationale: "Coded to advertising by vendor history.",
    flags: ["Duplicate of HM-8814 — same campaign, same amount"],
    ledgerRef: null,
    destination: "QuickBooks",
  },
];

/**
 * The long tail.
 *
 * These are the rows a reviewer pages past rather than opens: one coding line,
 * one clause of reasoning, nothing to argue about. The eight above are written
 * out in full because they are the ones with a judgement in them — a split, a
 * changed address, a possible duplicate. Written as tuples so the shape of the
 * list stays readable at this length.
 */
type Tail = [
  vendor: string,
  mark: string,
  tint: string,
  invoiceNo: string,
  source: ProposalSource,
  amount: number,
  status: ProposalStatus,
  confidence: number,
  code: string,
  account: string,
  cls: string | null,
  received: string,
  due: string,
  why: string,
];

const tail: Tail[] = [
  ["Atlas Freight", "AF", "#0f766e", "AF-2291", "bill", 4_180.0, "ready", 0.93, "5210", "Freight and delivery", "Commerce", "5 days ago", "Sep 26", "Same lane and rate card as the last nine loads."],
  ["Verdant Office", "VO", "#15803d", "VO-1180", "inbox", 318.4, "ready", 0.95, "6130", "Office supplies", null, "5 days ago", "Sep 22", "Recurring monthly supply order, unchanged."],
  ["Kestrel Security", "KS", "#1e376b", "KS-7741", "bill", 1_950.0, "review", 0.81, "6140", "Security services", "Warehouse", "5 days ago", "Sep 25", "Quarterly monitoring fee; last one was coded here."],
  ["Pinewood Staffing", "PS", "#7c3aed", "PW-4402", "inbox", 12_400.0, "review", 0.68, "6330", "Contract labour", "Warehouse", "6 days ago", "Sep 18", "Timesheet total matches, but the rate is 8% above the agreement."],
  ["Lumen Cloud", "LC", "#2563eb", "LC-88213", "inbox", 2_740.55, "posted", 0.97, "6120", "Software subscriptions", "Engineering", "6 days ago", "Sep 12", "Monthly platform bill, same as the prior eleven."],
  ["Copperline Utilities", "CU", "#475569", "CU-3390", "bill", 688.22, "posted", 0.94, "6410", "Utilities", "Warehouse", "6 days ago", "Sep 10", "Metered usage in the normal band for the season."],
  ["Marlow Freight", "MF", "#0e7490", "MF-5512", "bill", 6_240.0, "review", 0.76, "5210", "Freight and delivery", "Commerce", "1 week ago", "Sep 24", "Two consignments on one invoice; totals agree."],
  ["Bright Path Media", "BP", "#be185d", "BPM-227", "inbox", 4_500.0, "ready", 0.86, "6210", "Advertising", "Marketing", "1 week ago", "Sep 21", "Campaign flight matches the signed insertion order."],
  ["Harbour Insurance", "HI", "#1e376b", "HI-90012", "bill", 3_120.0, "posted", 0.96, "6420", "Insurance", null, "1 week ago", "Sep 8", "Annual premium instalment, on schedule."],
  ["Ridgeway Legal", "RL", "#334155", "RW-0088", "inbox", 2_250.0, "review", 0.79, "6310", "Legal and professional", null, "1 week ago", "Sep 23", "New matter — no coding history for this vendor yet."],
  ["Nimbus Analytics", "NA", "#0891b2", "NB-4417", "inbox", 890.0, "ready", 0.92, "6120", "Software subscriptions", "Engineering", "1 week ago", "Sep 27", "Seat count went from 8 to 10; price change explained."],
  ["Fairfield Print", "FP", "#b45309", "FF-1902", "bill", 1_460.75, "posted", 0.9, "5130", "Packaging and supplies", "Commerce", "8 days ago", "Sep 9", "Reprint of the standard carton, matched to PO 4402."],
  ["Orchard Catering", "OC", "#65a30d", "OR-3311", "inbox", 742.0, "review", 0.71, "6520", "Meals and entertainment", "Marketing", "8 days ago", "Sep 20", "Client event — needs an attendee list before it posts."],
  ["Cobalt Hardware", "CH", "#3f3f46", "CB-7734", "bill", 5_310.4, "ready", 0.89, "1720", "Equipment", "Warehouse", "9 days ago", "Sep 19", "Above the capitalisation threshold; coded to fixed assets."],
  ["Tidewater Shipping", "TS", "#0369a1", "TW-6621", "bill", 9_880.0, "review", 0.74, "5210", "Freight and delivery", "Commerce", "9 days ago", "Sep 17", "Ocean freight with a fuel adjustment not seen before."],
  ["Sable Design", "SD", "#7c3aed", "SB-0140", "inbox", 6_800.0, "ready", 0.87, "6320", "Consulting", "Marketing", "10 days ago", "Sep 16", "Second of three milestones on the brand refresh."],
  ["Granite Facilities", "GF", "#475569", "GR-2288", "bill", 2_040.0, "posted", 0.93, "6430", "Repairs and maintenance", "Warehouse", "10 days ago", "Sep 6", "Quarterly HVAC service, same scope as last quarter."],
  ["Juniper Travel", "JT", "#059669", "JV-5590", "inbox", 3_415.6, "review", 0.66, "6540", "Travel", "Engineering", "11 days ago", "Sep 15", "Four trips on one statement; two lack a purpose code."],
  ["Northgate Telecom", "NT", "#1e376b", "NG-7781", "bill", 1_128.0, "posted", 0.95, "6440", "Telephone and internet", null, "11 days ago", "Sep 5", "Monthly circuit charge, unchanged for a year."],
  ["Ember Studios", "ES", "#dc2626", "EM-0912", "inbox", 7_250.0, "review", 0.63, "6210", "Advertising", "Marketing", "12 days ago", "Sep 14", "Production invoice references a SOW the agent could not find."],
  ["Larkspur Cleaning", "LK", "#16a34a", "LS-4410", "bill", 960.0, "ready", 0.94, "6430", "Repairs and maintenance", "Warehouse", "12 days ago", "Sep 13", "Weekly cleaning contract, invoiced monthly as usual."],
  ["Quill Software", "QS", "#4f46e5", "QL-3302", "inbox", 1_680.0, "posted", 0.96, "6120", "Software subscriptions", null, "13 days ago", "Sep 4", "Annual renewal at the rate on the order form."],
  ["Ashford Rentals", "AR", "#78716c", "AS-8820", "bill", 4_600.0, "ready", 0.91, "6450", "Equipment rental", "Warehouse", "13 days ago", "Sep 11", "Forklift rental for the peak-season overflow."],
  ["Wren Packaging", "WP", "#ea580c", "WR-1177", "inbox", 3_920.3, "review", 0.77, "5130", "Packaging and supplies", "Commerce", "2 weeks ago", "Sep 12", "New SKU dimensions; the unit price is 6% above the quote."],
  ["Beacon Recruiting", "BR", "#0f766e", "BC-2201", "inbox", 15_000.0, "rejected", 0.84, "6330", "Contract labour", null, "2 weeks ago", "Sep 2", "Placement fee for a role that was filled internally."],
  ["Sterling Audit", "SA", "#334155", "ST-0031", "bill", 11_500.0, "posted", 0.98, "6310", "Legal and professional", null, "2 weeks ago", "Sep 1", "Interim audit fee, per the engagement letter."],
];

export const proposals: Proposal[] = [
  ...detailed,
  ...tail.map(
    (
      [vendor, mark, tint, invoiceNo, source, amount, status, confidence, code, account, cls, received, due, why],
      i,
    ): Proposal => ({
      id: `t${i + 1}`,
      vendor,
      tint,
      mark,
      invoiceNo,
      source,
      sourceDetail:
        source === "inbox"
          ? `ap@northwind.co · invoice ${invoiceNo}`
          : "Bill.com · captured from vendor portal",
      received,
      invoiceDate: due,
      dueDate: due,
      amount,
      currency: "USD",
      status,
      confidence,
      lines: [{ account, code, className: cls, amount }],
      rationale: why,
      flags: [],
      ledgerRef: status === "posted" ? `QBO · Bill ${4400 + i}` : null,
      destination: "QuickBooks",
    }),
  ),
];
