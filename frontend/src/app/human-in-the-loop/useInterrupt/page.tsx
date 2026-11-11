import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/human-in-the-loop/useInterrupt";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/useInterrupt" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A run that stops mid-task and waits for the user. For Pydantic AI the
          page says the pause is built from a frontend tool,{" "}
          <code>schedule_meeting</code>, whose handler returns a Promise that
          resolves only when the user picks a time; the agent is prompted to
          call it. It also documents <code>useInterrupt</code>&apos;s standard
          AG-UI flow (<code>RUN_FINISHED</code> with an interrupt outcome), its
          legacy flow, and <code>resolve</code> / <code>cancel</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Book a 30-minute call with Alex about the roadmap."]}
            expect={
              <>
                <strong>No picker.</strong> The agent is told to call{" "}
                <code>schedule_meeting</code>, but nothing registers it, so the
                model either answers in text or reports it cannot schedule. The
                Approve / Cancel card never appears: the Pydantic AI backend
                emits no interrupt.
              </>
            }
            fail="A run error from the backend (e.g. the model id), or a picker appearing — that would mean something registered schedule_meeting."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Broken as published — the frontend half is missing">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The page&apos;s frontend snippet (&ldquo;
            <code>useFrontendTool</code> with a Promise-resolving
            handler&rdquo;) is not rendered for pydantic-ai: the page source
            reads <code>snippet skipped: region &apos;frontend-promise-handler&apos; missing</code>.
            There is no Code tab either. It is not written here.
          </li>
          <li>
            The backend block prints no imports; the three it needs are added
            above its region. Model <code>gpt-6-luna</code>, as published.
          </li>
          <li>
            The Approve / Cancel and multi-interrupt snippets are generic{" "}
            <code>useInterrupt</code> examples. The first is mounted (it never
            fires against this agent); the second is a bare hook call,
            type-checked only.
          </li>
        </ul>
      </Callout>

      <Panel title="The agent — the page's backend block">
        <SourceCodeGroup files={[{ file: "backend/agents/interrupt_agent.py" }]} />
      </Panel>

      <Panel title="The page's useInterrupt snippets">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/approval-interrupt.tsx` },
            { file: `${DIR}/_doc/multi-interrupt.tsx` },
            { file: `${DIR}/demo-chat/page.tsx` },
          ]}
        />
      </Panel>
    </>
  );
}
