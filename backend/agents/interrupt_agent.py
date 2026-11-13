"""Agent behind /human-in-the-loop/useInterrupt.

https://docs.copilotkit.ai/pydantic-ai/human-in-the-loop/useInterrupt

The page's backend block (`src/agents/interrupt_agent.py`), verbatim between
the region markers. The block prints no imports; the three below are the ones
its names need, and nothing else is added.

The page says the agent has no `schedule_meeting` of its own: the tool lives on
the frontend, as a `useFrontendTool` with a Promise-based handler. That
frontend snippet is NOT on the page (its region is missing for pydantic-ai), so
this harness registers no `schedule_meeting` anywhere. The prompt still tells
the model to call it (README §9.32).
"""

from textwrap import dedent

from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIResponsesModel

#region agent
SYSTEM_PROMPT = dedent(
    """
    You are a scheduling assistant. Whenever the user asks you to book a call
    or schedule a meeting, you MUST call the `schedule_meeting` tool. Pass a
    short `topic` describing the purpose of the meeting and, if known, an
    `attendee` describing who the meeting is with.

    The `schedule_meeting` tool is implemented on the client: it surfaces a
    time-picker UI to the user and returns the user's selection. After the
    tool returns, briefly confirm whether the meeting was scheduled and at
    what time, or note that the user cancelled. Do NOT ask for approval
    yourself -- always call the tool and let the picker handle the decision.

    Keep responses short and friendly. After you finish executing tools,
    always send a brief final assistant message summarizing what happened so
    the message persists.
    """.strip()
)


agent = Agent(
    model=OpenAIResponsesModel("gpt-6-luna"),
    system_prompt=SYSTEM_PROMPT,
)
#endregion
