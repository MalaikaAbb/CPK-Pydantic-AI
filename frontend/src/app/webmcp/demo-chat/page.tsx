"use client";

import { useEffect, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

import { OrderSearch } from "../OrderSearch";

/**
 * Mounts the page's `OrderSearch` under the app's root provider (the page says
 * it must run inside an existing CopilotKitProvider). It renders nothing; the
 * tool is published to `document.modelContext` when the browser has it.
 *
 * Harness-authored: the one-line check below, so a tester can see whether the
 * browser exposes WebMCP at all before opening Chrome's Model Context Tool
 * Inspector. CopilotKit itself does nothing when the API is missing.
 */
export default function Page() {
  const [hasModelContext, setHasModelContext] = useState<boolean | null>(null);

  useEffect(() => {
    setHasModelContext("modelContext" in document);
  }, []);

  return (
    <DemoFrame parentPath="/webmcp" subtitle="useFrontendTool({ name: searchOrders, webmcp })">
      <OrderSearch />
      <div className="p-4 text-sm text-slate-700 dark:text-slate-300">
        <p>
          <code>searchOrders</code> is registered on this page with{" "}
          <code>webmcp.annotations.readOnlyHint</code>.
        </p>
        <p className="mt-2">
          <code>document.modelContext</code>:{" "}
          <strong>
            {hasModelContext === null
              ? "checking…"
              : hasModelContext
                ? "available — open Chrome's Model Context Tool Inspector"
                : "not available in this browser (CopilotKit registers nothing)"}
          </strong>
        </p>
      </div>
    </DemoFrame>
  );
}
