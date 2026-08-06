import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Panel, TryIt } from "@/components/ui";

const COMPONENTS: [string, string][] = [
  ["CopilotChat", "Inline. Fills whatever container you give it."],
  [
    "CopilotSidebar",
    "Docks to the side of the viewport. The doc shows defaultOpen and labels.",
  ],
  ["CopilotPopup", "Floating launcher that opens a panel over the page."],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/prebuilt-components" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Three drop-in chat shells over one agent. They differ only in chrome
          and positioning — the conversation, tools, and streaming are
          identical, because they share the app-wide provider.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {COMPONENTS.map(([name, desc]) => (
                <tr key={name}>
                  <td className="w-44 py-2 pr-4 font-mono text-xs text-slate-800 dark:text-slate-100">
                    {name}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          All three come from{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
            @copilotkit/react-core/v2
          </code>
          , and the page&apos;s first snippet is the stylesheet import that makes
          them look like anything —{" "}
          <code>@copilotkit/react-core/v2/styles.css</code>, done once in{" "}
          <code>app/layout.tsx</code> here. The Quickstart&apos;s install line
          also lists <code>@copilotkit/react-ui</code>, which is the v1 package;
          this repo does not depend on it.
        </p>

        <div className="mt-4">
          <TryIt
            prompts={["What is CopilotKit?"]}
            expect="Each component streams the same agent's reply; only the chrome differs. Switching tabs keeps the conversation."
            fail="A component renders blank, or the sidebar/popup never appears on screen — usually the stylesheet import is missing."
          />
        </div>
      </Panel>

      <Panel
        title="Source"
        description="The tab switcher mounts one component at a time — sidebar and popup both use fixed positioning and would overlap."
      >
        <SourceCode file="frontend/src/app/prebuilt-components/demo-chat/page.tsx" />
      </Panel>

      <Panel title="Where the stylesheet is imported">
        <SourceCode file="frontend/src/app/layout.tsx" />
      </Panel>
    </>
  );
}
