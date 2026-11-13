"use client";

// The MCP Apps page's `app/page.tsx`, verbatim (renamed from `Page` to
// `AppPage`, since it is not a route file here).

import { CopilotSidebar } from "@copilotkit/react-core/v2";

export default function AppPage() {
    return (
        <main>
            <h1>Your App</h1>
            <CopilotSidebar />
        </main>
    );
}
