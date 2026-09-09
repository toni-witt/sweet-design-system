export type AgentClient = {
  id: string;
  name: string;
  kind: string;
  owner: string;
  lastSeen: string;
  callsToday: number;
  scopes: string;
  online: boolean;
};

/** One agent connected for now: Claude. */
export const agentClients: AgentClient[] = [
  {
    id: "claude",
    name: "Claude",
    kind: "stdio · local",
    owner: "Toni",
    lastSeen: "now",
    callsToday: 3_182,
    scopes: "read + write",
    online: true,
  },
];

export const installSnippets: { id: string; label: string; lang: string; code: string }[] = [
  {
    id: "claude-code",
    label: "Claude Code",
    lang: "bash",
    code: `claude mcp add conduit \\
  --transport sse \\
  https://mcp.conduit.dev/sse \\
  --header "Authorization: Bearer $CONDUIT_TOKEN"`,
  },
  {
    id: "claude-desktop",
    label: "Claude Desktop",
    lang: "json",
    code: `{
  "mcpServers": {
    "conduit": {
      "url": "https://mcp.conduit.dev/sse",
      "headers": {
        "Authorization": "Bearer <token>"
      }
    }
  }
}`,
  },
  {
    id: "cursor",
    label: "Cursor",
    lang: "json",
    code: `{
  "mcpServers": {
    "conduit": {
      "type": "sse",
      "url": "https://mcp.conduit.dev/sse?key=<token>"
    }
  }
}`,
  },
  {
    id: "http",
    label: "Raw HTTP",
    lang: "bash",
    code: `curl -N https://mcp.conduit.dev/sse \\
  -H "Authorization: Bearer $CONDUIT_TOKEN" \\
  -H "Accept: text/event-stream"`,
  },
];
