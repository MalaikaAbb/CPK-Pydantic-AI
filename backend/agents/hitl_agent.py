"""The Human-in-the-Loop agent.

https://docs.copilotkit.ai/pydantic-ai/human-in-the-loop/agent

The page's `agent/sample_agent/agent.py`. Its `run_agent` / Starlette `app`
lines are what `main.py` already does for every agent, so only the agent and
its tool are here.

Two things about it are worth knowing before you test:

  - The page prints `openai:gpt-5.4-mini`, which OpenAI does not serve. MODEL
    (see model.py) is used instead, as on every other route that prints it.
  - The frontend registers a tool that is also named `write_essay`. That makes
    two tools with one name in the same run, one in the browser and one here.
    It is reproduced as published; see the route for what happens.
"""

from .model import MODEL

from pydantic_ai import Agent

#region agent
# Verbatim, apart from the model id: the page has Agent('openai:gpt-5.4-mini').
agent = Agent(MODEL)

@agent.tool_plain
async def write_essay(topic: str) -> str:
    """Write an essay on the given topic."""
    # This would typically generate an essay
    # The agent will wait for user feedback before proceeding
    return f"Essay draft on '{topic}' has been generated. Please review."
#endregion
