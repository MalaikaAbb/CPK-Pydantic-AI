import {
  CopilotKitIntelligence,
  CopilotRuntime,
  InMemoryAgentRunner,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { HttpAgent } from "@ag-ui/client";

/**
 * The Copilot Runtime, as the Quickstart now builds it.
 *
 * Three things moved when the docs switched to the v2 runtime surface, and all
 * three are load-bearing:
 *
 *   - The import is `@copilotkit/runtime/v2`, not `@copilotkit/runtime`. There
 *     is no `serviceAdapter` on this surface at all — `ExperimentalEmptyAdapter`
 *     belonged to the v1 GraphQL runtime and has no counterpart here.
 *   - `createCopilotRuntimeHandler` returns a plain fetch handler rather than a
 *     `{ handleRequest }` wrapper, so the route is just the verb exports below.
 *   - The file lives at `[[...slug]]/route.ts`, not `route.ts`. The handler
 *     serves a subtree — `/info`, agent runs, thread list/rename/delete — so a
 *     single-segment route would 404 everything except the bare URL.
 */

// Base URL of the Pydantic AI server. `backend/main.py` gives each agent its own
// `POST /<id>/` route, so an agent lives at `<base>/<id>/`. The Quickstart's
// single-agent sample points straight at "http://localhost:8000/", which is the
// same thing with one agent at the root.
const AGENT_BASE_URL =
  process.env.PYDANTIC_AI_AGENT_URL ?? "http://localhost:8000";

const agentUrl = (id: string) => `${AGENT_BASE_URL.replace(/\/$/, "")}/${id}/`;

// Ids are the keys of this object — that is what routes pass as `agentId`, and
// what the Multi-Agent Flows page routes between. They deliberately match the
// route paths in `backend/agents/__init__.py`, so the two sides cannot drift.
//
// `default` is an alias for `my_agent`: the Copilot Runtime doc calls out
// `default` as the agent picked up when nothing names one, which is exactly
// what router mode relies on.
const agents = {
  default: new HttpAgent({ url: agentUrl("my_agent") }),
  my_agent: new HttpAgent({ url: agentUrl("my_agent") }),
  weather_agent: new HttpAgent({ url: agentUrl("weather_agent") }),
  language_agent: new HttpAgent({ url: agentUrl("language_agent") }),
};

/**
 * Server-side only, and deliberately not `NEXT_PUBLIC_`. A project key prefixed
 * for the browser would ship in the bundle.
 */
const INTELLIGENCE_API_KEY = process.env.INTELLIGENCE_API_KEY;

/**
 * A SECOND, SEPARATE credential — and the one that unlocks the Threads Drawer.
 *
 * `INTELLIGENCE_API_KEY` authorizes the runtime against the platform: it is what
 * makes `/info` report `mode: "intelligence"` and what makes the thread REST
 * endpoints return real rows. It does NOT advertise a license.
 *
 * `licenseToken` is what does. The runtime builds a `licenseChecker` from it (or
 * from `COPILOTKIT_LICENSE_TOKEN`), and `/info` reports `licenseStatus` off that
 * checker — `"none"` when there is no checker at all. Client-side feature UIs
 * read that field: `<CopilotThreadsDrawer>` renders its locked "Threads are a
 * CopilotKit Intelligence feature" view unless the status is `valid` or
 * `expiring`, regardless of whether threads actually work.
 *
 * So a runtime can serve threads perfectly while every drawer in the app shows
 * an Upgrade button. Set both to avoid that.
 */
const LICENSE_TOKEN = process.env.COPILOTKIT_LICENSE_TOKEN;

/**
 * `CopilotRuntimeOptions` is a union, not one object with optional fields:
 * Intelligence mode requires both `intelligence` and `identifyUser`, and SSE
 * mode permits neither. So the two shapes are built separately rather than
 * spread conditionally into one literal.
 *
 * Without a key the runtime falls back to SSE with an in-memory runner. Chat
 * still works everywhere in this harness; Threads and the Inspector's thread
 * tab stay locked, and the key is never read.
 */
function buildRuntime(): CopilotRuntime {
  if (!INTELLIGENCE_API_KEY) {
    return new CopilotRuntime({
      agents,
      runner: new InMemoryAgentRunner(),
      ...(LICENSE_TOKEN ? { licenseToken: LICENSE_TOKEN } : {}),
    });
  }

  return new CopilotRuntime({
    agents,
    ...(LICENSE_TOKEN ? { licenseToken: LICENSE_TOKEN } : {}),
    intelligence: new CopilotKitIntelligence({
      // apiUrl and wsUrl default to the managed platform — leave them unset.
      apiKey: INTELLIGENCE_API_KEY,
    }),
    // Threads are per-user. Without this, every visitor shares one history.
    // `Providers` sends these headers so the harness has a stable identity to
    // key threads on; a real app would read them from a verified session, which
    // is what the Headless Threads doc's `verifyAppSession` stands in for.
    identifyUser: (request) => ({
      id: request.headers.get("x-user-id") ?? "anonymous",
      name: request.headers.get("x-user-name") ?? "Anonymous",
    }),
  });
}

const handler = createCopilotRuntimeHandler({
  runtime: buildRuntime(),
  basePath: "/api/copilotkit",
});

// Four verbs, not the Quickstart's two. GET serves `/info` and the thread list,
// POST runs agents, and PATCH/DELETE are how the Headless Threads page renames,
// archives, and deletes — without them `renameThread` and friends 405.
export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as DELETE,
};
