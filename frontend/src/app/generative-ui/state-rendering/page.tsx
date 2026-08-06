import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const BROKEN_BLOCK = `// ...

// Define the state of the agent, should match the state of your Pydantic AI Agent.
type AgentState = {
  searches: {
    query: string;
    done: boolean;
  }[];
};

function YourMainContent() {
  // ...

  // [!code highlight:13]
  // styles omitted for brevity
  useAgent({
    agentId: "my_agent",
    render: ({ state }) => (
      <div>
        {state.searches?.map((search, index) => (
          <div key={index}>
            {search.done ? "✅" : "❌"} {search.query}{search.done ? "" : "..."}
          </div>
        ))}
      </div>
    ),
  });

  // ...

  return <div>...</div>;
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/state-rendering" />

      <Callout tone="warn" title="Partial — the doc page has no Python on it">
        <p>
          This page ships two code blocks. The second is the React page and is
          implemented in full below. The first is labelled{" "}
          <code>agent.py</code> but contains the <em>same</em> TypeScript/React
          content — a <code>type AgentState</code> and a{" "}
          <code>function YourMainContent()</code> calling <code>useAgent</code>.
        </p>
        <p className="mt-2">
          There is therefore nothing to transcribe: no state model, no tool that
          writes <code>searches</code>, no instruction telling the agent when to
          write it. Writing that agent would mean inventing the schema, so this
          repo does not. The route is marked <strong>Partial</strong> and the
          demo runs against <code>my_agent</code>, which has no state — the list
          renders correctly and stays empty.
        </p>
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Tool rendering shows you a tool <em>call</em>. State rendering shows
          the agent&apos;s accumulated <em>state</em> — a list that grows across
          turns rather than a single event.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          In Pydantic AI that state is the <code>StateDeps</code> object AG-UI
          carries on every run, surfaced to the frontend as{" "}
          <code>agent.state</code> and reactive, so any component reading it
          re-renders when it changes. The{" "}
          <a
            href="/shared-state/in-app-agent-read"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Shared State route
          </a>{" "}
          exercises exactly that mechanism against an agent that does define a
          state model — it is the working counterpart to this page.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Add a search for the tallest mountains"]}
            expect="The agent replies normally and the Searches list stays empty — which is the documented-but-unimplementable outcome, not a bug in the wiring."
            fail="The raw agent.state pane errors, or the chat itself fails — that would be a real problem."
          />
        </div>
      </Panel>

      <Panel
        title="The doc's `agent.py` block, as published"
        description="Reproduced so the discrepancy is checkable rather than asserted."
      >
        <CodeBlock
          code={BROKEN_BLOCK}
          language="tsx"
          filename="agent.py — as shown on the doc page"
        />
      </Panel>

      <Panel title="The placeholder that stands in for it">
        <SourceCode file="backend/agents/search_agent.py" />
      </Panel>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/generative-ui/state-rendering/demo-chat/page.tsx" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          The doc&apos;s first block also passes a <code>render</code> function
          to <code>useAgent</code>. That prop is absent from the shipped type in
          1.66.2, so the demo uses the second block&apos;s form — destructure{" "}
          <code>agent</code> and read <code>agent.state</code> in your own JSX.
        </p>
      </Panel>
    </>
  );
}
