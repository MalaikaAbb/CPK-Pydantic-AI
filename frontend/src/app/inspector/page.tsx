import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const CONTROL_SNIPPET = `// <CopilotKit> — takes enableInspector. On for localhost by default, and
// force-disabled in production builds. This is the prop the doc shows.
<CopilotKit
  publicLicenseKey={process.env.NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY}
  enableInspector={false}
>
  {children}
</CopilotKit>

// <CopilotKitProvider> — takes showDevConsole, and DEFAULTS TO false.
// "auto" reproduces the localhost-only behaviour. This repo uses the provider,
// so it has to opt back in.
<CopilotKitProvider runtimeUrl="/api/copilotkit" showDevConsole="auto">`;

const ROWS: [string, string][] = [
  ["AG-UI Events", "The raw event stream between this page and the agent."],
  ["Available Agents", "Which agent ids the runtime reported."],
  ["Agent State", "The current shared state object, updating live."],
  ["Frontend Tools", "Every browser-executed tool and its parameter schema."],
  ["Context", "Readables and document context handed to the agent."],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/inspector" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A built-in debugging overlay covering what the frontend and the agent
          are exchanging. It needs no API key and no configuration beyond
          enabling it, and a production build disables it unconditionally.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          It is the fastest way to answer &ldquo;did the runtime even see my
          agent?&rdquo; — Available Agents lists the ids it resolved, which is
          usually where a mismatched <code>agentId</code> shows up.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
                <th className="pb-2 pr-4 font-medium">Tab</th>
                <th className="pb-2 font-medium">Shows</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ROWS.map(([tab, desc]) => (
                <tr key={tab}>
                  <td className="py-2 pr-4 font-medium text-slate-800 dark:text-slate-100">
                    {tab}
                  </td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">
                    {desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <TryIt
            prompts={["Tell me something surprising"]}
            expect="The event list fills, and Available Agents lists default, my_agent, weather_agent, and language_agent."
            fail="The inspector never appears — it is force-disabled in production builds, so confirm you are running the dev server."
          />
        </div>
      </Panel>
      
      <Panel title="How this repo enables it">
        <SourceCode file="frontend/src/components/providers.tsx" />
      </Panel>

      <Panel title="Controlling it">
        <CodeBlock
          filename="Inspector control by provider"
          language="tsx"
          code={CONTROL_SNIPPET}
        />
      </Panel>

      <Panel title="The demo page">
        <SourceCode file="frontend/src/app/inspector/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
