import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/tool-based";

// The page's two `src/agents/chart_agent.py` excerpts, as printed (step 1, then
// step 2). Shown for comparison only; the route runs the Code tab's agent.
const PRINTED_AGENT_STEP_1 = `from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIResponsesModel

agent = Agent(
    model=OpenAIResponsesModel("gpt-6-luna"),
    system_prompt=SYSTEM_PROMPT,
)`;

const PRINTED_AGENT_STEP_2 = `SYSTEM_PROMPT = """
You are a data visualization assistant.

When the user asks for a chart, call \`render_bar_chart\` with a concise
title and a \`data\` array of \`{label, value}\` items.

Keep chat responses brief — let the chart do the talking.
"""`;

// The page's headless-chat fragment, as printed. Not run here: it needs a
// headless chat around it that the page does not show.
const PRINTED_HEADLESS = `import { CopilotChatToolCallsView } from "@copilotkit/react-core/v2";

<CopilotChatToolCallsView message={assistantMessage} messages={allMessages} />;`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/tool-based" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Two chart components are registered with <code>useComponent</code>{" "}
          under tool names (<code>render_bar_chart</code>,{" "}
          <code>render_pie_chart</code>), each with a Zod schema that becomes
          the tool&apos;s parameters. The Pydantic AI agent declares no tools:
          the AG-UI request carries the frontend ones, and the system prompt
          tells the model when to call them. The call&apos;s arguments are
          passed straight to the component as props.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show me a bar chart of quarterly revenue: Q1 120, Q2 150, Q3 170, Q4 210.",
              "Show our traffic sources as a pie chart: search 45, social 25, direct 20, email 10.",
            ]}
            expect="A titled bar chart (then a pie chart) renders inline in the chat, with one short line of text from the agent."
            fail="Only prose, no chart (the model never called the tool); an empty chart (called with no arguments); or a run error naming gen-ui-tool-based (the runtime route or backend is missing the agent)."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="What differs from the page">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Suggestions are commented out.</strong> The bundle&apos;s{" "}
            <code>page.tsx</code> imports <code>useSuggestions</code> from{" "}
            <code>./suggestions</code>, which the Code tab does not publish. The
            import and its call are commented out rather than rewritten, so the
            chat shows no suggestion pills.
          </li>
          <li>
            <strong>The agent is the Code tab&apos;s, not the prose&apos;s.</strong>{" "}
            The page prints <code>chart_agent.py</code> as two excerpts: the
            constructor first, then <code>SYSTEM_PROMPT</code>. Pasted in that
            order the module raises <code>NameError</code>, and the printed
            prompt mentions only the bar chart although the demo registers a
            pie chart too. The Code tab&apos;s <code>gen_ui_tool_based.py</code>{" "}
            is complete and covers both, so it runs here.
          </li>
          <li>
            <strong>Headless rendering is shown, not run.</strong> The{" "}
            <code>CopilotChatToolCallsView</code> snippet is a fragment
            (<code>assistantMessage</code>, <code>allMessages</code>) with no
            headless chat around it.
          </li>
          <li>
            The model id is <code>gpt-6-luna</code>, as published; not checked
            against OpenAI.
          </li>
        </ul>
      </Callout>

      <Panel title="The frontend — demo Code tab">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/demo.tsx` },
            { file: `${DIR}/bar-chart.tsx` },
            { file: `${DIR}/pie-chart.tsx` },
          ]}
        />
      </Panel>

      <Panel title="The agent — demo Code tab">
        <SourceCodeGroup files={[{ file: "backend/agents/gen_ui_tool_based.py" }]} />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Registered on the main runtime route as <code>gen-ui-tool-based</code>{" "}
          → <code>/gen_ui_tool_based/</code>, the same mapping as the
          bundle&apos;s runtime route.
        </p>
      </Panel>

      <Panel title="Printed on the page, not run">
        <div className="space-y-3">
          <CodeBlock code={PRINTED_AGENT_STEP_1} language="python" filename="src/agents/chart_agent.py — step 1" />
          <CodeBlock code={PRINTED_AGENT_STEP_2} language="python" filename="src/agents/chart_agent.py — step 2" />
          <CodeBlock code={PRINTED_HEADLESS} language="tsx" filename="Rendering in a headless chat" />
        </div>
      </Panel>
    </>
  );
}
