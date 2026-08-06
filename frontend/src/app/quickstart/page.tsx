import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/quickstart" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The bring-your-own-agent path, end to end. A Pydantic AI{" "}
          <code>Agent</code> becomes an ASGI app with one call —{" "}
          <code>agent.to_ag_ui()</code> — and the Next.js runtime route reaches
          it over HTTP with <code>HttpAgent</code>. Two processes, two ports.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Nothing CopilotKit-specific appears in the agent. It is an ordinary
          Pydantic AI agent; <code>to_ag_ui()</code> is what speaks the protocol.
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
        title="The agent"
        description="The Quickstart's main.py — two lines of it are the whole integration."
      >
        <SourceCode file="backend/agents/my_agent.py" region="agent" />
      </Panel>

      <Panel
        title="The runtime route"
        description="Read from this repo, so it can be diffed against the doc's sample directly."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit/route.ts" },
            { file: "frontend/src/components/providers.tsx" },
          ]}
        />
      </Panel>

      <Callout tone="warn" title="Three departures from the doc's samples">
        <p>
          <strong>
            <code>to_ag_ui()</code> is deprecated in the installed version.
          </strong>{" "}
          pydantic-ai-slim 1.107.1 emits a{" "}
          <code>PydanticAIDeprecationWarning</code> for both{" "}
          <code>Agent.to_ag_ui()</code> and the <code>pydantic_ai.ag_ui</code>{" "}
          module, and says they are removed in 2.0 in favour of{" "}
          <code>pydantic_ai.ui.ag_ui.AGUIAdapter.dispatch_request()</code>. This
          repo keeps the documented API — it still works — so the warning is
          expected on startup.
        </p>
        <p className="mt-2">
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
          <strong>One agent at the root, versus several.</strong> The doc points{" "}
          <code>HttpAgent</code> at <code>http://localhost:8000/</code>, which
          assumes a single agent. This harness needs three, so{" "}
          <code>backend/main.py</code> mounts each <code>to_ag_ui()</code> app
          under its own path and the runtime addresses{" "}
          <code>{"<base>/<id>/"}</code>. How each agent is built is unchanged.
        </p>
      </Callout>
    </>
  );
}
