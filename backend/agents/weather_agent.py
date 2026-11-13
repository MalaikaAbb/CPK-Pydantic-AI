"""The Tool Rendering agent.

A single backend tool, so the frontend has a real tool call to draw. Backs
/generative-ui/tool-rendering and /ag-ui.

Source: https://docs.copilotkit.ai/pydantic-ai/generative-ui/tool-rendering
"""

from .model import MODEL

from pydantic_ai import Agent

#region agent
# The doc's `agent.py`. Its model id was `openai:gpt-5.4-mini`, which does not
# resolve on a normal OpenAI account, and is `openai:gpt-6-luna` since
# 2026-11-11 (not checked). MODEL is the Quickstart's id instead; set
# OPENAI_MODEL=openai:gpt-6-luna to run the page's literal.
agent = Agent(MODEL)


@agent.tool_plain
async def get_weather(location: str = "Everywhere ever") -> str:
    """Get the weather for a given location. Ensure location is fully spelled out."""
    return f"The weather in {location} is sunny."
#endregion
