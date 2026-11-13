import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

/**
 * The demo in `demo-chat/` runs the page's code on the `components` Pydantic AI agent (see the callout).
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

      <Callout tone="warn" title="How this route is wired">
        <p>
          The demo runs the page&apos;s provider config on{" "}
          <code>/api/copilotkit-genui</code>. The agent is this repo&apos;s{" "}
          <code>components</code> agent (<code>backend/agents/components_agent.py</code>),
          a Pydantic AI <code>Agent</code> standing in for the section&apos;s
          TanStack <code>BuiltInAgent</code> (same prompt, no tools). CopilotKit
          is 1.87 (was 1.77, which has no <code>v2/generative-ui</code>).
        </p>
        <p className="mt-2">
          Expect no UI. Markdown mode sends the component schema and the fence
          guide only as context entries, and Pydantic AI&apos;s{" "}
          <code>AGUIAdapter</code> never reads the run&apos;s context (the page
          shows no Pydantic AI code for that), so the model never learns the
          format (README §9.29).
        </p>
      </Callout>

      <Panel title="The demo's code" description="The page's code as mounted in the demo (labelled where the harness adds an import, a runtime URL or a borrowed component). Snippets that cannot run are listed in the status note.">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/components/markdown-mode/demo-chat/page.tsx" },
          ]}
        />
      </Panel>
    </>
  );
}
