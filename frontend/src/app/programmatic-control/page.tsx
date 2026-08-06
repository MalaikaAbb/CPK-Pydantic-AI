import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const RENDER_TOOL_CALLS = `// The doc also covers rendering tool calls by hand, for when you have
// replaced the message list too. Two pieces:

// 1 — define a renderer and register it on the provider.
import { defineToolCallRenderer } from "@copilotkit/react-core/v2";

export const weatherToolRender = defineToolCallRenderer({
  name: "get_weather",
  render: ({ args, status }) => <WeatherCard location={args.location} status={status} />,
});

<CopilotKit runtimeUrl="/api/copilotkit" renderToolCalls={[weatherToolRender]}>

// 2 — draw them yourself with useRenderToolCall, pairing each call with its
//     result message.
const renderToolCall = useRenderToolCall();

message.toolCalls?.map((toolCall) => {
  const toolMessage = agent.messages.find(
    (m) => m.role === "tool" && m.toolCallId === toolCall.id,
  );
  return <div key={toolCall.id}>{renderToolCall({ toolCall, toolMessage })}</div>;
});`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/programmatic-control" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>useAgent</code> hands you the agent instance directly — its
          messages, shared state, thread id, and whether it is currently running.
          Combined with <code>copilotkit.runAgent()</code> you can drive a
          conversation from a button, a form, or a background trigger with no
          chat UI in the picture.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The demo is the doc&apos;s dashboard sample with its other snippets
          folded in: reading state, writing it with <code>setState</code>,
          subscribing to lifecycle events, running, and stopping.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Summarize the latest sales data",
              "Write a 500-word essay about ducks",
            ]}
            expect="Status flips to Running, the transcript grows as tokens arrive, the message count climbs, and the subscriber counters tick. On the long prompt, Stop halts it mid-stream."
            fail="Nothing happens on Run — the agent id registered in the runtime does not match the one passed to useAgent."
          />
        </div>
      </Panel>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/programmatic-control/demo-chat/page.tsx" />
      </Panel>

      <Panel title="runAgent vs. agent.runAgent">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>copilotkit.runAgent({"{ agent }"})</code> is the orchestrated
          path: it executes frontend tools, handles the follow-up runs those
          tools trigger, and routes errors through the subscriber system.{" "}
          <code>agent.runAgent()</code> is the low-level call — it sends the
          request but does neither, so a browser-executed tool would never fire.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>agentId</code> is passed explicitly on every route in this repo.
          The runtime serves several agents, so relying on an implicit default
          would make it ambiguous which one a panel is showing.
        </p>
      </Panel>

      <Callout tone="warn" title="Two things the doc's samples assume">
        <p>
          <strong>
            <code>agent.state</code> exists on first render.
          </strong>{" "}
          The doc reads <code>agent.state.user_name</code> and{" "}
          <code>agent.state.user_theme</code> directly. It is undefined until the
          agent first writes state, so the demo reads it optionally.
        </p>
        <p className="mt-2">
          <strong>
            <code>AgentSubscriber</code> is imported from{" "}
            <code>@ag-ui/client</code>.
          </strong>{" "}
          That works, but the demo passes the subscriber object inline to{" "}
          <code>agent.subscribe()</code> and lets it be inferred, so no type-only
          import is needed.
        </p>
      </Callout>

      <Panel
        title="Rendering tool calls in your own UI"
        description="Also on the doc page. Shown rather than implemented — /generative-ui/tool-rendering covers the same ground with a live agent."
      >
        <CodeBlock
          code={RENDER_TOOL_CALLS}
          language="tsx"
          filename="defineToolCallRenderer + useRenderToolCall"
        />
      </Panel>
    </>
  );
}
