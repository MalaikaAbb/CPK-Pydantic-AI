import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop" />

      <Panel title="What it covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The Human-in-the-Loop overview: why an agent should be able to stop
          and ask a person for input or approval mid-task, and where to go
          next. It has a video and an infographic but no code, and its one
          link points to the flow-based Pydantic AI page.
        </p>
      </Panel>

      <Callout tone="info" title="Where this runs in the harness">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <Link className="underline" href="/human-in-the-loop/agent">
              Pydantic AI Agents
            </Link>{" "}
            — the page this overview links to (an approval step built on a
            frontend tool).
          </li>
          <li>
            <Link className="underline" href="/human-in-the-loop/useInterrupt">
              Pausing the Agent for Input
            </Link>{" "}
            and{" "}
            <Link className="underline" href="/human-in-the-loop/headless">
              Headless Interrupts
            </Link>{" "}
            — the other two pages in this sidebar group.
          </li>
        </ul>
      </Callout>

      <Callout tone="warn" title="Doc oddities">
        The overview&apos;s card links to <code>/human-in-the-loop/agent</code>{" "}
        without the <code>/pydantic-ai</code> prefix every other link on the
        site carries. The page source also keeps a commented-out
        &ldquo;TODO: Add Example&rdquo; callout pointing at a LangGraph
        tutorial.
      </Callout>
    </>
  );
}
