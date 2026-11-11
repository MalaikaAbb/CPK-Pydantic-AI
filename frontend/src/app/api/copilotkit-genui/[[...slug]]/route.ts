import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { HttpAgent } from "@ag-ui/client";

// Harness glue: the runtime every Components and surfaces demo points at.
//
// The pages give the provider `runtimeUrl="/api/copilotkit"` and leave the
// runtime alone. When a run carries a catalog, the runtime adds `render_ui` and
// the guide itself. This route is kept apart from `/api/copilotkit` so the
// catalog never reaches the other routes' agents (the CPK-LangGraph-TS /
// aws-strands-ts pattern; ported from the agno harness). The agent is this
// repo's Pydantic AI `genui` agent (backend/agents/genui_agent.py), served at
// `/genui/` by backend/main.py and registered as `default` because the pages'
// providers name no agent.
const AGENT_BASE_URL =
  process.env.PYDANTIC_AI_AGENT_URL ?? "http://localhost:8000";

const runtime = new CopilotRuntime({
  agents: {
    default: new HttpAgent({ url: `${AGENT_BASE_URL.replace(/\/$/, "")}/genui/` }),
  },
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-genui",
});

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };
