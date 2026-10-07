import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/open-generative-ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/open-generative-ui" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The agent writes a complete HTML/CSS/JS interface, and it streams
          into a sandboxed iframe in the chat: styles first, then HTML, then
          scripts. The runtime&apos;s <code>openGenerativeUI</code> flag gives
          the agent a <code>generateSandboxedUi</code> tool. Its middleware
          turns that tool call into activity events, and the built-in renderer
          mounts them. Neither agent declares a tool.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The demo has two cells. <strong>minimal</strong> swaps in a
          visualisation-focused <code>designSkill</code>.{" "}
          <strong>advanced</strong> registers two <code>sandboxFunctions</code>{" "}
          that the generated page can call through{" "}
          <code>Websandbox.connection.remote.*</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "(minimal) Quicksort visualization",
              "(advanced) Calculator (calls evaluateExpression)",
            ]}
            expect={
              <>
                Placeholder lines appear, then a framed preview fills in as the
                HTML streams, then it animates or becomes interactive. In{" "}
                <em>advanced</em>, pressing <kbd>=</kbd> in the generated
                calculator shows a result, and the browser console logs{" "}
                <code>[open-gen-ui/advanced] evaluateExpression …</code>, proof
                the host-side handler ran.
              </>
            }
            fail={
              <>
                Plain text, or raw HTML in a code block, means the agent never
                received <code>generateSandboxedUi</code>. Check that the demo
                is using <code>/api/copilotkit-ogui</code> and that the agent is
                listed in its <code>openGenerativeUI.agents</code>.
              </>
            }
          />
        </div>
      </Panel>

      <Panel title="The runtime route — one flag, both cells">
        <SourceCodeGroup files={[{ file: "frontend/src/app/api/copilotkit-ogui/route.ts" }]} />
      </Panel>

      <Panel title="minimal">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/minimal/demo.tsx` },
            { file: `${DIR}/minimal/chat.tsx` },
            { file: `${DIR}/minimal/design-skill.ts` },
            { file: `${DIR}/minimal/suggestions.ts` },
            { file: "backend/agents/open_gen_ui_agent.py" },
          ]}
        />
      </Panel>

      <Panel title="advanced — sandbox functions">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/advanced/demo.tsx` },
            { file: `${DIR}/advanced/sandbox-functions.ts` },
            { file: `${DIR}/advanced/suggestions.ts` },
            { file: "backend/agents/open_gen_ui_advanced_agent.py" },
          ]}
        />
      </Panel>

      <Callout tone="info" title="Where the code comes from">
        Every file on this route is the demo bundle&apos;s, verbatim. The page
        prose shows excerpts of the same files; for example, its page snippet
        omits the imports and the <code>Chat</code> component. The only
        harness code is the frame and the minimal/advanced toggle in{" "}
        <code>demo-chat/page.tsx</code>.
      </Callout>
    </>
  );
}
