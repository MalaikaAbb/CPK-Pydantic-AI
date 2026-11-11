"use client";

// Ported from the agno harness (itself from CPK-LangGraph-TS / aws-strands-ts).
// The pydantic-ai doc page is byte-identical to the agno one (diffed
// 2026-11-11). Harness glue points at this repo's Pydantic AI `genui` agent.

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";
import { appUI } from "./app-ui";

/**
 * The "After" provider: `generativeUI={{ ui: appUI }}`. Its runtime is the
 * shared one, which already matches "Runtime, after" — no A2UI option.
 */
export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/from-a2ui" subtitle="createGenerativeUI · after">
      <GenUIDemo
        variants={[
          {
            id: "after",
            label: "After",
            generativeUI: { ui: appUI },
            welcome: "Try: show a flight card from SFO (San Francisco) to JFK (New York) with a Book button.",
          },
        ]}
      />
    </DemoFrame>
  );
}
