import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/json-render/demo-chat";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/json-render" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The agent replies with a <code>{"{ root, elements }"}</code> spec.
          The chat&apos;s assistant-message slot parses it (tolerating prose or
          a code fence around the JSON), keeps only the allow-listed component
          types, and draws it with <code>&lt;Renderer&gt;</code> inside{" "}
          <code>&lt;JSONUIProvider&gt;</code>. Component names and Zod prop
          schemas come from <code>defineCatalog</code>;{" "}
          <code>defineRegistry</code> binds them to React components. The page
          now prints <code>chat.tsx</code>, <code>json-render-renderer.tsx</code>,{" "}
          <code>catalog.ts</code> and <code>registry.tsx</code>; the rest comes
          from its Code tab. Everything runs as published.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show me the sales dashboard with metrics and a revenue chart.",
              "Break down revenue by category as a pie chart.",
            ]}
            expect="A metric card (with any chart the agent nests under it) or a donut chart renders in place of the assistant text. A reply that cannot be parsed yet shows as a normal assistant message."
            fail="Raw JSON stays on screen after the reply finishes, a red error from <Renderer>, or a module-not-found error for zod4 (the alias was not installed)."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Not yet checked in a browser">
        Rebuilt from the 2026-11-11 page. The page&apos;s catalog now uses the
        agent&apos;s own prop names (<code>label</code>, <code>value</code>,{" "}
        <code>trend</code>), and the renderer uses <code>JSONUIProvider</code>{" "}
        and <code>registry</code>, so the harness&apos;s earlier
        &ldquo;fixed&rdquo; mode is gone. The page says the demos use{" "}
        <code>@json-render/*</code> 0.18.0; this repo stays on 0.21.0. Its{" "}
        <code>catalog.ts</code> imports Zod 4 as <code>zod4</code>, so{" "}
        <code>package.json</code> gains that alias while the root{" "}
        <code>zod</code> stays at 3 for A2UI. The page also says{" "}
        <code>parseSpec</code> does not validate props against the Zod schemas;
        a wrong prop reaches the component as-is.
      </Callout>

      <Panel title="Printed on the page">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/chat.tsx` },
            { file: `${DIR}/json-render-renderer.tsx` },
            { file: `${DIR}/catalog.ts` },
            { file: `${DIR}/registry.tsx` },
          ]}
        />
      </Panel>

      <Panel
        title="From the page's Code tab"
        description="The page component, the components the registry binds, types, suggestions, the dedicated runtime route, and the agent."
      >
        <SourceCodeGroup
          files={[
            { file: `${DIR}/demo-page.tsx` },
            { file: `${DIR}/metric-card.tsx` },
            { file: `${DIR}/charts/bar-chart.tsx` },
            { file: `${DIR}/charts/pie-chart.tsx` },
            { file: `${DIR}/charts/chart-config.ts` },
            { file: `${DIR}/types.ts` },
            { file: `${DIR}/suggestions.ts` },
            { file: "frontend/src/app/api/copilotkit-declarative-json-render/route.ts" },
            { file: "backend/agents/byoc_json_render_agent.py" },
          ]}
        />
      </Panel>

      <Panel title="Other things to know">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            The runtime route is the bundle&apos;s: single-route mode, POST
            only, agent <code>byoc_json_render</code> at{" "}
            <code>/byoc_json_render/</code> on <code>AGENT_URL</code> (default{" "}
            <code>http://localhost:8000</code>).
          </li>
          <li>
            The agent model is <code>gpt-6-luna</code>, kept as published.
          </li>
        </ul>
      </Panel>
    </>
  );
}
