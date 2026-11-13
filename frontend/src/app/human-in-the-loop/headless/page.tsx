import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/headless" />

      <Panel title="What it covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Resolving an agent&apos;s pause from any part of the UI instead of a{" "}
          <code>useInterrupt</code> render slot in the chat. For Pydantic AI the
          page describes a <code>useFrontendTool</code> whose Promise handler
          stores its pending payload in React state (resolvers kept in a ref
          keyed by tool-call id), so a separate surface can show the picker,
          while the tool&apos;s <code>render</code> returns <code>null</code>{" "}
          to keep the transcript clean.
        </p>
      </Panel>

      <Callout tone="warn" title="Reference only — the page publishes no code">
        <p>
          The one code sample, the &ldquo;primitives&rdquo; snippet, is not
          rendered for pydantic-ai: the page source reads{" "}
          <code>snippet skipped: region &apos;headless-promise-primitives&apos; missing in pydantic-ai::interrupt-headless</code>
          , and there is no Code tab. With nothing printed, there is nothing to
          build, and the pattern is not written from the prose. The agent it
          would drive is also unpublished here (the related{" "}
          <Link className="underline" href="/human-in-the-loop/useInterrupt">
            Pausing the Agent for Input
          </Link>{" "}
          route has the same missing frontend half).
        </p>
      </Callout>
    </>
  );
}
