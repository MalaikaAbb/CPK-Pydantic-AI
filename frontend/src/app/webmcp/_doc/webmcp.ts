// The WebMCP page's "WebMCP only, with no agent" sample (webmcp.ts), verbatim.
// Type-checked, never imported: importing it would create a second
// CopilotKitCore at module load. `searchOrders` is never defined on the page.
import { CopilotKitCore } from "@copilotkit/core";
import { z } from "zod";

export const copilotkit = new CopilotKitCore({
  tools: [
    {
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
    },
  ],
});
