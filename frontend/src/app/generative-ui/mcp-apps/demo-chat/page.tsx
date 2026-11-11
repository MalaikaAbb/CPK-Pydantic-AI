"use client";

import { DemoFrame } from "@/components/demo-frame";

import AppPage from "../app-page";
import { Providers } from "../providers";

/**
 * The MCP Apps page's provider around its page, inside the repo's demo chrome.
 *
 * The page's `layout.tsx` renders `<Providers>` from the root layout; here it
 * wraps only this demo, and is nested inside the harness's root provider, so
 * this path is in `lib/inspector.ts`. The page's stylesheet import is already
 * in the root layout.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/generative-ui/mcp-apps" subtitle="agent: mcp_apps · mcpApps server http://localhost:3108/mcp">
      <div className="h-full overflow-auto">
        <Providers>
          <AppPage />
        </Providers>
      </div>
    </DemoFrame>
  );
}
