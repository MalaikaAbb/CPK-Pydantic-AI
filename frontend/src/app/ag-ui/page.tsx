import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const EVENTS: [string, string][] = [
  ["Run lifecycle", "onRunStartedEvent, onRunFinishedEvent, onRunErrorEvent"],
  ["Steps", "onStepStartedEvent, onStepFinishedEvent"],
  [
    "Text messages",
    "onTextMessageStartEvent, onTextMessageContentEvent, onTextMessageEndEvent",
  ],
  [
    "Tool calls",
    "onToolCallStartEvent, onToolCallArgsEvent, onToolCallEndEvent, onToolCallResultEvent",
  ],
  ["State", "onStateSnapshotEvent, onStateDeltaEvent"],
  ["Messages", "onMessagesSnapshotEvent"],
  ["Custom", "onCustomEvent, onRawEvent"],
  ["High-level", "onMessagesChanged, onStateChanged"],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/ag-ui" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          AG-UI is the protocol underneath this whole integration — and the
          reason a Python agent can drive a React app at all. Messages, tool
          calls, state updates, and lifecycle transitions travel as discrete
          events over SSE, and <code>agent.subscribe()</code> lets you observe
          them directly: the fastest way to tell whether a problem is in the
          agent, the runtime, or the UI.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          On the Python side this is entirely <code>to_ag_ui()</code>&apos;s
          doing. Nothing in <code>weather_agent.py</code> mentions events; the
          adapter derives them from an ordinary agent run.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["What's the weather in Tokyo?"]}
            expect="RUN_STARTED, a burst of TEXT_MESSAGE_CONTENT, TOOL_CALL_START/END around get_weather, TOOL_CALL_RESULT carrying 'The weather in Tokyo is sunny.', then RUN_FINISHED."
            fail="The log stays empty while the chat streams — the subscription is bound to a different agent than the chat is using."
          />
        </div>
      </Panel>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/ag-ui/demo-chat/page.tsx" />
      </Panel>

      <Callout tone="warn" title="The subscriber callbacks are not uniformly shaped">
        The doc&apos;s example destructures <code>textMessageBuffer</code>,{" "}
        <code>toolCallName</code>, and <code>agent</code> straight out of the
        callback arguments, which suggests every callback flattens its payload.
        Several do not — <code>onToolCallStartEvent</code>,{" "}
        <code>onRunErrorEvent</code>, and <code>onToolCallResultEvent</code> hand
        back only a raw <code>event</code> object. Destructuring the wrong shape
        is a type error, which is how the difference surfaces.
      </Callout>

      <Panel title="Event coverage">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Category</th>
                <th className="pb-2 font-medium">Callbacks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {EVENTS.map(([cat, cbs]) => (
                <tr key={cat} className="align-top">
                  <td className="py-2 pr-4 font-medium text-slate-800 dark:text-slate-100">
                    {cat}
                  </td>
                  <td className="py-2 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {cbs}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="The proxy pattern">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The browser never opens this stream against the Python process.
          CopilotKit discovers agents through the runtime and gives each one a
          proxy implementing the same <code>AbstractAgent</code> interface the
          real agent does. The runtime resolves the agent, executes it, and
          re-encodes its events as SSE — so the frontend contract stays identical
          no matter which framework is behind it.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          That is why <code>useAgent({"{ agentId: 'weather_agent' }"})</code>{" "}
          works on this page without the browser knowing anything about port
          8000.
        </p>
      </Panel>

      <Panel
        title="The agent emitting the events"
        description="No event code in it — to_ag_ui() derives the stream from an ordinary run."
      >
        <SourceCode file="backend/agents/weather_agent.py" region="agent" />
      </Panel>
    </>
  );
}
