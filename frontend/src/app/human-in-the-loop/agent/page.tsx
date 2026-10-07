import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/agent" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page&apos;s pattern is an essay draft the user approves before
          the agent continues. The browser registers a <code>write_essay</code>{" "}
          tool whose UI waits for <em>Approve Draft</em> or{" "}
          <em>Try Again</em>, and the reply becomes the tool result. Both
          halves are built here as published. That is why the route is
          broken: the published halves cannot run together.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Write an essay about the benefits of AI."]}
            expect={
              <>
                <strong>An error is expected</strong>, before the model says
                anything. The browser sends its <code>write_essay</code> as a
                frontend tool, and the agent already has a backend tool with
                that name. Pydantic AI refuses the run:{" "}
                <code>
                  The AG-UI frontend tools defines a tool whose name conflicts
                  with existing tool from the agent: &apos;write_essay&apos;
                </code>
                . Observed in the browser on 2026-10-07 as a{" "}
                <code>RUN_ERROR</code> event, and earlier by posting the same run
                input straight to the backend.
              </>
            }
            fail={
              <>
                A draft card with buttons. That would mean the browser did not
                send its tool, so check the Inspector&apos;s tool list. A plain
                &ldquo;Essay draft … has been generated&rdquo; reply means only
                the backend tool ran.
              </>
            }
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Why it cannot work as published">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>One name, two tools.</strong> The frontend registers{" "}
            <code>write_essay</code> and the backend agent defines{" "}
            <code>write_essay</code> with <code>@agent.tool_plain</code>.
            Pydantic AI rejects a frontend tool whose name is already taken.
          </li>
          <li>
            <strong>v1 options on a v2 hook.</strong>{" "}
            <code>renderAndWaitForResponse</code> and{" "}
            <code>available: &quot;frontend&quot;</code> come from v1&apos;s{" "}
            <code>useCopilotAction</code>. v2&apos;s <code>useFrontendTool</code>{" "}
            has no wait-for-response render; that job belongs to{" "}
            <code>useHumanInTheLoop</code>. Even with the name clash removed,
            the draft card would never render. The type errors are suppressed
            with <code>@ts-expect-error</code>, not fixed.
          </li>
          <li>
            <strong>Two different arguments.</strong> The frontend tool takes{" "}
            <code>draft</code>; the backend tool takes <code>topic</code>.
          </li>
          <li>
            <strong>The prose describes another framework.</strong> It talks
            about a state that &ldquo;inherits from{" "}
            <code>CopilotKitState</code>&rdquo; and a <code>writeEssay</code>{" "}
            action. Neither appears in the code.
          </li>
        </ul>
      </Callout>

      <Panel title="The frontend tool" description="The page shows no imports, and it uses a <Markdown> it never defines. Both are written in above the verbatim region.">
        <SourceCode file="frontend/src/app/human-in-the-loop/agent/essay-tool.tsx" />
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/human-in-the-loop/agent/demo-chat/page.tsx" />
      </Panel>

      <Panel title="The agent" description="The page's agent.py. Its run_agent and Starlette app are what backend/main.py does for every agent.">
        <SourceCode file="backend/agents/hitl_agent.py" region="agent" />
      </Panel>

      <Callout tone="info" title="Model id">
        The page builds the agent with <code>openai:gpt-5.4-mini</code>, which
        OpenAI does not serve. As on the other routes that print it, this repo
        uses <code>OPENAI_MODEL</code> (default <code>openai:gpt-4.1-mini</code>).
        It makes no difference here, because the run fails before any model is
        called.
      </Callout>
    </>
  );
}
