"""The Shared State agent.

`StateDeps` is what makes state shared: AG-UI carries the state object in on
every run, Pydantic AI exposes it as `ctx.deps.state`, and the instructions read
it — so a value the app writes changes how the agent answers.

Both Shared State doc pages ship this same file. It backs
/shared-state/in-app-agent-read and /shared-state/in-app-agent-write.

Sources:
  https://docs.copilotkit.ai/pydantic-ai/shared-state/in-app-agent-read
  https://docs.copilotkit.ai/pydantic-ai/shared-state/in-app-agent-write
"""

from textwrap import dedent

from .model import MODEL

from pydantic import BaseModel
from pydantic_ai import Agent, RunContext
from pydantic_ai.ag_ui import StateDeps

#region agent
# The doc's `agent.py`, with `openai:gpt-5.4-mini` swapped for MODEL.


class AgentState(BaseModel):
    """State for the agent."""

    language: str = "english"


agent = Agent(MODEL, deps_type=StateDeps[AgentState])


@agent.instructions()
async def language_instructions(ctx: RunContext[StateDeps[AgentState]]) -> str:
    """Instructions for the language tracking agent.

    Args:
        ctx: The run context containing language state information.

    Returns:
        Instructions string for the language tracking agent.
    """
    return dedent(
        f"""
        You are a helpful assistant for tracking the language.

        IMPORTANT:
        - ALWAYS use the lower case for the language
        - ALWAYS response in the current language: {ctx.deps.state.language}
        """
    )


app = agent.to_ag_ui(deps=StateDeps(AgentState()))
#endregion
