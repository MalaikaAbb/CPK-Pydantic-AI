"use client";

import { CopilotChat, useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The doc's `sayHello` tool, registered on this page.
 *
 * Pydantic AI speaks AG-UI natively, so a tool registered here is forwarded to
 * the agent automatically — nothing is declared in `backend/`. Page-scoped
 * registration is therefore safe: the tool only exists while this route is
 * mounted, and `my_agent` knows nothing about it the rest of the time.
 */
export default function Page() {
  useFrontendTool({
    name: "sayHello",
    description: "Say hello to the user",
    parameters: z.object({
      name: z.string().describe("The name of the user to say hello to"),
    }),
    handler: async ({ name }) => {
      alert(`Hello, ${name}!`);
      return `Said hello to ${name}!`;
    },
  });

  return (
    <DemoFrame
      parentPath="/frontend-tools"
      subtitle="sayHello runs in this browser tab"
    >
      <CopilotChat
        agentId="my_agent"
        labels={{
          welcomeMessageText:
            'Try "Say hello to Damien" — the handler fires a browser alert.',
        }}
      />
    </DemoFrame>
  );
}
