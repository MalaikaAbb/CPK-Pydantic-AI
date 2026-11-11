"use client";

import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

import {
  ControlledChat,
  HIDE_DRAWER_CONTROLS_CSS,
  NewConversationPage,
  ResearchAgentDrawer,
  SetupPage,
  SidebarPage,
} from "../doc-samples";

type Sample = "setup" | "sidebar" | "new-button" | "only-button" | "controlled" | "agent-id";

/**
 * One tab per code sample on the doc page. The samples themselves live in
 * `../doc-samples.tsx`, one `#region` each, so the notes page can show each
 * sample's source.
 *
 * Samples 1–4 mount their own `<CopilotKitProvider>`, as the doc does. The
 * controlled and `agentId` fragments print no provider, so they run under the
 * app's root `<CopilotKit>`. Each tab is keyed, so switching tabs remounts it. Nothing carries over
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
  {
    id: "new-button",
    label: "3 · Own New-conversation button",
    blurb: "A header button calling useCopilotChatConfiguration().startNewThread().",
  },
  {
    id: "only-button",
    label: "4 · Only your button (CSS parts)",
    blurb: "Tab 3 plus the doc's ::part CSS hiding the drawer's own new-thread controls.",
  },
  {
    id: "controlled",
    label: "5 · Controlled threadId",
    blurb: "threadId in app state; onThreadSelect / onNewThread update it. Root provider.",
  },
  {
    id: "agent-id",
    label: "6 · agentId=\"research_agent\"",
    blurb: "The drawer pinned to an agent this runtime does not register. Root provider.",
  },
];

export default function Page() {
  const [sample, setSample] = useState<Sample>("setup");
  const active = SAMPLES.find((s) => s.id === sample)!;

  return (
    <DemoFrame
      parentPath="/prebuilt-components/copilot-threads-drawer"
      subtitle={`agent: ${sample === "agent-id" ? "research_agent" : "default"} · ${active.blurb}`}
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
          {sample === "new-button" && <NewConversationPage key="new-button" />}
          {sample === "only-button" && (
            <div key="only-button" className="h-full">
              <style>{HIDE_DRAWER_CONTROLS_CSS}</style>
              <NewConversationPage />
            </div>
          )}
          {sample === "controlled" && <ControlledChat key="controlled" />}
          {sample === "agent-id" && <ResearchAgentDrawer key="agent-id" />}
        </div>
      </div>
    </DemoFrame>
  );
}
