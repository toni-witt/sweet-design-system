import { codeToHtml } from "shiki";
import { V9Mcp } from "@/components/v9/mcp";
import { installSnippets } from "@/lib/agents";

export default async function V9McpPage() {
  const entries = await Promise.all(
    installSnippets.map(async (s) => [
      s.id,
      await codeToHtml(s.code, { lang: s.lang, theme: "github-light" }),
    ]),
  );

  return <V9Mcp highlighted={Object.fromEntries(entries)} />;
}
