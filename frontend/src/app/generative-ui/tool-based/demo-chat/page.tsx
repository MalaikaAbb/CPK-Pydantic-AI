"use client";

import { DemoFrame } from "@/components/demo-frame";

import ControlledGenUiDemo from "../demo";

/**
 * The Components as Tools demo bundle's page, mounted as published (../demo.tsx,
 * suggestions commented out).
 *
 * It brings its own `<CopilotKit runtimeUrl="/api/copilotkit"
 * agent="gen-ui-tool-based">`, so it runs on this repo's main runtime route,
 * where `gen-ui-tool-based` is registered. Since the provider is nested,
 * `lib/inspector.ts` turns the root Inspector off on this route.
 *
 * The wrapper makes the page's `h-screen` fill the frame instead of the window.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/tool-based"
      subtitle="agent: gen-ui-tool-based · useComponent render_bar_chart / render_pie_chart"
    >
      <div className="h-full [&_.h-screen]:h-full">
        <ControlledGenUiDemo />
      </div>
    </DemoFrame>
  );
}
