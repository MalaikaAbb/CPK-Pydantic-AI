import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";
import { NextRequest } from "next/server";

// Base URL of the Pydantic AI server. `backend/main.py` mounts each agent's
// `to_ag_ui()` app under its own path, so an agent lives at `<base>/<id>/`.
// The Quickstart's single-agent sample points straight at "http://localhost:8000/",
// which is the same thing with one agent mounted at the root.
const AGENT_BASE_URL =
  process.env.PYDANTIC_AI_AGENT_URL ?? "http://localhost:8000";

const agentUrl = (id: string) => `${AGENT_BASE_URL.replace(/\/$/, "")}/${id}/`;

// The model provider key never reaches the browser: the Python process holds
// it, and this route is the only thing that talks to that process.
const serviceAdapter = new ExperimentalEmptyAdapter();

// Ids are the keys of this object — that is what routes pass as `agentId`, and
// what the Multi-Agent Flows page routes between. They deliberately match the
// mount paths in `backend/agents/__init__.py`, so the two sides cannot drift.
//
// `default` is an alias for `my_agent`: the Copilot Runtime doc calls out
// `default` as the agent picked up when nothing names one, which is exactly
// what router mode relies on.
const runtime = new CopilotRuntime({
  agents: {
    default: new HttpAgent({ url: agentUrl("my_agent") }),
    my_agent: new HttpAgent({ url: agentUrl("my_agent") }),
    weather_agent: new HttpAgent({ url: agentUrl("weather_agent") }),
    language_agent: new HttpAgent({ url: agentUrl("language_agent") }),
  },
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
