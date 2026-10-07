"use client";

import { DemoFrame } from "@/components/demo-frame";

import SubagentsDemo from "../demo";

/**
 * The demo bundle's page, mounted as published (../demo.tsx).
 *
 * It brings its own `<CopilotKit runtimeUrl="/api/copilotkit" agent="subagents">`,
 * so it runs on this repo's main runtime route, where `subagents` is
 * registered. Since the provider is nested, `lib/inspector.ts` turns the root
 * Inspector off on this route.
 *
 * The wrapper makes the layout's `h-screen` fill the frame instead of the
 * window.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/multi-agent/subagents" subtitle="agent: subagents · supervisor + 3 sub-agents">
      <div className="h-full [&_.h-screen]:h-full">
        <SubagentsDemo />
      </div>
    </DemoFrame>
  );
}
