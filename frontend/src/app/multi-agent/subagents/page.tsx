import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/multi-agent/subagents";

export default function Page() {
  return (
    <>
      <RouteHeader path="/multi-agent/subagents" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A supervisor agent that delegates to three narrow Pydantic AI
          sub-agents (research, writing, critique) by calling them as tools.
          Each delegation is written into a <code>delegations</code> list in
          shared state, which the page renders as a live log. Each tool call
          also gets an inline card in the chat through{" "}
          <code>useRenderTool</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Produce a short blog post about the benefits of cold exposure training. Research first, then write, then critique.",
            ]}
            expect={
              <>
                Three cards appear in the chat in order (Researcher, Writer,
                Critic), each moving from <em>starting</em> to{" "}
                <em>running</em> to <em>done</em> with its task and result.
                While the supervisor runs, a banner above the input names the
                active sub-agent. <strong>The left-hand log is expected to stay
                at <em>0 calls</em></strong> (see below).
              </>
            }
            fail={
              <>
                No cards, or an error on the first message. Either the backend
                is down, or <code>subagents</code> is missing from the runtime
                route. If the log <em>does</em> fill in, the adapter now syncs
                state: update this route&apos;s status.
              </>
            }
          />
        </div>
      </Panel>

      <Callout tone="warn" title="The delegation log has no way to fill in">
        <p>
          The delegation tools only mutate <code>ctx.deps.state</code>. The
          agent&apos;s comments say Pydantic AI&apos;s AG-UI bridge
          &ldquo;syncs those back to the frontend at end-of-turn&rdquo;. It
          does not. In pydantic-ai-slim 1.107, <code>AGUIEventStream</code>{" "}
          emits <code>RunStarted</code>, text and tool events, and{" "}
          <code>RunFinished</code>, plus any AG-UI events a tool returns
          explicitly in <code>ToolReturn</code> metadata. It never emits a{" "}
          <code>STATE_SNAPSHOT</code> on its own, so <code>agent.state</code>{" "}
          never gains <code>delegations</code>.
        </p>
        <p className="mt-2">
          The module docstring in the bundle describes returning a{" "}
          <code>StateSnapshotEvent</code> after each step, which would work, but
          no such code is in the file. Observed against the backend directly:
          a full run (research, writing, critique) streams three tool calls and
          their results, then <code>RUN_FINISHED</code>, with no{" "}
          <code>STATE_SNAPSHOT</code> or <code>STATE_DELTA</code> at all.
        </p>
      </Callout>

      <Panel title="The agent — supervisor, sub-agents, delegation tools">
        <SourceCodeGroup files={[{ file: "backend/agents/subagents.py" }]} />
      </Panel>

      <Panel title="The frontend">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/demo.tsx` },
            { file: `${DIR}/delegation-log.tsx` },
            { file: `${DIR}/demo-layout.tsx` },
            { file: `${DIR}/subagent-activity-card.tsx` },
            { file: `${DIR}/supervisor-activity-banner.tsx` },
            { file: `${DIR}/active-subagent.ts` },
            { file: `${DIR}/suggestions.ts` },
          ]}
        />
      </Panel>

      <Callout tone="info" title="Where the code comes from">
        <p>
          All of it is the demo bundle&apos;s, verbatim. The page prose shows
          the agent (identical, apart from the bundle&apos;s{" "}
          <code>__all__</code>) and part of <code>delegation-log.tsx</code>. The
          bundle&apos;s <code>page.tsx</code> imports four more files the page
          never shows: <code>demo-layout</code>,{" "}
          <code>subagent-activity-card</code>, <code>active-subagent</code>, and{" "}
          <code>supervisor-activity-banner</code>.
        </p>
        <p className="mt-2">
          The bundle&apos;s runtime route registers <code>subagents</code> at{" "}
          <code>{"${AGENT_URL}/subagents/"}</code>. This repo adds the same
          entry to its own <code>/api/copilotkit</code> route instead of copying
          the bundle&apos;s whole multi-agent route.
        </p>
      </Callout>
    </>
  );
}
