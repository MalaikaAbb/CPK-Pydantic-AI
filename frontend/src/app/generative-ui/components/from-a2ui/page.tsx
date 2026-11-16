import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// "Use 1.0 with the React a2ui renderer", as printed. Shown, not run: no
// agent this page (or the A2UI pages) publishes for Pydantic AI emits native
// A2UI 1.0 `a2ui_operations`, which the page says this path needs. The
// installed @copilotkit/a2ui-renderer 1.87.1 does export these names.
const V1_BASIC = `import { basicCatalogV1 } from "@copilotkit/a2ui-renderer";

<CopilotKit runtimeUrl="/api/copilotkit" a2ui={{ catalog: basicCatalogV1 }}>
  {/* Your app */}
</CopilotKit>`;

const V1_CUSTOM = `import { z } from "zod";
import {
  createCatalog,
  DynamicStringSchemaV1,
} from "@copilotkit/a2ui-renderer";

const myCatalog = createCatalog(
  { Greeting: { props: z.object({ name: DynamicStringSchemaV1 }) } },
  { Greeting: ({ props }) => <p>Hello {props.name}</p> },
  {
    catalogId: "acme/greetings@1",
    protocolVersion: "1.0",
    includeBasicCatalog: true,
  },
);`;

/**
 * The demo in `demo-chat/` runs the page's code on the `components` Pydantic AI agent (see the callout).
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/from-a2ui" />

      <Panel title="What the page covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Adopt from A2UI: moving from the v0.9 a2ui renderer to A2UI 1.0 components, with before/after catalog code, the v0.9 → 1.0 mapping and a support matrix.
        </p>
      </Panel>

      <Callout tone="info" title="How this route is wired">
        <p>
          The demo runs the page&apos;s provider config on{" "}
          <code>/api/copilotkit-genui</code>. The agent is this repo&apos;s{" "}
          <code>components</code> agent (<code>backend/agents/components_agent.py</code>),
          a Pydantic AI <code>Agent</code> standing in for the section&apos;s
          TanStack <code>BuiltInAgent</code> (same prompt, no tools). CopilotKit
          is 1.87 (was 1.77, which has no <code>v2/generative-ui</code>).
        </p>
        <p className="mt-2">
          The run&apos;s <code>render_ui</code> tool reaches the model with its
          full schema, but its guide does not: Pydantic AI&apos;s{" "}
          <code>AGUIAdapter</code> never reads the run&apos;s context
          (pydantic-ai-slim 1.107.7; 2.68 is the same), and the page shows no
          Pydantic AI code for that, so none is added. Expect UI that may be
          rejected or incomplete until checked in a browser (README §9.29).
        </p>
      </Callout>

      <Panel title="The demo's code" description="The page's code as mounted in the demo (labelled where the harness adds an import, a runtime URL or a borrowed component). Snippets that cannot run are listed in the status note.">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/components/from-a2ui/demo-chat/app-ui.ts" },
            { file: "frontend/src/app/generative-ui/components/from-a2ui/demo-chat/page.tsx" },
            { file: "frontend/src/app/generative-ui/components/_shared/borrowed-ui.tsx" },
          ]}
        />
      </Panel>

      <Panel title="Printed on the page, not run: Use 1.0 with the React a2ui renderer">
        <p className="mb-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page now also shows how to stay on the <code>a2ui</code> provider
          option and opt into A2UI 1.0 catalogs. Not mounted: the page says the
          agent must emit native 1.0 <code>a2ui_operations</code>, and no
          Pydantic AI agent it (or the A2UI pages) publishes does that; this
          repo&apos;s A2UI agents write v0.9 operations. The renderer exports
          (<code>basicCatalogV1</code>, <code>DynamicStringSchemaV1</code>,{" "}
          <code>protocolVersion</code>) do exist in the pinned 1.87.1.
        </p>
        <div className="space-y-3">
          <CodeBlock code={V1_BASIC} language="tsx" filename="Opt into the 1.0 basic catalog" />
          <CodeBlock code={V1_CUSTOM} language="tsx" filename="A custom 1.0 catalog" />
        </div>
      </Panel>
    </>
  );
}
