"use client";

import { useMemo, useState } from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Dialog } from "@base-ui/react/dialog";
import { Tabs } from "@base-ui/react/tabs";
import { toast } from "sonner";
import { Icon } from "@/components/icons";
import { Mark } from "@/components/v9/mark";
import { RowMenu, Segmented, Tip, useHeightFloor } from "@/components/v9/ui";
import { connectedApps } from "@/lib/apps";
import { skillStatusLabel, skills as seed, type Skill, type SkillStatus } from "@/lib/skills";

const filters = ["All", "Published", "Draft", "Archived"] as const;
type Filter = (typeof filters)[number];

const views = ["Panel", "Rows"] as const;
type View = (typeof views)[number];

const ROW_COLS = "minmax(0, 1.5fr) 108px 132px 64px 72px 118px 92px 40px";

const pillFor: Record<SkillStatus, string> = {
  published: "pill pill-success",
  draft: "pill pill-warning",
  archived: "pill pill-neutral",
};

/* -------------------------------------------------------------- markdown */

/**
 * A deliberately small renderer: headings, lists, quotes, fenced code, inline
 * code and bold. A skill file is prose plus rules plus the odd snippet — a full
 * markdown pipeline would be more dependency than the format earns here.
 */
function Markdown({ source }: { source: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = source.split("\n");
  let list: string[] = [];
  /** Numbered steps stay numbered — in a skill file the order is the content. */
  let ordered = false;
  let code: string[] | null = null;

  function flushList(key: number) {
    if (!list.length) return;
    const items = list.map((li, i) => <li key={i}>{inline(li)}</li>);
    blocks.push(
      ordered ? (
        <ol key={`ol-${key}`} className="md-list" data-ordered>
          {items}
        </ol>
      ) : (
        <ul key={`ul-${key}`} className="md-list">
          {items}
        </ul>
      ),
    );
    list = [];
  }

  function inline(text: string): React.ReactNode[] {
    // Bold and inline code, one pass, no nesting — that is all the files use.
    return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
      if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (part.startsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
      return <span key={i}>{part}</span>;
    });
  }

  lines.forEach((line, i) => {
    if (line.startsWith("```")) {
      if (code === null) {
        flushList(i);
        code = [];
      } else {
        blocks.push(
          <pre key={`code-${i}`} className="md-code">
            {code.join("\n")}
          </pre>,
        );
        code = null;
      }
      return;
    }
    if (code !== null) {
      code.push(line);
      return;
    }
    if (/^[-*] /.test(line)) {
      if (ordered) flushList(i);
      ordered = false;
      list.push(line.slice(2));
      return;
    }
    if (/^\d+\. /.test(line)) {
      if (!ordered) flushList(i);
      ordered = true;
      list.push(line.replace(/^\d+\. /, ""));
      return;
    }
    flushList(i);
    if (line.startsWith("### ")) blocks.push(<h4 key={i} className="md-h3">{inline(line.slice(4))}</h4>);
    else if (line.startsWith("## ")) blocks.push(<h3 key={i} className="md-h2">{inline(line.slice(3))}</h3>);
    else if (line.startsWith("# ")) blocks.push(<h2 key={i} className="md-h1">{inline(line.slice(2))}</h2>);
    else if (line.startsWith("> ")) blocks.push(<p key={i} className="md-quote">{inline(line.slice(2))}</p>);
    else if (line.trim()) blocks.push(<p key={i} className="md-p">{inline(line)}</p>);
  });
  flushList(lines.length);

  return <div className="md">{blocks}</div>;
}

/* ------------------------------------------------------------- fragments */

function Quality({ value, compact }: { value: number; compact?: boolean }) {
  if (!value) return <span className="fade">—</span>;
  return (
    <Tip label="Share of the last 30 runs whose output needed no human edit">
      <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span className="rating-track" aria-hidden>
          <span className="rating-fill" style={{ width: `${value}%` }} />
        </span>
        {!compact && (
          <span className="mono" style={{ fontSize: "0.6875rem", color: "var(--sweet-text-muted)" }}>
            {value}
          </span>
        )}
      </span>
    </Tip>
  );
}

function Uses({ ids }: { ids: string[] }) {
  return (
    <span style={{ display: "flex" }}>
      {ids.map((id, i) => {
        const app = connectedApps.find((a) => a.id === id);
        return app ? (
          <span key={id} style={{ marginLeft: i ? -4 : 0 }}>
            <Mark app={app} size="sm" ring />
          </span>
        ) : null;
      })}
    </span>
  );
}

/* ------------------------------------------------------------ the detail */

function SkillDetail({
  skill,
  onClose,
  onSave,
  onDelete,
}: {
  skill: Skill;
  onClose: () => void;
  onSave: (body: string) => void;
  onDelete: () => void;
}) {
  const [body, setBody] = useState(skill.body);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dirty = body !== skill.body;

  return (
    <Dialog.Root open onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <div className="s9-root-portal">
          <Dialog.Backdrop className="palette-backdrop" />
          <Dialog.Popup className="sheet">
            <div className="sheet-head">
              <div style={{ minWidth: 0 }}>
                <Dialog.Title className="sheet-title">{skill.name}</Dialog.Title>
                <span
                  className="mono fade"
                  style={{ display: "block", marginTop: 2, fontSize: "0.6875rem" }}
                >
                  {skill.slug} · {skill.version}
                </span>
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className={pillFor[skill.status]}>{skillStatusLabel[skill.status]}</span>
                <Dialog.Close className="button button-secondary button-icon" aria-label="Close">
                  ✕
                </Dialog.Close>
              </span>
            </div>

            <Tabs.Root defaultValue="skill" className="sheet-tabs">
              <Tabs.List className="tabs">
                <Tabs.Tab className="tab" value="skill">
                  Skill
                </Tabs.Tab>
                <Tabs.Tab className="tab" value="files">
                  Files · {skill.files.length}
                </Tabs.Tab>
                <Tabs.Tab className="tab" value="versions">
                  Versions · {skill.versions.length}
                </Tabs.Tab>
                <Tabs.Tab className="tab" value="runs">
                  Runs · {skill.recentRuns.length}
                </Tabs.Tab>
                <Tabs.Indicator className="tab-underline" />
              </Tabs.List>

              <Tabs.Panel className="sheet-body" value="skill">
                <div className="sheet-toolbar">
                  <Segmented
                    name="skill-mode"
                    value={editing ? "Edit" : "Read"}
                    onChange={(v) => setEditing(v === "Edit")}
                    options={["Read", "Edit"] as const}
                  />
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {dirty && (
                      <span className="fade" style={{ fontSize: "0.6875rem" }}>
                        Unsaved changes
                      </span>
                    )}
                    <button
                      type="button"
                      className="button button-primary button-small"
                      disabled={!dirty}
                      onClick={() => {
                        onSave(body);
                        toast.success(`${skill.name} saved`, {
                          description: "Published as a draft revision — publish to make it callable.",
                        });
                      }}
                    >
                      Save
                    </button>
                  </span>
                </div>

                {editing ? (
                  <textarea
                    className="editor"
                    value={body}
                    spellCheck={false}
                    onChange={(e) => setBody(e.target.value)}
                  />
                ) : (
                  <Markdown source={body} />
                )}
              </Tabs.Panel>

              <Tabs.Panel className="sheet-body" value="files">
                <p className="fade" style={{ margin: "0 0 10px", fontSize: "0.75rem" }}>
                  Files this skill reads or renders when it runs.
                </p>
                {skill.files.map((f) => (
                  <div key={f.path} className="file-row">
                    <span className="mono strong" style={{ fontSize: "0.75rem" }}>
                      {f.path}
                    </span>
                    <span className="tag">{f.kind}</span>
                    <span className="fade" style={{ flex: 1, fontSize: "0.6875rem" }}>
                      {f.note}
                    </span>
                    <span className="mono fade" style={{ fontSize: "0.6875rem" }}>
                      {f.size}
                    </span>
                  </div>
                ))}
              </Tabs.Panel>

              <Tabs.Panel className="sheet-body" value="versions">
                {skill.versions.map((v, i) => (
                  <div key={v.version} className="ver-row">
                    <span className="ver-rail" aria-hidden>
                      <span className="ver-dot" data-current={i === 0 || undefined} />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span className="strong mono" style={{ fontSize: "0.75rem" }}>
                          {v.version}
                        </span>
                        {i === 0 && <span className="tag">current</span>}
                        <span className="fade" style={{ marginLeft: "auto", fontSize: "0.6875rem" }}>
                          {v.at}
                        </span>
                      </span>
                      <span
                        className="fade"
                        style={{ display: "block", marginTop: 2, fontSize: "0.75rem" }}
                      >
                        {v.note} · {v.author}
                      </span>
                    </span>
                    {i > 0 && (
                      <button
                        type="button"
                        className="button button-secondary button-small"
                        onClick={() =>
                          toast(`Restore ${v.version}?`, {
                            description: "Restoring opens a new version on top; nothing is lost.",
                          })
                        }
                      >
                        Restore
                      </button>
                    )}
                  </div>
                ))}
              </Tabs.Panel>

              <Tabs.Panel className="sheet-body" value="runs">
                {skill.recentRuns.length === 0 ? (
                  <p className="fade" style={{ fontSize: "0.78125rem" }}>
                    No runs yet — a draft is not callable through the endpoint.
                  </p>
                ) : (
                  skill.recentRuns.map((r) => (
                    <div key={r.id} className="run-row">
                      <span className="mono fade" style={{ width: 74, flex: "none", fontSize: "0.6875rem" }}>
                        {r.at}
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "block", fontSize: "0.75rem" }}>{r.note}</span>
                        <span className="fade" style={{ display: "block", fontSize: "0.6875rem" }}>
                          {r.agent} · {r.trigger}
                        </span>
                      </span>
                      <span className="mono fade" style={{ fontSize: "0.6875rem" }}>
                        {(r.ms / 1000).toFixed(1)}s
                      </span>
                      <span
                        className={
                          r.result === "ok"
                            ? "pill pill-success"
                            : r.result === "partial"
                              ? "pill pill-warning"
                              : "pill pill-danger"
                        }
                      >
                        {r.result}
                      </span>
                    </div>
                  ))
                )}
              </Tabs.Panel>
            </Tabs.Root>

            <div className="sheet-foot">
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="fade" style={{ fontSize: "0.6875rem" }}>
                  Quality
                </span>
                <Quality value={skill.quality} />
                <span className="fade" style={{ fontSize: "0.6875rem" }}>
                  · {skill.successRate}% clean runs · {skill.runs7d} in 7 days
                </span>
              </span>
              <span style={{ display: "flex", gap: 6 }}>
                <button
                  type="button"
                  className="button button-danger button-small"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="button button-secondary button-small"
                  onClick={() =>
                    toast.success(`${skill.name} published`, {
                      description: "Agents pick up the new version on their next handshake.",
                    })
                  }
                >
                  Publish version
                </button>
              </span>
            </div>
          </Dialog.Popup>

          <AlertDialog.Root open={confirmDelete} onOpenChange={setConfirmDelete}>
            <AlertDialog.Portal>
              <div className="s9-root-portal">
                <AlertDialog.Backdrop className="palette-backdrop" />
                <AlertDialog.Popup className="confirm">
                  <AlertDialog.Title className="confirm-title">
                    Delete {skill.name}?
                  </AlertDialog.Title>
                  <AlertDialog.Description className="confirm-body">
                    {skill.versions.length} versions and {skill.files.length} files go with it.
                    Any agent calling {skill.slug} starts failing on its next run.
                  </AlertDialog.Description>
                  <div className="confirm-actions">
                    <AlertDialog.Close className="button button-secondary button-small">
                      Keep it
                    </AlertDialog.Close>
                    <button
                      type="button"
                      className="button button-danger button-small"
                      onClick={() => {
                        setConfirmDelete(false);
                        onDelete();
                      }}
                    >
                      Delete skill
                    </button>
                  </div>
                </AlertDialog.Popup>
              </div>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ------------------------------------------------------------- the screen */

export function V9Skills() {
  const [list, setList] = useState<Skill[]>(seed);
  const [filter, setFilter] = useState<Filter>("All");
  const [view, setView] = useState<View>("Panel");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const [floorRef, floorStyle] = useHeightFloor(filter === "All" && q === "");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return list.filter((s) => {
      if (filter !== "All" && skillStatusLabel[s.status] !== filter) return false;
      if (!needle) return true;
      return `${s.name} ${s.slug} ${s.summary} ${s.tags.join(" ")} ${s.owner}`
        .toLowerCase()
        .includes(needle);
    });
  }, [list, filter, q]);

  const open = list.find((s) => s.id === openId) ?? null;
  const published = list.filter((s) => s.status === "published");
  const runs7d = list.reduce((n, s) => n + s.runs7d, 0);

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
        <h1 className="page-title">Skills</h1>
        <button
          type="button"
          className="button button-primary button-small"
          onClick={() =>
            toast("New skill", { description: "Starts as a draft with an empty SKILL.md." })
          }
        >
          <Icon.plus />
          New skill
        </button>
      </div>

      <div className="stat-row enter" style={{ marginTop: 24, animationDelay: "40ms" }}>
        <div className="stat-cell">
          <span className="stat-label">Shared skills</span>
          <span className="stat-value">{list.length}</span>
          <span className="stat-caption">{published.length} callable now</span>
        </div>
        <div className="stat-cell">
          <span className="stat-label">Runs · 7 days</span>
          <span className="stat-value">{runs7d.toLocaleString()}</span>
          <span className="stat-caption">across every agent</span>
        </div>
        <div className="stat-cell">
          <span className="stat-label">Median quality</span>
          <span className="stat-value">
            {Math.round(
              published.reduce((n, s) => n + s.quality, 0) / Math.max(published.length, 1),
            )}
          </span>
          <span className="stat-caption">output needing no human edit</span>
        </div>
        <div className="stat-cell">
          <span className="stat-label">Editors</span>
          <span className="stat-value">4</span>
          <span className="stat-caption">people with publish rights</span>
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

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label className="search-line" style={{ width: 200 }}>
            <Icon.search />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search skills…"
            />
          </label>
          <Segmented name="skills-view" value={view} onChange={setView} options={views} />
        </div>
      </div>

      <div ref={floorRef} style={{ ...floorStyle, marginTop: 12 }}>
        {view === "Panel" ? (
          <div className="skill-grid">
            {shown.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className="skill-card enter"
                style={{ animationDelay: `${100 + i * 40}ms` }}
                onClick={() => setOpenId(s.id)}
              >
                <span className="skill-card-head">
                  <span className="strong" style={{ fontSize: "0.875rem" }}>
                    {s.name}
                  </span>
                  <span className={pillFor[s.status]}>{skillStatusLabel[s.status]}</span>
                </span>
                <span className="mono fade" style={{ fontSize: "0.6875rem" }}>
                  {s.slug}
                </span>
                <span className="skill-card-summary">{s.summary}</span>

                <span className="skill-card-meta">
                  <Uses ids={s.uses} />
                  <span className="fade" style={{ fontSize: "0.6875rem" }}>
                    {s.runs7d} runs · 7d
                  </span>
                  <Quality value={s.quality} compact />
                </span>

                <span className="skill-card-foot">
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      className="avatar"
                      style={{ background: s.ownerTint, width: 18, height: 18, fontSize: "0.5625rem" }}
                      aria-hidden
                    >
                      {s.owner
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <span className="fade" style={{ fontSize: "0.6875rem" }}>
                      {s.owner}
                    </span>
                  </span>
                  <span className="mono fade" style={{ fontSize: "0.6875rem" }}>
                    {s.version} · {s.updated}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div className="tbl-head" style={{ gridTemplateColumns: ROW_COLS }}>
              <span>Skill</span>
              <span>Status</span>
              <span>Owner</span>
              <span style={{ textAlign: "right" }}>Ver</span>
              <span style={{ textAlign: "right" }}>Runs</span>
              <span>Quality</span>
              <span>Updated</span>
              <span />
            </div>

            {shown.map((s) => (
              <div key={s.id} className="tbl-row" style={{ gridTemplateColumns: ROW_COLS }}>
                <button
                  type="button"
                  className="link-cell"
                  onClick={() => setOpenId(s.id)}
                >
                  <span className="strong" style={{ display: "block", fontSize: "0.84375rem" }}>
                    {s.name}
                  </span>
                  <span
                    className="mono fade"
                    style={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: "0.6875rem",
                    }}
                  >
                    {s.slug}
                  </span>
                </button>
                <span>
                  <span className={pillFor[s.status]}>{skillStatusLabel[s.status]}</span>
                </span>
                <span className="fade" style={{ fontSize: "0.75rem" }}>
                  {s.owner}
                </span>
                <span className="mono fade" style={{ textAlign: "right", fontSize: "0.75rem" }}>
                  {s.version}
                </span>
                <span className="mono fade" style={{ textAlign: "right", fontSize: "0.75rem" }}>
                  {s.runs7d}
                </span>
                <span>
                  <Quality value={s.quality} />
                </span>
                <span className="fade" style={{ fontSize: "0.75rem" }}>
                  {s.updated}
                </span>
                <span style={{ display: "flex", justifyContent: "flex-end" }}>
                  <RowMenu
                    label={`Actions for ${s.name}`}
                    actions={[
                      { label: "Open", onSelect: () => setOpenId(s.id) },
                      { label: "Copy tool name", onSelect: () => toast.success(`${s.slug} copied`) },
                      { label: "Duplicate", onSelect: () => toast.success(`${s.name} duplicated`) },
                      {
                        label: "Delete",
                        danger: true,
                        separatorBefore: true,
                        onSelect: () => setOpenId(s.id),
                      },
                    ]}
                  />
                </span>
              </div>
            ))}
          </div>
        )}

        {shown.length === 0 && (
          <p className="fade" style={{ padding: "40px 10px", fontSize: "0.78125rem" }}>
            No skill matches that.
          </p>
        )}
      </div>

      {open && (
        <SkillDetail
          key={open.id}
          skill={open}
          onClose={() => setOpenId(null)}
          onSave={(body) =>
            setList((all) => all.map((s) => (s.id === open.id ? { ...s, body, updated: "just now" } : s)))
          }
          onDelete={() => {
            setList((all) => all.filter((s) => s.id !== open.id));
            setOpenId(null);
            toast.error(`${open.name} deleted`, { description: `${open.slug} is no longer callable.` });
          }}
        />
      )}
    </>
  );
}
