// From the demo Code tab of https://docs.copilotkit.ai/pydantic-ai/generative-ui/a2ui/dynamic-schema
// (bundle: src/app/api/copilotkit-declarative-gen-ui/route.ts). Verbatim except the
// `a2ui` block, which is removed; see the marked deviation below.
// Dedicated runtime for the Declarative Generative UI (A2UI — Dynamic Schema)
// cell. Splitting into its own endpoint (mirroring beautiful-chat) lets us set
// `a2ui.injectA2UITool: false` — the backend PydanticAI agent owns the
// `generate_a2ui` tool itself, so double-binding from the runtime would
// duplicate the tool slot and confuse the LLM.
//
// Mirrors showcase/integrations/langgraph-python/src/app/api/copilotkit-declarative-gen-ui/route.ts.

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { HttpAgent } from "@ag-ui/client";

const AGENT_URL = process.env.AGENT_URL || "http://localhost:8000";

const declarativeGenUiAgent = new HttpAgent({
  url: `${AGENT_URL}/a2ui_dynamic/`,
});

const runtime = new CopilotRuntime({
  // @ts-ignore -- see main route.ts
  agents: { "declarative-gen-ui": declarativeGenUiAgent },
  // harness deviation: the bundle's `a2ui: { injectA2UITool: false,
  // defaultCatalogId: "declarative-gen-ui-catalog" }` block is removed. This
  // repo follows the page's prose default path, under which the provider's
  // `a2ui={{ catalog }}` enables A2UI and injects `generate_a2ui` with no
  // runtime config. The bundle's opt-out path needs an agent-side tool whose
  // helper is never published (see backend/agents/a2ui_dynamic.py).
});

export const POST = async (req: NextRequest) => {
  try {
    const copilotHandler = createCopilotRuntimeHandler({
      runtime,
      basePath: "/api/copilotkit-declarative-gen-ui",
      mode: "single-route",
    });
    return await copilotHandler(req);
  } catch (error: unknown) {
    const e = error as { message?: string; stack?: string };
    return NextResponse.json(
      { error: e.message, stack: e.stack },
      { status: 500 },
    );
  }
};
