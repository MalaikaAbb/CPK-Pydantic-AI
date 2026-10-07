"use client";

import { CopilotSidebar } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The Quickstart's own `app/page.tsx`: a `CopilotSidebar` beside your app.
 *
 * It names no agent. The Quickstart's `Providers` (../providers.tsx, mounted by
 * ./layout.tsx) sets `agent="my_agent"` once for everything inside it, exactly
 * as the doc does. That id is the key the agent has in the runtime route's
 * `agents: { … }` object, which matches its mount path in `backend/main.py`.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/quickstart" subtitle="CopilotSidebar · agent set on the Quickstart provider">
      <main className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Your App
        </h1>
        <p className="max-w-md text-sm text-slate-500">
          The sidebar is docked at the right edge of the window. Ask it
          something to confirm the whole stack — browser, runtime, Python agent,
          model — is connected.
        </p>
        <CopilotSidebar />
      </main>
    </DemoFrame>
  );
}
