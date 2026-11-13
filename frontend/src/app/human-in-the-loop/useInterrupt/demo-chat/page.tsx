"use client";

import {
  CopilotChat,
  CopilotChatConfigurationProvider,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { ApprovalInterrupt } from "../approval-interrupt";

/**
 * Harness glue: a chat on the page's `interrupt_agent`, with the page's
 * `ApprovalInterrupt` mounted in the same chat configuration so both address
 * that agent.
 *
 * What is missing on purpose: the page's frontend `schedule_meeting` tool (a
 * `useFrontendTool` with a Promise handler). Its snippet is not published for
 * pydantic-ai, so it is not written here. The agent's prompt still asks for
 * it. And Pydantic AI's AG-UI adapter emits no interrupt outcome, so
 * `ApprovalInterrupt` has nothing to render.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/human-in-the-loop/useInterrupt" subtitle="agent: interrupt_agent · schedule_meeting not registered (unpublished)">
      <CopilotChatConfigurationProvider agentId="interrupt_agent">
        <ApprovalInterrupt />
        <CopilotChat agentId="interrupt_agent" />
      </CopilotChatConfigurationProvider>
    </DemoFrame>
  );
}
