import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  InMemoryAgentRunner,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

/**
 * Harness-authored. The Hashbrown page's frontend uses
 * `runtimeUrl="/api/copilotkit-byoc-hashbrown"` with `agent="byoc_hashbrown"`, but the
 * page never shows this route. It is the plainest possible runtime: one agent,
 * no middleware, SSE with an in-memory runner.
 *
 * The agent behind it is the doc's own demo-bundle agent
 * (backend/agents/byoc_hashbrown_agent.py), served at `/byoc_hashbrown/` by backend/main.py.
 */
const AGENT_BASE_URL =
  process.env.PYDANTIC_AI_AGENT_URL ?? "http://localhost:8000";

const handler = createCopilotRuntimeHandler({
  runtime: new CopilotRuntime({
    agents: {
      byoc_hashbrown: new HttpAgent({
        url: `${AGENT_BASE_URL.replace(/\/$/, "")}/byoc_hashbrown/`,
      }),
    },
    runner: new InMemoryAgentRunner(),
  }),
  basePath: "/api/copilotkit-byoc-hashbrown",
});

export { handler as GET, handler as POST };
