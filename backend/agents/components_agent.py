"""The Components and surfaces agent.

Source: https://docs.copilotkit.ai/pydantic-ai/generative-ui/components
("Add the runtime and an agent")

The page prints a TanStack `BuiltInAgent` on `openaiText("gpt-6-luna")`. This
harness runs Pydantic AI agents only, so it is a Pydantic AI `Agent`
(framework-own-agents swap, labelled): the snippet's system prompt verbatim,
no tools (the snippet defines none), and the repo's `MODEL`.

`render_ui` arrives per run as a frontend tool with its full JSON schema
(`AGUIAdapter` declares it with `parameters_json_schema=tool.parameters`). The
run's context entries — the `render_ui` guide, and markdown mode's schema and
fence guide — are never read by the adapter (pydantic-ai-slim 1.107.7, and
2.68.0 is the same), so they never reach the model. The page shows no
Pydantic AI code for that, so nothing is added (README Known issues).
"""

from .model import MODEL

from pydantic_ai import Agent

# The page's prompt, verbatim.
agent = Agent(
    MODEL,
    instructions="You are a helpful assistant. When a visual answer helps, render it with generative UI.",
)
