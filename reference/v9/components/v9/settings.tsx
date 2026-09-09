"use client";

import { useState } from "react";
import { Switch } from "@/components/lab/uitimate/switch";
import { toast } from "sonner";

function Toggle({
  label,
  hint,
  defaultOn = false,
}: {
  label: string;
  hint: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="setting">
      <div style={{ minWidth: 0 }}>
        <p className="setting-label">{label}</p>
        <p className="setting-hint">{hint}</p>
      </div>
      {/* Radix's switch, via the vendored uitimate set, tinted to the
          version's navy rather than the global near-black accent. */}
      <Switch
        checked={on}
        onCheckedChange={setOn}
        className="data-[state=checked]:bg-[var(--sweet-primary)]"
      />
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="setting">
      <div style={{ minWidth: 0 }}>
        <p className="setting-label">{label}</p>
        {hint && <p className="setting-hint">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Section({
  title,
  children,
  delay,
  danger,
}: {
  title: string;
  children: React.ReactNode;
  delay: number;
  danger?: boolean;
}) {
  return (
    /* v9 has frames again, so the danger zone goes back to being outlined —
       the same rule as every other section, in red. */
    <div
      className="card card-flush enter"
      style={{
        maxWidth: 900,
        marginTop: 20,
        animationDelay: `${delay}ms`,
        borderColor: danger ? "rgba(220, 38, 38, 0.4)" : undefined,
      }}
    >
      <div className="card-head">
        <h2 className="section-title">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function V9Settings() {
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
          <h1 className="page-title">Settings</h1>
        </div>
        <button
          type="button"
          className="button button-primary"
          onClick={() => toast.success("Settings saved")}
        >
          Save changes
        </button>
      </div>

      <Section title="Workspace" delay={40}>
        <Field label="Name">
          <input className="input input-small" defaultValue="Northwind" style={{ width: 220 }} />
        </Field>
        <Field label="Endpoint subdomain" hint="Agents connect at this host.">
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input className="input input-small" defaultValue="northwind" style={{ width: 150 }} />
            <span className="mono fade" style={{ fontSize: "0.78125rem" }}>
              .mcp.conduit.dev
            </span>
          </span>
        </Field>
        <Field label="Data region" hint="Credentials never leave this region.">
          <select className="select" defaultValue="us-east">
            <option value="us-east">US East (Virginia)</option>
            <option value="eu-west">EU West (Dublin)</option>
            <option value="ap-southeast">AP Southeast (Sydney)</option>
          </select>
        </Field>
      </Section>

      <Section
        title="Health & reliability"
        delay={80}
      >
        <Field label="Health check interval">
          <select className="select" defaultValue="60">
            <option value="30">Every 30 seconds</option>
            <option value="60">Every 60 seconds</option>
            <option value="300">Every 5 minutes</option>
          </select>
        </Field>
        <Toggle
          label="Refresh tokens ahead of expiry"
          hint="Rotate any OAuth credential once it's inside 72 hours of expiring, rather than waiting for the first failure."
          defaultOn
        />
        <Toggle
          label="Retry idempotent calls"
          hint="Up to 3 attempts with backoff on reads. Writes are never retried automatically."
          defaultOn
        />
        <Toggle
          label="Quarantine degraded connections"
          hint="Stop routing to a connection once p95 passes 5s, so one slow upstream can't stall an agent run."
        />
      </Section>

      <Section
        title="Agent policy"
        delay={120}
      >
        <Toggle
          label="Require approval for writes"
          hint="Creates, updates and deletes pause for a human unless the tool is on the allowlist."
          defaultOn
        />
        <Toggle
          label="Redact PII in tool results"
          hint="Strip emails, phone numbers and tax IDs from responses before they reach the model."
          defaultOn
        />
        <Toggle
          label="Allow agents to create microsites"
          hint="Agents can deploy to *.sites.conduit.dev without a person in the loop."
        />
        <Field label="Per-agent rate limit" hint="Applies across all connections.">
          <select className="select" defaultValue="240">
            <option value="60">60 req/min</option>
            <option value="240">240 req/min</option>
            <option value="0">Unlimited</option>
          </select>
        </Field>
      </Section>

      <Section title="Notifications" delay={160}>
        <Toggle label="Token expiring within 7 days" hint="Email plus in-app." defaultOn />
        <Toggle
          label="Connection revoked or errored"
          hint="Email, in-app, and a Slack DM."
          defaultOn
        />
        <Toggle
          label="Degraded latency"
          hint="In-app only — these usually resolve upstream."
          defaultOn
        />
        <Toggle label="Weekly digest" hint="Call volume, error rate and cost, every Monday." />
      </Section>

      <Section
        title="Danger zone"
        delay={200}
        danger
      >
        <Field
          label="Rotate endpoint token"
          hint="Every connected agent must be reconfigured with the new token."
        >
          <button
            type="button"
            className="button button-secondary button-small"
            onClick={() =>
              toast("Rotate token?", { description: "5 agents would need reconfiguring." })
            }
          >
            Rotate
          </button>
        </Field>
        <Field
          label="Revoke all connections"
          hint="Disconnects all 12 apps and drops their stored credentials. The audit log is kept."
        >
          <button
            type="button"
            className="button button-danger button-small"
            onClick={() =>
              toast.error("Revoke all connections?", {
                description: "This can't be undone. 226 tools would go offline.",
              })
            }
          >
            Revoke all
          </button>
        </Field>
      </Section>
    </>
  );
}
