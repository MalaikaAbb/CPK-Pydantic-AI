# CopilotKit + Pydantic AI Test Suite

A navigable, working test harness for the CopilotKit Pydantic AI integration — each doc page is a route that actually runs the thing it describes.

| | |
|---|---|
| **Doc sync date** | Machine-maintained — `doc-snapshot/manifest.json` → `syncedAt`, rewritten on every sync |
| **CopilotKit packages** | `@copilotkit/react-core` 1.69.0 · `@copilotkit/runtime` 1.69.0 (v2 surface) |
| **AG-UI package** | `@ag-ui/client` 0.0.57 |
| **Pydantic AI** | `pydantic-ai-slim[ag-ui,openai]` 1.107.1 · Starlette 0.45.3 · uvicorn 0.52.1 |
| **Frontend** | Next.js 16.3.0 (App Router) · React 19.2.8 · TypeScript 5 · Tailwind 4.3.3 |
| **Backend** | Python 3.12 · uv |
| **Build status** | No CI. Verified locally: lint ✅ · typecheck ⚠️ (4 known errors, all in one file — see §9) · agent server boots with zero deprecation warnings ✅ · live AG-UI stream through `AGUIAdapter` ✅ · runtime `/info` 200 in both SSE and Intelligence modes ✅ |

---

## 2. Overview

[Pydantic AI](https://ai.pydantic.dev) is a Python agent framework with first-class AG-UI support: `AGUIAdapter.dispatch_request` turns an ordinary agent into a Starlette route that speaks the protocol, which is what lets a React app drive it with streaming, tool calls, shared state, and generative UI.

This repo covers a **scoped set of 20 doc pages** (§8). Each route implements what its page teaches and shows the exact source that makes it work, read off disk at render time.

**Everything comes from the documentation.** No agent, tool, instruction, or state model was invented. Where a doc page does not supply working code — as on State Rendering, whose `agent.py` block contains React — the route says so, is marked ⚠️ Partial, and ships a documented placeholder rather than a guess.

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
  │  agents: { default, my_agent, weather_agent, language_agent }
  │  each a  new HttpAgent({ url: "http://localhost:8000/<id>/" })
  │  optional: CopilotKitIntelligence + identifyUser (threads, persistence)
  ▼  HTTP, server-to-server
Pydantic AI agent server  ·  localhost:8000  (Python)
  │  backend/main.py — Starlette, one AGUIAdapter.dispatch_request route per agent
  │  AG-UI events streamed back as SSE
  ▼
OpenAI  (openai:gpt-4.1-mini by default)
```

**Two processes, unlike the TypeScript integrations.** Pydantic AI is Python, so agents cannot run inside the Next app. You start both: `uv run main.py` in `backend/`, and `npm run dev` in `frontend/`.

The browser never talks to port 8000. The runtime route is the only thing that does, which is where the model provider key stays.

### The three agents

| Agent id | Tools / state | Used by |
|---|---|---|
| `my_agent` | — (two lines: `Agent(MODEL, instructions='Be fun!')`) | Quickstart, Prebuilt Components, Slots, Headless UI, Programmatic Control, Inspector, Display-only, Interactive, Frontend Tools, State Rendering, Multi-Agent Flows, Runtime |
| `weather_agent` | `get_weather` via `@agent.tool_plain` | Tool Rendering, AG-UI, Multi-Agent Flows |
| `language_agent` | `deps_type=StateDeps[AgentState]` — `language` | Shared State read + write, Multi-Agent Flows |
| `default` | alias for `my_agent` | what router mode resolves to |

Three rather than one because state is per-agent: only the Shared State agent is built with `deps_type=StateDeps[AgentState]`. Agent ids are the keys of the runtime's `agents: { … }` object, and they deliberately match the mount paths in `backend/main.py`, so the two sides cannot drift.

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
# {"status":"ok","agents":["language_agent","my_agent","weather_agent"]}
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

**`/quickstart`** — A Pydantic AI agent served by `AGUIAdapter.dispatch_request`, reached with `HttpAgent` through the multi-route runtime handler. The page shows that runtime route verbatim, including where Intelligence is configured. **Try:** `What can you help me with?` **Pass:** tokens stream, and the tone is noticeably jokey — the agent's only instruction is `'Be fun!'`. **Fail:** an error banner; check the connection panel, then `OPENAI_API_KEY`.

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

**`/generative-ui/state-rendering`** — ⚠️ **Partial.** The React half is implemented as documented and is reactive; no agent writes `searches`, because the doc page has no Python on it. **Try:** `Add a search for the tallest mountains`. **Pass:** the agent replies normally and the Searches list stays empty — that is the documented-but-unimplementable outcome, not a wiring bug. **Fail:** the chat itself errors, or the raw-state pane throws.

### App Control

**`/frontend-tools`** — `useFrontendTool`, executed in the browser. **Try:** `Say hello to Malaika`. **Pass:** a browser alert fires, and after you dismiss it the agent confirms it said hello — proving the return string travelled back over AG-UI. **Fail:** a text reply with no alert.

### Shared State

**`/shared-state/in-app-agent-read`** — Reading `StateDeps` state through `agent.state`. **Try:** `Switch to Spanish`, then `Change it back to English`. **Pass:** the Language line and raw-state block update, *and* the agent starts replying in that language. **Fail:** the agent acknowledges in text but the panel stays empty.

**`/shared-state/in-app-agent-write`** — `agent.setState`, both doc variants. **Try:** press **Toggle Language**, then say `tell me a joke`; then press **Toggle & re-run** and watch without typing. **Pass:** the first path changes the agent's language on its next turn; the second produces a reply immediately. **Fail:** the panel flips but the agent keeps replying in the old language.

### Pydantic AI

**`/multi-agent-flows`** — Router mode versus agent lock mode. **Try:** `What's the weather in Tokyo?` in router mode, then the same question locked to `weather_agent`. **Pass:** router mode lands on `default` (no tools) and answers in prose; locked to `weather_agent` the same question triggers a real `get_weather` call, visible in the inspector. **Fail:** both modes behave identically.

### Backend

**`/copilot-runtime`** — The live runtime config, routing across all four ids. **Try:** `Hello`, then `What's the weather in Tokyo?` on each id. **Pass:** every id streams; only `weather_agent` calls a tool. **Fail:** an agent-not-found error — a key is missing from the runtime, or its mount is missing from `backend/main.py`.

**`/ag-ui`** — Live capture of the raw event stream beside the chat producing it, on `weather_agent` so one prompt exercises the full range. **Try:** `What's the weather in Tokyo?` **Pass:** `RUN_STARTED`, a burst of `TEXT_MESSAGE_CONTENT`, `TOOL_CALL_START`/`END`, `TOOL_CALL_RESULT` carrying *The weather in Tokyo is sunny.*, then `RUN_FINISHED`. **Fail:** the log stays empty while the chat streams.

---

## 8. Testing checklist / current status

| Doc page | Route | Status | Notes |
|---|---|---|---|
| [Quickstart](https://docs.copilotkit.ai/pydantic-ai/quickstart?agent=bring-your-own) | `/quickstart` | ✅ Working | Bring-your-own-agent path. Model id and multi-agent mounting differ — §9. |
| [Prebuilt Components](https://docs.copilotkit.ai/pydantic-ai/prebuilt-components) | `/prebuilt-components` | ✅ Working | All three components, doc `labels`. |
| [Threads Drawer](https://docs.copilotkit.ai/pydantic-ai/prebuilt-components/copilot-threads-drawer) | `/prebuilt-components/copilot-threads-drawer` | ✅ Working | Drop-in drawer sharing one chat configuration. Renders locked without a license token — §9.16. |
| [Headless Threads](https://docs.copilotkit.ai/pydantic-ai/headless-threads) | `/headless-threads` | ✅ Working | `useThreads` + hand-built list, including rename. Mutations need Intelligence mode. |
| [Thread & History Lifecycle](https://docs.copilotkit.ai/pydantic-ai/threads-lifecycle) | `/threads-lifecycle` | ✅ Working | `setActiveThreadId` / `startNewThread`, with the explicit-vs-not distinction live. |
| [Slots](https://docs.copilotkit.ai/pydantic-ai/custom-look-and-feel/slots) | `/custom-look-and-feel/slots` | ✅ Working | Runs correctly; **does not typecheck** by design — §9. Not in the doc sidebar. |
| [Headless UI](https://docs.copilotkit.ai/pydantic-ai/custom-look-and-feel/headless-ui) | `/custom-look-and-feel/headless-ui` | ✅ Working | All four doc snippets assembled. Not in the doc sidebar. |
| [Programmatic Control](https://docs.copilotkit.ai/pydantic-ai/programmatic-control) | `/programmatic-control` | ✅ Working | Dashboard + state write + subscriber. Tool-call rendering shown, not implemented. |
| [Inspector](https://docs.copilotkit.ai/pydantic-ai/inspector) | `/inspector` | ✅ Working | Enabled via `showDevConsole`, not the doc's `enableInspector` — §9. |
| [Display-only](https://docs.copilotkit.ai/pydantic-ai/generative-ui/your-components/display-only) | `/generative-ui/your-components/display-only` | ✅ Working | `useComponent`. Not in the doc sidebar. |
| [Interactive](https://docs.copilotkit.ai/pydantic-ai/generative-ui/your-components/interactive) | `/generative-ui/your-components/interactive` | ✅ Working | `useHumanInTheLoop`. Generic supplied explicitly — §9. Not in the doc sidebar. |
| [Tool Rendering](https://docs.copilotkit.ai/pydantic-ai/generative-ui/tool-rendering) | `/generative-ui/tool-rendering` | ✅ Working | Named + wildcard renderers over a real `tool_plain`. |
| [State Rendering](https://docs.copilotkit.ai/pydantic-ai/generative-ui/state-rendering) | `/generative-ui/state-rendering` | ⚠️ Partial | The doc's `agent.py` block contains React, not Python. Frontend complete; no agent writes `searches` — §9. |
| [Frontend Tools](https://docs.copilotkit.ai/pydantic-ai/frontend-tools) | `/frontend-tools` | ✅ Working | `sayHello`, browser-executed. |
| [Reading agent state](https://docs.copilotkit.ai/pydantic-ai/shared-state/in-app-agent-read) | `/shared-state/in-app-agent-read` | ✅ Working | `initialState` and `render` props do not exist — §9. |
| [Writing agent state](https://docs.copilotkit.ai/pydantic-ai/shared-state/in-app-agent-write) | `/shared-state/in-app-agent-write` | ✅ Working | Both basic and advanced variants. |
| [Multi-Agent Flows](https://docs.copilotkit.ai/pydantic-ai/multi-agent-flows) | `/multi-agent-flows` | ✅ Working | Doc page ships no code blocks; both modes implemented — §9. |
| [Copilot Runtime](https://docs.copilotkit.ai/pydantic-ai/copilot-runtime) | `/copilot-runtime` | ✅ Working | Live config + routing. A2UI/MCP Apps shown, not exercised. |
| [AG-UI](https://docs.copilotkit.ai/pydantic-ai/ag-ui) | `/ag-ui` | ✅ Working | Live event capture. Callback shapes are not uniform — §9. |
| — | `/status` | ✅ Working | In-app mirror of this table. |

**Pages in the doc sidebar that this repo does not cover:** CopilotKit CLI, Build with agents, all Rich Threads pages, MCP Apps, A2UI, all Intelligence Platform (premium) pages, and all Troubleshooting pages. They are outside the requested scope, not broken.

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
[Reading agent state](https://docs.copilotkit.ai/pydantic-ai/shared-state/in-app-agent-read) shows both — `useAgent({ agentId, initialState })` to seed a value, and `useAgent({ render })` to draw state into the chat. Neither exists on `useAgent` in 1.66.2. State starts undefined until the agent first writes it (the Python side already defaults `language` to `"english"` via `StateDeps(AgentState())`), and the render variant is shown in-app rather than implemented. The same missing `render` prop is what the State Rendering page's first block relies on.

**7. `useRenderTool` requires `parameters`, and its render prop is not `args`.**
The Tool Rendering doc's named renderer omits `parameters` and reads `args.location`. In 1.66.2 the named overload requires a schema, and the render prop carrying the arguments is called `parameters`.

**8. `useHumanInTheLoop` does not infer its argument type.**
The Interactive doc reads `args.command`. The hook defaults its arg type to `Record<string, unknown>` rather than reading `parameters`, so `args.command` is `unknown` and will not compile in JSX. The type parameter is supplied explicitly.

**9. `useComponent` takes a dependency array.**
The Display-only doc calls it with a single argument, which re-registers the component on every render. 1.66.2 accepts a second dependency-array argument; this repo passes `[]`.

**10. `enableInspector` is not the prop this app uses.**
The [Inspector page](https://docs.copilotkit.ai/pydantic-ai/inspector) documents `enableInspector`, which belongs to `<CopilotKit>` and defaults to on for localhost. This app wraps with `<CopilotKitProvider>`, whose equivalent is `showDevConsole` — and that **defaults to off**. Copying the doc verbatim onto the provider silently does nothing.

**11. AG-UI subscriber callbacks are not uniformly shaped.**
The [AG-UI page](https://docs.copilotkit.ai/pydantic-ai/ag-ui) destructures `textMessageBuffer`, `toolCallName`, and `agent` directly, implying every callback flattens its payload. `onToolCallStartEvent`, `onRunErrorEvent`, and `onToolCallResultEvent` hand back only a raw `event` object. Destructuring the wrong shape is a type error.

**12. `randomUUID` is imported from `@copilotkit/shared`.**
Headless UI and Programmatic Control both do this. That package is a transitive dependency, not a direct one, so importing from it reaches past the public surface. This repo calls the browser's `crypto.randomUUID()` — which is what the Shared State page's own advanced snippet uses.

**13. Multi-Agent Flows ships no code blocks.**
Unlike its neighbours, [the page](https://docs.copilotkit.ai/pydantic-ai/multi-agent-flows) describes router mode and agent lock mode in prose with the configuration inline. Both modes are implemented; the configuration is written out in-app.

**14. Doc sidebar oddities as of the sync date.**
The `Shared State` group renders as a heading with no items, though both pages resolve. `custom-look-and-feel/slots`, `custom-look-and-feel/headless-ui`, and both `generative-ui/your-components/*` pages resolve fine but are absent from the sidebar — they are flagged **Not in doc sidebar** in-app.

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
It is force-disabled in production builds. Confirm you are on `npm run dev`, and note this app needs `showDevConsole`, not `enableInspector` — §9 item 10.

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

`/doc-sync` keeps this repo honest about the docs it mirrors. Press **Sync docs now** (on the landing page or on `/doc-sync`) and it fetches the markdown source behind all 17 tracked doc pages, diffs each against the copy stored in `doc-snapshot/`, replaces that copy, and reports what moved — ranked by whether the change can actually break an implementation.

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
│       ├── language_agent.py     Shared State agent — StateDeps + per-request build_deps()
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
    │   ├── api/copilotkit/[[...slug]]/route.ts
    │   │                         Copilot Runtime (v2) — HttpAgent per agent,
    │   │                         CopilotKitIntelligence, identifyUser, 4 verbs
    │   └── <doc-route>/
    │       ├── page.tsx          notes, pass/fail, source panels
    │       └── demo-chat/page.tsx    the running feature, chrome-free
    ├── src/components/
    │   ├── providers.tsx         CopilotKitProvider — router mode, identity headers, inspector on
    │   ├── nav-sidebar.tsx       nav, generated from nav-config
    │   ├── route-header.tsx      title, status badge, doc link
    │   ├── demo-frame.tsx        chrome for /demo-chat routes
    │   ├── source-code.tsx       renders repo files verbatim
    │   ├── backend-health.tsx    server-side probe of :8000 and of /api/copilotkit/info
    │   └── ui.tsx                Panel, Callout, TryIt, CodeBlock
    └── src/lib/
        ├── nav-config.ts         single source of truth: routes, docs, statuses
        ├── source.ts             reads repo files, slices # region markers
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

**App Control**
- [Frontend Tools](https://docs.copilotkit.ai/pydantic-ai/frontend-tools)

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
