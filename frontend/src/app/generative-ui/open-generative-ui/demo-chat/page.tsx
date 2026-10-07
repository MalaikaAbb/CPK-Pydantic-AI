"use client";

import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

import OpenGenUiAdvancedDemo from "../advanced/demo";
import OpenGenUiDemo from "../minimal/demo";

type Cell = "minimal" | "advanced";

/**
 * Both cells from the demo bundle, mounted as published.
 *
 * Each brings its own `<CopilotKit>` against `/api/copilotkit-ogui`, which turns
 * Open Generative UI on for both agents. "minimal" passes a `designSkill`.
 * "advanced" passes `sandboxFunctions` that the generated iframe can call back
 * into. Switching remounts the provider and starts a fresh conversation. Since
 * the provider is nested, `lib/inspector.ts` turns the root Inspector off on
 * this route.
 *
 * The wrapper makes the bundle pages' `h-screen` fill the frame instead of the
 * window.
 */
export default function Page() {
  const [cell, setCell] = useState<Cell>("minimal");

  return (
    <DemoFrame
      parentPath="/generative-ui/open-generative-ui"
      subtitle={`agent: ${cell === "minimal" ? "open-gen-ui" : "open-gen-ui-advanced"} · /api/copilotkit-ogui`}
    >
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-800">
          {(["minimal", "advanced"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCell(c)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                cell === c
                  ? "bg-[var(--accent)] text-white"
                  : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 [&_.h-screen]:h-full">
          {cell === "minimal" ? (
            <OpenGenUiDemo key="minimal" />
          ) : (
            <OpenGenUiAdvancedDemo key="advanced" />
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
