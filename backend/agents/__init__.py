"""The Pydantic AI agents this harness serves.

One module per agent, and each module holds exactly the agent its doc page
defines — no shared base class, no invented instructions. That mirrors how the
docs present them: every page that needs an agent shows a complete `agent.py`.

`search_agent` is deliberately absent from `AGENTS`. See the module docstring in
`search_agent.py`.
"""

from .language_agent import app as language_agent_app
from .my_agent import app as my_agent_app
from .weather_agent import app as weather_agent_app

# Keyed by the agent id the frontend addresses. These keys become both the mount
# path here and the `agents: { … }` keys in the Next.js runtime route, so the two
# sides cannot drift.
AGENTS = {
    "my_agent": my_agent_app,
    "weather_agent": weather_agent_app,
    "language_agent": language_agent_app,
}

__all__ = ["AGENTS"]
