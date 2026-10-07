import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const MIDDLEWARE = `// A2UI middleware — translates agent output into declarative UI.
const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  a2ui: {},
});

// …scoped to specific agents, and themed from the frontend.
a2ui: { agents: ["my-agent"] }

<CopilotKit runtimeUrl="/api/copilotkit" a2ui={{ theme: myCustomTheme }}>
  {children}
</CopilotKit>

// MCP Apps — servers whose tools become available to every registered agent.
const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  mcpApps: {
    servers: [
      { type: "http", url: "http://localhost:3108/mcp", serverId: "my-server" },
    ],
  },
});`;

const DIRECT = `// Development only. The browser talks to the agent with no runtime in between,
// so there is nowhere to put auth, rate limiting, or secrets.
import { HttpAgent } from "@ag-ui/client";

const myAgent = new HttpAgent({
  url: "https://my-agent.example.com",
});

<CopilotKit agents__unsafe_dev_only={{ "my-agent": myAgent }}>
  <YourApp />
</CopilotKit>;`;

const COMPARISON: [string, string, string][] = [
  ["Where the agent URL lives", "Server-side, in the route", "In browser JavaScript"],
  ["Auth / secrets", "Can be held and enforced", "Nowhere to put them"],
  ["Middleware (A2UI, MCP Apps)", "Available", "Bypassed"],
  ["Intended for", "Anything you deploy", "Local development only"],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/copilot-runtime" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The runtime is the server-side hinge: it resolves an agent by id,
          executes it, and re-encodes its AG-UI events as SSE for the browser.
          For Pydantic AI that agent is a separate Python process, reached with{" "}
          <code>HttpAgent</code> — so this route is the only place in the app
          that knows the agent server&apos;s address.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>ExperimentalEmptyAdapter</code> is not a placeholder to be
          replaced later. The agent owns the model call, so the runtime needs no
          model provider of its own — the empty adapter says exactly that.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Hello", "What's the weather in Tokyo?"]}
            expect="All four ids stream a reply. Only weather_agent calls a tool on the second prompt. Switching ids starts a separate conversation, because each carries its own message list."
            fail="An id errors with an agent-not-found message — its key is missing from the runtime's agents object, or the matching mount is missing from backend/main.py."
          />
        </div>
      </Panel>

      <Panel
        title="This repo's runtime"
        description="Read from disk — diff it against the doc's sample."
      >
        <SourceCode file="frontend/src/app/api/copilotkit/route.ts" />
      </Panel>

      <Panel
        title="The agent server it points at"
        description="Each to_ag_ui() app mounted under the id the runtime addresses it by."
      >
        <SourceCode file="backend/main.py" />
      </Panel>

      <Callout tone="warn" title="The doc's single-agent URL versus this one">
        The Quickstart points <code>HttpAgent</code> at{" "}
        <code>http://localhost:8000/</code>, which works because it serves one
        agent at the root. This harness needs several, so each is mounted under its
        own path and the runtime addresses{" "}
        <code>{"http://localhost:8000/<id>/"}</code>. The trailing slash matters:
        without it Starlette issues a redirect that the POST does not survive
        cleanly.
      </Callout>

      <Panel
        title="Built-in middleware"
        description="Documented on this page. A2UI is exercised on the A2UI Fixed and Dynamic Schema routes, each with its own runtime route. MCP Apps is not built yet."
      >
        <CodeBlock
          code={MIDDLEWARE}
          language="ts"
          filename="a2ui and mcpApps runtime options"
        />
      </Panel>

      <Panel
        title="Connecting to the agent directly"
        description="The escape hatch the page documents, and why this repo does not use it."
      >
        <CodeBlock
          code={DIRECT}
          language="tsx"
          filename="agents__unsafe_dev_only"
        />

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium" />
                <th className="pb-2 pr-4 font-medium">Through the runtime</th>
                <th className="pb-2 font-medium">Direct</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {COMPARISON.map(([label, viaRuntime, direct]) => (
                <tr key={label} className="align-top">
                  <td className="py-2 pr-4 font-medium text-slate-800 dark:text-slate-100">
                    {label}
                  </td>
                  <td className="py-2 pr-4 text-emerald-700 dark:text-emerald-400">
                    {viaRuntime}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {direct}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          The prop name is the warning. Going direct would also put the agent
          server&apos;s URL in browser JavaScript, which is why{" "}
          <code>backend/main.py</code> only opens CORS for the dev origin.
        </p>
      </Panel>
    </>
  );
}
