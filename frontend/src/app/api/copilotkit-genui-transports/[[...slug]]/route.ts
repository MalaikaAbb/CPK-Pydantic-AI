import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { HttpAgent } from "@ag-ui/client";

// The Transports page's `app/api/copilotkit/route.ts`. The page prints only the
// `CopilotRuntime` call, with an `agent` it never defines.
//
// Harness glue (ported from the agno harness): `agent` (this repo's Pydantic AI
// `genui` agent, standing in for the page's undefined `agent`) and the handler.
// The page's "Only some agents" sample lists a `shop` agent in `agentIds`, but
// no such agent is printed, so none is registered.
const AGENT_BASE_URL =
  process.env.PYDANTIC_AI_AGENT_URL ?? "http://localhost:8000";
const agent = new HttpAgent({ url: `${AGENT_BASE_URL.replace(/\/$/, "")}/genui/` });

//#region transports-runtime
const runtime = new CopilotRuntime({
  agents: { default: agent },
  generativeUI: true,
});
//#endregion

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-genui-transports",
});

export const GET = handler;
export const POST = handler;
