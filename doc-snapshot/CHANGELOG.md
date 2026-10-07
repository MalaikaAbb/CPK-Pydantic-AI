# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

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

## 2026-08-31

### 14:25 UTC — 4 pages, highest severity low

**Low — Quickstart**

`/pydantic-ai/quickstart` · route `/quickstart` · under “Quickstart”

7 prose lines changed.

````diff
- <OpsPlatformCTA
- variant="card"
- title="Ship Pydantic AI to production"
- body="Add persistent threads and the inspector with CopilotKit Intelligence."
- ctaLabel="Create a free account"
+ <IntelligenceOnboardingPrompt
+ feature="learning"
````

**Info — Headless Threads**

`/pydantic-ai/headless-threads` · route `/headless-threads`

Now tracked for the first time.

**Info — Threads Drawer**

`/pydantic-ai/prebuilt-components/copilot-threads-drawer` · route `/prebuilt-components/copilot-threads-drawer`

Now tracked for the first time.

**Info — Thread & History Lifecycle**

`/pydantic-ai/threads-lifecycle` · route `/threads-lifecycle`

Now tracked for the first time.

---

---
