"use client";

import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { rootInspectorSetting } from "@/lib/inspector";

/**
 * One provider for the whole app, so chat state survives navigation between
 * test routes.
 *
 * The Quickstart wraps the app in `<CopilotKit runtimeUrl agent="my_agent">`,
 * which locks every surface to one agent. This repo registers four, so the
 * provider names none of them and each route passes the `agentId` it wants —
 * see the Multi-Agent Flows route for what that trade-off means.
 *
 * Three props worth explaining:
 *
 * `useSingleEndpoint={false}` matches the multi-route handler at
 * `api/copilotkit/[[...slug]]/route.ts`: the client addresses `/info`,
 * `/agent/run` and the thread endpoints as separate paths instead of posting
 * everything to one URL. The Quickstart passes it for a different reason — it
 * uses `<CopilotKit>`, which pins the flag to `true` internally, and that 404s
 * against a multi-route handler while `/info` still returns 200, so the app
 * looks connected and never answers. On `<CopilotKitProvider>` an omitted flag
 * would mean `auto` (probe `/info`, match whatever it serves); passing `false`
 * states the transport outright and skips the probe.
 *
 * `headers` carries the identity `identifyUser` reads on the runtime. Threads
 * are per-user, so without it every visitor of a deployed copy would share one
 * history. A real app would derive this from a verified session; a local test
 * harness has no session, so it sends a fixed demo identity you can override
 * with NEXT_PUBLIC_DEMO_USER_ID to watch two thread lists diverge.
 *
 * `enableInspector` decides whether this provider mounts the Inspector. In
 * 1.77 `CopilotKitProvider` reads only `enableInspector`; the `showDevConsole`
 * this file used to pass was ignored, and the Inspector was on in every dev
 * build anyway. Left unset it stays on. It is switched off only on the routes
 * whose page mounts its own `<CopilotKit>`, so a page never gets two
 * Inspectors (see `lib/inspector.ts` for why two is fatal). Never mount
 * `<CopilotKitInspector />` by hand: it forwards `core ?? null`, so a bare
 * instance reports "CopilotKit core not attached".
 */

const RUNTIME_URL = "/api/copilotkit";

const DEMO_USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID ?? "harness-local";
const DEMO_USER_NAME = process.env.NEXT_PUBLIC_DEMO_USER_NAME ?? "Harness User";

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <CopilotKitProvider
      runtimeUrl={RUNTIME_URL}
      headers={{
        "x-user-id": DEMO_USER_ID,
        "x-user-name": DEMO_USER_NAME,
      }}
      enableInspector={rootInspectorSetting(pathname)}
      onError={(event) => {
        console.error(`[CopilotKit ${event.code}]`, event.error);
      }}
      useSingleEndpoint={false}
    >
      {children}
    </CopilotKitProvider>
  );
}
