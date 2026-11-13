"""Agent behind /generative-ui/mcp-apps.

https://docs.copilotkit.ai/pydantic-ai/generative-ui/mcp-apps

The page's runtime builds a CopilotKit `BuiltInAgent({ model:
"openai/gpt-6-luna", prompt: "You are a helpful assistant." })`. This harness
runs its own framework's agents, so that agent is swapped for a Pydantic AI one
with the same prompt and, like the snippet, no tools of its own. The MCP
server's tools reach it through the runtime's `mcpApps` middleware, which adds
them to each run's `tools`; `AGUIAdapter` forwards those to the model.

The model is MODEL (see model.py), not the snippet's `gpt-6-luna`.
"""

from .model import MODEL

from pydantic_ai import Agent

#region agent
agent = Agent(MODEL, instructions="You are a helpful assistant.")
#endregion
