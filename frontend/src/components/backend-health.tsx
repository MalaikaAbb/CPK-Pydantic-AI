import { getHealth } from "@/lib/health";

import { RecheckButton } from "./recheck-button";

function Row({
  ok,
  label,
  detail,
  neutral,
}: {
  ok: boolean;
  label: string;
  detail: string;
  neutral?: boolean;
}) {
  const dot = neutral ? "bg-slate-400" : ok ? "bg-emerald-500" : "bg-rose-500";
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} aria-hidden />
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {label}
        </p>
        <p className="break-words text-xs text-slate-500 dark:text-slate-400">
          {detail}
        </p>
      </div>
    </li>
  );
}

/**
 * Server component: probes the agent server during render, no client fetch.
 *
 * Two processes means two ways to be broken, and they look identical in the
 * chat — this separates "the agent server is not running" from "the agent ran
 * and failed".
 */
export async function BackendHealth() {
  const health = await getHealth();

  return (
    <div>
      <ul className="space-y-3">
        <Row
          ok
          label="Next.js app + Copilot Runtime"
          detail="Serving this page, so the frontend and /api/copilotkit route are up."
        />
        <Row
          ok={health.agent.ok}
          label="Pydantic AI agent server"
          detail={health.agent.detail}
        />
        <Row
          ok={health.agentIds.length > 0}
          label="Agents mounted"
          detail={
            health.agentIds.length
              ? health.agentIds.join(", ")
              : "None reported — start the backend with `uv run main.py`."
          }
        />
        <Row
          ok={health.licenseKeySet}
          neutral={!health.licenseKeySet}
          label="Enterprise Intelligence license"
          detail={
            health.licenseKeySet
              ? "Key present."
              : "Not set — optional, no route in this harness needs one."
          }
        />
      </ul>

      <RecheckButton />
    </div>
  );
}
