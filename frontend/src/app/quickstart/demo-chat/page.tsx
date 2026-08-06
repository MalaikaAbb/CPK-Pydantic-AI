"use client";

import { CopilotSidebar } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The Quickstart's own UI: a `CopilotSidebar` beside your app content.
 *
 * `agentId="my_agent"` matches the key the agent has in the runtime route's
 * `agents: { … }` object, which in turn matches its mount path in
 * `backend/main.py`. The doc sets that id once on the provider via
 * `<CopilotKit agent="my_agent">`; this harness serves three agents, so each
 * route names the one it wants instead.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/quickstart" subtitle="CopilotSidebar · my_agent">
      <main className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Your App
        </h1>
        <p className="max-w-md text-sm text-slate-500">
          The sidebar is docked at the right edge of the window. Ask it
          something to confirm the whole stack — browser, runtime, Python agent,
          model — is connected.
        </p>
      </main>

      <CopilotSidebar agentId="my_agent" />
    </DemoFrame>
  );
}
