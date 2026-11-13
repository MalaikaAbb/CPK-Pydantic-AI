# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-11-13

### 11:11 UTC — 18 pages, highest severity high

**High — A2UI · Dynamic Schema**

`/pydantic-ai/generative-ui/a2ui/dynamic-schema` · route `/generative-ui/a2ui/dynamic-schema` · under “Implement the React renderers” · in a `typescript` block

4 code lines changed.

````diff
- ? "text-emerald-600"
+ ? "text-emerald-600 dark:text-emerald-400"
- ? "text-rose-600"
+ ? "text-rose-600 dark:text-rose-400"
````

**High — A2UI · Fixed Schema**

`/pydantic-ai/generative-ui/a2ui/fixed-schema` · route `/generative-ui/a2ui/fixed-schema` · under “Implement the React renderers” · in a `typescript` block

16 code lines changed.

````diff
- <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
+ <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-muted-foreground">
- <h3 className="text-base font-semibold leading-none tracking-tight text-neutral-900">
+ <h3 className="text-base font-semibold leading-none tracking-tight text-neutral-900 dark:text-foreground">
- <span className="font-mono text-2xl font-semibold tracking-wider text-neutral-900">
+ <span className="font-mono text-2xl font-semibold tracking-wider text-neutral-900 dark:text-foreground">
- <Separator className="flex-1 bg-neutral-200" />
+ <Separator className="flex-1 bg-neutral-200 dark:bg-border" />
````

**High — Sub-Agents**

`/pydantic-ai/multi-agent/subagents` · route `/multi-agent/subagents` · under “Rendering a live delegation log” · in a `typescript` block

30 code lines changed.

````diff
- className="w-full h-full flex flex-col bg-white rounded-2xl shadow-sm border border-[#DBDBE5] overflow-hidden"
+ className="w-full h-full flex flex-col bg-white rounded-2xl shadow-sm border border-[#DBDBE5] overflow-hidden dark:bg-card dark:border-border"
- <div className="flex items-center justify-between px-6 py-3 border-b border-[#E9E9EF] bg-[#FAFAFC]">
+ <div className="flex items-center justify-between px-6 py-3 border-b border-[#E9E9EF] bg-[#FAFAFC] dark:border-border dark:bg-muted">
- <span className="text-lg font-semibold text-[#010507]">
+ <span className="text-lg font-semibold text-[#010507] dark:text-foreground">
- className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#BEC2FF] bg-[#BEC2FF1A] text-[#010507] text-[10px] font-semibold uppercase tracking-[0.12em]"
+ className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#BEC2FF] bg-[#BEC2FF1A] text-[#010507] text-[10px] font-semibold uppercase tracking-[0.12em] dark:text-foreground"
````

**Info — Declarative · A2UI**

`/pydantic-ai/generative-ui/a2ui` · route `/generative-ui/a2ui`

Now tracked for the first time.

**Info — Components and surfaces**

`/pydantic-ai/generative-ui/components` · route `/generative-ui/components`

Now tracked for the first time.

**Info — Components · Catalogs**

`/pydantic-ai/generative-ui/components/catalogs` · route `/generative-ui/components/catalogs`

Now tracked for the first time.

**Info — Components · Markdown mode**

`/pydantic-ai/generative-ui/components/markdown-mode` · route `/generative-ui/components/markdown-mode`

Now tracked for the first time.

**Info — Components · Standard catalog**

`/pydantic-ai/generative-ui/components/standard-catalog` · route `/generative-ui/components/standard-catalog`

Now tracked for the first time.

**Info — Components · State and actions**

`/pydantic-ai/generative-ui/components/state-and-actions` · route `/generative-ui/components/state-and-actions`

Now tracked for the first time.

**Info — Components · Surfaces**

`/pydantic-ai/generative-ui/components/surfaces` · route `/generative-ui/components/surfaces`

Now tracked for the first time.

**Info — Components · Theming**

`/pydantic-ai/generative-ui/components/theming` · route `/generative-ui/components/theming`

Now tracked for the first time.

**Info — Components · Transports**

`/pydantic-ai/generative-ui/components/transports` · route `/generative-ui/components/transports`

Now tracked for the first time.

**Info — Open-ended · MCP Apps**

`/pydantic-ai/generative-ui/mcp-apps` · route `/generative-ui/mcp-apps`

Now tracked for the first time.

**Info — Controlled · Components as Tools**

`/pydantic-ai/generative-ui/tool-based` · route `/generative-ui/tool-based`

Now tracked for the first time.

**Info — Headless Interrupts**

`/pydantic-ai/human-in-the-loop/headless` · route `/human-in-the-loop/headless`

Now tracked for the first time.

**Info — HITL Overview**

`/pydantic-ai/human-in-the-loop/index` · route `/human-in-the-loop`

Now tracked for the first time.

**Info — Pausing the Agent for Input**

`/pydantic-ai/human-in-the-loop/useInterrupt` · route `/human-in-the-loop/useInterrupt`

Now tracked for the first time.

**Info — WebMCP**

`/pydantic-ai/webmcp` · route `/webmcp`

Now tracked for the first time.

---

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
