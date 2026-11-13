import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

/**
 * Reference only (see the callout).
 */
export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/state-and-actions" />

      <Panel title="What the page covers">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          State and actions: app state bound into component props, functions run on click, events sent to the agent, allowedCallers, and writable props that keep user input.
        </p>
      </Panel>

      <Callout tone="warn" title="Broken: reference only">
        <p>
          Nothing on this page is mounted. Its samples need a <code>Cart</code>{" "}
          type and a <code>cart</code> instance, and a <code>ProductCard</code>,
          that the page never defines, or are fragments (<code>events</code>,{" "}
          <code>writable</code>, function declarations) with no catalog around
          them. Nothing is written in their place, so it has no demo and no
          backend of its own. CopilotKit is now 1.87, so the version is no
          longer the blocker.
        </p>
      </Callout>
    </>
  );
}
