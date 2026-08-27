import "server-only";

/**
 * Reachability + configuration snapshot for the connection panel.
 *
 * Server-side by necessity on both counts: the browser has no route to the
 * Pydantic AI process (and should not have one), and `INTELLIGENCE_API_KEY` is a
 * server secret that must never reach the bundle.
 *
 * Two things are probed:
 *
 *   - `GET {AGENT_URL}/health` — the endpoint `backend/main.py` serves beside
 *     the agent routes. The AG-UI routes themselves are POST-only, so they
 *     cannot be probed harmlessly; /health also reports which ids mounted.
 *   - `GET /api/copilotkit/info` — the runtime's own discovery route. It is how
 *     the frontend negotiates its transport, so a 200 here is what proves the
 *     multi-route handler is mounted at the catch-all path. Its `mode` field
 *     ("sse" | "intelligence") is also the honest answer to "is Intelligence
 *     actually on": a key can be set and still unread, and SSE mode already
 *     reports `threadEndpoints.list: true` from its in-memory runner, so the
 *     flags alone would read as a false positive.
 */

export interface ThreadEndpoints {
  list?: boolean;
  inspect?: boolean;
  mutations?: boolean;
  realtimeMetadata?: boolean;
}

/** What the runtime reports it is running as. */
export type RuntimeMode = "sse" | "intelligence";

export interface HealthReport {
  agent: { ok: boolean; detail: string };
  runtime: { ok: boolean; detail: string };
  /** Agent ids the Python server reported mounting. */
  backendAgentIds: string[];
  agentBaseUrl: string;
  /** Whether a project key is configured on the server. */
  intelligenceKeySet: boolean;
  /** The runtime's own answer, from `/info`. Absent when the probe failed. */
  mode?: RuntimeMode;
  /**
   * `/info`'s `licenseStatus`. A SEPARATE axis from `mode`: it reflects the
   * runtime's `licenseToken`, not its Intelligence key, and it is what
   * client-side feature UIs (the Threads Drawer) gate on.
   */
  licenseStatus?: string;
  /** Whether a license token is configured on the server. */
  licenseTokenSet: boolean;
  /** What `/info` says the runtime can actually do with threads. */
  threadEndpoints?: ThreadEndpoints;
  /** Agent ids the runtime reported. */
  agentIds: string[];
}

export const AGENT_BASE_URL =
  process.env.PYDANTIC_AI_AGENT_URL ?? "http://localhost:8000";

/** The app's own origin, for the server-side `/info` probe. */
function selfOrigin(): string {
  const port = process.env.PORT ?? "3000";
  return process.env.NEXT_PUBLIC_SITE_ORIGIN ?? `http://127.0.0.1:${port}`;
}

async function probeAgent(): Promise<{
  agent: HealthReport["agent"];
  backendAgentIds: string[];
}> {
  const healthUrl = `${AGENT_BASE_URL.replace(/\/$/, "")}/health`;
  try {
    const res = await fetch(healthUrl, {
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        agent: { ok: false, detail: `${healthUrl} returned ${res.status}` },
        backendAgentIds: [],
      };
    }
    const body = (await res.json()) as { status?: string; agents?: string[] };
    const ids = body.agents ?? [];
    return {
      agent: {
        ok: true,
        detail: `200 from ${healthUrl} — status "${body.status}", ${ids.length} agent route(s).`,
      },
      backendAgentIds: ids,
    };
  } catch (error) {
    return {
      agent: {
        ok: false,
        detail:
          error instanceof Error
            ? `${healthUrl} unreachable — ${error.message}`
            : `${healthUrl} unreachable`,
      },
      backendAgentIds: [],
    };
  }
}

async function probeRuntime(): Promise<{
  runtime: HealthReport["runtime"];
  mode?: RuntimeMode;
  licenseStatus?: string;
  threadEndpoints?: ThreadEndpoints;
  agentIds: string[];
}> {
  const infoUrl = `${selfOrigin()}/api/copilotkit/info`;
  try {
    const res = await fetch(infoUrl, {
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        runtime: {
          ok: false,
          detail: `${infoUrl} returned ${res.status} — the handler is probably still at route.ts rather than [[...slug]]/route.ts.`,
        },
        agentIds: [],
      };
    }
    const body = (await res.json()) as {
      agents?: Record<string, unknown> | { id?: string; name?: string }[];
      mode?: RuntimeMode;
      licenseStatus?: string;
      threadEndpoints?: ThreadEndpoints;
    };
    const agentIds = Array.isArray(body.agents)
      ? body.agents.map((a) => a?.id ?? a?.name ?? "?")
      : Object.keys(body.agents ?? {});
    return {
      runtime: {
        ok: true,
        detail: `200 from /api/copilotkit/info — mode "${body.mode}", ${agentIds.length} agent(s) registered.`,
      },
      mode: body.mode,
      licenseStatus: body.licenseStatus,
      threadEndpoints: body.threadEndpoints,
      agentIds,
    };
  } catch (error) {
    return {
      runtime: {
        ok: false,
        detail:
          error instanceof Error
            ? `${infoUrl} unreachable — ${error.message}`
            : `${infoUrl} unreachable`,
      },
      agentIds: [],
    };
  }
}

export async function getHealth(): Promise<HealthReport> {
  const [agentProbe, runtimeProbe] = await Promise.all([
    probeAgent(),
    probeRuntime(),
  ]);

  return {
    agent: agentProbe.agent,
    backendAgentIds: agentProbe.backendAgentIds,
    runtime: runtimeProbe.runtime,
    agentBaseUrl: AGENT_BASE_URL,
    intelligenceKeySet: Boolean(process.env.INTELLIGENCE_API_KEY),
    mode: runtimeProbe.mode,
    licenseStatus: runtimeProbe.licenseStatus,
    licenseTokenSet: Boolean(process.env.COPILOTKIT_LICENSE_TOKEN),
    threadEndpoints: runtimeProbe.threadEndpoints,
    agentIds: runtimeProbe.agentIds,
  };
}
