"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { YourMainContent } from "../essay-tool";

/**
 * The page's frontend tool, registered on the app-wide provider, beside a
 * chat on `hitl_agent`.
 *
 * The page's `YourMainContent` has no return statement (its body is `// ...`
 * around the hook), so it cannot be rendered as JSX. It is called here as a
 * plain function instead, which runs its hook as part of this component.
 */
export default function Page() {
  YourMainContent();

  return (
    <DemoFrame
      parentPath="/human-in-the-loop/agent"
      subtitle="agent: hitl_agent · write_essay on both sides"
    >
      <CopilotChat
        agentId="hitl_agent"
        labels={{
          welcomeMessageText:
            'Try "Write an essay about the benefits of AI."',
        }}
      />
    </DemoFrame>
  );
}
