"use client";

import { DemoFrame } from "@/components/demo-frame";

import A2UIFixedSchemaDemo from "../demo";

/**
 * The demo bundle's page, mounted as published (../demo.tsx).
 *
 * It brings its own `<CopilotKit>` against `/api/copilotkit-a2ui-fixed-schema`
 * with `a2ui={{ catalog }}`. A2UI is configured per provider, and this runtime
 * sets `injectA2UITool: false` because the agent owns `display_flight`. Since
 * the provider is nested, `lib/inspector.ts` turns the root Inspector off on
 * this route.
 *
 * The bundle's page fills the window with `h-screen`. The wrapper below makes
 * those elements fill the frame instead, so the chat input is not pushed below
 * the fold. The demo's own markup is untouched.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/a2ui/fixed-schema"
      subtitle="agent: a2ui-fixed-schema · /api/copilotkit-a2ui-fixed-schema"
    >
      <div className="h-full [&_.h-screen]:h-full">
        <A2UIFixedSchemaDemo />
      </div>
    </DemoFrame>
  );
}
