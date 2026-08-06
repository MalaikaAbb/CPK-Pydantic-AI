"use client";

import { CopilotChat, useAgent, useCopilotKit } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * Writing into the agent's state from the app — both variants the doc shows.
 *
 * Basic: `agent.setState` updates the value the agent sees on its *next* run.
 * The panel changes immediately, but the agent does not react until you say
 * something.
 *
 * Advanced: the same write, followed by a hint message and an explicit
 * `copilotkit.runAgent` — so the agent reacts to the toggle straight away,
 * with no user turn.
 *
 * Both buttons are here rather than one, because the difference between them
 * only shows up by comparison.
 */

type AgentState = {
  language: "english" | "spanish";
};

export default function Page() {
  const { agent } = useAgent({ agentId: "language_agent" });
  const { copilotkit } = useCopilotKit();
  const state = agent.state as AgentState | undefined;

  const nextLanguage = () =>
    state?.language === "english" ? "spanish" : "english";

  // The doc's basic sample.
  const toggleLanguage = () => {
    agent.setState({ language: nextLanguage() });
  };

  // The doc's advanced sample: write, hint, re-run.
  const toggleLanguageAndRun = async () => {
    const newLanguage = nextLanguage();
    agent.setState({ language: newLanguage });

    agent.addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: `the language has been updated to ${newLanguage}`,
    });
    await copilotkit.runAgent({ agent });
  };

  return (
    <DemoFrame
      parentPath="/shared-state/in-app-agent-write"
      subtitle="agent.setState · language_agent"
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

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white"
            >
              Toggle Language
            </button>
            <button
              type="button"
              onClick={() => void toggleLanguageAndRun()}
              disabled={agent.isRunning}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 disabled:opacity-40 dark:border-slate-600 dark:text-slate-200"
            >
              Toggle &amp; re-run
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            <strong>Toggle Language</strong> writes state only — the agent picks
            it up on its next turn. <strong>Toggle &amp; re-run</strong> also
            sends a hint message and runs the agent, so it responds immediately.
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
                "Toggle the language on the left, then say anything — I should reply in that language.",
            }}
          />
        </div>
      </div>
    </DemoFrame>
  );
}
