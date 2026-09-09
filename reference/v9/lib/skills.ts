export type SkillStatus = "published" | "draft" | "archived";

export type SkillRun = {
  id: string;
  at: string;
  agent: string;
  /** The person or schedule that set the run going. */
  trigger: string;
  ms: number;
  result: "ok" | "error" | "partial";
  note: string;
};

export type SkillVersion = {
  version: string;
  at: string;
  author: string;
  note: string;
};

export type SkillFile = {
  path: string;
  kind: "template" | "schema" | "reference";
  size: string;
  note: string;
};

export type Skill = {
  id: string;
  name: string;
  /** The MCP tool name agents call it by. */
  slug: string;
  status: SkillStatus;
  summary: string;
  owner: string;
  ownerTint: string;
  version: string;
  updated: string;
  runs7d: number;
  successRate: number;
  /** 0–100, from the last 30 runs: did the output need a human edit afterwards. */
  quality: number;
  /** Connection ids this skill calls, so the card can show what it touches. */
  uses: string[];
  tags: string[];
  files: SkillFile[];
  versions: SkillVersion[];
  recentRuns: SkillRun[];
  body: string;
};

export const skillStatusLabel: Record<SkillStatus, string> = {
  published: "Published",
  draft: "Draft",
  archived: "Archived",
};

export const skills: Skill[] = [
  {
    id: "month-end-close",
    name: "Month-end close",
    slug: "skills.month_end_close",
    status: "published",
    summary:
      "Walks the close checklist: reconcile bank feeds, chase unposted bills, flag variance over 8% and write the summary into Notion.",
    owner: "Priya Raman",
    ownerTint: "#7c3aed",
    version: "v4",
    updated: "2 hours ago",
    runs7d: 34,
    successRate: 97,
    quality: 92,
    uses: ["qbo", "notion", "slack"],
    tags: ["close", "reconciliation"],
    files: [
      { path: "templates/close-summary.md", kind: "template", size: "2.4 KB", note: "The Notion page it writes" },
      { path: "templates/variance-table.md", kind: "template", size: "0.9 KB", note: "Rendered per account over threshold" },
      { path: "schemas/checklist.json", kind: "schema", size: "1.1 KB", note: "Task shape the agent fills in" },
    ],
    versions: [
      { version: "v4", at: "2 hours ago", author: "Priya Raman", note: "Variance threshold 10% → 8%" },
      { version: "v3", at: "9 days ago", author: "Toni", note: "Write the summary to Notion instead of Slack" },
      { version: "v2", at: "3 weeks ago", author: "Priya Raman", note: "Added the unposted-bills sweep" },
      { version: "v1", at: "6 weeks ago", author: "Priya Raman", note: "First published" },
    ],
    recentRuns: [
      { id: "r1", at: "14:38", agent: "Close Bot", trigger: "Schedule · daily 14:30", ms: 41_200, result: "ok", note: "12 accounts reconciled, 2 flagged" },
      { id: "r2", at: "yesterday", agent: "Close Bot", trigger: "Schedule · daily 14:30", ms: 38_900, result: "ok", note: "12 accounts reconciled" },
      { id: "r3", at: "2 days ago", agent: "Claude Code", trigger: "Priya Raman", ms: 52_400, result: "partial", note: "Notion write failed, retried by hand" },
      { id: "r4", at: "3 days ago", agent: "Close Bot", trigger: "Schedule · daily 14:30", ms: 40_100, result: "ok", note: "12 accounts reconciled, 1 flagged" },
    ],
    body: `# Month-end close

Run this after the last bank feed of the period has landed.

## What it does

1. Pull the trial balance from QuickBooks for the period.
2. Reconcile every bank and card feed. Anything that will not tie goes on the
   exception list rather than blocking the run.
3. Sweep for bills received but not posted — check Bill.com and the AP inbox.
4. Compare each account against the prior three-month average. Flag anything
   over **8%** either way.
5. Render \`templates/close-summary.md\` and write it to the Notion close page.

## Rules

- Never post a journal entry. This skill reads and reports; a human posts.
- If a feed is more than 24 hours stale, stop and say so. A close on stale data
  is worse than a late close.
- Variance flags need a one-line reason, not just a number.

## Output

A summary page in Notion, a Slack message to #finance with the exception count,
and the checklist marked up in place.`,
  },
  {
    id: "ap-triage",
    name: "AP inbox triage",
    slug: "skills.ap_triage",
    status: "published",
    summary:
      "Reads the AP inbox, extracts vendor, amount and dates from attachments, matches to a PO where one exists, and drafts the coding for review.",
    owner: "Marcus Bell",
    ownerTint: "#0f766e",
    version: "v7",
    updated: "yesterday",
    runs7d: 218,
    successRate: 94,
    quality: 88,
    uses: ["gmail", "bill", "qbo"],
    tags: ["ap", "extraction"],
    files: [
      { path: "templates/proposal.md", kind: "template", size: "1.6 KB", note: "The reviewer-facing summary" },
      { path: "schemas/invoice.json", kind: "schema", size: "2.2 KB", note: "Extraction target" },
      { path: "reference/chart-of-accounts.md", kind: "reference", size: "8.4 KB", note: "Coding rules per vendor" },
    ],
    versions: [
      { version: "v7", at: "yesterday", author: "Marcus Bell", note: "Read the PO number out of the subject line too" },
      { version: "v6", at: "8 days ago", author: "Marcus Bell", note: "Confidence score on every extracted field" },
      { version: "v5", at: "2 weeks ago", author: "Sofia Marek", note: "Handle multi-invoice PDFs" },
    ],
    recentRuns: [
      { id: "r1", at: "14:31", agent: "AP Bot", trigger: "Inbox · new mail", ms: 6_400, result: "ok", note: "3 invoices extracted, 3 proposals raised" },
      { id: "r2", at: "13:58", agent: "AP Bot", trigger: "Inbox · new mail", ms: 4_100, result: "ok", note: "1 invoice extracted" },
      { id: "r3", at: "12:20", agent: "AP Bot", trigger: "Inbox · new mail", ms: 9_800, result: "error", note: "Scanned PDF unreadable — escalated" },
    ],
    body: `# AP inbox triage

Turns an invoice that arrived as email into a proposal a human can approve in
one glance.

## Sources

- \`ap@northwind.co\` — anything with an attachment.
- Bill.com inbox — documents already captured there.

## Extraction

Fill \`schemas/invoice.json\`. Every field carries a confidence between 0 and 1.
Fields under **0.8** are shown to the reviewer as unconfirmed rather than
guessed at silently.

## Coding

Look up the vendor in \`reference/chart-of-accounts.md\`. If the vendor has a
history of three or more posted bills, use the account they were coded to last
time and say so. Otherwise propose the closest match and mark it low
confidence.

## Never

- Never post to the ledger. Raise a proposal.
- Never pay anything.
- Never modify the source document.`,
  },
  {
    id: "margin-watch",
    name: "Marketplace margin watch",
    slug: "skills.margin_watch",
    status: "published",
    summary:
      "Per-SKU contribution margin across Shopify, eBay and Amazon after fees, returns and shipping. Alerts when a SKU goes underwater.",
    owner: "Dana Whitfield",
    ownerTint: "#b45309",
    version: "v2",
    updated: "4 days ago",
    runs7d: 61,
    successRate: 89,
    quality: 76,
    uses: ["shopify", "ebay", "amazon", "slack"],
    tags: ["commerce", "margin"],
    files: [
      { path: "templates/margin-alert.md", kind: "template", size: "0.7 KB", note: "Slack alert body" },
      { path: "reference/fee-tables.md", kind: "reference", size: "5.1 KB", note: "Per-marketplace fee maths" },
    ],
    versions: [
      { version: "v2", at: "4 days ago", author: "Dana Whitfield", note: "Include return shipping in the fee side" },
      { version: "v1", at: "5 weeks ago", author: "Dana Whitfield", note: "First published" },
    ],
    recentRuns: [
      { id: "r1", at: "09:00", agent: "Margin Monitor", trigger: "Schedule · hourly", ms: 12_300, result: "ok", note: "412 SKUs, 3 underwater" },
      { id: "r2", at: "08:00", agent: "Margin Monitor", trigger: "Schedule · hourly", ms: 11_900, result: "ok", note: "412 SKUs, 3 underwater" },
      { id: "r3", at: "07:00", agent: "Margin Monitor", trigger: "Schedule · hourly", ms: 30_100, result: "partial", note: "eBay timed out, ran on two of three" },
    ],
    body: `# Marketplace margin watch

## Definition

Contribution margin per SKU, per marketplace:

\`\`\`
revenue
  - cost of goods
  - marketplace fees        (see reference/fee-tables.md)
  - payment processing
  - outbound shipping
  - return shipping × return rate
= contribution
\`\`\`

## Alerting

A SKU is **underwater** when contribution is negative on any marketplace for
two consecutive runs. One bad hour is noise; two is a pricing problem.

Post to #commerce using \`templates/margin-alert.md\`. One message per SKU, not
a digest — a digest gets skimmed.`,
  },
  {
    id: "vendor-onboard",
    name: "Vendor onboarding",
    slug: "skills.vendor_onboard",
    status: "draft",
    summary:
      "Collects W-9, bank details and terms from a new vendor, checks the sanctions list, and opens the record in QuickBooks once complete.",
    owner: "Sofia Marek",
    ownerTint: "#be185d",
    version: "v1",
    updated: "3 days ago",
    runs7d: 0,
    successRate: 0,
    quality: 0,
    uses: ["gmail", "drive", "qbo"],
    tags: ["ap", "onboarding"],
    files: [
      { path: "templates/vendor-request.md", kind: "template", size: "1.2 KB", note: "The email sent to the vendor" },
      { path: "schemas/vendor.json", kind: "schema", size: "1.8 KB", note: "Record shape" },
    ],
    versions: [{ version: "v1", at: "3 days ago", author: "Sofia Marek", note: "Draft — not published" }],
    recentRuns: [],
    body: `# Vendor onboarding

> Draft. Not callable through the endpoint until published.

## Steps

1. Send \`templates/vendor-request.md\` to the vendor contact.
2. Watch for the reply. File the W-9 in Drive under \`Vendors/{name}/\`.
3. Check the name against the sanctions list. **Stop and escalate** on any hit —
   do not proceed on a partial match.
4. Once the W-9, bank details and terms are all present, open the vendor record
   in QuickBooks.

## Open questions

- Who approves terms longer than net 30?
- Should this raise a proposal instead of writing the record directly?`,
  },
  {
    id: "revenue-recognition",
    name: "Revenue recognition sweep",
    slug: "skills.rev_rec",
    status: "archived",
    summary:
      "Superseded by the close skill. Kept for the audit trail — it ran monthly through Q2 and its output is referenced in those working papers.",
    owner: "Toni",
    ownerTint: "#1e376b",
    version: "v3",
    updated: "2 months ago",
    runs7d: 0,
    successRate: 91,
    quality: 71,
    uses: ["qbo", "stripe"],
    tags: ["revenue"],
    files: [{ path: "templates/rev-rec.md", kind: "template", size: "1.4 KB", note: "Working paper section" }],
    versions: [
      { version: "v3", at: "2 months ago", author: "Toni", note: "Archived — folded into month-end close" },
      { version: "v2", at: "4 months ago", author: "Toni", note: "Stripe subscription proration" },
    ],
    recentRuns: [],
    body: `# Revenue recognition sweep

**Archived.** The month-end close skill does this now, at step 4.

Kept because the Q2 working papers cite its output by run id, and deleting it
would break that reference.`,
  },
];
