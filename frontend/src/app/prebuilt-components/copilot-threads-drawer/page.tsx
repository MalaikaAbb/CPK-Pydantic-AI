import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const PROPS: [string, string][] = [
  ["agentId", "Whose threads to list. Defaults to the chat configuration's agent."],
  ["label", "Accessible drawer name. Defaults to “Threads”."],
  ["recentLabel", "Heading above the list. Defaults to “Recent Conversations”."],
  ["onThreadSelect", "Replaces the default select behaviour."],
  ["onNewThread", "Replaces the default “New Conversation” behaviour."],
  ["renderRow", "Renders your own per-row content."],
  ["limit", "Page size for cursor pagination."],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/prebuilt-components/copilot-threads-drawer" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The drop-in conversation sidebar. What makes it a two-line integration
          is that it holds no state of its own: the drawer and the chat sit
          inside one <code>CopilotChatConfigurationProvider</code>, and that
          provider owns the active thread. Selecting a row moves the chat;
          starting a new conversation resets it. Nothing is passed between them.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Prop</th>
                <th className="pb-2 font-medium">What it does</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {PROPS.map(([p, d]) => (
                <tr key={p}>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-800 dark:text-slate-100">
                    {p}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <TryIt
            prompts={["Can you tell me a joke?", "Now one about Python"]}
            expect="A row appears in the drawer after the first reply. Click New Conversation, send something else, then click back — the first thread's history replays into the chat."
            fail="The drawer shows a locked 'Threads are a CopilotKit Intelligence feature' panel instead of a list. That is a license, not a bug — see below."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Two different credentials gate this page">
        <p>
          <strong>Whether threads work</strong> is{" "}
          <code>INTELLIGENCE_API_KEY</code> on the runtime — it puts{" "}
          <code>/info</code> into <code>mode: &quot;intelligence&quot;</code> and
          makes the thread endpoints return real rows.
        </p>
        <p className="mt-2">
          <strong>Whether this drawer renders them</strong> is a different axis:
          it gates on <code>/info</code>&apos;s <code>licenseStatus</code>, which
          the runtime derives from <code>COPILOTKIT_LICENSE_TOKEN</code>. With a
          project key but no license token, threads work perfectly and the drawer
          still shows its Upgrade view. The connection panel on{" "}
          <Link href="/" className="text-[var(--accent)] underline underline-offset-4">
            the home page
          </Link>{" "}
          reports both separately for exactly this reason.
        </p>
      </Callout>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/prebuilt-components/copilot-threads-drawer/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="What the runtime has to expose"
        description="The drawer reads and mutates threads over the multi-route handler, so the verb exports matter."
      >
        <SourceCode file="frontend/src/app/api/copilotkit/[[...slug]]/route.ts" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          <code>GET</code> lists, <code>PATCH</code> renames and archives,{" "}
          <code>DELETE</code> removes. The Quickstart exports only{" "}
          <code>GET</code> and <code>POST</code>, which is enough to chat and to
          list — the mutations 405 until the other two are exported.
        </p>
      </Panel>
    </>
  );
}
