/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  ADAPT THIS FILE — 3 of 3
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * One entry per doc page, in the order the doc nav lists them.
 *
 * Entries are deliberately short. `docUrl`, `demoUrl` and the output filename
 * are derived from `project.config.ts` plus the fields below, so no entry can
 * point at the wrong framework's docs and filenames stay in nav order without
 * anyone numbering them by hand.
 *
 * Adapting means: delete the pages this framework does not document, add the
 * ones it does, and fix the line ranges. `npm run doctor` then tells you which
 * ranges no longer point at real code.
 *
 * ── Scope, for this repo ───────────────────────────────────────────────────
 * `route` + `demoSuffix` is the only demo URL a page can have, and the doctor
 * errors on any that is not 200. This app tracks 17 doc routes; the landing
 * page `/` is orientation with no `demo-chat`, so 16 are registered below.
 *
 * Everything here mirrors `frontend/src/lib/nav-config.ts`, which is the app's
 * single source of truth for route -> doc-page mapping. `docPath` is that
 * file's `docPath` minus its leading `/pydantic-ai`.
 *
 * Four pages -- slots, headless-ui, and both your-components pages -- resolve
 * fine but are absent from the doc sidebar as of this writing. They are kept:
 * the doc pages exist and the app implements them. See the repo README §9.14.
 *
 * ── The line ranges ────────────────────────────────────────────────────────
 * `startLine`/`endLine` are what the simulated IDE highlights. They are
 * hardcoded, which means they drift the moment someone edits a demo page.
 * Doctor guards this: where a file carries `[!code highlight]` or `#region`
 * markers, it checks the range still covers one and names the marker's current
 * line when it does not. The backend agents carry `#region agent` blocks for
 * exactly this reason, so every Python range below is guarded.
 */

import { definePages } from '../core/types';

export const PAGES = definePages([
  {
    id: 'quickstart',
    name: 'Quickstart',
    videoName: 'Quickstart',
    // The doc's bring-your-own tab -- the path this repo actually implements.
    docPath: 'quickstart?agent=bring-your-own',
    route: 'quickstart',
    // Quickstart leads with the dependency manifest, always: a demo is only
    // meaningful against known versions, and CopilotKit and AG-UI both move fast
    // enough that "it worked" is not a claim you can make without them on screen.
    ideFile: 'frontend/package.json',
    startLine: 12,
    endLine: 22,
    // Then the path itself: the chat, the runtime binding, and the Python agent
    // that answers it. `to_ag_ui()` is the whole integration on that last tab.
    extraTabs: [
      {
        filePath: 'frontend/src/app/quickstart/demo-chat/page.tsx',
        startLine: 16,
        endLine: 32,
      },
      {
        filePath: 'frontend/src/app/api/copilotkit/route.ts',
        startLine: 22,
        endLine: 36,
      },
      {
        filePath: 'backend/agents/my_agent.py',
        startLine: 14,
        endLine: 19,
      },
    ],
    prompt: 'Can you tell me a joke?',
    waitAfterPromptMs: 4000,
  },
  {
    id: 'prebuilt-components',
    name: 'Prebuilt Components',
    videoName: 'PrebuiltComponents',
    docPath: 'prebuilt-components',
    route: 'prebuilt-components',
    ideFile: 'frontend/src/app/prebuilt-components/demo-chat/page.tsx',
    startLine: 58,
    endLine: 97,
    prompt: 'What is CopilotKit?',
    prompts: ['What is CopilotKit?'],
    waitAfterPromptMs: 1500,
  },
  {
    id: 'slots',
    name: 'Custom Look and Feel - Slots',
    videoName: 'Slots',
    docPath: 'custom-look-and-feel/slots',
    route: 'custom-look-and-feel/slots',
    ideFile: 'frontend/src/app/custom-look-and-feel/slots/demo-chat/page.tsx',
    startLine: 66,
    endLine: 111,
    prompt: 'Hello from customized slots level 1!',
    prompts: [
      'Hello from customized slots level 1!',
      'Hello from slot level 2 props override!',
      'Hello from slot level 3 custom component!',
    ],
    waitAfterPromptMs: 1500,
  },
  {
    id: 'headless-ui',
    name: 'Custom Look and Feel - Headless UI',
    videoName: 'HeadlessUI',
    docPath: 'custom-look-and-feel/headless-ui',
    route: 'custom-look-and-feel/headless-ui',
    // The two callbacks that are the page: addMessage + runAgent, and stopAgent.
    ideFile:
      'frontend/src/app/custom-look-and-feel/headless-ui/demo-chat/page.tsx',
    startLine: 13,
    endLine: 29,
    prompt: 'Tell me a joke about Python.',
    waitAfterPromptMs: 4000,
  },
  {
    id: 'programmatic-control',
    name: 'Custom Look and Feel - Programmatic Control',
    videoName: 'ProgrammaticControl',
    docPath: 'programmatic-control',
    route: 'programmatic-control',
    ideFile: 'frontend/src/app/programmatic-control/demo-chat/page.tsx',
    startLine: 125,
    endLine: 141,
    prompt: 'Summarize the latest sales data',
    waitAfterPromptMs: 4000,
  },
  {
    id: 'inspector',
    name: 'Custom Look and Feel - Inspector',
    videoName: 'Inspector',
    docPath: 'inspector',
    route: 'inspector',
    // The inspector is mounted by the provider, never by the page -- and this
    // app needs `showDevConsole`, not the doc's `enableInspector`, so the
    // provider is the code worth showing.
    ideFile: 'frontend/src/components/providers.tsx',
    startLine: 27,
    endLine: 39,
    extraTabs: [
      {
        filePath: 'frontend/src/app/inspector/demo-chat/page.tsx',
        startLine: 14,
        endLine: 29,
      },
    ],
    prompt: 'Hello agent! Testing inspector.',
    waitAfterPromptMs: 1500,
  },
  {
    id: 'display-only',
    name: 'Generative UI - Your Components, Display Only',
    videoName: 'DisplayOnly',
    docPath: 'generative-ui/your-components/display-only',
    route: 'generative-ui/your-components/display-only',
    // Schema, component, and registration -- the Zod schema doubles as the
    // component's prop types, which is the point of the page.
    ideFile:
      'frontend/src/app/generative-ui/your-components/display-only/demo-chat/page.tsx',
    startLine: 21,
    endLine: 52,
    prompt: 'Show the weather card for Tokyo: 77 degrees, clear',
    waitAfterPromptMs: 4000,
  },
  {
    id: 'interactive',
    name: 'Generative UI - Your Components, Interactive',
    videoName: 'Interactive',
    docPath: 'generative-ui/your-components/interactive',
    route: 'generative-ui/your-components/interactive',
    // The whole hook call: the run suspends inside `render` until `respond`
    // fires, so the guard and both buttons are the mechanism.
    ideFile:
      'frontend/src/app/generative-ui/your-components/interactive/demo-chat/page.tsx',
    startLine: 22,
    endLine: 59,
    prompt: 'Run the command rm -rf /tmp/cache',
    waitAfterPromptMs: 4000,
  },
  {
    id: 'tool-rendering',
    name: 'Generative UI - Tool Rendering',
    videoName: 'ToolRendering',
    docPath: 'generative-ui/tool-rendering',
    route: 'generative-ui/tool-rendering',
    ideFile: 'frontend/src/app/generative-ui/tool-rendering/demo-chat/page.tsx',
    startLine: 20,
    endLine: 57,
    // The Python tool whose name the renderer has to match exactly.
    extraTabs: [
      {
        filePath: 'backend/agents/weather_agent.py',
        startLine: 13,
        endLine: 26,
      },
    ],
    prompt: "What's the weather in Tokyo?",
    waitAfterPromptMs: 4000,
  },
  {
    id: 'state-rendering',
    name: 'Generative UI - State Rendering',
    videoName: 'StateRendering',
    docPath: 'generative-ui/state-rendering',
    route: 'generative-ui/state-rendering',
    // PARTIAL, deliberately. The doc page's `agent.py` block contains React,
    // not Python, so no agent writes `searches` and the list stays empty. The
    // recording shows the rendering wired correctly against an agent that has
    // no state -- see the placeholder on the second tab, and README §9.1.
    ideFile:
      'frontend/src/app/generative-ui/state-rendering/demo-chat/page.tsx',
    startLine: 21,
    endLine: 34,
    extraTabs: [
      {
        filePath: 'backend/agents/search_agent.py',
        startLine: 1,
        endLine: 23,
      },
    ],
    prompt: 'Add a search for the tallest mountains',
    waitAfterPromptMs: 4000,
  },
  {
    id: 'frontend-tools',
    name: 'App Control - Frontend Tools',
    videoName: 'FrontendTools',
    docPath: 'frontend-tools',
    route: 'frontend-tools',
    // Registration and handler together: the handler runs in the browser and
    // its return string is what travels back to the agent.
    ideFile: 'frontend/src/app/frontend-tools/demo-chat/page.tsx',
    startLine: 16,
    endLine: 28,
    prompt: 'Say hello to Damien',
    waitAfterPromptMs: 4000,
  },
  {
    id: 'shared-state-read',
    name: 'Shared State - Reading agent state',
    videoName: 'SharedStateRead',
    docPath: 'shared-state/in-app-agent-read',
    route: 'shared-state/in-app-agent-read',
    ideFile:
      'frontend/src/app/shared-state/in-app-agent-read/demo-chat/page.tsx',
    startLine: 24,
    endLine: 45,
    // The Python half is what makes the state observable: `StateDeps` carries
    // it, and `@agent.instructions()` reads it back on every run.
    extraTabs: [
      {
        filePath: 'backend/agents/language_agent.py',
        startLine: 23,
        endLine: 58,
      },
    ],
    prompt: 'Switch to Spanish',
    prompts: ['Switch to Spanish', 'Tell me a very short joke.'],
    waitAfterPromptMs: 4000,
  },
  {
    id: 'shared-state-write',
    name: 'Shared State - Writing agent state',
    videoName: 'SharedStateWrite',
    docPath: 'shared-state/in-app-agent-write',
    route: 'shared-state/in-app-agent-write',
    // Both doc variants side by side: setState alone, and setState followed by
    // a hint message and an explicit re-run.
    ideFile:
      'frontend/src/app/shared-state/in-app-agent-write/demo-chat/page.tsx',
    startLine: 31,
    endLine: 51,
    prompt: 'Tell me a very short joke.',
    waitAfterPromptMs: 4000,
  },
  {
    id: 'multi-agent-flows',
    name: 'Pydantic AI - Multi-Agent Flows',
    videoName: 'MultiAgentFlows',
    docPath: 'multi-agent-flows',
    route: 'multi-agent-flows',
    ideFile: 'frontend/src/app/multi-agent-flows/demo-chat/page.tsx',
    startLine: 96,
    endLine: 116,
    // Router mode resolves to `default`; lock mode names an id. Both come from
    // the same registry, so the runtime route is the other half of the story.
    extraTabs: [
      {
        filePath: 'frontend/src/app/api/copilotkit/route.ts',
        startLine: 22,
        endLine: 36,
      },
    ],
    // Same question both ways: prose in router mode, a real tool call locked.
    prompt: "What's the weather in Tokyo?",
    prompts: ["What's the weather in Tokyo?", "What's the weather in Tokyo?"],
    waitAfterPromptMs: 3000,
  },
  {
    id: 'copilot-runtime',
    name: 'Backend - Copilot Runtime',
    videoName: 'CopilotRuntime',
    docPath: 'copilot-runtime',
    route: 'copilot-runtime',
    ideFile: 'frontend/src/app/copilot-runtime/demo-chat/page.tsx',
    startLine: 17,
    endLine: 30,
    extraTabs: [
      {
        filePath: 'frontend/src/app/api/copilotkit/route.ts',
        startLine: 22,
        endLine: 36,
      },
      {
        filePath: 'backend/main.py',
        startLine: 60,
        endLine: 80,
      },
    ],
    // Two ids, one turn each: `default` has no tools, `weather_agent` does.
    prompt: 'Hello! Introduce yourself in one sentence.',
    prompts: [
      'Hello! Introduce yourself in one sentence.',
      "What's the weather in Tokyo?",
    ],
    waitAfterPromptMs: 2000,
  },
  {
    id: 'ag-ui',
    name: 'Backend - AG-UI Protocol Stream',
    videoName: 'AgUi',
    docPath: 'ag-ui',
    route: 'ag-ui',
    ideFile: 'frontend/src/app/ag-ui/demo-chat/page.tsx',
    startLine: 74,
    endLine: 103,
    prompt: "What's the weather in Tokyo?",
    waitAfterPromptMs: 4000,
  },
]);
