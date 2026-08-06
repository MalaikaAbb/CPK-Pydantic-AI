import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/in-app-agent-write" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The other direction: the app writing into the agent&apos;s state.{" "}
          <code>agent.setState</code> updates the value and re-renders anything
          reading it, and the object travels to Python on the next run, where{" "}
          <code>@agent.instructions()</code> reads it back out of{" "}
          <code>ctx.deps.state</code>.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The doc shows two variants and the demo implements both, because the
          distinction is the whole point. <code>setState</code> alone is passive
          — the agent sees the new value on its <em>next</em> turn, whenever that
          happens. The advanced variant adds a hint message and calls{" "}
          <code>copilotkit.runAgent</code>, so a UI event drives the agent
          without the user typing anything.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Press Toggle Language, then say: tell me a joke",
              "Press Toggle & re-run and watch the chat without typing",
            ]}
            expect="After Toggle Language the panel flips immediately and the agent's next reply comes back in the new language. Toggle & re-run produces a reply straight away, with no typing."
            fail="The panel changes but the agent keeps replying in the old language — the state is not reaching the run."
          />
        </div>
      </Panel>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/shared-state/in-app-agent-write/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The agent and its state model"
        description="The same agent.py the reading page ships — the two doc pages share one backend sample."
      >
        <SourceCode file="backend/agents/language_agent.py" region="agent" />
      </Panel>
    </>
  );
}
