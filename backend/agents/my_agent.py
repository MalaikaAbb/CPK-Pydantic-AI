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
# for why that is a variable here.
agent = Agent(MODEL, instructions='Be fun!')
app = agent.to_ag_ui()
#endregion
