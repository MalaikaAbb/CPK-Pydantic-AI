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
          "The bring-your-own-agent path: a Pydantic AI agent served with to_ag_ui() and reached through HttpAgent.",
        status: "working",
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
    title: "Custom Look and Feel",
    routes: [
      {
        path: "/custom-look-and-feel/slots",
        hasDemo: true,
        title: "Slots",
        docPath: "/pydantic-ai/custom-look-and-feel/slots",
        summary:
          "Replacing chat sub-components at three levels: class strings, prop overrides, and whole components.",
        status: "working",
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
