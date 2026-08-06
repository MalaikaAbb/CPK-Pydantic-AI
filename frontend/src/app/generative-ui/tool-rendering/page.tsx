import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/tool-rendering" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A tool call is an event in the stream, not just a function result — so
          you can render it. <code>useRenderTool</code> attaches a component to
          one tool by name, and <code>useDefaultRenderTool</code> registers a
          wildcard that catches everything without a dedicated renderer.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The renderer name must equal the Python function&apos;s name exactly —{" "}
          <code>get_weather</code>, the name{" "}
          <code>@agent.tool_plain</code> registers it under. That is the most
          common reason a tool runs but its UI never appears.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Note the renderer sees the call, not the return value, at every stage:
          the first branch fires while the arguments are still streaming, which
          is what makes &ldquo;Calling weather API…&rdquo; appear before the tool
          has run at all.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["What's the weather in Tokyo?"]}
            expect="The reply is preceded by 'Calling weather API...' which becomes 'Called the weather API for Tokyo.' once the call completes."
            fail="The tool call renders as raw JSON or not at all — the renderer name and the Python function name disagree."
          />
        </div>
      </Panel>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/generative-ui/tool-rendering/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The agent and its tool"
        description="An ordinary Pydantic AI tool_plain — nothing about it is CopilotKit-specific."
      >
        <SourceCode file="backend/agents/weather_agent.py" region="agent" />
      </Panel>

      <Callout tone="warn" title="Two departures from the doc's samples">
        <p>
          <strong>The model id is not real.</strong> The doc&apos;s{" "}
          <code>agent.py</code> builds{" "}
          <code>Agent(&quot;openai:gpt-5.4-mini&quot;)</code>. OpenAI does not
          serve that id, so the agent here uses the Quickstart&apos;s{" "}
          <code>openai:gpt-4.1-mini</code>, overridable with{" "}
          <code>OPENAI_MODEL</code>.
        </p>
        <p className="mt-2">
          <strong>
            <code>useRenderTool</code> needs a <code>parameters</code> schema.
          </strong>{" "}
          The doc&apos;s named renderer omits it and reads{" "}
          <code>args.location</code>. In 1.66.2 the named overload requires a
          schema, and the render prop carrying the arguments is called{" "}
          <code>parameters</code>, not <code>args</code>.
        </p>
      </Callout>
    </>
  );
}
