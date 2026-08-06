import "server-only";

/**
 * Reachability + configuration snapshot for the landing page's connection panel.
 *
 * Server-side by necessity: the browser has no route to the Pydantic AI process
 * (and should not have one), so a client-side probe would report a failure even
 * on a correctly configured install.
 */

export interface HealthReport {
  agent: { ok: boolean; detail: string };
  /** Agent ids the server reported, when it answered. */
  agentIds: string[];
  agentBaseUrl: string;
  licenseKeySet: boolean;
}

export const AGENT_BASE_URL =
  process.env.PYDANTIC_AI_AGENT_URL ?? "http://localhost:8000";

export async function getHealth(): Promise<HealthReport> {
  // `backend/main.py` serves /health beside the mounted AG-UI apps. The AG-UI
  // endpoints themselves are POST-only, so they cannot be probed harmlessly.
  const healthUrl = `${AGENT_BASE_URL.replace(/\/$/, "")}/health`;

  let agent: HealthReport["agent"];
  let agentIds: string[] = [];

  try {
    const res = await fetch(healthUrl, {
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (res.ok) {
      const body = (await res.json()) as { agents?: string[] };
      agentIds = body.agents ?? [];
      agent = { ok: true, detail: `${res.status} from ${healthUrl}` };
    } else {
      agent = { ok: false, detail: `${healthUrl} returned ${res.status}` };
    }
  } catch (error) {
    agent = {
      ok: false,
      detail:
        error instanceof Error
          ? `${healthUrl} unreachable — ${error.message}`
          : `${healthUrl} unreachable`,
    };
  }

  return {
    agent,
    agentIds,
    agentBaseUrl: AGENT_BASE_URL,
    licenseKeySet: Boolean(process.env.NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY),
  };
}
