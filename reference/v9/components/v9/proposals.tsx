"use client";

import { useMemo, useState } from "react";
import { Checkbox } from "@base-ui/react/checkbox";
import { Dialog } from "@base-ui/react/dialog";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Icon } from "@/components/icons";
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/lab/uitimate/pagination";
import { RowMenu, Tip } from "@/components/v9/ui";
import {
  proposals as seed,
  sourceLabel,
  statusLabel,
  type Proposal,
  type ProposalStatus,
} from "@/lib/proposals";

const filters = ["All", "Needs review", "Ready to post", "Posted", "Rejected"] as const;
type Filter = (typeof filters)[number];

const COLS = "28px minmax(0, 1.15fr) minmax(0, 0.95fr) 76px 104px minmax(0, 1.1fr) 78px 108px 40px";

/** Eight rows is what fits above the fold next to the stat strip. */
const PAGE_SIZE = 8;
const ROW_H = 59;

/**
 * Page numbers with gaps: first, last, the current one and its neighbours.
 * A 34-row list is four pages, but the same list next month is twelve, and a
 * row of twelve numbers is not navigation.
 */
function pageItems(page: number, count: number): Array<number | "gap"> {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const near = [page - 1, page, page + 1].filter((n) => n > 1 && n < count);
  const out: Array<number | "gap"> = [1];
  if (near[0] > 2) out.push("gap");
  out.push(...near);
  if (near[near.length - 1] < count - 1) out.push("gap");
  out.push(count);
  return out;
}

const pillFor: Record<ProposalStatus, string> = {
  review: "pill pill-warning",
  ready: "pill pill-accent",
  posted: "pill pill-success",
  rejected: "pill pill-neutral",
};

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

/** Confidence is the agent's, on its own coding — not on the extraction. */
function Confidence({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <Tip label={`Agent confidence in this coding: ${pct}%`}>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* The length is the value. Colouring it as well would be the same
            number said twice, in a hue that means nothing on its own. */}
        <span className="rating-track" style={{ width: 34 }} aria-hidden>
          <span className="rating-fill" style={{ width: `${pct}%` }} />
        </span>
        <span className="mono" style={{ fontSize: "0.6875rem", color: "var(--sweet-text-muted)" }}>
          {pct}
        </span>
      </span>
    </Tip>
  );
}

function VendorMark({ p }: { p: Proposal }) {
  return (
    <span
      className="mark mark-md"
      style={{ background: `linear-gradient(160deg, ${p.tint} 0%, color-mix(in oklab, ${p.tint} 78%, #000) 100%)` }}
      aria-hidden
    >
      {p.mark}
    </span>
  );
}

/* --------------------------------------------------------------- detail */

function ProposalSheet({
  p,
  onClose,
  onApprove,
  onReject,
}: {
  p: Proposal;
  onClose: () => void;
  onApprove: (destination: Proposal["destination"]) => void;
  onReject: () => void;
}) {
  const [destination, setDestination] = useState<Proposal["destination"]>(p.destination);
  const settled = p.status === "posted" || p.status === "rejected";

  return (
    <Dialog.Root open onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <div className="s9-root-portal">
          <Dialog.Backdrop className="palette-backdrop" />
          <Dialog.Popup className="sheet">
            <div className="sheet-head">
              <span style={{ display: "flex", minWidth: 0, alignItems: "center", gap: 10 }}>
                <VendorMark p={p} />
                <span style={{ minWidth: 0 }}>
                  <Dialog.Title className="sheet-title">{p.vendor}</Dialog.Title>
                  <span className="mono fade" style={{ display: "block", fontSize: "0.6875rem" }}>
                    {p.invoiceNo} · {money(p.amount)}
                  </span>
                </span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className={pillFor[p.status]}>{statusLabel[p.status]}</span>
                <Dialog.Close className="button button-secondary button-icon" aria-label="Close">
                  ✕
                </Dialog.Close>
              </span>
            </div>

            <div className="sheet-body">
              {/* What arrived, before anything was inferred from it. */}
              <h3 className="sheet-section">Source document</h3>
              <div className="doc">
                <div className="doc-head">
                  <span className="tag">{sourceLabel[p.source]}</span>
                  <span className="mono fade" style={{ fontSize: "0.6875rem" }}>
                    received {p.received}
                  </span>
                </div>
                <p className="doc-line">{p.sourceDetail}</p>
                <div className="doc-attach">
                  <Icon.copy />
                  <span className="mono" style={{ fontSize: "0.6875rem" }}>
                    {p.vendor.toLowerCase().replace(/\s+/g, "-")}-{p.invoiceNo}.pdf
                  </span>
                  <button
                    type="button"
                    className="chip"
                    onClick={() => toast("Document viewer", { description: "Original PDF, unmodified." })}
                  >
                    Open original
                  </button>
                </div>
                <div className="doc-fields">
                  {[
                    ["Invoice no", p.invoiceNo],
                    ["Invoice date", p.invoiceDate],
                    ["Due", p.dueDate],
                    ["Total", money(p.amount)],
                  ].map(([k, v]) => (
                    <span key={k}>
                      <span className="fade" style={{ display: "block", fontSize: "0.625rem" }}>
                        {k}
                      </span>
                      <span className="strong mono" style={{ fontSize: "0.75rem" }}>
                        {v}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="sheet-section">Suggested coding</h3>
              <div className="tbl-head" style={{ gridTemplateColumns: "72px minmax(0,1fr) 120px 110px" }}>
                <span>Code</span>
                <span>Account</span>
                <span>Class</span>
                <span style={{ textAlign: "right" }}>Amount</span>
              </div>
              {p.lines.map((l) => (
                <div
                  key={l.code}
                  className="tbl-row"
                  style={{ gridTemplateColumns: "72px minmax(0,1fr) 120px 110px", minHeight: 44 }}
                >
                  <span className="mono" style={{ fontSize: "0.75rem" }}>
                    {l.code}
                  </span>
                  <span style={{ fontSize: "0.78125rem" }}>{l.account}</span>
                  <span className="fade" style={{ fontSize: "0.75rem" }}>
                    {l.className ?? "—"}
                  </span>
                  <span className="mono strong" style={{ textAlign: "right", fontSize: "0.78125rem" }}>
                    {money(l.amount)}
                  </span>
                </div>
              ))}

              <p className="rationale">
                <span className="strong">Why: </span>
                {p.rationale}
              </p>

              {p.flags.length > 0 && (
                <div className="flags">
                  {p.flags.map((f) => (
                    <span key={f} className="flag">
                      <span className="flag-dot" aria-hidden />
                      {f}
                    </span>
                  ))}
                </div>
              )}

              {p.ledgerRef && (
                <p className="fade" style={{ marginTop: 14, fontSize: "0.75rem" }}>
                  Posted as <span className="mono strong">{p.ledgerRef}</span>.
                </p>
              )}
            </div>

            <div className="sheet-foot">
              {settled ? (
                <span className="fade" style={{ fontSize: "0.6875rem" }}>
                  {p.status === "posted"
                    ? "Nothing further to do — the entry is on the ledger."
                    : "Rejected. The document stays in the inbox for reference."}
                </span>
              ) : (
                <>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="fade" style={{ fontSize: "0.6875rem" }}>
                      Post to
                    </span>
                    <select
                      className="select"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value as Proposal["destination"])}
                      style={{ minWidth: 140 }}
                    >
                      <option value="QuickBooks">QuickBooks</option>
                      <option value="Xero">Xero</option>
                    </select>
                  </label>
                  <span style={{ display: "flex", gap: 6 }}>
                    <button type="button" className="button button-danger button-small" onClick={onReject}>
                      Reject
                    </button>
                    <button
                      type="button"
                      className="button button-secondary button-small"
                      onClick={() => toast("Coding editor", { description: "Change the account, class or split." })}
                    >
                      Edit coding
                    </button>
                    <button
                      type="button"
                      className="button button-primary button-small"
                      onClick={() => onApprove(destination)}
                    >
                      Approve &amp; post
                    </button>
                  </span>
                </>
              )}
            </div>
          </Dialog.Popup>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* --------------------------------------------------------------- screen */

export function V9Proposals() {
  const [list, setList] = useState<Proposal[]>(seed);
  const [filter, setFilter] = useState<Filter>("All");
  const [picked, setPicked] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [destination, setDestination] = useState<Proposal["destination"]>("QuickBooks");

  const [wantedPage, setPage] = useState(1);

  const shown = useMemo(
    () => (filter === "All" ? list : list.filter((p) => statusLabel[p.status] === filter)),
    [list, filter],
  );

  const pageCount = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  // A filter that shrinks the list can strand you on a page that no longer
  // exists. Clamping while rendering — rather than correcting it in an effect —
  // means the empty page is never painted, and narrowing from page 3 leaves you
  // on the last page that has rows instead of back at the top.
  const page = Math.min(wantedPage, pageCount);
  const from = (page - 1) * PAGE_SIZE;
  const rows = shown.slice(from, from + PAGE_SIZE);

  /** Bulk selection is per page: the checkbox in the header means "these". */
  const selectable = rows.filter((p) => p.status === "review" || p.status === "ready");
  const allOnPage = selectable.length > 0 && selectable.every((p) => picked.includes(p.id));

  const open = list.find((p) => p.id === openId) ?? null;
  const pending = list.filter((p) => p.status === "review" || p.status === "ready");
  const pendingValue = pending.reduce((n, p) => n + p.amount, 0);
  const selected = list.filter((p) => picked.includes(p.id));
  const selectedValue = selected.reduce((n, p) => n + p.amount, 0);

  function post(ids: string[], to: Proposal["destination"]) {
    setList((all) =>
      all.map((p) =>
        ids.includes(p.id)
          ? {
              ...p,
              status: "posted" as const,
              destination: to,
              ledgerRef: `${to === "Xero" ? "XRO" : "QBO"} · Bill ${4472 + all.indexOf(p)}`,
            }
          : p,
      ),
    );
    setPicked((s) => s.filter((id) => !ids.includes(id)));
    toast.success(
      ids.length > 1 ? `${ids.length} bills posted to ${to}` : `Posted to ${to}`,
      { description: "The entries are on the ledger and in the audit log." },
    );
  }

  function reject(id: string) {
    setList((all) => all.map((p) => (p.id === id ? { ...p, status: "rejected" as const } : p)));
    setPicked((s) => s.filter((x) => x !== id));
    toast.error("Proposal rejected", { description: "Nothing was posted. The document is kept." });
  }

  return (
    <>
      <div
        className="enter"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <h1 className="page-title">Proposals</h1>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="pill pill-accent pill-pulse">AP inbox watching</span>
          <button
            type="button"
            className="button button-primary button-small"
            disabled={!list.some((p) => p.status === "ready")}
            onClick={() =>
              post(
                list.filter((p) => p.status === "ready").map((p) => p.id),
                destination,
              )
            }
          >
            Post all ready
          </button>
        </span>
      </div>

      <div className="stat-row enter" style={{ marginTop: 24, animationDelay: "40ms" }}>
        <div className="stat-cell">
          <span className="stat-label">Awaiting a human</span>
          <span className="stat-value" style={{ color: "var(--sweet-warning)" }}>
            {pending.length}
          </span>
          <span className="stat-caption">
            {list.filter((p) => p.status === "ready").length} ready to post
          </span>
        </div>
        <div className="stat-cell">
          <span className="stat-label">Value pending</span>
          <span className="stat-value">{money(pendingValue)}</span>
          <span className="stat-caption">across {pending.length} bills</span>
        </div>
        <div className="stat-cell">
          <span className="stat-label">Auto-coded</span>
          <span className="stat-value">86%</span>
          <span className="stat-caption">no reviewer edit in the last 30 days</span>
        </div>
        <div className="stat-cell">
          <span className="stat-label">Posted this month</span>
          <span className="stat-value">147</span>
          <span className="stat-caption">to QuickBooks</span>
        </div>
      </div>

      <div
        className="enter"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginTop: 36,
          animationDelay: "80ms",
        }}
      >
        <h2 className="section-title">Pending approval</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className="chip"
              aria-pressed={f === filter}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="enter" style={{ marginTop: 10, animationDelay: "100ms" }}>
        <div className="tbl-head" style={{ gridTemplateColumns: COLS }}>
          <span>
            <Checkbox.Root
              className="check"
              checked={allOnPage}
              disabled={selectable.length === 0}
              onCheckedChange={(on) =>
                setPicked((s2) =>
                  on
                    ? [...new Set([...s2, ...selectable.map((p) => p.id)])]
                    : s2.filter((id) => !selectable.some((p) => p.id === id)),
                )
              }
              aria-label="Select every reviewable row on this page"
            >
              <Checkbox.Indicator>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="m5 12.5 4.5 4.5L19 7"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Checkbox.Indicator>
            </Checkbox.Root>
          </span>
          <span>Vendor</span>
          <span>Source</span>
          <span>Due</span>
          <span style={{ textAlign: "right" }}>Amount</span>
          <span>Suggested coding</span>
          <span>Conf.</span>
          <span>Status</span>
          <span />
        </div>

        {/* The page holds its height whether it has eight rows or three, so
            paging never moves the pager out from under the pointer. */}
        <div style={{ minHeight: PAGE_SIZE * ROW_H }}>
          {rows.map((p) => {
            const settled = p.status === "posted" || p.status === "rejected";
            return (
              <div key={p.id} className="tbl-row" style={{ gridTemplateColumns: COLS }}>
                <span>
                  {!settled && (
                    <Checkbox.Root
                      className="check"
                      checked={picked.includes(p.id)}
                      onCheckedChange={(on) =>
                        setPicked((s) => (on ? [...s, p.id] : s.filter((x) => x !== p.id)))
                      }
                      aria-label={`Select ${p.vendor}`}
                    >
                      <Checkbox.Indicator>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path
                            d="m5 12.5 4.5 4.5L19 7"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                  )}
                </span>

                <button type="button" className="link-cell" onClick={() => setOpenId(p.id)}>
                  <span style={{ display: "flex", minWidth: 0, alignItems: "center", gap: 9 }}>
                    <VendorMark p={p} />
                    <span style={{ minWidth: 0 }}>
                      <span className="strong" style={{ display: "block", fontSize: "0.84375rem" }}>
                        {p.vendor}
                      </span>
                      <span className="mono fade" style={{ display: "block", fontSize: "0.6875rem" }}>
                        {p.invoiceNo}
                      </span>
                    </span>
                  </span>
                </button>

                <span style={{ minWidth: 0 }}>
                  <span className="tag">{sourceLabel[p.source]}</span>
                  <span
                    className="fade"
                    style={{
                      display: "block",
                      marginTop: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: "0.6875rem",
                    }}
                  >
                    {p.sourceDetail}
                  </span>
                </span>

                <span className="fade" style={{ fontSize: "0.75rem" }}>
                  {p.dueDate}
                </span>

                <span className="mono strong" style={{ textAlign: "right", fontSize: "0.78125rem" }}>
                  {money(p.amount)}
                </span>

                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span className="mono fade" style={{ fontSize: "0.6875rem" }}>
                      {p.lines[0].code}
                    </span>
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "0.78125rem",
                      }}
                    >
                      {p.lines[0].account}
                    </span>
                  </span>
                  <span className="fade" style={{ display: "block", fontSize: "0.6875rem" }}>
                    {p.lines.length > 1
                      ? `+${p.lines.length - 1} more line${p.lines.length > 2 ? "s" : ""}`
                      : (p.lines[0].className ?? "no class")}
                    {p.flags.length > 0 && (
                      <span style={{ color: "var(--sweet-warning)" }}> · {p.flags.length} flag</span>
                    )}
                  </span>
                </span>

                <span>
                  <Confidence value={p.confidence} />
                </span>

                <span>
                  <span className={pillFor[p.status]}>{statusLabel[p.status]}</span>
                </span>

                <span style={{ display: "flex", justifyContent: "flex-end" }}>
                  <RowMenu
                    label={`Actions for ${p.vendor}`}
                    actions={[
                      { label: "Open proposal", onSelect: () => setOpenId(p.id) },
                      ...(settled
                        ? []
                        : [
                            {
                              label: "Approve & post",
                              onSelect: () => post([p.id], p.destination),
                            },
                            { label: "Edit coding", onSelect: () => setOpenId(p.id) },
                          ]),
                      { label: "Open source document", onSelect: () => toast("Document viewer") },
                      ...(settled
                        ? []
                        : [
                            {
                              label: "Reject",
                              danger: true,
                              separatorBefore: true,
                              onSelect: () => reject(p.id),
                            },
                          ]),
                    ]}
                  />
                </span>
              </div>
            );
          })}
        </div>
        <div className="pager-row">
          <span className="fade" style={{ fontSize: "0.6875rem" }}>
            {shown.length === 0
              ? "Nothing matches that filter"
              : `${from + 1}–${Math.min(from + PAGE_SIZE, shown.length)} of ${shown.length}`}
          </span>

          <Pagination className="pager">
            <PaginationItem>
              <PaginationLink
                className="pager-link"
                aria-label="Previous page"
                aria-disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </PaginationLink>
            </PaginationItem>

            {pageItems(page, pageCount).map((item, i) =>
              item === "gap" ? (
                <PaginationItem key={`gap-${i}`}>
                  <PaginationEllipsis className="pager-gap" />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    className="pager-link"
                    isActive={item === page}
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationLink
                className="pager-link"
                aria-label="Next page"
                aria-disabled={page === pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              >
                ›
              </PaginationLink>
            </PaginationItem>
          </Pagination>
        </div>
      </div>

      {/* The bulk bar only exists while a selection does — it is the answer to
          "I have read these four and they are all fine". */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            className="bulk-bar"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="strong" style={{ fontSize: "0.78125rem" }}>
              {selected.length} selected
            </span>
            <span className="mono fade" style={{ fontSize: "0.75rem" }}>
              {money(selectedValue)}
            </span>
            <span style={{ flex: 1 }} />
            <select
              className="select"
              value={destination}
              onChange={(e) => setDestination(e.target.value as Proposal["destination"])}
              style={{ minWidth: 132, minHeight: 28 }}
            >
              <option value="QuickBooks">QuickBooks</option>
              <option value="Xero">Xero</option>
            </select>
            <button type="button" className="button button-secondary button-small" onClick={() => setPicked([])}>
              Clear
            </button>
            <button
              type="button"
              className="button button-primary button-small"
              onClick={() => post(picked, destination)}
            >
              Approve &amp; post {selected.length}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {open && (
        <ProposalSheet
          key={open.id}
          p={open}
          onClose={() => setOpenId(null)}
          onApprove={(to) => {
            post([open.id], to);
            setOpenId(null);
          }}
          onReject={() => {
            reject(open.id);
            setOpenId(null);
          }}
        />
      )}
    </>
  );
}
