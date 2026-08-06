import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const RENDER_VARIANT = `// The doc's second sample renders state into the chat instead of your own UI,
// by passing a render function to useAgent.
useAgent({
  agentId: "my_agent",
  render: ({ state }) => {
    if (!state.language) return null;
    return <div>Language: {state.language}</div>;
  },
});`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/in-app-agent-read" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Shared state in Pydantic AI is the <code>StateDeps</code> object. You
          declare a Pydantic model, build the agent with{" "}
          <code>deps_type=StateDeps[AgentState]</code>, and AG-UI carries that
          object in on every run — CopilotKit surfaces it as{" "}
          <code>agent.state</code>, reactive, so any component re-renders when it
          changes.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          What makes this observable rather than theoretical is the{" "}
          <code>@agent.instructions()</code> decorator: the instructions are
          generated per run and interpolate{" "}
          <code>ctx.deps.state.language</code>, so the state does not merely sit
          there — it changes what the agent says.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Switch to Spanish", "Change it back to English"]}
            expect="The Language line updates and the raw state block shows the new value; the agent also starts replying in that language."
            fail="The agent acknowledges in text but the panel stays empty — state is not being written back over AG-UI."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Two things the doc shows that do not exist">
        <p>
          <code>useAgent({"{ agentId, initialState }"})</code> — there is no{" "}
          <code>initialState</code> prop on <code>useAgent</code> in 1.66.2, so
          the value starts undefined until the agent first writes it. The Python
          side already supplies a default via{" "}
          <code>StateDeps(AgentState())</code>, where{" "}
          <code>language</code> is <code>&quot;english&quot;</code>.
        </p>
        <p className="mt-2">
          The &ldquo;render in the chat&rdquo; section passes a{" "}
          <code>render</code> function to <code>useAgent</code>. That prop is
          likewise absent from the shipped type, so it is shown below rather than
          implemented.
        </p>
      </Callout>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/shared-state/in-app-agent-read/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The agent and its state model"
        description="Both Shared State doc pages ship this same agent.py."
      >
        <SourceCode file="backend/agents/language_agent.py" region="agent" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          The only edit is the model id: the doc builds{" "}
          <code>Agent(&quot;openai:gpt-5.4-mini&quot;, …)</code>, which OpenAI
          does not serve.
        </p>
      </Panel>

      <Panel
        title="The render variant the doc also shows"
        description="Not implemented — the render prop is not on useAgent in 1.66.2."
      >
        <CodeBlock
          code={RENDER_VARIANT}
          language="tsx"
          filename="useAgent with a render function"
        />
      </Panel>
    </>
  );
}
