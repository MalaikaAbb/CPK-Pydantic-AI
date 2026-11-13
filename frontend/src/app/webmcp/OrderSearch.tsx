// The WebMCP page's "React frontend tool" sample (OrderSearch.tsx), verbatim.
// https://docs.copilotkit.ai/pydantic-ai/webmcp
//
// `searchOrders` is never defined or imported on the page. It is not filled in
// here: the reference is suppressed for tsc, and calling the tool throws
// `ReferenceError: searchOrders is not defined` (README §9.31).
"use client";

import { useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";

export function OrderSearch() {
  useFrontendTool({
    name: "searchOrders",
    description: "Search the signed-in user's orders by status",
    parameters: z.object({
      status: z.enum(["open", "shipped", "delivered"]),
    }),
    handler: async ({ status }) => {
      // @ts-expect-error verbatim doc code: `searchOrders` is never defined on the page (TS2304)
      const orders = await searchOrders(status);
      return JSON.stringify(orders);
    },
    webmcp: {
      annotations: {
        readOnlyHint: true,
      },
    },
  });

  return null;
}
