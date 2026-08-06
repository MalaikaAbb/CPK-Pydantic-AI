"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * Agent routing across every id the runtime registers.
 *
 * The ids below are exactly the keys of the `agents: { … }` object in
 * `frontend/src/app/api/copilotkit/route.ts`, which in turn match the mount
 * paths in `backend/main.py`. Each id carries its own message list, so switching
 * starts a fresh conversation.
 */

const AGENTS = [
  { id: "default", blurb: "Alias for my_agent — what router mode resolves to" },
  { id: "my_agent", blurb: "Quickstart agent · no tools" },
  { id: "weather_agent", blurb: "get_weather tool" },
  { id: "language_agent", blurb: "StateDeps state: language" },
] as const;

type AgentId = (typeof AGENTS)[number]["id"];

export default function Page() {
  const [agentId, setAgentId] = useState<AgentId>("default");
  const active = AGENTS.find((a) => a.id === agentId)!;

  return (
    <DemoFrame parentPath="/copilot-runtime" subtitle={`routing to "${agentId}"`}>
      <div className="flex h-full flex-col">
        <div className="shrink-0 border-b border-slate-200 p-3 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {AGENTS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAgentId(a.id)}
                className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
                  agentId === a.id
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
                }`}
              >
                {a.id}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">{active.blurb}</p>
        </div>

        <div className="min-h-0 flex-1">
          <CopilotChat key={agentId} agentId={agentId} />
        </div>
      </div>
    </DemoFrame>
  );
}
