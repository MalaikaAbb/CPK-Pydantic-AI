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
      <RouteHeader path="/generative-ui/components/standard-catalog" />

      <Panel title="What the page covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Standard catalog: standardUI&apos;s ready-made components used as is, extended with a custom component, trimmed with omit, and with Card overridden. Charts and maps need their optional libraries.
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
          <li>The extend sample names ProductCard and productSchema without defining them; the Map component needs maplibre-gl, which this repo doesn&apos;t install.</li>
        </ul>
      </Callout>
    </>
  );
}
