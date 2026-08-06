"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The two modes the doc describes, side by side.
 *
 * Router mode: no agent is named, so the runtime resolves the run to its
 * `default` agent. Agent lock mode: an id is named, and every run goes to that
 * agent whatever the conversation is about.
 *
 * The doc frames the choice on the `<CopilotKit>` provider — `agent` present or
 * absent. Mounting two providers on one page is not workable, so the switch here
 * is the same choice one level down: `<CopilotChat>` with or without `agentId`,
 * under a provider that names no agent (router mode, app-wide).
 */

const LOCKABLE = [
  { id: "my_agent", blurb: "Quickstart agent · no tools, instructed to 'Be fun!'" },
  { id: "weather_agent", blurb: "get_weather tool" },
  { id: "language_agent", blurb: "StateDeps state · answers in the stored language" },
] as const;

type LockId = (typeof LOCKABLE)[number]["id"];
type Mode = "router" | "lock";

export default function Page() {
  const [mode, setMode] = useState<Mode>("router");
  const [lockId, setLockId] = useState<LockId>("weather_agent");

  const active = LOCKABLE.find((a) => a.id === lockId)!;

  return (
    <DemoFrame
      parentPath="/multi-agent-flows"
      subtitle={mode === "router" ? "router mode · no agent named" : `locked to ${lockId}`}
    >
      <div className="flex h-full flex-col">
        <div className="shrink-0 space-y-3 border-b border-slate-200 p-3 dark:border-slate-800">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("router")}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === "router"
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              Router mode
            </button>
            <button
              type="button"
              onClick={() => setMode("lock")}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === "lock"
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              Agent lock mode
            </button>
          </div>

          {mode === "lock" ? (
            <div className="flex flex-wrap items-center gap-2">
              {LOCKABLE.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setLockId(a.id)}
                  className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
                    lockId === a.id
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
                  }`}
                >
                  {a.id}
                </button>
              ))}
              <span className="text-xs text-slate-500">{active.blurb}</span>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              No <code>agentId</code> passed — the runtime resolves the run to
              its <code>default</code> agent, which this repo aliases to{" "}
              <code>my_agent</code>. Ask for the weather here and you get prose,
              not a tool call.
            </p>
          )}
        </div>

        <div className="min-h-0 flex-1">
          {mode === "router" ? (
            <CopilotChat
              key="router"
              labels={{
                welcomeMessageText:
                  "Router mode — no agent named. Try \"What's the weather in Tokyo?\" and compare against agent lock mode.",
              }}
            />
          ) : (
            <CopilotChat
              key={lockId}
              agentId={lockId}
              labels={{
                welcomeMessageText: `Locked to ${lockId}. Every run in this thread goes here.`,
              }}
            />
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
