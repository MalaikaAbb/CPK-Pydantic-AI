import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/hashbrown/demo-chat";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/hashbrown" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The agent answers with one JSON object whose <code>ui</code> array
          names components from a Hashbrown UI kit. A provider
          (<code>HashBrownDashboard</code>) builds that kit once; the chat&apos;s
          assistant-message slot runs each reply through{" "}
          <code>useJsonParser(content, kit.schema)</code> and renders the
          parsed value with <code>kit.render(value)</code>, so finished parts
          of the dashboard show up while the rest is still streaming. The page
          now prints the demo&apos;s <code>page.tsx</code>,{" "}
          <code>chat.tsx</code> and <code>hashbrown-renderer.tsx</code>; the
          components they import, the runtime route and the agent come from
          the same page&apos;s Code tab. Everything runs as published.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show me a Q4 sales dashboard. Include a total-revenue metric card, a pie chart of revenue by segment, and a bar chart of monthly revenue.",
            ]}
            expect="A metric card, a donut chart and a bar chart fill in one after another inside the assistant message, with Markdown headings between them. Three suggestion pills sit above the input."
            fail="Raw JSON or an empty assistant bubble (the reply did not match the kit's schema), a red 'HashBrownRenderMessage must be used within HashBrownDashboard' error, or a bundle error from @hashbrownai/core."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Not yet checked in a browser">
        Rebuilt from the 2026-11-11 page. The page, its Code tab and the agent
        now agree on one envelope (<code>{"{ \"ui\": [ { \"metric\": { \"props\": … } } ] }"}</code>,
        lowercase names, chart <code>data</code> as a JSON string), so the
        harness&apos;s earlier &ldquo;fixed&rdquo; mode is gone. The doc code
        uses <code>prompt</code> and <code>useUiKit({"{ examples }"})</code>,
        which <code>@hashbrownai/*</code> 0.6.1 (this repo&apos;s pin)
        exports. The agent model is <code>gpt-6-luna</code>, kept as published.
      </Callout>

      <Panel title="Printed on the page">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/demo-page.tsx` },
            { file: `${DIR}/chat.tsx` },
            { file: `${DIR}/hashbrown-renderer.tsx` },
          ]}
        />
      </Panel>

      <Panel
        title="From the page's Code tab"
        description="Imported by the printed files: components, types, suggestions, the dedicated runtime route, and the agent."
      >
        <SourceCodeGroup
          files={[
            { file: `${DIR}/metric-card.tsx` },
            { file: `${DIR}/charts/pie-chart.tsx` },
            { file: `${DIR}/charts/bar-chart.tsx` },
            { file: `${DIR}/charts/chart-config.ts` },
            { file: `${DIR}/types.ts` },
            { file: `${DIR}/suggestions.ts` },
            { file: "frontend/src/app/api/copilotkit-declarative-hashbrown/route.ts" },
            { file: "backend/agents/byoc_hashbrown_agent.py" },
          ]}
        />
      </Panel>

      <Panel title="Other things to know">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            The runtime route is the bundle&apos;s: single-route mode, POST
            only, agent <code>declarative-hashbrown-demo</code> plus a{" "}
            <code>default</code> alias, both pointing at{" "}
            <code>/byoc_hashbrown/</code> on <code>AGENT_URL</code> (default{" "}
            <code>http://localhost:8000</code>).
          </li>
          <li>
            <code>@hashbrownai/core</code> 0.6.1 imports <code>EventSchemas</code>{" "}
            from <code>@ag-ui/core</code> 0.0.59, so <code>package.json</code>{" "}
            keeps a nested override for it (README §9.22b).
          </li>
        </ul>
      </Panel>
    </>
  );
}
