"use client";

/**
 * The page's `ui/app/page.tsx` block, verbatim between the region markers.
 *
 * Harness-authored, above the region:
 *  - The imports. The page shows none. `useFrontendTool` comes from
 *    `@copilotkit/react-core/v2`, as everywhere else in this repo.
 *  - `Markdown`. The page renders `<Markdown content=… />` and never says what
 *    it is. This stand-in shows the draft as preformatted text.
 *
 * NOT fixed, on purpose: the hook's options. `renderAndWaitForResponse` and
 * `available: "frontend"` belong to v1's `useCopilotAction`. v2's
 * `useFrontendTool` has neither, so the build is kept passing with
 * `@ts-expect-error` and the route shows what the hook does with them at
 * runtime.
 */
import { useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";

function Markdown({ content }: { content: string }) {
  return (
    <pre className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-900">
      {content}
    </pre>
  );
}

// #region doc — verbatim
function YourMainContent() {
  // ...

  useFrontendTool({
    name: "write_essay",
    // @ts-expect-error harness: doc API mismatch, not fixed — v2 useFrontendTool's `available` has no "frontend" value (v1 useCopilotAction option)
    available: "frontend",
    description: "Writes an essay and takes the draft as an argument.",
    parameters: z.object({
      draft: z.string().describe("The draft of the essay"),
    }),
    // @ts-expect-error harness: doc API mismatch, not fixed — v2 useFrontendTool has no renderAndWaitForResponse (v1 useCopilotAction option)
    renderAndWaitForResponse: ({ args, respond, status }) => {
      return (
        <div>
          <Markdown content={args.draft || 'Preparing your draft...'} />

          <div className={`flex gap-4 pt-4 ${status !== "executing" ? "hidden" : ""}`}>
            <button
              onClick={() => respond?.("CANCEL")}
              disabled={status !== "executing"}
              className="border p-2 rounded-xl w-full"
            >
              Try Again
            </button>
            <button
              onClick={() => respond?.("SEND")}
              disabled={status !== "executing"}
              className="bg-blue-500 text-white p-2 rounded-xl w-full"
            >
              Approve Draft
            </button>
          </div>
        </div>
      );
    },
  });

  // ...
}
// #endregion

export { YourMainContent };
