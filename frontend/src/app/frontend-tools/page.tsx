import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/frontend-tools" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Tools the agent calls that execute in the user&apos;s browser rather
          than in the Python process. The handler runs client-side, so it can
          touch React state and browser APIs, then returns a string the model
          reads as the tool result.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The round trip is worth watching: the agent decides to call{" "}
          <code>sayHello</code>, the run pauses, your browser runs the handler,
          the return string travels back over AG-UI, and the agent continues with
          it in context — which is why it confirms the greeting afterwards.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Say hello to Damien"]}
            expect="A browser alert appears saying 'Hello, Damien!', and after you dismiss it the agent confirms it said hello."
            fail="The agent replies in text without an alert — the tool was not forwarded, or the route was not mounted when you sent the message."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Nothing to declare on the Python side">
        Because Pydantic AI has native AG-UI support, frontend tools are
        forwarded to the agent in the run input automatically. There is no
        Python-side counterpart to write, which is why this route adds nothing to{" "}
        <code>backend/</code> and registers the tool on the page that uses it.
      </Callout>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/frontend-tools/demo-chat/page.tsx" />
      </Panel>

      <Panel title="The agent it calls into">
        <SourceCode file="backend/agents/my_agent.py" region="agent" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Two lines, no tools. Every tool this route exercises is contributed by
          the browser.
        </p>
      </Panel>
    </>
  );
}
