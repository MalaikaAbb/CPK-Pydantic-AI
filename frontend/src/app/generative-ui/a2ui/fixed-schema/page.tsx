import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

// What pydantic-ai's own bundle renders for the Book button. This route runs
// the Mastra bundle's renderers instead; see the callout below.
const PYDANTIC_AI_BUTTON = `// pydantic-ai bundle — src/app/demos/a2ui-fixed-schema/a2ui/renderers.tsx
Button: ({ props, children }) => (
  <UIButton className="w-full">
    {props.child ? children(props.child) : null}
  </UIButton>
),`;

// The page prose's registration snippets, which differ from the bundle's route.
const PROSE_REGISTRATION = `// app/page.tsx — prose
<CopilotKit runtimeUrl="/api/copilotkit" a2ui={{ catalog: myCatalog }}>
  {children}
</CopilotKit>

// app/api/copilotkit/route.ts — prose
const runtime = new CopilotRuntime({
  agents: { "a2ui-fixed-schema": agent },
  a2ui: { injectA2UITool: false, agents: ["a2ui-fixed-schema"] },
});`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui/fixed-schema" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A flight card whose component tree is authored once, as JSON, and
          loaded by the agent at startup. The model only fills in four data
          fields. The <code>display_flight</code> tool returns an{" "}
          <code>a2ui_operations</code> container (<code>createSurface</code>,{" "}
          <code>updateComponents</code>, <code>updateDataModel</code>), and the
          A2UI middleware turns it into a surface drawn from the page&apos;s
          catalog.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Find me a flight from SFO to JFK on United for $289."]}
            expect={
              <>
                A card titled <em>Flight Details</em> appears in the chat,
                showing <code>SFO → JFK</code>, a <code>UNITED</code> badge and{" "}
                <code>$289</code>. Clicking <em>Book flight</em> turns the button
                green and changes it to <em>Booked</em>. The agent hears nothing
                about the click, because the Python side has no action handler.
              </>
            }
            fail={
              <>
                No card, just text, means the middleware did not see the
                operations. Check that the runtime route is the bundle&apos;s, with{" "}
                <code>injectA2UITool: false</code>. If the card shows with blank
                codes, airline and price, the bindings did not resolve. Check that{" "}
                <code>frontend/node_modules/zod</code> is 3.x, not 4.x.
              </>
            }
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/demo.tsx" },
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/chat.tsx" },
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/suggestions.ts" },
          ]}
        />
      </Panel>

      <Panel
        title="The catalog"
        description="Definitions, renderers and the createCatalog call. The renderers are the Mastra bundle's; everything else is pydantic-ai's."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/a2ui/definitions.ts" },
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/a2ui/renderers.tsx" },
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/a2ui/catalog.ts" },
          ]}
        />
      </Panel>

      <Panel title="The runtime route and the agent">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit-a2ui-fixed-schema/route.ts" },
            { file: "backend/agents/a2ui_fixed.py" },
            { file: "backend/agents/a2ui_schemas/flight_schema.json" },
          ]}
        />
      </Panel>

      <Callout tone="warn" title="booked_schema.json is borrowed from another framework's bundle">
        <code>a2ui_fixed.py</code> loads <code>a2ui_schemas/booked_schema.json</code>{" "}
        at import time, but pydantic-ai&apos;s bundle does not publish that
        file. Without it the backend raises <code>FileNotFoundError</code> on
        import and every agent goes down. The copy here is the google-adk
        bundle&apos;s, byte for byte. The agent never uses it; see{" "}
        <code>backend/agents/a2ui_schemas/README.md</code>.
      </Callout>

      <Callout tone="warn" title="Why this repo pins zod 3">
        The A2UI binder decides which props to resolve by reading zod 3
        internals (<code>_def.typeName</code>). The page&apos;s install step,{" "}
        <code>npm install @copilotkit/a2ui-renderer zod</code>, now pulls in
        zod 4, where that field does not exist. Each{" "}
        <code>{"{ path }"}</code> binding would then reach the renderer
        unresolved, and the renderers&apos; <code>s()</code> helper would turn
        it into an empty string: a card with blank fields and no error. This
        repo pins <code>zod@3.25.76</code>, the copy the renderer itself
        depends on, so the definitions keep the doc&apos;s{" "}
        <code>import {"{ z }"} from &quot;zod&quot;</code> unchanged.
      </Callout>

      <Callout tone="info" title="Mastra's renderers, not pydantic-ai's">
        <p>
          pydantic-ai&apos;s bundle renders the Book button as a plain button
          with no click handler. Its comment says the button stays inert
          &ldquo;until the Python SDK exposes <code>action_handlers=</code>&rdquo;.
          The Mastra bundle&apos;s otherwise identical <code>renderers.tsx</code>{" "}
          adds an <code>ActionButton</code>. It calls the bound action and
          switches to a <em>Booked</em> state. This route uses Mastra&apos;s.
        </p>
        <div className="mt-3">
          <CodeBlock code={PYDANTIC_AI_BUTTON} language="tsx" filename="The pydantic-ai bundle's Button, for comparison" />
        </div>
      </Callout>

      <Callout tone="info" title="The prose and the bundle register the runtime differently">
        <p>
          The page&apos;s &ldquo;Registering the runtime&rdquo; snippets put the
          catalog on a provider at <code>/api/copilotkit</code> and pass{" "}
          <code>agents: [&quot;a2ui-fixed-schema&quot;]</code> in the{" "}
          <code>a2ui</code> block. The bundle uses a dedicated route,{" "}
          <code>/api/copilotkit-a2ui-fixed-schema</code>, with only{" "}
          <code>injectA2UITool: false</code>. This repo runs the bundle&apos;s.
        </p>
        <div className="mt-3">
          <CodeBlock code={PROSE_REGISTRATION} language="tsx" filename="The page prose's version" />
        </div>
      </Callout>

      <Panel title="Leaf components" description="The bundle's inline-cloned ShadCN primitives, verbatim.">
        <SourceCode file="frontend/src/app/generative-ui/a2ui/fixed-schema/_components/button.tsx" />
      </Panel>
    </>
  );
}
