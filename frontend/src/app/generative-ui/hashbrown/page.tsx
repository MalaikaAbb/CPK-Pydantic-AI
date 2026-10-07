import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/hashbrown";

// The shape the page's "Backend" section says the agent emits.
const PAGE_SHAPE = `{
  "type": "Stack",
  "children": [
    { "type": "MetricCard", "title": "Total revenue", "value": 184302 },
    { "type": "BarChart",   "data": [...] }
  ]
}`;

// The shape the demo bundle's agent is prompted to emit.
const AGENT_SHAPE = `{"ui":[
  {"Markdown":{"props":{"children":"## Q4 Sales Summary"}}},
  {"metric":{"props":{"label":"Total Revenue","value":"$1.2M"}}},
  {"pieChart":{"props":{"title":"Revenue by Segment","data":"[{\\"label\\":\\"Enterprise\\",\\"value\\":600000}]"}}}
]}`;

// The shape the fixed mode's UI kit parses.
const KIT_SHAPE = `{"ui":[
  {"MetricCard":{"props":{"title":"Total revenue","value":184302,"delta":0.07}}},
  {"BarChart":{"props":{"data":[{"label":"North","value":52000}]}}}
]}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/hashbrown" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page swaps the chat&apos;s assistant-message slot for a renderer
          that feeds the streaming reply to <code>@hashbrownai/react</code>.
          The parser turns partial JSON into values as it arrives, and a UI kit
          turns those into React components. The frontend code the page leaves
          out has been written in, but its three Hashbrown calls are kept
          exactly as published. The agent is the doc&apos;s own demo-bundle
          agent.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["(as published) Show me a sales dashboard."]}
            expect={
              <>
                <strong>An error is expected</strong>, on the first assistant
                message, before any JSON arrives. <code>useUiKit</code> is
                handed <code>{"{ catalog, value }"}</code> and calls{" "}
                <code>components.forEach</code> on <code>undefined</code>. Look
                for a red box reading{" "}
                <code>TypeError: Cannot read properties of undefined (reading &apos;forEach&apos;)</code>
                .
              </>
            }
            fail="A rendered dashboard, or a different error. Record what you see; it replaces this prediction."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Three shapes, none of which agree">
        <p>
          The page&apos;s <em>Backend</em> section, the doc&apos;s demo-bundle
          agent, and a correctly built Hashbrown kit for the page&apos;s catalog
          each expect a different reply.
        </p>
        <div className="mt-3 space-y-3">
          <CodeBlock code={PAGE_SHAPE} language="json" filename="What the page says the agent emits" />
          <CodeBlock code={AGENT_SHAPE} language="json" filename="What the bundle agent is prompted to emit" />
          <CodeBlock code={KIT_SHAPE} language="json" filename="What the fixed mode's kit parses" />
        </div>
        <p className="mt-3">
          The bundle agent uses lowercase names (<code>metric</code>,{" "}
          <code>pieChart</code>, <code>barChart</code>, <code>dealCard</code>,{" "}
          <code>Markdown</code>) and sends chart <code>data</code> as a JSON{" "}
          <em>string</em>. The page&apos;s catalog is <code>MetricCard</code>,{" "}
          <code>PieChart</code>, <code>BarChart</code>. Its renderer was written
          against the bundle&apos;s own frontend, which this route does not use.
        </p>
      </Callout>

      <Panel title="The fix — switch the demo to “fixed”">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A version with the Hashbrown calls corrected for 0.6.1: components
          exposed with <code>exposeComponent</code> and <code>s.*</code> prop
          schemas, <code>useUiKit({"{ components }"})</code>,{" "}
          <code>useJsonParser(content, kit.schema)</code>, and{" "}
          <code>kit.render(value)</code>. It also strips prose and code fences,
          falls back to the default message when there is no JSON, and
          registers suggestions inside its own provider.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["(fixed) Show me a sales dashboard."]}
            expect={
              <>
                No crash, two suggestion pills, and an empty assistant message.
                The kit only knows <code>Stack</code>, <code>MetricCard</code>,{" "}
                <code>BarChart</code> and <code>PieChart</code>. Nothing the
                bundle agent sends matches its schema, so the parser never
                produces a <code>ui</code> value and nothing renders. The fix
                is correct for the page&apos;s catalog. The agent&apos;s prompt
                is what does not match.
              </>
            }
            fail="A red error box. That would mean the hook calls themselves still fail."
          />
        </div>
        <div className="mt-4">
          <SourceCodeGroup files={[{ file: `${DIR}/hashbrown-fixed.tsx` }]} />
        </div>
      </Panel>

      <Panel title="Left as published — the Hashbrown calls">
        <Callout tone="warn" title="Not fixed on purpose">
          In <code>@hashbrownai/react</code> 0.6.1,{" "}
          <code>useJsonParser</code> takes a schema as its second argument,{" "}
          <code>useUiKit</code> takes <code>{"{ components }"}</code>, and its
          result is an object you call <code>.render(value)</code> on, not a
          React node. Each of the three published lines carries a{" "}
          <code>@ts-expect-error</code> so the build passes and the error shows
          at runtime. The slot assignment in the page component carries one
          too: CopilotKit 1.77 types <code>messageView.assistantMessage</code>{" "}
          as <code>typeof CopilotChatAssistantMessage</code>.
        </Callout>
        <div className="mt-4">
          <SourceCodeGroup
            files={[
              { file: `${DIR}/byoc-hashbrown-demo.tsx` },
              { file: `${DIR}/hashbrown-renderer.tsx` },
            ]}
          />
        </div>
      </Panel>

      <Panel title="The agent — from the doc's demo bundle">
        <p className="mb-4 text-sm text-slate-700 dark:text-slate-300">
          The page says only that the backend depends on your framework. Its
          demo &ldquo;Code&rdquo; tab publishes this agent, used here verbatim.
        </p>
        <SourceCodeGroup files={[{ file: "backend/agents/byoc_hashbrown_agent.py" }]} />
      </Panel>

      <Panel title="Written in — what the page leaves out">
        <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <code>MetricCard</code>, <code>PieChart</code>,{" "}
            <code>BarChart</code>, at the paths the renderer imports from
            (<code>./metric-card</code>, <code>./charts</code>)
          </li>
          <li>
            The <code>AssistantMessage</code> import, and the runtime route
          </li>
        </ul>
        <SourceCodeGroup
          files={[
            { file: "frontend/src/components/byoc-dashboard.tsx" },
            { file: "frontend/src/app/api/copilotkit-byoc-hashbrown/[[...slug]]/route.ts" },
          ]}
        />
      </Panel>

      <Panel title="Other things to know">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            The page&apos;s example output uses <code>Stack</code>, which its
            catalog omits. Hashbrown throws <code>Unknown element type</code>{" "}
            for any name it was not given.
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
