import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/webmcp" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A CopilotKit frontend tool with <code>webmcp</code> turned on is
          mirrored onto <code>document.modelContext</code>, so a WebMCP-aware
          browser agent can find it (name, description, schema, annotations)
          and call the same handler, with no CopilotKit agent in the path.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["(Chrome Model Context Tool Inspector) call searchOrders with status \"open\""]}
            expect={
              <>
                In Chrome 149+ with the WebMCP flag or origin trial: the
                inspector lists <code>searchOrders</code> with its enum schema
                and <code>readOnlyHint</code>. <strong>Calling it fails</strong>{" "}
                with <code>ReferenceError: searchOrders is not defined</code>,
                because the page never defines the function its handler calls.
              </>
            }
            fail="The tool doesn't appear in the inspector even though the demo reports document.modelContext as available."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Broken as published">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Both samples call <code>searchOrders(status)</code>, which the page
            never defines or imports. It is not filled in here: the reference
            carries a <code>@ts-expect-error</code>, and any call to the tool
            throws.
          </li>
          <li>
            The core-only sample (<code>webmcp.ts</code>) is type-checked but
            not run: importing it would create a second{" "}
            <code>CopilotKitCore</code> next to the app&apos;s provider.
          </li>
          <li>
            Testing needs Chrome 149+ with the WebMCP origin trial or{" "}
            <code>chrome://flags/#enable-webmcp-testing</code>; elsewhere
            CopilotKit registers nothing.
          </li>
        </ul>
      </Callout>

      <Panel title="The page's samples, verbatim">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/webmcp/OrderSearch.tsx" },
            { file: "frontend/src/app/webmcp/_doc/webmcp.ts" },
            { file: "frontend/src/app/webmcp/demo-chat/page.tsx" },
          ]}
        />
      </Panel>
    </>
  );
}
