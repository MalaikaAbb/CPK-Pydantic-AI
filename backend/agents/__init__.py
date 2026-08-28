"""The Pydantic AI agents this harness serves.

One module per agent, and each module holds exactly the agent its doc page
defines — no shared base class, no invented instructions. That mirrors how the
docs present them: every page that needs an agent shows a complete `agent.py`.

── What changed with the new Quickstart ───────────────────────────────────────
Each module used to end in `app = agent.to_ag_ui()`, and `main.py` mounted those
ASGI apps. The Quickstart now builds a Starlette route per agent and calls
`AGUIAdapter.dispatch_request(request, agent=agent)`, so the modules export the
*agent* and `main.py` owns the routing. Two things came out of that:

  - `to_ag_ui()` is deprecated in pydantic-ai-slim 1.107 and removed in 2.0.
    Nothing here emits a deprecation warning any more.
  - Deps are per-request rather than per-process. `build_deps` below is why.

`search_agent` is deliberately absent. See the module docstring in
`search_agent.py`.
"""

from collections.abc import Callable
from typing import Any

from pydantic_ai.agent import AbstractAgent

from . import language_agent, my_agent, weather_agent


class AgentEntry:
    """One agent, plus how to build its per-request deps.

    `deps_factory` exists because only the Shared State agent takes deps. The
    rest pass `None`, which is what `dispatch_request` defaults to.
    """

    def __init__(
        self,
        agent: AbstractAgent,
        deps_factory: Callable[[], Any] | None = None,
    ) -> None:
        self.agent = agent
        self.deps_factory = deps_factory

    def deps(self) -> Any:
        return self.deps_factory() if self.deps_factory else None


# Keyed by the agent id the frontend addresses. These keys become both the route
# path here and the `agents: { … }` keys in the Next.js runtime route, so the two
# sides cannot drift.
AGENTS: dict[str, AgentEntry] = {
    "my_agent": AgentEntry(my_agent.agent),
    "weather_agent": AgentEntry(weather_agent.agent),
    "language_agent": AgentEntry(
        language_agent.agent, language_agent.build_deps
    ),
}

__all__ = ["AGENTS", "AgentEntry"]
