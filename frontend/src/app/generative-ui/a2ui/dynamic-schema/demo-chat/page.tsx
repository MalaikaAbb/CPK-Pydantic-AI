"use client";

import { DemoFrame } from "@/components/demo-frame";

import DeclarativeGenUIDemo from "../demo";

/**
 * The demo bundle's page, mounted as published (../demo.tsx).
 *
 * It brings its own `<CopilotKit>` against `/api/copilotkit-declarative-gen-ui`
 * with `a2ui={{ catalog: myCatalog }}`. Under the prose's default path that one
 * prop enables A2UI and injects `generate_a2ui`. Since the provider is nested,
 * `lib/inspector.ts` turns the root Inspector off on this route.
 *
 * The wrapper makes the page's `h-screen` fill the frame instead of the window.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/a2ui/dynamic-schema"
      subtitle="agent: declarative-gen-ui · /api/copilotkit-declarative-gen-ui"
    >
      <div className="h-full [&_.h-screen]:h-full">
        <DeclarativeGenUIDemo />
      </div>
    </DemoFrame>
  );
}
