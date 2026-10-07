// Verbatim from the demo Code tab of https://docs.copilotkit.ai/pydantic-ai/generative-ui/a2ui/dynamic-schema (bundle: src/app/demos/declarative-gen-ui/chat.tsx).
"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useDeclarativeGenUISuggestions } from "./suggestions";

export function Chat() {
  useDeclarativeGenUISuggestions();
  return (
    <CopilotChat agentId="declarative-gen-ui" className="h-full rounded-2xl" />
  );
}
