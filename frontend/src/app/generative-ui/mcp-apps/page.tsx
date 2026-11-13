import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/mcp-apps";

// The page's "scope it to one agent" alternative, as printed. Not run: it
// builds a BuiltInAgent (this harness runs Pydantic AI agents) and needs
// @ag-ui/mcp-apps-middleware, which the main sample does not.
const MIDDLEWARE = `import { MCPAppsMiddleware } from "@ag-ui/mcp-apps-middleware";

const agent = new BuiltInAgent({
  model: "openai/gpt-6-luna",
  prompt: "You are a helpful assistant.",
}).use(
  new MCPAppsMiddleware({
    mcpServers: [
      {
        type: "http",
        url: "http://localhost:3108/mcp",
        serverId: "my-server",
      },
    ],
  }),
);`;

const HTTP_TRANSPORT = `{
  type: "http",
  url: "http://localhost:3101/mcp",
  serverId: "my-http-server"
}`;

const SSE_TRANSPORT = `{
  type: "sse",
  url: "https://mcp.example.com/sse",
  headers: {
    "Authorization": "Bearer token"
  },
  serverId: "my-sse-server"
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/mcp-apps" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          An MCP server whose tools carry their own UI. The runtime&apos;s{" "}
          <code>mcpApps</code> option connects to the server, offers its tools
          to the agent, and when one is called fetches the tool&apos;s UI
          resource and renders it in a sandboxed iframe in the chat. The
          frontend is just a provider and a <code>CopilotSidebar</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["What tools do you have?", "Use one of your tools and show me its UI."]}
            expect="With an MCP Apps server listening on http://localhost:3108/mcp: the agent lists that server's tools, and calling one renders its UI inline in the sidebar."
            fail="The agent says it has no tools (the runtime could not reach the MCP server — check the Next.js log for an MCP discovery error), or a tool runs but no iframe appears."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="What differs from the page, and what it needs">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Agent swapped.</strong> The page builds a CopilotKit{" "}
            <code>BuiltInAgent</code> (<code>openai/gpt-6-luna</code>, prompt
            &ldquo;You are a helpful assistant.&rdquo;). This harness runs its
            own framework&apos;s agents, so a Pydantic AI agent with the same
            prompt and no tools stands in (<code>mcp_apps</code>, model from{" "}
            <code>OPENAI_MODEL</code>).
          </li>
          <li>
            <strong>Own endpoint.</strong> The runtime applies the MCP
            middleware to every agent it registers, so it lives at{" "}
            <code>/api/copilotkit-mcp-apps</code> and the provider&apos;s{" "}
            <code>runtimeUrl</code> points there instead of{" "}
            <code>/api/copilotkit</code>.
          </li>
          <li>
            <strong>You start the MCP server.</strong> The page hard-codes{" "}
            <code>http://localhost:3108/mcp</code> and points to the{" "}
            <code>modelcontextprotocol/ext-apps</code> repo for servers, but
            does not say which one listens on 3108. Nothing in this repo
            starts one.
          </li>
          <li>
            The page links to an &ldquo;MCP Apps with Intelligence&rdquo;
            section that is not on the page.
          </li>
        </ul>
      </Callout>

      <Panel title="What runs here">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit-mcp-apps/[[...slug]]/route.ts" },
            { file: `${DIR}/providers.tsx` },
            { file: `${DIR}/app-page.tsx` },
            { file: "backend/agents/mcp_apps_agent.py", region: "agent" },
          ]}
        />
      </Panel>

      <Panel title="Printed on the page, not run">
        <div className="space-y-3">
          <CodeBlock code={MIDDLEWARE} language="ts" filename="Scope MCP Apps to one agent with MCPAppsMiddleware" />
          <CodeBlock code={HTTP_TRANSPORT} language="ts" filename="HTTP transport" />
          <CodeBlock code={SSE_TRANSPORT} language="ts" filename="SSE transport" />
        </div>
      </Panel>
    </>
  );
}
