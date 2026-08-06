import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const MODES = `// Router mode (the default) — no agent named, so the runtime decides.
<CopilotKit runtimeUrl="/api/copilotkit">
  {children}
</CopilotKit>

// Agent lock mode — every run goes to this agent, whatever the topic.
<CopilotKit runtimeUrl="/api/copilotkit" agent="my_agent">
  {children}
</CopilotKit>`;

const COMPARISON: [string, string, string][] = [
  ["Who picks the agent", "The runtime, per run", "You, once"],
  ["Configuration", "Omit the `agent` prop", "Set `agent` to an id"],
  [
    "Good for",
    "Several specialists behind one chat",
    "A single workflow you do not want deviated from",
  ],
  [
    "Failure you will see",
    "A run lands on the wrong agent for the question",
    "The agent cannot help, and will not hand off",
  ],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/multi-agent-flows" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          With more than one agent registered, something has to decide where a
          run goes. The doc describes two answers, and the difference between
          them is one prop.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <strong>Router mode</strong> is what you get by omitting{" "}
          <code>agent</code> — the runtime resolves each run itself.{" "}
          <strong>Agent lock mode</strong> names an id, and every run in that
          tree goes to it regardless of what the user asks.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium" />
                <th className="pb-2 pr-4 font-medium">Router mode</th>
                <th className="pb-2 font-medium">Agent lock mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {COMPARISON.map(([label, router, lock]) => (
                <tr key={label} className="align-top">
                  <td className="py-2 pr-4 font-medium text-slate-800 dark:text-slate-100">
                    {label}
                  </td>
                  <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">
                    {router}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {lock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <TryIt
            prompts={[
              "What's the weather in Tokyo? — in router mode",
              "The same question, locked to weather_agent",
            ]}
            expect="In router mode the run lands on `default` (aliased to my_agent), which has no tools, so you get prose. Locked to weather_agent, the same question triggers a real get_weather tool call — visible in the inspector's event list."
            fail="Both modes behave identically — the agentId is not reaching the runtime, or `default` is registered as the same agent you locked to."
          />
        </div>
      </Panel>

      <Callout tone="info" title="This doc page ships no code blocks">
        Unlike its neighbours, the page describes both modes in prose and shows
        the configuration inline rather than as a labelled sample. The snippet
        below is that configuration written out — the provider with and without
        the <code>agent</code> prop, which is the entire API surface the page
        covers.
      </Callout>

      <Panel title="The two configurations">
        <CodeBlock
          code={MODES}
          language="tsx"
          filename="Router mode vs. agent lock mode"
        />
      </Panel>

      <Panel
        title="How the demo expresses the choice"
        description="One page cannot host two providers, so the switch sits one level down."
      >
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          This app&apos;s provider names no agent, so the whole harness is in
          router mode already — see{" "}
          <code>frontend/src/components/providers.tsx</code>. The demo then
          toggles between letting that stand (no <code>agentId</code> on the
          chat) and pinning a specific agent on the component, which is the same
          decision scoped to one surface instead of the app.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Note the effect only shows because the agents genuinely differ: only{" "}
          <code>weather_agent</code> has <code>get_weather</code>, and only{" "}
          <code>language_agent</code> carries state. Routing between three copies
          of the same agent would look like nothing at all.
        </p>
      </Panel>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/multi-agent-flows/demo-chat/page.tsx" />
      </Panel>

      <Panel title="The agents being routed between">
        <SourceCode file="frontend/src/app/api/copilotkit/route.ts" />
      </Panel>
    </>
  );
}
