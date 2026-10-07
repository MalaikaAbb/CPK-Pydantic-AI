// Verbatim from the demo Code tab of https://docs.copilotkit.ai/pydantic-ai/generative-ui/a2ui/fixed-schema (bundle: src/app/demos/a2ui-fixed-schema/chat.tsx).
"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useA2UIFixedSchemaSuggestions } from "./suggestions";

export function Chat() {
  useA2UIFixedSchemaSuggestions();
  return (
    <CopilotChat agentId="a2ui-fixed-schema" className="h-full rounded-2xl" />
  );
}
