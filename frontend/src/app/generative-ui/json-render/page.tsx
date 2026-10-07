import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/json-render";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/json-render" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page swaps the chat&apos;s assistant-message slot for a renderer
          that reads the reply as a <code>{"{ root, elements }"}</code> spec,
          checks each element against a Zod catalog, and draws it with{" "}
          <code>@json-render/react</code>. The frontend code the page leaves
          out has been written in, but its call into the library is kept
          exactly as published. The agent is the doc&apos;s own demo-bundle
          agent.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "(as published) Break down revenue by category as a pie chart.",
              "(as published) Show me the sales dashboard with metrics and a revenue chart.",
            ]}
            expect={
              <>
                <strong>The first prompt should error.</strong> The agent
                replies with a <code>PieChart</code> root. That passes the
                catalog, so the spec reaches <code>&lt;Renderer&gt;</code>,
                which throws, most likely{" "}
                <code>useVisibility must be used within a VisibilityProvider</code>
                . The demo shows it in a red box. <strong>The second prompt should
                show nothing and no error.</strong> Its root is a{" "}
                <code>MetricCard</code>, which fails the catalog (see below), so
                the renderer returns <code>null</code> before reaching the
                library.
              </>
            }
            fail={
              <>
                Both prompts showing nothing means no reply parsed as a spec.
                Check the raw reply in the Inspector. The agent should send a
                bare JSON object with no prose and no code fences.
              </>
            }
          />
        </div>
      </Panel>

      <Callout tone="warn" title="The doc's agent and the doc's catalog disagree on MetricCard">
        <p>
          The page&apos;s <code>registry.tsx</code> declares{" "}
          <code>MetricCard</code> as{" "}
          <code>{"{ title: string, value: number, delta?: number }"}</code>.
          The demo bundle&apos;s agent (<code>byoc_json_render_agent.py</code>)
          tells the model to send{" "}
          <code>{"{ label: string, value: string, trend: string | null }"}</code>
          . Every metric card the agent sends therefore fails validation and is
          dropped, in both modes. If a metric card is the root, the whole spec
          goes with it.
        </p>
        <p className="mt-2">
          <code>BarChart</code> and <code>PieChart</code> survive. The catalog
          asks only for <code>data</code>, and Zod ignores the extra{" "}
          <code>title</code> and <code>description</code> the agent adds.
        </p>
      </Callout>

      <Panel title="The fix — switch the demo to “fixed”">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A working version sits next to the published one. It reuses the
          page&apos;s catalog, components, Zod schemas and helpers, and changes
          four things:
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            It passes <code>registry</code> instead of <code>catalog</code>.
            The registry is built from the page&apos;s catalog as a map from
            type name to{" "}
            <code>({"{ element }"}) =&gt; &lt;Component {"{...element.props}"} /&gt;</code>
            , plus a <code>Stack</code> container.
          </li>
          <li>
            It wraps <code>&lt;Renderer&gt;</code> in{" "}
            <code>&lt;JSONUIProvider registry&gt;</code>.
          </li>
          <li>
            It still replaces the whole <code>assistantMessage</code>, but
            reads <code>props.message.content</code>. A reply that is not a spec
            falls back to the default message. Passing it needs an{" "}
            <code>as unknown as typeof CopilotChatAssistantMessage</code> cast.
          </li>
          <li>
            It calls <code>useConfigureSuggestions</code> inside{" "}
            <code>&lt;CopilotKit&gt;</code>, so the suggestions show up.
          </li>
        </ol>
        <div className="mt-4">
          <TryIt
            prompts={[
              "(fixed) Break down revenue by category as a pie chart.",
              "(fixed) Show me the sales dashboard with metrics and a revenue chart.",
            ]}
            expect={
              <>
                Two suggestion pills above the input. The first prompt draws a
                pie chart with no error. The second prompt shows the agent&apos;s
                raw JSON as an ordinary message. Its <code>MetricCard</code>{" "}
                root fails the catalog, so there is no spec, and the fixed
                renderer falls back to the default message.
              </>
            }
            fail="A red error box, or nothing at all for the pie-chart prompt."
          />
        </div>
        <div className="mt-4">
          <SourceCodeGroup files={[{ file: `${DIR}/json-render-fixed.tsx` }]} />
        </div>
      </Panel>

      <Panel title="Left as published — the library call">
        <Callout tone="warn" title="Not fixed on purpose">
          <code>&lt;Renderer spec=&#123;spec&#125; catalog=&#123;catalog&#125; /&gt;</code>{" "}
          does not match <code>@json-render/react</code> 0.21, which takes{" "}
          <code>registry</code> and needs its providers around it. A{" "}
          <code>@ts-expect-error</code> above the line lets the build pass, so
          the error shows at runtime instead.
        </Callout>
        <div className="mt-4">
          <Callout tone="warn" title="Also from the page: the slot type">
            <code>messageView.assistantMessage</code> is typed as{" "}
            <code>typeof CopilotChatAssistantMessage</code> in CopilotKit 1.77.
            The page&apos;s plain component does not satisfy it, so that line
            also carries a <code>@ts-expect-error</code>.
          </Callout>
        </div>
        <div className="mt-4">
          <SourceCodeGroup
            files={[
              { file: `${DIR}/byoc-json-render-demo.tsx` },
              { file: `${DIR}/json-render-renderer.tsx` },
              { file: `${DIR}/registry.tsx` },
            ]}
          />
        </div>
      </Panel>

      <Panel title="The agent — from the doc's demo bundle">
        <p className="mb-4 text-sm text-slate-700 dark:text-slate-300">
          The page shows only example output. Its demo &ldquo;Code&rdquo; tab
          publishes this agent, used here verbatim.
        </p>
        <SourceCodeGroup files={[{ file: "backend/agents/byoc_json_render_agent.py" }]} />
      </Panel>

      <Panel title="Written in — what the page leaves out">
        <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <code>stripCodeFencesAndPrelude</code>,{" "}
            <code>tolerantJsonParse</code>, <code>validateAgainstCatalog</code>
          </li>
          <li>
            <code>MetricCard</code>, <code>BarChart</code>,{" "}
            <code>PieChart</code>, plus files at the paths the catalog imports
            from
          </li>
          <li>
            The <code>AssistantMessage</code> import, and the runtime route
          </li>
        </ul>
        <SourceCodeGroup
          files={[
            { file: `${DIR}/spec-helpers.ts` },
            { file: "frontend/src/components/byoc-dashboard.tsx" },
            { file: "frontend/src/app/api/copilotkit-byoc-json-render/[[...slug]]/route.ts" },
          ]}
        />
      </Panel>

      <Panel title="Other things to know">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            The page&apos;s example output uses a <code>Stack</code>, which is
            not in its catalog. The validator keeps unknown types only when
            they have <code>children</code>.
          </li>
          <li>
            The page calls <code>useConfigureSuggestions</code> outside the{" "}
            <code>&lt;CopilotKit&gt;</code> it renders. The suggestions register
            on the app&apos;s root provider, so they do not appear in this
            chat.
          </li>
        </ul>
      </Panel>
    </>
  );
}
