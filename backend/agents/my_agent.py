"""The Quickstart agent.

Backs every route that only needs a conversation: Quickstart, Prebuilt
Components, Slots, Headless UI, Programmatic Control, Inspector, both Your
Components pages, Frontend Tools, Copilot Runtime, and AG-UI.

Source: https://docs.copilotkit.ai/pydantic-ai/quickstart?agent=bring-your-own
"""

from .model import MODEL

from pydantic_ai import Agent

#region agent
# The Quickstart's `main.py`, unchanged apart from the model id — see model.py
# for why that is a variable here. The page prints 'openai:gpt-6-luna' (was
# 'openai:gpt-4.1-mini', MODEL's default) since 2026-11-11.
#
# Note there is no `to_ag_ui()` any more: the Quickstart now hands the agent to
# `AGUIAdapter.dispatch_request` inside a Starlette route. `main.py` does that
# for every agent in this package.
agent = Agent(MODEL, instructions='Be fun!')
#endregion
