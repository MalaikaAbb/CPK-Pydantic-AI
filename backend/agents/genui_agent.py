"""Agent behind every /generative-ui/components/* route.

https://docs.copilotkit.ai/pydantic-ai/generative-ui/components

The Components and surfaces pages publish no Pydantic AI agent. Their runtime
is a TanStack `BuiltInAgent` factory (shown on the overview route, not run),
and the pages only ask that the agent hand the run's tools and context to its
model. So, per the harness rule for other-framework agents, this is a plain
Pydantic AI agent with the page's own system prompt (the TanStack factory's
first system prompt) and none of its own tools. Mounted at `/genui/` by
`main.py`; the route shape was ported from the agno harness.

What pydantic-ai-slim 1.107's `AGUIAdapter` does with the two things the page
asks for:

- tools: the run's `tools` become a frontend toolset, so `render_ui` reaches
  the model and its call streams back to the browser;
- context: dropped. The adapter builds the run from messages, tools and state
  only, so the catalog guide CopilotKit sends as AG-UI `context` never reaches
  the model. Not worked around here (README §9.29).

The page's model is `openaiText("gpt-6-luna")`; like the harness's other
repo-wired agents this one uses MODEL (see model.py).
"""

from .model import MODEL

from pydantic_ai import Agent

#region agent
agent = Agent(
    MODEL,
    # The page's own prompt (its TanStack factory's first system prompt).
    instructions=(
        "You are a helpful assistant. When a visual answer helps, render it "
        "with generative UI."
    ),
)
#endregion
