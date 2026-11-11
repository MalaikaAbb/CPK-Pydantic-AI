import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

/**
 * Reference only. This page's code imports `@copilotkit/react-core/v2/generative-ui`,
 * which the pinned CopilotKit (^1.77.0) does not export (added in 1.85). Bumping
 * dependencies is out of scope for a doc sync, so nothing is built here; see
 * README §9.29. An earlier revision of this branch ported a working demo from
 * the agno harness on a 1.85 bump; that port was reverted.
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components" />

      <Panel title="What the page covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The overview. A catalog on the provider (generativeUI=&#123;&#123; ui: standardUI &#125;&#125;) makes the runtime add a render_ui tool and a guide to each run, so the agent can answer with real components that stream in. Its runtime sample is a TanStack BuiltInAgent factory; an existing agent only has to pass the run&apos;s tools and context to its model.
        </p>
      </Panel>

      <Callout tone="warn" title="Reference only — needs CopilotKit 1.85">
        <p>
          The page&apos;s code imports{" "}
          <code>@copilotkit/react-core/v2/generative-ui</code>, which this
          repo&apos;s pinned <code>@copilotkit/react-core</code> (^1.77.0)
          does not export. A doc sync does not bump dependencies, so no demo is
          built until the repo moves to 1.85.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>The runtime sample is a CopilotKit BuiltInAgent (TanStack factory), not a Pydantic AI agent.</li>
          <li>pydantic-ai-slim 1.107&apos;s AGUIAdapter forwards the run&apos;s tools but drops AG-UI context, where the render_ui guide travels; a Pydantic AI agent would get the tool but not the guide (§9.29).</li>
        </ul>
      </Callout>
    </>
  );
}
