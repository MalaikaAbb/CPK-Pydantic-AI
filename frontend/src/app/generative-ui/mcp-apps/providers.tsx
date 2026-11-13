"use client";

// The MCP Apps page's `app/providers.tsx`, verbatim apart from `runtimeUrl`:
// "/api/copilotkit" → "/api/copilotkit-mcp-apps", this route's own runtime.
// Mounted by ./demo-chat/page.tsx around the page's `page.tsx`, not at the app
// root (every other route needs the harness's root provider).

import { CopilotKit } from "@copilotkit/react-core/v2";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-mcp-apps" useSingleEndpoint={false}>
      {children}
    </CopilotKit>
  );
}
