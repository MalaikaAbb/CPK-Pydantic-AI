import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

/**
 * The demo in `demo-chat/` runs the page's code on the `components` Pydantic AI agent (see the callout).
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/surfaces" />

      <Panel title="What the page covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Surfaces: GenerativeUISurface targets on the page that the chat can fill, limit, scroll to and replace, with per-component error boundaries.
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
            { file: "frontend/src/app/generative-ui/components/surfaces/demo-chat/page.tsx" },
            { file: "frontend/src/app/generative-ui/components/surfaces/demo-chat/targets.tsx" },
            { file: "frontend/src/app/generative-ui/components/surfaces/demo-chat/surfaces.css" },
          ]}
        />
      </Panel>
    </>
  );
}
