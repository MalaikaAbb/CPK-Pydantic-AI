"""PLACEHOLDER — the State Rendering doc page has no usable Python.

https://docs.copilotkit.ai/pydantic-ai/generative-ui/state-rendering ships two
code blocks. The second is the React page. The first is labelled `agent.py` but
contains the *same* TypeScript/React content — a `type AgentState = {...}` and a
`function YourMainContent()` calling `useAgent`. There is no Python on the page
at all, so there is nothing to transcribe: no state model, no tool that writes
`searches`, no instruction text telling the agent when to write it.

Writing that agent here would mean inventing the schema and the tool, which is
exactly what this harness does not do. So this module defines no agent, is not
exported from `agents/__init__.py`, and is not mounted by `main.py`.

Consequence, and why /generative-ui/state-rendering is marked **Partial**: the
frontend half is implemented exactly as documented and does render `state.searches`
reactively — but pointed at `my_agent`, which never writes that key, so the list
stays empty. The mechanism is wired; the doc does not supply the other end of it.

To finish this page: replace this file with the agent the doc should have shown
(a `StateDeps`-backed state model holding `searches`, plus a tool that appends to
it — see `language_agent.py` for the `StateDeps` wiring), add it to `AGENTS`, and
repoint the demo route's `agentId`.
"""
