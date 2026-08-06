import Link from "next/link";

import { BackendHealth } from "@/components/backend-health";
import { RouteHeader } from "@/components/route-header";
import { Callout, KeyValue, Panel, TryIt } from "@/components/ui";
import { DOCS_ROOT } from "@/lib/nav-config";

const AGENTS: [string, string, string][] = [
  [
    "my_agent",
    "—",
    "Quickstart, Prebuilt Components, Slots, Headless UI, Programmatic Control, Inspector, Display-only, Interactive, Frontend Tools, State Rendering, Multi-Agent Flows, Runtime, AG-UI",
  ],
  ["weather_agent", "get_weather (tool_plain)", "Tool Rendering, Multi-Agent Flows"],
  [
    "language_agent",
    "StateDeps[AgentState] — language",
    "Shared State read + write, Multi-Agent Flows",
  ],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/" />

      <Panel title="What this is">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A working test harness for the CopilotKit + Pydantic AI integration.
          Each route implements one doc page against a real agent, and shows the
          exact source that makes it work.
        </p>
        <div className="mt-4">
          <KeyValue
            rows={[
              [
                "Docs tracked",
                <a
                  key="d"
                  href={DOCS_ROOT}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent)] underline underline-offset-4"
                >
                  {DOCS_ROOT}
                </a>,
              ],
              ["Backend", "Python · Pydantic AI · Starlette/uvicorn on :8000"],
              ["Frontend", "Next.js App Router on :3000"],
            ]}
          />
        </div>
      </Panel>

      <Panel
        title="Connection check"
        description="Two processes, so two ways to be down. Probed server-side each time this page renders."
      >
        <BackendHealth />
      </Panel>

      <Callout tone="info" title="Two processes, unlike some other integrations">
        Pydantic AI is Python, so agents cannot run inside the Next app. The
        Quickstart serves them with <code>agent.to_ag_ui()</code> on their own
        port, and the Next runtime route reaches them with{" "}
        <code>HttpAgent</code> over HTTP. You start both:{" "}
        <code>uv run main.py</code> in <code>backend/</code>, and{" "}
        <code>npm run dev</code> in <code>frontend/</code>.
      </Callout>

      <Panel
        title="The three agents"
        description="One per doc page that defines one. Each is a separate to_ag_ui() app mounted under its own path by backend/main.py."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Agent id</th>
                <th className="pb-2 pr-4 font-medium">Tools / state</th>
                <th className="pb-2 font-medium">Used by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {AGENTS.map(([id, tools, used]) => (
                <tr key={id} className="align-top">
                  <td className="py-2 pr-4 font-mono text-xs text-slate-800 dark:text-slate-100">
                    {id}
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {tools}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {used}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Three rather than one because state is per-agent: the Shared State
          agent is built with <code>deps_type=StateDeps[AgentState]</code>, which
          the Quickstart agent is not. Agent ids come from the keys in the
          runtime&apos;s <code>agents: {"{ … }"}</code> object, and those keys
          match the mount paths in <code>backend/main.py</code>.
        </p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          A fourth — <code>search_agent</code>, for State Rendering — is a
          documented placeholder rather than an agent. Its doc page&apos;s{" "}
          <code>agent.py</code> block contains React code, so there is no Python
          to transcribe.
        </p>
      </Panel>

      <Panel title="Start here">
        <TryIt
          prompts={["What can you help me with?"]}
          expect={
            <>
              On{" "}
              <Link href="/quickstart" className="underline">
                /quickstart
              </Link>
              , a streamed reply in the agent&apos;s deliberately playful voice —
              its only instruction is &ldquo;Be fun!&rdquo;.
            </>
          }
          fail="An error banner — check the connection panel above, then that OPENAI_API_KEY is set in backend/.env."
        />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          The{" "}
          <Link
            href="/status"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            status overview
          </Link>{" "}
          lists every route in one table.
        </p>
      </Panel>
    </>
  );
}
