// The MCP Apps page's `app/api/copilotkit/[[...slug]]/route.ts`, with two
// labelled harness changes:
//
//  - The page's `BuiltInAgent({ model: "openai/gpt-6-luna", prompt: "You are a
//    helpful assistant." })` is swapped for this repo's Pydantic AI agent with
//    the same prompt (backend/agents/mcp_apps_agent.py), reached through
//    HttpAgent like every other route here. The harness runs its own
//    framework's agents, never CopilotKit's BuiltInAgent.
//  - `basePath` is `/api/copilotkit-mcp-apps`, not `/api/copilotkit`: the
//    runtime applies the MCP Apps middleware to every registered agent, so it
//    gets its own endpoint instead of the shared one.
//
// Everything else — `mcpApps.servers`, the `serverId`, the in-memory runner,
// the GET/POST exports — is the page's. The page's server URL
// (http://localhost:3108/mcp) is a server you start yourself (README §9.30).
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { HttpAgent } from "@ag-ui/client";

const AGENT_BASE_URL =
  process.env.PYDANTIC_AI_AGENT_URL ?? "http://localhost:8000";

// 1. Create your agent
// harness: Pydantic AI agent in place of the page's BuiltInAgent (see above).
const agent = new HttpAgent({
  url: `${AGENT_BASE_URL.replace(/\/$/, "")}/mcp_apps/`,
});

// 2. Create a service adapter, empty if not relevant

// 3. Create the runtime with mcpApps configured
const runtime = new CopilotRuntime({
  agents: {
    default: agent,
  },
  mcpApps: {
    servers: [
      {
        type: "http",
        url: "http://localhost:3108/mcp",
        serverId: "my-server", // Recommended: stable identifier
      },
    ],
  },
  runner: new InMemoryAgentRunner(),
});

// 4. Create the API route
const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-mcp-apps",
});

export const GET = handler;
export const POST = handler;
