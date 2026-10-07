import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

// The bundle's agent-side tool, as far as it can be quoted without the missing
// module. Shown so the gap is concrete.
const BUNDLE_TOOL_IMPORT = `# demo bundle — src/agents/a2ui_dynamic.py
from tools import build_a2ui_operations_from_tool_call   # never published

@agent.tool
def generate_a2ui(ctx: RunContext[StateDeps[EmptyState]]) -> str:
    ...  # secondary OpenAI call forced to render_a2ui
    result = build_a2ui_operations_from_tool_call(args)
    return json.dumps(result)`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui/dynamic-schema" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A dashboard the model designs per request. The provider registers a
          catalog of custom components (<code>Card</code>,{" "}
          <code>StatusBadge</code>, <code>Metric</code>, <code>InfoRow</code>,{" "}
          <code>DataTable</code>, <code>PrimaryButton</code>,{" "}
          <code>PieChart</code>, <code>BarChart</code>) plus the basic A2UI
          set. The catalog is serialised into the agent&apos;s context, and the
          surface the model emits renders as live React components.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show me my sales dashboard for this quarter.",
              "How are our sales reps performing against quota?",
            ]}
            expect={
              <>
                A one-line reply, then a surface built from the catalog: metric
                tiles, a bar or pie chart, a table for the second prompt. The
                Inspector shows a <code>generate_a2ui</code> tool call that the
                agent never declared, because the runtime injected it.
              </>
            }
            fail={
              <>
                A prose answer with no surface means no tool was injected.
                Check the Inspector&apos;s tool list for{" "}
                <code>generate_a2ui</code>. A red <em>Catalog not found</em>{" "}
                box means the model omitted <code>catalogId</code>. The bundle
                guards against that with <code>defaultCatalogId</code>, which
                this route drops along with the rest of the <code>a2ui</code>{" "}
                block (see below).
              </>
            }
          />
        </div>
      </Panel>

      <Callout tone="warn" title="This route follows the prose, not the demo code">
        <p>
          The page describes two paths. In the default path, the catalog on the
          provider auto-injects <code>generate_a2ui</code> and nothing else is
          configured. In the opt-out path, the agent binds its own tool and the
          runtime sets <code>injectA2UITool: false</code>. The demo bundle
          implements the opt-out path. Its tool imports a helper from a{" "}
          <code>tools</code> module that no bundle publishes:
        </p>
        <div className="mt-3">
          <CodeBlock code={BUNDLE_TOOL_IMPORT} language="python" filename="What the bundle's agent depends on" />
        </div>
        <p className="mt-3">
          So this route runs the default path. The agent keeps the bundle&apos;s
          model and <code>SYSTEM_PROMPT</code> word for word, without the tool.
          The runtime route is the bundle&apos;s, minus its <code>a2ui</code>{" "}
          block. The frontend is the bundle&apos;s, verbatim.
        </p>
      </Callout>

      <Panel title="The demo">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/a2ui/dynamic-schema/demo.tsx" },
            { file: "frontend/src/app/generative-ui/a2ui/dynamic-schema/chat.tsx" },
            { file: "frontend/src/app/generative-ui/a2ui/dynamic-schema/suggestions.ts" },
          ]}
        />
      </Panel>

      <Panel title="The catalog — definitions × renderers">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/a2ui/dynamic-schema/a2ui/definitions.ts" },
            { file: "frontend/src/app/generative-ui/a2ui/dynamic-schema/a2ui/catalog.ts" },
            { file: "frontend/src/app/generative-ui/a2ui/dynamic-schema/a2ui/renderers.tsx" },
          ]}
        />
      </Panel>

      <Panel title="The runtime route and the agent">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit-declarative-gen-ui/route.ts" },
            { file: "backend/agents/a2ui_dynamic.py" },
          ]}
        />
      </Panel>

      <Callout tone="info" title="zod 3, on purpose">
        The A2UI binder only understands zod 3 schemas, and a fresh{" "}
        <code>npm install zod</code> now gives zod 4. This repo pins{" "}
        <code>zod@3.25.76</code>, the renderer&apos;s own version, so{" "}
        <code>definitions.ts</code> keeps the doc&apos;s plain{" "}
        <code>&quot;zod&quot;</code> import. The fixed-schema route is where a
        wrong zod shows: there, path bindings render blank.
      </Callout>

      <Callout tone="info" title="The opt-out snippet is LangGraph's">
        The page&apos;s &ldquo;I opted out of auto-inject&rdquo; section builds
        the tool with <code>ag_ui_langgraph.get_a2ui_tools</code> and{" "}
        <code>langchain_openai.ChatOpenAI</code>. Neither is a Pydantic AI API.
        It is not run here.
      </Callout>
    </>
  );
}
