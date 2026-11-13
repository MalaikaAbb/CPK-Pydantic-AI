// Verbatim from the demo Code tab of https://docs.copilotkit.ai/pydantic-ai/generative-ui/tool-based (bundle: src/app/demos/gen-ui-tool-based/page.tsx).
// One harness edit, marked below: the bundle imports `useSuggestions` from
// "./suggestions", a file the Code tab does not publish. The import and its
// call are commented out (not reimplemented), so the chat has no suggestion
// pills. Everything else is as published.
"use client";

import React from "react";
import {
  CopilotChat,
  CopilotKit,
  useComponent,
} from "@copilotkit/react-core/v2";
import { BarChart, barChartPropsSchema } from "./bar-chart";
import { PieChart, pieChartPropsSchema } from "./pie-chart";
// harness: "./suggestions" is not in the Code tab, so this import is commented out.
// import { useSuggestions } from "./suggestions";

function Chat() {
  useComponent({
    name: "render_bar_chart",
    description: "Display a bar chart with labeled numeric values.",
    parameters: barChartPropsSchema,
    render: BarChart,
  });

  useComponent({
    name: "render_pie_chart",
    description: "Display a pie chart with labeled numeric values.",
    parameters: pieChartPropsSchema,
    render: PieChart,
  });

  // harness: see the import above.
  // useSuggestions();

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="h-full w-full max-w-4xl">
        <CopilotChat
          agentId="gen-ui-tool-based"
          className="h-full rounded-2xl"
        />
      </div>
    </div>
  );
}

export default function ControlledGenUiDemo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="gen-ui-tool-based">
      <Chat />
    </CopilotKit>
  );
}
