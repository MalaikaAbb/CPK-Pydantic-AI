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
      <RouteHeader path="/generative-ui/components/transports" />

      <Panel title="What the page covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Transports: the render_ui tool transport vs the markdown transport, the runtime&apos;s generativeUI flag, and agentIds scoping.
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
          <li>The runtime sample&apos;s agent is never defined, and the shop agent named in agentIds is never built.</li>
          <li>Both transports send their guide as AG-UI context, which Pydantic AI&apos;s AGUIAdapter drops (§9.29).</li>
        </ul>
      </Callout>
    </>
  );
}
