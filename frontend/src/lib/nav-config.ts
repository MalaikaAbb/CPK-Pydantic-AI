/**
 * The nav, the route headers, and the README status table all read from here,
 * so a doc page and its implementation status are described exactly once.
 *
 * Route paths mirror the doc URLs under docs.copilotkit.ai/pydantic-ai.
 * `offNav: true` marks pages that resolve fine but are absent from that
 * sidebar as of DOC_SYNC_DATE.
 */

/**
 * There is exactly one doc-sync date in this repo, and it is not here: it is
 * `syncedAt` in `doc-snapshot/manifest.json`, written every time the sync
 * button runs. A hand-maintained date alongside it only ever drifted out of
 * agreement with the machine one, so it was removed — `/doc-sync` is the
 * single place that answers "how current are these docs".
 */
export const DOCS_ROOT = "https://docs.copilotkit.ai/pydantic-ai";

export type RouteStatus = "working" | "partial" | "reference" | "broken" | "not-started";

export interface RouteMeta {
  path: string;
  title: string;
  docPath: string;
  summary: string;
  status: RouteStatus;
  statusNote?: string;
  offNav?: boolean;
  /** Owns a live surface at `<path>/demo-chat`. */
  hasDemo?: boolean;
}

export function demoPath(route: RouteMeta): string | undefined {
  if (!route.hasDemo) return undefined;
  return route.path === "/" ? "/demo-chat" : `${route.path}/demo-chat`;
}

export interface NavGroup {
  title: string;
  routes: RouteMeta[];
}

export const NAV: NavGroup[] = [
  {
    title: "Getting Started",
    routes: [
      {
        path: "/",
        title: "Introduction",
        docPath: "/pydantic-ai",
        summary: "What this harness covers and how the pieces fit together.",
        status: "reference",
        statusNote: "Landing page — orientation, the agent roster, and a live backend probe.",
      },
      {
        path: "/quickstart",
        hasDemo: true,
        title: "Quickstart",
        docPath: "/pydantic-ai/quickstart?agent=bring-your-own",
        summary:
          "The bring-your-own-agent path: a Pydantic AI agent behind AGUIAdapter, reached through HttpAgent, under the doc's own <CopilotKit> provider.",
        status: "working",
        statusNote:
          "The doc's providers.tsx wraps the Quickstart demo only. The runtime still reads INTELLIGENCE_API_KEY, not the doc's renamed CPK_INTELLIGENCE_API_KEY.",
      },
    ],
  },
  {
    title: "Basics",
    routes: [
      {
        path: "/prebuilt-components",
        hasDemo: true,
        title: "Prebuilt Components",
        docPath: "/pydantic-ai/prebuilt-components",
        summary:
          "CopilotChat, CopilotPopup, and CopilotSidebar side by side, each driving the same agent.",
        status: "working",
      },
    ],
  },
  {
    title: "Rich Threads",
    routes: [
      {
        path: "/prebuilt-components/copilot-threads-drawer",
        hasDemo: true,
        title: "Threads Drawer",
        docPath: "/pydantic-ai/prebuilt-components/copilot-threads-drawer",
        summary:
          "The drop-in conversation sidebar, wired with no active-thread state of its own. The doc's two samples are two tabs: drawer + CopilotChat, drawer + CopilotSidebar.",
        status: "working",
        statusNote:
          "Needs Intelligence mode with an active entitlement, otherwise the drawer shows its Upgrade view. The sidebar sample's YourMainContent is undefined in the doc. Tabs not yet checked in a browser.",
      },
      {
        path: "/headless-threads",
        hasDemo: true,
        title: "Headless Threads",
        docPath: "/pydantic-ai/headless-threads",
        summary:
          "The same thread data through useThreads, with a hand-built list — including rename, which the drawer omits.",
        status: "working",
        statusNote:
          "Needs Intelligence mode. In SSE mode /info reports mutations: false, so rename/archive/delete have no endpoint.",
      },
      {
        path: "/threads-lifecycle",
        hasDemo: true,
        title: "Thread & History Lifecycle",
        docPath: "/pydantic-ai/threads-lifecycle",
        summary:
          "Where a threadId comes from, how history replays, and how switching differs from starting fresh.",
        status: "working",
        statusNote:
          "Switch/start are live regardless; history replay needs a server-side store to replay from.",
      },
    ],
  },
  {
    title: "Custom Look and Feel",
    routes: [
      {
        path: "/custom-look-and-feel/slots",
        hasDemo: true,
        title: "Slots",
        docPath: "/pydantic-ai/custom-look-and-feel/slots",
        summary:
          "Replacing chat sub-components at three levels (class strings, prop overrides, whole components), plus groupMessages folding tool steps into one row.",
        status: "working",
        statusNote:
          "The groupMessages tab (added in the 2026-10-08 sync) has passed typecheck but has not been checked in a browser yet.",
        offNav: true,
      },
      {
        path: "/custom-look-and-feel/headless-ui",
        hasDemo: true,
        title: "Headless UI",
        docPath: "/pydantic-ai/custom-look-and-feel/headless-ui",
        summary:
          "A chat interface built from scratch on useAgent + useCopilotKit, with no CopilotKit chrome.",
        status: "working",
        offNav: true,
      },
      {
        path: "/programmatic-control",
        hasDemo: true,
        title: "Programmatic Control",
        docPath: "/pydantic-ai/programmatic-control",
        summary:
          "Driving the agent with no chat UI: read state and messages, run it, and stop it mid-run.",
        status: "working",
      },
      {
        path: "/inspector",
        hasDemo: true,
        title: "Inspector",
        docPath: "/pydantic-ai/inspector",
        summary:
          "The built-in debugging overlay showing AG-UI events, agents, state, and registered tools.",
        status: "working",
      },
    ],
  },
  {
    title: "Generative UI",
    routes: [
      {
        path: "/generative-ui/your-components/display-only",
        hasDemo: true,
        title: "Your Components · Display-only",
        docPath: "/pydantic-ai/generative-ui/your-components/display-only",
        summary:
          "Registering a React component as a tool the agent can render, with no handler.",
        status: "working",
        offNav: true,
      },
      {
        path: "/generative-ui/your-components/interactive",
        hasDemo: true,
        title: "Your Components · Interactive",
        docPath: "/pydantic-ai/generative-ui/your-components/interactive",
        summary:
          "An approval gate built with useHumanInTheLoop — the run suspends until the user authorises the command.",
        status: "working",
        offNav: true,
      },
      {
        path: "/generative-ui/tool-rendering",
        hasDemo: true,
        title: "Tool Rendering",
        docPath: "/pydantic-ai/generative-ui/tool-rendering",
        summary:
          "The get_weather tool call rendered as a custom component, plus a catch-all renderer.",
        status: "working",
      },
      {
        path: "/generative-ui/state-rendering",
        hasDemo: true,
        title: "State Rendering",
        docPath: "/pydantic-ai/generative-ui/state-rendering",
        summary:
          "A searches list held in agent state and rendered live from agent.state as the agent updates it.",
        status: "partial",
        statusNote:
          "Frontend implemented as documented. The doc's agent.py block contains React code, not Python — there is no agent to write `searches`, so the list stays empty.",
      },
      {
        path: "/generative-ui/a2ui/dynamic-schema",
        hasDemo: true,
        title: "A2UI · Dynamic Schema",
        docPath: "/pydantic-ai/generative-ui/a2ui/dynamic-schema",
        summary:
          "A catalog of custom components on the provider; the model designs a surface from it per request.",
        status: "partial",
        statusNote:
          "Prose auto-inject path, not the demo code: the bundle's agent-side tool imports an unpublished helper. Catalog is the bundle's, verbatim. Not yet checked in a browser.",
      },
      {
        path: "/generative-ui/a2ui/fixed-schema",
        hasDemo: true,
        title: "A2UI · Fixed Schema",
        docPath: "/pydantic-ai/generative-ui/a2ui/fixed-schema",
        summary:
          "A flight card whose component tree is authored as JSON up front; the agent's tool supplies only the data.",
        status: "partial",
        statusNote:
          "Backend verified (display_flight returns the a2ui_operations container). booked_schema.json borrowed from the google-adk bundle; renderers are the Mastra bundle's. Not yet checked in a browser.",
      },
      {
        path: "/generative-ui/open-generative-ui",
        hasDemo: true,
        title: "Open Generative UI",
        docPath: "/pydantic-ai/generative-ui/open-generative-ui",
        summary:
          "The agent writes sandboxed HTML/CSS/JS that streams into an iframe, with a minimal and a sandbox-functions cell.",
        status: "partial",
        statusNote: "All demo-bundle code, verbatim. Not yet checked in a browser.",
      },
      {
        path: "/generative-ui/components",
        title: "Components and surfaces",
        docPath: "/pydantic-ai/generative-ui/components",
        summary:
          "standardUI on the provider: the runtime adds render_ui and its guide, and the agent answers with streamed A2UI 1.0 components.",
        status: "reference",
        statusNote:
          "Reference only: needs @copilotkit/react-core 1.85 (the @copilotkit/react-core/v2/generative-ui entry); this repo pins ^1.77.0, which has no such export, and dependency bumps are out of scope for doc-sync. The runtime sample is a CopilotKit BuiltInAgent (TanStack factory), not a Pydantic AI agent. pydantic-ai-slim 1.107's AGUIAdapter forwards the run's tools but drops AG-UI context, where the render_ui guide travels; a Pydantic AI agent would get the tool but not the guide (§9.29).",
      },
      {
        path: "/generative-ui/components/surfaces",
        title: "Components · Surfaces",
        docPath: "/pydantic-ai/generative-ui/components/surfaces",
        summary:
          "GenerativeUISurface page targets the chat can fill, limit, scroll to, and replace, with per-component error boundaries.",
        status: "reference",
        statusNote:
          "Reference only: needs @copilotkit/react-core 1.85 (the @copilotkit/react-core/v2/generative-ui entry); this repo pins ^1.77.0, which has no such export, and dependency bumps are out of scope for doc-sync. The samples use Product, ProductRow and a product list they never define, and import shopUI from a ./catalog the page doesn't print. Target descriptions travel as AG-UI context, which Pydantic AI's AGUIAdapter drops (§9.29).",
      },
      {
        path: "/generative-ui/components/catalogs",
        title: "Components · Catalogs",
        docPath: "/pydantic-ai/generative-ui/components/catalogs",
        summary:
          "createGenerativeUI catalogs: typed components, zod and Valibot props, extends, parameterOrder and exportA2UICatalog.",
        status: "reference",
        statusNote:
          "Reference only: needs @copilotkit/react-core 1.85 (the @copilotkit/react-core/v2/generative-ui entry); this repo pins ^1.77.0, which has no such export, and dependency bumps are out of scope for doc-sync. The fragments use Hero, Panel and cartUI without defining them; the Valibot sample also needs valibot and @valibot/to-json-schema, which this repo doesn't install.",
      },
      {
        path: "/generative-ui/components/standard-catalog",
        title: "Components · Standard catalog",
        docPath: "/pydantic-ai/generative-ui/components/standard-catalog",
        summary:
          "standardUI's 69 components as is, extended with a ProductCard, with Map/Video/HtmlView omitted, and with Card overridden.",
        status: "reference",
        statusNote:
          "Reference only: needs @copilotkit/react-core 1.85 (the @copilotkit/react-core/v2/generative-ui entry); this repo pins ^1.77.0, which has no such export, and dependency bumps are out of scope for doc-sync. The extend sample names ProductCard and productSchema without defining them; the Map component needs maplibre-gl, which this repo doesn't install.",
      },
      {
        path: "/generative-ui/components/state-and-actions",
        title: "Components · State and actions",
        docPath: "/pydantic-ai/generative-ui/components/state-and-actions",
        summary:
          "App state bound into props, functions run on click, events sent to the agent, and writable props that keep user input.",
        status: "reference",
        statusNote:
          "Reference only: needs @copilotkit/react-core 1.85 (the @copilotkit/react-core/v2/generative-ui entry); this repo pins ^1.77.0, which has no such export, and dependency bumps are out of scope for doc-sync. The fragments use a Cart, cart.addItem and a ProductCard they never define, and are not inside complete catalogs.",
      },
      {
        path: "/generative-ui/components/theming",
        hasDemo: true,
        title: "Components · Theming",
        docPath: "/pydantic-ai/generative-ui/components/theming",
        summary:
          "The theme option's CSS variables, a typed GenerativeUITheme file, dark-mode overrides, map styles, and .a2ui-surface CSS.",
        status: "partial",
        statusNote:
          "Ported from agno (from CPK-LangGraph-TS / aws-strands-ts); not yet checked in a browser. The dark-mode script renders in the demo body, not <head>; the page's mapStyle URLs are placeholders, so the Map variant draws no basemap. pydantic-ai 1.107's AGUIAdapter drops AG-UI context, so the catalog guide never reaches the model (§9.29).",
      },
      {
        path: "/generative-ui/components/transports",
        hasDemo: true,
        title: "Components · Transports",
        docPath: "/pydantic-ai/generative-ui/components/transports",
        summary:
          "The render_ui tool transport vs the markdown transport, the runtime's generativeUI flag, and agentIds scoping.",
        status: "partial",
        statusNote:
          "Ported from agno (from CPK-LangGraph-TS / aws-strands-ts); not yet checked in a browser. The runtime sample's agent is undefined; this repo's Pydantic AI genui agent stands in. The shop agent named in agentIds is never printed, so it isn't registered. pydantic-ai 1.107's AGUIAdapter drops AG-UI context, so the catalog guide never reaches the model (§9.29).",
      },
      {
        path: "/generative-ui/components/markdown-mode",
        hasDemo: true,
        title: "Components · Markdown mode",
        docPath: "/pydantic-ai/generative-ui/components/markdown-mode",
        summary:
          "The agent writes A2UI operations in a2ui code blocks inside its reply; sendContext: false moves the catalog into forwardedProps.",
        status: "partial",
        statusNote:
          "Ported from agno (from CPK-LangGraph-TS / aws-strands-ts); not yet checked in a browser. The fence guide travels as context, which AGUIAdapter drops; the sendContext: false variant needs a backend reading forwarded_props, which AGUIAdapter doesn't pass to the agent — no UI expected from either (§9.29).",
      },
      {
        path: "/generative-ui/components/from-a2ui",
        hasDemo: true,
        title: "Components · Adopt from A2UI",
        docPath: "/pydantic-ai/generative-ui/components/from-a2ui",
        summary:
          "The v0.9 a2ui renderer → A2UI 1.0 migration: the After catalog running on the new engine, with the Before code shown.",
        status: "partial",
        statusNote:
          "Ported from agno (from CPK-LangGraph-TS / aws-strands-ts); not yet checked in a browser. Airport and Arrow are repo scaffolding. pydantic-ai 1.107's AGUIAdapter drops AG-UI context, so the catalog guide never reaches the model (§9.29).",
      },
      {
        path: "/generative-ui/json-render",
        hasDemo: true,
        title: "JSON Render",
        docPath: "/pydantic-ai/generative-ui/json-render",
        summary:
          "An agent-emitted { root, elements } spec, meant to be validated against a Zod catalog and drawn by @json-render/react.",
        status: "broken",
        statusNote:
          "As published it throws (<Renderer catalog> instead of registry, no JSONUIProvider). The bundle agent's MetricCard props don't match the doc's catalog, so metric cards are always dropped. The 'fixed' mode renders the charts.",
      },
      {
        path: "/generative-ui/hashbrown",
        hasDemo: true,
        title: "Hashbrown",
        docPath: "/pydantic-ai/generative-ui/hashbrown",
        summary:
          "Streamed JSON meant to be parsed progressively by @hashbrownai/react and rendered through a component catalog.",
        status: "broken",
        statusNote:
          "As published it throws (0.6.1 hook API mismatch). The bundle agent emits lowercase component names the doc's catalog lacks, so even the 'fixed' mode renders nothing.",
      },
    ],
  },
  {
    title: "App Control",
    routes: [
      {
        path: "/frontend-tools",
        hasDemo: true,
        title: "Frontend Tools",
        docPath: "/pydantic-ai/frontend-tools",
        summary:
          "A tool the agent calls that executes in the browser, forwarded automatically over AG-UI.",
        status: "working",
      },
    ],
  },
  {
    title: "Human in the Loop",
    routes: [
      {
        path: "/human-in-the-loop/agent",
        hasDemo: true,
        title: "Pydantic AI Agents",
        docPath: "/pydantic-ai/human-in-the-loop/agent",
        summary:
          "An essay draft the user approves before the agent continues, via a frontend tool that waits for a response.",
        status: "broken",
        statusNote:
          "By design. Frontend and backend both define write_essay, and Pydantic AI rejects the run with RUN_ERROR (observed in the browser). The hook also uses v1-only options (renderAndWaitForResponse).",
      },
      {
        path: "/human-in-the-loop/governed-actions",
        hasDemo: true,
        title: "Governed Action Approval UI",
        docPath: "/pydantic-ai/human-in-the-loop/governed-actions",
        summary:
          "Gating a side-effecting action behind an approve/reject card, driven by the action's verdict.",
        status: "partial",
        statusNote:
          "Only the useHumanInTheLoop half can run (on my_agent). useInterrupt needs an AG-UI interrupt, which Pydantic AI's adapter never emits. No policy engine, agent or executeSideEffect is published. Not yet checked in a browser.",
      },
    ],
  },
  {
    title: "Shared State",
    routes: [
      {
        path: "/shared-state/in-app-agent-read",
        hasDemo: true,
        title: "Reading agent state",
        docPath: "/pydantic-ai/shared-state/in-app-agent-read",
        summary:
          "Reading the agent's StateDeps state in your own UI through agent.state.",
        status: "working",
      },
      {
        path: "/shared-state/in-app-agent-write",
        hasDemo: true,
        title: "Writing agent state",
        docPath: "/pydantic-ai/shared-state/in-app-agent-write",
        summary:
          "Writing back into agent state with agent.setState, plus the doc's re-run variant.",
        status: "working",
      },
    ],
  },
  {
    title: "Multi-Agent",
    routes: [
      {
        path: "/multi-agent/subagents",
        hasDemo: true,
        title: "Sub-Agents",
        docPath: "/pydantic-ai/multi-agent/subagents",
        summary:
          "A supervisor delegating to research, writing and critique sub-agents, with a delegation log in shared state.",
        status: "partial",
        statusNote:
          "Delegation works and the inline cards render from the tool stream. The delegation log stays empty: the tools mutate ctx.deps.state, and Pydantic AI's AG-UI adapter never emits a state snapshot (observed: zero STATE_* events).",
      },
    ],
  },
  {
    title: "Pydantic AI",
    routes: [
      {
        path: "/multi-agent-flows",
        hasDemo: true,
        title: "Multi-Agent Flows",
        docPath: "/pydantic-ai/multi-agent-flows",
        summary:
          "Router mode versus agent lock mode — the two ways CopilotKit picks which agent a run goes to.",
        status: "working",
      },
    ],
  },
  {
    title: "Backend",
    routes: [
      {
        path: "/copilot-runtime",
        hasDemo: true,
        title: "Copilot Runtime",
        docPath: "/pydantic-ai/copilot-runtime",
        summary:
          "This repo's live runtime config, routing across all three agents, and the direct-connection tradeoff.",
        status: "working",
      },
      {
        path: "/ag-ui",
        hasDemo: true,
        title: "AG-UI",
        docPath: "/pydantic-ai/ag-ui",
        summary:
          "A live capture of the raw AG-UI event stream flowing between the runtime and this page.",
        status: "working",
      },
    ],
  },
  {
    title: "Doc Sync",
    routes: [
      {
        path: "/doc-sync",
        title: "Doc drift",
        docPath: "/pydantic-ai",
        summary:
          "Re-fetches the markdown behind every tracked doc page and diffs it against the stored snapshot, flagging changes inside code blocks.",
        status: "reference",
      },
    ],
  },
];

export const ALL_ROUTES: RouteMeta[] = NAV.flatMap((g) => g.routes);

export function findRoute(path: string): RouteMeta | undefined {
  return ALL_ROUTES.find((r) => r.path === path);
}

export function docUrl(route: RouteMeta): string {
  return `https://docs.copilotkit.ai${route.docPath}`;
}

export const STATUS_LABEL: Record<RouteStatus, string> = {
  working: "Working",
  partial: "Partial",
  reference: "Reference",
  broken: "Broken",
  "not-started": "Not started",
};
