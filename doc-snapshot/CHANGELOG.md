# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-11-11

### 14:11 UTC — 17 pages, highest severity high

**High — Slots**

`/pydantic-ai/custom-look-and-feel/slots` · route `/custom-look-and-feel/slots` · under “Reshaping the Message List”

52 code lines, 2 headings, 13 prose lines changed. The number of fenced code blocks changed.

````diff
- If you pass the message view a `children` render function to lay out the rendered messages yourself, virtualization turns off and every message is mounted. Prefer `transformMessages` for list-level changes; in development the chat warns when `children` is what turned virtualization off.
+ ### Grouping messages into one row
+ To render several messages together — a run of tool calls collapsed into one block, say — pass `groupMessages`. It receives the list (after `transformMessages`, if you use both) and returns rows: `messageRow(message)` for a message on its own, `messageGroup({ key, messages, wrapper })` for messages rendered together inside your `wrapper`.
+ 
+ ```tsx title="page.tsx"
+ import { useCallback } from "react";
+ import {
+ CopilotChat,
````

**High — A2UI · Dynamic Schema**

`/pydantic-ai/generative-ui/a2ui/dynamic-schema` · route `/generative-ui/a2ui/dynamic-schema` · under “The A2UI agent tool” · in a `python` block

2 code lines changed.

````diff
- "model": ChatOpenAI(model="gpt-4o"),
+ "model": ChatOpenAI(model="gpt-6-luna", reasoning_effort="none"),
````

**High — A2UI · Fixed Schema**

`/pydantic-ai/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema` · under “Return render operations from the tool” · in a `python` block

2 code lines changed.

````diff
- model=OpenAIResponsesModel("gpt-5-mini"),
+ model=OpenAIResponsesModel("gpt-6-luna"),
````

**High — Hashbrown**

`/pydantic-ai/generative-ui/hashbrown` · route `/generative-ui/hashbrown` · under “Hashbrown”

36 code lines, 2 headings, 11 prose lines changed. The number of fenced code blocks changed.

````diff
- > Bring your own component library. Have the agent stream structured output and let Hashbrown's progressive JSON parser render it as React components in real time.
+ > Stream a structured sales dashboard through Hashbrown's UI kit and progressive JSON parser.
- 
- You have a chat surface and you want the agent to draw a dashboard, not just describe one in prose. By the end of this guide, the agent will stream a structured output object, [`@hashbrownai/react`](https://www.npmjs.com/package/@hashbrownai/react)'s progressive JSON parser will hand each finished slice to your renderer as it arrives, and the user sees the dashboard fill in live.
- 
- ## When to use this
- 
- - **Streaming dashboards** where partial state should render before the full payload arrives.
````

**High — JSON Render**

`/pydantic-ai/generative-ui/json-render` · route `/generative-ui/json-render` · under “JSON Render”

53 code lines, 2 headings, 11 prose lines changed. The number of fenced code blocks changed.

````diff
- > Bring your own component library. Have the agent emit a JSON spec and let json-render render it against a Zod-validated catalog of React components.
+ > Bring your own component library. Have the agent emit a JSON spec and render allowed component types through a typed React registry.
- 
- You have a chat surface and you want the agent to draw a dashboard from a typed JSON spec. By the end of this guide, the agent will emit a `{ root, elements }` object, [`@json-render/react`](https://www.npmjs.com/package/@json-render/react) will validate it against a Zod-described catalog, and the user sees the dashboard render as a single React tree.
+ ```typescript
+ // src/app/demos/declarative-json-render/chat.tsx
+ "use client";
- ## When to use this
````

**High — Tool Rendering**

`/pydantic-ai/generative-ui/tool-rendering` · route `/generative-ui/tool-rendering` · under “Give your agent a tool to call” · in a `python` block

2 code lines changed.

````diff
- agent = Agent("openai:gpt-5.4-mini")
+ agent = Agent("openai:gpt-6-luna")
````

**High — Pydantic AI Agents**

`/pydantic-ai/human-in-the-loop/agent` · route `/human-in-the-loop/agent` · under “Setup the Pydantic AI Agent” · in a `python` block

2 code lines changed.

````diff
- agent = Agent('openai:gpt-5.4-mini')
+ agent = Agent('openai:gpt-6-luna')
````

**High — Sub-Agents**

`/pydantic-ai/multi-agent/subagents` · route `/multi-agent/subagents` · under “Setting up sub-agents” · in a `python` block

6 code lines changed.

````diff
- _SUB_MODEL = OpenAIResponsesModel("gpt-5-mini")
+ _SUB_MODEL = OpenAIResponsesModel("gpt-6-luna")
- _SUB_MODEL = OpenAIResponsesModel("gpt-5-mini")
+ _SUB_MODEL = OpenAIResponsesModel("gpt-6-luna")
- model=OpenAIResponsesModel("gpt-5-mini"),
+ model=OpenAIResponsesModel("gpt-6-luna"),
````

**High — Threads Drawer**

`/pydantic-ai/prebuilt-components/copilot-threads-drawer` · route `/prebuilt-components/copilot-threads-drawer` · under “Add your own "New conversation" button”

41 code lines, 1 heading, 19 prose lines changed. The number of fenced code blocks changed.

````diff
+ ## Add your own "New conversation" button
+ 
+ The Drawer has its own "New Conversation" row. Your app can also keep its own
+ button, for example in a toolbar or a page header. To start a new conversation
+ from that button, call `startNewThread()` from
+ [`useCopilotChatConfiguration`](/reference/hooks/useCopilotChatConfiguration).
+ This is the same function the Drawer calls for its own row.
+ 
````

**High — Quickstart**

`/pydantic-ai/quickstart` · route `/quickstart` · under “Configure your environment”

13 code lines, 7 prose lines changed.

````diff
- The starter template is configured to use OpenAI's GPT-4o by default, but you can modify it to use any language model supported by Pydantic AI.
+ The starter template is configured to use OpenAI's GPT-6 Luna by default, but you can modify it to use any language model supported by Pydantic AI.
- This example uses OpenAI's GPT-4.1-mini, but you can modify it to use any language model supported by Pydantic AI.
+ This example uses OpenAI's GPT-6 Luna, but you can modify it to use any language model supported by Pydantic AI.
- agent = Agent('openai:gpt-4.1-mini', instructions='Be fun!')
+ agent = Agent('openai:gpt-6-luna', instructions='Be fun!')
- npm install @copilotkit/react-ui @copilotkit/react-core @copilotkit/runtime @ag-ui/client@1.0.1
+ npm install @copilotkit/react-ui @copilotkit/react-core @copilotkit/runtime @ag-ui/client@1.0.2
````

**High — Reading agent state**

`/pydantic-ai/shared-state/in-app-agent-read` · route `/shared-state/in-app-agent-read` · under “Define the Agent State” · in a `python` block

2 code lines changed.

````diff
- agent = Agent("openai:gpt-5.4-mini", deps_type=StateDeps[AgentState])
+ agent = Agent("openai:gpt-6-luna", deps_type=StateDeps[AgentState])
````

**High — Writing agent state**

`/pydantic-ai/shared-state/in-app-agent-write` · route `/shared-state/in-app-agent-write` · under “Define the Agent State” · in a `python` block

2 code lines changed.

````diff
- agent = Agent("openai:gpt-5.4-mini", deps_type=StateDeps[AgentState])
+ agent = Agent("openai:gpt-6-luna", deps_type=StateDeps[AgentState])
````

**Medium — Thread & History Lifecycle**

`/pydantic-ai/threads-lifecycle` · route `/threads-lifecycle` · under “Future runs can remain durable in both places”

1 heading, 7 prose lines changed.

````diff
- After historical import, future conversations that run through CopilotKit are
- written to CopilotKit Intelligence as threads. If your LangGraph agent
+ Once Intelligence is connected, conversations that run through that runtime are
+ recorded automatically in Intelligence. Historical import is optional. If your LangGraph agent
+ 
+ ## Example: keep an existing LangGraph conversation
+ 
+ Follow [Bring your own thread system](/pydantic-ai/intelligence/bring-your-own-thread-system#example-keep-an-existing-langgraph-conversation) for an example that keeps native persistence and continues the same conversation.
````

**Low — Copilot Runtime**

`/pydantic-ai/copilot-runtime` · route `/copilot-runtime` · under “CopilotKit Intelligence”

4 prose lines changed.

````diff
- Features like [threads](/pydantic-ai/threads) and the [inspector](/pydantic-ai/inspector) are provided through the runtime and CopilotKit Intelligence. These give you conversation persistence and debugging capabilities out of the box.
+ Features like [threads](/pydantic-ai/AG-UI-Streams) and the [inspector](/pydantic-ai/inspector) are provided through the runtime and CopilotKit Intelligence. These give you conversation persistence and debugging capabilities out of the box.
- 2. **Many ecosystem features won't work.** The AG-UI protocol supports a middleware layer designed to run on the backend. Many features in the CopilotKit ecosystem depend on this server-side middleware. Without the runtime, these features — including [threads](/pydantic-ai/threads) and other capabilities — will not be available.
+ 2. **Many ecosystem features won't work.** The AG-UI protocol supports a middleware layer designed to run on the backend. Many features in the CopilotKit ecosystem depend on this server-side middleware. Without the runtime, these features — including [threads](/pydantic-ai/AG-UI-Streams) and other capabilities — will not be available.
````

**Low — Open Generative UI**

`/pydantic-ai/generative-ui/open-generative-ui` · route `/generative-ui/open-generative-ui` · under “Minimal setup”

24 prose lines changed.

````diff
- auto-registered by `CopilotKit`, so no extra wiring is needed.
+ auto-registered by `CopilotKit`, so no extra frontend wiring is needed. Your
+ agent must still give the run's frontend tools to its model (see the warning
+ below).
+ 
+ <Callout type="warn" title="Your agent must pass frontend tools to its model">
+ `generateSandboxedUi` reaches the agent as a frontend tool in the run input.
+ The agent calls it only if it gives the run's frontend tools to its model.
````

**Low — Inspector**

`/pydantic-ai/inspector` · route `/inspector` · under “Follow and reproduce a run”

2 prose lines changed.

````diff
- [Thread](/pydantic-ai/threads) and choose **Try from here**. Inspector copies its
+ [Thread](/pydantic-ai/AG-UI-Streams) and choose **Try from here**. Inspector copies its
````

**Low — Programmatic Control**

`/pydantic-ai/programmatic-control` · route `/programmatic-control` · under “`copilotkit.runAgent()` vs `agent.runAgent()`”

2 prose lines changed.

````diff
- - **`agent.runAgent()`** — Low-level method on the agent instance. Sends the request to the runtime but does **not** execute frontend tools or handle follow-ups. Use this only when you need direct control over the agent execution (e.g., resuming from an interrupt with `forwardedProps`).
+ - **`agent.runAgent()`** — Low-level method on the agent instance. Sends the request to the runtime but does **not** execute frontend tools or handle follow-ups. Use this only when you need direct control over the agent execution. To resume from an interrupt, use `copilotkit.runAgent({ agent, resume })` for standard AG-UI interrupts, or `copilotkit.runAgent({ agent, forwardedProps: { command: { resume, interruptEvent } } })` for legacy `on_interrupt` custom events, so that the subscriber lifecycle still wraps the resumed run.
````

---

## 2026-10-07

### 12:38 UTC — 8 pages, highest severity none

**Info — A2UI · Dynamic Schema**

`/pydantic-ai/generative-ui/a2ui/dynamic-schema` · route `/generative-ui/a2ui/dynamic-schema`

Now tracked for the first time.

**Info — A2UI · Fixed Schema**

`/pydantic-ai/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema`

Now tracked for the first time.

**Info — Hashbrown**

`/pydantic-ai/generative-ui/hashbrown` · route `/generative-ui/hashbrown`

Now tracked for the first time.

**Info — JSON Render**

`/pydantic-ai/generative-ui/json-render` · route `/generative-ui/json-render`

Now tracked for the first time.

**Info — Open Generative UI**

`/pydantic-ai/generative-ui/open-generative-ui` · route `/generative-ui/open-generative-ui`

Now tracked for the first time.

**Info — Pydantic AI Agents**

`/pydantic-ai/human-in-the-loop/agent` · route `/human-in-the-loop/agent`

Now tracked for the first time.

**Info — Governed Action Approval UI**

`/pydantic-ai/human-in-the-loop/governed-actions` · route `/human-in-the-loop/governed-actions`

Now tracked for the first time.

**Info — Sub-Agents**

`/pydantic-ai/multi-agent/subagents` · route `/multi-agent/subagents`

Now tracked for the first time.

---

---

## 2026-10-06

### 13:45 UTC — 13 pages, highest severity high

**High — Introduction**

`/pydantic-ai` · routes `/`, `/doc-sync` · under “Overview”

2 headings, 43 prose lines changed. The number of fenced code blocks changed.

````diff
- # Overview
+ # Introduction
- frameworkIcon={<PydanticAIIcon className="h-10 w-10" />}
+ frameworkIcon={<PydanticAIIcon className="h-12 w-12" />}
- subheader="Give your Pydantic AI agents real user-interactivity using CopilotKit and AG-UI. Build rich, interactive, agent-powered applications."
- bannerVideo="https://cdn.copilotkit.ai/docs/copilotkit/videos/coagents/overview.mp4"
+ subheader="Pydantic AI runs your agents. CopilotKit gives them a surface your users can see, interrupt and steer."
- featuresLink="https://feature-viewer.copilotkit.ai/pydantic-ai/feature/agentic_chat"
````

**High — Copilot Runtime**

`/pydantic-ai/copilot-runtime` · route `/copilot-runtime` · under “Copilot Runtime”

15 code lines, 2 headings, 62 prose lines changed. The number of fenced code blocks changed.

````diff
+ 
+ ## Runtime languages
+ 
+ **TypeScript is the default and most fully featured runtime. It is the only runtime that can run without CopilotKit Intelligence.** Use it for an open-source setup, or connect it to Intelligence when you need its services.
+ 
+ Python, Go, Ruby, and C#/.NET runtimes require an Intelligence project and server-side API key. They work with both [cloud-hosted](/pydantic-ai/intelligence/managed-intelligence-platform) and [self-hosted](/pydantic-ai/intelligence/self-hosting) Intelligence; they do not provide an in-memory or SQLite runner.
+ 
+ | Language | Host | Without Intelligence |
````

**High — Slots**

`/pydantic-ai/custom-look-and-feel/slots` · route `/custom-look-and-feel/slots` · under “Reshaping the Message List”

14 code lines, 1 heading, 15 prose lines changed. The number of fenced code blocks changed.

````diff
+ ## Reshaping the Message List
+ 
+ Slots change how each message renders. To change _which_ messages render — hide some, replace them, reorder them — pass `transformMessages` to the message view. It receives the whole list and returns the list to render.
+ 
+ ```tsx title="page.tsx"
+ import { useCallback } from "react";
+ import { CopilotChat, type Message } from "@copilotkit/react-core/v2";
+ 
````

**High — Headless Threads**

`/pydantic-ai/headless-threads` · route `/headless-threads` · under “Headless Threads”

9 code lines, 1 heading, 61 prose lines changed. The number of fenced code blocks changed.

````diff
+ Intelligence’s AG-UI streams power the history and delivery behind this custom UI. Use `useThreads` to list and manage conversations, and pass their `threadId` to your chat.
+ 
- CopilotKit Rich Threads enable persistent, resumable multi-turn conversations. The `useThreads` hook lists, creates, renames, archives, and deletes CopilotKit Intelligence threads with realtime synchronization via WebSocket. Threads work with any agent framework — CopilotKit Intelligence stores conversation history server-side, so users can close their browser and pick up where they left off. It does not list or mutate native LangGraph, ADK, or other framework stores unless your backend explicitly bridges those systems. Thread metadata updates (renames, archives, new threads) appear on connected clients without polling.
+ The `useThreads` hook lists, creates, renames, archives, and deletes CopilotKit Intelligence threads with realtime synchronization via WebSocket. Threads work with any agent framework — CopilotKit Intelligence stores conversation history server-side, so users can close their browser and pick up where they left off. It does not list or mutate native LangGraph, ADK, or other framework stores unless your backend explicitly bridges those systems. Thread metadata updates (renames, archives, new threads) appear on connected clients without polling.
- [scope Rich Threads to the signed-in user](/pydantic-ai/threads-lifecycle#scope-rich-threads-to-the-signed-in-user)
+ [scope AG-UI Streams to the signed-in user](/pydantic-ai/threads-lifecycle#scope-rich-threads-to-the-signed-in-user)
- <Callout type="info" title="Migrating existing history?">
- Threads capture new CopilotKit conversations once your app is connected to
````

**High — Inspector**

`/pydantic-ai/inspector` · route `/inspector` · under “Inspector”

4 code lines, 5 headings, 90 prose lines changed. The number of fenced code blocks changed.

````diff
- > Inspector for debugging actions, readables, agent status, messages, and context.
- 
+ > Verify your setup, debug agent runs, reproduce issues, and review Threads and Learning.
- ## What it shows
+ The CopilotKit Inspector overlays your development application so you can
+ verify the connection, investigate a run, and work with Threads and Learning
+ without leaving the page.
- The CopilotKit Inspector is a built-in debugging tool that overlays on your app.
````

**High — Threads Drawer**

`/pydantic-ai/prebuilt-components/copilot-threads-drawer` · route `/prebuilt-components/copilot-threads-drawer` · under “When should I use this?”

27 code lines, 3 headings, 54 prose lines changed. The number of fenced code blocks changed.

````diff
- server-side). <SignupLink surface="docs_drawer">Get a free developer account</SignupLink> to set that up.
+ server-side). <SignupLink surface="docs_drawer">Start cloud-hosted setup</SignupLink> to create or select a project.
- [scope Rich Threads to the signed-in user](/pydantic-ai/threads-lifecycle#scope-rich-threads-to-the-signed-in-user).
+ [scope AG-UI Streams to the signed-in user](/pydantic-ai/threads-lifecycle#scope-rich-threads-to-the-signed-in-user).
- body="Get persistent threads and realtime sync on the free Developer tier."
+ body="Connect a cloud-hosted project to get persistent threads and realtime sync."
+ <Callout type="warn">
+ **The Drawer ships only in `@copilotkit/react-core/v2`.** There is no v1
````

**High — Quickstart**

`/pydantic-ai/quickstart` · route `/quickstart` · under “Quickstart”

32 code lines, 3 headings, 24 prose lines changed. The number of fenced code blocks changed.

````diff
- <IntelligenceOnboardingPrompt
- feature="learning"
- surface="docs_pydantic_ai_quickstart"
- />
+ ## Start with your coding agent
+ Use this prompt to connect your Pydantic AI agent to CopilotKit and verify a working conversation. Your coding agent will follow this guide in your project, or you can work through the manual steps below.
+ 
+ Ask your coding agent to follow the setup steps on this page for your selected framework and frontend.
````

**High — Reading agent state**

`/pydantic-ai/shared-state/in-app-agent-read` · route `/shared-state/in-app-agent-read` · under “Use the `useAgent` Hook”

26 code lines, 2 headings, 9 prose lines changed.

````diff
- With your agent connected and running all that is left is to call the `useAgent` hook, pass the agent's name, and
- optionally provide an initial state.
+ With your agent connected and running, call the `useAgent` hook, wait for the real agent, and
+ initialize any missing UI-owned state with `agent.setState`.
+ import { useEffect } from "react";
- // [!code highlight:4]
- const { agent } = useAgent({
+ const { agent, isReady } = useAgent({
````

**High — Writing agent state**

`/pydantic-ai/shared-state/in-app-agent-write` · route `/shared-state/in-app-agent-write` · under “Call `agent.setState` from the `useAgent` hook” · in a `tsx` block

12 code lines changed.

````diff
+ import { useEffect } from "react";
- const { agent } = useAgent({ // [!code highlight]
+ const { agent, isReady } = useAgent({
- initialState: { language: "english" }  // optionally provide an initial state
+ const state = (agent.state ?? {}) as Partial<AgentState>;
+ useEffect(() => {
+ if (!isReady || state.language !== undefined) return;
+ agent.setState({ ...(agent.state ?? {}), language: "english" });
````

**High — Thread & History Lifecycle**

`/pydantic-ai/threads-lifecycle` · route `/threads-lifecycle` · under “The lifecycle at a glance”

2 code lines, 2 headings, 14 prose lines changed.

````diff
- 2. **Run.** Messages and tool calls stream under that `threadId`. If a server-side store is configured (CopilotKit Intelligence, or a persisting `AgentRunner`), they are persisted as they happen so the thread can be replayed later. A runtime with no persistence layer keeps nothing server-side. See [Threads & Persistence Architecture](/pydantic-ai/premium/threads-explained) for the full server-side model.
+ 2. **Run.** Messages and tool calls stream under that `threadId`. If a server-side store is configured (CopilotKit Intelligence, or a persisting `AgentRunner`), they are persisted as they happen so the thread can be replayed later. A runtime with no persistence layer keeps nothing server-side. See [AG-UI Streams & Framework Threads](/pydantic-ai/intelligence/threads-explained) for the full server-side model.
- Replay requires a **server-side store to replay from**: CopilotKit Intelligence, or a persisting `AgentRunner` (e.g. the SQLite runner). A self-hosted runtime with no persistence layer has nothing to replay, so `connectAgent()` returns an empty stream and the conversation starts blank. If history isn't restoring, check that a store is configured, not the client code. The [Persistence Architecture](/pydantic-ai/premium/threads-explained) page covers how replay works server-side.
+ Replay requires a **server-side store to replay from**: CopilotKit Intelligence, or a persisting `AgentRunner` (e.g. the SQLite runner). A self-hosted runtime with no persistence layer has nothing to replay, so `connectAgent()` returns an empty stream and the conversation starts blank. If history isn't restoring, check that a store is configured, not the client code. The [Persistence Architecture](/pydantic-ai/intelligence/threads-explained) page covers how replay works server-side.
- ## Scope Rich Threads to the signed-in user
+ <span id="scope-rich-threads-to-the-signed-in-user" />
+ ## Scope AG-UI Streams to the signed-in user
+ 
````

**Medium — Headless UI**

`/pydantic-ai/custom-look-and-feel/headless-ui` · route `/custom-look-and-feel/headless-ui` · under “Fully Headless UI”

2 headings changed.

````diff
- # Fully Headless UI
+ # Headless UI
````

**Low — AG-UI**

`/pydantic-ai/ag-ui` · route `/ag-ui` · under “How agents slot into the runtime”

3 prose lines changed.

````diff
+ To write the custom implementation yourself, and keep its own fields through
+ the clone in step 2, see [Write your own AG-UI agent](/pydantic-ai/backend/custom-ag-ui-agent).
+ 
````

**Low — Programmatic Control**

`/pydantic-ai/programmatic-control` · route `/programmatic-control` · under “Overview”

2 prose lines changed.

````diff
- title="Fully Headless UI"
+ title="Headless UI"
````

---

---
