import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  InMemoryAgentRunner,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

/**
 * Harness-authored. The JSON Render page's frontend uses
 * `runtimeUrl="/api/copilotkit-byoc-json-render"` with `agent="byoc_json_render"`, but the
 * page never shows this route. It is the plainest possible runtime: one agent,
 * no middleware, SSE with an in-memory runner.
 *
 * The agent behind it is the doc's own demo-bundle agent
 * (backend/agents/byoc_json_render_agent.py), served at `/byoc_json_render/` by backend/main.py.
 */
const AGENT_BASE_URL =
  process.env.PYDANTIC_AI_AGENT_URL ?? "http://localhost:8000";

const handler = createCopilotRuntimeHandler({
  runtime: new CopilotRuntime({
    agents: {
      byoc_json_render: new HttpAgent({
        url: `${AGENT_BASE_URL.replace(/\/$/, "")}/byoc_json_render/`,
      }),
    },
    runner: new InMemoryAgentRunner(),
  }),
  basePath: "/api/copilotkit-byoc-json-render",
});

export { handler as GET, handler as POST };
