import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const VARIANTS = `// Without parameters — the agent passes whatever it likes, and you type the
// render props inline.
useComponent({
  name: "showGreeting",
  render: ({ message }: { message: string }) => (
    <div className="rounded border p-3 bg-blue-50">
      <p>{message}</p>
    </div>
  ),
});

// Scoped to one agent — only that agent is offered the component.
useComponent({
  name: "renderProfile",
  parameters: z.object({ userId: z.string() }),
  render: ProfileCard,
  agentId: "support-agent",
});`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/your-components/display-only" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The simplest form of generative UI: you register a React component
          under a name, the agent decides when to show it, and CopilotKit renders
          it in the chat with the tool arguments spread in as props. No handler,
          no user interaction, no result sent back.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Under the hood <code>useComponent</code> wraps{" "}
          <code>useFrontendTool</code> — it registers a tool with a{" "}
          <code>render</code> and no <code>handler</code>. The Zod schema does
          double duty: it is the contract the model fills in, and the prop types
          of your component via <code>z.infer</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Show the weather card for Tokyo: 77 degrees, clear"]}
            expect="A bordered weather card renders inline in the chat with the city, temperature, and condition the agent passed."
            fail="The agent answers in plain text with no card — it did not call the tool, so check the component name and description."
          />
        </div>
      </Panel>

      <Callout tone="info" title="No backend change is needed for this">
        Frontend tools are forwarded to the agent in the AG-UI run input, so the
        model can call <code>showWeather</code> even though{" "}
        <code>backend/agents/my_agent.py</code> never declares it — that agent is
        two lines long and has no tools at all. This is the same mechanism the
        Frontend Tools page relies on.
      </Callout>

      <Panel
        title="Source"
        description="Read from this repo — the file the demo route runs."
      >
        <SourceCode file="frontend/src/app/generative-ui/your-components/display-only/demo-chat/page.tsx" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          One difference from the doc: <code>useComponent</code> takes a
          dependency array as its second argument in 1.66.2. The doc calls it
          with one argument, which re-registers the component on every render.
        </p>
      </Panel>

      <Panel
        title="The two variants the doc also shows"
        description="Not implemented here — the first drops type inference, the second needs a second agent to scope to."
      >
        <CodeBlock
          code={VARIANTS}
          language="tsx"
          filename="useComponent — no parameters, and agent scoping"
        />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          The &ldquo;without parameters&rdquo; form compiles but loses the link
          between schema and props: the shipped signature infers render props
          from <code>parameters</code>, so dropping it makes them{" "}
          <code>undefined</code>-shaped rather than the object the example
          destructures.
        </p>
      </Panel>

      <Panel title="How this differs from Tool Rendering">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>useRenderTool</code> attaches UI to a tool that already exists
          and does real work — the agent calls <code>get_weather</code>, it runs
          in the Python process, and you decide how the call is displayed.{" "}
          <code>useComponent</code> creates a tool whose <em>only</em> purpose is
          to render; there is no server-side work behind it. Use the first to
          visualise something the agent did, the second to let the agent show you
          something.
        </p>
      </Panel>
    </>
  );
}
