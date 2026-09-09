"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/icons";
import { Mark } from "@/components/v9/mark";
import { Tip } from "@/components/v9/ui";
import { agentClients, installSnippets } from "@/lib/agents";
import { connectedApps } from "@/lib/apps";

const ENDPOINT = "https://mcp.conduit.dev/sse";
const TOKEN = "cdt_live_7f3a91c8b2e04d55a1f6";

const totalTools = connectedApps.reduce((n, a) => n + a.tools, 0);
const online = agentClients.filter((a) => a.online).length;

function copy(value: string, what: string) {
  navigator.clipboard?.writeText(value).then(
    () => toast.success(`${what} copied`),
    () => toast.error(`Couldn't copy ${what.toLowerCase()}`),
  );
}

function CopyRow({
  label,
  value,
  secret = false,
}: {
  label: string;
  value: string;
  secret?: boolean;
}) {
  const [shown, setShown] = useState(!secret);
  return (
    <div className="kv">
      <span className="kv-key">{label}</span>
      <code className="kv-value" style={{ color: shown ? undefined : "var(--sweet-text-muted)" }}>
        {shown ? value : "•".repeat(26)}
      </code>
      {secret && (
        <button
          type="button"
          className="button button-secondary button-small"
          onClick={() => setShown((v) => !v)}
        >
          {shown ? "Hide" : "Reveal"}
        </button>
      )}
      <Tip label={`Copy ${label.toLowerCase()}`}>
        <button
          type="button"
          className="button button-secondary button-small"
          onClick={() => copy(value, label)}
          aria-label={`Copy ${label}`}
          style={{ minWidth: 32, padding: "0 10px" }}
        >
          <Icon.copy />
        </button>
      </Tip>
    </div>
  );
}

export function V9Mcp({ highlighted }: { highlighted: Record<string, string> }) {
  const [tab, setTab] = useState(installSnippets[0].id);
  const snippet = installSnippets.find((s) => s.id === tab)!;

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
        <div>
          <h1 className="page-title">MCP</h1>
        </div>
        <span className="pill pill-success" style={{ marginTop: 8 }}>
          {online} agents online
        </span>
      </div>

      <div
        className="enter"
        style={{
          display: "grid",
          gap: 16,
          marginTop: 24,
          gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 340px)",
          animationDelay: "40ms",
        }}
      >
        <div className="card card-flush card-raised">
          <div className="card-head">
            <div>
              <h2 className="section-title">Endpoint</h2>
              <p className="fade" style={{ margin: "3px 0 0", fontSize: "0.78125rem" }}>
                {totalTools} tools across {connectedApps.length} connections
              </p>
            </div>
            <span className="tag">SSE · streamable HTTP</span>
          </div>
          <CopyRow label="URL" value={ENDPOINT} />
          <CopyRow label="Token" value={TOKEN} secret />
          <CopyRow label="Workspace" value="northwind" />
        </div>

        <div className="card">
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon.lock />
            Scopes hold here
          </h2>
          <p
            className="fade"
            style={{ margin: "10px 0 0", fontSize: "0.78125rem", lineHeight: 1.55 }}
          >
            Agents never see an upstream credential. Every call is checked against the workspace
            policy, rate-limited per connection, and written to the audit log before it leaves.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
            {["read", "write · gated", "no delete", "PII redaction"].map((s) => (
              <span key={s} className="tag">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <h2 className="section-title enter" style={{ marginTop: 36, animationDelay: "80ms" }}>
        Connect an agent
      </h2>

      <div
        className="enter"
        style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 16, animationDelay: "120ms" }}
      >
        {installSnippets.map((s) => (
          <button
            key={s.id}
            type="button"
            className="chip"
            aria-pressed={s.id === tab}
            onClick={() => setTab(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div
        className="card card-flush card-raised enter"
        style={{ marginTop: 12, animationDelay: "160ms" }}
      >
        <div className="card-head" style={{ padding: "10px 20px" }}>
          <span className="mono fade" style={{ fontSize: "0.75rem" }}>
            {snippet.lang}
          </span>
          <button
            type="button"
            className="button button-secondary button-small"
            onClick={() => copy(snippet.code, "Snippet")}
          >
            <Icon.copy />
            Copy
          </button>
        </div>
        <div className="code" dangerouslySetInnerHTML={{ __html: highlighted[snippet.id] }} />
      </div>

      <h2 className="section-title enter" style={{ marginTop: 36, animationDelay: "200ms" }}>
        Connected agents
      </h2>

      <div
        className="card card-flush card-raised enter"
        style={{ marginTop: 16, animationDelay: "240ms" }}
      >
        <div className="agent-head">
          <span>Agent</span>
          <span className="col-transport">Transport</span>
          <span className="col-scopes">Scopes</span>
          <span className="col-agent-calls" style={{ textAlign: "right" }}>
            Calls
          </span>
          <span style={{ textAlign: "right" }}>Last seen</span>
        </div>
        {agentClients.map((a, i) => (
          <div key={a.id} className="agent-row enter" style={{ animationDelay: `${260 + i * 40}ms` }}>
            <span style={{ display: "flex", minWidth: 0, alignItems: "center", gap: 10 }}>
              <span
                style={{
                  flex: "none",
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: a.online ? "var(--sweet-primary)" : "var(--sweet-border-strong)",
                }}
              />
              <span style={{ minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.84375rem",
                    fontWeight: 600,
                    color: "var(--sweet-ink)",
                  }}
                >
                  {a.name}
                </span>
                <span className="fade" style={{ display: "block", fontSize: "0.75rem" }}>
                  {a.owner}
                </span>
              </span>
            </span>
            <span className="col-transport fade" style={{ fontSize: "0.78125rem" }}>
              {a.kind}
            </span>
            <span className="col-scopes fade" style={{ fontSize: "0.78125rem" }}>
              {a.scopes}
            </span>
            <span
              className="col-agent-calls mono fade"
              style={{ textAlign: "right", fontSize: "0.78125rem" }}
            >
              {a.callsToday.toLocaleString()}
            </span>
            <span className="fade" style={{ textAlign: "right", fontSize: "0.75rem" }}>
              {a.lastSeen}
            </span>
          </div>
        ))}
      </div>

      <h2 className="section-title enter" style={{ marginTop: 36, animationDelay: "280ms" }}>
        Tool namespace
      </h2>

      <div
        style={{
          display: "grid",
          gap: 10,
          marginTop: 16,
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        }}
      >
        {connectedApps.map((app, i) => (
          <div
            key={app.id}
            className="card enter"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 14px",
              animationDelay: `${300 + i * 40}ms`,
            }}
          >
            <Mark app={app} size="sm" />
            <code className="mono fade" style={{ flex: 1, minWidth: 0, fontSize: "0.78125rem" }}>
              {app.id}.*
            </code>
            <span className="mono fade" style={{ fontSize: "0.75rem" }}>
              {app.tools}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
