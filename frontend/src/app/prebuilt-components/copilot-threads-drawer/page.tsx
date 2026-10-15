import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const SAMPLES_FILE = "frontend/src/app/prebuilt-components/copilot-threads-drawer/doc-samples.tsx";

/** What the doc teaches that this route cannot exercise, or that breaks. */
const GAPS: [string, string][] = [
  [
    "YourMainContent is never defined",
    "The sidebar sample uses <YourMainContent /> without declaring it, so the sample does not compile as printed. Here it is a stand-in that renders nothing.",
  ],
  [
    "Chat layout in the first sample",
    "CopilotChat is a bare flex child with no flex: 1. On 1.77 this repo saw it collapse to a narrow column. It is left as published, so tab 1 shows whatever the doc's layout does today.",
  ],
  [
    "CPK_INTELLIGENCE_API_KEY",
    "The doc names this variable. This repo's runtime route reads INTELLIGENCE_API_KEY, and the runtime does not read either name by itself. Set INTELLIGENCE_API_KEY, or the drawer stays locked.",
  ],
  [
    "Multi-user scoping",
    "Covered on Thread & History Lifecycle, which the doc links to. The doc's own provider sends no identity headers, so on these tabs identifyUser resolves to “anonymous”.",
  ],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/prebuilt-components/copilot-threads-drawer" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A prebuilt thread list beside the chat. The drawer and the chat share
          one <code>CopilotChatConfigurationProvider</code>, and that provider
          holds the active thread. So picking a row switches the chat and
          &ldquo;New Conversation&rdquo; resets it, with no{" "}
          <code>threadId</code> state or handlers in your code. The doc&apos;s two code
          samples are the two tabs in the demo, and each tab mounts its own{" "}
          <code>CopilotKitProvider</code>, as the doc does.
        </p>
        <div className="mt-4 space-y-3">
          <TryIt
            prompts={["Can you tell me a joke?", "Now one about Python"]}
            expect="Tab 1 — after the first reply, a row appears in the drawer. Click New Conversation and the chat shows the welcome screen. Send something, then click the first row: its history replays. The row's ⋮ menu offers Archive and Delete but no Rename."
            fail="The drawer shows a locked 'Threads are a CopilotKit Intelligence feature' panel (see Intelligence access below), or the chat is squeezed to a narrow column beside the drawer. That second one is the doc's own layout: CopilotChat is a bare flex child with no flex: 1."
          />
          <TryIt
            prompts={["Hello from the sidebar"]}
            expect="Tab 2 — the sidebar is open on load. Picking a drawer row switches the conversation inside it, exactly as in tab 1."
            fail="Picking a row changes nothing in the sidebar chat. That would mean it does not share the drawer's configuration, which the doc says it does."
          />
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Mobile launcher: narrow the window to phone width. The drawer should
          become an off-canvas panel, opened by a launcher in the chat header.
          On desktop there is no launcher, and the doc says that is intended.
        </p>
      </Panel>

      <Callout tone="warn" title="Intelligence access — what unlocks the drawer">
        <p>
          The drawer only lists threads when the runtime reports an active
          entitlement in <code>/info</code>&apos;s <code>licenseStatus</code>.
          Otherwise it shows a locked Upgrade view and sends no thread requests.
          As of 1.79 that status comes from two places:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <strong>Cloud-hosted:</strong> the project API key. The runtime
            reads the org&apos;s subscription from the platform, and an active
            subscription reports <code>valid</code> with no license token. The
            doc calls the key <code>CPK_INTELLIGENCE_API_KEY</code>; this
            repo&apos;s runtime route reads <code>INTELLIGENCE_API_KEY</code>.
          </li>
          <li>
            <strong>Self-hosted / open source:</strong>{" "}
            <code>COPILOTKIT_LICENSE_TOKEN</code>, or the runtime&apos;s{" "}
            <code>licenseToken</code> option, which wins if both are set.
          </li>
        </ul>
        <p className="mt-2">
          With no key, the runtime runs in SSE mode and <code>/info</code> has
          no <code>licenseStatus</code> at all. The connection panel on{" "}
          <Link href="/" className="text-[var(--accent)] underline underline-offset-4">
            the home page
          </Link>{" "}
          shows the mode and the license status as separate rows.
        </p>
      </Callout>

      <Panel title="1 · Set up the Threads Drawer" description="The doc's first sample. No callbacks, no agentId — the `default` runtime agent answers.">
        <SourceCode file={SAMPLES_FILE} region="setup" />
      </Panel>

      <Panel title="2 · Use the Drawer with a sidebar chat">
        <SourceCode file={SAMPLES_FILE} region="sidebar" />
      </Panel>




      <Panel title="Doc vs. implementation — what is missing or broken">
        <ul className="space-y-3 text-sm">
          {GAPS.map(([title, body]) => (
            <li key={title}>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{title}</p>
              <p className="mt-0.5 text-slate-600 dark:text-slate-400">{body}</p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        title="What the runtime has to expose"
        description="The drawer reads and changes threads through the multi-route handler, so the exported verbs matter."
      >
        <SourceCode file="frontend/src/app/api/copilotkit/[[...slug]]/route.ts" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          <code>GET</code> lists, <code>PATCH</code> archives,{" "}
          <code>DELETE</code> removes. A route that exports only{" "}
          <code>GET</code> and <code>POST</code> can chat and list, but archive
          and delete return 405.
        </p>
      </Panel>

      <Panel title="Demo shell">
        <SourceCode file="frontend/src/app/prebuilt-components/copilot-threads-drawer/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
