import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const PRIORITY: [string, string][] = [
  ["1. Explicit prop", "`threadId` on <CopilotChat> or the configuration provider. Authoritative — drives history replay."],
  ["2. Active-thread override", "setActiveThreadId(...) or startNewThread()."],
  ["3. Inherited", "From a parent configuration provider."],
  ["4. Non-authoritative seed", "A suggested id that does not replay."],
  ["5. Fresh UUID v4", "Minted at mount with useMemo when nothing else applies."],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/threads-lifecycle" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Where a <code>threadId</code> comes from, what makes history replay,
          and why switching is not the same as starting fresh. The demo shows the
          live id, whether it is <em>explicit</em>, and three buttons that move
          it three different ways.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Resolution order</th>
                <th className="pb-2 font-medium">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {PRIORITY.map(([k, d]) => (
                <tr key={k} className="align-top">
                  <td className="py-2 pr-4 font-medium text-slate-800 dark:text-slate-100">
                    {k}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <TryIt
            prompts={[
              "Send a message, press New chat, send another",
              "Pick the first conversation and press Open conversation",
            ]}
            expect="New chat mints a visibly different threadId and clears the transcript. Open conversation sets explicit=true and replays that thread's history. Set id, no replay sets the same id with explicit=false and shows the welcome screen instead."
            fail="The threadId never changes, or the buttons log a warning — that happens when a threadId prop is also being passed, which makes both setters no-op."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Pick one source of truth">
        <p>
          <code>setActiveThreadId</code> and <code>startNewThread</code>{" "}
          <strong>no-op and log</strong> when the <code>threadId</code> is
          prop-controlled. This demo therefore passes no <code>threadId</code>{" "}
          prop at all, so the setters are the only thing moving the id.
        </p>
        <p className="mt-2">
          The{" "}
          <a
            href="/headless-threads"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Headless Threads route
          </a>{" "}
          is the other half of that rule: it <em>does</em> pass the prop, and so
          has to reach for a React <code>key</code> bump instead of the setters.
          The two routes are the two halves of the same trade-off.
        </p>
      </Callout>

      <Callout tone="info" title="Auto-minted ids re-mint on remount">
        A changed React <code>key</code>, a parent unmount, or dev StrictMode all
        re-run the <code>useMemo</code> that minted the id — silently starting a
        new conversation. To survive a remount, pass an explicit{" "}
        <code>threadId</code> prop, or restore it with{" "}
        <code>setActiveThreadId(id, {"{ explicit: true }"})</code> before the chat
        mounts.
      </Callout>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/threads-lifecycle/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
