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
      <RouteHeader path="/generative-ui/components/markdown-mode" />

      <Panel title="What the page covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Markdown mode: the agent writes A2UI operations in a2ui code blocks inside its reply; sendContext: false moves the catalog into forwardedProps.copilotkit.ui, read by a Python sample.
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
          <li>The Python sample uses an undefined MY_PROMPT and no json import.</li>
          <li>The fence guide travels as AG-UI context and the sendContext: false path needs forwarded_props; Pydantic AI&apos;s AGUIAdapter passes neither to the agent (§9.29).</li>
        </ul>
      </Callout>
    </>
  );
}
