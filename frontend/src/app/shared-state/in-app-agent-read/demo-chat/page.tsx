"use client";

import { useEffect } from "react";

import { CopilotChat, useAgent } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * Reading the agent's `StateDeps` state in your own UI.
 *
 * `language_agent` is built with `deps_type=StateDeps[AgentState]`, and its
 * instructions read `ctx.deps.state.language` on every run. AG-UI carries that
 * object both ways, so `agent.state` — and this panel — follow it with no
 * message parsing on the frontend.
 *
 * Two things the doc's snippet leaves out, both load-bearing:
 *
 *  1. `useAgent({ initialState })` does not exist. In @copilotkit/react-core
 *     1.69.3 `useAgent` takes `{ agentId, threadId, runtimeAgentId, updates,
 *     throttleMs }` and nothing else, so the doc's seed value is dropped
 *     silently and `agent.state` starts `undefined`. `agent.setState` on mount
 *     is the equivalent, and it is what puts "english" on screen before the
 *     first turn — and into `RunAgentInput.state` on it.
 *
 *  2. The agent only pushes state back because `language_agent` grew a
 *     `set_language` tool that returns a `StateSnapshotEvent`. Pydantic AI's
 *     AG-UI adapter reads state in but never emits a state event, so without
 *     that tool this panel can only ever show what the app itself wrote.
 */

type AgentState = {
  language: "english" | "spanish";
};

const INITIAL_STATE: AgentState = { language: "english" };


export default function Page() {
  const { agent } = useAgent({ agentId: "language_agent" });
  const state = agent.state as AgentState | undefined;

  useEffect(() => {
    if (agent.state.language != null && Object.keys(agent.state).length > 0) return;
    agent.setState(INITIAL_STATE);
  }, [agent]);


  return (
    <DemoFrame
      parentPath="/shared-state/in-app-agent-read"
      subtitle="StateDeps state read from language_agent"
    >
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <div className="min-h-0 overflow-y-auto border-b border-slate-200 p-4 lg:border-b-0 lg:border-r dark:border-slate-800">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Your main content
          </h1>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
            Language:{" "}
            <strong className="text-[var(--accent)]">
              {state?.language ?? "—"}
            </strong>
          </p>

          <h2 className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Raw agent.state
          </h2>
          <pre className="mt-2 max-h-56 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">
            {JSON.stringify(agent.state ?? {}, null, 2)}
          </pre>
        </div>

        <div className="min-h-0">
          <CopilotChat
            agentId="language_agent"
            labels={{
              welcomeMessageText:
                'Try "Switch to Spanish" and watch the panel on the left.',
            }}
          />
        </div>
      </div>
    </DemoFrame>
  );
}

//
