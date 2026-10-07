import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const BEFORE_AFTER = `// BEFORE — app/api/copilotkit/route.ts
import { CopilotRuntime, ExperimentalEmptyAdapter,
         copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";

const runtime = new CopilotRuntime({ agents: { my_agent: new HttpAgent(...) } });

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime, serviceAdapter, endpoint: "/api/copilotkit",
  });
  return handleRequest(req);
};

// AFTER — app/api/copilotkit/[[...slug]]/route.ts
import { CopilotKitIntelligence, CopilotRuntime,
         createCopilotRuntimeHandler } from "@copilotkit/runtime/v2";

const runtime = new CopilotRuntime({
  agents: { my_agent: new HttpAgent({ url: "http://localhost:8000/" }) },
  intelligence: new CopilotKitIntelligence({
    apiKey: process.env.INTELLIGENCE_API_KEY!,
  }),
  identifyUser: (request) => ({
    id: request.headers.get("x-user-id") ?? "anonymous",
    name: request.headers.get("x-user-name") ?? "Anonymous",
  }),
});

const handler = createCopilotRuntimeHandler({
  runtime, basePath: "/api/copilotkit",
});

export const GET = handler;
export const POST = handler;`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/quickstart" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The bring-your-own-agent path, end to end. A Pydantic AI{" "}
          <code>Agent</code> is handed to{" "}
          <code>AGUIAdapter.dispatch_request</code> inside a Starlette route, and
          the Next.js runtime reaches it over HTTP with <code>HttpAgent</code>.
          Two processes, two ports.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Nothing CopilotKit-specific appears in the agent. It is an ordinary
          Pydantic AI agent; the adapter is what speaks the protocol.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "What can you help me with?",
              "What do you think about React?",
            ]}
            expect="Tokens stream in a word at a time, and the reply is noticeably jokey — the agent's only instruction is 'Be fun!'."
            fail="An error banner. Check the connection panel on the home page: if the agent server is unreachable, start it with `uv run main.py`; if it is up, check OPENAI_API_KEY in backend/.env."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/quickstart/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The provider — the Quickstart's app/providers.tsx and app/layout.tsx"
        description="The doc's provider file is verbatim. It wraps the Quickstart demo only, so every other route keeps the harness's own root provider."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/quickstart/providers.tsx" },
            { file: "frontend/src/app/quickstart/demo-chat/layout.tsx" },
          ]}
        />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Because the provider sets <code>agent=&quot;my_agent&quot;</code>,
          the doc&apos;s <code>&lt;CopilotSidebar /&gt;</code> needs no{" "}
          <code>agentId</code>. <code>useSingleEndpoint={"{false}"}</code>{" "}
          matches the <code>[[...slug]]</code> runtime route below. In 1.77,{" "}
          <code>&lt;CopilotKit&gt;</code> passes the flag straight through, so
          leaving it out would mean <code>auto</code> (probe{" "}
          <code>/info</code>), not single-endpoint.
        </p>
      </Panel>

      <Panel
        title="The runtime route — where Intelligence is configured"
        description="Read from disk, so it can be diffed against the doc's sample directly. This is the file the Quickstart rewrote."
      >
        <SourceCode file="frontend/src/app/api/copilotkit/[[...slug]]/route.ts" />
      </Panel>

      <Callout tone="warn" title="The route moved — and its old shape fails quietly">
        <p>
          The Quickstart now mounts the runtime at{" "}
          <code>app/api/copilotkit/[[...slug]]/route.ts</code> with{" "}
          <code>createCopilotRuntimeHandler</code> from{" "}
          <code>@copilotkit/runtime/v2</code>. The handler serves a subtree —{" "}
          <code>/info</code>, agent runs, thread list and mutations — so the old
          single-segment <code>route.ts</code> answers <code>GET /info</code>{" "}
          with a 200 while 404-ing every actual run: the app looks connected and
          never replies.
        </p>
        <p className="mt-2">
          There is no <code>serviceAdapter</code> on this surface at all.{" "}
          <code>ExperimentalEmptyAdapter</code> belonged to the v1 GraphQL
          runtime and has no counterpart in v2.
        </p>
      </Callout>

      <Panel title="Before and after, side by side">
        <CodeBlock
          code={BEFORE_AFTER}
          language="ts"
          filename="The Quickstart's runtime route, old vs new"
        />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          This repo exports two more verbs than the doc does —{" "}
          <code>PATCH</code> and <code>DELETE</code> — because the{" "}
          <a
            href="/headless-threads"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Headless Threads
          </a>{" "}
          route renames, archives and deletes. With only GET and POST those
          mutations 405.
        </p>
      </Panel>

      <Panel
        title="Intelligence: two credentials, two different effects"
        description="Both optional. Without either, the runtime falls back to SSE with an in-memory runner and every chat route here still works."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Variable</th>
                <th className="pb-2 pr-4 font-medium">Read by</th>
                <th className="pb-2 font-medium">What it turns on</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="align-top">
                <td className="py-2 pr-4 font-mono text-xs">INTELLIGENCE_API_KEY</td>
                <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">
                  <code>CopilotKitIntelligence</code> on the runtime
                </td>
                <td className="py-2 text-slate-600 dark:text-slate-400">
                  <code>/info</code> reports{" "}
                  <code>mode: &quot;intelligence&quot;</code>; threads persist
                  and mutations get an endpoint.
                </td>
              </tr>
              <tr className="align-top">
                <td className="py-2 pr-4 font-mono text-xs">COPILOTKIT_LICENSE_TOKEN</td>
                <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">
                  the runtime&apos;s license checker
                </td>
                <td className="py-2 text-slate-600 dark:text-slate-400">
                  <code>/info</code> reports <code>licenseStatus</code>, which is
                  what <code>&lt;CopilotThreadsDrawer&gt;</code> gates its locked
                  view on.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          They are independent. A runtime with a project key but no license token
          serves threads perfectly while every drawer in the app shows an
          Upgrade button — which is why{" "}
          <Link href="/" className="text-[var(--accent)] underline underline-offset-4">
            the connection panel
          </Link>{" "}
          reports them on separate rows, read from <code>/info</code> rather than
          from whether the variables happen to be set.
        </p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Neither is <code>NEXT_PUBLIC_</code>. Both are server secrets; a
          browser-prefixed key would ship in the bundle.
        </p>
      </Panel>

      <Panel
        title="The agent and the server"
        description="The Quickstart's main.py, extended to more than one agent."
      >
        <SourceCodeGroup
          files={[
            { file: "backend/agents/my_agent.py", region: "agent" },
            { file: "backend/main.py" },
          ]}
        />
      </Panel>

      <Callout tone="info" title="`to_ag_ui()` is gone, and so are its warnings">
        The Quickstart used to end the agent file with{" "}
        <code>app = agent.to_ag_ui()</code>. That method and the whole{" "}
        <code>pydantic_ai.ag_ui</code> module are deprecated in
        pydantic-ai-slim 1.107 and removed in 2.0; the doc now builds a Starlette
        route around{" "}
        <code>AGUIAdapter.dispatch_request(request, agent=agent)</code>. This
        repo followed, so the deprecation warnings it used to print on every boot
        are gone.
      </Callout>

      <Callout tone="warn" title="Remaining departures from the doc's samples">
        <p>
          <strong>The install line pulls in v1 React packages.</strong> The
          Quickstart runs{" "}
          <code>
            npm install @copilotkit/react-ui @copilotkit/react-core
            @copilotkit/runtime @ag-ui/client
          </code>
          , but every component it then imports comes from{" "}
          <code>@copilotkit/react-core/v2</code>.{" "}
          <code>@copilotkit/react-ui</code> is the v1 package and is not a
          dependency here.
        </p>
        <p className="mt-2">
          <strong>The Intelligence key has a new name.</strong> The doc&apos;s
          runtime now reads <code>process.env.CPK_INTELLIGENCE_API_KEY</code>,
          which is what <code>npx copilotkit@latest project select</code>{" "}
          writes. This repo still reads <code>INTELLIGENCE_API_KEY</code>. Set
          that one, or Intelligence stays off.
        </p>
        <p className="mt-2">
          <strong>The doc pins Pydantic AI 2.x.</strong> The install line is
          now <code>pydantic-ai-slim[ag-ui,openai]&gt;=2,&lt;3</code> with{" "}
          <code>starlette&gt;=0.46.2</code>. This repo is still on
          pydantic-ai-slim 1.107 and starlette 0.45.3.
        </p>
        <p className="mt-2">
          <strong>One agent at the root, versus several.</strong> The doc points{" "}
          <code>HttpAgent</code> at <code>http://localhost:8000/</code>, which
          assumes a single agent. This harness needs three, so{" "}
          <code>backend/main.py</code> gives each its own{" "}
          <code>POST /&lt;id&gt;/</code> route and the runtime addresses{" "}
          <code>{"<base>/<id>/"}</code>. How each agent is built is unchanged.
        </p>
      </Callout>
    </>
  );
}
