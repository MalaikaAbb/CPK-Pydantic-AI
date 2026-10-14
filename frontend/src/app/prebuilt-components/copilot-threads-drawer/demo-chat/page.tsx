"use client";

import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

import { SetupPage, SidebarPage } from "../doc-samples";

type Sample = "setup" | "sidebar";

/**
 * One tab per code sample on the doc page. The samples themselves live in
 * `../doc-samples.tsx`, one `#region` each, so the notes page can show each
 * sample's source.
 *
 * Every sample mounts its own `<CopilotKitProvider>`, as the doc does. Each tab
 * is keyed, so switching tabs remounts that provider. Nothing carries over
 * between tabs except the threads stored on the server.
 */
const SAMPLES: { id: Sample; label: string; blurb: string }[] = [
  {
    id: "setup",
    label: "1 · Drawer + CopilotChat",
    blurb: "Drawer + CopilotChat in one CopilotChatConfigurationProvider. No callbacks.",
  },
  {
    id: "sidebar",
    label: "2 · Drawer + CopilotSidebar",
    blurb: "The same drawer, hosted by CopilotSidebar defaultOpen.",
  },
];

export default function Page() {
  const [sample, setSample] = useState<Sample>("setup");
  const active = SAMPLES.find((s) => s.id === sample)!;

  return (
    <DemoFrame
      parentPath="/prebuilt-components/copilot-threads-drawer"
      subtitle={`agent: default · ${active.blurb}`}
    >
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          {SAMPLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSample(s.id)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                sample === s.id
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1">
          {sample === "setup" && <SetupPage key="setup" />}
          {sample === "sidebar" && <SidebarPage key="sidebar" />}
        </div>
      </div>
    </DemoFrame>
  );
}
