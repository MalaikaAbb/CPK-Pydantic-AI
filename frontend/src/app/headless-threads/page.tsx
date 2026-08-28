import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const RETURNS: [string, string][] = [
  ["threads", "The list, most recent first."],
  ["isLoading", "Initial load only."],
  ["renameThread(id, name)", "The action the prebuilt drawer's row menu omits."],
  ["archiveThread(id)", "Soft delete — hidden but retained."],
  ["deleteThread(id)", "Permanent."],
  ["startNewThread()", "Clears the list selection. Does NOT touch the chat's threadId."],
  ["hasMoreThreads", "Another page exists."],
  ["isFetchingMoreThreads", "A page is in flight."],
  ["fetchMoreThreads()", "Loads the next page."],
];

const PAGINATION = `// \`limit\` is what turns cursor pagination on. Without it there is
// only ever one page, and the three pagination values below stay inert.
const {
  threads,
  hasMoreThreads,
  isFetchingMoreThreads,
  fetchMoreThreads,
} = useThreads({
  agentId: "my_agent",
  limit: 20,
});`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/headless-threads" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The same thread data the drawer renders, through{" "}
          <code>useThreads</code>, with a list built by hand. Two things this
          gets that the prebuilt drawer does not:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>Rename.</strong> <code>renameThread</code> is an action the
            drawer&apos;s row menu leaves out entirely — the doc names it as the
            main reason to go headless.
          </li>
          <li>
            <strong>The <code>threadId</code> handoff.</strong> The drawer shares
            state through a configuration provider; here the selected id is
            ordinary React state passed to{" "}
            <code>&lt;CopilotChat threadId={"{…}"}&gt;</code>, which is the
            doc&apos;s own <code>App.tsx</code>.
          </li>
        </ul>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">useThreads returns</th>
                <th className="pb-2 font-medium">What it is</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {RETURNS.map(([k, d]) => (
                <tr key={k}>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-800 dark:text-slate-100">
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
            prompts={["Can you tell me a joke?"]}
            expect="A row appears. Rename retitles it in place, Archive marks it, Delete removes it, and New conversation clears the chat to a fresh welcome screen."
            fail="Rename/Archive/Delete throw or do nothing — in SSE mode /info reports mutations: false and there is no endpoint behind them."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="“New conversation” takes two steps, and only one is the hook's">
        <p>
          <code>useThreads().startNewThread()</code> deselects the list row and
          nothing else — it never touches the chat&apos;s <code>threadId</code>.
          The prebuilt drawer pairs it with the chat configuration&apos;s own{" "}
          <code>startNewThread</code>, which is unavailable here because this
          demo mounts no configuration provider and the chat is prop-controlled.
        </p>
        <p className="mt-2">
          Clearing the prop to <code>undefined</code> is not enough either: with
          no prop the chat falls back to an id minted with <code>useMemo</code>{" "}
          at mount, so it returns to the <em>same</em> id every time and the
          button appears dead. Bumping a React <code>key</code> forces the
          remount that re-runs that memo — the exact behaviour the{" "}
          <a
            href="/threads-lifecycle"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Lifecycle page
          </a>{" "}
          documents as a footgun, used here on purpose.
        </p>
      </Callout>

      <Panel title="Source">
        <SourceCode file="frontend/src/app/headless-threads/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="Pagination"
        description="Shown rather than exercised — this harness rarely accumulates twenty threads."
      >
        <CodeBlock code={PAGINATION} language="tsx" filename="useThreads with limit" />
      </Panel>

      <Panel
        title="The server half"
        description="The doc's server.ts sample, as this repo actually builds it."
      >
        <SourceCode file="frontend/src/app/api/copilotkit/[[...slug]]/route.ts" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          The doc&apos;s <code>identifyUser</code> calls a{" "}
          <code>verifyAppSession(request)</code> and throws when there is no
          user. This harness has no session to verify, so it reads the identity
          out of request headers that <code>Providers</code> sets — the same
          shape, with the verification step stubbed rather than faked.
        </p>
      </Panel>
    </>
  );
}
