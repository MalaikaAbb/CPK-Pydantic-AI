// Verbatim from the demo Code tab of https://docs.copilotkit.ai/pydantic-ai/generative-ui/json-render (bundle: src/app/demos/declarative-json-render/chat.tsx).
"use client";

import {
  CopilotChat,
  CopilotChatAssistantMessage,
} from "@copilotkit/react-core/v2";
import { JsonRenderAssistantMessage } from "./json-render-renderer";
import { useByocJsonRenderSuggestions } from "./suggestions";

export const AGENT_ID = "byoc_json_render";

export function Chat() {
  useByocJsonRenderSuggestions();

  return (
    <CopilotChat
      agentId={AGENT_ID}
      className="h-full rounded-2xl"
      messageView={{
        assistantMessage:
          JsonRenderAssistantMessage as unknown as typeof CopilotChatAssistantMessage,
      }}
    />
  );
}
