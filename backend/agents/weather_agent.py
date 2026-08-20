"""The Tool Rendering agent.

A single backend tool, so the frontend has a real tool call to draw. Backs
/generative-ui/tool-rendering.

Source: https://docs.copilotkit.ai/pydantic-ai/generative-ui/tool-rendering
"""

from .model import MODEL

from pydantic_ai import Agent

#region agent
# The doc's `agent.py`. Its model id is `openai:gpt-5.4-mini`, which does not
# resolve on a normal OpenAI account — MODEL is the Quickstart's id instead.
agent = Agent(MODEL)


@agent.tool_plain
async def get_weather(location: str = "Everywhere ever") -> str:
    """Get the weather for a given location. Ensure location is fully spelled out."""
    return f"The weather in {location} is sunny."


app = agent.to_ag_ui()
#endregion
