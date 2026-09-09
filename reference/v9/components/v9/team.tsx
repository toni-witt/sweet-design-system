"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Menu } from "@base-ui/react/menu";
import { toast } from "sonner";
import { Icon } from "@/components/icons";
import { RowMenu, Tip } from "@/components/v9/ui";
import {
  invites as seedInvites,
  members as seedMembers,
  permissions,
  roleBlurb,
  roles,
  type Invite,
  type Member,
  type Role,
} from "@/lib/team";
import { connectedApps } from "@/lib/apps";

const MEMBER_COLS = "minmax(0, 1.4fr) 132px minmax(0, 1fr) 110px 40px";
const INVITE_COLS = "minmax(0, 1.4fr) 132px minmax(0, 1fr) 110px 40px";

function Initials({ name, tint }: { name: string; tint: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      className="avatar"
      style={{ background: tint, flex: "none" }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

/** Changing someone's role is a one-click decision, so it is a menu, not a form. */
function RolePicker({
  role,
  onChange,
  locked,
}: {
  role: Role;
  onChange: (r: Role) => void;
  locked?: boolean;
}) {
  if (locked) {
    return (
      <Tip label="A workspace keeps at least one owner">
        <span className="role-chip" data-locked>
          {role}
        </span>
      </Tip>
    );
  }
  return (
    <Menu.Root>
      <Menu.Trigger className="role-chip">
        {role}
        <Icon.chevron />
      </Menu.Trigger>
      <Menu.Portal>
        <div className="s9-root-portal">
          <Menu.Positioner align="start" sideOffset={5} style={{ outline: "none" }}>
            <Menu.Popup className="menu-popup" style={{ minWidth: 268 }}>
              {roles.map((r) => (
                <Menu.Item
                  key={r}
                  className="menu-item"
                  onClick={() => onChange(r)}
                  style={{ alignItems: "flex-start", minHeight: 0, padding: "7px 9px" }}
                >
                  <span
                    style={{ width: 12, flex: "none", color: "var(--sweet-primary)" }}
                    aria-hidden
                  >
                    {r === role ? "✓" : ""}
                  </span>
                  <span>
                    <span className="strong" style={{ display: "block" }}>
                      {r}
                    </span>
                    <span
                      className="fade"
                      style={{ display: "block", fontSize: "0.6875rem", lineHeight: 1.4 }}
                    >
                      {roleBlurb[r]}
                    </span>
                  </span>
                </Menu.Item>
              ))}
            </Menu.Popup>
          </Menu.Positioner>
        </div>
      </Menu.Portal>
    </Menu.Root>
  );
}

function InviteDialog({
  open,
  onOpenChange,
  onInvite,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onInvite: (emails: string[], role: Role) => void;
}) {
  const [emails, setEmails] = useState("");
  const [role, setRole] = useState<Role>("Member");

  /** One per line or comma-separated — people paste both. */
  const parsed = emails
    .split(/[\n,]/)
    .map((e) => e.trim())
    .filter((e) => e.includes("@"));

  function send() {
    if (!parsed.length) return;
    onInvite(parsed, role);
    setEmails("");
    setRole("Member");
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <div className="s9-root-portal">
          <Dialog.Backdrop className="palette-backdrop" />
          <Dialog.Popup className="modal">
            <div className="modal-head">
              <Dialog.Title className="modal-title">Invite people</Dialog.Title>
              <Dialog.Close className="button button-secondary button-icon" aria-label="Close">
                ✕
              </Dialog.Close>
            </div>

            <div className="modal-body">
              <label className="field">
                <span className="field-label">Email addresses</span>
                <textarea
                  className="input"
                  rows={3}
                  autoFocus
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  placeholder={"jules@northwind.co\nsam@northwind.co"}
                  style={{ minHeight: 72, padding: "8px 10px", lineHeight: 1.5 }}
                />
                <span className="field-hint">
                  One per line, or comma separated. {parsed.length} valid so far.
                </span>
              </label>

              <div className="field">
                <span className="field-label">Role</span>
                <div className="role-grid">
                  {roles
                    .filter((r) => r !== "Owner")
                    .map((r) => (
                      <button
                        key={r}
                        type="button"
                        className="role-option"
                        aria-pressed={r === role}
                        onClick={() => setRole(r)}
                      >
                        <span className="strong">{r}</span>
                        <span className="fade" style={{ fontSize: "0.6875rem", lineHeight: 1.4 }}>
                          {roleBlurb[r]}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="modal-foot">
              <span className="fade" style={{ fontSize: "0.6875rem" }}>
                Invites lapse after 7 days.
              </span>
              <span style={{ display: "flex", gap: 6 }}>
                <Dialog.Close className="button button-secondary button-small">
                  Cancel
                </Dialog.Close>
                <button
                  type="button"
                  className="button button-primary button-small"
                  disabled={parsed.length === 0}
                  onClick={send}
                >
                  {parsed.length > 1 ? `Send ${parsed.length} invites` : "Send invite"}
                </button>
              </span>
            </div>
          </Dialog.Popup>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function V9Team() {
  const [members, setMembers] = useState<Member[]>(seedMembers);
  const [invites, setInvites] = useState<Invite[]>(seedInvites);
  const [inviting, setInviting] = useState(false);

  const owners = members.filter((m) => m.role === "Owner").length;

  function setRole(id: string, role: Role) {
    setMembers((list) => list.map((m) => (m.id === id ? { ...m, role } : m)));
    const who = members.find((m) => m.id === id);
    toast.success(`${who?.name} is now ${role.toLowerCase()}`);
  }

  function invite(emails: string[], role: Role) {
    setInvites((list) => [
      ...emails.map((email, i) => ({
        id: `new-${Date.now()}-${i}`,
        email,
        role,
        sentBy: "Toni",
        sentAt: "just now",
        expiresIn: "7 days",
      })),
      ...list,
    ]);
    toast.success(emails.length > 1 ? `${emails.length} invites sent` : "Invite sent", {
      description: `They join as ${role.toLowerCase()}. Nothing is charged until they accept.`,
    });
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
        <h1 className="page-title">Team</h1>
        <button
          type="button"
          className="button button-primary button-small"
          onClick={() => setInviting(true)}
        >
          <Icon.plus />
          Invite people
        </button>
      </div>

      <div className="stat-row enter" style={{ marginTop: 24, animationDelay: "40ms" }}>
        <div className="stat-cell">
          <span className="stat-label">People</span>
          <span className="stat-value">{members.length}</span>
          <span className="stat-caption">{owners} owner · {members.length - owners} other</span>
        </div>
        <div className="stat-cell">
          <span className="stat-label">Pending invites</span>
          <span className="stat-value" style={{ color: invites.length ? "var(--sweet-warning)" : undefined }}>
            {invites.length}
          </span>
          <span className="stat-caption">
            {invites.length ? "1 lapses tomorrow" : "nothing outstanding"}
          </span>
        </div>
        <div className="stat-cell">
          <span className="stat-label">Scoped access</span>
          <span className="stat-value">{members.filter((m) => m.scope).length}</span>
          <span className="stat-caption">limited to some connections</span>
        </div>
        <div className="stat-cell">
          <span className="stat-label">Seats</span>
          <span className="stat-value">10</span>
          <span className="stat-caption">{10 - members.length - invites.length} free</span>
        </div>
      </div>

      <h2 className="section-title enter" style={{ marginTop: 36, animationDelay: "80ms" }}>
        People
      </h2>

      <div className="enter" style={{ marginTop: 10, animationDelay: "100ms" }}>
        <div className="tbl-head" style={{ gridTemplateColumns: MEMBER_COLS }}>
          <span>Person</span>
          <span>Role</span>
          <span>Access</span>
          <span>Last active</span>
          <span />
        </div>

        {members.map((m) => (
          <div key={m.id} className="tbl-row" style={{ gridTemplateColumns: MEMBER_COLS }}>
            <span style={{ display: "flex", minWidth: 0, alignItems: "center", gap: 10 }}>
              <Initials name={m.name} tint={m.tint} />
              <span style={{ minWidth: 0 }}>
                <span className="strong" style={{ display: "block", fontSize: "0.84375rem" }}>
                  {m.name}
                </span>
                <span
                  className="fade"
                  style={{
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "0.6875rem",
                  }}
                >
                  {m.email}
                </span>
              </span>
            </span>

            <span>
              <RolePicker
                role={m.role}
                locked={m.role === "Owner" && owners === 1}
                onChange={(r) => setRole(m.id, r)}
              />
            </span>

            <span className="fade" style={{ fontSize: "0.75rem" }}>
              {m.scope === null ? (
                "All 12 connections"
              ) : (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "flex" }}>
                    {m.scope.map((id, i) => {
                      const app = connectedApps.find((a) => a.id === id);
                      return app ? (
                        <span
                          key={id}
                          className="mark mark-sm"
                          style={{
                            marginLeft: i ? -4 : 0,
                            background: app.tint,
                            boxShadow: "0 0 0 2px var(--sweet-bg)",
                          }}
                          aria-hidden
                        >
                          {app.mark}
                        </span>
                      ) : null;
                    })}
                  </span>
                  {m.scope.length} of 12
                </span>
              )}
            </span>

            <span className="fade" style={{ fontSize: "0.75rem" }}>
              {m.lastActive}
            </span>

            <span style={{ display: "flex", justifyContent: "flex-end" }}>
              <RowMenu
                label={`Actions for ${m.name}`}
                actions={[
                  { label: "View activity", onSelect: () => toast(`${m.name} — audit log`) },
                  { label: "Edit connection access", onSelect: () => toast("Scope editor") },
                  { label: "Send password reset", onSelect: () => toast.success("Reset link sent") },
                  {
                    label: "Remove from workspace",
                    danger: true,
                    separatorBefore: true,
                    onSelect: () => {
                      setMembers((list) => list.filter((x) => x.id !== m.id));
                      toast.error(`${m.name} removed`, {
                        description: "Their sessions end immediately.",
                      });
                    },
                  },
                ]}
              />
            </span>
          </div>
        ))}
      </div>

      {invites.length > 0 && (
        <>
          <h2 className="section-title enter" style={{ marginTop: 36, animationDelay: "140ms" }}>
            Pending invites
          </h2>

          <div className="enter" style={{ marginTop: 10, animationDelay: "160ms" }}>
            <div className="tbl-head" style={{ gridTemplateColumns: INVITE_COLS }}>
              <span>Email</span>
              <span>Role</span>
              <span>Sent</span>
              <span>Expires</span>
              <span />
            </div>

            {invites.map((inv) => (
              <div key={inv.id} className="tbl-row" style={{ gridTemplateColumns: INVITE_COLS }}>
                <span style={{ display: "flex", minWidth: 0, alignItems: "center", gap: 10 }}>
                  <span className="avatar" style={{ background: "rgba(15,23,42,0.08)", color: "var(--sweet-text-muted)" }}>
                    @
                  </span>
                  <span
                    style={{
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: "0.84375rem",
                    }}
                  >
                    {inv.email}
                  </span>
                </span>
                <span>
                  <span className="role-chip" data-locked>
                    {inv.role}
                  </span>
                </span>
                <span className="fade" style={{ fontSize: "0.75rem" }}>
                  {inv.sentAt} by {inv.sentBy}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color:
                      inv.expiresIn === "tomorrow"
                        ? "var(--sweet-warning)"
                        : "var(--sweet-text-muted)",
                  }}
                >
                  {inv.expiresIn}
                </span>
                <span style={{ display: "flex", justifyContent: "flex-end" }}>
                  <RowMenu
                    label={`Actions for ${inv.email}`}
                    actions={[
                      {
                        label: "Resend invite",
                        onSelect: () => toast.success(`Invite resent to ${inv.email}`),
                      },
                      { label: "Copy invite link", onSelect: () => toast.success("Link copied") },
                      {
                        label: "Revoke",
                        danger: true,
                        separatorBefore: true,
                        onSelect: () => {
                          setInvites((list) => list.filter((x) => x.id !== inv.id));
                          toast.error("Invite revoked");
                        },
                      },
                    ]}
                  />
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="section-title enter" style={{ marginTop: 36, animationDelay: "200ms" }}>
        What each role can do
      </h2>

      {/* Read across, not down: people arrive asking "who can do X", so the
          capability is the row and the role is the column. */}
      <div className="enter matrix" style={{ marginTop: 10, animationDelay: "220ms" }}>
        <div className="tbl-head" style={{ gridTemplateColumns: "minmax(0, 1fr) repeat(4, 76px)" }}>
          <span>Capability</span>
          {roles.map((r) => (
            <span key={r} style={{ textAlign: "center" }}>
              {r}
            </span>
          ))}
        </div>
        {permissions.map((row) => (
          <div
            key={row.capability}
            className="tbl-row"
            style={{ gridTemplateColumns: "minmax(0, 1fr) repeat(4, 76px)", minHeight: 44 }}
          >
            <span style={{ fontSize: "0.78125rem" }}>{row.capability}</span>
            {roles.map((r) => (
              <span key={r} style={{ textAlign: "center" }}>
                {row.allowed.includes(r) ? (
                  <span style={{ color: "var(--sweet-primary)" }} aria-label="allowed">
                    ✓
                  </span>
                ) : (
                  <span className="fade" aria-label="not allowed">
                    —
                  </span>
                )}
              </span>
            ))}
          </div>
        ))}
      </div>

      <InviteDialog open={inviting} onOpenChange={setInviting} onInvite={invite} />
    </>
  );
}
