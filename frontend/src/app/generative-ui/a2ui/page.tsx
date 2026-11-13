import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui" />

      <Panel title="What it covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The A2UI overview. It explains the spec and gives two switches. On
          the server, <code>a2ui: {"{}"}</code> on <code>CopilotRuntime</code>{" "}
          wraps every registered agent (or only those named in{" "}
          <code>a2ui.agents</code>) in the A2UI middleware. In the browser, an
          optional <code>a2ui={"{{ theme }}"}</code> prop on{" "}
          <code>&lt;CopilotKit&gt;</code> replaces the built-in theme. The page
          has no demo and no agent.
        </p>
      </Panel>

      <Callout tone="info" title="Where this runs in the harness">
        The runtime half runs on the two A2UI routes:{" "}
        <Link className="underline" href="/generative-ui/a2ui/fixed-schema">
          Fixed Schema
        </Link>{" "}
        passes an <code>a2ui</code> block to its runtime, and{" "}
        <Link className="underline" href="/generative-ui/a2ui/dynamic-schema">
          Dynamic Schema
        </Link>{" "}
        relies on the provider&apos;s catalog to turn it on. This page&apos;s
        two snippets are kept byte-for-byte below and type-checked with the
        rest of the app, but never served or rendered.
      </Callout>

      <Callout tone="warn" title="Gaps in the published snippets">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The runtime snippet registers <code>{"{ default: myAgent }"}</code>{" "}
            and never defines <code>myAgent</code>. The page names no Pydantic
            AI agent for it.
          </li>
          <li>
            The theme snippet is a bare JSX expression around an undefined{" "}
            <code>children</code>.
          </li>
          <li>
            The page says any A2UI output from the agent then renders with no
            more code. With <code>a2ui: {"{}"}</code> and no catalog on the
            provider, nothing in this setup gives a plain Pydantic AI agent a
            way to produce A2UI unless its own tools return A2UI operations
            (as the Fixed Schema agent&apos;s <code>display_flight</code>{" "}
            does). Not run here.
          </li>
        </ul>
        Both undefined names are suppressed with <code>@ts-expect-error</code>;
        the expressions are unchanged.
      </Callout>

      <Panel title="The page's snippets, verbatim">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/a2ui/_doc/route.ts" },
            { file: "frontend/src/app/generative-ui/a2ui/_doc/theme.tsx" },
          ]}
        />
      </Panel>
    </>
  );
}
