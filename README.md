# CopilotKit + Pydantic AI Test Suite

A navigable, working test harness for the CopilotKit Pydantic AI integration — each doc page is a route that actually runs the thing it describes.

| | |
|---|---|
| **Doc sync date** | Machine-maintained — `doc-snapshot/manifest.json` → `syncedAt`, rewritten on every sync |
| **CopilotKit packages** | `@copilotkit/react-core` 1.77.0 · `@copilotkit/runtime` 1.77.0 (v2 surface) · `@copilotkit/a2ui-renderer` 1.77.0 |
| **AG-UI package** | `@ag-ui/client` 1.0.1 |
| **Generative UI libraries** | `@json-render/react` 0.21 · `@hashbrownai/react` + `/core` 0.6.1 · `recharts` 3 · `@radix-ui/react-separator` |
| **zod** | 3.25.76, pinned on purpose — the A2UI binder needs zod 3 (§9.18) |
| **Pydantic AI** | `pydantic-ai-slim[ag-ui,openai]` 1.107.7 · Starlette 0.45.3 · uvicorn 0.52.1 |
| **Frontend** | Next.js 16.3.0 (App Router) · React 19.2.8 · TypeScript 5 · Tailwind 4.3.3 |
| **Backend** | Python 3.12 · uv |
| **Build status** | No CI. Verified locally: lint ✅ · typecheck ⚠️ (4 known errors, all in one file — see §9) · agent server boots with zero deprecation warnings ✅ · live AG-UI stream through `AGUIAdapter` ✅ · runtime `/info` 200 in both SSE and Intelligence modes ✅ |

---

## 2. Overview

[Pydantic AI](https://ai.pydantic.dev) is a Python agent framework with first-class AG-UI support: `AGUIAdapter.dispatch_request` turns an ordinary agent into a Starlette route that speaks the protocol, which is what lets a React app drive it with streaming, tool calls, shared state, and generative UI.

This repo covers a **scoped set of 28 doc pages** (§8). Each route implements what its page teaches and shows the exact source that makes it work, read off disk at render time.

**Everything comes from the documentation.** Newer pages keep their full source in the demo **Code** tab rather than in the prose, and that is used verbatim where the prose is incomplete. Where neither supplies working code, the route says so and is marked ⚠️ Partial or ❌ Broken. The exceptions are labelled in the file and on the route: leaf components and parse helpers on JSON Render and Hashbrown, a `Markdown` stand-in on Human in the Loop, and `booked_schema.json`, which is borrowed from the google-adk demo bundle (§9.19).

Tracks: **<https://docs.copilotkit.ai/pydantic-ai>**

---

## 3. Architecture

```
Browser (React 19)
  │  @copilotkit/react-core/v2 — CopilotKitProvider, CopilotChat, hooks
  │  GET /api/copilotkit/info · POST agent runs · PATCH/DELETE threads
  ▼
Next.js 16 App Router  ·  localhost:3000
  │  Copilot Runtime  (@copilotkit/runtime/v2)
  │  app/api/copilotkit/[[...slug]]/route.ts — a multi-route fetch handler
  │  agents: { default, my_agent, weather_agent, language_agent,
  │            hitl_agent, subagents }
  │  each a  new HttpAgent({ url: "http://localhost:8000/<id>/" })
  │  optional: CopilotKitIntelligence + identifyUser (threads, persistence)
  │
  │  plus one dedicated runtime per page that needs its own runtime config:
  │  copilotkit-a2ui-fixed-schema    a2ui: { injectA2UITool: false }
  │  copilotkit-declarative-gen-ui   A2UI via the provider's catalog
  │  copilotkit-ogui                 openGenerativeUI: { agents: [...] }
  │  copilotkit-byoc-json-render / copilotkit-byoc-hashbrown
  ▼  HTTP, server-to-server
Pydantic AI agent server  ·  localhost:8000  (Python)
  │  backend/main.py — Starlette, one AGUIAdapter.dispatch_request route per agent
  │  AG-UI events streamed back as SSE
  ▼
OpenAI  (openai:gpt-4.1-mini by default)
```

**Two processes, unlike the TypeScript integrations.** Pydantic AI is Python, so agents cannot run inside the Next app. You start both: `uv run main.py` in `backend/`, and `npm run dev` in `frontend/`.

The browser never talks to port 8000. The runtime route is the only thing that does, which is where the model provider key stays.

### The agents

| Agent id | Tools / state | Used by |
|---|---|---|
| `my_agent` | — (two lines: `Agent(MODEL, instructions='Be fun!')`) | Quickstart, Prebuilt Components, Slots, Headless UI, Programmatic Control, Inspector, Display-only, Interactive, Frontend Tools, State Rendering, Governed Actions, Multi-Agent Flows, Runtime |
| `weather_agent` | `get_weather` via `@agent.tool_plain` | Tool Rendering, AG-UI, Multi-Agent Flows |
| `language_agent` | `deps_type=StateDeps[AgentState]` — `language` | Shared State read + write, Multi-Agent Flows |
| `a2ui_fixed` | `display_flight` · `StateDeps[EmptyState]` | A2UI · Fixed Schema |
| `a2ui_dynamic` | — (`generate_a2ui` is injected by the runtime) | A2UI · Dynamic Schema |
| `byoc_json_render` | — (prompted to reply with `{ root, elements }`) | JSON Render |
| `byoc_hashbrown` | — (prompted to reply with `{ ui: [...] }`) | Hashbrown |
| `open_gen_ui` / `open_gen_ui_advanced` | — (`generateSandboxedUi` is injected by the runtime) | Open Generative UI |
| `hitl_agent` | `write_essay` via `@agent.tool_plain` | Human in the Loop · Pydantic AI Agents |
| `subagents` | `research_agent`, `writing_agent`, `critique_agent` · `StateDeps[SubagentsState]` | Sub-Agents |
| `default` | alias for `my_agent` | what router mode resolves to |

Several rather than one, because each page defines its own agent. The Generative UI and Sub-Agents agents are the docs' demo-bundle files, verbatim. Agent ids are the keys of the runtime's `agents: { … }` object, and they deliberately match the mount paths in `backend/main.py`, so the two sides cannot drift.

A fourth — `search_agent`, for State Rendering — is a **documented placeholder, not an agent**. See §9.

---

## 4. Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 20+ | Next.js 16 requires 20+. Verified on 24.16.0. |
| npm | 10+ | Or pnpm/yarn/bun. Verified on 12.0.1. |
| Python | 3.12+ | Pinned by `backend/.python-version`. |
| uv | 0.11+ | The Quickstart's package manager. <https://docs.astral.sh/uv/> |
| OpenAI API key | — | **Required.** Nothing runs without it. |

No CopilotKit CLI is needed — the Quickstart for this framework does not use it.

---

## 5. Setup

```bash
git clone <this-repo> pydantic-ai && cd pydantic-ai

# Backend
cd backend && uv sync && cd ..

# Frontend
cd frontend && npm install && cd ..

# Secrets
cp .env.example backend/.env
```

Then edit `backend/.env`:

| Variable | What it does |
|---|---|
| `OPENAI_API_KEY` | **Required.** Read by the Python process only; never reaches the browser. |
| `OPENAI_MODEL` | Optional. Model id in Pydantic AI's `provider:model` form. Defaults to `openai:gpt-4.1-mini`. |
| `AGENT_PORT` | Optional. Agent server port. Defaults to `8000`. |
| `AGENT_CORS_ORIGINS` | Optional. Only matters if you call the agent directly; the normal path is server-to-server. |

Frontend variables belong in `frontend/.env.local` (Next does not read `backend/.env`), and all are optional:

| Variable | What it does |
|---|---|
| `PYDANTIC_AI_AGENT_URL` | Base URL for the agent server. Defaults to `http://localhost:8000`. Use `127.0.0.1` if `localhost` resolves to IPv6 while uvicorn binds IPv4. |
| `AGENT_URL` | The same thing, read by the three runtime routes copied verbatim from the demo bundles (`copilotkit-a2ui-fixed-schema`, `copilotkit-declarative-gen-ui`, `copilotkit-ogui`). Defaults to `http://localhost:8000`. Set both if you move the agent server. |
| `INTELLIGENCE_API_KEY` | Optional. Puts the runtime in Intelligence mode: threads persist and rename/archive/delete get an endpoint. Server-side only — never `NEXT_PUBLIC_`. |
| `COPILOTKIT_LICENSE_TOKEN` | Optional, and **independent** of the key above. `/info` derives `licenseStatus` from it, and `<CopilotThreadsDrawer>` gates its locked view on that field. |
| `NEXT_PUBLIC_DEMO_USER_ID` / `_NAME` | Optional. The identity `identifyUser` reads off request headers. Threads are per-user; change it to watch two lists diverge. |

Without the two Intelligence variables the runtime falls back to SSE with an in-memory runner: **every chat route still works**, and only the three Rich Threads routes degrade. `/info` reports which mode you are actually in, and the connection panel on `/` shows it.

**Default ports:** frontend **3000**, agent server **8000**.

---

## 6. Running the project

Two terminals — there is no single command that starts both.

**Terminal 1 — the agent server:**

```bash
cd backend
uv run main.py
```

Success looks like this:

```
INFO:     Started server process [378964]
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

Confirm with:

```bash
curl http://localhost:8000/health
# {"status":"ok","agents":["a2ui_dynamic","a2ui_fixed","byoc_hashbrown","byoc_json_render","hitl_agent","language_agent","my_agent","open_gen_ui","open_gen_ui_advanced","subagents","weather_agent"]}
```

**Terminal 2 — the app:**

```bash
cd frontend
npm run dev
```

```
▲ Next.js 16.3.0 (Turbopack)
- Local:   http://localhost:3000
✓ Ready in 248ms
```

Open **<http://localhost:3000>**. The landing page has a **Connection check** panel that probes the agent server server-side and lists the agents it reported — start there if anything looks wrong.

---

## 7. What to expect — walkthrough per section

### How each route is split

| | |
|---|---|
| **`<route>`** | Notes, pass/fail criteria, and **the exact source**, read off disk at render time. No live chat. |
| **`<route>/demo-chat`** | Just the running feature, no chrome — built for screen recording. Reached via **Open demo ↗**, which always opens a new tab. |

Code on a page is never a re-typed approximation: each page reads real files via `src/lib/source.ts` and syntax-highlights them with Shiki. Excerpts use `# region` markers, which stay visible in the source file and are labelled with line numbers.

### Getting Started

**`/`** — Orientation, the agent roster, and the live backend probe.

**`/quickstart`** — A Pydantic AI agent served by `AGUIAdapter.dispatch_request`, reached with `HttpAgent` through the multi-route runtime handler. The demo runs under the doc's own `app/providers.tsx` (`<CopilotKit runtimeUrl="/api/copilotkit" agent="my_agent" useSingleEndpoint={false}>`), mounted by a route layout so it wraps the Quickstart only. Its `<CopilotSidebar />` therefore names no agent. **Try:** `What can you help me with?` **Pass:** tokens stream, and the tone is noticeably jokey — the agent's only instruction is `'Be fun!'`. **Fail:** an error banner; check the connection panel, then `OPENAI_API_KEY`.

### Basics

**`/prebuilt-components`** — `CopilotChat`, `CopilotSidebar`, `CopilotPopup` in tabs, with the doc's `labels`. **Pass:** all three drive the same agent and the conversation survives tab switches. **Fail:** a component renders unstyled or invisible — usually the `styles.css` import.

### Rich Threads

**`/prebuilt-components/copilot-threads-drawer`** — The drop-in sidebar. Drawer and chat share one `CopilotChatConfigurationProvider`, so selecting a row moves the chat with no state of your own. **Try:** send a message, click **New Conversation**, send another, then click back. **Pass:** the first thread's history replays. **Fail:** a locked "Threads are a CopilotKit Intelligence feature" panel — that is `licenseStatus`, not a bug (§9.16).

**`/headless-threads`** — The same data through `useThreads`, hand-rendered, including **rename**, which the drawer omits. **Try:** send a message, then Rename / Archive / Delete the row. **Pass:** each acts on the row. **Fail:** they no-op — in SSE mode `/info` reports `mutations: false` and there is no endpoint behind them.

**`/threads-lifecycle`** — Where a `threadId` comes from and what makes history replay. **Try:** **New chat**, then **Open conversation**. **Pass:** New chat mints a visibly different id and clears the transcript; Open sets `explicit=true` and replays. **Fail:** the id never moves — that happens when a `threadId` prop is also passed, which makes both setters no-op.

### Custom Look and Feel

**`/custom-look-and-feel/slots`** *(live but absent from the doc sidebar)* — Three override levels. **Try:** `Hello there` on each tab. **Pass:** level 1 tints the bubbles and outlines the input, level 2 auto-focuses the input, level 3 swaps in a plain custom message list. **Fail:** all three tabs look identical. ⚠️ This file carries 4 deliberate typecheck errors — see §9.

**`/custom-look-and-feel/headless-ui`** *(live but absent from the sidebar)* — A chat with zero CopilotKit chrome. **Try:** `Write me a long poem about Python`, then hit Stop. **Pass:** messages stream into hand-written bubbles, `Thinking...` shows while running, and Stop halts it mid-sentence.

**`/programmatic-control`** — Drives the agent with no chat component: status, state, `setState`, `subscribe`, run, stop. **Try:** `Summarize the latest sales data`. **Pass:** status flips to Running, the transcript grows, the subscriber counters tick, and the Dark/Light buttons mutate the `agent.state` JSON live. **Fail:** nothing happens on Run — the agent id does not match the runtime's.

**`/inspector`** — The debugging overlay, mounted by the provider. **Pass:** the event list fills and **Available Agents** lists `default`, `my_agent`, `weather_agent`, `language_agent`. **Fail:** no overlay — it is force-disabled in production builds, so confirm you are on the dev server.

### Generative UI

**`/generative-ui/your-components/display-only`** *(off-sidebar)* — `useComponent`. **Try:** `Show the weather card for Tokyo: 77 degrees, clear`. **Pass:** a bordered card renders inline in the chat. **Fail:** plain text, no card — the model did not call the tool.

**`/generative-ui/your-components/interactive`** *(off-sidebar)* — `useHumanInTheLoop` approval gate. **Try:** `Run the command rm -rf /tmp/cache`. **Pass:** an approval card renders with the command in a code block and **nothing further streams** until you click Approve or Deny; the agent's next message reflects your choice. **Fail:** plain text with no buttons, or it continues without waiting.

**`/generative-ui/tool-rendering`** — Named renderer for `get_weather` plus a wildcard fallback. **Try:** `What's the weather in Tokyo?` **Pass:** `Calling weather API...` becomes `Called the weather API for Tokyo.` **Fail:** raw JSON or nothing — the renderer name and the Python function name disagree.

**`/generative-ui/a2ui/dynamic-schema`** — ⚠️ **Partial (not yet checked in a browser).** A catalog of custom components (cards, metrics, tables, Recharts bar/pie) on a nested `<CopilotKit a2ui={{ catalog }}>`. The model designs a surface from it per request. This follows the prose's auto-inject path, not the demo code (§9.20). **Try:** `Show me my sales dashboard for this quarter.` **Pass:** a one-line reply and a rendered surface; the Inspector shows a `generate_a2ui` call the agent never declared. **Fail:** prose only (no tool injected), or a red *Catalog not found* box (the model omitted `catalogId`).

**`/generative-ui/a2ui/fixed-schema`** — ⚠️ **Partial (backend verified, not yet checked in a browser).** A flight card whose component tree is JSON on the agent side; `display_flight` supplies only the data. **Try:** `Find me a flight from SFO to JFK on United for $289.` **Pass:** a *Flight Details* card showing `SFO → JFK`, a `UNITED` badge and `$289`; *Book flight* turns green and reads *Booked*. **Fail:** text only (the middleware did not see the operations), or a card with blank fields (zod 4 installed instead of 3, §9.18).

**`/generative-ui/open-generative-ui`** — ⚠️ **Partial (not yet checked in a browser).** Agent-authored HTML/CSS/JS streaming into a sandboxed iframe, with a minimal/advanced toggle. **Try:** `Quicksort visualization` (minimal), then `Calculator (calls evaluateExpression)` (advanced). **Pass:** placeholder lines, then a preview that fills in and animates. In *advanced*, the calculator's result appears and the browser console logs `[open-gen-ui/advanced] evaluateExpression …`. **Fail:** plain text or raw HTML, meaning `generateSandboxedUi` never reached the agent.

**`/generative-ui/json-render`** — ❌ **Broken, by design.** The doc's renderer, its missing helpers written in, and its `<Renderer spec catalog>` call kept as published. A **fixed** mode sits beside it. **Try (as published):** `Break down revenue by category as a pie chart.` **Pass:** a red box, most likely `useVisibility must be used within a VisibilityProvider`. **Try (fixed):** the same prompt. **Pass:** a pie chart. A metric-led dashboard prompt renders nothing in *as published* and raw JSON in *fixed*: the bundle agent's `MetricCard` props do not match the doc's catalog (§9.21).

**`/generative-ui/hashbrown`** — ❌ **Broken, by design.** The doc's three Hashbrown calls kept as published, plus a fixed mode. **Try (as published):** `Show me a sales dashboard.` **Pass:** a red box, `TypeError: Cannot read properties of undefined (reading 'forEach')`. **Try (fixed):** the same. **Pass:** no crash, suggestion pills, an empty reply. The bundle agent's component names (`metric`, `pieChart`, …) are not in the doc's catalog, so nothing parses (§9.22).

**`/generative-ui/state-rendering`** — ⚠️ **Partial.** The React half is implemented as documented and is reactive; no agent writes `searches`, because the doc page has no Python on it. **Try:** `Add a search for the tallest mountains`. **Pass:** the agent replies normally and the Searches list stays empty — that is the documented-but-unimplementable outcome, not a wiring bug. **Fail:** the chat itself errors, or the raw-state pane throws.

### App Control

**`/frontend-tools`** — `useFrontendTool`, executed in the browser. **Try:** `Say hello to Malaika`. **Pass:** a browser alert fires, and after you dismiss it the agent confirms it said hello — proving the return string travelled back over AG-UI. **Fail:** a text reply with no alert.

### Human in the Loop

**`/human-in-the-loop/agent`** — ❌ **Broken, by design.** The page's essay-approval tool, frontend and backend both as published. **Try:** `Write an essay about the benefits of AI.` **Pass:** a run error before any reply: `The AG-UI frontend tools defines a tool whose name conflicts with existing tool from the agent: 'write_essay'` (observed in the browser as a `RUN_ERROR` event, and against the backend directly). **Fail:** a draft card. That would mean the frontend tool was not sent (§9.23).

**`/human-in-the-loop/governed-actions`** — ⚠️ **Partial (not yet checked in a browser).** The `useHumanInTheLoop` half of the page on `my_agent`. `useInterrupt` and `handleApproval` are shown as text. **Try:** `Use approve_governed_action to apply a 30% discount to account NW-8812, verdict require_approval.` **Pass:** a *User approval required* card with the arguments as JSON. The run waits for Approve or Reject. **Fail:** a prose answer. Name the tool explicitly; nothing in the agent's prompt mentions it.

### Shared State

**`/shared-state/in-app-agent-read`** — Reading `StateDeps` state through `agent.state`. **Try:** on load the Language line should already read `english` and the raw-state block `{"language": "english"}`; then say `Switch to Spanish`, then `Change it back to English`. **Pass:** the panel updates on each turn *and* the agent starts replying in that language. **Fail:** the panel shows an em-dash on load (the seed effect did not run), or the agent acknowledges in text without a `set_language` tool call, leaving the panel stale.

**`/shared-state/in-app-agent-write`** — `agent.setState`, both doc variants. **Try:** press **Toggle Language**, then say `tell me a joke`; then press **Toggle & re-run** and watch without typing. **Pass:** the first path changes the agent's language on its next turn; the second produces a reply immediately. **Fail:** the panel flips but the agent keeps replying in the old language.

### Multi-Agent

**`/multi-agent/subagents`** — ⚠️ **Partial.** A supervisor delegating to three Pydantic AI sub-agents, each exposed as a tool. **Try:** `Produce a short blog post about the benefits of cold exposure training. Research first, then write, then critique.` **Pass:** three inline cards (Researcher, Writer, Critic) step through *starting → running → done*, and a banner names the active one. **The left-hand delegation log stays at *0 calls*.** That is the finding: the tools mutate `ctx.deps.state` and no state event is ever emitted (§9.24). **Fail:** no cards, or an error.

### Pydantic AI

**`/multi-agent-flows`** — Router mode versus agent lock mode. **Try:** `What's the weather in Tokyo?` in router mode, then the same question locked to `weather_agent`. **Pass:** router mode lands on `default` (no tools) and answers in prose; locked to `weather_agent` the same question triggers a real `get_weather` call, visible in the inspector. **Fail:** both modes behave identically.

### Backend

**`/copilot-runtime`** — The live runtime config, routing across all four ids. **Try:** `Hello`, then `What's the weather in Tokyo?` on each id. **Pass:** every id streams; only `weather_agent` calls a tool. **Fail:** an agent-not-found error — a key is missing from the runtime, or its mount is missing from `backend/main.py`.

**`/ag-ui`** — Live capture of the raw event stream beside the chat producing it, on `weather_agent` so one prompt exercises the full range. **Try:** `What's the weather in Tokyo?` **Pass:** `RUN_STARTED`, a burst of `TEXT_MESSAGE_CONTENT`, `TOOL_CALL_START`/`END`, `TOOL_CALL_RESULT` carrying *The weather in Tokyo is sunny.*, then `RUN_FINISHED`. **Fail:** the log stays empty while the chat streams.

---

## 8. Testing checklist / current status

| Doc page | Route | Status | Notes |
|---|---|---|---|
| [Quickstart](https://docs.copilotkit.ai/pydantic-ai/quickstart?agent=bring-your-own) | `/quickstart` | ✅ Working | Bring-your-own-agent path, under the doc's `providers.tsx` (Quickstart demo only). Env var name and Pydantic AI major version differ — §9.25. |
| [Prebuilt Components](https://docs.copilotkit.ai/pydantic-ai/prebuilt-components) | `/prebuilt-components` | ✅ Working | All three components, doc `labels`. |
| [Threads Drawer](https://docs.copilotkit.ai/pydantic-ai/prebuilt-components/copilot-threads-drawer) | `/prebuilt-components/copilot-threads-drawer` | ✅ Working | Drop-in drawer sharing one chat configuration. Renders locked without a license token — §9.16. |
| [Headless Threads](https://docs.copilotkit.ai/pydantic-ai/headless-threads) | `/headless-threads` | ✅ Working | `useThreads` + hand-built list, including rename. Mutations need Intelligence mode. |
| [Thread & History Lifecycle](https://docs.copilotkit.ai/pydantic-ai/threads-lifecycle) | `/threads-lifecycle` | ✅ Working | `setActiveThreadId` / `startNewThread`, with the explicit-vs-not distinction live. |
| [Slots](https://docs.copilotkit.ai/pydantic-ai/custom-look-and-feel/slots) | `/custom-look-and-feel/slots` | ✅ Working | Runs correctly; **does not typecheck** by design — §9. Not in the doc sidebar. |
| [Headless UI](https://docs.copilotkit.ai/pydantic-ai/custom-look-and-feel/headless-ui) | `/custom-look-and-feel/headless-ui` | ✅ Working | All four doc snippets assembled. Not in the doc sidebar. |
| [Programmatic Control](https://docs.copilotkit.ai/pydantic-ai/programmatic-control) | `/programmatic-control` | ✅ Working | Dashboard + state write + subscriber. Tool-call rendering shown, not implemented. |
| [Inspector](https://docs.copilotkit.ai/pydantic-ai/inspector) | `/inspector` | ✅ Working | On by default in dev; turned off at the root only where a page mounts its own provider — §9.10. |
| [Display-only](https://docs.copilotkit.ai/pydantic-ai/generative-ui/your-components/display-only) | `/generative-ui/your-components/display-only` | ✅ Working | `useComponent`. Not in the doc sidebar. |
| [Interactive](https://docs.copilotkit.ai/pydantic-ai/generative-ui/your-components/interactive) | `/generative-ui/your-components/interactive` | ✅ Working | `useHumanInTheLoop`. Generic supplied explicitly — §9. Not in the doc sidebar. |
| [Tool Rendering](https://docs.copilotkit.ai/pydantic-ai/generative-ui/tool-rendering) | `/generative-ui/tool-rendering` | ✅ Working | Named + wildcard renderers over a real `tool_plain`. |
| [State Rendering](https://docs.copilotkit.ai/pydantic-ai/generative-ui/state-rendering) | `/generative-ui/state-rendering` | ⚠️ Partial | The doc's `agent.py` block contains React, not Python. Frontend complete; no agent writes `searches` — §9. |
| [A2UI · Dynamic Schema](https://docs.copilotkit.ai/pydantic-ai/generative-ui/a2ui/dynamic-schema) | `/generative-ui/a2ui/dynamic-schema` | ⚠️ Partial | Prose auto-inject path; the demo's agent-side tool needs an unpublished helper — §9.20. Not yet checked in a browser. |
| [A2UI · Fixed Schema](https://docs.copilotkit.ai/pydantic-ai/generative-ui/a2ui/fixed-schema) | `/generative-ui/a2ui/fixed-schema` | ⚠️ Partial | Backend verified. Needs zod 3 (§9.18), borrowed `booked_schema.json` (§9.19), Mastra's renderers. Not yet checked in a browser. |
| [Open Generative UI](https://docs.copilotkit.ai/pydantic-ai/generative-ui/open-generative-ui) | `/generative-ui/open-generative-ui` | ⚠️ Partial | Demo-bundle code, verbatim; both cells. Not yet checked in a browser. |
| [JSON Render](https://docs.copilotkit.ai/pydantic-ai/generative-ui/json-render) | `/generative-ui/json-render` | ❌ Broken | By design: the doc's library call throws. Fixed mode renders charts; metric cards never validate — §9.21. |
| [Hashbrown](https://docs.copilotkit.ai/pydantic-ai/generative-ui/hashbrown) | `/generative-ui/hashbrown` | ❌ Broken | By design: the doc's hook calls throw. Fixed mode renders nothing for the bundle agent — §9.22. |
| [MCP Apps](https://docs.copilotkit.ai/pydantic-ai/generative-ui/mcp-apps) | — | 🚧 Not started | Skipped for now. The prose uses a TypeScript `BuiltInAgent` and an MCP server on `:3108` it does not provide; the demo bundle uses a Pydantic AI agent and the public Excalidraw server. |
| [Frontend Tools](https://docs.copilotkit.ai/pydantic-ai/frontend-tools) | `/frontend-tools` | ✅ Working | `sayHello`, browser-executed. |
| [HITL · Pydantic AI Agents](https://docs.copilotkit.ai/pydantic-ai/human-in-the-loop/agent) | `/human-in-the-loop/agent` | ❌ Broken | By design: front and back both define `write_essay`; the run is refused with `RUN_ERROR` (observed in the browser) — §9.23. |
| [Governed Action Approval UI](https://docs.copilotkit.ai/pydantic-ai/human-in-the-loop/governed-actions) | `/human-in-the-loop/governed-actions` | ⚠️ Partial | `useHumanInTheLoop` half only; Pydantic AI never emits an AG-UI interrupt. Not yet checked in a browser. |
| [Reading agent state](https://docs.copilotkit.ai/pydantic-ai/shared-state/in-app-agent-read) | `/shared-state/in-app-agent-read` | ✅ Working | `initialState`/`render` missing, and `StateDeps` is one-way — §9. |
| [Writing agent state](https://docs.copilotkit.ai/pydantic-ai/shared-state/in-app-agent-write) | `/shared-state/in-app-agent-write` | ✅ Working | Both variants; initial state seeded manually — §9. |
| [Sub-Agents](https://docs.copilotkit.ai/pydantic-ai/multi-agent/subagents) | `/multi-agent/subagents` | ⚠️ Partial | Delegation and inline cards work; the delegation log stays empty (no state event, observed) — §9.24. |
| [Multi-Agent Flows](https://docs.copilotkit.ai/pydantic-ai/multi-agent-flows) | `/multi-agent-flows` | ✅ Working | Doc page ships no code blocks; both modes implemented — §9. |
| [Copilot Runtime](https://docs.copilotkit.ai/pydantic-ai/copilot-runtime) | `/copilot-runtime` | ✅ Working | Live config + routing. A2UI/MCP Apps shown, not exercised. |
| [AG-UI](https://docs.copilotkit.ai/pydantic-ai/ag-ui) | `/ag-ui` | ✅ Working | Live event capture. Callback shapes are not uniform — §9. |
| — | `/status` | ✅ Working | In-app mirror of this table. |

**Pages in the doc sidebar that this repo does not cover:** CopilotKit CLI, Build with agents, the remaining Rich Threads pages, MCP Apps (listed above as not started), all Intelligence Platform (premium) pages, and all Troubleshooting pages. They are outside the requested scope, not broken.

---

## 9. Known issues / doc-vs-implementation discrepancies

**1. State Rendering's `agent.py` is not Python.**
[The page](https://docs.copilotkit.ai/pydantic-ai/generative-ui/state-rendering) ships two code blocks. The second is the React page. The first is labelled `agent.py` but contains the *same* TypeScript/React content — a `type AgentState = {...}` and a `function YourMainContent()` calling `useAgent`. There is no Python on the page: no state model, no tool that writes `searches`, no instruction telling the agent when to write it. Writing that agent would mean inventing the schema, so this repo does not. `backend/agents/search_agent.py` is a placeholder explaining exactly this and is not mounted; the route is ⚠️ Partial and the doc's block is reproduced in-app so the discrepancy is checkable. The route page links to Shared State, which exercises the same `agent.state` mechanism against an agent that does define one.

**2. The slots demo does not typecheck — deliberately.**
`frontend/src/app/custom-look-and-feel/slots/demo-chat/page.tsx` is the doc's level-3 sample transcribed as written. `tsc --noEmit` reports four errors: `TS7031` ×2 and `TS7006` for the untyped `messages`, `isRunning`, and `msg` bindings under `strict`, and `TS2322` because the `messageView` slot is typed as `typeof CopilotChatMessageView` and expects a static `Cursor` member a plain arrow function does not have. It runs correctly under `next dev` and **will fail `next build`**. Kept unpatched so the drift stays visible.

**3. `to_ag_ui()` is gone — resolved by the Quickstart rewrite.**
This used to be a live discrepancy: every doc page built its server with `agent.to_ag_ui()`, which pydantic-ai-slim 1.107 deprecates and 2.0 removes, so the repo printed a `PydanticAIDeprecationWarning` for each agent on every boot. The Quickstart has since moved to a Starlette route around `AGUIAdapter.dispatch_request(request, agent=agent)`, and this repo followed. **Startup is now warning-free** for that API. Two follow-ons: the Shared State pages still import `StateDeps` from the deprecated `pydantic_ai.ag_ui`, so `language_agent.py` imports it from `pydantic_ai.ui` instead (same object); and deps are now built per request rather than once at import, since `dispatch_request` takes `deps` per call.

**16. Threads have two independent gates, and the drawer reads the one you would not expect.**
`INTELLIGENCE_API_KEY` decides whether threads *work*: it puts `/info` into `mode: "intelligence"` and turns on `threadEndpoints.mutations`. `COPILOTKIT_LICENSE_TOKEN` decides whether `<CopilotThreadsDrawer>` *renders* them: the drawer gates on `/info`'s `licenseStatus`, which is derived from the license token and not from the project key. Verified directly against the runtime handler:

| | no key | both keys set |
|---|---|---|
| `mode` | `sse` | `intelligence` |
| `licenseStatus` | *(absent)* | `invalid` (a deliberately fake token) |
| `threadEndpoints.mutations` | `false` | `true` |

So a correctly-keyed runtime can serve threads perfectly while every drawer in the app shows an Upgrade button. The connection panel on `/` reports the two on separate rows for that reason, and reads both off `/info` rather than off whether the variables happen to be set — a key can be present and still unread.

**17. SSE mode's thread flags read as a false positive.**
With no Intelligence key the in-memory runner still reports `threadEndpoints.list: true` and `inspect: true`. Only `mutations` and `realtimeMetadata` distinguish the two modes, which is why the health panel keys off `mode` rather than off the thread flags.

**4. `openai:gpt-5.4-mini` is not a real model id.**
[Tool Rendering](https://docs.copilotkit.ai/pydantic-ai/generative-ui/tool-rendering) and both Shared State pages build `Agent("openai:gpt-5.4-mini", …)`. OpenAI does not serve that id — an agent built with it fails on its first run with a 404. `backend/agents/model.py` uses the Quickstart's `openai:gpt-4.1-mini` instead, overridable with `OPENAI_MODEL`.

**5. The Quickstart's install line pulls in v1 React packages.**
It runs `npm install @copilotkit/react-ui @copilotkit/react-core @copilotkit/runtime @ag-ui/client`, but every component it then imports comes from `@copilotkit/react-core/v2`. `@copilotkit/react-ui` is the v1 package and is **not** a dependency here.

**6. `useAgent` has no `initialState` and no `render` prop.**
[Reading agent state](https://docs.copilotkit.ai/pydantic-ai/shared-state/in-app-agent-read) shows both — `useAgent({ agentId, initialState })` to seed a value, and `useAgent({ render })` to draw state into the chat. Neither exists on `useAgent` in 1.69.3, whose props are `{ agentId, threadId, runtimeAgentId, updates, throttleMs }`. `initialState` is dropped silently, so the doc's promised "you'll see the language set to `english`" never happens: `agent.state` stays `undefined` and the panel renders an em-dash. Both Shared State pages here seed it with `agent.setState` in a mount effect instead, guarded on `useAgent`'s `isReady` so the seed does not land on the provisional agent returned before the runtime `/info` sync resolves. The `render` variant is shown in-app rather than implemented; the same missing prop is what the State Rendering page's first block relies on.

**6b. `StateDeps` is one-way — pydantic-ai never emits a state event.**
Both Shared State pages present `StateDeps[AgentState]` as if state were shared in both directions. It is not. `AGUIAdapter` reads `RunAgentInput.state` into `ctx.deps.state` (`pydantic_ai/ui/_adapter.py`), but pydantic-ai-slim 1.107.5 contains no `StateSnapshotEvent` or `StateDeltaEvent` emission anywhere — so a run that mutates `ctx.deps.state` publishes nothing, `agent.state` in the browser never changes, and the read page can only ever display what the app itself wrote. The doc's `agent.py` has no tool, so as written the agent can never move the value.

The one channel back out is `_handle_tool_result` in `pydantic_ai/ui/ag_ui/_event_stream.py`, which forwards any `ag_ui.core.BaseEvent` found on a tool return's `metadata` (or content) straight into the stream. `backend/agents/language_agent.py` therefore adds a `set_language` tool — not in the doc — returning `ToolReturn(return_value=…, metadata=StateSnapshotEvent(…))`. That is what makes `Switch to Spanish` in chat move the Language panel.

**7. `useRenderTool` requires `parameters`, and its render prop is not `args`.**
The Tool Rendering doc's named renderer omits `parameters` and reads `args.location`. In 1.66.2 the named overload requires a schema, and the render prop carrying the arguments is called `parameters`.

**8. `useHumanInTheLoop` does not infer its argument type.**
The Interactive doc reads `args.command`. The hook defaults its arg type to `Record<string, unknown>` rather than reading `parameters`, so `args.command` is `unknown` and will not compile in JSX. The type parameter is supplied explicitly.

**9. `useComponent` takes a dependency array.**
The Display-only doc calls it with a single argument, which re-registers the component on every render. 1.66.2 accepts a second dependency-array argument; this repo passes `[]`.

**10. One Inspector per page, owned by the provider the chat runs on.**
The [Inspector page](https://docs.copilotkit.ai/pydantic-ai/inspector) documents `enableInspector`. In 1.77 that is also the prop `<CopilotKitProvider>` reads, and it is on in every development build unless set to `false`. The `showDevConsole="auto"` this app used to pass was being ignored. Several routes now mount their own `<CopilotKit>` (Quickstart, both A2UI pages, JSON Render, Hashbrown, Open Generative UI, Sub-Agents), and every provider brings its own Inspector. Two on one page send lit-html into an unbounded assert loop that can take down the tab and the dev server. `src/lib/inspector.ts` lists those routes, and the root provider passes `enableInspector={false}` on exactly those, so the nested provider's Inspector, the one that can see the chat's traffic, is the only one mounted.

**11. AG-UI subscriber callbacks are not uniformly shaped.**
The [AG-UI page](https://docs.copilotkit.ai/pydantic-ai/ag-ui) destructures `textMessageBuffer`, `toolCallName`, and `agent` directly, implying every callback flattens its payload. `onToolCallStartEvent`, `onRunErrorEvent`, and `onToolCallResultEvent` hand back only a raw `event` object. Destructuring the wrong shape is a type error.

**12. `randomUUID` is imported from `@copilotkit/shared`.**
Headless UI and Programmatic Control both do this. That package is a transitive dependency, not a direct one, so importing from it reaches past the public surface. This repo calls the browser's `crypto.randomUUID()` — which is what the Shared State page's own advanced snippet uses.

**13. Multi-Agent Flows ships no code blocks.**
Unlike its neighbours, [the page](https://docs.copilotkit.ai/pydantic-ai/multi-agent-flows) describes router mode and agent lock mode in prose with the configuration inline. Both modes are implemented; the configuration is written out in-app.

**14. Doc sidebar oddities as of the sync date.**
The `Shared State` group renders as a heading with no items, though both pages resolve. `custom-look-and-feel/slots`, `custom-look-and-feel/headless-ui`, and both `generative-ui/your-components/*` pages resolve fine but are absent from the sidebar — they are flagged **Not in doc sidebar** in-app.

**18. A2UI binding needs zod 3, and the doc installs zod 4.**
The A2UI pages say `npm install @copilotkit/a2ui-renderer zod` and write their definitions with `import { z } from "zod"`. That now installs zod 4. The renderer's `GenericBinder` (from `@a2ui/web_core`) decides which props to resolve from the data model by reading zod 3 internals: `_def.typeName === "ZodUnion"` and `_def.shape()`. On a zod 4 schema `_def.typeName` is `undefined` (confirmed in node), so every prop counts as static. Each `{ "path": "/origin" }` binding reaches the renderer unresolved, the demo's `s()` helper turns it into `""`, and the fixed-schema card renders with blank airports, airline and price, with no error. This repo pins `zod@3.25.76` at the root, the same version `@copilotkit/a2ui-renderer` depends on, so there is one copy and the definitions keep the doc's `import { z } from "zod"` verbatim. (Importing `"zod/v3"` from zod 4 instead fixes the runtime but fails `tsc`: the renderer's zod 3 and zod 4's bundled v3 are two copies of the same classes, and TypeScript rejects one for the other on a private `_cached` member.) `@json-render/core` keeps its own private zod 4.

**19. A2UI Fixed Schema loads a file the pydantic-ai bundle never publishes.**
`a2ui_fixed.py` runs `_load_schema(_SCHEMAS_DIR / "booked_schema.json")` at import time. pydantic-ai's demo bundle has `flight_schema.json` only. Without the file, `import agents` raises `FileNotFoundError` and the whole agent server is down. `backend/agents/a2ui_schemas/booked_schema.json` is the google-adk bundle's copy of the same page's file, byte for byte. `BOOKED_SCHEMA` is never used, so any valid copy would do. Separately, this route uses the **Mastra** bundle's `renderers.tsx`: its `ActionButton` wires the Book button and shows *Booked*. pydantic-ai's own renders an inert button, and the route shows both.

**20. A2UI Dynamic Schema: the demo code imports an unpublished module.**
The demo's `a2ui_dynamic.py` does `from tools import build_a2ui_operations_from_tool_call`, and no bundle publishes `tools`. The page's prose also describes a default path in which the catalog on the provider auto-injects `generate_a2ui` with no runtime config. This repo runs that default path. The agent keeps the demo's model and `SYSTEM_PROMPT` but has no tool; the runtime route is the demo's with its `a2ui` block removed. The page's "opted out" snippet is LangGraph's (`ag_ui_langgraph.get_a2ui_tools`, `ChatOpenAI`), not Pydantic AI's.

**21. JSON Render: the doc's catalog and the doc's agent disagree.**
On top of the library mismatches (`<Renderer>` takes `registry`, not `catalog`, and needs `JSONUIProvider`; the `assistantMessage` slot rejects a plain component; suggestions registered outside the provider), the page's `registry.tsx` declares `MetricCard` as `{ title: string, value: number, delta?: number }`. The demo bundle's agent prompts for `{ label: string, value: string, trend: string | null }`. Observed: a dashboard request comes back rooted at a `MetricCard` with `label`/`value: "$2.15M"`. It fails validation, so nothing renders in *as published* and raw JSON shows in *fixed*. `BarChart`/`PieChart` survive, because the catalog only requires `data`.

**22. Hashbrown: three incompatible shapes.**
The page's hook calls do not match `@hashbrownai/react` 0.6.1 (`useJsonParser` needs a schema; `useUiKit` takes `{ components }`; the kit is rendered with `.render(value)`), so *as published* throws on the first message. The page's *Backend* section shows `{ "type": "MetricCard", … }`. The demo bundle's agent emits `{ "ui": [ { "metric": { "props": … } } ] }` with lowercase names (`metric`, `pieChart`, `barChart`, `dealCard`, `Markdown`) and chart `data` as a JSON *string* (observed). The fixed mode's kit, built from the page's own catalog, knows only `MetricCard`, `BarChart`, `PieChart` and `Stack`, so nothing the agent sends parses.

**22b. `@hashbrownai/core` 0.6.1 needs an older AG-UI than CopilotKit does.**
Hashbrown 0.6.1 (the latest release) depends on `@ag-ui/core` / `@ag-ui/client` **0.0.59** and imports `EventSchemas` from it. This repo's `overrides` pin every `@ag-ui/*` to **1.0.1** so CopilotKit and the runtime routes share one copy, and 1.0.1 no longer exports `EventSchemas`. Under the global pin alone the Hashbrown route fails to build: `Export EventSchemas doesn't exist in target module` in `@hashbrownai/core/index.esm.js`. `tsc` does not catch it; only the bundler does. Fixed with a scoped override, so Hashbrown gets its own nested 0.0.59 and everything else stays on 1.0.1:

```json
"overrides": {
  "@ag-ui/client": "1.0.1",
  "@ag-ui/core": "1.0.1",
  "@hashbrownai/core": { "@ag-ui/core": "0.0.59", "@ag-ui/client": "0.0.59" }
}
```

Hashbrown uses AG-UI only internally, never through CopilotKit's agents, so the second copy does not cause the duplicate-`AbstractAgent` type breaks the global pin exists to prevent.

**23. Human in the Loop · Pydantic AI Agents cannot run as published.**
The frontend registers `write_essay` and the backend defines `write_essay`, so the run is refused. Observed, posting the frontend tool straight to the backend: `RUN_ERROR: The AG-UI frontend tools defines a tool whose name conflicts with existing tool from the agent: 'write_essay'`. The frontend snippet also uses v1 action options (`renderAndWaitForResponse`, `available: "frontend"`) on v2's `useFrontendTool`, shows no imports, and renders a `<Markdown>` it never defines (a `<pre>` stand-in here). The tool arguments differ (`draft` vs `topic`), and the prose refers to `CopilotKitState` and a `writeEssay` action that appear nowhere. The model is `openai:gpt-5.4-mini` again (§9.4).

**24. Sub-Agents: the delegation log is never synced.**
The supervisor's tools append to and update `ctx.deps.state.delegations`, and the code comments say Pydantic AI's AG-UI bridge "syncs those back to the frontend at end-of-turn". It does not (§9.6b). Observed: a full research → write → critique run streams three tool calls and results and `RUN_FINISHED`, with zero `STATE_SNAPSHOT`/`STATE_DELTA` events. The inline cards (`useRenderTool`) and the activity banner work, because they read the tool-call stream; the left-hand log stays at *0 calls*. The bundle's docstring describes returning a `StateSnapshotEvent` per step, which would work, but no such code is in the file.

**25. Quickstart drift not yet applied.**
The page now pins `pydantic-ai-slim[ag-ui,openai]>=2,<3` and `starlette>=0.46.2`, while this repo is on 1.107.7 / 0.45.3. Its runtime reads `CPK_INTELLIGENCE_API_KEY`, which is what `npx copilotkit@latest project select` writes; this repo still reads `INTELLIGENCE_API_KEY`. Its `providers.tsx` is applied, but only around the Quickstart demo, because every other route needs the harness's root provider (identity headers, no locked agent).

**15. The Quickstart assumes one agent at the root.**
It points `HttpAgent` at `http://localhost:8000/`. This harness needs three, so `backend/main.py` gives each agent its own `POST /<id>/` route and the runtime addresses `http://localhost:8000/<id>/`. How each agent is built is unchanged. The trailing slash matters — without it Starlette issues a redirect the POST does not survive cleanly.

---

## 10. Troubleshooting

**Chat shows an error banner immediately.**
Check the **Connection check** panel on `/`. If the agent server row is red, it is not running — `cd backend && uv run main.py`. If it is green, the failure is downstream: check `OPENAI_API_KEY` in `backend/.env`. A wrong key surfaces as a `RUN_ERROR` event carrying OpenAI's 401 text, visible in the inspector and on `/ag-ui`.

**`OPENAI_API_KEY is not set` on backend startup.**
`main.py` fails fast rather than starting a server that cannot work. Create `backend/.env` from `.env.example`.

**`PydanticAIDeprecationWarning` on every boot.**
Expected. See §9 item 3 — the docs use an API the installed version deprecates.

**A route says the agent was not found.**
The id must exist in three places at once: the `agentId` on the page, the key in `frontend/src/app/api/copilotkit/route.ts`, and the mount in `backend/main.py`. The inspector's **Available Agents** tab shows what the runtime actually resolved; `curl http://localhost:8000/health` shows what the backend actually mounted.

**Tool runs but its UI never appears.**
The renderer name must equal the Python function's name exactly — `get_weather`, not `getWeather`. This is the most common cause.

**The inspector never appears.**
It is force-disabled in production builds. Confirm you are on `npm run dev`. On routes that mount their own `<CopilotKit>`, the Inspector belongs to that provider, not the root one — §9 item 10.

**The tab or dev server locks up on a page with its own `<CopilotKit>`.**
Two Inspectors are mounted. Any route whose page renders its own provider must be listed in `frontend/src/lib/inspector.ts` → `NESTED_PROVIDER_ROUTES`.

**`Export EventSchemas doesn't exist in target module` on `/generative-ui/hashbrown`.**
The scoped `@hashbrownai/core` override in `frontend/package.json` is missing, or `npm install` has not been re-run since it was added. Hashbrown needs its own `@ag-ui/core` 0.0.59 — §9.22b. Restart `npm run dev` afterwards.

**The A2UI flight card renders with blank fields.**
`frontend/node_modules/zod` is 4.x. This repo needs the pinned 3.25.76 — §9.18.

**The whole agent server fails on import with `FileNotFoundError: …booked_schema.json`.**
`backend/agents/a2ui_schemas/booked_schema.json` is missing — §9.19.

**The Threads Drawer shows "Threads are a CopilotKit Intelligence feature".**
That is `licenseStatus`, not the project key. Set `COPILOTKIT_LICENSE_TOKEN` as well as `INTELLIGENCE_API_KEY` — see §9.16. The connection panel on `/` tells you which of the two is missing.

**Rename / Archive / Delete do nothing on `/headless-threads`.**
`/info` reports `threadEndpoints.mutations: false`, which is SSE mode. Set `INTELLIGENCE_API_KEY`. Also confirm the runtime route exports `PATCH` and `DELETE` — the Quickstart's sample exports only `GET` and `POST`, and those mutations 405 without them.

**Everything 404s except the bare `/api/copilotkit` URL.**
The handler is at the single-segment `route.ts` rather than `[[...slug]]/route.ts`. `GET /info` still answers 200 from the old shape, so the app looks connected and never replies — §9.

**`next build` fails with TS7031 / TS2322.**
Expected, and confined to the slots demo. See §9 item 2.

**Connection refused on 8000 despite the server running.**
`localhost` may be resolving to IPv6 while uvicorn binds IPv4. Set `PYDANTIC_AI_AGENT_URL=http://127.0.0.1:8000` in `frontend/.env.local`.

**Frontend env changes have no effect.**
Next reads `.env.local` at startup. Restart the dev server.

---

## Doc drift detection

`/doc-sync` keeps this repo honest about the docs it mirrors. Press **Sync docs now** (on the landing page or on `/doc-sync`) and it fetches the markdown source behind every tracked doc page (every `docPath` in `nav-config.ts`), diffs each against the copy stored in `doc-snapshot/`, replaces that copy, and reports what moved — ranked by whether the change can actually break an implementation.

Doc pages are fetched by appending `.md` to their URL, which returns the authored MDX rather than 250 KB of rendered HTML. Every response is checked for `text/markdown` before it is allowed near the snapshot: a URL that misses the markdown handler still answers `200` with the HTML app shell, and writing that in would destroy the baseline and report the whole corpus as rewritten on the next run. A run commits all pages or none.

**Severity is decided by where the edit landed**, not how big it was:

| Level | Trigger |
|---|---|
| **High** | a changed line inside a fenced code block, a changed fence count, or a page that now 404s and is gone from the sitemap |
| **Medium** | a changed heading, changed frontmatter `title`/`description`, or prose in the same section as changed code |
| **Low** | other prose |

**Sections checked** lists every tracked page in nav order with a mark — `✓` unchanged, `!` changed, `+` stored, `✗` 404, `~` unstable, `·` not checked. Expanding a row shows the comparison: for a changed page the diff (`−` existing snapshot, `+` newly fetched), and for an unchanged one the two matching hashes, which is the evidence the check ran.

**`doc-snapshot/CHANGELOG.md`** is the record that survives a re-sync. Because syncing replaces the copy it just compared against, the run *after* a change reports nothing — so the changelog is written at the moment of discovery and never rewritten later. Only changed pages are recorded; a clean run does not touch the file. It keeps the three most recent dated entries, counted rather than aged, so a change from six weeks ago still shows if nothing has happened since.

**One sync date.** `syncedAt` in `doc-snapshot/manifest.json`, rewritten on every run and shown on `/`, `/status` and `/doc-sync`. There is no hand-maintained date to keep in step with it.

**To test it**, edit any `doc-snapshot/pages/*.md` file and press the button — a line inside a code fence for High, a `##` heading for Medium, a sentence for Low. The comparison reads the stored file itself, so nothing else needs changing. Both `/doc-sync` and the changelog label the result as a local snapshot edit rather than upstream drift.

Commit `doc-snapshot/` — `pages/`, `manifest.json` and `CHANGELOG.md` are the baseline every diff is taken against. `reports/` is gitignored derived data.

---

## 11. Project structure

```
pydantic-ai/
├── CLAUDE.md                     build instructions (shared across framework repos)
├── README.md                     this file
├── .env.example                  every variable, annotated
│
├── backend/                      Python agent server — localhost:8000
│   ├── main.py                   Starlette; one AGUIAdapter.dispatch_request route per agent + /health
│   ├── pyproject.toml            the Quickstart's dependency set
│   └── agents/
│       ├── __init__.py           AGENTS — id → ASGI app, the mount table
│       ├── model.py              the one place the model id is decided
│       ├── my_agent.py           Quickstart agent (exports `agent`, not an ASGI app)
│       ├── weather_agent.py      Tool Rendering agent — get_weather
│       ├── language_agent.py     Shared State agent — StateDeps, set_language tool, per-request build_deps()
│       ├── a2ui_fixed.py         A2UI Fixed Schema — demo bundle, verbatim
│       ├── a2ui_schemas/         flight_schema.json (bundle) + booked_schema.json (borrowed, §9.19)
│       ├── a2ui_dynamic.py       A2UI Dynamic Schema — bundle prompt, no tool (§9.20)
│       ├── byoc_json_render_agent.py / byoc_hashbrown_agent.py   demo bundle, verbatim
│       ├── open_gen_ui_agent.py / open_gen_ui_advanced_agent.py  demo bundle, verbatim
│       ├── hitl_agent.py         Human in the Loop — the page's agent, model id swapped
│       ├── subagents.py          Sub-Agents supervisor — demo bundle, verbatim
│       └── search_agent.py       PLACEHOLDER — State Rendering has no Python (§9)
│
└── frontend/                     Next.js app — localhost:3000
    ├── src/app/
    │   ├── layout.tsx            provider + styles.css import
    │   ├── page.tsx              landing page + connection check
    │   ├── status/               in-app status table
    │   ├── prebuilt-components/copilot-threads-drawer/   Rich Threads: drop-in drawer
    │   ├── headless-threads/     Rich Threads: useThreads + hand-built list
    │   ├── threads-lifecycle/    Rich Threads: threadId resolution and replay
    │   ├── quickstart/providers.tsx + demo-chat/layout.tsx
    │   │                         the Quickstart's own provider, scoped to its demo
    │   ├── api/copilotkit/[[...slug]]/route.ts
    │   │                         Copilot Runtime (v2) — HttpAgent per agent,
    │   │                         CopilotKitIntelligence, identifyUser, 4 verbs
    │   ├── api/copilotkit-a2ui-fixed-schema/ · copilotkit-declarative-gen-ui/ ·
    │   │   copilotkit-ogui/      demo-bundle runtimes (single-route)
    │   ├── api/copilotkit-byoc-json-render/ · copilotkit-byoc-hashbrown/
    │   │                         harness-written runtimes the pages point at
    │   ├── generative-ui/a2ui/{fixed,dynamic}-schema/   a2ui/ catalog files, _components/, demo.tsx
    │   ├── generative-ui/{json-render,hashbrown}/       as-published + fixed demos
    │   ├── generative-ui/open-generative-ui/{minimal,advanced}/
    │   ├── human-in-the-loop/{agent,governed-actions}/
    │   ├── multi-agent/subagents/
    │   └── <doc-route>/
    │       ├── page.tsx          notes, pass/fail, source panels
    │       └── demo-chat/page.tsx    the running feature, chrome-free
    ├── src/components/
    │   ├── providers.tsx         CopilotKitProvider — router mode, identity headers, inspector ownership
    │   ├── byoc-dashboard.tsx    harness MetricCard/BarChart/PieChart for JSON Render + Hashbrown
    │   ├── demo-error-boundary.tsx  shows a published snippet's runtime error in place
    │   ├── nav-sidebar.tsx       nav, generated from nav-config
    │   ├── route-header.tsx      title, status badge, doc link
    │   ├── demo-frame.tsx        chrome for /demo-chat routes
    │   ├── source-code.tsx       renders repo files verbatim
    │   ├── backend-health.tsx    server-side probe of :8000 and of /api/copilotkit/info
    │   └── ui.tsx                Panel, Callout, TryIt, CodeBlock
    └── src/lib/
        ├── nav-config.ts         single source of truth: routes, docs, statuses
        ├── source.ts             reads repo files, slices # region markers
        ├── inspector.ts          which routes mount their own provider (one Inspector per page)
        └── health.ts             probes the agent server AND the runtime's /info (mode, licenseStatus)
```

`src/lib/nav-config.ts` is the file to edit when a status changes — the sidebar, every route header, and `/status` all read from it.

---

## 12. References

Grouped as the doc nav groups them. ⚑ marks pages that resolve but are absent from the sidebar as of 2026-08-05.

**Getting Started**
- [Overview](https://docs.copilotkit.ai/pydantic-ai)
- [Quickstart](https://docs.copilotkit.ai/pydantic-ai/quickstart?agent=bring-your-own)

**Basics**
- [Prebuilt Components](https://docs.copilotkit.ai/pydantic-ai/prebuilt-components)

**Rich Threads**
- [Threads Drawer](https://docs.copilotkit.ai/pydantic-ai/prebuilt-components/copilot-threads-drawer)
- [Headless Threads](https://docs.copilotkit.ai/pydantic-ai/headless-threads)
- [Thread & History Lifecycle](https://docs.copilotkit.ai/pydantic-ai/threads-lifecycle)

**Custom Look and Feel**
- [Slots](https://docs.copilotkit.ai/pydantic-ai/custom-look-and-feel/slots) ⚑
- [Headless UI](https://docs.copilotkit.ai/pydantic-ai/custom-look-and-feel/headless-ui) ⚑
- [Programmatic Control](https://docs.copilotkit.ai/pydantic-ai/programmatic-control)
- [Inspector](https://docs.copilotkit.ai/pydantic-ai/inspector)

**Generative UI**
- [Your Components · Display-only](https://docs.copilotkit.ai/pydantic-ai/generative-ui/your-components/display-only) ⚑
- [Your Components · Interactive](https://docs.copilotkit.ai/pydantic-ai/generative-ui/your-components/interactive) ⚑
- [Tool Rendering](https://docs.copilotkit.ai/pydantic-ai/generative-ui/tool-rendering)
- [State Rendering](https://docs.copilotkit.ai/pydantic-ai/generative-ui/state-rendering)
- [A2UI · Dynamic Schema](https://docs.copilotkit.ai/pydantic-ai/generative-ui/a2ui/dynamic-schema)
- [A2UI · Fixed Schema](https://docs.copilotkit.ai/pydantic-ai/generative-ui/a2ui/fixed-schema) · [Mastra's version](https://docs.copilotkit.ai/mastra/generative-ui/a2ui/fixed-schema) (renderers used here)
- [Open Generative UI](https://docs.copilotkit.ai/pydantic-ai/generative-ui/open-generative-ui)
- [JSON Render](https://docs.copilotkit.ai/pydantic-ai/generative-ui/json-render)
- [Hashbrown](https://docs.copilotkit.ai/pydantic-ai/generative-ui/hashbrown)
- [MCP Apps](https://docs.copilotkit.ai/pydantic-ai/generative-ui/mcp-apps) (not started)

**App Control**
- [Frontend Tools](https://docs.copilotkit.ai/pydantic-ai/frontend-tools)

**Human in the Loop**
- [Pydantic AI Agents](https://docs.copilotkit.ai/pydantic-ai/human-in-the-loop/agent)
- [Governed Action Approval UI](https://docs.copilotkit.ai/pydantic-ai/human-in-the-loop/governed-actions)

**Multi-Agent**
- [Sub-Agents](https://docs.copilotkit.ai/pydantic-ai/multi-agent/subagents)

**Shared State**
- [Reading agent state](https://docs.copilotkit.ai/pydantic-ai/shared-state/in-app-agent-read)
- [Writing agent state](https://docs.copilotkit.ai/pydantic-ai/shared-state/in-app-agent-write)

**Pydantic AI**
- [Multi-Agent Flows](https://docs.copilotkit.ai/pydantic-ai/multi-agent-flows)

**Backend**
- [Copilot Runtime](https://docs.copilotkit.ai/pydantic-ai/copilot-runtime)
- [AG-UI](https://docs.copilotkit.ai/pydantic-ai/ag-ui)

**Framework docs**
- [Pydantic AI](https://ai.pydantic.dev) · [AG-UI adapter](https://ai.pydantic.dev/ui/ag-ui/)
