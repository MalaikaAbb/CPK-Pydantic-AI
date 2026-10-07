// Verbatim from the demo Code tab of https://docs.copilotkit.ai/pydantic-ai/generative-ui/open-generative-ui (bundle: src/app/demos/open-gen-ui/chat.tsx).
"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useOpenGenUISuggestions } from "./suggestions";

export function Chat() {
  useOpenGenUISuggestions();
  return <CopilotChat agentId="open-gen-ui" className="flex-1 rounded-2xl" />;
}
