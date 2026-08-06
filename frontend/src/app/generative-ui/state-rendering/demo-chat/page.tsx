"use client";

import { CopilotChat, useAgent } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * PARTIAL — the frontend half of the doc page, with no agent behind it.
 *
 * The rendering below is the doc's `app/page.tsx` sample: read `agent.state`,
 * map over `searches`, show a tick or a cross per entry. That part is complete
 * and reactive — the raw-state panel proves the subscription is live.
 *
 * What is missing is the other end. The doc's `agent.py` code block contains
 * React code rather than Python, so it never defines the state model or the tool
 * that writes `searches`. See `backend/agents/search_agent.py`. Rather than
 * invent one, this demo points at `my_agent`, which has no state at all — so the
 * list stays empty no matter what you ask for, and the panel says so.
 */

// Define the state of the agent, should match the state of your Pydantic AI Agent.
type AgentState = {
  searches: {
    query: string;
    done: boolean;
  }[];
};

export default function Page() {
  const { agent } = useAgent({ agentId: "my_agent" });
  const state = agent.state as AgentState | undefined;

  return (
    <DemoFrame
      parentPath="/generative-ui/state-rendering"
      subtitle="partial — no agent writes `searches`"
    >
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <div className="min-h-0 overflow-y-auto border-b border-slate-200 p-4 lg:border-b-0 lg:border-r dark:border-slate-800">
          <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
            The doc page&apos;s <code>agent.py</code> block contains React code,
            not Python — so no agent writes <code>searches</code> and this list
            stays empty. The rendering itself is complete.
          </div>

          <h2 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Searches
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {state?.searches?.length ? (
              state.searches.map((search, index) => (
                <div key={index} className="flex flex-row gap-2 text-sm">
                  <span>{search.done ? "✅" : "❌"}</span>
                  <span className="text-slate-800 dark:text-slate-100">
                    {search.query}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No searches — and there will not be any until an agent exists to
                write them.
              </p>
            )}
          </div>

          <h2 className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Raw agent.state
          </h2>
          <pre className="mt-2 max-h-56 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">
            {JSON.stringify(agent.state ?? {}, null, 2)}
          </pre>
          <p className="mt-2 text-xs text-slate-500">
            To see this pane update reactively against a real state model, use{" "}
            <a
              href="/shared-state/in-app-agent-read/demo-chat"
              className="text-[var(--accent)] underline underline-offset-4"
            >
              the Shared State demo
            </a>{" "}
            — same <code>agent.state</code> mechanism, with an agent behind it.
          </p>
        </div>

        <div className="min-h-0">
          <CopilotChat
            agentId="my_agent"
            labels={{
              welcomeMessageText:
                'Try "Add a search for the tallest mountains" — the agent will reply, but nothing writes state.',
            }}
          />
        </div>
      </div>
    </DemoFrame>
  );
}
