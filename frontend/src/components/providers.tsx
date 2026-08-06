"use client";

import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import type { ReactNode } from "react";

/**
 * One provider for the whole app, so chat state survives navigation between
 * test routes.
 *
 * No `agent` prop is set here on purpose. The Multi-Agent Flows page calls that
 * router mode: with several agents registered and none named on the provider,
 * the runtime picks one per run. Routes that need a specific agent name it with
 * `agentId` on the hook or component instead, which is the same thing scoped to
 * one surface rather than the whole app.
 *
 * `showDevConsole="auto"` mounts the Inspector on localhost. It is needed
 * because `CopilotKitProvider` defaults it to false — `<CopilotKit>` is the
 * component that takes `enableInspector` and defaults to on. Never mount
 * `<CopilotKitInspector />` by hand: it forwards `core ?? null`, so a bare
 * instance reports "CopilotKit core not attached".
 */

const RUNTIME_URL = "/api/copilotkit";

const LICENSE_KEY = process.env.NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY;

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CopilotKitProvider
      runtimeUrl={RUNTIME_URL}
      {...(LICENSE_KEY ? { publicLicenseKey: LICENSE_KEY } : {})}
      showDevConsole="auto"
      onError={(event) => {
        console.error(`[CopilotKit ${event.code}]`, event.error);
      }}
    >
      {children}
    </CopilotKitProvider>
  );
}
